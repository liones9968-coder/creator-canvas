import type { StoryState } from "@/store/useStoryStore";

function section(title: string, body: string): string {
  return `## ${title}\n\n${body.trim()}\n`;
}

function blocksByType(state: StoryState, cardType: string) {
  return state.blocks.filter((b) => b.cardType === cardType);
}

function pickAnswer(state: StoryState, cardType: string): string {
  const b = blocksByType(state, cardType)[0];
  return b?.rawAnswer ?? b?.summary ?? "(미선택)";
}

export function buildFallbackSynopsis(state: StoryState): string {
  const genre = state.universe?.genre ?? "미정";
  const universeTitle = state.universe?.title ?? "미정의 우주";
  const format = pickAnswer(state, "format");
  const opening = pickAnswer(state, "opening_tone");
  const worldFlaw = pickAnswer(state, "world_flaw");
  const mask = pickAnswer(state, "protagonist_mask");
  const wound = pickAnswer(state, "protagonist_wound");
  const hidden = pickAnswer(state, "hidden_truth");
  const concept = pickAnswer(state, "core_concept");
  const oath = pickAnswer(state, "oath_or_constraint");
  const companion = pickAnswer(state, "companion_anchor");
  const encounter = pickAnswer(state, "first_encounter");
  const haven = pickAnswer(state, "safe_haven");
  const foil = pickAnswer(state, "ideological_foil");
  const rule = pickAnswer(state, "rule");
  const rupture = pickAnswer(state, "rupture");
  const finalChoice = pickAnswer(state, "final_choice");
  const aftertaste = pickAnswer(state, "ending_aftertaste");

  const titleCandidates = `1. 《${universeTitle}에서 피어난 ${concept.slice(0, 12)}》\n2. 《${mask.slice(0, 10)}과 ${hidden.slice(0, 10)}》\n3. 《${genre} 서사: ${rupture.slice(0, 14)}》`;

  const logline = `${mask}로 살아가던 주인공은 ${encounter}를 계기로 ${worldFlaw}에 맞서게 되고, 스스로 세운 ${rule} 앞에서 ${finalChoice}를 마주한다.`;

  const overview = `이 작품은 ${genre} 장르의 ${format}로, ${opening}의 공기로 시작한다. 핵심은 「${concept}」이며, 주인공은 ${wound}를 안은 채 ${oath}에 묶여 있다. 독자는 선택의 누적으로 쌓인 설정이 하나의 호흡으로 이어지는 구조를 따라간다.`;

  const world = `무대는 「${universeTitle}」이다. 이 세계는 겉으로는 ${opening}하지만, ${worldFlaw}라는 결함이 서사를 움직인다. ${rule}은 이곳에서 피할 수 없는 약속이며, ${rupture}의 순간에 그 균형이 흔들린다.`;

  const protagonist = `주인공은 밖으로는 ${mask}의 얼굴을 쓰지만, 내면에는 ${wound}가 남아 있다. ${oath}는 그가 스스로를 지키는 방식이기도 하고, 독자가 따라갈 도덕적 긴장의 축이기도 하다. ${hidden}은 이야기 후반의 방향을 바꾸는 씨앗으로 남는다.`;

  const relations = `${companion}은 주인공의 균형을 흔드는 존재다. ${foil}은 가치관의 대립을 통해 질문을 던지며, ${haven}은 잠시 숨을 고를 정서적 거점이 된다. 이 삼각의 긴장이 2막 이후의 선택을 무겁게 만든다.`;

  const conflict = `겉으로 드러나는 갈등은 ${worldFlaw}와 ${rupture} 사이에서 벌어진다. 이면에는 ${hidden}과 ${wound}가 맞물리며, 주인공은 ${finalChoice}에서 자신의 서사를 완성하거나 무너뜨릴 수 있다.`;

  const act1 = `1막에서는 ${opening}의 톤으로 세계와 주인공의 ${mask}가 소개된다. ${encounter}가 사건의 방아쇠가 되며, 독자는 ${format}에 맞는 리듬으로 「${concept}」의 윤곽을 익힌다.`;

  const act2 = `2막에서는 ${companion}과 ${foil}의 충돌이 심화되고, ${haven}이 잠시 안식을 제공한다. ${rule}이 시험대에 오르고, ${rupture}가 이야기의 중심을 이동시킨다.`;

  const act3 = `3막에서는 ${hidden}의 여파가 드러나며 ${finalChoice}가 클라이맥스가 된다. 선택의 결과는 ${aftertaste}의 여운으로 남는다.`;

  const ending = `${aftertaste} — 이 작품이 끝난 뒤에도 독자에게 남을 감정의 잔향이다. 화려한 선언보다, 주인공이 남긴 선택의 무게가 기억되도록 서사를 닫는다.`;

  const appendix = state.blocks
    .filter((b) => b.cardType !== "universe")
    .map(
      (b) =>
        `- **${b.title}**: ${b.rawAnswer || b.summary} _(단계: ${b.cardType})_`,
    )
    .join("\n");

  return [
    section("제목 후보 3개", titleCandidates),
    section("로그라인", logline),
    section("작품 개요", overview),
    section("세계관", world),
    section("주인공", protagonist),
    section("핵심 인물과 관계", relations),
    section("주요 갈등", conflict),
    section("1막 / 2막 / 3막 흐름", `${act1}\n\n${act2}\n\n${act3}`),
    section("엔딩의 여운", ending),
    section("창작 카드에서 이어받은 설정", appendix),
    "\n---\n*API 연결 없이 로컬에서 엮은 Season 1 요약 시놉시스입니다. 네트워크 복구 후 「다시 만들기」로 AI 버전을 받을 수 있습니다.*\n",
  ].join("\n");
}
