import React from 'react';
import { Lightbulb, AlertTriangle, HelpCircle, ShieldCheck, Zap } from 'lucide-react';

interface DataAnalyticsCalloutBoxProps {
  type: 'pro-tip' | 'common-pitfall' | 'interview-tip' | 'case-study';
  title?: string;
  children: React.ReactNode;
}

export const DataAnalyticsCalloutBox: React.FC<DataAnalyticsCalloutBoxProps> = ({ type, title, children }) => {
  const configs = {
    'pro-tip': {
      icon: Lightbulb,
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-950/20',
      badgeBg: 'bg-cyan-500/20 text-cyan-300',
      defaultTitle: 'Analytics Pro Tip & Best Practice',
      iconColor: 'text-cyan-400',
    },
    'common-pitfall': {
      icon: AlertTriangle,
      border: 'border-rose-500/40',
      bg: 'bg-rose-950/20',
      badgeBg: 'bg-rose-500/20 text-rose-300',
      defaultTitle: 'Common Analytical Pitfall & Anti-Pattern',
      iconColor: 'text-rose-400',
    },
    'interview-tip': {
      icon: HelpCircle,
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/20',
      badgeBg: 'bg-amber-500/20 text-amber-300',
      defaultTitle: 'Staff Data Analyst Interview Prompt & Evaluation Matrix',
      iconColor: 'text-amber-400',
    },
    'case-study': {
      icon: ShieldCheck,
      border: 'border-indigo-500/40',
      bg: 'bg-indigo-950/20',
      badgeBg: 'bg-indigo-500/20 text-indigo-300',
      defaultTitle: 'Trust & Safety / Fraud Engineering Real-World Case',
      iconColor: 'text-indigo-400',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`my-6 rounded-2xl border ${config.border} ${config.bg} p-5 sm:p-6 shadow-xl`}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
        <span className={`text-[11px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded ${config.badgeBg}`}>
          {title || config.defaultTitle}
        </span>
      </div>
      <div className="text-sm text-slate-200 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
};
