import {
  GoogleGenerativeAI,
  SchemaType,
  type EnhancedGenerateContentResponse,
  type GenerationConfig,
} from "@google/generative-ai";
import { NextResponse } from "next/server";
import { resolveModelChain, usesThinkingConfig } from "@/lib/geminiModels";
import type { GenerateQuestionRequest } from "@/types/question";

const SYSTEM_PROMPT = `너는 인터랙티브 서사 설계를 돕는 차분한 스토리 컨설턴트다.
유저가 고른 장르와 지금까지 쌓인 선택(blocks·choices)을 읽고, 다음 단계 지시사항(stage_instruction)에 맞는 질문 1개와 선택지 5개를 만든다.

목표: 유저가 "내 이야기"를 스스로 발견하도록 돕는다. 질문은 구체적이되, 평온하고 명료한 톤을 유지한다.

금지(남발하지 말 것): 자극적, 매운맛, 도파민 폭발, 파멸적인, 광기, 핏빛, 만물, 허무, 공백, 절대자, 군림, 집어삼킨다, 우주 멸망, 세계 종망, 심연이 깨어난다 같은 과장 표현.

선택지 5개는 반드시 서로 다른 서사 방향이어야 한다. 예시 축(각각 1개씩 활용):
- 희생형: 무언가를 내주거나 감수하는 방향
- 관계형: 인물·유대·신뢰·거리 조절
- 진실 추구형: 알고 싶어 하거나 밝혀내려는 방향
- 권력/통제형: 규칙·질서·영향력을 쥐려는 방향
- 회피/유예형: 미루거나 다른 길을 택하는 방향

반드시 아래 JSON 형식만 출력하라. 마크다운, 설명, 코드블록 없이 순수 JSON만:
{"question":"질문 문자열","choices":["선택지1","선택지2","선택지3","선택지4","선택지5"]}

추가 규칙:
- question은 한국어 1~2문장, 부드럽지만 분명한 초대형 문장
- choices는 각각 한국어 짧은 문장(15~40자 권장), 장르 톤 반영
- stage_instruction.cardType과 instruction의 의도를 반드시 따른다

반드시 마크다운 백틱(\`\`\`)이나 'json'이라는 문자를 포함하지 말고, 오직 순수한 JSON 객체 { ... } 자체만 출력해라. 앞뒤로 인사말이나 설명을 절대 붙이지 마라.`;

const RESPONSE_SCHEMA: GenerationConfig["responseSchema"] = {
  type: SchemaType.OBJECT,
  properties: {
    question: { type: SchemaType.STRING },
    choices: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
  },
  required: ["question", "choices"],
};

const RETRYABLE = /503|429|unavailable|high demand|quota|rate limit|resource exhausted/i;

function getApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY?.trim();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return RETRYABLE.test(message);
}

function toUserFacingError(err: unknown, triedModels: string[]): string {
  if (isRetryableError(err)) {
    return `무료 API 한도 또는 서버 혼잡으로 질문을 생성하지 못했습니다. 30초~1분 후 「다시 시도」를 눌러 주세요. (시도: ${triedModels.join(" → ")})`;
  }
  if (err instanceof Error) return err.message;
  return "질문 생성에 실패했습니다.";
}

function collectResponseText(response: EnhancedGenerateContentResponse): string {
  try {
    const direct = response.text()?.trim();
    if (direct) return direct;
  } catch {
    // parts 폴백
  }

  const chunks: string[] = [];
  for (const candidate of response.candidates ?? []) {
    for (const part of candidate.content?.parts ?? []) {
      if (typeof part.text === "string" && part.text.trim()) {
        chunks.push(part.text.trim());
      }
    }
  }
  return chunks.join("\n").trim();
}

function sliceBalancedObject(text: string): string | null {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) return text.slice(0, i + 1);
    }
  }
  return null;
}

function sanitizeRawText(rawText: string): string {
  return rawText
    .replace(/^\uFEFF/, "")
    .replace(/```(?:json)?\s*/gi, "")
    .replace(/```/g, "")
    .trim();
}

function extractJsonPayload(rawText: string): string {
  const cleaned = sanitizeRawText(rawText);
  if (!cleaned) {
    throw new Error("JSON block not found in model response");
  }
  if (cleaned.startsWith("{")) {
    const balanced = sliceBalancedObject(cleaned);
    if (balanced) return balanced;
  }
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const balanced = sliceBalancedObject(jsonMatch[0]);
    if (balanced) return balanced;
    return jsonMatch[0];
  }
  const start = cleaned.indexOf("{");
  if (start >= 0) {
    const balanced = sliceBalancedObject(cleaned.slice(start));
    if (balanced) return balanced;
  }
  throw new Error("JSON block not found in model response");
}

function parseQuestionPayload(rawText: string): {
  question: string;
  choices: string[];
} {
  const jsonText = extractJsonPayload(rawText);
  let parsed: { question?: string; choices?: unknown };
  try {
    parsed = JSON.parse(jsonText) as { question?: string; choices?: unknown };
  } catch {
    throw new Error("Failed to parse JSON from model response");
  }
  if (!parsed.question || typeof parsed.question !== "string") {
    throw new Error("Invalid question field");
  }
  if (!Array.isArray(parsed.choices) || parsed.choices.length < 5) {
    throw new Error("choices must be an array of at least 5 strings");
  }
  return {
    question: parsed.question.trim(),
    choices: parsed.choices.slice(0, 5).map((c) => String(c).trim()),
  };
}

function buildGenerationConfig(modelId: string): GenerationConfig {
  const base: GenerationConfig = {
    temperature: 0.85,
    maxOutputTokens: 2048,
    responseMimeType: "application/json",
    responseSchema: RESPONSE_SCHEMA,
  };
  if (usesThinkingConfig(modelId)) {
    return {
      ...base,
      maxOutputTokens: 4096,
      ...({ thinkingConfig: { thinkingLevel: "MINIMAL" } } as Record<
        string,
        unknown
      >),
    } as GenerationConfig;
  }
  return base;
}

async function callGeminiOnce(
  apiKey: string,
  modelId: string,
  userPrompt: string,
): Promise<EnhancedGenerateContentResponse> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelId,
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `다음 컨텍스트를 분석하고 JSON 객체만 출력하라. 마크다운·설명 금지.\n\n${userPrompt}`,
          },
        ],
      },
    ],
    generationConfig: buildGenerationConfig(modelId),
  });

  return result.response;
}

async function generateWithFreeTierFallback(
  userPrompt: string,
): Promise<{ parsed: { question: string; choices: string[] }; modelUsed: string }> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("GEMINI API key가 설정되지 않았습니다.");
  }

  const models = resolveModelChain();
  const tried: string[] = [];
  let lastError: unknown;

  for (const modelId of models) {
    tried.push(modelId);

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) await sleep(1500 * attempt);

        const response = await callGeminiOnce(apiKey, modelId, userPrompt);
        let rawText = collectResponseText(response);

        if (!rawText || !rawText.includes("{")) {
          await sleep(800);
          const retryResponse = await callGeminiOnce(apiKey, modelId, userPrompt);
          rawText = collectResponseText(retryResponse);
        }

        if (!rawText) {
          const finish = response.candidates?.[0]?.finishReason;
          throw new Error(
            `빈 응답 (model=${modelId}, finish=${finish ?? "unknown"})`,
          );
        }

        const parsed = parseQuestionPayload(rawText);
        if (process.env.NODE_ENV === "development") {
          console.info("[generate-question] success", modelId);
        }
        return { parsed, modelUsed: modelId };
      } catch (err) {
        lastError = err;
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[generate-question] model=${modelId} attempt=${attempt + 1}`,
            err instanceof Error ? err.message : String(err),
          );
        }
        if (isRetryableError(err) && attempt < 1) continue;
        break;
      }
    }
  }

  throw new Error(toUserFacingError(lastError, tried));
}

export async function POST(request: Request) {
  let body: GenerateQuestionRequest;
  try {
    body = (await request.json()) as GenerateQuestionRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { storyState, stage_instruction, step } = body;
  if (!stage_instruction?.instruction) {
    return NextResponse.json(
      { error: "stage_instruction is required" },
      { status: 400 },
    );
  }

  const userPrompt = JSON.stringify(
    { step, stage: stage_instruction, storyState },
    null,
    2,
  );

  try {
    const { parsed } = await generateWithFreeTierFallback(userPrompt);
    return NextResponse.json(parsed);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Question generation failed";
    if (process.env.NODE_ENV === "development") {
      console.error("[generate-question]", message);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
