/**
 * Content Routes — Universal Content Manager
 * CRUD for all content types: page, article, product, project, service, hero, popup, etc.
 */
const router   = require('express').Router();
const { getDb }      = require('../database/db');
const { authenticate, authorize } = require('../middleware/auth');

const slugify = s => s.toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ── GET /api/content ──────────────────────────────────────────
router.get('/', authenticate, (req, res) => {
  const db = getDb();
  const { type, status, category, search, page = 1, limit = 20, sort = 'updated_at', order = 'desc' } = req.query;

  let where = ['1=1'];
  let params = [];

  if (type)     { where.push('c.type = ?');     params.push(type); }
  if (status)   { where.push('c.status = ?');   params.push(status); }
  if (category) { where.push('c.category = ?'); params.push(category); }
  if (search) {
    where.push('(c.title LIKE ? OR c.excerpt LIKE ? OR c.tags LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const safeSort  = ['title','status','type','created_at','updated_at','published_at','sort_order'].includes(sort) ? sort : 'updated_at';
  const safeOrder = order === 'asc' ? 'ASC' : 'DESC';
  const offset    = (parseInt(page) - 1) * parseInt(limit);

  const rows = db.prepare(`
    SELECT c.*, u.name as author_name
    FROM content c
    LEFT JOIN users u ON u.id = c.author_id
    WHERE ${where.join(' AND ')}
    ORDER BY c.${safeSort} ${safeOrder}
    LIMIT ? OFFSET ?
  `).all(...params, parseInt(limit), offset);

  const total = db.prepare(`
    SELECT COUNT(*) as n FROM content c WHERE ${where.join(' AND ')}
  `).get(...params).n;

  res.json({ data: rows, total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) });
});

// ── GET /api/content/stats ─────────────────────────────────────
router.get('/stats', authenticate, (req, res) => {
  const db = getDb();
  const stats = {
    total:     db.prepare("SELECT COUNT(*) as n FROM content").get().n,
    published: db.prepare("SELECT COUNT(*) as n FROM content WHERE status='published'").get().n,
    draft:     db.prepare("SELECT COUNT(*) as n FROM content WHERE status='draft'").get().n,
    review:    db.prepare("SELECT COUNT(*) as n FROM content WHERE status='review'").get().n,
    byType:    db.prepare("SELECT type, COUNT(*) as n FROM content GROUP BY type").all(),
  };
  res.json(stats);
});

// ── POST /api/content ─────────────────────────────────────────
router.post('/', authenticate, authorize('editor','admin','superadmin'), (req, res) => {
  const db = getDb();
  const { type, title, slug, status='draft', thumbnail, excerpt, category, tags, seo_title, seo_desc, seo_image, og_title, og_desc, scheduled_at, is_featured, sort_order, meta, blocks } = req.body;

  if (!type || !title) return res.status(400).json({ error: 'type and title are required' });

  const finalSlug = slug || slugify(title) + '-' + Date.now().toString(36);

  // Check slug uniqueness
  const existing = db.prepare('SELECT id FROM content WHERE slug = ?').get(finalSlug);
  if (existing) return res.status(409).json({ error: `Slug "${finalSlug}" already exists` });

  const insertContent = db.prepare(`
    INSERT INTO content (type, title, slug, status, author_id, thumbnail, excerpt, category, tags,
      seo_title, seo_desc, seo_image, og_title, og_desc, scheduled_at, is_featured, sort_order,
      published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = insertContent.run(
    type, title, finalSlug, status, req.user.id,
    thumbnail || null, excerpt || null, category || null,
    typeof tags === 'object' ? JSON.stringify(tags) : tags || null,
    seo_title || null, seo_desc || null, seo_image || null,
    og_title || null, og_desc || null, scheduled_at || null,
    is_featured ? 1 : 0, sort_order || 0,
    status === 'published' ? new Date().toISOString() : null
  );

  const contentId = info.lastInsertRowid;

  // Insert meta fields
  if (meta && typeof meta === 'object') {
    const insertMeta = db.prepare('INSERT INTO content_meta (content_id, field_key, field_value, field_type) VALUES (?,?,?,?)');
    Object.entries(meta).forEach(([key, val]) => {
      insertMeta.run(contentId, key, typeof val === 'object' ? JSON.stringify(val) : String(val || ''), 'text');
    });
  }

  // Insert blocks
  if (Array.isArray(blocks)) {
    const insertBlock = db.prepare('INSERT INTO blocks (content_id, type, position, data, visible, label) VALUES (?,?,?,?,?,?)');
    blocks.forEach((b, i) => insertBlock.run(contentId, b.type, i, JSON.stringify(b.data || {}), b.visible !== false ? 1 : 0, b.label || null));
  }

  // Save revision v1
  _saveRevision(db, contentId, req.user.id, 'Initial creation');

  // Log workflow
  db.prepare('INSERT INTO workflow_log (content_id, from_status, to_status, changed_by, note) VALUES (?,?,?,?,?)')
    .run(contentId, null, status, req.user.id, 'Content created');

  res.status(201).json({ id: contentId, slug: finalSlug });
});

// ── GET /api/content/:id ──────────────────────────────────────
router.get('/:id', authenticate, (req, res) => {
  const db = getDb();
  const row = db.prepare(`
    SELECT c.*, u.name as author_name
    FROM content c
    LEFT JOIN users u ON u.id = c.author_id
    WHERE c.id = ?
  `).get(req.params.id);

  if (!row) return res.status(404).json({ error: 'Not found' });

  const meta   = db.prepare('SELECT field_key, field_value, field_type FROM content_meta WHERE content_id = ?').all(row.id);
  const blocks = db.prepare('SELECT * FROM blocks WHERE content_id = ? ORDER BY position ASC').all(row.id);

  // Parse JSON fields
  if (row.tags) { try { row.tags = JSON.parse(row.tags); } catch { /* keep as string */ } }
  const metaObj = {};
  meta.forEach(m => { metaObj[m.field_key] = m.field_value; });

  res.json({ ...row, meta: metaObj, blocks: blocks.map(b => ({ ...b, data: JSON.parse(b.data || '{}') })) });
});

// ── PUT /api/content/:id ──────────────────────────────────────
router.put('/:id', authenticate, authorize('editor','admin','superadmin'), (req, res) => {
  const db  = getDb();
  const row = db.prepare('SELECT * FROM content WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  const { title, slug, status, thumbnail, excerpt, category, tags, seo_title, seo_desc, seo_image, og_title, og_desc, scheduled_at, is_featured, sort_order, meta, blocks } = req.body;

  // Slug uniqueness check if changing
  if (slug && slug !== row.slug) {
    const dup = db.prepare('SELECT id FROM content WHERE slug = ? AND id != ?').get(slug, row.id);
    if (dup) return res.status(409).json({ error: `Slug "${slug}" already exists` });
  }

  const wasPublished = row.status !== 'published' && status === 'published';

  db.prepare(`
    UPDATE content SET
      title=COALESCE(?,title), slug=COALESCE(?,slug), status=COALESCE(?,status),
      thumbnail=?, excerpt=?, category=?, tags=?,
      seo_title=?, seo_desc=?, seo_image=?, og_title=?, og_desc=?,
      scheduled_at=?, is_featured=COALESCE(?,is_featured), sort_order=COALESCE(?,sort_order),
      published_at=COALESCE(?,published_at),
      updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(
    title || null, slug || null, status || null,
    thumbnail !== undefined ? thumbnail : row.thumbnail,
    excerpt !== undefined ? excerpt : row.excerpt,
    category !== undefined ? category : row.category,
    tags !== undefined ? (typeof tags === 'object' ? JSON.stringify(tags) : tags) : row.tags,
    seo_title !== undefined ? seo_title : row.seo_title,
    seo_desc !== undefined ? seo_desc : row.seo_desc,
    seo_image !== undefined ? seo_image : row.seo_image,
    og_title !== undefined ? og_title : row.og_title,
    og_desc !== undefined ? og_desc : row.og_desc,
    scheduled_at !== undefined ? scheduled_at : row.scheduled_at,
    is_featured !== undefined ? (is_featured ? 1 : 0) : null,
    sort_order !== undefined ? sort_order : null,
    wasPublished ? new Date().toISOString() : null,
    row.id
  );

  // Update meta fields
  if (meta && typeof meta === 'object') {
    db.prepare('DELETE FROM content_meta WHERE content_id = ?').run(row.id);
    const insertMeta = db.prepare('INSERT INTO content_meta (content_id, field_key, field_value, field_type) VALUES (?,?,?,?)');
    Object.entries(meta).forEach(([key, val]) => {
      insertMeta.run(row.id, key, typeof val === 'object' ? JSON.stringify(val) : String(val || ''), 'text');
    });
  }

  // Update blocks (full replace)
  if (Array.isArray(blocks)) {
    db.prepare('DELETE FROM blocks WHERE content_id = ?').run(row.id);
    const insertBlock = db.prepare('INSERT INTO blocks (content_id, type, position, data, visible, label) VALUES (?,?,?,?,?,?)');
    blocks.forEach((b, i) => insertBlock.run(row.id, b.type, i, JSON.stringify(b.data || {}), b.visible !== false ? 1 : 0, b.label || null));
  }

  // Save revision
  if (status && status !== row.status) {
    db.prepare('INSERT INTO workflow_log (content_id, from_status, to_status, changed_by) VALUES (?,?,?,?)')
      .run(row.id, row.status, status, req.user.id);
  }
  _saveRevision(db, row.id, req.user.id, req.body.message || 'Updated');

  res.json({ id: row.id, updated: true });
});

// ── DELETE /api/content/:id ───────────────────────────────────
router.delete('/:id', authenticate, authorize('admin','superadmin'), (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT id FROM content WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  db.prepare('DELETE FROM content WHERE id = ?').run(row.id);
  res.json({ deleted: true });
});

// ── POST /api/content/:id/publish ────────────────────────────
router.post('/:id/publish', authenticate, authorize('admin','superadmin'), (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM content WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  db.prepare(`
    UPDATE content SET status='published', published_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(row.id);

  db.prepare('INSERT INTO workflow_log (content_id, from_status, to_status, changed_by, note) VALUES (?,?,?,?,?)')
    .run(row.id, row.status, 'published', req.user.id, 'Published by ' + req.user.name);

  _saveRevision(db, row.id, req.user.id, 'Published');

  res.json({ id: row.id, status: 'published' });
});

// ── POST /api/content/:id/duplicate ──────────────────────────
router.post('/:id/duplicate', authenticate, authorize('editor','admin','superadmin'), (req, res) => {
  const db  = getDb();
  const row = db.prepare('SELECT * FROM content WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  const newSlug = row.slug + '-copy-' + Date.now().toString(36);
  const info = db.prepare(`
    INSERT INTO content (type, title, slug, status, author_id, thumbnail, excerpt, category, tags,
      seo_title, seo_desc, seo_image)
    VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    row.type, row.title + ' (Copy)', newSlug, req.user.id,
    row.thumbnail, row.excerpt, row.category, row.tags,
    row.seo_title, row.seo_desc, row.seo_image
  );

  // Copy blocks
  const blocks = db.prepare('SELECT * FROM blocks WHERE content_id = ? ORDER BY position').all(row.id);
  const insertBlock = db.prepare('INSERT INTO blocks (content_id, type, position, data, visible, label) VALUES (?,?,?,?,?,?)');
  blocks.forEach(b => insertBlock.run(info.lastInsertRowid, b.type, b.position, b.data, b.visible, b.label));

  res.status(201).json({ id: info.lastInsertRowid, slug: newSlug });
});

// Helper: save revision snapshot
function _saveRevision(db, contentId, userId, message) {
  const content = db.prepare('SELECT * FROM content WHERE id = ?').get(contentId);
  if (!content) return;
  const meta   = db.prepare('SELECT * FROM content_meta WHERE content_id = ?').all(contentId);
  const blocks = db.prepare('SELECT * FROM blocks WHERE content_id = ? ORDER BY position').all(contentId);
  const lastVer = db.prepare('SELECT MAX(version) as v FROM revisions WHERE content_id = ?').get(contentId)?.v || 0;

  db.prepare('INSERT INTO revisions (content_id, version, snapshot, message, changed_by) VALUES (?,?,?,?,?)')
    .run(contentId, lastVer + 1, JSON.stringify({ content, meta, blocks }), message || 'Updated', userId);
}

module.exports = router;
