import React from 'react';
import { AlertTriangle, HelpCircle, Bug, ShieldAlert } from 'lucide-react';
import { CalloutType } from './types.ts';

interface DataEngineeringCalloutProps {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
}

export const DataEngineeringCallout: React.FC<DataEngineeringCalloutProps> = ({
  type,
  title,
  children,
}) => {
  const configs = {
    'production-caveat': {
      icon: AlertTriangle,
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/20',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      defaultTitle: 'PRODUCTION CAVEAT & ARCHITECTURAL GOTCHA',
      iconColor: 'text-amber-400',
    },
    'interview-tip': {
      icon: HelpCircle,
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-950/20',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      defaultTitle: 'STAFF DATA ENGINEER INTERVIEW SCENARIO',
      iconColor: 'text-cyan-400',
    },
    'debugging-practice': {
      icon: Bug,
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/20',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      defaultTitle: 'DEBUGGING STRATEGY & DRIFT MITIGATION',
      iconColor: 'text-emerald-400',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`my-6 rounded-2xl border ${config.border} ${config.bg} p-5 sm:p-6 shadow-xl backdrop-blur-sm`}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
        <span className={`text-[11px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${config.badgeBg}`}>
          {title || config.defaultTitle}
        </span>
      </div>
      <div className="text-sm text-slate-200 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
};
