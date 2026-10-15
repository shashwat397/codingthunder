import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, 'data/database.json');

/**
 * Vite plugin providing fallback HTTP connect middleware for /api/blogs and /api/admin/blogs
 * in case the development server is executed directly through Vite rather than server.ts.
 */
function blogApiVitePlugin(): Plugin {
  const readDb = () => {
    try {
      if (fs.existsSync(DB_FILE)) {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      }
    } catch {}
    return { blogs: [] };
  };

  const writeDb = (data: any) => {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Vite Plugin Blog] Error writing database.json:', err);
    }
  };

  return {
    name: 'vite-blog-api-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (!url.startsWith('/api/blogs') && !url.startsWith('/api/admin/blogs')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');

        // GET /api/blogs or GET /api/blogs/:slug
        if (req.method === 'GET' && url.startsWith('/api/blogs') && !url.startsWith('/api/blogs/revalidate')) {
          const parsedUrl = new URL(url, 'http://localhost');
          const slug = parsedUrl.pathname.replace('/api/blogs', '').replace(/^\//, '');
          const db = readDb();
          const blogs = Array.isArray(db.blogs) ? db.blogs : [];

          if (slug) {
            const post = blogs.find((b: any) => b.slug === slug || b.id === slug);
            if (!post) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'Article not found.' }));
            }
            res.statusCode = 200;
            return res.end(JSON.stringify({ post }));
          }

          const published = blogs.filter((b: any) => (b.status || 'published').toLowerCase() === 'published');
          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              posts: published,
              total: published.length,
              page: 1,
              limit: 10,
              totalPages: Math.ceil(published.length / 10) || 1,
            })
          );
        }

        // GET /api/admin/blogs
        if (req.method === 'GET' && url.startsWith('/api/admin/blogs')) {
          const db = readDb();
          const blogs = Array.isArray(db.blogs) ? db.blogs : [];
          res.statusCode = 200;
          return res.end(JSON.stringify({ posts: blogs, total: blogs.length }));
        }

        // Handle POST / PUT / DELETE with chunk streaming (50mb support)
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const data = body ? JSON.parse(body) : {};
            const db = readDb();
            if (!Array.isArray(db.blogs)) db.blogs = [];

            if (req.method === 'POST' && url.startsWith('/api/admin/blogs')) {
              const baseSlug = (data.slug || data.title || `post-${Date.now()}`)
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

              const newPost = {
                id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                title: (data.title || 'Untitled Post').trim(),
                slug: baseSlug,
                content: data.content || '',
                excerpt: data.excerpt || (data.content ? data.content.substring(0, 150) : ''),
                featuredImage:
                  data.featuredImage ||
                  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                authorId: 'usr_owner_default',
                authorName: 'Shashwat Mishra',
                authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=mishrashashwat90@gmail.com',
                authorRole: 'Lead Data Architect',
                category: data.category || 'Data Analytics',
                tags: Array.isArray(data.tags) ? data.tags : ['Data Analytics'],
                status: (data.status || 'published').toLowerCase() === 'draft' ? 'draft' : 'published',
                readTime: data.readTime || '5 min read',
                views: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              db.blogs.unshift(newPost);
              writeDb(db);
              res.statusCode = 201;
              return res.end(JSON.stringify({ success: true, post: newPost }));
            }

            if (req.method === 'PUT' && url.startsWith('/api/admin/blogs/')) {
              const id = url.replace('/api/admin/blogs/', '').split('?')[0];
              const idx = db.blogs.findIndex((b: any) => b.id === id || b.slug === id);
              if (idx === -1) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ error: 'Article not found.' }));
              }
              db.blogs[idx] = { ...db.blogs[idx], ...data, updatedAt: new Date().toISOString() };
              writeDb(db);
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, post: db.blogs[idx] }));
            }

            if (req.method === 'DELETE' && url.startsWith('/api/admin/blogs/')) {
              const id = url.replace('/api/admin/blogs/', '').split('?')[0];
              db.blogs = db.blogs.filter((b: any) => b.id !== id && b.slug !== id);
              writeDb(db);
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true }));
            }

            next();
          } catch (err: any) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message || 'Server error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), blogApiVitePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
