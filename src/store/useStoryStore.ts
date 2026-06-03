import { create } from "zustand";
import { SEASON2_STEP_START, SEASON_STEP_START } from "@/lib/stageInstructions";
import { createChoiceBlock, createUniverseBlock } from "@/lib/storyBlocks";
import type { GeneratedQuestion } from "@/types/question";

export type UniverseSelection = {
  title: string;
  genre: string;
};

export type StorySeason = 1 | 2 | 3 | 4;

export type StoryChoiceRecord = {
  step: number;
  season?: StorySeason;
  stageKey: string;
  stageLabel: string;
  question: string;
  answer: string;
};

export type StoryBlock = {
  step: number;
  season?: StorySeason;
  cardType: string;
  title: string;
  summary: string;
  rawQuestion: string;
  rawAnswer: string;
};

export type EnsembleResult = {
  content: string;
  isFallback: boolean;
  createdAt: string;
};

export type StoryState = {
  universe: UniverseSelection | null;
  currentSeason: StorySeason;
  choices: StoryChoiceRecord[];
  blocks: StoryBlock[];
};

type StoryStore = {
  currentStep: number;
  storyState: StoryState;
  currentQuestion: GeneratedQuestion | null;
  isLoadingQuestion: boolean;
  questionError: string | null;
  isGeneratingSynopsis: boolean;
  synopsis: string | null;
  synopsisIsFallback: boolean;
  synopsisViewActive: boolean;
  isGeneratingEnsemble: boolean;
  ensemble: EnsembleResult | null;
  ensembleViewActive: boolean;
  setUniverse: (universe: UniverseSelection) => void;
  setCurrentQuestion: (question: GeneratedQuestion | null) => void;
  setLoadingQuestion: (loading: boolean) => void;
  setQuestionError: (error: string | null) => void;
  setGeneratingSynopsis: (loading: boolean) => void;
  setSynopsisResult: (synopsis: string, isFallback: boolean) => void;
  setSynopsisViewActive: (active: boolean) => void;
  clearSynopsis: () => void;
  setGeneratingEnsemble: (loading: boolean) => void;
  setEnsembleResult: (content: string, isFallback: boolean) => void;
  setEnsembleViewActive: (active: boolean) => void;
  clearEnsemble: () => void;
  worldName: string | null;
  setWorldName: (name: string) => void;
  startSeason2: () => void;
  submitChoice: (payload: {
    answer: string;
    stageKey: string;
    stageLabel: string;
    cardType: string;
    question: string;
  }) => void;
  undoLastChoice: () => void;
};

const initialStoryState: StoryState = {
  universe: null,
  currentSeason: 1,
  choices: [],
  blocks: [],
};

export const useStoryStore = create<StoryStore>((set, get) => ({
  currentStep: 1,
  storyState: initialStoryState,
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
  worldName: null,

  setUniverse: (universe) => {
    const block = createUniverseBlock(universe);
    set({
      storyState: {
        universe,
        currentSeason: 1,
        choices: [],
        blocks: [{ ...block, season: 1 }],
      },
      currentStep: 2,
      currentQuestion: null,
      questionError: null,
    });
  },

  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setLoadingQuestion: (loading) => set({ isLoadingQuestion: loading }),
  setQuestionError: (error) => set({ questionError: error }),

  setGeneratingSynopsis: (loading) => set({ isGeneratingSynopsis: loading }),
  setSynopsisResult: (synopsis, isFallback) =>
    set({
      synopsis,
      synopsisIsFallback: isFallback,
      synopsisViewActive: true,
      isGeneratingSynopsis: false,
    }),
  setSynopsisViewActive: (active) => set({ synopsisViewActive: active }),
  clearSynopsis: () =>
    set({
      synopsis: null,
      synopsisIsFallback: false,
      synopsisViewActive: false,
      isGeneratingSynopsis: false,
    }),

  setGeneratingEnsemble: (loading) => set({ isGeneratingEnsemble: loading }),
  setEnsembleResult: (content, isFallback) =>
    set({
      ensemble: { content, isFallback, createdAt: new Date().toISOString() },
      ensembleViewActive: true,
      isGeneratingEnsemble: false,
    }),
  setEnsembleViewActive: (active) => set({ ensembleViewActive: active }),
  clearEnsemble: () =>
    set({
      ensemble: null,
      ensembleViewActive: false,
      isGeneratingEnsemble: false,
    }),

  setWorldName: (name) => set({ worldName: name }),

  startSeason2: () =>
    set({
      storyState: {
        ...get().storyState,
        currentSeason: 2,
      },
      currentStep: SEASON2_STEP_START,
      currentQuestion: null,
      questionError: null,
    }),

  submitChoice: ({ answer, stageKey, stageLabel, cardType, question }) =>
    set((state) => {
      const step = state.currentStep;
      const season = state.storyState.currentSeason;
      const choice: StoryChoiceRecord = {
        step,
        season,
        stageKey,
        stageLabel,
        question,
        answer,
      };
      const block = createChoiceBlock({
        step,
        cardType,
        stageLabel,
        question,
        answer,
      });
      const blockWithSeason: StoryBlock = { ...block, season };
      return {
        storyState: {
          ...state.storyState,
          choices: [...state.storyState.choices, choice],
          blocks: [...state.storyState.blocks, blockWithSeason],
        },
        currentStep: state.currentStep + 1,
        currentQuestion: null,
        questionError: null,
      };
    }),

  undoLastChoice: () => {
    const state = get();
    const { currentSeason, choices, blocks } = state.storyState;
    const minStep = currentSeason === 2 ? SEASON2_STEP_START : SEASON_STEP_START;

    if (state.currentStep <= minStep || choices.length === 0) return;

    const lastChoice = choices[choices.length - 1];
    const undoStep = lastChoice.step;

    set({
      storyState: {
        ...state.storyState,
        choices: choices.slice(0, -1),
        blocks: blocks.filter(
          (b) => b.cardType === "universe" || b.step !== undoStep,
        ),
      },
      currentStep: undoStep,
      currentQuestion: null,
      questionError: null,
      isLoadingQuestion: false,
    });
  },
}));
