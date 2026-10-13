import React from 'react';

export const DateCalculationFlowDiagram: React.FC = () => {
  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Temporal Logic & SLA Operations
          </span>
          <h4 className="text-lg font-bold text-white">Date Serial Math & SLA Policy Breach Calculation</h4>
        </div>
        <span className="text-xs font-mono text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
          Serial Epoch 1900
        </span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 900 240" className="w-full min-w-[750px] h-auto font-sans select-none">
          <defs>
            <marker id="dateArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Block 1: Incident Creation */}
          <rect x="20" y="30" width="180" height="120" rx="10" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="110" y="55" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold">TICKETING CREATED</text>
          <text x="110" y="80" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="monospace">"2026-10-01"</text>
          <text x="110" y="100" textAnchor="middle" fill="#94a3b8" fontSize="10">Serial Day: 46296</text>
          <text x="110" y="125" textAnchor="middle" fill="#64748b" fontSize="9">Cell A2 (Report Timestamp)</text>

          {/* Arrow 1 */}
          <path d="M 200 90 L 260 90" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#dateArrow)" />

          {/* Block 2: Business Days Calc */}
          <rect x="265" y="30" width="220" height="120" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
          <text x="375" y="55" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">WORKING DAYS ELAPSED</text>
          <text x="375" y="78" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontFamily="monospace">NETWORKDAYS(A2, TODAY())</text>
          <text x="375" y="100" textAnchor="middle" fill="#94a3b8" fontSize="10">Excludes Sat & Sun</text>
          <text x="375" y="125" textAnchor="middle" fill="#6ee7b7" fontSize="9">+ Custom Holiday Range</text>

          {/* Arrow 2 */}
          <path d="M 485 90 L 545 90" stroke="#10b981" strokeWidth="2" markerEnd="url(#dateArrow)" />

          {/* Block 3: Target SLA Evaluation */}
          <rect x="550" y="30" width="180" height="120" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="640" y="55" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">SLA THRESHOLD</text>
          <text x="640" y="80" textAnchor="middle" fill="#ffffff" fontSize="12" fontFamily="monospace">Target: &lt;= 5 Days</text>
          <text x="640" y="100" textAnchor="middle" fill="#94a3b8" fontSize="10">Regulatory Tier-1</text>
          <text x="640" y="125" textAnchor="middle" fill="#fbbf24" fontSize="9">Tier 1 Fraud Policy</text>

          {/* Arrow 3 */}
          <path d="M 730 90 L 775 90" stroke="#ef4444" strokeWidth="2" markerEnd="url(#dateArrow)" />

          {/* Block 4: Breach Status */}
          <rect x="780" y="30" width="105" height="120" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
          <text x="832" y="65" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">STATUS</text>
          <text x="832" y="90" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">BREACH</text>
          <text x="832" y="115" textAnchor="middle" fill="#f87171" fontSize="9">Fine Alert</text>
        </svg>
      </div>

      <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <span className="font-bold text-emerald-400">Under the Hood of Excel Dates:</span> Excel stores all dates as integer day counts starting from <strong>January 1, 1900</strong> (Serial #1). Today's date is simply a number near 46,000! Times are decimal fractions of a 24-hour day (<code className="text-cyan-300">0.5 = 12:00 PM noon</code>). This makes addition, subtraction, and difference calculations simple integer arithmetic.
      </div>
    </div>
  );
};
