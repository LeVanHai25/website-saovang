/**
 * Asset Routes — Digital Asset Management (DAM)
 * Upload, manage, version, convert, crop all file types
 */
const router   = require('express').Router();
const path     = require('path');
const fs       = require('fs');
const crypto   = require('crypto');
const { getDb }        = require('../database/db');
const { authenticate, authorize } = require('../middleware/auth');
const { upload, UPLOAD_BASE, getRelativePath } = require('../middleware/upload');
const { processImage, convertToWebP, cropImage, getImageMeta } = require('../services/image');

const BASE_URL = process.env.CDN_BASE_URL || '';

function fileHash(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function getFileType(mime) {
  if (mime?.startsWith('image/')) return 'image';
  if (mime?.startsWith('video/')) return 'video';
  if (['application/pdf','application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ].includes(mime)) return 'document';
  if (['application/zip','application/x-zip-compressed'].includes(mime)) return 'archive';
  return 'other';
}

// ── GET /api/assets ───────────────────────────────────────────
router.get('/', authenticate, (req, res) => {
  const db   = getDb();
  const { folder_id, type, search, page = 1, limit = 30 } = req.query;
  let where  = ['1=1'];
  let params = [];

  if (folder_id) { where.push('folder_id = ?'); params.push(parseInt(folder_id)); }
  if (type)      { where.push('type = ?');       params.push(type); }
  if (search)    { where.push('(name LIKE ? OR original_name LIKE ? OR alt LIKE ?)'); params.push(`%${search}%`,`%${search}%`,`%${search}%`); }

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const rows   = db.prepare(`SELECT * FROM assets WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, parseInt(limit), offset);
  const total  = db.prepare(`SELECT COUNT(*) as n FROM assets WHERE ${where.join(' AND ')}`).get(...params).n;

  res.json({ data: rows, total, page: parseInt(page), pages: Math.ceil(total/parseInt(limit)) });
});

// ── GET /api/assets/folders ───────────────────────────────────
router.get('/folders', authenticate, (req, res) => {
  const db  = getDb();
  const folders = db.prepare('SELECT *, (SELECT COUNT(*) FROM assets WHERE folder_id = asset_folders.id) as asset_count FROM asset_folders ORDER BY name').all();
  res.json(folders);
});

// ── POST /api/assets/folders ──────────────────────────────────
router.post('/folders', authenticate, authorize('editor','admin','superadmin'), (req, res) => {
  const { name, parent_id } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const db   = getDb();
  const slug  = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const info  = db.prepare('INSERT INTO asset_folders (name, slug, parent_id, path) VALUES (?,?,?,?)').run(name, slug, parent_id || null, '/' + slug);
  res.status(201).json({ id: info.lastInsertRowid });
});

// ── POST /api/assets/upload ────────────────────────────────────
router.post('/upload', authenticate, authorize('editor','admin','superadmin'),
  upload.array('files', 20),
  async (req, res) => {
    const db    = getDb();
    const folderId = req.body.folder_id ? parseInt(req.body.folder_id) : null;
    const results  = [];

    for (const file of (req.files || [])) {
      const relPath  = getRelativePath(file.path).replace(/\\/g, '/');
      const url      = `/uploads${relPath}`;
      const hash     = fileHash(file.path);

      // Duplicate detection
      const dup = db.prepare('SELECT id, name, url FROM assets WHERE hash = ?').get(hash);
      if (dup) {
        results.push({ ...dup, duplicate: true });
        // Remove duplicate file
        fs.unlinkSync(file.path);
        continue;
      }

      let width = null, height = null, thumbUrl = null, webpUrl = null;

      // Process images
      if (file.mimetype?.startsWith('image/') && !file.mimetype?.includes('svg')) {
        try {
          const processed = await processImage(file.path);
          width    = processed.width;
          height   = processed.height;
          if (processed.thumbPath) thumbUrl = `/uploads${getRelativePath(processed.thumbPath)}`;
          if (processed.webpPath)  webpUrl  = `/uploads${getRelativePath(processed.webpPath)}`;
        } catch (e) { console.warn('Image processing failed:', e.message); }
      } else if (file.mimetype?.startsWith('image/')) {
        const meta = await getImageMeta(file.path);
        width  = meta.width;
        height = meta.height;
      }

      const info = db.prepare(`
        INSERT INTO assets (name, original_name, type, mime_type, extension, size, path, url,
          folder_id, hash, width, height, thumb_url, webp_url, uploaded_by)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `).run(
        file.filename,
        file.originalname,
        getFileType(file.mimetype),
        file.mimetype,
        path.extname(file.originalname).toLowerCase().slice(1),
        file.size,
        file.path,
        url,
        folderId,
        hash,
        width, height,
        thumbUrl, webpUrl,
        req.user.id
      );

      results.push({
        id: info.lastInsertRowid,
        name: file.filename,
        original_name: file.originalname,
        type: getFileType(file.mimetype),
        mime_type: file.mimetype,
        size: file.size,
        url,
        thumb_url: thumbUrl,
        webp_url: webpUrl,
        width, height,
        duplicate: false,
      });
    }

    res.status(201).json(results);
  }
);

// ── GET /api/assets/:id ───────────────────────────────────────
router.get('/:id', authenticate, (req, res) => {
  const db  = getDb();
  const row = db.prepare('SELECT * FROM assets WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const versions = db.prepare('SELECT * FROM asset_versions WHERE asset_id = ? ORDER BY version DESC').all(row.id);
  res.json({ ...row, versions });
});

// ── PUT /api/assets/:id ───────────────────────────────────────
router.put('/:id', authenticate, authorize('editor','admin','superadmin'), (req, res) => {
  const db  = getDb();
  const row = db.prepare('SELECT id FROM assets WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const { alt, caption, folder_id, name } = req.body;
  db.prepare(`
    UPDATE assets SET alt=COALESCE(?,alt), caption=COALESCE(?,caption),
      folder_id=COALESCE(?,folder_id), name=COALESCE(?,name), updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(alt||null, caption||null, folder_id||null, name||null, row.id);
  res.json({ updated: true });
});

// ── DELETE /api/assets/:id ────────────────────────────────────
router.delete('/:id', authenticate, authorize('admin','superadmin'), (req, res) => {
  const db  = getDb();
  const row = db.prepare('SELECT * FROM assets WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  // Delete file from disk
  try { if (fs.existsSync(row.path)) fs.unlinkSync(row.path); } catch {}
  db.prepare('DELETE FROM assets WHERE id = ?').run(row.id);
  res.json({ deleted: true });
});

// ── POST /api/assets/:id/replace ──────────────────────────────
router.post('/:id/replace', authenticate, authorize('editor','admin','superadmin'),
  upload.single('file'),
  async (req, res) => {
    const db  = getDb();
    const row = db.prepare('SELECT * FROM assets WHERE id = ?').get(req.params.id);
    if (!row || !req.file) return res.status(400).json({ error: 'Asset or file missing' });

    // Save version history
    db.prepare('INSERT INTO asset_versions (asset_id, version, path, url, size, replaced_by) VALUES (?,?,?,?,?,?)')
      .run(row.id, row.version, row.path, row.url, row.size, req.user.id);

    const relPath = getRelativePath(req.file.path);
    const url     = `/uploads${relPath}`;
    const newVer  = row.version + 1;
    let width = null, height = null, thumbUrl = null, webpUrl = null;

    if (req.file.mimetype?.startsWith('image/')) {
      const processed = await processImage(req.file.path);
      width = processed.width; height = processed.height;
      if (processed.thumbPath) thumbUrl = `/uploads${getRelativePath(processed.thumbPath)}`;
      if (processed.webpPath)  webpUrl  = `/uploads${getRelativePath(processed.webpPath)}`;
    }

    db.prepare(`
      UPDATE assets SET path=?, url=?, size=?, version=?, width=?, height=?,
        thumb_url=?, webp_url=?, updated_at=CURRENT_TIMESTAMP WHERE id=?
    `).run(req.file.path, url, req.file.size, newVer, width, height, thumbUrl, webpUrl, row.id);

    res.json({ id: row.id, url, version: newVer });
  }
);

// ── POST /api/assets/:id/convert-webp ─────────────────────────
router.post('/:id/convert-webp', authenticate, authorize('editor','admin','superadmin'), async (req, res) => {
  const db  = getDb();
  const row = db.prepare('SELECT * FROM assets WHERE id = ?').get(req.params.id);
  if (!row || !row.type === 'image') return res.status(400).json({ error: 'Image asset required' });

  const outPath = await convertToWebP(row.path, req.body.quality || 82);
  const url     = `/uploads${getRelativePath(outPath)}`;
  db.prepare('UPDATE assets SET webp_url = ? WHERE id = ?').run(url, row.id);
  res.json({ webp_url: url });
});

// ── POST /api/assets/:id/crop ──────────────────────────────────
router.post('/:id/crop', authenticate, authorize('editor','admin','superadmin'), async (req, res) => {
  const db  = getDb();
  const row = db.prepare('SELECT * FROM assets WHERE id = ?').get(req.params.id);
  if (!row || row.type !== 'image') return res.status(400).json({ error: 'Image asset required' });

  const { x, y, width, height } = req.body;
  if (!x && !y && !width && !height) return res.status(400).json({ error: 'Crop parameters required' });

  const ext  = path.extname(row.path);
  const base = path.basename(row.path, ext);
  const outPath = path.join(path.dirname(row.path), `${base}_cropped_${Date.now()}${ext}`);

  await cropImage(row.path, { x: parseInt(x), y: parseInt(y), width: parseInt(width), height: parseInt(height) }, outPath);
  const url = `/uploads${getRelativePath(outPath)}`;
  res.json({ url, path: outPath });
});

// ── GET /api/assets/stats ─────────────────────────────────────
router.get('/stats/summary', authenticate, (req, res) => {
  const db = getDb();
  res.json({
    total:    db.prepare('SELECT COUNT(*) as n FROM assets').get().n,
    images:   db.prepare("SELECT COUNT(*) as n FROM assets WHERE type='image'").get().n,
    videos:   db.prepare("SELECT COUNT(*) as n FROM assets WHERE type='video'").get().n,
    documents:db.prepare("SELECT COUNT(*) as n FROM assets WHERE type='document'").get().n,
    totalSize:db.prepare('SELECT SUM(size) as s FROM assets').get().s || 0,
  });
});

module.exports = router;
