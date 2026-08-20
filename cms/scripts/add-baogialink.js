/**
 * Add "Báo Giá" nav link to all HTML pages
 * and update lienhe.html sticky bar link from "lienhe.html" to "baogia.html"
 */
const fs = require('fs');
const path = require('path');
const WEBSITE_DIR = path.join(__dirname, '../../website');

const PAGES = [
  'index.html', 'gioithieu.html', 'linhvuchoatdong.html',
  'duan.html', 'sanpham.html', 'tintuc.html', 'lienhe.html',
  'duanchitiet.html', 'sanphamchitiet.html', 'tintucchitiet.html',
];

let updated = 0;
PAGES.forEach(filename => {
  const fp = `${WEBSITE_DIR}\\${filename}`;
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  let changed = false;

  // 1. Add Báo Giá to nav if missing
  if (!html.includes('baogia.html')) {
    // Insert before "+ CAO CẤP" or "+ SẢN PHẨM CAO CẤP"
    html = html.replace(
      /<a href="san-pham\.html" class="nav-item premium[^>]*>\+ (SẢN PHẨM )?CAO CẤP<\/a>/,
      `<a href="baogia.html" class="nav-item" style="color:var(--gold);font-weight:700">BÁO GIÁ</a>\n      <a href="sanpham.html" class="nav-item premium">+ CAO CẤP</a>`
    );
    changed = true;
  }

  // 2. Update sticky bar "Báo Giá" link → baogia.html
  html = html.replace(
    /href="lien-he\.html" class="btn btn-sm" style="background:rgba/g,
    'href="baogia.html" class="btn btn-sm" style="background:rgba'
  );

  if (changed) {
    fs.writeFileSync(fp, html, 'utf8');
    console.log(`  ✓  ${filename}`);
    updated++;
  }
});

console.log(`\n  Nav updated: ${updated} pages\n`);
