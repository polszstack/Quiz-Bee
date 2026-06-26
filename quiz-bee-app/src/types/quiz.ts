export interface QuizQuestion {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizResponse {
  response_code: number;
  results: QuizQuestion[];
}

export interface QuestionWithAnswers {
  question: string;
  category: string;
  difficulty: string;
  answers: string[];
  correctAnswer: string;
  type: string;
}

export interface QuizCategory {
  id: number;
  name: string;
}

export interface PlayerInfo {
  name: string;
  category: number;
  difficulty: string;
}

export interface CategoryResponse {
  trivia_categories: QuizCategory[];
}

export type GameState = 'registration' | 'start' | 'playing' | 'answered' | 'timeout' | 'gameover';

export type Difficulty = 'any' | 'easy' | 'medium' | 'hard';

export interface TimerSettings {
  questionTime: number; // seconds per question
  totalTime: number; // total game time in seconds (0 = no limit)
}