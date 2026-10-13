import React from 'react';

export const IndexMatchDiagram: React.FC = () => {
  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Two-Step Relational Lookup
          </span>
          <h4 className="text-lg font-bold text-white">INDEX + MATCH Mechanics: Fast Lookups Without Column Restriction</h4>
        </div>
        <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Leftward & Dynamic
        </span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 900 280" className="w-full min-w-[750px] h-auto font-sans select-none">
          <defs>
            <marker id="imArrowCyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4" />
            </marker>
            <marker id="imArrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
            </marker>
          </defs>

          {/* STEP 1: Lookup Value */}
          <rect x="20" y="30" width="220" height="100" rx="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="130" y="55" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">INPUT: TARGET ID</text>
          <text x="130" y="80" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="monospace">"SUB-94021"</text>
          <text x="130" y="105" textAnchor="middle" fill="#94a3b8" fontSize="10">Target Subscriber / Creator Key</text>

          {/* Arrow 1 to MATCH */}
          <path d="M 240 80 L 305 80" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#imArrowCyan)" />

          {/* STEP 2: MATCH Engine */}
          <rect x="310" y="30" width="260" height="150" rx="12" fill="#0c4a6e" fillOpacity="0.3" stroke="#0284c7" strokeWidth="1.5" />
          <text x="440" y="55" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">STEP 1: MATCH(lookup_val, array, 0)</text>
          <text x="440" y="78" textAnchor="middle" fill="#e0f2fe" fontSize="11" fontFamily="monospace">MATCH(F2, A2:A50000, 0)</text>
          <rect x="330" y="95" width="220" height="30" rx="6" fill="#0369a1" />
          <text x="440" y="115" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Scans Column A $\to$ Returns Row Index: 42</text>
          <text x="440" y="145" textAnchor="middle" fill="#bae6fd" fontSize="9">Exact match binary lookup</text>

          {/* Arrow 2 to INDEX */}
          <path d="M 570 105 L 635 105" stroke="#06b6d4" strokeWidth="2.5" markerEnd="url(#imArrowGreen)" />
          <text x="602" y="95" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold">Row #42</text>

          {/* STEP 3: INDEX Retrieval */}
          <rect x="640" y="30" width="240" height="150" rx="12" fill="#064e3b" fillOpacity="0.3" stroke="#059669" strokeWidth="1.5" />
          <text x="760" y="55" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">STEP 2: INDEX(return_array, row_num)</text>
          <text x="760" y="78" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontFamily="monospace">INDEX(D2:D50000, 42)</text>
          <rect x="660" y="95" width="200" height="30" rx="6" fill="#047857" />
          <text x="760" y="115" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">Extracts: "$124,500.00"</text>
          <text x="760" y="145" textAnchor="middle" fill="#a7f3d0" fontSize="9">Direct O(1) memory coordinate fetch</text>

          {/* Bottom Advantage Bar */}
          <rect x="20" y="210" width="860" height="50" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <text x="450" y="232" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
            Why INDEX+MATCH Beats VLOOKUP:
          </text>
          <text x="450" y="248" textAnchor="middle" fill="#94a3b8" fontSize="10">
            1. Zero breaks when inserting/deleting columns · 2. Effortless Leftward lookups · 3. 40% lower workbook RAM footprint
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <span className="font-bold text-cyan-400 block mb-1">Standard Formula Structure:</span>
          <code className="text-amber-300 font-mono">=INDEX(C$2:C$10000, MATCH(F2, A$2:A$10000, 0))</code>
        </div>
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <span className="font-bold text-emerald-400 block mb-1">Modern XLOOKUP Replacement (Excel 365):</span>
          <code className="text-emerald-300 font-mono">=XLOOKUP(F2, A$2:A$10000, C$2:C$10000, "NOT_FOUND")</code>
        </div>
      </div>
    </div>
  );
};
