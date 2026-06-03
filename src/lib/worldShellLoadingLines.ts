export const WORLD_SHELL_LOADING_LINES = [
  "차원 좌표 스캔 중.",
  "세계의 결함 감지 중.",
  "창조자 신호 포착 중.",
  "아직 태어나지 않은 세계 감지 중.",
  "서사 구조 초기화 중.",
  "인물 배치 계산 중.",
  "마나 소진량 측정 중.",
  "세계관 안정화 시도 중.",
  "선택지 렌더링 중.",
  "창세 엔진 가동 중.",
  "차원 간 연결 시도 중.",
  "존재 가능성 분석 중.",
  "갈등 구조 동기화 중.",
  "결말 벡터 계산 중.",
  "규칙 레이어 적재 중.",
  "주인공 신호 안정화 중.",
  "세계 부팅 시퀀스 실행 중.",
  "창조자의 선택 대기 중.",
  "서사 분기 탐색 중.",
  "미지의 존재 감지 중.",
] as const;

export function shuffleLoadingLines(
  lines: readonly string[] = WORLD_SHELL_LOADING_LINES,
): string[] {
  const next = [...lines];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}
