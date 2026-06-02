"use client";

import { useCallback } from "react";
import { buildFallbackSynopsis } from "@/lib/synopsisFallback";
import { useStoryStore } from "@/store/useStoryStore";

type SynopsisResponse = {
  synopsis: string;
  isFallback: boolean;
  error?: string;
};

export function useSynopsisGeneration() {
  const storyState = useStoryStore((s) => s.storyState);
  const isGeneratingSynopsis = useStoryStore((s) => s.isGeneratingSynopsis);
  const setGeneratingSynopsis = useStoryStore((s) => s.setGeneratingSynopsis);
  const setSynopsisResult = useStoryStore((s) => s.setSynopsisResult);

  const generateSynopsis = useCallback(async () => {
    setGeneratingSynopsis(true);
    useStoryStore.getState().setSynopsisViewActive(true);

    try {
      const res = await fetch("/api/generate-synopsis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyState }),
      });

      const data = (await res.json()) as SynopsisResponse & { error?: string };

      if (!res.ok && !data.synopsis) {
        throw new Error(data.error ?? "시놉시스 생성에 실패했습니다.");
      }

      setSynopsisResult(data.synopsis, data.isFallback ?? false);
    } catch {
      const state = useStoryStore.getState().storyState;
      setSynopsisResult(buildFallbackSynopsis(state), true);
    }
  }, [storyState, setGeneratingSynopsis, setSynopsisResult]);

  return { generateSynopsis, isGeneratingSynopsis };
}
