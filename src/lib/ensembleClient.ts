import { useStoryStore } from "@/store/useStoryStore";
import type { StoryState } from "@/store/useStoryStore";

export async function fetchEnsembleDocument(
  storyState: StoryState,
): Promise<{ ensemble: string; isFallback: boolean }> {
  const res = await fetch("/api/generate-ensemble", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storyState }),
  });
  const data = (await res.json()) as {
    ensemble?: string;
    isFallback?: boolean;
    error?: string;
  };
  if (!res.ok || !data.ensemble) {
    throw new Error(data.error ?? "생성 실패");
  }
  return { ensemble: data.ensemble, isFallback: data.isFallback ?? false };
}

export async function runEnsembleGeneration(): Promise<string | null> {
  const {
    isGeneratingEnsemble,
    ensemble,
    ensembleViewActive,
    storyState,
    setGeneratingEnsemble,
    setEnsembleResult,
  } = useStoryStore.getState();

  if (isGeneratingEnsemble) return null;
  if (ensemble && ensembleViewActive) return null;

  setGeneratingEnsemble(true);
  try {
    const { ensemble: text, isFallback } = await fetchEnsembleDocument(storyState);
    setEnsembleResult(text, isFallback);
    return null;
  } catch (err) {
    setGeneratingEnsemble(false);
    return err instanceof Error
      ? err.message
      : "성좌 개요서 생성에 실패했습니다. 다시 시도해주세요.";
  }
}
