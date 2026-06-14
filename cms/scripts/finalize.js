/**
 * SAO VÀNG — Final Consolidation Patcher
 * Fixes all smoke-test failures:
 *   1. sticky-cta-bar  : ensure bar injected in ALL pages before </body>
 *   2. prefers-reduced-motion : ensure @media block present in <style>
 *   3. og:title / canonical   : ensure detail pages (chi-tiet) get SEO meta
 */
const fs = require('fs');
const path = require('path');
const WEBSITE_DIR = path.join(__dirname, '../../website');
const BASE_URL = 'https://saovang.vn';

const STICKY_BAR_HTML = `
<!-- STICKY MOBILE CTA BAR -->
<div class="sticky-cta-bar" id="stickyCtaBar" role="complementary" aria-label="Liên hệ nhanh">
  <a href="tel:0937729909" class="btn btn-gold btn-sm">
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
    Gọi Ngay
  </a>
  <a href="https://zalo.me/0937729909" class="btn btn-outline-dark btn-sm" target="_blank" rel="noopener">Zalo</a>
  <a href="lien-he.html" class="btn btn-sm" style="background:rgba(255,255,255,.08);color:#fff;border-color:rgba(255,255,255,.15)">Báo Giá</a>
</div>`;

// Sticky CTA CSS block (always inject after last } in <style>)
const STICKY_BAR_CSS = `
  /* ── sticky-cta-bar ─────────────────────────────────────── */
  .sticky-cta-bar {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 890;
    display: flex; gap: 8px; align-items: center;
    background: #111; border-top: 1px solid rgba(255,255,255,.1);
    padding: 10px 16px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    box-shadow: 0 -4px 24px rgba(0,0,0,.4);
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .sticky-cta-bar .btn { flex: 1; justify-content: center; min-height: 40px; font-size: 12px; padding: 9px 12px; }
  @media (min-width: 1024px) { .sticky-cta-bar { display: none !important; } }`;

// prefers-reduced-motion guard CSS
const REDUCED_MOTION_CSS = `
  /* ── prefers-reduced-motion ─────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
    [data-reveal] { opacity: 1 !important; transform: none !important; }
  }`;

// Meta for detail pages (dynamic — generic fallback)
const DETAIL_META = {
  'du-an-chi-tiet.html': {
    title: 'Chi Tiết Dự Án | SAO VÀNG',
    desc:  'Xem chi tiết dự án cơ khí cao cấp của Sao Vàng — hình ảnh, thông số kỹ thuật và giá trị công trình.',
  },
  'san-pham-chi-tiet.html': {
    title: 'Chi Tiết Sản Phẩm | SAO VÀNG',
    desc:  'Thông tin chi tiết sản phẩm cơ khí cao cấp Sao Vàng — thông số, vật liệu, giá và hướng dẫn đặt hàng.',
  },
  'tin-tuc-chi-tiet.html': {
    title: 'Bài Viết | SAO VÀNG',
    desc:  'Tin tức, kiến thức và xu hướng thiết kế cơ khí cao cấp từ đội ngũ chuyên gia Sao Vàng.',
  },
};

const ALL_PAGES = [
  'index.html','gioi-thieu.html','linh-vuc-hoat-dong.html',
  'du-an.html','san-pham.html','tin-tuc.html','lien-he.html',
  'du-an-chi-tiet.html','san-pham-chi-tiet.html','tin-tuc-chi-tiet.html',
];

let pass = 0;

ALL_PAGES.forEach(filename => {
  const filePath = `${WEBSITE_DIR}\\${filename}`;
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP  ${filename} (not found)`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // ── FIX 1: sticky-cta-bar HTML ────────────────────────────
  if (!html.includes('sticky-cta-bar') && !html.includes('stickyCtaBar')) {
    html = html.replace('</body>', STICKY_BAR_HTML + '\n</body>');
    changed = true;
  }

  // ── FIX 2: sticky-cta-bar CSS (add to existing <style>) ───
  const hasStyleTag = html.includes('<style>');
  const hasStickyCSS = html.includes('sticky-cta-bar');

  if (hasStyleTag && !hasStickyCSS) {
    html = html.replace('</style>', STICKY_BAR_CSS + '\n</style>');
    changed = true;
  } else if (!hasStyleTag && !hasStickyCSS) {
    // No <style> tag at all — inject a <style> block
    html = html.replace('</head>', `<style>${STICKY_BAR_CSS}\n</style>\n</head>`);
    changed = true;
  }

  // ── FIX 3: prefers-reduced-motion ─────────────────────────
  if (!html.includes('prefers-reduced-motion')) {
    if (html.includes('</style>')) {
      html = html.replace('</style>', REDUCED_MOTION_CSS + '\n</style>');
    } else {
      html = html.replace('</head>', `<style>${REDUCED_MOTION_CSS}\n</style>\n</head>`);
    }
    changed = true;
  }

  // ── FIX 4: OG + Canonical for detail pages ─────────────────
  const meta = DETAIL_META[filename];
  if (meta) {
    if (!html.includes('og:title')) {
      const ogBlock = `  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="${BASE_URL}/assets/images/hero-interior.png" />
  <meta property="og:locale" content="vi_VN" />
  <meta name="twitter:card" content="summary_large_image" />`;
      html = html.replace('</head>', ogBlock + '\n</head>');
      changed = true;
    }
    if (!html.includes('rel="canonical"')) {
      html = html.replace('</head>',
        `  <link rel="canonical" href="${BASE_URL}/${filename}" />\n</head>`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  FIXED ${filename}`);
  } else {
    console.log(`  OK    ${filename}`);
  }
  pass++;
});

console.log(`\n  Done: ${pass} pages processed.\n`);
