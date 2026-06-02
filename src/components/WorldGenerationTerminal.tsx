"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { UI_EVOLUTION_LABELS, type UiEvolutionStage } from "@/lib/uiEvolution";

const BOOT_LINES = [
  "C:\\creator> season1.exe --generate-question",
  "world state 업데이트 중...",
  "narrative graph 동기화 중...",
  "다음 갈등 생성 중...",
  "선택지 렌더링 중...",
  "캔버스 레이어 준비 중...",
];

const TICK_MESSAGES = [
  "world state 업데이트 중",
  "다음 갈등 생성 중",
  "선택지 렌더링 중",
  "story blocks 동기화 중",
  "세계 생성 파이프라인 실행 중",
];

type Props = {
  evolutionStage?: UiEvolutionStage;
};

export function WorldGenerationTerminal({ evolutionStage = "terminal" }: Props) {
  const [lineIndex, setLineIndex] = useState(0);
  const [tickIndex, setTickIndex] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const lineTimer = setInterval(() => {
      setLineIndex((i) => (i + 1) % BOOT_LINES.length);
    }, 1400);
    const tickTimer = setInterval(() => {
      setTickIndex((i) => (i + 1) % TICK_MESSAGES.length);
    }, 2200);
    const cursorTimer = setInterval(() => {
      setCursorOn((v) => !v);
    }, 530);
    return () => {
      clearInterval(lineTimer);
      clearInterval(tickTimer);
      clearInterval(cursorTimer);
    };
  }, []);

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
        {BOOT_LINES.slice(0, lineIndex + 1).map((line, i) => (
          <motion.p
            key={`${line}-${i}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: i === lineIndex ? 1 : 0.45, x: 0 }}
            className="leading-relaxed"
            style={{
              color: i === lineIndex ? "var(--cc-accent)" : "var(--cc-text-muted)",
            }}
          >
            <span className="opacity-50">{"> "}</span>
            {line}
          </motion.p>
        ))}
        <p className="mt-2" style={{ color: "var(--cc-accent)" }}>
          {TICK_MESSAGES[tickIndex]}
          <span className="opacity-80">{cursorOn ? "█" : " "}</span>
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={tickIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-center text-xs"
          style={{ color: "var(--cc-text-muted)" }}
        >
          우측 캔버스에 새 카드가 곧 추가됩니다
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
