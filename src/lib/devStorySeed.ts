import {
  BRIDGE_STEP,
  SEASON_1_STAGES,
  SEASON_STEP_START,
} from "@/lib/stageInstructions";
import { createChoiceBlock, createUniverseBlock } from "@/lib/storyBlocks";
import { useStoryStore } from "@/store/useStoryStore";
import type { StoryChoiceRecord, StoryBlock } from "@/store/useStoryStore";

const DEV_UNIVERSE = {
  title: "검과 마법의 우주",
  genre: "판타지",
} as const;

const DEV_WORLD_NAME = "테스트월드";

export function applyDevStorySeedToBridge(): void {
  const universeBlock: StoryBlock = {
    ...createUniverseBlock(DEV_UNIVERSE),
    season: 1,
  };

  const choices: StoryChoiceRecord[] = [];
  const blocks: StoryBlock[] = [universeBlock];

  SEASON_1_STAGES.forEach((stage, index) => {
    const step = SEASON_STEP_START + index;
    const question = `[더미] ${stage.label}에 대한 질문`;
    const answer = `[더미] 테스트월드 — ${stage.label} 선택`;

    choices.push({
      step,
      season: 1,
      stageKey: stage.key,
      stageLabel: stage.label,
      question,
      answer,
    });

    blocks.push({
      ...createChoiceBlock({
        step,
        cardType: stage.cardType,
        stageLabel: stage.label,
        question,
        answer,
      }),
      season: 1,
    });
  });

  useStoryStore.setState({
    currentStep: BRIDGE_STEP,
    storyState: {
      universe: { ...DEV_UNIVERSE },
      currentSeason: 1,
      choices,
      blocks,
    },
    worldName: DEV_WORLD_NAME,
    currentQuestion: null,
    isLoadingQuestion: false,
    questionError: null,
    isGeneratingSynopsis: false,
    synopsis: null,
    synopsisIsFallback: false,
    synopsisViewActive: false,
    isGeneratingEnsemble: false,
    ensemble: null,
    ensembleViewActive: false,
  });
}
