"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LayoutList, Sparkles } from "lucide-react";
import { useState } from "react";
import { CanvasPendingCard } from "@/components/CanvasPendingCard";
import { GenreAmbientEffects } from "@/components/GenreAmbientEffects";
import { SynopsisWeavingOverlay } from "@/components/SynopsisWeavingOverlay";
import { StoryBlockCard } from "@/components/StoryBlockCard";
import { useUiEvolution } from "@/hooks/useUiEvolution";
import { isBridgeStep } from "@/lib/stageInstructions";
import type { GenreKey } from "@/lib/genreThemes";
import { UI_EVOLUTION_LABELS } from "@/lib/uiEvolution";
import { useStoryStore } from "@/store/useStoryStore";

export function CreationCanvas() {
  const blocks = useStoryStore((s) => s.storyState.blocks);
  const currentStep = useStoryStore((s) => s.currentStep);
  const isLoadingQuestion = useStoryStore((s) => s.isLoadingQuestion);
  const isGeneratingSynopsis = useStoryStore((s) => s.isGeneratingSynopsis);
  const genre = useStoryStore((s) => s.storyState.universe?.genre) as
    | GenreKey
    | undefined;
  const { stage: evolutionStage } = useUiEvolution();
  const [detailMode, setDetailMode] = useState(false);

  const assetCount = blocks.length;
  const seasonComplete = isBridgeStep(currentStep);
  const showPending = isLoadingQuestion && !seasonComplete;
  const showSynopsisWeave = isGeneratingSynopsis && seasonComplete;

  return (
    <section
      className="cc-creation-canvas relative flex w-[60%] min-w-0 flex-col"
      style={{
        background: "var(--cc-canvas-bg)",
        color: "var(--cc-text)",
      }}
    >
      <header
        className="relative z-10 flex items-center justify-between gap-3 border-b px-5 py-4"
        style={{ borderColor: "var(--cc-canvas-border)" }}
      >
        <div className="flex items-center gap-2">
          <Sparkles
            className="h-4 w-4"
            style={{ color: "var(--cc-accent-secondary)" }}
          />
          <h2 className="font-mono text-sm font-semibold tracking-wide">
            창조의 캔버스 · 데이터 시각화
            {seasonComplete ? " · Season 1 완료" : ""}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="hidden font-mono text-[9px] uppercase tracking-wider opacity-50 sm:inline"
            style={{ color: "var(--cc-accent)" }}
          >
            {UI_EVOLUTION_LABELS[evolutionStage]}
          </span>
          <button
            type="button"
            onClick={() => setDetailMode((v) => !v)}
            className="cc-choice-btn flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide"
            style={{
              borderColor: "var(--cc-panel-border)",
              color: "var(--cc-accent)",
            }}
          >
            <LayoutList className="h-3 w-3" />
            {detailMode ? "요약 보기" : "상세 보기"}
          </button>
        </div>
      </header>

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <GenreAmbientEffects genre={genre} intensity={assetCount} />

        {showPending && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background:
                "radial-gradient(ellipse at 50% 80%, var(--cc-accent-glow), transparent 55%)",
            }}
          />
        )}

        <div
          className={`relative z-10 flex flex-1 flex-col gap-2 overflow-y-auto p-4 transition-opacity duration-500 sm:p-5 ${showSynopsisWeave ? "opacity-40" : "opacity-100"}`}
        >
          <AnimatePresence>
            {showSynopsisWeave && <SynopsisWeavingOverlay key="synopsis-weave" />}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            {blocks.length === 0 && !showPending ? (
              <motion.p
                key="empty"
                className="font-mono text-sm"
                style={{ color: "var(--cc-text-muted)" }}
              >
                좌측에서 우주를 선택하면 이곳에 카드가 생성됩니다.
              </motion.p>
            ) : (
              <>
                {blocks.map((block) => (
                  <StoryBlockCard
                    key={`${block.step}-${block.cardType}`}
                    block={block}
                    forceDetail={detailMode}
                  />
                ))}
                {showPending && <CanvasPendingCard key="pending" />}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
