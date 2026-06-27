/**
 * ════════════════════════════════════════════════════════════
 *  SAO VÀNG CMS — Main Express Server v2.1
 *  Database: sql.js (SQLite WebAssembly — no compilation)
 * ════════════════════════════════════════════════════════════
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const path      = require('path');
const fs        = require('fs');
const rateLimit = require('express-rate-limit');

const { initDb }  = require('./database/db');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Security & Middleware ─────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, message: { error: 'Too many requests' } });

// ── Static paths ──────────────────────────────────────────────
const WEBSITE_PATH = path.resolve(__dirname, process.env.WEBSITE_PATH || '../website');
const ADMIN_PATH   = path.resolve(__dirname, process.env.ADMIN_PATH   || '../admin');
const UPLOADS_PATH = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOADS_PATH, { recursive: true });

app.use('/uploads', express.static(UPLOADS_PATH, { maxAge: '7d' }));

// ── Smart Asset & Uploads Resolver for Deep/Nested Paths ────────────────
app.use((req, res, next) => {
  // Resolve static assets in nested URLs
  const assetsIdx = req.path.indexOf('/assets/');
  if (assetsIdx !== -1) {
    const relativeAssetPath = req.path.substring(assetsIdx + 1);
    const fullAssetPath = path.join(WEBSITE_PATH, relativeAssetPath);
    if (fs.existsSync(fullAssetPath)) {
      return res.sendFile(fullAssetPath);
    }
  }

  // Resolve upload files in nested URLs
  const uploadsIdx = req.path.indexOf('/uploads/');
  if (uploadsIdx !== -1) {
    const relativeUploadPath = req.path.substring(uploadsIdx + 1);
    const cleanUploadPath = relativeUploadPath.replace(/^uploads\//, '');
    const fullUploadPath = path.join(UPLOADS_PATH, cleanUploadPath);
    if (fs.existsSync(fullUploadPath)) {
      return res.sendFile(fullUploadPath);
    }
  }

  next();
});

// ── Bootstrap async (DB init → routes → listen) ──────────────
async function bootstrap() {
  console.log('\n  Initializing SAO VÀNG CMS...');

  // 1. Init database (sql.js — async WASM load)
  await initDb();
  console.log('  ✓ Database ready');

  // 2. Mount API routes (after DB is ready)
  const authRoutes    = require('./routes/auth');
  const contentRoutes = require('./routes/content');
  const assetsRoutes  = require('./routes/assets');
  const publicRoutes  = require('./routes/public');
  const {
    revisionsRouter, workflowRouter, formsRouter,
    linksRouter, usersRouter, settingsRouter, searchRouter,
    categoriesRouter,
  } = require('./routes/api');

  app.use('/api/auth',       authLimiter, authRoutes);
  app.use('/api/content',    contentRoutes);
  app.use('/api/assets',     assetsRoutes);
  app.use('/api/public',     publicRoutes);          // No-auth public API
  app.use('/api/revisions',  revisionsRouter);
  app.use('/api/workflow',   workflowRouter);
  app.use('/api/forms',      formsRouter);
  app.use('/api/links',      linksRouter);
  app.use('/api/users',      usersRouter);
  app.use('/api/settings',   settingsRouter);
  app.use('/api/search',     searchRouter);
  app.use('/api/categories', categoriesRouter);      // Categories CRUD + logo upload

  // Health
  app.get('/api/health', (req, res) => {
    const { getDb } = require('./database/db');
    const db = getDb();
    res.json({
      status: 'ok', version: '2.1.0',
      timestamp: new Date().toISOString(),
      database: {
        users:   db.prepare('SELECT COUNT(*) as n FROM users').get()?.n || 0,
        content: db.prepare('SELECT COUNT(*) as n FROM content').get()?.n || 0,
        assets:  db.prepare('SELECT COUNT(*) as n FROM assets').get()?.n || 0,
      },
    });
  });

  // ── Contact / Quote form submission (with upload support) ───
  const { upload, getRelativePath } = require('./middleware/upload');
  app.post('/api/contact', upload.single('drawing'), (req, res) => {
    try {
      const { getDb } = require('./database/db');
      const db = getDb();
      const {
        name = '', phone = '', email = '', province = '',
        budget = '', note = '', services = [], source = 'website'
      } = req.body;

      if (!name || !phone) {
        return res.status(400).json({ error: 'name và phone là bắt buộc' });
      }

      // Ensure leads table exists
      db.prepare(`
        CREATE TABLE IF NOT EXISTS leads (
          id        INTEGER PRIMARY KEY AUTOINCREMENT,
          name      TEXT NOT NULL,
          phone     TEXT NOT NULL,
          email     TEXT,
          province  TEXT,
          budget    TEXT,
          services  TEXT,
          note      TEXT,
          source    TEXT DEFAULT 'website',
          status    TEXT DEFAULT 'new',
          attachment TEXT,
          created_at TEXT DEFAULT (datetime('now','localtime'))
        )
      `).run();

      // Ensure column exists for retro-compatibility
      try {
        db.prepare('ALTER TABLE leads ADD COLUMN attachment TEXT').run();
      } catch (e) {}

      const attachment = req.file ? `/uploads${getRelativePath(req.file.path).replace(/\\/g, '/')}` : null;

      // Merge extra details (material, surface_finish, system_type, glass_type, dimensions, quantity, floors, area, etc.) into final note
      let finalNote = note || '';
      const standardFields = ['name', 'phone', 'email', 'province', 'budget', 'services', 'note', 'source', 'division'];
      const extraDetails = [];
      for (const [key, value] of Object.entries(req.body)) {
        if (!standardFields.includes(key) && value) {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          extraDetails.push(`- ${label}: ${value}`);
        }
      }
      if (req.body.division) {
        extraDetails.unshift(`- Bộ phận: ${req.body.division}`);
      }
      if (extraDetails.length > 0) {
        finalNote = `${finalNote ? finalNote + '\n\n' : ''}📌 [Thông tin kỹ thuật B2B]:\n` + extraDetails.join('\n');
      }

      const insert = db.prepare(`
        INSERT INTO leads (name, phone, email, province, budget, services, note, source, attachment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const info = insert.run(
        name, phone, email || null, province || null,
        budget || null,
        Array.isArray(services) ? services.join(',') : (services || null),
        finalNote || null, source, attachment
      );

      console.log(`[LEAD] New lead #${info.lastInsertRowid}: ${name} — ${phone} (${source}) ${attachment ? 'with attachment' : ''}`);

      res.json({
        success: true,
        id: info.lastInsertRowid,
        message: 'Yêu cầu đã được gửi thành công. Chúng tôi sẽ liên hệ trong 2 giờ làm việc.'
      });
    } catch (err) {
      console.error('[CONTACT API]', err.message);
      res.status(500).json({ error: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
    }
  });

  // Public leads count (admin only — basic auth guard)
  app.get('/api/leads', (req, res) => {
    try {
      const { getDb } = require('./database/db');
      const db = getDb();
      const leads = db.prepare(
        'SELECT id, name, phone, email, province, services, budget, source, status, created_at FROM leads ORDER BY id DESC LIMIT 100'
      ).all();
      res.json({ leads, total: leads.length });
    } catch (err) {
      // Table might not exist yet
      res.json({ leads: [], total: 0 });
    }
  });



  // 3. Admin Studio SPA
  if (fs.existsSync(ADMIN_PATH)) {
    app.use('/admin', express.static(ADMIN_PATH));
    app.get('/admin/*', (_req, res) => res.sendFile(path.join(ADMIN_PATH, 'index.html')));
  } else {
    app.get('/admin*', (_req, res) => {
      res.send(`<html><body style="font-family:monospace;padding:40px;background:#0a0a0a;color:#fff">
        <h2 style="color:#c8860a">SAO VÀNG CMS</h2>
        <p>Admin Studio not found at: <code>${ADMIN_PATH}</code></p>
        <p>Ensure the <code>admin/</code> directory exists at project root.</p>
        <p><a href="/api/health" style="color:#c8860a">API Health</a></p>
      </body></html>`);
    });
  }

  // 4. Public Website
  if (fs.existsSync(WEBSITE_PATH)) {
    app.use('/', express.static(WEBSITE_PATH));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/admin') || req.path.startsWith('/uploads')) return next();
      
      const cleanPath = req.path.toLowerCase().replace(/\/$/, '');
      let fileToServe = 'index.html';
      
      // Map deep preview and clean URLs to their corresponding physical HTML files
      if (cleanPath.endsWith('/thu-vien-san-pham') || cleanPath.endsWith('/thu-vien-sp') || cleanPath.endsWith('/thu-vien-sp.html')) {
        fileToServe = 'thu-vien-sp.html';
      } else if (cleanPath.endsWith('/thu-vien-profile-nhom') || cleanPath.endsWith('/thu-vien-profile-nhom.html')) {
        fileToServe = 'thu-vien-profile-nhom.html';
      } else if (cleanPath.endsWith('/profile-nhom-chi-tiet') || cleanPath.endsWith('/profile-nhom-chi-tiet.html')) {
        fileToServe = 'profile-nhom-chi-tiet.html';
      } else if (cleanPath.endsWith('/du-an') || cleanPath.endsWith('/du-an.html')) {
        fileToServe = 'du-an.html';
      } else if (cleanPath.endsWith('/san-pham') || cleanPath.endsWith('/san-pham.html')) {
        fileToServe = 'san-pham.html';
      } else if (cleanPath.endsWith('/tin-tuc') || cleanPath.endsWith('/tin-tuc.html')) {
        fileToServe = 'tin-tuc.html';
      } else if (cleanPath.endsWith('/lien-he') || cleanPath.endsWith('/lien-he.html')) {
        fileToServe = 'lien-he.html';
      } else if (cleanPath.endsWith('/bao-gia') || cleanPath.endsWith('/bao-gia.html')) {
        fileToServe = 'bao-gia.html';
      } else if (cleanPath.endsWith('/co-khi-sao-vang') || cleanPath.endsWith('/co-khi-sao-vang.html')) {
        fileToServe = 'co-khi-sao-vang.html';
      } else if (cleanPath.endsWith('/nhom-sao-vang') || cleanPath.endsWith('/nhom-sao-vang.html')) {
        fileToServe = 'nhom-sao-vang.html';
      } else if (cleanPath.endsWith('/linh-vuc-hoat-dong') || cleanPath.endsWith('/linh-vuc-hoat-dong.html')) {
        fileToServe = 'linh-vuc-hoat-dong.html';
      } else if (cleanPath.endsWith('/linh-vuc-co-khi') || cleanPath.endsWith('/linh-vuc-co-khi.html')) {
        fileToServe = 'linh-vuc-co-khi.html';
      } else if (cleanPath.endsWith('/linh-vuc-nhom-kinh') || cleanPath.endsWith('/linh-vuc-nhom-kinh.html')) {
        fileToServe = 'linh-vuc-nhom-kinh.html';
      } else if (cleanPath.endsWith('/gioi-thieu') || cleanPath.endsWith('/gioi-thieu.html')) {
        fileToServe = 'gioi-thieu.html';
      } else if (cleanPath.endsWith('/nang-luc') || cleanPath.endsWith('/nang-luc.html')) {
        fileToServe = 'nang-luc.html';
      } else if (cleanPath.endsWith('/cua-nhom-kinh') || cleanPath.endsWith('/cua-nhom-kinh.html')) {
        fileToServe = 'cua-nhom-kinh.html';
      } else if (cleanPath.endsWith('/vach-kinh') || cleanPath.endsWith('/vach-kinh.html')) {
        fileToServe = 'vach-kinh.html';
      } else if (cleanPath.endsWith('/lan-can-kinh') || cleanPath.endsWith('/lan-can-kinh.html')) {
        fileToServe = 'lan-can-kinh.html';
      } else if (cleanPath.endsWith('/cau-thang-xoan') || cleanPath.endsWith('/cau-thang-xoan.html')) {
        fileToServe = 'cau-thang-xoan.html';
      } else if (cleanPath.endsWith('/co-khi-nghe-thuat') || cleanPath.endsWith('/co-khi-nghe-thuat.html')) {
        fileToServe = 'co-khi-nghe-thuat.html';
      } else if (cleanPath.endsWith('/cong-nghe-thuat') || cleanPath.endsWith('/cong-nghe-thuat.html')) {
        fileToServe = 'cong-nghe-thuat.html';
      } else if (cleanPath.endsWith('/san-pham-chi-tiet') || cleanPath.endsWith('/san-pham-chi-tiet.html')) {
        fileToServe = 'san-pham-chi-tiet.html';
      } else if (cleanPath.endsWith('/du-an-chi-tiet') || cleanPath.endsWith('/du-an-chi-tiet.html')) {
        fileToServe = 'du-an-chi-tiet.html';
      } else if (cleanPath.endsWith('/tin-tuc-chi-tiet') || cleanPath.endsWith('/tin-tuc-chi-tiet.html')) {
        fileToServe = 'tin-tuc-chi-tiet.html';
      }
      
      const targetFile = path.join(WEBSITE_PATH, fileToServe);
      if (fs.existsSync(targetFile)) {
        res.sendFile(targetFile);
      } else {
        next();
      }
    });
  }

  // 5. Error handler
  app.use((err, _req, res, _next) => {
    console.error(err.stack);
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File too large' });
    if (err.message?.includes('not allowed')) return res.status(415).json({ error: err.message });
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  });

  // 6. Listen
  app.listen(PORT, () => {
    console.log('\n');
    console.log('  ╔══════════════════════════════════════════╗');
    console.log('  ║    SAO VÀNG CMS  —  v2.1.0               ║');
    console.log('  ╚══════════════════════════════════════════╝');
    console.log(`  Website : http://localhost:${PORT}`);
    console.log(`  Admin   : http://localhost:${PORT}/admin`);
    console.log(`  API     : http://localhost:${PORT}/api`);
    console.log(`  Health  : http://localhost:${PORT}/api/health`);
    console.log('  ──────────────────────────────────────────');
    console.log(`  DB      : ${path.join(__dirname, 'database/db.sqlite')}`);
    console.log(`  Uploads : ${UPLOADS_PATH}`);
    console.log('');
  });
}

bootstrap().catch(err => {
  console.error('❌ Bootstrap failed:', err);
  process.exit(1);
});

module.exports = app;
