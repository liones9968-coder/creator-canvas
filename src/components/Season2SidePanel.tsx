"use client";

import { BookOpen, Copy, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
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
  "flex w-full shrink-0 flex-col border-t overflow-y-auto md:w-[280px] md:border-t-0 md:border-l";

type Props = {
  mode: SidePanelMode;
  selectedNode: RelationNode | null;
  currentStep: number;
  ensembleError?: string | null;
  onCloseNode?: () => void;
  collapsible?: boolean;
  expanded?: boolean;
  onToggleExpanded?: () => void;
};

function sidePanelCollapsedLabel(
  mode: SidePanelMode,
  selectedNode: RelationNode | null,
): string {
  if (mode === "node" && selectedNode) {
    return `${roleLabel(selectedNode.id)} · ${nodePanelTitle(selectedNode)}`;
  }
  if (mode === "ensemble") return "성좌 개요서";
  return "Season 1 · 창세록";
}

function PanelShell({
  collapsible,
  expanded,
  onToggleExpanded,
  collapsedLabel,
  children,
  className = "",
}: {
  collapsible?: boolean;
  expanded?: boolean;
  onToggleExpanded?: () => void;
  collapsedLabel: string;
  children: ReactNode;
  className?: string;
}) {
  const panelStyle = {
    background: "var(--cc-panel-bg)",
    borderColor: "var(--cc-panel-border)",
  };

  if (collapsible) {
    return (
      <section
        className={`sticky bottom-0 z-10 w-full shrink-0 border-t ${className}`}
        style={panelStyle}
      >
        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 font-mono text-xs"
          aria-expanded={expanded}
        >
          <span
            className="truncate text-left"
            style={{ color: "var(--cc-text)" }}
          >
            {collapsedLabel}
          </span>
          <span className="shrink-0" style={{ color: "var(--cc-text-muted)" }}>
            {expanded ? "▲" : "▼"}
          </span>
        </button>
        {expanded ? (
          <div
            className="max-h-[min(50vh,28rem)] overflow-y-auto border-t"
            style={{ borderColor: "var(--cc-panel-border)" }}
          >
            {children}
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <aside
      className={`${SIDE_PANEL_CLASS} ${className}`.trim()}
      style={panelStyle}
    >
      {children}
    </aside>
  );
}

export function Season2SidePanel({
  mode,
  selectedNode,
  currentStep,
  ensembleError: layoutEnsembleError,
  onCloseNode,
  collapsible,
  expanded,
  onToggleExpanded,
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

  const collapsedLabel = sidePanelCollapsedLabel(mode, selectedNode);

  const shell = (children: ReactNode, className?: string) => (
    <PanelShell
      collapsible={collapsible}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      collapsedLabel={collapsedLabel}
      className={className}
    >
      {children}
    </PanelShell>
  );

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
    return shell(
      <div className="flex flex-col gap-3 p-4">
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
      </div>,
    );
  }

  if (mode === "ensemble") {
    if (isGeneratingEnsemble && !ensemble) {
      return shell(
        <div className="p-4">
          <h3
            className="font-mono text-sm font-semibold"
            style={{ color: "var(--cc-accent)" }}
          >
            성좌 개요서 합성 중
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
        </div>,
      );
    }

    if (ensembleViewActive && ensemble) {
      return shell(
        <>
          <div
            className="shrink-0 border-b p-3"
            style={{ borderColor: "var(--cc-panel-border)" }}
          >
            <h3
              className="font-mono text-sm font-semibold"
              style={{ color: "var(--cc-accent)" }}
            >
              성좌 개요서
            </h3>
            <p
              className="mt-0.5 font-mono text-[10px]"
              style={{ color: "var(--cc-text-muted)" }}
            >
              {ensemble.content.length.toLocaleString()}자
            </p>
          </div>
          <div className="p-3">
            <EnsembleDocument
              content={ensemble.content}
              isFallback={ensemble.isFallback}
            />
          </div>
          {ensembleError && (
            <p className="px-3 font-mono text-xs text-red-400">
              {ensembleError}
            </p>
          )}
          <div
            className="flex flex-col gap-2 border-t p-3"
            style={{ borderColor: "var(--cc-panel-border)" }}
          >
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="cc-choice-btn rounded-md border px-2 py-1.5 font-mono text-xs"
              style={{
                borderColor: "var(--cc-accent)",
                color: "var(--cc-accent)",
              }}
            >
              <Copy className="mr-1 inline h-3 w-3" />
              {copyDone ? "복사됨" : "복사하기"}
            </button>
            <button
              type="button"
              onClick={() => void handleRegenerateEnsemble()}
              disabled={isGeneratingEnsemble}
              className="cc-choice-btn rounded-md border px-2 py-1.5 font-mono text-xs disabled:opacity-50"
              style={{
                borderColor: "var(--cc-panel-border)",
                color: "var(--cc-text)",
              }}
            >
              <RefreshCw className="mr-1 inline h-3 w-3" />
              다시 만들기
            </button>
            <button
              type="button"
              disabled
              className="rounded-md border px-2 py-1.5 font-mono text-xs opacity-45"
              style={{
                borderColor: "var(--cc-panel-border)",
                color: "var(--cc-text-muted)",
              }}
            >
              Season 3 준비중
            </button>
          </div>
        </>,
        collapsible ? "" : "min-h-0 flex-1",
      );
    }

    return shell(
      <div className="p-4">
        <p
          className="font-mono text-xs"
          style={{ color: "var(--cc-text-muted)" }}
        >
          성좌 개요서를 생성합니다.
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
          {isGeneratingEnsemble ? "생성 중..." : "성좌 개요서 생성"}
        </button>
      </div>,
    );
  }

  return shell(
    <>
      <div
        className="border-b p-3"
        style={{ borderColor: "var(--cc-panel-border)" }}
      >
        <p
          className="font-mono text-[10px] tracking-wider uppercase"
          style={{ color: "var(--cc-text-muted)" }}
        >
          Season 1 · 창세록
        </p>
      </div>
      <div className="p-3">
        {synopsis ? (
          <SynopsisDocument
            content={synopsis}
            isFallback={synopsisIsFallback}
          />
        ) : (
          <p
            className="font-mono text-xs leading-relaxed"
            style={{ color: "var(--cc-text-muted)" }}
          >
            창세록이 없습니다. Season 1 완료 후 창세록을 열람하세요.
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
    </>,
    collapsible ? "" : "min-h-0 flex-1",
  );
}
