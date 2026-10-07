import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './src/server/routes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, 'data/uploads');

async function bootstrap() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProd = process.env.NODE_ENV === 'production';

  // Body parsers
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve uploaded assets directly from persistent storage
  app.get(['/data/uploads/:filename', '/uploads/:filename'], (req, res, next) => {
    const safeName = path.basename(req.params.filename);
    const filePath = path.resolve(UPLOADS_DIR, safeName);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(safeName).toLowerCase();
      if (ext === '.pdf') {
        res.setHeader('Content-Type', 'application/pdf');
      }
      res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
      return res.sendFile(filePath);
    }
    next();
  });

  // Mount API router
  app.use('/api', apiRouter);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  if (!isProd) {
    // Vite Dev Server middleware mode
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Codingthunder] Server listening on port ${PORT}`);
    console.log(`[Codingthunder] Demo Admin: admin@codingthunder.demo / ThunderDemo!2026`);
    console.log(`[Codingthunder] Demo Student: student@codingthunder.demo / ThunderStudent!2026`);
  });
}

bootstrap().catch(err => {
  console.error('[Codingthunder] Server bootstrap failure:', err);
  process.exit(1);
});
