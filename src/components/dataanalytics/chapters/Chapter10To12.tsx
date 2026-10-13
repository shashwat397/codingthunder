import React from 'react';
import { DataAnalyticsCalloutBox } from '../DataAnalyticsCalloutBox.tsx';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { PowerBIWorkflowDiagram } from '../diagrams/PowerBIWorkflowDiagram.tsx';

/* =========================================================================
   CHAPTER 10: Business Intelligence & Power BI
   ========================================================================= */
export const Chapter10Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Module 10</span>
          <span>•</span>
          <span>Business Intelligence & Power BI</span>
          <span>•</span>
          <span className="text-amber-400">Advanced Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Business Intelligence & Power BI: Power Query ETL, Star Schemas & Core DAX
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Power BI is Microsoft's premier enterprise business intelligence engine. Master Power Query M language ETL, build
          performant Star Schema dimensional models, understand DAX evaluation contexts (Row vs Filter context), and conquer
          CALCULATE and SUMX.
        </p>
      </div>

      {/* 1. Interactive Power BI Architecture Workflow */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. Power BI Architectural Pipeline
        </h2>
        <p className="text-sm leading-relaxed">
          From source ingestion through the Power Query M mashup engine into the in-memory VertiPaq tabular model and DAX
          formula engine:
        </p>

        <PowerBIWorkflowDiagram />
      </section>

      {/* 2. Star Schema vs Snowflake Schema */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Star Schema Modeling Principles
        </h2>
        <p className="text-sm leading-relaxed">
          In Power BI, dimensional modeling is paramount. The VertiPaq engine achieves near-instantaneous aggregations when
          tables are organized in a <strong>Star Schema</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <h4 className="font-mono text-cyan-400 font-bold mb-1">Central Fact Tables (Grain)</h4>
            <p className="text-slate-300 mb-2">
              Deep, narrow tables containing numeric measurements, metrics, and foreign keys (e.g.{' '}
              <code>fact_transactions</code> with 50M rows).
            </p>
            <span className="text-slate-400">Contains additive measures: amount, fee, latency_ms.</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <h4 className="font-mono text-emerald-400 font-bold mb-1">Dimension Tables (Context)</h4>
            <p className="text-slate-300 mb-2">
              Wide, shallow tables containing textual descriptions, categories, and attributes used for slicing and dicing
              (e.g. <code>dim_creators</code>, <code>dim_date</code>).
            </p>
            <span className="text-slate-400">Filters propagate downwards from Dimensions to Facts (1-to-Many).</span>
          </div>
        </div>
      </section>

      {/* 3. Core DAX Calculations */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          3. High-Leverage DAX Measures: CALCULATE & SUMX
        </h2>
        <p className="text-sm leading-relaxed">
          DAX (Data Analysis Expressions) differs from Excel because every measure evaluates within a dynamic{' '}
          <strong>Filter Context</strong> dictated by the user's report slicers and visual cross-filtering:
        </p>

        <CodeBlock
          language="dax"
          code={`// 1. Base Additive Measure
Total Gross Volume = SUM(fact_transactions[amount])

// 2. High-Risk Filter Modification with CALCULATE
High Risk Volume = 
CALCULATE(
    [Total Gross Volume],
    dim_users[risk_tier] IN { "HIGH", "CRITICAL" },
    fact_transactions[status] = "APPROVED"
)

// 3. Platform Ratio Calculation with DIVIDE (prevents divide-by-zero errors)
High Risk Exposure % = 
DIVIDE(
    [High Risk Volume],
    [Total Gross Volume],
    0.0
)

// 4. Row-by-Row Iteration with SUMX for Creator Payouts
Total Creator Net Payout = 
SUMX(
    fact_subscriptions,
    fact_subscriptions[plan_mrr] * (1 - RELATED(dim_creators[platform_fee_rate]))
)`}
        />

        <DataAnalyticsCalloutBox type="pro-tip" title="Why CALCULATE is DAX's Superpower">
          <code>CALCULATE</code> is the only function in DAX that can create, modify, or overwrite filter context. When
          evaluating measures, CALCULATE takes all incoming UI filters, applies the Boolean conditions specified in its
          arguments, and recalculates the measure in the revised context.
        </DataAnalyticsCalloutBox>
      </section>
    </div>
  );
};

/* =========================================================================
   CHAPTER 11: Real-World Analytics Project: Fraud Case Study
   ========================================================================= */
export const Chapter11Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Module 11</span>
          <span>•</span>
          <span>Production Case Study: Fraud & Trust</span>
          <span>•</span>
          <span className="text-rose-400">Industry Capstone</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Real-World Analytics Project: End-to-End Fraud Investigation Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Synthesize every discipline into a production capstone project. Walk through the complete lifecycle of a Trust &
          Safety engineering analytics system built to combat automated subscription bot rings.
        </p>
      </div>

      {/* 1. Problem Statement & Architecture */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. The Business Crisis & Project Charter
        </h2>
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs text-slate-300 space-y-2">
          <div className="font-bold text-white text-sm">Case Scenario: The $240K Card Testing Bot Wave</div>
          <p className="leading-relaxed">
            In Q3, a syndication of cybercriminals used stolen credit cards to purchase $4.99 channel subscriptions across
            thousands of dormant creator channels to test card validity. Legitimate cardholders issued chargebacks 30 days
            later, inflicting $240,000 in dispute fees and threatening platform merchant account termination.
          </p>
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
            <div>• Target Metric: Reduce Chargeback Rate &lt; 0.65%</div>
            <div>• Ingestion SLA: Sub-15 minute pipeline refresh</div>
            <div>• Constraint: False positive rate on legitimate fans &lt; 0.2%</div>
          </div>
        </div>
      </section>

      {/* 2. SQL Window Pipeline */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Step 1: SQL Sliding Window Velocity Aggregation
        </h2>
        <p className="text-sm leading-relaxed">
          Extract candidate attack vectors from Snowflake using sliding window aggregations over 15-minute intervals:
        </p>

        <CodeBlock
          language="sql"
          code={`-- Production Aggregation View: Sliding 15-Minute Anomaly Detection
CREATE OR REPLACE VIEW v_fraud_candidate_queue AS
WITH velocity_ranked AS (
  SELECT 
    t.ip_hash,
    t.user_id,
    t.amount,
    t.timestamp,
    -- Count total transactions attempted from this IP in sliding 15-minute window
    COUNT(t.transaction_id) OVER(
      PARTITION BY t.ip_hash 
      ORDER BY t.timestamp 
      RANGE BETWEEN INTERVAL '15 minutes' PRECEDING AND CURRENT ROW
    ) AS rolling_ip_velocity_15m,
    -- Count distinct card tokens used by this IP
    DENSE_RANK() OVER(
      PARTITION BY t.ip_hash 
      ORDER BY t.payment_method
    ) AS distinct_cards_used
  FROM fact_transactions t
  WHERE t.timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
)
SELECT 
  ip_hash,
  user_id,
  amount,
  timestamp,
  rolling_ip_velocity_15m,
  distinct_cards_used,
  CASE 
    WHEN rolling_ip_velocity_15m >= 8 AND distinct_cards_used >= 3 THEN 'AUTO_FREEZE'
    WHEN rolling_ip_velocity_15m >= 4 THEN 'CHALLENGE_3DS'
    ELSE 'MONITOR'
  END AS recommended_action
FROM velocity_ranked
WHERE rolling_ip_velocity_15m >= 4;`}
        />
      </section>

      {/* 3. Operational Scorecard */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          3. Executive Metric Scorecard & Post-Launch Impact
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 my-4 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-300 font-mono">
                <th className="py-2.5 px-4 font-bold text-cyan-300">Pipeline Performance Metric</th>
                <th className="py-2.5 px-4 font-bold text-rose-300">Pre-Implementation</th>
                <th className="py-2.5 px-4 font-bold text-emerald-300">Post-Launch (30 Days)</th>
                <th className="py-2.5 px-4 font-bold">Delta Lift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-slate-200">Dispute & Chargeback Rate</td>
                <td className="py-3 px-4 text-rose-400 font-mono font-bold">1.84% (Critical Breach)</td>
                <td className="py-3 px-4 text-emerald-400 font-mono font-bold">0.42% (Compliant)</td>
                <td className="py-3 px-4 text-emerald-300 font-semibold font-mono">-77.1% Reduction</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-slate-200">Monthly Stolen Card Losses</td>
                <td className="py-3 px-4 text-rose-400 font-mono">$242,000 / month</td>
                <td className="py-3 px-4 text-emerald-400 font-mono">$18,400 / month</td>
                <td className="py-3 px-4 text-emerald-300 font-semibold font-mono">$223,600 Saved</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-slate-200">Legitimate Subscriber False Positives</td>
                <td className="py-3 px-4 text-slate-400 font-mono">N/A (No rules)</td>
                <td className="py-3 px-4 text-emerald-400 font-mono font-bold">0.08%</td>
                <td className="py-3 px-4 text-slate-300 font-mono">Well below 0.20% SLA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

/* =========================================================================
   CHAPTER 12: Analyst Career & Interview Mastery
   ========================================================================= */
export const Chapter12Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Module 12</span>
          <span>•</span>
          <span>Portfolio, Interview & Career Architecture</span>
          <span>•</span>
          <span className="text-emerald-400">Career Acceleration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Analyst Career & Interview Mastery: Portfolio Architecture & Technical Challenges
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Break through the candidate noise. Learn how hiring managers evaluate senior analyst candidates, master the 5
          most common live SQL coding patterns, structure take-home assignments, and frame behavioral responses with the
          STAR method.
        </p>
      </div>

      {/* 1. The 5 Live SQL Interview Patterns */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. The 5 Most Frequent Live SQL Technical Challenge Archetypes
        </h2>
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="font-mono text-cyan-300 font-bold block mb-1">
              Pattern 1: The "Top N per Group" (ROW_NUMBER over Partition)
            </span>
            <p className="text-slate-300">
              Prompt: <em>"Find the top 3 highest earning videos for every creator category."</em>
              <br />
              Solution: Partition by <code>category_id</code>, order by <code>earnings DESC</code> with{' '}
              <code>DENSE_RANK()</code>, then filter <code>WHERE rank &lt;= 3</code> in outer query.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="font-mono text-emerald-300 font-bold block mb-1">
              Pattern 2: The "Day-over-Day / Month-over-Month Growth" (LAG & Growth %)
            </span>
            <p className="text-slate-300">
              Prompt: <em>"Calculate month-over-month percentage growth in subscriber MRR."</em>
              <br />
              Solution: Group by month, compute <code>LAG(mrr, 1) OVER(ORDER BY month)</code>, then apply{' '}
              <code>(mrr - prev_mrr) / prev_mrr</code>.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="font-mono text-amber-300 font-bold block mb-1">
              Pattern 3: The "Consecutive Active Days" (Gaps & Islands Problem)
            </span>
            <p className="text-slate-300">
              Prompt: <em>"Identify users who logged in for at least 5 consecutive calendar days."</em>
              <br />
              Solution: Subtract <code>ROW_NUMBER()</code> days from the login date to create a constant island group key,
              then <code>GROUP BY user_id, island_key HAVING COUNT(*) &gt;= 5</code>.
            </p>
          </div>
        </div>
      </section>

      {/* 2. STAR Behavioral Storytelling */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Behavioral Storytelling with the STAR Framework
        </h2>
        <p className="text-sm leading-relaxed">
          When asked: <em>"Tell me about a time your analysis contradicted an executive's intuition:"</em>
        </p>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs text-slate-300 space-y-3 my-4">
          <div>
            <span className="font-bold text-cyan-400 font-mono">Situation:</span> The Head of Growth wanted to remove the
            SMS phone verification step on creator signups to maximize top-of-funnel conversion.
          </div>
          <div>
            <span className="font-bold text-blue-400 font-mono">Task:</span> I was tasked with analyzing whether the friction
            was depressing legitimate creator growth or serving as a vital defensive moat.
          </div>
          <div>
            <span className="font-bold text-amber-400 font-mono">Action:</span> I ran a cohort analysis matching signup
            verification telemetry against downstream chargebacks. I discovered that unverified accounts generated 14x more
            chargebacks and cost $80K/month in fraud dispute fees.
          </div>
          <div>
            <span className="font-bold text-emerald-400 font-mono">Result:</span> I presented an executive decision memo with
            interactive Power BI simulations. We retained SMS verification for high-risk IP regions while streamlining it
            for trusted domains, preventing $650,000 in annual fraud exposure.
          </div>
        </div>

        <DataAnalyticsCalloutBox type="interview-tip" title="Resume Engineering Rule">
          Never write: <em>"Responsible for writing SQL queries and building dashboards."</em>
          <br />
          Always write: <em>"Architected SQL windowing pipeline and Power BI monitoring system for 15M transactions, reducing payment dispute losses by 77% ($223K/month saved)."</em>
        </DataAnalyticsCalloutBox>
      </section>
    </div>
  );
};
