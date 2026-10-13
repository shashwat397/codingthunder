import React from 'react';

export const PowerBIETLDiagram: React.FC = () => {
  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Power Query Mashup Pipeline
          </span>
          <h4 className="text-lg font-bold text-white">ETL Lifecycle & Query Folding Architecture</h4>
        </div>
        <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          M Engine Execution
        </span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 900 320" className="w-full min-w-[740px] h-auto font-sans select-none">
          <defs>
            <marker id="arrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker id="arrowOrange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* STEP 1: EXTRACT */}
          <g>
            <rect x="20" y="50" width="220" height="220" rx="14" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
            <rect x="35" y="65" width="190" height="28" rx="6" fill="#10b981" fillOpacity="0.15" />
            <text x="130" y="84" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="700">1. EXTRACT (INGESTION)</text>

            <rect x="35" y="105" width="190" height="36" rx="6" fill="#1e293b" />
            <text x="130" y="127" textAnchor="middle" fill="#cbd5e1" fontSize="11">RDBMS: SQL Server, Oracle</text>

            <rect x="35" y="150" width="190" height="36" rx="6" fill="#1e293b" />
            <text x="130" y="172" textAnchor="middle" fill="#cbd5e1" fontSize="11">Lakehouse: Snowflake, Parquet</text>

            <rect x="35" y="195" width="190" height="36" rx="6" fill="#1e293b" />
            <text x="130" y="217" textAnchor="middle" fill="#cbd5e1" fontSize="11">SaaS APIs: Salesforce, Web</text>

            <text x="130" y="255" textAnchor="middle" fill="#64748b" fontSize="10">Connector Auth & Credentials</text>
          </g>

          {/* Arrow 1 to 2 */}
          <path d="M 240 160 L 290 160" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrowGreen)" />

          {/* STEP 2: TRANSFORM (POWER QUERY) */}
          <g>
            <rect x="300" y="30" width="310" height="260" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
            <rect x="315" y="45" width="280" height="28" rx="6" fill="#f59e0b" fillOpacity="0.15" />
            <text x="455" y="64" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="700">2. TRANSFORM (M ENGINE)</text>

            {/* Transform operations */}
            <g transform="translate(315, 85)">
              <rect x="0" y="0" width="280" height="32" rx="6" fill="#1e293b" />
              <text x="12" y="20" fill="#e2e8f0" fontSize="11">Type Casting & Header Promotion</text>
              <circle cx="260" cy="16" r="6" fill="#10b981" />

              <rect x="0" y="38" width="280" height="32" rx="6" fill="#1e293b" />
              <text x="12" y="58" fill="#e2e8f0" fontSize="11">Filter Rows & Remove Nulls</text>
              <circle cx="260" cy="54" r="6" fill="#10b981" />

              <rect x="0" y="76" width="280" height="32" rx="6" fill="#1e293b" />
              <text x="12" y="96" fill="#e2e8f0" fontSize="11">Unpivot Cross-Tabular Columns</text>
              <circle cx="260" cy="92" r="6" fill="#10b981" />

              <rect x="0" y="114" width="280" height="32" rx="6" fill="#1e293b" />
              <text x="12" y="134" fill="#e2e8f0" fontSize="11">Merge (JOIN) & Append (UNION)</text>
              <circle cx="260" cy="130" r="6" fill="#10b981" />
            </g>

            {/* Query folding badge inside box */}
            <rect x="330" y="240" width="250" height="36" rx="8" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
            <text x="455" y="262" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="700">
              ⚡ Query Folding: Pushed to Source SQL
            </text>
          </g>

          {/* Arrow 2 to 3 */}
          <path d="M 610 160 L 660 160" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arrowOrange)" />

          {/* STEP 3: LOAD (VERTIPAQ) */}
          <g>
            <rect x="670" y="50" width="210" height="220" rx="14" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
            <rect x="685" y="65" width="180" height="28" rx="6" fill="#06b6d4" fillOpacity="0.15" />
            <text x="775" y="84" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="700">3. LOAD (VERTIPAQ)</text>

            <rect x="685" y="105" width="180" height="38" rx="6" fill="#1e293b" />
            <text x="775" y="124" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">Columnar Compression</text>
            <text x="775" y="137" textAnchor="middle" fill="#94a3b8" fontSize="9">Dictionary & RLE Encoding</text>

            <rect x="685" y="152" width="180" height="38" rx="6" fill="#1e293b" />
            <text x="775" y="171" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">Star Schema Storage</text>
            <text x="775" y="184" textAnchor="middle" fill="#94a3b8" fontSize="9">Facts & Dimensions Ready</text>

            <rect x="685" y="200" width="180" height="38" rx="6" fill="#1e293b" />
            <text x="775" y="219" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">In-Memory RAM Cache</text>
            <text x="775" y="232" textAnchor="middle" fill="#94a3b8" fontSize="9">Blazing-Fast DAX Querying</text>

            <text x="775" y="258" textAnchor="middle" fill="#64748b" fontSize="10">Report Canvas Ready</text>
          </g>
        </svg>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
        <span className="text-amber-400 font-bold">Pro Tip:</span>
        <span>Always check <em>View Native Query</em> in Power Query steps. If it is enabled, your transformations execute directly inside the source database engine with zero Power BI memory overhead!</span>
      </div>
    </div>
  );
};
