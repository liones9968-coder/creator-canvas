"use client";

import { getUiEvolutionStage } from "@/lib/uiEvolution";
import { isBridgeStep } from "@/lib/stageInstructions";
import { useStoryStore } from "@/store/useStoryStore";

export function useUiEvolution() {
  const currentStep = useStoryStore((s) => s.currentStep);
  const blockCount = useStoryStore((s) => s.storyState.blocks.length);

  const stage = getUiEvolutionStage({
    blockCount,
    currentStep,
    isBridge: isBridgeStep(currentStep),
  });

  return { stage, blockCount, currentStep };
}
