import React, { useState } from 'react';
import { Database, FileCode, Play, Copy, Check, Terminal, Sparkles, TrendingUp } from 'lucide-react';

interface SkillRow {
  skill: string;
  salary: string;
  growth: string;
  tier: string;
  badgeColor: string;
}

const SQL_ROWS: SkillRow[] = [
  { skill: 'Generative AI & LLMs', salary: '$178,000', growth: '+62%', tier: 'Tier 1 • AI Core', badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { skill: 'PySpark & Big Data', salary: '$165,000', growth: '+48%', tier: 'Tier 1 • Distributed', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { skill: 'Cloud Warehousing (Snowflake)', salary: '$158,000', growth: '+36%', tier: 'Tier 1 • Lakehouse', badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  { skill: 'Python & Machine Learning', salary: '$152,000', growth: '+41%', tier: 'Tier 2 • Predictive', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
];

const PYTHON_ROWS: SkillRow[] = [
  { skill: 'Polars & Vectorized ETL', salary: '$172,000', growth: '+58%', tier: 'High-Throughput', badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  { skill: 'PyTorch Model Fine-Tuning', salary: '$182,000', growth: '+65%', tier: 'Deep Learning', badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { skill: 'FastAPI Microservices', salary: '$148,000', growth: '+32%', tier: 'Backend & APIs', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { skill: 'Airflow Pipeline DAGs', salary: '$156,000', growth: '+39%', tier: 'Orchestration', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
];

export const HeroCodeWindow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sql' | 'python'>('sql');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [executionTime, setExecutionTime] = useState('14ms');
  const [rows, setRows] = useState<SkillRow[]>(SQL_ROWS);

  const sqlCode = `-- Analyze 2026 highest compensation data skills
SELECT 
  skill, 
  AVG(base_salary_usd) AS avg_salary,
  growth_yoy_pct       AS demand_growth,
  hiring_tier
FROM thunder_lakehouse.tech_careers_2026
WHERE category IN ('Data', 'AI', 'Lakehouse')
GROUP BY skill, growth_yoy_pct, hiring_tier
ORDER BY avg_salary DESC
LIMIT 4;`;

  const pythonCode = `# High-throughput data transformation with Polars
import polars as pl

df = pl.read_parquet("s3://thunder-lake/salaries_2026.parquet")
top_skills = (
    df.filter(pl.col("open_roles") > 1200)
      .group_by("skill")
      .agg(pl.col("salary_usd").mean().alias("avg_salary"))
      .sort("avg_salary", descending=True)
      .limit(4)
)
print(top_skills)`;

  const handleTabChange = (tab: 'sql' | 'python') => {
    setActiveTab(tab);
    setRows(tab === 'sql' ? SQL_ROWS : PYTHON_ROWS);
    setExecutionTime(tab === 'sql' ? '14ms' : '18ms');
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setExecutionTime(`${Math.floor(Math.random() * 8) + 11}ms`);
    }, 400);
  };

  const handleCopy = () => {
    const textToCopy = activeTab === 'sql' ? sqlCode : pythonCode;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group w-full max-w-xl mx-auto lg:max-w-none">
      {/* Ambient decorative backdrop glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-600/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

      {/* Main glassmorphic window container */}
      <div className="relative rounded-2xl bg-slate-950/90 border border-slate-800/90 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-700/80">
        
        {/* macOS-style Header bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800/90 select-none">
          {/* macOS window dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
          </div>

          {/* Interactive file tabs */}
          <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800/80 text-xs font-mono">
            <button
              onClick={() => handleTabChange('sql')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'sql'
                  ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>query.sql</span>
            </button>
            <button
              onClick={() => handleTabChange('python')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'python'
                  ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>analysis.py</span>
            </button>
          </div>

          {/* Action buttons (Run & Copy) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              title="Copy code"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50 shadow-md shadow-amber-500/20"
            >
              <Play className={`w-3 h-3 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Run</span>
            </button>
          </div>
        </div>

        {/* Code Editor body */}
        <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto bg-[#080d1a]/95 text-slate-300">
          {activeTab === 'sql' ? (
            <div className="space-y-1">
              <div className="text-slate-500 italic">// 2026 highest compensation data skills query</div>
              <div>
                <span className="text-purple-400 font-semibold">SELECT</span>
              </div>
              <div className="pl-4">
                <span className="text-slate-200">skill</span>,
              </div>
              <div className="pl-4">
                <span className="text-amber-300">AVG</span>(<span className="text-slate-300">base_salary_usd</span>) <span className="text-purple-400 font-semibold">AS</span> <span className="text-emerald-300">avg_salary</span>,
              </div>
              <div className="pl-4">
                <span className="text-slate-300">growth_yoy_pct</span> <span className="text-purple-400 font-semibold">AS</span> <span className="text-emerald-300">demand_growth</span>,
              </div>
              <div className="pl-4">
                <span className="text-slate-300">hiring_tier</span>
              </div>
              <div>
                <span className="text-purple-400 font-semibold">FROM</span> <span className="text-cyan-300">thunder_lakehouse.tech_careers_2026</span>
              </div>
              <div>
                <span className="text-purple-400 font-semibold">WHERE</span> <span className="text-slate-200">category</span> <span className="text-purple-400 font-semibold">IN</span> (<span className="text-emerald-300">'Data'</span>, <span className="text-emerald-300">'AI'</span>, <span className="text-emerald-300">'Lakehouse'</span>)
              </div>
              <div>
                <span className="text-purple-400 font-semibold">ORDER BY</span> <span className="text-emerald-300">avg_salary</span> <span className="text-purple-400 font-semibold">DESC</span>
              </div>
              <div>
                <span className="text-purple-400 font-semibold">LIMIT</span> <span className="text-amber-400">4</span>;
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-slate-500 italic"># High-throughput data transformation with Polars</div>
              <div>
                <span className="text-purple-400 font-semibold">import</span> <span className="text-slate-200">polars</span> <span className="text-purple-400 font-semibold">as</span> <span className="text-cyan-300">pl</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-200">df</span> = <span className="text-cyan-300">pl</span>.<span className="text-amber-300">read_parquet</span>(<span className="text-emerald-300">"s3://thunder-lake/salaries_2026.parquet"</span>)
              </div>
              <div>
                <span className="text-slate-200">top_skills</span> = (
              </div>
              <div className="pl-4">
                <span className="text-slate-200">df</span>.<span className="text-amber-300">filter</span>(<span className="text-cyan-300">pl</span>.<span className="text-amber-300">col</span>(<span className="text-emerald-300">"open_roles"</span>) &gt; <span className="text-amber-400">1200</span>)
              </div>
              <div className="pl-6">
                .<span className="text-amber-300">group_by</span>(<span className="text-emerald-300">"skill"</span>)
              </div>
              <div className="pl-6">
                .<span className="text-amber-300">agg</span>(<span className="text-cyan-300">pl</span>.<span className="text-amber-300">col</span>(<span className="text-emerald-300">"salary_usd"</span>).<span className="text-amber-300">mean</span>().<span className="text-amber-300">alias</span>(<span className="text-emerald-300">"avg_salary"</span>))
              </div>
              <div className="pl-6">
                .<span className="text-amber-300">sort</span>(<span className="text-emerald-300">"avg_salary"</span>, <span className="text-slate-300">descending</span>=<span className="text-purple-400 font-semibold">True</span>)
              </div>
              <div className="pl-6">
                .<span className="text-amber-300">limit</span>(<span className="text-amber-400">4</span>)
              </div>
              <div>)</div>
              <div>
                <span className="text-amber-300">print</span>(<span className="text-slate-200">top_skills</span>)
              </div>
            </div>
          )}
        </div>

        {/* Animated Output Table Section */}
        <div className="border-t border-slate-800/90 bg-slate-900/60 p-3.5">
          {/* Execution metadata header */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
              <span className="text-slate-300 font-semibold">Query Result</span>
              <span>·</span>
              <span className="text-amber-400/90">{executionTime}</span>
              <span className="hidden sm:inline text-slate-500">· 4 rows</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Lakehouse Live</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950/60">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800/80 text-[10px] text-slate-400 uppercase tracking-wider bg-slate-900/80">
                  <th className="py-1.5 px-3">Skill</th>
                  <th className="py-1.5 px-3">Avg Comp</th>
                  <th className="py-1.5 px-3">YoY Demand</th>
                  <th className="py-1.5 px-3">Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isRunning ? 'opacity-50' : 'opacity-100'
                    }`}
                  >
                    <td className="py-1.5 px-3 font-medium text-slate-200 flex items-center gap-1.5">
                      <span className="text-amber-400 font-bold">›</span>
                      <span>{row.skill}</span>
                    </td>
                    <td className="py-1.5 px-3 text-emerald-400 font-semibold">{row.salary}</td>
                    <td className="py-1.5 px-3">
                      <span className="text-amber-400 flex items-center gap-0.5">
                        <TrendingUp className="w-2.5 h-2.5" />
                        {row.growth}
                      </span>
                    </td>
                    <td className="py-1.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] border ${row.badgeColor}`}>
                        {row.tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
