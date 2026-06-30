/* ═══════════════════════════════════════════════════════════════
   analytics.js — Event Tracking Module v1.0
   Kiến trúc: Google Tag Manager DataLayer + Native GA4 fallback

   CẤU HÌNH: Thay đổi các giá trị trong CONFIG trước khi deploy.
   
   EVENTS ĐƯỢC TRACK:
   - page_view           (tự động)
   - click_to_call       (click vào số điện thoại)
   - click_to_zalo       (click vào Zalo button/link)
   - form_submit_success (gửi form thành công)
   - catalogue_request   (click "Nhận Catalogue Miễn Phí")
   - scroll_depth        (25%, 50%, 75%, 90%)
   - service_cta_click   (click sticky CTA bar)
   - internal_link_click (click related services)
   - lp_form_submit      (landing page form submit)
═══════════════════════════════════════════════════════════════ */

(function SVAnalytics() {
  'use strict';

  /* ══════════════════════════════════════════════
     ⚙️  CẤU HÌNH — Điền ID của bạn vào đây
  ══════════════════════════════════════════════ */
  const CONFIG = {
    // GA4 Measurement ID — lấy từ Google Analytics > Admin > Data Streams
    // VD: 'G-XXXXXXXXXX'
    GA4_ID: 'G-XXXXXXXXXX',

    // GTM Container ID — lấy từ Google Tag Manager
    // VD: 'GTM-XXXXXXX'
    GTM_ID: 'GTM-XXXXXXX',

    // Microsoft Clarity Project ID
    // VD: 'xxxxxxxxxx'
    CLARITY_ID: 'XXXXXXXXXX',

    // Debug mode: true = log events ra console (development only)
    DEBUG: false,
  };
  /* ════════════════════════════════════════════ */

  /* ── DataLayer helper ────────────────────────────────────── */
  window.dataLayer = window.dataLayer || [];

  function push(event, params) {
    const payload = { event, ...params };
    window.dataLayer.push(payload);

    // Native GA4 fallback (nếu không dùng GTM)
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    }

    if (CONFIG.DEBUG) {
      console.log('[SVAnalytics]', event, params);
    }
  }

  /* ── Lấy tên trang hiện tại ──────────────────────────────── */
  function getPageSlug() {
    return window.location.pathname.split('/').pop().replace(/\.html$/, '') || 'index';
  }

  /* ── 1. CLICK TO CALL ────────────────────────────────────── */
  function trackCalls() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="tel:"]');
      if (!link) return;

      const phone = link.href.replace('tel:', '');
      const source = link.id || link.className || 'unknown';

      push('click_to_call', {
        phone_number  : phone,
        page_slug     : getPageSlug(),
        click_source  : source,
      });
    }, true);
  }

  /* ── 2. CLICK TO ZALO ────────────────────────────────────── */
  function trackZalo() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href*="zalo.me"]');
      if (!link) return;

      push('click_to_zalo', {
        page_slug   : getPageSlug(),
        click_source: link.id || link.className || 'unknown',
      });
    }, true);
  }

  /* ── 3. FORM SUBMIT ──────────────────────────────────────── */
  function trackForms() {
    document.addEventListener('submit', function(e) {
      const form = e.target;
      const formId = form.id || form.name || 'unnamed_form';

      // Phân biệt LP form vs Contact form
      const isLP = window.location.pathname.includes('/lp-');

      push(isLP ? 'lp_form_submit' : 'form_submit_success', {
        form_id     : formId,
        page_slug   : getPageSlug(),
        page_type   : isLP ? 'landing_page' : 'website',
      });
    }, true);
  }

  /* ── 4. CATALOGUE REQUEST ────────────────────────────────── */
  function trackCatalogueRequest() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('[href*="?ref=catalogue"], #btnDownloadCatalogue');
      if (!link) return;

      push('catalogue_request', {
        page_slug: getPageSlug(),
      });
    }, true);
  }

  /* ── 5. SCROLL DEPTH ─────────────────────────────────────── */
  function trackScrollDepth() {
    const milestones  = [25, 50, 75, 90];
    const reached     = new Set();

    function onScroll() {
      const scrolled  = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct       = Math.round((scrolled / docHeight) * 100);

      milestones.forEach(function(m) {
        if (pct >= m && !reached.has(m)) {
          reached.add(m);
          push('scroll_depth', {
            depth_percentage: m,
            page_slug       : getPageSlug(),
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── 6. SERVICE CTA CLICKS (sticky bar) ─────────────────── */
  function trackServiceCTA() {
    document.addEventListener('click', function(e) {
      // Báo giá button
      if (e.target.closest('#svCtaBtnQuote')) {
        push('service_cta_click', { button: 'quote', page_slug: getPageSlug() });
      }
      // Gọi điện button
      if (e.target.closest('#svCtaBtnCall')) {
        push('service_cta_click', { button: 'call', page_slug: getPageSlug() });
      }
      // Zalo button
      if (e.target.closest('#svCtaBtnZalo')) {
        push('service_cta_click', { button: 'zalo', page_slug: getPageSlug() });
      }
    }, true);
  }

  /* ── 7. INTERNAL LINK CLICKS (related services) ──────────── */
  function trackInternalLinks() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('.sv-rel-card');
      if (!link) return;

      push('internal_link_click', {
        destination : link.getAttribute('href') || '',
        link_label  : link.querySelector('.sv-rel-name')?.textContent?.trim() || '',
        from_page   : getPageSlug(),
      });
    }, true);
  }

  /* ── 8. LP-SPECIFIC EVENTS ───────────────────────────────── */
  function trackLandingPage() {
    if (!window.location.pathname.includes('/lp-')) return;

    // Track khi user xem phần form (Intersection Observer)
    const formCard = document.getElementById('lpLeadForm');
    if (formCard && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            push('lp_form_visible', { page_slug: getPageSlug() });
            observer.disconnect();
          }
        });
      }, { threshold: 0.5 });
      observer.observe(formCard);
    }

    // Track time on LP (30s engagement)
    setTimeout(function() {
      push('lp_engaged', {
        page_slug     : getPageSlug(),
        seconds_on_page: 30,
      });
    }, 30000);
  }

  /* ── 9. HEADER CTA CLICK (LP pages) ─────────────────────── */
  function trackHeaderCTA() {
    document.addEventListener('click', function(e) {
      if (e.target.closest('#lpHeaderCall') || e.target.closest('#lpFinalCall')) {
        push('lp_cta_click', {
          button_id : e.target.closest('[id]')?.id || 'unknown',
          page_slug : getPageSlug(),
        });
      }
    }, true);
  }

  /* ── KHỞI ĐỘNG TẤT CẢ ────────────────────────────────────── */
  function init() {
    trackCalls();
    trackZalo();
    trackForms();
    trackCatalogueRequest();
    trackScrollDepth();
    trackServiceCTA();
    trackInternalLinks();
    trackLandingPage();
    trackHeaderCTA();

    // Page view (bổ sung thêm page_type)
    push('page_view_enhanced', {
      page_slug : getPageSlug(),
      page_type : window.location.pathname.includes('/lp-') ? 'landing_page' : 'website',
    });

    if (CONFIG.DEBUG) {
      console.log('[SVAnalytics] Initialized on:', getPageSlug());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API để debug
  window.SV = window.SV || {};
  window.SV.Analytics = {
    push     : push,
    getConfig: function() { return CONFIG; },
    dataLayer: window.dataLayer,
  };

})();
