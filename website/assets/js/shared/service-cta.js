/* ═══════════════════════════════════════════════════════════════
   service-cta.js  — Sticky Service CTA Bar v1.0
   
   Mục tiêu CRO: Tăng tỷ lệ chuyển đổi trên các trang dịch vụ.

   Kiến trúc:
   - Inject sticky CTA bar ở dưới cùng màn hình
   - Xuất hiện sau khi user scroll qua 40% trang
   - 3 action buttons: Gọi ngay / Chat Zalo / Nhận báo giá
   - Hiển thị tên dịch vụ hiện tại (tự detect từ <h1>)
   - Ẩn khi user đã scroll gần footer (tránh chồng lên)
   - Dismiss button (nhớ trong sessionStorage)
   - Chỉ hiển thị trên các trang dịch vụ (không phải homepage)
   - Micro-animation smooth slide up/down
═══════════════════════════════════════════════════════════════ */

(function ServiceCTA() {
  'use strict';

  const HOTLINE    = '0869590279';
  const ZALO_LINK  = 'https://zalo.me/0869590279';
  const QUOTE_URL  = 'lien-he.html?ref=service-cta';

  // Trang dịch vụ cần hiển thị (whitelist theo filename)
  const SERVICE_PAGES = [
    'linh-vuc-co-khi', 'co-khi-sao-vang', 'cau-thang-xoan',
    'co-khi-nghe-thuat', 'cong-nghe-thuat', 'nhom-sao-vang',
    'linh-vuc-nhom-kinh', 'cua-nhom-kinh', 'vach-kinh',
    'lan-can-kinh', 'linh-vuc-hoat-dong', 'nang-luc',
    'san-pham', 'thu-vien-sp', 'san-pham-chi-tiet',
    'du-an', 'bao-gia', 'gioi-thieu',
  ];

  const STORAGE_KEY = 'sv_cta_dismissed';

  /* ── Kiểm tra có phải trang dịch vụ không ───────────────── */
  function isServicePage() {
    const slug = window.location.pathname.split('/').pop().replace(/\.html$/, '');
    return SERVICE_PAGES.includes(slug);
  }

  /* ── Lấy tên dịch vụ từ H1 ──────────────────────────────── */
  function getServiceName() {
    const h1 = document.querySelector('h1');
    if (!h1) return 'Dịch vụ của chúng tôi';
    const text = h1.textContent.trim();
    return text.length > 40 ? text.substring(0, 38) + '…' : text;
  }

  /* ── Inject CSS ─────────────────────────────────────────── */
  function injectCSS() {
    if (document.getElementById('svSvcCtaStyles')) return;
    const style = document.createElement('style');
    style.id = 'svSvcCtaStyles';
    style.textContent = `
      /* ── Sticky Service CTA Bar ── */
      #sv-service-cta {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        z-index: 9990;
        background: linear-gradient(90deg, #0f0a0a 0%, #1a0d0d 50%, #0f0a0a 100%);
        border-top: 1px solid rgba(155,28,28,.35);
        padding: 0;
        transform: translateY(100%);
        transition: transform .4s cubic-bezier(.25,.46,.45,.94);
        box-shadow: 0 -8px 40px rgba(0,0,0,.35);
      }
      #sv-service-cta.sv-cta-visible {
        transform: translateY(0);
      }
      #sv-service-cta.sv-cta-hidden {
        transform: translateY(100%);
      }
      .sv-cta-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 14px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        flex-wrap: wrap;
      }
      .sv-cta-left {
        display: flex;
        align-items: center;
        gap: 14px;
        flex: 1;
        min-width: 0;
      }
      .sv-cta-dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        background: #C9A227;
        flex-shrink: 0;
        animation: svCtaPulse 1.8s ease-in-out infinite;
      }
      @keyframes svCtaPulse {
        0%,100% { opacity:1; transform:scale(1); box-shadow:0 0 0 0 rgba(201,162,39,.4); }
        50%      { opacity:.7; transform:scale(1.2); box-shadow:0 0 0 6px rgba(201,162,39,0); }
      }
      .sv-cta-text-wrap { min-width: 0; }
      .sv-cta-eyebrow {
        font-family: 'Montserrat', sans-serif;
        font-size: 9px; font-weight: 800;
        letter-spacing: .18em; text-transform: uppercase;
        color: rgba(255,255,255,.35);
        margin-bottom: 2px;
      }
      .sv-cta-service-name {
        font-family: 'Montserrat', sans-serif;
        font-size: 13px; font-weight: 800;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sv-cta-buttons {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .sv-cta-btn {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        border-radius: 8px;
        font-family: 'Montserrat', sans-serif;
        font-size: 11.5px; font-weight: 800;
        letter-spacing: .08em; text-transform: uppercase;
        padding: 11px 18px;
        text-decoration: none;
        border: none; cursor: pointer;
        transition: all .22s ease;
        white-space: nowrap;
      }
      .sv-cta-btn-quote {
        background: linear-gradient(135deg,#C9A227,#d4ae3a);
        color: #fff;
        box-shadow: 0 4px 16px rgba(201,162,39,.4);
      }
      .sv-cta-btn-quote:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(201,162,39,.55);
      }
      .sv-cta-btn-call {
        background: rgba(155,28,28,.85);
        color: #fff;
        border: 1px solid rgba(155,28,28,.5);
      }
      .sv-cta-btn-call:hover {
        background: #9B1C1C;
        transform: translateY(-2px);
      }
      .sv-cta-btn-zalo {
        background: rgba(0,104,255,.15);
        color: #4d8eff;
        border: 1px solid rgba(0,104,255,.25);
      }
      .sv-cta-btn-zalo:hover {
        background: rgba(0,104,255,.25);
        transform: translateY(-2px);
      }
      .sv-cta-dismiss {
        background: none; border: none;
        color: rgba(255,255,255,.25);
        cursor: pointer; padding: 6px;
        border-radius: 4px; font-size: 18px;
        line-height: 1; flex-shrink: 0;
        transition: color .2s;
      }
      .sv-cta-dismiss:hover { color: rgba(255,255,255,.6); }

      /* Mobile: compact layout */
      @media (max-width: 600px) {
        .sv-cta-inner { padding: 12px 16px; gap: 10px; }
        .sv-cta-service-name { font-size: 11.5px; }
        .sv-cta-eyebrow { display: none; }
        .sv-cta-btn { font-size: 10.5px; padding: 10px 14px; }
        .sv-cta-btn-zalo { display: none; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Build HTML ─────────────────────────────────────────── */
  function buildHTML(serviceName) {
    return `
      <div id="sv-service-cta" role="complementary" aria-label="Liên hệ nhanh">
        <div class="sv-cta-inner">
          <div class="sv-cta-left">
            <div class="sv-cta-dot" aria-hidden="true"></div>
            <div class="sv-cta-text-wrap">
              <div class="sv-cta-eyebrow">Tư vấn ngay</div>
              <div class="sv-cta-service-name" title="${serviceName}">${serviceName}</div>
            </div>
          </div>

          <div class="sv-cta-buttons">
            <a href="${QUOTE_URL}"
               class="sv-cta-btn sv-cta-btn-quote"
               id="svCtaBtnQuote"
               aria-label="Nhận báo giá miễn phí">
              <i class="ri-price-tag-3-fill" aria-hidden="true"></i>
              Nhận Báo Giá
            </a>
            <a href="tel:${HOTLINE}"
               class="sv-cta-btn sv-cta-btn-call"
               id="svCtaBtnCall"
               aria-label="Gọi ngay ${HOTLINE}">
              <i class="ri-phone-fill" aria-hidden="true"></i>
              Gọi Ngay
            </a>
            <a href="${ZALO_LINK}"
               class="sv-cta-btn sv-cta-btn-zalo"
               id="svCtaBtnZalo"
               target="_blank" rel="noopener"
               aria-label="Chat Zalo">
              <i class="ri-message-3-fill" aria-hidden="true"></i>
              Zalo
            </a>
          </div>

          <button class="sv-cta-dismiss"
                  id="svCtaDismiss"
                  aria-label="Đóng thanh liên hệ"
                  title="Đóng">
            &times;
          </button>
        </div>
      </div>
    `;
  }

  /* ── Inject into DOM ─────────────────────────────────────── */
  function inject(serviceName) {
    if (document.getElementById('sv-service-cta')) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildHTML(serviceName).trim();
    document.body.appendChild(wrapper.firstElementChild);
  }

  /* ── Scroll & visibility logic ──────────────────────────── */
  function initScrollBehavior() {
    const bar = document.getElementById('sv-service-cta');
    if (!bar) return;

    const SHOW_THRESHOLD  = 0.35; // Hiện sau 35% trang
    const HIDE_NEAR_FOOTER = 200; // Ẩn khi cách footer 200px

    function update() {
      const scrollY   = window.scrollY;
      const docH      = document.documentElement.scrollHeight;
      const winH      = window.innerHeight;
      const scrollPct = scrollY / (docH - winH);

      const nearFooter = (scrollY + winH) >= (docH - HIDE_NEAR_FOOTER);

      if (scrollPct >= SHOW_THRESHOLD && !nearFooter) {
        bar.classList.add('sv-cta-visible');
        bar.classList.remove('sv-cta-hidden');
      } else {
        bar.classList.remove('sv-cta-visible');
        bar.classList.add('sv-cta-hidden');
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── Dismiss button ─────────────────────────────────────── */
  function initDismiss() {
    const btn = document.getElementById('svCtaDismiss');
    const bar = document.getElementById('sv-service-cta');
    if (!btn || !bar) return;

    btn.addEventListener('click', () => {
      bar.classList.remove('sv-cta-visible');
      bar.classList.add('sv-cta-hidden');
      // Nhớ dismiss trong session
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch(e) {}
      // Xóa scroll listener sau khi dismiss
      window.removeEventListener('scroll', update);
    });
  }

  /* ── Main ────────────────────────────────────────────────── */
  function init() {
    // Không hiển thị nếu user đã dismiss trong session này
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch(e) {}

    if (!isServicePage()) return;

    injectCSS();

    // Đợi DOM load xong để lấy H1
    const serviceName = getServiceName();
    inject(serviceName);
    initScrollBehavior();
    initDismiss();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.SV = window.SV || {};
  window.SV.ServiceCTA = { init };

})();
