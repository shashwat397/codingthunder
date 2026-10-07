import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Video,
  FileText,
  BookOpen,
  Users,
  ShoppingBag,
  Settings,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Eye,
  Save,
  X,
  Upload,
  Download,
  Sparkles,
  AlertCircle,
  Database,
  Copy,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Course, Tutorial, Ebook, User, Order, SiteSettings } from '../types/index.ts';
import { saveOriginalEbookFile } from '../utils/fileStorage.ts';

interface AdminDashboardViewProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'courses' | 'tutorials' | 'ebooks' | 'users' | 'orders' | 'settings'>('analytics');

  // Data states
  const [stats, setStats] = useState<any | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals & form states
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);

  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Partial<Tutorial> | null>(null);

  const [ebookModalOpen, setEbookModalOpen] = useState(false);
  const [editingEbook, setEditingEbook] = useState<Partial<Ebook> | null>(null);
  const [isUploadingEbookFile, setIsUploadingEbookFile] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [grantModalUser, setGrantModalUser] = useState<User | null>(null);
  const [grantCourseId, setGrantCourseId] = useState('');

  const [bannerNotice, setBannerNotice] = useState<string | null>(null);
  const [schemaCopied, setSchemaCopied] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  // Strict admin authorization check - strictly restricted ONLY to mishrashashwat90@gmail.com
  const isStrictAdmin = Boolean(
    user &&
    user.role === 'admin' &&
    user.email?.toLowerCase().trim() === 'mishrashashwat90@gmail.com'
  );

  if (!isStrictAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-400 text-sm mb-4">
          Administrator privileges are strictly restricted to mishrashashwat90@gmail.com.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [st, crs, tut, ebk, usr, ord, set] = await Promise.all([
        api.getAdminStats(),
        api.getAdminCourses(),
        api.getAdminTutorials(),
        api.getAdminEbooks(),
        api.getAdminUsers(),
        api.getAdminOrders(),
        api.getAdminSettings(),
      ]);
      setStats(st.stats);
      setCourses(crs.courses);
      setTutorials(tut.tutorials);
      setEbooks(ebk.ebooks);
      setUsersList(usr.users);
      setOrders(ord.orders);
      setSettings(set.settings);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // --- Course handlers ---
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse?.title || !editingCourse?.category) return;

    try {
      if (editingCourse.id) {
        await api.updateCourse(editingCourse.id, editingCourse);
      } else {
        await api.createCourse(editingCourse);
      }
      setCourseModalOpen(false);
      setEditingCourse(null);
      await loadAllAdminData();
      setBannerNotice('Course saved successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to save course');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.deleteCourse(id);
      await loadAllAdminData();
      setBannerNotice('Course deleted.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Tutorial handlers ---
  const handleSaveTutorial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTutorial?.title || !editingTutorial?.contentMarkdown) return;
    try {
      if (editingTutorial.id) {
        await api.updateTutorial(editingTutorial.id, editingTutorial);
      } else {
        await api.createTutorial(editingTutorial);
      }
      setTutorialModalOpen(false);
      setEditingTutorial(null);
      await loadAllAdminData();
      setBannerNotice('Tutorial published successfully.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteTutorial = async (id: string) => {
    if (!confirm('Delete this tutorial?')) return;
    try {
      await api.deleteTutorial(id);
      await loadAllAdminData();
      setBannerNotice('Tutorial deleted.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Ebook handlers & uploads ---
  const handleEbookFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingEbookFile(true);
    setUploadError(null);
    try {
      const targetId = editingEbook?.id || `ebk_${Date.now()}`;
      
      // Store exact raw binary file in client IndexedDB file vault (unlimited storage)
      await saveOriginalEbookFile(targetId, file, file.name, file.type, editingEbook?.slug);
      if (editingEbook?.slug) {
        await saveOriginalEbookFile(editingEbook.slug, file, file.name, file.type);
      }
      await saveOriginalEbookFile(file.name, file, file.name, file.type);

      const res = await api.uploadFile(file);
      const safePath = res.fileUrl || (res.filePath && !res.filePath.startsWith('data:')
        ? res.filePath
        : `/api/uploads/${targetId}`);

      // Also read file as data URL to store in downloadContent for immediate resilient access
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string) || '');
        reader.readAsDataURL(file);
      });

      setEditingEbook((prev) => ({
        ...prev,
        id: prev?.id || targetId,
        downloadFileName: file.name,
        downloadFilePath: safePath,
        downloadFileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        downloadFileType: file.type || 'application/pdf',
        downloadContent: base64Data || undefined,
      }));
      setBannerNotice(`Uploaded digital package: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload ebook file');
    } finally {
      setIsUploadingEbookFile(false);
    }
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    setUploadError(null);
    try {
      // Compress cover image on client canvas to keep it lightweight (~40KB)
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 600;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.85);
            setEditingEbook((prev) => ({
              ...prev,
              coverImage: compressedUrl,
            }));
            setBannerNotice(`Uploaded and optimized cover image: ${file.name}`);
          }
          setIsUploadingCover(false);
        };
        img.onerror = () => {
          setIsUploadingCover(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload cover image');
      setIsUploadingCover(false);
    }
  };

  const handleSaveEbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEbook?.title || !editingEbook?.author) return;
    try {
      const isExisting = editingEbook.id && ebooks.some((item) => item.id === editingEbook.id);
      let saved: Ebook;
      if (isExisting) {
        const res = await api.updateEbook(editingEbook.id!, editingEbook);
        saved = res.ebook;
      } else {
        const res = await api.createEbook(editingEbook);
        saved = res.ebook;
      }
      setEbookModalOpen(false);
      setEditingEbook(null);
      await loadAllAdminData();
      setBannerNotice(`Ebook "${saved.title}" saved and published successfully.`);
    } catch (err: any) {
      alert(err.message || 'Failed to save ebook');
    }
  };

  const handleDeleteEbook = async (id: string) => {
    if (!confirm('Delete this ebook?')) return;
    try {
      await api.deleteEbook(id);
      await loadAllAdminData();
      setBannerNotice('Ebook deleted.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- User role update ---
  const handleToggleUserRole = async (targetUser: User) => {
    const newRole = targetUser.role === 'admin' ? 'student' : 'admin';
    if (!confirm(`Change role for ${targetUser.email} to ${newRole}?`)) return;
    try {
      await api.updateUserRole(targetUser.id, newRole);
      await loadAllAdminData();
      setBannerNotice(`Updated ${targetUser.email} to ${newRole}.`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGrantEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantModalUser || !grantCourseId) return;
    try {
      await api.grantUserEnrollment(grantModalUser.id, grantCourseId);
      setGrantModalUser(null);
      setGrantCourseId('');
      setBannerNotice(`Granted course enrollment to ${grantModalUser.email}.`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Settings save ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.updateAdminSettings(settings);
      setBannerNotice('Platform settings updated successfully.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSyncToSupabase = async () => {
    setIsSyncingCloud(true);
    setBannerNotice(null);
    try {
      const res = await api.syncCatalogToSupabaseCloud();
      setBannerNotice(res.message);
      if (res.success) {
        await loadAllAdminData();
      }
    } catch (err: any) {
      alert(err.message || 'Sync failed');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Title & Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold uppercase">
              Admin Access Granted
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Codingthunder Control Center
          </h1>
          <p className="text-xs text-slate-400 font-mono">Logged in as: {user?.email}</p>
        </div>

        {/* Action Button: Push to Supabase Cloud */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncToSupabase}
            disabled={isSyncingCloud}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
            title="Push your courses, ebooks, and tutorials directly to Supabase cloud database so all users and devices immediately see them"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
            <span>{isSyncingCloud ? 'Syncing to Cloud...' : '☁️ Push Catalog to Supabase Cloud'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0c101c] p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'analytics' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'courses' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('tutorials')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'tutorials' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tutorials ({tutorials.length})
          </button>
          <button
            onClick={() => setActiveTab('ebooks')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'ebooks' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ebooks ({ebooks.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'users' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Users ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {bannerNotice && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <span>⚡ {bannerNotice}</span>
          <button onClick={() => setBannerNotice(null)} className="text-amber-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. ANALYTICS TAB */}
      {/* ========================================================= */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">Total Platform Revenue</div>
              <div className="text-3xl font-black text-amber-400 font-mono mt-1">₹{stats.totalRevenue}</div>
              <div className="text-[11px] text-slate-500 mt-1">From verified student orders</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">Registered Students</div>
              <div className="text-3xl font-black text-white font-mono mt-1">{stats.totalStudents}</div>
              <div className="text-[11px] text-slate-500 mt-1">Active registered accounts</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">Course Enrollments</div>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-1">{stats.totalEnrollments}</div>
              <div className="text-[11px] text-slate-500 mt-1">Active student trackings</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">Total Completed Orders</div>
              <div className="text-3xl font-black text-cyan-400 font-mono mt-1">{stats.totalOrders}</div>
              <div className="text-[11px] text-slate-500 mt-1">Courses & Ebooks sold</div>
            </div>
          </div>

          {/* Recent Orders table */}
          <div className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Recent Transactions & Webhook Grants</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Buyer Email</th>
                    <th className="p-3">Item Purchased</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Gateway</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {stats.recentOrders?.map((o: Order) => (
                    <tr key={o.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-amber-400">{o.orderNumber}</td>
                      <td className="p-3 text-slate-300">{o.userEmail}</td>
                      <td className="p-3 font-sans text-slate-200">{o.itemTitle}</td>
                      <td className="p-3 font-bold text-white">₹{o.amount}</td>
                      <td className="p-3 uppercase text-slate-400">{o.paymentMethod}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase text-[10px]">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. COURSES TAB */}
      {/* ========================================================= */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">All Published Courses & Masterclasses</h3>
            <button
              onClick={() => {
                setEditingCourse({
                  title: '',
                  subtitle: '',
                  description: '',
                  category: 'Web Development',
                  level: 'Beginner',
                  price: 499,
                  originalPrice: 1999,
                  thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
                  published: true,
                  featured: false,
                  sections: [
                    {
                      id: `sec_${Date.now()}`,
                      title: 'Section 1: Foundations',
                      order: 1,
                      lessons: [
                        {
                          id: `les_${Date.now()}`,
                          title: 'Welcome & Architecture Overview',
                          duration: '12:00',
                          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                          isFreePreview: true,
                          notesMarkdown: '# Lesson Notes\nWelcome to this masterclass.',
                        },
                      ],
                    },
                  ],
                });
                setCourseModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#0c101c]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase">
                <tr>
                  <th className="p-3.5">Course Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Lessons</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/40">
                    <td className="p-3.5">
                      <div className="font-bold text-white font-sans text-sm line-clamp-1">{c.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{c.slug}</div>
                    </td>
                    <td className="p-3.5 text-slate-300">{c.category}</td>
                    <td className="p-3.5 font-bold text-amber-400">
                      {c.isFree ? 'FREE' : `₹${c.price}`}
                    </td>
                    <td className="p-3.5">{c.totalLessons} lessons</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {c.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingCourse(c);
                          setCourseModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        title="Edit course"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        title="Delete course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TUTORIALS TAB */}
      {/* ========================================================= */}
      {activeTab === 'tutorials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Tutorials & Cheat Sheets Management</h3>
            <button
              onClick={() => {
                setEditingTutorial({
                  title: '',
                  description: '',
                  category: 'Python',
                  readTime: '10 min read',
                  tags: ['Code', 'Guide'],
                  contentMarkdown: '# New Guide\n\nWrite your markdown content here...',
                  published: true,
                });
                setTutorialModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Tutorial</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#0c101c]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Views</th>
                  <th className="p-3.5">Read Time</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {tutorials.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40">
                    <td className="p-3.5 font-bold text-white font-sans text-sm line-clamp-1">{t.title}</td>
                    <td className="p-3.5 text-amber-400">{t.category}</td>
                    <td className="p-3.5">{t.views.toLocaleString()}</td>
                    <td className="p-3.5 text-slate-400">{t.readTime}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingTutorial(t);
                          setTutorialModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTutorial(t.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. EBOOKS TAB */}
      {/* ========================================================= */}
      {activeTab === 'ebooks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Ebook Store Management</h3>
            <button
              onClick={() => {
                setEditingEbook({
                  title: '',
                  subtitle: '',
                  author: 'Vikram "Thunder" Sharma',
                  description: '',
                  pages: 250,
                  price: 499,
                  originalPrice: 1499,
                  coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
                  previewSnippet: 'Chapter 1: Architecture Essentials...',
                  chapters: [{ title: 'Chapter 1: Essentials', page: 1 }],
                  features: ['PDF + ePub files', 'Lifetime updates'],
                  published: true,
                });
                setEbookModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Ebook</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#0c101c]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase">
                <tr>
                  <th className="p-3.5">Cover</th>
                  <th className="p-3.5">Title & Author</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">File Package</th>
                  <th className="p-3.5">Sales</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {ebooks.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-900/40">
                    <td className="p-3.5 w-14">
                      <img
                        src={e.coverImage}
                        alt={e.title}
                        className="w-10 h-14 object-cover rounded-md border border-slate-700 shadow-sm"
                      />
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white font-sans text-sm line-clamp-1">{e.title}</div>
                      <div className="text-[11px] text-slate-400">By {e.author} · {e.pages} pages</div>
                    </td>
                    <td className="p-3.5 font-bold text-amber-400">₹{e.price}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="font-sans text-slate-200">{e.downloadFileName || 'Licensed Package'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{e.downloadFileSize || '15 MB'}</div>
                    </td>
                    <td className="p-3.5">{e.salesCount || 0} sold</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        e.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {e.published ? 'Active for Sale' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <a
                        href={`/api/ebooks/${e.id}/download`}
                        title="Download & Test File"
                        className="inline-block p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => onNavigate(`/ebooks/${e.slug}`)}
                        title="View Storefront Page"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingEbook(e);
                          setEbookModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        title="Edit Ebook & Uploads"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEbook(e.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        title="Delete Ebook"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. USERS & ROLES TAB */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Registered Users & Role Permissions</h3>
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#0c101c]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Joined</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40">
                    <td className="p-3.5 font-bold text-white font-sans flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full" />
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3.5 text-slate-300">{u.email}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleUserRole(u)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] cursor-pointer"
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={() => {
                          setGrantModalUser(u);
                          setGrantCourseId(courses[0]?.id || '');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-[11px] cursor-pointer"
                      >
                        Grant Course
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. ORDERS TAB */}
      {/* ========================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">All Platform Transactions & Orders</h3>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#0c101c]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase">
                <tr>
                  <th className="p-3.5">Order Ref</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Item</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Gateway</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-900/40">
                    <td className="p-3.5 font-bold text-amber-400">{o.orderNumber}</td>
                    <td className="p-3.5 text-slate-200">{o.userEmail}</td>
                    <td className="p-3.5 font-sans text-slate-200">{o.itemTitle}</td>
                    <td className="p-3.5 uppercase text-slate-400">{o.itemType}</td>
                    <td className="p-3.5 font-bold text-white">₹{o.amount}</td>
                    <td className="p-3.5 uppercase text-slate-400">{o.paymentMethod}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase text-[10px]">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. SETTINGS & PAYMENT GATEWAY CONFIG TAB */}
      {/* ========================================================= */}
      {activeTab === 'settings' && settings && (
        <form onSubmit={handleSaveSettings} className="max-w-2xl space-y-6">
          <div className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Platform Branding & Announcement Banner</h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Site Title</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Top Announcement Banner Text</label>
              <input
                type="text"
                value={settings.bannerText}
                onChange={(e) => setSettings({ ...settings, bannerText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={settings.showBanner}
                onChange={(e) => setSettings({ ...settings, showBanner: e.target.checked })}
                className="accent-amber-500"
              />
              <span>Display top announcement banner on all pages</span>
            </label>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Payment Gateway Configuration (Razorpay)</h3>
            <p className="text-xs text-slate-400">
              Payments are processed exclusively through Razorpay (UPI, PhonePe, GPay, Paytm, Cards, NetBanking). Configure your key here or via <code className="text-amber-400 font-mono">VITE_RAZORPAY_KEY_ID</code> in environment variables.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Razorpay Key ID</label>
              <input
                type="text"
                placeholder="rzp_test_... or rzp_live_..."
                value={settings.razorpayKeyId}
                onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Save Settings
          </button>
        </form>
      )}

      {/* ========================================================= */}
      {/* COURSE EDIT / CREATE MODAL */}
      {/* ========================================================= */}
      {courseModalOpen && editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c101c] border border-slate-800 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingCourse.id ? 'Edit Course' : 'Create New Course'}
              </h3>
              <button onClick={() => setCourseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={editingCourse.title || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={editingCourse.subtitle || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={editingCourse.category || 'Web Development'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Python">Python</option>
                    <option value="DSA & Algorithms">DSA & Algorithms</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Difficulty Level</label>
                  <select
                    value={editingCourse.level || 'Beginner'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Price (₹, 0 for Free)</label>
                  <input
                    type="number"
                    value={editingCourse.price ?? 499}
                    onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingCourse.originalPrice ?? 1999}
                    onChange={(e) => setEditingCourse({ ...editingCourse, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={editingCourse.thumbnail || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Course Description</label>
                <textarea
                  rows={3}
                  value={editingCourse.description || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingCourse.published !== false}
                    onChange={(e) => setEditingCourse({ ...editingCourse, published: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Published & Visible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingCourse.featured === true}
                    onChange={(e) => setEditingCourse({ ...editingCourse, featured: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TUTORIAL EDIT / CREATE MODAL */}
      {/* ========================================================= */}
      {tutorialModalOpen && editingTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c101c] border border-slate-800 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingTutorial.id ? 'Edit Tutorial' : 'New Markdown Tutorial'}
              </h3>
              <button onClick={() => setTutorialModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTutorial} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Tutorial Title</label>
                <input
                  type="text"
                  required
                  value={editingTutorial.title || ''}
                  onChange={(e) => setEditingTutorial({ ...editingTutorial, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingTutorial.category || 'Python'}
                    onChange={(e) => setEditingTutorial({ ...editingTutorial, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={editingTutorial.readTime || '10 min read'}
                    onChange={(e) => setEditingTutorial({ ...editingTutorial, readTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Summary Description</label>
                <input
                  type="text"
                  value={editingTutorial.description || ''}
                  onChange={(e) => setEditingTutorial({ ...editingTutorial, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Markdown Body & Code Snippets</label>
                <textarea
                  rows={10}
                  required
                  value={editingTutorial.contentMarkdown || ''}
                  onChange={(e) => setEditingTutorial({ ...editingTutorial, contentMarkdown: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTutorialModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EBOOK EDIT / UPLOAD & CREATE MODAL */}
      {/* ========================================================= */}
      {ebookModalOpen && editingEbook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c101c] border border-slate-800 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingEbook.id ? 'Edit Ebook & Download Package' : 'Upload & Publish New Ebook'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload digital files (PDF, ePub, ZIP), set pricing, and publish for student purchases.
                  </p>
                </div>
              </div>
              <button onClick={() => setEbookModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEbook} className="space-y-6 text-xs">
              {/* 1. DIGITAL FILE PACKAGE UPLOAD DROPZONE */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Ebook File Package (Digital Asset for Buyers)</span>
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      This file is securely stored on the server and delivered only to authorized paying customers.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    PDF · EPUB · ZIP
                  </span>
                </div>

                {editingEbook.downloadFileName ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0c101c] border border-emerald-500/40">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{editingEbook.downloadFileName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Size: {editingEbook.downloadFileSize || 'Attached'} · Storage: Verified
                        </div>
                      </div>
                    </div>
                    <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer text-center">
                      <span>Replace File</span>
                      <input
                        type="file"
                        accept=".pdf,.epub,.zip,.txt,.md,application/pdf"
                        onChange={handleEbookFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-6 cursor-pointer bg-[#0c101c] transition-all group">
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-amber-400 mb-2 transition-colors" />
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                      {isUploadingEbookFile ? 'Uploading to persistent storage...' : 'Click to Upload Ebook File (or drag and drop)'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">Supports PDF, ePub, ZIP, or Markdown bundles</span>
                    <input
                      type="file"
                      disabled={isUploadingEbookFile}
                      accept=".pdf,.epub,.zip,.txt,.md,application/pdf"
                      onChange={handleEbookFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* 2. COVER ARTWORK UPLOAD & PREVIEW */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="sm:col-span-1 flex flex-col items-center justify-center">
                  <label className="block text-slate-400 mb-2 text-center font-medium">Cover Thumbnail</label>
                  <div className="w-28 h-36 rounded-lg bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center shadow-lg relative group">
                    {editingEbook.coverImage ? (
                      <img
                        src={editingEbook.coverImage}
                        alt="Ebook cover preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-8 h-8 text-slate-600" />
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Upload Cover Image</label>
                    <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer border border-slate-700 transition-colors">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>{isUploadingCover ? 'Uploading Cover...' : 'Choose Image File (JPG/PNG)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingCover}
                        onChange={handleCoverFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Or Provide Image URL</label>
                    <input
                      type="text"
                      value={editingEbook.coverImage || ''}
                      onChange={(e) => setEditingEbook({ ...editingEbook, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 3. METADATA (TITLE, AUTHOR, SUBTITLE) */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Ebook Title *</label>
                    <input
                      type="text"
                      required
                      value={editingEbook.title || ''}
                      onChange={(e) => setEditingEbook({ ...editingEbook, title: e.target.value })}
                      placeholder="e.g. The Full-Stack Architect's Playbook"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Author Name *</label>
                    <input
                      type="text"
                      required
                      value={editingEbook.author || ''}
                      onChange={(e) => setEditingEbook({ ...editingEbook, author: e.target.value })}
                      placeholder="e.g. Vikram 'Thunder' Sharma"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Subtitle / Key Focus</label>
                  <input
                    type="text"
                    value={editingEbook.subtitle || ''}
                    onChange={(e) => setEditingEbook({ ...editingEbook, subtitle: e.target.value })}
                    placeholder="e.g. System Architecture, Database Scaling & Microservices"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingEbook.description || ''}
                    onChange={(e) => setEditingEbook({ ...editingEbook, description: e.target.value })}
                    placeholder="Comprehensive overview of what readers will learn..."
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* 4. PRICING & SPECS */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Selling Price (₹) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingEbook.price ?? 499}
                    onChange={(e) => setEditingEbook({ ...editingEbook, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingEbook.originalPrice ?? 1499}
                    onChange={(e) => setEditingEbook({ ...editingEbook, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Total Pages</label>
                  <input
                    type="number"
                    min={1}
                    value={editingEbook.pages ?? 250}
                    onChange={(e) => setEditingEbook({ ...editingEbook, pages: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm"
                  />
                </div>
              </div>

              {/* 5. SAMPLE PREVIEW SNIPPET */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  Sample Preview Excerpt (Teaser for "Look Inside" modal)
                </label>
                <textarea
                  rows={4}
                  value={editingEbook.previewSnippet || ''}
                  onChange={(e) => setEditingEbook({ ...editingEbook, previewSnippet: e.target.value })}
                  placeholder="### Chapter 1: The Core Mental Model&#10;&#10;When starting out, understanding the fundamentals..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs leading-relaxed"
                />
              </div>

              {/* 6. PUBLISH & VISIBILITY SWITCHES */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingEbook.published !== false}
                    onChange={(e) => setEditingEbook({ ...editingEbook, published: e.target.checked })}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-semibold text-white">Publish for Immediate Purchase</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingEbook.featured === true}
                    onChange={(e) => setEditingEbook({ ...editingEbook, featured: e.target.checked })}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Feature on Homepage Spotlight</span>
                </label>
              </div>

              {/* MODAL ACTIONS */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-slate-500 font-mono text-[11px]">
                  {editingEbook.downloadFileName ? `Package: ${editingEbook.downloadFileName}` : 'No file package attached'}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEbookModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Ebook</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GRANT COURSE MODAL */}
      {/* ========================================================= */}
      {grantModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0c101c] border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Grant Manual Course Enrollment</h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Enrolling: {grantModalUser.email}
            </p>

            <form onSubmit={handleGrantEnrollment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Course to Grant</label>
                <select
                  value={grantCourseId}
                  onChange={(e) => setGrantCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGrantModalUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer"
                >
                  Grant Access ⚡
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
