import React from 'react';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { CalloutBox } from '../CalloutBox.tsx';
import { FunnelChartMockup } from '../diagrams/FunnelChartMockup.tsx';

export const Chapter9Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        <code className="text-amber-400 font-mono font-bold">CALCULATE</code> is the single most important and mathematically sophisticated function in DAX. It is the only function capable of modifying, overriding, and clearing ambient Filter Context.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. Syntax and Anatomy of CALCULATE
      </h2>
      <CodeBlock
        language="dax"
        filename="Calculate_Syntax.dax"
        code={`CALCULATE(
    <ScalarExpression>,
    <FilterModifier1>,
    <FilterModifier2>,
    ...
)`}
      />

      <p>
        The first argument is the scalar expression to evaluate (e.g., <code className="text-amber-300 font-mono">[Total Sales]</code>). Subsequent arguments are <strong>Filter Modifiers</strong> that alter the filter context under which the first argument executes.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. Filter Modifiers: ALL, ALLEXCEPT, and REMOVEFILTERS
      </h2>
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-emerald-400 font-bold font-mono text-sm">REMOVEFILTERS() &amp; ALL() — Clearing Slicers</h4>
          <p className="text-xs text-slate-300 mt-2">
            Used to remove filters from a specific table or column. This is essential for calculating <strong>Percentage of Total (% of Grand Total)</strong> or category share.
          </p>

          <CodeBlock
            language="dax"
            filename="PercentOfTotal.dax"
            code={`// 1. Base Measure
[Total Sales] = SUM(Fact_Sales[SalesAmount])

// 2. Total Sales ignoring any product filters
[All Product Sales] = 
CALCULATE(
    [Total Sales],
    REMOVEFILTERS(Dim_Product)
)

// 3. Product Sales Contribution %
[Product Share %] = 
DIVIDE(
    [Total Sales],
    [All Product Sales],
    0 // Safe divide fallback to prevent division by zero
)`}
          />

          <div className="text-xs text-slate-400 mt-2">
            <strong>How it works:</strong> In a matrix visual where the row header is <code className="text-cyan-300 font-mono">Product = 'iPhone'</code>, <code className="text-amber-300 font-mono">[Total Sales]</code> returns only iPhone sales. However, <code className="text-emerald-300 font-mono">[All Product Sales]</code> tells CALCULATE: <em>"Strip away the iPhone filter on Dim_Product and sum across all products."</em> Dividing the two gives the exact market share percentage.
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-cyan-400 font-bold font-mono text-sm">Complex Filter Expressions with FILTER()</h4>
          <p className="text-xs text-slate-300 mt-2">
            When you need to filter on a calculated condition or multi-column criteria:
          </p>

          <CodeBlock
            language="dax"
            filename="HighValueOrders.dax"
            code={`[Enterprise VIP Revenue] = 
CALCULATE(
    [Total Sales],
    FILTER(
        Fact_Sales,
        Fact_Sales[OrderAmount] >= 10000 && 
        RELATED(Dim_Customer[CustomerTier]) = "Enterprise"
    )
)`}
          />
        </div>
      </div>

      <CalloutBox type="interview-tip" title="Interview Question: ALL vs. REMOVEFILTERS">
        <p><strong>Question:</strong> What is the difference between <code className="text-amber-300 font-mono">ALL()</code> and <code className="text-amber-300 font-mono">REMOVEFILTERS()</code>?</p>
        <p className="pt-2"><strong>Model Answer:</strong> <code className="text-cyan-300 font-mono">ALL()</code> can function both as a table-returning function (e.g. used as an argument inside <code className="text-amber-300 font-mono">SUMX</code> or <code className="text-amber-300 font-mono">COUNTROWS</code>) and as a filter modifier inside <code className="text-amber-300 font-mono">CALCULATE</code>. <code className="text-emerald-300 font-mono">REMOVEFILTERS()</code> is a dedicated, clearer syntactic alias introduced specifically for <code className="text-amber-300 font-mono">CALCULATE</code> filter arguments that can never be accidentally evaluated as a table. Best practice in modern DAX is to use <code className="text-emerald-300 font-mono">REMOVEFILTERS()</code> whenever clearing context.</p>
      </CalloutBox>
    </div>
  );
};

export const Chapter10Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        Every corporate report requires comparisons across time: <em>Year-to-Date (YTD)</em>, <em>Year-over-Year (YoY) Growth</em>, and <em>Rolling 30-Day Moving Averages</em>. Power BI includes dedicated Time Intelligence functions, but they have one strict prerequisite.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. The Mandatory Dedicated Date Dimension
      </h2>
      <p>
        For Power BI Time Intelligence to calculate accurately, you <strong>must never</strong> use raw transaction date columns from your Fact table. You must build an independent, dedicated Date Table that meets four strict criteria:
      </p>
      <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-300">
        <li>It must contain continuous, contiguous dates with <strong>zero missing days</strong>.</li>
        <li>It must cover all days from Jan 1 of the earliest transaction year to Dec 31 of the latest year.</li>
        <li>The primary key column must be of data type <code className="text-emerald-400 font-mono">Date</code> with unique values.</li>
        <li>It must be officially designated by clicking <strong>Mark as Date Table</strong> in Power BI Desktop.</li>
      </ul>

      <h3 className="text-lg font-bold text-white pt-2">Full DAX Calendar Table Generator Script:</h3>
      <CodeBlock
        language="dax"
        filename="Dim_Date_Generator.dax"
        code={`Dim_Date = 
VAR MinYear = 2022
VAR MaxYear = 2026
VAR BaseCalendar = CALENDAR(DATE(MinYear, 1, 1), DATE(MaxYear, 12, 31))
RETURN
    ADDCOLUMNS(
        BaseCalendar,
        "Year", YEAR([Date]),
        "YearMonthNumber", YEAR([Date]) * 100 + MONTH([Date]),
        "MonthNumber", MONTH([Date]),
        "MonthName", FORMAT([Date], "MMMM"),
        "MonthShort", FORMAT([Date], "MMM"),
        "Quarter", "Q" & FORMAT([Date], "Q"),
        "QuarterYear", "Q" & FORMAT([Date], "Q") & " " & YEAR([Date]),
        "DayOfWeek", FORMAT([Date], "dddd"),
        "DayOfWeekNumber", WEEKDAY([Date], 2), // Monday = 1
        "IsWeekend", IF(WEEKDAY([Date], 2) >= 6, "Weekend", "Weekday")
    )`}
      />

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. Essential Time Intelligence Patterns in Production
      </h2>

      <div className="space-y-4">
        <div>
          <h4 className="text-amber-400 font-bold font-mono text-sm">A. Year-to-Date (YTD) Revenue</h4>
          <CodeBlock
            language="dax"
            filename="YTD_Revenue.dax"
            code={`// Year-to-Date Sales calculation
[Sales YTD] = 
TOTALYTD(
    [Total Sales],
    Dim_Date[Date]
)`}
          />
        </div>

        <div>
          <h4 className="text-cyan-400 font-bold font-mono text-sm">B. Year-over-Year (YoY) Sales Variance %</h4>
          <CodeBlock
            language="dax"
            filename="YoY_Growth.dax"
            code={`// 1. Sales for Same Period Last Year
[Sales SPLY] = 
CALCULATE(
    [Total Sales],
    SAMEPERIODLASTYEAR(Dim_Date[Date])
)

// 2. Year-over-Year Growth Percentage
[YoY Sales Growth %] = 
VAR CurrentSales = [Total Sales]
VAR PriorYearSales = [Sales SPLY]
VAR Growth = CurrentSales - PriorYearSales
RETURN
    DIVIDE(Growth, PriorYearSales, 0)`}
          />
        </div>

        <div>
          <h4 className="text-purple-400 font-bold font-mono text-sm">C. Rolling 30-Day Moving Average</h4>
          <CodeBlock
            language="dax"
            filename="Rolling_30D.dax"
            code={`[Rolling 30D Sales] = 
CALCULATE(
    [Total Sales],
    DATESINPERIOD(
        Dim_Date[Date],
        MAX(Dim_Date[Date]),
        -30,
        DAY
    )
)`}
          />
        </div>
      </div>

      <CalloutBox type="common-mistake" title="Common Mistake: Auto Date/Time Hidden Bloat">
        <p>
          Always go to <em>File ➔ Options and Settings ➔ Options ➔ Current File ➔ Data Load</em> and <strong>UNCHECK 'Auto date/time'</strong>! When enabled, Power BI silently creates a hidden Date table for every single date column in your model, ballooning file sizes and consuming dozens of megabytes of unnecessary memory.
        </p>
      </CalloutBox>
    </div>
  );
};

export const Chapter11Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        Advanced DAX moves beyond basic sums into dynamic business heuristics. Master the <code className="text-amber-400 font-mono">SWITCH(TRUE())</code> classification pattern, dense rankings with <code className="text-amber-400 font-mono">RANKX</code>, and disconnected tables for dynamic measure switching.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. The SWITCH(TRUE()) Pattern for Tiering &amp; KPI Badges
      </h2>
      <p>
        In Excel, nested <code className="text-slate-400 font-mono">IF()</code> statements quickly become unreadable. In DAX, testing conditions with <code className="text-amber-400 font-mono">SWITCH(TRUE(), ...)</code> evaluates sequential business rules cleanly:
      </p>

      <CodeBlock
        language="dax"
        filename="Customer_Segmentation_SWITCH.dax"
        code={`[Customer Status Tier] = 
VAR LTV = [Total Sales]
VAR DaysSinceLastPurchase = [Days Since Last Order]
RETURN
    SWITCH(
        TRUE(),
        LTV >= 100000 && DaysSinceLastPurchase <= 30, "Tier 1: VIP Active",
        LTV >= 50000  && DaysSinceLastPurchase <= 60, "Tier 2: Growth Account",
        DaysSinceLastPurchase > 90,                  "Tier 3: At-Risk Churn",
        "Standard Account"
    )`}
      />

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. Dense Ranking with RANKX
      </h2>
      <p>
        Ranking products or sales representatives without ties breaking down requires careful handling of <code className="text-cyan-400 font-mono">ALLSELECTED</code>:
      </p>

      <CodeBlock
        language="dax"
        filename="Product_Rank.dax"
        code={`[Product Sales Rank] = 
IF(
    HASONEVALUE(Dim_Product[ProductName]),
    RANKX(
        ALLSELECTED(Dim_Product[ProductName]),
        [Total Sales],
        ,
        DESC,
        Dense // Dense prevents skipping numbers on ties (e.g., 1, 2, 2, 3 instead of 1, 2, 2, 4)
    )
)`}
      />

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        3. Dynamic Measure Selection (Disconnected Slicers)
      </h2>
      <p>
        Executives often want a single chart where they can toggle between showing <em>Sales</em>, <em>Profit</em>, or <em>Order Count</em> via a radio button.
      </p>
      <ol className="list-decimal pl-6 space-y-2 text-xs sm:text-sm text-slate-300">
        <li>Create a disconnected parameter table (<code className="text-amber-300 font-mono">MetricSelector</code>) with rows: "Revenue", "Profit", "Volume".</li>
        <li>Bind the column to a visual slicer on the report canvas.</li>
        <li>Author a master switcher measure using <code className="text-cyan-300 font-mono">SELECTEDVALUE()</code>:</li>
      </ol>

      <CodeBlock
        language="dax"
        filename="Dynamic_KPI_Switcher.dax"
        code={`[Dynamic Selected Metric] = 
VAR SelectedMetric = SELECTEDVALUE(MetricSelector[MetricName], "Revenue")
RETURN
    SWITCH(
        SelectedMetric,
        "Revenue", [Total Sales],
        "Profit",  [Total Gross Profit],
        "Volume",  [Total Order Quantity],
        [Total Sales]
    )`}
      />
    </div>
  );
};

export const Chapter12Content: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
      <p className="text-base sm:text-lg text-slate-200 font-medium">
        Data visualization is not about decorating a canvas; it is about cognitive speed. A senior BI engineer selects visual encodings that minimize visual noise and enable decision-makers to comprehend insights in under 3 seconds.
      </p>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        1. Visual Encoding Decision Matrix
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-amber-400 font-bold font-mono text-sm">Bar Chart vs. Column Chart</h4>
          <p className="text-xs text-slate-300 mt-2">
            Use <strong>Horizontal Bar Charts</strong> whenever category labels are long (e.g. Employee Full Names, Product SKU descriptions). It prevents awkward 45-degree angled text labels that fatigue the human eye. Reserve <strong>Vertical Column Charts</strong> for sequential discrete data (Years, Months, Quarters).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-cyan-400 font-bold font-mono text-sm">Line Chart vs. Area Chart</h4>
          <p className="text-xs text-slate-300 mt-2">
            Use continuous <strong>Line Charts</strong> for time trends. Avoid stacked area charts when comparing multiple categories over time because baseline distortion makes it nearly impossible to evaluate changes in mid-layer categories.
          </p>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        2. Funnel Charts &amp; Conversion Bottlenecks
      </h2>
      <p>
        Funnel charts are uniquely designed for sequential workflows where drop-off occurs at each step (e.g. e-commerce checkouts, sales pipelines, hiring applicant tracking):
      </p>

      {/* Code-Generated CSS Funnel Visual Mockup */}
      <FunnelChartMockup />

      <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 border-t border-slate-800">
        3. The Decomposition Tree: Root-Cause AI Visual
      </h2>
      <p>
        The <strong>Decomposition Tree</strong> visual in Power BI allows users to explore a high-level metric across multiple dimensions in any ad-hoc order. Users can click the <code className="text-amber-400 font-mono">(+)</code> icon to split by Region, then Customer Segment, then SKU, or let Power BI AI analyze <em>"High Value"</em> to automatically surface the dimension driving maximum variance.
      </p>

      <CalloutBox type="best-practice" title="Best Practice: WCAG Accessible Color Palettes">
        <p>
          Never rely exclusively on red and green to denote positive and negative! Approximately 8% of men have red-green color blindness. Pair colors with clear textual indicators (e.g. <span className="text-emerald-400 font-bold">▲ +12%</span> or <span className="text-rose-400 font-bold">▼ -8%</span>), and test report themes against high-contrast accessibility standards.
        </p>
      </CalloutBox>
    </div>
  );
};
