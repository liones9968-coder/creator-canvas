import { NextResponse } from "next/server";
import { generateTextWithFallback } from "@/lib/geminiText";
import { buildFallbackSynopsis } from "@/lib/synopsisFallback";
import type { StoryState } from "@/store/useStoryStore";

const SYNOPSIS_SYSTEM_PROMPT = `너는 SEME 세계 해독 엔진이다. 창조자의 선택으로 만들어진 이 세계에 태초부터 새겨져 있던 기록을 발굴하고 해독하여 창세록으로 정리한다. 작가가 쓰는 것이 아니라, 세계 자체에 이미 존재했던 최초의 기록을 읽어내는 것이다.

사용자가 Season 1에서 선택한 서사 카드들(choices, blocks)을 바탕으로,
작품 소개서에 가까운 긴 호흡의 시놉시스를 작성하라.

규칙:
- 사용자의 선택을 최대한 존중하라.
- blocks의 cardType, title, summary, rawAnswer에 담긴 핵심 설정을 임의로 뒤집지 마라.
- 연결이 약한 부분은 자연스럽게 보완하되, 갑작스러운 대형 설정을 과하게 추가하지 마라.
- 문체는 차분하고 몰입감 있는 작품 소개서·출판 기획서 톤으로 작성하라.
- 결과물은 최소 1500자 이상, 가능하면 2000~3000자로 작성하라.
- 과도한 표현은 피하라: 파멸적인, 광기, 핏빛, 허무, 공백, 절대자, 군림, 집어삼킨다, 우주 멸망 등.

반드시 아래 섹션 제목을 ## 마크다운 형식으로 포함하고, 각 섹션을 충실히 채워라:

## 제목 후보 3개
## 로그라인
## 작품 개요
## 세계관
## 주인공
## 핵심 인물과 관계
## 주요 갈등
## 1막 / 2막 / 3막 흐름
## 엔딩의 여운

인사말·메타 설명 없이 시놉시스 본문만 출력하라.`;

type RequestBody = {
  storyState: StoryState;
};

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { storyState } = body;
  if (!storyState?.blocks?.length) {
    return NextResponse.json(
      { error: "창세록을 해독할 카드 데이터가 없습니다." },
      { status: 400 },
    );
  }

  const payloadForModel = {
    universe: storyState.universe,
    choices: storyState.choices,
    blocks: storyState.blocks.map((b) => ({
      step: b.step,
      cardType: b.cardType,
      title: b.title,
      summary: b.summary,
      rawAnswer: b.rawAnswer,
      rawQuestion: b.rawQuestion,
    })),
  };

  const userPrompt = `아래 JSON은 Season 1에서 누적된 서사 데이터다. 이를 하나의 긴 호흡 시놉시스로 엮어라.\n\n${JSON.stringify(payloadForModel, null, 2)}`;

  try {
    const { text, modelUsed } = await generateTextWithFallback({
      systemInstruction: SYNOPSIS_SYSTEM_PROMPT,
      userPrompt,
      maxOutputTokens: 8192,
      logTag: "generate-synopsis",
    });

    return NextResponse.json({
      synopsis: text,
      isFallback: false,
      modelUsed,
      charCount: text.length,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[generate-synopsis]", err);
    }
    const fallback = buildFallbackSynopsis(storyState);
    return NextResponse.json({
      synopsis: fallback,
      isFallback: true,
      error:
        err instanceof Error ? err.message : "Synopsis generation failed",
      charCount: fallback.length,
    });
  }
}
