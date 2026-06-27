/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — modules/header-extensions.js
   Tự động tích hợp Thanh thông tin đầu trang và Thanh gửi số điện thoại liên hệ nhanh (Callback Bar)
   ════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Inject Styles into document head
  function injectStyles() {
    if (document.getElementById('header-ext-styles')) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'header-ext-styles';
    styleSheet.textContent = `
      /* ── Header Top Bar ── */
      .header-top-bar {
        width: 100%;
        height: 120px;
        background: linear-gradient(135deg, #fdfbf7 0%, #f5f2eb 100%);
        background-image: 
          radial-gradient(rgba(226, 177, 60, 0.05) 1.5px, transparent 1.5px), 
          linear-gradient(135deg, #fdfbf7 0%, #f5f2eb 100%);
        background-size: 24px 24px, 100% 100%;
        border-bottom: 2px solid #E2B13C;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;
        display: flex;
        align-items: center;
        transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        box-sizing: border-box;
      }
      .header-top-bar.scrolled {
        transform: translateY(-120px);
      }
      .header-top-inner {
        width: 100%;
        max-width: 1360px;
        margin-inline: auto;
        padding-inline: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
      }
      
      /* ── Logo + Brand Layout (Giống biển hiệu thực tế) ── */
      .header-top-brand-wrap {
        display: flex;
        align-items: center;
        gap: 18px;
        text-decoration: none;
        flex-shrink: 0;
      }
      .brand-logo-img {
        height: 86px;
        width: auto;
        display: block;
        transition: transform 0.3s ease;
      }
      .brand-logo-img:hover {
        transform: scale(1.05);
      }
      .brand-text-block {
        display: flex;
        flex-direction: column;
        text-align: left;
      }
      .brand-row-1 {
        font-family: var(--ff-header, sans-serif);
        font-size: 13px;
        font-weight: 700;
        color: #c8860a;
        letter-spacing: 0.15em;
        line-height: 1;
      }
      .brand-row-2 {
        font-family: var(--ff-header, sans-serif);
        font-size: 21px;
        font-weight: 900;
        color: #7B1212;
        letter-spacing: 0.05em;
        margin-top: 3px;
        line-height: 1.1;
        text-transform: uppercase;
      }
      .brand-divider {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 4px;
        width: 100%;
        box-sizing: border-box;
      }
      .divider-line {
        height: 1px;
        background: #E2B13C;
        flex-grow: 1;
      }
      .divider-star {
        color: #E2B13C;
        font-size: 8px;
      }
      .brand-row-3 {
        font-family: var(--ff-header, sans-serif);
        font-size: 9.5px;
        font-weight: 700;
        color: #c8860a;
        letter-spacing: 0.22em;
        margin-top: 3px;
        line-height: 1;
        text-transform: uppercase;
      }

      /* ── Info Layout Bên Phải (2 hàng ở mép ngoài bên phải) ── */
      .header-top-contact-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        text-align: right;
        gap: 8px;
        flex-shrink: 0;
      }
      .contact-row-1 {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 13.5px;
        color: #333;
        font-weight: 700;
      }
      .contact-row-2 {
        font-size: 13px;
        color: #555;
        font-weight: 500;
      }
      .contact-item {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .contact-item i {
        font-size: 15px;
        color: #E2B13C;
      }
      .contact-item a {
        color: inherit;
        text-decoration: none;
        transition: color 0.2s ease;
      }
      .contact-item a:hover {
        color: #7B1212;
      }
      .contact-separator {
        color: rgba(226, 177, 60, 0.4);
        font-weight: 300;
      }

      /* ── Sticky Callback Bar ── */
      .sticky-callback-bar {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(0);
        z-index: 1000;
        width: calc(100% - 48px);
        max-width: 1200px;
        background: rgba(18, 18, 18, 0.93);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 50px;
        padding: 8px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease;
      }
      .sticky-callback-left {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
      }
      .sticky-callback-title {
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
        font-family: var(--ff-header, sans-serif);
      }
      .sticky-callback-title strong {
        color: #E2B13C;
      }
      .sticky-callback-form {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        max-width: 440px;
      }
      .sticky-callback-input {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 30px;
        padding: 8px 18px;
        color: #fff;
        font-size: 13px;
        width: 100%;
        transition: all 0.3s ease;
      }
      .sticky-callback-input:focus {
        outline: none;
        border-color: #E2B13C;
        background: rgba(255, 255, 255, 0.15);
      }
      .sticky-callback-input::placeholder {
        color: rgba(255, 255, 255, 0.45);
      }
      .sticky-callback-btn {
        background: #7B1212;
        color: #fff;
        border: none;
        border-radius: 30px;
        padding: 8px 22px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.25s ease;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: var(--ff-header, sans-serif);
      }
      .sticky-callback-btn:hover {
        background: #E2B13C;
        color: #121212;
      }
      .sticky-callback-btn:disabled {
        background: #333;
        color: #888;
        cursor: not-allowed;
      }
      .sticky-callback-right {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-left: 24px;
      }
      .sticky-callback-hotline-link {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.05);
        padding: 6px 14px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.25s ease;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        font-family: var(--ff-header, sans-serif);
      }
      .sticky-callback-hotline-link strong {
        color: #E2B13C;
        font-weight: 800;
        font-size: 13.5px;
      }
      .sticky-callback-hotline-link i {
        color: #E2B13C;
        font-size: 14px;
      }
      .sticky-callback-hotline-link:hover {
        background: rgba(226, 177, 60, 0.12);
        border-color: #E2B13C;
      }

      /* ── Hide navigation bar logo & hotline on desktop ── */
      @media (min-width: 1024px) {
        body {
          padding-top: 190px !important;
        }
        .header, .header-v2 {
          position: fixed !important;
          top: 120px !important;
          box-shadow: none !important;
          transition: top 0.3s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s ease, height 0.3s ease !important;
        }
        .header.scrolled, .header-v2.scrolled {
          top: 0 !important;
          box-shadow: var(--sv-shadow-nav, 0 4px 20px rgba(0, 0, 0, 0.08)) !important;
        }
        /* Hide logo and yellow hotline button from navigation bar on desktop since top bar has them */
        .logo, .nav-logo, .nav-hotline {
          display: none !important;
        }
      }

      /* ── Responsive adjustments ── */
      @media (max-width: 1023px) {
        .header-top-bar {
          display: none !important;
        }
        .header, .header-v2 {
          top: 0 !important;
        }
        .sticky-callback-bar {
          bottom: 0;
          left: 0;
          transform: none;
          width: 100%;
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-bottom: none;
          padding: 8px 16px;
          flex-direction: column;
          gap: 6px;
        }
        .sticky-callback-left {
          width: 100%;
          flex-direction: column;
          gap: 6px;
          align-items: stretch;
        }
        .sticky-callback-title {
          text-align: center;
        }
        .sticky-callback-form {
          max-width: 100%;
        }
        .sticky-callback-right {
          margin-left: 0;
          width: 100%;
          justify-content: center;
        }
        body {
          padding-bottom: 90px !important;
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  // Render the Header Top Bar above the header
  function renderHeaderTopBar() {
    if (document.querySelector('.header-top-bar')) return;

    const topBar = document.createElement('div');
    topBar.className = 'header-top-bar';
    topBar.innerHTML = `
      <div class="header-top-inner">
        <a href="index.html" class="header-top-brand-wrap">
          <img src="assets/images/logo-cty.png" alt="Sao Vàng Logo" class="brand-logo-img" />
          <div class="brand-text-block">
            <span class="brand-row-1">CÔNG TY CỔ PHẦN</span>
            <span class="brand-row-2">SẢN XUẤT CƠ KHÍ SAO VÀNG</span>
            <div class="brand-divider">
              <span class="divider-line"></span>
              <i class="ri-star-fill divider-star"></i>
              <span class="divider-line"></span>
            </div>
            <span class="brand-row-3">GOLDEN STAR MECHANICAL JSC</span>
          </div>
        </a>
        
        <div class="header-top-contact-right">
          <div class="contact-row-1">
            <span class="contact-item">
              <i class="ri-phone-fill"></i>
              <span>Hotline: </span>
              <a href="tel:0869590279">0869 590 279</a>
            </span>
            <span class="contact-separator">|</span>
            <span class="contact-item">
              <i class="ri-mail-fill"></i>
              <span>Email: </span>
              <a href="mailto:cokhisaovangvn@gmail.com">cokhisaovangvn@gmail.com</a>
            </span>
          </div>
          <div class="contact-row-2">
            <span class="contact-item">
              <i class="ri-map-pin-fill"></i>
              <span>Địa chỉ: Tầng 3, TT7-35 KĐT Văn Phú, phường Kiến Hưng, TP Hà Nội, Việt Nam</span>
            </span>
          </div>
        </div>
      </div>
    `;

    // Prepend to body before header
    const mainHeader = document.querySelector('.header, .header-v2');
    if (mainHeader) {
      mainHeader.parentNode.insertBefore(topBar, mainHeader);
    } else {
      document.body.insertBefore(topBar, document.body.firstChild);
    }

    // Scroll sync logic
    const handleScroll = () => {
      if (window.scrollY > 50) {
        topBar.classList.add('scrolled');
      } else {
        topBar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Render the Sticky Callback Bar at the bottom
  function renderStickyCallbackBar() {
    if (document.querySelector('.sticky-callback-bar')) return;

    const callbackBar = document.createElement('div');
    callbackBar.className = 'sticky-callback-bar';
    callbackBar.innerHTML = `
      <div class="sticky-callback-left">
        <div class="sticky-callback-title">Để lại số điện thoại <strong>chúng tôi gọi lại ngay:</strong></div>
        <form class="sticky-callback-form">
          <input 
            type="tel" 
            class="sticky-callback-input" 
            placeholder="Nhập số điện thoại của bạn..." 
            required 
            pattern="[0-9+ ]{9,15}"
            aria-label="Số điện thoại liên hệ"
          />
          <button type="submit" class="sticky-callback-btn">
            GỬI
          </button>
        </form>
      </div>
      <div class="sticky-callback-right">
        <a href="tel:0869590279" class="sticky-callback-hotline-link">
          <i class="ri-phone-fill"></i>
          <span>Hotline: <strong>0869 590 279</strong></span>
        </a>
      </div>
    `;

    document.body.appendChild(callbackBar);

    // Form Submit Event Handler
    const form = callbackBar.querySelector('.sticky-callback-form');
    const input = callbackBar.querySelector('.sticky-callback-input');
    const btn = callbackBar.querySelector('.sticky-callback-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const phoneVal = input.value.trim();
      const cleaned = phoneVal.replace(/\D/g, '');
      if (cleaned.length < 9 || cleaned.length > 11) {
        alert('Vui lòng nhập số điện thoại hợp lệ (từ 9 đến 11 chữ số).');
        return;
      }

      const origText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> ĐANG GỬI...`;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'Khách hàng liên hệ nhanh',
            phone: phoneVal,
            source: 'callback_bar',
            note: 'Khách hàng gửi số điện thoại yêu cầu liên hệ lại từ thanh Callback Bar dưới đáy màn hình.'
          })
        });

        const resData = await response.json();

        if (response.ok && resData.success !== false) {
          btn.innerHTML = `<i class="ri-checkbox-circle-fill"></i> ĐÃ GỬI`;
          btn.style.background = '#2a7a2a';
          input.value = '';
          input.placeholder = 'Gửi thành công! Xin cảm ơn.';
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = origText;
            btn.style.background = '';
            input.placeholder = 'Nhập số điện thoại của bạn...';
          }, 4500);
        } else {
          throw new Error(resData.error || 'Gửi thất bại');
        }
      } catch (err) {
        console.error('Callback request error:', err);
        alert('Có lỗi xảy ra khi gửi số điện thoại. Vui lòng thử lại sau hoặc gọi hotline trực tiếp.');
        btn.disabled = false;
        btn.innerHTML = origText;
      }
    });
  }

  // Initialize on load
  function init() {
    injectStyles();
    renderHeaderTopBar();
    renderStickyCallbackBar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
