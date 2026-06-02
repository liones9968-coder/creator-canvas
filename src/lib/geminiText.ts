import {
  GoogleGenerativeAI,
  type EnhancedGenerateContentResponse,
  type GenerationConfig,
} from "@google/generative-ai";
import { resolveModelChain, usesThinkingConfig } from "@/lib/geminiModels";

const RETRYABLE = /503|429|unavailable|high demand|quota|rate limit|resource exhausted/i;

function devLog(message: string, detail?: string) {
  if (process.env.NODE_ENV === "development") {
    console.info(message, detail ?? "");
  }
}

function devWarn(message: string, detail?: string) {
  if (process.env.NODE_ENV === "development") {
    console.warn(message, detail ?? "");
  }
}

export function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY?.trim();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRetryableGeminiError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return RETRYABLE.test(message);
}

export function toGeminiUserError(err: unknown, triedModels: string[]): string {
  if (isRetryableGeminiError(err)) {
    return `무료 API 한도 또는 서버 혼잡입니다. 잠시 후 다시 시도해 주세요. (시도: ${triedModels.join(" → ")})`;
  }
  if (err instanceof Error) return err.message;
  return "생성에 실패했습니다.";
}

export function collectResponseText(
  response: EnhancedGenerateContentResponse,
): string {
  try {
    const direct = response.text()?.trim();
    if (direct) return direct;
  } catch {
    // fall through
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

function buildTextConfig(modelId: string, maxTokens: number): GenerationConfig {
  const base: GenerationConfig = {
    temperature: 0.75,
    maxOutputTokens: maxTokens,
  };
  if (usesThinkingConfig(modelId)) {
    return {
      ...base,
      maxOutputTokens: Math.max(maxTokens, 8192),
      ...({ thinkingConfig: { thinkingLevel: "MINIMAL" } } as Record<
        string,
        unknown
      >),
    } as GenerationConfig;
  }
  return base;
}

export async function generateTextWithFallback(params: {
  systemInstruction: string;
  userPrompt: string;
  maxOutputTokens?: number;
  logTag?: string;
}): Promise<{ text: string; modelUsed: string }> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("GEMINI API key가 설정되지 않았습니다.");
  }

  const models = resolveModelChain();
  const maxOutputTokens = params.maxOutputTokens ?? 8192;
  const tried: string[] = [];
  let lastError: unknown;

  for (const modelId of models) {
    tried.push(modelId);
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) await sleep(1500 * attempt);

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: modelId,
          systemInstruction: params.systemInstruction,
        });

        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: params.userPrompt }],
            },
          ],
          generationConfig: buildTextConfig(modelId, maxOutputTokens),
        });

        let rawText = collectResponseText(result.response);
        if (!rawText || rawText.length < 200) {
          await sleep(600);
          const retry = await model.generateContent({
            contents: [
              { role: "user", parts: [{ text: params.userPrompt }] },
            ],
            generationConfig: buildTextConfig(modelId, maxOutputTokens),
          });
          rawText = collectResponseText(retry.response);
        }

        if (!rawText || rawText.length < 100) {
          throw new Error(`시놉시스 응답이 너무 짧습니다 (model=${modelId})`);
        }

        devLog(`[${params.logTag ?? "gemini"}] success`, modelId);
        return { text: rawText, modelUsed: modelId };
      } catch (err) {
        lastError = err;
        devWarn(
          `[${params.logTag ?? "gemini"}] model=${modelId} attempt=${attempt + 1}`,
          err instanceof Error ? err.message : String(err),
        );
        if (isRetryableGeminiError(err) && attempt < 1) continue;
        break;
      }
    }
  }

  throw new Error(toGeminiUserError(lastError, tried));
}
