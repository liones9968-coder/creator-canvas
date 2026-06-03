"use client";

import { useMemo } from "react";

type Props = {
  content: string;
  isFallback?: boolean;
};

type Section = {
  title: string;
  body: string;
};

function parseSynopsisSections(text: string): Section[] {
  const lines = text.split("\n");
  const sections: Section[] = [];
  let currentTitle = "";
  let currentBody: string[] = [];

  const flush = () => {
    if (currentTitle || currentBody.length) {
      sections.push({
        title: currentTitle || "창세록",
        body: currentBody.join("\n").trim(),
      });
    }
    currentBody = [];
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h1 = line.match(/^#\s+(.+)$/);
    if (h2 || h1) {
      flush();
      currentTitle = (h2?.[1] ?? h1?.[1] ?? "").trim();
      continue;
    }
    if (line.trim() === "---") continue;
    currentBody.push(line);
  }
  flush();

  if (sections.length <= 1 && !sections[0]?.title) {
    return [{ title: "창세록", body: text.trim() }];
  }
  return sections;
}

export function SynopsisDocument({ content, isFallback }: Props) {
  const sections = useMemo(() => parseSynopsisSections(content), [content]);

  return (
    <div className="cc-synopsis-document flex flex-col gap-5">
      {isFallback && (
        <p
          className="rounded border px-3 py-2 font-mono text-[11px]"
          style={{
            borderColor: "var(--cc-panel-border)",
            color: "var(--cc-text-muted)",
            background: "var(--cc-card-bg)",
          }}
        >
          AI 연결 없이 로컬에서 엮은 창세록입니다. 「다시 만들기」로 AI 버전을
          시도할 수 있습니다.
        </p>
      )}

      {sections.map((sec) => (
        <section key={sec.title} className="flex flex-col gap-2">
          <h4
            className="font-mono text-sm font-semibold tracking-wide"
            style={{ color: "var(--cc-accent)" }}
          >
            {sec.title}
          </h4>
          <div
            className="font-mono text-xs leading-[1.75] whitespace-pre-wrap"
            style={{ color: "var(--cc-text)" }}
          >
            {sec.body}
          </div>
        </section>
      ))}
    </div>
  );
}
