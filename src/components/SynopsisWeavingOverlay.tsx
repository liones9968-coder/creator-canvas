"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const MESSAGES = [
  "선택한 세계를 하나의 서사로 엮는 중...",
  "story blocks collected...",
  "weaving narrative structure...",
  "generating synopsis...",
];

export function SynopsisWeavingOverlay() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="cc-synopsis-weave-overlay absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 px-8"
      style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
      }}
    >
      <motion.div
        className="h-32 w-full max-w-md rounded-lg border border-dashed"
        style={{
          borderColor: "var(--cc-accent)",
          background:
            "linear-gradient(110deg, transparent 40%, var(--cc-accent-glow) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["200% 0", "-200% 0"],
          boxShadow: [
            `0 0 20px var(--cc-accent-glow)`,
            `0 0 40px var(--cc-accent-glow)`,
            `0 0 20px var(--cc-accent-glow)`,
          ],
        }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
      />

      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-center font-mono text-sm"
          style={{ color: "var(--cc-accent)" }}
        >
          {MESSAGES[index]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
