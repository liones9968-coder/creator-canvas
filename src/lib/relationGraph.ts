import type { StoryBlock } from "@/store/useStoryStore";

export type NodeType = "protagonist" | "character" | "faction";

export type RelationNode = {
  id: string;
  type: NodeType;
  /** 전체 이름/답변 (패널 표시용) */
  label: string;
  /** 좌우 슬롯 카드용 짧은 표시 */
  shortLabel?: string;
  subLabel?: string;
  rawAnswer?: string;
  marker?: "betrayal" | "sacrifice" | "crack";
  x: number;
  y: number;
};

/** 패널 제목 — 잘리지 않은 전체 텍스트 */
export function nodePanelTitle(node: RelationNode): string {
  if (node.id === "protagonist") {
    return node.rawAnswer?.trim() || node.label;
  }
  return node.label;
}

/** 좌우 슬롯 카드 한 줄 제목 */
export function nodeCardTitle(node: RelationNode, max = 20): string {
  return node.shortLabel ?? snippet(node.label, max);
}

export function nodeCardSubLabel(node: RelationNode, max = 14): string | undefined {
  if (!node.subLabel) return undefined;
  return snippet(node.subLabel, max);
}

export function roleLabel(id: string): string {
  const map: Record<string, string> = {
    protagonist: "주인공",
    ally: "조연",
    opponent: "적대자",
    beloved: "사랑받는 인물",
    faction1: "세력 1",
    faction2: "세력 2",
  };
  return map[id] ?? id;
}

export type RelationEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
  cracked?: boolean;
};

export const NODE_POSITIONS_PCT: Record<string, { x: number; y: number }> = {
  protagonist: { x: 50, y: 48 },
  ally: { x: 30, y: 18 },
  opponent: { x: 70, y: 18 },
  beloved: { x: 30, y: 78 },
  faction1: { x: 15, y: 48 },
  faction2: { x: 85, y: 48 },
};

export function snippet(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
};

function upsertNode(
  nodes: RelationNode[],
  id: string,
  patch: Omit<RelationNode, "id" | "x" | "y"> & { type: NodeType },
): RelationNode[] {
  const pos = NODE_POSITIONS_PCT[id];
  if (!pos) return nodes;
  const idx = nodes.findIndex((n) => n.id === id);
  const base: RelationNode = {
    id,
    x: pos.x,
    y: pos.y,
    label: patch.label,
    type: patch.type,
    subLabel: patch.subLabel,
    shortLabel: patch.shortLabel,
    rawAnswer: patch.rawAnswer,
    marker: patch.marker,
  };
  if (idx === -1) return [...nodes, base];
  const next = [...nodes];
  next[idx] = { ...next[idx], ...patch, x: pos.x, y: pos.y };
  return next;
}

function upsertEdge(
  edges: RelationEdge[],
  edge: RelationEdge,
): RelationEdge[] {
  const idx = edges.findIndex((e) => e.id === edge.id);
  if (idx === -1) return [...edges, edge];
  const next = [...edges];
  next[idx] = { ...next[idx], ...edge };
  return next;
}

function betrayalMarker(answer: string): "betrayal" | "sacrifice" {
  const lower = answer.toLowerCase();
  if (/희생|헌신|바친|내어준/.test(answer) || lower.includes("sacrifice")) {
    return "sacrifice";
  }
  return "betrayal";
}

export function buildRelationGraph(
  blocks: StoryBlock[],
  worldName: string | null,
): { nodes: RelationNode[]; edges: RelationEdge[] } {
  let nodes: RelationNode[] = [
    {
      id: "protagonist",
      type: "protagonist",
      label: worldName?.trim() || "주인공",
      x: NODE_POSITIONS_PCT.protagonist.x,
      y: NODE_POSITIONS_PCT.protagonist.y,
      rawAnswer: worldName?.trim() || undefined,
    },
  ];
  let edges: RelationEdge[] = [];

  for (const block of blocks) {
    const answer = block.rawAnswer.trim();
    switch (block.cardType) {
      case "primary_ally": {
        const full = answer || block.title;
        nodes = upsertNode(nodes, "ally", {
          type: "character",
          label: full,
          shortLabel: snippet(full, 24),
          rawAnswer: answer,
        });
        break;
      }
      case "ally_desire": {
        const ally = nodes.find((n) => n.id === "ally");
        nodes = upsertNode(nodes, "ally", {
          type: "character",
          label: ally?.label || answer || "조연",
          shortLabel: ally?.shortLabel ?? snippet(ally?.label ?? answer, 24),
          subLabel: answer,
          rawAnswer: answer,
        });
        break;
      }
      case "emotional_bond":
        edges = upsertEdge(edges, {
          id: "bond-protagonist-ally",
          from: "protagonist",
          to: "ally",
          label: snippet(answer, 16) || "결속",
        });
        break;
      case "central_opponent": {
        const full = answer || block.title;
        nodes = upsertNode(nodes, "opponent", {
          type: "character",
          label: full,
          shortLabel: snippet(full, 24),
          rawAnswer: answer,
        });
        break;
      }
      case "opponent_belief": {
        const opponent = nodes.find((n) => n.id === "opponent");
        nodes = upsertNode(nodes, "opponent", {
          type: "character",
          label: opponent?.label || answer || "적대자",
          shortLabel:
            opponent?.shortLabel ?? snippet(opponent?.label ?? answer, 24),
          subLabel: answer,
          rawAnswer: answer,
        });
        break;
      }
      case "first_faction": {
        const full = answer || block.title;
        nodes = upsertNode(nodes, "faction1", {
          type: "faction",
          label: full,
          shortLabel: snippet(full, 24),
          rawAnswer: answer,
        });
        break;
      }
      case "faction_secret": {
        const faction1 = nodes.find((n) => n.id === "faction1");
        nodes = upsertNode(nodes, "faction1", {
          type: "faction",
          label: faction1?.label || answer || "세력",
          shortLabel:
            faction1?.shortLabel ?? snippet(faction1?.label ?? answer, 24),
          subLabel: answer,
          rawAnswer: answer,
        });
        break;
      }
      case "counter_faction": {
        const full = answer || block.title;
        nodes = upsertNode(nodes, "faction2", {
          type: "faction",
          label: full,
          shortLabel: snippet(full, 24),
          rawAnswer: answer,
        });
        break;
      }
      case "relationship_triangle":
        edges = upsertEdge(edges, {
          id: "triangle-ally-opponent",
          from: "ally",
          to: "opponent",
          label: snippet(answer, 14) || "대립",
        });
        edges = upsertEdge(edges, {
          id: "triangle-faction1-faction2",
          from: "faction1",
          to: "faction2",
          label: snippet(answer, 14) || "세력 갈등",
        });
        break;
      case "beloved_character": {
        const full = answer || block.title;
        nodes = upsertNode(nodes, "beloved", {
          type: "character",
          label: full,
          shortLabel: snippet(full, 24),
          rawAnswer: answer,
        });
        break;
      }
      case "betrayal_or_sacrifice": {
        const marker = betrayalMarker(answer);
        const targetId = nodes.some((n) => n.id === "beloved")
          ? "beloved"
          : nodes.some((n) => n.id === "ally")
            ? "ally"
            : "opponent";
        const existing = nodes.find((n) => n.id === targetId);
        if (existing) {
          nodes = upsertNode(nodes, targetId, {
            type: existing.type,
            label: existing.label,
            shortLabel: existing.shortLabel,
            subLabel: existing.subLabel,
            rawAnswer: existing.rawAnswer ?? answer,
            marker,
          });
        }
        break;
      }
      case "relationship_crack":
        edges = edges.map((e) => ({
          ...e,
          cracked:
            e.cracked ||
            (e.from === "protagonist" && e.to === "ally") ||
            (e.from === "ally" && e.to === "opponent") ||
            (e.from === "faction1" && e.to === "faction2"),
        }));
        break;
      default:
        break;
    }
  }

  return { nodes, edges };
}
