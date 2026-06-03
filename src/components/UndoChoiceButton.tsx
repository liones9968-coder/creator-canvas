"use client";

import {
  SEASON2_STEP_START,
  SEASON_STEP_START,
} from "@/lib/stageInstructions";
import { useStoryStore } from "@/store/useStoryStore";

export function UndoChoiceButton() {
  const currentStep = useStoryStore((s) => s.currentStep);
  const currentSeason = useStoryStore((s) => s.storyState.currentSeason);
  const choicesLength = useStoryStore((s) => s.storyState.choices.length);
  const undoLastChoice = useStoryStore((s) => s.undoLastChoice);

  const minStep =
    currentSeason === 2 ? SEASON2_STEP_START : SEASON_STEP_START;
  const canUndo = currentStep > minStep && choicesLength > 0;

  if (!canUndo) return null;

  return (
    <button
      type="button"
      onClick={undoLastChoice}
      className="self-start font-mono text-xs opacity-60 transition-opacity hover:opacity-100"
      style={{ color: "var(--cc-text-muted)" }}
    >
      ← 이전으로
    </button>
  );
}
