import { create } from "zustand";
import { createChoiceBlock, createUniverseBlock } from "@/lib/storyBlocks";
import type { GeneratedQuestion } from "@/types/question";

export type UniverseSelection = {
  title: string;
  genre: string;
};

export type StoryChoiceRecord = {
  step: number;
  stageKey: string;
  stageLabel: string;
  question: string;
  answer: string;
};

export type StoryBlock = {
  step: number;
  cardType: string;
  title: string;
  summary: string;
  rawQuestion: string;
  rawAnswer: string;
};

export type StoryState = {
  universe: UniverseSelection | null;
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
  setUniverse: (universe: UniverseSelection) => void;
  setCurrentQuestion: (question: GeneratedQuestion | null) => void;
  setLoadingQuestion: (loading: boolean) => void;
  setQuestionError: (error: string | null) => void;
  setGeneratingSynopsis: (loading: boolean) => void;
  setSynopsisResult: (synopsis: string, isFallback: boolean) => void;
  setSynopsisViewActive: (active: boolean) => void;
  clearSynopsis: () => void;
  submitChoice: (payload: {
    answer: string;
    stageKey: string;
    stageLabel: string;
    cardType: string;
    question: string;
  }) => void;
};

const initialStoryState: StoryState = {
  universe: null,
  choices: [],
  blocks: [],
};

export const useStoryStore = create<StoryStore>((set) => ({
  currentStep: 1,
  storyState: initialStoryState,
  currentQuestion: null,
  isLoadingQuestion: false,
  questionError: null,
  isGeneratingSynopsis: false,
  synopsis: null,
  synopsisIsFallback: false,
  synopsisViewActive: false,

  setUniverse: (universe) => {
    const block = createUniverseBlock(universe);
    set({
      storyState: { universe, choices: [], blocks: [block] },
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

  submitChoice: ({ answer, stageKey, stageLabel, cardType, question }) =>
    set((state) => {
      const step = state.currentStep;
      const choice: StoryChoiceRecord = {
        step,
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
      return {
        storyState: {
          ...state.storyState,
          choices: [...state.storyState.choices, choice],
          blocks: [...state.storyState.blocks, block],
        },
        currentStep: state.currentStep + 1,
        currentQuestion: null,
        questionError: null,
      };
    }),
}));
