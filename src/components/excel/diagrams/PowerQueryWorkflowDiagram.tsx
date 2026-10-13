import React from 'react';

export const PowerQueryWorkflowDiagram: React.FC = () => {
  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Automated ETL Pipeline
          </span>
          <h4 className="text-lg font-bold text-white">Power Query End-to-End Workflow: Extract $\to$ Transform $\to$ Load</h4>
        </div>
        <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          M Code Engine
        </span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 920 280" className="w-full min-w-[760px] h-auto font-sans select-none">
          <defs>
            <marker id="pqArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* 1. EXTRACT */}
          <rect x="20" y="30" width="200" height="200" rx="12" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
          <rect x="35" y="45" width="60" height="20" rx="4" fill="#3b82f6" fillOpacity="0.2" />
          <text x="65" y="59" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="bold">EXTRACT</text>
          <text x="120" y="90" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">Diverse Data Sources</text>
          
          <rect x="35" y="105" width="170" height="28" rx="6" fill="#1e293b" />
          <text x="120" y="123" textAnchor="middle" fill="#93c5fd" fontSize="10">CSV / JSON Logs</text>
          
          <rect x="35" y="140" width="170" height="28" rx="6" fill="#1e293b" />
          <text x="120" y="158" textAnchor="middle" fill="#93c5fd" fontSize="10">PostgreSQL / Snowflake</text>
          
          <rect x="35" y="175" width="170" height="28" rx="6" fill="#1e293b" />
          <text x="120" y="193" textAnchor="middle" fill="#93c5fd" fontSize="10">SharePoint Folder Dumps</text>

          {/* Connector 1 */}
          <path d="M 220 130 L 275 130" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#pqArrow)" />

          {/* 2. TRANSFORM (M ENGINE) */}
          <rect x="280" y="30" width="360" height="200" rx="12" fill="#0c4a6e" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="295" y="45" width="85" height="20" rx="4" fill="#0284c7" fillOpacity="0.3" />
          <text x="337" y="59" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">TRANSFORM</text>
          <text x="460" y="90" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">Power Query M Mashup Engine</text>

          <g>
            <rect x="295" y="105" width="155" height="48" rx="6" fill="#0f172a" stroke="#0369a1" strokeWidth="1" />
            <text x="372" y="124" textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold">Data Cleansing</text>
            <text x="372" y="140" textAnchor="middle" fill="#7dd3fc" fontSize="9">Promote headers, Unpivot</text>

            <rect x="465" y="105" width="160" height="48" rx="6" fill="#0f172a" stroke="#0369a1" strokeWidth="1" />
            <text x="545" y="124" textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold">Normalization</text>
            <text x="545" y="140" textAnchor="middle" fill="#7dd3fc" fontSize="9">Text.Trim, Type Casting</text>

            <rect x="295" y="160" width="155" height="48" rx="6" fill="#0f172a" stroke="#0369a1" strokeWidth="1" />
            <text x="372" y="179" textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold">Join & Merge</text>
            <text x="372" y="195" textAnchor="middle" fill="#7dd3fc" fontSize="9">Left Outer, Inner Joins</text>

            <rect x="465" y="160" width="160" height="48" rx="6" fill="#0f172a" stroke="#0369a1" strokeWidth="1" />
            <text x="545" y="179" textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold">Audit Logging</text>
            <text x="545" y="195" textAnchor="middle" fill="#7dd3fc" fontSize="9">Repeatable step chain</text>
          </g>

          {/* Connector 2 */}
          <path d="M 640 130 L 695 130" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#pqArrow)" />

          {/* 3. LOAD */}
          <rect x="700" y="30" width="200" height="200" rx="12" fill="#064e3b" fillOpacity="0.3" stroke="#10b981" strokeWidth="1.5" />
          <rect x="715" y="45" width="55" height="20" rx="4" fill="#10b981" fillOpacity="0.2" />
          <text x="742" y="59" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">LOAD</text>
          <text x="800" y="90" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">Excel / Data Model</text>

          <rect x="715" y="110" width="170" height="32" rx="6" fill="#1e293b" />
          <text x="800" y="130" textAnchor="middle" fill="#a7f3d0" fontSize="10">Excel Table Sheet</text>

          <rect x="715" y="155" width="170" height="32" rx="6" fill="#1e293b" />
          <text x="800" y="175" textAnchor="middle" fill="#a7f3d0" fontSize="10">Power Pivot Data Model (xVelocity)</text>
        </svg>
      </div>

      <div className="text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
        <span className="font-bold text-emerald-400">The 1-Click Refresh Rule:</span> Power Query records every step as declarative M code. When next month's 500,000-row batch arrives, clicking <strong>Data $\to$ Refresh All</strong> re-executes all transformations in seconds with zero manual manual copy-pasting.
      </div>
    </div>
  );
};
