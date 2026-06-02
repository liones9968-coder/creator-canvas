"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/** 질문·선택 UI를 스플릿 경계(화면 중앙) 쪽으로 밀어 중앙 집중감을 준다 */
export function QuestionPanel({ children, className = "" }: Props) {
  return (
    <div className="flex flex-1 justify-center overflow-y-auto px-4 py-6 sm:px-6">
      <div
        className={`cc-question-panel w-full max-w-[400px] sm:max-w-[440px] ${className}`}
        style={{
          marginLeft: "auto",
          marginRight: "clamp(0.5rem, 8vw, 3.5rem)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
