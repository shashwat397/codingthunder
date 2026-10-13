import React, { useState } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Users, ArrowUpRight, Filter, Calendar } from 'lucide-react';

export const DashboardMockup: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'North America' | 'Europe' | 'Asia'>('All');

  const monthlyData = [
    { month: 'Jan', actual: 68, target: 60, height: '68%' },
    { month: 'Feb', actual: 75, target: 70, height: '75%' },
    { month: 'Mar', actual: 92, target: 80, height: '92%' },
    { month: 'Apr', actual: 84, target: 85, height: '84%' },
    { month: 'May', actual: 110, target: 95, height: '100%' },
    { month: 'Jun', actual: 98, target: 90, height: '89%' },
  ];

  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#090d16] p-5 sm:p-6 shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
            Interactive Visual Mockup
          </span>
          <h4 className="text-base sm:text-lg font-bold text-white">
            Executive Sales Performance Dashboard (Fabricated PBI Canvas)
          </h4>
        </div>

        {/* Region filter slicer */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {(['All', 'North America', 'Europe', 'Asia'] as const).map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">$4,850,200</span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>+18.4% vs SPLY</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Orders Placed</span>
            <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">34,210</span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>+9.2% YoY</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Order Value</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">$141.77</span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>+8.5% YoY</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Gross Margin</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">64.2%</span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>+3.1% Target</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visuals Row: Column Chart on Left, Category Bars on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Revenue vs Target (Column Chart) */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Monthly Actual vs. Forecast Target (2026)
              </h5>
              <p className="text-[11px] text-slate-400 font-mono">Filtered: {selectedRegion}</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Actual Sales
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-cyan-400"></span> Forecast Target
              </div>
            </div>
          </div>

          {/* CSS-Powered Column Chart */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-800">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-slate-950 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-300 border border-slate-800 pointer-events-none whitespace-nowrap">
                  ${d.actual}k / ${d.target}k
                </div>
                {/* Bar */}
                <div className="w-full max-w-[40px] bg-slate-800/80 rounded-t-lg relative overflow-hidden h-full flex items-end">
                  <div
                    style={{ height: d.height }}
                    className="w-full bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400 rounded-t-md transition-all duration-500 group-hover:brightness-110"
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-2">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Category Breakdown */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Top Product Categories
            </h5>
            <p className="text-[11px] text-slate-400 font-mono mb-4">By Contribution %</p>

            <div className="space-y-3">
              {[
                { name: 'Cloud Infrastructure', pct: 42, rev: '$2.03M', color: 'bg-amber-400' },
                { name: 'Data Engineering Tools', pct: 28, rev: '$1.35M', color: 'bg-cyan-400' },
                { name: 'AI & Machine Learning', pct: 19, rev: '$0.92M', color: 'bg-purple-400' },
                { name: 'Developer Toolkits', pct: 11, rev: '$0.53M', color: 'bg-emerald-400' },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-200">{cat.name}</span>
                    <span className="text-amber-400 font-bold">{cat.rev} ({cat.pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div style={{ width: `${cat.pct}%` }} className={`h-full ${cat.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Cross-filtering active</span>
            <span className="text-emerald-400">⚡ Live Rendering</span>
          </div>
        </div>
      </div>
    </div>
  );
};
