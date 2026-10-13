import React, { useState } from 'react';
import { Database, Key, Link2, Layers, CheckCircle } from 'lucide-react';

export const DataEngineeringERDiagram: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<string>('fact_transactions');

  const entities = [
    {
      id: 'fact_transactions',
      name: 'fact_ecommerce_transactions',
      type: 'Fact Table (Transaction Grain)',
      badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
      description:
        'Central analytical fact table recording all completed and pending e-commerce orders. Contains additive numeric facts and foreign keys to all dimension entities.',
      columns: [
        { name: 'transaction_sk', type: 'BIGINT', key: 'PK', role: 'Surrogate Hash Key' },
        { name: 'customer_sk', type: 'BIGINT', key: 'FK', role: 'Dimension Reference (1:N)' },
        { name: 'product_sk', type: 'BIGINT', key: 'FK', role: 'Dimension Reference (1:N)' },
        { name: 'date_sk', type: 'INTEGER', key: 'FK', role: 'Temporal Reference (1:N)' },
        { name: 'order_id', type: 'VARCHAR(64)', key: 'NK', role: 'Degenerate Natural Key' },
        { name: 'quantity', type: 'INTEGER', key: '', role: 'Additive Measurement' },
        { name: 'unit_price', type: 'NUMERIC(10,2)', key: '', role: 'Semi-Additive Metric' },
        { name: 'total_amount', type: 'NUMERIC(12,2)', key: '', role: 'Fully Additive Revenue' },
        { name: 'estimated_margin', type: 'NUMERIC(12,2)', key: '', role: 'Computed Profit Metric' },
        { name: 'is_fraud_flagged', type: 'BOOLEAN', key: '', role: 'Audit Dimension Flag' },
      ],
    },
    {
      id: 'dim_customers',
      name: 'dim_customers',
      type: 'Dimension Table (SCD Type 2)',
      badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
      description:
        'Conformed customer entity tracking demographic segments, churn propensity score, and historical address mutations with effective date ranges.',
      columns: [
        { name: 'customer_sk', type: 'BIGINT', key: 'PK', role: 'Surrogate Primary Key' },
        { name: 'natural_customer_id', type: 'VARCHAR(64)', key: 'NK', role: 'Source System Natural Key' },
        { name: 'customer_segment', type: 'VARCHAR(30)', key: '', role: 'Categorical Slicing' },
        { name: 'country_code', type: 'CHAR(2)', key: '', role: 'Geographic Dimension' },
        { name: 'valid_from', type: 'TIMESTAMP', key: '', role: 'SCD Type 2 Start Range' },
        { name: 'valid_to', type: 'TIMESTAMP', key: '', role: 'SCD Type 2 End Range' },
        { name: 'is_current_flag', type: 'BOOLEAN', key: '', role: 'Active Record Indicator' },
      ],
    },
    {
      id: 'dim_products',
      name: 'dim_products',
      type: 'Dimension Table (Conformed)',
      badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
      description:
        'Catalog of all merchandise SKUs, hierarchical product categories, manufacturing brands, and base unit costs for gross margin calculations.',
      columns: [
        { name: 'product_sk', type: 'BIGINT', key: 'PK', role: 'Surrogate Primary Key' },
        { name: 'product_sku', type: 'VARCHAR(64)', key: 'NK', role: 'Source SKU Natural Key' },
        { name: 'category', type: 'VARCHAR(80)', key: '', role: 'Parent Hierarchy' },
        { name: 'brand_name', type: 'VARCHAR(100)', key: '', role: 'Brand Attribute' },
        { name: 'base_unit_cost', type: 'NUMERIC(10,2)', key: '', role: 'Cost Basis' },
      ],
    },
    {
      id: 'dim_date',
      name: 'dim_date',
      type: 'Temporal Dimension',
      badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-500/10',
      description:
        'Static calendar dimension containing holiday flags, fiscal quarters, and time-intelligence attributes for high-speed date grouping.',
      columns: [
        { name: 'date_sk', type: 'INTEGER', key: 'PK', role: 'Integer Date Key (YYYYMMDD)' },
        { name: 'full_date', type: 'DATE', key: '', role: 'Calendar ISO Date' },
        { name: 'day_of_week', type: 'VARCHAR(15)', key: '', role: 'Weekday Name' },
        { name: 'fiscal_quarter', type: 'CHAR(2)', key: '', role: 'Q1 / Q2 / Q3 / Q4' },
        { name: 'is_black_friday_promo', type: 'BOOLEAN', key: '', role: 'Seasonal Campaign Flag' },
      ],
    },
  ];

  const current = entities.find((e) => e.id === selectedEntity) || entities[0];

  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
            Dimensional Modeling
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Gold Layer Star Schema: Fact & Dimensions ER Diagram
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> PK
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> FK
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> 1-to-Many (1:N)
          </span>
        </div>
      </div>

      {/* Visual Star Schema Topology */}
      <div className="py-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        {entities.map((ent) => {
          const isSelected = selectedEntity === ent.id;
          const isFact = ent.id === 'fact_transactions';
          return (
            <div
              key={ent.id}
              onClick={() => setSelectedEntity(ent.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? isFact
                    ? 'border-amber-400 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                    : 'border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${ent.badgeColor}`}>
                  {isFact ? 'CENTRAL FACT' : 'DIMENSION'}
                </span>
                <Database className={`w-3.5 h-3.5 ${isFact ? 'text-amber-400' : 'text-cyan-400'}`} />
              </div>
              <h4 className="text-xs font-mono font-bold text-white truncate">{ent.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{ent.type}</p>
            </div>
          );
        })}
      </div>

      {/* Selected Entity Detailed Schema Inspector */}
      <div className="mt-2 p-5 rounded-xl border border-slate-800 bg-slate-900/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold font-mono text-cyan-300">{current.name}</h4>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${current.badgeColor}`}>
                {current.type}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{current.description}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 px-3">Constraint</th>
                <th className="py-2 px-3">Column Name</th>
                <th className="py-2 px-3">SQL Type</th>
                <th className="py-2 px-3 font-sans">Data Warehouse Architectural Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {current.columns.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2 px-3">
                    {c.key === 'PK' ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <Key className="w-2.5 h-2.5" /> SURROGATE PK
                      </span>
                    ) : c.key === 'FK' ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        <Link2 className="w-2.5 h-2.5" /> DIM FK (1:N)
                      </span>
                    ) : c.key === 'NK' ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        NATURAL KEY
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-slate-200 font-semibold">{c.name}</td>
                  <td className="py-2 px-3 text-cyan-400">{c.type}</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">{c.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
