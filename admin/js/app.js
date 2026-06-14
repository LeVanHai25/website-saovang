/**
 * Admin Studio App — SPA Router + Auth + Global State
 */
const App = (() => {
  let _user = null;
  let _searchTimeout = null;

  // ── Router ─────────────────────────────────────────────────
  const routes = {
    'dashboard':  () => renderDashboard(),
    'content':    (p) => p[1] ? renderContentEditor(p[1]) : renderContentList(),
    'blocks':     () => renderBlockBuilder(),
    'workflow':   () => renderWorkflow(),
    'assets':     () => renderAssetDAM(),
    'links':      () => renderLinkManager(),
    'forms':      () => renderFormBuilder(),
    'users':      () => renderUsers(),
    'settings':   () => renderSettings(),
    'categories': () => renderCategories(),
  };

  function navigate() {
    const hash = window.location.hash.replace(/^#\/?/, '') || 'dashboard';
    const parts = hash.split('/');
    const page  = parts[0];

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });

    // Render
    const fn = routes[page];
    if (fn) {
      showLoading();
      Promise.resolve(fn(parts)).catch(e => {
        console.error('Page error:', e);
        Toast.error('Lỗi tải trang: ' + e.message);
      });
    } else {
      renderDashboard();
    }
  }

  function showLoading() {
    const pw = document.getElementById('pageWrapper');
    if (pw) pw.innerHTML = `<div class="page-loading"><div class="spinner"></div><span>Đang tải...</span></div>`;
  }

  function setBreadcrumb(text) {
    const el = document.getElementById('topbarBreadcrumb');
    if (el) el.textContent = text;
  }

  // ── Auth ───────────────────────────────────────────────────
  async function checkAuth() {
    const token = localStorage.getItem('sv_token');
    const cachedUser = localStorage.getItem('sv_user');

    if (!token) { showLogin(); return false; }

    try {
      const { user } = await API.auth.me();
      _user = user;
      showApp(user);
      return true;
    } catch {
      showLogin();
      return false;
    }
  }

  function showLogin() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('appShell').classList.add('hidden');
  }

  function showApp(user) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appShell').classList.remove('hidden');

    // Update user info
    document.getElementById('userName').textContent  = user.name;
    document.getElementById('userRole').textContent  = user.role;
    document.getElementById('userAvatar').textContent = (user.name||'A')[0].toUpperCase();
    document.getElementById('topbarUserBadge').textContent = (user.name||'A')[0].toUpperCase();

    navigate();

    // Load branding settings to update sidebar logo
    API.settings.get('general').then(({ values }) => {
      if (values?.logo_badge) {
        const badge = document.getElementById('adminLogoBadge');
        if (badge) badge.textContent = values.logo_badge;
      }
      if (values?.company_short) {
        const name = document.getElementById('adminBrandName');
        if (name) name.textContent = values.company_short;
      }
    }).catch(() => {/* silently ignore */});
  }

  function logout() {
    API.auth.logout().catch(() => {});
    localStorage.removeItem('sv_token');
    localStorage.removeItem('sv_user');
    showLogin();
  }

  // ── Login Form ─────────────────────────────────────────────
  function initLogin() {
    document.getElementById('loginForm').addEventListener('submit', async e => {
      e.preventDefault();
      const btn = document.getElementById('loginBtn');
      const err = document.getElementById('loginError');
      btn.classList.add('loading');
      btn.querySelector('span').textContent = 'Đang đăng nhập...';
      err.classList.add('hidden');

      try {
        const { token, user } = await API.auth.login(
          document.getElementById('loginEmail').value,
          document.getElementById('loginPassword').value
        );
        localStorage.setItem('sv_token', token);
        localStorage.setItem('sv_user', JSON.stringify(user));
        _user = user;
        showApp(user);
      } catch (e) {
        err.textContent = e.message;
        err.classList.remove('hidden');
      } finally {
        btn.classList.remove('loading');
        btn.querySelector('span').textContent = 'Đăng nhập';
      }
    });

    // Toggle password visibility
    document.getElementById('togglePass').addEventListener('click', () => {
      const input = document.getElementById('loginPassword');
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  }

  // ── Sidebar toggle ─────────────────────────────────────────
  function initSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
      // Close on outside click (mobile)
      document.addEventListener('click', e => {
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== toggle) {
          sidebar.classList.remove('open');
        }
      });
    }

    document.getElementById('logoutBtn')?.addEventListener('click', logout);
  }

  // ── Search ─────────────────────────────────────────────────
  function initSearch() {
    const modal  = document.getElementById('searchModal');
    const input  = document.getElementById('searchModalInput');
    const results = document.getElementById('searchResults');

    function openSearch() { modal.classList.remove('hidden'); input.value = ''; input.focus(); results.innerHTML = `<p class="search-placeholder">Nhập để tìm kiếm...</p>`; }
    function closeSearch() { modal.classList.add('hidden'); }

    document.getElementById('topbarSearchBtn')?.addEventListener('click', openSearch);
    document.getElementById('globalSearch')?.addEventListener('focus', openSearch);
    modal?.addEventListener('click', e => { if (e.target === modal) closeSearch(); });
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape') closeSearch();
    });

    input?.addEventListener('input', Utils.debounce(async () => {
      const q = input.value.trim();
      if (q.length < 2) { results.innerHTML = `<p class="search-placeholder">Nhập ít nhất 2 ký tự...</p>`; return; }

      try {
        const { content, assets } = await API.search(q);
        let html = '';
        if (content?.length) {
          html += `<div class="search-section-label">Nội dung</div>`;
          html += content.map(c => `
            <div class="search-result-item" onclick="Modal.close?.();window.location.hash='#/content/${c.id}'">
              <div class="search-result-icon">${Utils.typeBadge(c.type)}</div>
              <div><div class="search-result-title">${Utils.esc(c.title)}</div>
              <div class="search-result-meta">${Utils.statusBadge(c.status)}&nbsp;·&nbsp;${Utils.timeAgo(c.updated_at)}</div></div>
            </div>`).join('');
        }
        if (assets?.length) {
          html += `<div class="search-section-label">Files</div>`;
          html += assets.map(a => `
            <div class="search-result-item" onclick="closeSearch();renderAssetDAM()">
              <div class="search-result-icon">${a.thumb_url ? `<img src="${a.thumb_url}" style="width:100%;height:100%;object-fit:cover;border-radius:4px" />` : Utils.fileIcon(a.type)}</div>
              <div><div class="search-result-title">${Utils.esc(a.original_name)}</div>
              <div class="search-result-meta">${Utils.formatBytes(a.size)}</div></div>
            </div>`).join('');
        }
        results.innerHTML = html || `<p class="search-placeholder">Không tìm thấy kết quả nào</p>`;
      } catch { results.innerHTML = `<p class="search-placeholder">Không thể tìm kiếm</p>`; }
    }, 350));
  }

  // ── Init ───────────────────────────────────────────────────
  function init() {
    initLogin();
    initSidebar();
    initSearch();
    window.addEventListener('hashchange', () => {
      if (localStorage.getItem('sv_token')) navigate();
    });
    checkAuth();
  }

  return { init, setBreadcrumb, showLogin, navigate, getUser: () => _user };
})();

window.App = App;
document.addEventListener('DOMContentLoaded', () => App.init());

// Pagination CSS injection
const paginationStyle = document.createElement('style');
paginationStyle.textContent = `
.pagination { display:flex;gap:4px;align-items:center; }
.page-btn { min-width:32px;height:32px;border-radius:var(--radius-sm);font-size:13px;font-weight:500;color:var(--text-secondary);background:var(--bg-3);border:1px solid var(--border);transition:all var(--t);cursor:pointer; }
.page-btn:hover { background:var(--bg-hover);color:var(--text-primary); }
.page-btn.active { background:var(--gold);color:white;border-color:var(--gold); }
.btn.active { background:var(--gold-dim);color:var(--gold-light); }
`;
document.head.appendChild(paginationStyle);
