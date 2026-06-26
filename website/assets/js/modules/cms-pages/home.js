/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — modules/cms-pages/home.js  v1.0
   Page controller cho trang chủ index.html:
     · Khởi tạo track slider cho sản phẩm Cơ Khí & Nhôm Kính
     · Xử lý tabs lọc dự án nổi bật (Project Filter Tabs)
   Không phụ thuộc thư viện ngoài.
 ════════════════════════════════════════════════════════════════ */

(function initHomePage() {
  'use strict';

  /* ── 1. PRODUCT SLIDER FACTORY (Carousel) ──────────────────── */
  function createSlider(trackId, prevId, nextId, dotsId, options = {}) {
    const track   = document.getElementById(trackId);
    const btnPrev = document.getElementById(prevId);
    const btnNext = document.getElementById(nextId);
    const dotsEl  = document.getElementById(dotsId);
    if (!track) return null;

    const items        = [...track.querySelectorAll('.slider-item')];
    const CARD_WIDTH   = options.cardWidth ?? 300;
    const GAP          = options.gap ?? 20;
    const STEP         = CARD_WIDTH + GAP;
    let   index        = 0;
    let   isDragging   = false;
    let   startX       = 0;
    let   scrollLeft   = 0;

    // Compute visible count based on track container width
    function visibleCount() {
      const w = track.parentElement.offsetWidth;
      return Math.max(1, Math.floor((w + GAP) / STEP));
    }

    // Max index to scroll to
    function maxIndex() {
      return Math.max(0, items.length - visibleCount());
    }

    // Render dot indicators
    function renderDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      const max = maxIndex();
      for (let i = 0; i <= max; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === index ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
      }
    }

    function goTo(i) {
      index = Math.max(0, Math.min(i, maxIndex()));
      track.style.transform = `translateX(-${index * STEP}px)`;
      if (btnPrev) btnPrev.disabled = index === 0;
      if (btnNext) btnNext.disabled = index >= maxIndex();
      // Update dots active class
      dotsEl?.querySelectorAll('.slider-dot').forEach((d, di) => {
        d.classList.toggle('active', di === index);
      });
    }

    btnPrev?.addEventListener('click', () => goTo(index - 1));
    btnNext?.addEventListener('click', () => goTo(index + 1));

    // Pointer events for swipe/drag support on desktop and mobile
    track.addEventListener('pointerdown', e => {
      isDragging = true;
      startX     = e.clientX;
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointermove', e => {
      if (!isDragging) return;
      scrollLeft = e.clientX - startX;
    });

    track.addEventListener('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;
      if (scrollLeft < -50)      goTo(index + 1);
      else if (scrollLeft > 50)  goTo(index - 1);
      scrollLeft = 0;
    });

    // Recalculate on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        goTo(Math.min(index, maxIndex()));
        renderDots();
      }, 200);
    });

    renderDots();
    goTo(0);

    return { goTo, renderDots };
  }

  /* ── 2. PROJECT FILTER TABS ────────────────────────────────── */
  function setupProjectFilters() {
    const filterBtns   = document.querySelectorAll('.sv-filter-tab');
    const projectCards = document.querySelectorAll('#projectsGrid .project-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        
        projectCards.forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ── 3. Initialization ─────────────────────────────────────── */
  function init() {
    createSlider('ckTrack', 'ckPrev', 'ckNext', 'ckDots');
    createSlider('nkTrack', 'nkPrev', 'nkNext', 'nkDots');
    setupProjectFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
