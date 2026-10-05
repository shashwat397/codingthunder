import React, { useState } from 'react';
import { Play, Terminal, Code2, Database, Sparkles, CheckCircle2 } from 'lucide-react';

const TABS = [
  {
    id: 'script',
    title: 'run-thunder.sh',
    icon: Terminal,
    content: `# Initialize fullstack production workspace
$ npx codingthunder init --template=fullstack-enterprise
✔ Resolving React 19 + TypeScript + Express v4
✔ Bootstrapping SQLite & PostgreSQL migrations
✔ Generating authentication guards & RBAC schemas
✔ Configuring Razorpay & Stripe webhooks

$ npm run dev
⚡ [Codingthunder Engine] Dev server ready at http://localhost:3000
✔ 0 lint warnings | Bundle compiled in 118ms
➜ Press 'o' to open browser, 'h' for help`,
    executionOutput: `[EXEC] Running project compilation...
✔ Build target: ESNext
✔ TypeScript: 0 errors found
✔ Database: Connection verified, 6 migrations applied
✔ Live hot-reload listening on port 3000
🚀 Ready to ship without fear!`,
  },
  {
    id: 'component',
    title: 'CoursePlayer.tsx',
    icon: Code2,
    content: `import { useState, useTransition } from 'react';
import { useAuth } from '@/context/AuthContext';

export function LessonTracker({ lessonId, courseId }) {
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      setCompleted(prev => !prev);
      await fetch(\`/api/courses/\${courseId}/progress\`, {
        method: 'POST',
        body: JSON.stringify({ lessonId, completed: !completed })
      });
    });
  };

  return (
    <button onClick={handleToggle} disabled={isPending}>
      {completed ? "✔ Lesson Completed" : "Mark as Watched"}
    </button>
  );
}`,
    executionOutput: `[JSX] Compiled CoursePlayer.tsx in 14ms
✔ React 19 Action Transition validated
✔ Optimized render path: 0 unnecessary rerenders`,
  },
  {
    id: 'db',
    title: 'schema.sql',
    icon: Database,
    content: `CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  price INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 5.0
);

CREATE TABLE enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  course_id TEXT NOT NULL REFERENCES courses(id),
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    executionOutput: `[SQL] Query executed successfully
✔ Table 'courses' created (0.003s)
✔ Table 'enrollments' created with indexed foreign keys (0.004s)
✔ Row-level security policies verified`,
  },
];

export const TerminalHero: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setShowOutput(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowOutput(true);
    }, 600);
  };

  const current = TABS[activeTab];

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-slate-800 bg-[#0a0f19] shadow-2xl overflow-hidden font-mono text-xs sm:text-sm backdrop-blur-xl">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d1424] border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block shadow-sm"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-sm"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-sm"></span>
          <span className="ml-2 text-slate-400 text-xs font-sans tracking-wide">codingthunder-terminal</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
          {TABS.map((tab, idx) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(idx);
                  setShowOutput(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all cursor-pointer ${
                  activeTab === idx
                    ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 sm:p-5 text-slate-300 min-h-[220px] max-h-[300px] overflow-y-auto leading-relaxed selection:bg-amber-500/30 font-mono">
        <pre className="text-slate-200 whitespace-pre-wrap">{current.content}</pre>

        {showOutput && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-emerald-400 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Execution Output</span>
            </div>
            <pre className="text-emerald-300 whitespace-pre-wrap">{current.executionOutput}</pre>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#090d15] border-t border-slate-800/80 text-slate-400 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400">Node v22.14 LTS · Fast Refresh Active</span>
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-all cursor-pointer text-xs active:scale-95 shadow-md shadow-amber-500/20"
        >
          {isRunning ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Executing...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
