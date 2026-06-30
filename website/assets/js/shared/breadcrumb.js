/* ═══════════════════════════════════════════════════════════════
   breadcrumb.js — Auto-generate Breadcrumb from URL v1.0
   
   Kiến trúc:
   - Đọc URL path hiện tại → tự động tạo breadcrumb trail
   - Không cần cấu hình thủ công cho từng trang
   - Inject HTML trước phần nội dung chính (sau navbar)
   - Sinh ra BreadcrumbList Schema JSON-LD để SEO tốt
   - Responsive: ẩn trên mobile nếu quá dài
═══════════════════════════════════════════════════════════════ */

(function Breadcrumb() {
  'use strict';

  /* ── Bản đồ URL → tên tiếng Việt đẹp ───────────────────── */
  const PAGE_NAMES = {
    'index'                 : 'Trang chủ',
    'gioi-thieu'            : 'Giới thiệu',
    'linh-vuc-hoat-dong'    : 'Lĩnh vực hoạt động',
    'co-khi-sao-vang'       : 'Cơ Khí Sao Vàng',
    'linh-vuc-co-khi'       : 'Dịch vụ cơ khí',
    'cau-thang-xoan'        : 'Cầu thang xoắn',
    'co-khi-nghe-thuat'     : 'Cơ khí nghệ thuật',
    'cong-nghe-thuat'       : 'Cổng nghệ thuật',
    'nhom-sao-vang'         : 'Nhôm Sao Vàng',
    'linh-vuc-nhom-kinh'    : 'Dịch vụ nhôm kính',
    'cua-nhom-kinh'         : 'Cửa nhôm kính',
    'vach-kinh'             : 'Vách kính & Mặt dựng',
    'lan-can-kinh'          : 'Lan can kính',
    'phu-kien'              : 'Phụ kiện',
    'thu-vien-profile-nhom' : 'Thư viện Profile Nhôm',
    'profile-nhom-chi-tiet' : 'Chi tiết Profile Nhôm',
    'san-pham'              : 'Sản phẩm',
    'thu-vien-sp'           : 'Thư viện sản phẩm',
    'san-pham-chi-tiet'     : 'Chi tiết sản phẩm',
    'nang-luc'              : 'Năng lực',
    'du-an'                 : 'Dự án',
    'du-an-chi-tiet'        : 'Chi tiết dự án',
    'bao-gia'               : 'Báo giá',
    'tin-tuc'               : 'Tin tức',
    'tin-tuc-chi-tiet'      : 'Bài viết',
    'lien-he'               : 'Liên hệ',
    'chinh-sach-bao-mat'    : 'Chính sách bảo mật',
    '404'                   : 'Trang không tìm thấy',
    'thank-you'             : 'Cảm ơn',
  };

  /* ── Lấy tên trang từ filename ───────────────────────────── */
  function getPageName(slug) {
    return PAGE_NAMES[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  /* ── Parse URL để xây breadcrumb trail ──────────────────── */
  function buildTrail() {
    const path = window.location.pathname;
    // Lấy filename không có đuôi .html
    const filename = path.split('/').pop().replace(/\.html$/, '') || 'index';

    // Trang chủ không cần breadcrumb
    if (filename === 'index' || filename === '') return null;

    const trail = [
      { name: 'Trang chủ', url: 'index.html' },
      { name: getPageName(filename), url: filename + '.html' },
    ];

    return trail;
  }

  /* ── Render HTML breadcrumb ──────────────────────────────── */
  function renderHTML(trail) {
    const items = trail.map((item, idx) => {
      const isLast = idx === trail.length - 1;
      if (isLast) {
        return `<li class="sv-bc-item sv-bc-current" aria-current="page">
          <span>${item.name}</span>
        </li>`;
      }
      return `<li class="sv-bc-item">
        <a href="${item.url}" class="sv-bc-link">${item.name}</a>
        <i class="ri-arrow-right-s-line sv-bc-sep" aria-hidden="true"></i>
      </li>`;
    }).join('');

    return `
      <nav class="sv-breadcrumb" aria-label="Breadcrumb" id="svBreadcrumb">
        <div class="sv-container">
          <ol class="sv-bc-list" role="list">
            ${items}
          </ol>
        </div>
      </nav>
    `;
  }

  /* ── Inject CSS (tránh phụ thuộc vào file CSS riêng) ─────── */
  function injectCSS() {
    if (document.getElementById('svBcStyles')) return;
    const style = document.createElement('style');
    style.id = 'svBcStyles';
    style.textContent = `
      .sv-breadcrumb {
        background: #f3f4f6;
        border-bottom: 1px solid #e5e7eb;
        padding: 10px 0;
        font-family: 'Montserrat', sans-serif;
      }
      .sv-bc-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 2px;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .sv-bc-item {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 12px;
        color: #9CA3AF;
      }
      .sv-bc-link {
        color: #6B7280;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
      }
      .sv-bc-link:hover { color: #9B1C1C; }
      .sv-bc-sep {
        font-size: 14px;
        color: #d1d5db;
      }
      .sv-bc-current {
        font-weight: 700;
        color: #9B1C1C;
      }
      @media (max-width: 480px) {
        .sv-breadcrumb { display: none; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Sinh Schema BreadcrumbList JSON-LD ──────────────────── */
  function injectSchema(trail) {
    const baseUrl = `${window.location.origin}`;
    const items = trail.map((item, idx) => ({
      '@type'    : 'ListItem',
      'position' : idx + 1,
      'name'     : item.name,
      'item'     : `${baseUrl}/${item.url}`,
    }));

    const schema = {
      '@context'        : 'https://schema.org',
      '@type'           : 'BreadcrumbList',
      'itemListElement' : items,
    };

    const script = document.createElement('script');
    script.type        = 'application/ld+json';
    script.id          = 'svBcSchema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /* ── Tìm vị trí chèn (sau navbar) ───────────────────────── */
  function findInsertionPoint() {
    // Ưu tiên: sau <nav>, sau <header>, sau element có class sv-navbar
    const candidates = [
      document.querySelector('nav.sv-navbar'),
      document.querySelector('header'),
      document.querySelector('nav'),
      document.querySelector('[data-navbar]'),
    ];

    for (const el of candidates) {
      if (el && el.nextSibling) return el;
    }
    return null;
  }

  /* ── Inject breadcrumb vào DOM ───────────────────────────── */
  function inject(trail) {
    // Tránh duplicate
    if (document.getElementById('svBreadcrumb')) return;

    const html    = renderHTML(trail);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    const bcEl = wrapper.firstElementChild;

    const insertAfter = findInsertionPoint();

    if (insertAfter) {
      insertAfter.insertAdjacentElement('afterend', bcEl);
    } else {
      // Fallback: chèn vào đầu body
      document.body.insertBefore(bcEl, document.body.firstChild);
    }
  }

  /* ── Main ────────────────────────────────────────────────── */
  function init() {
    const trail = buildTrail();
    if (!trail) return; // Trang chủ → skip

    injectCSS();
    inject(trail);
    injectSchema(trail);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  window.SV = window.SV || {};
  window.SV.Breadcrumb = { init };

})();
