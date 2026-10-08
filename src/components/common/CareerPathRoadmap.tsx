import React, { useState } from 'react';
import {
  TrendingUp,
  BrainCircuit,
  Settings2,
  Database,
  BarChart3,
  FileSpreadsheet,
  Terminal,
  Cpu,
  Flame,
  Wind,
  Cloud,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface RoadmapStep {
  stepNumber: string;
  skill: string;
  duration: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  keyTopics: string;
}

interface CareerTrack {
  id: 'analyst' | 'scientist' | 'engineer';
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  totalDuration: string;
  salaryRange: string;
  steps: RoadmapStep[];
}

const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'analyst',
    title: 'Data Analyst',
    tagline: 'Transform raw enterprise records into high-impact boardroom dashboards and quantitative business insights.',
    icon: TrendingUp,
    accentColor: 'text-amber-400',
    totalDuration: '16 Weeks',
    salaryRange: '$85,000 – $130,000 / ₹7.5L – ₹18L',
    steps: [
      {
        stepNumber: '01',
        skill: 'Industrial SQL & Relational DBs',
        duration: '3 Weeks',
        badge: 'Foundation',
        badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        icon: Database,
        keyTopics: 'JOINs, CTEs, Window functions, aggregations, query execution plans',
      },
      {
        stepNumber: '02',
        skill: 'Advanced Excel & Business Models',
        duration: '2 Weeks',
        badge: 'Spreadsheets',
        badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        icon: FileSpreadsheet,
        keyTopics: 'XLOOKUP, Power Query, scenario planning, financial matrices',
      },
      {
        stepNumber: '03',
        skill: 'Executive BI & Visual Dashboards',
        duration: '3 Weeks',
        badge: 'Visualization',
        badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        icon: BarChart3,
        keyTopics: 'Power BI, Tableau, DAX calculated measures, star schema UX',
      },
      {
        stepNumber: '04',
        skill: 'Exploratory Python & Pandas',
        duration: '4 Weeks',
        badge: 'Automation',
        badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
        icon: Terminal,
        keyTopics: 'Dataframe manipulation, outlier cleaning, automated data auditing',
      },
      {
        stepNumber: '05',
        skill: 'Metric Hierarchies & Business KPIs',
        duration: '2 Weeks',
        badge: 'Strategy',
        badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        icon: TrendingUp,
        keyTopics: 'Cohort retention, CAC/LTV, conversion funnels, executive summaries',
      },
      {
        stepNumber: '06',
        skill: 'Production BI Command Center',
        duration: '2 Weeks',
        badge: 'Capstone',
        badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        icon: Sparkles,
        keyTopics: 'End-to-end multi-source live executive analytics showcase',
      },
    ],
  },
  {
    id: 'scientist',
    title: 'Data Scientist',
    tagline: 'Engineer statistical systems, train predictive ML models, and fine-tune next-generation deep neural networks.',
    icon: BrainCircuit,
    accentColor: 'text-emerald-400',
    totalDuration: '22 Weeks',
    salaryRange: '$115,000 – $175,000 / ₹12L – ₹30L',
    steps: [
      {
        stepNumber: '01',
        skill: 'Vectorized Python & Computing',
        duration: '3 Weeks',
        badge: 'Programming',
        badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
        icon: Terminal,
        keyTopics: 'NumPy broadcasting, Polars fast execution, memory profiling',
      },
      {
        stepNumber: '02',
        skill: 'Applied Math & Statistical Inference',
        duration: '4 Weeks',
        badge: 'Math & Stats',
        badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
        icon: Layers,
        keyTopics: 'Linear algebra, Bayes theorem, hypothesis testing, A/B test design',
      },
      {
        stepNumber: '03',
        skill: 'Supervised & Unsupervised ML',
        duration: '5 Weeks',
        badge: 'Core ML',
        badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        icon: BrainCircuit,
        keyTopics: 'Scikit-Learn, XGBoost, Random Forests, clustering, classification',
      },
      {
        stepNumber: '04',
        skill: 'Feature Engineering & Tuning',
        duration: '3 Weeks',
        badge: 'Optimization',
        badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        icon: Cpu,
        keyTopics: 'Optuna Bayesian search, SHAP interpretability, cross-validation',
      },
      {
        stepNumber: '05',
        skill: 'Deep Learning & Neural Nets',
        duration: '4 Weeks',
        badge: 'Deep Learning',
        badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        icon: Cpu,
        keyTopics: 'PyTorch models, backpropagation, CNNs, Transformers, embeddings',
      },
      {
        stepNumber: '06',
        skill: 'Generative AI & LLM Fine-Tuning',
        duration: '3 Weeks',
        badge: 'State-of-Art',
        badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
        icon: Sparkles,
        keyTopics: 'Hugging Face, LoRA adapters, Vector DBs, RAG production agents',
      },
    ],
  },
  {
    id: 'engineer',
    title: 'Data Engineer',
    tagline: 'Architect petabyte-scale lakehouses, distributed streaming engines, and resilient orchestration pipelines.',
    icon: Settings2,
    accentColor: 'text-cyan-400',
    totalDuration: '20 Weeks',
    salaryRange: '$110,000 – $170,000 / ₹10L – ₹28L',
    steps: [
      {
        stepNumber: '01',
        skill: 'Advanced SQL & Data Modeling',
        duration: '3 Weeks',
        badge: 'Architecture',
        badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        icon: Database,
        keyTopics: 'Kimball star schemas, SCD Type 2, indexing, query optimization',
      },
      {
        stepNumber: '02',
        skill: 'Python Scripting & Data Ingestion',
        duration: '3 Weeks',
        badge: 'Pipelines',
        badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
        icon: Terminal,
        keyTopics: 'REST APIs, batch extractors, DuckDB, columnar Parquet files',
      },
      {
        stepNumber: '03',
        skill: 'Cloud Warehousing & Lakehouse',
        duration: '4 Weeks',
        badge: 'Cloud Storage',
        badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        icon: Cloud,
        keyTopics: 'Snowflake, Google BigQuery, micro-partitioning, storage tiers',
      },
      {
        stepNumber: '04',
        skill: 'Transformations with dbt',
        duration: '3 Weeks',
        badge: 'dbt Core',
        badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
        icon: Layers,
        keyTopics: 'dbt Core, Jinja templates, automated data contracts & freshness tests',
      },
      {
        stepNumber: '05',
        skill: 'Distributed Processing with PySpark',
        duration: '4 Weeks',
        badge: 'Big Data',
        badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        icon: Flame,
        keyTopics: 'Apache Spark, RDD operations, Delta Lake ACID transactions',
      },
      {
        stepNumber: '06',
        skill: 'Pipeline Orchestration & Observability',
        duration: '3 Weeks',
        badge: 'Production',
        badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        icon: Wind,
        keyTopics: 'Apache Airflow DAGs, Docker containerization, incident alerting',
      },
    ],
  },
];

interface CareerPathRoadmapProps {
  onNavigate: (path: string) => void;
}

export const CareerPathRoadmap: React.FC<CareerPathRoadmapProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'analyst' | 'scientist' | 'engineer'>('analyst');

  const currentTrack = CAREER_TRACKS.find((t) => t.id === activeTab) || CAREER_TRACKS[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Sequential Industry Curriculums</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Choose Your Data Career Path
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          No random tutorials. Follow an exact, battle-tested curriculum designed by staff engineers to take you from foundational syntax to top-tier hiring standards.
        </p>

        {/* 3 Interactive Toggle Tabs */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md mt-4 max-w-full overflow-x-auto">
          {CAREER_TRACKS.map((track) => {
            const Icon = track.icon;
            const isActive = track.id === activeTab;
            return (
              <button
                key={track.id}
                onClick={() => setActiveTab(track.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{track.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Track Overview Banner */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              {currentTrack.title} Track Focus
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {currentTrack.totalDuration}
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
            {currentTrack.tagline}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">Hiring Benchmark</div>
            <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
              {currentTrack.salaryRange}
            </div>
          </div>
          <button
            onClick={() => onNavigate('/courses')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Courses</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Horizontal step-by-step roadmap of 5–6 skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {currentTrack.steps.map((step, idx) => {
          const StepIcon = step.icon;
          return (
            <div
              key={`${currentTrack.id}-${step.stepNumber}`}
              className="group relative rounded-2xl bg-[#0b0f19] border border-slate-800/90 p-5 flex flex-col justify-between hover:border-amber-500/50 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer"
            >
              {/* Top Row: Step Number & Badge */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-slate-600 group-hover:text-amber-400/80 transition-colors">
                    {step.stepNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${step.badgeColor}`}>
                    {step.badge}
                  </span>
                </div>

                {/* Skill Icon & Title */}
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 mb-3 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 transition-all">
                  <StepIcon className="w-4 h-4" />
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug mb-2">
                  {step.skill}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {step.keyTopics}
                </p>
              </div>

              {/* Bottom Row: Estimated Weeks */}
              <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {step.duration}
                </span>
                <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
