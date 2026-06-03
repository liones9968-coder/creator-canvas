"use client";

import { Layers } from "lucide-react";
import { useState } from "react";
import { ControlRoom } from "@/components/ControlRoom";
import { CreationCanvas } from "@/components/CreationCanvas";
import { useStoryStore } from "@/store/useStoryStore";

export function Season1Layout() {
  const [canvasOpen, setCanvasOpen] = useState(false);
  const blockCount = useStoryStore((s) => s.storyState.blocks.length);

  return (
    <div className="cc-s1-shell relative flex min-h-0 min-h-dvh w-full flex-1 flex-col md:flex-row">
      <ControlRoom className="min-h-0 flex-1 md:flex-none" />

      <button
        type="button"
        onClick={() => setCanvasOpen((v) => !v)}
        className="cc-mobile-canvas-toggle cc-choice-btn fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-md border px-4 py-3 font-mono text-sm shadow-lg md:hidden"
        style={{
          borderColor: "var(--cc-accent)",
          color: "var(--cc-accent)",
          background: "var(--cc-panel-bg)",
        }}
        aria-expanded={canvasOpen}
        aria-label={canvasOpen ? "질문 패널로 돌아가기" : "창조 캔버스 보기"}
      >
        <Layers className="h-4 w-4" />
        {canvasOpen ? "질문 패널" : `캔버스${blockCount > 0 ? ` (${blockCount})` : ""}`}
      </button>

      <CreationCanvas
        mobileOpen={canvasOpen}
        onCloseMobile={() => setCanvasOpen(false)}
      />
    </div>
  );
}
