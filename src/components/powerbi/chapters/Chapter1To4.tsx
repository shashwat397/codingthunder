import React from 'react';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { CalloutBox } from '../CalloutBox.tsx';
import { PowerBIEcosystemDiagram } from '../diagrams/PowerBIEcosystemDiagram.tsx';
import { PowerBIETLDiagram } from '../diagrams/PowerBIETLDiagram.tsx';

export const Chapter1Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        Welcome to the definitive, production-grade guide to Power BI. Whether you are transitioning from traditional spreadsheet modeling or preparing for senior business intelligence technical interviews, this course deconstructs Power BI down to its underlying memory mechanics and architectural principles.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. What is Business Intelligence?
      </h2>
      <p>
        Business Intelligence (BI) is the procedural and technical infrastructure that collects, stores, shapes, and analyzes data produced by a company’s operational activities. Historically, business intelligence was the exclusive domain of central IT teams who ran multi-month batch ETL jobs and handed static PDF reports to executives.
      </p>
      <p>
        Power BI represents the modern pinnacle of <strong>Self-Service Business Intelligence (SSBI)</strong>. It democratizes advanced data extraction, dimensional modeling, and interactive visual storytelling, allowing data professionals to build enterprise-scale analytical solutions directly from their workstations without waiting for backend engineering teams.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. The Evolution of Reporting: Flat Spreadsheets vs. Semantic Models
      </h2>
      <p>
        For decades, corporate reporting relied on Excel workbooks containing hundreds of columns and volatile formulas like <code className="text-amber-400 font-mono">VLOOKUP</code> or <code className="text-amber-400 font-mono">INDEX(MATCH)</code>. While spreadsheets are phenomenal for small ad-hoc scratchpads, they catastrophic fail when scaled to enterprise needs:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-slate-300">
        <li><strong>Formula Brittleness:</strong> A single accidental drag or row deletion breaks downstream calculations across linked sheets.</li>
        <li><strong>Row Limits & Memory Bloat:</strong> Excel’s 1,048,576 row cap crumbles in the face of modern e-commerce or IoT event streams.</li>
        <li><strong>Lack of Semantic Modeling:</strong> In a spreadsheet, business definitions (e.g. <em>"What constitutes Gross Margin?"</em>) are duplicated across dozens of sheets with divergent logic, creating conflicting reports.</li>
      </ul>

      <CalloutBox type="business-scenario" title="Real-World Production Business Scenario: Retailer Scale Crash">
        <p>
          A multinational retail chain attempted to analyze 24 million store POS transactions in Excel by splitting sales into 12 monthly workbooks. Aggregating YoY revenue required opening 12 files simultaneously, crashing analysts' laptops and taking 4 hours to calculate monthly KPIs.
        </p>
        <p className="pt-2 text-slate-300">
          By ingesting the same 24 million records into a Power BI Star Schema, the file compressed from 3.2 GB of raw CSVs down to a <strong>240 MB VertiPaq model</strong>, and queries that previously timed out now rendered in under <strong>45 milliseconds</strong>.
        </p>
      </CalloutBox>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        3. Why Power BI? VertiPaq Columnar Engine vs. Relational Row Engines
      </h2>
      <p>
        Traditional SQL databases (like Postgres or MySQL) store data on disk row-by-row (Row-Oriented OLTP). This is optimal for fetching a single customer profile by ID, but disastrous for analytics where an analyst asks: <em>"Calculate the average order value across 50 million sales."</em> A row engine must scan every single column of every row from disk.
      </p>
      <p>
        Power BI is powered by the <strong>VertiPaq In-Memory Columnar Database Engine</strong>. VertiPaq stores each column separately in compressed RAM memory. Because column values often repeat (e.g., millions of rows have only a few distinct values for <code className="text-cyan-400 font-mono">Country</code> or <code className="text-cyan-400 font-mono">ProductCategory</code>), VertiPaq achieves <strong>10x to 20x compression</strong> using dictionary encoding and Run Length Encoding (RLE).
      </p>

      {/* Styled Comparison Table */}
      <div className="overflow-x-auto my-6 rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-slate-800 bg-slate-900 text-slate-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-3">Feature</th>
              <th className="p-3">Microsoft Excel</th>
              <th className="p-3">Tableau</th>
              <th className="p-3 text-amber-400 font-bold">Microsoft Power BI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            <tr>
              <td className="p-3 font-semibold text-white">Data Capacity</td>
              <td className="p-3 text-rose-400">1.04M Rows (Hard limit)</td>
              <td className="p-3 text-slate-300">Millions via Hyper Engine</td>
              <td className="p-3 text-emerald-400 font-bold">Hundreds of Millions in RAM</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Data Modeling</td>
              <td className="p-3 text-slate-400">Basic Power Pivot</td>
              <td className="p-3 text-slate-300">Physical & Logical Layers</td>
              <td className="p-3 text-emerald-400 font-bold">Industry-leading Star Schema (DAX)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Calculation Language</td>
              <td className="p-3 text-slate-400">Excel Formulas</td>
              <td className="p-3 text-slate-300">Tableau Calcs / LODs</td>
              <td className="p-3 text-amber-400 font-bold">DAX (Context-driven) + M (ETL)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Licensing & Cost</td>
              <td className="p-3 text-slate-400">Included in Office 365</td>
              <td className="p-3 text-rose-400">High ($75+/user/mo)</td>
              <td className="p-3 text-emerald-400 font-bold">Desktop is 100% Free ($10/mo Pro)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Cloud Collaboration</td>
              <td className="p-3 text-slate-400">SharePoint / OneDrive</td>
              <td className="p-3 text-slate-300">Tableau Cloud / Server</td>
              <td className="p-3 text-emerald-400 font-bold">Power BI Service + Teams Native</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CalloutBox type="interview-tip" title="Interview Question: Report vs. Dashboard in Power BI">
        <p><strong>Question:</strong> What is the technical difference between a Power BI Report and a Power BI Dashboard?</p>
        <p className="pt-2"><strong>Model Answer:</strong> A <em>Report</em> is multi-page, created in Power BI Desktop or Service, connects to a single dataset, and supports rich interactive filtering, slicers, and cross-highlighting. A <em>Dashboard</em> is a single-page executive canvas created exclusively in Power BI Service that can pin tiles from multiple different reports, datasets, and SSRS paginated reports, but does not support local slicers.</p>
      </CalloutBox>

      <CalloutBox type="common-mistake" title="Common Mistake: Treating Power BI like an Enhanced Excel">
        <p>
          Do not build 100-column wide tables with dozens of calculated columns in Power BI. Power BI is not an export viewer for Excel; it is an aggregation and analytical engine. Storing unaggregated granular text strings or timestamps with seconds destroys VertiPaq compression.
        </p>
      </CalloutBox>
    </div>
  );
};

export const Chapter2Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        Power BI is not a single desktop application—it is an interconnected enterprise software suite. Understanding how data travels from local on-premises databases through the authoring layer and into cloud consumer workspaces is essential for passing system design interviews.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. The Five Core Ecosystem Components
      </h2>
      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-amber-400 font-bold font-mono text-sm">1. Power BI Desktop</h4>
          <p className="text-xs text-slate-300 mt-1">
            Free Windows application used by data analysts and BI engineers. This is where data extraction (Power Query M), data modeling (Star Schemas, relationships), business logic authoring (DAX measures), and visual canvas report design take place. Outputs a standalone <code className="text-amber-300 font-mono">.pbix</code> binary file.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-cyan-400 font-bold font-mono text-sm">2. Power BI Service (app.powerbi.com)</h4>
          <p className="text-xs text-slate-300 mt-1">
            Microsoft’s secure cloud SaaS platform hosted in Azure. This is where <code className="text-cyan-300 font-mono">.pbix</code> files are published, scheduled data refreshes are orchestrated, Row-Level Security (RLS) is validated, and reports are bundled into read-only consumer Apps.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-purple-400 font-bold font-mono text-sm">3. Power BI Mobile</h4>
          <p className="text-xs text-slate-300 mt-1">
            Native iOS and Android client applications allowing field managers and C-suite executives to view responsive mobile layouts, receive automated threshold notifications, and annotate metrics on mobile devices.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-emerald-400 font-bold font-mono text-sm">4. Power BI Report Server (PBIRS)</h4>
          <p className="text-xs text-slate-300 mt-1">
            An on-premises web portal for strict enterprise security policies (defense, healthcare, banking) where cloud hosting is prohibited. Allows hosting Power BI reports behind corporate firewalls on company hardware.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-yellow-400 font-bold font-mono text-sm">5. On-Premises Data Gateway</h4>
          <p className="text-xs text-slate-300 mt-1">
            A secure Windows background service installed on a local server that establishes an outbound encrypted TLS connection to Azure Service Bus. Allows cloud Power BI Service to query internal on-prem SQL databases without opening inbound ports in the corporate firewall.
          </p>
        </div>
      </div>

      {/* Code-Generated SVG Architecture Diagram */}
      <PowerBIEcosystemDiagram />

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. The Lifecycle of a Power BI Solution
      </h2>
      <p>
        Every production Power BI project follows an immutable 6-stage lifecycle:
      </p>
      <ol className="list-decimal pl-6 space-y-2 text-slate-300 font-mono text-xs sm:text-sm">
        <li><strong className="text-amber-400">Extract:</strong> Connecting to operational databases, lakehouses, or REST APIs.</li>
        <li><strong className="text-amber-400">Transform:</strong> Cleansing, pivoting, and casting dirty types using Power Query M.</li>
        <li><strong className="text-amber-400">Model:</strong> Establishing 1-to-Many Star Schema relationships and hiding foreign keys.</li>
        <li><strong className="text-amber-400">Calculate:</strong> Authoring dynamic DAX measures for KPIs, YTD variance, and margins.</li>
        <li><strong className="text-amber-400">Visualize:</strong> Laying out executive report canvases with drill-throughs and bookmarks.</li>
        <li><strong className="text-amber-400">Deploy & Govern:</strong> Publishing to Power BI Service, configuring scheduled refresh gateways, and assigning RLS roles.</li>
      </ol>

      <CalloutBox type="best-practice" title="Best Practice: Standard vs. Personal Data Gateway">
        <p>
          Never deploy a <em>Personal Gateway</em> for production business assets! Personal gateways shut down whenever the user’s individual laptop goes to sleep or changes networks. Always install the <strong>Standard On-Premises Data Gateway</strong> on an enterprise Windows Server VM with continuous uptime, high bandwidth, and multi-user administration.
        </p>
      </CalloutBox>
    </div>
  );
};

export const Chapter3Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        Choosing the wrong Storage Mode at the start of a project is the #1 cause of unfixable dashboard performance disasters. Understand the mechanical trade-offs between RAM caching, live query pass-through, and hybrid composite models.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. Deep Dive into the 4 Storage Modes
      </h2>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-emerald-400 font-bold font-mono text-sm">A. Import Mode (Default & Preferred)</h4>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Fastest DAX</span>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            In Import Mode, Power BI copies source data during refresh, compresses it into columnar structures, and loads it 100% into VertiPaq memory (RAM). When an end user clicks a slicer, the calculation executes against local RAM.
          </p>
          <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc pl-5">
            <li><strong>Pros:</strong> Lightning-fast DAX execution; all DAX functions fully supported; zero load on source database during user sessions.</li>
            <li><strong>Cons:</strong> Data is only as fresh as the last scheduled refresh; subject to dataset size limits (1GB on Pro, 100GB+ on Premium).</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-cyan-400 font-bold font-mono text-sm">B. DirectQuery Mode (Pass-Through SQL)</h4>
            <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">Zero RAM Storage</span>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Zero data is imported into Power BI memory. Only table metadata (column names and data types) is stored. Every single visual on a page generates a real-time native SQL query sent across the network to Snowflake, BigQuery, or SQL Server.
          </p>
          <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc pl-5">
            <li><strong>Pros:</strong> Guaranteed 100% real-time data freshness; handles petabyte-scale tables that exceed memory limits.</li>
            <li><strong>Cons:</strong> Report speed is at the mercy of source database latency; heavy concurrency slams database CPU; complex DAX functions (like certain Time Intelligence or iterators) are strictly prohibited.</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-purple-400 font-bold font-mono text-sm">C. Live Connection</h4>
            <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Enterprise SSAS / Fabric</span>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Used when connecting to an existing central corporate SQL Server Analysis Services (SSAS) Tabular model or an Azure Analysis Services / Power BI Semantic Model. In Live Connection, the entire data model, relationships, and measures exist externally; Power BI Desktop acts purely as a visualization canvas.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-amber-400 font-bold font-mono text-sm">D. Composite & Dual Storage Mode (Hybrid Architecture)</h4>
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Modern Lakehouse Pattern</span>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Allows mixing Import and DirectQuery tables in the exact same model. You leave a 500-million row transactional Fact table in DirectQuery, while setting Dimension tables (<code className="text-amber-300 font-mono">Dim_Customer</code>, <code className="text-amber-300 font-mono">Dim_Date</code>) to <strong>Dual Mode</strong> (cached in RAM for slicers, but queries can fold into DirectQuery joins without crossing boundary lines).
          </p>
        </div>
      </div>

      {/* Styled Comparison Table */}
      <div className="overflow-x-auto my-6 rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-slate-800 bg-slate-900 text-slate-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-3">Attribute</th>
              <th className="p-3">Import Mode</th>
              <th className="p-3">DirectQuery Mode</th>
              <th className="p-3">Live Connection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            <tr>
              <td className="p-3 font-semibold text-white">Data Storage</td>
              <td className="p-3 text-emerald-400">VertiPaq Memory (RAM)</td>
              <td className="p-3 text-cyan-400">Source Database (0 bytes PBI)</td>
              <td className="p-3 text-purple-400">External Tabular Model</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Query Latency</td>
              <td className="p-3 text-emerald-400 font-bold">Sub-second (&lt;50ms)</td>
              <td className="p-3 text-rose-400">Depends on DB (2s - 30s+)</td>
              <td className="p-3 text-emerald-400">Very Fast (SSAS cache)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Data Freshness</td>
              <td className="p-3 text-slate-300">As of Scheduled Refresh</td>
              <td className="p-3 text-cyan-400 font-bold">Real-time Live (Immediate)</td>
              <td className="p-3 text-slate-300">As of Source Model Refresh</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">DAX Language Support</td>
              <td className="p-3 text-emerald-400 font-bold">100% of DAX Library</td>
              <td className="p-3 text-rose-400">Limited (Translatable to SQL)</td>
              <td className="p-3 text-purple-400">Report-level measures only</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Source DB Workload</td>
              <td className="p-3 text-emerald-400 font-bold">Only during scheduled refresh</td>
              <td className="p-3 text-rose-400 font-bold">High (Every user interaction)</td>
              <td className="p-3 text-slate-300">Offloaded to SSAS Server</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CalloutBox type="interview-tip" title="Interview Question: When Should You NOT Use DirectQuery?">
        <p><strong>Question:</strong> An executive says, <em>'We want all reports to use DirectQuery so data is always live.'</em> How do you respond?</p>
        <p className="pt-2"><strong>Model Answer:</strong> You should caution against blanket DirectQuery usage. DirectQuery introduces latency on every filter click, disables many high-performance DAX functions (like advanced time intelligence), and can overwhelm the production database with thousands of ad-hoc queries when multiple users access the dashboard simultaneously. Unless business regulations strictly demand sub-minute live data or dataset volume exceeds billions of rows, <strong>Import Mode with scheduled hourly refresh or Incremental Refresh</strong> delivers infinitely superior user experience.</p>
      </CalloutBox>
    </div>
  );
};

export const Chapter4Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        Power Query is the data preparation workhorse of Power BI. Built upon Microsoft’s functional <strong>M Language</strong>, it cleans, normalizes, and reshapes raw transactional data before it enters your data model.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. The Architecture of Query Folding
      </h2>
      <p>
        <strong>Query Folding</strong> is the process where Power Query transforms your UI clicks (e.g. Filter Rows, Group By, Join Tables) into a single optimized native SQL statement that executes inside the source database engine, rather than downloading millions of rows over the network to transform locally.
      </p>

      {/* Code-Generated ETL Diagram */}
      <PowerBIETLDiagram />

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. Essential Transformation Patterns in M Code
      </h2>
      <p>
        Below is a production M script demonstrating high-performance ETL for an e-commerce data pipeline:
      </p>

      <CodeBlock
        language="powerquery"
        filename="ETL_FactOrders_Cleanse.pq"
        code={`let
    // 1. Establish source connection to SQL Server
    Source = Sql.Database("thunder-dw-prod.database.windows.net", "ThunderAnalytics", [CreateNavigationProperties=false]),
    dbo_Orders = Source{[Schema="dbo",Item="RawOrderStream"]}[Data],

    // 2. Filter rows at source (Query Folding preserved!)
    #"Filtered Recent Years" = Table.SelectRows(dbo_Orders, each [OrderYear] >= 2024 and [IsTestOrder] = false),

    // 3. Remove unnecessary high-cardinality tracking hashes
    #"Removed Bloat Columns" = Table.RemoveColumns(#"Filtered Recent Years", {"SessionGuid", "IpAddress", "InternalDebugPayload"}),

    // 4. Strict Type Coercion (Critical for VertiPaq compression)
    #"Changed Types" = Table.TransformColumnTypes(#"Removed Bloat Columns",{
        {"OrderID", Int64.Type},
        {"CustomerID", Int64.Type},
        {"OrderDate", type date},
        {"OrderAmount", Currency.Type},
        {"DiscountPercent", Percentage.Type}
    }),

    // 5. Replace Null discounts with 0 to prevent downstream DAX BLANK contagion
    #"Replaced Nulls" = Table.ReplaceValue(#"Changed Types", null, 0, Replacer.ReplaceValue, {"DiscountPercent"}),

    // 6. Unpivot other columns to normalize wide cross-tab metrics into tabular schema
    #"Unpivoted Attributes" = Table.UnpivotOtherColumns(#"Replaced Nulls", {"OrderID", "CustomerID", "OrderDate", "OrderAmount"}, "MetricName", "MetricValue")
in
    #"Unpivoted Attributes"`}
      />

      <div className="space-y-3 pt-2">
        <h4 className="text-base font-bold text-white">How this M Code Evaluates:</h4>
        <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-300">
          <li><strong>Step 1 & 2:</strong> Connects to SQL and pushes down the <code className="text-amber-300 font-mono">WHERE OrderYear &gt;= 2024</code> predicate directly to the database. Only relevant records travel across the network.</li>
          <li><strong>Step 3:</strong> Drops <code className="text-rose-400 font-mono">SessionGuid</code>. Dropping unique string GUIDs reduces RAM footprint by up to <strong>70%</strong>!</li>
          <li><strong>Step 4:</strong> Converts date-time values into pure <code className="text-emerald-300 font-mono">type date</code>. Stripping the timestamp removes 86,400 distinct daily values down to 1 distinct value per day, vastly accelerating VertiPaq dictionary compression.</li>
          <li><strong>Step 6:</strong> <code className="text-cyan-300 font-mono">Table.UnpivotOtherColumns</code> transforms wide spreadsheet columns into a tall, relational key-value schema.</li>
        </ul>
      </div>

      <CalloutBox type="common-mistake" title="Common Mistake: The Transformations that Break Query Folding">
        <p>
          Certain M transformations immediately break query folding: adding index columns (<code className="text-rose-400 font-mono">Table.AddIndexColumn</code>), calling custom M functions across rows, or referencing local files. Once folding breaks, all subsequent steps execute locally on the analyst’s machine, forcing Power BI to download the entire un-filtered table over the network.
        </p>
      </CalloutBox>
    </div>
  );
};
