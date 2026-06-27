/**
 * Seed 15 news articles from nhomkinhdaiphuc.com (adapted for Sao Vàng) into SQLite
 * Usage: node cms/database/seed-news-daiphuc.js
 */
const { initDb } = require('./db');
const fs = require('fs');
const path = require('path');

async function run() {
  const db = await initDb();

  const dataPath = path.join(__dirname, 'daiphuc_news_articles.json');
  const articles = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log('Seeding ' + articles.length + ' articles...');

  const insertContent = db.prepare(
    'INSERT OR REPLACE INTO content (type,title,slug,status,author_id,thumbnail,excerpt,category,published_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
  );
  const insertBlock = db.prepare(
    'INSERT OR REPLACE INTO blocks (content_id,type,position,data,visible,created_at,updated_at) VALUES (?,?,?,?,?,?,?)'
  );

  const now = new Date().toISOString();
  const dbNow = now.replace('T', ' ').substring(0, 19);
  let count = 0;

  for (const a of articles) {
    const ex = db.prepare('SELECT id FROM content WHERE slug = ? AND type = ?').get(a.slug, 'article');
    let cid;
    if (ex) {
      db.prepare('UPDATE content SET title=?,thumbnail=?,excerpt=?,category=?,published_at=?,updated_at=? WHERE id=?')
        .run(a.title, a.thumbnail, a.excerpt, a.category, a.published_at, dbNow, ex.id);
      cid = ex.id;
      console.log('Updated: ' + a.title);
    } else {
      const r = insertContent.run('article', a.title, a.slug, 'published', 1, a.thumbnail, a.excerpt, a.category, a.published_at, dbNow, dbNow);
      cid = r.lastInsertRowid;
      console.log('Inserted #' + cid + ': ' + a.title);
    }

    const eb = db.prepare('SELECT id FROM blocks WHERE content_id=? AND position=0').get(cid);
    const bd = JSON.stringify({ content: a.bodyContent || '' });
    if (eb) {
      db.prepare('UPDATE blocks SET data=?,updated_at=? WHERE id=?').run(bd, dbNow, eb.id);
    } else {
      insertBlock.run(cid, 'text', 0, bd, 1, dbNow, dbNow);
    }
    count++;
  }

  db._persist();
  console.log('✅ Seeded ' + count + ' articles successfully!');
  setTimeout(() => process.exit(0), 500);
}

run().catch(e => { console.error(e); process.exit(1); });
