import React, { useState } from 'react';
import {
  Database,
  Server,
  Smartphone,
  Cloud,
  Layers,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Cpu,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  Maximize2,
  Table,
  Zap,
  Globe,
  Sliders,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// ==========================================
// 1. Chapter 02: Power BI Ecosystem Architecture
// ==========================================
export const EcosystemDiagram: React.FC = () => {
  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h4 className="text-sm font-bold tracking-wider uppercase text-amber-300 font-mono">
            Interactive Architecture Diagram: Power BI Ecosystem
          </h4>
        </div>
        <span className="text-xs font-mono text-slate-500">Native SVG & Grid Component</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
        {/* Authoring Phase */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex flex-col justify-between relative shadow-lg group hover:border-amber-400 transition-all">
          <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] uppercase font-mono tracking-wider">
            1. Authoring Layer
          </div>
          <div>
            <div className="flex items-center gap-3 mt-1 mb-3">
              <div className="p-2.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Power BI Desktop</h5>
                <span className="text-[11px] text-amber-400/80 font-mono">Free Windows Application</span>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 mt-2 font-sans">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Power Query:</strong> ETL & M transformations</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>VertiPaq Engine:</strong> In-memory columnar storage</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>DAX Modeling:</strong> Calculated measures & KPIs</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>File Outputs:</strong> .pbix & .pbip developer format</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Local RAM Compute</span>
            <span className="text-emerald-400 font-bold">100% Free</span>
          </div>
        </div>

        {/* Cloud & Governance Phase */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-col justify-between relative shadow-lg group hover:border-cyan-400 transition-all">
          <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase font-mono tracking-wider">
            2. Cloud Collaboration & SaaS
          </div>
          <div>
            <div className="flex items-center gap-3 mt-1 mb-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Power BI Service (Fabric)</h5>
                <span className="text-[11px] text-cyan-400/80 font-mono">Azure Cloud SaaS Platform</span>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 mt-2 font-sans">
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Workspaces & Apps:</strong> Team sharing & packaging</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Scheduled Refresh:</strong> Automated data pipeline sync</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Enterprise Security:</strong> Dynamic RLS & Azure AD</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Deployment Pipelines:</strong> Dev → Test → Prod lifecycle</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Cloud Azure Elastic</span>
            <span className="text-cyan-300 font-bold">Pro / PPU / Fabric</span>
          </div>
        </div>

        {/* Consumption & Distribution */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-purple-500/30 flex flex-col justify-between relative shadow-lg group hover:border-purple-400 transition-all">
          <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-purple-500 text-slate-950 font-bold text-[10px] uppercase font-mono tracking-wider">
            3. Consumption Channels
          </div>
          <div>
            <div className="flex items-center gap-3 mt-1 mb-3">
              <div className="p-2.5 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">End-User Endpoints</h5>
                <span className="text-[11px] text-purple-400/80 font-mono">Multi-Platform Access</span>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 mt-2 font-sans">
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>Power BI Mobile:</strong> iOS & Android push alerts & QR scans</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>Microsoft 365 / Teams:</strong> Embedded tabs & chats</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>Power BI Embedded:</strong> Custom web SaaS portals</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>PBIRS (On-Prem):</strong> Air-gapped local server</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Cross-Device HTML5</span>
            <span className="text-purple-300 font-bold">Interactive Drill</span>
          </div>
        </div>
      </div>

      {/* Gateway Connecting Banner */}
      <div className="mt-5 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">On-Premises Data Gateway Bridge: </span>
            <span className="text-slate-400">Connects Cloud Service securely to local SQL Server, Oracle & ERP behind firewalls (Zero inbound open ports required).</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono font-semibold shrink-0">
          TLS 1.2 Outbound
        </span>
      </div>
    </div>
  );
};

// ==========================================
// 2. Chapter 03: End-to-End Workflow Flowchart
// ==========================================
export const ArchitectureWorkflowDiagram: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Data Sources',
      sub: 'Heterogeneous Ingestion',
      desc: 'SQL Server, Snowflake, Excel, REST APIs, Oracle, Azure Blob',
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
      badge: 'Extract',
    },
    {
      num: '02',
      title: 'Power Query',
      sub: 'Mashup M Engine',
      desc: 'Type casting, unpivoting, merging, cleaning, Query Folding pushdown',
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      badge: 'Transform',
    },
    {
      num: '03',
      title: 'Data Modeling',
      sub: 'VertiPaq Engine',
      desc: 'Star Schema design, 1-to-many relationships, column compression',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      badge: 'Model',
    },
    {
      num: '04',
      title: 'DAX Engine',
      sub: 'Formula & Storage',
      desc: 'Explicit measures, CALCULATE, Context Transition, Time Intelligence',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
      badge: 'Calculate',
    },
    {
      num: '05',
      title: 'Visual Reports',
      sub: 'Interactive UX',
      desc: 'Z-pattern canvas, drillthrough, bookmarks, custom tooltips, slicers',
      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
      badge: 'Visualize',
    },
    {
      num: '06',
      title: 'Service Cloud',
      sub: 'Governance & Apps',
      desc: 'Scheduled refresh, Dynamic RLS, Gateways, Workspace app distribution',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
      badge: 'Deploy',
    },
  ];

  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase text-amber-300 font-mono">
            End-to-End Enterprise Power BI Workflow Pipeline
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">The complete 6-stage lifecycle from raw source to executive consumption</p>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
          Linear Pipeline
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        {steps.map((st, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-slate-500">
                  STAGE {st.num}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${st.color}`}>
                  {st.badge}
                </span>
              </div>
              <h5 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                {st.title}
              </h5>
              <div className="text-xs font-mono text-slate-400 mb-2">{st.sub}</div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{st.desc}</p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>{idx < steps.length - 1 ? `Feeds Stage ${steps[idx + 1].num}` : 'End-User Delivery'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. Chapter 04: Storage Modes Comparison Diagram
// ==========================================
export const StorageModesDiagram: React.FC = () => {
  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase text-amber-300 font-mono">
            Storage Modes Architecture: Import vs DirectQuery vs Live
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Where the data lives and how DAX queries execute</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Import Mode */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-emerald-500/40 relative shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase border border-emerald-500/30">
              Default & Recommended
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">Sub-Second</span>
          </div>
          <h5 className="text-base font-bold text-white">Import Mode</h5>
          <p className="text-xs text-slate-400 mt-1">Data is ingested, compressed, and loaded entirely into VertiPaq RAM.</p>

          <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-sans">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Full DAX & Power Query feature set</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Blazing fast columnar in-memory speed</span>
            </div>
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Requires scheduled refresh for updates</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="font-mono text-amber-400 font-bold">Limit:</span>
              <span>1 GB (Pro) / 100+ GB (PPU/Fabric)</span>
            </div>
          </div>
        </div>

        {/* DirectQuery Mode */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-blue-500/40 relative shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold uppercase border border-blue-500/30">
              Real-Time Pushdown
            </span>
            <span className="text-xs font-mono text-blue-400 font-bold">0 MB Model</span>
          </div>
          <h5 className="text-base font-bold text-white">DirectQuery Mode</h5>
          <p className="text-xs text-slate-400 mt-1">No data stored in .pbix. DAX translates into live SQL sent directly to database.</p>

          <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-sans">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Live real-time fresh transactional data</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Handles billions of rows in Snowflake / SQL</span>
            </div>
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Slower visual render (DB/network bound)</span>
            </div>
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Restricted DAX (Limited Time Intelligence)</span>
            </div>
          </div>
        </div>

        {/* Live Connection Mode */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-purple-500/40 relative shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-mono font-bold uppercase border border-purple-500/30">
              Enterprise Semantic
            </span>
            <span className="text-xs font-mono text-purple-400 font-bold">Unified Model</span>
          </div>
          <h5 className="text-base font-bold text-white">Live Connection</h5>
          <p className="text-xs text-slate-400 mt-1">Connects to remote SSAS, AAS, or corporate Power BI Semantic Model.</p>

          <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-sans">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Guaranteed single source of corporate truth</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Decouples report authors from data modeling</span>
            </div>
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Power Query & Modeling views disabled</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="font-mono text-purple-400 font-bold">Use Case:</span>
              <span>Thin reports for 100+ business authors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. Chapter 05: ETL & Query Folding Flowchart
// ==========================================
export const EtlQueryFoldingDiagram: React.FC = () => {
  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase text-amber-300 font-mono">
            Query Folding Mechanics: Database Pushdown vs Local Processing
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Why Query Folding is the #1 performance factor during ETL</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario A: Query Folding ACTIVE */}
        <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 relative">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
            <CheckCircle2 className="w-5 h-5" />
            <span>Optimal: Query Folding Active (Folded)</span>
          </div>
          <p className="text-xs text-slate-300 mb-4">
            Power Query translates M Applied Steps into a single optimized SQL query executed on the source database server.
          </p>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded bg-slate-950 border border-emerald-500/30 text-emerald-300">
              <span className="text-slate-500">// Source SQL Server executes:</span>
              <pre className="text-[11px] mt-1 text-slate-200">
{`SELECT CustomerID, Region, SUM(Sales)
FROM Orders
WHERE OrderDate >= '2025-01-01'
GROUP BY CustomerID, Region;`}
              </pre>
            </div>
            <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
              <span>Transferred over network:</span>
              <span className="font-bold">5,000 aggregated rows (Fast!)</span>
            </div>
          </div>
        </div>

        {/* Scenario B: Query Folding BROKEN */}
        <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/40 relative">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-3">
            <AlertTriangle className="w-5 h-5" />
            <span>Broken: Query Folding Cancelled</span>
          </div>
          <p className="text-xs text-slate-300 mb-4">
            An unsupported transformation (e.g. Python script, custom M function) forces Power BI to pull millions of raw rows locally into memory.
          </p>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded bg-slate-950 border border-rose-500/30 text-rose-300">
              <span className="text-slate-500">// Source SQL Server forced to run:</span>
              <pre className="text-[11px] mt-1 text-rose-200">
{`SELECT * FROM Orders; -- Entire DB table!`}
              </pre>
            </div>
            <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
              <span>Transferred over network:</span>
              <span className="font-bold">10,000,000 raw rows (Slow & Crash!)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. Chapter 06: Star Schema vs Snowflake Schema
// ==========================================
export const StarVsSnowflakeDiagram: React.FC = () => {
  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase text-amber-300 font-mono">
            Data Modeling Schemas: Star Schema (Recommended) vs Snowflake Schema
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">VertiPaq columnar engine optimizes 1-hop Star Schemas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Star Schema Interactive Diagram */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-amber-500/40 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-amber-300">Star Schema (1-Hop Joins)</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
              GOLD STANDARD
            </span>
          </div>

          <div className="relative py-6 flex flex-col items-center">
            {/* Top Dimension */}
            <div className="p-2.5 px-4 rounded-lg bg-slate-950 border border-slate-700 text-center font-mono text-xs text-slate-200 shadow-md">
              <span className="text-amber-400 font-bold block text-[10px]">DIMENSION (1)</span>
              DimCustomer
            </div>
            <div className="h-6 w-0.5 bg-amber-500/60 my-1" />

            {/* Middle Row */}
            <div className="flex items-center justify-between w-full max-w-sm gap-2">
              <div className="p-2.5 px-4 rounded-lg bg-slate-950 border border-slate-700 text-center font-mono text-xs text-slate-200 shadow-md">
                <span className="text-amber-400 font-bold block text-[10px]">DIMENSION (1)</span>
                DimDate
              </div>

              <div className="h-0.5 flex-1 bg-amber-500/60" />

              <div className="p-3.5 px-5 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-center font-mono text-xs text-amber-200 font-bold shadow-xl">
                <span className="text-amber-400 text-[10px] block font-mono">FACT TABLE (*)</span>
                FactSales
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">Millions of Rows</div>
              </div>

              <div className="h-0.5 flex-1 bg-amber-500/60" />

              <div className="p-2.5 px-4 rounded-lg bg-slate-950 border border-slate-700 text-center font-mono text-xs text-slate-200 shadow-md">
                <span className="text-amber-400 font-bold block text-[10px]">DIMENSION (1)</span>
                DimStore
              </div>
            </div>

            <div className="h-6 w-0.5 bg-amber-500/60 my-1" />
            {/* Bottom Dimension */}
            <div className="p-2.5 px-4 rounded-lg bg-slate-950 border border-slate-700 text-center font-mono text-xs text-slate-200 shadow-md">
              <span className="text-amber-400 font-bold block text-[10px]">DIMENSION (1)</span>
              DimProduct
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
            <strong className="text-amber-300">Why it wins: </strong> Dimensions directly filter FactSales in 1 relationship hop. Fast hash lookups & minimal DAX ambiguity.
          </div>
        </div>

        {/* Snowflake Schema Diagram */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-300">Snowflake Schema (Multi-Hop Normalized)</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono font-bold">
              SUB-OPTIMAL
            </span>
          </div>

          <div className="relative py-4 flex flex-col items-center space-y-2">
            <div className="p-2 px-3 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-slate-300">
              DimCategory (1)
            </div>
            <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
            <div className="p-2 px-3 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-slate-300">
              DimSubCategory (*) ── (1)
            </div>
            <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
            <div className="p-2 px-3 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-slate-300">
              DimProduct (*) ── (1)
            </div>
            <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
            <div className="p-3 px-5 rounded-xl bg-slate-800/80 border border-slate-600 text-xs font-mono text-white font-bold">
              FactSales (*)
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
            <strong className="text-rose-400">Drawback: </strong> Slicing by Category traverses 3 intermediate table joins, causing slower DAX calculation and complex relationship maintenance.
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. Chapter 08: Filter Context Propagation Flowchart
// ==========================================
export const FilterContextDiagram: React.FC = () => {
  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase text-amber-300 font-mono">
            DAX Evaluation Context: How Filter Context Filters Fact Tables
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">The sequence triggered every time a user clicks a slicer or renders a visual</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
            1
          </div>
          <div>
            <h5 className="text-sm font-bold text-white">Filter Context Created</h5>
            <p className="text-xs text-slate-400 mt-0.5">
              The user selects <code>Region = "Europe"</code> on a Slicer and clicks row <code>Category = "Bikes"</code> in a Matrix visual.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
            2
          </div>
          <div>
            <h5 className="text-sm font-bold text-white">Relationship Traversal (1-to-Many)</h5>
            <p className="text-xs text-slate-400 mt-0.5">
              The filter propagates from the <code>1-side</code> (DimGeography and DimProduct) down the active relationships to the <code>*-side</code> (FactSales).
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
            3
          </div>
          <div>
            <h5 className="text-sm font-bold text-white">Fact Table Subsetting</h5>
            <p className="text-xs text-slate-400 mt-0.5">
              The VertiPaq storage engine restricts the 10,000,000 rows in FactSales down to only the 142,500 rows matching both "Europe" and "Bikes".
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/40 flex items-start gap-4 bg-amber-500/5">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-mono text-xs font-black flex items-center justify-center shrink-0">
            4
          </div>
          <div>
            <h5 className="text-sm font-bold text-amber-300">Measure Expression Calculated</h5>
            <p className="text-xs text-slate-300 mt-0.5">
              DAX computes <code>SUM(FactSales[SalesAmount])</code> solely over the filtered subset and displays <code>$3,428,910</code> on the visual cell.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. Chapter 09: Data Visualizations Showcase
// ==========================================
export const DataVisualizationsShowcase: React.FC = () => {
  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase text-amber-300 font-mono">
            Core Power BI Visuals Showcase (Native HTML/SVG Code)
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Styled interactive chart types matching production reporting standards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Visual 1: Clustered Bar Chart */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              Horizontal Bar Chart (Ranking)
            </span>
            <span className="text-[11px] font-mono text-slate-400">Revenue by Region</span>
          </div>
          <div className="space-y-2.5 pt-1">
            {[
              { label: 'North America', val: '$8.4M', pct: '85%', color: 'bg-amber-400' },
              { label: 'Europe', val: '$5.2M', pct: '52%', color: 'bg-amber-500' },
              { label: 'Asia Pacific', val: '$3.8M', pct: '38%', color: 'bg-yellow-500' },
              { label: 'Latin America', val: '$1.4M', pct: '14%', color: 'bg-slate-600' },
            ].map((row, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">{row.label}</span>
                  <span className="font-mono text-white font-bold">{row.val}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className={`h-full rounded-full ${row.color}`} style={{ width: row.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual 2: Line Trend Chart */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <LineChartIcon className="w-4 h-4 text-cyan-400" />
              Line Chart (Time Intelligence Trend)
            </span>
            <span className="text-[11px] font-mono text-slate-400">Monthly Run Rate</span>
          </div>
          {/* SVG line chart */}
          <div className="h-32 w-full pt-2">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="0" y1="25" x2="300" y2="25" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
              <line x1="0" y1="75" x2="300" y2="75" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
              {/* Area */}
              <polygon
                points="0,80 50,65 100,50 150,55 200,30 250,25 300,10 300,95 0,95"
                fill="url(#lineGrad)"
              />
              {/* Path */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                points="0,80 50,65 100,50 150,55 200,30 250,25 300,10"
              />
              {/* Circles */}
              <circle cx="300" cy="10" r="4" fill="#38bdf8" />
            </svg>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
              <span>Jan</span>
              <span>Mar</span>
              <span>Jun</span>
              <span>Sep</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* Visual 3: KPI Callout Cards */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              New Card Visual (KPI Callouts)
            </span>
            <span className="text-[11px] font-mono text-emerald-400">+14.2% YoY</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Total Revenue</span>
              <div className="text-xl font-black text-white mt-0.5">$18.84M</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-1">▲ $2.3M vs Prior Year</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Gross Margin</span>
              <div className="text-xl font-black text-amber-300 mt-0.5">42.6%</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-1">▲ 180 bps Target</div>
            </div>
          </div>
        </div>

        {/* Visual 4: Donut / Part to Whole */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-emerald-400" />
              Donut Chart (Part-to-Whole 3 Slices Max)
            </span>
            <span className="text-[11px] font-mono text-slate-400">Channel Split</span>
          </div>
          <div className="flex items-center justify-around pt-2">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeDasharray="55 100"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="4"
                  strokeDasharray="30 100"
                  strokeDashoffset="-55"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white">
                100%
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-300">Enterprise: 55%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-slate-300">Mid-Market: 30%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="text-slate-400">Self-Serve: 15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. Chapter 10: Full Dashboard UI Mockup
// ==========================================
export const DashboardMockup: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');

  return (
    <div className="my-8 rounded-2xl bg-[#090d16] border border-slate-800 shadow-2xl overflow-hidden font-sans">
      {/* Mock Power BI Window Chrome */}
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-400 font-mono text-[11px] ml-2">
            Executive_Sales_Dashboard.pbix — Power BI Desktop
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> VertiPaq Connected
          </span>
          <span>100% Zoom</span>
        </div>
      </div>

      {/* Mock Report Ribbon Slicer Bar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter Slicers:
          </span>
          {['All Regions', 'North America', 'EMEA', 'APAC'].map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span>Date Range:</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            FY2025 - Q1 to Q4
          </span>
        </div>
      </div>

      {/* Mock Canvas Body */}
      <div className="p-5 space-y-5 bg-[#0a0f1d]">
        {/* KPI Row (Z-Pattern Top Left) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Total Net Sales</span>
            <div className="text-xl font-black text-white mt-1">$24.8M</div>
            <span className="text-[10px] text-emerald-400 font-mono">▲ +18.4% YoY</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Gross Profit Margin</span>
            <div className="text-xl font-black text-amber-300 mt-1">38.2%</div>
            <span className="text-[10px] text-emerald-400 font-mono">▲ +2.1% Target</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Active Customers</span>
            <div className="text-xl font-black text-cyan-300 mt-1">12,450</div>
            <span className="text-[10px] text-emerald-400 font-mono">▲ +1,240 New</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Avg Order Value</span>
            <div className="text-xl font-black text-purple-300 mt-1">$1,992</div>
            <span className="text-[10px] text-slate-400 font-mono">Stable</span>
          </div>
        </div>

        {/* Charts Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Trend Line (Span 2) */}
          <div className="lg:col-span-2 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-white">Monthly Sales Trend (Actual vs Forecast)</span>
              <span className="text-[11px] font-mono text-slate-400">Current Scope: {selectedRegion}</span>
            </div>
            <div className="h-36 w-full pt-2">
              <svg viewBox="0 0 400 120" className="w-full h-full">
                <line x1="0" y1="30" x2="400" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="400" y2="90" stroke="#1e293b" strokeDasharray="3 3" />
                {/* Forecast dashed */}
                <polyline
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  points="20,95 80,85 140,70 200,60 260,45 320,35 380,20"
                />
                {/* Actual solid */}
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  points="20,100 80,80 140,65 200,50 260,40 320,25 380,15"
                />
                <circle cx="380" cy="15" r="4" fill="#f59e0b" />
              </svg>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Q1 Jan</span>
                <span>Q1 Mar</span>
                <span>Q2 May</span>
                <span>Q3 Jul</span>
                <span>Q3 Sep</span>
                <span>Q4 Nov</span>
              </div>
            </div>
          </div>

          {/* Top Products Table */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-white">Top Product Categories</span>
              <span className="text-[10px] font-mono text-amber-400">By Sales</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Cloud Infrastructure', sales: '$9.2M', share: '37%' },
                { name: 'Analytics Licenses', sales: '$6.5M', share: '26%' },
                { name: 'Consulting Services', sales: '$5.1M', share: '21%' },
                { name: 'Hardware Appliances', sales: '$4.0M', share: '16%' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-300 truncate max-w-[120px]">{item.name}</span>
                  <div className="text-right font-mono text-[11px]">
                    <div className="text-white font-bold">{item.sales}</div>
                    <div className="text-slate-500 text-[10px]">{item.share}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. Chapter 13: Dynamic Row-Level Security Diagram
// ==========================================
export const DynamicRlsDiagram: React.FC = () => {
  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase text-amber-300 font-mono">
            Dynamic Row-Level Security (RLS) Execution Flow
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">How USERPRINCIPALNAME() filters unauthorized rows automatically</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans relative">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold">
            Step 1: Auth
          </span>
          <h5 className="font-bold text-white text-sm">User Signs In</h5>
          <p className="text-slate-400">
            Corporate executive signs in with corporate Azure AD account <code>sarah@company.com</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold">
            Step 2: DAX Eval
          </span>
          <h5 className="font-bold text-white text-sm">USERPRINCIPALNAME()</h5>
          <p className="text-slate-400">
            DAX rule triggers on <code>DimUserSecurity</code> table:
            <code className="block mt-1 p-1 bg-slate-950 rounded text-amber-300 font-mono text-[11px]">
              [Email] = USERPRINCIPALNAME()
            </code>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-2">
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold">
            Step 3: Relationship
          </span>
          <h5 className="font-bold text-white text-sm">Filter Propagates</h5>
          <p className="text-slate-400">
            Only Sarah's territory (e.g. <code>RegionKey = "West"</code>) passes through to <code>FactSales</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-2 bg-emerald-500/5">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
            Step 4: Secure Visual
          </span>
          <h5 className="font-bold text-emerald-300 text-sm">Zero Data Leak</h5>
          <p className="text-slate-300">
            Report visuals compute metrics strictly on the "West" territory subset. Other regions are invisible.
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. Chapter 14: Performance Analyzer Breakdown
// ==========================================
export const PerformanceAnalyzerBreakdown: React.FC = () => {
  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase text-amber-300 font-mono">
            Performance Analyzer Duration Breakdown & Diagnostics
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">The three latency buckets inside Power BI Desktop Performance Analyzer</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            name: '1. DAX Query Duration',
            time: '1,420 ms (Target: < 300 ms)',
            pct: '65%',
            color: 'bg-rose-500',
            desc: 'Time the Tabular Storage & Formula Engine took to compute the measure values.',
            action: 'Optimize DAX with variables (VAR), avoid IF() inside SUMX, check relationship cardinalities.',
          },
          {
            name: '2. Visual Display Duration',
            time: '450 ms (Target: < 200 ms)',
            pct: '25%',
            color: 'bg-amber-500',
            desc: 'Time the browser DOM engine took to render hundreds of SVG data points.',
            action: 'Limit points by top 10 filtering, reduce total visuals on page from 15 down to 6-8.',
          },
          {
            name: '3. Other (Engine Wait / Queuing)',
            time: '180 ms',
            pct: '10%',
            color: 'bg-blue-500',
            desc: 'Queuing time while waiting for previous visual queries to release engine worker threads.',
            action: 'Eliminate duplicate cards and consolidate multiple KPI metrics into a single New Card visual.',
          },
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white text-sm">{item.name}</span>
              <span className="font-mono text-amber-300 font-bold">{item.time}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
              <div className={`h-full ${item.color} rounded-full`} style={{ width: item.pct }} />
            </div>
            <p className="text-xs text-slate-300">{item.desc}</p>
            <div className="text-[11px] font-mono text-emerald-400 bg-slate-950/80 p-2 rounded border border-slate-800/80">
              <strong>Tuning Action: </strong>{item.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 11. Chapter 16: Top 20 Interview Questions Component
// ==========================================
export const Top20InterviewQuestions: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const questions = [
    {
      id: 1,
      cat: 'Core Concepts',
      q: 'What is the exact technical difference between a Measure and a Calculated Column?',
      ans: 'A Calculated Column is evaluated at the row level during data refresh (under Row Context) and its results are stored permanently in RAM, increasing model file size. An Explicit Measure is computed on-the-fly dynamically when a visual renders (under Filter Context), consuming zero persistent disk or memory storage. Golden Rule: Never use a calculated column when a measure can perform the aggregation.',
    },
    {
      id: 2,
      cat: 'Power Query',
      q: 'What is Query Folding, why is it vital, and what common transformations break it?',
      ans: 'Query Folding occurs when Power Query pushes ETL transformations back to the source relational database (like SQL Server or Snowflake) as a single native SELECT query. It prevents millions of rows from traversing the network and accelerates refresh speeds. Transformations that break folding include: Python/R scripts, changing column types to unsupported DB types, appending disparate heterogeneous data sources, and custom non-standard M functions.',
    },
    {
      id: 3,
      cat: 'DAX',
      q: 'What does the CALCULATE function do in DAX and what is Context Transition?',
      ans: 'CALCULATE() evaluates an expression in a modified filter context. Crucially, it triggers Context Transition: whenever CALCULATE is called inside a Row Context (such as inside a calculated column or SUMX iterator), it transforms that current row into an equivalent Filter Context over all columns of that table.',
    },
    {
      id: 4,
      cat: 'DAX',
      q: 'What is the difference between ALL, ALLEXCEPT, and ALLSELECTED?',
      ans: 'ALL() removes all filter context from specified columns or tables regardless of where the filters originated. ALLEXCEPT() removes all filter context EXCEPT for specified columns. ALLSELECTED() removes inner visual-level grouping filters while preserving outer user selections made on report slicers.',
    },
    {
      id: 5,
      cat: 'Data Modeling',
      q: 'Why is Star Schema strongly preferred over Snowflake Schema in Power BI?',
      ans: 'The VertiPaq engine compresses data column-by-column and creates dictionary encoding. Star schemas minimize join paths to exactly 1 hop between Dimension and Fact, speeding up hash lookups. Snowflake schemas require multi-hop joins across normalized sub-dimensions, creating query performance lag and complex DAX filter propagation.',
    },
    {
      id: 6,
      cat: 'Security',
      q: 'How do you implement Dynamic Row-Level Security (RLS)?',
      ans: '1) Create an organizational security table mapping user email addresses to security attributes (e.g. DimUserSecurity[UserEmail] and DimUserSecurity[TerritoryKey]). 2) Establish a 1-to-many relationship between the security table and the Fact table. 3) In Modeling > Manage Roles, write the DAX rule: [UserEmail] = USERPRINCIPALNAME(). 4) In Power BI Service, assign Azure AD security groups to the role.',
    },
    {
      id: 7,
      cat: 'Architecture',
      q: 'What are the main drawbacks and limitations of DirectQuery mode?',
      ans: '1) Latency: Visual rendering is bound to source database throughput and network latency. 2) DAX limitations: Many complex DAX functions (especially specialized Time Intelligence functions) are disabled. 3) Source load: Every slicer click fires multiple SQL queries directly at production databases. 4) Row limits: Default limit of 1 million rows retrieved per query.',
    },
    {
      id: 8,
      cat: 'DAX',
      q: 'When must you use SUMX instead of SUM?',
      ans: 'SUM is a simple aggregator that only takes a single numeric column as its argument. SUMX is a row iterator that takes a table as its first argument and evaluates an expression row-by-row (e.g. FactSales[Quantity] * FactSales[UnitPrice]) before summing up the total. Use SUMX for row-level mathematical multiplication or conditional evaluations.',
    },
    {
      id: 9,
      cat: 'Data Modeling',
      q: 'Why is Bidirectional Cross-Filtering considered dangerous?',
      ans: 'Leaving cross-filter direction set to "Both" creates circular relationship paths, ambiguity in DAX filter context propagation, and unexpected cross-filtering across unrelated fact tables. It can also drastically degrade query performance on large datasets.',
    },
    {
      id: 10,
      cat: 'Performance',
      q: 'How do you systematically identify and fix performance bottlenecks in a report?',
      ans: '1) Open View > Performance Analyzer and record visual load times. 2) Break down latency into DAX Query, Visual Display, and Other. 3) For slow DAX, copy query and profile in DAX Studio to check Formula Engine vs Storage Engine time. 4) Remove high-cardinality datetime columns. 5) Turn off Auto Date/Time. 6) Enforce Star Schema relationships.',
    },
    {
      id: 11,
      cat: 'Architecture',
      q: 'What is the difference between Live Connection and DirectQuery?',
      ans: 'DirectQuery connects to relational databases (SQL, Snowflake) and translates DAX into SQL on every click, allowing data modeling in Desktop. Live Connection connects strictly to pre-modeled Analysis Services (SSAS, AAS) or Power BI Semantic Models; the data modeling and Power Query tabs are completely disabled in Desktop because the model is governed centrally.',
    },
    {
      id: 12,
      cat: 'Engine',
      q: 'How does the VertiPaq Engine achieve massive columnar compression?',
      ans: 'VertiPaq uses three primary compression techniques: 1) Value Encoding (subtracting a base minimum to store smaller mathematical deltas), 2) Hash / Dictionary Encoding (mapping distinct values to integer keys), and 3) Run-Length Encoding (RLE) (grouping adjacent identical values). High cardinality destroys dictionary encoding, which is why splitting datetime columns is critical.',
    },
    {
      id: 13,
      cat: 'DAX',
      q: 'What is the difference between EARLIER and Variables (VAR/RETURN) in DAX?',
      ans: 'Historically, EARLIER() was used to access the previous outer row context during nested iterations. Modern DAX replaces EARLIER with Variables (VAR), which evaluate eagerly in the current context, improve readability, and prevent expensive redundant recalculations.',
    },
    {
      id: 14,
      cat: 'Data Modeling',
      q: 'How do you handle Role-Playing Dimensions (e.g. OrderDate vs ShipDate vs DueDate)?',
      ans: 'Create multiple relationships from FactSales to DimDate. Only one relationship can be Active (solid line); the others are Inactive (dashed lines). In DAX measures requiring calculations against inactive dates, activate the relationship using USERELATIONSHIP(): CALCULATE([Total Sales], USERELATIONSHIP(FactSales[ShipDate], DimDate[Date])).',
    },
    {
      id: 15,
      cat: 'Service',
      q: 'What is the difference between Personal Gateway and Standard (Enterprise) Gateway?',
      ans: 'Personal Gateway runs only under a single Windows user account and supports only scheduled refresh (no DirectQuery). Standard Gateway runs as a Windows service on an enterprise server, supports multiple simultaneous users, enables DirectQuery live pass-through, and supports gateway clusters for high-availability load balancing.',
    },
    {
      id: 16,
      cat: 'Security',
      q: 'What is Object-Level Security (OLS) and how does it differ from RLS?',
      ans: 'Row-Level Security (RLS) filters specific rows within a table based on user criteria. Object-Level Security (OLS) hides entire tables or specific sensitive columns (like Executive Salary or SSN) from unauthorized roles. OLS must be configured using Tabular Editor via XMLA endpoints.',
    },
    {
      id: 17,
      cat: 'Architecture',
      q: 'What are Composite Models and Dual Storage mode?',
      ans: 'Composite models combine tables with different storage modes (Import and DirectQuery) in the same semantic model. Dimension tables configured with "Dual" storage mode act as in-memory Import tables when queried with Import facts, and act as DirectQuery tables when joined with DirectQuery facts, avoiding expensive cross-mode joins.',
    },
    {
      id: 18,
      cat: 'Power Query',
      q: 'What is Incremental Refresh and how is it configured in Power Query?',
      ans: 'Incremental Refresh updates only recently modified data instead of reloading the entire historical table. It is configured by creating RangeStart and RangeEnd DateTime parameters in Power Query to filter the fact table, then setting an Incremental Refresh policy in Desktop (e.g. store 5 years history, refresh last 3 days).',
    },
    {
      id: 19,
      cat: 'Service',
      q: 'What is the fundamental difference between a Dashboard and a Report in Power BI Service?',
      ans: 'A Report is multi-page, created in Power BI Desktop, based on a single semantic model, and supports full interactive slicers and drillthrough. A Dashboard is a single-page executive overview created strictly in Power BI Service, capable of pinning tiles from multiple different reports and datasets, with Q&A natural language search.',
    },
    {
      id: 20,
      cat: 'DAX',
      q: 'How do you identify and resolve Circular Dependency errors in DAX?',
      ans: 'Circular dependencies occur when two calculated columns or tables depend on each other for context evaluation. They can be resolved by: 1) Converting calculated columns into Explicit Measures, 2) Using ALLEXCEPT() or REMOVEFILTERS() to break the dependency chain, or 3) Performing the column calculation upstream in Power Query.',
    },
  ];

  const categories = ['All', 'Core Concepts', 'Power Query', 'DAX', 'Data Modeling', 'Architecture', 'Security', 'Performance', 'Engine', 'Service'];

  const filtered = filterCategory === 'All' ? questions : questions.filter(q => q.cat === filterCategory);

  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase text-amber-300 font-mono">
            Interactive Q&A Bank: Top 20 Technical Power BI Questions
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Click any question to reveal complete technical model answers</p>
        </div>
        <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono font-bold">
          20 Questions Complete
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              filterCategory === c
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Questions Accordion */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isOpen = openIndex === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all overflow-hidden ${
                isOpen ? 'bg-slate-900 border-amber-500/40 shadow-lg' : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : item.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold flex items-center justify-center mt-0.5">
                    {item.id.toString().padStart(2, '0')}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 mr-2">
                      {item.cat}
                    </span>
                    <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {item.q}
                    </span>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 mt-1 group-hover:text-white" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/40">
                  <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-slate-200 mt-2">
                    <strong className="text-amber-400 block font-mono text-xs mb-1">MODEL INTERVIEW ANSWER:</strong>
                    {item.ans}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 12. Chapter 18: 6-Week Roadmap Timeline
// ==========================================
export const RoadmapTimeline: React.FC = () => {
  const weeks = [
    {
      week: 'Week 1',
      title: 'Fundamentals, Ecosystem & Power Query ETL',
      topics: ['Power BI Desktop & Service setup', 'M Mashup Engine fundamentals', 'Query Folding verification', 'Wide to Tall Unpivoting'],
      cert: 'PL-300: Prepare the Data (25-30%)',
      color: 'border-blue-500/40 text-blue-400',
    },
    {
      week: 'Week 2',
      title: 'Kimball Data Modeling & Schema Design',
      topics: ['Star Schema vs Snowflake', 'Fact vs Dimension tables', '1-to-many relationship cardinality', 'Role-Playing dimensions & USERELATIONSHIP'],
      cert: 'PL-300: Model the Data (25-30%)',
      color: 'border-emerald-500/40 text-emerald-400',
    },
    {
      week: 'Week 3',
      title: 'DAX Fundamentals & Row Iterators',
      topics: ['Measures vs Calculated Columns', 'DIVIDE safe math', 'SUM vs SUMX, AVERAGEX', 'SWITCH(TRUE()) categorization logic'],
      cert: 'PL-300: Model the Data (25-30%)',
      color: 'border-amber-500/40 text-amber-400',
    },
    {
      week: 'Week 4',
      title: 'Advanced DAX & Time Intelligence',
      topics: ['CALCULATE & Context Transition', 'ALL, ALLEXCEPT, ALLSELECTED', 'Date table creation in M / DAX', 'TOTALYTD, SAMEPERIODLASTYEAR, YoY growth'],
      cert: 'PL-300: Model the Data (25-30%)',
      color: 'border-purple-500/40 text-purple-400',
    },
    {
      week: 'Week 5',
      title: 'Interactive Dashboard Design & UX',
      topics: ['Z-Pattern layout & visual selection', 'Bookmarks & Selection pane drawers', 'Drillthrough & custom tooltip pages', 'Mobile phone canvas optimization'],
      cert: 'PL-300: Visualize and Analyze (25-30%)',
      color: 'border-rose-500/40 text-rose-400',
    },
    {
      week: 'Week 6',
      title: 'Service Cloud Governance, Gateways & RLS',
      topics: ['Workspaces & App publishing', 'Enterprise Gateway deployment', 'Dynamic RLS with USERPRINCIPALNAME', 'Performance Analyzer & DAX Studio audit'],
      cert: 'PL-300: Deploy and Maintain (15-20%)',
      color: 'border-cyan-500/40 text-cyan-400',
    },
  ];

  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase text-amber-300 font-mono">
            6-Week Structured Power BI Mastery & PL-300 Certification Roadmap
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Step-by-step progressive timeline from zero to enterprise BI engineer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weeks.map((w, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-all shadow-md">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${w.color}`}>
                  {w.week}
                </span>
                <span className="text-[10px] font-mono text-slate-500">Phase 0{idx + 1}</span>
              </div>
              <h5 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                {w.title}
              </h5>
              <ul className="space-y-1 text-xs text-slate-300 mt-3 font-sans">
                {w.topics.map((t, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>{w.cert}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
