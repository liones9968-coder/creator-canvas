"use client";

import { BookOpen } from "lucide-react";
import { useState } from "react";
import { UndoChoiceButton } from "@/components/UndoChoiceButton";
import { WorldGenerationTerminal } from "@/components/WorldGenerationTerminal";
import { useAiQuestion } from "@/hooks/useAiQuestion";
import { useUiEvolution } from "@/hooks/useUiEvolution";
import {
  getStageForStep,
  isAiQuestionStep,
  SEASON2_BRIDGE_STEP,
} from "@/lib/stageInstructions";
import type { SidePanelMode } from "@/components/Season2SidePanel";
import { useStoryStore } from "@/store/useStoryStore";

type Props = {
  setSidePanelMode: (mode: SidePanelMode) => void;
  onOpenEnsemble: () => void | Promise<void>;
};

export function Season2CenterPanel({
  setSidePanelMode,
  onOpenEnsemble,
}: Props) {
  const currentStep = useStoryStore((s) => s.currentStep);
  const storyState = useStoryStore((s) => s.storyState);
  const worldName = useStoryStore((s) => s.worldName);
  const submitChoice = useStoryStore((s) => s.submitChoice);
  const questionError = useStoryStore((s) => s.questionError);
  const isGeneratingEnsemble = useStoryStore((s) => s.isGeneratingEnsemble);
  const { fetchQuestion, isLoadingQuestion, currentQuestion } = useAiQuestion();
  const { stage: evolutionStage } = useUiEvolution();

  const [customInput, setCustomInput] = useState("");
  const stage = getStageForStep(currentStep);

  const handleAiChoice = (answer: string) => {
    if (!currentQuestion || !stage) return;
    submitChoice({
      answer,
      stageKey: stage.key,
      stageLabel: stage.label,
      cardType: stage.cardType,
      question: currentQuestion.question,
    });
    setCustomInput("");
  };

  const handleCustomSubmit = () => {
    const trimmed = customInput.trim();
    if (!trimmed || !currentQuestion || !stage) return;
    handleAiChoice(trimmed);
  };

  if (currentStep === SEASON2_BRIDGE_STEP) {
    return (
      <main
        className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 md:w-[50%] md:border-x"
        style={{
          borderColor: "var(--cc-panel-border)",
          background: "var(--cc-canvas-bg)",
        }}
      >
        <h3
          className="font-mono text-xl font-semibold"
          style={{ color: "var(--cc-accent)" }}
        >
          Season 2 · 성좌 완료
        </h3>
        <p
          className="max-w-md text-center font-mono text-sm"
          style={{ color: "var(--cc-text-muted)" }}
        >
          인물과 세력이 관계망을 이루었습니다.
        </p>
        <button
          type="button"
          onClick={() => void onOpenEnsemble()}
          disabled={isGeneratingEnsemble}
          className="cc-choice-btn flex items-center justify-center gap-2 rounded-md border px-4 py-3 font-mono text-sm disabled:opacity-60"
          style={{
            borderColor: "var(--cc-accent)",
            color: "var(--cc-accent)",
            background: "var(--cc-card-bg)",
          }}
        >
          <BookOpen className="h-4 w-4" />
          {isGeneratingEnsemble ? "성좌 개요서 생성 중..." : "성좌 개요서 보기"}
        </button>
        <button
          type="button"
          disabled
          className="rounded-md border px-4 py-3 font-mono text-sm opacity-45"
          style={{
            borderColor: "var(--cc-panel-border)",
            color: "var(--cc-text-muted)",
          }}
        >
          Season 3 준비중
        </button>
      </main>
    );
  }

  return (
      <main
        className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 md:w-[50%] md:border-x"
      style={{
        borderColor: "var(--cc-panel-border)",
        background: "var(--cc-canvas-bg)",
        color: "var(--cc-text)",
      }}
    >
      {isAiQuestionStep(currentStep) && isLoadingQuestion ? (
        <WorldGenerationTerminal evolutionStage={evolutionStage} />
      ) : questionError ? (
        <div className="cc-question-card flex flex-col gap-4 rounded-lg border p-5">
          <p className="font-mono text-sm text-red-400">{questionError}</p>
          <button
            type="button"
            onClick={() => {
              useStoryStore.getState().setQuestionError(null);
              void fetchQuestion();
            }}
            className="cc-choice-btn rounded-md border px-4 py-2 font-mono text-sm"
            style={{
              borderColor: "var(--cc-accent)",
              color: "var(--cc-accent)",
            }}
          >
            다시 시도
          </button>
        </div>
      ) : currentQuestion && stage ? (
        <div className="cc-question-card flex flex-col gap-4 rounded-lg border p-5">
          <p className="font-mono text-sm leading-relaxed">
            {currentQuestion.question}
          </p>
          <ul className="flex flex-col gap-2">
            {currentQuestion.choices.map((choice, i) => (
              <li key={`${stage.key}-${i}`}>
                <button
                  type="button"
                  onClick={() => handleAiChoice(choice)}
                    className="cc-choice-btn cc-choice-label group w-full rounded-md border px-3 py-2.5 text-left font-mono text-sm transition-all"
                  style={{
                    borderColor: "var(--cc-panel-border)",
                    background: "var(--cc-card-bg)",
                  }}
                >
                  <span className="transition-colors group-hover:text-[var(--cc-accent)]">
                    {choice}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div
            className="flex flex-col gap-2 border-t pt-4"
            style={{ borderColor: "var(--cc-panel-border)" }}
          >
            <label
              className="font-mono text-xs"
              style={{ color: "var(--cc-text-muted)" }}
            >
              직접 입력
            </label>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              rows={3}
              placeholder="나만의 선택을 입력하세요..."
              className="w-full resize-none rounded-md border bg-transparent px-3 py-2 font-mono text-sm focus:outline-none"
              style={{
                borderColor: "var(--cc-panel-border)",
                color: "var(--cc-text)",
              }}
            />
            <button
              type="button"
              onClick={handleCustomSubmit}
              disabled={!customInput.trim()}
              className="cc-choice-btn rounded-md border px-4 py-2 font-mono text-sm disabled:opacity-40"
              style={{
                borderColor: "var(--cc-accent)",
                color: "var(--cc-accent)",
              }}
            >
              등록하고 다음으로
            </button>
          </div>
          <UndoChoiceButton />
        </div>
      ) : null}

      <div
        className="mt-6 cursor-pointer rounded-md border px-4 py-3 text-center font-mono"
        style={{
          borderColor: "var(--cc-accent)",
          background: "var(--cc-card-bg)",
        }}
        onClick={() => setSidePanelMode("synopsis")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSidePanelMode("synopsis");
          }
        }}
        role="button"
        tabIndex={0}
      >
        <p
          className="mb-1 font-mono text-[10px] tracking-wider uppercase"
          style={{ color: "var(--cc-text-muted)" }}
        >
          주인공 · {storyState.universe?.genre}
        </p>
        <p
          className="text-base font-semibold"
          style={{ color: "var(--cc-accent)" }}
        >
          {worldName ?? "주인공"}
        </p>
        <p
          className="mt-1 font-mono text-[10px]"
          style={{ color: "var(--cc-text-muted)" }}
        >
          탭하면 창세록 확인
        </p>
      </div>
    </main>
  );
}
