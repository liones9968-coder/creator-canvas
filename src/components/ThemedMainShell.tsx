"use client";

import { motion } from "framer-motion";
import { getThemeForGenre, themeToCssVars } from "@/lib/genreThemes";
import { useStoryStore } from "@/store/useStoryStore";
import { useUiEvolution } from "@/hooks/useUiEvolution";
import { ControlRoom } from "./ControlRoom";
import { CreationCanvas } from "./CreationCanvas";

export function ThemedMainShell() {
  const genre = useStoryStore((s) => s.storyState.universe?.genre);
  const theme = getThemeForGenre(genre);
  const { stage: evolutionStage } = useUiEvolution();

  return (
    <motion.div
      key={genre ?? "default"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`cc-themed cc-evolution cc-evolution--${evolutionStage} flex min-h-screen w-full`}
      style={themeToCssVars(theme)}
      data-ui-evolution={evolutionStage}
    >
      <ControlRoom />
      <CreationCanvas />
    </motion.div>
  );
}
