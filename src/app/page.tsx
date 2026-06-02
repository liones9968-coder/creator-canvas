"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { ThemedMainShell } from "@/components/ThemedMainShell";
import { useAppStore } from "@/store/useAppStore";

const INTRO_PROMPT =
  "C:\\> 지금 새로운 세계를 만들어 보시겠습니까? (Y/N)";

function IntroView() {
  const enterMain = useAppStore((s) => s.enterMain);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "y" || e.key === "Y") {
        enterMain();
      }
    },
    [enterMain],
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
      className="flex min-h-screen flex-col items-center justify-center bg-black px-6"
    >
      <p className="font-mono text-lg text-green-500 sm:text-xl md:text-2xl">
        {INTRO_PROMPT}
        <span
          className="inline-block w-[0.6em] text-green-400"
          aria-hidden
        >
          {cursorVisible ? "█" : " "}
        </span>
      </p>
      <p className="mt-8 font-mono text-sm text-green-700/80">
        [ Y ] 키를 눌러 시작하세요
      </p>
    </motion.div>
  );
}

export default function Home() {
  const phase = useAppStore((s) => s.phase);

  return (
    <AnimatePresence mode="wait">
      {phase === "intro" ? <IntroView /> : <ThemedMainShell />}
    </AnimatePresence>
  );
}
