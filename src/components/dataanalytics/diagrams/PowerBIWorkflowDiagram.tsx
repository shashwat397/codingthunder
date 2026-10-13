import React, { useState } from 'react';
import { Database, Cpu, Layers, Calculator, LayoutDashboard, Send } from 'lucide-react';

export const PowerBIWorkflowDiagram: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number>(3);

  const layers = [
    {
      num: 1,
      title: 'Data Ingestion',
      badge: 'Extract',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      tech: 'PostgreSQL, Snowflake, S3 Lakehouse, REST APIs',
      details:
        'Raw disparate tables and audit events are pulled via native connectors or DirectQuery mode into the Power BI analytical sandbox.',
      rules: ['Prefer DirectQuery only for sub-second streaming', 'Use native database views to prune unused columns early'],
    },
    {
      num: 2,
      title: 'Power Query M',
      badge: 'Transform (ETL)',
      icon: Cpu,
      color: 'from-cyan-500 to-teal-500',
      tech: 'Mashup Engine (M Language)',
      details:
        'Data cleaning, casing normalization, unpivoting wide survey tables, splitting subscriber IDs, and stripping out whitespace before loading.',
      rules: ['Enable Query Folding into SQL WHERE clauses', 'Always apply step-by-step typed column transforms early'],
    },
    {
      num: 3,
      title: 'Star Schema Modeling',
      badge: 'Relational Model',
      icon: Layers,
      color: 'from-emerald-500 to-green-500',
      tech: 'VertiPaq In-Memory Columnar Database',
      details:
        'Dimension tables (dim_users, dim_calendar, dim_creators) are connected via 1-to-many single-directional relationships to Central Fact tables.',
      rules: ['Avoid bidirectional cross-filtering to prevent ambiguity', 'Always create a dedicated Disconnected Date Dimension table'],
    },
    {
      num: 4,
      title: 'DAX Engine',
      badge: 'Metrics & Logic',
      icon: Calculator,
      color: 'from-amber-500 to-yellow-500',
      tech: 'Formula Engine (FE) + Storage Engine (SE)',
      details:
        'Dynamic calculations evaluated at query time. Measures dynamically adapt to user slicers via Filter Context and Context Transition.',
      rules: ['CALCULATE modifies filter context with mathematical precedence', 'Never wrap calculated columns when a dynamic measure suffices'],
    },
    {
      num: 5,
      title: 'Visual Dashboard',
      badge: 'UX & Triage',
      icon: LayoutDashboard,
      color: 'from-indigo-500 to-purple-500',
      tech: 'Interactive Canvas, Cross-filtering, Drill-through',
      details:
        'Card KPI summaries, Pareto charts for fraud frequency, heatmaps for subscriber churn, and granular drill-through detail views.',
      rules: ['Maintain visual hierarchy (Macro KPIs top, triage grid bottom)', 'Limit visuals to 6-8 per tab for snappy rendering performance'],
    },
    {
      num: 6,
      title: 'Service & Automation',
      badge: 'Production Delivery',
      icon: Send,
      color: 'from-rose-500 to-pink-500',
      tech: 'Power BI Service, Scheduled Gateway, RLS, Webhook Alerts',
      details:
        'Publishing reports to cloud workspaces, applying Row-Level Security (RLS) by investigator role, and firing automated alerts on high-risk spikes.',
      rules: ['Configure automated gateway refreshes off-peak', 'Integrate Power Automate flows to alert Slack/PagerDuty on threshold breaches'],
    },
  ];

  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
            End-to-End BI Pipeline
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Power BI Architecture & Analytics Pipeline Workflow
          </h3>
        </div>
        <span className="text-xs text-slate-400">Click any pipeline tier to inspect engine operations</span>
      </div>

      {/* Pipeline Tiers Horizontal Flow */}
      <div className="py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {layers.map((l) => {
          const Icon = l.icon;
          const isSelected = activeLayer === l.num;
          return (
            <button
              key={l.num}
              onClick={() => setActiveLayer(l.num)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-400 bg-slate-800/90 shadow-lg shadow-amber-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400">Tier 0{l.num}</span>
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center ${
                      isSelected
                        ? `bg-gradient-to-br ${l.color} text-slate-950 font-bold`
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xs font-bold text-white leading-snug">{l.title}</div>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 mt-2 block">{l.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Layer Detailed Panel */}
      {(() => {
        const layer = layers.find((l) => l.num === activeLayer)!;
        const Icon = layer.icon;
        return (
          <div className="mt-2 p-5 rounded-xl border border-slate-800 bg-slate-900/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold bg-gradient-to-br ${layer.color} text-slate-950`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{layer.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {layer.badge}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-cyan-300 mt-0.5 block">{layer.tech}</span>
                </div>
              </div>
              <span className="text-xs text-slate-400">Production Engine Phase 0{layer.num} of 06</span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">{layer.details}</p>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                Engineering Guidelines & Best Practices:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {layer.rules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{rule}</span>
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
