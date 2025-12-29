
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: Difficulty;
}

export interface UserAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export type AppState = 'HOME' | 'DIFFICULTY' | 'QUIZ' | 'RESULTS';

export interface QuizResults {
  score: number;
  total: number;
  answers: UserAnswer[];
  questions: Question[];
}
