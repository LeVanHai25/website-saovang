/**
 * Download Catalogue PDFs locally and update website/data/downloads.json
 * Usage: node scripts/download_catalogues.js
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
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
        fs.unlink(destPath, () => {});
        return reject(new Error(`Status code: ${response.statusCode}`));
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
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

async function run() {
  const scrapedPath = path.resolve(__dirname, '../data/scraped_catalogues.json');
  const originalPath = path.resolve(__dirname, '../data/downloads.json');
  const targetPath = path.resolve(__dirname, '../website/data/downloads.json');

  if (!fs.existsSync(scrapedPath)) {
    console.error(`Error: scraped_catalogues.json not found at ${scrapedPath}`);
    process.exit(1);
  }

  const scraped = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));
  const original = fs.existsSync(originalPath) ? JSON.parse(fs.readFileSync(originalPath, 'utf8')) : [];

  console.log(`Original downloads count: ${original.length}`);
  console.log(`Scraped catalogues count: ${scraped.length}`);

  // Ensure download folder exists
  const downloadDir = path.resolve(__dirname, '../website/assets/docs/downloads');
  fs.mkdirSync(downloadDir, { recursive: true });
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  const queue = [];
  const limitConcurrency = 8;
  const targetList = [...original];

  // Prepare download queue
  scraped.forEach((item, idx) => {
    const cleanTitle = item.title.replace(/[\r\n\t]+/g, ' ').trim();
    const slug = slugify(cleanTitle) || `catalogue-${idx}`;
    const filename = `${slug}.pdf`;
    const destPath = path.join(downloadDir, filename);

    const docItem = {
      assetId: `dl-cat-${slug}`,
      title: cleanTitle,
      fileType: "PDF Document",
      fileSize: "15.0 MB", // generic size estimation
      downloadUrl: `assets/docs/downloads/${filename}`,
      description: item.summary || `Tài liệu Catalogue kỹ thuật mặt cắt chi tiết hệ cửa nhôm, phụ kiện cho ${cleanTitle}.`
    };

    if (item.pdfUrl && item.pdfUrl.startsWith('http')) {
      queue.push({
        url: item.pdfUrl,
        destPath: destPath,
        docItem: docItem
      });
    } else {
      // Fallback
      docItem.downloadUrl = item.pdfUrl || '';
      targetList.push(docItem);
    }
  });

  console.log(`Downloading ${queue.length} PDFs with concurrency of ${limitConcurrency}...`);

  async function worker() {
    while (queue.length > 0) {
      const task = queue.shift();
      if (!task) break;
      try {
        console.log(`Downloading: ${task.docItem.title}`);
        await downloadFile(task.url, task.destPath);
        targetList.push(task.docItem);
      } catch (e) {
        console.error(`Failed to download ${task.url}: ${e.message}`);
        // Fallback to remote URL
        task.docItem.downloadUrl = task.url;
        targetList.push(task.docItem);
      }
    }
  }

  const workers = [];
  for (let i = 0; i < limitConcurrency; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);

  // Write new downloads.json
  fs.writeFileSync(targetPath, JSON.stringify(targetList, null, 2), 'utf8');
  console.log(`✅ Success: Merged downloads.json created at ${targetPath}. Total: ${targetList.length} items.`);
}

run().catch(console.error);
