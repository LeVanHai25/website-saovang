/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — modules/navbar.js  v1.0
   Tập trung hoá toàn bộ logic navbar v2:
     · Scroll class .scrolled trên #navbar
     · Hamburger (#hamburger) ↔ Drawer (#navDrawer) + backdrop (#navBackdrop)
     · Scroll-to-top button (#scrollTopBtn)
     · Escape key trap
     · Reset khi resize về desktop
   Không phụ thuộc thư viện ngoài.
════════════════════════════════════════════════════════════════ */

(function initNavbar() {
  'use strict';

  /* ─── 1. Navbar scroll ─────────────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  if (navbar) {
    const onScroll = () => {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 60);
      if (scrollTopBtn) scrollTopBtn.classList.toggle('show', y > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // apply immediately on load
  }

  /* ─── 2. Scroll-to-top button ──────────────────────────────── */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── 3. Hamburger / Drawer / Backdrop ────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('navDrawer');
  const backdrop  = document.getElementById('navBackdrop');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    hamburger?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (backdrop) {
      backdrop.style.display = 'block';
      requestAnimationFrame(() => backdrop.classList.add('open'));
    }
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (backdrop) {
      backdrop.classList.remove('open');
      setTimeout(() => {
        if (!backdrop.classList.contains('open')) backdrop.style.display = '';
      }, 320);
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      drawer?.classList.contains('open') ? closeDrawer() : openDrawer();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  // Close on any drawer link click
  if (drawer) {
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // Escape key closes drawer
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) closeDrawer();
  });

  // Reset on resize to desktop
  let _resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024) closeDrawer();
    }, 150);
  }, { passive: true });

  /* ─── 4. Desktop dropdown hover / focus ───────────────────── */
  document.querySelectorAll('.nav-dropdown-wrap').forEach(wrap => {
    const menu = wrap.querySelector('.nav-dropdown-menu');
    if (!menu) return;

    // Keyboard accessibility: open on focus within
    wrap.addEventListener('focusin', () => wrap.classList.add('focus'));
    wrap.addEventListener('focusout', e => {
      if (!wrap.contains(e.relatedTarget)) wrap.classList.remove('focus');
    });
  });

  /* ─── 5. Sticky CTA bar (inner pages) ─────────────────────── */
  const ctaBar = document.getElementById('stickyCtaBar') || document.getElementById('heroCtaBar');
  if (ctaBar) {
    const heroSection = document.querySelector('.hero, .page-hero');
    if (heroSection) {
      const heroObs = new IntersectionObserver(entries => {
        ctaBar.style.transform = entries[0].isIntersecting ? 'translateY(100%)' : 'translateY(0)';
      }, { threshold: 0.05 });
      heroObs.observe(heroSection);
    } else {
      let _ctaVisible = false;
      const onCtaScroll = () => {
        const show = window.scrollY > 200;
        if (show !== _ctaVisible) {
          ctaBar.style.transform = show ? 'translateY(0)' : 'translateY(100%)';
          _ctaVisible = show;
        }
      };
      window.addEventListener('scroll', onCtaScroll, { passive: true });
      onCtaScroll();
    }

    // Auto-hide when contact form is visible
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      const formObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) ctaBar.style.transform = 'translateY(100%)';
      }, { threshold: 0.3 });
      formObs.observe(contactForm);
    }
  }

  /* ─── 6. Scroll Reveal (v2 data-sv-reveal) ────────────────── */
  const canAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setupScrollReveal() {
    const reveals = document.querySelectorAll('[data-sv-reveal]');
    if (!reveals.length) return;

    if (!canAnimate) {
      reveals.forEach(el => el.classList.add('sv-revealed'));
      return;
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const delay = Number(e.target.dataset.svDelay || 0);
            if (delay > 0) {
              setTimeout(() => e.target.classList.add('sv-revealed'), delay * 100);
            } else {
              e.target.classList.add('sv-revealed');
            }
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(el => io.observe(el));
    } else {
      reveals.forEach(el => el.classList.add('sv-revealed'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupScrollReveal);
  } else {
    setupScrollReveal();
  }

  /* ─── 7. Expose for pages that need manual trigger ────────── */
  window.SV = window.SV || {};
  window.SV.openDrawer  = openDrawer;
  window.SV.closeDrawer = closeDrawer;
  window.SV.setupScrollReveal = setupScrollReveal;

})();

