import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Lock,
  Unlock,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Layers,
  Cpu,
  Server,
  Terminal,
  ShieldCheck,
  Check,
  Zap,
  Award,
  ChevronRight,
  Download,
  Share2,
} from 'lucide-react';
import { DATA_ENGINEERING_PHASES } from '../components/dataengineering/phasesData.ts';
import { DataEngineeringPhaseRenderer } from '../components/dataengineering/DataEngineeringPhaseRenderer.tsx';
import { DatasetHub } from '../components/dataengineering/DatasetHub.tsx';
import { DataEngineeringCheckoutModal } from '../components/dataengineering/DataEngineeringCheckoutModal.tsx';
import { MedallionPipelineDiagram } from '../components/dataengineering/diagrams/MedallionPipelineDiagram.tsx';
import { DataEngineeringPhase } from '../components/dataengineering/types.ts';

interface DataEngineeringProjectsViewProps {
  onNavigate: (path: string) => void;
}

export const DataEngineeringProjectsView: React.FC<DataEngineeringProjectsViewProps> = ({ onNavigate }) => {
  // Check entitlement state
  const [hasAccess, setHasAccess] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasDataEngineeringAccess') === 'true';
    }
    return false;
  });

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedPhases, setCompletedPhases] = useState<{ [key: string]: boolean }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('de_completed_phases');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return { 'phase-1': true };
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const readingPaneTopRef = useRef<HTMLDivElement>(null);

  // Sync entitlement listener
  useEffect(() => {
    const checkAccess = () => {
      const access = localStorage.getItem('hasDataEngineeringAccess') === 'true';
      setHasAccess(access);
    };

    window.addEventListener('data-engineering-access-granted', checkAccess);
    window.addEventListener('storage', checkAccess);
    return () => {
      window.removeEventListener('data-engineering-access-granted', checkAccess);
      window.removeEventListener('storage', checkAccess);
    };
  }, []);

  const toggleComplete = (id: string) => {
    setCompletedPhases((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (typeof window !== 'undefined') {
        localStorage.setItem('de_completed_phases', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleSelectPhase = (index: number) => {
    setCurrentPhaseIndex(index);
    if (readingPaneTopRef.current) {
      readingPaneTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPhaseIndex < DATA_ENGINEERING_PHASES.length - 1) {
      handleSelectPhase(currentPhaseIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentPhaseIndex > 0) {
      handleSelectPhase(currentPhaseIndex - 1);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  const currentPhase: DataEngineeringPhase =
    DATA_ENGINEERING_PHASES[currentPhaseIndex] || DATA_ENGINEERING_PHASES[0];

  const progressPercentage = Math.round(
    (Object.values(completedPhases).filter(Boolean).length / DATA_ENGINEERING_PHASES.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Checkout Modal */}
      <DataEngineeringCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onUnlockSuccess={() => setHasAccess(true)}
      />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back Home</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
                <Database className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Data Engineering Projects</span>
                  <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Modern Data Stack
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400">Enterprise Data Platform • Real-Time & Batch Streaming</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasAccess ? (
              <>
                <div className="hidden md:flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Unlocked (Lifetime)</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] font-mono text-slate-300">{progressPercentage}% Complete</span>
                </div>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer active:scale-95"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock for ₹29</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      {!hasAccess ? (
        /* =========================================================================
           HIGH-CONVERSION LANDING / PAYWALL PANE (LOCKED STATE)
           ========================================================================= */
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
          {/* Hero Banner */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
              <span>🔥 85% OFF — Early Access Limited Pass</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Enterprise Data Platform:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                Real-Time & Batch Streaming Pipeline
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Build and deploy a battle-tested Modern Data Stack (MDS) Lakehouse from scratch. Ingest live e-commerce
              telemetry with Kafka, process streaming micro-batches with PySpark, model Star Schemas with dbt, orchestrate
              Airflow DAGs, and enforce automated data quality contracts.
            </p>

            {/* Price Box & Unlock CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-5 py-3 rounded-2xl shadow-xl">
                <span className="text-xs font-mono text-slate-400 uppercase">Offer Price:</span>
                <span className="text-3xl font-black text-white font-mono">₹29</span>
                <span className="text-sm font-mono text-slate-500 line-through">₹199</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Save ₹170
                </span>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:brightness-110 text-slate-950 font-black text-sm transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Unlock Complete Project for ₹29</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Test Bypass for Developer / Evaluator */}
            <div className="pt-1">
              <button
                onClick={() => {
                  localStorage.setItem('hasDataEngineeringAccess', 'true');
                  setHasAccess(true);
                }}
                className="text-[11px] font-mono text-slate-500 hover:text-cyan-400 underline transition cursor-pointer"
              >
                [⚡ Developer Test Bypass: Click here to instantly preview unlocked project]
              </button>
            </div>
          </div>

          {/* Interactive Architecture Preview */}
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Architecture Blueprint
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">What You Will Build (Interactive Preview)</h2>
            </div>
            <MedallionPipelineDiagram />
          </div>

          {/* 6-Milestone Curriculum Breakdown */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Step-by-Step Milestones
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">The 6-Phase Engineering Curriculum</h2>
              <p className="text-xs text-slate-400 mt-1">
                Progressive milestones from local Lakehouse containerization to production analytics serving.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DATA_ENGINEERING_PHASES.map((phase) => (
                <div
                  key={phase.id}
                  className="p-5 rounded-2xl bg-[#0c111e] border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-cyan-400 font-bold">Milestone 0{phase.number}</span>
                      <span className="text-slate-500">{phase.readTime}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{phase.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{phase.summary}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1">
                    {phase.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Conversion Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#0a1424] to-blue-950/40 border border-cyan-500/40 shadow-2xl text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">Ready to Build a Production-Grade Data Platform?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Get immediate lifetime access to the complete hands-on tutorial, runnable Python & SQL scripts,
              Docker Compose setup, and downloadable dataset for just ₹29.
            </p>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm transition-all shadow-xl shadow-cyan-500/20 cursor-pointer active:scale-95"
            >
              Get Instant Access Now (₹29)
            </button>
          </div>
        </div>
      ) : (
        /* =========================================================================
           DUAL-PANE COMPLETE PROJECT VIEWER (UNLOCKED STATE)
           ========================================================================= */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col lg:flex-row gap-8">
          {/* Left Sticky Sidebar: 6 Milestones */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-4 shadow-2xl flex flex-col max-h-[calc(100vh-7rem)] overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <span>MILESTONES (6 PHASES)</span>
                <span className="text-cyan-400">
                  {Object.values(completedPhases).filter(Boolean).length}/6 Done
                </span>
              </div>

              {/* Milestones List */}
              <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 custom-scrollbar">
                {DATA_ENGINEERING_PHASES.map((phase, idx) => {
                  const isActive = idx === currentPhaseIndex;
                  const isCompleted = !!completedPhases[phase.id];

                  return (
                    <div
                      key={phase.id}
                      onClick={() => handleSelectPhase(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group flex items-start gap-2.5 ${
                        isActive
                          ? 'border-cyan-500/60 bg-cyan-950/20 text-white shadow-md shadow-cyan-500/5'
                          : 'border-slate-800/80 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleComplete(phase.id);
                        }}
                        className="mt-0.5 text-slate-500 hover:text-cyan-400 transition shrink-0"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold truncate">
                            Phase 0{phase.number}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-950/20">
                            {phase.difficulty}
                          </span>
                        </div>
                        <h4
                          className={`text-xs font-semibold leading-tight line-clamp-1 ${
                            isActive ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white'
                          }`}
                        >
                          {phase.shortTitle}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {phase.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reset Entitlement Button for Testing */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Entitlement: Active</span>
                <button
                  onClick={() => {
                    localStorage.removeItem('hasDataEngineeringAccess');
                    setHasAccess(false);
                  }}
                  className="hover:text-rose-400 transition underline cursor-pointer"
                >
                  Test Lock
                </button>
              </div>
            </div>
          </aside>

          {/* Right Reading & Code Execution Pane */}
          <main className="flex-1 min-w-0">
            <div
              ref={readingPaneTopRef}
              className="rounded-3xl border border-slate-800 bg-[#0a0f1d] p-6 sm:p-10 shadow-2xl relative overflow-hidden"
            >
              {/* Action Bar Above Phase */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                    Milestone {currentPhase.number} of 06
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" /> {currentPhase.readTime}
                  </span>
                </div>

                <button
                  onClick={() => toggleComplete(currentPhase.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                    completedPhases[currentPhase.id]
                      ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {completedPhases[currentPhase.id] ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5 text-slate-500" />
                      <span>Mark as Complete</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dataset & Artifacts Hub */}
              <DatasetHub />

              {/* Phase Tutorial Content */}
              <DataEngineeringPhaseRenderer phaseId={currentPhase.id} />

              {/* Lesson Pagination Footer */}
              <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPhaseIndex === 0}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-semibold transition ${
                    currentPhaseIndex === 0
                      ? 'border-slate-800/50 text-slate-600 bg-slate-950 cursor-not-allowed'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Milestone</span>
                </button>

                <div className="text-xs text-slate-500 font-mono">
                  Milestone 0{currentPhaseIndex + 1} / 0{DATA_ENGINEERING_PHASES.length}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPhaseIndex === DATA_ENGINEERING_PHASES.length - 1}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-semibold transition ${
                    currentPhaseIndex === DATA_ENGINEERING_PHASES.length - 1
                      ? 'border-slate-800/50 text-slate-600 bg-slate-950 cursor-not-allowed'
                      : 'border-cyan-500/40 bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:brightness-110 shadow-lg shadow-cyan-500/20'
                  }`}
                >
                  <span>Next Milestone</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};
