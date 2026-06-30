/* ═══════════════════════════════════════════════════════════════
   internal-links.js — Related Services Auto-Inject v1.0

   Kiến trúc Senior:
   - Định nghĩa graph quan hệ giữa các trang dịch vụ
   - Tự detect trang hiện tại → lấy danh sách related pages
   - Inject section "Dịch vụ liên quan" trước footer
   - Sinh RelatedPage / SameAs schema micro-data cho SEO
   - Giúp Google crawl sâu hơn vào site structure
═══════════════════════════════════════════════════════════════ */

(function InternalLinks() {
  'use strict';

  /* ── Danh mục tất cả trang dịch vụ ──────────────────────── */
  const SERVICE_CATALOG = {
    /* Cơ Khí */
    'co-khi-sao-vang'    : { label:'Cơ Khí Sao Vàng',       icon:'ri-settings-3-fill',   color:'#9B1C1C', cat:'Cơ Khí' },
    'linh-vuc-co-khi'    : { label:'Dịch Vụ Cơ Khí',        icon:'ri-tools-fill',        color:'#9B1C1C', cat:'Cơ Khí' },
    'cau-thang-xoan'     : { label:'Cầu Thang Xoắn CNC',    icon:'ri-building-4-line',   color:'#9B1C1C', cat:'Cơ Khí' },
    'co-khi-nghe-thuat'  : { label:'Cơ Khí Nghệ Thuật',     icon:'ri-brush-3-fill',      color:'#9B1C1C', cat:'Cơ Khí' },
    'cong-nghe-thuat'    : { label:'Cổng Nghệ Thuật',        icon:'ri-door-lock-box-fill',color:'#9B1C1C', cat:'Cơ Khí' },
    /* Nhôm Kính */
    'nhom-sao-vang'      : { label:'Nhôm Sao Vàng',          icon:'ri-home-gear-fill',    color:'#1a5276', cat:'Nhôm Kính' },
    'linh-vuc-nhom-kinh' : { label:'Dịch Vụ Nhôm Kính',     icon:'ri-window-fill',       color:'#1a5276', cat:'Nhôm Kính' },
    'cua-nhom-kinh'      : { label:'Cửa Nhôm Kính',          icon:'ri-door-fill',         color:'#1a5276', cat:'Nhôm Kính' },
    'vach-kinh'          : { label:'Vách Kính Mặt Dựng',     icon:'ri-building-2-fill',   color:'#1a5276', cat:'Nhôm Kính' },
    'lan-can-kinh'       : { label:'Lan Can Kính',            icon:'ri-layout-right-fill', color:'#1a5276', cat:'Nhôm Kính' },
    'phu-kien'           : { label:'Phụ Kiện Nhôm Kính',     icon:'ri-plug-fill',         color:'#1a5276', cat:'Nhôm Kính' },
    /* Khác */
    'nang-luc'           : { label:'Năng Lực Sản Xuất',      icon:'ri-bar-chart-fill',    color:'#C9A227', cat:'Năng lực' },
    'du-an'              : { label:'Dự Án Đã Thực Hiện',     icon:'ri-image-2-fill',      color:'#C9A227', cat:'Portfolio' },
    'san-pham'           : { label:'Sản Phẩm & Vật Tư',      icon:'ri-store-2-fill',      color:'#C9A227', cat:'Sản phẩm' },
    'bao-gia'            : { label:'Nhận Báo Giá Ngay',       icon:'ri-price-tag-3-fill',  color:'#C9A227', cat:'CTA' },
  };

  /* ── Quan hệ liên quan giữa các trang (graph) ────────────── */
  const RELATED_MAP = {
    'co-khi-sao-vang'    : ['linh-vuc-co-khi','cau-thang-xoan','co-khi-nghe-thuat','cong-nghe-thuat','nang-luc'],
    'linh-vuc-co-khi'    : ['cau-thang-xoan','co-khi-nghe-thuat','cong-nghe-thuat','nhom-sao-vang','bao-gia'],
    'cau-thang-xoan'     : ['co-khi-nghe-thuat','cong-nghe-thuat','lan-can-kinh','vach-kinh','bao-gia'],
    'co-khi-nghe-thuat'  : ['cau-thang-xoan','cong-nghe-thuat','co-khi-sao-vang','bao-gia'],
    'cong-nghe-thuat'    : ['cau-thang-xoan','co-khi-nghe-thuat','co-khi-sao-vang','bao-gia'],
    'nhom-sao-vang'      : ['cua-nhom-kinh','vach-kinh','lan-can-kinh','co-khi-sao-vang','bao-gia'],
    'linh-vuc-nhom-kinh' : ['cua-nhom-kinh','vach-kinh','lan-can-kinh','phu-kien','bao-gia'],
    'cua-nhom-kinh'      : ['vach-kinh','lan-can-kinh','nhom-sao-vang','phu-kien','bao-gia'],
    'vach-kinh'          : ['cua-nhom-kinh','lan-can-kinh','nhom-sao-vang','bao-gia'],
    'lan-can-kinh'       : ['cua-nhom-kinh','vach-kinh','cau-thang-xoan','bao-gia'],
    'phu-kien'           : ['cua-nhom-kinh','vach-kinh','lan-can-kinh','nhom-sao-vang'],
    'nang-luc'           : ['co-khi-sao-vang','nhom-sao-vang','du-an','bao-gia'],
    'du-an'              : ['nang-luc','co-khi-sao-vang','nhom-sao-vang','bao-gia'],
    'san-pham'           : ['co-khi-sao-vang','nhom-sao-vang','phu-kien','bao-gia'],
    'bao-gia'            : ['co-khi-sao-vang','nhom-sao-vang','cau-thang-xoan','cua-nhom-kinh'],
  };

  /* ── CSS ─────────────────────────────────────────────────── */
  function injectCSS() {
    if (document.getElementById('svRelStyles')) return;
    const s = document.createElement('style');
    s.id = 'svRelStyles';
    s.textContent = `
      .sv-related {
        background: #f4f4f2;
        border-top: 1px solid #e5e7eb;
        padding: 52px 0 56px;
      }
      .sv-related-label {
        font-family: 'Montserrat', sans-serif;
        font-size: 10px; font-weight: 800;
        letter-spacing: .2em; text-transform: uppercase;
        color: #9CA3AF; margin-bottom: 8px;
      }
      .sv-related-title {
        font-family: 'Montserrat', sans-serif;
        font-size: clamp(1.15rem,2.5vw,1.45rem);
        font-weight: 800; color: #111827;
        margin-bottom: 28px;
      }
      .sv-related-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      .sv-rel-card {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 13px 18px;
        text-decoration: none;
        transition: all .22s ease;
        flex: 1;
        min-width: 200px;
        max-width: 280px;
      }
      .sv-rel-card:hover {
        border-color: rgba(155,28,28,.3);
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0,0,0,.08);
      }
      .sv-rel-icon {
        width: 36px; height: 36px;
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        font-size: 16px; flex-shrink: 0;
        background: rgba(155,28,28,.08); color: #9B1C1C;
      }
      .sv-rel-card[data-cat="Nhôm Kính"] .sv-rel-icon {
        background: rgba(26,82,118,.08); color: #1a5276;
      }
      .sv-rel-card[data-cat="Portfolio"] .sv-rel-icon,
      .sv-rel-card[data-cat="Năng lực"] .sv-rel-icon,
      .sv-rel-card[data-cat="Sản phẩm"] .sv-rel-icon,
      .sv-rel-card[data-cat="CTA"] .sv-rel-icon {
        background: rgba(201,162,39,.1); color: #C9A227;
      }
      .sv-rel-text { min-width: 0; }
      .sv-rel-cat {
        font-size: 9px; font-weight: 800;
        letter-spacing: .12em; text-transform: uppercase;
        color: #9CA3AF; margin-bottom: 2px;
        font-family: 'Montserrat', sans-serif;
      }
      .sv-rel-name {
        font-family: 'Montserrat', sans-serif;
        font-size: 12.5px; font-weight: 700;
        color: #374151;
        white-space: nowrap;
      }
      .sv-rel-arrow { margin-left: auto; color: #d1d5db; font-size: 16px; flex-shrink: 0; }
      .sv-rel-card:hover .sv-rel-arrow { color: #9B1C1C; }
      @media(max-width:480px) { .sv-rel-card { min-width: 160px; } }
    `;
    document.head.appendChild(s);
  }

  /* ── Build HTML section ──────────────────────────────────── */
  function buildSection(relatedSlugs) {
    const cards = relatedSlugs.map(slug => {
      const info = SERVICE_CATALOG[slug];
      if (!info) return '';
      return `
        <a href="${slug}.html" class="sv-rel-card" data-cat="${info.cat}"
           aria-label="Xem dịch vụ ${info.label}">
          <div class="sv-rel-icon"><i class="${info.icon}" aria-hidden="true"></i></div>
          <div class="sv-rel-text">
            <div class="sv-rel-cat">${info.cat}</div>
            <div class="sv-rel-name">${info.label}</div>
          </div>
          <i class="ri-arrow-right-s-line sv-rel-arrow" aria-hidden="true"></i>
        </a>`;
    }).join('');

    return `
      <section class="sv-related" aria-label="Dịch vụ liên quan" id="svRelatedServices">
        <div class="sv-container">
          <p class="sv-related-label">Khám phá thêm</p>
          <h2 class="sv-related-title">Dịch Vụ Liên Quan</h2>
          <nav class="sv-related-grid" aria-label="Điều hướng dịch vụ liên quan">
            ${cards}
          </nav>
        </div>
      </section>`;
  }

  /* ── Tìm vị trí chèn (trước footer hoặc service-cta) ────── */
  function findInsertPoint() {
    return (
      document.querySelector('footer') ||
      document.getElementById('sv-service-cta') ||
      null
    );
  }

  /* ── Main ────────────────────────────────────────────────── */
  function init() {
    if (document.getElementById('svRelatedServices')) return;

    const slug = window.location.pathname.split('/').pop().replace(/\.html$/, '') || 'index';
    const related = RELATED_MAP[slug];
    if (!related || related.length === 0) return;

    injectCSS();

    const html    = buildSection(related);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    const section = wrapper.firstElementChild;

    const insertBefore = findInsertPoint();
    if (insertBefore) {
      insertBefore.parentNode.insertBefore(section, insertBefore);
    } else {
      document.body.appendChild(section);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.SV = window.SV || {};
  window.SV.InternalLinks = { init };

})();
