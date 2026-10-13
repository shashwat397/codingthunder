import React from 'react';

export const ScopeLEGBDiagram: React.FC = () => {
  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Memory Resolution Order
          </span>
          <h4 className="text-lg font-bold text-white">Variable Scope Lookup Rule: The LEGB Hierarchy</h4>
        </div>
        <span className="text-xs font-mono text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
          L → E → G → B
        </span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 880 340" className="w-full min-w-[720px] h-auto font-sans select-none">
          {/* Outer Layer: Built-in */}
          <rect x="20" y="20" width="840" height="300" rx="20" fill="#0f172a" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 4" />
          <text x="50" y="50" fill="#818cf8" fontSize="13" fontWeight="bold">B - Built-in Scope (Python Internals)</text>
          <text x="50" y="68" fill="#64748b" fontSize="11" fontFamily="monospace">print(), len(), range(), sum(), Exception, None, True</text>

          {/* Layer 3: Global */}
          <rect x="70" y="85" width="740" height="220" rx="16" fill="#1e1b4b" fillOpacity="0.4" stroke="#a855f7" strokeWidth="2" />
          <text x="100" y="115" fill="#c084fc" fontSize="13" fontWeight="bold">G - Global Scope (Module Level)</text>
          <text x="100" y="133" fill="#94a3b8" fontSize="11" fontFamily="monospace">Variables, imports, functions defined at module root file (`global x`)</text>

          {/* Layer 2: Enclosing */}
          <rect x="120" y="150" width="640" height="140" rx="14" fill="#172554" fillOpacity="0.5" stroke="#38bdf8" strokeWidth="2" />
          <text x="150" y="180" fill="#38bdf8" fontSize="13" fontWeight="bold">E - Enclosing Scope (Nested Functions / Closures)</text>
          <text x="150" y="198" fill="#94a3b8" fontSize="11" fontFamily="monospace">Names in outer def outer(): for def inner(): (`nonlocal y`)</text>

          {/* Layer 1: Local */}
          <rect x="170" y="215" width="540" height="65" rx="10" fill="#064e3b" fillOpacity="0.6" stroke="#10b981" strokeWidth="2" />
          <text x="200" y="242" fill="#34d399" fontSize="13" fontWeight="bold">L - Local Scope (Current Executing Function)</text>
          <text x="200" y="260" fill="#a7f3d0" fontSize="11" fontFamily="monospace">Arguments & variables assigned directly inside the current function frame</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <span className="font-bold text-amber-400 block mb-1">Lookup Order: Inside Out</span>
          Python always checks <strong>L</strong> first. If not found, it steps out to <strong>E</strong>, then <strong>G</strong>, and lastly <strong>B</strong>. If the identifier is nowhere in LEGB, Python raises a <code className="text-rose-400">NameError: name 'x' is not defined</code>.
        </div>
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <span className="font-bold text-cyan-400 block mb-1">The Global Trap in Functions</span>
          Assigning <code className="text-emerald-300">x = 10</code> inside a function automatically makes <code className="text-emerald-300">x</code> <em>Local</em>! If you read <code className="text-cyan-300">x</code> prior to that line, Python throws an <code className="text-rose-400">UnboundLocalError</code> instead of reading the global variable.
        </div>
      </div>
    </div>
  );
};
