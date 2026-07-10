/**
 * Seed 222 products from nhomkinhdaiphuc.com into SQLite db.sqlite
 * Downloads product images locally to cms/uploads/products/
 * Usage: node cms/database/seed-products-daiphuc.js
 */
const { initDb } = require('./db');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// Helper to download files
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    // Check if file already exists to speed up seeding
    if (fs.existsSync(destPath)) {
      return resolve(true);
    }

    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;

    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {}); // delete empty file
        return reject(new Error(`Failed to download: ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/-+/g, '-') // collapse dashes
    .trim('-');
}

function classifyCategory(title, url) {
  const t = (title || '').toLowerCase() + ' ' + (url || '').toLowerCase();
  const removeAccents = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  const clean = removeAccents(t);
  
  if (clean.includes('class a')) return 'Cửa Nhôm Xingfa Class A';
  if (clean.includes('truot quay') || clean.includes('quay truot')) return 'Cửa Trượt Quay';
  if (clean.includes('slim')) return 'Cửa Nhôm Slim';
  if (clean.includes('thuy luc')) return 'Cửa Nhôm Thủy Lực';
  if (clean.includes('luoi chong muoi')) return 'Cửa Lưới Chống Muỗi';
  if (clean.includes('kogen')) return 'Cửa Nhôm Kogen';
  if (clean.includes('pma')) return 'Cửa Nhôm PMA';
  if (clean.includes('yongxing')) return 'Cửa Nhôm Yongxing';
  if (clean.includes('owin')) return 'Cửa Nhôm Owin';
  if (clean.includes('topal')) return 'Cửa Nhôm Topal';
  if (clean.includes('kenwin')) return 'Cửa Nhôm Kenwin';
  if (clean.includes('to ong')) return 'Cửa Nhôm Tấm Tổ Ong';
  if (clean.includes('tu dong')) return 'Cửa Tự Động';
  if (clean.includes('dinh hinh')) return 'Cửa nhôm định hình';
  if (clean.includes('xingfa')) return 'Cửa Nhôm Xingfa';
  if (clean.includes('kinh')) return 'Kính cường lực & Phụ kiện';
  if (clean.includes('sat')) return 'Sắt mỹ thuật chế tác';
  if (clean.includes('inox')) return 'Gia công Inox';
  return 'Sản phẩm khác';
}

async function run() {
  const db = await initDb();

  const dataPath = path.resolve(__dirname, '../../data/scraped_products.json');
  if (!fs.existsSync(dataPath)) {
    console.error(`Error: scraped_products.json not found at ${dataPath}`);
    process.exit(1);
  }

  const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const products = productsData.results || [];
  console.log(`Seeding ${products.length} products...`);

  // Ensure uploads directory exists
  const uploadsDir = path.resolve(__dirname, '../uploads/products');
  fs.mkdirSync(uploadsDir, { recursive: true });

  const insertContent = db.prepare(
    'INSERT OR REPLACE INTO content (type,title,slug,status,author_id,thumbnail,excerpt,category,published_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
  );
  const insertBlock = db.prepare(
    'INSERT OR REPLACE INTO blocks (content_id,type,position,data,visible,created_at,updated_at) VALUES (?,?,?,?,?,?,?)'
  );
  const insertMeta = db.prepare(
    'INSERT OR REPLACE INTO content_meta (content_id,field_key,field_value) VALUES (?,?,?)'
  );
  const insertCategory = db.prepare(
    'INSERT OR REPLACE INTO categories (name,slug,content_type,color,is_active,created_at,updated_at) VALUES (?,?,?,?,?,?,?)'
  );

  const now = new Date().toISOString();
  const dbNow = now.replace('T', ' ').substring(0, 19);
  let count = 0;

  // Let's first register all categories
  const categoriesSet = new Set();
  for (const p of products) {
    const cat = classifyCategory(p.title, p.url);
    categoriesSet.add(cat);
  }

  console.log(`Unique categories found: ${Array.from(categoriesSet).join(', ')}`);
  for (const catName of categoriesSet) {
    const catSlug = slugify(catName);
    const exCat = db.prepare("SELECT id FROM categories WHERE name = ? AND content_type = 'product'").get(catName);
    if (!exCat) {
      insertCategory.run(catName, catSlug, 'product', '#0d4e8a', 1, dbNow, dbNow);
      console.log(`  Registered Category: ${catName} -> ${catSlug}`);
    }
  }

  // Let's seed products
  // We can download images concurrently but keep a limit (e.g. 5 at a time) to avoid flooding
  const downloadQueue = [];
  const limitConcurrency = 10;
  let activeDownloads = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const slug = slugify(p.title);
    
    // Determine category
    const cat = classifyCategory(p.title, p.url);

    // Determine thumbnail path
    let localThumbnail = p.mainImage || '';
    if (p.mainImage && p.mainImage.startsWith('http')) {
      const ext = path.extname(new URL(p.mainImage).pathname) || '.jpg';
      const filename = `${slug}_thumb${ext}`;
      const destPath = path.join(uploadsDir, filename);
      
      // Add to download queue
      downloadQueue.push({
        url: p.mainImage,
        destPath: destPath,
        relPath: `/uploads/products/${filename}`,
        pIndex: i
      });
    }
  }

  // Execute downloads in parallel with limit
  console.log(`Starting download of ${downloadQueue.length} main product thumbnails...`);
  const downloadResults = new Array(products.length).fill(null);
  
  async function downloadWorker() {
    while (downloadQueue.length > 0) {
      const task = downloadQueue.shift();
      if (!task) break;
      try {
        await downloadFile(task.url, task.destPath);
        downloadResults[task.pIndex] = task.relPath;
        // console.log(`  Downloaded: ${task.destPath}`);
      } catch (e) {
        console.warn(`  Failed to download ${task.url}: ${e.message}`);
        // Fallback to remote URL
        downloadResults[task.pIndex] = task.url;
      }
    }
  }

  // Spawn workers
  const workers = [];
  for (let i = 0; i < limitConcurrency; i++) {
    workers.push(downloadWorker());
  }
  await Promise.all(workers);
  console.log('✓ Downloads completed.');

  // Now perform SQLite inserts
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const slug = slugify(p.title) + '-' + i; // add index to guarantee uniqueness of slugs
    
    const cat = classifyCategory(p.title, p.url);

    const thumb = downloadResults[i] || p.mainImage || '';
    const excerpt = p.introText ? p.introText.substring(0, 150) + '...' : 'Sản phẩm nhôm kính chất lượng cao của SV Aluminium.';

    // Check if exists
    const ex = db.prepare('SELECT id FROM content WHERE title = ? AND type = ?').get(p.title, 'product');
    let cid;
    if (ex) {
      db.prepare('UPDATE content SET slug=?,thumbnail=?,excerpt=?,category=?,updated_at=? WHERE id=?')
        .run(slug, thumb, excerpt, cat, dbNow, ex.id);
      cid = ex.id;
      // Clear old metadata
      db.prepare('DELETE FROM content_meta WHERE content_id = ?').run(cid);
      db.prepare('DELETE FROM blocks WHERE content_id = ?').run(cid);
      // console.log(`Updated product: ${p.title}`);
    } else {
      const r = insertContent.run('product', p.title, slug, 'published', 1, thumb, excerpt, cat, dbNow, dbNow, dbNow);
      cid = r.lastInsertRowid;
      // console.log(`Inserted product: ${p.title} (#${cid})`);
    }

    // Insert metadata
    insertMeta.run(cid, 'brand', 'SV Aluminium');
    insertMeta.run(cid, 'price', 'Liên hệ');
    insertMeta.run(cid, 'unit', 'm2');
    insertMeta.run(cid, 'in_stock', '1');
    insertMeta.run(cid, 'specs', p.specsHtml || p.specsText || '');
    
    // Gallery metadata
    if (p.realImages && p.realImages.length > 0) {
      insertMeta.run(cid, 'gallery', JSON.stringify(p.realImages));
    }

    // Combined block content
    const combinedContent = `
      <div class="product-intro">
        ${p.introHtml || `<p>${p.introText || ''}</p>`}
      </div>
      ${p.specsHtml ? `<div class="product-specs"><h3>Thông số kỹ thuật</h3>${p.specsHtml}</div>` : ''}
      ${p.appHtml ? `<div class="product-applications"><h3>Ứng dụng thực tế</h3>${p.appHtml}</div>` : ''}
      ${p.otherHtml ? `<div class="product-additional-info">${p.otherHtml}</div>` : ''}
    `;

    insertBlock.run(cid, 'text', 0, JSON.stringify({ content: combinedContent }), 1, dbNow, dbNow);
    count++;
  }

  db._persist();
  console.log(`✅ Successfully seeded ${count} products in db.sqlite!`);
  setTimeout(() => process.exit(0), 500);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
