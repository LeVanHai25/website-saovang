/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — modules/cms-pages/products.js  v1.0
   Controller cho trang Sản Phẩm (san-pham.html).
   Phụ thuộc: cms-client.js (window.CMS)
════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── State ─────────────────────────────────────────────────── */
  let _filter = 'all';
  let _page   = 1;
  let _sort   = 'sort_order';

  /* ─── Category classification ───────────────────────────────── */
  // Slug prefixes for each high-level group
  const GROUP_NHOM = [
    'cua-nhom-xingfa', 'cua-nhom-xingfa-class-a', 'cua-truot-quay',
    'cua-nhom-slim', 'cua-nhom-thuy-luc', 'cua-luoi-chong-muoi',
    'cua-nhom-kogen', 'cua-nhom-pma', 'cua-nhom-yongxing',
    'cua-nhom-owin', 'cua-nhom-topal', 'cua-nhom-kenwin',
    'cua-nhom-tam-to-ong', 'cua-tu-dong', 'cua-nhom-dinh-hinh',
  ];
  const GROUP_KINH = ['kinh-cuong-luc'];
  const GROUP_COKHI = [
    'co-khi', 'sat', 'inox', 'sat-my-thuat', 'inox-phu-kien',
    'sat-my-thuat-che-tac', 'inox-phu-kien-du-thuyen',
  ];

  function catGroup(slug) {
    const s = (slug || '').toLowerCase();
    if (GROUP_NHOM.some(k  => s === k || s.startsWith(k)))   return 'nhom';
    if (GROUP_KINH.some(k  => s === k || s.startsWith(k)))   return 'kinh';
    if (GROUP_COKHI.some(k => s === k || s.startsWith(k)))   return 'cokhi';
    return 'other';
  }

  /* ─── Apply branding ────────────────────────────────────────── */
  function applySettings(s) {
    const setEl = (id, val) => { const e = document.getElementById(id); if (e && val) e.textContent = val; };
    setEl('logoBadge',       s.logo_badge);
    setEl('footerLogoBadge', s.logo_badge);
    setEl('logoName',        s.company_short);
    setEl('footerLogoName',  s.company_short);
    setEl('footerPhone',     s.site_phone);
    setEl('footerEmail',     s.site_email);
    if (s.company_full || s.site_name) {
      setEl('footerDesc', (s.company_full || '') + ' — Chuyên thiết kế & thi công cơ khí cao cấp.');
      setEl('footerCopyright', `© ${new Date().getFullYear()} ${s.company_full || s.site_name}. Bảo lưu mọi quyền.`);
    }
  }

  /* ─── Render filter bar ─────────────────────────────────────── */
  function renderFilterBar(cats) {
    const bar = document.getElementById('filterBar');
    if (!bar) return;

    const nhom  = cats.filter(c => catGroup(c.slug) === 'nhom');
    const kinh  = cats.filter(c => catGroup(c.slug) === 'kinh');
    const cokhi = cats.filter(c => catGroup(c.slug) === 'cokhi');

    const btnHtml = (c) =>
      `<button class="filter-btn ${_filter === c.slug ? 'active' : ''}" data-filter="${c.slug}" style="--cat-color:${c.color || '#C8A96A'}">${CMS.esc(c.name)}</button>`;

    // SVG icons
    const iconTool   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`;
    const iconWindow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`;
    const iconGlass  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 19 22 19"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>`;

    let html = `<button class="filter-btn ${_filter === 'all' ? 'active' : ''}" data-filter="all">Tất cả</button>`;

    if (cokhi.length) {
      html += `<span class="filter-divider"></span>
      <span class="filter-group-label">${iconTool} Cơ Khí</span>` + cokhi.map(btnHtml).join('');
    }

    if (kinh.length) {
      html += `<span class="filter-divider"></span>
      <span class="filter-group-label">${iconGlass} Kính Cường Lực</span>` + kinh.map(btnHtml).join('');
    }

    if (nhom.length) {
      html += `<span class="filter-divider"></span>
      <span class="filter-group-label">${iconWindow} Cửa Nhôm Kính</span>` + nhom.map(btnHtml).join('');
    }

    bar.innerHTML = html;

    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _filter = btn.dataset.filter;
        _page   = 1;
        await loadProducts();
      });
    });
  }

  /* ─── Product card HTML ─────────────────────────────────────── */
  function cardHTML(p) {
    const img      = p.thumbnail ? CMS.imgUrl(p.thumbnail) : 'assets/images/product-inox.png';
    const price    = p.price ? p.price : 'Liên hệ';
    const unit     = p.unit  ? ` / ${p.unit}` : '';
    const brand    = p.brand || p.category || 'SAO VÀNG';

    return `<a href="san-pham-chi-tiet.html?slug=${p.slug || p.id}" class="prod-card" data-reveal>
      <div class="prod-thumb">
        <img src="${CMS.esc(img)}" alt="${CMS.esc(p.title)}" loading="lazy" onerror="this.src='assets/images/product-inox.png'" />
        <div class="prod-badge-wrap">
          <span style="background:rgba(0,0,0,.75);color:#fff;font-size:9px;padding:3px 8px;border-radius:10px">${CMS.esc(p.category || '')}</span>
        </div>
      </div>
      <div class="prod-body">
        <span class="prod-cat">${CMS.esc(brand)}</span>
        <h3 class="prod-name">${CMS.esc(p.title)}</h3>
        <p class="prod-desc">${CMS.esc((p.excerpt || '').slice(0, 90))}${(p.excerpt || '').length > 90 ? '...' : ''}</p>
        <div class="prod-meta">
          <span class="prod-price">${price}${unit}</span>
          <span class="prod-action">
            Xem chi tiết
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </span>
        </div>
      </div>
    </a>`;
  }

  /* ─── Load products ─────────────────────────────────────────── */
  async function loadProducts() {
    const grid  = document.getElementById('productsGrid');
    const count = document.getElementById('productCount');
    if (!grid) return;

    grid.innerHTML = Array(8).fill('<div class="prod-skeleton"></div>').join('');

    const { data, total, pages } = await CMS.getProducts({
      category: _filter === 'all' ? '' : _filter,
      page: _page, limit: 12, sort: _sort,
    });

    if (count) count.textContent = `Hiển thị ${data.length} trong ${total} sản phẩm`;

    if (!data.length) {
      grid.innerHTML = `<div class="cms-empty-grid">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#ccc" stroke-width="1.5" style="margin-bottom:12px"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
        <h3 style="margin-bottom:8px;color:var(--gray-500)">Chưa có sản phẩm nào</h3>
        <p>Sản phẩm sẽ được cập nhật sớm</p>
      </div>`;
      const pg = document.getElementById('productPagination');
      if (pg) pg.innerHTML = '';
      return;
    }

    grid.innerHTML = data.map(p => cardHTML(p)).join('');
    grid.querySelectorAll('.prod-card').forEach((el, i) => { el.style.transitionDelay = (i * 0.05) + 's'; });
    renderPagination(pages);
  }

  /* ─── Pagination ────────────────────────────────────────────── */
  function renderPagination(pages) {
    const el = document.getElementById('productPagination');
    if (!el) return;
    if (pages <= 1) { el.innerHTML = ''; return; }
    el.innerHTML = Array.from({ length: pages }, (_, i) => i + 1).map(p =>
      `<button class="page-btn ${p === _page ? 'active' : ''}" onclick="SV.Products.gotoPage(${p})">${p}</button>`
    ).join('');
  }

  async function gotoPage(p) {
    _page = p;
    await loadProducts();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  function onSortChange() {
    const sel = document.getElementById('sortSelect');
    if (sel) _sort = sel.value;
    _page = 1;
    loadProducts();
  }

  /* ─── Init ──────────────────────────────────────────────────── */
  async function init() {
    const [settings, cats] = await Promise.all([CMS.getSettings(), CMS.getCategories('product')]);
    applySettings(settings);
    renderFilterBar(cats);

    const footerList = document.getElementById('footerCatList');
    if (footerList && cats.length) {
      footerList.innerHTML = cats.map(c => `<li><a href="san-pham.html?cat=${c.slug}">${c.name}</a></li>`).join('');
    }

    const catParam = new URLSearchParams(window.location.search).get('cat');
    if (catParam) {
      _filter = catParam;
      document.querySelectorAll('#filterBar .filter-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.filter === catParam));
    }

    await loadProducts();

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.addEventListener('change', onSortChange);
  }

  document.addEventListener('DOMContentLoaded', init);

  /* ─── Expose ────────────────────────────────────────────────── */
  window.SV = window.SV || {};
  window.SV.Products = { gotoPage, onSortChange };

  // Legacy global compat
  window.gotoPage     = gotoPage;
  window.onSortChange = onSortChange;

})();
