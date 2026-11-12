export type QuestionType = 'multiple_choice' | 'short_answer' | 'word_arrange' | 'guess';

export type Category = 'vocabulary' | 'grammar' | 'arrange' | 'translate' | 'complete' | 'guess';

export type Level = 1 | 2 | 3;

export interface Choice {
  id: string;
  text: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  type: QuestionType;
  category: Category;
  question: string;
  choices?: Choice[];
  tiles?: string[];
  clue?: string;
  level: Level;
}

export interface ItemWithAnswers extends Item {
  acceptedAnswers: string[];
}

export type Answer = string | string[];

export interface Attempt {
  id: string;
  userId: string;
  itemId: string;
  answer: Answer;
  isCorrect: boolean;
  correctAnswer: string;
  pointsEarned: number;
  createdAt: string;
  item?: {
    id: string;
    name: string;
    price: number;
    level: Level;
    type: QuestionType;
    category: Category;
  };
}

export interface User {
  id: string;
  username: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  totalPoints: number;
  correctCount: number;
  answeredCount: number;
  isCurrentUser?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  enterName: (name: string) => Promise<User>;
  getCurrentUser: () => Promise<User | null>;
  logout: () => Promise<void>;
  subscribeAuth: (callback: (user: User | null) => void) => () => void;
}

export interface ProgressState {
  attempts: Attempt[];
  totalPoints: number;
  accuracy: number;
  isLoading: boolean;
  submitAnswer: (userId: string, itemId: string, answer: Answer) => Promise<Attempt>;
  getMyAttempts: () => Promise<Attempt[]>;
  getHistory: (userId: string) => Promise<Attempt[]>;
  refreshProgress: () => Promise<void>;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}