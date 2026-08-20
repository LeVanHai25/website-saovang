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
  // Redirect preview URLs to clean URLs
  if (req.path.includes('/preview/')) {
    const cleanTarget = req.path.replace(/\/preview\/[^/]+\/[^/]+/, '');
    return res.redirect(301, cleanTarget || '/');
  }

  // Serve company gold logo as favicon
  if (req.path === '/favicon.ico') {
    return res.sendFile(path.join(WEBSITE_PATH, 'assets/images/logo-sv-main.svg'));
  }

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
  app.post('/api/contact', upload.single('drawing'), async (req, res) => {
    try {
      const { getDb } = require('./database/db');
      const db = getDb();
      const {
        name = '', phone = '', email = '', province = '',
        budget = '', note = '', services = [], source = 'website',
        company = ''
      } = req.body;

      if (!name || !phone) {
        return res.status(400).json({ error: 'name và phone là bắt buộc' });
      }

      // Ensure leads table exists with modern B2B schema
      db.prepare(`
        CREATE TABLE IF NOT EXISTS leads (
          id           INTEGER PRIMARY KEY AUTOINCREMENT,
          name         TEXT NOT NULL,
          phone        TEXT NOT NULL,
          email        TEXT,
          company      TEXT,
          province     TEXT,
          budget       TEXT,
          services     TEXT,
          note         TEXT,
          source       TEXT DEFAULT 'website',
          status       TEXT DEFAULT 'new',
          attachment   TEXT,
          lead_score   TEXT,
          nda_path     TEXT,
          sla_deadline TEXT,
          crm_synced   INTEGER DEFAULT 0,
          created_at   TEXT DEFAULT (datetime('now','localtime'))
        )
      `).run();

      // Ensure B2B columns exist for retro-compatibility (safe ALTERs)
      const alterCols = [
        'ALTER TABLE leads ADD COLUMN company TEXT',
        'ALTER TABLE leads ADD COLUMN attachment TEXT',
        'ALTER TABLE leads ADD COLUMN lead_score TEXT',
        'ALTER TABLE leads ADD COLUMN nda_path TEXT',
        'ALTER TABLE leads ADD COLUMN sla_deadline TEXT',
        'ALTER TABLE leads ADD COLUMN crm_synced INTEGER DEFAULT 0'
      ];
      for (const cmd of alterCols) {
        try { db.prepare(cmd).run(); } catch(e) {}
      }

      const attachment = req.file ? `/uploads${getRelativePath(req.file.path).replace(/\\/g, '/')}` : null;

      // Merge extra details (material, surface_finish, system_type, glass_type, dimensions, quantity, floors, area, etc.) into final note
      let finalNote = note || '';
      const standardFields = ['name', 'phone', 'email', 'province', 'budget', 'services', 'note', 'source', 'division', 'company'];
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
        INSERT INTO leads (name, phone, email, company, province, budget, services, note, source, attachment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const info = insert.run(
        name, phone, email || null, company || null, province || null,
        budget || null,
        Array.isArray(services) ? services.join(',') : (services || null),
        finalNote || null, source, attachment
      );

      const leadId = info.lastInsertRowid;
      console.log(`[LEAD] Created lead #${leadId}: ${name} — ${phone} (${source})`);

      // Invoke RFQ automation service
      const { processRFQ } = require('./services/rfqAutomation');
      const automations = await processRFQ(db, {
        id: leadId, name, phone, email, budget, attachment, company
      });

      // Update lead record with scored information
      db.prepare(`
        UPDATE leads
        SET lead_score = ?, nda_path = ?, sla_deadline = ?, crm_synced = ?
        WHERE id = ?
      `).run(automations.leadScore, automations.ndaPath, automations.slaDeadline, automations.crmSynced, leadId);

      res.json({
        success: true,
        id: leadId,
        message: 'Yêu cầu đã được gửi thành công. Chúng tôi sẽ liên hệ trong 2 giờ làm việc.',
        ndaUrl: automations.ndaPath || null
      });
    } catch (err) {
      console.error('[CONTACT API]', err.message);
      res.status(500).json({ error: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
    }
  });

  // ── Track order progress (B2B Customer Portal) ───────────────
  app.get('/api/track', (req, res) => {
    try {
      const { getDb } = require('./database/db');
      const db = getDb();
      const { phone = '', id = '' } = req.query;

      if (!phone && !id) {
        return res.status(400).json({ error: 'Vui lòng cung cấp Số điện thoại hoặc Mã dự án' });
      }

      let lead;
      if (id) {
        lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
      } else {
        // Query by last matching phone number (removing spaces to match)
        const cleanPhone = phone.replace(/\s/g, '');
        lead = db.prepare(`
          SELECT * FROM leads 
          WHERE replace(phone, ' ', '') = ? OR phone = ?
          ORDER BY id DESC LIMIT 1
        `).get(cleanPhone, phone);
      }

      if (!lead) {
        return res.status(404).json({ error: 'Không tìm thấy thông tin dự án phù hợp' });
      }

      res.json({
        success: true,
        lead: {
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          company: lead.company || '',
          province: lead.province || '',
          budget: lead.budget || '',
          services: lead.services || '',
          status: lead.status || 'new',
          nda_path: lead.nda_path || null,
          attachment: lead.attachment || null,
          lead_score: lead.lead_score || 'B2C - Standard',
          sla_deadline: lead.sla_deadline || '',
          created_at: lead.created_at
        }
      });
    } catch (err) {
      console.error('[TRACK API]', err.message);
      res.status(500).json({ error: 'Lỗi hệ thống khi truy vấn tiến độ' });
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
      
      const rawPath = req.path.toLowerCase().replace(/\/$/, '');
      const noDashPath = rawPath.replace(/-/g, '');
      const pathWithHtml = (rawPath + '.html').replace(/^\//, '');
      const noDashWithHtml = (noDashPath + '.html').replace(/^\//, '');
      const directFile = rawPath.replace(/^\//, '');

      // 1. Direct file check (e.g. /cokhisaovang.html)
      if (directFile && fs.existsSync(path.join(WEBSITE_PATH, directFile))) {
        return res.sendFile(path.join(WEBSITE_PATH, directFile));
      }

      // 2. No-dash html check (e.g. /cokhisaovang -> cokhisaovang.html)
      if (noDashWithHtml && fs.existsSync(path.join(WEBSITE_PATH, noDashWithHtml))) {
        return res.sendFile(path.join(WEBSITE_PATH, noDashWithHtml));
      }

      // 3. Raw with html check (e.g. /du-an -> duan.html)
      if (pathWithHtml && fs.existsSync(path.join(WEBSITE_PATH, pathWithHtml))) {
        return res.sendFile(path.join(WEBSITE_PATH, pathWithHtml));
      }

      // Default to 404 or index.html
      const notFoundFile = path.join(WEBSITE_PATH, '404.html');
      if (fs.existsSync(notFoundFile)) {
        return res.status(404).sendFile(notFoundFile);
      }
      next();
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
