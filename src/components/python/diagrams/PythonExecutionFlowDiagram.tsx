import React from 'react';

export const PythonExecutionFlowDiagram: React.FC = () => {
  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Execution Architecture
          </span>
          <h4 className="text-lg font-bold text-white">How Python Runs: Source Code → Bytecode → PVM</h4>
        </div>
        <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          Interpreter Internals
        </span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 900 240" className="w-full min-w-[750px] h-auto font-sans select-none">
          <defs>
            <marker id="arrowAmber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#f59e0b" />
            </marker>
            <marker id="arrowCyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4" />
            </marker>
          </defs>

          {/* Step 1: Source File */}
          <g>
            <rect x="20" y="30" width="180" height="150" rx="12" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
            <rect x="35" y="45" width="40" height="20" rx="4" fill="#3b82f6" fillOpacity="0.2" />
            <text x="55" y="59" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="bold">STEP 1</text>
            <text x="110" y="90" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">Source Code</text>
            <text x="110" y="112" textAnchor="middle" fill="#93c5fd" fontSize="12" fontFamily="monospace">script.py</text>
            <text x="110" y="140" textAnchor="middle" fill="#64748b" fontSize="10">Human-readable instructions</text>
            <text x="110" y="156" textAnchor="middle" fill="#64748b" fontSize="10">Lexing & Parsing (AST)</text>
          </g>

          {/* Connector 1 */}
          <g>
            <path d="M 200 105 L 255 105" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arrowAmber)" />
            <text x="228" y="95" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="monospace">Compiles</text>
          </g>

          {/* Step 2: Bytecode */}
          <g>
            <rect x="260" y="30" width="180" height="150" rx="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
            <rect x="275" y="45" width="40" height="20" rx="4" fill="#f59e0b" fillOpacity="0.2" />
            <text x="295" y="59" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">STEP 2</text>
            <text x="350" y="90" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">Bytecode</text>
            <text x="350" y="112" textAnchor="middle" fill="#fde047" fontSize="12" fontFamily="monospace">script.pyc</text>
            <text x="350" y="140" textAnchor="middle" fill="#64748b" fontSize="10">Low-level intermediate code</text>
            <text x="350" y="156" textAnchor="middle" fill="#64748b" fontSize="10">Cached in __pycache__/</text>
          </g>

          {/* Connector 2 */}
          <g>
            <path d="M 440 105 L 495 105" stroke="#06b6d4" strokeWidth="2.5" markerEnd="url(#arrowCyan)" />
            <text x="468" y="95" textAnchor="middle" fill="#22d3ee" fontSize="10" fontFamily="monospace">Loads</text>
          </g>

          {/* Step 3: Python Virtual Machine */}
          <g>
            <rect x="500" y="30" width="180" height="150" rx="12" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
            <rect x="515" y="45" width="40" height="20" rx="4" fill="#06b6d4" fillOpacity="0.2" />
            <text x="535" y="59" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold">STEP 3</text>
            <text x="590" y="90" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">PVM (Interpreter)</text>
            <text x="590" y="112" textAnchor="middle" fill="#67e8f9" fontSize="12" fontFamily="monospace">C-Loop / Stack Engine</text>
            <text x="590" y="140" textAnchor="middle" fill="#64748b" fontSize="10">CPython Virtual Machine</text>
            <text x="590" y="156" textAnchor="middle" fill="#64748b" fontSize="10">Evaluates opcode by opcode</text>
          </g>

          {/* Connector 3 */}
          <g>
            <path d="M 680 105 L 735 105" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrowCyan)" />
            <text x="708" y="95" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace">Executes</text>
          </g>

          {/* Step 4: Machine / CPU */}
          <g>
            <rect x="740" y="30" width="140" height="150" rx="12" fill="#064e3b" fillOpacity="0.3" stroke="#10b981" strokeWidth="1.5" />
            <rect x="755" y="45" width="40" height="20" rx="4" fill="#10b981" fillOpacity="0.2" />
            <text x="775" y="59" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">OUTPUT</text>
            <text x="810" y="90" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">Native CPU</text>
            <text x="810" y="112" textAnchor="middle" fill="#a7f3d0" fontSize="12" fontFamily="monospace">0101 Machine</text>
            <text x="810" y="140" textAnchor="middle" fill="#6ee7b7" fontSize="10">Hardware execution</text>
            <text x="810" y="156" textAnchor="middle" fill="#6ee7b7" fontSize="10">STDOUT / Memory / OS</text>
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <span className="font-bold text-amber-400 block mb-1">1. Why Bytecode (.pyc)?</span>
          Bytecode is not native machine code. It is an optimized intermediate representation for the PVM, enabling Python to start up much faster on subsequent runs by skipping lexical parsing.
        </div>
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <span className="font-bold text-cyan-400 block mb-1">2. CPython is the Default</span>
          CPython is written in C. It compiles code into bytecode, then executes it inside an evaluation loop (<code className="text-amber-300">ceval.c</code>). Alternatives include PyPy (JIT) and Jython (JVM).
        </div>
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <span className="font-bold text-emerald-400 block mb-1">3. Dynamic vs Static</span>
          Python is strongly & dynamically typed. Types are verified at runtime by the PVM, meaning variables are references to memory objects, not typed memory buckets.
        </div>
      </div>
    </div>
  );
};
