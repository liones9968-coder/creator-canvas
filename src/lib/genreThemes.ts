import type { CSSProperties } from "react";

export type GenreKey =
  | "판타지"
  | "로맨스"
  | "사이버펑크"
  | "무협"
  | "미스터리"
  | "하이브리드";

export type GenreTheme = {
  key: GenreKey;
  panelBg: string;
  panelBorder: string;
  canvasBg: string;
  canvasBorder: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSecondary: string;
  accentGlow: string;
  cardBg: string;
  cardBorder: string;
  buttonHoverBorder: string;
  buttonHoverShadow: string;
};

export const GENRE_THEMES: Record<GenreKey, GenreTheme> = {
  판타지: {
    key: "판타지",
    panelBg: "#2a1f14",
    panelBorder: "#5c4528",
    canvasBg: "#1a1209",
    canvasBorder: "#6b4f1a",
    text: "#e8dcc8",
    textMuted: "#9a8468",
    accent: "#d4a84b",
    accentSecondary: "#8b7355",
    accentGlow: "rgba(212, 168, 75, 0.35)",
    cardBg: "rgba(42, 31, 20, 0.92)",
    cardBorder: "rgba(139, 105, 20, 0.55)",
    buttonHoverBorder: "#d4a84b",
    buttonHoverShadow: "0 0 18px rgba(212, 168, 75, 0.3)",
  },
  로맨스: {
    key: "로맨스",
    panelBg: "#2a0f28",
    panelBorder: "#5c2048",
    canvasBg: "#1a0818",
    canvasBorder: "#7a2858",
    text: "#f5dce8",
    textMuted: "#b87a9a",
    accent: "#e85a7a",
    accentSecondary: "#f4a0b8",
    accentGlow: "rgba(232, 90, 122, 0.35)",
    cardBg: "rgba(42, 15, 40, 0.92)",
    cardBorder: "rgba(232, 90, 122, 0.45)",
    buttonHoverBorder: "#e85a7a",
    buttonHoverShadow: "0 0 18px rgba(244, 160, 184, 0.35)",
  },
  사이버펑크: {
    key: "사이버펑크",
    panelBg: "#0a0a0a",
    panelBorder: "#1a3a3a",
    canvasBg: "#000000",
    canvasBorder: "#0d4a4a",
    text: "#d0f8f8",
    textMuted: "#5a8a8a",
    accent: "#00e5ff",
    accentSecondary: "#ff2d95",
    accentGlow: "rgba(0, 229, 255, 0.4)",
    cardBg: "rgba(5, 5, 8, 0.95)",
    cardBorder: "rgba(0, 229, 255, 0.4)",
    buttonHoverBorder: "#00e5ff",
    buttonHoverShadow: "0 0 20px rgba(0, 229, 255, 0.35), 0 0 8px rgba(255, 45, 149, 0.2)",
  },
  무협: {
    key: "무협",
    panelBg: "#1c1c1e",
    panelBorder: "#3a3232",
    canvasBg: "#121214",
    canvasBorder: "#4a3030",
    text: "#e0dcd8",
    textMuted: "#7a7270",
    accent: "#c41e3a",
    accentSecondary: "#8b2020",
    accentGlow: "rgba(196, 30, 58, 0.35)",
    cardBg: "rgba(28, 28, 30, 0.94)",
    cardBorder: "rgba(196, 30, 58, 0.45)",
    buttonHoverBorder: "#c41e3a",
    buttonHoverShadow: "0 0 18px rgba(196, 30, 58, 0.35)",
  },
  미스터리: {
    key: "미스터리",
    panelBg: "#0f1628",
    panelBorder: "#2a3550",
    canvasBg: "#080c18",
    canvasBorder: "#3a4558",
    text: "#d8dce8",
    textMuted: "#7a8498",
    accent: "#c0c8d8",
    accentSecondary: "#8898b0",
    accentGlow: "rgba(192, 200, 216, 0.3)",
    cardBg: "rgba(15, 22, 40, 0.94)",
    cardBorder: "rgba(136, 152, 176, 0.4)",
    buttonHoverBorder: "#a8b8d0",
    buttonHoverShadow: "0 0 16px rgba(192, 200, 216, 0.25)",
  },
  하이브리드: {
    key: "하이브리드",
    panelBg: "#14121f",
    panelBorder: "#3d2a5c",
    canvasBg: "#0a0812",
    canvasBorder: "#2a4060",
    text: "#e8e4f0",
    textMuted: "#8a82a0",
    accent: "#a78bfa",
    accentSecondary: "#22d3ee",
    accentGlow: "rgba(167, 139, 250, 0.35)",
    cardBg: "rgba(20, 18, 31, 0.94)",
    cardBorder: "rgba(167, 139, 250, 0.4)",
    buttonHoverBorder: "#a78bfa",
    buttonHoverShadow: "0 0 18px rgba(34, 211, 238, 0.25), 0 0 12px rgba(167, 139, 250, 0.25)",
  },
};

const NEUTRAL_THEME: GenreTheme = {
  key: "하이브리드",
  panelBg: "#18181b",
  panelBorder: "#3f3f46",
  canvasBg: "#09090b",
  canvasBorder: "#27272a",
  text: "#e4e4e7",
  textMuted: "#71717a",
  accent: "#22c55e",
  accentSecondary: "#4ade80",
  accentGlow: "rgba(34, 197, 94, 0.25)",
  cardBg: "rgba(9, 9, 11, 0.9)",
  cardBorder: "rgba(34, 197, 94, 0.35)",
  buttonHoverBorder: "#22c55e",
  buttonHoverShadow: "0 0 16px rgba(34, 197, 94, 0.25)",
};

export function getThemeForGenre(genre: string | undefined): GenreTheme {
  if (!genre) return NEUTRAL_THEME;
  if (genre in GENRE_THEMES) {
    return GENRE_THEMES[genre as GenreKey];
  }
  return GENRE_THEMES["하이브리드"];
}

export function themeToCssVars(theme: GenreTheme): CSSProperties {
  return {
    ["--cc-panel-bg" as string]: theme.panelBg,
    ["--cc-panel-border" as string]: theme.panelBorder,
    ["--cc-canvas-bg" as string]: theme.canvasBg,
    ["--cc-canvas-border" as string]: theme.canvasBorder,
    ["--cc-text" as string]: theme.text,
    ["--cc-text-muted" as string]: theme.textMuted,
    ["--cc-accent" as string]: theme.accent,
    ["--cc-accent-secondary" as string]: theme.accentSecondary,
    ["--cc-accent-glow" as string]: theme.accentGlow,
    ["--cc-card-bg" as string]: theme.cardBg,
    ["--cc-card-border" as string]: theme.cardBorder,
    ["--cc-btn-hover-border" as string]: theme.buttonHoverBorder,
    ["--cc-btn-hover-shadow" as string]: theme.buttonHoverShadow,
  };
}
