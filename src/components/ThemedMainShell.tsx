"use client";

import { motion } from "framer-motion";
import { getThemeForGenre, themeToCssVars } from "@/lib/genreThemes";
import { useStoryStore } from "@/store/useStoryStore";
import { useUiEvolution } from "@/hooks/useUiEvolution";
import { Season1Layout } from "./Season1Layout";
import { Season2Layout } from "./Season2Layout";

export function ThemedMainShell() {
  const genre = useStoryStore((s) => s.storyState.universe?.genre);
  const currentSeason = useStoryStore((s) => s.storyState.currentSeason);
  const theme = getThemeForGenre(genre);
  const { stage: evolutionStage } = useUiEvolution();

  return (
    <motion.div
      key={genre ?? "default"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`cc-themed cc-evolution cc-evolution--${evolutionStage} flex min-h-dvh w-full flex-col`}
      style={themeToCssVars(theme)}
      data-ui-evolution={evolutionStage}
    >
      {currentSeason === 2 ? (
        <Season2Layout />
      ) : (
        <Season1Layout />
      )}
    </motion.div>
  );
}
