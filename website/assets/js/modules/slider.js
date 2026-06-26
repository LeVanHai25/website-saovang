/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — modules/slider.js  v1.0
   Multi-purpose slider/carousel:
     · Auto-play với configurable interval
     · Touch/swipe gestures (mobile)
     · Dot indicators + prev/next buttons
     · Pause on hover
     · Prefers-reduced-motion aware

   Khởi tạo:
     new SV.Slider(containerEl, options)

   Options:
     autoplay:    true (mặc định)
     interval:    5000 (ms)
     dots:        true
     arrows:      true
     loop:        true

   HTML cấu trúc mong đợi:
     <div class="slider-container" id="mySlider">
       <div class="slider-track">
         <div class="slide">...</div>
         <div class="slide">...</div>
       </div>
       <!-- dots & arrows tự inject -->
     </div>
════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const canAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class Slider {
    constructor(container, options = {}) {
      if (!(container instanceof Element)) return;

      this.container = container;
      this.track     = container.querySelector('.slider-track');
      if (!this.track) return;

      this.slides    = [...this.track.querySelectorAll('.slide')];
      if (this.slides.length < 2) return; // no slider needed

      this.opts = Object.assign({
        autoplay: true,
        interval: 5000,
        dots:     true,
        arrows:   true,
        loop:     true,
      }, options);

      this.current   = 0;
      this.total     = this.slides.length;
      this._timer    = null;
      this._startX   = 0;
      this._dragging = false;

      this._init();
    }

    _init() {
      this.slides[0].classList.add('active');

      if (this.opts.arrows) this._buildArrows();
      if (this.opts.dots)   this._buildDots();

      // Touch
      this.track.addEventListener('touchstart', e => {
        this._startX = e.changedTouches[0].clientX;
      }, { passive: true });
      this.track.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - this._startX;
        if (Math.abs(dx) > 40) this.go(dx < 0 ? 1 : -1);
      }, { passive: true });

      // Pause on hover
      this.container.addEventListener('mouseenter', () => this._pause());
      this.container.addEventListener('mouseleave', () => this._play());

      if (canAnimate && this.opts.autoplay) this._play();
    }

    _buildArrows() {
      const prev = document.createElement('button');
      const next = document.createElement('button');
      prev.className = 'slider-prev slider-arrow';
      next.className = 'slider-next slider-arrow';
      prev.setAttribute('aria-label', 'Slide trước');
      next.setAttribute('aria-label', 'Slide kế tiếp');
      prev.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>`;
      next.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>`;
      prev.addEventListener('click', () => this.go(-1));
      next.addEventListener('click', () => this.go(1));
      this.container.appendChild(prev);
      this.container.appendChild(next);
    }

    _buildDots() {
      const dotWrap = document.createElement('div');
      dotWrap.className = 'slider-dots';
      this.slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = i === 0 ? 'slider-dot active' : 'slider-dot';
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => this.goTo(i));
        dotWrap.appendChild(dot);
      });
      this.container.appendChild(dotWrap);
      this._dots = [...dotWrap.querySelectorAll('.slider-dot')];
    }

    go(dir) {
      let next = this.current + dir;
      if (this.opts.loop) {
        next = ((next % this.total) + this.total) % this.total;
      } else {
        next = Math.max(0, Math.min(next, this.total - 1));
      }
      this.goTo(next);
    }

    goTo(index) {
      if (index === this.current) return;
      this.slides[this.current].classList.remove('active');
      if (this._dots) {
        this._dots[this.current].classList.remove('active');
        this._dots[index].classList.add('active');
      }
      this.current = index;
      this.slides[this.current].classList.add('active');

      // Dispatch event for external listeners
      this.container.dispatchEvent(new CustomEvent('sliderChange', {
        detail: { index: this.current },
        bubbles: true,
      }));
    }

    _play() {
      if (!canAnimate || !this.opts.autoplay) return;
      this._pause();
      this._timer = setInterval(() => this.go(1), this.opts.interval);
    }

    _pause() {
      clearInterval(this._timer);
    }

    destroy() {
      this._pause();
    }
  }

  /* ─── Auto-init sliders with data-slider attribute ─────────── */
  function autoInit() {
    document.querySelectorAll('[data-slider]').forEach(container => {
      if (container._svSlider) return;
      let opts = {};
      try { opts = JSON.parse(container.dataset.slider || '{}'); } catch {}
      container._svSlider = new Slider(container, opts);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  /* ─── Inject base slider CSS ───────────────────────────────── */
  (function injectSliderStyles() {
    if (document.getElementById('svSliderStyles')) return;
    const s = document.createElement('style');
    s.id = 'svSliderStyles';
    s.textContent = `
      .slider-container { position: relative; overflow: hidden; }
      .slider-track { position: relative; }
      .slider-track .slide {
        display: none;
        animation: sliderFadeIn 0.6s ease both;
      }
      .slider-track .slide.active { display: block; }
      @keyframes sliderFadeIn { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:none; } }

      .slider-arrow {
        position: absolute; top: 50%; transform: translateY(-50%);
        background: rgba(255,255,255,0.15); backdrop-filter: blur(4px);
        border: 1px solid rgba(255,255,255,0.2);
        color: #fff; border-radius: 50%;
        width: 44px; height: 44px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; z-index: 5;
        transition: background 0.2s;
      }
      .slider-arrow:hover { background: rgba(255,255,255,0.28); }
      .slider-prev { left: 16px; }
      .slider-next { right: 16px; }

      .slider-dots {
        position: absolute; bottom: 16px; left: 50%;
        transform: translateX(-50%);
        display: flex; gap: 8px; z-index: 5;
      }
      .slider-dot {
        width: 8px; height: 8px; border-radius: 50%;
        background: rgba(255,255,255,0.4);
        border: none; cursor: pointer;
        transition: background 0.2s, transform 0.2s;
      }
      .slider-dot.active {
        background: #C9A227;
        transform: scale(1.3);
      }
    `;
    document.head.appendChild(s);
  })();

  /* ─── Expose API ────────────────────────────────────────────── */
  window.SV = window.SV || {};
  window.SV.Slider = Slider;

})();
