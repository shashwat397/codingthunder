import React from 'react';
import { ExcelCalloutBox } from '../ExcelCalloutBox.tsx';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { LogicalDecisionFlowDiagram } from '../diagrams/LogicalDecisionFlowDiagram.tsx';
import { IndexMatchDiagram } from '../diagrams/IndexMatchDiagram.tsx';

/* =========================================================================
   CHAPTER 1: Excel Basics & Interface
   ========================================================================= */
export const Chapter1Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <span>Chapter 01</span>
          <span>·</span>
          <span>Spreadsheet Foundations</span>
          <span>·</span>
          <span>15 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Excel Basics & Interface: Workbooks, Worksheets & Navigation
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Microsoft Excel is the world's most ubiquitous analytical calculation software. From high-frequency Wall Street financial modeling to corporate fraud detection pipelines, understanding Excel's low-level workbook structure and navigation mechanics is the prerequisite to analytical mastery.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Workbook Anatomy & Grid Architecture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-emerald-400 mb-1 font-mono uppercase">Workbook vs Worksheet</h3>
            <p className="text-slate-300 leading-relaxed">
              A <strong>Workbook</strong> is the container file saved on disk (<code className="text-emerald-300">.xlsx</code> or binary <code className="text-emerald-300">.xlsb</code>). A <strong>Worksheet</strong> (or sheet tab) is a single 2D spreadsheet grid within that workbook. A single workbook can host hundreds of interconnected sheets.
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-cyan-400 mb-1 font-mono uppercase">Grid Limits & Memory</h3>
            <p className="text-slate-300 leading-relaxed">
              Every modern worksheet possesses exactly <strong>1,048,576 rows</strong> and <strong>16,384 columns</strong> (Column A through XFD). Cells are identified by alphanumeric intersection coordinates (e.g., <code className="text-cyan-300">C14</code>).
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-amber-400 mb-1 font-mono uppercase">The Formula Bar & Name Box</h3>
            <p className="text-slate-300 leading-relaxed">
              The <strong>Name Box</strong> (top left) displays the active cell coordinate or defined Named Range. The <strong>Formula Bar</strong> displays the underlying calculation formula, distinguishing raw input values from derived computations.
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-purple-400 mb-1 font-mono uppercase">Status Bar Dynamic Telemetry</h3>
            <p className="text-slate-300 leading-relaxed">
              Highlighting any numerical range instantly computes real-time summary telemetry at the bottom right: Average, Count, and Sum, without requiring formula insertion.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. Top 10 High-Speed Navigation Shortcuts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden font-mono">
            <thead className="bg-slate-900 text-slate-300 uppercase text-[11px] font-sans">
              <tr>
                <th className="p-3 border-b border-slate-800">Shortcut (Windows / Mac)</th>
                <th className="p-3 border-b border-slate-800">Action & Functionality</th>
                <th className="p-3 border-b border-slate-800">Data Analytics Scenario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-emerald-400 font-bold">Ctrl + Arrow Keys</td>
                <td className="p-3 font-sans">Jump immediately to the edge of the continuous data block</td>
                <td className="p-3 font-sans">Instantly jumping to row 500,000 without manual mouse scrolling</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-emerald-400 font-bold">Ctrl + Shift + Arrow Keys</td>
                <td className="p-3 font-sans">Highlight and select all cells to the edge of the contiguous data block</td>
                <td className="p-3 font-sans">Selecting an entire column of transaction IDs to apply formatting</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-emerald-400 font-bold">Ctrl + Home / End</td>
                <td className="p-3 font-sans">Jump to cell A1 / Jump to the lowest-right used cell in worksheet</td>
                <td className="p-3 font-sans">Resetting view to header or discovering rogue phantom formatted rows</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-400 font-bold">Ctrl + PageDown / PageUp</td>
                <td className="p-3 font-sans">Toggle to next / previous worksheet tab</td>
                <td className="p-3 font-sans">Switching between Raw Data and Executive Dashboard tabs</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-amber-400 font-bold">F2 (Mac: Ctrl + U)</td>
                <td className="p-3 font-sans">Enter in-cell editing mode with color-coded range highlights</td>
                <td className="p-3 font-sans">Inspecting formula precedents directly on the grid</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ExcelCalloutBox type="pro-tip" title="Use .xlsb (Excel Binary Workbook) for Heavy Datasets">
          When dealing with workbooks exceeding 50 MB with hundreds of thousands of transaction logs, save the file as <strong>Excel Binary Workbook (.xlsb)</strong>. It compresses file size by up to 60% and opens/saves up to 4x faster because Excel bypasses XML parsing and loads raw binary structures directly into memory!
        </ExcelCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 2: Basic Formulas & Cell References
   ========================================================================= */
export const Chapter2Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <span>Chapter 02</span>
          <span>·</span>
          <span>Core Formulas & Cell Math</span>
          <span>·</span>
          <span>18 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Basic Formulas & Cell References: SUM, COUNT & Relative vs Absolute Math
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Every Excel formula begins with an equals sign (<code className="text-emerald-400">=</code>). The real power of spreadsheets lies in dynamic recalculation: when source data updates, formulas referencing those cells recalculate instantly.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Relative vs. Absolute vs. Mixed Cell References</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          When you drag or copy a formula across rows and columns, cell references shift by default. The dollar sign (<code className="text-amber-400">$</code>) acts as an anchor lock.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden font-mono">
            <thead className="bg-slate-900 text-slate-300 uppercase text-[11px] font-sans">
              <tr>
                <th className="p-3 border-b border-slate-800">Reference Type</th>
                <th className="p-3 border-b border-slate-800">Syntax</th>
                <th className="p-3 border-b border-slate-800">Behavior When Copied Right $\to$</th>
                <th className="p-3 border-b border-slate-800">Behavior When Copied Down $\downarrow$</th>
                <th className="p-3 border-b border-slate-800">Analytical Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-400 font-sans font-bold">Relative</td>
                <td className="p-3 text-cyan-300">A1</td>
                <td className="p-3 font-sans">Changes column (B1, C1...)</td>
                <td className="p-3 font-sans">Changes row (A2, A3...)</td>
                <td className="p-3 font-sans">Row-by-row transaction tax: <code className="text-emerald-300">=B2 * C2</code></td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-amber-400 font-sans font-bold">Absolute</td>
                <td className="p-3 text-amber-300">$A$1</td>
                <td className="p-3 font-sans">Locked strictly to $A$1</td>
                <td className="p-3 font-sans">Locked strictly to $A$1</td>
                <td className="p-3 font-sans">Fixed tax rate or global currency exchange cell</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-purple-400 font-sans font-bold">Mixed (Row Locked)</td>
                <td className="p-3 text-purple-300">A$1</td>
                <td className="p-3 font-sans">Changes column (B$1, C$1...)</td>
                <td className="p-3 font-sans">Row 1 remains locked</td>
                <td className="p-3 font-sans">Table header percentages across multiple columns</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-emerald-400 font-sans font-bold">Mixed (Column Locked)</td>
                <td className="p-3 text-emerald-300">$A1</td>
                <td className="p-3 font-sans">Column A remains locked</td>
                <td className="p-3 font-sans">Changes row ($A2, $A3...)</td>
                <td className="p-3 font-sans">Multi-metric forecast matrices</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. Aggregation Functions: COUNT vs COUNTA vs COUNTBLANK</h2>
        <CodeBlock
          filename="aggregations.xlsx"
          language="excel"
          code={`# SUM and AVERAGE (Ignores text cells automatically)
=SUM(D2:D5000)               # Total gross revenue across all transactions
=AVERAGE(D2:D5000)           # Mean basket value per order
=MIN(D2:D5000)               # Lowest single transaction value
=MAX(D2:D5000)               # Peak transaction value

# The COUNT Family:
=COUNT(A2:A5000)             # Counts ONLY cells containing pure numbers
=COUNTA(A2:A5000)            # Counts ALL non-empty cells (numbers, text, errors, formulas)
=COUNTBLANK(A2:A5000)        # Counts empty missing records (identifies NULL pipeline values)`}
        />

        <ExcelCalloutBox type="pro-tip" title="Cycle Reference Types with F4">
          When typing or editing a formula, press <code className="text-emerald-300">F4</code> while the cursor is touching a cell reference. It automatically cycles through: <code className="text-cyan-300">A1 $\to$ $A$1 $\to$ A$1 $\to$ $A1 $\to$ A1</code>.
        </ExcelCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 3: Logical Functions & Fraud Policy Engines
   ========================================================================= */
export const Chapter3Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <span>Chapter 03</span>
          <span>·</span>
          <span>Logical & Decision Engines</span>
          <span>·</span>
          <span>22 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Logical Functions & Policy Engines: IF, IFS, AND, OR & Fraud Scoring
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Logical functions evaluate condition statements to return targeted outcomes. In data analytics and risk engineering, logical pipelines automate high-stakes policies: classifying suspicious velocity spikes, triggering multi-factor authentication, or enforcing automated payout freezes.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Fraud Detection & Policy Enforcement Flowchart</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The diagram below models an automated transaction monitoring decision tree. High-risk velocity or score surges trigger an immediate <code className="text-rose-400">"AUTO_FREEZE"</code>, while high-dollar transactions without velocity flags route to <code className="text-amber-400">"MANUAL_REVIEW"</code>.
        </p>

        {/* Visual SVG Diagram */}
        <LogicalDecisionFlowDiagram />

        <h2 className="text-2xl font-bold text-white pt-4">2. Formula Deep Dive: Nested IF vs Modern IFS</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Legacy spreadsheets relied on deeply nested <code className="text-rose-400">IF(..., IF(..., IF(...)))</code> chains, which are error-prone and hard to audit. Modern Excel introduces <code className="text-emerald-400">IFS</code>, which evaluates conditions sequentially from left to right.
        </p>

        <CodeBlock
          filename="fraud_scoring_engine.xlsx"
          language="excel"
          code={`# Target Columns in Worksheet:
# Col A: Risk_Score (0 - 100)
# Col B: Hourly_Velocity (txns/hr)
# Col C: Amount_USD

# 1. High-Stakes Policy Enforcement via Modern IFS:
=IFS(
    OR(A2 >= 85, B2 > 10), "AUTO_FREEZE",
    AND(A2 >= 50, C2 > 5000), "MANUAL_REVIEW",
    A2 < 50, "SETTLED_OK",
    TRUE, "UNCLASSIFIED_AUDIT"
)

# 2. Defensive Error Handling with IFERROR:
# If customer risk tier lookup crashes due to missing data, fallback to "PENDING_KYC"
=IFERROR(VLOOKUP(D2, Risk_Tiers, 2, FALSE), "PENDING_KYC")`}
        />

        <ExcelCalloutBox type="fraud-alert" title="Always Provide a Catch-All in IFS">
          Unlike an IF statement which possesses a <code className="text-slate-300">value_if_false</code> fallback, an <code className="text-emerald-300">IFS</code> formula throws an ugly <code className="text-rose-400">#N/A</code> error if none of the test conditions evaluate to TRUE! Always finish your IFS chain with <code className="text-emerald-300">TRUE, "DEFAULT_VALUE"</code> to safely capture edge cases.
        </ExcelCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 4: Lookup & Reference Mastery
   ========================================================================= */
export const Chapter4Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <span>Chapter 04</span>
          <span>·</span>
          <span>Relational Lookups & References</span>
          <span>·</span>
          <span>25 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Lookup & Reference Mastery: VLOOKUP, XLOOKUP & INDEX + MATCH
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Relational joins are fundamental to data science. When joining customer transaction records with creator metadata or subscriber tier tables, analysts must select the right lookup mechanism based on performance, column orientation, and resilience.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Two-Step Relational Lookup Architecture</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The diagram below illustrates why <strong>INDEX + MATCH</strong> is superior to legacy VLOOKUP: MATCH isolates the row coordinate, and INDEX retrieves the value directly without requiring the lookup column to be on the far left.
        </p>

        {/* Visual SVG Diagram */}
        <IndexMatchDiagram />

        <h2 className="text-2xl font-bold text-white pt-4">2. Formula Comparison Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden font-mono">
            <thead className="bg-slate-900 text-slate-300 uppercase text-[11px] font-sans">
              <tr>
                <th className="p-3 border-b border-slate-800">Function</th>
                <th className="p-3 border-b border-slate-800">Formula Syntax</th>
                <th className="p-3 border-b border-slate-800">Can Look Left?</th>
                <th className="p-3 border-b border-slate-800">Breaks on Column Insert?</th>
                <th className="p-3 border-b border-slate-800">Exact Match Default?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-rose-400 font-sans font-bold">VLOOKUP</td>
                <td className="p-3 text-slate-300">=VLOOKUP(lookup, table, col_index, [range])</td>
                <td className="p-3 text-rose-400 font-sans">No (Right only)</td>
                <td className="p-3 text-rose-400 font-sans">Yes (Hardcoded index breaks)</td>
                <td className="p-3 text-rose-400 font-sans">No (Defaults to TRUE approx!)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-400 font-sans font-bold">INDEX + MATCH</td>
                <td className="p-3 text-slate-300">=INDEX(return_col, MATCH(val, lookup_col, 0))</td>
                <td className="p-3 text-emerald-400 font-sans">Yes (Any direction)</td>
                <td className="p-3 text-emerald-400 font-sans">No (Fully resilient)</td>
                <td className="p-3 text-emerald-400 font-sans">Yes (Set via 0 in MATCH)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-emerald-400 font-sans font-bold">XLOOKUP</td>
                <td className="p-3 text-slate-300">=XLOOKUP(val, lookup_col, return_col, [not_found])</td>
                <td className="p-3 text-emerald-400 font-sans">Yes (Any direction)</td>
                <td className="p-3 text-emerald-400 font-sans">No (Direct range binding)</td>
                <td className="p-3 text-emerald-400 font-sans">Yes (Exact match by default)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">3. Production Creator & Subscriber Lookup Pipeline</h2>
        <CodeBlock
          filename="subscriber_lookup.xlsx"
          language="excel"
          code={`# Target: Given a Subscriber_ID in Cell G2 ("SUB-94021"),
# find their monthly MRR contribution from Table "Subscribers":
# Col A: Creator_Channel_Name
# Col B: Subscriber_ID
# Col C: Plan_Tier
# Col D: Monthly_MRR_USD

# 1. Modern XLOOKUP Implementation with Built-in Fallback:
=XLOOKUP(G2, Subscribers[Subscriber_ID], Subscribers[Monthly_MRR_USD], "INVALID_SUBSCRIBER_KEY")

# 2. Resilient INDEX + MATCH Implementation:
=INDEX(Subscribers[Monthly_MRR_USD], MATCH(G2, Subscribers[Subscriber_ID], 0))

# 3. Two-Way Matrix Lookup (Dynamic Row & Dynamic Column):
# Finds a specific regional tax rate by State (Row) and Product Category (Column):
=INDEX(TaxMatrix, MATCH("California", TaxMatrix[State], 0), MATCH("SaaS_Software", TaxMatrix[Headers], 0))`}
        />

        <ExcelCalloutBox type="interview-tip" title="Interview Question: Why Did Microsoft Invent XLOOKUP?">
          <strong>The Perfect Senior Answer:</strong> VLOOKUP had three major engineering flaws:
          <ol className="list-decimal pl-5 mt-1 space-y-1 text-xs">
            <li>It defaults to approximate match (<code className="text-rose-300">TRUE</code>), causing catastrophic incorrect lookups if the 4th argument is omitted.</li>
            <li>It requires hardcoded column indices (e.g. <code className="text-rose-300">3</code>), meaning inserting or deleting a column silently breaks production dashboards.</li>
            <li>It cannot look left of the lookup column. XLOOKUP solves all three while incorporating native fallback handling (<code className="text-emerald-300">[if_not_found]</code>) and horizontal/vertical dual capability.</li>
          </ol>
        </ExcelCalloutBox>
      </div>
    </div>
  );
};
