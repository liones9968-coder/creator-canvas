import { NextResponse } from "next/server";
import { generateTextWithFallback } from "@/lib/geminiText";
import type { StoryState } from "@/store/useStoryStore";

const ENSEMBLE_SYSTEM_PROMPT = `너는 Creator Canvas의 성좌 설계 편집자다.

사용자가 Season 1에서 만든 세계관·주인공 설정과 Season 2에서 선택한 인물·세력·관계 블록을 바탕으로
성좌 개요서를 작성하라.

목표:
- 단순 캐릭터 프로필이 아니라, 인물 간 욕망과 충돌이 살아 있는 관계망을 만든다.
- 각 인물과 세력은 Season 1의 세계 결함, 주인공의 상처, 핵심 개념, 규칙, 결말 방향과 연결되어야 한다.
- 과격한 자극보다 관계의 긴장과 선택의 의미를 중심으로 작성한다.

규칙:
- 사용자의 선택을 임의로 뒤집지 마라.
- 부족한 연결은 자연스럽게 보완하되, 새로운 대형 설정을 남발하지 마라.
- 문체는 차분하고 몰입감 있는 기획서 톤으로 작성하라.
- 결과물은 최소 1500자 이상으로 작성하라.
- 금지 표현: 파멸적인, 광기, 핏빛, 허무, 공백, 절대자, 군림, 집어삼킨다, 우주 멸망.

반드시 아래 섹션 제목을 ## 마크다운 형식으로 포함하고, 각 섹션을 충실히 채워라:

## 성좌 개요
## 주요 인물 목록
## 주인공과 핵심 조연의 관계
## 중심 적대자와 그의 명분
## 주요 세력 1: 명분과 비밀
## 주요 세력 2: 대립 관점과 목표
## 관계망 요약
## 독자가 애정을 갖게 될 인물
## 배신 또는 희생 후보
## Season 3로 이어질 관계의 균열

인사말·메타 설명 없이 성좌 개요서 본문만 출력하라.`;

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
      { error: "성좌 개요서를 만들 카드 데이터가 없습니다." },
      { status: 400 },
    );
  }

  const payloadForModel = {
    universe: storyState.universe,
    season1Choices: storyState.choices.filter((c) => (c.season ?? 1) === 1),
    season2Choices: storyState.choices.filter((c) => c.season === 2),
    season1Blocks: storyState.blocks
      .filter((b) => (b.season ?? 1) === 1)
      .map((b) => ({
        cardType: b.cardType,
        title: b.title,
        summary: b.summary,
        rawAnswer: b.rawAnswer,
      })),
    season2Blocks: storyState.blocks
      .filter((b) => b.season === 2)
      .map((b) => ({
        cardType: b.cardType,
        title: b.title,
        summary: b.summary,
        rawAnswer: b.rawAnswer,
      })),
  };

  const userPrompt = `아래 JSON은 Season 1·2에서 누적된 서사 데이터다. 이를 하나의 성좌 개요서로 엮어라.\n\n${JSON.stringify(payloadForModel, null, 2)}`;

  try {
    const { text, modelUsed } = await generateTextWithFallback({
      systemInstruction: ENSEMBLE_SYSTEM_PROMPT,
      userPrompt,
      maxOutputTokens: 8192,
      logTag: "generate-ensemble",
    });

    return NextResponse.json({
      ensemble: text,
      isFallback: false,
      modelUsed,
      charCount: text.length,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[generate-ensemble]", err);
    }
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Ensemble generation failed",
      },
      { status: 500 },
    );
  }
}
