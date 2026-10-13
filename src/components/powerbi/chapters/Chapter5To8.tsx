import React from 'react';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { CalloutBox } from '../CalloutBox.tsx';
import { StarVsSnowflakeDiagram } from '../diagrams/StarVsSnowflakeDiagram.tsx';

export const Chapter5Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        Data Modeling is the soul of Power BI. No amount of brilliant visual design or clever DAX formulas can save a dashboard built on an unstable or flawed data model. The golden rule: <strong>Always build a Star Schema</strong>.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. Facts vs. Dimensions (Kimball Methodology)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-amber-400 font-bold font-mono text-sm">Fact Tables (Transactional Measurements)</h4>
          <p className="text-xs text-slate-300 mt-2">
            Narrow, tall tables containing numeric measurements representing business events at a specific point in time: <code className="text-amber-300 font-mono">Fact_Sales</code>, <code className="text-amber-300 font-mono">Fact_InventoryBalance</code>, <code className="text-amber-300 font-mono">Fact_TelemetryEvents</code>.
          </p>
          <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc pl-5">
            <li>Millions or billions of rows.</li>
            <li>Contains additive numbers (<code className="text-emerald-400 font-mono">SalesAmount</code>, <code className="text-emerald-400 font-mono">Quantity</code>, <code className="text-emerald-400 font-mono">Discount</code>).</li>
            <li>Contains Foreign Keys (<code className="text-cyan-400 font-mono">CustomerKey</code>, <code className="text-cyan-400 font-mono">DateKey</code>, <code className="text-cyan-400 font-mono">ProductKey</code>).</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-cyan-400 font-bold font-mono text-sm">Dimension Tables (Descriptive Context)</h4>
          <p className="text-xs text-slate-300 mt-2">
            Wide, shorter tables containing descriptive attributes that give meaning, context, and filtering slices to facts: <code className="text-cyan-300 font-mono">Dim_Customer</code>, <code className="text-cyan-300 font-mono">Dim_Product</code>, <code className="text-cyan-300 font-mono">Dim_Date</code>.
          </p>
          <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc pl-5">
            <li>Answers the <em>Who, What, Where, When, and Why</em>.</li>
            <li>Contains unique Primary Keys (e.g. <code className="text-cyan-300 font-mono">CustomerKey</code> on the 1-side).</li>
            <li>Used as axes, slicers, and legend categories in reports.</li>
          </ul>
        </div>
      </div>

      {/* Code-Generated Star vs Snowflake Diagram */}
      <StarVsSnowflakeDiagram />

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. Star Schema vs. Snowflake Schema
      </h2>
      <p>
        In relational OLTP systems (application backends), database designers normalize schemas into 3rd Normal Form (3NF) to eliminate data redundancy. This produces a <strong>Snowflake Schema</strong> where categories, subcategories, and products reside in separate tables.
      </p>
      <p>
        However, in Power BI, normalizing dimensions is an <strong>anti-pattern</strong>! Every extra relationship hop requires VertiPaq to evaluate cross-table hash joins during DAX calculation, degrading visual render times. In Star Schema, dimensions are deliberately denormalized into single tables:
      </p>

      {/* Styled Comparison Table */}
      <div className="overflow-x-auto my-6 rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-slate-800 bg-slate-900 text-slate-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-3">Attribute</th>
              <th className="p-3 text-emerald-400">Star Schema (Recommended)</th>
              <th className="p-3 text-rose-400">Snowflake Schema</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            <tr>
              <td className="p-3 font-semibold text-white">Relationship Hops</td>
              <td className="p-3 text-emerald-400 font-bold">1-Hop Direct to Fact</td>
              <td className="p-3 text-rose-400">2 to 4+ chained hops</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">VertiPaq Performance</td>
              <td className="p-3 text-emerald-400 font-bold">Maximum compression & speed</td>
              <td className="p-3 text-slate-400">Degraded (Multiple hash lookups)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">DAX Formula Complexity</td>
              <td className="p-3 text-emerald-400 font-bold">Simple, natural context flow</td>
              <td className="p-3 text-rose-400">Complex, requires RELATEDTABLE</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Report Author Usability</td>
              <td className="p-3 text-emerald-400 font-bold">Clean field list (Few tables)</td>
              <td className="p-3 text-slate-400">Cluttered with dozens of micro-tables</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CalloutBox type="best-practice" title="Best Practice: Hide Foreign Keys from Report View">
        <p>
          Always right-click and select <strong>Hide in Report View</strong> for every Foreign Key column inside your Fact table (e.g. <code className="text-amber-300 font-mono">Fact_Sales[CustomerKey]</code>). Report authors should only ever slice by the clean attributes in the Dimension table (<code className="text-cyan-300 font-mono">Dim_Customer[CustomerName]</code>). Hiding foreign keys prevents confusing duplicate fields and accidental cartesian calculations!
        </p>
      </CalloutBox>
    </div>
  );
};

export const Chapter6Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        Relationships govern how filter context propagates across tables when a user interacts with a dashboard. Configuring cardinality and cross-filter direction properly prevents ambiguous calculation paths and incorrect financial totals.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. Cardinality Types
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-slate-300">
        <li>
          <strong className="text-emerald-400 font-mono">One-to-Many (1:*)</strong>: The standard relationship in a Star Schema. The primary key in the Dimension table contains exactly one distinct instance of each ID; the Fact table contains multiple purchases for that ID.
        </li>
        <li>
          <strong className="text-cyan-400 font-mono">One-to-One (1:1)</strong>: Both tables share unique matching keys. Almost always an indicator that the two tables should be merged into a single table during ETL.
        </li>
        <li>
          <strong className="text-rose-400 font-mono">Many-to-Many (*:*)</strong>: Neither table has unique keys. Power BI allows this natively using weak relationships, but it risks non-deterministic totals and high memory utilization. Best resolved via an explicit Bridge Dimension table.
        </li>
      </ul>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. Cross-Filter Direction: Single vs. Both (Bi-Directional)
      </h2>
      <p>
        In a <strong>Single Direction</strong> relationship, filters only flow downhill from the 1-side (Dimension) to the *-side (Fact). If you filter a slicer on <code className="text-cyan-300 font-mono">Dim_Customer[Country] = "Germany"</code>, the filter flows into <code className="text-amber-300 font-mono">Fact_Sales</code>, returning German orders.
      </p>
      <p>
        In <strong>Both (Bi-Directional)</strong>, filtering <code className="text-amber-300 font-mono">Fact_Sales</code> also filters backwards into other dimension tables. While occasionally tempting to filter slicer lists, bi-directional filtering introduces <strong>ambiguous calculation loops</strong> where Power BI cannot determine the mathematical lineage of a calculation.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        3. Active vs. Inactive Relationships & USERELATIONSHIP
      </h2>
      <p>
        Between any two tables, there can be multiple physical relationships, but <strong>only ONE active relationship</strong> at any given time.
      </p>
      <p>
        Consider an e-commerce order table with three date columns: <code className="text-cyan-300 font-mono">OrderDate</code>, <code className="text-cyan-300 font-mono">ShipDate</code>, and <code className="text-cyan-300 font-mono">DeliveryDate</code>. All three connect to <code className="text-amber-300 font-mono">Dim_Date[DateKey]</code>. The relationship on <code className="text-cyan-300 font-mono">OrderDate</code> is set to Active (solid line); the other two are Inactive (dashed lines).
      </p>
      <p>
        To compute sales filtered by the shipment date, you activate the inactive relationship dynamically inside your DAX measure using <code className="text-amber-400 font-mono">USERELATIONSHIP()</code>:
      </p>

      <CodeBlock
        language="dax"
        filename="Sales_By_ShipDate.dax"
        code={`// Measure: Total Sales based on Shipped Date
[Sales by Ship Date] = 
CALCULATE(
    [Total Sales],
    USERELATIONSHIP(Fact_Sales[ShipDateKey], Dim_Date[DateKey])
)`}
      />

      <div className="space-y-2 pt-2">
        <h4 className="text-base font-bold text-white">How This Formula Evaluates:</h4>
        <ol className="list-decimal pl-6 space-y-1.5 text-xs sm:text-sm text-slate-300">
          <li>The visual slicer filters <code className="text-amber-300 font-mono">Dim_Date[Year] = 2026</code>.</li>
          <li>Normally, this filter travels through the active relationship to filter <code className="text-cyan-300 font-mono">Fact_Sales[OrderDateKey]</code>.</li>
          <li><code className="text-amber-400 font-mono">USERELATIONSHIP</code> temporarily disables the active relationship for the duration of this calculation only and activates the connection to <code className="text-cyan-300 font-mono">Fact_Sales[ShipDateKey]</code>.</li>
          <li>The calculation returns revenue for orders shipped in 2026, regardless of when they were originally ordered.</li>
        </ol>
      </div>

      <CalloutBox type="interview-tip" title="Interview Question: Why Avoid Bi-Directional Cross-Filtering?">
        <p><strong>Question:</strong> What are the top three reasons to avoid bi-directional cross-filtering in an enterprise model?</p>
        <p className="pt-2"><strong>Model Answer:</strong> 1) <em>Performance degradation:</em> Every query must evaluate table joins in both directions, exponentially expanding the filter space. 2) <em>Ambiguity:</em> In complex multi-fact models, bi-directional relationships create circular filter loops where the formula engine cannot resolve a single deterministic query plan. 3) <em>Unintended filter propagation:</em> Slicing on one visual unexpectedly filters dimensions in unrelated visuals, producing unexpected totals.</p>
      </CalloutBox>
    </div>
  );
};

export const Chapter7Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        DAX (Data Analysis Expressions) is the formula language that drives all analytical calculations in Power BI. Unlike Excel, which references static grid coordinates like <code className="text-amber-400 font-mono">A1:B20</code>, DAX evaluates dynamically over <strong>tables, columns, and evaluation contexts</strong>.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. Calculated Columns vs. Measures: The Fundamental Divide
      </h2>
      <p>
        Confusing Calculated Columns with Measures is the single most common mistake made by beginners transitioning from Excel.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-rose-400 font-bold font-mono text-sm">Calculated Columns (Stored in RAM)</h4>
          <p className="text-xs text-slate-300 mt-2">
            Computed <strong>row-by-row during dataset refresh</strong>. The calculated value is physically written to disk and loaded into RAM for every single row in the table.
          </p>
          <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc pl-5">
            <li>Evaluated once at data refresh time.</li>
            <li>Creates inherent <strong>Row Context</strong>.</li>
            <li>Permanently increases RAM consumption and <code className="text-rose-300 font-mono">.pbix</code> file size.</li>
            <li>Cannot react dynamically to visual slicers or user interactions.</li>
            <li><strong>Use ONLY for:</strong> Slicer attributes, chart axis labels, or row classifications (e.g. Age Group, Product Tier).</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-emerald-400 font-bold font-mono text-sm">Measures (Calculated Dynamically on CPU)</h4>
          <p className="text-xs text-slate-300 mt-2">
            Computed <strong>dynamically at query time</strong> on-the-fly whenever a user interacts with a visual or clicks a slicer.
          </p>
          <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc pl-5">
            <li>Consumes <strong>0 bytes of RAM storage</strong>.</li>
            <li>Evaluated in <strong>Filter Context</strong>.</li>
            <li>Reacts instantly to any slicer, filter, or matrix row/column coordinate.</li>
            <li>CPU-bound calculation.</li>
            <li><strong>Use for:</strong> 99% of all numeric aggregations, percentages, ratios, margins, and KPIs.</li>
          </ul>
        </div>
      </div>

      <CalloutBox type="best-practice" title="The Golden Rule of DAX Modeling">
        <p className="text-base font-semibold text-emerald-300">
          "If a calculation can be written as a Measure, NEVER write it as a Calculated Column."
        </p>
        <p className="pt-2 text-slate-300">
          Adding a calculated column with high cardinality (like a string calculation) across 20 million rows can add 500 MB to your model’s memory footprint. A measure calculating the same metric adds exactly 0 bytes.
        </p>
      </CalloutBox>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. The Two Evaluation Contexts: Row Context vs. Filter Context
      </h2>
      <p>
        Every DAX formula evaluates inside one or both of these two distinct environments:
      </p>

      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-amber-400 font-bold font-mono text-sm">A. Row Context ("Which row am I on?")</h4>
          <p className="text-xs text-slate-300 mt-1">
            Row Context exists whenever an expression evaluates row-by-row. It is native inside calculated columns and iterator functions (like <code className="text-amber-300 font-mono">SUMX</code>). In Row Context, DAX knows the values of all columns in the <em>current row</em>, but it knows nothing about the rest of the table and cannot filter other tables.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-cyan-400 font-bold font-mono text-sm">B. Filter Context ("What subset of data is visible?")</h4>
          <p className="text-xs text-slate-300 mt-1">
            Filter Context is the ambient set of active filters acting upon the model. It is created by:
          </p>
          <ul className="text-xs text-slate-400 mt-1 space-y-1 list-disc pl-5">
            <li>Report-level, page-level, and visual-level filters.</li>
            <li>User slicers on the canvas (e.g. Slicer set to <code className="text-cyan-300 font-mono">Year = 2026</code>).</li>
            <li>Visual coordinates (e.g. The row header of a Matrix visual, filtering for <code className="text-cyan-300 font-mono">Product = 'Laptop'</code>).</li>
            <li>Filter arguments passed inside <code className="text-amber-400 font-mono">CALCULATE()</code>.</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        3. Context Transition: The Bridge Between Contexts
      </h2>
      <p>
        <strong>Context Transition</strong> is the automatic transformation of a Row Context into an equivalent Filter Context. It occurs whenever a Measure is called inside a Row Context, or when <code className="text-amber-400 font-mono">CALCULATE()</code> wraps an expression inside a row loop.
      </p>
    </div>
  );
};

export const Chapter8Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        DAX provides two classes of aggregation functions: standard <strong>Scalar Aggregators</strong> (e.g. <code className="text-cyan-400 font-mono">SUM</code>, <code className="text-cyan-400 font-mono">AVERAGE</code>) and <strong>Iterators</strong> (the <code className="text-amber-400 font-mono">X</code> functions). Understanding how iterators work is crucial for complex revenue, margin, and ranking calculations.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. Scalar Aggregators vs. Iterators (SUM vs. SUMX)
      </h2>
      <p>
        The native <code className="text-cyan-400 font-mono">SUM()</code> function only accepts a single column name as its argument:
      </p>
      <CodeBlock language="dax" filename="BasicSum.dax" code={`[Total Quantity] = SUM(Fact_Sales[Quantity])`} />
      <p>
        What happens if you need to calculate revenue, but your table only contains <code className="text-cyan-300 font-mono">Quantity</code> and <code className="text-cyan-300 font-mono">UnitPrice</code>? You cannot write <code className="text-rose-400 font-mono">SUM(Fact_Sales[Quantity] * Fact_Sales[UnitPrice])</code>—this will trigger a syntax error!
      </p>
      <p>
        This is where the iterator function <strong>SUMX</strong> comes in:
      </p>

      <CodeBlock
        language="dax"
        filename="Total_Revenue_SUMX.dax"
        code={`// Measure: Total Revenue with Dynamic Discount
[Total Revenue] = 
SUMX(
    Fact_Sales,
    Fact_Sales[Quantity] * Fact_Sales[UnitPrice] * (1 - Fact_Sales[DiscountPct])
)`}
      />

      <div className="space-y-3 pt-2">
        <h4 className="text-base font-bold text-white">Step-by-Step Evaluation Lifecycle of SUMX:</h4>
        <ol className="list-decimal pl-6 space-y-2 text-xs sm:text-sm text-slate-300">
          <li><strong>Step 1 (Table Evaluation):</strong> <code className="text-amber-400 font-mono">SUMX</code> evaluates its first argument (<code className="text-cyan-300 font-mono">Fact_Sales</code>) under the current ambient Filter Context. If the page is filtered for "Electronics", only Electronics rows are considered.</li>
          <li><strong>Step 2 (Row Context Creation):</strong> <code className="text-amber-400 font-mono">SUMX</code> opens a Row Context over the filtered table and iterates through it row-by-row.</li>
          <li><strong>Step 3 (Expression Execution):</strong> For row 1, it multiplies <code className="text-emerald-300 font-mono">Quantity * UnitPrice * (1 - DiscountPct)</code> and stores the scalar result in a temporary memory buffer. It repeats this for all rows.</li>
          <li><strong>Step 4 (Final Aggregation):</strong> Once iteration finishes, it sums all the individual row results together and returns the final scalar number.</li>
        </ol>
      </div>

      {/* Styled Comparison Table */}
      <div className="overflow-x-auto my-6 rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-slate-800 bg-slate-900 text-slate-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-3">Function Type</th>
              <th className="p-3">Syntax Example</th>
              <th className="p-3">Context Type</th>
              <th className="p-3">Multi-Column Expressions?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            <tr>
              <td className="p-3 font-semibold text-cyan-400">Scalar Aggregator (SUM, MIN, MAX)</td>
              <td className="p-3 text-slate-300">SUM(Table[Column])</td>
              <td className="p-3 text-slate-400">Filter Context</td>
              <td className="p-3 text-rose-400 font-bold">No (Single column only)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-amber-400">Iterator Function (SUMX, AVERAGEX, MAXX)</td>
              <td className="p-3 text-slate-300">SUMX(Table, Expression)</td>
              <td className="p-3 text-amber-300 font-bold">Row Context + Filter Context</td>
              <td className="p-3 text-emerald-400 font-bold">Yes (Any arithmetic expression)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CalloutBox type="common-mistake" title="Common Mistake: Nesting Iterators creating O(n²) Slowdown">
        <p>
          Never nest an iterator inside another iterator over large tables (e.g. <code className="text-rose-400 font-mono">SUMX(Fact_Sales, AVERAGEX(Dim_Customer, ...))</code>). If <code className="text-cyan-300 font-mono">Fact_Sales</code> has 10 million rows and <code className="text-cyan-300 font-mono">Dim_Customer</code> has 100,000 rows, this forces <strong>1 trillion calculation loops</strong>, instantly freezing the visual and triggering a memory allocation error!
        </p>
      </CalloutBox>
    </div>
  );
};
