import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Check,
  Tag,
  BookOpen,
  ArrowRight,
  Sparkles,
  Bookmark,
  ExternalLink,
  ChevronRight,
  List,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { BlogPost, TableOfContentsItem } from '../types/blog.ts';

interface BlogPostDetailViewProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogPostDetailView: React.FC<BlogPostDetailViewProps> = ({ slug, onNavigate }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const contentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPost() {
      setLoading(true);
      try {
        const res = await api.getBlog(slug);
        if (res && res.post) {
          const loadedPost = res.post;
          setPost(loadedPost);

          // Fetch related posts from same category or tags
          const allRes = await api.getBlogs({
            category: loadedPost.category !== 'All' ? loadedPost.category : undefined,
            limit: 4,
          });
          if (allRes && allRes.posts) {
            setRelatedPosts(allRes.posts.filter((p) => p.id !== loadedPost.id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Failed to load post:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleUpdate = () => {
      loadPost();
    };

    window.addEventListener('blog-updated', handleUpdate);
    window.addEventListener('catalog-updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'codingthunder_blogs') {
        loadPost();
      }
    };
    window.addEventListener('storage', handleStorage);

    const handleVisibility = () => {
      if (!document.hidden) {
        loadPost();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('codingthunder_blog_sync');
        bc.onmessage = () => {
          loadPost();
        };
      } catch {}
    }

    return () => {
      window.removeEventListener('blog-updated', handleUpdate);
      window.removeEventListener('catalog-updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (bc) bc.close();
    };
  }, [slug]);

  // Extract Table of Contents from HTML content H2/H3 tags
  const tableOfContents = useMemo<TableOfContentsItem[]>(() => {
    if (!post?.content) return [];

    // Parse headings via DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');
    const items: TableOfContentsItem[] = [];

    headings.forEach((h, idx) => {
      const text = h.textContent?.trim() || '';
      if (!text) return;
      const level = h.tagName.toLowerCase() === 'h2' ? 2 : 3;
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `section-${idx}`;
      items.push({ id, text, level });
    });

    return items;
  }, [post?.content]);

  // Inject IDs into rendered content headings so clicking TOC smooth scrolls to them
  useEffect(() => {
    if (contentContainerRef.current) {
      const headings = contentContainerRef.current.querySelectorAll('h2, h3');
      headings.forEach((h, idx) => {
        const text = h.textContent?.trim() || '';
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || `section-${idx}`;
        h.setAttribute('id', id);
        h.classList.add('scroll-mt-24');
      });

      // Add copy button to code blocks
      const preBlocks = contentContainerRef.current.querySelectorAll('pre');
      preBlocks.forEach((pre) => {
        if (!pre.querySelector('.code-copy-btn')) {
          const wrapper = document.createElement('div');
          wrapper.className = 'relative group';
          pre.parentNode?.insertBefore(wrapper, pre);
          wrapper.appendChild(pre);

          const copyBtn = document.createElement('button');
          copyBtn.className =
            'code-copy-btn absolute top-3 right-3 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer';
          copyBtn.innerHTML = '<span>Copy</span>';
          copyBtn.onclick = () => {
            const code = pre.querySelector('code')?.innerText || pre.innerText;
            navigator.clipboard.writeText(code);
            copyBtn.innerHTML = '<span class="text-emerald-400">Copied!</span>';
            setTimeout(() => {
              copyBtn.innerHTML = '<span>Copy</span>';
            }, 2000);
          };
          wrapper.appendChild(copyBtn);
        }
      });
    }
  }, [post?.content]);

  const scrollToHeading = (id: string) => {
    setActiveHeadingId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  const shareOnTwitter = () => {
    if (!post) return;
    const text = encodeURIComponent(`"${post.title}" via @Codingthunder`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 font-mono text-xs">Loading technical tutorial...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
        <p className="text-slate-400 text-sm">
          The requested article may have been unpublished or removed.
        </p>
        <button
          onClick={() => onNavigate('/blog')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Return to Blog Feed
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 pb-20">
      {/* Top Header & Breadcrumbs */}
      <div className="border-b border-slate-800 bg-[#090d16]/80 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <button
              onClick={() => onNavigate('/blog')}
              className="hover:text-white transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Blog
            </button>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-cyan-300 font-semibold">{post.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition text-xs font-sans cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Hero Banner */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold uppercase">
            {post.category}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> {post.readTime}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
          {post.excerpt}
        </p>

        {/* Author Bylines */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900"
            />
            <div>
              <div className="text-sm font-bold text-white">{post.authorName}</div>
              <div className="text-xs text-slate-400 font-mono">
                {post.authorRole || 'Lead Data Architect'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Eye className="w-4 h-4 text-slate-500" />
            <span>{(post.views || 0).toLocaleString()} reads</span>
          </div>
        </div>

        {/* Featured Cover Graphic */}
        {post.featuredImage && (
          <div className="mt-8 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl aspect-video bg-slate-950">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>

      {/* Main Content Layout with Sticky Table of Contents Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Sticky Table of Contents (Desktop Left Sidebar) */}
          {tableOfContents.length > 0 && (
            <aside className="hidden lg:block lg:col-span-3 sticky top-32 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-5 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-3 pb-2 border-b border-slate-800">
                  <List className="w-3.5 h-3.5" /> Table of Contents
                </div>

                <nav className="space-y-1 text-xs">
                  {tableOfContents.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToHeading(item.id)}
                      className={`block w-full text-left py-1.5 transition-colors cursor-pointer truncate ${
                        item.level === 3 ? 'pl-3 text-slate-500 hover:text-slate-300' : 'text-slate-300 hover:text-white font-medium'
                      } ${activeHeadingId === item.id ? 'text-amber-400 font-bold' : ''}`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Social Share Box */}
              <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-4 text-xs font-mono space-y-2">
                <span className="text-slate-400 font-semibold block mb-2">Share this masterclass</span>
                <button
                  onClick={shareOnTwitter}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Share on X (Twitter)</span>
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Share on LinkedIn</span>
                </button>
              </div>
            </aside>
          )}

          {/* Main Reading Pane */}
          <main
            className={`${
              tableOfContents.length > 0 ? 'lg:col-span-9' : 'lg:col-span-12 max-w-4xl mx-auto'
            } min-w-0`}
          >
            <div
              ref={contentContainerRef}
              className="prose prose-invert max-w-none text-slate-200 text-base sm:text-lg leading-relaxed [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-slate-800 [&_h2]:pb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-amber-300 [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-1.5 [&_li]:leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-slate-300 [&_blockquote]:my-8 [&_blockquote]:bg-slate-900/40 [&_blockquote]:p-4 [&_blockquote]:rounded-r-2xl [&_blockquote]:shadow-xl [&_code]:bg-slate-900 [&_code]:text-cyan-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm [&_a]:text-amber-400 [&_a]:underline [&_pre]:p-0 [&_pre]:bg-transparent [&_pre]:my-6 [&_img]:rounded-2xl [&_img]:border [&_img]:border-slate-800 [&_img]:shadow-2xl [&_figure]:my-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags Pills at Bottom of Article */}
            <div className="pt-8 mt-12 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-500 mr-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Tags:
              </span>
              {post.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Author Bio Card */}
            <div className="mt-10 p-6 sm:p-8 rounded-3xl border border-slate-800 bg-[#0a0f1d] shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-20 h-20 rounded-2xl border-2 border-slate-700 bg-slate-900 shrink-0"
              />
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-lg font-bold text-white">{post.authorName}</h3>
                    <span className="text-xs font-mono text-amber-400">
                      {post.authorRole || 'Lead Data Architect'}
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('/about')}
                    className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1 self-center sm:self-auto"
                  >
                    <span>Author Profile</span> <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {post.authorBio ||
                    'Specializes in distributed data pipelines, cloud analytics warehousing, and Trust & Safety engineering at scale.'}
                </p>
              </div>
            </div>

            {/* Related Articles Section */}
            {relatedPosts.length > 0 && (
              <section className="mt-16 pt-10 border-t border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                      Continue Learning
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                      Related Articles & Tutorials
                    </h3>
                  </div>
                  <button
                    onClick={() => onNavigate('/blog')}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 font-sans flex items-center gap-1"
                  >
                    <span>View All Articles</span> <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onNavigate(`/blog/${rel.slug}`)}
                      className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
                    >
                      <div>
                        <div className="aspect-video rounded-xl overflow-hidden border border-slate-800 mb-3 bg-slate-950">
                          <img
                            src={rel.featuredImage}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                          {rel.category}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors mt-2 line-clamp-2">
                          {rel.title}
                        </h4>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{rel.readTime}</span>
                        <span className="text-amber-400 flex items-center gap-1 group-hover:underline">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
