/**
 * Utility functions — Admin Studio
 */
const Utils = {
  /* Format bytes → human-readable */
  formatBytes(bytes) {
    if (!bytes) return '0 B';
    const k = 1024, sizes = ['B','KB','MB','GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  },

  /* Format date/time */
  formatDate(dt, opts = {}) {
    if (!dt) return '—';
    return new Date(dt).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', ...opts
    });
  },

  formatDateTime(dt) {
    if (!dt) return '—';
    return new Date(dt).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  },

  timeAgo(dt) {
    if (!dt) return '—';
    const diff = Date.now() - new Date(dt);
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'Vừa xong';
    if (m < 60) return `${m} phút trước`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} giờ trước`;
    const d = Math.floor(h / 24);
    if (d < 7)  return `${d} ngày trước`;
    return Utils.formatDate(dt);
  },

  /* Status badge */
  statusBadge(status) {
    const map = {
      published: ['published', 'Đã đăng'],
      draft:     ['draft',     'Nháp'],
      review:    ['review',    'Chờ duyệt'],
      approved:  ['approved',  'Đã duyệt'],
      archived:  ['archived',  'Lưu trữ'],
    };
    const [cls, label] = map[status] || ['other', status];
    return `<span class="badge badge-${cls}">${label}</span>`;
  },

  /* Type badge */
  typeBadge(type) {
    const map = {
      page:'Trang', article:'Bài viết', product:'Sản phẩm',
      project:'Dự án', service:'Dịch vụ', hero:'Hero Banner',
      popup:'Popup', download:'Tải về', gallery:'Thư viện', video:'Video',
    };
    return `<span class="badge badge-${type}">${map[type] || type}</span>`;
  },

  /* Slug generator */
  slugify(s) {
    return s.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  },

  /* Safe HTML escape */
  esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },

  /* File icon by type */
  fileIcon(type, ext = '') {
    const icons = {
      image:    `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
      video:    `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
      document: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
      archive:  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/></svg>`,
      other:    `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/></svg>`,
    };
    return icons[type] || icons.other;
  },

  /* Debounce */
  debounce(fn, ms = 300) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  },

  /* Truncate text */
  truncate(s, n = 60) {
    if (!s) return '';
    return s.length > n ? s.slice(0, n) + '…' : s;
  },

  /* Parse tags JSON */
  parseTags(tags) {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try { return JSON.parse(tags); } catch { return [tags]; }
  },

  /* Confirm dialog (native) */
  confirm(msg) {
    return window.confirm(msg);
  },

  /* Copy to clipboard */
  async copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  },

  /* Pagination HTML */
  paginationHTML(page, pages, onPage) {
    if (pages <= 1) return '';
    const btns = [];
    const p = parseInt(page), t = parseInt(pages);
    for (let i = 1; i <= t; i++) {
      if (i === 1 || i === t || Math.abs(i - p) <= 2) {
        btns.push(`<button class="page-btn ${i === p ? 'active' : ''}" data-page="${i}">${i}</button>`);
      } else if (btns[btns.length-1] !== '…') {
        btns.push('…');
      }
    }
    return `<div class="pagination">${btns.join('')}</div>`;
  },

  /* Link type icons */
  linkTypeIcon(type) {
    const map = {
      website:   `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
      youtube:   `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>`,
      pdf:       `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
      drive:     `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
      facebook:  `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>`,
      instagram: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
      figma:     `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5.5A3.5 3.5 0 018.5 2H12v7H8.5A3.5 3.5 0 015 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 110 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"/><path d="M5 19.5A3.5 3.5 0 018.5 16H12v3.5a3.5 3.5 0 11-7 0z"/><path d="M5 12.5A3.5 3.5 0 018.5 9H12v7H8.5A3.5 3.5 0 015 12.5z"/></svg>`,
      map:       `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    };
    return map[type] || map.website;
  },
};

window.Utils = Utils;
