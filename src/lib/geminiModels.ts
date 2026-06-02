/** Google AI Studio 무료 티어에서 안정적인 모델 우선순위 (혼잡 시 다음 모델로 폴백) */
export const FREE_TIER_MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3.1-flash-lite",
] as const;

export type GeminiModelId = (typeof FREE_TIER_MODEL_CHAIN)[number];

export function resolveModelChain(): string[] {
  const override = process.env.GEMINI_MODEL?.trim();
  if (override) {
    return [override, ...FREE_TIER_MODEL_CHAIN.filter((m) => m !== override)];
  }
  return [...FREE_TIER_MODEL_CHAIN];
}

export function usesThinkingConfig(modelId: string): boolean {
  return modelId.includes("3.5");
}
