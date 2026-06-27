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
        height: 90px;
        background: linear-gradient(135deg, #fdfbf7 0%, #f5f2eb 100%);
        background-image: 
          radial-gradient(rgba(226, 177, 60, 0.08) 1.5px, transparent 1.5px), 
          linear-gradient(135deg, #fdfbf7 0%, #f5f2eb 100%);
        background-size: 24px 24px, 100% 100%;
        border-bottom: 2px solid #E2B13C;
        position: relative;
        z-index: 910;
        display: flex;
        align-items: center;
      }
      .header-top-inner {
        width: 100%;
        max-width: 1360px;
        margin-inline: auto;
        padding-inline: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .header-top-logo {
        display: flex;
        align-items: center;
        gap: 14px;
        text-decoration: none;
      }
      .header-top-logo img {
        height: 52px;
        width: auto;
        display: block;
      }
      .header-top-brand {
        display: flex;
        flex-direction: column;
        text-align: left;
      }
      .header-top-brand .brand-title {
        font-family: var(--ff-header, sans-serif);
        font-size: 15px;
        font-weight: 900;
        color: #7B1212;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        line-height: 1.25;
      }
      .header-top-brand .brand-subtitle {
        font-family: var(--ff-body, sans-serif);
        font-size: 11px;
        font-style: italic;
        color: #c8860a;
        font-weight: 600;
        margin-top: 3px;
        letter-spacing: 0.02em;
      }
      .header-top-right {
        display: flex;
        gap: 28px;
        align-items: center;
      }
      .header-top-right .info-item {
        display: flex;
        align-items: center;
        gap: 10px;
        text-align: left;
      }
      .header-top-right .info-item i {
        font-size: 20px;
        color: #E2B13C;
        background: rgba(226, 177, 60, 0.08);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(226, 177, 60, 0.2);
      }
      .header-top-right .info-content {
        display: flex;
        flex-direction: column;
      }
      .header-top-right .info-label {
        font-size: 9px;
        text-transform: uppercase;
        color: #666;
        letter-spacing: 0.05em;
        font-weight: 700;
        line-height: 1.2;
      }
      .header-top-right .info-value {
        font-size: 13px;
        font-weight: 700;
        color: #1a1a1a;
        text-decoration: none;
        margin-top: 1px;
      }
      .header-top-right a.info-value:hover {
        color: #7B1212;
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

      /* ── Layout adjustments for desktop ── */
      @media (min-width: 1024px) {
        body {
          padding-top: 160px !important;
        }
        .header, .header-v2 {
          top: 90px !important;
          box-shadow: none !important;
        }
        .header.scrolled, .header-v2.scrolled {
          top: 0 !important;
          box-shadow: var(--sv-shadow-nav, 0 4px 20px rgba(0, 0, 0, 0.08)) !important;
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
        /* Make sure it doesn't overlap the mobile footer area too much */
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
        <a href="index.html" class="header-top-logo">
          <img src="assets/images/logo-sv-main.svg" alt="Sao Vàng Logo" />
          <div class="header-top-brand">
            <span class="brand-title">CÔNG TY TNHH CƠ KHÍ &amp; NHÔM KÍNH SAO VÀNG</span>
            <span class="brand-subtitle">Kiến tạo giá trị bền vững</span>
          </div>
        </a>
        
        <div class="header-top-right">
          <div class="info-item">
            <i class="ri-phone-line"></i>
            <div class="info-content">
              <span class="info-label">Hotline 24/7</span>
              <a href="tel:0869590279" class="info-value">0869 590 279</a>
            </div>
          </div>
          <div class="info-item">
            <i class="ri-mail-line"></i>
            <div class="info-content">
              <span class="info-label">Email liên hệ</span>
              <a href="mailto:info@saovang.vn" class="info-value">info@saovang.vn</a>
            </div>
          </div>
          <div class="info-item">
            <i class="ri-map-pin-line"></i>
            <div class="info-content">
              <span class="info-label">Địa chỉ trụ sở chính</span>
              <span class="info-value">Văn Phú, Hà Đông, Hà Nội</span>
            </div>
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
      // Basic validation for Vietnam phone numbers
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
