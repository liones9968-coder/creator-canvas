"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Season2CenterPanel } from "@/components/Season2CenterPanel";
import {
  Season2SidePanel,
  type SidePanelMode,
} from "@/components/Season2SidePanel";
import {
  buildRelationGraph,
  nodeCardSubLabel,
  nodeCardTitle,
  roleLabel,
  type RelationNode,
} from "@/lib/relationGraph";
import {
  getStageForStep,
  isBridgeStep,
  SEASON2_BRIDGE_STEP,
} from "@/lib/stageInstructions";
import { runEnsembleGeneration } from "@/lib/ensembleClient";
import { useStoryStore } from "@/store/useStoryStore";

type SlotConfig = {
  id: string | null;
  emptyLabel: string;
};

const LEFT_SLOTS: SlotConfig[] = [
  { id: "ally", emptyLabel: "조연" },
  { id: "faction1", emptyLabel: "세력 1" },
  { id: "beloved", emptyLabel: "사랑받는 인물" },
];

const RIGHT_SLOTS: SlotConfig[] = [
  { id: "opponent", emptyLabel: "적대자" },
  { id: "faction2", emptyLabel: "세력 2" },
  { id: null, emptyLabel: "???" },
];

/** 모바일 2열 그리드 순서 */
const MOBILE_GRID_SLOTS: SlotConfig[] = [
  LEFT_SLOTS[0],
  RIGHT_SLOTS[0],
  LEFT_SLOTS[1],
  RIGHT_SLOTS[1],
  LEFT_SLOTS[2],
  RIGHT_SLOTS[2],
];

function CharacterSlot({
  node,
  emptyLabel,
  onSelect,
}: {
  node: RelationNode | null;
  emptyLabel: string;
  onSelect: (node: RelationNode) => void;
}) {
  if (!node) {
    return (
      <div
        className="rounded-md border border-dashed px-3 py-4 font-mono text-xs opacity-30"
        style={{
          borderColor: "var(--cc-panel-border)",
          color: "var(--cc-text-muted)",
        }}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(node)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(node);
        }
      }}
      className="cursor-pointer rounded-md border px-3 py-4 font-mono text-xs"
      style={{
        background: "var(--cc-card-bg)",
        borderColor:
          node.type === "faction"
            ? "var(--cc-panel-border)"
            : "var(--cc-accent-secondary)",
      }}
    >
      <p
        className="mb-1 text-[9px] tracking-wider uppercase"
        style={{ color: "var(--cc-text-muted)" }}
      >
        {roleLabel(node.id)}
      </p>
      <p
        className="truncate text-sm font-semibold leading-snug"
        style={{ color: "var(--cc-text)" }}
        title={node.label}
      >
        {nodeCardTitle(node)}
      </p>
      {node.subLabel && (
        <p
          className="mt-1 truncate text-[10px] leading-snug"
          style={{ color: "var(--cc-text-muted)" }}
          title={node.subLabel}
        >
          {nodeCardSubLabel(node)}
        </p>
      )}
      {node.marker && (
        <span className="mt-1 block text-[9px] text-red-400">
          ⚠ {node.marker === "betrayal" ? "배신 후보" : "희생 후보"}
        </span>
      )}
    </motion.div>
  );
}

function CharacterColumn({
  slots,
  nodeMap,
  onSelectNode,
}: {
  slots: SlotConfig[];
  nodeMap: Map<string, RelationNode>;
  onSelectNode: (node: RelationNode) => void;
}) {
  return (
    <div className="hidden w-[15%] shrink-0 flex-col justify-center gap-4 overflow-hidden px-3 py-4 md:flex">
      {slots.map((slot) => (
        <CharacterSlot
          key={slot.id ?? slot.emptyLabel}
          node={slot.id ? (nodeMap.get(slot.id) ?? null) : null}
          emptyLabel={slot.emptyLabel}
          onSelect={onSelectNode}
        />
      ))}
    </div>
  );
}

function Season2Header({
  worldName,
  currentStep,
  stepLabel,
}: {
  worldName: string | null;
  currentStep: number;
  stepLabel: string;
}) {
  return (
    <header
      className="flex shrink-0 flex-col gap-1 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
      style={{ borderColor: "var(--cc-panel-border)" }}
    >
      <h2 className="truncate font-mono text-xs font-semibold tracking-wide sm:text-sm">
        {worldName ?? "Season 2"} · 성좌
      </h2>
      <span
        className="truncate font-mono text-[11px] sm:text-xs"
        style={{ color: "var(--cc-text-muted)" }}
      >
        STEP {currentStep}
        {stepLabel ? ` · ${stepLabel}` : ""}
      </span>
    </header>
  );
}

function Season2SidePanelSlot(props: {
  mode: SidePanelMode;
  selectedNode: RelationNode | null;
  currentStep: number;
  ensembleError: string | null;
  onCloseNode: () => void;
  collapsible: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  return (
    <Season2SidePanel
      mode={props.mode}
      selectedNode={props.selectedNode}
      currentStep={props.currentStep}
      ensembleError={props.ensembleError}
      onCloseNode={props.onCloseNode}
      collapsible={props.collapsible}
      expanded={props.expanded}
      onToggleExpanded={props.onToggleExpanded}
    />
  );
}

export function Season2Layout() {
  const currentStep = useStoryStore((s) => s.currentStep);
  const worldName = useStoryStore((s) => s.worldName);
  const blocks = useStoryStore((s) => s.storyState.blocks);

  const [sidePanelMode, setSidePanelMode] = useState<SidePanelMode>("synopsis");
  const [selectedNode, setSelectedNode] = useState<RelationNode | null>(null);
  const [ensembleError, setEnsembleError] = useState<string | null>(null);
  const [sidePanelExpanded, setSidePanelExpanded] = useState(false);

  const s2Blocks = useMemo(
    () => blocks.filter((b) => b.season === 2),
    [blocks],
  );

  const { nodes } = useMemo(
    () => buildRelationGraph(s2Blocks, worldName),
    [s2Blocks, worldName],
  );

  const nodeMap = useMemo(
    () => new Map(nodes.map((n) => [n.id, n])),
    [nodes],
  );

  const stage = getStageForStep(currentStep);
  const stepLabel = isBridgeStep(currentStep)
    ? currentStep === SEASON2_BRIDGE_STEP
      ? "성좌 완료"
      : "창세 완료"
    : (stage?.label ?? "");

  const openSidePanel = () => setSidePanelExpanded(true);

  const handleSelectNode = (node: RelationNode) => {
    setSelectedNode(node);
    setSidePanelMode("node");
    setSidePanelExpanded(true);
  };

  const handleOpenEnsemble = async () => {
    setSidePanelMode("ensemble");
    setSidePanelExpanded(true);
    setEnsembleError(null);
    const errMsg = await runEnsembleGeneration();
    if (errMsg) setEnsembleError(errMsg);
  };

  const handleCloseNode = () => {
    setSelectedNode(null);
    setSidePanelMode("synopsis");
  };

  const sidePanelProps = {
    mode: sidePanelMode,
    selectedNode,
    currentStep,
    ensembleError,
    onCloseNode: handleCloseNode,
  };

  return (
    <div
      className="flex min-h-dvh w-full flex-col"
      style={{
        background: "var(--cc-canvas-bg)",
        color: "var(--cc-text)",
      }}
    >
      <Season2Header
        worldName={worldName}
        currentStep={currentStep}
        stepLabel={stepLabel}
      />

      {/* 데스크톱: 4열 */}
      <div className="hidden min-h-0 flex-1 flex-row overflow-hidden md:flex">
        <CharacterColumn
          slots={LEFT_SLOTS}
          nodeMap={nodeMap}
          onSelectNode={handleSelectNode}
        />
        <Season2CenterPanel
          setSidePanelMode={(mode) => {
            setSidePanelMode(mode);
            if (mode === "synopsis") openSidePanel();
          }}
          onOpenEnsemble={handleOpenEnsemble}
        />
        <CharacterColumn
          slots={RIGHT_SLOTS}
          nodeMap={nodeMap}
          onSelectNode={handleSelectNode}
        />
        <Season2SidePanelSlot
          {...sidePanelProps}
          collapsible={false}
          expanded
          onToggleExpanded={() => {}}
        />
      </div>

      {/* 모바일: 단일 컬럼 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:hidden">
        <Season2CenterPanel
          setSidePanelMode={(mode) => {
            setSidePanelMode(mode);
            openSidePanel();
          }}
          onOpenEnsemble={handleOpenEnsemble}
        />

        <section
          className="shrink-0 border-t px-3 py-3"
          style={{ borderColor: "var(--cc-panel-border)" }}
        >
          <p
            className="mb-2 font-mono text-[10px] uppercase tracking-wider"
            style={{ color: "var(--cc-text-muted)" }}
          >
            성좌 카드
          </p>
          <div className="grid grid-cols-2 gap-2">
            {MOBILE_GRID_SLOTS.map((slot) => (
              <CharacterSlot
                key={`mobile-${slot.id ?? slot.emptyLabel}`}
                node={slot.id ? (nodeMap.get(slot.id) ?? null) : null}
                emptyLabel={slot.emptyLabel}
                onSelect={handleSelectNode}
              />
            ))}
          </div>
        </section>

        <Season2SidePanelSlot
          {...sidePanelProps}
          collapsible
          expanded={sidePanelExpanded}
          onToggleExpanded={() => setSidePanelExpanded((v) => !v)}
        />
      </div>
    </div>
  );
}
