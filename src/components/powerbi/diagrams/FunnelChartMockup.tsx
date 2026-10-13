import React from 'react';
import { Filter } from 'lucide-react';

export const FunnelChartMockup: React.FC = () => {
  const funnelStages = [
    { name: 'Website Lead Inquiries', count: '120,000', pct: '100%', width: 'w-full', bg: 'bg-amber-500' },
    { name: 'Marketing Qualified (MQL)', count: '48,000', pct: '40.0%', width: 'w-[82%]', bg: 'bg-amber-400' },
    { name: 'Sales Qualified (SQL)', count: '21,600', pct: '18.0%', width: 'w-[64%]', bg: 'bg-yellow-400' },
    { name: 'Contract Proposal Sent', count: '8,400', pct: '7.0%', width: 'w-[45%]', bg: 'bg-emerald-400' },
    { name: 'Deals Won & Closed', count: '3,360', pct: '2.8%', width: 'w-[28%]', bg: 'bg-emerald-500' },
  ];

  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Visual Anatomy
          </span>
          <h4 className="text-lg font-bold text-white">Power BI Native Funnel Chart Mockup</h4>
        </div>
        <span className="text-xs font-mono text-slate-400 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
          Conversion Bottleneck Analysis
        </span>
      </div>

      <div className="space-y-3 max-w-2xl mx-auto py-2">
        {funnelStages.map((stage, idx) => (
          <div key={stage.name} className="flex flex-col items-center">
            <div
              className={`${stage.width} ${stage.bg} text-slate-950 rounded-lg p-3 shadow-md flex items-center justify-between font-mono transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-950/20 text-slate-950 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="font-bold text-xs sm:text-sm font-sans">{stage.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <span className="font-extrabold">{stage.count}</span>
                <span className="bg-slate-950/25 px-2 py-0.5 rounded text-[11px] font-bold">
                  {stage.pct}
                </span>
              </div>
            </div>
            {idx < funnelStages.length - 1 && (
              <div className="w-0.5 h-3 bg-slate-700 my-0.5"></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span><strong>Analytical Purpose:</strong> Quickly pinpoint the stage where maximum drop-off occurs.</span>
        <span className="font-mono text-emerald-400">Total Conversion: 2.8%</span>
      </div>
    </div>
  );
};
