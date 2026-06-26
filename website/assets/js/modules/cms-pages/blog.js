/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — modules/cms-pages/blog.js  v1.0
   Controller cho trang Tin Tức (tin-tuc.html).
   Phụ thuộc: cms-client.js (window.CMS)
════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── State ─────────────────────────────────────────────────── */
  let _filter = 'all';
  let _page   = 1;
  let _order  = 'desc';

  /* ─── Apply branding ────────────────────────────────────────── */
  function applyBranding(s) {
    const setEl = (id, val) => { const e = document.getElementById(id); if (e && val) e.textContent = val; };
    setEl('logoBadge',   s.logo_badge);
    setEl('footerBadge', s.logo_badge);
    setEl('logoName',    s.company_short);
    setEl('footerName',  s.company_short);
    setEl('footerPhone', s.site_phone);
    if (s.company_full) {
      setEl('footerDesc', s.company_full);
      setEl('footerCopy', `© ${new Date().getFullYear()} ${s.company_full}.`);
    }
  }

  /* ─── Render filter bar ─────────────────────────────────────── */
  function renderFilterBar(cats) {
    const bar = document.getElementById('filterBar');
    if (!bar) return;

    bar.innerHTML =
      `<button class="filter-btn active" data-filter="all">Tất cả</button>` +
      cats.map(c =>
        `<button class="filter-btn" data-filter="${c.slug}" style="--cat-color:${c.color || '#C8A96A'}">${CMS.esc(c.name)}</button>`
      ).join('');

    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _filter = btn.dataset.filter;
        _page   = 1;
        await loadArticles();
      });
    });
  }

  /* ─── Sidebar categories ────────────────────────────────────── */
  function renderSidebarCats(cats) {
    const el = document.getElementById('catWidget');
    if (el) {
      if (!cats.length) {
        el.innerHTML = '<p style="font-size:13px;color:var(--gray-400)">Chưa có danh mục</p>';
      } else {
        el.innerHTML = `<div class="category-list">` +
          cats.map(c => `
            <div class="cat-item" onclick="window.location.href='tin-tuc.html?cat=${c.slug}'">
              <span>${CMS.esc(c.name)}</span>
              <span class="cat-count">${c.count || ''}</span>
            </div>`).join('') +
          `</div>`;
      }
    }

    const footer = document.getElementById('footerCats');
    if (footer) {
      footer.innerHTML =
        `<li><a href="tin-tuc.html">Tất cả bài viết</a></li>` +
        cats.map(c => `<li><a href="tin-tuc.html?cat=${c.slug}">${CMS.esc(c.name)}</a></li>`).join('');
    }
  }

  /* ─── Blog card HTML ────────────────────────────────────────── */
  function blogCardHTML(a, featured) {
    const img  = a.thumbnail ? CMS.imgUrl(a.thumbnail) : 'assets/images/hero-interior.png';
    const date = CMS.formatDate(a.published_at);
    const cls  = featured ? 'article-card featured' : 'article-card';

    return `<a href="tin-tuc-chi-tiet.html?slug=${a.slug || a.id}" class="${cls}" data-reveal>
      <div class="article-thumb">
        <img src="${CMS.esc(img)}" alt="${CMS.esc(a.title)}" loading="lazy" onerror="this.src='assets/images/hero-interior.png'" />
      </div>
      <div class="article-body">
        <div class="article-meta">
          <span class="article-cat">${CMS.esc(a.category || 'Bài viết')}</span>
          <span class="article-date">${date}</span>
        </div>
        <h2 class="article-title">${CMS.esc(a.title)}</h2>
        <p class="article-excerpt">${CMS.esc((a.excerpt || '').slice(0, 120))}${(a.excerpt || '').length > 120 ? '...' : ''}</p>
        <span class="article-link">
          Đọc tiếp
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </span>
      </div>
    </a>`;
  }

  /* ─── Load articles ─────────────────────────────────────────── */
  async function loadArticles() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    grid.innerHTML = Array(4).fill('<div class="blog-skeleton"></div>').join('');

    const { data, total, pages } = await CMS.getArticles({
      category: _filter === 'all' ? '' : _filter,
      page: _page, limit: 8, order: _order,
    });

    const countEl = document.getElementById('articleCount');
    if (countEl) countEl.textContent = `Hiển thị ${data.length} trong ${total} bài viết`;

    if (!data.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--gray-400)">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#ccc" stroke-width="1.5" style="margin-bottom:12px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <h3 style="margin-bottom:8px;color:var(--gray-500)">Chưa có bài viết nào</h3>
      </div>`;
      const pg = document.getElementById('blogPagination');
      if (pg) pg.innerHTML = '';
      return;
    }

    grid.innerHTML = data.map((a, i) => blogCardHTML(a, i === 0 && _page === 1 && _filter === 'all')).join('');
    grid.querySelectorAll('.article-card').forEach((el, i) => { el.style.transitionDelay = (i * 0.06) + 's'; });
    renderPagination(pages);
  }

  /* ─── Sidebar recent posts ──────────────────────────────────── */
  async function loadRecentPosts() {
    const el = document.getElementById('recentPosts');
    if (!el) return;

    const { data } = await CMS.getArticles({ limit: 5 });
    if (!data.length) {
      el.innerHTML = '<p style="font-size:13px;color:var(--gray-400)">Chưa có bài viết</p>';
      return;
    }

    el.innerHTML = data.map(a => `
      <a href="tin-tuc-chi-tiet.html?slug=${a.slug || a.id}" class="sidebar-article">
        <div class="sidebar-thumb">
          <img src="${a.thumbnail ? CMS.imgUrl(a.thumbnail) : 'assets/images/hero-interior.png'}"
               loading="lazy" onerror="this.src='assets/images/hero-interior.png'" alt="" />
        </div>
        <div>
          <h4>${CMS.esc(a.title)}</h4>
          <span>${CMS.formatDate(a.published_at)}</span>
        </div>
      </a>`).join('');
  }

  /* ─── Pagination ────────────────────────────────────────────── */
  function renderPagination(pages) {
    const el = document.getElementById('blogPagination');
    if (!el) return;
    if (pages <= 1) { el.innerHTML = ''; return; }
    el.innerHTML = Array.from({ length: pages }, (_, i) => i + 1).map(p =>
      `<button class="page-btn ${p === _page ? 'active' : ''}" onclick="SV.Blog.gotoPage(${p})">${p}</button>`
    ).join('');
  }

  async function gotoPage(p) {
    _page = p;
    await loadArticles();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  function onSortChange() {
    const sel = document.getElementById('sortSelect');
    if (sel) _order = sel.value;
    _page = 1;
    loadArticles();
  }

  /* ─── Init ──────────────────────────────────────────────────── */
  async function init() {
    // Restore URL category param before fetching
    const catParam = new URLSearchParams(window.location.search).get('cat');
    if (catParam) _filter = catParam;

    const [settings, cats] = await Promise.all([CMS.getSettings(), CMS.getCategories('article')]);
    applyBranding(settings);
    renderFilterBar(cats);
    renderSidebarCats(cats);

    // Restore active filter button to match URL param
    if (catParam) {
      document.querySelectorAll('#filterBar .filter-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.filter === catParam));
    }

    await Promise.all([loadArticles(), loadRecentPosts()]);

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.addEventListener('change', onSortChange);
  }

  document.addEventListener('DOMContentLoaded', init);

  /* ─── Expose ────────────────────────────────────────────────── */
  window.SV = window.SV || {};
  window.SV.Blog = { gotoPage, onSortChange };

  // Legacy global compat
  window.gotoPage     = gotoPage;
  window.onSortChange = onSortChange;

})();
