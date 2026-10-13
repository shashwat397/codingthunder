export type AnalyticsDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type AnalyticsCategory =
  | 'Analytics Strategy & Lifecycle'
  | 'Spreadsheet Analytics & Modeling'
  | 'Relational Modeling & Core SQL'
  | 'Advanced SQL & Window Functions'
  | 'Applied Statistics & Distributions'
  | 'Data Cleaning & Integrity'
  | 'Exploratory Data Analysis (EDA)'
  | 'Python, Pandas & Vectorization'
  | 'Data Visualization & Cognitive Design'
  | 'Business Intelligence & Power BI'
  | 'Production Case Study: Fraud & Trust'
  | 'Portfolio, Interview & Career Architecture';

export interface AnalyticsChapter {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  category: AnalyticsCategory;
  readTime: string;
  difficulty: AnalyticsDifficulty;
  summary: string;
  subtopics: string[];
}
