"use client";

import { useMemo } from "react";

type Props = {
  content: string;
  isFallback?: boolean;
};

export function EnsembleDocument({ content, isFallback = false }: Props) {
  const sections = useMemo(() => {
    return content.split(/\n(?=## )/).map((section) => {
      const lines = section.trim().split("\n");
      const heading = lines[0]?.replace(/^## /, "").trim() ?? "";
      const body = lines.slice(1).join("\n").trim();
      return { heading, body };
    });
  }, [content]);

  return (
    <div className="flex flex-col gap-5">
      {isFallback && (
        <p
          className="font-mono text-xs"
          style={{ color: "var(--cc-text-muted)" }}
        >
          * AI 생성에 실패하여 기본 구조로 표시됩니다.
        </p>
      )}
      {sections.map((s, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          {s.heading && (
            <h4
              className="font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--cc-accent-secondary)" }}
            >
              {s.heading}
            </h4>
          )}
          {s.body && (
            <p
              className="font-mono text-xs leading-relaxed whitespace-pre-wrap"
              style={{ color: "var(--cc-text)" }}
            >
              {s.body}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
