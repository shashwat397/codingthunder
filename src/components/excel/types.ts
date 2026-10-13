export type ExcelDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ExcelCategory =
  | 'Spreadsheet Foundations'
  | 'Core Formulas & Cell Math'
  | 'Logical & Decision Engines'
  | 'Relational Lookups & References'
  | 'Text Normalization & Cleansing'
  | 'Temporal & SLA Tracking'
  | 'Data Integrity & Validation'
  | 'Aggregation & Dashboards'
  | 'Modern Dynamic Arrays & Lambda'
  | 'Automation & Power Query'
  | 'Mastery & Interview Guide';

export interface ExcelChapter {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  category: ExcelCategory;
  readTime: string;
  difficulty: ExcelDifficulty;
  summary: string;
  subtopics: string[];
}
