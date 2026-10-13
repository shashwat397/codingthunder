import { Tutorial, TutorialChapter } from '../types/index.ts';

export const POWER_BI_CHAPTERS: TutorialChapter[] = [
  // ==========================================
  // CHAPTER 01
  // ==========================================
  {
    id: 'intro-to-power-bi',
    number: 1,
    title: 'Introduction to Power BI',
    summary: 'Business Intelligence vs Power BI, Industry Adoption, Architecture & Modern Analytics Paradigm',
    contentMarkdown: `# Chapter 01: Introduction to Power BI

## 1. What is Business Intelligence (BI)?
Business Intelligence (BI) refers to the procedural, technological, and architectural infrastructure that collects, stores, cleans, transforms, models, and analyzes enterprise data to produce actionable business decisions.

Traditional enterprise business intelligence involved rigid data pipelines where business users had to wait weeks or months for IT specialists to create database schemas, write custom SQL scripts, design physical OLAP cubes, and produce static tabular printouts (such as SQL Server Reporting Services / SSRS reports).

Modern Business Intelligence demands self-service agility: business analysts, financial controllers, and data scientists must be capable of connecting to diverse data sources, cleansing messy tables on the fly, building analytical models, and distributing interactive web dashboards within hours—without depending on dedicated database administrators.

---

## 2. Why Power BI?
Microsoft Power BI is currently the world's most widely adopted self-service and enterprise BI platform, consistently positioned by Gartner as a Leader in the Magic Quadrant for Analytics and Business Intelligence Platforms for over seven consecutive years.

### Key Factors Behind Power BI's Market Dominance:
- **Massive In-Memory Speed:** Powered by the VertiPaq tabular columnar compression engine, allowing analytical queries across tens of millions of rows to complete in sub-seconds on standard desktop hardware.
- **Deep Microsoft Ecosystem Integration:** Native, zero-friction integration with Microsoft Excel, Microsoft Fabric, Azure Data Lake Storage, SQL Server, SharePoint, Teams, and PowerPoint.
- **Self-Service with Enterprise Governance:** Non-technical domain experts can author reports locally in Power BI Desktop (free), while enterprise IT retains total security control over data governance, Row-Level Security (RLS), and automated cloud refreshes.
- **Unrivaled Cost-to-Performance Ratio:** Power BI Desktop is completely free to download, author, and use; sharing via Power BI Pro starts at just ~$10 per user/month, a fraction of legacy BI pricing (such as Tableau or MicroStrategy).

---

## 3. Comparison Matrix: Traditional Legacy BI vs. Modern Power BI

| Architectural Dimension | Traditional Legacy BI (SSRS, Cognos, SAP BO) | Modern Microsoft Power BI |
| :--- | :--- | :--- |
| **Data Ingestion** | Slow IT-driven ETL staging processes requiring DBA sign-off | Self-service Power Query (M mashup engine) with 200+ native connectors |
| **Calculation Engine** | Disk-bound relational database queries (SQL disk I/O) | In-Memory Columnar VertiPaq Engine with up to 10x-20x dictionary compression |
| **Report Interactivity** | Static paginated PDF/HTML printouts with fixed tables | Fully dynamic interactive cross-filtering, slicing, tooltips, and drillthrough |
| **Data Modeling** | Complex multi-dimensional OLAP cubes (SSAS Multidimensional) | Tabular star schemas with simple drag-and-drop 1-to-many relationships |
| **Calculation Language** | MDX (Multi-Dimensional Expressions) / Complex SQL | DAX (Data Analysis Expressions) with powerful functional syntax |
| **Collaboration & Sharing** | Dedicated on-premise report web servers with rigid access | Cloud SaaS (Power BI Service) with workspace apps, mobile push, and Teams embedding |
| **Total Cost of Ownership** | High capital expenditure on server licenses and maintenance | Free Desktop authoring + predictable, low-cost per-user subscription model |

---

## 4. Core Architectural Highlights of Power BI

### A. The In-Memory VertiPaq Columnar Analytics Engine
Unlike traditional row-store databases (where each full row is saved sequentially on disk), Power BI stores data **by column**. This architecture allows the VertiPaq engine to:
- Compress columns using Hash/Dictionary encoding, Value encoding, and Run-Length Encoding (RLE).
- Scan only the specific columns referenced in a formula rather than reading entire tables from storage.
- Execute calculations directly in high-speed RAM with multi-threaded vector CPU instructions.

### B. Unified Semantic Modeling Layer
Instead of having 20 different analysts connect to raw database tables and calculate metrics using disparate definitions of "Gross Profit", Power BI allows organizations to publish a single, centralized **Semantic Model (Dataset)**. Downstream reports, Excel workbooks, and PowerPoint decks all connect to this single source of truth.

### C. Advanced Built-in AI Capabilities
- **Quick Insights & Key Influencers:** Machine learning algorithms that automatically find correlations and identify which drivers impact a specific KPI.
- **Decomposition Tree:** Interactive root-cause analysis allowing users to drill down into dimensions in any arbitrary order.
- **Q&A Natural Language:** Allows stakeholders to type plain English questions (e.g. *"What were total sales in California last month by category?"*) and instantly receive a generated visual.

> **Best Practice:** Always design your analytics projects with a single source of truth in mind. Never duplicate calculations across separate report files when you can build a centralized semantic model and connect downstream reports via Live Connection.

> **Common Mistake:** Treating Power BI as an Excel replacement to dump massive 100-column raw data dumps. Power BI is an analytical aggregation and storytelling tool, not a raw record export utility.

> **Interview Tip:** When interviewers ask *"Why do companies prefer Power BI over Excel or SQL?"*, highlight the combination of VertiPaq in-memory columnar compression, automated scheduled refreshes in Power BI Service, and dynamic cross-filtering visuals that eliminate manual weekly reporting routines.
`,
  },

  // ==========================================
  // CHAPTER 02
  // ==========================================
  {
    id: 'power-bi-ecosystem',
    number: 2,
    title: 'Power BI Ecosystem',
    summary: 'Desktop, Service, Mobile, Report Server, Embedded, Gateways & Licensing Matrix',
    contentMarkdown: `# Chapter 02: Power BI Ecosystem

The Microsoft Power BI ecosystem is a comprehensive suite of software tools, cloud services, and developer SDKs engineered to support every phase of the business intelligence lifecycle—from raw data extraction to executive mobile consumption.

[VISUAL: ECOSYSTEM]

## 1. Core Ecosystem Components

### A. Power BI Desktop
- **Role:** The primary authoring and development tool for data engineers, modelers, and report designers.
- **Platform:** Windows application (available as a free download from Microsoft Store or direct installer).
- **Core Internal Engines:** 
  - **Power Query:** Mashup engine (M language) for ETL extraction and cleansing.
  - **VertiPaq:** In-memory tabular analytical database engine.
  - **Report Canvas:** Vector-based interactive visualization rendering engine.
- **File Formats:** 
  - \`.pbix\`: Traditional single-file report containing data model, queries, and layout.
  - \`.pbip\` (Power BI Project): Modern developer-oriented folder structure separating model definitions (PBIR/TMDL) for Git version control and team CI/CD pipelines.

### B. Power BI Service (Power BI Online / Fabric)
- **Role:** Cloud-based SaaS collaboration, publishing, scheduled refresh, and distribution portal hosted on Microsoft Azure.
- **Key Concepts:**
  - **Workspaces:** Collaborative container sandboxes for report developers.
  - **Power BI Apps:** Packaged, read-only distribution bundles for business consumers.
  - **Semantic Models (Datasets):** Cloud-hosted in-memory models supporting automated refresh.
  - **Dataflows:** Cloud-based Power Query pipelines that prep and store reusable tables in Azure Data Lake Gen2.
  - **Deployment Pipelines:** Staged lifecycle promotion across Development, Test, and Production environments.

### C. Power BI Mobile
- **Role:** Native smartphone and tablet consumption for executives on the move.
- **Supported Operating Systems:** iOS (iPhone/iPad), Android, and Windows tablets.
- **Key Features:**
  - Dedicated **Mobile Layout** designer in Power BI Desktop to build portrait-optimized dashboards.
  - Push notifications on critical metric threshold alerts.
  - Real-time barcode and QR code scanner integration to filter data based on physical warehouse inventory tags.
  - Secure offline caching with biometric security authentication (FaceID / Fingerprint).

### D. Power BI Report Server (PBIRS)
- **Role:** On-premises report hosting behind corporate firewalls for air-gapped systems or strict regulatory environments.
- **Ideal For:** Banking, defense, government, and healthcare institutions legally prohibited from hosting identifiable data in public cloud services.
- **Update Cadence:** Released on a stable 4-month cycle (January, May, September) rather than the monthly updates of Power BI Desktop (Cloud).

### E. Power BI Embedded
- **Role:** Allows independent software vendors (ISVs) and web developers to embed interactive Power BI charts, reports, and dashboards directly into external customer-facing web applications without requiring end-users to have Power BI licenses.
- **Technology:** REST APIs, JavaScript SDK, and dedicated Azure A-SKUs / EM-SKUs.

### F. On-Premises Data Gateways
- **Role:** Secure outbound bridge connecting cloud-based Power BI Service to on-premise local databases (SQL Server, Oracle, internal network file shares).
- **Gateways Types:**
  - **Personal Gateway:** Single-user laptop/desktop testing; runs only when the user is logged into Windows.
  - **Standard (Enterprise) Gateway:** Installed on an always-on dedicated server; supports scheduled refresh, DirectQuery pass-through, and load-balanced gateway clusters.

---

## 2. Licensing Breakdown & Feature Comparison

| License Tier | Target User Profile | Dataset Size Limit | Scheduled Refreshes | Sharing & Collaboration Scope | Price Benchmark |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Power BI Desktop (Free)** | Individual Analyst learning or building local prototypes | 1 GB memory limit | Manual refresh only | Cannot share securely online (file transfer only) | $0 (Free) |
| **Power BI Pro** | Report Authors, BI Developers & Business Consumers | 10 GB workspace capacity (1 GB max single model) | Up to 8 times per day | Full sharing within Pro workspaces; both creators and viewers need Pro licenses | ~$10 / user / month |
| **Premium Per User (PPU)** | Advanced Data Engineers & Enterprise Modelers | Up to 100 GB single model size | Up to 48 times per day | Can only share content with other users who also hold a PPU license | ~$20 / user / month |
| **Microsoft Fabric / Premium Capacity** | Large Enterprises with 1,000+ viewers | Multi-Terabyte models with dedicated Azure vCores | Up to 48 times per day (or real-time Direct Lake) | Pro users build and publish; unlimited Free users can view reports in premium workspaces | Starts at Fabric F64 / P1 SKU |

> **Best Practice:** When choosing licensing for an organization with over 300 consumers who only need read-only dashboard access, evaluate Microsoft Fabric / Premium Capacity. Paying ~$10/user for 500 viewers ($5,000/mo) quickly exceeds the base cost of dedicated capacity while unlocking unlimited free viewers.

> **Common Mistake:** Purchasing Premium Per User (PPU) licenses for 3 report developers and expecting standard Pro users to view their reports. A PPU workspace strictly requires EVERY viewer to possess a PPU license!

> **Interview Tip:** Be prepared to explain the difference between Pro and Premium: *"Pro is a user-based license that grants rights to publish and collaborate. Premium is either a per-user capacity license (PPU) or an organizational compute capacity that allows free users to consume reports while unlocking enterprise features like XMLA read/write endpoints, paginated reports, and 48 refreshes per day."*
`,
  },

  // ==========================================
  // CHAPTER 03
  // ==========================================
  {
    id: 'architecture-and-workflow',
    number: 3,
    title: 'Power BI Architecture & Workflow',
    summary: 'The 6-Stage End-to-End Enterprise Flow & Internal Processing Mechanics',
    contentMarkdown: `# Chapter 03: Power BI Architecture & Workflow

Understanding the complete architectural data pipeline ensures that enterprise reports scale gracefully, refresh reliably, and compute lightning-fast queries even as datasets grow into millions of records.

[VISUAL: ARCHITECTURE]

## 1. The 6-Stage End-to-End Pipeline

### Stage 1: Data Source Connection
The pipeline begins by establishing connections to heterogeneous source systems:
- **Relational Databases:** Microsoft SQL Server, Azure SQL, PostgreSQL, Oracle, MySQL.
- **Enterprise Cloud Warehouses:** Snowflake, Google BigQuery, Amazon Redshift, Databricks.
- **Flat Files & Documents:** Excel (.xlsx), CSV, Parquet, JSON, XML, PDF.
- **SaaS Applications & APIs:** Salesforce, Dynamics 365, SharePoint Lists, Google Analytics, REST APIs.

### Stage 2: Power Query (M Mashup Engine) ETL
Raw source data is rarely ready for reporting. Power Query intercepts the data and performs:
- Schema standardization (cleaning headers, stripping whitespace, removing null values).
- Data type enforcement (converting string dates to proper \`Date\` or \`DateTime\` formats).
- Relational reshaping (unpivoting wide transactional sheets, splitting delimiter columns).
- **Query Folding:** Translating M transformation steps into native SQL queries executed directly on source databases to maximize speed.

### Stage 3: Data Modeling & Schema Design
Cleansed tables are loaded into the VertiPaq tabular model:
- Tables are segregated into **Fact Tables** (numerical transactions) and **Dimension Tables** (contextual slicing attributes).
- Relationships are configured with **1-to-Many (\`1:*\`) cardinality**.
- Cross-filter directions are set strictly to **Single**.
- Surrogate foreign keys are hidden from the visual report field list to prevent user confusion.

### Stage 4: DAX Analytical Calculations
With the relational backbone in place, business metrics are engineered:
- Writing explicit **Measures** (e.g. \`Total Revenue\`, \`Gross Profit Margin\`, \`YoY Growth %\`).
- Utilizing the \`CALCULATE()\` function to modify filter contexts dynamically.
- Implementing dedicated Date Tables for Time Intelligence computations.

### Stage 5: Visual Report Authoring
Data is translated into actionable visual stories:
- Applying the **Z-Pattern layout** (executive KPIs top-left, trends in middle, tabular details at bottom).
- Implementing interactive slicers, drillthrough pages, custom tooltip cards, and bookmark state switches.
- Enforcing strict corporate color branding with maximum data-to-ink ratios.

### Stage 6: Cloud Deployment & Governance
The finalized report is published from Desktop to Power BI Service:
- Publishing to dedicated Development Workspaces.
- Setting up automated Scheduled Refresh schedules linked through On-Premises Enterprise Gateways.
- Enforcing **Dynamic Row-Level Security (RLS)** using \`USERPRINCIPALNAME()\`.
- Bundling tested assets into Power BI Apps for enterprise distribution.

---

## 2. Internal Engine Mechanics: Under the Hood

When a visual renders on the screen, two core background engines work in tandem:

### 1. Mashup Engine (M Engine)
- Active during ETL extraction and data model refresh.
- Executes sequentially through the step dependency tree defined in Power Query.
- Does NOT execute during report browsing; it sleeps once data is loaded into memory!

### 2. Tabular Engine (VertiPaq)
The analytical engine that runs inside Power BI Desktop and Power BI Service. It consists of two sub-engines:
- **Formula Engine (FE):**
  - Parses incoming DAX queries and generates query evaluation plans.
  - Single-threaded execution.
  - Handles complex conditional logic and non-vectorized calculations that cannot be solved by simple column scans.
- **Storage Engine (SE):**
  - Multi-threaded columnar scanner.
  - Scans compressed data segments in RAM with extreme speed.
  - If querying relational sources via DirectQuery, SE translates the query into SQL and waits for the database response.

> **Best Practice:** Keep the Storage Engine doing 90%+ of the work! If the Formula Engine spends too much time processing complex row-by-row expressions, visual performance drops noticeably. Write vector-friendly DAX that allows the Storage Engine to scan compressed memory blocks.

> **Common Mistake:** Performing data transformations (like string splitting or date extraction) using DAX Calculated Columns instead of doing it in Power Query during Stage 2. Calculations done in Power Query compress far better in VertiPaq memory!

> **Interview Tip:** If asked *"Can you explain the difference between the Mashup Engine and the Tabular Engine?"*, clarify that the Mashup Engine handles data ingestion and ETL in Power Query (written in M), whereas the Tabular Engine (VertiPaq) manages the in-memory columnar database and evaluates DAX queries during visual exploration.
`,
  },

  // ==========================================
  // CHAPTER 04
  // ==========================================
  {
    id: 'connecting-data-sources',
    number: 4,
    title: 'Connecting Data Sources',
    summary: 'Import Mode vs DirectQuery vs Live Connection vs Composite Hybrid Models',
    contentMarkdown: `# Chapter 04: Connecting Data Sources

Choosing the correct storage mode is the most fundamental architectural decision in a Power BI project. Selecting the wrong storage mode early can cause catastrophic refresh delays, slow user interaction, or severe source database load.

[VISUAL: STORAGE_MODES]

## 1. Storage Modes Overview

### A. Import Mode (Default & Strongly Recommended)
- **Mechanism:** Ingests raw source records, compresses them using the VertiPaq columnar engine, and stores the compressed model in RAM.
- **Performance:** Blazing fast sub-second visual renders because calculations execute entirely in high-speed local memory.
- **Capabilities:** Supports the full, unrestricted suite of Power Query transformation functions and advanced DAX expressions.
- **Constraints:** Dataset size is capped by memory allowances (1 GB on Pro, 100 GB on PPU); data is as fresh as the last scheduled refresh.

### B. DirectQuery Mode
- **Mechanism:** Zero transactional data is loaded or stored inside the \`.pbix\` file. Every time a user changes a slicer or clicks a visual, Power BI converts the DAX measure into a native SQL query sent over the network to the source database.
- **Performance:** Bound strictly to the speed and workload of the underlying database server and network throughput.
- **Capabilities:** Can query petabytes of data in Snowflake or SQL Server; guarantees real-time fresh data without waiting for refresh jobs.
- **Constraints:** Heavy load on source database servers; severe restrictions on DAX functions (many Time Intelligence functions disabled); visual rendering is noticeable slower.

### C. Live Connection Mode
- **Mechanism:** Power BI Desktop connects directly to a pre-existing enterprise tabular model hosted in SQL Server Analysis Services (SSAS), Azure Analysis Services (AAS), or an enterprise Power BI Semantic Model.
- **Performance:** Leverages the centralized server compute of the remote Analysis Services cluster.
- **Capabilities:** Enforces a rigid single source of truth across thousands of corporate business analysts.
- **Constraints:** Power Query ETL and the Data Modeling tab are completely disabled in Desktop—the user is strictly authoring visual layouts.

### D. Composite Models & Dual Storage
- **Mechanism:** Allows a single semantic model to combine Import tables and DirectQuery tables in the same schema.
- **Dual Storage Mode:** Dimension tables (e.g. \`DimDate\`, \`DimProduct\`) are configured with **Dual** storage mode. When a visual queries an Import fact table, the dimension acts as an Import table; when querying a DirectQuery fact table, the dimension joins directly on the source database, avoiding expensive cross-engine memory bridges.

---

## 2. Storage Mode Decision Matrix

| Evaluation Criteria | Import Mode | DirectQuery Mode | Live Connection |
| :--- | :--- | :--- | :--- |
| **Data Freshness** | Scheduled (Up to 8x/day Pro, 48x/day PPU) | True Real-Time (Milliseconds / Seconds) | Inherited from remote tabular model refresh |
| **Max Model Volume** | Up to 1 GB (Pro) / 100+ GB (PPU/Fabric) | Virtually Unlimited (Petabyte scale in DB) | Unlimited (Handled on Analysis Services host) |
| **Visual Render Speed** | Ultra-Fast (Sub-second in-memory) | Moderate to Slow (Network & DB query time) | Fast (High-performance remote server) |
| **DAX Functionality** | 100% Unrestricted DAX supported | Restricted (Limited Time Intelligence) | Full DAX (Authored at tabular model layer) |
| **Power Query Capability** | Full M transformation library available | Limited (Transformations must fold to SQL) | Disabled in Desktop |
| **Source System Load** | Heavy during refresh; zero load during report viewing | Continuous live SQL query load on every user interaction | Zero load on raw DB; load is on Analysis Services |
| **Offline Viewing** | Yes (Data is cached in local .pbix) | No (Requires live database connectivity) | No (Requires live server connection) |

> **Best Practice:** Default to **Import Mode** in 95% of business use cases. Only consider DirectQuery when data volume exceeds available capacity limits, or when business contracts strictly mandate real-time second-by-second transaction tracking.

> **Common Mistake:** Selecting DirectQuery simply because *"our database has 50 million rows"*. Once compressed by VertiPaq, a 50-million-row star schema often consumes less than 350 MB of memory in Import mode and runs 20x faster than DirectQuery!

> **Interview Tip:** If an interviewer asks *"How do you handle a scenario where we have 10 years of historical data that rarely changes and 1 day of real-time today data?"*, propose a **Composite Model**: Import the historical 10 years into VertiPaq for ultra-fast trend analysis, and keep only today's table in DirectQuery mode, setting shared dimensions to Dual storage.
`,
  },

  // ==========================================
  // CHAPTER 05
  // ==========================================
  {
    id: 'power-query-etl',
    number: 5,
    title: 'Power Query & ETL Transformations',
    summary: 'The M Mashup Engine, Query Folding Optimization, and Common Essential Transformations',
    contentMarkdown: `# Chapter 05: Power Query & ETL Transformations

Power Query is the graphical and programmatic data preparation engine embedded within Power BI Desktop, Microsoft Excel, and Microsoft Fabric Dataflows.

[VISUAL: ETL_QUERY_FOLDING]

## 1. What is Query Folding and Why is it Critical?
**Query Folding** is the ability of Power Query to translate user transformation steps written in the M language into a single, optimized SQL query that is pushed back to the source relational database for remote execution.

### Why Query Folding Matters:
1. **Network Bandwidth Conservation:** Instead of pulling 10 million raw transaction rows across corporate networks into Power BI RAM, the database server computes aggregations and sends only 5,000 summary rows.
2. **Scheduled Refresh Speed:** Refresh times drop from 45 minutes to 40 seconds.
3. **Prerequisite for Incremental Refresh:** Power BI Service cannot configure Incremental Refresh unless Query Folding is functional on the date filter column!

\`\`\`sql
-- Pushed as a folded query directly to SQL Server:
SELECT 
    CustomerID,
    TerritoryID,
    SUM(LineTotal) AS TotalRevenue
FROM Sales.SalesOrderDetail
WHERE OrderDate >= '2025-01-01'
GROUP BY CustomerID, TerritoryID;
\`\`\`

### Transformations That FOLD to SQL:
- Filtering rows (\`Table.SelectRows\`)
- Removing unnecessary columns (\`Table.SelectColumns\`)
- Renaming columns (\`Table.RenameColumns\`)
- Group By aggregations (\`Table.Group\`)
- Inner joins across tables located within the same database instance

### Transformations That BREAK Query Folding:
- Changing column data types to complex custom types not native to the SQL dialect
- Inserting custom R or Python scripts
- Applying non-standard custom M functions (e.g. \`Text.Proper\` or custom regex)
- Appending tables from heterogeneous sources (e.g. joining a SQL table to an Excel sheet)
- Adding an Index Column before filtering rows

> **Pro Tip:** In Power Query Editor, right-click the last Applied Step in the query settings panel. If **"View Native Query"** is enabled and clickable, query folding is active! If it is grayed out, folding has stopped.

---

## 2. Roche's Maxim of Data Transformation
A foundational rule across all senior BI engineering:
> *"Data should be transformed as far upstream as possible, and as far downstream as necessary."*
- **Level 1 (Best):** Source Database / Data Warehouse (SQL Views, dbt models).
- **Level 2 (Great):** Power Query / Dataflows (M Engine).
- **Level 3 (Avoid):** DAX Calculated Columns (takes RAM, cannot be compressed easily).

---

## 3. Essential Power Query Transformations

### A. Unpivoting Columns (Wide to Tall)
Converting spreadsheets where quarters or months are spread across column headers into normalized relational rows.

\`\`\`m
// Power Query M formula: Convert wide quarterly columns into tall key-value rows
= Table.UnpivotOtherColumns(
    #"PreviousStep", 
    {"ProductID", "Region"}, 
    "FiscalQuarter", 
    "Revenue"
)
\`\`\`

### B. Merging vs. Appending Queries
- **Merge (Join):** Combines two tables horizontally based on matching key columns (equivalent to a SQL \`LEFT OUTER JOIN\` or \`INNER JOIN\`).
- **Append (Union):** Stacks two tables vertically with identical column headers (equivalent to a SQL \`UNION ALL\`).

### C. Creating a Dynamic Calendar Table in M Script
Never rely on auto date/time hierarchies. Build an explicit, robust Date dimension directly in Power Query:

\`\`\`m
let
    StartDate = #date(2023, 1, 1),
    EndDate = #date(2026, 12, 31),
    NumberOfDays = Duration.Days(EndDate - StartDate) + 1,
    DateList = List.Dates(StartDate, NumberOfDays, #duration(1, 0, 0, 0)),
    DateTable = Table.FromList(DateList, Splitter.SplitByNothing(), {"Date"}),
    ChangedType = Table.TransformColumnTypes(DateTable, {{"Date", type date}}),
    AddYear = Table.AddColumn(ChangedType, "Year", each Date.Year([Date]), Int64.Type),
    AddMonth = Table.AddColumn(AddYear, "MonthName", each Date.MonthName([Date]), type text),
    AddMonthNum = Table.AddColumn(AddMonth, "MonthNum", each Date.Month([Date]), Int64.Type),
    AddQuarter = Table.AddColumn(AddMonthNum, "Quarter", each "Q" & Text.From(Date.QuarterOfYear([Date])), type text),
    AddDayOfWeek = Table.AddColumn(AddQuarter, "DayOfWeek", each Date.DayOfWeekName([Date]), type text)
in
    AddDayOfWeek
\`\`\`

> **Best Practice:** Always perform row filters and column removals as the very FIRST steps in Power Query. This ensures query folding pushes those constraints upstream before any complex transforms are applied.

> **Common Mistake:** Leaving unreferenced technical staging queries set to "Enable Load". Always right-click staging queries and uncheck **"Enable Load"** so they do not bloat the final report model!

> **Interview Tip:** When asked *"How do you diagnose why a Power BI refresh takes 2 hours?"*, state that you first check whether Query Folding is broken in Power Query by inspecting "View Native Query" on the Applied Steps.
`,
  },

  // ==========================================
  // CHAPTER 06
  // ==========================================
  {
    id: 'data-modeling',
    number: 6,
    title: 'Data Modeling & Schema Design',
    summary: 'Star Schema vs Snowflake Schema, Cardinality, Cross-Filtering & Relationship Traps',
    contentMarkdown: `# Chapter 06: Data Modeling & Schema Design

Data modeling is the foundation of any scalable Power BI architecture. While poor visuals produce bad presentations, a poor data model leads to incorrect numbers, catastrophic calculation lag, and impossible DAX formulas.

[VISUAL: STAR_VS_SNOWFLAKE]

## 1. Fact Tables vs. Dimension Tables

### Fact Tables (Accumulators & Transactions)
- Contain quantitative, numeric measurements and foreign keys.
- Examples: \`FactSales\`, \`FactOrders\`, \`FactGLTransactions\`, \`FactWebsiteSessions\`.
- Shape: **Tall and narrow** (millions of rows, few columns).
- Characteristics: High row count, continuously appending new records.

### Dimension Tables (Business Context & Slicing)
- Contain descriptive text attributes used to filter, group, slice, and dice metrics.
- Examples: \`DimCustomer\`, \`DimProduct\`, \`DimDate\`, \`DimGeography\`, \`DimEmployee\`.
- Shape: **Short and wide** (low row count, many descriptive columns).
- Characteristics: Primary key uniquely identifies each record.

---

## 2. Star Schema vs. Snowflake Schema

### The Star Schema (Gold Standard)
In a Star Schema, each Dimension table connects directly to the central Fact table with a single relationship hop.
- **Why VertiPaq Loves Star Schemas:**
  - Fast hash lookups with zero multi-hop relationship traversals.
  - Highly efficient dictionary encoding across standalone dimension columns.
  - Unambiguous DAX filter context propagation.

### The Snowflake Schema (Normalized Chains)
In a Snowflake Schema, dimensions are split into sub-normalized tables (e.g. \`FactSales\` ➔ \`DimProduct\` ➔ \`DimSubCategory\` ➔ \`DimCategory\`).
- **Why Snowflaking Degrades Power BI:**
  - Slicing by Category forces the VertiPaq engine to traverse 3 sequential relational joins.
  - Slows down calculation response times.
  - Clutters the report authoring field list with dozens of tiny lookup tables.

---

## 3. Relationship Cardinality & Filter Propagation

### A. One-to-Many (\`1:*\`) Relationships
- The foundation of all clean models.
- **\`1\` side:** The Primary Key in the Dimension table (e.g. \`DimCustomer[CustomerID]\` has unique, deduplicated rows).
- **\`*\` side:** The Foreign Key in the Fact table (e.g. \`FactSales[CustomerID]\` can appear multiple times).

### B. Many-to-Many (\`*:*\`) Relationships
- Occurs when neither column contains unique values.
- **Risks:** Causes non-deterministic DAX results, performance degradation, and duplicate row calculations.
- **Solution:** Introduce an intermediate Bridge table (or deduplicated Dimension table) with 1-to-many relationships pointing to both target tables.

### C. Cross-Filter Direction: Single vs. Both
- **Single (Standard):** Filters propagate from the \`1-side\` (Dimension) down to the \`*-side\` (Fact).
- **Both (Bidirectional):** Filters propagate in both directions, allowing Fact selections to filter Dimension tables.
- **Dangers of Bidirectional Filtering:** Creates circular relationship ambiguity loops, unpredictably alters DAX measures, and causes dramatic memory spikes. Keep cross-filtering direction set to **Single**!

### D. Active vs. Inactive Relationships (Role-Playing Dimensions)
A table can have multiple foreign keys pointing to the same dimension (e.g. \`FactSales\` has \`OrderDate\`, \`ShipDate\`, and \`DueDate\`).
- Only **one** relationship can be marked as **Active** (solid line).
- The remaining relationships must be marked as **Inactive** (dashed lines).
- In DAX, you activate the inactive relationship dynamically using the \`USERELATIONSHIP()\` function!

\`\`\`dax
-- Active relationship calculates standard Order Date Sales:
Sales by Order Date = SUM(FactSales[SalesAmount])

-- Inactive relationship dynamically activated for Shipping analysis:
Sales by Ship Date = 
CALCULATE(
    [Sales by Order Date],
    USERELATIONSHIP(FactSales[ShipDateKey], DimDate[DateKey])
)
\`\`\`

> **Best Practice:** Hide all foreign key columns in your Fact tables from the Report View! Users should only ever slice by fields from Dimension tables, never raw foreign keys in Fact tables.

> **Common Mistake:** Leaving default bidirectional cross-filtering enabled on every relationship because "it seemed to make the slicers work". This introduces circular loops and degrades query performance.

> **Interview Tip:** Be ready to describe **Role-Playing Dimensions**: *"A role-playing dimension is a single dimension table that plays multiple business roles, like DimDate acting as Order Date, Ship Date, and Delivery Date. In Power BI, we implement this with one active and multiple inactive relationships, activating them on demand using CALCULATE and USERELATIONSHIP."*
`,
  },

  // ==========================================
  // CHAPTER 07
  // ==========================================
  {
    id: 'dax-fundamentals',
    number: 7,
    title: 'DAX Fundamentals',
    summary: 'Measures vs Calculated Columns, Evaluation Engine, and Core Aggregation Functions',
    contentMarkdown: `# Chapter 07: DAX Fundamentals

DAX (Data Analysis Expressions) is a functional, formula-based calculation language engineered specifically for Microsoft Tabular models and Power BI. While its syntax resembles Excel, its underlying evaluation engine operates on an entirely different set of mathematical principles based on relational algebra and columnar storage.

## 1. Measures vs. Calculated Columns vs. Calculated Tables

| Technical Dimension | Calculated Column | Explicit Measure |
| :--- | :--- | :--- |
| **When is it Evaluated?** | Evaluated row-by-row during **Data Refresh** | Evaluated on-the-fly dynamically when a **Visual Renders** |
| **RAM Storage Impact** | Stored permanently in VertiPaq RAM (Increases .pbix file size) | Consumes **0 MB** persistent storage (Zero file size impact) |
| **Evaluation Context** | Computed under **Row Context** | Computed under **Filter Context** |
| **Response to Slicers** | Static; does not change when users click slicers or filters | Fully dynamic; recalculates instantly based on active user filters |
| **Typical Use Cases** | Categorical attributes, matrix row headers, slicer fields | Quantitative metrics, financial KPIs, sums, averages, ratios |

> **Golden Rule of DAX:** Never build a Calculated Column when an Explicit Measure can achieve the same analytical goal!

---

## 2. Essential DAX Functions

### Safe Division with \`DIVIDE\`
Never use the standard forward slash (\`/\`) operator for division in production reports. The slash operator throws a division-by-zero error or returns infinity. Always use \`DIVIDE()\`:

\`\`\`dax
-- Production Best Practice:
Profit Margin = 
DIVIDE(
    [Total Profit],
    [Total Revenue],
    0 -- Safe alternate result if denominator is zero or blank
)
\`\`\`

### Aggregators vs. Row Iterators (\`SUM\` vs. \`SUMX\`)
- **\`SUM\` (Simple Column Aggregator):** Accepts only a single column reference. Scans the compressed column directly.
- **\`SUMX\` (Table Iterator):** Takes a table as its first argument, iterates row-by-row, computes a custom expression for each row, and then sums up the results.

\`\`\`dax
-- Simple Column Aggregator:
Total Units Sold = SUM(FactSales[Quantity])

-- Row Iterator: Multiplies UnitPrice by Quantity row-by-row, then aggregates:
Total Sales Amount = 
SUMX(
    FactSales,
    FactSales[Quantity] * FactSales[UnitPrice] * (1 - FactSales[DiscountRate])
)
\`\`\`

### Advanced Conditional Logic with \`SWITCH(TRUE())\`
Replace messy nested \`IF\` statements with clean, readable \`SWITCH(TRUE())\` blocks:

\`\`\`dax
Customer Loyalty Tier = 
SWITCH(
    TRUE(),
    [Total Revenue] >= 100000, "Platinum VIP",
    [Total Revenue] >= 50000,  "Gold Preferred",
    [Total Revenue] >= 10000,  "Silver Standard",
    "Bronze Entry"
)
\`\`\`

### Counting Functions: \`COUNT\` vs \`COUNTA\` vs \`COUNTROWS\` vs \`DISTINCTCOUNT\`
- **\`COUNT\`:** Counts numbers, dates, or strings in a single column (skips blanks).
- **\`COUNTA\`:** Counts any non-blank value (including booleans TRUE/FALSE).
- **\`COUNTROWS\`:** Fastest count function; counts physical rows in an entire table without evaluating individual column values.
- **\`DISTINCTCOUNT\`:** Computes unique distinct values in a column (e.g. unique active customers).

> **Best Practice:** Always organize all explicit measures inside a dedicated measure holding table (commonly named \`_Measures\`) and group related metrics into Display Folders (e.g. *"Financial KPIs"*, *"Time Intelligence"*).

> **Common Mistake:** Creating calculated columns in Fact tables to multiply Price * Quantity. On a 10-million-row table, this consumes hundreds of megabytes of RAM. Use a \`SUMX\` explicit measure instead!

> **Interview Tip:** Interviewers frequently ask: *"What is the difference between SUM and SUMX?"* Answer: *"SUM is an aggregator that works on a single numeric column reference. SUMX is an iterator function that accepts a table, establishes a row context, evaluates a mathematical expression row by row, and then sums the evaluated values across the table."*
`,
  },

  // ==========================================
  // CHAPTER 08
  // ==========================================
  {
    id: 'advanced-dax',
    number: 8,
    title: 'Advanced DAX & Evaluation Context',
    summary: 'Row Context, Filter Context, Context Transition & Enterprise Time Intelligence',
    contentMarkdown: `# Chapter 08: Advanced DAX & Evaluation Context

Mastering DAX requires understanding the underlying engine mechanics of **Filter Context**, **Row Context**, and **Context Transition**. Ninety-five percent of all DAX bugs stem from a misunderstanding of evaluation contexts.

[VISUAL: FILTER_CONTEXT]

## 1. Understanding Evaluation Contexts

### A. Filter Context
The set of active filters filtering the tabular data model when an expression is computed. Filter context is generated by:
- Slicer selections on the report page.
- Visual row headers and column headers (e.g. in a Matrix).
- Cross-filtering clicks on other charts on the canvas.
- Page-level and report-level filters in the Filters pane.
- Explicit filter parameters inside a \`CALCULATE()\` statement.

### B. Row Context
Row Context exists whenever an expression iterates through a table row-by-row (such as in a Calculated Column, or inside iterator functions like \`SUMX\`, \`AVERAGEX\`, and \`FILTER\`).
- **The Cardinal Rule:** Row Context only knows about the current row. **Row Context DOES NOT filter the data model!**

### C. Context Transition
Context Transition is the engine process where an existing **Row Context is automatically transformed into an equivalent Filter Context**.
- **What triggers Context Transition?** Wrapping an expression inside **\`CALCULATE()\`**!
- When \`CALCULATE()\` is invoked inside a row context, it takes all values of the current row and turns them into a filter context over all columns of that table.

---

## 2. The Power of \`CALCULATE()\`
\`CALCULATE()\` is the single most powerful function in DAX. It evaluates an expression under a modified filter context.

\`\`\`dax
-- Syntax: CALCULATE(<ScalarExpression>, <Filter1>, <Filter2>, ...)
European Sales = 
CALCULATE(
    [Total Sales Amount],
    DimGeography[Continent] = "Europe"
)
\`\`\`

### Filter Modifiers: \`ALL\` vs. \`ALLEXCEPT\` vs. \`ALLSELECTED\`

\`\`\`dax
-- ALL: Clears ALL filters from the column/table (Used for % of Total):
Category % of Total = 
DIVIDE(
    [Total Sales Amount],
    CALCULATE([Total Sales Amount], ALL(DimProduct[Category]))
)

-- ALLSELECTED: Clears visual grouping filters while RESPECTING user slicers:
Visual % of Selected = 
DIVIDE(
    [Total Sales Amount],
    CALCULATE([Total Sales Amount], ALLSELECTED())
)

-- ALLEXCEPT: Clears all filters EXCEPT the specified column:
Customer Lifetime Value = 
CALCULATE(
    [Total Sales Amount],
    ALLEXCEPT(FactSales, DimCustomer[CustomerID])
)
\`\`\`

---

## 3. Time Intelligence Functions in DAX
Time Intelligence allows analysts to manipulate temporal periods (Year-to-Date, Same Period Last Year, Moving 12-Month Averages).

### Strict Prerequisites for Time Intelligence:
1. Must have a dedicated, contiguous **Date Dimension Table** with no missing dates.
2. The Date column must be of type \`Date\`.
3. The table must be marked as the official Date Table (**Table Tools > Mark as Date Table**).

\`\`\`dax
-- 1. Year-to-Date (YTD) Revenue:
YTD Revenue = 
TOTALYTD(
    [Total Sales Amount],
    DimDate[Date]
)

-- 2. Same Period Last Year (SPLY) - Prior Year Comparison:
Revenue SPLY = 
CALCULATE(
    [Total Sales Amount],
    SAMEPERIODLASTYEAR(DimDate[Date])
)

-- 3. Year-over-Year (YoY) Growth %:
YoY Growth % = 
DIVIDE(
    [Total Sales Amount] - [Revenue SPLY],
    [Revenue SPLY],
    0
)

-- 4. Rolling 3-Month Trailing Average:
Rolling 3M Avg = 
CALCULATE(
    [Total Sales Amount],
    DATESINPERIOD(DimDate[Date], MAX(DimDate[Date]), -3, MONTH)
) / 3
\`\`\`

> **Best Practice:** Always declare DAX Variables using \`VAR\` and \`RETURN\`. Variables evaluate once eagerly, eliminate duplicate calculations, and make complex nested formulas clean to debug.

> **Common Mistake:** Calling Time Intelligence functions against standard transaction timestamps in Fact tables instead of referencing a marked continuous Date Dimension table.

> **Interview Tip:** When an interviewer asks *"What triggers Context Transition?"*, answer definitively: *"Context Transition is triggered when CALCULATE() or CALCULATETABLE() is evaluated within an active Row Context, converting the current row attributes into an equivalent filter context."*
`,
  },

  // ==========================================
  // CHAPTER 09
  // ==========================================
  {
    id: 'data-visualization',
    number: 9,
    title: 'Data Visualization Best Practices',
    summary: 'Chart Selection Matrix, Data-to-Ink Ratio, Cognitive Load & Visual Hierarchy',
    contentMarkdown: `# Chapter 09: Data Visualization Best Practices

Effective data visualization is not about decorating a canvas with colorful charts—it is the disciplined practice of minimizing cognitive friction so stakeholders can extract business insights within five seconds.

[VISUAL: DATA_VISUALIZATION]

## 1. Visual Selection Matrix

| Business Analytical Question | Primary Best Visual Choice | Alternative Visual | Visual Anti-Pattern to AVOID |
| :--- | :--- | :--- | :--- |
| **Trend Over Time** | Line Chart / Area Chart | Column Chart (if discrete months) | Pie Chart / Donut Chart |
| **Categorical Ranking** | Horizontal Clustered Bar Chart | Treemap (if many categories) | Radial Gauge / 3D Charts |
| **Part-to-Whole (2 to 3 items)** | 100% Stacked Bar Chart | Donut Chart (Max 3 slices) | 10-slice Pie Chart |
| **KPI Performance vs Target** | New Card Visual with Callout Accent | Bullet Chart | Cluttered Raw Table |
| **Correlation (Two Metrics)** | Scatter Plot | Bubble Chart (with size metric) | Dual-Axis Line Chart |
| **Hierarchical Root Cause** | Decomposition Tree | Waterfall Chart | Packed Bubble Chart |
| **Detailed Transaction Audit** | Matrix Visual (with search & totals) | Paginated Report | 30-column flat table |

---

## 2. Core UX Design Laws of Analytical Dashboards

### A. The Data-to-Ink Ratio (Edward Tufte's Law)
A large share of the visual pixels on a screen should be dedicated to displaying data information, not non-data clutter:
- Strip away heavy visual container borders, drop shadows, and dark backgrounds.
- Remove redundant horizontal grid lines and unnecessary axis labels when data labels are already enabled.
- Avoid repeating the currency symbol on every single data point—indicate units in the card title (\`Revenue ($ in Millions)\`).

### B. The 5-Second Executive Rule
An executive viewing the top of a report should understand three things within five seconds:
1. *Where are we now?* (Current KPI value).
2. *Are we doing well or poorly?* (Comparison against Target or Prior Year).
3. *What is driving the variance?* (Key trend or category driver).

### C. Intentional Color Theory & Accessibility
- **The Neutral Canvas:** Use neutral grays and slates for 80% of visual elements.
- **Single Strategic Accent:** Reserve your brand accent color (e.g. Amber or Sapphire Blue) to guide the reader's eye to the primary point of interest.
- **Semantic Colors with Purpose:** Use muted green exclusively for positive financial achievement, and muted rose/red exclusively for critical negative risks.
- **Color Blindness Compatibility:** Ensure sufficient contrast ratios (WCAG AA 4.5:1 minimum) and avoid relying solely on red-green hue differences without accompanying directional icons (▲ / ▼).

> **Best Practice:** Use horizontal clustered bar charts when displaying category names that have long text descriptions (like *"Cloud Infrastructure Licenses"*). Vertical column charts force category labels to angle or truncate.

> **Common Mistake:** Using pie charts with more than three slices. The human brain cannot accurately judge relative angles and area sizes; humans perceive length differences on horizontal bars with 10x greater accuracy.

> **Interview Tip:** If asked *"How do you design a dashboard for an executive versus an operational manager?"*, explain that executives require high Data-to-Ink ratio KPI summaries and variance indicators following the Z-pattern, whereas operational managers require detailed slicers, drillthrough pages, and transactional matrices.
`,
  },

  // ==========================================
  // CHAPTER 10
  // ==========================================
  {
    id: 'dashboard-design-ux',
    number: 10,
    title: 'Dashboard Design & Interactive UX',
    summary: 'Layout Principles, Bookmarks, Navigation Panels, Custom Tooltip Pages & Wireframing',
    contentMarkdown: `# Chapter 10: Dashboard Design & Interactive UX

Transforming a collection of disjointed charts into an intuitive, polished software application requires intentional layout architecture and modern interaction patterns.

[VISUAL: DASHBOARD_MOCKUP]

## 1. Information Architecture & The 3-Tier Dashboard Hierarchy

Professional enterprise BI projects structure reporting into three distinct levels:
1. **Tier 1: Strategic Executive Summary (High Altitude):**
   - Focus: High-level organization health, headline KPIs, quarterly variance.
   - Consumers: CEO, CFO, Board of Directors.
   - Interactions: Minimal slicers; clean callout metrics.
2. **Tier 2: Tactical Operational Drilldown (Mid Altitude):**
   - Focus: Performance by region, channel, product category, and campaign.
   - Consumers: Regional Directors, Operations Managers.
   - Interactions: Interactive slicers, time-trend decomposition, cross-filtering.
3. **Tier 3: Granular Transactional Audit (Low Altitude):**
   - Focus: Individual invoice records, customer ledger lines, ticket logs.
   - Consumers: Auditors, Analysts, Customer Support Leads.
   - Interactions: Dense Matrix grids, drillthrough navigation, Excel data export.

---

## 2. Mastering Bookmarks & The Selection Pane

Bookmarks capture the current state of a report page—including visual visibility, slicer filters, spotlight focus, and sort orders.

### High-Impact Bookmark Design Patterns:
- **1. Collapsible Slicer Panel (Slide-Out Drawer):**
  - Keeps complex slicers hidden off-screen inside a sliding panel, maximizing canvas space for core analytics.
  - Clicking a "Filter" button toggles visual visibility via bookmarks.
- **2. Visual Switcher (Toggle View):**
  - Allows users to switch between a Bar Chart view and a Detailed Table view using a single clean toggle button.
- **3. Reset All Filters Button:**
  - Resets all slicers, filters, and spotlight states back to default with one click.

### Critical Bookmark Configuration:
When creating UI navigation bookmarks:
- In the Bookmark options context menu, **UNCHECK "Data"**!
- If "Data" remains checked, clicking the bookmark will wipe out any filter selections the user previously made on the report!

---

## 3. Custom Report Page Tooltips
Replace boring default system tooltips with graphical mini drill-down cards:
1. Create a new canvas tab and configure **Page Information > Allow Use as Tooltip = ON**.
2. Set **Canvas Settings > Type = Tooltip** (typically 320px x 240px).
3. Design a compact visual (e.g. 6-month historical sparkline and top 3 product breakdown).
4. On the parent chart visual, navigate to **Format Visual > General > Tooltips > Type = Report Page** and select the tooltip page.

> **Best Practice:** When publishing a report with custom tooltip pages or drillthrough destination pages, always right-click those tabs in Power BI Desktop and select **"Hide Page"** so they do not clutter user navigation tabs in Power BI Service!

> **Common Mistake:** Leaving "Data" checked on UI navigation bookmarks, causing users' active slicer selections to reset every time they switch tabs or open a drawer.

> **Interview Tip:** Be prepared to describe how to build a collapsible slicer panel: *"I create a grouping of slicers and a container shape in the Selection pane, then create two bookmarks—one with the group visible, one hidden—and attach them to bookmark buttons, ensuring 'Data' is unchecked so user selections persist."*
`,
  },

  // ==========================================
  // CHAPTER 11
  // ==========================================
  {
    id: 'filters-and-interactions',
    number: 11,
    title: 'Filters & User Interaction',
    summary: 'Filter Scopes, Sync Slicers, Drillthrough Pages & Edit Interactions',
    contentMarkdown: `# Chapter 11: Filters & User Interaction

Interactive exploration is what makes Power BI superior to static PDFs. Controlling how user selections propagate across the canvas prevents user confusion and maintains analytical integrity.

## 1. The Three Filter Scopes in Power BI
- **Visual-Level Filters:** Constrain data for a single specific chart (e.g. filtering a bar chart to display only *"Top 5 Products by Sales"*).
- **Page-Level Filters:** Filter all visuals residing on the currently active canvas tab.
- **Report-Level (All Pages) Filters:** Persist across every single page and tab in the entire \`.pbix\` report file (e.g. global corporate filter for \`FiscalYear = 2025\`).

---

## 2. Edit Interactions: Filtering vs. Highlighting vs. None

By default, when a user clicks a bar on Visual A, Power BI **Cross-Highlights** Visual B (dimming unselected proportions of bars).
- **Cross-Highlighting:** Often looks visually messy, especially on dense charts and matrices.
- **Cross-Filtering:** Much cleaner! Causes Visual B to re-aggregate and display only the filtered subset.
- **None:** Completely isolates Visual B from being affected by clicks on Visual A.

### How to Adjust Edit Interactions:
1. Select the source visual on the canvas.
2. In the top ribbon, click the **Format** tab.
3. Click **Edit Interactions**.
4. Small icons (Filter / Highlight / None) appear above every other visual on the page; click the desired icon.

---

## 3. Sync Slicers Across Pages
When reports span multiple thematic tabs (e.g. *"Sales Overview"*, *"Regional Breakdown"*, *"Inventory Status"*), users should not have to re-select their filters on every page.
- Open **View > Sync Slicers**.
- The Sync Slicers pane displays two columns for every page:
  - **Sync (Refresh Icon):** Ensures selecting a filter on Page 1 automatically updates Page 2.
  - **Visible (Eye Icon):** Controls whether the physical slicer widget is displayed on that page.

---

## 4. Cross-Page Drillthrough Navigation
Drillthrough allows stakeholders to right-click a specific data point (e.g. a customer name) and jump to a specialized detail page pre-filtered for that customer:
1. Create the destination target page (e.g. \`Customer Deep-Dive\`).
2. Drag \`DimCustomer[CustomerKey]\` into the **Drillthrough > Add Drillthrough Fields** well.
3. Power BI automatically adds a "← Back" button to the canvas.
4. Users can now right-click any chart in the report displaying customer data and select **Drill through > Customer Deep-Dive**.

> **Best Practice:** Configure Edit Interactions to set all visuals to **Filter** rather than the default **Highlight**. Cross-filtering provides a cleaner, more predictable UX.

> **Common Mistake:** Putting 15 individual slicer controls directly on a dashboard canvas. Use the Sync Slicers pane to synchronize global filters in a collapsible drawer.

> **Interview Tip:** If asked *"How do you pass context from an executive overview to an operational ledger?"*, explain the setup of **Drillthrough Fields**, which allows users to right-click summary points and jump to filtered detail tabs.
`,
  },

  // ==========================================
  // CHAPTER 12
  // ==========================================
  {
    id: 'power-bi-service',
    number: 12,
    title: 'Power BI Service & Governance',
    summary: 'Workspaces, Apps, Scheduled Refresh, Enterprise Gateways & Deployment Pipelines',
    contentMarkdown: `# Chapter 12: Power BI Service & Governance

The Power BI Service is the enterprise cloud portal (hosted on Microsoft Azure) where reports are published, refreshed automatically, governed securely, and distributed to thousands of business stakeholders.

## 1. Workspaces vs. Power BI Apps

| Feature Dimension | Power BI Workspaces (Development Sandbox) | Power BI Apps (Production Packaging) |
| :--- | :--- | :--- |
| **Target Audience** | Content creators, data modelers, report engineers | Business consumers, executives, operational staff |
| **Permissions** | Admin, Member, Contributor, Viewer roles | Read-only consumption with optional build permissions |
| **Editing Impact** | Edits occur live and are immediately visible to viewers | Staged updates: changes stay private until the app is "Updated" |
| **Audience Segmentation** | Single shared workspace view for all members | Multiple audience groups can see custom navigation sub-trees |

### Workspace Role Hierarchy:
- **Admin:** Full control (manage members, delete workspace, configure gateways).
- **Member:** Can add members, publish content, create and update apps.
- **Contributor:** Can publish and edit reports and datasets; cannot update apps or modify workspace membership.
- **Viewer:** Read-only access to reports and dashboards; cannot modify data or view underlying datasets unless granted.

---

## 2. On-Premises Data Gateways

When source data is stored on local servers behind corporate firewalls (SQL Server, Oracle, internal file shares), the cloud Power BI Service cannot reach it directly. The Data Gateway acts as a secure reverse-proxy bridge.

### Gateway Types:
1. **Personal Gateway:**
   - Runs as an application under a single Windows user profile.
   - Only works when that specific user is logged in.
   - Does NOT support DirectQuery; supports only scheduled refresh for personal testing.
2. **Standard (Enterprise) Gateway:**
   - Installed as a continuous Windows Service on a dedicated server.
   - Serves multiple users, multiple data sources, and supports DirectQuery pass-through.
   - Supports **Gateway Clusters** for high availability, automatic failover, and load balancing.
   - Outbound communication only over TLS ports 443, 5671, and 5672—no open inbound firewall ports required!

---

## 3. Incremental Refresh
For enterprise tables containing tens of millions of rows, running a full data refresh every night is inefficient and prone to timeouts.

### How Incremental Refresh Works:
- In Power Query, define two reserved parameters: \`RangeStart\` and \`RangeEnd\` (type \`DateTime\`).
- Filter the Fact table date column between \`RangeStart\` and \`RangeEnd\`.
- In Power BI Desktop, right-click the Fact table and select **Incremental Refresh**.
- Define your retention and refresh policy: e.g. store **5 Years** of historical data, but refresh only the last **7 Days** of data!
- When deployed to Service, VertiPaq partitions the table: historical partitions remain locked, and only the newest partition is refreshed in seconds.

> **Best Practice:** Decouple your Data Modeling from your Visual Reporting! Build one centralized master Semantic Model, publish it to a secure workspace, and have all business analysts connect to it via **Live Connection (Thin Reports)**.

> **Common Mistake:** Publishing reports directly to "My Workspace" for corporate distribution. Always use dedicated, role-governed App Workspaces!

> **Interview Tip:** If asked *"How do you configure Incremental Refresh?"*, state that you first create the RangeStart and RangeEnd DateTime parameters in Power Query, ensure Query Folding is functional on the date filter, and then configure the historical archive vs. refresh window policy in Desktop.
`,
  },

  // ==========================================
  // CHAPTER 03
  // ==========================================
  {
    id: 'security-in-power-bi',
    number: 13,
    title: 'Security in Power BI (RLS vs OLS)',
    summary: 'Static vs Dynamic Row-Level Security, Object-Level Security & Tenant Data Privacy',
    contentMarkdown: `# Chapter 03: Security in Power BI (RLS vs OLS)

Data governance requires ensuring that stakeholders only see the specific rows and columns they are legally authorized to inspect.

[VISUAL: DYNAMIC_RLS]

## 1. Row-Level Security (RLS)

### Static RLS (Manual Hardcoded Roles)
- Roles are created manually in Power BI Desktop (e.g. \`North_America_Sales\`, \`EMEA_Sales\`).
- Filter expression: \`DimGeography[Region] = "North America"\`.
- High maintenance overhead: adding 50 new store managers requires creating 50 separate roles and manually maintaining them in the Service!

### Dynamic RLS (Enterprise Best Practice)
Dynamic RLS uses DAX security functions to evaluate the identity of the currently logged-in user at runtime:
- **\`USERPRINCIPALNAME()\`:** Returns the Azure Active Directory user email (e.g. \`sarah.connor@enterprise.com\`).
- **\`USERNAME()\`:** Returns domain\\username in Desktop, or user email in Service.

### Dynamic RLS Implementation Steps:
1. Create a security table (\`DimUserSecurity\`) containing user corporate emails and territory keys.
2. Establish a **1-to-many relationship** from \`DimUserSecurity\` to the relevant Dimension or Fact table.
3. In Power BI Desktop, navigate to **Modeling > Manage Roles** and create a single unified role (e.g. \`DynamicTerritorySecurity\`):

\`\`\`dax
-- Dynamic RLS DAX Rule on DimUserSecurity table:
DimUserSecurity[UserEmail] = USERPRINCIPALNAME()
\`\`\`

4. In Power BI Desktop, test the rule using **Modeling > View as Roles > Other User**.
5. Once published to Service, open dataset Security and assign your corporate **Azure AD Security Group** to the role!

---

## 2. Object-Level Security (OLS)
While RLS restricts access to *rows*, Object-Level Security (OLS) hides entire *tables* or *sensitive columns* (e.g. Executive Salaries, Social Security Numbers) from specific user groups.

### Key Aspects of OLS:
- Cannot be configured inside the standard Power BI Desktop UI; requires **Tabular Editor** via XMLA Read/Write endpoints.
- If an unauthorized user opens a visual referencing an OLS-restricted column, the visual displays a clean notification stating that the field is unavailable, preventing metadata leaks.

---

## 3. Data Privacy Levels in Power Query
To prevent data from leaking across untrusted external servers during ETL mashups, Power Query enforces Data Privacy Levels:
- **Public:** Publicly available internet data.
- **Organizational:** Internal corporate data visible across the organization.
- **Private:** Highly sensitive, confidential data.
- **Formula.Firewall Error:** Occurs when an M query attempts to merge a Private source with an external Public source. Resolved by staging queries properly or configuring privacy levels.

> **Best Practice:** In production, always map Dynamic RLS to **Azure Active Directory (AD) Security Groups**, never individual user emails. When employees join or leave, IT updates Azure AD and Power BI permissions sync automatically.

> **Common Mistake:** Forgetting that Workspace Admins, Members, and Contributors bypass RLS! RLS is strictly enforced only on users with the **Viewer** role or users accessing the report through a Power BI App.

> **Interview Tip:** When asked *"What is the difference between RLS and OLS?"*, answer clearly: *"RLS restricts row access within a table based on user attributes, whereas OLS restricts table or column access entirely, hiding sensitive fields like compensation data using Tabular Editor."*
`,
  },

  // ==========================================
  // CHAPTER 14
  // ==========================================
  {
    id: 'performance-optimization',
    number: 14,
    title: 'Performance Optimization & Troubleshooting',
    summary: 'Performance Analyzer, DAX Studio, VertiPaq Cardinality Tuning & Engine Diagnostics',
    contentMarkdown: `# Chapter 14: Performance Optimization & Troubleshooting

When a dashboard takes more than three seconds to render, user adoption plummets. Senior BI engineers use systematic diagnostic profiling to eliminate bottlenecks.

[VISUAL: PERFORMANCE_ANALYZER]

## 1. Using Performance Analyzer
To diagnose why a page loads slowly:
1. Open Power BI Desktop and navigate to the slow tab.
2. Go to **View > Performance Analyzer > Start Recording > Refresh Visuals**.
3. Expand the visuals with the highest millisecond duration.

### Duration Breakdown:
- **DAX Query:** Time spent in the Tabular Engine calculating values. (If high: optimize DAX formulas or schema relationships).
- **Visual Display:** Time spent by the browser DOM engine rendering SVG shapes and HTML elements. (If high: reduce total data points or visuals).
- **Other (Wait Time):** Queuing latency caused by too many visuals competing for engine worker threads.

---

## 2. VertiPaq Engine Mechanics: The Cardinality Enemy
The VertiPaq columnar engine compresses data by building internal dictionary indexes.
- **Cardinality:** The number of unique, distinct values in a column.
- **Why High Cardinality Destroys Performance:**
  - A column with low cardinality (e.g. \`Gender\` with 2 unique values) compresses into almost zero bytes.
  - A column with high cardinality (e.g. a datetime column with seconds \`2026-04-12 14:22:18\` with 10 million unique values) requires millions of dictionary pointers, consuming gigabytes of RAM!

### The Datetime Splitting Technique:
Always split combined datetime stamps into two separate columns in Power Query:
1. \`OrderDate\` (Date only)
2. \`OrderTime\` (Hour/Minute only)
This simple transformation often reduces model memory size by **80% to 90%**!

---

## 3. Top 10 Enterprise Optimization Rules

1. **Turn OFF Auto Date/Time:** In **File > Options > Data Load**, uncheck "Auto Date/Time". This removes dozens of hidden automatic calendar tables created behind the scenes.
2. **Remove Unused Columns:** Audit models using DAX Studio. If a column is not used in relationships, slicers, or measures, delete it in Power Query!
3. **Limit Visuals per Page:** Keep each canvas to 5–8 high-impact charts. Avoid placing 20 individual KPI cards on a single tab.
4. **Enforce Star Schemas Exclusively:** Eliminate snowflake chains and many-to-many relationships.
5. **Disable Bidirectional Filtering:** Set cross-filter directions strictly to Single.
6. **Use Explicit Measures with Variables (VAR):** Variables cache results and prevent recalculation.
7. **Verify Query Folding:** Ensure heavy filtering occurs upstream on the database server.
8. **Avoid Calculated Columns for Metrics:** Replace with explicit measures.
9. **Set Slicer Options to "Apply" Button:** On large datasets, enable the "Apply all slicers" button so queries execute once after all filters are chosen.
10. **Profile with DAX Studio:** Inspect SE (Storage Engine) vs FE (Formula Engine) execution splits. Aim for 80%+ Storage Engine processing.

> **Best Practice:** Download and run **DAX Studio** (free external tool). Connect to your running Power BI Desktop instance and run **Advanced > View Metrics (VertiPaq Analyzer)** to instantly see table sizes, column memory usage, and dictionary sizes.

> **Common Mistake:** Leaving high-precision decimal numbers or transactional GUID keys in the data model. Strip unnecessary decimals to maximize integer compression.

> **Interview Tip:** If asked *"Walk me through how you optimize a slow report"*, answer with a structured 4-step framework: 1) Measure with Performance Analyzer, 2) Profile DAX in DAX Studio, 3) Audit model with VertiPaq Analyzer to eliminate high-cardinality columns, 4) Verify Query Folding in Power Query.
`,
  },

  // ==========================================
  // CHAPTER 15
  // ==========================================
  {
    id: 'real-time-project-workflow',
    number: 15,
    title: 'Real-Time Business Project Lifecycle',
    summary: 'The Complete 8-Phase Enterprise Delivery Framework from Discovery to Handover',
    contentMarkdown: `# Chapter 15: Real-Time Business Project Lifecycle

How Fortune 500 business intelligence teams execute production analytics projects from initial stakeholder discovery to enterprise deployment.

## The 8-Phase Enterprise Delivery Framework

### Phase 1: Stakeholder Discovery & KPI Blueprint
- Conduct stakeholder interviews with business sponsors.
- Document the **KPI Dictionary**:
  - Define precise business formulas (e.g. *"What is an 'Active Customer'?"*).
  - Define data refresh frequency SLAs (Daily, Hourly, Real-time).
- Secure sign-off on visual wireframes before writing any code.

### Phase 2: Technical Architecture & Connectivity
- Audit source schema integrity, primary keys, and data cleanliness.
- Select connectivity storage mode (Import vs DirectQuery vs Composite).
- Verify database permissions, service accounts, and network access.

### Phase 3: Data Transformation in Power Query
- Extract source tables following Roche's Maxim.
- Standardize naming conventions (e.g. clean business names without underscores).
- Verify Query Folding on large relational sources.
- Uncheck "Enable Load" on technical staging queries.

### Phase 4: Dimensional Modeling & Schema Design
- Separate data into clean Fact and Dimension tables.
- Establish 1-to-many relationships with single cross-filter direction.
- Mark official continuous Date Table.
- Hide all foreign key IDs in Fact tables.

### Phase 5: DAX Measure Engineering
- Organize explicit measures into a dedicated \`_Measures\` holding table.
- Implement core aggregations, safe ratios using \`DIVIDE()\`, and Time Intelligence calculations.
- Use \`VAR\` and \`RETURN\` syntax for clean execution.

### Phase 6: UI/UX Wireframing & Canvas Authoring
- Implement the Z-Pattern visual layout.
- Standardize colors using a corporate JSON theme palette.
- Configure interactive features: collapsible slicers, bookmarks, drillthrough tabs, and custom tooltips.
- Design the mobile portrait layout for smartphone consumption.

### Phase 7: Data Validation, Financial Reconciliation & QA
- Reconcile numbers directly against source ERP, financial general ledgers, and audited statements.
- Test Dynamic RLS using "View as Roles" for all user personas.
- Profile page rendering with Performance Analyzer.

### Phase 8: Deployment Pipelines & Handover
- Publish to Development Workspace in Power BI Service.
- Configure Enterprise Data Gateway credentials and automated Scheduled Refresh.
- Promote content through **Deployment Pipelines** (Dev ➔ Test ➔ Prod).
- Package final assets into a Power BI App and conduct user training.

> **Best Practice:** Never build a single visual until the business sponsor has signed off on the KPI Dictionary. Ambiguity in metric definitions (e.g. calculating Churn Rate on calendar months vs rolling 30 days) causes rework later.

> **Common Mistake:** Developing directly in the Production workspace. Always stage changes in Development and Test workspaces before updating production apps.

> **Interview Tip:** When asked *"Tell me about your end-to-end process when building a Power BI project"*, walk through these exact eight phases to demonstrate enterprise-grade engineering maturity.
`,
  },

  // ==========================================
  // CHAPTER 16
  // ==========================================
  {
    id: 'interview-questions',
    number: 16,
    title: 'Top 20 Power BI Interview Questions',
    summary: 'The Most Frequently Asked Technical Questions with Model Answers & Architecture Checks',
    contentMarkdown: `# Chapter 16: Top 20 Power BI Interview Questions

Master these technical interview questions to excel in Data Analyst, BI Developer, and Analytics Engineer interviews.

[VISUAL: TOP_20_QUESTIONS]

### Quick Review Summary of Top 20 Questions:
1. **Measure vs Calculated Column:** Measures compute on-the-fly under Filter Context with 0 MB RAM footprint; Calculated Columns compute during refresh under Row Context and consume permanent RAM.
2. **Query Folding:** Translation of M transformation steps into native source SQL queries to maximize speed and enable incremental refresh.
3. **CALCULATE & Context Transition:** Modifies filter context and converts row context into equivalent filter context.
4. **ALL vs ALLEXCEPT vs ALLSELECTED:** ALL clears all filters; ALLEXCEPT preserves specified columns; ALLSELECTED clears visual grouping while preserving slicers.
5. **Star vs Snowflake Schema:** Star schema provides 1-hop joins, superior VertiPaq dictionary compression, and simpler DAX compared to multi-hop normalized snowflakes.
6. **Dynamic RLS:** Implemented via user mapping tables and \`USERPRINCIPALNAME()\` DAX rules assigned to Azure AD security groups.
7. **DirectQuery Limitations:** Latency, source database workload, restricted DAX functions, and 1-million-row limit.
8. **SUM vs SUMX:** SUM is a simple column aggregator; SUMX is an iterator that evaluates expressions row-by-row before summing.
9. **Bidirectional Filtering Hazards:** Causes circular relationship loops, ambiguous DAX filter propagation, and performance degradation.
10. **Performance Optimization:** Performance Analyzer profiling, DAX Studio SE/FE inspection, removing high-cardinality datetime columns, and disabling Auto Date/Time.
11. **Live Connection vs DirectQuery:** Live Connection connects strictly to pre-modeled Analysis Services with modeling disabled in Desktop; DirectQuery translates queries to relational SQL.
12. **VertiPaq Engine Compression:** Utilizes Value encoding, Hash/Dictionary encoding, and Run-Length Encoding (RLE).
13. **EARLIER vs Variables (VAR):** Variables evaluate eagerly, cache results, and replace clumsy nested EARLIER row-context lookups.
14. **Role-Playing Dimensions:** Handled via multiple relationships from Fact to Date, activating inactive relationships with \`USERELATIONSHIP()\`.
15. **Personal vs Standard Gateway:** Personal runs under a user profile with scheduled refresh only; Standard runs as a Windows service supporting multiple users, DirectQuery, and clusters.
16. **Object-Level Security (OLS):** Configured in Tabular Editor via XMLA endpoints to hide entire tables or sensitive columns from unauthorized roles.
17. **Composite Models & Dual Storage:** Combines Import and DirectQuery tables; Dual storage allows dimensions to serve both without cross-mode penalties.
18. **Incremental Refresh:** Configured using RangeStart and RangeEnd DateTime parameters in Power Query.
19. **Dashboard vs Report:** Reports are multi-page interactive canvases with slicers; Dashboards are single-page executive overviews pinning tiles from multiple reports with natural language Q&A.
20. **Circular Dependency in DAX:** Resolved by converting calculated columns to measures, using ALLEXCEPT/REMOVEFILTERS, or moving transforms upstream to Power Query.

> **Interview Tip:** Never answer interview questions with simple one-sentence definitions. Always provide: 1) The technical definition, 2) The architectural engine reason, and 3) A real-world production example from your experience.
`,
  },

  // ==========================================
  // CHAPTER 17
  // ==========================================
  {
    id: 'best-practices-and-mistakes',
    number: 17,
    title: 'Best Practices & Common Mistakes',
    summary: 'Production Anti-Patterns to Avoid and Senior Engineering Checklists',
    contentMarkdown: `# Chapter 17: Best Practices & Common Mistakes

Avoiding architectural anti-patterns is what separates junior dashboard creators from senior BI engineers.

## Top 10 Anti-Patterns to AVOID

| Anti-Pattern | Why It Harms the Application | Production Solution |
| :--- | :--- | :--- |
| **1. The Single Flat Table Trap** | Ingesting a single wide 80-column Excel sheet instead of modeling into Fact and Dimensions | Split into Star Schema with Fact and Dimension tables in Power Query |
| **2. Leaving Auto Date/Time ON** | Creates hidden automatic date hierarchies for every single date column, bloating file size by megabytes | Turn off Auto Date/Time in Options; build an explicit Date Table |
| **3. Using Implicit Measures** | Dragging raw columns into visual wells; leads to inconsistent definitions and cannot be reused | Write explicit DAX measures for every calculation |
| **4. Bidirectional Cross-Filtering Everywhere** | Creates circular relationship paths, ambiguous filter contexts, and slow calculations | Keep cross-filter directions set strictly to **Single** |
| **5. High-Precision Timestamps** | Leaving seconds or milliseconds in date columns destroys VertiPaq dictionary compression | Split datetime into separate Date and Time columns in Power Query |
| **6. Overcrowded Visual Canvases** | Placing 15+ visuals on a tab causes browser rendering lag and cognitive overload | Limit canvas to 5–8 high-impact charts; use tabs and bookmarks |
| **7. Neglecting Mobile Layout** | Executives viewing dashboards on smartphones see tiny unreadable desktop pages | Configure dedicated portrait layouts in Mobile View |
| **8. Performing Heavy ETL in DAX** | Writing calculated columns for string splits or type conversions consumes uncompressed RAM | Move transformations upstream to Power Query or SQL |
| **9. Publishing to "My Workspace"** | When the employee leaves the company, reports become orphaned and unmaintainable | Always use dedicated, role-governed App Workspaces |
| **10. Hardcoding Filter Values in DAX** | Writing fixed currency or year values in measures requires manual code updates every fiscal year | Use dynamic Date dimensions and Time Intelligence functions |

---

## The Senior BI Engineer Production Checklist

- [x] **Roche's Maxim Applied:** Transformations pushed as far upstream as possible.
- [x] **Query Folding Verified:** Native query active on all large relational queries.
- [x] **Star Schema Enforced:** Relationships are 1-to-many with single cross-filter direction.
- [x] **Auto Date/Time Disabled:** Centralized explicit Date Dimension marked as official Date Table.
- [x] **Measure Hygiene:** All calculations written as explicit measures inside a \`_Measures\` folder.
- [x] **Safe Math Enforced:** All division operations wrapped in \`DIVIDE()\`.
- [x] **Foreign Keys Hidden:** Technical IDs in Fact tables hidden from report field list.
- [x] **Performance Profiled:** Performance Analyzer verified under 1.5 seconds per visual.
- [x] **Dynamic RLS Tested:** Tested via "View as Roles" with Azure AD group assignment.
- [x] **Mobile Layout Configured:** Portrait mode designed for mobile consumption.

> **Best Practice:** Establish strict DAX naming conventions across your team: always include the table name when referencing a column (\`FactSales[SalesAmount]\`), and NEVER include the table name when referencing an explicit measure (\`[Total Sales]\`). This ensures anyone reading the code instantly knows whether an identifier is a column or a measure!

> **Common Mistake:** Leaving default visual titles like *"Sum of SalesAmount by RegionName and CategoryName"*. Rename all visual titles to clean, human-readable executive headings.
`,
  },

  // ==========================================
  // CHAPTER 18
  // ==========================================
  {
    id: 'cheat-sheet-roadmap',
    number: 18,
    title: 'Power BI Cheat Sheet & 6-Week Roadmap',
    summary: 'Quick Reference Syntax, Keyboard Shortcuts, and Structured Learning Path for PL-300',
    contentMarkdown: `# Chapter 18: Power BI Cheat Sheet & 6-Week Roadmap

Your quick-reference summary for daily development and Microsoft PL-300 Certification preparation.

[VISUAL: ROADMAP_TIMELINE]

## 1. Quick DAX Formula Cheat Sheet

\`\`\`dax
-- Safe Ratio
Margin % = DIVIDE([Profit], [Revenue], 0)

-- Year-To-Date Aggregation
YTD_Sales = TOTALYTD([Total Sales], DimDate[Date])

-- Prior Year Comparison
Sales_SPLY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(DimDate[Date]))

-- Year-over-Year Growth %
YoY_Growth % = 
VAR CurrentSales = [Total Sales]
VAR PriorSales = [Sales_SPLY]
RETURN
DIVIDE(CurrentSales - PriorSales, PriorSales, 0)

-- Percentage of Total (Clears Category Filter)
Pct_Of_Total = 
DIVIDE(
    [Total Sales],
    CALCULATE([Total Sales], ALL(DimProduct[Category]))
)

-- Visual Selection Percentage (Respects Slicers)
Pct_Of_Selected = 
DIVIDE(
    [Total Sales],
    CALCULATE([Total Sales], ALLSELECTED())
)

-- Inactive Relationship Activation
Sales_By_ShipDate = 
CALCULATE(
    [Total Sales],
    USERELATIONSHIP(FactSales[ShipDateKey], DimDate[DateKey])
)

-- Dynamic Categorization
Status_Group = 
SWITCH(
    TRUE(),
    [Profit Margin] > 0.25, "High Margin",
    [Profit Margin] > 0.10, "Target Margin",
    "Underperforming"
)
\`\`\`

---

## 2. Essential Power BI Desktop Keyboard Shortcuts

| Shortcut Key | Action Performed |
| :--- | :--- |
| **Ctrl + Click** | Select multiple visual elements or multi-select slicer items |
| **Ctrl + Shift + L** | Format DAX code in DAX Studio / formula editor |
| **Shift + Enter** | Insert a clean line break in DAX formula bar |
| **Alt + Shift + F** | Auto-format DAX formula query |
| **Ctrl + C / Ctrl + V** | Duplicate visual with all formatting preserved |
| **Ctrl + G** | Group selected visuals together in Selection Pane |
| **F5** | Refresh report page visuals |

---

## 3. Microsoft PL-300 Certification Exam Guide

The Microsoft Certified: Power BI Data Analyst Associate (PL-300) exam tests four core skill domains:
1. **Prepare the Data (25–30%):** Ingest data, Power Query M transforms, Query Folding, parameters.
2. **Model the Data (25–30%):** Star Schema, relationships, DAX measures, Time Intelligence, RLS.
3. **Visualize and Analyze the Data (25–30%):** Visual selection, bookmarks, custom tooltips, mobile layout.
4. **Deploy and Maintain Assets (15–20%):** Workspaces, apps, scheduled refresh, enterprise gateways.

> **Certification Tip:** On the PL-300 exam, questions focusing on Query Folding, Star Schemas, and the difference between ALL and ALLSELECTED appear in almost every test session! Review Chapters 5, 6, and 8 thoroughly before taking the test.

> **Best Practice:** Practice writing DAX daily. Build real end-to-end projects with public datasets (such as Contoso or AdventureWorks) to solidify these concepts into muscle memory.
`,
  },
];

export const POWER_BI_TUTORIAL: Tutorial = {
  id: 'tut_powerbi_notes_01',
  slug: 'power-bi-notes-and-cheat-sheet',
  title: 'Power BI Notes & Cheat Sheet',
  description: 'Comprehensive 18-chapter master guide and cheat sheet covering Power Query, Data Modeling, DAX formulas, Power BI Service, RLS, and interview preparation.',
  category: 'Power BI',
  readTime: '45 min read',
  published: true,
  featured: true,
  views: 38450,
  tags: ['Power BI', 'DAX', 'Power Query', 'Data Modeling', 'Cheat Sheet', 'Business Intelligence'],
  contentMarkdown: POWER_BI_CHAPTERS[0].contentMarkdown,
  chapters: POWER_BI_CHAPTERS,
  createdAt: '2026-01-15T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
};
