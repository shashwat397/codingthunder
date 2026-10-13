import React from 'react';

export const DecisionFlowDiagram: React.FC = () => {
  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Control Flow Visualizer
          </span>
          <h4 className="text-lg font-bold text-white">Decision Making (if-elif-else) & Multi-Factor Auth Flow</h4>
        </div>
        <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Branching Logic
        </span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 860 380" className="w-full min-w-[700px] h-auto font-sans select-none">
          <defs>
            <marker id="dfArrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker id="dfArrowRed" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#ef4444" />
            </marker>
            <marker id="dfArrowBlue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#3b82f6" />
            </marker>
          </defs>

          {/* Start node */}
          <ellipse cx="430" cy="35" rx="70" ry="22" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <text x="430" y="40" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold">Start: User Login Attempt</text>

          {/* Arrow to Condition 1 */}
          <path d="M 430 57 L 430 90" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#dfArrowBlue)" />

          {/* Diamond 1: Valid username? */}
          <polygon points="430,95 540,140 430,185 320,140" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          <text x="430" y="136" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold">is_user_valid?</text>
          <text x="430" y="152" textAnchor="middle" fill="#94a3b8" fontSize="10">username in DB</text>

          {/* Condition 1: False -> Reject */}
          <path d="M 320 140 L 160 140 L 160 300" stroke="#ef4444" strokeWidth="2" markerEnd="url(#dfArrowRed)" fill="none" />
          <text x="240" y="130" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold">False (elif)</text>
          
          {/* Condition 1: True -> Check password */}
          <path d="M 430 185 L 430 220" stroke="#10b981" strokeWidth="2" markerEnd="url(#dfArrowGreen)" />
          <text x="445" y="205" textAnchor="start" fill="#34d399" fontSize="11" fontWeight="bold">True</text>

          {/* Diamond 2: Password Match? */}
          <polygon points="430,225 540,270 430,315 320,270" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
          <text x="430" y="266" textAnchor="middle" fill="#a5f3fc" fontSize="11" fontWeight="bold">verify_password()?</text>
          <text x="430" y="282" textAnchor="middle" fill="#94a3b8" fontSize="10">bcrypt / argon2 hash</text>

          {/* Condition 2: False -> Reject */}
          <path d="M 320 270 L 160 270 L 160 300" stroke="#ef4444" strokeWidth="2" markerEnd="url(#dfArrowRed)" fill="none" />
          <text x="240" y="260" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold">False (elif)</text>

          {/* Condition 2: True -> Granted */}
          <path d="M 540 270 L 700 270 L 700 300" stroke="#10b981" strokeWidth="2" markerEnd="url(#dfArrowGreen)" fill="none" />
          <text x="620" y="260" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">True (if block)</text>

          {/* Terminals */}
          {/* Failed Output */}
          <rect x="80" y="305" width="160" height="48" rx="8" fill="#450a0a" stroke="#dc2626" strokeWidth="2" />
          <text x="160" y="326" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">HTTP 401 Unauthorized</text>
          <text x="160" y="342" textAnchor="middle" fill="#f87171" fontSize="10">Increment rate limit counter</text>

          {/* Success Output */}
          <rect x="620" y="305" width="160" height="48" rx="8" fill="#064e3b" stroke="#059669" strokeWidth="2" />
          <text x="700" y="326" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold">HTTP 200 Session Token</text>
          <text x="700" y="342" textAnchor="middle" fill="#6ee7b7" fontSize="10">Redirect to user dashboard</text>
        </svg>
      </div>

      <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <span className="font-bold text-amber-400">Short-Circuit Evaluation in Python:</span> In expressions like <code className="text-cyan-300">if user and user.is_active:</code>, Python evaluates operands strictly left-to-right. If the first operand evaluates to <code className="text-rose-400">False</code>, evaluation halts immediately, guaranteeing that nonexistent attribute access does not throw an <code className="text-rose-400">AttributeError</code>.
      </div>
    </div>
  );
};
