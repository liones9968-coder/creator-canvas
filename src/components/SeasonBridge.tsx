"use client";

import { BookOpen, Copy, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { SynopsisDocument } from "@/components/SynopsisDocument";
import { useSynopsisGeneration } from "@/hooks/useSynopsisGeneration";
import { Season2Bridge } from "@/components/Season2Bridge";
import { BRIDGE_STEP, SEASON2_BRIDGE_STEP } from "@/lib/stageInstructions";
import { useStoryStore } from "@/store/useStoryStore";

const season2StartButtonClass =
  "cc-choice-btn flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 font-mono text-sm";

function Season2StartButton() {
  const startSeason2 = useStoryStore((s) => s.startSeason2);
  const setWorldName = useStoryStore((s) => s.setWorldName);
  const [showNameInput, setShowNameInput] = useState(false);
  const [worldNameInput, setWorldNameInput] = useState("");

  const handleStartSeason2 = () => {
    if (!worldNameInput.trim()) return;
    setWorldName(worldNameInput.trim());
    startSeason2();
  };

  if (!showNameInput) {
    return (
      <button
        type="button"
        onClick={() => setShowNameInput(true)}
        className={season2StartButtonClass}
        style={{
          borderColor: "var(--cc-panel-border)",
          color: "var(--cc-text)",
        }}
      >
        Season 2 · 성좌 시작하기
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p
        className="font-mono text-sm"
        style={{ color: "var(--cc-text-muted)" }}
      >
        당신의 세계에 이름을 붙여주세요.
      </p>
      <input
        type="text"
        value={worldNameInput}
        onChange={(e) => setWorldNameInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleStartSeason2()}
        placeholder="세계의 이름..."
        className="rounded-md border bg-transparent px-3 py-2.5 font-mono text-sm outline-none"
        style={{
          borderColor: "var(--cc-accent)",
          color: "var(--cc-text)",
        }}
        autoFocus
      />
      <button
        type="button"
        onClick={handleStartSeason2}
        disabled={!worldNameInput.trim()}
        className="cc-choice-btn rounded-md border px-4 py-2.5 font-mono text-sm disabled:opacity-40"
        style={{ borderColor: "var(--cc-accent)", color: "var(--cc-accent)" }}
      >
        성좌 시작하기 →
      </button>
    </div>
  );
}

export function SeasonBridge() {
  const currentStep = useStoryStore((s) => s.currentStep);
  const blocks = useStoryStore((s) => s.storyState.blocks);
  const synopsis = useStoryStore((s) => s.synopsis);
  const synopsisViewActive = useStoryStore((s) => s.synopsisViewActive);
  const synopsisIsFallback = useStoryStore((s) => s.synopsisIsFallback);
  const isGeneratingSynopsis = useStoryStore((s) => s.isGeneratingSynopsis);
  const clearSynopsis = useStoryStore((s) => s.clearSynopsis);

  const { generateSynopsis } = useSynopsisGeneration();
  const [copyDone, setCopyDone] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const handleOpenSynopsis = async () => {
    setGenError(null);
    if (isGeneratingSynopsis) return;
    if (synopsis && synopsisViewActive) return;
    try {
      await generateSynopsis();
    } catch {
      /* hook에서 fallback 시놉시스 처리 */
    }
  };

  const handleRegenerate = async () => {
    setGenError(null);
    clearSynopsis();
    try {
      await generateSynopsis();
    } catch {
      /* hook에서 fallback 시놉시스 처리 */
    }
  };

  const handleCopy = async () => {
    if (!synopsis) return;
    try {
      await navigator.clipboard.writeText(synopsis);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setGenError("클립보드 복사에 실패했습니다.");
    }
  };

  if (currentStep === SEASON2_BRIDGE_STEP) {
    return <Season2Bridge />;
  }

  if (currentStep !== BRIDGE_STEP) {
    return null;
  }

  if (isGeneratingSynopsis && !synopsis) {
    return (
      <div className="flex flex-1 flex-col gap-4 py-4">
        <h3
          className="font-mono text-lg font-semibold"
          style={{ color: "var(--cc-accent)" }}
        >
          창세록 해독 중
        </h3>
        <p
          className="font-mono text-sm leading-relaxed"
          style={{ color: "var(--cc-text-muted)" }}
        >
          선택한 세계를 하나의 서사로 엮는 중...
          <br />
          우측 캔버스에서 카드들이 합쳐지고 있습니다.
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

  if (synopsisViewActive && synopsis) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="shrink-0">
          <h3
            className="font-mono text-lg font-semibold"
            style={{ color: "var(--cc-accent)" }}
          >
            창세록
          </h3>
          <p
            className="mt-1 font-mono text-[11px]"
            style={{ color: "var(--cc-text-muted)" }}
          >
            {synopsis.length.toLocaleString()}자 · Season 1 통합 서사
          </p>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto rounded-md border p-4"
          style={{
            borderColor: "var(--cc-panel-border)",
            background: "var(--cc-card-bg)",
          }}
        >
          <SynopsisDocument content={synopsis} isFallback={synopsisIsFallback} />
        </div>

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
            onClick={() => void handleRegenerate()}
            disabled={isGeneratingSynopsis}
            className="cc-choice-btn flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 font-mono text-sm disabled:opacity-50"
            style={{
              borderColor: "var(--cc-panel-border)",
              color: "var(--cc-text)",
            }}
          >
            <RefreshCw className="h-4 w-4" />
            다시 만들기
          </button>
          <Season2StartButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Sparkles
          className="h-8 w-8"
          style={{ color: "var(--cc-accent)" }}
        />
        <h3
          className="font-mono text-xl font-semibold"
          style={{ color: "var(--cc-accent)" }}
        >
          Season 1 · 창세 완료
        </h3>
        <p
          className="font-mono text-sm leading-relaxed"
          style={{ color: "var(--cc-text-muted)" }}
        >
          {blocks.length}개의 카드가 하나의 세계를 이루었습니다. 창세록을
          열람해 보세요.
        </p>
      </div>

      {genError && (
        <p className="font-mono text-xs text-red-400">{genError}</p>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => void handleOpenSynopsis()}
          disabled={isGeneratingSynopsis}
          className="cc-choice-btn flex items-center justify-center gap-2 rounded-md border px-4 py-3 font-mono text-sm transition-all disabled:opacity-60"
          style={{
            borderColor: "var(--cc-accent)",
            color: "var(--cc-accent)",
            background: "var(--cc-card-bg)",
          }}
        >
          <BookOpen className="h-4 w-4" />
          {isGeneratingSynopsis ? "창세록 해독 중..." : "창세록 열람"}
        </button>

        <Season2StartButton />
      </div>
    </div>
  );
}
