"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { StoryBlock } from "@/store/useStoryStore";

function cardTypeLabel(cardType: string): string {
  if (cardType === "universe") return "Universe";
  return cardType.replace(/_/g, " ");
}

type Props = {
  block: StoryBlock;
  forceDetail?: boolean;
};

export function StoryBlockCard({ block, forceDetail = false }: Props) {
  const [expanded, setExpanded] = useState(false);
  const showDetail = forceDetail || expanded;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, x: 16, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      className="cc-story-card w-full shrink-0 rounded-lg border transition-shadow"
      style={{
        background: "var(--cc-card-bg)",
        borderColor: "var(--cc-card-border)",
        boxShadow: showDetail ? `0 0 16px var(--cc-accent-glow)` : undefined,
      }}
    >
      <button
        type="button"
        onClick={() => !forceDetail && setExpanded((v) => !v)}
        className="flex w-full items-start gap-2 px-3 py-2.5 text-left"
        aria-expanded={showDetail}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className="font-mono text-[10px] uppercase tracking-wider"
              style={{ color: "var(--cc-accent-secondary)" }}
            >
              {cardTypeLabel(block.cardType)} · S{block.step}
            </span>
            {!forceDetail && (
              <ChevronDown
                className="h-3.5 w-3.5 shrink-0 transition-transform"
                style={{
                  color: "var(--cc-text-muted)",
                  transform: showDetail ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            )}
          </div>
          <h3
            className="mt-0.5 font-mono text-sm font-semibold leading-snug"
            style={{ color: "var(--cc-accent)" }}
          >
            {block.title}
          </h3>
          <p
            className="mt-1 font-mono text-xs leading-relaxed"
            style={{ color: "var(--cc-text)" }}
          >
            {block.summary}
          </p>
        </div>
      </button>

      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t px-3 pb-3 pt-2"
            style={{ borderColor: "var(--cc-panel-border)" }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-wide opacity-70"
              style={{ color: "var(--cc-text-muted)" }}
            >
              선택
            </p>
            <p
              className="mt-1 font-mono text-xs leading-relaxed"
              style={{ color: "var(--cc-text)" }}
            >
              {block.rawAnswer}
            </p>
            <p
              className="mt-2 font-mono text-[10px] uppercase tracking-wide opacity-70"
              style={{ color: "var(--cc-text-muted)" }}
            >
              질문
            </p>
            <p
              className="mt-0.5 font-mono text-[11px] leading-relaxed opacity-80"
              style={{ color: "var(--cc-text-muted)" }}
            >
              {block.rawQuestion}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
