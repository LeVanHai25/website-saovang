/** Revisions, Workflow, Forms, Links, Users, Settings routes */

// ═══ REVISIONS ═══════════════════════════════════════════════
const revisionsRouter = require('express').Router();
const { getDb }    = require('../database/db');
const { authenticate, authorize } = require('../middleware/auth');

revisionsRouter.get('/:contentId', authenticate, (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT r.*, u.name as changed_by_name
    FROM revisions r
    LEFT JOIN users u ON u.id = r.changed_by
    WHERE r.content_id = ?
    ORDER BY r.version DESC
  `).all(req.params.contentId);
  res.json(rows);
});

revisionsRouter.post('/:contentId/restore/:version', authenticate, authorize('editor','admin','superadmin'), (req, res) => {
  const db  = getDb();
  const rev = db.prepare('SELECT * FROM revisions WHERE content_id = ? AND version = ?').get(req.params.contentId, req.params.version);
  if (!rev) return res.status(404).json({ error: 'Revision not found' });

  const snap = JSON.parse(rev.snapshot);

  // Restore content fields (exclude id, created_at)
  const { id, created_at, ...fields } = snap.content;
  const sets = Object.keys(fields).map(k => `${k}=?`).join(',');
  db.prepare(`UPDATE content SET ${sets}, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
    .run(...Object.values(fields), req.params.contentId);

  // Restore blocks
  db.prepare('DELETE FROM blocks WHERE content_id = ?').run(req.params.contentId);
  const insertBlock = db.prepare('INSERT INTO blocks (content_id, type, position, data, visible, label) VALUES (?,?,?,?,?,?)');
  (snap.blocks || []).forEach(b => insertBlock.run(req.params.contentId, b.type, b.position, b.data, b.visible, b.label));

  // New revision entry
  const lastVer = db.prepare('SELECT MAX(version) as v FROM revisions WHERE content_id = ?').get(req.params.contentId)?.v || 0;
  db.prepare('INSERT INTO revisions (content_id, version, snapshot, message, changed_by) VALUES (?,?,?,?,?)')
    .run(req.params.contentId, lastVer + 1, rev.snapshot, `Restored from v${req.params.version}`, req.user.id);

  res.json({ restored: true, version: lastVer + 1 });
});

// ═══ WORKFLOW ═════════════════════════════════════════════════
const workflowRouter = require('express').Router();

workflowRouter.get('/:contentId', authenticate, (req, res) => {
  const db = getDb();
  const log = db.prepare(`
    SELECT w.*, u.name as changed_by_name
    FROM workflow_log w
    LEFT JOIN users u ON u.id = w.changed_by
    WHERE w.content_id = ?
    ORDER BY w.created_at DESC
  `).all(req.params.contentId);
  res.json(log);
});

workflowRouter.post('/:contentId/transition', authenticate, (req, res) => {
  const db   = getDb();
  const { to_status, note } = req.body;
  const VALID = ['draft','review','approved','published','archived'];
  if (!VALID.includes(to_status)) return res.status(400).json({ error: 'Invalid status' });

  const content = db.prepare('SELECT status FROM content WHERE id = ?').get(req.params.contentId);
  if (!content) return res.status(404).json({ error: 'Content not found' });

  // Permission: only admin+ can publish
  if (['published','approved'].includes(to_status) && !['admin','superadmin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only admin can publish or approve' });
  }

  db.prepare('UPDATE content SET status=?, published_at=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .run(to_status, to_status === 'published' ? new Date().toISOString() : null, req.params.contentId);

  db.prepare('INSERT INTO workflow_log (content_id, from_status, to_status, changed_by, note) VALUES (?,?,?,?,?)')
    .run(req.params.contentId, content.status, to_status, req.user.id, note || null);

  res.json({ status: to_status });
});

// ═══ FORMS ════════════════════════════════════════════════════
const formsRouter = require('express').Router();

formsRouter.get('/', authenticate, (req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT id, name, slug, description, is_active, submission_count, created_at FROM forms ORDER BY created_at DESC').all());
});

formsRouter.post('/', authenticate, authorize('editor','admin','superadmin'), (req, res) => {
  const { name, slug, description, fields, settings } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const db   = getDb();
  const s    = slug || name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  const info = db.prepare('INSERT INTO forms (name, slug, description, fields, settings, created_by) VALUES (?,?,?,?,?,?)')
    .run(name, s, description||null, JSON.stringify(fields||[]), JSON.stringify(settings||{}), req.user.id);
  res.status(201).json({ id: info.lastInsertRowid });
});

formsRouter.get('/:id', authenticate, (req, res) => {
  const db  = getDb();
  const row = db.prepare('SELECT * FROM forms WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  try { row.fields   = JSON.parse(row.fields); }   catch {}
  try { row.settings = JSON.parse(row.settings); } catch {}
  res.json(row);
});

formsRouter.put('/:id', authenticate, authorize('editor','admin','superadmin'), (req, res) => {
  const { name, description, fields, settings, is_active } = req.body;
  const db = getDb();
  db.prepare(`UPDATE forms SET name=COALESCE(?,name), description=COALESCE(?,description),
    fields=COALESCE(?,fields), settings=COALESCE(?,settings), is_active=COALESCE(?,is_active),
    updated_at=CURRENT_TIMESTAMP WHERE id=?`)
    .run(name||null, description||null,
      fields ? JSON.stringify(fields) : null,
      settings ? JSON.stringify(settings) : null,
      is_active!=null ? (is_active?1:0) : null,
      req.params.id);
  res.json({ updated: true });
});

formsRouter.delete('/:id', authenticate, authorize('admin','superadmin'), (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM forms WHERE id = ?').run(req.params.id);
  res.json({ deleted: true });
});

formsRouter.get('/:id/submissions', authenticate, (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM form_submissions WHERE form_id = ? ORDER BY created_at DESC LIMIT 100').all(req.params.id);
  res.json(rows.map(r => { try { r.data = JSON.parse(r.data); } catch {}; return r; }));
});

// Public: submit form
formsRouter.post('/:id/submit', (req, res) => {
  const db   = getDb();
  const form = db.prepare('SELECT id, is_active FROM forms WHERE id = ? OR slug = ?').get(req.params.id, req.params.id);
  if (!form || !form.is_active) return res.status(404).json({ error: 'Form not found' });
  db.prepare('INSERT INTO form_submissions (form_id, data, ip_address, user_agent) VALUES (?,?,?,?)')
    .run(form.id, JSON.stringify(req.body), req.ip, req.get('user-agent'));
  db.prepare('UPDATE forms SET submission_count = submission_count + 1 WHERE id = ?').run(form.id);
  res.json({ success: true, message: 'Cảm ơn! Chúng tôi sẽ liên hệ sớm.' });
});

// ═══ LINKS ════════════════════════════════════════════════════
const linksRouter = require('express').Router();

linksRouter.get('/', authenticate, (req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT * FROM links WHERE is_active=1 ORDER BY created_at DESC').all());
});

linksRouter.post('/', authenticate, authorize('editor','admin','superadmin'), (req, res) => {
  const { label, url, type='website', description, thumbnail, open_new_tab=1, track_clicks=1 } = req.body;
  if (!label || !url) return res.status(400).json({ error: 'label and url required' });
  const db   = getDb();
  const info = db.prepare('INSERT INTO links (label, url, type, description, thumbnail, open_new_tab, track_clicks, created_by) VALUES (?,?,?,?,?,?,?,?)')
    .run(label, url, type, description||null, thumbnail||null, open_new_tab?1:0, track_clicks?1:0, req.user.id);
  res.status(201).json({ id: info.lastInsertRowid });
});

linksRouter.put('/:id', authenticate, authorize('editor','admin','superadmin'), (req, res) => {
  const { label, url, type, description, open_new_tab, track_clicks, is_active } = req.body;
  const db = getDb();
  db.prepare(`UPDATE links SET label=COALESCE(?,label), url=COALESCE(?,url), type=COALESCE(?,type),
    description=COALESCE(?,description), open_new_tab=COALESCE(?,open_new_tab),
    track_clicks=COALESCE(?,track_clicks), is_active=COALESCE(?,is_active), updated_at=CURRENT_TIMESTAMP WHERE id=?`)
    .run(label||null,url||null,type||null,description||null,
      open_new_tab!=null?(open_new_tab?1:0):null,
      track_clicks!=null?(track_clicks?1:0):null,
      is_active!=null?(is_active?1:0):null, req.params.id);
  res.json({ updated: true });
});

linksRouter.delete('/:id', authenticate, authorize('admin','superadmin'), (req, res) => {
  getDb().prepare('DELETE FROM links WHERE id = ?').run(req.params.id);
  res.json({ deleted: true });
});

linksRouter.post('/:id/click', (req, res) => {
  const db = getDb();
  const link = db.prepare('SELECT id, track_clicks, url FROM links WHERE id = ?').get(req.params.id);
  if (!link) return res.status(404).json({ error: 'Not found' });
  if (link.track_clicks) {
    db.prepare('UPDATE links SET clicks = clicks + 1 WHERE id = ?').run(link.id);
    db.prepare('INSERT INTO link_clicks (link_id, ip_address, referer) VALUES (?,?,?)').run(link.id, req.ip, req.get('referer')||null);
  }
  res.json({ url: link.url });
});

// ═══ USERS ════════════════════════════════════════════════════
const usersRouter = require('express').Router();
const bcrypt      = require('bcryptjs');

usersRouter.get('/', authenticate, authorize('admin','superadmin'), (req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT id, name, email, role, avatar, is_active, last_login, created_at FROM users ORDER BY created_at DESC').all());
});

usersRouter.post('/', authenticate, authorize('admin','superadmin'), (req, res) => {
  const { name, email, password, role='editor' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  const db   = getDb();
  const info = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)')
    .run(name, email.toLowerCase(), bcrypt.hashSync(password, 10), role);
  res.status(201).json({ id: info.lastInsertRowid });
});

usersRouter.put('/:id', authenticate, authorize('admin','superadmin'), (req, res) => {
  const { name, role, is_active, avatar, password } = req.body;
  const db   = getDb();
  if (password) {
    db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(bcrypt.hashSync(password,10), req.params.id);
  }
  db.prepare(`UPDATE users SET name=COALESCE(?,name), role=COALESCE(?,role),
    is_active=COALESCE(?,is_active), avatar=COALESCE(?,avatar), updated_at=CURRENT_TIMESTAMP WHERE id=?`)
    .run(name||null, role||null, is_active!=null?(is_active?1:0):null, avatar||null, req.params.id);
  res.json({ updated: true });
});

usersRouter.delete('/:id', authenticate, authorize('superadmin'), (req, res) => {
  if (req.user.id == req.params.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  getDb().prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ deleted: true });
});

// ═══ SETTINGS ════════════════════════════════════════════════
const settingsRouter = require('express').Router();

settingsRouter.get('/', authenticate, (req, res) => {
  const db  = getDb();
  const { group } = req.query;
  const rows = group
    ? db.prepare('SELECT * FROM settings WHERE group_name = ? ORDER BY key').all(group)
    : db.prepare('SELECT * FROM settings ORDER BY group_name, key').all();
  const obj = {};
  rows.forEach(r => { obj[r.key] = r.value; });
  res.json({ data: rows, values: obj });
});

settingsRouter.put('/', authenticate, authorize('admin','superadmin'), (req, res) => {
  const db  = getDb();
  const upsert = db.prepare(`
    INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP
  `);
  const updates = req.body;
  Object.entries(updates).forEach(([k, v]) => upsert.run(k, v));
  res.json({ updated: Object.keys(updates).length });
});

// ═══ SEARCH ══════════════════════════════════════════════════
const searchRouter = require('express').Router();

searchRouter.get('/', authenticate, (req, res) => {
  const { q, limit = 20 } = req.query;
  if (!q || q.length < 2) return res.json({ content: [], assets: [], query: q || '' });
  const db = getDb();

  const contentResults = db.prepare(`
    SELECT id, type, title, slug, status, excerpt, updated_at
    FROM content
    WHERE title LIKE ? OR excerpt LIKE ? OR tags LIKE ? OR category LIKE ?
    ORDER BY updated_at DESC
    LIMIT ?
  `).all(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, parseInt(limit));

  const assetResults = db.prepare(`
    SELECT id, name, original_name, type, url, thumb_url, size, created_at
    FROM assets
    WHERE original_name LIKE ? OR alt LIKE ? OR caption LIKE ?
    ORDER BY created_at DESC
    LIMIT 10
  `).all(`%${q}%`, `%${q}%`, `%${q}%`);

  res.json({ content: contentResults, assets: assetResults, query: q });
});

// ═══ CATEGORIES ═══════════════════════════════════════════════
const categoriesRouter = require('express').Router();

// GET /api/categories
categoriesRouter.get('/', authenticate, (req, res) => {
  const db = getDb();
  const { type } = req.query;
  let sql = `SELECT c.*, COUNT(ct.id) as item_count
    FROM categories c
    LEFT JOIN content ct ON ct.category = c.name AND ct.type = c.content_type AND ct.status = 'published'
    WHERE 1=1`;
  const params = [];
  if (type) { sql += ' AND c.content_type = ?'; params.push(type); }
  sql += ' GROUP BY c.id ORDER BY c.sort_order ASC, c.name ASC';
  res.json(db.prepare(sql).all(...params));
});

// POST /api/categories
categoriesRouter.post('/', authenticate, authorize('admin','superadmin'), (req, res) => {
  const { name, slug, content_type, description, color, icon, sort_order } = req.body;
  if (!name || !content_type) return res.status(400).json({ error: 'name and content_type required' });
  const db = getDb();
  const s = slug || name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO categories (name, slug, content_type, description, color, icon, sort_order) VALUES (?,?,?,?,?,?,?)'
  ).run(name, s, content_type, description||null, color||'#c8860a', icon||null, sort_order||0);
  res.status(201).json({ id: lastInsertRowid, name, slug: s, content_type });
});

// PUT /api/categories/:id
categoriesRouter.put('/:id', authenticate, authorize('admin','superadmin'), (req, res) => {
  const { name, slug, description, color, icon, sort_order, is_active } = req.body;
  const db = getDb();
  db.prepare(`UPDATE categories SET
    name=?, slug=?, description=?, color=?, icon=?, sort_order=?, is_active=?,
    updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).run(name, slug, description, color, icon, sort_order, is_active??1, req.params.id);
  res.json({ updated: true });
});

// DELETE /api/categories/:id
categoriesRouter.delete('/:id', authenticate, authorize('admin','superadmin'), (req, res) => {
  const db = getDb();
  const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!cat) return res.status(404).json({ error: 'Not found' });
  const used = db.prepare('SELECT COUNT(*) as n FROM content WHERE category = ?').get(cat.name)?.n || 0;
  if (used > 0) return res.status(409).json({ error: `Cannot delete — ${used} items use this category` });
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ deleted: true });
});

// POST /api/settings/logo — Logo upload
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const logoUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, '../uploads/branding');
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, 'logo' + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\//i.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

categoriesRouter.post('/logo-upload', authenticate, logoUpload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = '/uploads/branding/' + req.file.filename;
  const db  = getDb();
  db.prepare('INSERT OR REPLACE INTO settings (key, value, type, label, group_name) VALUES (?,?,?,?,?)').run('site_logo', url, 'text', 'Logo URL', 'general');
  res.json({ url, message: 'Logo uploaded' });
});

module.exports = {
  revisionsRouter,
  workflowRouter,
  formsRouter,
  linksRouter,
  usersRouter,
  settingsRouter,
  searchRouter,
  categoriesRouter,
};
