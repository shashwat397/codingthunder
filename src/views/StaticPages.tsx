import React, { useState } from 'react';
import {
  Mail,
  Check,
  AlertCircle,
  Zap,
  ShieldCheck,
  Compass,
  HelpCircle,
  FileText,
  ArrowRight,
  BarChart3,
  Database,
  BrainCircuit,
  TrendingUp,
  Layers,
  Cpu,
  Sparkles,
  Binary
} from 'lucide-react';
import { api } from '../services/api.ts';

interface StaticPagesProps {
  page: 'about' | 'contact' | 'faq' | 'privacy' | 'terms' | 'roadmaps';
  onNavigate: (path: string) => void;
}

export const StaticPages: React.FC<StaticPagesProps> = ({ page, onNavigate }) => {
  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await api.submitContact({ name, email, subject, message });
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 text-slate-200">
      {/* ========================================================= */}
      {/* 1. ABOUT PAGE: DATA SCIENCE & DATA ANALYTICS HUB */}
      {/* ========================================================= */}
      {page === 'about' && (
        <div className="space-y-12">
          {/* Header Badge & Title */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Data Science & Analytics Engineering Hub</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Transforming Raw Data Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">
                Predictive Power.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              We engineer the next generation of Data Scientists, Quantitative Analysts, and Analytics Engineers through battle-tested workflows, statistical depth, and zero fluff.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0c101c] border border-slate-800">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">3.5Q+</div>
              <div className="text-xs text-slate-400">Daily Global Bytes Analyzed</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</div>
              <div className="text-xs text-slate-400">Real Production Datasets</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">40+</div>
              <div className="text-xs text-slate-400">End-to-End Case Studies</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">450K+</div>
              <div className="text-xs text-slate-400">Active Data Practitioners</div>
            </div>
          </div>

          {/* Narrative & Philosophy */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/80 to-[#0c101c] border border-slate-800 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <BrainCircuit className="w-6 h-6 text-amber-400" />
              <span>Why We Built Codingthunder for Data</span>
            </h2>
            
            <p>
              In modern computing, code without data is blind, and data without code is dormant. Every millisecond, billions of telemetry logs, financial transactions, user touchpoints, and medical sensor readings flood enterprise servers. The organizations that dominate their industries aren’t the ones with the most raw numbers — they are the ones with the <strong className="text-white">analytical precision</strong> to extract high-conviction decision intelligence.
            </p>
            <p>
              Traditional courses trap aspiring practitioners in sterile academic theory: memorizing formulas on paper or training basic linear regressions on toy datasets from the 1930s. That approach collapses on day one in the real world, where data is dirty, distributed across petabyte warehouses, incomplete, and continuously streaming.
            </p>
            <p>
              At Codingthunder, we bridge that chasm. We treat Data Science and Data Analytics as an <strong className="text-amber-300">applied engineering craft</strong>: combining deep statistical inference with high-performance Python, industrial SQL, modern analytics engineering (dbt, DuckDB, Snowflake), and low-latency machine learning pipelines.
            </p>
          </div>

          {/* Core Pillars Grid */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>The Four Pillars of Data Mastery</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 hover:border-amber-500/40 transition-colors space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">1. Industrial SQL & Analytics Engineering</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Go far beyond basic <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded">SELECT</code> queries. Master recursive CTEs, window functions, query execution optimization, dimensional modeling (star & snowflake schemas), and dbt transformation pipelines.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">2. High-Performance EDA & Statistical Inference</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Clean real-world unstructured datasets at scale using Python, Pandas, and ultra-fast Polars. Apply hypothesis testing, A/B experiment design, Bayesian probability, and anomaly detection to make rock-solid assertions.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">3. Applied Machine Learning & Predictive Modeling</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Build and tune production-ready algorithms with Scikit-Learn, LightGBM, and PyTorch. Master automated feature engineering, cross-validation architectures, hyperparameter optimization, and low-latency inference APIs.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 hover:border-purple-500/40 transition-colors space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">4. Executive BI & Metric Storytelling</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Transform raw numbers into decisive executive dashboards. Design north-star metric hierarchies, retention cohort matrices, and interactive visual narratives using PowerBI, Tableau, and Streamlit.
                </p>
              </div>
            </div>
          </div>

          {/* Modern Tech Stack Badges */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-2">
              <Binary className="w-4 h-4 text-amber-400" />
              <span>Technologies & Tools Taught in Our Curricula</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {[
                'Python 3.12',
                'Advanced PostgreSQL',
                'DuckDB',
                'Pandas & Polars',
                'NumPy & SciPy',
                'Scikit-Learn',
                'XGBoost & LightGBM',
                'PyTorch',
                'dbt (data build tool)',
                'Apache Spark',
                'Snowflake & BigQuery',
                'PowerBI & Tableau',
                'Streamlit',
                'FastAPI ML Serving',
                'Docker & Airflow'
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-[#0c101c] border border-slate-800 text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Callout */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-[#0c101c] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-white">Ready to master Data Science & Analytics?</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Explore our full catalog of deep-dive courses, datasets, architectural playbooks, and interactive cheat sheets.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('/courses')}
                className="py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <span>Browse Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('/ebooks')}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <span>Ebooks & Playbooks</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CONTACT PAGE */}
      {/* ========================================================= */}
      {page === 'contact' && (
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-amber-400 font-semibold">Support & Inquiries</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Contact the Thunder Team</h1>
            <p className="text-sm text-slate-400">
              Have questions regarding course access, corporate bulk licensing, or ebook downloads? Reach out directly below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Message Received!</h3>
                  <p className="text-xs text-slate-300">
                    Thank you for reaching out. Our engineering support team typically replies within 4 to 8 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Question about Web Dev Bootcamp payment"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Message</label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message ⚡'}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-2">
                <span className="font-mono text-amber-400 uppercase font-semibold">Direct Email</span>
                <div className="text-white font-medium">support@codingthunder.com</div>
                <div className="text-slate-400">Available Monday through Saturday</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-2">
                <span className="font-mono text-cyan-400 uppercase font-semibold">Discord Community</span>
                <div className="text-white font-medium">discord.gg/codingthunder</div>
                <div className="text-slate-400">Join 35,000+ engineers discussing bugs and code reviews</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. FAQ PAGE */}
      {/* ========================================================= */}
      {page === 'faq' && (
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-amber-400 font-semibold">Knowledge & Policies</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h1>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-white">Are the free courses really 100% free?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Yes! All courses marked as Free include full curriculum videos, lesson notes, and downloadable source code without requiring a credit card.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-white">What payment methods are supported?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We support Razorpay (for UPI, Google Pay, PhonePe, Paytm, and Indian debit/credit cards), Stripe (for worldwide Visa, Mastercard, Amex, Apple Pay), as well as a 1-click Test Mode Sandbox for evaluator demonstrations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-white">How do secure ebook downloads work?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                When you purchase any digital ebook, our backend server provisions a cryptographically signed license token. You can download your DRM-free PDF package anytime directly from your Student Dashboard.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-white">Can I get a refund if the course isn't for me?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We offer a 30-day no-questions-asked refund guarantee on all paid masterclass courses. Simply contact support with your order reference.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. ROADMAPS PAGE */}
      {/* ========================================================= */}
      {page === 'roadmaps' && (
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-amber-400 font-semibold">Step-by-Step Tracks</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">2026 Developer Roadmaps</h1>
            <p className="text-sm text-slate-400">
              Clear learning paths designed to take you from fundamentals to employment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Full-Stack Web Architect</h3>
                <span className="text-xs font-mono text-amber-400">6 Months Track</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                HTML5 & CSS Grid ➜ TypeScript ESNext ➜ React 19 & Next.js 15 ➜ Express & REST ➜ PostgreSQL & Prisma ➜ Docker & Cloud Run.
              </p>
              <button
                onClick={() => onNavigate('/courses')}
                className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View Full-Stack Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Python Backend & Automation</h3>
                <span className="text-xs font-mono text-cyan-400">4 Months Track</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Python 3.12 Core ➜ OOP & Decorators ➜ Web Scraping with Playwright ➜ High-Throughput FastAPI ➜ Celery & Redis Queues.
              </p>
              <button
                onClick={() => onNavigate('/courses')}
                className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View Python Track</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">DSA & Interview Placement</h3>
                <span className="text-xs font-mono text-emerald-400">3 Months Track</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Big-O Complexity ➜ Two Pointers & Sliding Window ➜ Trees & Tries ➜ Graph BFS/DFS ➜ Dynamic Programming (1D & 2D).
              </p>
              <button
                onClick={() => onNavigate('/ebooks')}
                className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View DSA 150 Core Patterns</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">DevOps & Cloud Engineering</h3>
                <span className="text-xs font-mono text-purple-400">5 Months Track</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Linux Shell Scripting ➜ Docker Multi-Stage Builds ➜ Kubernetes Pods & Services ➜ GitHub Actions CI/CD ➜ Prometheus Monitoring.
              </p>
              <button
                onClick={() => onNavigate('/courses')}
                className="text-xs text-purple-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Explore DevOps Track</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. PRIVACY POLICY */}
      {/* ========================================================= */}
      {page === 'privacy' && (
        <div className="space-y-6 text-sm leading-relaxed text-slate-300">
          <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs font-mono text-slate-500">Effective Date: January 1, 2026</p>
          <p>
            At Codingthunder, we respect your privacy. We collect minimal information required to deliver educational services, course progress tracking, and authorized ebook licensing.
          </p>
          <h3 className="text-lg font-bold text-white pt-2">Data We Collect</h3>
          <p>
            We collect your name, email address, password hash (salted using cryptographic PBKDF2), enrolled courses, and transaction records. We do not store raw credit card numbers; payment processing is handled through PCI-compliant gateways (Razorpay and Stripe).
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. TERMS OF SERVICE */}
      {/* ========================================================= */}
      {page === 'terms' && (
        <div className="space-y-6 text-sm leading-relaxed text-slate-300">
          <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
          <p className="text-xs font-mono text-slate-500">Effective Date: January 1, 2026</p>
          <p>
            By accessing Codingthunder, you agree to comply with and be bound by these terms. All courses, notes, and digital assets provided are licensed for individual personal and professional learning.
          </p>
          <h3 className="text-lg font-bold text-white pt-2">Digital Products & Access</h3>
          <p>
            Purchases of ebooks and courses provide lifetime personal access. Redistribution, unauthorized mirroring, or commercial resale of proprietary source materials is strictly prohibited.
          </p>
        </div>
      )}
    </div>
  );
};
