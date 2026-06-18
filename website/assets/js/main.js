/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — Shared JavaScript v3.0
   Responsive-aware · Accessible · Progressive Enhancement
════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Skip Link (inject if missing) ─────────────────────────── */
  if (!document.querySelector('.skip-link')) {
    const skip = document.createElement('a');
    skip.href      = '#main-content';
    skip.className = 'skip-link';
    skip.textContent = 'Bỏ qua điều hướng';
    document.body.insertBefore(skip, document.body.firstChild);
  }
  // Tag main content area if not already tagged
  const mainEl = document.querySelector('main, section, .hero, .page-hero, [id="about"]');
  if (mainEl && !mainEl.id) mainEl.id = 'main-content';

  /* ── Header scroll ──────────────────────────────────────────── */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // apply on load
  }

  /* ── Mobile Navigation Drawer ───────────────────────────────── */
  const hamburger   = document.querySelector('.hamburger');
  const nav         = document.querySelector('.nav');
  const backdrop    = document.querySelector('.nav-backdrop');

  function openNav() {
    if (!nav) return;
    nav.classList.add('open');
    hamburger?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (backdrop) {
      backdrop.style.display = 'block';
      requestAnimationFrame(() => backdrop.classList.add('open'));
    }
  }

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (backdrop) {
      backdrop.classList.remove('open');
      setTimeout(() => { if (!backdrop.classList.contains('open')) backdrop.style.display = ''; }, 300);
    }
  }

  if (hamburger) {
    hamburger.setAttribute('aria-label', 'Mở menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'navMenu');
    hamburger.addEventListener('click', () => {
      nav?.classList.contains('open') ? closeNav() : openNav();
    });
  }

  if (nav) {
    nav.id = 'navMenu';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Menu chính');
    // Close on link click
    nav.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', closeNav);
    });
    // Trap Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
    });
  }

  // Close on backdrop click
  if (backdrop) {
    backdrop.addEventListener('click', closeNav);
  }

  // Reset nav on resize to desktop (avoid stuck drawer)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024) {
        closeNav();
      }
    }, 150);
  }, { passive: true });

  /* ── Active nav item ────────────────────────────────────────── */
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const hrefFile = href.split('/').pop().split('?')[0];
    const isHome = (currentFile === '' || currentFile === 'index.html');
    const linkIsHome = (hrefFile === 'index.html' || hrefFile === '');
    if (isHome && linkIsHome) {
      link.classList.add('active');
    } else if (!isHome && !linkIsHome && currentFile.startsWith(hrefFile.replace('.html', ''))) {
      link.classList.add('active');
    }
  });

  /* ── Filter Tabs ────────────────────────────────────────────── */
  document.querySelectorAll('.filter-bar').forEach(bar => {
    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat   = btn.dataset.filter;
        const items = document.querySelectorAll('[data-cat]');
        items.forEach(item => {
          const match = cat === 'all' || item.dataset.cat === cat;
          item.hidden = !match;
          if (match) {
            item.style.animation = 'none';
            void item.offsetHeight; // force reflow
            item.style.animation = 'fadeInUp 0.4s ease both';
          }
        });
      });
    });
  });

  /* ── Scroll Reveal (IntersectionObserver) ───────────────────── */
  const canReveal = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canReveal) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = Number(entry.target.dataset.revealDelay || 0);
          setTimeout(() => entry.target.classList.add('revealed'), delay * 100);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    // Watch for dynamically added elements (like projects, products, articles loaded via AJAX)
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches('[data-reveal]')) revealObserver.observe(node);
            node.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
          }
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  } else {
    // Skip animation for reduced motion
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));

    // Automatically reveal any new dynamic elements
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches('[data-reveal]')) node.classList.add('revealed');
            node.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
          }
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  /* ── Counter Animation ──────────────────────────────────────── */
  if (canReveal) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const raw = el.textContent.trim();
        if (raw.includes('/')) return; // skip "24/7"
        const suffix = raw.replace(/[\d,]/g, '').trim();
        const target = parseInt(raw.replace(/\D/g, ''), 10);
        if (isNaN(target) || target > 9999) return; // skip years like "2017"
        const dur = 1800;
        const t0  = performance.now();
        const tick = now => {
          const p = Math.min((now - t0) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3); // ease-out-cubic
          el.textContent = Math.round(e * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));
  }

  /* ── Contact Form ───────────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      const origBg = btn.style.background;
      btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Đã gửi — Chúng tôi sẽ liên hệ ngay!`;
      btn.style.background = '#2a7a2a';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML    = orig;
        btn.style.background = origBg;
        btn.disabled     = false;
        form.reset();
      }, 4500);
    });
  }

  /* ── Smooth Anchor Scroll ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return; // skip empty anchors (Zalo etc.)
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const h = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 70;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - h - 8,
          behavior: 'smooth',
        });
      }
    });
  });

  /* ── Thumbnail Preview (content editor helper) ──────────────── */
  const thumbInput   = document.getElementById('ceThumbnail');
  const thumbPreview = document.getElementById('thumbPreview');
  if (thumbInput && thumbPreview) {
    thumbInput.addEventListener('input', () => {
      const val = thumbInput.value.trim();
      const img = thumbPreview.querySelector('img');
      if (val && img) { img.src = val; thumbPreview.style.display = ''; }
      else { thumbPreview.style.display = 'none'; }
    });
  }

  /* ── Lightbox (project / product galleries) ─────────────────── */
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-lightbox]');
    if (!trigger) return;
    e.preventDefault();
    const src = trigger.dataset.lightbox || trigger.src || trigger.href;
    if (!src) return;
    const lb = document.createElement('div');
    lb.id = 'lbOverlay';
    lb.style.cssText = `
      position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);
      display:flex;align-items:center;justify-content:center;padding:24px;cursor:zoom-out;
    `;
    lb.innerHTML = `
      <img src="${src}" style="max-width:100%;max-height:90vh;object-fit:contain;border-radius:4px;box-shadow:0 8px 60px rgba(0,0,0,0.6);" alt="Lightbox" />
      <button style="position:absolute;top:20px;right:20px;background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:50%;width:44px;height:44px;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;" aria-label="Đóng">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    document.body.appendChild(lb);
    document.body.style.overflow = 'hidden';
    const closeLb = () => {
      lb.remove();
      document.body.style.overflow = '';
    };
    lb.addEventListener('click', closeLb);
    lb.querySelector('button').addEventListener('click', e => { e.stopPropagation(); closeLb(); });
    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape') { closeLb(); document.removeEventListener('keydown', onEsc); }
    });
  });

  /* ── Animation Keyframes (injected once) ────────────────────── */
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    [data-reveal-delay="1"] { transition-delay: 0.08s; }
    [data-reveal-delay="2"] { transition-delay: 0.16s; }
    [data-reveal-delay="3"] { transition-delay: 0.24s; }
    [data-reveal-delay="4"] { transition-delay: 0.32s; }
    [data-reveal-delay="5"] { transition-delay: 0.40s; }
  `;
  document.head.appendChild(styleSheet);

  /* ── Sticky Mobile CTA bar (ALL pages) ─────────────────────── */
  // Supports both id="heroCtaBar" (homepage) and id="stickyCtaBar" (inner pages)
  const ctaBarEl = document.getElementById('stickyCtaBar') || document.getElementById('heroCtaBar');
  if (ctaBarEl) {
    const heroSection = document.querySelector('.hero');

    if (heroSection) {
      // Homepage: hide while hero visible, show after scroll
      const heroObserver = new IntersectionObserver(entries => {
        ctaBarEl.style.transform = entries[0].isIntersecting ? 'translateY(100%)' : 'translateY(0)';
      }, { threshold: 0.05 });
      heroObserver.observe(heroSection);
    } else {
      // Inner pages: show after scrolling 200px from top
      let ctaVisible = false;
      const onCtaScroll = () => {
        const shouldShow = window.scrollY > 200;
        if (shouldShow !== ctaVisible) {
          ctaBarEl.style.transform = shouldShow ? 'translateY(0)' : 'translateY(100%)';
          ctaVisible = shouldShow;
        }
      };
      window.addEventListener('scroll', onCtaScroll, { passive: true });
      onCtaScroll(); // run once on load
    }
  }

  /* ── Product / Project Gallery Thumbnail Switcher ───────────── */
  document.querySelectorAll('.prod-thumbs, .proj-thumbs').forEach(thumbsEl => {
    const mainImg = thumbsEl.closest('.prod-gallery, .proj-gallery')?.querySelector('.prod-main-img img, .proj-main-img img');
    if (!mainImg) return;
    thumbsEl.querySelectorAll('.prod-thumb, .proj-thumb').forEach((thumb, i) => {
      if (i === 0) thumb.classList.add('active');
      thumb.addEventListener('click', () => {
        const src = thumb.querySelector('img')?.src;
        if (src) mainImg.src = src;
        thumbsEl.querySelectorAll('.prod-thumb, .proj-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  });

  /* ── Tab System (product/project detail) ────────────────────── */
  document.querySelectorAll('.detail-tabs').forEach(tabBar => {
    const tabs     = tabBar.querySelectorAll('.detail-tab');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        contents.forEach(c => {
          c.classList.toggle('active', c.dataset.tabContent === target);
        });
      });
    });
    // Activate first tab by default
    if (tabs.length && !tabBar.querySelector('.detail-tab.active')) {
      tabs[0].click();
    }
  });

  /* ── Filter bar scroll-into-view on mobile ──────────────────── */
  document.querySelectorAll('.filter-bar .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Smooth scroll active button into view on mobile
      if (window.innerWidth < 640) {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  });

  /* ── Auto-close sticky CTA when form is visible ─────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm && ctaBarEl) {
    const formObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) ctaBarEl.style.transform = 'translateY(100%)';
    }, { threshold: 0.3 });
    formObserver.observe(contactForm);
  }

  /* ── Dynamic Branding Settings Synchronization ───────────────── */
  const loadBrandingSettings = () => {
    fetch('/api/public/settings')
      .then(res => res.json())
      .then(settings => {
        if (!settings) return;

        // 1. Update site phone numbers
        const phone = settings.site_phone;
        if (phone) {
          const rawPhone = phone.replace(/\D/g, '');
          document.querySelectorAll('a[href^="tel:"]').forEach(el => {
            el.href = `tel:${rawPhone}`;
            
            // Do not append text to floating circle buttons
            if (el.classList.contains('float-phone') || el.closest('.floats')) {
              const svg = el.querySelector('svg');
              el.textContent = '';
              if (svg) el.appendChild(svg);
              return;
            }
            
            // Do not alter text in sticky CTA bars
            if (el.closest('.sticky-cta-bar') || el.closest('.hero-cta-bar')) {
              return;
            }
            
            // Update standard hotline links (header, footer, etc.) while preserving prefix text
            let textNodesContent = '';
            el.childNodes.forEach(node => {
              if (node.nodeType === Node.TEXT_NODE) {
                textNodesContent += node.textContent;
              }
            });
            textNodesContent = textNodesContent.trim();
            const digitIndex = textNodesContent.search(/\d/);
            let prefix = '';
            if (digitIndex > 0) {
              prefix = textNodesContent.substring(0, digitIndex);
            } else if (digitIndex === 0) {
              prefix = ' ';
            } else if (textNodesContent) {
              prefix = textNodesContent + ' ';
            } else {
              prefix = ' ';
            }
            
            const svg = el.querySelector('svg');
            el.textContent = '';
            if (svg) el.appendChild(svg);
            el.appendChild(document.createTextNode(prefix + phone));
          });
        }

        // 2. Update logos (both header and footer)
        const siteLogo = settings.site_logo;
        const logoBadge = settings.logo_badge || 'SV';
        const companyShort = settings.company_short || 'Cơ Khí Sao Vàng';

        document.querySelectorAll('.logo').forEach(logoEl => {
          if (siteLogo) {
            const existingImg = logoEl.querySelector('img.dynamic-logo');
            if (existingImg) {
              existingImg.src = siteLogo;
              existingImg.alt = companyShort;
            } else {
              logoEl.innerHTML = `<img src="${siteLogo}" alt="${companyShort}" class="dynamic-logo" style="height:38px; object-fit:contain; max-width:180px;" />`;
            }
          } else {
            let badgeEl = logoEl.querySelector('.logo-badge');
            let nameEl = logoEl.querySelector('.logo-name');
            if (!badgeEl || !nameEl) {
              logoEl.innerHTML = `<span class="logo-badge" aria-hidden="true">${logoBadge}</span><span class="logo-name">${companyShort}</span>`;
            } else {
              badgeEl.textContent = logoBadge;
              nameEl.textContent = companyShort;
            }
          }
        });

        // 3. Update footer description
        const companyFull = settings.company_full;
        if (companyFull) {
          const footerDesc = document.querySelector('.footer-brand p, #footerDesc');
          if (footerDesc) {
            const text = footerDesc.textContent;
            if (text.includes('—')) {
              const parts = text.split('—');
              footerDesc.textContent = `${companyFull} —${parts.slice(1).join('—')}`;
            } else {
              footerDesc.textContent = companyFull;
            }
          }
        }
      })
      .catch(err => console.warn('Failed to sync branding settings:', err));
  };

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBrandingSettings);
  } else {
    loadBrandingSettings();
  }

})();

