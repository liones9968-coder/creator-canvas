"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { DevQuickEntryButton } from "@/components/DevQuickEntryButton";
import { ThemedMainShell } from "@/components/ThemedMainShell";
import { useAppStore } from "@/store/useAppStore";
import { useStoryStore } from "@/store/useStoryStore";

const BOOT_PROMPT = "C:\\> 새로운 세계를 부팅하시겠습니까? (Y/N)";

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
      className="relative flex min-h-0 min-h-dvh w-full items-center justify-center overflow-y-auto bg-black px-4 py-6 sm:px-6 sm:py-10"
    >
      <div className="flex w-full max-w-lg flex-col gap-3 sm:max-w-xl sm:gap-4">
        <div
          className="space-y-0.5 font-mono text-[10px] leading-snug text-green-600/95 sm:text-xs"
          style={{ textAlign: "left" }}
        >
          <p>SEME WorldShell [Version 0.1.0]</p>
          <p>Copyright (C) SEME Dimension Lab. All rights reserved.</p>
        </div>

        <div
          className="space-y-1.5 font-mono text-[10px] leading-relaxed text-green-700/90 sm:space-y-2 sm:text-xs sm:leading-relaxed"
          style={{ textAlign: "left" }}
        >
          <p>아직 태어나지 않은 세계를 감지하고,</p>
          <p>
            창조자의 선택을 통해 세계관·인물·규칙·결말을 안정화합니다.
          </p>
        </div>

        <div
          className="space-y-1 border-l-2 border-amber-700/50 py-1 pl-2.5 font-mono text-[10px] leading-relaxed text-amber-600/85 sm:text-[11px]"
          style={{ textAlign: "left" }}
        >
          <p className="font-semibold text-amber-500/90">주의:</p>
          <p>세계 생성과 보존에는 마나가 소진됩니다.</p>
          <p>마나는 지구화폐로 충전됩니다. 차원 간 결제는 준비 중입니다.</p>
        </div>

        <p
          className="pt-1 font-mono text-xs leading-snug text-green-500 sm:text-sm md:text-base"
          style={{ textAlign: "left" }}
        >
          {BOOT_PROMPT}
          <span
            className="inline-block w-[0.55em] text-green-400"
            aria-hidden
          >
            {cursorVisible ? "█" : " "}
          </span>
        </p>

        {declined && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[10px] leading-relaxed text-amber-600/90 sm:text-xs"
            style={{ textAlign: "left" }}
          >
            C:\&gt; 부팅을 보류합니다. 준비되면 Y 또는 [ Y ] 세계 부팅을
            선택하세요.
          </motion.p>
        )}

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={handleStart}
            className="cc-intro-start-btn min-h-[2.75rem] w-full px-6 py-3 font-mono text-sm font-semibold tracking-wide text-green-400 sm:min-h-[3rem] sm:flex-1 sm:text-base"
            aria-label="세계 부팅"
          >
            [ Y ] 세계 부팅
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="cc-intro-decline-btn min-h-[2.75rem] w-full px-6 py-3 font-mono text-sm tracking-wide text-green-700/90 sm:min-h-[3rem] sm:flex-1 sm:text-base"
            aria-label="현실에 머무르기"
          >
            [ N ] 현실에 머무르기
          </button>
        </div>
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
