/**
 * CMS API Client — dùng cho trang website tĩnh
 * Kết nối tới CMS API để load nội dung động
 */
(function () {
  const CMS_URL = window.location.origin;

  window.CMS = {
    // ── Settings ──────────────────────────────────────────
    async getSettings() {
      try {
        const r = await fetch(`${CMS_URL}/api/public/settings`);
        if (!r.ok) return {};
        return await r.json();
      } catch { return {}; }
    },

    // ── Categories ────────────────────────────────────────
    async getCategories(type) {
      try {
        const r = await fetch(`${CMS_URL}/api/public/categories?type=${type}`);
        if (!r.ok) return [];
        return await r.json();
      } catch { return []; }
    },

    // ── Projects ──────────────────────────────────────────
    async getProjects({ category = '', page = 1, limit = 50 } = {}) {
      try {
        const params = new URLSearchParams({ limit, page });
        if (category && category !== 'all') params.set('category', category);
        const r = await fetch(`${CMS_URL}/api/public/projects?${params}`);
        if (!r.ok) return { data: [], total: 0, pages: 0 };
        return await r.json();
      } catch { return { data: [], total: 0, pages: 0 }; }
    },

    async getProject(slug) {
      try {
        const r = await fetch(`${CMS_URL}/api/public/projects/${slug}`);
        if (!r.ok) return null;
        return await r.json();
      } catch { return null; }
    },

    // ── Products ──────────────────────────────────────────
    async getProducts({ category = '', page = 1, limit = 24 } = {}) {
      try {
        const params = new URLSearchParams({ limit, page });
        if (category && category !== 'all') params.set('category', category);
        const r = await fetch(`${CMS_URL}/api/public/products?${params}`);
        if (!r.ok) return { data: [], total: 0, pages: 0 };
        return await r.json();
      } catch { return { data: [], total: 0, pages: 0 }; }
    },

    async getProduct(slug) {
      try {
        const r = await fetch(`${CMS_URL}/api/public/products/${slug}`);
        if (!r.ok) return null;
        return await r.json();
      } catch { return null; }
    },

    // ── Articles ──────────────────────────────────────────
    async getArticles({ category = '', page = 1, limit = 9 } = {}) {
      try {
        const params = new URLSearchParams({ limit, page });
        if (category && category !== 'all') params.set('category', category);
        const r = await fetch(`${CMS_URL}/api/public/articles?${params}`);
        if (!r.ok) return { data: [], total: 0, pages: 0 };
        return await r.json();
      } catch { return { data: [], total: 0, pages: 0 }; }
    },

    async getArticle(slug) {
      try {
        const r = await fetch(`${CMS_URL}/api/public/articles/${slug}`);
        if (!r.ok) return null;
        return await r.json();
      } catch { return null; }
    },


    async submitForm(slug, data) {
      const r = await fetch(`${CMS_URL}/api/forms/${slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await r.json();
    },

    // ── Helpers ───────────────────────────────────────────
    imgUrl(path) {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      return `${CMS_URL}${path}`;
    },

    formatDate(iso) {
      if (!iso) return '';
      return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },

    esc(str) {
      if (!str) return '';
      return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    },

    getSlugFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get('slug') || params.get('id') || '';
    },
  };
})();
