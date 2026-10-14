import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  Tag,
  Folder,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { BlogPost, BlogPostStatus } from '../types/blog.ts';
import { RichTextEditor } from '../components/blog/RichTextEditor.tsx';

interface AdminBlogCreateViewProps {
  editPostId?: string;
  onNavigate: (path: string) => void;
}

const CATEGORIES = [
  'Data Analytics',
  'Google Colab',
  'Looker Studio',
  'BigQuery',
  'Data Engineering',
  'SQL',
  'Python',
  'Cloud Architecture',
];

export const AdminBlogCreateView: React.FC<AdminBlogCreateViewProps> = ({
  editPostId,
  onNavigate,
}) => {
  const { user, claimAdminRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
  );
  const [category, setCategory] = useState('Data Analytics');
  const [tags, setTags] = useState<string[]>(['Data Analytics', 'Google Colab']);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<BlogPostStatus>('published');
  const [featured, setFeatured] = useState(false);
  const [seoDescription, setSeoDescription] = useState('');

  // Strict Admin Authorization Check
  const isStrictAdmin = Boolean(
    user &&
    user.role === 'admin' &&
    user.email?.toLowerCase().trim() === 'mishrashashwat90@gmail.com'
  );

  // Auto-generate slug from title
  useEffect(() => {
    if (!isSlugManuallyEdited && title) {
      const generated = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  }, [title, isSlugManuallyEdited]);

  // Load existing post if editing
  useEffect(() => {
    const id = editPostId;
    if (id) {
      const postId = id;
      async function loadPost() {
        setLoading(true);
        try {
          const res = await api.getBlog(postId);
          if (res && res.post) {
            const p = res.post;
            setTitle(p.title);
            setSlug(p.slug);
            setIsSlugManuallyEdited(true);
            setContent(p.content);
            setExcerpt(p.excerpt);
            setFeaturedImage(p.featuredImage);
            setCategory(p.category);
            setTags(p.tags || []);
            setStatus(p.status);
            setFeatured(Boolean(p.featured));
            setSeoDescription(p.seoDescription || '');
          }
        } catch (err) {
          console.error('Failed to load article:', err);
        } finally {
          setLoading(false);
        }
      }
      loadPost();
    }
  }, [editPostId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string) || '';
        const res = await api.uploadBlogImage(file.name, base64Data, file.type);
        if (res && res.url) {
          setFeaturedImage(res.url);
          showToast('Featured cover image uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (targetStatus?: BlogPostStatus) => {
    if (!title.trim()) {
      showToast('⚠️ Please enter an article title.');
      return;
    }
    if (!content.trim()) {
      showToast('⚠️ Please write article content before saving.');
      return;
    }

    setSaving(true);
    const finalStatus = targetStatus || status;

    // Ensure admin token is synchronized before making the API request
    if (!api.getToken() && user?.email?.toLowerCase().trim() === 'mishrashashwat90@gmail.com') {
      try {
        await api.claimAdminRole('mishrashashwat90@gmail.com');
      } catch (e) {
        console.warn('Could not auto-claim token:', e);
      }
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      content,
      excerpt: excerpt.trim(),
      featuredImage: featuredImage.trim(),
      category,
      tags,
      status: finalStatus,
      featured,
      seoDescription: seoDescription.trim(),
    };

    try {
      if (editPostId) {
        const res = await api.updateBlog(editPostId, payload);
        if (res && res.success) {
          showToast('✅ Article updated and live public cache purged successfully!');
        } else {
          showToast('⚠️ Failed to update article.');
        }
      } else {
        const res = await api.createBlog(payload);
        if (res && res.success) {
          showToast('✅ Article published and live public feed revalidated!');
          setTimeout(() => {
            onNavigate('/admin/blog');
          }, 1200);
        } else {
          showToast('⚠️ Failed to publish article.');
        }
      }
    } catch (err: any) {
      console.error('Failed to save article:', err);
      const detail = err?.message || 'Server connection or authorization failure';
      showToast(`⚠️ Error saving article: ${detail}`);
    } finally {
      setSaving(false);
    }
  };

  // Access Denied Screen if not admin
  if (!isStrictAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white">Admin Authentication Required</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Access to the Content Management System (CMS) is restricted to verified administrators (
          <code className="text-amber-400 font-mono">mishrashashwat90@gmail.com</code>).
        </p>

        {user && user.email?.toLowerCase().trim() === 'mishrashashwat90@gmail.com' ? (
          <button
            onClick={() => {
              claimAdminRole();
              window.location.reload();
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg cursor-pointer transition"
          >
            Activate Admin CMS Session
          </button>
        ) : (
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            Return to Homepage
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top CMS Header */}
      <header className="sticky top-0 z-40 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/admin/blog')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Articles List</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>{editPostId ? 'Edit Article' : 'Author New Article'}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                    status === 'published'
                      ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
                      : 'border-amber-500/30 text-amber-400 bg-amber-950/20'
                  }`}
                >
                  {status}
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">Codingthunder Content Architecture Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {slug && (
              <button
                type="button"
                onClick={() => onNavigate(`/blog/${slug}`)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white transition"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>View Public</span>
              </button>
            )}

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('draft')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saving ? 'Saving...' : 'Save Draft'}</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('published')}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer shadow-lg shadow-amber-500/20 flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{saving ? 'Publishing...' : 'Publish Article'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Layout: Left Editor, Right Metadata Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col lg:flex-row gap-8">
        {/* Left Column: Title & Main Rich Text Editor */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Article Title Input */}
          <div className="space-y-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Title: e.g. Modern Data Lakehouse Architecture with Apache Iceberg..."
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-lg sm:text-xl font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
            />

            {/* Live Slug Preview */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 px-2">
              <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-slate-500">URL Slug:</span>
              <span className="text-cyan-300">/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugManuallyEdited(true);
                }}
                className="bg-transparent border-b border-dashed border-slate-700 text-cyan-300 focus:outline-none focus:border-amber-400 flex-1 py-0.5 text-xs font-mono"
              />
            </div>
          </div>

          {/* Excerpt / Sub-headline */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Article Excerpt (2-3 sentences for social cards & blog feed)
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary of what readers will build or learn..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Article Content (1000+ Words Supported)
              </label>
              <span className="text-[11px] text-slate-500">Supports drag-and-drop images & formatted code blocks</span>
            </div>
            <RichTextEditor
              value={content}
              onChange={(html) => setContent(html)}
              minHeight="580px"
            />
          </div>
        </div>

        {/* Right Column: Metadata Panel */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-5 shadow-xl space-y-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold pb-2 border-b border-slate-800">
              Publishing Metadata
            </h3>

            {/* Status Switcher */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">Publish Status</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    status === 'draft'
                      ? 'border-amber-500/50 bg-amber-950/20 text-amber-300 font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    status === 'published'
                      ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300 font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Published
                </button>
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
              />
              <span className="text-xs font-medium text-slate-200">Highlight as Featured Spotlight</span>
            </label>

            {/* Featured Image URL / Upload */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">
                Featured Cover Image
              </label>

              {featuredImage && (
                <div className="relative rounded-xl overflow-hidden border border-slate-800 mb-2 aspect-video bg-slate-950">
                  <img
                    src={featuredImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-amber-400 mb-2"
              />

              <label className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-2">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload Custom Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Tags / Categories pills */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">Tags & Keywords</label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="e.g. Google Colab, BigQuery"
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SEO Meta Description */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">
                SEO Meta Description
              </label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Search engine snippet preview (150-160 characters recommended)..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
