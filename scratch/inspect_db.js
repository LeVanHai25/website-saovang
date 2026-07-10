const { initDb } = require('../cms/database/db');

async function inspect() {
  const db = await initDb();

  // Check tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables.map(t => t.name));

  // Check columns of content
  const contentCols = db.prepare("PRAGMA table_info(content)").all();
  console.log('\nColumns of content:', contentCols.map(c => `${c.name} (${c.type})`));

  // Check columns of categories
  const catCols = db.prepare("PRAGMA table_info(categories)").all();
  console.log('\nColumns of categories:', catCols.map(c => `${c.name} (${c.type})`));

  // Sample categories
  const categories = db.prepare("SELECT * FROM categories LIMIT 10").all();
  console.log('\nSample categories:', categories);
  
  // Sample products
  const products = db.prepare("SELECT id, title, slug, category, type FROM content WHERE type='product' LIMIT 5").all();
  console.log('\nSample products:', products);
}

inspect().catch(console.error);
