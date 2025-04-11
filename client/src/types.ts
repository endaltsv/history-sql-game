export interface Case {
  id: string;
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
  xpReward: number;
  completed: boolean;
  isNew: boolean;
  category: "beginner" | "intermediate" | "advanced" | "expert";
  brief: string;
  objectives: string[];
  solution: {
    answer: string;
    successMessage: string;
    explanation: string;
  };
  subCases?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}
