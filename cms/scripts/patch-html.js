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
    { href: 'bao-gia.html',          label: 'BÁO GIÁ', isGold: true },
  ];
  const navItems = items.map(i => {
    const active = i.href === activeHref ? ' active" aria-current="page' : '';
    const styleAttr = i.isGold ? ' style="color:var(--gold);font-weight:700"' : '';
    if (i.href === 'linh-vuc-hoat-dong.html') {
      return `      <div class="nav-dropdown">
        <a href="linh-vuc-hoat-dong.html" class="nav-item${active}">
          ${i.label}
          <svg class="chevron" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        </a>
        <div class="dropdown-menu">
          <a href="linh-vuc-hoat-dong.html#co-khi-division" class="dropdown-item">
            <span class="dropdown-title">Cơ Khí Nghệ Thuật</span>
            <span class="dropdown-desc">Cửa cổng nhôm đúc, cầu thang xoắn, sắt nghệ thuật uốn tay</span>
          </a>
          <a href="linh-vuc-hoat-dong.html#nhom-kinh-division" class="dropdown-item">
            <span class="dropdown-title">Nhôm Kính Kiến Trúc</span>
            <span class="dropdown-desc">Cửa nhôm Class A, Slim profile, vách mặt dựng, cabin kính</span>
          </a>
        </div>
      </div>`;
    }
    return `      <a href="${i.href}" class="nav-item${active}"${styleAttr}>${i.label}</a>`;
  }).join('\n');

  return `<header class="header" id="header" role="banner">
  <div class="header-inner">
    <a href="index.html" class="logo" aria-label="Cơ Khí Sao Vàng — Trang chủ">
      <span class="logo-badge" aria-hidden="true">SV</span>
      <span class="logo-name">Cơ Khí Sao Vàng</span>
    </a>
    <nav class="nav" id="navMenu" role="navigation" aria-label="Menu chính">
${navItems}
      <a href="san-pham.html" class="nav-item premium">+ CAO CẤP</a>
    </nav>
    <a href="tel:0869590279" class="header-phone" aria-label="Gọi hotline 0869 590 279">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
      0869 590 279
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
  <a href="tel:0869590279" class="btn btn-gold btn-sm">
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
    Gọi Điện
  </a>
  <a href="https://zalo.me/0869590279" class="btn btn-outline-dark btn-sm" target="_blank" rel="noopener" style="background:#0068ff; color:#fff; border-color:#0068ff;">Zalo</a>
  <a href="bao-gia.html" class="btn btn-sm" style="background:rgba(255,255,255,.08);color:#fff;border-color:rgba(255,255,255,.15)">Báo Giá</a>
  <a href="https://maps.google.com/?q=TT7-35+KĐT+Văn+Phú,+Hà+Đông,+Hà+Nội" class="btn btn-sm" target="_blank" rel="noopener" style="background:rgba(255,255,255,.05);color:#fff;border-color:rgba(255,255,255,.1)">Chỉ Đường</a>
</div>`;

// Floating buttons (fixed Zalo link)
const FLOATS_HTML = `<!-- FLOATING BUTTONS -->
<div class="floats" role="complementary" aria-label="Liên hệ nhanh">
  <a href="https://zalo.me/0869590279" class="float-btn float-chat" aria-label="Chat Zalo" target="_blank" rel="noopener">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
  </a>
  <a href="tel:0869590279" class="float-btn float-phone" aria-label="Gọi 0869 590 279">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
  </a>
</div>
<a href="lien-he.html" class="float-support" aria-label="Hỗ trợ kỹ thuật">
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
</a>`;

// Shared footer template
const FOOTER_TEMPLATE = `<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="logo" style="margin-bottom:18px;">
          <span class="logo-badge">SV</span>
          <span class="logo-name">Cơ Khí Sao Vàng</span>
        </a>
        <p style="font-size:13px; line-height:1.6; color:rgba(255,255,255,0.7); margin-bottom:16px;">
          <strong>Công ty TNHH ĐT TM và DV Kỹ Thuật Sao Vàng</strong><br>
          MST: 0110461829 — Sở KH&ĐT Hà Nội cấp năm 2024.<br>
          📍 Văn phòng: Tầng 3, TT7-35 KĐT Văn Phú, Hà Đông, Hà Nội.<br>
          ⚙️ Nhà xưởng: Đường CN 6, KCN Bắc Từ Liêm, Hà Nội.
        </p>
        <div class="footer-socials">
          <a href="#" class="social-link" aria-label="Facebook"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
          <a href="#" class="social-link" aria-label="YouTube"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg></a>
          <a href="https://zalo.me/0869590279" class="social-link" aria-label="Zalo" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><text y="17" font-size="12" font-weight="bold" font-family="Arial">Zalo</text></svg></a>
        </div>
      </div>
      
      <div class="footer-col">
        <h4>Dịch Vụ</h4>
        <ul>
          <li><a href="linh-vuc-hoat-dong.html#co-khi-division">Cơ khí nghệ thuật</a></li>
          <li><a href="linh-vuc-hoat-dong.html#cua-nhom-cua-so">Cửa nhôm cao cấp</a></li>
          <li><a href="linh-vuc-hoat-dong.html#vach-kinh-mat-dung">Vách kính &amp; Mặt dựng</a></li>
          <li><a href="linh-vuc-hoat-dong.html#cau-thang-lan-can">Cầu thang uốn xoắn</a></li>
          <li><a href="linh-vuc-hoat-dong.html#cong-hang-rao">Cổng nhôm đúc</a></li>
          <li><a href="linh-vuc-hoat-dong.html#bao-tri-dich-vu">Bảo trì &amp; Kỹ thuật</a></li>
        </ul>
      </div>
      
      <div class="footer-col">
        <h4>Công Ty</h4>
        <ul>
          <li><a href="gioi-thieu.html">Giới thiệu</a></li>
          <li><a href="du-an.html">Dự án thực hiện</a></li>
          <li><a href="san-pham.html">Sản phẩm cao cấp</a></li>
          <li><a href="tin-tuc.html">Tin tức &amp; Sự kiện</a></li>
          <li><a href="lien-he.html">Liên hệ trực tiếp</a></li>
        </ul>
      </div>
      
      <div class="footer-col">
        <h4>Bản Đồ</h4>
        <div style="width:100%; border-radius:6px; overflow:hidden; border:1px solid rgba(255,255,255,0.1); height:130px; margin-top:8px;">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.688172083984!2d105.77583627589578!3d20.965037990069354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135adc71e3b2e3b%3A0xe5a3c2cf7e3c1b82!2zS0RUIFbEg24gUGjDugEsIEjDoCDEkMO0bmcsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1718712345678!5m2!1svi!2s" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <span>© 2026 Công ty TNHH ĐT TM và DV Kỹ Thuật Sao Vàng. Bảo lưu mọi quyền.</span>
      <span>Thiết kế &amp; phát triển bởi Sao Vàng Tech</span>
    </div>
  </div>
</footer>`;


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
  'index.html':             'index.html',
  'bao-gia.html':           'bao-gia.html',
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
    // ── 1. Add theme-color meta if missing / update to luxury red ──
    if (html.includes('theme-color')) {
      html = html.replace(/<meta name="theme-color" content="[^"]*"\s*\/?>/gi, '<meta name="theme-color" content="#A50000" />');
    } else {
      html = html.replace(
        '<meta name="viewport"',
        '<meta name="theme-color" content="#A50000" />\n  <meta name="viewport"'
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

    // ── 4. Replace header block with responsive version (cleaning up duplicate backdrops) ───
    const headerStart = html.indexOf('<header class="header"');
    if (headerStart !== -1) {
      let headerEnd = html.indexOf('</header>') + '</header>'.length;
      while (true) {
        const remaining = html.slice(headerEnd, headerEnd + 200);
        const m = remaining.match(/^\s*<div class="nav-backdrop"[^>]*><\/div>/);
        if (m) {
          headerEnd += m[0].length;
        } else {
          break;
        }
      }
      const newHeader = HEADER_TEMPLATE(activeHref);
      html = html.slice(0, headerStart) + newHeader + html.slice(headerEnd);
    }

    // ── 5. Replace float buttons block (cleaning up duplicate float blocks) ─────────────────
    html = html.replace(
      /(?:<!-- FLOATING BUTTONS -->|<!-- FLOATS -->)?\s*<div class="floats"[\s\S]*?<\/div>(?:\s*<a href="[^"]*" class="float-support"[\s\S]*?<\/a>)?/g,
      FLOATS_HTML + '\n'
    );

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

    // ── 8. Statically replace "SAO VÀNG" in footer logo with "Cơ Khí Sao Vàng" ─
    html = html.replace(/(<span class="logo-name"[^>]*>)\s*SAO VÀNG\s*(<\/span>)/gi, '$1Cơ Khí Sao Vàng$2');

    // ── 9. Replace footer block with expanded template ────────
    const footerStart = html.indexOf('<footer class="footer"');
    if (footerStart !== -1) {
      const footerEnd = html.indexOf('</footer>', footerStart) + '</footer>'.length;
      html = html.slice(0, footerStart) + FOOTER_TEMPLATE + html.slice(footerEnd);
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
