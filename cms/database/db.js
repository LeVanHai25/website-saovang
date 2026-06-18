/**
 * Database layer — sql.js (SQLite WebAssembly)
 * Wrapper API compatible with better-sqlite3 synchronous style.
 * No native compilation required — runs on any platform.
 */
const fs   = require('fs');
const path = require('path');

const DB_PATH     = path.join(__dirname, 'db.sqlite');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let _db = null;

// ── Synchronous Statement wrapper ─────────────────────────────
class Statement {
  constructor(db, sql) {
    this._db  = db;
    this._sql = sql;
  }

  /**
   * Execute INSERT/UPDATE/DELETE — returns { lastInsertRowid, changes }
   * Accepts: positional args OR a single named-param object
   */
  run(...args) {
    let params = [];
    if (args.length === 1 && args[0] !== null && typeof args[0] === 'object' && !Array.isArray(args[0])) {
      params = Object.values(args[0]);
    } else {
      params = args.flat();
    }

    // Replace null-passed placeholders for sql.js
    params = params.map(p => p === undefined ? null : p);

    this._db._sqljs.run(this._sql, params);
    this._db._dirty = true;

    const rows = this._db._sqljs.exec('SELECT last_insert_rowid() as id, changes() as c');
    const vals = rows[0]?.values?.[0] || [0, 0];
    return { lastInsertRowid: vals[0], changes: vals[1] };
  }

  /**
   * SELECT returning first row as object, or undefined
   */
  get(...args) {
    const params = args.flat().map(p => p === undefined ? null : p);
    let stmt;
    try {
      stmt = this._db._sqljs.prepare(this._sql);
      if (params.length) stmt.bind(params);
      if (stmt.step()) {
        return stmt.getAsObject();
      }
      return undefined;
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.warn('[DB get]', this._sql, e.message);
      return undefined;
    } finally {
      stmt?.free();
    }
  }

  /**
   * SELECT returning all rows as array of objects
   */
  all(...args) {
    const params = args.flat().map(p => p === undefined ? null : p);
    let stmt;
    const rows = [];
    try {
      stmt = this._db._sqljs.prepare(this._sql);
      if (params.length) stmt.bind(params);
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.warn('[DB all]', this._sql, e.message);
    } finally {
      stmt?.free();
    }
    return rows;
  }
}

// ── Database wrapper ──────────────────────────────────────────
class Database {
  constructor(sqljs) {
    this._sqljs = sqljs;
    this._dirty = false;

    // Periodic save every 3s when dirty
    this._saveInterval = setInterval(() => {
      if (this._dirty) this._persist();
    }, 3000);
  }

  prepare(sql) {
    return new Statement(this, sql);
  }

  exec(sql) {
    try {
      this._sqljs.run(sql);
      this._dirty = true;
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.warn('[DB exec]', e.message);
    }
  }

  _persist() {
    try {
      const data = this._sqljs.export();
      fs.writeFileSync(DB_PATH, Buffer.from(data));
      this._dirty = false;
    } catch (e) {
      console.error('[DB persist error]', e.message);
    }
  }

  close() {
    if (this._dirty) this._persist();
    clearInterval(this._saveInterval);
    this._sqljs.close();
  }
}

// ── Initialize ────────────────────────────────────────────────
async function initDb() {
  const initSqlJs = require('sql.js');
  const SQL = await initSqlJs();

  let sqljs;
  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH);
    sqljs = new SQL.Database(buf);
    console.log('[DB] Loaded existing database:', DB_PATH);
  } else {
    sqljs = new SQL.Database();
    console.log('[DB] Created new database');
  }

  _db = new Database(sqljs);

  // Run schema (statement by statement)
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  _runSchema(sqljs, schema);

  // Insert default data
  _insertDefaults(sqljs);

  // Initial save
  _db._persist();
  return _db;
}

function _runSchema(sqljs, schema) {
  // Remove comments, split by semicolons
  const cleaned = schema.replace(/--[^\n]*/g, '').replace(/\r\n/g, '\n');
  const stmts   = cleaned.split(';').map(s => s.trim()).filter(s => s.length > 5);

  for (const stmt of stmts) {
    try {
      sqljs.run(stmt);
    } catch (e) {
      if (!e.message.includes('already exists') && !e.message.includes('duplicate')) {
        if (process.env.NODE_ENV === 'development') console.warn('[Schema]', e.message, stmt.slice(0, 60));
      }
    }
  }
}

function _insertDefaults(sqljs) {
  // Default asset folders
  const folders = [
    [1, 'Projects',  'projects',  '/projects'],
    [2, 'Products',  'products',  '/products'],
    [3, 'News',      'news',      '/news'],
    [4, 'Downloads', 'downloads', '/downloads'],
    [5, 'CAD Files', 'cad',       '/cad'],
    [6, 'Videos',    'videos',    '/videos'],
    [7, 'General',   'general',   '/general'],
  ];
  for (const [id, name, slug, p] of folders) {
    try {
      sqljs.run('INSERT OR IGNORE INTO asset_folders (id, name, slug, path) VALUES (?,?,?,?)', [id, name, slug, p]);
    } catch {}
  }

  // Default settings
  const settings = [
    ['site_name',        'Cơ Khí & Nhôm Kính Sao Vàng',       'text',  'Tên website',            'general'],
    ['site_tagline',     'Bền vững với thời gian – Đem tinh hoa về cho đất Việt', 'text',  'Tagline',                'general'],
    ['site_email',       'info@saovang.vn',                   'text',  'Email liên hệ',           'general'],
    ['site_phone',       '0869 590 279',                      'text',  'Số điện thoại',           'general'],
    ['site_address',     'Tầng 3, TT7-35 Khu đô thị Văn Phú, Phường Kiến Hưng, TP Hà Nội, Việt Nam', 'text',  'Địa chỉ', 'general'],
    ['facebook_url',     '',                                  'text',  'Facebook URL',            'social'],
    ['youtube_url',      '',                                  'text',  'YouTube URL',             'social'],
    ['zalo_url',         '',                                  'text',  'Zalo URL',                'social'],
    ['seo_title_suffix', '| SAO VÀNG',                        'text',  'SEO title suffix',        'seo'],
    ['seo_description',  'Chuyên thiết kế & thi công cơ khí nghệ thuật, nhôm kính kiến trúc cao cấp từ năm 2024', 'text', 'Default meta description', 'seo'],
    ['cdn_enabled',      '0',                                 'bool',  'CDN enabled',             'cdn'],
    ['cdn_base_url',     '',                                  'text',  'CDN Base URL',            'cdn'],
    ['smtp_host',        '',                                  'text',  'SMTP Host',               'email'],
    ['smtp_port',        '587',                               'number','SMTP Port',               'email'],
    ['smtp_user',        '',                                  'text',  'SMTP User',               'email'],
    ['smtp_pass',        '',                                  'text',  'SMTP Password',           'email'],
  ];
  for (const [key, value, type, label, group] of settings) {
    try {
      sqljs.run('INSERT OR IGNORE INTO settings (key, value, type, label, group_name) VALUES (?,?,?,?,?)', [key, value, type, label, group]);
    } catch {}
  }
}

function getDb() {
  if (!_db) throw new Error('Database not initialized — call initDb() first');
  return _db;
}

module.exports = { initDb, getDb };
