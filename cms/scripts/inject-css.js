/**
 * SAO VÀNG — Per-page responsive CSS injector
 * Replaces old desktop-first <style> blocks with mobile-first fluid CSS
 */
const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.join(__dirname, '../../website');
const read  = f => fs.readFileSync(`${WEBSITE_DIR}\\${f}`, 'utf8');
const write = (f, c) => fs.writeFileSync(`${WEBSITE_DIR}\\${f}`, c, 'utf8');

/* ══════════════════════════════════════════════════════════════
   linh-vuc-hoat-dong.html — Services page
══════════════════════════════════════════════════════════════ */
function fixLinhVuc() {
  let html = read('linh-vuc-hoat-dong.html');
  const oldStyle = html.match(/<style>([\s\S]*?)<\/style>/)?.[0];
  if (!oldStyle) return console.warn('linh-vuc: no <style> found');

  const newStyle = `<style>
  /* ══ SERVICE DETAIL CARDS ════════════════════════════════════ */
  .svc-detail-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(32px, 5vw, 64px);
    align-items: start;
  }
  .svc-detail-img {
    border-radius: var(--radius-md);
    overflow: hidden;
    aspect-ratio: 16/9;
  }
  .svc-detail-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
  .svc-detail-img:hover img { transform: scale(1.04); }
  .svc-detail-content h2 {
    font-family: var(--ff-head);
    font-size: var(--fs-h2);
    font-weight: 800; color: var(--dark);
    line-height: 1.2; margin-bottom: var(--sp-4);
  }
  .svc-detail-content p { font-size: var(--fs-body-lg); color: var(--gray-500); line-height: 1.8; margin-bottom: var(--sp-3); font-weight: 300; }
  .svc-features {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--sp-3);
    margin: var(--sp-5) 0;
  }
  .svc-feature-item { display: flex; align-items: flex-start; gap: var(--sp-3); }
  .svc-feature-item svg { flex-shrink: 0; margin-top: 2px; color: var(--gold-a11y); }
  .svc-feature-item span { font-size: var(--fs-body); color: var(--gray-600); line-height: 1.6; }

  /* Process timeline */
  .process-list { display: flex; flex-direction: column; gap: clamp(16px, 3vw, 24px); margin-top: var(--sp-5); }
  .process-item { display: flex; gap: clamp(14px, 2.5vw, 20px); align-items: flex-start; }
  .process-item-num {
    width: clamp(36px, 5vw, 44px); height: clamp(36px, 5vw, 44px);
    min-width: clamp(36px, 5vw, 44px);
    border-radius: 50%; background: var(--red); color: var(--white);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--ff-head); font-size: 13px; font-weight: 800;
  }
  .process-item-text strong { display: block; font-family: var(--ff-head); font-size: var(--fs-body); font-weight: 700; color: var(--dark); margin-bottom: 4px; }
  .process-item-text p { font-size: var(--fs-sm); color: var(--gray-500); line-height: 1.65; margin: 0; }

  /* Service cards grid */
  .services-overview {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(12px, 3vw, 24px);
  }
  .svc-overview-card {
    border: 1px solid var(--gray-200); border-radius: var(--radius-md);
    padding: clamp(20px, 4vw, 32px) clamp(16px, 3vw, 28px);
    transition: all .25s var(--ease);
    cursor: pointer; background: var(--white);
  }
  .svc-overview-card:hover { border-color: var(--gold); box-shadow: 0 6px 24px rgba(200,134,10,.1); transform: translateY(-3px); }
  .svc-ov-icon { width: 48px; height: 48px; border-radius: var(--radius); background: rgba(139,0,0,.07); display: flex; align-items: center; justify-content: center; color: var(--red); margin-bottom: var(--sp-4); }
  .svc-overview-card h3 { font-family: var(--ff-head); font-size: clamp(14px, 1.5vw, 16px); font-weight: 700; color: var(--dark); margin-bottom: var(--sp-2); }
  .svc-overview-card p { font-size: var(--fs-sm); color: var(--gray-500); line-height: 1.7; }

  /* ══ RESPONSIVE ══════════════════════════════════════════════ */
  @media (min-width: 480px)  { .svc-features { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 640px)  { .services-overview { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 1024px) {
    .svc-detail-grid { grid-template-columns: 1fr 1fr; }
    .svc-detail-img  { aspect-ratio: auto; height: 100%; min-height: 320px; }
    .services-overview { grid-template-columns: repeat(3, 1fr); }
  }
  @media (min-width: 1440px) { .services-overview { grid-template-columns: repeat(3, 1fr); } }
</style>`;

  html = html.replace(oldStyle, newStyle);
  write('linh-vuc-hoat-dong.html', html);
  console.log('  ✓  linh-vuc-hoat-dong.html');
}

/* ══════════════════════════════════════════════════════════════
   lien-he.html — Contact page
══════════════════════════════════════════════════════════════ */
function fixLienHe() {
  let html = read('lien-he.html');
  const oldStyle = html.match(/<style>([\s\S]*?)<\/style>/)?.[0];
  if (!oldStyle) return console.warn('lien-he: no <style> found');

  const newStyle = `<style>
  /* ══ CONTACT LAYOUT ══════════════════════════════════════════ */
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(32px, 5vw, 64px);
    align-items: start;
  }
  /* Form */
  .contact-form-wrap {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-md);
    padding: clamp(24px, 5vw, 48px) clamp(20px, 4vw, 40px);
    box-shadow: 0 4px 32px rgba(0,0,0,.05);
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--sp-4);
    margin-bottom: var(--sp-4);
  }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label {
    font-family: var(--ff-head); font-size: 11px; font-weight: 700;
    letter-spacing: .06em; text-transform: uppercase; color: var(--gray-600);
  }
  .form-input, .form-select, .form-textarea {
    padding: 12px 16px;
    border: 1.5px solid var(--gray-200); border-radius: var(--radius);
    font-family: var(--ff-body); font-size: var(--fs-body);
    color: var(--dark); background: var(--gray-50);
    transition: border-color .2s, box-shadow .2s;
    min-height: 44px; width: 100%;
    appearance: none; -webkit-appearance: none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(200,134,10,.1);
    background: var(--white);
  }
  .form-textarea { min-height: 140px; resize: vertical; }

  /* Contact info sidebar */
  .contact-info { display: flex; flex-direction: column; gap: clamp(16px, 3vw, 24px); }
  .info-card {
    background: var(--white); border: 1px solid var(--gray-200);
    border-radius: var(--radius-md); padding: clamp(18px, 3vw, 28px);
    display: flex; gap: var(--sp-4); align-items: flex-start;
    transition: box-shadow .2s;
  }
  .info-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.07); }
  .info-icon {
    width: 48px; height: 48px; min-width: 48px; border-radius: var(--radius);
    background: rgba(139,0,0,.07); display: flex; align-items: center;
    justify-content: center; color: var(--red);
  }
  .info-content strong { display: block; font-family: var(--ff-head); font-size: var(--fs-body); font-weight: 700; color: var(--dark); margin-bottom: 4px; }
  .info-content p, .info-content a { font-size: var(--fs-body-lg); color: var(--gray-500); line-height: 1.6; }
  .info-content a:hover { color: var(--gold-a11y); }

  /* Map embed */
  .map-wrap {
    border-radius: var(--radius-md); overflow: hidden;
    aspect-ratio: 16/9; background: var(--gray-100);
    border: 1px solid var(--gray-200);
  }
  .map-wrap iframe { width: 100%; height: 100%; border: 0; display: block; }

  /* ══ RESPONSIVE ══════════════════════════════════════════════ */
  @media (min-width: 640px) {
    .form-row { grid-template-columns: 1fr 1fr; }
  }
  @media (min-width: 1024px) {
    .contact-grid { grid-template-columns: 1fr 400px; }
  }
  @media (min-width: 1280px) {
    .contact-grid { grid-template-columns: 1fr 420px; }
  }
</style>`;

  html = html.replace(oldStyle, newStyle);
  write('lien-he.html', html);
  console.log('  ✓  lien-he.html');
}

/* ══════════════════════════════════════════════════════════════
   du-an.html — Projects listing
══════════════════════════════════════════════════════════════ */
function fixDuAn() {
  let html = read('du-an.html');
  const oldStyle = html.match(/<style>([\s\S]*?)<\/style>/)?.[0];
  if (!oldStyle) return console.warn('du-an: no <style> found');

  const newStyle = `<style>
  /* ══ PROJECT GRID ════════════════════════════════════════════ */
  .projects-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(12px, 3vw, 24px);
  }
  .proj-item {
    position: relative; border-radius: var(--radius-md); overflow: hidden;
    cursor: pointer; aspect-ratio: 4/3; background: var(--gray-100);
  }
  .proj-item img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s var(--ease); }
  .proj-item:hover img { transform: scale(1.06); }
  .proj-info {
    position: absolute; inset: 0;
    background: linear-gradient(0deg, rgba(0,0,0,.85) 0%, transparent 55%);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: clamp(14px, 3vw, 24px); color: var(--white);
    opacity: 0; transition: opacity .3s var(--ease);
  }
  .proj-item:hover .proj-info { opacity: 1; }
  .proj-info-cat { font-family: var(--ff-head); font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-light); margin-bottom: 5px; }
  .proj-info h3 { font-family: var(--ff-head); font-size: clamp(14px, 2vw, 18px); font-weight: 700; line-height: 1.3; margin-bottom: 4px; }
  .proj-info p { font-size: var(--fs-xs); color: rgba(255,255,255,.75); font-weight: 300; }
  .proj-info-link { display: inline-flex; align-items: center; gap: 5px; font-family: var(--ff-head); font-size: 11px; font-weight: 700; color: var(--gold-light); margin-top: var(--sp-3); }

  /* Featured project (first card) */
  .proj-item.featured { aspect-ratio: 16/9; }

  /* Stats bar */
  .project-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(12px, 3vw, 20px);
    background: var(--red); padding: clamp(24px, 4vw, 40px) clamp(20px, 4vw, 40px);
    border-radius: var(--radius-md);
    margin-bottom: clamp(32px, 5vw, 56px);
  }
  .pstat { text-align: center; }
  .pstat-num { font-family: var(--ff-head); font-size: clamp(28px, 5vw, 48px); font-weight: 900; color: var(--gold-light); line-height: 1; }
  .pstat-lbl { font-family: var(--ff-head); font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.7); margin-top: 4px; }

  /* ══ RESPONSIVE ══════════════════════════════════════════════ */
  @media (min-width: 480px)  { .projects-grid { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 640px)  { .project-stats { grid-template-columns: repeat(4, 1fr); } }
  @media (min-width: 1024px) {
    .projects-grid { grid-template-columns: repeat(3, 1fr); }
    .proj-item.featured { grid-column: span 2; aspect-ratio: auto; }
  }
  @media (min-width: 1440px) { .projects-grid { grid-template-columns: repeat(4, 1fr); } }
  /* Touch: always show overlay on mobile */
  @media (hover: none) { .proj-info { opacity: 1; background: linear-gradient(0deg, rgba(0,0,0,.75) 0%, transparent 60%); } }
</style>`;

  html = html.replace(oldStyle, newStyle);
  write('du-an.html', html);
  console.log('  ✓  du-an.html');
}

/* ══════════════════════════════════════════════════════════════
   san-pham.html — Products listing
══════════════════════════════════════════════════════════════ */
function fixSanPham() {
  let html = read('san-pham.html');
  const oldStyle = html.match(/<style>([\s\S]*?)<\/style>/)?.[0];
  if (!oldStyle) return console.warn('san-pham: no <style> found');

  const newStyle = `<style>
  /* ══ PRODUCT GRID ════════════════════════════════════════════ */
  .products-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(12px, 3vw, 24px);
  }
  .prod-card {
    background: var(--white); border: 1px solid var(--gray-200);
    border-radius: var(--radius-md); overflow: hidden;
    transition: all .28s var(--ease); cursor: pointer;
  }
  .prod-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,.1); transform: translateY(-4px); border-color: transparent; }
  .prod-thumb {
    aspect-ratio: 4/3; overflow: hidden; background: var(--gray-100);
    position: relative;
  }
  .prod-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s var(--ease); }
  .prod-card:hover .prod-thumb img { transform: scale(1.06); }
  .prod-badge-wrap { position: absolute; top: var(--sp-3); left: var(--sp-3); display: flex; gap: 6px; flex-wrap: wrap; }
  .prod-body { padding: clamp(14px, 3vw, 22px); }
  .prod-cat { font-family: var(--ff-head); font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--gold-a11y); margin-bottom: 6px; }
  .prod-name { font-family: var(--ff-head); font-size: clamp(13px, 1.5vw, 15px); font-weight: 700; color: var(--dark); margin-bottom: var(--sp-2); line-height: 1.35; }
  .prod-desc { font-size: var(--fs-sm); color: var(--gray-500); line-height: 1.65; margin-bottom: var(--sp-3); }
  .prod-meta { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-2); flex-wrap: wrap; }
  .prod-price { font-family: var(--ff-head); font-size: clamp(14px, 1.5vw, 16px); font-weight: 800; color: var(--red); }
  .prod-price-note { font-size: 10px; color: var(--gray-400); font-weight: 400; display: block; }
  .prod-action { font-family: var(--ff-head); font-size: 11px; font-weight: 700; color: var(--gold-a11y); display: inline-flex; align-items: center; gap: 4px; transition: gap .2s; white-space: nowrap; }
  .prod-card:hover .prod-action { gap: 8px; }

  /* Filter bar scroll on mobile */
  .filter-scroll-wrap {
    overflow-x: auto; -webkit-overflow-scrolling: touch;
    padding-bottom: 4px; margin-bottom: var(--sp-6);
  }
  .filter-scroll-wrap .filter-bar { flex-wrap: nowrap; min-width: max-content; }
  @media (min-width: 640px) { .filter-scroll-wrap { overflow: visible; } .filter-scroll-wrap .filter-bar { flex-wrap: wrap; min-width: auto; } }

  /* ══ RESPONSIVE ══════════════════════════════════════════════ */
  @media (min-width: 480px)  { .products-grid { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 1024px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 1440px) { .products-grid { grid-template-columns: repeat(4, 1fr); } }
</style>`;

  html = html.replace(oldStyle, newStyle);
  write('san-pham.html', html);
  console.log('  ✓  san-pham.html');
}

/* ══════════════════════════════════════════════════════════════
   tin-tuc.html — News listing
══════════════════════════════════════════════════════════════ */
function fixTinTuc() {
  let html = read('tin-tuc.html');
  const oldStyle = html.match(/<style>([\s\S]*?)<\/style>/)?.[0];
  if (!oldStyle) return console.warn('tin-tuc: no <style> found');

  const newStyle = `<style>
  /* ══ NEWS LAYOUT ════════════════════════════════════════════ */
  .news-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(24px, 4vw, 48px);
    align-items: start;
  }

  /* Article cards */
  .article-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(16px, 3vw, 24px);
  }
  .article-card {
    background: var(--white); border: 1px solid var(--gray-200);
    border-radius: var(--radius-md); overflow: hidden;
    transition: all .25s var(--ease); cursor: pointer;
  }
  .article-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.09); transform: translateY(-3px); border-color: transparent; }
  .article-thumb { aspect-ratio: 16/9; overflow: hidden; background: var(--gray-100); }
  .article-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
  .article-card:hover .article-thumb img { transform: scale(1.05); }
  .article-body { padding: clamp(14px, 3vw, 24px); }
  .article-meta { display: flex; align-items: center; gap: var(--sp-3); margin-bottom: var(--sp-3); flex-wrap: wrap; }
  .article-cat { font-family: var(--ff-head); font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--gold-a11y); }
  .article-date { font-size: var(--fs-xs); color: var(--gray-400); }
  .article-read { font-size: var(--fs-xs); color: var(--gray-400); }
  .article-title { font-family: var(--ff-head); font-size: clamp(14px, 1.8vw, 18px); font-weight: 700; color: var(--dark); line-height: 1.4; margin-bottom: var(--sp-2); }
  .article-excerpt { font-size: var(--fs-body); color: var(--gray-500); line-height: 1.7; font-weight: 300; margin-bottom: var(--sp-3); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .article-link { font-family: var(--ff-head); font-size: 11px; font-weight: 700; color: var(--gold-a11y); display: inline-flex; align-items: center; gap: 4px; transition: gap .2s; }
  .article-card:hover .article-link { gap: 8px; }

  /* Featured article (first) */
  .article-card.featured .article-thumb { aspect-ratio: 21/9; }
  .article-card.featured .article-title { font-size: clamp(16px, 2.5vw, 24px); }

  /* Sidebar */
  .news-sidebar { display: flex; flex-direction: column; gap: clamp(20px, 3vw, 32px); }
  .sidebar-widget { background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: clamp(16px, 3vw, 24px); }
  .sidebar-title { font-family: var(--ff-head); font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--dark); margin-bottom: var(--sp-4); padding-bottom: var(--sp-3); border-bottom: 2px solid var(--gold); display: inline-block; }
  .sidebar-article { display: flex; gap: var(--sp-3); padding: var(--sp-3) 0; border-bottom: 1px solid var(--gray-100); }
  .sidebar-article:last-child { border-bottom: none; padding-bottom: 0; }
  .sidebar-thumb { width: 72px; height: 56px; min-width: 72px; border-radius: var(--radius); overflow: hidden; background: var(--gray-100); }
  .sidebar-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .sidebar-article h4 { font-family: var(--ff-head); font-size: 12px; font-weight: 700; color: var(--dark); line-height: 1.4; margin-bottom: 4px; }
  .sidebar-article span { font-size: 11px; color: var(--gray-400); }
  .category-list { display: flex; flex-direction: column; gap: var(--sp-2); }
  .cat-item { display: flex; align-items: center; justify-content: space-between; padding: var(--sp-2) 0; border-bottom: 1px solid var(--gray-100); font-size: var(--fs-sm); color: var(--gray-600); transition: color .2s; cursor: pointer; }
  .cat-item:hover { color: var(--gold-a11y); }
  .cat-count { font-family: var(--ff-head); font-size: 11px; font-weight: 700; background: var(--gray-100); color: var(--gray-500); padding: 2px 8px; border-radius: 20px; }

  /* Pagination */
  .pagination { display: flex; align-items: center; justify-content: center; gap: var(--sp-2); margin-top: var(--sp-7); flex-wrap: wrap; }
  .page-btn { width: 40px; height: 40px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-family: var(--ff-head); font-size: 13px; font-weight: 700; border: 1.5px solid var(--gray-200); color: var(--gray-500); transition: all .2s; cursor: pointer; }
  .page-btn:hover { border-color: var(--gold); color: var(--gold-a11y); }
  .page-btn.active { background: var(--gold); color: var(--white); border-color: var(--gold); }

  /* ══ RESPONSIVE ══════════════════════════════════════════════ */
  @media (min-width: 640px)  { .article-grid { grid-template-columns: 1fr 1fr; } .article-card.featured { grid-column: span 2; } }
  @media (min-width: 1024px) { .news-layout { grid-template-columns: 1fr 320px; } .article-grid { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 1280px) { .news-layout { grid-template-columns: 1fr 340px; } }
</style>`;

  html = html.replace(oldStyle, newStyle);
  write('tin-tuc.html', html);
  console.log('  ✓  tin-tuc.html');
}

/* ══════════════════════════════════════════════════════════════
   du-an-chi-tiet.html — Project detail
══════════════════════════════════════════════════════════════ */
function fixDuAnChiTiet() {
  let html = read('du-an-chi-tiet.html');
  const oldStyle = html.match(/<style>([\s\S]*?)<\/style>/)?.[0];
  if (!oldStyle) return console.warn('du-an-chi-tiet: no <style> found');

  const newStyle = `<style>
  /* ══ PROJECT DETAIL ══════════════════════════════════════════ */
  .proj-detail-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(32px, 5vw, 64px);
    align-items: start;
  }
  /* Main gallery */
  .proj-gallery { display: flex; flex-direction: column; gap: clamp(8px, 2vw, 14px); }
  .proj-main-img { border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 16/9; }
  .proj-main-img img { width: 100%; height: 100%; object-fit: cover; }
  .proj-thumbs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: clamp(6px, 1.5vw, 12px);
  }
  .proj-thumb { border-radius: var(--radius); overflow: hidden; aspect-ratio: 4/3; cursor: pointer; opacity: .7; transition: opacity .2s; }
  .proj-thumb:hover, .proj-thumb.active { opacity: 1; }
  .proj-thumb img { width: 100%; height: 100%; object-fit: cover; }

  /* Sidebar info */
  .proj-info-box {
    background: var(--white); border: 1px solid var(--gray-200);
    border-radius: var(--radius-md); padding: clamp(20px, 4vw, 32px);
    box-shadow: 0 4px 24px rgba(0,0,0,.06);
  }
  .proj-info-box h3 { font-family: var(--ff-head); font-size: clamp(16px, 2vw, 20px); font-weight: 800; color: var(--dark); margin-bottom: var(--sp-5); line-height: 1.3; }
  .proj-meta-list { display: flex; flex-direction: column; gap: 0; }
  .proj-meta-row { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--sp-3); padding: var(--sp-3) 0; border-bottom: 1px solid var(--gray-100); font-size: var(--fs-sm); }
  .proj-meta-row:last-child { border-bottom: none; }
  .proj-meta-row .lbl { color: var(--gray-500); font-weight: 400; flex-shrink: 0; }
  .proj-meta-row .val { color: var(--dark); font-weight: 600; text-align: right; }
  .proj-cta { margin-top: var(--sp-5); display: flex; flex-direction: column; gap: var(--sp-3); }
  .proj-cta .btn { justify-content: center; }

  /* Description */
  .proj-desc { font-size: var(--fs-body-lg); font-weight: 300; color: var(--gray-500); line-height: 1.85; margin-bottom: var(--sp-5); }
  .proj-section-title { font-family: var(--ff-head); font-size: var(--fs-h3); font-weight: 800; color: var(--dark); margin-bottom: var(--sp-4); }

  /* Related projects */
  .related-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(12px, 3vw, 20px);
  }

  /* ══ RESPONSIVE ══════════════════════════════════════════════ */
  @media (min-width: 640px)  { .related-grid { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 1024px) { .proj-detail-layout { grid-template-columns: 1fr 360px; } }
  @media (min-width: 1280px) { .proj-detail-layout { grid-template-columns: 1fr 400px; } }
</style>`;

  html = html.replace(oldStyle, newStyle);
  write('du-an-chi-tiet.html', html);
  console.log('  ✓  du-an-chi-tiet.html');
}

/* ══════════════════════════════════════════════════════════════
   san-pham-chi-tiet.html — Product detail
══════════════════════════════════════════════════════════════ */
function fixSanPhamChiTiet() {
  let html = read('san-pham-chi-tiet.html');
  const oldStyle = html.match(/<style>([\s\S]*?)<\/style>/)?.[0];
  if (!oldStyle) return console.warn('san-pham-chi-tiet: no <style> found');

  const newStyle = `<style>
  /* ══ PRODUCT DETAIL ══════════════════════════════════════════ */
  .prod-detail-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(32px, 5vw, 64px);
    align-items: start;
  }
  /* Gallery */
  .prod-gallery { display: flex; flex-direction: column; gap: clamp(8px, 2vw, 12px); }
  .prod-main-img { border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 1/1; background: var(--gray-100); }
  .prod-main-img img { width: 100%; height: 100%; object-fit: cover; }
  .prod-thumbs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: clamp(6px, 1.5vw, 10px);
  }
  .prod-thumb { border-radius: var(--radius); overflow: hidden; aspect-ratio: 1/1; cursor: pointer; opacity: .65; transition: opacity .2s; border: 2px solid transparent; }
  .prod-thumb:hover, .prod-thumb.active { opacity: 1; border-color: var(--gold); }
  .prod-thumb img { width: 100%; height: 100%; object-fit: cover; }

  /* Info panel */
  .prod-info-panel { display: flex; flex-direction: column; gap: var(--sp-5); }
  .prod-detail-cat { font-family: var(--ff-head); font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-a11y); margin-bottom: var(--sp-2); }
  .prod-detail-name { font-family: var(--ff-head); font-size: var(--fs-h2); font-weight: 900; color: var(--dark); line-height: 1.2; margin-bottom: var(--sp-3); }
  .prod-detail-price { font-family: var(--ff-head); font-size: clamp(22px, 3vw, 32px); font-weight: 900; color: var(--red); margin-bottom: var(--sp-2); }
  .prod-detail-price-note { font-size: var(--fs-sm); color: var(--gray-500); }
  .prod-detail-desc { font-size: var(--fs-body-lg); color: var(--gray-500); line-height: 1.8; font-weight: 300; }

  /* Specs table */
  .specs-table { width: 100%; border-collapse: collapse; margin-top: var(--sp-4); }
  .specs-table tr { border-bottom: 1px solid var(--gray-100); }
  .specs-table tr:last-child { border-bottom: none; }
  .specs-table td { padding: var(--sp-3) var(--sp-2); font-size: var(--fs-body); vertical-align: top; }
  .specs-table td:first-child { color: var(--gray-500); font-weight: 400; width: 45%; }
  .specs-table td:last-child { color: var(--dark); font-weight: 600; }

  /* Action buttons */
  .prod-actions { display: flex; flex-direction: column; gap: var(--sp-3); }
  .prod-actions .btn { justify-content: center; }

  /* Tab system */
  .detail-tabs { display: flex; gap: 0; border-bottom: 2px solid var(--gray-200); margin-bottom: var(--sp-6); overflow-x: auto; }
  .detail-tab { font-family: var(--ff-head); font-size: 12px; font-weight: 700; letter-spacing: .06em; color: var(--gray-500); padding: var(--sp-3) var(--sp-5); border-bottom: 2px solid transparent; margin-bottom: -2px; cursor: pointer; white-space: nowrap; transition: all .2s; }
  .detail-tab.active { color: var(--dark); border-bottom-color: var(--red); }
  .detail-tab:hover { color: var(--dark); }
  .tab-content { display: none; }
  .tab-content.active { display: block; }

  /* Related */
  .related-prod-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(10px, 2.5vw, 20px);
  }

  /* ══ RESPONSIVE ══════════════════════════════════════════════ */
  @media (min-width: 480px)  { .prod-actions { flex-direction: row; } }
  @media (min-width: 640px)  { .related-prod-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 1024px) {
    .prod-detail-layout { grid-template-columns: 1fr 1fr; }
    .prod-main-img { aspect-ratio: 4/3; }
  }
  @media (min-width: 1280px) {
    .prod-detail-layout { grid-template-columns: 1.1fr 1fr; }
    .related-prod-grid { grid-template-columns: repeat(4, 1fr); }
  }
</style>`;

  html = html.replace(oldStyle, newStyle);
  write('san-pham-chi-tiet.html', html);
  console.log('  ✓  san-pham-chi-tiet.html');
}

/* ══════════════════════════════════════════════════════════════
   tin-tuc-chi-tiet.html — Article detail
══════════════════════════════════════════════════════════════ */
function fixTinTucChiTiet() {
  let html = read('tin-tuc-chi-tiet.html');
  const oldStyle = html.match(/<style>([\s\S]*?)<\/style>/)?.[0];
  if (!oldStyle) return console.warn('tin-tuc-chi-tiet: no <style> found');

  const newStyle = `<style>
  /* ══ ARTICLE DETAIL ══════════════════════════════════════════ */
  .article-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(32px, 5vw, 64px);
    align-items: start;
  }
  /* Article content */
  .article-content { min-width: 0; }
  .article-hero-img { border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 16/9; margin-bottom: clamp(24px, 4vw, 40px); }
  .article-hero-img img { width: 100%; height: 100%; object-fit: cover; }
  .article-header { margin-bottom: clamp(24px, 4vw, 40px); }
  .article-header .tag { margin-bottom: var(--sp-3); }
  .article-header h1 { font-family: var(--ff-head); font-size: var(--fs-h1); font-weight: 900; color: var(--dark); line-height: 1.2; margin-bottom: var(--sp-4); }
  .article-byline { display: flex; align-items: center; gap: clamp(12px, 2vw, 20px); flex-wrap: wrap; font-size: var(--fs-sm); color: var(--gray-500); padding-bottom: var(--sp-4); border-bottom: 2px solid var(--gray-100); }
  .article-author { font-weight: 600; color: var(--dark); }

  /* Rich text content */
  .article-body { font-size: var(--fs-body-lg); font-weight: 300; color: var(--gray-600); line-height: 1.9; }
  .article-body h2 { font-family: var(--ff-head); font-size: var(--fs-h3); font-weight: 800; color: var(--dark); margin: clamp(24px, 4vw, 40px) 0 var(--sp-4); line-height: 1.3; }
  .article-body h3 { font-family: var(--ff-head); font-size: clamp(16px, 2vw, 20px); font-weight: 700; color: var(--dark); margin: clamp(20px, 3vw, 32px) 0 var(--sp-3); }
  .article-body p { margin-bottom: var(--sp-5); max-width: 70ch; }
  .article-body img { border-radius: var(--radius-md); width: 100%; height: auto; margin: var(--sp-6) 0; }
  .article-body blockquote {
    border-left: 4px solid var(--gold); padding: clamp(14px, 3vw, 20px) clamp(16px, 3vw, 24px);
    background: var(--gray-50); border-radius: 0 var(--radius) var(--radius) 0;
    margin: var(--sp-6) 0; font-style: italic; color: var(--gray-700);
    font-size: clamp(15px, 2vw, 18px); font-weight: 400; line-height: 1.7;
  }
  .article-body ul, .article-body ol { padding-left: var(--sp-6); margin-bottom: var(--sp-5); }
  .article-body li { margin-bottom: var(--sp-2); line-height: 1.75; }

  /* Share & Tags */
  .article-footer { padding-top: var(--sp-6); border-top: 2px solid var(--gray-100); margin-top: var(--sp-7); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--sp-4); }
  .article-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .article-tag { font-family: var(--ff-head); font-size: 10px; font-weight: 700; letter-spacing: .06em; padding: 4px 12px; border: 1.5px solid var(--gray-200); border-radius: 20px; color: var(--gray-500); transition: all .2s; }
  .article-tag:hover { border-color: var(--gold); color: var(--gold-a11y); }
  .share-btns { display: flex; gap: var(--sp-2); }
  .share-btn { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid var(--gray-200); display: flex; align-items: center; justify-content: center; color: var(--gray-500); transition: all .2s; }
  .share-btn:hover { border-color: var(--gold); color: var(--gold-a11y); }

  /* Sidebar */
  .article-sidebar { display: flex; flex-direction: column; gap: clamp(20px, 3vw, 32px); }

  /* ══ RESPONSIVE ══════════════════════════════════════════════ */
  @media (min-width: 1024px) {
    .article-layout { grid-template-columns: 1fr 300px; }
  }
  @media (min-width: 1280px) { .article-layout { grid-template-columns: 1fr 340px; } }
</style>`;

  html = html.replace(oldStyle, newStyle);
  write('tin-tuc-chi-tiet.html', html);
  console.log('  ✓  tin-tuc-chi-tiet.html');
}

// ── Run all ──────────────────────────────────────────────────
console.log('\n  SAO VÀNG — Per-page CSS Injector\n');
fixLinhVuc();
fixLienHe();
fixDuAn();
fixSanPham();
fixTinTuc();
fixDuAnChiTiet();
fixSanPhamChiTiet();
fixTinTucChiTiet();
console.log('\n  ✅ All pages updated.\n');
