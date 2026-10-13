import React from 'react';
import { DataAnalyticsCalloutBox } from '../DataAnalyticsCalloutBox.tsx';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { SQLJoinsVennDiagram } from '../diagrams/SQLJoinsVennDiagram.tsx';

/* =========================================================================
   CHAPTER 4: Advanced SQL & Joins
   ========================================================================= */
export const Chapter4Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Module 04</span>
          <span>•</span>
          <span>Advanced SQL & Window Functions</span>
          <span>•</span>
          <span className="text-amber-400">Advanced Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Advanced SQL & Joins: Venn Sets, CTEs & High-Performance Window Functions
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Master the analytical toolkit that separates senior data professionals. Conquer relational joins, modular Common
          Table Expressions (CTEs), and leverage analytical window functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD) over
          dynamic partitions.
        </p>
      </div>

      {/* 1. Interactive Joins Venn Diagram */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. Relational Joins & Set Theory
        </h2>
        <p className="text-sm leading-relaxed">
          Understanding the exact set operations behind database joins is essential for eliminating accidental Cartesian
          products (runaway row duplication). Explore the interactive Venn diagram below:
        </p>

        <SQLJoinsVennDiagram />
      </section>

      {/* 2. Common Table Expressions (CTEs) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Common Table Expressions (CTEs) vs. Subqueries
        </h2>
        <p className="text-sm leading-relaxed">
          A Common Table Expression (CTE) defined with the <code>WITH</code> clause creates temporary, named result sets
          that exist solely during the execution of that single statement. CTEs drastically improve query readability,
          reusability, and maintenance compared to deep nested subqueries:
        </p>

        <CodeBlock
          language="sql"
          code={`-- CTE Pipeline: Calculating Channel Subscriber Milestones & Velocity
WITH creator_velocity AS (
  SELECT 
    c.creator_id,
    c.user_id,
    c.subscriber_count,
    COUNT(s.subscription_id) AS new_signups_30d,
    SUM(s.plan_mrr) AS added_mrr_30d
  FROM dim_creators c
  INNER JOIN fact_subscriptions s
    ON c.creator_id = s.creator_id
  WHERE s.start_date >= NOW() - INTERVAL '30 days'
  GROUP BY c.creator_id, c.user_id, c.subscriber_count
),
risk_flagged_users AS (
  SELECT 
    user_id, 
    risk_tier
  FROM dim_users
  WHERE risk_tier IN ('HIGH', 'CRITICAL')
)
SELECT 
  cv.creator_id,
  cv.subscriber_count,
  cv.new_signups_30d,
  cv.added_mrr_30d,
  CASE 
    WHEN rfu.user_id IS NOT NULL THEN 'SUSPICIOUS_HIGH_RISK_OWNER'
    WHEN cv.new_signups_30d > 10000 AND cv.subscriber_count < 500 THEN 'ANOMALOUS_VELOCITY_SPIKE'
    ELSE 'ORGANIC_GROWTH'
  END AS compliance_classification
FROM creator_velocity cv
LEFT JOIN risk_flagged_users rfu
  ON cv.user_id = rfu.user_id
ORDER BY cv.added_mrr_30d DESC;`}
        />
      </section>

      {/* 3. Window Functions Deep Dive */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          3. Window Functions: OVER(PARTITION BY ... ORDER BY ...)
        </h2>
        <p className="text-sm leading-relaxed">
          Unlike standard <code>GROUP BY</code> (which collapses rows into a single summary row), a{' '}
          <strong>Window Function</strong> performs calculations across a set of rows while preserving the identity of
          every individual row in the result set.
        </p>

        {/* Ranking Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 my-6 shadow-xl">
          <div className="p-3 bg-slate-800/80 border-b border-slate-700 text-xs font-mono font-bold text-cyan-300">
            Window Function Ranking Comparison (Sample Dataset: Subscriber Counts [5000, 3000, 3000, 1000])
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-300 font-mono">
                <th className="py-2.5 px-4">Function</th>
                <th className="py-2.5 px-4">Behavior on Ties</th>
                <th className="py-2.5 px-4 font-mono text-cyan-300">Sample Output Ranks</th>
                <th className="py-2.5 px-4">Best Used For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-blue-400 font-mono">ROW_NUMBER()</td>
                <td className="py-3 px-4 text-slate-300">Never ties. Assigns strict sequential numbers (1, 2, 3, 4).</td>
                <td className="py-3 px-4 font-mono text-cyan-300 font-bold">1, 2, 3, 4</td>
                <td className="py-3 px-4 text-slate-300">Deduplicating logs and selecting the single most recent record.</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-amber-400 font-mono">RANK()</td>
                <td className="py-3 px-4 text-slate-300">Assigns identical rank on ties, then SKIPS subsequent ranks.</td>
                <td className="py-3 px-4 font-mono text-amber-300 font-bold">1, 2, 2, 4 (Skips 3!)</td>
                <td className="py-3 px-4 text-slate-300">Olympic leaderboard standings, academic percentiles.</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-emerald-400 font-mono">DENSE_RANK()</td>
                <td className="py-3 px-4 text-slate-300">Assigns identical rank on ties, does NOT skip ranks.</td>
                <td className="py-3 px-4 font-mono text-emerald-300 font-bold">1, 2, 2, 3</td>
                <td className="py-3 px-4 text-slate-300">Salary tiers, finding the Top 3 distinct earnings without gaps.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-base font-bold text-white pt-2">Detecting Velocity Attacks with LAG()</h3>
        <p className="text-sm text-slate-300 mb-3">
          To detect automated card testing bots, compute the time difference between consecutive transaction attempts for
          each user using <code>LAG()</code>:
        </p>

        <CodeBlock
          language="sql"
          code={`-- Production Query: Time elapsed between consecutive payments per user
WITH user_payment_stream AS (
  SELECT 
    t.transaction_id,
    t.user_id,
    t.amount,
    t.timestamp,
    -- Pull timestamp of the immediately preceding transaction for this user
    LAG(t.timestamp, 1) OVER (
      PARTITION BY t.user_id 
      ORDER BY t.timestamp ASC
    ) AS prev_transaction_time
  FROM fact_transactions t
)
SELECT 
  transaction_id,
  user_id,
  amount,
  timestamp,
  prev_transaction_time,
  -- Calculate difference in seconds
  EXTRACT(EPOCH FROM (timestamp - prev_transaction_time)) AS seconds_since_last_attempt,
  CASE 
    WHEN EXTRACT(EPOCH FROM (timestamp - prev_transaction_time)) < 5 
      THEN 'CRITICAL_BOT_RAPID_FIRE'
    WHEN EXTRACT(EPOCH FROM (timestamp - prev_transaction_time)) < 30 
      THEN 'HIGH_VELOCITY'
    ELSE 'NORMAL_PACING'
  END AS pacing_flag
FROM user_payment_stream
WHERE prev_transaction_time IS NOT NULL
ORDER BY seconds_since_last_attempt ASC;`}
        />

        <DataAnalyticsCalloutBox type="pro-tip" title="Interview Cheat Code: Deduplication with ROW_NUMBER()">
          When an interviewer asks: <em>"How do you remove duplicate event logs where transaction_id appears multiple times?"</em>
          <br />
          Always answer: <em>"Partition by the unique natural key, order by timestamp descending, and filter for WHERE rn = 1 using a CTE."</em>
        </DataAnalyticsCalloutBox>
      </section>
    </div>
  );
};

/* =========================================================================
   CHAPTER 5: Statistics for Analysts
   ========================================================================= */
export const Chapter5Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Module 05</span>
          <span>•</span>
          <span>Applied Statistics & Distributions</span>
          <span>•</span>
          <span className="text-cyan-400">Intermediate</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Statistics for Analysts: Central Tendency, Spread & Correlation Metrics
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Numbers without statistical rigor produce dangerous business illusions. Understand when the Median outperforms
          the Mean in skewed creator metrics, compute Standard Deviation, leverage the Empirical Rule, and rigorously
          evaluate Pearson vs. Spearman correlations.
        </p>
      </div>

      {/* 1. Measures of Central Tendency */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. Central Tendency: Mean vs. Median in Real-World Skewness
        </h2>
        <p className="text-sm leading-relaxed">
          In creator platforms and financial transactions, distributions are almost never symmetrical normal bell curves.
          They are heavily <strong>right-skewed</strong> (Power-Law distributions where top 1% creators generate 80% of
          views):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 font-mono text-xs">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="text-cyan-400 font-bold block mb-1">Arithmetic Mean (μ)</span>
            <span className="text-slate-300 text-[11px] font-sans block mb-2">
              Sum of values divided by count: <code>(Σx) / n</code>
            </span>
            <p className="text-slate-400 text-[11px] font-sans">
              <strong>Vulnerability:</strong> Highly sensitive to extreme outliers. A single $50,000 transaction artificially inflates average order value.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="text-emerald-400 font-bold block mb-1">Median (50th Percentile)</span>
            <span className="text-slate-300 text-[11px] font-sans block mb-2">
              Middle value of ordered dataset.
            </span>
            <p className="text-slate-400 text-[11px] font-sans">
              <strong>Resilience:</strong> Robust against extreme outliers. Reflects what the typical everyday creator truly experiences.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="text-amber-400 font-bold block mb-1">Mode</span>
            <span className="text-slate-300 text-[11px] font-sans block mb-2">
              Most frequently occurring value.
            </span>
            <p className="text-slate-400 text-[11px] font-sans">
              <strong>Application:</strong> Best for discrete categorical fields (e.g. most frequent subscription price: $4.99).
            </p>
          </div>
        </div>

        <DataAnalyticsCalloutBox type="common-pitfall" title="The Executive Average Trap">
          If a PR statement claims <em>"The average channel earnings on our platform is $4,200/month"</em>, but the Median is
          $12/month, 90% of your creators are earning practically nothing. Reporting only the Mean on skewed data is
          dishonest analytics!
        </DataAnalyticsCalloutBox>
      </section>

      {/* 2. Measures of Spread & Empirical Rule */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Measures of Dispersion & The Empirical 68-95-99.7 Rule
        </h2>
        <p className="text-sm leading-relaxed">
          Standard Deviation (σ) quantifies the dispersion or spread of data points around the mean. For normally
          distributed metrics:
        </p>

        {/* Empirical Rule Visual */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 my-4">
          <div className="text-xs font-mono font-bold text-cyan-300 mb-3">THE EMPIRICAL (68-95-99.7) GAUSSIAN RULE</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-lg font-bold text-emerald-400 font-mono">68.2%</span>
              <span className="block text-slate-300 font-semibold mt-1">μ ± 1σ</span>
              <span className="text-[11px] text-slate-500">Within 1 Standard Deviation</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-lg font-bold text-cyan-400 font-mono">95.4%</span>
              <span className="block text-slate-300 font-semibold mt-1">μ ± 2σ</span>
              <span className="text-[11px] text-slate-500">Within 2 Standard Deviations</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-lg font-bold text-purple-400 font-mono">99.7%</span>
              <span className="block text-slate-300 font-semibold mt-1">μ ± 3σ</span>
              <span className="text-[11px] text-slate-500">Within 3 Standard Deviations (Outlier Threshold)</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Statistical Z-Score:</strong> <code>Z = (X - μ) / σ</code>. Any transaction with an absolute Z-score &gt; 3.0
          has less than a 0.3% probability of occurring by chance under a normal distribution, making it an immediate candidate
          for automated risk review!
        </p>
      </section>

      {/* 3. Correlation Matrix */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          3. Statistical Correlation Interpretation Matrix
        </h2>
        <p className="text-sm leading-relaxed">
          Correlation measures the linear or monotonic relationship between two variables, ranging from -1.0 to +1.0:
        </p>

        {/* Correlation Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 my-4 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-300 font-mono">
                <th className="py-2.5 px-4 font-bold text-cyan-300">Correlation Value (r)</th>
                <th className="py-2.5 px-4 font-bold">Relationship Strength</th>
                <th className="py-2.5 px-4 font-bold">Analytical Interpretation</th>
                <th className="py-2.5 px-4 font-bold">Platform Metric Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-emerald-400 font-mono">+0.80 to +1.00</td>
                <td className="py-3 px-4 text-emerald-300 font-semibold">Strong Positive</td>
                <td className="py-3 px-4 text-slate-300">As X increases, Y strongly increases in near-linear fashion.</td>
                <td className="py-3 px-4 text-slate-400">Total Video Views vs Ad Impressions Generated</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-cyan-400 font-mono">+0.40 to +0.79</td>
                <td className="py-3 px-4 text-cyan-300">Moderate Positive</td>
                <td className="py-3 px-4 text-slate-300">Meaningful upward co-movement with observable variance.</td>
                <td className="py-3 px-4 text-slate-400">Subscriber Count vs Total Monthly Tips Received</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-slate-400 font-mono">-0.19 to +0.19</td>
                <td className="py-3 px-4 text-slate-400">Negligible / Zero</td>
                <td className="py-3 px-4 text-slate-300">No linear co-movement whatsoever between the two variables.</td>
                <td className="py-3 px-4 text-slate-400">Creator Account Age vs Chargeback Rate</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-rose-400 font-mono">-0.70 to -1.00</td>
                <td className="py-3 px-4 text-rose-300 font-semibold">Strong Negative</td>
                <td className="py-3 px-4 text-slate-300">As X increases, Y sharply decreases.</td>
                <td className="py-3 px-4 text-slate-400">Onboarding Friction Steps vs New User Conversion %</td>
              </tr>
            </tbody>
          </table>
        </div>

        <DataAnalyticsCalloutBox type="interview-tip" title="Pearson vs. Spearman Correlation">
          <strong>Pearson Correlation:</strong> Assumes both variables are continuous, normally distributed, and linear.
          <br />
          <strong>Spearman Rank Correlation:</strong> Non-parametric; computes correlation based on ranked orders. Best for
          curvilinear relationships and skewed datasets with heavy outliers!
        </DataAnalyticsCalloutBox>
      </section>
    </div>
  );
};

/* =========================================================================
   CHAPTER 6: Data Cleaning & Wrangling
   ========================================================================= */
export const Chapter6Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Module 06</span>
          <span>•</span>
          <span>Data Cleaning & Integrity</span>
          <span>•</span>
          <span className="text-cyan-400">Intermediate</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Data Cleaning & Wrangling: NULL Imputation, IQR Bounds & Integrity Auditing
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Over 70% of real-world data science time is spent wrestling messy data into compliant shapes. Master the taxonomy
          of NULL values, implement mathematical Interquartile Range (IQR) outlier filters, resolve type casting errors, and
          build automated data quality scorecards.
        </p>
      </div>

      {/* 1. Handling NULLs */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. The Taxonomy of Missing Data (NULLs)
        </h2>
        <p className="text-sm leading-relaxed">
          Blindly calling <code>df.dropna()</code> or replacing missing values with zero is a recipe for biased models. You
          must first diagnose the missingness mechanism:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="font-mono text-cyan-300 font-bold block mb-1">1. MCAR (Completely at Random)</span>
            <p className="text-slate-300 mb-2">
              Missingness has zero relationship to any observed or unobserved data (e.g. transient network timeout dropped 0.1% of logs).
            </p>
            <span className="text-emerald-400 font-semibold">Treatment: Listwise deletion or mean/median imputation is statistically safe.</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="font-mono text-amber-300 font-bold block mb-1">2. MAR (Missing at Random)</span>
            <p className="text-slate-300 mb-2">
              Missingness relates to another observed variable, but not the missing value itself (e.g. Mobile iOS users skip the phone number field).
            </p>
            <span className="text-amber-400 font-semibold">Treatment: Conditional subgroup imputation (e.g. impute median by device type).</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="font-mono text-rose-300 font-bold block mb-1">3. MNAR (Not at Random)</span>
            <p className="text-slate-300 mb-2">
              Missingness directly depends on the unobserved value itself (e.g. fraudulent bot accounts deliberately leave tax IDs blank).
            </p>
            <span className="text-rose-400 font-semibold">Treatment: Preserve missingness as a discrete feature! (e.g. has_tax_id_null = 1).</span>
          </div>
        </div>
      </section>

      {/* 2. Mathematical IQR Outlier Detection */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Mathematical Interquartile Range (IQR) Outlier Detection
        </h2>
        <p className="text-sm leading-relaxed">
          The Interquartile Range (IQR) measures the spread of the middle 50% of the data. Unlike Z-scores (which assume a
          bell curve), IQR fences work exceptionally well on non-normal, skewed business distributions:
        </p>

        {/* Formula Box */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs text-slate-300 space-y-2 my-4">
          <div className="text-cyan-400 font-bold">MATHEMATICAL FORMULA DEFINITIONS:</div>
          <div>1. <span className="text-emerald-300">IQR</span> = Q3 (75th Percentile) - Q1 (25th Percentile)</div>
          <div>2. <span className="text-amber-300">Lower Bound Fence</span> = Q1 - (1.5 × IQR)</div>
          <div>3. <span className="text-rose-300">Upper Bound Fence</span> = Q3 + (1.5 × IQR)</div>
          <div className="pt-2 text-slate-400 text-[11px] font-sans">
            Any data point falling below the Lower Fence or above the Upper Fence is classified as a statistical outlier.
          </div>
        </div>

        <h3 className="text-base font-bold text-white pt-2">Python Implementation with Pandas & NumPy</h3>
        <CodeBlock
          language="python"
          code={`import numpy as np
import pandas as pd

def detect_iqr_outliers(df: pd.DataFrame, column: str) -> pd.DataFrame:
    """
    Computes IQR bounds and returns an outlier mask DataFrame.
    """
    q1 = df[column].quantile(0.25)
    q3 = df[column].quantile(0.75)
    iqr = q3 - q1
    
    lower_bound = q1 - (1.5 * iqr)
    upper_bound = q3 + (1.5 * iqr)
    
    print(f"[{column}] Q1: {q1:.2f} | Q3: {q3:.2f} | IQR: {iqr:.2f}")
    print(f"[{column}] Valid Range Bounds: [{lower_bound:.2f}, {upper_bound:.2f}]")
    
    # Filter rows flagged as outliers
    outliers_df = df[(df[column] < lower_bound) | (df[column] > upper_bound)]
    print(f"Flagged {len(outliers_df)} anomalous records ({len(outliers_df)/len(df)*100:.2f}%)")
    
    return outliers_df`}
        />
      </section>

      {/* 3. Data Validation Checklist */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          3. Production Data Validation Checklist
        </h2>
        <p className="text-sm leading-relaxed">
          Before building dashboards or reporting figures to executives, audit your tables against this data quality
          scorecard:
        </p>

        {/* Validation Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 my-4 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-300 font-mono">
                <th className="py-2.5 px-4 font-bold text-cyan-300">Dimension</th>
                <th className="py-2.5 px-4 font-bold">Integrity Check</th>
                <th className="py-2.5 px-4 font-bold">SQL / Test Query Assertion</th>
                <th className="py-2.5 px-4 font-bold">Pass Criteria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-blue-400 font-mono">Uniqueness</td>
                <td className="py-3 px-4 text-slate-300">Primary Key Deduplication</td>
                <td className="py-3 px-4 font-mono text-cyan-300">COUNT(*) - COUNT(DISTINCT user_id)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold font-mono">0 Duplicates</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-cyan-400 font-mono">Completeness</td>
                <td className="py-3 px-4 text-slate-300">Critical Column Non-Nullability</td>
                <td className="py-3 px-4 font-mono text-cyan-300">COUNT(*) WHERE transaction_amount IS NULL</td>
                <td className="py-3 px-4 text-emerald-400 font-bold font-mono">0 NULLs</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-amber-400 font-mono">Range Validity</td>
                <td className="py-3 px-4 text-slate-300">Non-Negative Financial Values</td>
                <td className="py-3 px-4 font-mono text-cyan-300">COUNT(*) WHERE amount &lt; 0 OR amount &gt; 100000</td>
                <td className="py-3 px-4 text-emerald-400 font-bold font-mono">0 Violations</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-emerald-400 font-mono">Referential Integrity</td>
                <td className="py-3 px-4 text-slate-300">No Orphaned Foreign Keys</td>
                <td className="py-3 px-4 font-mono text-cyan-300">SELECT COUNT(*) FROM tx LEFT JOIN users WHERE u.id IS NULL</td>
                <td className="py-3 px-4 text-emerald-400 font-bold font-mono">0 Orphans</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
