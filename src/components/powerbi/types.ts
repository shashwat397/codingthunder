export type ChapterCategory =
  | 'Foundations'
  | 'ETL & Power Query'
  | 'Data Modeling'
  | 'DAX Calculations'
  | 'Visuals & UX'
  | 'Enterprise Governance';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CalloutBoxData {
  type: 'best-practice' | 'common-mistake' | 'interview-tip' | 'business-scenario';
  title: string;
  content: string;
}

export interface ComparisonTableData {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface CodeSnippetData {
  title: string;
  language: 'dax' | 'powerquery' | 'sql' | 'json';
  code: string;
  explanation: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  category: ChapterCategory;
  readTime: string;
  difficulty: DifficultyLevel;
  summary: string;
  subtopics: string[];
}
