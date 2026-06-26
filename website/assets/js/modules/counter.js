/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — modules/counter.js  v1.0
   Animated number counter dùng IntersectionObserver.

   Cách dùng trong HTML:
     <span data-counter>500</span>+
     <span data-counter>24</span>/7

   Options qua data attributes:
     data-counter-duration="2000"  — thời gian animation (ms), mặc định 1800
     data-counter-suffix="+"       — suffix gắn sau số (tự detect từ text nếu không set)
════════════════════════════════════════════════════════════════ */

(function initCounter() {
  'use strict';

  const canAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el) {
    const raw      = el.textContent.trim();

    // Skip "24/7" style values
    if (raw.includes('/')) return;

    // Auto-detect suffix (e.g. "500+" → suffix "+", "1200" → suffix "")
    const suffix   = el.dataset.counterSuffix ?? raw.replace(/[\d,. ]/g, '').trim();
    const target   = parseInt(raw.replace(/\D/g, ''), 10);

    // Skip unreasonable values (years etc.)
    if (isNaN(target) || target > 9999 || target === 0) return;

    const dur = parseInt(el.dataset.counterDuration || '1800', 10);
    const t0  = performance.now();

    function tick(now) {
      const progress = Math.min((now - t0) / dur, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString('vi-VN') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function setupCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    if (!canAnimate) {
      // Respect reduced-motion — just format values, no animation
      counters.forEach(el => {
        const raw    = el.textContent.trim();
        const suffix = el.dataset.counterSuffix ?? raw.replace(/[\d,. ]/g, '').trim();
        const target = parseInt(raw.replace(/\D/g, ''), 10);
        if (!isNaN(target) && target <= 9999) {
          el.textContent = target.toLocaleString('vi-VN') + suffix;
        }
      });
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));

    // Also watch for dynamically added counters (CMS-loaded content)
    const mo = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          const news = node.matches('[data-counter]')
            ? [node]
            : [...node.querySelectorAll('[data-counter]')];
          news.forEach(el => observer.observe(el));
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCounters);
  } else {
    setupCounters();
  }

})();
