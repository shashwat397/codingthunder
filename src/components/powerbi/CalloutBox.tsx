import React from 'react';
import { Lightbulb, AlertTriangle, HelpCircle, Briefcase, CheckCircle2 } from 'lucide-react';

interface CalloutBoxProps {
  type: 'best-practice' | 'common-mistake' | 'interview-tip' | 'business-scenario';
  title?: string;
  children: React.ReactNode;
}

export const CalloutBox: React.FC<CalloutBoxProps> = ({ type, title, children }) => {
  const configs = {
    'best-practice': {
      icon: Lightbulb,
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/20',
      badgeBg: 'bg-emerald-500/20 text-emerald-300',
      defaultTitle: 'Pro Architect Best Practice',
      iconColor: 'text-emerald-400',
    },
    'common-mistake': {
      icon: AlertTriangle,
      border: 'border-rose-500/40',
      bg: 'bg-rose-950/20',
      badgeBg: 'bg-rose-500/20 text-rose-300',
      defaultTitle: 'Common Beginner Mistake & Anti-Pattern',
      iconColor: 'text-rose-400',
    },
    'interview-tip': {
      icon: HelpCircle,
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/20',
      badgeBg: 'bg-amber-500/20 text-amber-300',
      defaultTitle: 'Senior Power BI Interview Question & Model Answer',
      iconColor: 'text-amber-400',
    },
    'business-scenario': {
      icon: Briefcase,
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-950/20',
      badgeBg: 'bg-cyan-500/20 text-cyan-300',
      defaultTitle: 'Real-World Production Business Scenario',
      iconColor: 'text-cyan-400',
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
