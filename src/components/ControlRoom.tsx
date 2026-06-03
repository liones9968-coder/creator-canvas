"use client";

import { Activity } from "lucide-react";
import { useState } from "react";
import { SeasonBridge } from "@/components/SeasonBridge";
import { UndoChoiceButton } from "@/components/UndoChoiceButton";
import { QuestionPanel } from "@/components/QuestionPanel";
import { WorldGenerationTerminal } from "@/components/WorldGenerationTerminal";
import { useAiQuestion } from "@/hooks/useAiQuestion";
import { useUiEvolution } from "@/hooks/useUiEvolution";
import {
  getStageForStep,
  isAiQuestionStep,
  isBridgeStep,
} from "@/lib/stageInstructions";
import { UI_EVOLUTION_LABELS } from "@/lib/uiEvolution";
import { useStoryStore, type UniverseSelection } from "@/store/useStoryStore";

const UNIVERSE_OPTIONS: UniverseSelection[] = [
  { title: "검과 마법의 우주", genre: "판타지" },
  { title: "운명과 감정의 우주", genre: "로맨스" },
  { title: "강철과 네온의 우주", genre: "사이버펑크" },
  { title: "은원과 무공의 우주", genre: "무협" },
  { title: "안개와 진실의 우주", genre: "미스터리" },
  { title: "차원의 틈새", genre: "하이브리드" },
];

export function ControlRoom() {
  const currentStep = useStoryStore((s) => s.currentStep);
  const setUniverse = useStoryStore((s) => s.setUniverse);
  const submitChoice = useStoryStore((s) => s.submitChoice);
  const questionError = useStoryStore((s) => s.questionError);
  const { fetchQuestion, isLoadingQuestion, currentQuestion } = useAiQuestion();
  const { stage: evolutionStage } = useUiEvolution();

  const [customInput, setCustomInput] = useState("");
  const stage = getStageForStep(currentStep);
  const onBridge = isBridgeStep(currentStep);

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

  const stepLabel = onBridge
    ? "창세 완료"
    : stage
      ? stage.label
      : currentStep === 1
        ? "우주 선택"
        : "";

  return (
    <aside
      className="cc-control-room flex w-[40%] min-w-0 flex-col border-r"
      style={{
        background: "var(--cc-panel-bg)",
        borderColor: "var(--cc-panel-border)",
        color: "var(--cc-text)",
      }}
    >
      <header
        className="flex items-center justify-between border-b px-5 py-4"
        style={{ borderColor: "var(--cc-panel-border)" }}
      >
        <div className="flex items-center gap-2">
          <Activity
            className="h-4 w-4"
            style={{ color: "var(--cc-accent)" }}
          />
          <h2 className="font-mono text-sm font-semibold tracking-wide">
            통제실 · 질문 컨트롤러
          </h2>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span
            className="font-mono text-xs"
            style={{ color: "var(--cc-text-muted)" }}
          >
            STEP {currentStep}
            {stepLabel ? ` · ${stepLabel}` : ""}
          </span>
          <span
            className="cc-evolution-badge font-mono text-[9px] uppercase tracking-wider opacity-50"
            style={{ color: "var(--cc-accent)" }}
          >
            {UI_EVOLUTION_LABELS[evolutionStage]}
          </span>
        </div>
      </header>

      <QuestionPanel>
        {onBridge ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <SeasonBridge />
          </div>
        ) : currentStep === 1 ? (
          <div className="cc-question-card flex flex-col gap-5 rounded-lg border p-5">
            <p className="font-mono text-sm leading-relaxed">
              C:\&gt; 당신의 새로운 이야기가 탄생할 우주는 어떤 곳입니까?
            </p>
            <ul className="flex flex-col gap-2">
              {UNIVERSE_OPTIONS.map((option) => (
                <li key={option.genre}>
                  <button
                    type="button"
                    onClick={() => setUniverse(option)}
                    className="cc-choice-btn group w-full rounded-md border px-3 py-2.5 text-left transition-all duration-200"
                    style={{
                      borderColor: "var(--cc-panel-border)",
                      background: "var(--cc-card-bg)",
                    }}
                  >
                    <span className="block font-mono text-sm transition-colors group-hover:text-[var(--cc-accent)]">
                      {option.title}
                    </span>
                    <span
                      className="mt-0.5 block font-mono text-xs"
                      style={{ color: "var(--cc-text-muted)" }}
                    >
                      ({option.genre})
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : isAiQuestionStep(currentStep) && isLoadingQuestion ? (
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
          <div className="cc-question-card flex flex-col gap-4 rounded-lg border p-5 shadow-lg">
            <p className="font-mono text-sm leading-relaxed">
              {currentQuestion.question}
            </p>
            <ul className="flex flex-col gap-2">
              {currentQuestion.choices.map((choice, i) => (
                <li key={`${stage.key}-${i}`}>
                  <button
                    type="button"
                    onClick={() => handleAiChoice(choice)}
                    className="cc-choice-btn group w-full rounded-md border px-3 py-2.5 text-left font-mono text-sm transition-all"
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
      </QuestionPanel>
    </aside>
  );
}
