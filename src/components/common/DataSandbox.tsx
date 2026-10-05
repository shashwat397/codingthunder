import React, { useState, useMemo } from 'react';
import { Database, Play, BarChart2, Table, Sparkles, RefreshCw, Terminal, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';

interface DatasetRow {
  [key: string]: any;
}

interface QueryPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  sql: string;
  python: string;
  chartType: 'bar' | 'line';
  metricKey: string;
  labelKey: string;
  metricPrefix?: string;
  metricSuffix?: string;
}

const SAMPLE_ORDERS = [
  { order_id: 'ORD-101', customer_id: 'CUST-09', category: 'Laptops & Devices', amount: 84999, status: 'delivered', country: 'India', date: '2026-09-01' },
  { order_id: 'ORD-102', customer_id: 'CUST-14', category: 'Cloud Infrastructure', amount: 18400, status: 'delivered', country: 'Singapore', date: '2026-09-03' },
  { order_id: 'ORD-103', customer_id: 'CUST-02', category: 'AI Developer Tools', amount: 4990, status: 'delivered', country: 'United States', date: '2026-09-05' },
  { order_id: 'ORD-104', customer_id: 'CUST-09', category: 'Laptops & Devices', amount: 32000, status: 'delivered', country: 'India', date: '2026-09-08' },
  { order_id: 'ORD-105', customer_id: 'CUST-21', category: 'Data Science Ebooks', amount: 1499, status: 'delivered', country: 'Germany', date: '2026-09-12' },
  { order_id: 'ORD-106', customer_id: 'CUST-33', category: 'AI Developer Tools', amount: 12500, status: 'delivered', country: 'India', date: '2026-09-15' },
  { order_id: 'ORD-107', customer_id: 'CUST-05', category: 'Cloud Infrastructure', amount: 45000, status: 'delivered', country: 'United States', date: '2026-09-18' },
  { order_id: 'ORD-108', customer_id: 'CUST-14', category: 'Data Science Ebooks', amount: 2999, status: 'delivered', country: 'Singapore', date: '2026-09-22' },
  { order_id: 'ORD-109', customer_id: 'CUST-44', category: 'AI Developer Tools', amount: 27900, status: 'delivered', country: 'India', date: '2026-09-27' },
  { order_id: 'ORD-110', customer_id: 'CUST-11', category: 'Laptops & Devices', amount: 62000, status: 'delivered', country: 'United States', date: '2026-09-30' },
];

const PRESETS: QueryPreset[] = [
  {
    id: 'top-categories',
    name: 'Revenue by Category',
    category: 'Sales Analytics',
    description: 'Aggregates sales volume, transaction count, and average order value across categories.',
    sql: `-- Top revenue product categories
SELECT 
  category, 
  COUNT(*) AS total_orders, 
  SUM(amount) AS total_revenue, 
  ROUND(AVG(amount)) AS avg_order_value
FROM orders
WHERE status = 'delivered'
GROUP BY category
ORDER BY total_revenue DESC;`,
    python: `# Pandas / Polars equivalent
df_delivered = df[df['status'] == 'delivered']
category_stats = (
    df_delivered.groupby('category')
    .agg(
        total_orders=('order_id', 'count'),
        total_revenue=('amount', 'sum'),
        avg_order_value=('amount', lambda x: round(x.mean()))
    )
    .sort_values(by='total_revenue', ascending=False)
    .reset_index()
)`,
    chartType: 'bar',
    labelKey: 'category',
    metricKey: 'total_revenue',
    metricPrefix: '₹',
  },
  {
    id: 'country-distribution',
    name: 'Geographic Volume',
    category: 'Market Penetration',
    description: 'Regional distribution of revenue and transaction frequency.',
    sql: `-- Regional breakdown of gross merchandise value
SELECT 
  country, 
  COUNT(DISTINCT customer_id) AS unique_buyers,
  SUM(amount) AS regional_revenue
FROM orders
GROUP BY country
ORDER BY regional_revenue DESC;`,
    python: `# Pandas aggregation
geo_perf = (
    df.groupby('country')
    .agg(
        unique_buyers=('customer_id', 'nunique'),
        regional_revenue=('amount', 'sum')
    )
    .sort_values('regional_revenue', ascending=False)
    .reset_index()
)`,
    chartType: 'bar',
    labelKey: 'country',
    metricKey: 'regional_revenue',
    metricPrefix: '₹',
  },
  {
    id: 'growth-timeline',
    name: 'Bi-Weekly Revenue Velocity',
    category: 'Time Series',
    description: 'Timeline velocity of transaction volume across early and late September.',
    sql: `-- Bi-weekly timeline growth velocity
SELECT 
  CASE 
    WHEN date <= '2026-09-15' THEN 'Sept 01-15'
    ELSE 'Sept 16-30'
  END AS period,
  COUNT(*) AS period_orders,
  SUM(amount) AS period_sales
FROM orders
GROUP BY period
ORDER BY period ASC;`,
    python: `# Feature engineered period column
df['period'] = df['date'].apply(lambda d: 'Sept 01-15' if d <= '2026-09-15' else 'Sept 16-30')
growth_series = df.groupby('period').agg(
    period_orders=('order_id', 'count'),
    period_sales=('amount', 'sum')
).reset_index()`,
    chartType: 'bar',
    labelKey: 'period',
    metricKey: 'period_sales',
    metricPrefix: '₹',
  },
];

export const DataSandbox: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('top-categories');
  const [mode, setMode] = useState<'sql' | 'python'>('sql');
  const [viewType, setViewType] = useState<'table' | 'chart'>('chart');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [lastExecutedMs, setLastExecutedMs] = useState<number>(18);

  const activePreset = useMemo(() => {
    return PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];
  }, [selectedPresetId]);

  // Compute mock execution results based on real in-memory data
  const queryResult = useMemo<DatasetRow[]>(() => {
    if (activePreset.id === 'top-categories') {
      const map: { [cat: string]: { count: number; sum: number } } = {};
      SAMPLE_ORDERS.forEach((o) => {
        if (!map[o.category]) map[o.category] = { count: 0, sum: 0 };
        map[o.category].count += 1;
        map[o.category].sum += o.amount;
      });
      return Object.keys(map)
        .map((cat) => ({
          category: cat,
          total_orders: map[cat].count,
          total_revenue: map[cat].sum,
          avg_order_value: Math.round(map[cat].sum / map[cat].count),
        }))
        .sort((a, b) => b.total_revenue - a.total_revenue);
    } else if (activePreset.id === 'country-distribution') {
      const map: { [c: string]: { buyers: Set<string>; sum: number } } = {};
      SAMPLE_ORDERS.forEach((o) => {
        if (!map[o.country]) map[o.country] = { buyers: new Set(), sum: 0 };
        map[o.country].buyers.add(o.customer_id);
        map[o.country].sum += o.amount;
      });
      return Object.keys(map)
        .map((country) => ({
          country,
          unique_buyers: map[country].buyers.size,
          regional_revenue: map[country].sum,
        }))
        .sort((a, b) => b.regional_revenue - a.regional_revenue);
    } else {
      const map: { [period: string]: { count: number; sum: number } } = {
        'Sept 01-15': { count: 0, sum: 0 },
        'Sept 16-30': { count: 0, sum: 0 },
      };
      SAMPLE_ORDERS.forEach((o) => {
        const p = o.date <= '2026-09-15' ? 'Sept 01-15' : 'Sept 16-30';
        map[p].count += 1;
        map[p].sum += o.amount;
      });
      return Object.keys(map).map((period) => ({
        period,
        period_orders: map[period].count,
        period_sales: map[period].sum,
      }));
    }
  }, [activePreset.id]);

  const maxMetricValue = useMemo(() => {
    return Math.max(...queryResult.map((r) => Number(r[activePreset.metricKey]) || 0), 1);
  }, [queryResult, activePreset]);

  const handleRunQuery = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setLastExecutedMs(Math.floor(Math.random() * 14) + 12);
    }, 280);
  };

  const handleCopyCode = () => {
    const code = mode === 'sql' ? activePreset.sql : activePreset.python;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-[#090d16] border border-amber-500/25 shadow-2xl overflow-hidden text-slate-200">
      {/* Top Banner / Window Controls */}
      <div className="p-4 sm:px-6 bg-[#0c101c] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2 text-xs font-mono">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-white font-bold">In-Browser Data Sandbox</span>
            <span className="text-slate-500 hidden sm:inline">· dataset: enterprise_orders.parquet</span>
          </div>
        </div>

        {/* SQL vs Python Language Toggle */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center text-xs font-mono">
            <button
              onClick={() => setMode('sql')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                mode === 'sql'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SQL (PostgreSQL)
            </button>
            <button
              onClick={() => setMode('python')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                mode === 'python'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Python (Pandas)
            </button>
          </div>
        </div>
      </div>

      {/* Preset Query Chips */}
      <div className="px-4 sm:px-6 py-3 bg-[#0a0e18] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs font-mono scrollbar-none">
        <span className="text-slate-500 text-[11px] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Templates:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setSelectedPresetId(preset.id)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all cursor-pointer ${
              selectedPresetId === preset.id
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Sandbox Grid: Left Editor & Right Live Viz */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* Left Column: Code Editor & Execution Bar (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>{mode === 'sql' ? 'Interactive Query Script' : 'DataFrame Transformation Script'}</span>
              </span>
              <button
                onClick={handleCopyCode}
                className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 font-mono text-[11px] cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Block Window */}
            <div className="relative rounded-2xl bg-[#06080f] border border-slate-800/90 p-4 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto text-amber-100">
              <pre className="whitespace-pre">
                <code>{mode === 'sql' ? activePreset.sql : activePreset.python}</code>
              </pre>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              💡 {activePreset.description}
            </p>
          </div>

          {/* Execution Bar */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DuckDB In-Memory Engine · {lastExecutedMs}ms response</span>
            </div>

            <button
              onClick={handleRunQuery}
              disabled={isRunning}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm font-mono transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Executing...' : 'Run Query'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Output & Visualization (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 bg-[#080c14] flex flex-col justify-between space-y-4">
          {/* Output Toolbar */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
              <span>Query Results</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                {queryResult.length} rows returned
              </span>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setViewType('chart')}
                className={`p-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                  viewType === 'chart'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Chart View"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chart</span>
              </button>
              <button
                onClick={() => setViewType('table')}
                className={`p-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                  viewType === 'table'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>

          {/* Dynamic Content View */}
          <div className="flex-1 min-h-[220px] flex flex-col justify-center">
            {viewType === 'chart' ? (
              <div className="space-y-3 py-2">
                {queryResult.map((row, idx) => {
                  const label = String(row[activePreset.labelKey] || `Item ${idx + 1}`);
                  const val = Number(row[activePreset.metricKey]) || 0;
                  const pct = Math.max(12, Math.round((val / maxMetricValue) * 100));

                  return (
                    <div key={idx} className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-300 truncate max-w-[180px]">{label}</span>
                        <span className="text-amber-400 font-bold">
                          {activePreset.metricPrefix || ''}
                          {val.toLocaleString()}
                          {activePreset.metricSuffix || ''}
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Table Grid View */
              <div className="overflow-x-auto rounded-xl border border-slate-800 text-[11px] font-mono">
                <table className="w-full text-left">
                  <thead className="bg-[#0c101c] text-slate-400 border-b border-slate-800">
                    <tr>
                      {Object.keys(queryResult[0] || {}).map((col) => (
                        <th key={col} className="px-3 py-2 uppercase text-[10px] font-semibold">
                          {col.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-[#06080f]">
                    {queryResult.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        {Object.values(row).map((v, cIdx) => (
                          <td key={cIdx} className="px-3 py-2 text-slate-300 whitespace-nowrap">
                            {typeof v === 'number' ? v.toLocaleString() : String(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom Analytical Insight */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Real telemetry analysis running directly in your browser. Master modern SQL and Pandas in our Data Science courses!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
