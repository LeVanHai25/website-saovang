/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — modules/header-extensions.js
   Tự động tích hợp Thanh thông tin đầu trang, Thanh gửi số điện thoại liên hệ nhanh (Callback Bar),
   và Footer đồng bộ thiết kế mới (Dai Phuc Style) trên toàn bộ hệ thống
   ════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Inject Google Fonts link
  function injectGoogleFonts() {
    if (document.getElementById('header-ext-fonts')) return;
    const link = document.createElement('link');
    link.id = 'header-ext-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  // Inject Styles into document head
  function injectStyles() {
    if (document.getElementById('header-ext-styles')) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'header-ext-styles';
    styleSheet.textContent = `
      /* ── Montserrat Global Font applications ── */
      .header-top-bar,
      .brand-text-block,
      .header-top-contact-right,
      .nav-menu-link,
      .footer-column-title,
      .partners-title,
      .partner-label,
      .footer-bottom-copyright,
      .sticky-callback-title,
      .sticky-callback-btn,
      .sticky-callback-hotline-link {
        font-family: 'Montserrat', 'Inter', sans-serif !important;
      }

      /* ── Header Top Bar ── */
      .header-top-bar {
        width: 100%;
        height: 120px;
        background-image: linear-gradient(rgba(123, 18, 18, 0.12), rgba(123, 18, 18, 0.12)), url('assets/images/bg-red-header.jpg') !important;
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        border-bottom: 2px solid #E2B13C !important;
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
        font-size: 13px;
        font-weight: 700;
        color: #E2B13C !important;
        letter-spacing: 0.15em;
        line-height: 1;
      }
      .brand-row-2 {
        font-size: 21px;
        font-weight: 900;
        color: #ffffff !important;
        letter-spacing: 0.05em;
        margin-top: 3px;
        line-height: 1.1;
        text-transform: uppercase;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6) !important;
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
        font-size: 9.5px;
        font-weight: 700;
        color: #E2B13C !important;
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
        color: #ffffff !important;
        font-weight: 700;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
      .contact-row-2 {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.85) !important;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
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
        color: #E2B13C !important;
      }
      .contact-separator {
        color: rgba(226, 177, 60, 0.4);
        font-weight: 300;
      }

      /* ── Main Menu Red Background Image ── */
      .header, .header-v2 {
        background-image: linear-gradient(rgba(123, 18, 18, 0.12), rgba(123, 18, 18, 0.12)), url('assets/images/bg-red-header.jpg') !important;
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        border-bottom: 1px solid rgba(226, 177, 60, 0.3) !important;
      }
      .nav-menu-link {
        color: rgba(255, 255, 255, 0.95) !important;
        font-weight: 700 !important;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
        letter-spacing: 0.02em !important;
      }
      .nav-menu-link:hover, .nav-menu-link.active {
        color: #E2B13C !important;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6) !important;
      }

      /* ── Footer Red Background Image & Layout (Dai Phuc Style) ── */
      .footer-v2, footer, .footer {
        background-image: linear-gradient(rgba(12, 12, 12, 0.62), rgba(12, 12, 12, 0.62)), url('assets/images/bg-red-footer.jpg') !important;
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        position: relative;
        border-top: 3px solid #E2B13C !important;
        color: rgba(255, 255, 255, 0.8) !important;
        padding-top: 40px !important;
        padding-bottom: 24px !important;
      }

      /* ── Footer Partners Section ── */
      .footer-partners-section {
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        padding-bottom: 24px;
        margin-bottom: 30px;
        text-align: center;
      }
      .partners-title {
        font-size: 15px;
        font-weight: 800;
        color: #E2B13C;
        letter-spacing: 0.15em;
        margin-bottom: 20px;
        text-transform: uppercase;
        margin-top: 0;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
      }
      .partners-slider-container {
        overflow-x: auto;
        padding-bottom: 8px;
      }
      .partners-slider-container::-webkit-scrollbar {
        height: 6px;
      }
      .partners-slider-container::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
      }
      .partners-slider-container::-webkit-scrollbar-thumb {
        background: rgba(226, 177, 60, 0.3);
        border-radius: 3px;
      }
      .partners-track {
        display: flex;
        gap: 12px;
        justify-content: space-between;
        min-width: 1040px;
      }
      .partner-card {
        background: #fff;
        border-radius: 6px;
        padding: 8px;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-sizing: border-box;
      }
      .partner-logo-box {
        height: 48px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        border-radius: 4px;
        font-size: 13.5px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border: 1px solid #e0e0e0;
        box-sizing: border-box;
        font-family: 'Montserrat', sans-serif !important;
      }
      .partner-label {
        font-size: 11.5px;
        color: #333;
        font-weight: 700;
        margin-top: 6px;
        text-align: center;
      }

      /* ── Footer Columns Grid ── */
      .footer-columns-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr 1fr;
        gap: 32px;
        margin-bottom: 30px;
        text-align: left;
      }
      .footer-column {
        display: flex;
        flex-direction: column;
      }
      .footer-column-title {
        font-size: 14px;
        font-weight: 800;
        color: #E2B13C;
        letter-spacing: 0.12em;
        margin-bottom: 18px;
        text-transform: uppercase;
        border-left: 3px solid #E2B13C;
        padding-left: 8px;
        line-height: 1.2;
        margin-top: 0;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
      }
      .footer-contact-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .contact-list-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 13px;
        color: rgba(255,255,255,0.85);
        line-height: 1.5;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
      .contact-list-item i {
        color: #E2B13C;
        font-size: 15px;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .footer-links-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .footer-links-list a {
        font-size: 13px;
        color: rgba(255,255,255,0.8);
        text-decoration: none;
        transition: color 0.25s ease, padding-left 0.25s ease;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
      .footer-links-list a:hover {
        color: #E2B13C;
        padding-left: 4px;
      }
      .footer-social-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        text-decoration: none;
        font-size: 14px;
        transition: all 0.25s ease;
      }
      .footer-social-icon:hover {
        background: #E2B13C !important;
        border-color: #E2B13C !important;
        color: #121212 !important;
        transform: translateY(-2px);
      }

      /* ── Footer Bottom Copyright ── */
      .footer-bottom-copyright {
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        padding-top: 20px;
        text-align: center;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        line-height: 1.6;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
      }
      .footer-bottom-copyright a {
        color: inherit;
        text-decoration: none;
      }

      /* ── Sticky Callback Bar (Căn lề trái & Rút gọn khoảng trống) ── */
      .sticky-callback-bar {
        position: fixed;
        bottom: 24px;
        left: 24px;
        transform: none;
        z-index: 1000;
        width: auto;
        max-width: 820px;
        background: rgba(18, 18, 18, 0.93);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 50px;
        padding: 6px 18px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 14px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease;
      }
      .sticky-callback-left {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 0 0 auto;
      }
      .sticky-callback-title {
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
      }
      .sticky-callback-title strong {
        color: #E2B13C;
      }
      .sticky-callback-form {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 320px;
      }
      .sticky-callback-input {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 30px;
        padding: 6px 14px;
        color: #fff;
        font-size: 13px;
        width: 100%;
        transition: all 0.3s ease;
        box-sizing: border-box;
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
        padding: 6px 18px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.25s ease;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 6px;
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
        margin-left: 4px;
        flex: 0 0 auto;
      }
      .sticky-callback-hotline-link {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.05);
        padding: 5px 12px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.25s ease;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
      }
      .sticky-callback-hotline-link strong {
        color: #E2B13C;
        font-weight: 800;
        font-size: 13px;
      }
      .sticky-callback-hotline-link i {
        color: #E2B13C;
        font-size: 13px;
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
        /* Shift floating Zalo and Phone buttons upward to avoid overlap with bottom-left callback bar */
        .floating-left {
          bottom: 96px !important;
          left: 28px !important;
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
          width: 100%;
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
        .footer-columns-grid {
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
      }
      @media (max-width: 600px) {
        .footer-columns-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
        .partners-track {
          min-width: auto;
          flex-wrap: wrap;
          justify-content: center;
        }
        .partner-card {
          flex: 0 0 calc(50% - 6px);
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
          <img src="assets/images/logo-cty-white.png" alt="Sao Vàng Logo" class="brand-logo-img" />
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

  // Render unified Footer (Dai Phuc Style with Sao Vang info & Partners)
  function renderFooter() {
    const footerEl = document.querySelector('.footer-v2, footer, .footer');
    if (!footerEl) return;

    footerEl.innerHTML = `
      <div class="sv-container" style="max-width: 1360px; margin-inline: auto; padding-inline: 24px; box-sizing: border-box;">
        
        <!-- 1. PARTNERS SECTION -->
        <div class="footer-partners-section">
          <h3 class="partners-title">ĐƠN VỊ ĐỐI TÁC CỦA CHÚNG TÔI</h3>
          <div class="partners-slider-container">
            <div class="partners-track">
              <div class="partner-card">
                <div class="partner-logo-box" style="font-weight: 900; color: #555;">NHA XINH</div>
                <div class="partner-label">Nội thất nhà xinh</div>
              </div>
              <div class="partner-card">
                <div class="partner-logo-box" style="font-weight: 800; color: #e05206; font-style: italic;">DRAHO</div>
                <div class="partner-label">Phụ kiện Draho</div>
              </div>
              <div class="partner-card">
                <div class="partner-logo-box" style="font-weight: 800; color: #333; letter-spacing: 1px;">bogo</div>
                <div class="partner-label">Phụ kiện Bogo</div>
              </div>
              <div class="partner-card">
                <div class="partner-logo-box" style="font-weight: 800; color: #8B0000;">ZHONGKAI</div>
                <div class="partner-label">Nhôm Zongkai</div>
              </div>
              <div class="partner-card">
                <div class="partner-logo-box" style="font-weight: 800; color: #d67d00;">ADLER</div>
                <div class="partner-label">Phụ kiện Adler</div>
              </div>
              <div class="partner-card">
                <div class="partner-logo-box" style="font-weight: 900; color: #b21f1f;">XINGFA</div>
                <div class="partner-label">Nhôm Xingfa</div>
              </div>
              <div class="partner-card">
                <div class="partner-logo-box" style="font-weight: 800; color: #0e5a37;">COTECCONS</div>
                <div class="partner-label">Nhà thầu Coteccons</div>
              </div>
              <div class="partner-card">
                <div class="partner-logo-box" style="font-weight: 900; color: #0b4182;">KIN LONG</div>
                <div class="partner-label">Phụ kiện KinLong</div>
              </div>
              <div class="partner-card">
                <div class="partner-logo-box" style="font-weight: 900; color: #033a8c; font-style: italic;">APOLLO</div>
                <div class="partner-label">Silicone Apollo</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. FOUR COLUMNS SECTION -->
        <div class="footer-columns-grid">
          
          <!-- Column 1: THÔNG TIN LIÊN HỆ -->
          <div class="footer-column">
            <h4 class="footer-column-title">THÔNG TIN LIÊN HỆ</h4>
            <div class="footer-contact-list">
              <div class="contact-list-item">
                <i class="ri-building-4-fill"></i>
                <strong style="color: #fff;">CÔNG TY CỔ PHẦN SẢN XUẤT CƠ KHÍ SAO VÀNG</strong>
              </div>
              <div class="contact-list-item">
                <i class="ri-map-pin-2-fill"></i>
                <span>Địa chỉ: Tầng 3, TT7-35 KĐT Văn Phú, phường Kiến Hưng, TP Hà Nội, Việt Nam</span>
              </div>
              <div class="contact-list-item">
                <i class="ri-file-list-3-fill"></i>
                <span>Mã số thuế: 0110808047</span>
              </div>
              <div class="contact-list-item">
                <i class="ri-phone-fill"></i>
                <span>Hotline: <a href="tel:0869590279" style="color: inherit; text-decoration: none; font-weight: 700;">0869 590 279</a></span>
              </div>
              <div class="contact-list-item">
                <i class="ri-mail-fill"></i>
                <span>Email: <a href="mailto:cokhisaovangvn@gmail.com" style="color: inherit; text-decoration: none;">cokhisaovangvn@gmail.com</a></span>
              </div>
              <div class="contact-list-item">
                <i class="ri-global-fill"></i>
                <span>Website: <a href="https://www.CoKhiSaoVang.com" target="_blank" style="color: inherit; text-decoration: none;">www.CoKhiSaoVang.com</a></span>
              </div>
            </div>
          </div>

          <!-- Column 2: ĐIỀU KHOẢN SỬ DỤNG -->
          <div class="footer-column">
            <h4 class="footer-column-title">ĐIỀU KHOẢN SỬ DỤNG</h4>
            <div class="footer-links-list">
              <a href="#">Chính sách và Quy định chung</a>
              <a href="#">Quy định và hình thức thanh toán</a>
              <a href="#">Chính sách vận chuyển và giao hàng</a>
              <a href="#">Chính sách bảo mật thông tin</a>
              <a href="#">Chính sách đổi trả và bảo hành</a>
              <a href="#">Hướng dẫn mua hàng online</a>
            </div>
            <div class="footer-badges-row" style="display: flex; gap: 10px; margin-top: 15px; align-items: center;">
              <a href="#" target="_blank" rel="noopener" title="Đã đăng ký Bộ Công Thương">
                <img src="https://images.squarespace-cdn.com/content/v1/5ebd210bf9b2e04db140f8bf/1618476298514-W8FUP0G71J8VZZDCOB4A/logoSaleNoti.png" alt="Bộ Công Thương" style="height: 36px; width: auto; background: transparent;" />
              </a>
              <a href="#" target="_blank" rel="noopener" title="DMCA Protected">
                <img src="https://images.dmca.com/Badges/dmca_protected_sml_120m.png" alt="DMCA Protected" style="height: 36px; width: auto;" />
              </a>
            </div>
          </div>

          <!-- Column 3: SẢN PHẨM -->
          <div class="footer-column">
            <h4 class="footer-column-title">SẢN PHẨM</h4>
            <div class="footer-links-list">
              <a href="cua-nhom-kinh.html">Cửa Nhôm Xingfa</a>
              <a href="cua-nhom-kinh.html">Cửa Trượt Quay</a>
              <a href="cua-nhom-kinh.html">Cửa Nhôm Hệ Slim</a>
              <a href="cua-nhom-kinh.html">Cửa Nhôm Slim Cover</a>
              <a href="lan-can-kinh.html">Cửa Kính Cường Lực</a>
              <a href="cua-nhom-kinh.html">Cửa Nhôm Thủy Lực</a>
              <a href="cua-nhom-kinh.html">Cửa Nhôm Maxpro.JP</a>
              <a href="vach-kinh.html">Phòng Tắm Kính</a>
              <a href="cau-thang-xoan.html">Cầu Thang - Lan Can Kính</a>
              <a href="cua-nhom-kinh.html">Cửa Tự Động</a>
            </div>
          </div>

          <!-- Column 4: GỬI THÔNG TIN TƯ VẤN -->
          <div class="footer-column">
            <h4 class="footer-column-title">GỬI THÔNG TIN TƯ VẤN</h4>
            <p style="font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.5; margin-bottom: 12px; margin-top: 0;">
              Hãy để lại địa chỉ email của bạn để nhận thông tin tư vấn, báo giá sản phẩm.
            </p>
            <form class="footer-newsletter-form" style="display: flex; align-items: stretch; gap: 6px; margin-bottom: 15px;">
              <input type="email" placeholder="Email của bạn..." required style="flex: 1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 8px 12px; color: #fff; font-size: 13px; outline: none;" />
              <button type="submit" style="background: #7B1212; color: #fff; border: none; border-radius: 4px; padding: 0 16px; font-weight: 700; font-size: 12px; cursor: pointer; transition: background 0.2s;">GỬI</button>
            </form>
            <div class="footer-social-row" style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.75);">
              <span>Social:</span>
              <a href="#" class="footer-social-icon" aria-label="Facebook"><i class="ri-facebook-fill"></i></a>
              <a href="#" class="footer-social-icon" aria-label="Twitter"><i class="ri-twitter-fill"></i></a>
              <a href="#" class="footer-social-icon" aria-label="Google"><i class="ri-google-fill"></i></a>
            </div>
          </div>

        </div>

        <!-- 3. COPYRIGHT BOTTOM BAR -->
        <div class="footer-bottom-copyright">
          <span>Copyright © 2026 - Công ty Cổ Phần Sản Xuất Cơ Khí Sao Vàng - MST 0110808047 cấp bởi Sở KHĐT TP.Hà Nội. Đã đăng ký Bộ Công Thương, được bảo hộ bản quyền tác giả bởi đạo luật DMCA Hoa Kỳ; Vui lòng không sao chép nội dung dưới mọi hình thức.</span>
        </div>

      </div>
    `;

    // Form submit handler
    const form = footerEl.querySelector('.footer-newsletter-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        alert('Cảm ơn bạn đã để lại thông tin liên hệ! Chúng tôi sẽ gửi báo giá sớm nhất tới email ' + input.value);
        input.value = '';
      });
    }
  }

  // Dynamic Logo Replacement for navbar and footer
  function setupLogos() {
    // 1. Replace desktop menu / mobile navbar logos with white transparent company logo
    document.querySelectorAll('.nav-logo img, .logo img').forEach(img => {
      img.src = 'assets/images/logo-cty-white.png';
      img.style.height = '48px';
      img.style.width = 'auto';
    });

    // 2. Replace footer logos with white transparent company logo
    document.querySelectorAll('.footer-logo img, .footer-logo-wrap img').forEach(img => {
      img.src = 'assets/images/logo-cty-white.png';
      img.style.height = '62px';
      img.style.width = 'auto';
      const iconWrap = img.closest('.footer-logo-icon');
      if (iconWrap) {
        iconWrap.style.border = 'none';
        iconWrap.style.width = 'auto';
        iconWrap.style.height = 'auto';
      }
    });
  }

  // Initialize on load
  function init() {
    injectGoogleFonts();
    injectStyles();
    renderHeaderTopBar();
    renderStickyCallbackBar();
    renderFooter();
    setupLogos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
