-- ════════════════════════════════════════════════════════════
-- SAO VÀNG CMS — Database Schema v2.1 (sql.js compatible)
-- ════════════════════════════════════════════════════════════

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL,
  slug         TEXT    NOT NULL,
  content_type TEXT    NOT NULL DEFAULT 'project',
  description  TEXT,
  color        TEXT    DEFAULT '#c8860a',
  icon         TEXT,
  sort_order   INTEGER DEFAULT 0,
  is_active    INTEGER DEFAULT 1,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug, content_type)
);

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL DEFAULT 'editor',
  avatar        TEXT,
  is_active     INTEGER NOT NULL DEFAULT 1,
  last_login    DATETIME,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  type          TEXT    NOT NULL DEFAULT 'article',
  title         TEXT    NOT NULL,
  slug          TEXT    UNIQUE,
  status        TEXT    NOT NULL DEFAULT 'draft',
  author_id     INTEGER,
  thumbnail     TEXT,
  excerpt       TEXT,
  category      TEXT,
  tags          TEXT,
  seo_title     TEXT,
  seo_desc      TEXT,
  seo_image     TEXT,
  og_title      TEXT,
  og_desc       TEXT,
  scheduled_at  DATETIME,
  published_at  DATETIME,
  sort_order    INTEGER DEFAULT 0,
  is_featured   INTEGER DEFAULT 0,
  view_count    INTEGER DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_meta (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  content_id    INTEGER NOT NULL,
  field_key     TEXT    NOT NULL,
  field_value   TEXT,
  field_type    TEXT    DEFAULT 'text'
);

CREATE TABLE IF NOT EXISTS blocks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  content_id    INTEGER NOT NULL,
  type          TEXT    NOT NULL DEFAULT 'text',
  position      INTEGER NOT NULL DEFAULT 0,
  data          TEXT    NOT NULL DEFAULT '{}',
  visible       INTEGER NOT NULL DEFAULT 1,
  label         TEXT,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asset_folders (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  slug          TEXT    NOT NULL,
  parent_id     INTEGER,
  path          TEXT    NOT NULL DEFAULT '/',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assets (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  original_name TEXT    NOT NULL,
  type          TEXT    NOT NULL DEFAULT 'other',
  mime_type     TEXT,
  extension     TEXT,
  size          INTEGER NOT NULL DEFAULT 0,
  path          TEXT    NOT NULL,
  url           TEXT    NOT NULL,
  cdn_url       TEXT,
  folder_id     INTEGER,
  hash          TEXT,
  width         INTEGER,
  height        INTEGER,
  duration      INTEGER,
  alt           TEXT,
  caption       TEXT,
  metadata      TEXT    DEFAULT '{}',
  webp_url      TEXT,
  thumb_url     TEXT,
  version       INTEGER NOT NULL DEFAULT 1,
  uploaded_by   INTEGER,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asset_versions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id      INTEGER NOT NULL,
  version       INTEGER NOT NULL,
  path          TEXT    NOT NULL,
  url           TEXT    NOT NULL,
  size          INTEGER,
  replaced_by   INTEGER,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS revisions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  content_id    INTEGER NOT NULL,
  version       INTEGER NOT NULL,
  snapshot      TEXT    NOT NULL,
  message       TEXT,
  changed_by    INTEGER,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workflow_log (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  content_id    INTEGER NOT NULL,
  from_status   TEXT,
  to_status     TEXT    NOT NULL,
  note          TEXT,
  changed_by    INTEGER,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forms (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  slug          TEXT    UNIQUE,
  description   TEXT,
  fields        TEXT    NOT NULL DEFAULT '[]',
  settings      TEXT    NOT NULL DEFAULT '{}',
  is_active     INTEGER NOT NULL DEFAULT 1,
  submission_count INTEGER DEFAULT 0,
  created_by    INTEGER,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS form_submissions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  form_id       INTEGER NOT NULL,
  data          TEXT    NOT NULL DEFAULT '{}',
  files         TEXT    DEFAULT '[]',
  ip_address    TEXT,
  user_agent    TEXT,
  is_read       INTEGER DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS links (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  label         TEXT    NOT NULL,
  url           TEXT    NOT NULL,
  type          TEXT    NOT NULL DEFAULT 'website',
  description   TEXT,
  thumbnail     TEXT,
  open_new_tab  INTEGER NOT NULL DEFAULT 1,
  track_clicks  INTEGER NOT NULL DEFAULT 1,
  clicks        INTEGER NOT NULL DEFAULT 0,
  is_active     INTEGER NOT NULL DEFAULT 1,
  created_by    INTEGER,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS link_clicks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  link_id       INTEGER NOT NULL,
  ip_address    TEXT,
  referer       TEXT,
  clicked_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key           TEXT    PRIMARY KEY,
  value         TEXT,
  type          TEXT    DEFAULT 'text',
  label         TEXT,
  group_name    TEXT    DEFAULT 'general',
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
