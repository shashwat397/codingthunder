import React from 'react';
import { ExcelCalloutBox } from '../ExcelCalloutBox.tsx';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { PowerQueryWorkflowDiagram } from '../diagrams/PowerQueryWorkflowDiagram.tsx';

/* =========================================================================
   CHAPTER 9: Advanced Excel: Dynamic Arrays, LET & LAMBDA
   ========================================================================= */
export const Chapter9Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <span>Chapter 09</span>
          <span>·</span>
          <span>Modern Dynamic Arrays & Lambda</span>
          <span>·</span>
          <span>26 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Advanced Excel: Dynamic Arrays (FILTER, SORT, UNIQUE), LET & Custom LAMBDA
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          The introduction of the <strong>Calculation Spill Engine</strong> in Excel 365 fundamentally transformed spreadsheet programming. A single formula typed in a single cell can now return a dynamic 2D array that automatically spills into neighboring rows and columns.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Modern Dynamic Array Functions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <span className="font-mono text-emerald-400 font-bold block mb-1">FILTER(array, include, [empty])</span>
            Extracts records satisfying one or more boolean criteria without manual filtering or VBA scripts.
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <span className="font-mono text-cyan-400 font-bold block mb-1">UNIQUE(array, [by_col], [exact_once])</span>
            Extracts a deduplicated list of distinct entries directly from raw transaction columns in O(N) time.
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <span className="font-mono text-amber-400 font-bold block mb-1">SORT(array, [sort_index], [order])</span>
            Sorts spilled or table ranges dynamically by any column in ascending (1) or descending (-1) order.
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. The LET & Custom LAMBDA Engine</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The <code className="text-cyan-300">LET</code> function introduces intermediate variable declarations inside formulas, speeding up calculation times by eliminating redundant nested calls. <code className="text-purple-300">LAMBDA</code> allows you to create custom, reusable functions directly within Excel without VBA!
        </p>

        <CodeBlock
          filename="dynamic_arrays_and_lambda.xlsx"
          language="excel"
          code={`# 1. Combining FILTER, UNIQUE & SORT into a 1-Line Reporting Pipeline:
# Extracts and sorts all unique Macro-Partner creators with active payouts:
=SORT(
    FILTER(Creators[Channel_Name], (Creators[Tier]="Macro") * (Creators[Status]="Active"), "NO_CHANNELS"),
    1, 1
)

# 2. Performance Optimization with LET:
# Calculates Net Commission after tiered operational deductions:
=LET(
    gross_payout, B2 * C2,
    tax_rate, IF(gross_payout > 10000, 0.28, 0.18),
    platform_fee, gross_payout * 0.05,
    gross_payout - (gross_payout * tax_rate) - platform_fee
)

# 3. Defining a Custom Reusable Function with LAMBDA (Stored in Name Manager):
# Name: CALCULATE_FRAUD_RISK(score, velocity, amount)
=LAMBDA(s, v, a,
    IFS(
        OR(s >= 85, v > 10), "FREEZE",
        AND(s >= 50, a > 5000), "REVIEW",
        TRUE, "CLEAR"
    )
)
# Invocation on Worksheet:
=CALCULATE_FRAUD_RISK(A2, B2, C2)`}
        />

        <ExcelCalloutBox type="pro-tip" title="The Spill Reference Operator (#)">
          When a dynamic formula spills from cell <code className="text-emerald-300">F2</code> down to <code className="text-emerald-300">F45</code>, you don't need to write <code className="text-slate-400">SUM(F2:F45)</code>. Simply type <code className="text-emerald-300">=SUM(F2#)</code>! The hash sign (<code className="text-amber-300">#</code>) tells Excel to dynamically adapt to the exact boundary of the spilled range, expanding and contracting automatically as source data changes.
        </ExcelCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 10: Automation & Power Query
   ========================================================================= */
export const Chapter10Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <span>Chapter 10</span>
          <span>·</span>
          <span>Automation & Power Query</span>
          <span>·</span>
          <span>28 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Automation & Productivity: Power Query ETL, Macros & Keyboard Shortcuts
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Senior data analysts never perform repetitive data munging by hand. Power Query (the M Engine) provides an industrial Extract, Transform, Load (ETL) pipeline that records every data cleansing step into a reproducible, 1-click refreshable script.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Power Query End-to-End Workflow Diagram</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The diagram below models the complete ETL pipeline: extracting dirty CSV logs, database tables, and folder dumps, passing them through the M Mashup engine for unpivoting and cleansing, and loading the result into the Power Pivot data model.
        </p>

        {/* Visual SVG Diagram */}
        <PowerQueryWorkflowDiagram />

        <h2 className="text-2xl font-bold text-white pt-4">2. Unpivoting Columns: The Most Powerful Feature in Power Query</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Databases expect tall, normalized tables, but humans love wide summary tables (with months like Jan, Feb, Mar, Apr as separate column headers). In Power Query, select the identifier columns $\to$ right-click $\to$ <strong>Unpivot Other Columns</strong>. Power Query instantly transforms 50 columns into two standardized columns: <code className="text-cyan-300">Attribute (Month)</code> and <code className="text-emerald-300">Value (Amount)</code>!
        </p>

        <h2 className="text-2xl font-bold text-white pt-4">3. VBA Subroutines & Macro Recording</h2>
        <CodeBlock
          filename="automated_cleanup_macro.bas"
          language="vb"
          code={`' Standard Production VBA Module: Automated Batch Sheet Export
Sub ExportHighRiskFraudReport()
    Dim ws As Worksheet
    Dim lastRow As Long
    
    Set ws = ThisWorkbook.Sheets("Fraud_Transactions")
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    ' Apply autofilter for all AUTO_FREEZE status rows
    ws.Range("A1:G" & lastRow).AutoFilter Field:=7, Criteria1:="AUTO_FREEZE"
    
    ' Copy visible records to audit sheet
    ws.Range("A1:G" & lastRow).SpecialCells(xlCellTypeVisible).Copy
    Sheets.Add(After:=Sheets(Sheets.Count)).Name = "SecOps_Audit_" & Format(Now, "YYYYMMDD")
    ActiveSheet.Paste
    
    MsgBox "SecOps Audit Report Generated Successfully!", vbInformation, "Risk Engine"
End Sub`}
        />

        <ExcelCalloutBox type="best-practice" title="Power Query Over VBA for Data Cleansing">
          Never write complex VBA macros to clean and combine messy files! VBA is fragile, difficult to debug, and requires Macro-Enabled (<code className="text-rose-400">.xlsm</code>) workbooks that trigger enterprise cybersecurity warnings. <strong>Power Query</strong> is built natively into standard <code className="text-emerald-300">.xlsx</code> files, handles multi-million row datasets through streaming, and requires zero code to configure.
        </ExcelCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 11: Ultimate Cheat Sheet & Technical Interview Guide
   ========================================================================= */
export const Chapter11Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <span>Chapter 11</span>
          <span>·</span>
          <span>Mastery & Interview Guide</span>
          <span>·</span>
          <span>30 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ultimate Excel Formula Cheat Sheet & Scenario-Based Interview Guide
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          The definitive desk reference formula catalog and 10 high-stakes scenario interview questions with detailed model solutions covering fraud analytics, subscriber buckets, and pipeline scalability.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Master Multi-Part Formula Reference Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden font-mono">
            <thead className="bg-slate-900 text-slate-300 uppercase text-[11px] font-sans">
              <tr>
                <th className="p-3 border-b border-slate-800">Category</th>
                <th className="p-3 border-b border-slate-800">Formula Syntax</th>
                <th className="p-3 border-b border-slate-800">Analytical Objective</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-emerald-400 font-sans font-bold" rowSpan={2}>Conditional Math</td>
                <td className="p-3 text-cyan-300">=SUMIFS(sum_range, crit_rng1, crit1, ...)</td>
                <td className="p-3 font-sans">Sum gross volume matching multiple criteria (e.g., Region="US" &amp; Status="Active")</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-300">=COUNTIFS(crit_rng1, crit1, crit_rng2, crit2)</td>
                <td className="p-3 font-sans">Count incidents meeting velocity and risk thresholds</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-400 font-sans font-bold" rowSpan={2}>Modern Lookups</td>
                <td className="p-3 text-cyan-300">=XLOOKUP(val, lookup_rng, return_rng, not_found)</td>
                <td className="p-3 font-sans">Universal exact lookup in any direction with built-in missing key fallback</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-300">=INDEX(col, MATCH(val, key_col, 0))</td>
                <td className="p-3 font-sans">Resilient lookup compatible across all legacy Excel versions</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-amber-400 font-sans font-bold" rowSpan={2}>Dynamic Arrays</td>
                <td className="p-3 text-cyan-300">=FILTER(tbl, condition, [empty])</td>
                <td className="p-3 font-sans">Dynamically extract rows into a spilled table based on logical condition</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-300">=UNIQUE(column)</td>
                <td className="p-3 font-sans">Deduplicate list of values on-the-fly</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-purple-400 font-sans font-bold" rowSpan={2}>Dates & SLAs</td>
                <td className="p-3 text-cyan-300">=NETWORKDAYS(start, end, [holidays])</td>
                <td className="p-3 font-sans">Calculate net business working days between two dates</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-300">=EOMONTH(date, months)</td>
                <td className="p-3 font-sans">Project billing cycle and financial close deadlines</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. High-Stakes Senior Data Analyst Interview Questions</h2>

        {/* Q1 */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-emerald-400 font-bold uppercase">Scenario 01 · Data Modeling</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">Senior Analyst Tier</span>
          </div>
          <h3 className="text-base font-bold text-white">How do you resolve a #SPILL! error in modern Excel?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Model Answer:</strong> A <code className="text-rose-400">#SPILL!</code> error occurs when a dynamic array formula (such as <code className="text-cyan-300">FILTER</code> or <code className="text-cyan-300">UNIQUE</code>) attempts to output multiple results into adjacent cells, but one or more cells in the anticipated output boundary are blocked by existing data, text, or merged cells. To resolve it, select the cell displaying <code className="text-rose-400">#SPILL!</code> to reveal the dotted dashed bounding border, and clear any obstructing values or unmerge the cells in that range.
          </p>
        </div>

        {/* Q2 */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-cyan-400 font-bold uppercase">Scenario 02 · Performance Tuning</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">Senior Analyst Tier</span>
          </div>
          <h3 className="text-base font-bold text-white">What causes Excel workbooks to lag and how do you optimize calculation speeds?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Model Answer:</strong> Three primary culprits degrade workbook performance:
            1. <strong>Volatile Functions:</strong> Excessive use of <code className="text-rose-400">OFFSET, INDIRECT, TODAY, NOW</code>, which force whole-workbook recalculations on every interaction.
            2. <strong>Whole-Column References in Array Math:</strong> Writing formulas like <code className="text-rose-400">=SUMPRODUCT(A:A, B:B)</code> forces Excel to iterate over all 1,048,576 rows. Use structured Table references (<code className="text-emerald-300">Table[Sales]</code>) instead.
            3. <strong>Phantom Formatting:</strong> Cells with borders or colors extending to row 1,000,000 inflate the file size. Use <code className="text-cyan-300">Ctrl + End</code> to locate the used range and delete empty trailing rows.
          </p>
        </div>

        {/* Q3 */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-amber-400 font-bold uppercase">Scenario 03 · Pipeline Automation</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">Senior Analyst Tier</span>
          </div>
          <h3 className="text-base font-bold text-white">How do you automate monthly CSV file consolidation with varying column order?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Model Answer:</strong> Use <strong>Power Query (Get Data $\to$ From Folder)</strong>. Instead of writing VBA macros that assume fixed column coordinates, Power Query matches columns by exact header names. If Month 2 swaps the order of "Amount" and "Customer_ID", Power Query aligns them correctly based on column metadata. Furthermore, adding new monthly CSVs to the folder updates the entire consolidated dataset via a single <em>Data $\to$ Refresh All</em> click.
          </p>
        </div>

        <ExcelCalloutBox type="pro-tip" title="Congratulations!">
          You have mastered the complete Excel analytical suite: from cell references and fraud detection policy engines to modern dynamic arrays, Power Query M modeling, and senior interview architectures.
        </ExcelCalloutBox>
      </div>
    </div>
  );
};
