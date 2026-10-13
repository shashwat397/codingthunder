export type PythonDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type PythonCategory =
  | 'Core Fundamentals'
  | 'Control Flow'
  | 'Functions & Modular Code'
  | 'Data Structures'
  | 'Functional Programming'
  | 'Systems & I/O'
  | 'Object-Oriented Design'
  | 'Advanced Python Engine'
  | 'Ecosystem & Production'
  | 'Interview & Mastery';

export interface PythonChapter {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  category: PythonCategory;
  readTime: string;
  difficulty: PythonDifficulty;
  summary: string;
  subtopics: string[];
}
