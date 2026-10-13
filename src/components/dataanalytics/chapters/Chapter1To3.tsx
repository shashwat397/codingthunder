import React from 'react';
import { DataAnalyticsCalloutBox } from '../DataAnalyticsCalloutBox.tsx';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { AnalyticsLifecycleDiagram } from '../diagrams/AnalyticsLifecycleDiagram.tsx';
import { ERDiagram } from '../diagrams/ERDiagram.tsx';

/* =========================================================================
   CHAPTER 1: Introduction & Analytics Lifecycle
   ========================================================================= */
export const Chapter1Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      {/* Chapter Header Banner */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Module 01</span>
          <span>•</span>
          <span>Analytics Strategy & Foundations</span>
          <span>•</span>
          <span className="text-emerald-400">Beginner to Professional</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Introduction & Analytics Lifecycle: Descriptive to Prescriptive
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          The definitive architectural guide to data analytics. Discover how raw telemetry events transform into
          million-dollar business decisions, master the 4 tiers of analytical maturity, and navigate the 6-phase project
          lifecycle.
        </p>
      </div>

      {/* 1. The 4 Types of Data Analytics */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. The 4 Types of Data Analytics
        </h2>
        <p className="text-sm leading-relaxed">
          In high-performing data organizations, analytics is never just about pulling numbers into a spreadsheet. It is
          a continuum of escalating business value and complexity. As an analyst advances from describing past events to
          prescribing automated actions, the organizational leverage grows exponentially.
        </p>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 my-6 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-300 font-mono">
                <th className="py-3 px-4 font-bold text-cyan-300">Analytics Tier</th>
                <th className="py-3 px-4 font-bold">Core Question</th>
                <th className="py-3 px-4 font-bold">Primary Tooling & Methods</th>
                <th className="py-3 px-4 font-bold">Trust & Safety / Fraud Example</th>
                <th className="py-3 px-4 font-bold">Organizational Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-bold text-blue-400 font-mono">Descriptive</td>
                <td className="py-3.5 px-4 text-slate-200">"What happened in the past?"</td>
                <td className="py-3.5 px-4 text-slate-300">SQL Aggregations, Power BI Dashboards, Excel Pivots</td>
                <td className="py-3.5 px-4 text-slate-300">
                  "Last month, $142,000 in creator subscription payouts were flagged as chargebacks."
                </td>
                <td className="py-3.5 px-4 text-slate-400">Baseline situational awareness & KPI reporting.</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-bold text-cyan-400 font-mono">Diagnostic</td>
                <td className="py-3.5 px-4 text-slate-200">"Why did it happen?"</td>
                <td className="py-3.5 px-4 text-slate-300">Drill-down slicing, Root Cause Analysis, Pearson Correlation</td>
                <td className="py-3.5 px-4 text-slate-300">
                  "84% of chargebacks originated from single-use prepaid cards issued in one specific geographic region."
                </td>
                <td className="py-3.5 px-4 text-slate-400">Isolates systemic bottlenecks and vulnerability vectors.</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-bold text-amber-400 font-mono">Predictive</td>
                <td className="py-3.5 px-4 text-slate-200">"What is likely to happen next?"</td>
                <td className="py-3.5 px-4 text-slate-300">Regression models, Time Series Forecasting, ML Scoring</td>
                <td className="py-3.5 px-4 text-slate-300">
                  "Given current registration velocity, next quarter's fraud exposure will hit $310,000 without intervention."
                </td>
                <td className="py-3.5 px-4 text-slate-400">Proactive risk hedging and forecast budgeting.</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">Prescriptive</td>
                <td className="py-3.5 px-4 text-slate-200">"What specific action should we take?"</td>
                <td className="py-3.5 px-4 text-slate-300">Simulation optimization, Automated Rule Engines, A/B Testing</td>
                <td className="py-3.5 px-4 text-slate-300">
                  "Automatically mandate 3D-Secure biometric verification when transaction velocity exceeds 4 attempts/minute."
                </td>
                <td className="py-3.5 px-4 text-emerald-300 font-semibold">Autonomous revenue protection & optimal decisions.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <DataAnalyticsCalloutBox type="pro-tip" title="Senior Analyst Positioning">
          Junior analysts stop at <strong>Descriptive</strong> reporting (sending daily CSV spreadsheets). Senior analysts
          pair descriptive findings with <strong>Diagnostic</strong> root causes and recommend a concrete{' '}
          <strong>Prescriptive</strong> course of action in every business memo.
        </DataAnalyticsCalloutBox>
      </section>

      {/* 2. Interactive Lifecycle Diagram */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. The 6-Step End-to-End Analytics Lifecycle
        </h2>
        <p className="text-sm leading-relaxed">
          Real-world data projects never start with SQL queries or Python scripts. They start with ambiguity and business
          friction. Follow this 6-step framework used across leading technology enterprises:
        </p>

        <AnalyticsLifecycleDiagram />
      </section>

      {/* 3. Framing Analytical Metrics */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          3. Framing Real-World Metrics: Input vs. Output Metrics
        </h2>
        <p className="text-sm leading-relaxed">
          A frequent mistake in analytics interviews and production dashboards is confusing <em>Output Metrics</em> with{' '}
          <em>Input Metrics</em>:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <h4 className="text-sm font-bold text-amber-300 font-mono mb-1">Output Metric (Lagging)</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Metrics that describe the final business consequence. You cannot directly control or move them directly.
            </p>
            <div className="space-y-1.5 text-xs font-mono text-slate-400">
              <div>• Monthly Recurring Revenue (MRR)</div>
              <div>• Total Fraud Loss ($ Volume)</div>
              <div>• 90-Day Channel Subscriber Churn Rate</div>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <h4 className="text-sm font-bold text-cyan-300 font-mono mb-1">Input Metric (Leading & Controllable)</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Operational levers that engineering and product teams can directly tweak and optimize on a daily basis.
            </p>
            <div className="space-y-1.5 text-xs font-mono text-slate-400">
              <div>• Time-to-First-Review for Flagged Accounts</div>
              <div>• 3D-Secure Challenge Completion %</div>
              <div>• Onboarding SMS Verification Rate</div>
            </div>
          </div>
        </div>

        <DataAnalyticsCalloutBox type="case-study" title="Trust & Safety Trade-Off: The Friction Dilemma">
          When configuring automated policy enforcement, blocking 100% of fraud is trivial (simply decline all transactions).
          The true analytical challenge is calculating the <strong>False Positive Rate (FPR)</strong>: ensuring that our
          fraud blocking rules do not alienate legitimate paying subscribers and genuine creators.
        </DataAnalyticsCalloutBox>
      </section>

      {/* 4. Interview Tips */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          4. Interview Tips & Analytical Execution
        </h2>
        <DataAnalyticsCalloutBox type="interview-tip" title="FAANG Behavioral Question: Vague Problem Scoping">
          <strong>Question:</strong> "Our creator subscriber retention dropped 12% last week. What do you do?"
          <br />
          <strong>High-Scoring Response Architecture:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-slate-300 text-xs">
            <li><strong>Validate the Instrumentation:</strong> Check for telemetry data pipeline drops or ETL schema changes before assuming customer behavior changed.</li>
            <li><strong>Decompose the Metric:</strong> Segment by platform (iOS vs Web), geography, creator subscriber count buckets, and acquisition cohort.</li>
            <li><strong>Analyze External vs Internal:</strong> Check for payment gateway outages, pricing experiments, or policy enforcement sweeps.</li>
            <li><strong>Quantify & Prioritize:</strong> Formulate 2 high-impact testable hypotheses and communicate estimated impact to stakeholders.</li>
          </ol>
        </DataAnalyticsCalloutBox>
      </section>
    </div>
  );
};

/* =========================================================================
   CHAPTER 2: Excel for Data Analysis
   ========================================================================= */
export const Chapter2Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Module 02</span>
          <span>•</span>
          <span>Spreadsheet Analytics & Modeling</span>
          <span>•</span>
          <span className="text-emerald-400">Beginner to Advanced</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Excel for Data Analysis: Pivot Tables, XLOOKUP & Rapid Cleansing
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Spreadsheets remain the premier tool for rapid ad-hoc triage, operational modeling, and executive prototype
          validation. Master dynamic array references, two-dimensional Pivot Tables with calculated fields, and multi-criteria
          XLOOKUP logic.
        </p>
      </div>

      {/* 1. Pivot Tables */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. Pivot Tables: Two-Dimensional Aggregation Engines
        </h2>
        <p className="text-sm leading-relaxed">
          A Pivot Table is an in-memory aggregation engine that groups raw records into multidimensional cross-tabulations
          without writing manual SUMIFS formulas. When analyzing creator subscriptions, Pivot Tables allow instant slicing
          across creator tiers and risk status:
        </p>

        {/* Pivot Table Mockup */}
        <div className="my-6 rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
            <span className="text-cyan-400 font-bold">PIVOT TABLE: Creator Subscriber Tier vs. Risk Status</span>
            <span className="text-slate-500">Values: Sum of MRR ($), Count of Creators</span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                  <th className="py-2.5 px-3 text-left">Subscriber Bucket</th>
                  <th className="py-2.5 px-3 text-right">Low Risk ($)</th>
                  <th className="py-2.5 px-3 text-right">Medium Risk ($)</th>
                  <th className="py-2.5 px-3 text-right text-rose-400">High Risk ($)</th>
                  <th className="py-2.5 px-3 text-right font-bold text-cyan-300">Total MRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-semibold text-white">Tier 1: 0 - 1,000</td>
                  <td className="py-2 px-3 text-right text-slate-300">$18,420</td>
                  <td className="py-2 px-3 text-right text-slate-300">$4,120</td>
                  <td className="py-2 px-3 text-right text-rose-300 font-bold">$12,850</td>
                  <td className="py-2 px-3 text-right font-semibold text-slate-200">$35,390</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-semibold text-white">Tier 2: 1,001 - 10,000</td>
                  <td className="py-2 px-3 text-right text-slate-300">$84,900</td>
                  <td className="py-2 px-3 text-right text-slate-300">$14,200</td>
                  <td className="py-2 px-3 text-right text-rose-300 font-bold">$7,300</td>
                  <td className="py-2 px-3 text-right font-semibold text-slate-200">$106,400</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-semibold text-white">Tier 3: 10,001 - 100,000</td>
                  <td className="py-2 px-3 text-right text-slate-300">$245,600</td>
                  <td className="py-2 px-3 text-right text-slate-300">$21,800</td>
                  <td className="py-2 px-3 text-right text-rose-300 font-bold">$3,100</td>
                  <td className="py-2 px-3 text-right font-semibold text-slate-200">$270,500</td>
                </tr>
                <tr className="hover:bg-slate-800/40 bg-slate-800/50 font-bold">
                  <td className="py-2.5 px-3 text-cyan-300">Grand Total</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400">$348,920</td>
                  <td className="py-2.5 px-3 text-right text-amber-400">$40,120</td>
                  <td className="py-2.5 px-3 text-right text-rose-400">$23,250</td>
                  <td className="py-2.5 px-3 text-right text-cyan-300">$412,290</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Key Analytical Takeaway from Pivot:</strong> Over 55% of the total High-Risk dollar volume ($12,850 out of
          $23,250) is concentrated inside newly onboarded micro-creators with fewer than 1,000 subscribers. This proves
          that automated bot rings are targeting micro-channels to test stolen credit cards!
        </p>
      </section>

      {/* 2. Advanced XLOOKUP */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Modern Relational Lookups with XLOOKUP
        </h2>
        <p className="text-sm leading-relaxed">
          Unlike legacy <code>VLOOKUP</code> (which broke whenever new columns were inserted and could not search to the
          left), <code>XLOOKUP</code> separates the lookup vector from the return vector and supports fallback handling:
        </p>

        <CodeBlock
          language="excel"
          code={`=XLOOKUP(
  A2,                                 -- 1. Lookup Value: Transaction User ID
  dim_users[user_id],                 -- 2. Lookup Array: User Table ID Column
  dim_users[risk_tier],               -- 3. Return Array: Target Risk Tier
  "UNKNOWN_TIER",                     -- 4. If Not Found: Safe Fallback String
  0,                                  -- 5. Match Mode: 0 for Exact Match
  1                                   -- 6. Search Mode: 1 for First-to-Last
)`}
        />

        <div className="pt-2">
          <h3 className="text-base font-bold text-white mb-2">Multi-Condition Boolean XLOOKUP</h3>
          <p className="text-sm text-slate-300 mb-3">
            In advanced fraud investigations, you often need to look up a rate matching both <em>Creator Category</em> AND{' '}
            <em>Country Code</em> simultaneously:
          </p>
          <CodeBlock
            language="excel"
            code={`=XLOOKUP(
  1,                                  -- Lookup criteria: Boolean TRUE
  (dim_rates[category] = "Tech") *    -- Condition 1: Category must match
  (dim_rates[country] = "US"),        -- Condition 2: Country must match
  dim_rates[payout_fee_pct],          -- Return Array: Commission Percentage
  0.035                               -- Default Fallback: Standard 3.5%
)`}
          />
        </div>

        <DataAnalyticsCalloutBox type="common-pitfall" title="Excel Approximate Match Traps">
          Never use approximate match (Match Mode 1 or -1) on un-sorted categorical columns. Approximate match performs a
          binary search assumption; if your lookup column is not strictly ordered, it will return incorrect data silently
          without throwing an error!
        </DataAnalyticsCalloutBox>
      </section>

      {/* 3. Conditional Formatting Anomaly Detection */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          3. Outlier Flagging via Conditional Formatting
        </h2>
        <p className="text-sm leading-relaxed">
          Turn spreadsheets into dynamic alert dashboards by authoring custom logical formulas inside Conditional
          Formatting. To flag transactions that exceed 3 standard deviations above creator baseline:
        </p>
        <CodeBlock
          language="excel"
          code={`-- Formula Rule in Conditional Formatting:
=E2 > (AVERAGE($E$2:$E$1000) + 2.5 * STDEV.S($E$2:$E$1000))`}
        />
      </section>
    </div>
  );
};

/* =========================================================================
   CHAPTER 3: Database & SQL Fundamentals
   ========================================================================= */
export const Chapter3Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Module 03</span>
          <span>•</span>
          <span>Relational Modeling & Core SQL</span>
          <span>•</span>
          <span className="text-emerald-400">Beginner to Intermediate</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Database & SQL Fundamentals: Relational Architecture & Core Queries
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Structured Query Language (SQL) is the foundational language of the data industry. Understand relational database
          design, query execution lifecycles, and write performant extraction queries using GROUP BY and HAVING.
        </p>
      </div>

      {/* 1. OLTP vs OLAP */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. Relational Database Architecture: OLTP vs. OLAP
        </h2>
        <p className="text-sm leading-relaxed">
          One of the most important concepts for a data analyst is understanding the difference between the live
          application database and the data warehouse:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-blue-400 font-mono">OLTP (Online Transaction Processing)</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Row-Oriented</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Optimized for high-concurrency, millisecond reads and writes of single records (e.g. inserting an order or
              updating a password).
            </p>
            <div className="space-y-1 text-xs font-mono text-slate-400">
              <div>• Tech: PostgreSQL, MySQL, SQLite</div>
              <div>• Schema: 3rd Normal Form (3NF) to eliminate redundancy</div>
              <div>• Query Type: SELECT * WHERE id = 49201</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-cyan-400 font-mono">OLAP (Online Analytical Processing)</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Columnar</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Optimized for scanning billions of rows across a few columns to compute aggregates (sums, averages, medians).
            </p>
            <div className="space-y-1 text-xs font-mono text-slate-400">
              <div>• Tech: Snowflake, BigQuery, AWS Redshift, ClickHouse</div>
              <div>• Schema: Star Schema (Fact and Dimension tables)</div>
              <div>• Query Type: SUM(amount) GROUP BY country, month</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Entity Relationship Diagram */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Entity Relationship (ER) Diagram: Trust & Safety Warehouse
        </h2>
        <p className="text-sm leading-relaxed">
          Analyze this interactive Entity Relationship Diagram representing our production video platform schema. Click on
          any table to inspect primary keys (PK), foreign keys (FK), and analytical roles:
        </p>

        <ERDiagram />
      </section>

      {/* 3. Logical Query Execution Order */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          3. Logical SQL Query Execution Order
        </h2>
        <p className="text-sm leading-relaxed">
          While you write SQL starting with <code>SELECT</code>, the SQL query engine evaluates clauses in a completely
          different chronological sequence. Understanding this prevents the notorious <em>"column alias not found in WHERE"</em>{' '}
          error:
        </p>

        {/* Execution Order Flow */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 shadow-xl my-4">
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">1</span>
              <span className="text-cyan-400 font-bold w-20">FROM / JOIN</span>
              <span className="text-slate-300 font-sans">Identifies source tables, loads working dataset, and merges relational bridges.</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">2</span>
              <span className="text-cyan-400 font-bold w-20">WHERE</span>
              <span className="text-slate-300 font-sans">Filters individual records BEFORE any grouping or aggregations take place.</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">3</span>
              <span className="text-cyan-400 font-bold w-20">GROUP BY</span>
              <span className="text-slate-300 font-sans">Collapses rows into bucket aggregates based on dimension keys.</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">4</span>
              <span className="text-cyan-400 font-bold w-20">HAVING</span>
              <span className="text-slate-300 font-sans">Filters grouped buckets AFTER aggregate metrics are calculated (e.g. COUNT(*) &gt; 5).</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">5</span>
              <span className="text-cyan-400 font-bold w-20">SELECT</span>
              <span className="text-slate-300 font-sans">Projects final columns, computes expressions, and binds column aliases.</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">6</span>
              <span className="text-cyan-400 font-bold w-20">ORDER BY</span>
              <span className="text-slate-300 font-sans">Sorts the output dataset. Aliases created in SELECT are accessible here!</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">7</span>
              <span className="text-cyan-400 font-bold w-20">LIMIT</span>
              <span className="text-slate-300 font-sans">Restricts the number of transmitted rows to the calling application.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Practical Query: Filtering High-Risk Clusters */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          4. Core Extraction: Isolating Suspicious Velocity in SQL
        </h2>
        <p className="text-sm leading-relaxed">
          Here is a production query illustrating the distinction between <code>WHERE</code> (row-level filter) and{' '}
          <code>HAVING</code> (aggregate bucket filter):
        </p>

        <CodeBlock
          language="sql"
          code={`-- Production Query: Detect IP addresses with > 10 failed payments in 24 hours
SELECT 
  t.ip_hash,
  COUNT(t.transaction_id) AS total_failed_attempts,
  COUNT(DISTINCT t.user_id) AS targeted_unique_accounts,
  SUM(t.amount) AS attempted_dollar_volume,
  MIN(t.timestamp) AS attack_window_start,
  MAX(t.timestamp) AS attack_window_end
FROM fact_transactions t
WHERE t.status = 'DECLINED'                                -- WHERE filters individual failed events
  AND t.timestamp >= NOW() - INTERVAL '24 hours'           -- Restrict to last 24-hour temporal window
GROUP BY t.ip_hash
HAVING COUNT(t.transaction_id) >= 10                       -- HAVING filters aggregated clusters
   AND COUNT(DISTINCT t.user_id) >= 3                      -- Distributed credential stuffing indicator
ORDER BY total_failed_attempts DESC
LIMIT 50;`}
        />

        <DataAnalyticsCalloutBox type="interview-tip" title="SQL Technical Screen Question: WHERE vs HAVING">
          <strong>Interviewer:</strong> "Can you filter on an aggregate function like SUM(amount) &gt; 1000 inside the WHERE clause?"
          <br />
          <strong>Answer:</strong> "No. The WHERE clause evaluates individual rows before grouping occurs. To filter on
          aggregated results, you must use the HAVING clause, or compute the aggregation inside a CTE or subquery first."
        </DataAnalyticsCalloutBox>
      </section>
    </div>
  );
};
