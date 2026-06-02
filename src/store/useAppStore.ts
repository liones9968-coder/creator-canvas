import { create } from "zustand";

export type AppPhase = "intro" | "main";

type AppState = {
  phase: AppPhase;
  enterMain: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  phase: "intro",
  enterMain: () => set({ phase: "main" }),
}));
