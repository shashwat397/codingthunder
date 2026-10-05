import React, { useState, useEffect } from 'react';
import { Video, BookOpen, Clock, CheckCircle2, Download, Settings, ShoppingBag, ArrowRight, User, Lock, AlertCircle, Check } from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Course, Ebook, Order, Enrollment } from '../types/index.ts';
import { downloadExactOriginalEbook } from '../utils/downloadHelper.ts';

interface StudentDashboardViewProps {
  initialTab?: string;
  onNavigate: (path: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ initialTab = 'courses', onNavigate }) => {
  const { user, refreshUser, claimAdminRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'ebooks' | 'orders' | 'settings'>(
    (initialTab as any) || 'courses'
  );
  const [dashboardData, setDashboardData] = useState<{
    user: any;
    enrolledCourses: (Enrollment & { course: Course })[];
    purchasedEbooks: (any & { ebook: Ebook })[];
    orders: Order[];
    metrics: {
      enrolledCount: number;
      completedLessons: number;
      hoursLearned: number;
      ebooksCount: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Settings form states
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await api.getStudentDashboard();
        setDashboardData(res);
        if (res.user?.name) {
          setName(res.user.name);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [user]);

  const handleDownloadEbook = (ebook: Ebook, token?: string) => {
    downloadExactOriginalEbook(ebook, token || `LIC-${ebook.id}`);
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess(null);
    setSettingsError(null);
    setIsUpdating(true);
    try {
      await api.updateProfile({ name });
      await refreshUser();
      setSettingsSuccess('Profile name updated successfully.');
    } catch (err: any) {
      setSettingsError(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess(null);
    setSettingsError(null);
    setIsUpdating(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setSettingsSuccess('Password changed successfully.');
    } catch (err: any) {
      setSettingsError(err.message || 'Failed to change password.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-10 bg-slate-800 rounded w-1/4" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-900 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = dashboardData?.metrics || {
    enrolledCount: 0,
    completedLessons: 0,
    hoursLearned: 0,
    ebooksCount: 0,
  };

  const resumeCourse = dashboardData?.enrolledCourses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
            Developer Student Workspace
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.name || 'Developer'}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#0c101c] p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'courses' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Enrolled Courses</span>
          </button>
          <button
            onClick={() => setActiveTab('ebooks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'ebooks' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ebooks ({dashboardData?.purchasedEbooks.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Receipts</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0c101c] border border-slate-800">
          <div className="text-xs text-slate-400 font-mono">Enrolled Courses</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{metrics.enrolledCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0c101c] border border-slate-800">
          <div className="text-xs text-slate-400 font-mono">Completed Lessons</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">{metrics.completedLessons}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0c101c] border border-slate-800">
          <div className="text-xs text-slate-400 font-mono">Estimated Hours</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{metrics.hoursLearned} hrs</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0c101c] border border-slate-800">
          <div className="text-xs text-slate-400 font-mono">Purchased Ebooks</div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{metrics.ebooksCount}</div>
        </div>
      </div>

      {/* TAB 1: ENROLLED COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Resume Learning Spotlight */}
          {resumeCourse && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-amber-400 font-bold">
                  Resume Your Active Course
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{resumeCourse.course.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-mono">
                  <span>{resumeCourse.progressPercentage}% Completed</span>
                  <span>·</span>
                  <span>{resumeCourse.completedLessonIds.length} of {resumeCourse.course.totalLessons} lessons done</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate(`/courses/${resumeCourse.course.slug}`)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-amber-500/20 flex items-center gap-2 shrink-0"
              >
                <span>Open Player</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <h3 className="text-lg font-bold text-white">All Enrolled Courses</h3>

          {dashboardData?.enrolledCourses.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0c101c] border border-slate-800">
              <Video className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">You have not enrolled in any courses yet</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4">Start learning with our free masterclasses or explore all courses.</p>
              <button
                onClick={() => onNavigate('/courses')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Browse Course Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData?.enrolledCourses.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#0c101c] border border-slate-800 p-5 flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.course.thumbnail}
                      alt={item.course.title}
                      className="w-24 h-20 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div className="flex-1">
                      <span className="text-[10px] font-mono text-amber-400 uppercase">
                        {item.course.category}
                      </span>
                      <h4 className="text-sm font-bold text-white line-clamp-2 mt-0.5">
                        {item.course.title}
                      </h4>
                      <div className="mt-3">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span>Progress</span>
                          <span className="text-amber-400 font-bold">{item.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-300"
                            style={{ width: `${item.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono">
                      {item.completedLessonIds.length}/{item.course.totalLessons} Lessons
                    </span>
                    <button
                      onClick={() => onNavigate(`/courses/${item.course.slug}`)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
                    >
                      {item.progressPercentage > 0 ? 'Resume Lesson' : 'Start Course'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PURCHASED EBOOKS */}
      {activeTab === 'ebooks' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">Your Licensed Digital Books</h3>

          {dashboardData?.purchasedEbooks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0c101c] border border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">No ebooks purchased yet</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4">Explore our architectural handbooks and DSA pattern playbooks.</p>
              <button
                onClick={() => onNavigate('/ebooks')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Browse Ebook Library
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData?.purchasedEbooks.map((lic) => (
                <div
                  key={lic.id}
                  className="rounded-2xl bg-[#0c101c] border border-slate-800 p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={lic.ebook.coverImage}
                      alt={lic.ebook.title}
                      className="w-16 h-22 object-cover rounded-lg shadow-md border border-slate-700 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{lic.ebook.title}</h4>
                      <div className="text-xs text-slate-400 font-mono mt-1">
                        By {lic.ebook.author} · {lic.ebook.pages} Pages
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> License Active
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadEbook(lic.ebook, lic.downloadToken)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDERS & RECEIPTS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Transaction History</h3>

          {dashboardData?.orders.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#0c101c] border border-slate-800 text-xs text-slate-400">
              No orders recorded yet.
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#0c101c]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase">
                  <tr>
                    <th className="p-3.5">Order Ref</th>
                    <th className="p-3.5">Item</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Method</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {dashboardData?.orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-900/40">
                      <td className="p-3.5 font-bold text-white">{o.orderNumber}</td>
                      <td className="p-3.5 font-sans text-slate-200">{o.itemTitle}</td>
                      <td className="p-3.5 font-bold text-amber-400">₹{o.amount}</td>
                      <td className="p-3.5 text-slate-400 uppercase">{o.paymentMethod}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <h3 className="text-lg font-bold text-white">Account & Security</h3>

          {/* Administrator Role Banner - Only visible to admin or site owner */}
          {(user?.role === 'admin' || user?.email?.toLowerCase() === 'mishrashashwat90@gmail.com') && (
            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-amber-300">Administrator Privileges</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {user?.role === 'admin'
                      ? 'Your account currently has full Administrator control over courses, tutorials, ebooks, and users.'
                      : 'Claim administrator permissions to unlock the Course Builder, Ebook Uploads, and Admin Dashboard.'}
                  </p>
                </div>
                {user?.role === 'admin' ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('/admin')}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs whitespace-nowrap cursor-pointer hover:bg-amber-400 shadow-md"
                  >
                    Open Admin Dashboard
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      await claimAdminRole();
                      setSettingsSuccess('Successfully upgraded your account to Administrator!');
                      setTimeout(() => onNavigate('/admin'), 1200);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    ⚡ Upgrade to Administrator
                  </button>
                )}
              </div>
            </div>
          )}

          {settingsSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{settingsSuccess}</span>
            </div>
          )}
          {settingsError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{settingsError}</span>
            </div>
          )}

          {/* Profile Name Form */}
          <form onSubmit={handleUpdateName} className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>Profile Information</span>
            </h4>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-500 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
            >
              Save Profile Changes
            </button>
          </form>

          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Update Password</span>
            </h4>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">New Password (min 6 characters)</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
