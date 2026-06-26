/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — modules/cms-pages/library.js  v1.0
   Controller cho trang Thư Viện Kỹ Thuật (thu-vien-sp.html).
   Xử lý:
   1. Bộ chuyển đổi hệ nhôm (Aluminum Systems Switcher)
   2. Cuộn mượt với offset tránh đè bởi header sticky
   3. Highlight trạng thái active của menu phụ khi cuộn
   ════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── 1. Systems Switcher Interactivity ─────────────────────── */
  function initSystemsSwitcher() {
    const tabButtons = document.querySelectorAll('.sys-tab-btn');
    const specPanels = document.querySelectorAll('.specs-panel');

    if (!tabButtons.length || !specPanels.length) return;

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Deactivate all buttons
        tabButtons.forEach(b => b.classList.remove('active'));
        // Activate clicked button
        btn.classList.add('active');

        const target = btn.dataset.target;

        // Hide all panels
        specPanels.forEach(panel => {
          panel.classList.remove('active');
        });

        // Show target panel
        const activePanel = document.getElementById(`panel-${target}`);
        if (activePanel) {
          activePanel.classList.add('active');
        }
      });
    });
  }

  /* ─── 2. Smooth Scroll with Sticky Headers Offset ─────────────── */
  function initQuickJumpScroll() {
    const jumpLinks = document.querySelectorAll('.quick-jump-link');

    jumpLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href.startsWith('#')) return;

        e.preventDefault();
        const targetEl = document.querySelector(href);
        if (!targetEl) return;

        // Header height + Sub-nav height = ~130px
        const offset = 130;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ─── 3. Scrollspy active link highlighting ──────────────────── */
  function initScrollspy() {
    const jumpLinks = document.querySelectorAll('.quick-jump-link');
    const sections = [];

    // Find sections corresponding to links
    jumpLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        const el = document.querySelector(href);
        if (el) sections.push({ id: href, el: el });
      }
    });

    if (!sections.length) return;

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 150; // offset margin
      let activeId = '';

      // Find which section is currently in viewport
      for (let i = 0; i < sections.length; i++) {
        const { id, el } = sections[i];
        const top = el.offsetTop;
        const height = el.offsetHeight;

        if (scrollPos >= top && scrollPos < top + height) {
          activeId = id;
          break;
        }
      }

      // Special case: if at bottom of page, highlight the last link
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
        activeId = sections[sections.length - 1].id;
      }

      // Update active state in nav
      if (activeId) {
        jumpLinks.forEach(link => {
          const isActive = link.getAttribute('href') === activeId;
          link.classList.toggle('active', isActive);
        });
      }
    }, { passive: true });
  }

  /* ─── Init ──────────────────────────────────────────────────── */
  function init() {
    initSystemsSwitcher();
    initQuickJumpScroll();
    initScrollspy();
  }

  document.addEventListener('DOMContentLoaded', init);

  /* ─── Expose ────────────────────────────────────────────────── */
  window.SV = window.SV || {};
  window.SV.Library = { init };

})();
