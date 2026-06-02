import type { StoryBlock, StoryState, UniverseSelection } from "@/store/useStoryStore";

const UNIVERSE_QUESTION =
  "당신의 새로운 이야기가 탄생할 우주는 어떤 곳입니까?";

export function summarizeAnswer(answer: string, maxLen = 80): string {
  const trimmed = answer.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen)}…`;
}

export function createUniverseBlock(universe: UniverseSelection): StoryBlock {
  return {
    step: 1,
    cardType: "universe",
    title: universe.title,
    summary: universe.genre,
    rawQuestion: UNIVERSE_QUESTION,
    rawAnswer: `${universe.title} · ${universe.genre}`,
  };
}

export function createChoiceBlock(payload: {
  step: number;
  cardType: string;
  stageLabel: string;
  question: string;
  answer: string;
}): StoryBlock {
  return {
    step: payload.step,
    cardType: payload.cardType,
    title: payload.stageLabel,
    summary: summarizeAnswer(payload.answer),
    rawQuestion: payload.question,
    rawAnswer: payload.answer,
  };
}

/**
 * 직접 입력값을 구조화된 storyState로 변환 (Season 2+ AI Parser 연동 예정)
 */
export function parseCustomInputToStoryState(
  input: string,
  context: { step: number; cardType: string; storyState: StoryState },
): Partial<StoryState> | null {
  void input;
  void context;
  return null;
}
