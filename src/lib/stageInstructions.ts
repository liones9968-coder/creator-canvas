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

// ─── Season 2 상수 ───────────────────────────────────────────────
export const SEASON2_STEP_START = 19;
export const SEASON2_STEP_END = 30;
export const SEASON2_BRIDGE_STEP = 31;

// ─── Season 2 스테이지 정의 ──────────────────────────────────────
export const SEASON_2_STAGES: StageInstruction[] = [
  {
    key: "primary_ally",
    label: "첫 번째 조연",
    cardType: "primary_ally",
    instruction:
      "Season 1에서 만들어진 세계와 주인공을 바탕으로, 주인공 곁에 가장 먼저 붙는 핵심 조연을 설계하는 질문을 생성하라. 이 인물은 단순한 조력자가 아니라 주인공의 결핍을 건드리거나 보완하는 존재여야 한다. 선택지는 보호자형, 동료형, 감시자형, 제자형, 불편한 협력자형처럼 서로 다른 관계 방향을 제시하라.",
  },
  {
    key: "ally_desire",
    label: "조연의 욕망",
    cardType: "ally_desire",
    instruction:
      "이전 단계에서 정해진 핵심 조연이 주인공에게 무엇을 원하고, 왜 주인공 곁에 남는지 묻는 질문을 생성하라. 이 욕망은 주인공의 목표와 완전히 일치하지 않아야 하며, 훗날 갈등이나 선택의 씨앗이 되어야 한다. 선택지는 인정, 구원, 복수, 생존, 진실 추구처럼 서로 다른 동기를 제시하라.",
  },
  {
    key: "emotional_bond",
    label: "관계의 결속",
    cardType: "emotional_bond",
    instruction:
      "주인공과 핵심 조연 사이에 생기는 정서적 결속을 설계하는 질문을 생성하라. 이 결속은 약속, 빚, 비밀 공유, 생명의 은혜, 같은 상처처럼 이야기 후반에 흔들릴 수 있는 형태여야 한다. 선택지는 관계가 따뜻해지는 방향과 불편해지는 방향을 모두 포함하라.",
  },
  {
    key: "central_opponent",
    label: "중심 적대자",
    cardType: "central_opponent",
    instruction:
      "주인공과 가장 강하게 충돌할 중심 적대자를 설계하는 질문을 생성하라. 이 인물은 단순한 악인이 아니라, Season 1의 세계 결함과 주인공의 상처를 다른 방식으로 해석하는 인물이어야 한다. 선택지는 폭력적 적대자, 체제 수호자, 과거의 동료, 선의의 반대자, 진실을 감춘 조력자 등으로 나누어라.",
  },
  {
    key: "opponent_belief",
    label: "적대자의 명분",
    cardType: "opponent_belief",
    instruction:
      "중심 적대자가 왜 자신이 옳다고 믿는지 묻는 질문을 생성하라. 이 명분은 독자가 완전히 동의하지는 않더라도 이해할 수 있어야 한다. Season 1의 world_flaw, rule, final_choice를 참고해 세계를 구한다는 명분, 질서 유지, 희생의 정당화, 진실 은폐, 개인적 복수 같은 방향을 제시하라.",
  },
  {
    key: "first_faction",
    label: "첫 번째 세력",
    cardType: "first_faction",
    instruction:
      "이 세계를 움직이는 첫 번째 주요 세력을 설계하는 질문을 생성하라. 이 세력은 주인공의 여정에 직접 영향을 주어야 하며, 세계의 결함을 이용하거나 막으려는 집단이어야 한다. 선택지는 종교 조직, 국가 권력, 상인 연합, 연구 집단, 피난민 공동체, 비밀 결사 등 장르에 맞게 변주하라.",
  },
  {
    key: "faction_secret",
    label: "세력의 비밀",
    cardType: "faction_secret",
    instruction:
      "첫 번째 세력이 겉으로 내세우는 명분 뒤에 숨기고 있는 비밀을 설계하는 질문을 생성하라. 이 비밀은 Season 1의 hidden_truth 또는 core_concept와 연결될수록 좋다. 선택지는 과거 은폐, 금지된 실험, 배신의 역사, 구원의 대가, 조작된 기록처럼 서사를 확장하는 방향이어야 한다.",
  },
  {
    key: "counter_faction",
    label: "대립 세력",
    cardType: "counter_faction",
    instruction:
      "첫 번째 세력과 다른 방식으로 세계를 바라보는 대립 세력을 설계하는 질문을 생성하라. 이 세력은 완전한 선악 구도가 아니라, 다른 생존 방식이나 다른 정의를 대표해야 한다. 선택지는 저항군, 망명자 집단, 이단 공동체, 기술/마법 반대파, 사라진 왕조의 잔존 세력 등으로 구성하라.",
  },
  {
    key: "relationship_triangle",
    label: "관계의 삼각형",
    cardType: "relationship_triangle",
    instruction:
      "주인공, 핵심 조연, 중심 적대자 또는 두 세력 사이에 생기는 삼각 관계를 설계하는 질문을 생성하라. 이 관계는 사랑뿐 아니라 충성, 의심, 빚, 이용, 보호, 배신 가능성을 포함할 수 있다. 선택지는 누구와 누구의 관계가 흔들리는지 명확히 드러내야 한다.",
  },
  {
    key: "beloved_character",
    label: "독자가 사랑할 인물",
    cardType: "beloved_character",
    instruction:
      "독자가 애정을 갖게 될 인물을 설계하는 질문을 생성하라. 이 인물은 작은 일상, 유머, 돌봄, 약점, 반복 장면을 통해 정서적 무게를 가져야 한다. 선택지는 보호자, 어린 인물, 오래된 친구, 무뚝뚝한 장인, 기록자, 길잡이처럼 독자가 기억할 수 있는 아키타입을 제시하라.",
  },
  {
    key: "betrayal_or_sacrifice",
    label: "배신 또는 희생",
    cardType: "betrayal_or_sacrifice",
    instruction:
      "Season 2에서 설계한 인물 중 후반부에 배신하거나 희생될 가능성이 있는 인물을 정하는 질문을 생성하라. 이 선택은 단순 충격 장치가 아니라 그 인물의 욕망, 비밀, 관계에서 자연스럽게 나와야 한다. 선택지는 배신, 자기희생, 침묵, 이탈, 주인공 대신 대가를 치르는 방식 등으로 나누어라.",
  },
  {
    key: "relationship_crack",
    label: "관계의 균열",
    cardType: "relationship_crack",
    instruction:
      "Season 2의 마지막에 관계망 전체에 남을 균열을 설계하는 질문을 생성하라. 이 균열은 Season 3의 챕터 플롯으로 넘어갈 씨앗이어야 한다. 선택지는 동맹의 붕괴, 감춰진 진실의 노출, 조연의 이탈, 세력 간 전쟁의 조짐, 주인공의 선택으로 인한 불신 등으로 구성하라.",
  },
];

export function isAiQuestionStep(step: number): boolean {
  const inSeason1 =
    step >= SEASON_STEP_START && step <= SEASON_STEP_END;
  const inSeason2 =
    step >= SEASON2_STEP_START && step <= SEASON2_STEP_END;
  return inSeason1 || inSeason2;
}

export function isBridgeStep(step: number): boolean {
  return step === BRIDGE_STEP || step === SEASON2_BRIDGE_STEP;
}

export function getStageForStep(step: number): StageInstruction | null {
  if (step >= SEASON_STEP_START && step <= SEASON_STEP_END) {
    return SEASON_1_STAGES[step - SEASON_STEP_START] ?? null;
  }
  if (step >= SEASON2_STEP_START && step <= SEASON2_STEP_END) {
    return SEASON_2_STAGES[step - SEASON2_STEP_START] ?? null;
  }
  return null;
}
