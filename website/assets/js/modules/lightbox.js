/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — modules/lightbox.js  v2.0
   Fullscreen image gallery với:
     · Prev / Next navigation (keyboard + button)
     · Touch/Swipe trên mobile
     · Caption từ data-caption attribute
     · Body scroll lock khi mở
     · Tập hợp ảnh theo [data-lightbox-group]

   Cách dùng:
     <img src="..." data-lightbox="url-to-full.jpg" data-caption="Mô tả">
     <a href="img.jpg" data-lightbox data-lightbox-group="gallery1">

   Không phụ thuộc thư viện ngoài.
════════════════════════════════════════════════════════════════ */

(function initLightbox() {
  'use strict';

  let _overlay = null;
  let _currentGroup = [];
  let _currentIndex = 0;
  let _startX = 0;

  /* ─── Build overlay DOM once ───────────────────────────────── */
  function buildOverlay() {
    if (_overlay) return;

    _overlay = document.createElement('div');
    _overlay.id = 'svLightbox';
    _overlay.setAttribute('role', 'dialog');
    _overlay.setAttribute('aria-modal', 'true');
    _overlay.setAttribute('aria-label', 'Xem ảnh phóng to');
    _overlay.innerHTML = `
      <div class="lb-backdrop"></div>
      <button class="lb-close" aria-label="Đóng">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <button class="lb-prev" aria-label="Ảnh trước">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <div class="lb-stage">
        <img class="lb-img" src="" alt="" draggable="false">
        <div class="lb-caption"></div>
        <div class="lb-counter"></div>
      </div>
      <button class="lb-next" aria-label="Ảnh kế tiếp">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    `;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      #svLightbox {
        position: fixed; inset: 0; z-index: 10000;
        display: flex; align-items: center; justify-content: center;
        opacity: 0; pointer-events: none;
        transition: opacity 0.25s ease;
      }
      #svLightbox.open { opacity: 1; pointer-events: all; }
      .lb-backdrop {
        position: absolute; inset: 0;
        background: rgba(0,0,0,0.94);
        cursor: zoom-out;
      }
      .lb-stage {
        position: relative; z-index: 1;
        display: flex; flex-direction: column; align-items: center;
        max-width: 92vw; max-height: 92vh;
      }
      .lb-img {
        max-width: 92vw; max-height: 80vh;
        object-fit: contain;
        border-radius: 4px;
        box-shadow: 0 8px 60px rgba(0,0,0,0.6);
        transition: opacity 0.18s ease, transform 0.18s ease;
        user-select: none;
      }
      .lb-img.fading { opacity: 0; transform: scale(0.97); }
      .lb-caption {
        margin-top: 14px;
        color: rgba(255,255,255,0.75);
        font-size: 14px;
        text-align: center;
        max-width: 600px;
        line-height: 1.5;
        min-height: 1em;
      }
      .lb-counter {
        color: rgba(255,255,255,0.4);
        font-size: 12px;
        margin-top: 6px;
        letter-spacing: 0.05em;
      }
      .lb-close {
        position: fixed; top: 20px; right: 20px; z-index: 2;
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.15);
        color: #fff; border-radius: 50%;
        width: 46px; height: 46px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        transition: background 0.2s;
      }
      .lb-close:hover { background: rgba(255,255,255,0.22); }
      .lb-prev, .lb-next {
        position: fixed; top: 50%; transform: translateY(-50%);
        z-index: 2;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.15);
        color: #fff; border-radius: 50%;
        width: 50px; height: 50px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        transition: background 0.2s, opacity 0.2s;
      }
      .lb-prev { left: 20px; }
      .lb-next { right: 20px; }
      .lb-prev:hover, .lb-next:hover { background: rgba(255,255,255,0.22); }
      .lb-prev[disabled], .lb-next[disabled] { opacity: 0.2; pointer-events: none; }
      @media (max-width: 640px) {
        .lb-prev { left: 8px; }
        .lb-next { right: 8px; }
        .lb-prev, .lb-next { width: 40px; height: 40px; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(_overlay);

    // Events
    _overlay.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
    _overlay.querySelector('.lb-close').addEventListener('click', closeLightbox);
    _overlay.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
    _overlay.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); navigate(1); });

    // Touch swipe
    _overlay.addEventListener('touchstart', e => { _startX = e.changedTouches[0].clientX; }, { passive: true });
    _overlay.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - _startX;
      if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ─── Open lightbox ────────────────────────────────────────── */
  function openLightbox(src, caption, group, index) {
    buildOverlay();
    _currentGroup = group;
    _currentIndex = index;
    showImage(src, caption, false);
    _overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus trap
    _overlay.querySelector('.lb-close').focus();
  }

  /* ─── Show image (with optional fade) ─────────────────────── */
  function showImage(src, caption, fade = true) {
    const img     = _overlay.querySelector('.lb-img');
    const capEl   = _overlay.querySelector('.lb-caption');
    const countEl = _overlay.querySelector('.lb-counter');
    const prevBtn = _overlay.querySelector('.lb-prev');
    const nextBtn = _overlay.querySelector('.lb-next');

    const total = _currentGroup.length;
    prevBtn.disabled = _currentIndex <= 0;
    nextBtn.disabled = _currentIndex >= total - 1;
    prevBtn.style.display = total > 1 ? '' : 'none';
    nextBtn.style.display = total > 1 ? '' : 'none';
    countEl.textContent = total > 1 ? `${_currentIndex + 1} / ${total}` : '';
    capEl.textContent   = caption || '';

    if (fade) {
      img.classList.add('fading');
      setTimeout(() => {
        img.src = src;
        img.onload = () => img.classList.remove('fading');
      }, 180);
    } else {
      img.src = src;
      img.classList.remove('fading');
    }
  }

  /* ─── Navigate ─────────────────────────────────────────────── */
  function navigate(dir) {
    const next = _currentIndex + dir;
    if (next < 0 || next >= _currentGroup.length) return;
    _currentIndex = next;
    const item = _currentGroup[_currentIndex];
    showImage(item.src, item.caption, true);
  }

  /* ─── Close ────────────────────────────────────────────────── */
  function closeLightbox() {
    if (!_overlay) return;
    _overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ─── Keyboard ─────────────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (!_overlay?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  /* ─── Gather group items & open ────────────────────────────── */
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-lightbox]');
    if (!trigger) return;
    e.preventDefault();

    const src     = trigger.dataset.lightbox || trigger.src || trigger.href || trigger.querySelector('img')?.src;
    const caption = trigger.dataset.caption || trigger.querySelector('img')?.alt || '';
    const groupId = trigger.dataset.lightboxGroup;

    let group = [{ src, caption }];
    let index = 0;

    if (groupId) {
      const all = [...document.querySelectorAll(`[data-lightbox-group="${groupId}"]`)];
      group = all.map(el => ({
        src:     el.dataset.lightbox || el.src || el.href || el.querySelector('img')?.src,
        caption: el.dataset.caption  || el.querySelector('img')?.alt || '',
      }));
      index = all.indexOf(trigger);
      if (index < 0) index = 0;
    }

    openLightbox(src, caption, group, index);
  });

  /* ─── Expose API ────────────────────────────────────────────── */
  window.SV = window.SV || {};
  window.SV.lightbox = { open: openLightbox, close: closeLightbox, navigate };

})();
