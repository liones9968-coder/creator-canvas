/** UI 진화 단계 — 진행도에 따라 셸 스타일이 점진적으로 풍부해짐 */
export type UiEvolutionStage = "text" | "terminal" | "window" | "canvas";

export function getUiEvolutionStage(params: {
  blockCount: number;
  currentStep: number;
  isBridge: boolean;
}): UiEvolutionStage {
  if (params.isBridge) return "canvas";

  const blocks = params.blockCount;
  const step = params.currentStep;

  if (blocks <= 1 && step <= 2) return "text";
  if (blocks <= 4 || step <= 6) return "terminal";
  if (blocks <= 10 || step <= 13) return "window";
  return "canvas";
}

export const UI_EVOLUTION_LABELS: Record<UiEvolutionStage, string> = {
  text: "TEXT MODE",
  terminal: "TERMINAL MODE",
  window: "WINDOW MODE",
  canvas: "CANVAS MODE",
};
