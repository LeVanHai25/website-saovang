/** Content List Page — Universal Content Manager */
let contentPage = 1, contentFilters = {};

async function renderContentList() {
  App.setBreadcrumb('Quản lý nội dung');
  const wrap = document.getElementById('pageWrapper');
  wrap.innerHTML = `<div class="page">
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Quản lý Nội Dung</h1>
        <p class="page-subtitle">Tất cả bài viết, trang, sản phẩm, dự án và dịch vụ</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showNewContentModal()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tạo mới
        </button>
      </div>
    </div>

    <div class="filter-bar" style="margin-bottom:18px">
      <div class="search-input-wrap">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Tìm kiếm tiêu đề..." id="contentSearch" />
      </div>
      <select class="filter-select" id="filterType">
        <option value="">Tất cả loại</option>
        <option value="page">Trang</option>
        <option value="article">Bài viết</option>
        <option value="product">Sản phẩm</option>
        <option value="project">Dự án</option>
        <option value="service">Dịch vụ</option>
        <option value="hero">Hero Banner</option>
        <option value="popup">Popup</option>
        <option value="download">Tải về</option>
      </select>
      <select class="filter-select" id="filterStatus">
        <option value="">Tất cả trạng thái</option>
        <option value="published">Đã đăng</option>
        <option value="draft">Nháp</option>
        <option value="review">Chờ duyệt</option>
        <option value="archived">Lưu trữ</option>
      </select>
    </div>

    <div class="table-wrap">
      <table class="data-table" id="contentTable">
        <thead><tr>
          <th style="width:36px"><input type="checkbox" id="selectAll" /></th>
          <th>Tiêu đề</th><th>Loại</th><th>Trạng thái</th>
          <th>Tác giả</th><th>Cập nhật</th><th style="width:120px">Thao tác</th>
        </tr></thead>
        <tbody id="contentBody"><tr><td colspan="7" style="text-align:center;padding:40px"><div class="spinner" style="margin:0 auto"></div></td></tr></tbody>
      </table>
    </div>
    <div id="contentPagination" style="display:flex;justify-content:center;padding:20px 0"></div>
  </div>`;

  // Bulk actions bar
  const bulkBar = document.createElement('div');
  bulkBar.id = 'bulkBar';
  bulkBar.className = 'hidden';
  bulkBar.style.cssText = 'position:sticky;bottom:0;background:var(--bg-2);border-top:1px solid var(--border);padding:12px 32px;display:flex;align-items:center;gap:12px;z-index:10';
  bulkBar.innerHTML = `
    <span id="bulkCount" style="font-size:13px;font-weight:600;color:var(--text-secondary)"></span>
    <button class="btn btn-secondary btn-sm" onclick="bulkPublish()">Xuất bản</button>
    <button class="btn btn-danger btn-sm" onclick="bulkDelete()">Xóa</button>
    <button class="btn btn-ghost btn-sm" onclick="clearSelection()">Bỏ chọn</button>
  `;
  wrap.querySelector('.page').appendChild(bulkBar);

  await loadContent();

  // Search
  const searchDebounced = Utils.debounce(() => { contentFilters.search = document.getElementById('contentSearch').value; contentPage = 1; loadContent(); }, 350);
  document.getElementById('contentSearch').addEventListener('input', searchDebounced);
  document.getElementById('filterType').addEventListener('change', e => { contentFilters.type = e.target.value; contentPage = 1; loadContent(); });
  document.getElementById('filterStatus').addEventListener('change', e => { contentFilters.status = e.target.value; contentPage = 1; loadContent(); });
  document.getElementById('selectAll').addEventListener('change', e => {
    document.querySelectorAll('.row-check').forEach(cb => cb.checked = e.target.checked);
    updateBulkBar();
  });
}

async function loadContent() {
  try {
    const { data, total, pages } = await API.content.list({ ...contentFilters, page: contentPage, limit: 18, sort: 'updated_at', order: 'desc' });
    const tbody = data.map(c => `
      <tr>
        <td><input type="checkbox" class="row-check" value="${c.id}" onchange="updateBulkBar()" /></td>
        <td class="title-cell">
          <a href="#/content/${c.id}">${Utils.esc(Utils.truncate(c.title, 50))}</a>
          ${c.slug ? `<div style="font-size:11px;color:var(--text-muted);margin-top:2px;font-family:var(--ff-mono)">/${c.slug}</div>` : ''}
        </td>
        <td>${Utils.typeBadge(c.type)}</td>
        <td>${Utils.statusBadge(c.status)}</td>
        <td style="font-size:12px;color:var(--text-muted)">${Utils.esc(c.author_name || '—')}</td>
        <td style="font-size:12px;color:var(--text-muted);white-space:nowrap">${Utils.timeAgo(c.updated_at)}</td>
        <td>
          <div style="display:flex;gap:4px">
            <a href="#/content/${c.id}" class="btn btn-ghost btn-icon btn-sm" title="Sửa">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </a>
            ${c.status !== 'published' ? `
            <button class="btn btn-ghost btn-icon btn-sm" title="Xuất bản" onclick="quickPublish(${c.id}, this)">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </button>` : ''}
            <button class="btn btn-ghost btn-icon btn-sm" title="Nhân bản" onclick="duplicateContent(${c.id})">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            </button>
            <button class="btn btn-ghost btn-icon btn-sm danger" title="Xóa" onclick="deleteContent(${c.id}, '${Utils.esc(c.title)}')">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--red-light)" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('') || `<tr><td colspan="7"><div class="empty-state">
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
      <h3>Chưa có nội dung</h3><p>Tạo nội dung mới để bắt đầu</p>
    </div></td></tr>`;

    document.getElementById('contentBody').innerHTML = tbody;
    document.getElementById('contentPagination').innerHTML = pages > 1 ? Utils.paginationHTML(contentPage, pages) : '';
    document.getElementById('contentPagination').querySelectorAll('.page-btn').forEach(btn => {
      btn.onclick = () => { contentPage = parseInt(btn.dataset.page); loadContent(); };
    });
  } catch (e) {
    Toast.error('Không thể tải danh sách nội dung: ' + e.message);
  }
}

function showNewContentModal() {
  const types = [
    ['page','Trang'],['article','Bài viết'],['product','Sản phẩm'],
    ['project','Dự án'],['service','Dịch vụ'],['hero','Hero Banner'],
    ['popup','Popup'],['download','Tải về'],['gallery','Thư viện ảnh'],['video','Video'],
  ];
  Modal.open({
    title: 'Tạo nội dung mới',
    body: `
      <div style="margin-bottom:16px">
        <label class="field-label">Chọn loại nội dung</label>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px">
          ${types.map(([v,l]) => `
            <label style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--bg-3);border:1.5px solid var(--border);border-radius:var(--radius-sm);cursor:pointer;transition:all .15s"
              onmouseover="this.style.borderColor='var(--gold)'" onmouseout="if(!this.querySelector('input').checked)this.style.borderColor='var(--border)'">
              <input type="radio" name="newType" value="${v}" style="accent-color:var(--gold)" />
              <span style="font-size:13px;font-weight:500;color:var(--text-primary)">${l}</span>
            </label>
          `).join('')}
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">Tiêu đề <span class="req">*</span></label>
        <input type="text" id="newContentTitle" class="field-input" placeholder="Nhập tiêu đề..." />
      </div>
    `,
    footer: `
      <button class="btn btn-secondary" onclick="Modal.close()">Hủy</button>
      <button class="btn btn-primary" onclick="createNewContent()">Tạo & Mở Editor</button>
    `,
  });
}

async function createNewContent() {
  const type  = document.querySelector('input[name="newType"]:checked')?.value;
  const title = document.getElementById('newContentTitle')?.value?.trim();
  if (!type) return Toast.warning('Chọn loại nội dung');
  if (!title) return Toast.warning('Nhập tiêu đề');
  try {
    const { id } = await API.content.create({ type, title });
    Modal.close();
    Toast.success('Đã tạo nội dung!');
    window.location.hash = `#/content/${id}`;
  } catch (e) { Toast.error(e.message); }
}

async function quickPublish(id, btn) {
  try {
    await API.content.publish(id);
    Toast.success('Đã xuất bản!');
    loadContent();
  } catch (e) { Toast.error(e.message); }
}

async function duplicateContent(id) {
  try {
    const { id: newId } = await API.content.duplicate(id);
    Toast.success('Đã nhân bản nội dung!');
    window.location.hash = `#/content/${newId}`;
  } catch (e) { Toast.error(e.message); }
}

function deleteContent(id, title) {
  Modal.confirm(`Xóa "<strong>${Utils.esc(title)}</strong>"? Hành động này không thể hoàn tác.`, async () => {
    try {
      await API.content.delete(id);
      Toast.success('Đã xóa nội dung');
      loadContent();
    } catch (e) { Toast.error(e.message); }
  });
}

function getSelectedIds() {
  return [...document.querySelectorAll('.row-check:checked')].map(cb => cb.value);
}

function updateBulkBar() {
  const ids = getSelectedIds();
  const bar = document.getElementById('bulkBar');
  bar.classList.toggle('hidden', ids.length === 0);
  const el = document.getElementById('bulkCount');
  if (el) el.textContent = `Đã chọn ${ids.length} mục`;
}

async function bulkPublish() {
  const ids = getSelectedIds();
  if (!ids.length) return;
  try {
    await Promise.all(ids.map(id => API.content.publish(id)));
    Toast.success(`Đã xuất bản ${ids.length} mục`);
    clearSelection(); loadContent();
  } catch (e) { Toast.error(e.message); }
}

async function bulkDelete() {
  const ids = getSelectedIds();
  if (!ids.length) return;
  Modal.confirm(`Xóa ${ids.length} mục đã chọn? Hành động này không thể hoàn tác.`, async () => {
    try {
      await Promise.all(ids.map(id => API.content.delete(id)));
      Toast.success(`Đã xóa ${ids.length} mục`);
      clearSelection(); loadContent();
    } catch (e) { Toast.error(e.message); }
  });
}

function clearSelection() {
  document.querySelectorAll('.row-check, #selectAll').forEach(cb => cb.checked = false);
  updateBulkBar();
}

window.renderContentList = renderContentList;
window.showNewContentModal = showNewContentModal;
window.createNewContent = createNewContent;
window.quickPublish = quickPublish;
window.duplicateContent = duplicateContent;
window.deleteContent = deleteContent;
window.updateBulkBar = updateBulkBar;
window.bulkPublish = bulkPublish;
window.bulkDelete = bulkDelete;
window.clearSelection = clearSelection;
