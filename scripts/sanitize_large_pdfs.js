/**
 * Sanitize PDFs larger than 90MB to prevent GitHub push failures.
 * Reverts their downloadUrl in website/data/downloads.json to remote URL
 * and deletes the large local files.
 * Usage: node scripts/sanitize_large_pdfs.js
 */
const fs = require('fs');
const path = require('path');

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
  const targetPath = path.resolve(__dirname, '../website/data/downloads.json');
  const downloadDir = path.resolve(__dirname, '../website/assets/docs/downloads');

  if (!fs.existsSync(scrapedPath) || !fs.existsSync(targetPath)) {
    console.error('Error: Required files not found.');
    return;
  }

  const scraped = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));
  const targetList = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

  console.log(`Checking files in ${downloadDir}...`);
  const files = fs.readdirSync(downloadDir);
  let count = 0;

  files.forEach(f => {
    const filePath = path.join(downloadDir, f);
    const stat = fs.statSync(filePath);
    
    // Check if file is larger than 50MB (50 * 1024 * 1024 bytes) — GitHub recommended max
    if (stat.size > 50 * 1024 * 1024) {
      const sizeMB = (stat.size / 1024 / 1024).toFixed(1);
      console.log(`Large file found: ${f} (${sizeMB} MB)`);

      // 1. Delete local file
      fs.unlinkSync(filePath);
      console.log(`  Deleted local file: ${f}`);

      // 2. Find in targetList and update downloadUrl to remote
      // We match based on filename slug in downloadUrl
      const localUrl = `assets/docs/downloads/${f}`;
      const docItem = targetList.find(item => item.downloadUrl === localUrl);
      
      if (docItem) {
        // Find matching item in scraped to get original pdfUrl
        const origItem = scraped.find(item => {
          const cleanTitle = item.title.replace(/[\r\n\t]+/g, ' ').trim();
          const slug = slugify(cleanTitle);
          return `assets/docs/downloads/${slug}.pdf` === localUrl;
        });

        if (origItem && origItem.pdfUrl) {
          docItem.downloadUrl = origItem.pdfUrl;
          console.log(`  Updated downloadUrl to remote: ${origItem.pdfUrl}`);
        } else {
          console.warn(`  Warning: matching scraped item not found for ${f}. Keep as is.`);
        }
      }
      count++;
    }
  });

  if (count > 0) {
    fs.writeFileSync(targetPath, JSON.stringify(targetList, null, 2), 'utf8');
    console.log(`✅ Success: Sanitized ${count} large files and updated downloads.json.`);
  } else {
    console.log('No files larger than 90MB found.');
  }
}

run().catch(console.error);
