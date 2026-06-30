/* ═══════════════════════════════════════════════════════════════
   floating-widget.js  — Shared Component Injection v1.1
   Kiến trúc: Auto-inject floating contact buttons vào MỌI trang.
   Pattern: IIFE + Idempotent (chạy nhiều lần vẫn an toàn)

   Logic:
   1. ensureRemixIcon() — tự kiểm tra và inject CSS font nếu thiếu
   2. Kiểm tra xem trang đã có floating buttons chưa
   3. Nếu chưa → inject HTML vào <body>
   4. Nếu rồi → skip (idempotent)
   5. Khởi tạo scroll-to-top behavior
═══════════════════════════════════════════════════════════════ */

(function FloatingWidget() {
  'use strict';

  const HOTLINE       = '0869590279';
  const ZALO_LINK     = 'https://zalo.me/0869590279';
  const SCROLL_OFFSET = 300; // px — hiện nút scroll-to-top sau khi cuộn

  /* ── 0. Đảm bảo RemixIcon font đã được load ───────────────── */
  /*      Layer 2 Self-Healing: tự inject nếu trang HTML bỏ sót  */
  function ensureRemixIcon() {
    // Kiểm tra nếu đã có link remixicon trong document thì bỏ qua
    var existing = document.querySelector('link[href*="remixicon"]');
    if (existing) return;

    // Chưa có → inject vào <head> ngay lập tức
    var link = document.createElement('link');
    link.rel         = 'stylesheet';
    link.href        = 'https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css';
    link.crossOrigin = 'anonymous';
    // Chèn vào đầu <head> để load nhanh nhất
    var firstLink = document.head.querySelector('link');
    if (firstLink) {
      document.head.insertBefore(link, firstLink);
    } else {
      document.head.appendChild(link);
    }
  }

  /* ── 1. Kiểm tra đã inject chưa ───────────────────────────── */
  function alreadyInjected() {
    return !!(
      document.querySelector('.floating-left') ||
      document.querySelector('[data-sv-floating]')
    );
  }

  /* ── 2. Tạo HTML cho floating group ───────────────────────── */
  function buildHTML() {
    return `
      <!-- Floating Contact Widget — Injected by floating-widget.js -->
      <div class="floating-left" aria-label="Kênh liên hệ nhanh" data-sv-floating="true">
        <a href="${ZALO_LINK}"
           class="float-btn float-btn-zalo"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="Chat Zalo với Sao Vàng"
           title="Zalo: ${HOTLINE}">
          <i class="ri-message-3-fill" aria-hidden="true"></i>
        </a>
        <a href="tel:${HOTLINE}"
           class="float-btn float-btn-phone"
           aria-label="Gọi điện thoại ${HOTLINE}"
           title="Gọi ngay: ${HOTLINE}">
          <i class="ri-phone-fill" aria-hidden="true"></i>
        </a>
      </div>

      <div class="floating-right" data-sv-floating="true">
        <button
          class="float-btn float-btn-top"
          id="scrollTopBtn"
          aria-label="Cuộn lên đầu trang"
          title="Lên đầu trang">
          <i class="ri-arrow-up-line" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }

  /* ── 3. Inject vào DOM ─────────────────────────────────────── */
  function inject() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildHTML().trim();
    // Fragment approach — không bọc thêm div
    while (wrapper.firstChild) {
      document.body.appendChild(wrapper.firstChild);
    }
  }

  /* ── 4. Scroll-to-top logic ────────────────────────────────── */
  function initScrollTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    // Hiện/ẩn nút dựa trên vị trí cuộn
    const onScroll = () => {
      if (window.scrollY > SCROLL_OFFSET) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Kiểm tra ngay khi load

    // Click → cuộn về đầu mượt mà
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 5. Khởi động ──────────────────────────────────────────── */
  function init() {
    // Bước 0: Đảm bảo RemixIcon CSS luôn có mặt (Layer 2 fallback)
    ensureRemixIcon();

    if (alreadyInjected()) {
      // Trang đã có floating buttons (vd: index.html inline)
      // Chỉ cần khởi tạo scroll-to-top
      initScrollTop();
      return;
    }
    inject();
    initScrollTop();
  }

  // Chạy sau khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API để debug
  window.SV = window.SV || {};
  window.SV.FloatingWidget = { reinit: init };

})();
