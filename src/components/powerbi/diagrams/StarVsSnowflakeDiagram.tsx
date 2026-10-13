import React from 'react';

export const StarVsSnowflakeDiagram: React.FC = () => {
  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Dimensional Schema Comparison
          </span>
          <h4 className="text-lg font-bold text-white">Star Schema (Best Practice) vs. Snowflake Schema</h4>
        </div>
        <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
          Ralph Kimball Model
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: STAR SCHEMA */}
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              STAR SCHEMA (GOLD STANDARD)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              1-Hop Fast Traversal
            </span>
          </div>

          <svg viewBox="0 0 380 260" className="w-full h-auto font-sans select-none">
            {/* Center: Fact Table */}
            <rect x="130" y="90" width="120" height="70" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
            <text x="190" y="118" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="700">Fact_Sales</text>
            <text x="190" y="136" textAnchor="middle" fill="#94a3b8" fontSize="10">20M+ Rows (Narrow)</text>

            {/* Surrounding Dimension Tables */}
            {/* Dim_Customer (Top) */}
            <rect x="130" y="10" width="120" height="42" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            <text x="190" y="32" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">Dim_Customer (1)</text>
            <text x="190" y="44" textAnchor="middle" fill="#64748b" fontSize="8">Demographics, Geographies</text>
            <path d="M 190 52 L 190 90" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Dim_Date (Right) */}
            <rect x="270" y="104" width="100" height="42" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            <text x="320" y="126" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">Dim_Date (1)</text>
            <text x="320" y="138" textAnchor="middle" fill="#64748b" fontSize="8">Fiscal, Calendar</text>
            <path d="M 270 125 L 250 125" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Dim_Product (Bottom) */}
            <rect x="130" y="200" width="120" height="42" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            <text x="190" y="222" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">Dim_Product (1)</text>
            <text x="190" y="234" textAnchor="middle" fill="#64748b" fontSize="8">SKU, Brand, Category</text>
            <path d="M 190 160 L 190 200" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Dim_Store (Left) */}
            <rect x="10" y="104" width="100" height="42" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            <text x="60" y="126" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">Dim_Store (1)</text>
            <text x="60" y="138" textAnchor="middle" fill="#64748b" fontSize="8">Retail, Online</text>
            <path d="M 110 125 L 130 125" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
          </svg>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            All dimension tables connect <strong>directly to the Fact table in a single hop</strong>. Peak query performance, simplest DAX expressions, and maximum VertiPaq compression.
          </p>
        </div>

        {/* RIGHT: SNOWFLAKE SCHEMA */}
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              SNOWFLAKE SCHEMA (NORMALIZED)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
              Multi-Hop Chaining
            </span>
          </div>

          <svg viewBox="0 0 380 260" className="w-full h-auto font-sans select-none">
            {/* Center: Fact Table */}
            <rect x="20" y="95" width="95" height="60" rx="6" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="67" y="123" textAnchor="middle" fill="#fda4af" fontSize="11" fontWeight="700">Fact_Sales</text>
            <text x="67" y="139" textAnchor="middle" fill="#94a3b8" fontSize="9">Fact</text>

            {/* Product Dimension */}
            <path d="M 115 125 L 140 125" stroke="#f43f5e" strokeWidth="1.5" />
            <rect x="140" y="95" width="95" height="60" rx="6" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
            <text x="187" y="123" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="600">Dim_Product</text>
            <text x="187" y="137" textAnchor="middle" fill="#64748b" fontSize="8">SubCategoryFK</text>

            {/* Subcategory Dimension (Hop 2) */}
            <path d="M 235 125 L 260 125" stroke="#f43f5e" strokeWidth="1.5" />
            <rect x="260" y="95" width="105" height="60" rx="6" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
            <text x="312" y="123" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="600">Dim_SubCat</text>
            <text x="312" y="137" textAnchor="middle" fill="#64748b" fontSize="8">CategoryFK</text>

            {/* Category Dimension (Hop 3) */}
            <path d="M 312 95 L 312 60" stroke="#f43f5e" strokeWidth="1.5" />
            <rect x="260" y="15" width="105" height="45" rx="6" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
            <text x="312" y="38" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="600">Dim_Category</text>
            <text x="312" y="49" textAnchor="middle" fill="#64748b" fontSize="8">Root Level</text>
          </svg>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Dimensions are <strong>split into sub-normalized tables</strong> requiring 2 to 3 hops to filter. Increases relationship overhead, complicates DAX filter propagation, and degrades VertiPaq speeds.
          </p>
        </div>
      </div>
    </div>
  );
};
