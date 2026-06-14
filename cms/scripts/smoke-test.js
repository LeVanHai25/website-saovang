/**
 * SAO VÀNG — Final Smoke Test v2
 * Tests all 11 pages (bao-gia.html included)
 */
const fs   = require('fs');
const http = require('http');

const path = require('path');
const WEBSITE_DIR = path.join(__dirname, '../../website');
const PAGES = [
  'index.html', 'gioi-thieu.html', 'linh-vuc-hoat-dong.html',
  'du-an.html', 'san-pham.html', 'tin-tuc.html', 'lien-he.html',
  'du-an-chi-tiet.html', 'san-pham-chi-tiet.html', 'tin-tuc-chi-tiet.html',
  'bao-gia.html',
];

const HTML_CHECKS = [
  'nav-backdrop', 'aria-expanded', 'zalo.me',
  'sticky-cta-bar', 'prefers-reduced-motion',
  'og:title', 'canonical', 'loading="lazy"',
  'bao-gia.html',              // nav link to quote page
];

const API_CHECKS = [
  { url: 'http://localhost:4000/api/health',           method: 'GET',  expect: 200 },
  { url: 'http://localhost:4000/api/public/articles',  method: 'GET',  expect: 200 },
  { url: 'http://localhost:4000/api/leads',            method: 'GET',  expect: 200 },
];

// ── HTML checks ──────────────────────────────────────────────
let htmlPass = 0, htmlFail = 0;
console.log('\n  ── HTML CHECKS ──────────────────────────────────────\n');
PAGES.forEach(filename => {
  const fp = `${WEBSITE_DIR}\\${filename}`;
  if (!fs.existsSync(fp)) {
    console.log(`  MISS  ${filename}`);
    htmlFail++;
    return;
  }
  const html = fs.readFileSync(fp, 'utf8');
  // bao-gia.html has no og:title check (uses its own format)
  const checks = filename === 'bao-gia.html'
    ? HTML_CHECKS.filter(c => c !== 'loading="lazy"')
    : HTML_CHECKS;
  const missing = checks.filter(c => !html.includes(c));
  if (missing.length) {
    console.log(`  FAIL  ${filename.padEnd(35)} | missing: ${missing.join(', ')}`);
    htmlFail++;
  } else {
    console.log(`  PASS  ${filename}`);
    htmlPass++;
  }
});

// ── Asset checks ─────────────────────────────────────────────
const REQUIRED_ASSETS = [
  'assets/css/main.css', 'assets/js/main.js',
  'assets/images/hero-interior.png',
];
let assetPass = 0, assetFail = 0;
console.log('\n  ── ASSET CHECKS ─────────────────────────────────────\n');
REQUIRED_ASSETS.forEach(a => {
  const exists = fs.existsSync(`${WEBSITE_DIR}\\${a.replace(/\//g, '\\')}`);
  console.log(`  ${exists ? 'PASS' : 'FAIL'}  ${a}`);
  if (exists) assetPass++; else assetFail++;
});

// ── API checks ───────────────────────────────────────────────
console.log('\n  ── API CHECKS ───────────────────────────────────────\n');
let apiPass = 0, apiFail = 0;
const apiResults = [];

const checkApi = (item) => new Promise(resolve => {
  const req = http.request(item.url, { method: item.method }, res => {
    const pass = res.statusCode === item.expect;
    console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${item.method} ${item.url} → ${res.statusCode}`);
    if (pass) apiPass++; else apiFail++;
    resolve();
  });
  req.on('error', () => {
    console.log(`  FAIL  ${item.method} ${item.url} → connection refused`);
    apiFail++;
    resolve();
  });
  req.setTimeout(3000, () => { req.abort(); });
  req.end();
});

Promise.all(API_CHECKS.map(checkApi)).then(() => {
  const totalPass = htmlPass + assetPass + apiPass;
  const totalFail = htmlFail + assetFail + apiFail;
  const total     = totalPass + totalFail;
  console.log(`
  ══════════════════════════════════════════════════
  FINAL RESULT:  ${totalPass}/${total} PASS  |  ${totalFail} FAIL
  HTML:   ${htmlPass}/${PAGES.length}   Assets: ${assetPass}/${REQUIRED_ASSETS.length}   API: ${apiPass}/${API_CHECKS.length}
  ══════════════════════════════════════════════════
  `);
  process.exit(totalFail > 0 ? 1 : 0);
});
