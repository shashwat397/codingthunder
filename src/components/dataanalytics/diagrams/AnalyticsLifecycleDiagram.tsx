import React, { useState } from 'react';
import { Target, Database, Filter, BarChart3, LineChart, ShieldCheck } from 'lucide-react';

export const AnalyticsLifecycleDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      title: 'Problem Definition',
      subtitle: 'Scoping & Business Hypotheses',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      description:
        'Translate vague executive questions ("Why is subscriber retention falling?") into measurable hypotheses, OKRs, and operational constraints.',
      artifacts: ['PRD / Data Charter', 'Success Metrics (MRR churn, False Positive Rate)', 'Decision SLA criteria'],
    },
    {
      num: 2,
      title: 'Data Extraction',
      subtitle: 'SQL, Event Streams & APIs',
      icon: Database,
      color: 'from-cyan-500 to-teal-500',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      description:
        'Ingest raw event payloads from Kafka/Snowflake/PostgreSQL. Identify primary keys, transaction logs, and dimensional snapshots.',
      artifacts: ['Optimized SQL CTE queries', 'Kafka consumer schemas', 'Data lake S3 partitions'],
    },
    {
      num: 3,
      title: 'Data Cleaning',
      subtitle: 'Handling NULLs, Outliers & Types',
      icon: Filter,
      color: 'from-emerald-500 to-green-500',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      description:
        'Eliminate duplicate event IDs, calculate 1.5×IQR boundary thresholds for anomaly filtering, impute missing values, and cast temporal timestamps.',
      artifacts: ['Pandas / Power Query M scripts', 'IQR outlier masks', 'Data quality validation logs'],
    },
    {
      num: 4,
      title: 'Exploratory EDA',
      subtitle: 'Distributions & Correlations',
      icon: BarChart3,
      color: 'from-amber-500 to-orange-500',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      description:
        'Investigate skewness, compute Pearson/Spearman coefficients between transaction velocities and chargeback rates, identify cohort trends.',
      artifacts: ['Correlation heatmaps', 'Box plots & density charts', 'Cohort retention heat tables'],
    },
    {
      num: 5,
      title: 'Modeling & BI',
      subtitle: 'DAX, Star Schema & Dashboards',
      icon: LineChart,
      color: 'from-indigo-500 to-purple-500',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      description:
        'Construct star schema dimensional models. Author high-leverage DAX measures (CALCULATE, SUMX) and interactive visual triage interfaces.',
      artifacts: ['Star Schema (Fact + Dims)', 'Real-time alert monitors', 'Automated executive dashboards'],
    },
    {
      num: 6,
      title: 'Action & Policy',
      subtitle: 'Enforcement & Automated Feedback',
      icon: ShieldCheck,
      color: 'from-rose-500 to-pink-500',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      description:
        'Deliver concrete action: auto-freeze suspicious wallets above risk threshold 0.85, adjust subscription tier buckets, measure lift.',
      artifacts: ['Automated policy webhooks', 'A/B holdout test results', 'Executive decision memo'],
    },
  ];

  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            Interactive Lifecycle Architecture
          </span>
          <h3 className="text-lg font-bold text-white mt-1">The 6-Step Data Analytics Project Lifecycle</h3>
        </div>
        <p className="text-xs text-slate-400">Click any stage to inspect analytical workflows & deliverables</p>
      </div>

      {/* Visual Pipeline Bar */}
      <div className="relative py-8">
        <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 bg-slate-800 hidden md:block z-0" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative z-10">
          {steps.map((s) => {
            const Icon = s.icon;
            const isSelected = activeStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-500/10 scale-105'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm mb-2 shadow-md ${
                    isSelected
                      ? `bg-gradient-to-br ${s.color} text-slate-950 font-black ring-4 ring-cyan-500/20`
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-white leading-tight">{s.title}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Stage 0{s.num}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Step Deep Dive Card */}
      {(() => {
        const step = steps.find((s) => s.num === activeStep)!;
        const Icon = step.icon;
        return (
          <div className="mt-3 p-5 rounded-xl border border-slate-800/90 bg-slate-900/40">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold bg-gradient-to-br ${step.color} text-slate-950`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">{step.title}</h4>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${step.badgeColor}`}>
                    {step.subtitle}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Lifecycle Phase 0{step.num} of 06</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">{step.description}</p>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-2">
                Key Analytical Deliverables & Artifacts:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {step.artifacts.map((artifact, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span>{artifact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
