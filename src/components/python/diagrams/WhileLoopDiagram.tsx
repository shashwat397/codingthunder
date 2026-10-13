import React from 'react';

export const WhileLoopDiagram: React.FC = () => {
  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Iteration Architecture
          </span>
          <h4 className="text-lg font-bold text-white">While Loop & Range Flow: Iteration, break, continue & else</h4>
        </div>
        <span className="text-xs font-mono text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          Loop Cycle
        </span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 880 320" className="w-full min-w-[700px] h-auto font-sans select-none">
          <defs>
            <marker id="loopArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4" />
            </marker>
            <marker id="breakArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#ef4444" />
            </marker>
            <marker id="greenArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Init */}
          <rect x="30" y="80" width="130" height="50" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
          <text x="95" y="102" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">Loop Init</text>
          <text x="95" y="118" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">i = 0, retry = 3</text>

          {/* Arrow to Condition */}
          <path d="M 160 105 L 220 105" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#loopArrow)" />

          {/* Condition Diamond */}
          <polygon points="320,55 420,105 320,155 220,105" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          <text x="320" y="100" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold">condition == True?</text>
          <text x="320" y="116" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">while i &lt; max:</text>

          {/* Condition False -> Loop Else / Exit */}
          <path d="M 320 155 L 320 230 L 680 230 L 680 135" stroke="#10b981" strokeWidth="2" markerEnd="url(#greenArrow)" fill="none" />
          <text x="330" y="180" textAnchor="start" fill="#34d399" fontSize="10" fontWeight="bold">False (Normal completion)</text>
          <text x="500" y="220" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace">Executes loop `else:` block</text>

          {/* Condition True -> Body */}
          <path d="M 420 105 L 490 105" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#loopArrow)" />
          <text x="450" y="95" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold">True</text>

          {/* Loop Body */}
          <rect x="490" y="65" width="160" height="80" rx="10" fill="#0c4a6e" fillOpacity="0.4" stroke="#0284c7" strokeWidth="1.5" />
          <text x="570" y="90" textAnchor="middle" fill="#bae6fd" fontSize="11" fontWeight="bold">Loop Body</text>
          <text x="570" y="108" textAnchor="middle" fill="#e0f2fe" fontSize="10" fontFamily="monospace">do_work(i)</text>
          <text x="570" y="125" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">i += 1  (Mutation)</text>

          {/* Loop back to condition */}
          <path d="M 570 65 L 570 25 L 320 25 L 320 55" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#loopArrow)" fill="none" />
          <text x="445" y="18" textAnchor="middle" fill="#22d3ee" fontSize="10">continue / next cycle</text>

          {/* Break line escaping out directly */}
          <path d="M 650 105 L 720 105" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#breakArrow)" />
          <text x="685" y="95" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold">break</text>

          {/* Exit Box */}
          <rect x="720" y="80" width="130" height="50" rx="8" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
          <text x="785" y="102" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">Terminated</text>
          <text x="785" y="118" textAnchor="middle" fill="#f87171" fontSize="10">Skips `else:` block</text>
        </svg>
      </div>

      <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <span className="font-bold text-amber-400">Critical Python Quirks:</span> Unlike C or Java, Python loops support an <code className="text-cyan-300">else:</code> clause! The <code className="text-cyan-300">else:</code> statement triggers <em>only</em> if the loop ran to exhaustion without encountering a <code className="text-rose-400">break</code> statement. This is exceptionally powerful for search algorithms.
      </div>
    </div>
  );
};
