"use client";

import { motion } from "framer-motion";
import type { GenreKey } from "@/lib/genreThemes";

type Props = {
  genre: GenreKey | string | undefined;
  intensity: number;
};

function CyberDebris({ index }: { index: number }) {
  const positions = [
    "top-4 right-6",
    "bottom-8 left-4",
    "top-1/3 right-12",
    "bottom-1/4 left-8",
    "top-2/3 right-4",
    "bottom-12 right-1/4",
  ];
  const pos = positions[index % positions.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 0.35, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.8 }}
      className={`pointer-events-none absolute ${pos}`}
    >
      <svg
        width={40 + (index % 3) * 12}
        height={40 + (index % 2) * 8}
        viewBox="0 0 48 48"
        fill="none"
        className="text-[var(--cc-accent)]"
      >
        <rect
          x="4"
          y="8"
          width="28"
          height="6"
          fill="currentColor"
          opacity="0.6"
        />
        <rect
          x="12"
          y="20"
          width="20"
          height="4"
          fill="var(--cc-accent-secondary)"
          opacity="0.5"
        />
        <path
          d="M8 32 L36 28 L32 40 Z"
          fill="currentColor"
          opacity="0.35"
        />
      </svg>
    </motion.div>
  );
}

function GlitchBand({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.12, 0, 0.08, 0] }}
      transition={{
        repeat: Infinity,
        duration: 2 + index * 0.4,
        delay: index * 0.3,
      }}
      className="pointer-events-none absolute left-0 right-0 h-px"
      style={{
        top: `${12 + index * 14}%`,
        background:
          "linear-gradient(90deg, transparent, var(--cc-accent), var(--cc-accent-secondary), transparent)",
        filter: "blur(1px)",
      }}
    />
  );
}

export function GenreAmbientEffects({ genre, intensity }: Props) {
  if (!genre || intensity < 1) return null;

  const count = Math.min(intensity, 6);

  if (genre === "사이버펑크") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <CyberDebris key={`debris-${i}`} index={i} />
        ))}
        {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
          <GlitchBand key={`glitch-${i}`} index={i} />
        ))}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, var(--cc-accent) 0px, transparent 1px, transparent 3px)",
          }}
          animate={{ opacity: [0.02, 0.06, 0.02] }}
          transition={{ repeat: Infinity, duration: 0.15 }}
        />
      </div>
    );
  }

  if (genre === "판타지") {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 80%, var(--cc-accent) 0%, transparent 50%)",
        }}
      />
    );
  }

  if (genre === "로맨스") {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 70% 20%, var(--cc-accent-glow), transparent 45%)",
        }}
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
    );
  }

  if (genre === "무협") {
    return (
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 opacity-25"
        style={{
          background:
            "linear-gradient(to top, var(--cc-accent-secondary), transparent)",
        }}
      />
    );
  }

  if (genre === "미스터리") {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, var(--cc-canvas-bg) 100%)",
        }}
      />
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "conic-gradient(from 180deg at 50% 50%, var(--cc-accent-glow), transparent, var(--cc-accent-secondary))",
        opacity: 0.08,
      }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
    />
  );
}
