"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { DevQuickEntryButton } from "@/components/DevQuickEntryButton";
import { ThemedMainShell } from "@/components/ThemedMainShell";
import { useAppStore } from "@/store/useAppStore";
import { useStoryStore } from "@/store/useStoryStore";

const INTRO_PROMPT =
  "C:\\> 지금 새로운 세계를 만들어 보시겠습니까? (Y/N)";

function IntroView() {
  const enterMain = useAppStore((s) => s.enterMain);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleStart = useCallback(() => {
    setDeclined(false);
    enterMain();
  }, [enterMain]);

  const handleDecline = useCallback(() => {
    setDeclined(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "y" || e.key === "Y") {
        handleStart();
      }
      if (e.key === "n" || e.key === "N") {
        handleDecline();
      }
    },
    [handleStart, handleDecline],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen min-h-dvh w-full flex-col items-center justify-center gap-8 bg-black px-6 py-10"
    >
      <div className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <p className="font-mono text-lg leading-relaxed text-green-500 sm:text-xl md:text-2xl">
          {INTRO_PROMPT}
          <span
            className="inline-block w-[0.6em] text-green-400"
            aria-hidden
          >
            {cursorVisible ? "█" : " "}
          </span>
        </p>

        <p className="font-mono text-sm text-green-700/90">
          [ Y ] 키를 누르거나, 아래 버튼을 눌러 시작하세요
        </p>
        <p className="font-mono text-xs text-green-800/70">
          [ N ] 키 — 종료 / 대기
        </p>

        {declined && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-sm text-amber-600/90"
          >
            {`C:\\> 세계 생성을 보류합니다. 준비되면 Y 또는 [ Y ] 시작하기를 누르세요.`}
          </motion.p>
        )}

        <button
          type="button"
          onClick={handleStart}
          className="cc-intro-start-btn mt-2 min-h-[3.25rem] min-w-[min(100%,280px)] px-10 py-4 font-mono text-base font-semibold tracking-wide text-green-400 sm:text-lg"
          aria-label="세계 만들기 시작"
        >
          [ Y ] 시작하기
        </button>
        <span className="font-mono text-[11px] text-green-800/60">
          세계 만들기 시작
        </span>
      </div>

    </motion.div>
  );
}

export default function Home() {
  const phase = useAppStore((s) => s.phase);
  const currentStep = useStoryStore((s) => s.currentStep);
  const enterMain = useAppStore((s) => s.enterMain);

  const showDevQuickEntry =
    process.env.NODE_ENV === "development" &&
    (phase === "intro" || (phase === "main" && currentStep === 1));

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === "intro" ? <IntroView /> : <ThemedMainShell />}
      </AnimatePresence>
      {showDevQuickEntry && (
        <DevQuickEntryButton
          onAfterSeed={() => {
            if (useAppStore.getState().phase === "intro") {
              enterMain();
            }
          }}
        />
      )}
    </>
  );
}
