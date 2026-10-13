import React from 'react';
import { DataAnalyticsCalloutBox } from '../DataAnalyticsCalloutBox.tsx';
import { CodeBlock } from '../../common/CodeBlock.tsx';

/* =========================================================================
   CHAPTER 7: Exploratory Data Analysis (EDA)
   ========================================================================= */
export const Chapter7Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Module 07</span>
          <span>•</span>
          <span>Exploratory Data Analysis (EDA)</span>
          <span>•</span>
          <span className="text-cyan-400">Intermediate</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Exploratory Data Analysis (EDA): Univariate, Bivariate & Skewness Profiling
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Before training models or shipping dashboards, analysts must listen to what the data is whispering. Master the
          systematic 3-tier EDA framework, detect power-law distributions, and uncover hidden structural anomalies.
        </p>
      </div>

      {/* 1. EDA 3-Tier Framework */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. The 3-Tier EDA Exploration Framework
        </h2>
        <p className="text-sm leading-relaxed">
          Exploratory Data Analysis should never be a random collection of charts. Progress through these 3 structured tiers:
        </p>

        {/* Framework Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 my-4 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-300 font-mono">
                <th className="py-2.5 px-4 font-bold text-cyan-300">EDA Tier</th>
                <th className="py-2.5 px-4 font-bold">Scope of Variables</th>
                <th className="py-2.5 px-4 font-bold">Core Visualizations</th>
                <th className="py-2.5 px-4 font-bold">Key Questions Answered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-blue-400 font-mono">Univariate</td>
                <td className="py-3 px-4 text-slate-300">1 Variable in Isolation</td>
                <td className="py-3 px-4 text-slate-300">Histograms, KDE Density Plots, Box Plots, Count Plots</td>
                <td className="py-3 px-4 text-slate-400">
                  What is the spread? Is the metric normally distributed or heavily skewed? Where are the zeros and NULLs?
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-cyan-400 font-mono">Bivariate</td>
                <td className="py-3 px-4 text-slate-300">2 Variables Simultaneously</td>
                <td className="py-3 px-4 text-slate-300">Scatter Plots, Grouped Bar Charts, Line Trends, Cross-Tabs</td>
                <td className="py-3 px-4 text-slate-400">
                  Does higher transaction velocity correlate with higher chargeback rates? Are certain channels outperforming?
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-purple-400 font-mono">Multivariate</td>
                <td className="py-3 px-4 text-slate-300">3+ Variables Interactions</td>
                <td className="py-3 px-4 text-slate-300">Correlation Heatmaps, Faceted Grid Plots, 3D PCA Visualizations</td>
                <td className="py-3 px-4 text-slate-400">
                  How does device type, country code, and payment method interact together to amplify fraud exposure?
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Detecting Skewness */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Skewness Profiling & Log Transformation
        </h2>
        <p className="text-sm leading-relaxed">
          Financial and subscriber counts exhibit high positive skewness (right tail extends infinitely). If you feed
          heavily skewed features into linear regression models, the model will overfit to high-earning outliers:
        </p>

        <CodeBlock
          language="python"
          code={`import numpy as np
import pandas as pd

# 1. Compute Fisher-Pearson skewness coefficient
subscriber_skew = df['subscriber_count'].skew()
print(f"Subscriber Skewness: {subscriber_skew:.2f}")  # e.g., 8.42 (Heavily Right-Skewed!)

# 2. Apply log1p transformation (log(1 + x) prevents log(0) errors)
df['log_subscriber_count'] = np.log1p(df['subscriber_count'])

# 3. Post-transformation skewness verification
log_skew = df['log_subscriber_count'].skew()
print(f"Transformed Skewness: {log_skew:.2f}")        # e.g., 0.18 (Near Gaussian Normal!)`}
        />

        <DataAnalyticsCalloutBox type="pro-tip" title="EDA Presentation Rule">
          When delivering EDA findings to executive stakeholders, never dump 30 raw charts. Structure your deck around
          <strong>"Observation ➔ Business Impact ➔ Recommended Investigation"</strong>.
        </DataAnalyticsCalloutBox>
      </section>
    </div>
  );
};

/* =========================================================================
   CHAPTER 8: Python for Data Analytics
   ========================================================================= */
export const Chapter8Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Module 08</span>
          <span>•</span>
          <span>Python, Pandas & Vectorization</span>
          <span>•</span>
          <span className="text-cyan-400">Intermediate to Advanced</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Python for Data Analytics: NumPy Arrays, Pandas Pipelines & Vectorization
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          When datasets exceed Excel's 1-million-row threshold, Python becomes your analytical powerhouse. Master NumPy
          vectorized arithmetic, conquer Pandas DataFrame slicing (.loc vs .iloc), multi-dimensional groupbys, and build an
          end-to-end automated fraud detection script.
        </p>
      </div>

      {/* 1. Vectorization vs For-Loops */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. Vectorization: Why For-Loops Destroy Performance
        </h2>
        <p className="text-sm leading-relaxed">
          Standard Python loops iterate row-by-row in interpreted CPython bytecode, incurring heavy overhead. In contrast,
          <strong>NumPy & Pandas Vectorization</strong> delegates mathematical operations to compiled C and SIMD hardware
          instructions, delivering 100x to 1,000x speedups:
        </p>

        <CodeBlock
          language="python"
          code={`# ANTI-PATTERN: Iterating row-by-row with Python for-loop (SLOW!)
# Takes ~18.5 seconds on 1,000,000 rows
risk_scores = []
for index, row in df.iterrows():
    risk_scores.append(row['amount'] * 0.05 if row['is_foreign_ip'] else row['amount'] * 0.01)
df['risk_score'] = risk_scores

# PRODUCTION BEST PRACTICE: Vectorized NumPy conditional execution (BLAZING FAST!)
# Takes ~12 milliseconds on 1,000,000 rows (Over 1,500x speedup!)
import numpy as np
df['risk_score'] = np.where(df['is_foreign_ip'], df['amount'] * 0.05, df['amount'] * 0.01)`}
        />
      </section>

      {/* 2. Pandas Operations Translation Matrix */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. The Universal Operations Translation Matrix: Excel vs. SQL vs. Pandas
        </h2>
        <p className="text-sm leading-relaxed">
          Translate common data operations across spreadsheets, databases, and Python code:
        </p>

        {/* Translation Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 my-4 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-300 font-mono">
                <th className="py-2.5 px-4 font-bold text-cyan-300">Analytical Task</th>
                <th className="py-2.5 px-4 font-bold text-emerald-300">Excel / Spreadsheet</th>
                <th className="py-2.5 px-4 font-bold text-blue-300">SQL Database</th>
                <th className="py-2.5 px-4 font-bold text-amber-300">Python Pandas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-slate-200 font-sans">Filter Rows</td>
                <td className="py-2.5 px-4 text-emerald-400">=FILTER(A2:D, C2:C &gt; 100)</td>
                <td className="py-2.5 px-4 text-blue-400">WHERE amount &gt; 100</td>
                <td className="py-2.5 px-4 text-amber-300">df[df['amount'] &gt; 100]</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-slate-200 font-sans">Group & Aggregate</td>
                <td className="py-2.5 px-4 text-emerald-400">Pivot Table (Rows + Values)</td>
                <td className="py-2.5 px-4 text-blue-400">GROUP BY tier SELECT AVG(mrr)</td>
                <td className="py-2.5 px-4 text-amber-300">df.groupby('tier')['mrr'].mean()</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-slate-200 font-sans">Relational Lookup</td>
                <td className="py-2.5 px-4 text-emerald-400">=XLOOKUP(A2, users!A:A, users!B:B)</td>
                <td className="py-2.5 px-4 text-blue-400">INNER JOIN users ON u.id = t.uid</td>
                <td className="py-2.5 px-4 text-amber-300">pd.merge(df1, df2, on='user_id', how='inner')</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-bold text-slate-200 font-sans">Deduplicate</td>
                <td className="py-2.5 px-4 text-emerald-400">Data ➔ Remove Duplicates</td>
                <td className="py-2.5 px-4 text-blue-400">ROW_NUMBER() OVER(...) WHERE rn = 1</td>
                <td className="py-2.5 px-4 text-amber-300">df.drop_duplicates(subset=['id'], keep='last')</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Production Python Fraud Script */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          3. Complete Automated Python Fraud Pipeline Script
        </h2>
        <p className="text-sm leading-relaxed">
          Here is an end-to-end Python pipeline script integrating data ingestion, timestamp conversion, IQR anomaly scoring,
          and automatic suspicious alert export:
        </p>

        <CodeBlock
          language="python"
          code={`import pandas as pd
import numpy as np

def run_fraud_investigation_pipeline(input_csv_path: str) -> pd.DataFrame:
    # 1. Ingestion & Schema Type Casting
    df = pd.read_csv(input_csv_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0.0)
    
    # 2. Window Velocity Metric: Transactions per user in last 10 minutes
    df = df.sort_values(by=['user_id', 'timestamp'])
    df['rolling_tx_count_10m'] = (
        df.groupby('user_id')
        .rolling('10min', on='timestamp')['transaction_id']
        .count()
        .reset_index(drop=True)
    )
    
    # 3. IQR Outlier Detection on Transaction Amount
    q1 = df['amount'].quantile(0.25)
    q3 = df['amount'].quantile(0.75)
    iqr = q3 - q1
    amount_threshold = q3 + (1.5 * iqr)
    
    # 4. Multi-Condition Risk Flagging
    conditions = [
        (df['rolling_tx_count_10m'] >= 5) & (df['amount'] > amount_threshold),
        (df['rolling_tx_count_10m'] >= 5),
        (df['amount'] > amount_threshold)
    ]
    choices = ['CRITICAL_VELOCITY_AND_OUTLIER', 'HIGH_FREQUENCY_BOT', 'OUTLIER_DOLLAR_VALUE']
    df['anomaly_classification'] = np.select(conditions, choices, default='NORMAL')
    
    # 5. Extract Actionable Triage Queue
    flagged_alerts = df[df['anomaly_classification'] != 'NORMAL'].copy()
    print(f"Pipeline executed successfully. Flagged {len(flagged_alerts)} actionable alerts.")
    return flagged_alerts`}
        />
      </section>
    </div>
  );
};

/* =========================================================================
   CHAPTER 9: Data Visualization Principles
   ========================================================================= */
export const Chapter9Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Module 09</span>
          <span>•</span>
          <span>Data Visualization & Cognitive Design</span>
          <span>•</span>
          <span className="text-cyan-400">Intermediate</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Data Visualization Principles: Cognitive Load, Gestalt Theory & Visual Hierarchy
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          A dashboard that takes more than 5 seconds to understand is a failed analytical product. Master Edward Tufte’s
          data-to-ink ratio, harness Gestalt psychological principles of visual perception, and use the definitive Chart
          Type Selection Matrix.
        </p>
      </div>

      {/* 1. Chart Type Selection Matrix */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. The Comprehensive Chart Type Selection Matrix
        </h2>
        <p className="text-sm leading-relaxed">
          Selecting the wrong chart type distorts data relationships and confuses executives. Use this definitive matrix:
        </p>

        {/* Chart Selection Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 my-4 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-300 font-mono">
                <th className="py-2.5 px-4 font-bold text-cyan-300">Chart Type</th>
                <th className="py-2.5 px-4 font-bold">Primary Analytical Goal</th>
                <th className="py-2.5 px-4 font-bold">Ideal Data Structure</th>
                <th className="py-2.5 px-4 font-bold text-rose-300">Strictly Avoid When</th>
                <th className="py-2.5 px-4 font-bold">Cognitive Load</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-blue-400 font-mono">Bar / Column Chart</td>
                <td className="py-3 px-4 text-slate-300">Comparing discrete categorical values</td>
                <td className="py-3 px-4 text-slate-400">1 categorical dimension + 1 aggregate metric</td>
                <td className="py-3 px-4 text-rose-300">Showing continuous time-series with &gt; 50 points</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Very Low (Instant)</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-cyan-400 font-mono">Line Chart</td>
                <td className="py-3 px-4 text-slate-300">Tracking continuous trends over time</td>
                <td className="py-3 px-4 text-slate-400">1 continuous date/time + 1 continuous metric</td>
                <td className="py-3 px-4 text-rose-300">Comparing non-temporal discrete categories (e.g. countries)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Very Low</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-amber-400 font-mono">Scatter Plot</td>
                <td className="py-3 px-4 text-slate-300">Investigating correlation & clusters</td>
                <td className="py-3 px-4 text-slate-400">2 continuous numerical variables (X, Y)</td>
                <td className="py-3 px-4 text-rose-300">Presenting macro summary KPIs to non-technical executives</td>
                <td className="py-3 px-4 text-amber-400 font-bold">Medium</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-purple-400 font-mono">Box & Whisker Plot</td>
                <td className="py-3 px-4 text-slate-300">Comparing distributions, medians & outliers</td>
                <td className="py-3 px-4 text-slate-400">1 categorical group + 1 continuous numerical field</td>
                <td className="py-3 px-4 text-rose-300">Audience lacks statistical training (they confuse whiskers with errors)</td>
                <td className="py-3 px-4 text-amber-400 font-bold">Medium-High</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-rose-400 font-mono">Pie / Donut Chart</td>
                <td className="py-3 px-4 text-slate-300">Displaying simple 2-3 part-to-whole slices</td>
                <td className="py-3 px-4 text-slate-400">Discrete categories summing to exactly 100%</td>
                <td className="py-3 px-4 text-rose-300 font-bold">More than 4 slices! Human brain is terrible at comparing angles.</td>
                <td className="py-3 px-4 text-rose-400 font-bold">High (if overloaded)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <DataAnalyticsCalloutBox type="pro-tip" title="The Donut Chart Ban">
          In elite data teams, pie charts with more than 3 slices are banned. Replace them with a sorted horizontal bar
          chart. Horizontal bar charts allow instant side-by-side length comparison and support long category labels without
          awkward rotation.
        </DataAnalyticsCalloutBox>
      </section>

      {/* 2. Gestalt Principles in Dashboard UX */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Gestalt Psychology Principles in Dashboard UX
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="font-mono text-cyan-300 font-bold block mb-1">1. Proximity</span>
            <p className="text-slate-300">
              Objects placed physically close to each other are perceived as belonging to the same logical group. Keep
              related filters directly above their target visual!
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="font-mono text-emerald-300 font-bold block mb-1">2. Similarity</span>
            <p className="text-slate-300">
              Elements sharing identical colors or shapes are perceived as having the same meaning. Use red exclusively
              for danger/anomalies—never for decorative styling.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="font-mono text-purple-300 font-bold block mb-1">3. Enclosure</span>
            <p className="text-slate-300">
              Visual borders and card backgrounds delineate clear conceptual boundaries, preventing cognitive bleed between
              unrelated operational metrics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
