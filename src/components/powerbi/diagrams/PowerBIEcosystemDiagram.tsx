import React from 'react';
import { Monitor, Cloud, Smartphone, Database, Shield, Server, ArrowRight } from 'lucide-react';

export const PowerBIEcosystemDiagram: React.FC = () => {
  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Architecture Workflow
          </span>
          <h4 className="text-lg font-bold text-white">Power BI End-to-End Enterprise Ecosystem</h4>
        </div>
        <span className="text-xs font-mono text-slate-400 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
          Interactive SVG Flow
        </span>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 920 380" className="w-full min-w-[760px] h-auto font-sans select-none">
          <defs>
            <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05" />
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#f59e0b" />
            </marker>
            <marker id="arrowCyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4" />
            </marker>
          </defs>

          {/* 1. DATA SOURCES TIER */}
          <g>
            <rect x="20" y="40" width="180" height="300" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <text x="110" y="70" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="1">DATA SOURCES</text>
            
            {/* Source items */}
            <rect x="35" y="90" width="150" height="42" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <text x="110" y="115" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">SQL Server & PostgreSQL</text>
            
            <rect x="35" y="145" width="150" height="42" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <text x="110" y="170" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">Snowflake / Databricks</text>

            <rect x="35" y="200" width="150" height="42" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <text x="110" y="225" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">Excel, CSV & SharePoint</text>

            <rect x="35" y="255" width="150" height="42" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <text x="110" y="280" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">Web REST APIs & OData</text>

            <text x="110" y="322" textAnchor="middle" fill="#64748b" fontSize="10" fontStyle="italic">On-Premises & Cloud</text>
          </g>

          {/* Arrow from Sources to Desktop */}
          <path d="M 200 190 L 260 190" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5,5" markerEnd="url(#arrow)" />
          <text x="230" y="178" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">EXTRACT</text>

          {/* 2. POWER BI DESKTOP (AUTHORING TIER) */}
          <g>
            <rect x="270" y="30" width="230" height="320" rx="16" fill="url(#amberGlow)" stroke="#f59e0b" strokeWidth="2" />
            <text x="385" y="60" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="800" letterSpacing="1">POWER BI DESKTOP</text>
            <text x="385" y="76" textAnchor="middle" fill="#94a3b8" fontSize="10">Authoring & Modeling Engine</text>

            {/* Sub-engines */}
            <rect x="285" y="95" width="200" height="65" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
            <text x="385" y="120" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700">Power Query (M Engine)</text>
            <text x="385" y="138" textAnchor="middle" fill="#94a3b8" fontSize="10">ETL, Cleaning, Query Folding</text>

            <rect x="285" y="170" width="200" height="65" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
            <text x="385" y="195" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700">VertiPaq Modeling Engine</text>
            <text x="385" y="213" textAnchor="middle" fill="#94a3b8" fontSize="10">Star Schema, Relationships, DAX</text>

            <rect x="285" y="245" width="200" height="65" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
            <text x="385" y="270" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700">Report Canvas UI</text>
            <text x="385" y="288" textAnchor="middle" fill="#94a3b8" fontSize="10">Visuals, Bookmarks, Interactivity</text>

            <text x="385" y="335" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">Saved as .PBIX File</text>
          </g>

          {/* Arrow from Desktop to Cloud Service */}
          <path d="M 500 190 L 560 190" stroke="#06b6d4" strokeWidth="2.5" markerEnd="url(#arrowCyan)" />
          <text x="530" y="178" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="700">PUBLISH</text>

          {/* 3. POWER BI SERVICE (CLOUD TIER) */}
          <g>
            <rect x="570" y="30" width="200" height="320" rx="16" fill="url(#cyanGlow)" stroke="#06b6d4" strokeWidth="2" />
            <text x="670" y="60" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="800" letterSpacing="1">POWER BI SERVICE</text>
            <text x="670" y="76" textAnchor="middle" fill="#94a3b8" fontSize="10">Cloud SaaS Collaboration</text>

            <rect x="585" y="95" width="170" height="48" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
            <text x="670" y="118" textAnchor="middle" fill="#a5f3fc" fontSize="11" fontWeight="700">Semantic Models</text>
            <text x="670" y="132" textAnchor="middle" fill="#94a3b8" fontSize="9">Scheduled Refresh & RLS</text>

            <rect x="585" y="152" width="170" height="48" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
            <text x="670" y="175" textAnchor="middle" fill="#a5f3fc" fontSize="11" fontWeight="700">Workspaces & Apps</text>
            <text x="670" y="189" textAnchor="middle" fill="#94a3b8" fontSize="9">Role-Based Access Control</text>

            <rect x="585" y="210" width="170" height="48" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
            <text x="670" y="233" textAnchor="middle" fill="#a5f3fc" fontSize="11" fontWeight="700">Deployment Pipelines</text>
            <text x="670" y="247" textAnchor="middle" fill="#94a3b8" fontSize="9">Dev ➔ Test ➔ Production ALM</text>

            <rect x="585" y="268" width="170" height="48" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
            <text x="670" y="291" textAnchor="middle" fill="#a5f3fc" fontSize="11" fontWeight="700">Data Gateway Agent</text>
            <text x="670" y="305" textAnchor="middle" fill="#94a3b8" fontSize="9">Encrypted On-Premises Tunnel</text>
          </g>

          {/* Arrow to Consumers */}
          <path d="M 770 190 L 810 190" stroke="#a855f7" strokeWidth="2.5" markerEnd="url(#arrow)" />

          {/* 4. END CONSUMERS */}
          <g>
            <rect x="815" y="60" width="95" height="260" rx="14" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
            <text x="862" y="90" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="700">CONSUMERS</text>

            <circle cx="862" cy="130" r="18" fill="#1e1b4b" stroke="#a855f7" />
            <text x="862" y="134" textAnchor="middle" fill="#f8fafc" fontSize="12">🌐</text>
            <text x="862" y="160" textAnchor="middle" fill="#cbd5e1" fontSize="10">Web App</text>

            <circle cx="862" cy="195" r="18" fill="#1e1b4b" stroke="#a855f7" />
            <text x="862" y="199" textAnchor="middle" fill="#f8fafc" fontSize="12">📱</text>
            <text x="862" y="225" textAnchor="middle" fill="#cbd5e1" fontSize="10">iOS / Android</text>

            <circle cx="862" cy="260" r="18" fill="#1e1b4b" stroke="#a855f7" />
            <text x="862" y="264" textAnchor="middle" fill="#f8fafc" fontSize="12">📊</text>
            <text x="862" y="290" textAnchor="middle" fill="#cbd5e1" fontSize="10">MS Teams</text>
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span><strong>Desktop:</strong> Free developer authoring & local modeling</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span><strong>Service:</strong> Cloud collaboration, RLS enforcement & gateways</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
          <span><strong>Apps:</strong> Packaged read-only dashboards for business users</span>
        </div>
      </div>
    </div>
  );
};
