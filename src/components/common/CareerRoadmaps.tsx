import React, { useState } from 'react';
import {
  TrendingUp,
  BrainCircuit,
  Settings2,
  CheckCircle2,
  Circle,
  Clock,
  Briefcase,
  DollarSign,
  ArrowRight,
  Sparkles,
  Layers,
  Code2,
  FileCheck
} from 'lucide-react';

interface Milestone {
  id: string;
  stageNumber: number;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  tools: string[];
  keyTopics: string[];
  capstoneProject: string;
}

interface CareerTrack {
  id: 'analyst' | 'scientist' | 'engineer';
  title: string;
  badge: string;
  icon: any;
  accentColor: string;
  summary: string;
  totalDuration: string;
  salaryBenchmark: string;
  milestones: Milestone[];
}

const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'analyst',
    title: 'Data Analyst Roadmap',
    badge: 'SQL ➔ Excel ➔ Tableau/PowerBI ➔ Basic Python',
    icon: TrendingUp,
    accentColor: '#f59e0b', // Amber
    summary:
      'Transform business operations with quantitative insight. Learn to pull raw data, calculate executive KPIs, build automated dashboards, and conduct exploratory Python analyses.',
    totalDuration: '10 - 14 Weeks',
    salaryBenchmark: '₹7.5L - ₹18L / $85k - $125k',
    milestones: [
      {
        id: 'analyst-1',
        stageNumber: 1,
        title: 'Industrial SQL & Relational Queries',
        duration: '3 Weeks',
        difficulty: 'Beginner',
        description: 'Master data extraction, aggregations, multi-table JOINs, filtering logic, and window functions to query production relational databases.',
        tools: ['PostgreSQL', 'DuckDB', 'DBeaver', 'SQL'],
        keyTopics: ['SELECT, WHERE, GROUP BY, HAVING', 'INNER, LEFT, FULL OUTER JOINs', 'Subqueries & Common Table Expressions (CTEs)', 'Window Functions (ROW_NUMBER, RANK, LEAD, LAG)'],
        capstoneProject: 'E-Commerce Revenue & Customer Repeat Purchase SQL Audit',
      },
      {
        id: 'analyst-2',
        stageNumber: 2,
        title: 'Advanced Spreadsheet Modeling & Business Metrics',
        duration: '2 Weeks',
        difficulty: 'Beginner',
        description: 'Design dynamic analytical models, scenario analysis, executive pivot tables, and metric hierarchies used in finance and corporate operations.',
        tools: ['Excel', 'Google Sheets', 'Power Query'],
        keyTopics: ['INDEX/MATCH & XLOOKUP mastery', 'Cohort retention matrices', 'Sensitivity modeling & scenario planners', 'Power Query automated data clean-up'],
        capstoneProject: 'SaaS Unit Economics & Monthly Recurring Revenue (MRR) Dashboard',
      },
      {
        id: 'analyst-3',
        stageNumber: 3,
        title: 'Executive BI Dashboards & Visual Storytelling',
        duration: '3 Weeks',
        difficulty: 'Intermediate',
        description: 'Turn complex dimensional datasets into interactive boardroom dashboards that drive executive decision-making.',
        tools: ['PowerBI', 'Tableau', 'DAX', 'Power Automate'],
        keyTopics: ['Star schema data modeling', 'DAX calculated columns & measures', 'Interactive drill-downs & cross-filtering', 'Executive storytelling & visual UX design'],
        capstoneProject: 'Global Supply Chain Operations Command Center Dashboard',
      },
      {
        id: 'analyst-4',
        stageNumber: 4,
        title: 'Exploratory Python & Automated Analytics',
        duration: '4 Weeks',
        difficulty: 'Intermediate',
        description: 'Harness Python for large-scale data manipulation, statistical profiling, and automated report distribution.',
        tools: ['Python 3', 'Pandas', 'Seaborn', 'Jupyter Lab'],
        keyTopics: ['Dataframe wrangling & missing value imputation', 'Statistical distributions & correlations', 'Automated PDF/Email report dispatchers', 'Streamlit quick data apps'],
        capstoneProject: 'Automated Customer Churn Risk & Lifetime Value Profiler',
      },
    ],
  },
  {
    id: 'scientist',
    title: 'Data Scientist Roadmap',
    badge: 'Python ➔ Math & Statistics ➔ Machine Learning ➔ Deep Learning',
    icon: BrainCircuit,
    accentColor: '#10b981', // Emerald
    summary:
      'Build predictive algorithms and intelligent systems. From calculus and probability theory to gradient boosted trees, deep neural architectures, and LLM fine-tuning.',
    totalDuration: '16 - 22 Weeks',
    salaryBenchmark: '₹12L - ₹32L / $115k - $175k',
    milestones: [
      {
        id: 'scientist-1',
        stageNumber: 1,
        title: 'High-Performance Python & Vectorized Computing',
        duration: '3 Weeks',
        difficulty: 'Beginner',
        description: 'Clean, filter, and vectorize multi-gigabyte datasets with speed using Python, NumPy, and modern Polars.',
        tools: ['Python', 'NumPy', 'Pandas', 'Polars'],
        keyTopics: ['Matrix vectorization & memory profiling', 'Functional transformations & broadcasting', 'Handling dirty JSON & unstructured feeds', 'Parallel multiprocessing in Python'],
        capstoneProject: 'High-Throughput Financial Tick Data Cleaning Engine',
      },
      {
        id: 'scientist-2',
        stageNumber: 2,
        title: 'Applied Mathematics & Statistical Inference',
        duration: '4 Weeks',
        difficulty: 'Intermediate',
        description: 'The foundation of predictive modeling: linear algebra, multivariable calculus, hypothesis testing, and Bayesian probability.',
        tools: ['SciPy', 'Statsmodels', 'Jupyter', 'Math/LaTeX'],
        keyTopics: ['Eigenvalues, SVD & dimensionality reduction', 'Confidence intervals & p-value interpretation', 'A/B testing with sample size determination', 'Bayesian inference & prior updates'],
        capstoneProject: 'A/B Testing Framework for E-Commerce Conversion Optimization',
      },
      {
        id: 'scientist-3',
        stageNumber: 3,
        title: 'Machine Learning & Feature Engineering',
        duration: '5 Weeks',
        difficulty: 'Advanced',
        description: 'Train, evaluate, and tune production-ready regression, classification, clustering, and ensemble algorithms.',
        tools: ['Scikit-Learn', 'XGBoost', 'LightGBM', 'Optuna'],
        keyTopics: ['Feature encoding, scaling & interaction terms', 'Cross-validation & data leakage prevention', 'Hyperparameter tuning with Bayesian search', 'SHAP & model interpretability'],
        capstoneProject: 'Credit Default Risk Predictive Classifier with 98% Recall',
      },
      {
        id: 'scientist-4',
        stageNumber: 4,
        title: 'Deep Learning & Neural Architectures',
        duration: '6 Weeks',
        difficulty: 'Advanced',
        description: 'Implement neural networks with PyTorch, explore transformers, embeddings, and fine-tune modern open-source LLMs.',
        tools: ['PyTorch', 'Hugging Face', 'Weights & Biases', 'CUDA'],
        keyTopics: ['Backpropagation & gradient descent mechanics', 'Convolutional and Transformer architectures', 'Vector embeddings & similarity search', 'LoRA fine-tuning for specialized domain models'],
        capstoneProject: 'Multi-Modal Biomedical Image & Clinical Text Classifier',
      },
    ],
  },
  {
    id: 'engineer',
    title: 'Analytics Engineer Roadmap',
    badge: 'SQL ➔ dbt ➔ Data Warehousing ➔ Orchestration',
    icon: Settings2,
    accentColor: '#06b6d4', // Cyan
    summary:
      'Bridge the gap between data engineering and data science. Build resilient data models in the modern data stack using software engineering best practices.',
    totalDuration: '12 - 16 Weeks',
    salaryBenchmark: '₹10L - ₹26L / $110k - $160k',
    milestones: [
      {
        id: 'engineer-1',
        stageNumber: 1,
        title: 'Advanced SQL Mastery & Dimensional Modeling',
        duration: '3 Weeks',
        difficulty: 'Intermediate',
        description: 'Kimball dimensional modeling techniques, star schemas, slowly changing dimensions (SCD), and performant analytical SQL.',
        tools: ['SQL', 'PostgreSQL', 'DuckDB', 'Data Modeling'],
        keyTopics: ['Facts vs Dimensions design', 'SCD Type 1, 2, and 3 implementation', 'Surrogate key generation & joins', 'Performance indexing & query plans'],
        capstoneProject: 'Enterprise Enterprise Data Warehouse Schema Design',
      },
      {
        id: 'engineer-2',
        stageNumber: 2,
        title: 'Transformation Pipelines with dbt (data build tool)',
        duration: '4 Weeks',
        difficulty: 'Intermediate',
        description: 'Apply software engineering practices (version control, automated testing, CI/CD, documentation) to SQL transformations.',
        tools: ['dbt Core', 'Git', 'Jinja', 'YAML'],
        keyTopics: ['dbt models, sources, and refs', 'Jinja templating & macros', 'Data quality tests & freshness assertions', 'Automated documentation & DAG lineage'],
        capstoneProject: 'End-to-End dbt Transformation Suite with 40+ Integrated Tests',
      },
      {
        id: 'engineer-3',
        stageNumber: 3,
        title: 'Cloud Data Warehouses & Lakehouses',
        duration: '4 Weeks',
        difficulty: 'Advanced',
        description: 'Architect and scale petabyte-scale cloud warehouses with Snowflake and Google BigQuery.',
        tools: ['Snowflake', 'BigQuery', 'Parquet', 'S3/GCS'],
        keyTopics: ['Micro-partitioning & clustering keys', 'Zero-copy cloning & Time Travel', 'Partitioning and sharding strategies', 'Cost optimization & warehouse sizing'],
        capstoneProject: 'Petabyte-Scale Snowflake Telemetry Pipeline with Zero-Copy Staging',
      },
      {
        id: 'engineer-4',
        stageNumber: 4,
        title: 'Pipeline Orchestration & Data Quality Monitoring',
        duration: '3 Weeks',
        difficulty: 'Advanced',
        description: 'Schedule automated pipelines, handle dependency graphs, and set up observability alerts.',
        tools: ['Apache Airflow', 'Dagster', 'Great Expectations', 'Docker'],
        keyTopics: ['DAG construction & sensor operators', 'Data quality contracts & alerting', 'Containerized task execution', 'Incident triaging & backfilling'],
        capstoneProject: 'Production Data Pipeline with Automated Airflow DAGs & Slack Alerts',
      },
    ],
  },
];

interface CareerRoadmapsProps {
  onNavigate: (path: string) => void;
}

export const CareerRoadmaps: React.FC<CareerRoadmapsProps> = ({ onNavigate }) => {
  const [activeTrackId, setActiveTrackId] = useState<'analyst' | 'scientist' | 'engineer'>('analyst');
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({
    'analyst-1': true,
  });

  const activeTrack = CAREER_TRACKS.find((t) => t.id === activeTrackId) || CAREER_TRACKS[0];

  const completedCount = activeTrack.milestones.filter((m) => completedSteps[m.id]).length;
  const progressPercent = Math.round((completedCount / activeTrack.milestones.length) * 100);

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const IconComponent = activeTrack.icon;

  return (
    <div className="space-y-10 text-slate-200">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span>Interactive Career Pathways</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Data Career Roadmaps
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl">
          Visual, phase-by-phase learning pathways built to take you from foundational syntax to real-world production competence. Track your progress with the milestone checklist!
        </p>
      </div>

      {/* Track Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CAREER_TRACKS.map((track) => {
          const TabIcon = track.icon;
          const isActive = track.id === activeTrackId;

          return (
            <button
              key={track.id}
              onClick={() => setActiveTrackId(track.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-slate-900 border-amber-500/60 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'bg-[#0c101c] border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <TabIcon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {track.totalDuration}
                </span>
              </div>
              <div>
                <h3 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {track.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5 line-clamp-1">{track.badge}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Track Header Card & Progress */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c101c] border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{activeTrack.title}</h2>
                <span className="text-xs font-mono text-amber-400">{activeTrack.badge}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl pt-1">
              {activeTrack.summary}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Timeline</span>
              <div className="text-white font-bold flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeTrack.totalDuration}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Market Comp</span>
              <div className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{activeTrack.salaryBenchmark}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">
              Your Pathway Progress:{' '}
              <strong className="text-white">
                {completedCount} of {activeTrack.milestones.length} Milestones Checked
              </strong>
            </span>
            <span className="text-amber-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Milestone Vertical Stepper */}
        <div className="relative pt-4 space-y-6">
          {activeTrack.milestones.map((m, idx) => {
            const isCompleted = !!completedSteps[m.id];

            return (
              <div
                key={m.id}
                className={`relative p-5 sm:p-6 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-[#090d16] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Interactive Completion Button */}
                    <button
                      onClick={() => toggleStep(m.id)}
                      className={`p-1.5 rounded-xl border mt-0.5 transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                          : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-amber-400 hover:text-white'
                      }`}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark milestone completed'}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </button>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold">
                          STAGE {m.stageNumber}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {m.duration} · {m.difficulty}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-white">
                        {m.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                        {m.description}
                      </p>

                      {/* Key Topics List */}
                      <div className="pt-2">
                        <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold block mb-1.5">
                          Key Competencies:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                          {m.keyTopics.map((topic, tIdx) => (
                            <div key={tIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Capstone Project Pill */}
                      <div className="pt-3 flex items-center gap-2 text-xs">
                        <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-400 font-mono">Portfolio Capstone:</span>
                        <strong className="text-emerald-300 font-medium">{m.capstoneProject}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Tools Stack Chips */}
                  <div className="flex flex-wrap sm:flex-col sm:items-end gap-1.5 shrink-0 self-start">
                    <span className="text-[10px] font-mono text-slate-500 uppercase hidden sm:block">Tools:</span>
                    <div className="flex flex-wrap sm:justify-end gap-1">
                      {m.tools.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to start this track */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono text-center sm:text-left">
            Ready to start the <strong className="text-white">{activeTrack.title}</strong>? All lessons include downloadable notebooks and starter datasets.
          </div>
          <button
            onClick={() => onNavigate('/courses')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <span>Start Learning This Track</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
