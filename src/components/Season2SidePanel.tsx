"use client";

import { BookOpen, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { EnsembleDocument } from "@/components/EnsembleDocument";
import { SynopsisDocument } from "@/components/SynopsisDocument";
import { runEnsembleGeneration } from "@/lib/ensembleClient";
import {
  nodePanelTitle,
  roleLabel,
  type RelationNode,
} from "@/lib/relationGraph";
import { SEASON2_BRIDGE_STEP } from "@/lib/stageInstructions";
import { useStoryStore } from "@/store/useStoryStore";

export type SidePanelMode = "synopsis" | "ensemble" | "node";

const SIDE_PANEL_CLASS =
  "flex w-[280px] shrink-0 flex-col border-l overflow-y-auto";

type Props = {
  mode: SidePanelMode;
  selectedNode: RelationNode | null;
  currentStep: number;
  ensembleError?: string | null;
  onCloseNode?: () => void;
};

export function Season2SidePanel({
  mode,
  selectedNode,
  currentStep,
  ensembleError: layoutEnsembleError,
  onCloseNode,
}: Props) {
  const synopsis = useStoryStore((s) => s.synopsis);
  const synopsisIsFallback = useStoryStore((s) => s.synopsisIsFallback);
  const isGeneratingEnsemble = useStoryStore((s) => s.isGeneratingEnsemble);
  const ensemble = useStoryStore((s) => s.ensemble);
  const ensembleViewActive = useStoryStore((s) => s.ensembleViewActive);
  const clearEnsemble = useStoryStore((s) => s.clearEnsemble);

  const [localEnsembleError, setLocalEnsembleError] = useState<string | null>(
    null,
  );
  const ensembleError = layoutEnsembleError ?? localEnsembleError;
  const [copyDone, setCopyDone] = useState(false);

  const handleOpenEnsemble = async () => {
    setLocalEnsembleError(null);
    const errMsg = await runEnsembleGeneration();
    if (errMsg) setLocalEnsembleError(errMsg);
  };

  const handleRegenerateEnsemble = async () => {
    setLocalEnsembleError(null);
    clearEnsemble();
    const errMsg = await runEnsembleGeneration();
    if (errMsg) setLocalEnsembleError(errMsg);
  };

  const handleCopy = async () => {
    if (!ensemble?.content) return;
    try {
      await navigator.clipboard.writeText(ensemble.content);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setLocalEnsembleError("클립보드 복사에 실패했습니다.");
    }
  };

  if (mode === "node" && selectedNode) {
    return (
      <aside
        className={SIDE_PANEL_CLASS}
        style={{
          background: "var(--cc-panel-bg)",
          borderColor: "var(--cc-panel-border)",
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
          <button
            type="button"
            onClick={onCloseNode}
            className="self-end font-mono text-xs"
            style={{ color: "var(--cc-text-muted)" }}
          >
            ✕
          </button>
          <p
            className="font-mono text-[9px] tracking-wider uppercase"
            style={{ color: "var(--cc-text-muted)" }}
          >
            {roleLabel(selectedNode.id)}
          </p>
          <p
            className="break-words font-mono text-sm font-semibold leading-snug whitespace-normal"
            style={{ color: "var(--cc-accent)" }}
          >
            {nodePanelTitle(selectedNode)}
          </p>
          {selectedNode.subLabel && (
            <div>
              <p
                className="mb-1 font-mono text-[9px] tracking-wider uppercase"
                style={{ color: "var(--cc-text-muted)" }}
              >
                핵심 동기
              </p>
              <p
                className="break-words font-mono text-xs leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--cc-text)" }}
              >
                {selectedNode.subLabel}
              </p>
            </div>
          )}
          {selectedNode.rawAnswer &&
            selectedNode.rawAnswer.trim() !==
              nodePanelTitle(selectedNode).trim() && (
            <div>
              <p
                className="mb-1 font-mono text-[9px] tracking-wider uppercase"
                style={{ color: "var(--cc-text-muted)" }}
              >
                선택한 답변
              </p>
              <p
                className="break-words font-mono text-xs leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--cc-text)" }}
              >
                {selectedNode.rawAnswer}
              </p>
            </div>
          )}
          {selectedNode.marker && (
            <div
              className="rounded border px-2 py-1.5"
              style={{ borderColor: "#f87171" }}
            >
              <p className="font-mono text-[9px] text-red-400">
                {selectedNode.marker === "betrayal"
                  ? "⚠ 배신 후보"
                  : "⚠ 희생 후보"}
              </p>
            </div>
          )}
        </div>
      </aside>
    );
  }

  if (mode === "ensemble") {
    if (isGeneratingEnsemble && !ensemble) {
      return (
        <aside
          className={`${SIDE_PANEL_CLASS} p-4`}
          style={{
            background: "var(--cc-panel-bg)",
            borderColor: "var(--cc-panel-border)",
          }}
        >
          <h3
            className="font-mono text-sm font-semibold"
            style={{ color: "var(--cc-accent)" }}
          >
            군상 개요서 합성 중
          </h3>
          <p
            className="mt-2 font-mono text-xs"
            style={{ color: "var(--cc-text-muted)" }}
          >
            인물과 세력을 엮는 중...
          </p>
          <div
            className="mt-4 h-1.5 overflow-hidden rounded-full"
            style={{ background: "var(--cc-panel-border)" }}
          >
            <div
              className="h-full w-1/3 animate-pulse rounded-full"
              style={{ background: "var(--cc-accent)" }}
            />
          </div>
        </aside>
      );
    }

    if (ensembleViewActive && ensemble) {
      return (
        <aside
          className={SIDE_PANEL_CLASS}
          style={{
            background: "var(--cc-panel-bg)",
            borderColor: "var(--cc-panel-border)",
          }}
        >
          <div className="shrink-0 border-b p-3" style={{ borderColor: "var(--cc-panel-border)" }}>
            <h3
              className="font-mono text-sm font-semibold"
              style={{ color: "var(--cc-accent)" }}
            >
              군상 개요서
            </h3>
            <p
              className="mt-0.5 font-mono text-[10px]"
              style={{ color: "var(--cc-text-muted)" }}
            >
              {ensemble.content.length.toLocaleString()}자
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <EnsembleDocument
              content={ensemble.content}
              isFallback={ensemble.isFallback}
            />
          </div>
          {ensembleError && (
            <p className="px-3 font-mono text-xs text-red-400">{ensembleError}</p>
          )}
          <div className="flex shrink-0 flex-col gap-2 border-t p-3" style={{ borderColor: "var(--cc-panel-border)" }}>
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="cc-choice-btn rounded-md border px-2 py-1.5 font-mono text-xs"
              style={{ borderColor: "var(--cc-accent)", color: "var(--cc-accent)" }}
            >
              <Copy className="mr-1 inline h-3 w-3" />
              {copyDone ? "복사됨" : "복사하기"}
            </button>
            <button
              type="button"
              onClick={() => void handleRegenerateEnsemble()}
              disabled={isGeneratingEnsemble}
              className="cc-choice-btn rounded-md border px-2 py-1.5 font-mono text-xs disabled:opacity-50"
              style={{ borderColor: "var(--cc-panel-border)", color: "var(--cc-text)" }}
            >
              <RefreshCw className="mr-1 inline h-3 w-3" />
              다시 만들기
            </button>
            <button
              type="button"
              disabled
              className="rounded-md border px-2 py-1.5 font-mono text-xs opacity-45"
              style={{ borderColor: "var(--cc-panel-border)", color: "var(--cc-text-muted)" }}
            >
              Season 3 준비중
            </button>
          </div>
        </aside>
      );
    }

    return (
      <aside
        className={`${SIDE_PANEL_CLASS} p-4`}
        style={{
          background: "var(--cc-panel-bg)",
          borderColor: "var(--cc-panel-border)",
        }}
      >
        <p
          className="font-mono text-xs"
          style={{ color: "var(--cc-text-muted)" }}
        >
          군상 개요서를 생성합니다.
        </p>
        {ensembleError && (
          <p className="mt-2 font-mono text-xs text-red-400">{ensembleError}</p>
        )}
        <button
          type="button"
          onClick={() => void handleOpenEnsemble()}
          disabled={isGeneratingEnsemble}
          className="cc-choice-btn mt-3 flex items-center justify-center gap-2 rounded-md border px-3 py-2 font-mono text-xs disabled:opacity-60"
          style={{
            borderColor: "var(--cc-accent)",
            color: "var(--cc-accent)",
          }}
        >
          <BookOpen className="h-3.5 w-3.5" />
          {isGeneratingEnsemble ? "생성 중..." : "군상 개요서 생성"}
        </button>
      </aside>
    );
  }

  return (
    <aside
      className={SIDE_PANEL_CLASS}
      style={{
        background: "var(--cc-panel-bg)",
        borderColor: "var(--cc-panel-border)",
      }}
    >
      <div className="border-b p-3" style={{ borderColor: "var(--cc-panel-border)" }}>
        <p
          className="font-mono text-[10px] tracking-wider uppercase"
          style={{ color: "var(--cc-text-muted)" }}
        >
          Season 1 · 시놉시스
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {synopsis ? (
          <SynopsisDocument content={synopsis} isFallback={synopsisIsFallback} />
        ) : (
          <p
            className="font-mono text-xs leading-relaxed"
            style={{ color: "var(--cc-text-muted)" }}
          >
            시놉시스가 없습니다. Season 1 완료 후 시놉시스를 생성해주세요.
          </p>
        )}
      </div>
      {currentStep === SEASON2_BRIDGE_STEP && (
        <div
          className="shrink-0 border-t p-3 font-mono text-xs opacity-60"
          style={{
            borderColor: "var(--cc-panel-border)",
            color: "var(--cc-text-muted)",
          }}
        >
          Season 3 준비중
        </div>
      )}
    </aside>
  );
}
