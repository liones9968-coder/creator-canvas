"use client";

import { motion } from "framer-motion";

export function CanvasPendingCard() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: [0.35, 0.7, 0.35], y: 0 }}
      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      className="cc-pending-card w-full shrink-0 rounded-lg border border-dashed px-3 py-4"
      style={{
        borderColor: "var(--cc-accent)",
        background: "var(--cc-card-bg)",
        boxShadow: `0 0 24px var(--cc-accent-glow)`,
      }}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: "var(--cc-accent-secondary)" }}
      >
        incoming block
      </p>
      <p
        className="mt-2 font-mono text-sm"
        style={{ color: "var(--cc-accent)" }}
      >
        새 서사 조각 렌더링 중...
      </p>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full"
        style={{ background: "var(--cc-panel-border)" }}
      >
        <motion.div
          className="h-full w-1/3 rounded-full"
          style={{ background: "var(--cc-accent)" }}
          animate={{ x: ["-100%", "320%"] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
