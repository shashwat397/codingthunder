import React, { useState, useEffect } from 'react';

const TOPICS: readonly string[] = [
  'SQL',
  'Python',
  'Power BI',
  'Tableau',
  'Advanced Excel',
  'Data Analytics',
  'Machine Learning',
  'Data Science',
  'Data Engineering',
  'ETL & Data Pipelines',
  'PySpark & Big Data',
  'Cloud Data Warehousing',
  'Generative AI & LLMs',
];

interface TypewriterHeroProps {
  className?: string;
  align?: 'center' | 'left' | 'responsive';
}

export const TypewriterHero: React.FC<TypewriterHeroProps> = ({ className = '', align = 'center' }) => {
  const [topicIndex, setTopicIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor (|)
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter animation: ~70ms typing, 1.5s pause, ~40ms backspacing
  useEffect(() => {
    const currentWord = TOPICS[topicIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        // Typing next character (~70ms)
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, 70);
      } else {
        // Word complete, pause for 1.5 seconds (1500ms)
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    } else {
      if (displayText.length > 0) {
        // Backspacing previous character (~40ms)
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        }, 40);
      } else {
        // Erasing complete, transition to next topic in infinite sequence
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setTopicIndex((prev) => (prev + 1) % TOPICS.length);
        }, 150);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, topicIndex]);

  const alignmentClasses =
    align === 'responsive'
      ? 'justify-center lg:justify-start'
      : align === 'left'
      ? 'justify-start'
      : 'justify-center';

  return (
    <div
      className={`h-10 sm:h-12 flex items-center ${alignmentClasses} text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight select-none ${className}`}
      aria-label={`Learn ${TOPICS[topicIndex]}`}
    >
      <span className="text-slate-100">Learn&nbsp;</span>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.25)]">
        {displayText}
      </span>
      <span
        className={`inline-block font-mono font-light text-amber-400 ml-0.5 text-xl sm:text-3xl md:text-4xl select-none transition-opacity duration-75 ${
          cursorVisible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        |
      </span>
    </div>
  );
};
