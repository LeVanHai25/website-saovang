const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../cms/database/db.sqlite');
console.log('Database path:', DB_PATH);

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

db.serialize(() => {
  // Check tables
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Tables:', tables.map(t => t.name));
  });

  // Check columns of content
  db.all("PRAGMA table_info(content)", (err, cols) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('\nColumns of content:', cols.map(c => `${c.name} (${c.type})`));
  });

  // Check columns of content_meta
  db.all("PRAGMA table_info(content_meta)", (err, cols) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('\nColumns of content_meta:', cols.map(c => `${c.name} (${c.type})`));
  });

  // Check columns of categories
  db.all("PRAGMA table_info(categories)", (err, cols) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('\nColumns of categories:', cols.map(c => `${c.name} (${c.type})`));
  });

  // Sample categories
  db.all("SELECT * FROM categories LIMIT 10", (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('\nSample categories:', rows);
  });
  
  // Sample content of type product
  db.all("SELECT * FROM content WHERE type='product' LIMIT 3", (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('\nSample products:', rows);
  });
});

setTimeout(() => db.close(), 1000);
