import React from 'react';

export const LogicalDecisionFlowDiagram: React.FC = () => {
  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-semibold">
            Automated Decision Tree
          </span>
          <h4 className="text-lg font-bold text-white">Fraud Detection & Policy Enforcement: Nested IF / IFS Evaluation</h4>
        </div>
        <span className="text-xs font-mono text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          Risk Engine Scoring
        </span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 920 340" className="w-full min-w-[760px] h-auto font-sans select-none">
          <defs>
            <marker id="fArrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker id="fArrowRed" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#ef4444" />
            </marker>
            <marker id="fArrowAmber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Incoming Transaction */}
          <rect x="20" y="80" width="160" height="70" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
          <text x="100" y="105" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">Incoming Transaction</text>
          <text x="100" y="125" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">Amount, Velocity, IP</text>
          <text x="100" y="139" textAnchor="middle" fill="#64748b" fontSize="9">Cell A2, B2, C2</text>

          {/* Arrow to Test 1 */}
          <path d="M 180 115 L 240 115" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#fArrowAmber)" />

          {/* Test 1 Diamond: Critical velocity check */}
          <polygon points="320,65 400,115 320,165 240,115" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
          <text x="320" y="108" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">Score &gt;= 85 OR</text>
          <text x="320" y="124" textAnchor="middle" fill="#f87171" fontSize="10">Velocity &gt; 10/min?</text>

          {/* Branch 1 True -> Hard Freeze */}
          <path d="M 320 65 L 320 35 L 720 35 L 720 60" stroke="#ef4444" strokeWidth="2" markerEnd="url(#fArrowRed)" fill="none" />
          <text x="440" y="27" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold">TRUE (Priority 1)</text>

          {/* Branch 1 False -> Test 2 */}
          <path d="M 400 115 L 470 115" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#fArrowAmber)" />
          <text x="435" y="105" textAnchor="middle" fill="#f59e0b" fontSize="10">FALSE</text>

          {/* Test 2 Diamond: Review check */}
          <polygon points="550,65 630,115 550,165 470,115" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          <text x="550" y="108" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold">Score &gt;= 50 AND</text>
          <text x="550" y="124" textAnchor="middle" fill="#fde047" fontSize="10">Txn &gt; $5,000?</text>

          {/* Branch 2 True -> Manual Review */}
          <path d="M 630 115 L 720 115" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#fArrowAmber)" />
          <text x="675" y="105" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">TRUE</text>

          {/* Branch 2 False -> Approved */}
          <path d="M 550 165 L 550 240 L 720 240" stroke="#10b981" strokeWidth="2" markerEnd="url(#fArrowGreen)" fill="none" />
          <text x="590" y="230" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">FALSE (Default)</text>

          {/* Outcome 1: Critical Freeze */}
          <rect x="720" y="50" width="180" height="50" rx="8" fill="#450a0a" stroke="#dc2626" strokeWidth="2" />
          <text x="810" y="72" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">"AUTO_FREEZE"</text>
          <text x="810" y="88" textAnchor="middle" fill="#f87171" fontSize="9">Halt payout + Notify SecOps</text>

          {/* Outcome 2: Manual Review */}
          <rect x="720" y="115" width="180" height="50" rx="8" fill="#451a03" stroke="#d97706" strokeWidth="2" />
          <text x="810" y="137" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="bold">"MANUAL_REVIEW"</text>
          <text x="810" y="153" textAnchor="middle" fill="#f59e0b" fontSize="9">Step-up 2FA Challenge triggered</text>

          {/* Outcome 3: Approved */}
          <rect x="720" y="215" width="180" height="50" rx="8" fill="#064e3b" stroke="#059669" strokeWidth="2" />
          <text x="810" y="237" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold">"SETTLED_OK"</text>
          <text x="810" y="253" textAnchor="middle" fill="#6ee7b7" fontSize="9">Instant clearing & batch ledger</text>
        </svg>
      </div>

      <div className="text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
        <span className="font-bold text-amber-400 font-mono">Production Excel Formula (IFS Implementation):</span>
        <code className="text-cyan-300 font-mono block mt-1.5 bg-slate-950 p-2 rounded">
          =IFS(OR(A2&gt;=85, B2&gt;10), "AUTO_FREEZE", AND(A2&gt;=50, C2&gt;5000), "MANUAL_REVIEW", TRUE, "SETTLED_OK")
        </code>
      </div>
    </div>
  );
};
