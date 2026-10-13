import React from 'react';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { CalloutBox } from '../CalloutBox.tsx';
import { DashboardMockup } from '../diagrams/DashboardMockup.tsx';

export const Chapter13Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        Executive dashboard design requires rigorous spatial discipline. Learn how to structure report pages using the F-Pattern visual hierarchy, build interactive popup slicer panels using Bookmarks and the Selection Pane, and architect cross-page drill-throughs.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. The F-Pattern Layout Architecture
      </h2>
      <p>
        Eye-tracking research proves that executives scan analytical screens in an <strong>"F" or "Z" pattern</strong>:
      </p>
      <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-300">
        <li><strong>Top-Left &amp; Top Row:</strong> Primary business health indicators (High-level aggregated KPI Cards: Revenue, Gross Margin, Active Users).</li>
        <li><strong>Middle Section:</strong> Trends over time (Line/Area charts) and dimensional category comparisons (Bar charts).</li>
        <li><strong>Bottom Section:</strong> Granular operational detail, matrix grids, and anomaly tables.</li>
      </ul>

      {/* Code-Generated CSS Executive Dashboard Mockup */}
      <DashboardMockup />

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. Advanced Canvas Interactivity Features
      </h2>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-amber-400 font-bold font-mono text-sm">A. Bookmarks &amp; Selection Pane (Slide-out Filter Drawers)</h4>
          <p className="text-xs text-slate-300 mt-2">
            Instead of permanently cluttering 25% of your canvas with bulky slicer dropdowns, create a slide-out filter drawer! Use the <strong>Selection Pane</strong> to hide/show a background shape and slicers, and capture the two visual states with <strong>Bookmarks</strong>. Wire a hamburger icon button to toggle between them.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-cyan-400 font-bold font-mono text-sm">B. Report Page Tooltips</h4>
          <p className="text-xs text-slate-300 mt-2">
            Create a hidden report page sized as a Tooltip (e.g. 320x240 px). Set its page type to <em>Allow as Tooltip</em> and add a micro-chart (e.g., 6-month sales trend). Now, whenever an executive hovers over any product bar on the main page, a mini live trend chart dynamically renders inside the hover tooltip!
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-emerald-400 font-bold font-mono text-sm">C. Cross-Page Drill-Through</h4>
          <p className="text-xs text-slate-300 mt-2">
            Design a dedicated <em>"Customer Dossier"</em> page and drag <code className="text-emerald-300 font-mono">Dim_Customer[CustomerKey]</code> into the Drill-through wells. Users can right-click any customer name on a summary table and choose <em>Drill through ➔ Customer Dossier</em> to instantly navigate to a filtered breakdown of that customer's entire lifetime history.
          </p>
        </div>
      </div>
    </div>
  );
};

export const Chapter14Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        Enterprise data governance demands strict access control. When 5,000 regional managers access the exact same central dashboard, each manager must only see records for their designated territory.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. Static RLS vs. Dynamic RLS
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-rose-400 font-bold font-mono text-sm">Static Row-Level Security</h4>
          <p className="text-xs text-slate-300 mt-2">
            Hardcoded roles created in Desktop (e.g. "North America Role" where <code className="text-rose-300 font-mono">Dim_Store[Region] = "NA"</code>). In Power BI Service, administrators must manually assign individual user email addresses to each static role.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            <strong>Drawback:</strong> Unmanageable when a company has 100+ stores, regions, or frequent employee transfers.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-emerald-400 font-bold font-mono text-sm">Dynamic Row-Level Security (Enterprise Standard)</h4>
          <p className="text-xs text-slate-300 mt-2">
            A single security role that leverages DAX’s built-in <code className="text-emerald-300 font-mono">USERPRINCIPALNAME()</code> function to read the logged-in user’s Azure Active Directory (Entra ID) email address dynamically.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            <strong>Benefit:</strong> Zero manual role maintenance in Power BI Service. Access is driven entirely by a database permission table.
          </p>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. Implementing Dynamic RLS with Security Bridge Tables
      </h2>
      <ol className="list-decimal pl-6 space-y-2 text-xs sm:text-sm text-slate-300">
        <li>Create a security mapping table (<code className="text-amber-300 font-mono">UserSecurityMapping</code>) containing columns: <code className="text-cyan-300 font-mono">UserEmail</code> and <code className="text-cyan-300 font-mono">RegionKey</code>.</li>
        <li>Establish a relationship between <code className="text-amber-300 font-mono">UserSecurityMapping</code> and <code className="text-cyan-300 font-mono">Dim_Store</code> (with bi-directional or single filter propagation).</li>
        <li>In Power BI Desktop, click <em>Manage Roles</em>, create a single role called <strong>DynamicUserAccess</strong>, and add this DAX filter:</li>
      </ol>

      <CodeBlock
        language="dax"
        filename="Dynamic_RLS_Filter.dax"
        code={`// Filter applied to UserSecurityMapping table
[UserEmail] = USERPRINCIPALNAME()`}
      />

      <div className="space-y-2 pt-2">
        <h4 className="text-base font-bold text-white">How This Evaluates at Runtime:</h4>
        <p className="text-xs sm:text-sm text-slate-300">
          When <code className="text-amber-300 font-mono">sarah.manager@acme.com</code> logs into Power BI Service, <code className="text-emerald-400 font-mono">USERPRINCIPALNAME()</code> evaluates to her email. The table instantly filters down to rows where her email matches, which propagates down to <code className="text-cyan-300 font-mono">Fact_Sales</code>. All visuals on the canvas automatically filter to her assigned stores only!
        </p>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        3. Object-Level Security (OLS)
      </h2>
      <p>
        While RLS hides <em>rows</em> of data, <strong>Object-Level Security (OLS)</strong> hides entire <em>columns or tables</em>. For example, restricting human resources salary columns (<code className="text-rose-400 font-mono">Fact_Payroll[BaseSalary]</code>) so standard analysts cannot see that the column even exists.
      </p>
      <p>
        OLS is configured using external tooling such as <strong>Tabular Editor</strong> by connecting to the model via the XMLA endpoint and setting table/column permission metadata to <code className="text-amber-300 font-mono">None</code> for unauthorized security groups.
      </p>

      {/* Styled Comparison Table */}
      <div className="overflow-x-auto my-6 rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-slate-800 bg-slate-900 text-slate-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-3">Feature</th>
              <th className="p-3 text-cyan-400">Row-Level Security (RLS)</th>
              <th className="p-3 text-purple-400">Object-Level Security (OLS)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            <tr>
              <td className="p-3 font-semibold text-white">What it Hides</td>
              <td className="p-3 text-slate-300">Specific rows (records)</td>
              <td className="p-3 text-purple-300 font-bold">Entire columns or tables</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Authoring Tool</td>
              <td className="p-3 text-slate-300">Native Power BI Desktop</td>
              <td className="p-3 text-purple-300 font-bold">Tabular Editor (External Tool)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Visual Impact</td>
              <td className="p-3 text-slate-300">Visuals render with filtered data</td>
              <td className="p-3 text-rose-400">Visual errors if referencing hidden field</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Chapter15Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        Publishing a report is only half the battle. In an enterprise environment, reports must be refreshed automatically, governed with Application Lifecycle Management (ALM) pipelines, and securely distributed through Power BI Apps.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. Workspaces vs. Apps (The Golden Distribution Pattern)
      </h2>
      <p>
        <strong>Never share raw workspaces directly with business consumers!</strong>
      </p>
      <ul className="list-disc pl-6 space-y-2 text-slate-300 text-xs sm:text-sm">
        <li><strong>Workspaces:</strong> Collaborative engineering staging areas for developers (Admin, Member, Contributor roles). Developers test new measures and layout changes here.</li>
        <li><strong>Power BI Apps:</strong> Clean, packaged, read-only bundles published to the broader organization. Consumers cannot accidentally break reports or modify datasets.</li>
      </ul>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. Incremental Refresh (Managing Massive Datasets)
      </h2>
      <p>
        In models with hundreds of millions of rows, running a full dataset refresh every night is impossible (refresh timeouts and server crashes).
      </p>
      <p>
        <strong>Incremental Refresh</strong> splits your table into historical partitions:
      </p>
      <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-300">
        <li>Historical data (e.g. past 5 years) is archived once into immutable compressed partitions that are never touched again.</li>
        <li>Only the recent window (e.g. last 7 days) is refreshed nightly.</li>
        <li>Configured in Power Query using reserved parameters: <code className="text-amber-400 font-mono">RangeStart</code> and <code className="text-amber-400 font-mono">RangeEnd</code> (data type <code className="text-emerald-400 font-mono">DateTime</code>).</li>
      </ul>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        3. Deployment Pipelines (Dev ➔ Test ➔ Production ALM)
      </h2>
      <p>
        Power BI Premium supports multi-stage <strong>Deployment Pipelines</strong>:
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-center my-4">
        <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 w-full sm:w-auto flex-1">
          <span className="text-amber-400 font-bold block">1. DEVELOPMENT</span>
          <span className="text-slate-400 text-[10px]">Authoring &amp; Unit Tests</span>
        </div>
        <span className="text-slate-500 font-bold text-base">➔</span>
        <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 w-full sm:w-auto flex-1">
          <span className="text-cyan-400 font-bold block">2. TEST / QA</span>
          <span className="text-slate-400 text-[10px]">User Acceptance Testing</span>
        </div>
        <span className="text-slate-500 font-bold text-base">➔</span>
        <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 w-full sm:w-auto flex-1">
          <span className="text-emerald-400 font-bold block">3. PRODUCTION</span>
          <span className="text-slate-400 text-[10px]">Live Enterprise Consumers</span>
        </div>
      </div>
      <p className="text-xs text-slate-400">
        Deployment pipelines automatically swap connection parameters (e.g. pointing from Dev SQL to Prod SQL) during promotion with zero manual file manipulation!
      </p>
    </div>
  );
};

export const Chapter16Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        When an executive dashboard takes 20 seconds to load, users abandon the tool. Senior Power BI engineers distinguish themselves by mastering the <strong>Performance Analyzer</strong>, <strong>DAX Studio</strong>, and <strong>VertiPaq Memory Mechanics</strong>.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. Diagnosing Latency with Performance Analyzer
      </h2>
      <p>
        In Power BI Desktop, navigate to <em>View ➔ Performance Analyzer</em> and click <strong>Start Recording</strong>. Refresh visual elements to see the exact millisecond duration broken into three categories:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm text-slate-300">
        <li><strong>DAX Query (ms):</strong> The time taken by the VertiPaq formula engine to calculate the numbers. If this is high (&gt;200ms), your DAX formulas or data model are unoptimized.</li>
        <li><strong>Visual Display (ms):</strong> The time taken by the browser / WebView2 renderer to draw SVG chart bars and pixels. If this is high, you have too many visual cards on a single page!</li>
        <li><strong>Other (ms):</strong> Network waiting time, queueing, and cross-visual dependencies.</li>
      </ul>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. DAX Studio: Formula Engine (FE) vs. Storage Engine (SE)
      </h2>
      <p>
        Inside DAX Studio, connecting to your model and turning on <strong>Server Timings</strong> reveals the inner workings of query execution:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-emerald-400 font-bold font-mono text-sm">Storage Engine (SE) - VertiPaq</h4>
          <p className="text-xs text-slate-300 mt-2">
            Multi-threaded, hyper-compressed columnar memory scanner. Capable of scanning <strong>100 million rows per second</strong> across all CPU cores.
          </p>
          <span className="text-[10px] font-mono text-emerald-300 mt-2 block font-bold">Goal: &gt;90% of execution time in SE!</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-rose-400 font-bold font-mono text-sm">Formula Engine (FE)</h4>
          <p className="text-xs text-slate-300 mt-2">
            Single-threaded, interpreted evaluation engine. Handles complex logic, string manipulations, and conditional branching.
          </p>
          <span className="text-[10px] font-mono text-rose-300 mt-2 block font-bold">Bottleneck: High FE % indicates complex or un-foldable DAX!</span>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        3. The Top 7 Golden Rules of Model Optimization
      </h2>
      <div className="space-y-3 font-mono text-xs sm:text-sm">
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
          <span className="text-amber-400 font-bold shrink-0">01.</span>
          <span><strong>Remove High-Cardinality Columns:</strong> Drop unique GUIDs, detailed timestamps with seconds, and long text strings from Fact tables.</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
          <span className="text-amber-400 font-bold shrink-0">02.</span>
          <span><strong>Split DateTimes into Two Columns:</strong> Split a timestamp into one <code className="text-emerald-400">Date</code> column (365 distinct values/yr) and one <code className="text-cyan-400">Time</code> column (rounded to nearest minute). Reduces column cardinality by 99%!</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
          <span className="text-amber-400 font-bold shrink-0">03.</span>
          <span><strong>Eliminate Calculated Columns in Facts:</strong> Replace every calculated column in large Fact tables with a dynamic DAX measure or push the calculation back to SQL.</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
          <span className="text-amber-400 font-bold shrink-0">04.</span>
          <span><strong>Enforce Pure Star Schemas:</strong> Denormalize snowflake dimension tables to ensure all dimensions connect to facts in exactly 1 relationship hop.</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
          <span className="text-amber-400 font-bold shrink-0">05.</span>
          <span><strong>Limit Page Visual Density:</strong> Keep individual report pages under 15–20 visuals. Too many cards trigger visual queueing and browser canvas render stalls.</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
          <span className="text-amber-400 font-bold shrink-0">06.</span>
          <span><strong>Use DIVIDE Instead of '/' Operator:</strong> Always use <code className="text-amber-300">DIVIDE(Numerator, Denominator, 0)</code>. It handles divide-by-zero errors in the storage engine without throwing exceptions to the formula engine.</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
          <span className="text-amber-400 font-bold shrink-0">07.</span>
          <span><strong>Leverage User-Defined Aggregations (Agg Tables):</strong> For tables with billions of rows, build a pre-aggregated monthly summary table in RAM and let Power BI query folding seamlessly route queries to it!</span>
        </div>
      </div>
    </div>
  );
};
