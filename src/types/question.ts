export type GeneratedQuestion = {
  question: string;
  choices: string[];
};

export type GenerateQuestionRequest = {
  storyState: unknown;
  stage_instruction: {
    key: string;
    label: string;
    cardType: string;
    instruction: string;
  };
  step: number;
};
