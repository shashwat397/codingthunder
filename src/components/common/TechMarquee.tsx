import React from 'react';
import {
  Database,
  Terminal,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Layers,
  Flame,
  Wind,
  Cloud,
  BrainCircuit,
  Sparkles,
} from 'lucide-react';

interface TechItem {
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderHover: string;
}

const TECH_ITEMS: TechItem[] = [
  { name: 'SQL', category: 'Database', icon: Database, accentColor: 'text-amber-400', borderHover: 'hover:border-amber-500/50 hover:bg-amber-500/10' },
  { name: 'Python', category: 'Language', icon: Terminal, accentColor: 'text-sky-400', borderHover: 'hover:border-sky-500/50 hover:bg-sky-500/10' },
  { name: 'Power BI', category: 'Business Intel', icon: BarChart3, accentColor: 'text-yellow-400', borderHover: 'hover:border-yellow-500/50 hover:bg-yellow-500/10' },
  { name: 'Tableau', category: 'Visualization', icon: PieChart, accentColor: 'text-indigo-400', borderHover: 'hover:border-indigo-500/50 hover:bg-indigo-500/10' },
  { name: 'Advanced Excel', category: 'Spreadsheets', icon: FileSpreadsheet, accentColor: 'text-emerald-400', borderHover: 'hover:border-emerald-500/50 hover:bg-emerald-500/10' },
  { name: 'Pandas', category: 'Data Analysis', icon: Layers, accentColor: 'text-purple-400', borderHover: 'hover:border-purple-500/50 hover:bg-purple-500/10' },
  { name: 'PySpark', category: 'Big Data', icon: Flame, accentColor: 'text-orange-400', borderHover: 'hover:border-orange-500/50 hover:bg-orange-500/10' },
  { name: 'Apache Airflow', category: 'Orchestration', icon: Wind, accentColor: 'text-cyan-400', borderHover: 'hover:border-cyan-500/50 hover:bg-cyan-500/10' },
  { name: 'Snowflake', category: 'Cloud Warehouse', icon: Cloud, accentColor: 'text-blue-400', borderHover: 'hover:border-blue-500/50 hover:bg-blue-500/10' },
  { name: 'Machine Learning', category: 'Predictive AI', icon: BrainCircuit, accentColor: 'text-emerald-400', borderHover: 'hover:border-emerald-500/50 hover:bg-emerald-500/10' },
  { name: 'Generative AI', category: 'LLMs & Agents', icon: Sparkles, accentColor: 'text-violet-400', borderHover: 'hover:border-violet-500/50 hover:bg-violet-500/10' },
];

export const TechMarquee: React.FC = () => {
  // Render duplicated list twice for seamless infinite ticker loop
  const marqueeItems = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <div className="relative w-full py-4 overflow-hidden border-y border-slate-800/80 bg-slate-950/40 select-none">
      {/* Left/Right smooth gradient fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#030712] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#030712] to-transparent z-10" />

      {/* Scrolling ticker track */}
      <div className="animate-marquee flex items-center gap-3 sm:gap-4">
        {marqueeItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.name}-${index}`}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-xs sm:text-sm font-medium text-slate-300 shadow-sm transition-all duration-200 cursor-pointer ${item.borderHover}`}
            >
              <Icon className={`w-4 h-4 ${item.accentColor} shrink-0`} />
              <span className="font-semibold text-white tracking-wide whitespace-nowrap">{item.name}</span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-600" />
              <span className="hidden sm:inline text-[11px] font-mono text-slate-400">{item.category}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
