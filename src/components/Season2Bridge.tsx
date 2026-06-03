"use client";

import { BookOpen, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { EnsembleDocument } from "@/components/EnsembleDocument";
import { useStoryStore } from "@/store/useStoryStore";

async function fetchEnsemble(
  storyState: ReturnType<typeof useStoryStore.getState>["storyState"],
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

export function Season2Bridge() {
  const isGeneratingEnsemble = useStoryStore((s) => s.isGeneratingEnsemble);
  const ensemble = useStoryStore((s) => s.ensemble);
  const ensembleViewActive = useStoryStore((s) => s.ensembleViewActive);
  const setGeneratingEnsemble = useStoryStore((s) => s.setGeneratingEnsemble);
  const setEnsembleResult = useStoryStore((s) => s.setEnsembleResult);
  const clearEnsemble = useStoryStore((s) => s.clearEnsemble);

  const [ensembleError, setEnsembleError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const handleOpenEnsemble = async () => {
    if (isGeneratingEnsemble) return;
    if (ensemble && ensembleViewActive) return;
    setEnsembleError(null);
    setGeneratingEnsemble(true);
    try {
      const storyState = useStoryStore.getState().storyState;
      const { ensemble: text, isFallback } = await fetchEnsemble(storyState);
      setEnsembleResult(text, isFallback);
    } catch (err) {
      setGeneratingEnsemble(false);
      setEnsembleError(
        err instanceof Error
          ? err.message
          : "성좌 개요서 생성에 실패했습니다. 다시 시도해주세요.",
      );
    }
  };

  const handleRegenerateEnsemble = async () => {
    setEnsembleError(null);
    clearEnsemble();
    setGeneratingEnsemble(true);
    try {
      const storyState = useStoryStore.getState().storyState;
      const { ensemble: text, isFallback } = await fetchEnsemble(storyState);
      setEnsembleResult(text, isFallback);
    } catch (err) {
      setGeneratingEnsemble(false);
      setEnsembleError(
        err instanceof Error
          ? err.message
          : "성좌 개요서 생성에 실패했습니다. 다시 시도해주세요.",
      );
    }
  };

  const handleCopy = async () => {
    if (!ensemble?.content) return;
    try {
      await navigator.clipboard.writeText(ensemble.content);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setEnsembleError("클립보드 복사에 실패했습니다.");
    }
  };

  if (isGeneratingEnsemble && !ensemble) {
    return (
      <div className="flex flex-1 flex-col gap-4 py-4">
        <h3
          className="font-mono text-lg font-semibold"
          style={{ color: "var(--cc-accent)" }}
        >
          성좌 개요서 합성 중
        </h3>
        <p
          className="font-mono text-sm leading-relaxed"
          style={{ color: "var(--cc-text-muted)" }}
        >
          인물과 세력을 하나의 관계망으로 엮는 중...
        </p>
        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full"
          style={{ background: "var(--cc-panel-border)" }}
        >
          <div
            className="h-full w-1/3 animate-pulse rounded-full"
            style={{ background: "var(--cc-accent)" }}
          />
        </div>
      </div>
    );
  }

  if (ensembleViewActive && ensemble) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="shrink-0">
          <h3
            className="font-mono text-lg font-semibold"
            style={{ color: "var(--cc-accent)" }}
          >
            성좌 개요서
          </h3>
          <p
            className="mt-1 font-mono text-[11px]"
            style={{ color: "var(--cc-text-muted)" }}
          >
            {ensemble.content.length.toLocaleString()}자 · Season 2 성좌
          </p>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto rounded-md border p-4"
          style={{
            borderColor: "var(--cc-panel-border)",
            background: "var(--cc-card-bg)",
          }}
        >
          <EnsembleDocument
            content={ensemble.content}
            isFallback={ensemble.isFallback}
          />
        </div>

        {ensembleError && (
          <p className="font-mono text-xs text-red-400">{ensembleError}</p>
        )}

        <div className="flex shrink-0 flex-col gap-2">
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="cc-choice-btn flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 font-mono text-sm"
            style={{
              borderColor: "var(--cc-accent)",
              color: "var(--cc-accent)",
            }}
          >
            <Copy className="h-4 w-4" />
            {copyDone ? "복사됨" : "복사하기"}
          </button>
          <button
            type="button"
            onClick={() => void handleRegenerateEnsemble()}
            disabled={isGeneratingEnsemble}
            className="cc-choice-btn flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 font-mono text-sm disabled:opacity-50"
            style={{
              borderColor: "var(--cc-panel-border)",
              color: "var(--cc-text)",
            }}
          >
            <RefreshCw className="h-4 w-4" />
            다시 만들기
          </button>
          <button
            type="button"
            disabled
            className="rounded-md border px-3 py-2.5 font-mono text-sm opacity-45"
            style={{
              borderColor: "var(--cc-panel-border)",
              color: "var(--cc-text-muted)",
            }}
          >
            Season 3 준비중
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3
          className="font-mono text-xl font-semibold"
          style={{ color: "var(--cc-accent)" }}
        >
          Season 2 · 성좌 완료
        </h3>
        <p
          className="font-mono text-sm leading-relaxed"
          style={{ color: "var(--cc-text-muted)" }}
        >
          인물과 세력이 관계망을 이루었습니다.
          <br />
          성좌 개요서로 엮어 보세요.
        </p>
      </div>

      {ensembleError && (
        <p className="font-mono text-xs text-red-400">{ensembleError}</p>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => void handleOpenEnsemble()}
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
      </div>
    </div>
  );
}
