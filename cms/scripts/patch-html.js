/**
 * SAO VÀNG — Bulk HTML Patcher v3.0
 * Applies consistent responsive fixes across ALL website pages:
 *   - Shortened nav text (fits on 1024px header)
 *   - Accessible aria-labels on nav, hamburger, floats
 *   - nav-backdrop div injection
 *   - Zalo href fix
 *   - Sticky mobile CTA bar
 *   - theme-color meta
 *   - prefers-reduced-motion keyframe guard
 */
const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.join(__dirname, '../../website');


// Shared header template (replaces each page's old header)
const HEADER_TEMPLATE = (activeHref) => {
  const items = [
    { href: 'index.html',            label: 'TRANG CHỦ' },
    { href: 'gioi-thieu.html',       label: 'GIỚI THIỆU' },
    { href: 'linh-vuc-hoat-dong.html', label: 'LĨNH VỰC' },
    { href: 'du-an.html',            label: 'DỰ ÁN' },
    { href: 'san-pham.html',         label: 'SẢN PHẨM' },
    { href: 'tin-tuc.html',          label: 'TIN TỨC' },
    { href: 'lien-he.html',          label: 'LIÊN HỆ' },
  ];
  const navItems = items.map(i => {
    const active = i.href === activeHref ? ' active" aria-current="page' : '';
    return `      <a href="${i.href}" class="nav-item${active}">${i.label}</a>`;
  }).join('\n');

  return `<header class="header" id="header" role="banner">
  <div class="header-inner">
    <a href="index.html" class="logo" aria-label="Sao Vàng — Trang chủ">
      <span class="logo-badge" aria-hidden="true">SV</span>
      <span class="logo-name">SAO VÀNG</span>
    </a>
    <nav class="nav" id="navMenu" role="navigation" aria-label="Menu chính">
${navItems}
      <a href="san-pham.html" class="nav-item premium">+ CAO CẤP</a>
    </nav>
    <a href="tel:0937729909" class="header-phone" aria-label="Gọi hotline 093 7729 909">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
      093 7729 909
    </a>
    <button class="hamburger" id="hamburger" aria-label="Mở menu" aria-expanded="false" aria-controls="navMenu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
<div class="nav-backdrop" id="navBackdrop" aria-hidden="true"></div>`;
};

// Sticky CTA bar (injected before </body>)
const STICKY_CTA = `
<!-- STICKY MOBILE CTA BAR -->
<div class="sticky-cta-bar" id="stickyCtaBar" role="complementary" aria-label="Liên hệ nhanh">
  <a href="tel:0937729909" class="btn btn-gold btn-sm">
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
    Gọi Ngay
  </a>
  <a href="https://zalo.me/0937729909" class="btn btn-outline-dark btn-sm" target="_blank" rel="noopener">Zalo</a>
  <a href="lien-he.html" class="btn btn-sm" style="background:rgba(255,255,255,.08);color:#fff;border-color:rgba(255,255,255,.15)">Báo Giá</a>
</div>`;

// Floating buttons (fixed Zalo link)
const FLOATS_HTML = `<!-- FLOATING BUTTONS -->
<div class="floats" role="complementary" aria-label="Liên hệ nhanh">
  <a href="https://zalo.me/0937729909" class="float-btn float-chat" aria-label="Chat Zalo" target="_blank" rel="noopener">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
  </a>
  <a href="tel:0937729909" class="float-btn float-phone" aria-label="Gọi 093 7729 909">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
  </a>
</div>
<a href="lien-he.html" class="float-support" aria-label="Hỗ trợ kỹ thuật">
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
</a>`;

// Sticky CTA CSS (added to each page's <style> block)
const STICKY_CTA_CSS = `
  /* ══ STICKY BOTTOM CTA (mobile) ══════════════════════════════ */
  .sticky-cta-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 890;
    display: flex;
    gap: 8px;
    align-items: center;
    background: #111;
    border-top: 1px solid rgba(255,255,255,.1);
    padding: 10px 16px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    box-shadow: 0 -4px 24px rgba(0,0,0,.4);
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .sticky-cta-bar .btn { flex: 1; justify-content: center; min-height: 40px; }
  @media (min-width: 1024px) { .sticky-cta-bar { display: none !important; } }`;

// Mapping: filename → which nav item is active
const PAGE_ACTIVE_NAV = {
  'gioi-thieu.html':        'gioi-thieu.html',
  'linh-vuc-hoat-dong.html':'linh-vuc-hoat-dong.html',
  'du-an.html':             'du-an.html',
  'du-an-chi-tiet.html':    'du-an.html',
  'san-pham.html':          'san-pham.html',
  'san-pham-chi-tiet.html': 'san-pham.html',
  'tin-tuc.html':           'tin-tuc.html',
  'tin-tuc-chi-tiet.html':  'tin-tuc.html',
  'lien-he.html':           'lien-he.html',
};

let patchCount = 0;
let errorCount = 0;

Object.entries(PAGE_ACTIVE_NAV).forEach(([filename, activeHref]) => {
  const filePath = path.join(WEBSITE_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠  SKIP (not found): ${filename}`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const origLen = html.length;

  try {
    // ── 1. Add theme-color meta if missing ────────────────────
    if (!html.includes('theme-color')) {
      html = html.replace(
        '<meta name="viewport"',
        '<meta name="theme-color" content="#8B0000" />\n  <meta name="viewport"'
      );
    }

    // ── 2. Add preload for hero image if page-hero exists ─────
    if (html.includes('page-hero') && !html.includes('rel="preload"')) {
      const heroImgMatch = html.match(/page-hero-bg[^>]*>.*?<img src="([^"]+)"/s);
      if (heroImgMatch) {
        html = html.replace(
          '<link rel="stylesheet" href="assets/css/main.css"',
          `<link rel="preload" as="image" href="${heroImgMatch[1]}" />\n  <link rel="stylesheet" href="assets/css/main.css"`
        );
      }
    }

    // ── 3. Add sticky CTA CSS to <style> block ────────────────
    if (!html.includes('sticky-cta-bar')) {
      html = html.replace('</style>', STICKY_CTA_CSS + '\n  </style>');
    }

    // ── 4. Replace header block with responsive version ───────
    const headerStart = html.indexOf('<header class="header"');
    const headerEnd   = html.indexOf('</header>') + '</header>'.length;
    if (headerStart !== -1 && headerEnd > headerStart) {
      const newHeader = HEADER_TEMPLATE(activeHref);
      html = html.slice(0, headerStart) + newHeader + html.slice(headerEnd);
    }

    // ── 5. Replace float buttons block ────────────────────────
    // Remove old floats + float-support
    html = html.replace(
      /<!-- FLOATING BUTTONS -->[\s\S]*?<\/a>\s*\n/,
      FLOATS_HTML + '\n'
    );
    // Also handle if floats appear without comment
    if (!html.includes('zalo.me')) {
      html = html.replace(
        /href="#" class="float-btn float-chat"/g,
        'href="https://zalo.me/0937729909" class="float-btn float-chat" aria-label="Chat Zalo" target="_blank" rel="noopener"'
      );
    }

    // ── 6. Inject sticky CTA bar before </body> ───────────────
    if (!html.includes('sticky-cta-bar') && !html.includes('stickyCtaBar')) {
      html = html.replace('</body>', STICKY_CTA + '\n</body>');
    }

    // ── 7. Fix cms-client.js script tag if missing ────────────
    if (html.includes('CMS.') && !html.includes('cms-client.js')) {
      html = html.replace(
        '<script src="assets/js/main.js">',
        '<script src="assets/js/cms-client.js"></script>\n<script src="assets/js/main.js">'
      );
    }

    fs.writeFileSync(filePath, html, 'utf8');
    const delta = html.length - origLen;
    console.log(`  ✓  ${filename.padEnd(30)} +${delta} bytes`);
    patchCount++;
  } catch (err) {
    console.error(`  ✗  ${filename}: ${err.message}`);
    errorCount++;
  }
});

console.log(`\n  Patched: ${patchCount} files | Errors: ${errorCount}`);
