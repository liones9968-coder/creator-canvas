"use client";

import { applyDevStorySeedToBridge } from "@/lib/devStorySeed";

type Props = {
  onAfterSeed?: () => void;
};

export function DevQuickEntryButton({ onAfterSeed }: Props) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleClick = () => {
    applyDevStorySeedToBridge();
    onAfterSeed?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed right-3 bottom-3 z-[9999] rounded border px-2.5 py-1.5 font-mono text-[10px] tracking-wide shadow-lg transition-colors"
      style={{
        borderColor: "var(--cc-panel-border, rgba(34, 197, 94, 0.35))",
        background: "rgba(0, 0, 0, 0.88)",
        color: "rgba(74, 222, 128, 0.85)",
      }}
      aria-label="개발용: 판타지 더미 데이터로 Season 1 브릿지(Step 18)로 이동"
    >
      [DEV] S2로 점프
    </button>
  );
}
