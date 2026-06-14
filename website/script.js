/* ─── JAVASCRIPT — SAO VÀNG WEBSITE ─────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Header scroll behavior ─────────────────────────────── */
  const header = document.getElementById('header');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastY = y;
  }, { passive: true });


  /* ── Active nav link on scroll ──────────────────────────── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const activateNav = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 80) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', activateNav, { passive: true });


  /* ── Mobile hamburger ───────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      nav?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ── Smooth scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-h')) || 68;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ── Scroll reveal animation ────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal, .service-card, .why-card, .product-card, .project-card, .news-card, .stat-item, .about-features, .contact-item, .feature-item');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keep visible once shown
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  reveals.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.6s ease ${(i % 6) * 0.08}s, transform 0.6s ease ${(i % 6) * 0.08}s`;
    revealObserver.observe(el);
  });

  // Add visible class handler
  const style = document.createElement('style');
  style.textContent = `
    .service-card.visible, .why-card.visible, .product-card.visible,
    .project-card.visible, .news-card.visible, .stat-item.visible,
    .about-features.visible, .contact-item.visible, .feature-item.visible,
    .reveal.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  reveals.forEach(el => revealObserver.observe(el));


  /* ── KPI counter animation (hero stats) ─────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const isSpecial = raw.includes('/'); // 24/7

      if (isSpecial) return; // skip 24/7

      const suffix = raw.replace(/[0-9]/g, ''); // '+', '' etc.
      const target  = parseInt(raw.replace(/\D/g, ''));
      if (isNaN(target)) return;

      const duration = 1800;
      const start    = performance.now();

      const tick = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current  = Math.round(ease * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));


  /* ── Contact form ───────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '✓ ĐÃ GỬI THÀNH CÔNG — CHÚNG TÔI SẼ LIÊN HỆ NGAY!';
    btn.style.background = '#2d7a2d';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });


  /* ── Scroll down indicator ──────────────────────────────── */
  const scrollDown = document.querySelector('.scroll-down');
  scrollDown?.addEventListener('click', () => {
    const about = document.getElementById('about');
    about?.scrollIntoView({ behavior: 'smooth' });
  });

});
