/**
 * API Client — Centralized HTTP layer for Admin Studio
 */
const API = (() => {
  const BASE = '/api';

  function getToken() {
    return localStorage.getItem('sv_token') || '';
  }

  async function request(method, path, body = null, isFormData = false) {
    const headers = { Authorization: `Bearer ${getToken()}` };
    if (body && !isFormData) headers['Content-Type'] = 'application/json';

    const opts = { method, headers };
    if (body) opts.body = isFormData ? body : JSON.stringify(body);

    const res = await fetch(BASE + path, opts);

    if (res.status === 401) {
      localStorage.removeItem('sv_token');
      localStorage.removeItem('sv_user');
      window.location.hash = '#/login';
      window.App?.showLogin();
      throw new Error('Session expired');
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  return {
    get:    (path)         => request('GET',    path),
    post:   (path, body)   => request('POST',   path, body),
    put:    (path, body)   => request('PUT',    path, body),
    del:    (path)         => request('DELETE', path),
    upload: (path, fd)     => request('POST',   path, fd, true),

    auth: {
      login:          (email, password) => request('POST', '/auth/login', { email, password }),
      me:             ()                => request('GET',  '/auth/me'),
      logout:         ()                => request('POST', '/auth/logout'),
      changePassword: (b)               => request('PUT',  '/auth/change-password', b),
    },
    content: {
      list:      (q = {}) => request('GET', '/content?' + new URLSearchParams(q)),
      stats:     ()       => request('GET', '/content/stats'),
      get:       (id)     => request('GET', `/content/${id}`),
      create:    (b)      => request('POST',   '/content', b),
      update:    (id, b)  => request('PUT',    `/content/${id}`, b),
      delete:    (id)     => request('DELETE', `/content/${id}`),
      publish:   (id)     => request('POST',   `/content/${id}/publish`),
      duplicate: (id)     => request('POST',   `/content/${id}/duplicate`),
    },
    assets: {
      list:       (q = {}) => request('GET', '/assets?' + new URLSearchParams(q)),
      stats:      ()       => request('GET', '/assets/stats/summary'),
      folders:    ()       => request('GET', '/assets/folders'),
      get:        (id)     => request('GET', `/assets/${id}`),
      upload:     (fd)     => request('POST',   '/assets/upload', fd, true),
      update:     (id, b)  => request('PUT',    `/assets/${id}`, b),
      delete:     (id)     => request('DELETE', `/assets/${id}`),
      replace:    (id, fd) => request('POST',   `/assets/${id}/replace`, fd, true),
      convertWebp:(id, q)  => request('POST',   `/assets/${id}/convert-webp`, { quality: q }),
      crop:       (id, b)  => request('POST',   `/assets/${id}/crop`, b),
      createFolder: (b)    => request('POST',   '/assets/folders', b),
    },
    revisions: {
      list:    (cid)     => request('GET',  `/revisions/${cid}`),
      restore: (cid, v)  => request('POST', `/revisions/${cid}/restore/${v}`),
    },
    workflow: {
      log:        (cid) => request('GET',  `/workflow/${cid}`),
      transition: (cid, b) => request('POST', `/workflow/${cid}/transition`, b),
    },
    forms: {
      list:        ()      => request('GET', '/forms'),
      get:         (id)    => request('GET', `/forms/${id}`),
      create:      (b)     => request('POST', '/forms', b),
      update:      (id, b) => request('PUT',  `/forms/${id}`, b),
      delete:      (id)    => request('DELETE', `/forms/${id}`),
      submissions: (id)    => request('GET', `/forms/${id}/submissions`),
    },
    links: {
      list:   ()       => request('GET', '/links'),
      create: (b)      => request('POST', '/links', b),
      update: (id, b)  => request('PUT',  `/links/${id}`, b),
      delete: (id)     => request('DELETE', `/links/${id}`),
    },
    users: {
      list:   ()       => request('GET', '/users'),
      create: (b)      => request('POST', '/users', b),
      update: (id, b)  => request('PUT',  `/users/${id}`, b),
      delete: (id)     => request('DELETE', `/users/${id}`),
    },
    settings: {
      get:    (group) => request('GET', '/settings' + (group ? `?group=${group}` : '')),
      update: (b)     => request('PUT', '/settings', b),
    },
    categories: {
      list:   (type)   => request('GET', `/categories${type ? `?type=${type}` : ''}`),
      create: (b)      => request('POST', '/categories', b),
      update: (id, b)  => request('PUT', `/categories/${id}`, b),
      delete: (id)     => request('DELETE', `/categories/${id}`),
      uploadLogo: (formData) => request('POST', '/categories/logo-upload', formData, true),
    },
    search: (q) => request('GET', `/search?q=${encodeURIComponent(q)}`),
    health: ()  => request('GET', '/health').catch(() => null),
  };
})();

window.API = API;
