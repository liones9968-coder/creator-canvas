export type StageInstruction = {
  key: string;
  label: string;
  cardType: string;
  instruction: string;
};

/** Step 1 = 우주 선택(하드코딩). Step 2~17 = Season 1 AI 16단계. Step 18+ = 브릿지 */
export const UNIVERSE_STEP = 1;
export const SEASON_STEP_START = 2;
export const SEASON_STEP_END = 17;
export const BRIDGE_STEP = 18;

export const SEASON_1_STAGES: StageInstruction[] = [
  {
    key: "format",
    label: "포맷 선택",
    cardType: "format",
    instruction:
      "이 이야기가 어떤 형식(연재 소설, 단편, 비주얼 노벨, 게임 시나리오 등)으로 읽히면 좋을지 묻는다. 장르 톤에 맞는 현실적인 포맷을 제안하라.",
  },
  {
    key: "opening_tone",
    label: "도입부 톤",
    cardType: "opening_tone",
    instruction:
      "첫 장면의 공기(고요함, 긴장, 설렘, 유머 등)를 정하는 질문이다. 과장된 재내보다 분위기와 리듬을 드러내라.",
  },
  {
    key: "world_flaw",
    label: "세계의 결함",
    cardType: "world_flaw",
    instruction:
      "이 세계가 완벽해 보이지만 어디선가 삐걱거리는 구조적 결함을 묻는다. 파멸 선언이 아니라 일상 속 균열을 찾게 하라.",
  },
  {
    key: "protagonist_mask",
    label: "주인공의 대외적 얼굴",
    cardType: "protagonist_mask",
    instruction:
      "주인공이 남에게 보여주는 역할·가면·직함을 묻는다. 겉모습과 실제 내면의 간극이 느껴지게 하라.",
  },
  {
    key: "protagonist_wound",
    label: "주인공의 내면 상처",
    cardType: "protagonist_wound",
    instruction:
      "주인공이 혼자 안고 있는 상처·공포·미련을 묻는다. 고어하거나 선정적으로 쓰지 말고, 공감 가능한 감정으로.",
  },
  {
    key: "hidden_truth",
    label: "나중에 밝혀질 진실",
    cardType: "hidden_truth",
    instruction:
      "이야기 중반 이후 드러날 비밀의 씨앗을 묻는다. 반전 폭탄이 아니라, 돌아보면 납득되는 진실의 방향을 제시하라.",
  },
  {
    key: "core_concept",
    label: "이야기의 핵심 개념",
    cardType: "core_concept",
    instruction:
      "한 문장으로 이 서사의 심장(예: '잃은 기억을 되찾는 대가', '서로를 구원하는 거래')을 묻는다.",
  },
  {
    key: "oath_or_constraint",
    label: "주인공이 감당하는 제약",
    cardType: "oath_or_constraint",
    instruction:
      "주인공이 스스로 지키거나 어쩔 수 없이 묶인 맹세·규칙·대가를 묻는다. 선택의 무게가 느껴지게 하라.",
  },
  {
    key: "companion_anchor",
    label: "주인공을 흔드는 동행자",
    cardType: "companion_anchor",
    instruction:
      "주인공의 균형을 바꾸는 인물(동료, 라이벌, 가족 등)의 성격과 관계를 묻는다.",
  },
  {
    key: "first_encounter",
    label: "첫 만남 또는 엮이는 사건",
    cardType: "first_encounter",
    instruction:
      "플롯이 본격적으로 움직이기 시작하는 첫 접점·사건을 묻는다. 우연과 필연 사이의 장면을 제안하라.",
  },
  {
    key: "safe_haven",
    label: "정서적 거점",
    cardType: "safe_haven",
    instruction:
      "주인공이 잠시 숨 쉬는 장소·사람·습관을 묻는다. 안식이 곧 다음 갈등의 배경이 되도록 여지를 남겨라.",
  },
  {
    key: "ideological_foil",
    label: "주인공과 충돌하는 인물",
    cardType: "ideological_foil",
    instruction:
      "가치관이 맞서는 인물과 그가 주인공에게 던지는 질문을 설정하라. 악당 낙인보다 관점의 대립을 드러내라.",
  },
  {
    key: "rule",
    label: "반드시 지켜야 할 규칙",
    cardType: "rule",
    instruction:
      "이 세계·관계·주인공에게 반드시 지켜지는 규칙 하나를 묻는다. 독자가 기억할 만한 명확한 룰로.",
  },
  {
    key: "rupture",
    label: "그 규칙이 깨지는 사건",
    cardType: "rupture",
    instruction:
      "앞서 정한 규칙이 금이 가거나 무너지는 순간을 묻는다. 카타스트rophe 선언 없이, 인물에게 의미 있는 사건으로.",
  },
  {
    key: "final_choice",
    label: "결말의 선택",
    cardType: "final_choice",
    instruction:
      "클라이맥스에서 주인공이 직면할 갈림길을 묻는다. 선택마다 서로 다른 결말의 윤곽이 보이게 하라.",
  },
  {
    key: "ending_aftertaste",
    label: "엔딩의 여운",
    cardType: "ending_aftertaste",
    instruction:
      "이야기가 끝난 뒤 독자 가슴에 남을 감정·이미지·한 줄 여운을 묻는다. 설명적 결말 요약은 피하라.",
  },
];

export function isAiQuestionStep(step: number): boolean {
  return step >= SEASON_STEP_START && step <= SEASON_STEP_END;
}

export function isBridgeStep(step: number): boolean {
  return step >= BRIDGE_STEP;
}

export function getStageForStep(step: number): StageInstruction | null {
  if (!isAiQuestionStep(step)) return null;
  const index = step - SEASON_STEP_START;
  return SEASON_1_STAGES[index] ?? null;
}
