/**
 * Public API Routes — No authentication required
 * Used by the public website to fetch dynamic content
 * FIX: Use correlated subqueries for meta fields to avoid duplicate rows
 */
const router = require('express').Router();
const { getDb } = require('../database/db');

const CMS_BASE = process.env.CMS_BASE_URL || 'http://localhost:4000';

// Helper: get single meta value
const metaSub = (key) =>
  `(SELECT field_value FROM content_meta WHERE content_id = c.id AND field_key = '${key}' LIMIT 1)`;

// ── GET /api/public/settings ──────────────────────────────────
router.get('/settings', (req, res) => {
  const db   = getDb();
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const s    = {};
  rows.forEach(r => { s[r.key] = r.value; });
  res.json(s);
});

// ── GET /api/public/categories ────────────────────────────────
router.get('/categories', (req, res) => {
  const db = getDb();
  const { type } = req.query;
  let sql    = 'SELECT * FROM categories WHERE is_active = 1';
  const params = [];
  if (type) { sql += ' AND content_type = ?'; params.push(type); }
  sql += ' ORDER BY sort_order ASC, name ASC';
  res.json(db.prepare(sql).all(...params));
});

// ── GET /api/public/projects ──────────────────────────────────
router.get('/projects', (req, res) => {
  const db = getDb();
  const { category, limit = 50, page = 1 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let where  = ["c.type = 'project'", "c.status = 'published'"];
  const params = [];

  if (category && category !== 'all') {
    // Match by name OR by slug of the linked category row
    where.push(`(c.category = ? OR EXISTS (
      SELECT 1 FROM categories cat
      WHERE cat.name = c.category AND cat.slug = ? AND cat.content_type = 'project'
    ))`);
    params.push(category, category);
  }

  const rows = db.prepare(`
    SELECT c.id, c.title, c.slug, c.excerpt, c.thumbnail, c.category,
           c.tags, c.is_featured, c.published_at, c.sort_order,
           ${metaSub('client')}        as client,
           ${metaSub('project_value')} as project_value,
           ${metaSub('location')}      as location,
           ${metaSub('year')}          as year,
           ${metaSub('area')}          as area,
           (SELECT slug  FROM categories WHERE name = c.category AND content_type = 'project' LIMIT 1) as cat_slug,
           (SELECT color FROM categories WHERE name = c.category AND content_type = 'project' LIMIT 1) as cat_color
    FROM content c
    WHERE ${where.join(' AND ')}
    ORDER BY c.is_featured DESC, c.sort_order ASC, c.published_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, parseInt(limit), offset);

  const total = db.prepare(`
    SELECT COUNT(*) as n FROM content c WHERE ${where.join(' AND ')}
  `).get(...params)?.n || 0;

  res.json({ data: rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// ── GET /api/public/projects/:slug ────────────────────────────
router.get('/projects/:slug', (req, res) => {
  const db = getDb();
  const project = db.prepare(`
    SELECT c.*,
           ${metaSub('client')}         as client,
           ${metaSub('project_value')}  as project_value,
           ${metaSub('location')}       as location,
           ${metaSub('year')}           as year,
           ${metaSub('area')}           as area,
           ${metaSub('duration')}       as duration,
           ${metaSub('challenge')}      as challenge,
           ${metaSub('solution')}       as solution,
           ${metaSub('result')}         as result
    FROM content c
    WHERE (c.slug = ? OR CAST(c.id AS TEXT) = ?)
      AND c.type = 'project' AND c.status = 'published'
    LIMIT 1
  `).get(req.params.slug, req.params.slug);

  if (!project) return res.status(404).json({ error: 'Project not found' });

  const blocks  = db.prepare('SELECT * FROM blocks WHERE content_id = ? AND visible = 1 ORDER BY position ASC').all(project.id);
  const gallery = db.prepare("SELECT field_value FROM content_meta WHERE content_id = ? AND field_key = 'gallery' LIMIT 1").get(project.id);
  const related = db.prepare(`
    SELECT id, title, slug, thumbnail, category, excerpt FROM content
    WHERE type = 'project' AND status = 'published' AND id != ? AND category = ?
    ORDER BY published_at DESC LIMIT 3
  `).all(project.id, project.category || '');

  res.json({
    project,
    blocks: blocks.map(b => ({ ...b, data: JSON.parse(b.data || '{}') })),
    gallery: gallery ? JSON.parse(gallery.field_value || '[]') : [],
    related,
  });
});

// ── GET /api/public/products ──────────────────────────────────
router.get('/products', (req, res) => {
  const db = getDb();
  const { category, limit = 24, page = 1, sort = 'sort_order' } = req.query;
  const offset   = (parseInt(page) - 1) * parseInt(limit);
  const safeSort = ['sort_order','published_at','title'].includes(sort) ? sort : 'sort_order';

  let where  = ["c.type = 'product'", "c.status = 'published'"];
  const params = [];

  if (category && category !== 'all') {
    where.push(`(c.category = ? OR EXISTS (
      SELECT 1 FROM categories cat
      WHERE cat.name = c.category AND cat.slug = ? AND cat.content_type = 'product'
    ))`);
    params.push(category, category);
  }

  const rows = db.prepare(`
    SELECT c.id, c.title, c.slug, c.excerpt, c.thumbnail, c.category,
           c.tags, c.is_featured, c.published_at,
           ${metaSub('brand')}    as brand,
           ${metaSub('price')}    as price,
           ${metaSub('unit')}     as unit,
           ${metaSub('in_stock')} as in_stock,
           (SELECT slug  FROM categories WHERE name = c.category AND content_type = 'product' LIMIT 1) as cat_slug,
           (SELECT color FROM categories WHERE name = c.category AND content_type = 'product' LIMIT 1) as cat_color
    FROM content c
    WHERE ${where.join(' AND ')}
    ORDER BY c.is_featured DESC, c.${safeSort} ASC, c.published_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, parseInt(limit), offset);

  const total = db.prepare(`
    SELECT COUNT(*) as n FROM content c WHERE ${where.join(' AND ')}
  `).get(...params)?.n || 0;

  res.json({ data: rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// ── GET /api/public/products/:slug ────────────────────────────
router.get('/products/:slug', (req, res) => {
  const db = getDb();
  const product = db.prepare(`
    SELECT c.*,
           ${metaSub('brand')}    as brand,
           ${metaSub('price')}    as price,
           ${metaSub('unit')}     as unit,
           ${metaSub('specs')}    as specs,
           ${metaSub('in_stock')} as in_stock
    FROM content c
    WHERE (c.slug = ? OR CAST(c.id AS TEXT) = ?)
      AND c.type = 'product' AND c.status = 'published'
    LIMIT 1
  `).get(req.params.slug, req.params.slug);

  if (!product) return res.status(404).json({ error: 'Product not found' });

  const blocks  = db.prepare('SELECT * FROM blocks WHERE content_id = ? AND visible = 1 ORDER BY position ASC').all(product.id);
  const gallery = db.prepare("SELECT field_value FROM content_meta WHERE content_id = ? AND field_key = 'gallery' LIMIT 1").get(product.id);
  const related = db.prepare(`
    SELECT id, title, slug, thumbnail, category, excerpt FROM content
    WHERE type = 'product' AND status = 'published' AND id != ? AND category = ?
    ORDER BY published_at DESC LIMIT 4
  `).all(product.id, product.category || '');

  res.json({
    product,
    blocks: blocks.map(b => ({ ...b, data: JSON.parse(b.data || '{}') })),
    gallery: gallery ? JSON.parse(gallery.field_value || '[]') : [],
    related,
  });
});

// ── GET /api/public/articles ──────────────────────────────────
router.get('/articles', (req, res) => {
  const db = getDb();
  const { category, limit = 9, page = 1 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let where  = ["type = 'article'", "status = 'published'"];
  const params = [];
  if (category && category !== 'all') {
    where.push(`(category = ? OR EXISTS (
      SELECT 1 FROM categories cat
      WHERE cat.name = content.category AND cat.slug = ? AND cat.content_type = 'article'
    ))`);
    params.push(category, category);
  }


  const rows = db.prepare(`
    SELECT id, title, slug, excerpt, thumbnail, category, tags, is_featured, published_at
    FROM content WHERE ${where.join(' AND ')}
    ORDER BY is_featured DESC, published_at DESC LIMIT ? OFFSET ?
  `).all(...params, parseInt(limit), offset);

  const total = db.prepare(`SELECT COUNT(*) as n FROM content WHERE ${where.join(' AND ')}`).get(...params)?.n || 0;
  res.json({ data: rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// ── GET /api/public/articles/:slug ────────────────────────────
router.get('/articles/:slug', (req, res) => {
  const db = getDb();
  const article = db.prepare(`
    SELECT c.*, u.name as author_name
    FROM content c
    LEFT JOIN users u ON u.id = c.author_id
    WHERE (c.slug = ? OR CAST(c.id AS TEXT) = ?)
      AND c.type = 'article' AND c.status = 'published'
    LIMIT 1
  `).get(req.params.slug, req.params.slug);

  if (!article) return res.status(404).json({ error: 'Article not found' });

  const blocks  = db.prepare('SELECT * FROM blocks WHERE content_id = ? AND visible = 1 ORDER BY position ASC').all(article.id);
  const related = db.prepare(`
    SELECT id, title, slug, thumbnail, category, excerpt, published_at FROM content
    WHERE type = 'article' AND status = 'published' AND id != ? AND category = ?
    ORDER BY published_at DESC LIMIT 4
  `).all(article.id, article.category || '');

  // Tags as array
  if (article.tags) { try { article.tags = JSON.parse(article.tags); } catch {} }

  res.json({
    article,
    blocks: blocks.map(b => ({ ...b, data: JSON.parse(b.data || '{}') })),
    related,
  });
});

module.exports = router;

