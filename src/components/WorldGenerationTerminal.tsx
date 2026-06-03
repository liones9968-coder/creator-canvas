"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { UI_EVOLUTION_LABELS, type UiEvolutionStage } from "@/lib/uiEvolution";
import { shuffleLoadingLines } from "@/lib/worldShellLoadingLines";

const LINE_INTERVAL_MS = 2200;

type Props = {
  evolutionStage?: UiEvolutionStage;
};

export function WorldGenerationTerminal({ evolutionStage = "terminal" }: Props) {
  const [queue, setQueue] = useState(() => shuffleLoadingLines());
  const [index, setIndex] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);
  const message = queue[index] ?? "";

  useEffect(() => {
    const lineTimer = setInterval(() => {
      setIndex((i) => {
        if (i + 1 >= queue.length) {
          setQueue(shuffleLoadingLines());
          return 0;
        }
        return i + 1;
      });
    }, LINE_INTERVAL_MS);

    const cursorTimer = setInterval(() => {
      setCursorOn((v) => !v);
    }, 530);

    return () => {
      clearInterval(lineTimer);
      clearInterval(cursorTimer);
    };
  }, [queue]);

  return (
    <div className="cc-gen-terminal flex w-full flex-col gap-4 py-8 font-mono text-sm">
      <p
        className="text-[10px] uppercase tracking-widest opacity-60"
        style={{ color: "var(--cc-accent)" }}
      >
        {UI_EVOLUTION_LABELS[evolutionStage]} · 세계 생성 중
      </p>

      <div
        className="rounded border px-4 py-3"
        style={{
          borderColor: "var(--cc-panel-border)",
          background: "rgba(0,0,0,0.25)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.25 }}
            className="leading-relaxed"
            style={{ color: "var(--cc-accent)" }}
          >
            <span className="opacity-50">{"> "}</span>
            {message}
            <span className="opacity-80">{cursorOn ? "█" : " "}</span>
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-center text-xs"
        style={{ color: "var(--cc-text-muted)" }}
      >
        우측 캔버스에 새 카드가 곧 추가됩니다
      </motion.p>
    </div>
  );
}
