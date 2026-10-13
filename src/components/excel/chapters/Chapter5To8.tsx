import React from 'react';
import { ExcelCalloutBox } from '../ExcelCalloutBox.tsx';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { DateCalculationFlowDiagram } from '../diagrams/DateCalculationFlowDiagram.tsx';

/* =========================================================================
   CHAPTER 5: Text Functions & Data Standardization
   ========================================================================= */
export const Chapter5Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <span>Chapter 05</span>
          <span>·</span>
          <span>Text Normalization & Cleansing</span>
          <span>·</span>
          <span>20 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Text Functions & Data Standardization: LEFT, RIGHT, MID, TRIM & TEXTSPLIT
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Ingested raw data from web forms, SQL dumps, and payment gateways is notoriously messy: polluted with irregular spacing, mixed delimiters, and combined alphanumeric identifier keys. Standardizing text fields is essential before feeding records into machine learning models or relational databases.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Master Text Functions Arsenal</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden font-mono">
            <thead className="bg-slate-900 text-slate-300 uppercase text-[11px] font-sans">
              <tr>
                <th className="p-3 border-b border-slate-800">Function</th>
                <th className="p-3 border-b border-slate-800">Formula Syntax</th>
                <th className="p-3 border-b border-slate-800">Input Raw String</th>
                <th className="p-3 border-b border-slate-800">Output Standardized Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-400 font-sans font-bold">TRIM & CLEAN</td>
                <td className="p-3 text-slate-300">=TRIM(CLEAN(text))</td>
                <td className="p-3">"  USR_9012 \\n  "</td>
                <td className="p-3 text-emerald-300">"USR_9012" (Removes non-printing spaces)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-400 font-sans font-bold">LEFT / RIGHT</td>
                <td className="p-3 text-slate-300">=LEFT(text, num_chars)</td>
                <td className="p-3">"TXN-2026-US-894"</td>
                <td className="p-3 text-emerald-300">=LEFT(A2, 3) $\to$ "TXN"</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-400 font-sans font-bold">MID + SEARCH</td>
                <td className="p-3 text-slate-300">=MID(text, start, length)</td>
                <td className="p-3">"TXN-2026-US-894"</td>
                <td className="p-3 text-emerald-300">=MID(A2, 5, 4) $\to$ "2026" (Year extract)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-emerald-400 font-sans font-bold">TEXTJOIN</td>
                <td className="p-3 text-slate-300">=TEXTJOIN(delimiter, ignore_empty, range)</td>
                <td className="p-3">A2:A4 ("SQL", "Python", "")</td>
                <td className="p-3 text-emerald-300">"SQL, Python" (Skips blanks cleanly)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-emerald-400 font-sans font-bold">TEXTSPLIT (365)</td>
                <td className="p-3 text-slate-300">=TEXTSPLIT(text, col_delimiter)</td>
                <td className="p-3">"analytics@codingthunder.com"</td>
                <td className="p-3 text-emerald-300">Spills ["analytics", "codingthunder.com"]</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. Real-World User Tag & Email Normalization Pipeline</h2>
        <CodeBlock
          filename="text_cleansing_pipeline.xlsx"
          language="excel"
          code={`# Target: Normalize messy creator handles and extract domain & region tags
# Cell A2: "  @TechLead_US_Verified  "

# 1. Strip rogue spaces and remove '@' symbol:
=SUBSTITUTE(TRIM(A2), "@", "")
# Result: "TechLead_US_Verified"

# 2. Modern Dynamic Delimiter Tokenization with TEXTSPLIT:
# Spills tokens across adjacent columns horizontally:
=TEXTSPLIT(SUBSTITUTE(TRIM(A2), "@", ""), "_")
# Spills: ["TechLead", "US", "Verified"]

# 3. Dynamic Email Domain Extraction (Universal Formula across Excel versions):
# Cell B2: "sarah.connor@cyberdyne-defense.org"
=RIGHT(B2, LEN(B2) - FIND("@", B2))
# Result: "cyberdyne-defense.org"`}
        />

        <ExcelCalloutBox type="pro-tip" title="The Hidden CHAR(160) Web Non-Breaking Space Bug">
          Did you know standard <code className="text-rose-400">=TRIM(A2)</code> will <strong>fail</strong> to remove spaces copied from websites or HTML tables? Web applications use <code className="text-amber-300">CHAR(160)</code> (&amp;nbsp;) instead of the standard ASCII 32 space. To eliminate rogue web spaces completely, wrap with SUBSTITUTE:
          <pre className="mt-2 font-mono text-emerald-300 bg-slate-950 p-2 rounded">
            =TRIM(CLEAN(SUBSTITUTE(A2, CHAR(160), " ")))
          </pre>
        </ExcelCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 6: Date & Time Functions & SLA Tracking
   ========================================================================= */
export const Chapter6Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <span>Chapter 06</span>
          <span>·</span>
          <span>Temporal & SLA Tracking</span>
          <span>·</span>
          <span>20 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Date & Time Functions: TODAY, EDATE, EOMONTH & SLA Tracking
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Time is money in commercial operations. Whether calculating subscriber churn billing cycles, projecting future runway, or tracking fraud incident resolution within strict regulatory SLA timeframes, understanding Excel's date serial engine is crucial.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. SLA Policy Tracking Workflow</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The diagram below models an automated compliance auditing pipeline calculating working days elapsed since a high-priority incident was flagged, factoring out weekends and company holidays to detect policy breaches.
        </p>

        {/* Visual SVG Diagram */}
        <DateCalculationFlowDiagram />

        <h2 className="text-2xl font-bold text-white pt-4">2. Core Temporal Functions Matrix</h2>
        <CodeBlock
          filename="temporal_sla_models.xlsx"
          language="excel"
          code={`# Target: Incident timestamp in Cell A2 ("2026-10-01")
# Target: Holiday range locked in $H$2:$H$15

# 1. Regulatory Business Days Elapsed (Excludes Saturdays, Sundays & Official Holidays):
=NETWORKDAYS(A2, TODAY(), $H$2:$H$15)

# 2. SLA Breach Rule: High-Priority Fraud Incidents must be closed in <= 5 Working Days:
=IF(NETWORKDAYS(A2, TODAY(), $H$2:$H$15) > 5, "SLA_BREACH_PENALTY", "IN_COMPLIANCE")

# 3. Projecting Future Recurring Subscription Billing Date (EDATE):
# Cell B2: Contract Start Date ("2026-03-15"), Cell C2: Term in Months (12)
=EDATE(B2, C2)               # Returns exact renewal date 12 months out: "2027-03-15"

# 4. End of Month Accounting Reconciliations (EOMONTH):
=EOMONTH(TODAY(), 0)         # Returns last calendar day of the CURRENT month
=EOMONTH(TODAY(), -1) + 1     # Returns first calendar day of the current month`}
        />

        <ExcelCalloutBox type="interview-tip" title="Interview Question: Why Avoid TODAY() and NOW() in 500,000 Rows?">
          <code className="text-rose-400">TODAY()</code> and <code className="text-rose-400">NOW()</code> are <strong>Volatile Functions</strong>. A volatile function forces Excel to recalculate <em>every single cell</em> whenever any key is pressed or any cell in the entire workbook changes, even if unrelated! Placing volatile functions across 100,000 rows will freeze Excel. Instead, write <code className="text-emerald-300">=TODAY()</code> in a single configuration cell (<code className="text-cyan-300">$Z$1</code>) and reference that cell elsewhere (<code className="text-cyan-300">NETWORKDAYS(A2, $Z$1)</code>).
        </ExcelCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 7: Data Cleaning & Validation
   ========================================================================= */
export const Chapter7Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <span>Chapter 07</span>
          <span>·</span>
          <span>Data Integrity & Validation</span>
          <span>·</span>
          <span>22 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Data Cleaning & Validation: Sort, Filter, Deduplication & Input Restrictions
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          "Garbage in, garbage out" is the cardinal rule of analytics. In this chapter, we master deduplication across multi-column composite keys, automated data hygiene, and preventing invalid inputs using strict Data Validation rules.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Data Hygiene Operations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-emerald-400 mb-1 font-mono uppercase">Multi-Column Deduplication</h3>
            <p className="text-slate-300 leading-relaxed">
              When removing duplicates via <strong>Data $\to$ Remove Duplicates</strong>, beware of selecting only a single column like "Customer Name", which will erase distinct transactions! Always select composite unique keys: e.g., <code className="text-cyan-300">Transaction_ID + Timestamp</code>.
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-cyan-400 mb-1 font-mono uppercase">Flash Fill (Ctrl + E) Magic</h3>
            <p className="text-slate-300 leading-relaxed">
              Excel's pattern-recognition engine. Type an example output in the adjacent column (e.g., extracting first names or formatting phone numbers) and press <code className="text-amber-300">Ctrl + E</code> to fill 50,000 rows automatically.
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-amber-400 mb-1 font-mono uppercase">Official Excel Tables (Ctrl + T)</h3>
            <p className="text-slate-300 leading-relaxed">
              Converting raw ranges into official Tables enables dynamic structured references (<code className="text-amber-300">Table[Column]</code>), automatic formula propagation to new rows, and seamless Power BI / Power Query loading.
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-purple-400 mb-1 font-mono uppercase">Data Validation Dropdowns</h3>
            <p className="text-slate-300 leading-relaxed">
              Restrict manual data entry using <strong>Data $\to$ Data Validation $\to$ List</strong> to enforce standardized values (e.g. <code className="text-purple-300">"PENDING, APPROVED, REJECTED"</code>), preventing typos before they pollute the dataset.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. Custom Data Validation Formula Rules</h2>
        <CodeBlock
          filename="data_validation_rules.xlsx"
          language="excel"
          code={`# Target: Enforce strict constraints on the Transaction Entry Column (Col C):

# Rule 1: Restrict to valid positive monetary amounts between $1.00 and $10,000.00
# Settings -> Allow: Decimal -> Between -> Minimum: 1.00, Maximum: 10000.00

# Rule 2: Restrict User ID entry to valid uppercase alphanumerics of length 8:
=AND(LEN(A2)=8, EXACT(A2, UPPER(A2)))

# Rule 3: Prevent duplicate Transaction IDs from ever being typed into Column A:
=COUNTIF($A:$A, A2) = 1

# If a user attempts to enter an existing ID, Excel displays a modal error dialog:
# "Data Governance Alert: Transaction ID already exists in ledger!"`}
        />

        <ExcelCalloutBox type="best-practice" title="Always Convert Raw Data to Excel Tables (Ctrl + T)">
          Never leave raw datasets as plain unformatted grid cells! Pressing <code className="text-emerald-300">Ctrl + T</code> turns a dataset into an official Excel Table. Any formulas you type in the column auto-fill to the entire table, and formulas adjust automatically when new records are appended at the bottom!
        </ExcelCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 8: Pivot Tables & Subscriber Bucketing
   ========================================================================= */
export const Chapter8Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <span>Chapter 08</span>
          <span>·</span>
          <span>Aggregation & Dashboards</span>
          <span>·</span>
          <span>25 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Pivot Tables & Charts: Subscriber Bucketing, Slicers & Dashboard Flow
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Pivot Tables are the crown jewel of Excel data analysis. They allow analysts to slice, dice, bucket, and summarize hundreds of thousands of transaction records in seconds without writing a single manual formula.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Subscriber Count Bucket Analysis Scenario</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Imagine analyzing 100,000 creator channels. Individual subscriber numbers are continuous (e.g. 14,204; 850,210). To extract meaningful business intelligence, we group creators into <strong>Subscriber Tier Buckets</strong> using Pivot Table grouping or discrete categorizations:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden font-mono">
            <thead className="bg-slate-900 text-slate-300 uppercase text-[11px] font-sans">
              <tr>
                <th className="p-3 border-b border-slate-800">Subscriber Bucket</th>
                <th className="p-3 border-b border-slate-800">Range Criteria</th>
                <th className="p-3 border-b border-slate-800">Channel Count</th>
                <th className="p-3 border-b border-slate-800">Aggregate Monthly MRR</th>
                <th className="p-3 border-b border-slate-800">Average Payout / Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-300 font-sans font-bold">Micro-Creator</td>
                <td className="p-3">0 to 10,000 Subs</td>
                <td className="p-3">74,210 (74.2%)</td>
                <td className="p-3 text-emerald-400">$340,000</td>
                <td className="p-3">$4.58</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-amber-300 font-sans font-bold">Mid-Tier Growth</td>
                <td className="p-3">10,001 to 100,000 Subs</td>
                <td className="p-3">21,450 (21.4%)</td>
                <td className="p-3 text-emerald-400">$1,850,000</td>
                <td className="p-3">$86.24</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-purple-300 font-sans font-bold">Macro Partner</td>
                <td className="p-3">100,001 to 1,000,000 Subs</td>
                <td className="p-3">4,120 (4.1%)</td>
                <td className="p-3 text-emerald-400">$4,200,000</td>
                <td className="p-3">$1,019.41</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-rose-300 font-sans font-bold">Elite Enterprise</td>
                <td className="p-3">&gt; 1,000,000 Subs</td>
                <td className="p-3">220 (0.2%)</td>
                <td className="p-3 text-emerald-400">$8,900,000</td>
                <td className="p-3">$40,454.54</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. Interactive Dashboard Architecture with Slicers</h2>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs text-slate-300">
          <p className="font-bold text-amber-400">Connecting Slicers Across Multiple Pivot Tables:</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
            <li>Insert multiple Pivot Tables from the same underlying Data Model or Table (e.g., Table 1: MRR by Tier, Table 2: Churn by Region).</li>
            <li>Select any Pivot Table and click <strong>PivotTable Analyze $\to$ Insert Slicer</strong> (choose Region, Tier, Platform).</li>
            <li>Right-click the Slicer and open <strong>Report Connections</strong>. Check all Pivot Tables on the dashboard sheet.</li>
            <li>Now, clicking a single button on the Slicer dynamically filters all Pivot Tables and connected Pivot Charts simultaneously!</li>
          </ol>
        </div>

        <ExcelCalloutBox type="pro-tip" title="Disable 'Autofit Column Widths on Update'">
          Ever had your carefully designed dashboard layout jump and resize every time you click a Slicer? Right-click your Pivot Table $\to$ select <strong>PivotTable Options</strong> $\to$ uncheck <em>"Autofit column widths on update"</em>. This keeps your dashboard cards pixel-perfect!
        </ExcelCalloutBox>
      </div>
    </div>
  );
};
