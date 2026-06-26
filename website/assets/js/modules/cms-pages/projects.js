/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — modules/cms-pages/projects.js  v1.0
   Controller cho trang Dự Án (du-an.html).
   Phụ thuộc: cms-client.js (window.CMS)
════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── State ─────────────────────────────────────────────────── */
  let _filter  = 'all';
  let _page    = 1;
  let _allData = [];

  /* ─── Category classification ───────────────────────────────── */
  const CO_KHI_KEYS   = ['co-khi','sat','thep','inox','cau-thang','lan-can','cong','hang-rao','nhom-duc','ren','my-thuat','du-thuyen','yacht','marine','gate','railing','stair','biet-thu'];
  const NHOM_KINH_KEYS = ['nhom','kinh','cua','vach','glass','aluminum','window','door','facade','cabin','slim','xingfa','van-phong','toa-nha'];

  function classify(slug) {
    const s = (slug || '').toLowerCase();
    if (CO_KHI_KEYS.some(k => s.includes(k)))   return 'co-khi';
    if (NHOM_KINH_KEYS.some(k => s.includes(k))) return 'nhom-kinh';
    return 'other';
  }

  /* ─── Apply branding from CMS settings ─────────────────────── */
  function applySettings(s) {
    const setEl = (id, val) => { const e = document.getElementById(id); if (e && val) e.textContent = val; };
    setEl('logoBadge',       s.logo_badge);
    setEl('footerLogoBadge', s.logo_badge);
    setEl('logoName',        s.company_short);
    setEl('footerLogoName',  s.company_short);
    setEl('footerPhone',     s.site_phone);
    setEl('footerEmail',     s.site_email);
    if (s.company_full) {
      setEl('footerDesc', s.company_full + ' — Chuyên thiết kế & thi công cơ khí nhà ở và du thuyền cao cấp.');
      setEl('footerCopyright', `© ${new Date().getFullYear()} ${s.company_full}. Bảo lưu mọi quyền.`);
    }
  }

  /* ─── Render filter bar ─────────────────────────────────────── */
  function renderFilterBar(cats) {
    const bar = document.getElementById('filterBar');
    if (!bar) return;

    const coKhi   = cats.filter(c => classify(c.slug) === 'co-khi');
    const nhomKinh = cats.filter(c => classify(c.slug) === 'nhom-kinh');
    const others   = cats.filter(c => classify(c.slug) === 'other');

    const btnHtml = (c) =>
      `<button class="filter-btn ${_filter === c.slug ? 'active' : ''}" data-filter="${c.slug}" style="--cat-color:${c.color || '#C8A96A'}">${CMS.esc(c.name)}</button>`;

    let html = `<button class="filter-btn ${_filter === 'all' ? 'active' : ''}" data-filter="all">Tất cả</button>`;

    if (coKhi.length) {
      html += `<span class="filter-divider"></span>
      <span class="filter-group-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
        Cơ Khí
      </span>` + coKhi.map(btnHtml).join('');
    }
    if (nhomKinh.length) {
      html += `<span class="filter-divider"></span>
      <span class="filter-group-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
        Nhôm Kính
      </span>` + nhomKinh.map(btnHtml).join('');
    }
    if (others.length) html += others.map(btnHtml).join('');

    bar.innerHTML = html;

    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _filter = btn.dataset.filter;
        _page   = 1;
        await loadProjects();
      });
    });
  }

  /* ─── Project card HTML ─────────────────────────────────────── */
  function cardHTML(p, featured) {
    const img = p.thumbnail ? CMS.imgUrl(p.thumbnail) : 'assets/images/project-villa.png';
    const cls = featured ? 'proj-item featured' : 'proj-item';
    return `<a href="du-an-chi-tiet.html?slug=${p.slug || p.id}" class="${cls}" data-slug="${p.slug || p.id}" data-reveal>
      <img src="${CMS.esc(img)}" alt="${CMS.esc(p.title)}" loading="lazy" onerror="this.src='assets/images/project-villa.png'" />
      <div class="proj-info">
        <span class="proj-info-cat">${CMS.esc(p.category || '')}</span>
        <h3>${CMS.esc(p.title)}</h3>
        <p>${CMS.esc((p.excerpt || '').slice(0, 120))}${(p.excerpt || '').length > 120 ? '...' : ''}</p>
        <span class="proj-info-link">
          Xem chi tiết
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </span>
      </div>
    </a>`;
  }

  /* ─── Load projects ─────────────────────────────────────────── */
  async function loadProjects() {
    const grid  = document.getElementById('projectsGrid');
    const count = document.getElementById('projectCount');
    if (!grid) return;

    grid.innerHTML = Array(6).fill('<div class="proj-skeleton"></div>').join('');

    const { data, total, pages } = await CMS.getProjects({
      category: _filter === 'all' ? '' : _filter,
      page: _page, limit: 9,
    });

    _allData = data;
    if (count) count.textContent = `Hiển thị ${data.length} trong ${total} dự án`;

    if (!data.length) {
      grid.innerHTML = `<div class="cms-empty">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#ccc" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        <h3>Chưa có dự án nào</h3><p>Dự án sẽ được cập nhật sớm</p>
      </div>`;
      const pg = document.getElementById('projectPagination');
      if (pg) pg.innerHTML = '';
      return;
    }

    grid.innerHTML = data.map((p, i) => cardHTML(p, i === 0 && _page === 1 && _filter === 'all')).join('');
    grid.querySelectorAll('.proj-item').forEach((el, i) => { el.style.transitionDelay = (i * 0.06) + 's'; });
    renderPagination(pages);
  }

  /* ─── Pagination ────────────────────────────────────────────── */
  function renderPagination(pages) {
    const el = document.getElementById('projectPagination');
    if (!el) return;
    if (pages <= 1) { el.innerHTML = ''; return; }
    el.innerHTML = Array.from({ length: pages }, (_, i) => i + 1).map(p =>
      `<button class="page-btn ${p === _page ? 'active' : ''}" onclick="SV.Projects.gotoPage(${p})">${p}</button>`
    ).join('');
  }

  async function gotoPage(p) {
    _page = p;
    await loadProjects();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  /* ─── Project Detail Modal ──────────────────────────────────── */
  async function openModal(slug) {
    const modal = document.getElementById('projModal');
    if (!modal) return;

    document.body.style.overflow = 'hidden';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    // Reset
    ['modalTitle','modalCat','modalDesc','modalClient','modalValue','modalLocation','modalYear'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = id === 'modalTitle' ? 'Đang tải...' : '—';
    });
    ['modalChallenge','modalSolution','modalResult'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = 'Đang tải...';
    });

    const p = await CMS.getProject(slug);
    if (!p) {
      const t = document.getElementById('modalTitle');
      if (t) t.textContent = 'Không tìm thấy dự án';
      return;
    }

    const imgSrc = p.thumbnail ? CMS.imgUrl(p.thumbnail) : 'assets/images/project-villa.png';
    const setEl  = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };

    const mainImg = document.getElementById('modalMainImg');
    if (mainImg) mainImg.src = imgSrc;

    setEl('modalCat',       p.category || 'Dự Án');
    setEl('modalTitle',     p.title);
    setEl('modalDesc',      p.excerpt || '');
    setEl('modalClient',    p.client   || 'Gia đình');
    setEl('modalValue',     p.project_value || 'Liên hệ');
    setEl('modalLocation',  p.location || 'Việt Nam');
    setEl('modalYear',      p.year     || '2024');
    setEl('modalChallenge', p.challenge || 'Yêu cầu thi công đạt chất lượng thẩm mỹ cao nhất, đảm bảo khả năng chịu lực và chống ăn mòn.');
    setEl('modalSolution',  p.solution  || 'Ứng dụng công nghệ gia công cơ khí và nhôm kính tiên tiến để đảm bảo chất lượng hoàn mỹ.');
    setEl('modalResult',    p.result    || 'Dự án bàn giao hoàn thiện, đạt chuẩn quốc tế, nhận được sự hài lòng tuyệt đối của chủ đầu tư.');

    const linkEl = document.getElementById('modalStandaloneLink');
    if (linkEl) linkEl.href = `du-an-chi-tiet.html?slug=${p.slug || p.id}`;

    // Gallery thumbnails
    let gallery = [];
    try { if (p.gallery) gallery = JSON.parse(p.gallery); } catch {}
    if (!gallery.includes(imgSrc)) gallery.unshift(imgSrc);

    const thumbsEl = document.getElementById('modalThumbs');
    if (thumbsEl) {
      thumbsEl.innerHTML = gallery.length > 1
        ? gallery.map((img, idx) => `
          <div class="proj-modal-thumb ${idx === 0 ? 'active' : ''}" onclick="SV.Projects.setMainImg('${CMS.imgUrl(img)}', this)">
            <img src="${CMS.imgUrl(img)}" alt="Thumbnail ${idx + 1}">
          </div>`).join('')
        : '';
    }
  }

  function setMainImg(src, thumbEl) {
    const img = document.getElementById('modalMainImg');
    if (img) img.src = src;
    document.querySelectorAll('.proj-modal-thumb').forEach(el => el.classList.remove('active'));
    thumbEl?.classList.add('active');
  }

  function closeModal() {
    const modal = document.getElementById('projModal');
    if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
    document.body.style.overflow = '';
  }

  /* ─── Init ──────────────────────────────────────────────────── */
  async function init() {
    const [settings, cats] = await Promise.all([CMS.getSettings(), CMS.getCategories('project')]);
    applySettings(settings);
    renderFilterBar(cats);

    const footerList = document.getElementById('footerCatList');
    if (footerList && cats.length) {
      footerList.innerHTML = cats.map(c => `<li><a href="du-an.html?cat=${c.slug}">${c.name}</a></li>`).join('');
    }

    // Restore URL param
    const catParam = new URLSearchParams(window.location.search).get('cat');
    if (catParam) {
      _filter = catParam;
      document.querySelectorAll('#filterBar .filter-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.filter === catParam));
    }

    await loadProjects();

    // Modal events
    const modal = document.getElementById('projModal');
    if (modal) {
      modal.querySelector('.proj-modal-close')?.addEventListener('click', closeModal);
      modal.querySelector('.proj-modal-backdrop')?.addEventListener('click', closeModal);
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal();
    });

    // Card click → open modal
    const grid = document.getElementById('projectsGrid');
    if (grid) {
      grid.addEventListener('click', e => {
        const card = e.target.closest('.proj-item');
        if (card && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
          e.preventDefault();
          openModal(card.dataset.slug);
        }
      });
    }

    // Auto open modal if slug is in URL
    const slugParam = new URLSearchParams(window.location.search).get('slug');
    if (slugParam) {
      setTimeout(() => openModal(slugParam), 300);
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  /* ─── Expose ────────────────────────────────────────────────── */
  window.SV = window.SV || {};
  window.SV.Projects = { gotoPage, openModal, setMainImg, closeModal };

  // Legacy global compat
  window.gotoPage         = gotoPage;
  window.openProjectModal = openModal;
  window.closeProjectModal = closeModal;
  window.setModalMainImg  = setMainImg;

})();
