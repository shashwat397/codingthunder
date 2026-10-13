import React, { useState } from 'react';

type JoinType = 'inner' | 'left' | 'right' | 'full' | 'left_anti';

export const SQLJoinsVennDiagram: React.FC = () => {
  const [selectedJoin, setSelectedJoin] = useState<JoinType>('inner');

  const joinConfigs: Record<
    JoinType,
    {
      title: string;
      subtitle: string;
      badge: string;
      color: string;
      fillA: string;
      fillB: string;
      fillIntersect: string;
      sql: string;
      explanation: string;
      resultSummary: string;
    }
  > = {
    inner: {
      title: 'INNER JOIN',
      subtitle: 'Intersection (A ∩ B)',
      badge: 'Matches Only',
      color: 'text-cyan-400',
      fillA: '#1e293b', // slate-800
      fillB: '#1e293b',
      fillIntersect: '#06b6d4', // cyan-500
      sql: `SELECT 
  u.user_id,
  u.risk_tier,
  t.transaction_id,
  t.amount
FROM dim_users u
INNER JOIN fact_transactions t
  ON u.user_id = t.user_id;`,
      explanation:
        'Returns rows only when there is a match in BOTH Table A (dim_users) and Table B (fact_transactions). Users without transactions and orphaned transactions are completely excluded.',
      resultSummary: 'Retains only users who have conducted at least 1 validated transaction.',
    },
    left: {
      title: 'LEFT JOIN (LEFT OUTER)',
      subtitle: 'All Left + Matching Right',
      badge: 'Preserve Table A',
      color: 'text-blue-400',
      fillA: '#3b82f6', // blue-500
      fillB: '#1e293b',
      fillIntersect: '#3b82f6',
      sql: `SELECT 
  u.user_id,
  u.risk_tier,
  COALESCE(t.amount, 0) AS total_spent,
  t.transaction_id
FROM dim_users u
LEFT JOIN fact_transactions t
  ON u.user_id = t.user_id;`,
      explanation:
        'Returns ALL records from Table A (dim_users) and matched records from Table B. If no match exists in Table B, NULL values are populated for transaction attributes.',
      resultSummary: 'Essential for churn analysis: preserves users who signed up but never made a purchase.',
    },
    right: {
      title: 'RIGHT JOIN (RIGHT OUTER)',
      subtitle: 'All Right + Matching Left',
      badge: 'Preserve Table B',
      color: 'text-emerald-400',
      fillA: '#1e293b',
      fillB: '#10b981', // emerald-500
      fillIntersect: '#10b981',
      sql: `SELECT 
  u.user_id,
  u.email,
  t.transaction_id,
  t.amount
FROM dim_users u
RIGHT JOIN fact_transactions t
  ON u.user_id = t.user_id;`,
      explanation:
        'Returns ALL records from Table B (fact_transactions) and the matched records from Table A. If a transaction has a user_id that does not exist in dim_users, user attributes are NULL.',
      resultSummary: 'Detects orphaned transaction records or pipeline sync failures where user account creation dropped.',
    },
    full: {
      title: 'FULL OUTER JOIN',
      subtitle: 'Union (A ∪ B)',
      badge: 'Preserve Both Tables',
      color: 'text-purple-400',
      fillA: '#a855f7', // purple-500
      fillB: '#a855f7',
      fillIntersect: '#c084fc',
      sql: `SELECT 
  u.user_id AS user_dim_id,
  t.user_id AS tx_user_id,
  t.amount,
  u.risk_tier
FROM dim_users u
FULL OUTER JOIN fact_transactions t
  ON u.user_id = t.user_id;`,
      explanation:
        'Combines results of both LEFT and RIGHT joins. Returns all rows from both tables, with NULLs on either side when there is no relational key match.',
      resultSummary: 'Standard for cross-system database reconciliations (e.g., Stripe ledger vs Internal database).',
    },
    left_anti: {
      title: 'LEFT ANTI-JOIN (A without B)',
      subtitle: 'Exclusive Left (A - B)',
      badge: 'Find Inactive / Attrition',
      color: 'text-rose-400',
      fillA: '#f43f5e', // rose-500
      fillB: '#1e293b',
      fillIntersect: '#1e293b',
      sql: `SELECT 
  u.user_id,
  u.email,
  u.created_at
FROM dim_users u
LEFT JOIN fact_transactions t
  ON u.user_id = t.user_id
WHERE t.transaction_id IS NULL;`,
      explanation:
        'A LEFT JOIN followed by `WHERE right_table.key IS NULL`. Isolates rows in Table A that have ZERO occurrences or matches in Table B.',
      resultSummary: 'Identifies completely inactive or ghost accounts with 0 transactions since onboarding.',
    },
  };

  const current = joinConfigs[selectedJoin];

  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            Interactive SQL Set Theory
          </span>
          <h3 className="text-lg font-bold text-white mt-1">SQL Joins Venn Diagrams & Relational Logic</h3>
        </div>
        <span className="text-xs text-slate-400">Click a join strategy to inspect visual set intersections</span>
      </div>

      {/* Button Switcher */}
      <div className="flex flex-wrap gap-2 pt-6 pb-4">
        {(Object.keys(joinConfigs) as JoinType[]).map((type) => {
          const cfg = joinConfigs[type];
          const isSelected = selectedJoin === type;
          return (
            <button
              key={type}
              onClick={() => setSelectedJoin(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-slate-800 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cfg.title.split(' ')[0]} {cfg.title.includes('ANTI') ? 'ANTI-JOIN' : 'JOIN'}
            </button>
          );
        })}
      </div>

      {/* Visual Canvas & Code Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Venn Diagram */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950/80 border border-slate-800/90">
          <svg viewBox="0 0 400 240" className="w-full max-w-[340px] drop-shadow-2xl">
            <defs>
              <mask id="intersectMask">
                <rect width="400" height="240" fill="white" />
                <circle cx="160" cy="120" r="85" fill="black" />
              </mask>
              <mask id="onlyAMask">
                <rect width="400" height="240" fill="white" />
                <circle cx="240" cy="120" r="85" fill="black" />
              </mask>
              <mask id="onlyBMask">
                <rect width="400" height="240" fill="white" />
                <circle cx="160" cy="120" r="85" fill="black" />
              </mask>
              <clipPath id="circleAClip">
                <circle cx="160" cy="120" r="85" />
              </clipPath>
            </defs>

            {/* Left Circle A */}
            <circle
              cx="160"
              cy="120"
              r="85"
              fill={current.fillA}
              fillOpacity={current.fillA === '#1e293b' ? 0.35 : 0.85}
              stroke="#64748b"
              strokeWidth="2"
              className="transition-all duration-300"
            />

            {/* Right Circle B */}
            <circle
              cx="240"
              cy="120"
              r="85"
              fill={current.fillB}
              fillOpacity={current.fillB === '#1e293b' ? 0.35 : 0.85}
              stroke="#64748b"
              strokeWidth="2"
              className="transition-all duration-300"
            />

            {/* Intersection Overlay */}
            <g clipPath="url(#circleAClip)">
              <circle
                cx="240"
                cy="120"
                r="85"
                fill={current.fillIntersect}
                fillOpacity={current.fillIntersect === '#1e293b' ? 0.35 : 0.9}
                className="transition-all duration-300"
              />
            </g>

            {/* Labels */}
            <text x="110" y="125" fill="#f8fafc" fontSize="13" fontWeight="bold" fontFamily="monospace">
              Table A
            </text>
            <text x="95" y="145" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
              (dim_users)
            </text>

            <text x="250" y="125" fill="#f8fafc" fontSize="13" fontWeight="bold" fontFamily="monospace">
              Table B
            </text>
            <text x="235" y="145" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
              (transactions)
            </text>

            {selectedJoin === 'inner' && (
              <text x="180" y="125" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                A ∩ B
              </text>
            )}
          </svg>

          <div className="mt-4 text-center">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${current.color}`}>
              {current.title}
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">{current.subtitle}</span>
          </div>
        </div>

        {/* SQL Code & Analytical Context */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400 font-semibold">Standard SQL Query Syntax</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                PostgreSQL / Snowflake
              </span>
            </div>
            <pre className="font-mono text-xs text-cyan-200 bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/90 overflow-x-auto leading-relaxed">
              <code>{current.sql}</code>
            </pre>
          </div>

          <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/30 text-xs text-slate-300 space-y-2">
            <p className="leading-relaxed">{current.explanation}</p>
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-cyan-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{current.resultSummary}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
