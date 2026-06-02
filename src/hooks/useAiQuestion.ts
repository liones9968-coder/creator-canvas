"use client";

import { useCallback, useEffect, useRef } from "react";
import { getStageForStep, isAiQuestionStep } from "@/lib/stageInstructions";
import { useStoryStore } from "@/store/useStoryStore";
import type { GeneratedQuestion } from "@/types/question";

export function useAiQuestion() {
  const currentStep = useStoryStore((s) => s.currentStep);
  const storyState = useStoryStore((s) => s.storyState);
  const currentQuestion = useStoryStore((s) => s.currentQuestion);
  const isLoadingQuestion = useStoryStore((s) => s.isLoadingQuestion);
  const questionError = useStoryStore((s) => s.questionError);
  const setCurrentQuestion = useStoryStore((s) => s.setCurrentQuestion);
  const setLoadingQuestion = useStoryStore((s) => s.setLoadingQuestion);
  const setQuestionError = useStoryStore((s) => s.setQuestionError);

  const fetchIdRef = useRef(0);

  const fetchQuestion = useCallback(async () => {
    if (!isAiQuestionStep(currentStep) || !storyState.universe) return;

    const stage = getStageForStep(currentStep);
    if (!stage) return;

    const fetchId = ++fetchIdRef.current;
    setLoadingQuestion(true);
    setQuestionError(null);

    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyState,
          stage_instruction: stage,
          step: currentStep,
        }),
      });

      const data = (await res.json()) as GeneratedQuestion & { error?: string };

      if (fetchId !== fetchIdRef.current) return;

      if (!res.ok) {
        throw new Error(data.error ?? "질문 생성에 실패했습니다.");
      }

      setCurrentQuestion({
        question: data.question,
        choices: data.choices,
      });
    } catch (e) {
      if (fetchId !== fetchIdRef.current) return;
      setQuestionError(
        e instanceof Error ? e.message : "질문 생성에 실패했습니다.",
      );
    } finally {
      if (fetchId === fetchIdRef.current) {
        setLoadingQuestion(false);
      }
    }
  }, [
    currentStep,
    storyState,
    setCurrentQuestion,
    setLoadingQuestion,
    setQuestionError,
  ]);

  useEffect(() => {
    if (!isAiQuestionStep(currentStep)) return;
    if (currentQuestion || isLoadingQuestion || questionError) return;
    void fetchQuestion();
  }, [
    currentStep,
    currentQuestion,
    isLoadingQuestion,
    questionError,
    storyState.blocks.length,
    storyState.universe?.genre,
    fetchQuestion,
  ]);

  return { fetchQuestion, isLoadingQuestion, currentQuestion };
}
