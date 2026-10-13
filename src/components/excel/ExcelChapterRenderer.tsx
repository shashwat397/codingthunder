import React from 'react';
import { Chapter1Content, Chapter2Content, Chapter3Content, Chapter4Content } from './chapters/Chapter1To4.tsx';
import { Chapter5Content, Chapter6Content, Chapter7Content, Chapter8Content } from './chapters/Chapter5To8.tsx';
import { Chapter9Content, Chapter10Content, Chapter11Content } from './chapters/Chapter9To11.tsx';

interface ExcelChapterRendererProps {
  chapterNumber: number;
}

export const ExcelChapterRenderer: React.FC<ExcelChapterRendererProps> = ({ chapterNumber }) => {
  switch (chapterNumber) {
    case 1:
      return <Chapter1Content />;
    case 2:
      return <Chapter2Content />;
    case 3:
      return <Chapter3Content />;
    case 4:
      return <Chapter4Content />;
    case 5:
      return <Chapter5Content />;
    case 6:
      return <Chapter6Content />;
    case 7:
      return <Chapter7Content />;
    case 8:
      return <Chapter8Content />;
    case 9:
      return <Chapter9Content />;
    case 10:
      return <Chapter10Content />;
    case 11:
      return <Chapter11Content />;
    default:
      return <Chapter1Content />;
  }
};
