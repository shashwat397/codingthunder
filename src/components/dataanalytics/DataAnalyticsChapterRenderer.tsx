import React from 'react';
import {
  Chapter1Content,
  Chapter2Content,
  Chapter3Content,
} from './chapters/Chapter1To3.tsx';
import {
  Chapter4Content,
  Chapter5Content,
  Chapter6Content,
} from './chapters/Chapter4To6.tsx';
import {
  Chapter7Content,
  Chapter8Content,
  Chapter9Content,
} from './chapters/Chapter7To9.tsx';
import {
  Chapter10Content,
  Chapter11Content,
  Chapter12Content,
} from './chapters/Chapter10To12.tsx';

interface DataAnalyticsChapterRendererProps {
  chapterId: string;
}

export const DataAnalyticsChapterRenderer: React.FC<DataAnalyticsChapterRendererProps> = ({ chapterId }) => {
  switch (chapterId) {
    case 'ch-1':
      return <Chapter1Content />;
    case 'ch-2':
      return <Chapter2Content />;
    case 'ch-3':
      return <Chapter3Content />;
    case 'ch-4':
      return <Chapter4Content />;
    case 'ch-5':
      return <Chapter5Content />;
    case 'ch-6':
      return <Chapter6Content />;
    case 'ch-7':
      return <Chapter7Content />;
    case 'ch-8':
      return <Chapter8Content />;
    case 'ch-9':
      return <Chapter9Content />;
    case 'ch-10':
      return <Chapter10Content />;
    case 'ch-11':
      return <Chapter11Content />;
    case 'ch-12':
      return <Chapter12Content />;
    default:
      return <Chapter1Content />;
  }
};
