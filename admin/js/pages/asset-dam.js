/** Asset DAM — Digital Asset Management */
let _damFolder = null, _damView = 'grid', _damPage = 1, _damSearch = '';

async function renderAssetDAM() {
  App.setBreadcrumb('Thư viện Media');
  const wrap = document.getElementById('pageWrapper');
  wrap.innerHTML = `<div class="page">
    <div class="page-header">
      <div class="page-header-left"><h1 class="page-title">Thư viện Media — DAM</h1><p class="page-subtitle">Quản lý hình ảnh, video, tài liệu và file CAD</p></div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="showCreateFolderModal()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
          Thư mục mới
        </button>
        <button class="btn btn-primary" onclick="showUploadModal()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
          Upload
        </button>
      </div>
    </div>

    <div class="asset-layout">
      <!-- Folder sidebar -->
      <div class="asset-sidebar" id="folderSidebar">
        <div class="asset-sidebar-title">Thư mục</div>
        <div class="folder-item ${!_damFolder?'active':''}" onclick="setDamFolder(null)">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
          Tất cả
        </div>
        <div id="folderList"><div class="spinner" style="margin:16px auto"></div></div>
      </div>

      <!-- Main area -->
      <div class="asset-main">
        <div class="asset-toolbar">
          <div class="search-input-wrap" style="flex:1;max-width:300px">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Tìm file..." id="assetSearch" value="${_damSearch}" />
          </div>
          <select class="filter-select" id="assetTypeFilter">
            <option value="">Tất cả loại</option>
            <option value="image">Hình ảnh</option>
            <option value="video">Video</option>
            <option value="document">Tài liệu</option>
            <option value="archive">File nén</option>
            <option value="other">Khác (CAD)</option>
          </select>
          <div style="margin-left:auto;display:flex;gap:4px">
            <button class="btn btn-ghost btn-icon ${_damView==='grid'?'active':''}" onclick="setDamView('grid')" title="Grid">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>
            <button class="btn btn-ghost btn-icon ${_damView==='list'?'active':''}" onclick="setDamView('list')" title="List">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Dropzone / Upload area -->
        <div class="dropzone" id="dropZone" style="margin:16px;display:none">
          <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
          <h3>Thả file vào đây</h3>
          <p>Hỗ trợ: JPG, PNG, WebP, SVG, PDF, DOCX, XLSX, MP4, ZIP, DWG, 3DM</p>
        </div>

        <div id="assetGrid" class="${_damView === 'grid' ? 'asset-grid' : 'asset-list'}" style="min-height:200px">
          <div class="page-loading"><div class="spinner"></div></div>
        </div>
        <div id="assetPagination" style="display:flex;justify-content:center;padding:16px"></div>
      </div>
    </div>
  </div>`;

  await loadFolders();
  await loadAssets();

  // Search
  const searchDeb = Utils.debounce(() => { _damSearch = document.getElementById('assetSearch').value; _damPage = 1; loadAssets(); }, 350);
  document.getElementById('assetSearch').addEventListener('input', searchDeb);
  document.getElementById('assetTypeFilter').addEventListener('change', () => loadAssets());

  // Global drag-drop
  const page = wrap.querySelector('.page');
  page.addEventListener('dragover', e => { e.preventDefault(); document.getElementById('dropZone').style.display = 'flex'; });
  page.addEventListener('dragleave', e => { if (!page.contains(e.relatedTarget)) document.getElementById('dropZone').style.display = 'none'; });
  page.addEventListener('drop', e => { e.preventDefault(); document.getElementById('dropZone').style.display = 'none'; handleFileDrop(e.dataTransfer.files); });
}

async function loadFolders() {
  try {
    const folders = await API.assets.folders();
    document.getElementById('folderList').innerHTML = folders.map(f => `
      <div class="folder-item ${_damFolder===f.id?'active':''}" onclick="setDamFolder(${f.id})">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="${_damFolder===f.id?'var(--gold)':'none'}" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
        ${Utils.esc(f.name)}
        <span class="folder-count">${f.asset_count || 0}</span>
      </div>`).join('');
  } catch {}
}

async function loadAssets() {
  const q = { page: _damPage, limit: 30, search: _damSearch };
  if (_damFolder) q.folder_id = _damFolder;
  const type = document.getElementById('assetTypeFilter')?.value;
  if (type) q.type = type;

  try {
    const { data, total, pages } = await API.assets.list(q);
    const grid = document.getElementById('assetGrid');
    grid.className = _damView === 'grid' ? 'asset-grid' : 'asset-list';

    if (!data.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <h3>Không có file nào</h3><p>Upload file hoặc chọn thư mục khác</p>
      </div>`;
    } else if (_damView === 'grid') {
      grid.innerHTML = data.map(a => `
        <div class="asset-card" onclick="previewAsset(${a.id})">
          <div class="asset-thumb">
            ${a.type === 'image' ? `<img src="${a.thumb_url || a.url}" alt="${Utils.esc(a.alt||a.name)}" loading="lazy" />` : `<div style="color:var(--gold)">${Utils.fileIcon(a.type)}</div>`}
          </div>
          <div class="asset-info">
            <div class="asset-name" title="${Utils.esc(a.original_name)}">${Utils.esc(Utils.truncate(a.original_name, 22))}</div>
            <div class="asset-size">${Utils.formatBytes(a.size)} · ${a.type}</div>
          </div>
        </div>`).join('');
    } else {
      grid.innerHTML = `
        <table class="data-table">
          <thead><tr><th>Tên file</th><th>Loại</th><th>Kích thước</th><th>Ngày upload</th><th>Thao tác</th></tr></thead>
          <tbody>${data.map(a => `
            <tr>
              <td class="title-cell" style="display:flex;align-items:center;gap:10px">
                ${a.type==='image' ? `<img src="${a.thumb_url||a.url}" style="width:36px;height:36px;object-fit:cover;border-radius:4px" />` : `<span style="color:var(--gold)">${Utils.fileIcon(a.type)}</span>`}
                <span>${Utils.esc(Utils.truncate(a.original_name, 40))}</span>
              </td>
              <td><span class="badge badge-${a.type}">${a.type}</span></td>
              <td>${Utils.formatBytes(a.size)}</td>
              <td>${Utils.formatDate(a.created_at)}</td>
              <td><div style="display:flex;gap:4px">
                <button class="btn btn-ghost btn-icon btn-sm" onclick="copyAssetUrl('${Utils.esc(a.url)}')" title="Copy URL"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg></button>
                <button class="btn btn-ghost btn-icon btn-sm danger" onclick="deleteAsset(${a.id},'${Utils.esc(a.name)}')" title="Xóa"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--red-light)" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></button>
              </div></td>
            </tr>`).join('')}
          </tbody>
        </table>`;
    }

    document.getElementById('assetPagination').innerHTML = pages > 1 ? Utils.paginationHTML(_damPage, pages) : '';
  } catch (e) { Toast.error('Không thể tải assets: ' + e.message); }
}

function setDamFolder(id) {
  _damFolder = id; _damPage = 1;
  document.querySelectorAll('.folder-item').forEach(el => el.classList.remove('active'));
  event?.target?.closest('.folder-item')?.classList.add('active');
  loadAssets();
}

function setDamView(v) { _damView = v; loadAssets(); }

function showUploadModal() {
  Modal.open({
    title: 'Upload File',
    wide: true,
    body: `
      <div class="dropzone" id="uploadDropzone" style="cursor:pointer" onclick="document.getElementById('uploadFileInput').click()">
        <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
        <h3>Thả file hoặc click để chọn</h3>
        <p>JPG, PNG, WebP, SVG, PDF, DOCX, XLSX, PPTX, MP4, MOV, ZIP, DWG, 3DM — Tối đa 100MB/file</p>
        <input type="file" id="uploadFileInput" multiple accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.dwg,.dxf,.3dm,.stl" style="display:none" onchange="handleFileSelect(this.files)" />
      </div>
      <div id="uploadProgress" style="margin-top:14px;display:none">
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:8px" id="uploadProgressMsg">Đang upload...</div>
        <div style="background:var(--bg-4);border-radius:4px;height:6px"><div id="uploadProgressBar" style="background:var(--gold);height:6px;border-radius:4px;transition:width .3s;width:0%"></div></div>
      </div>
      <div id="uploadResults" style="margin-top:12px"></div>
    `,
    footer: `<button class="btn btn-secondary" onclick="Modal.close()">Đóng</button>`,
  });

  // Drag-drop
  const dz = document.getElementById('uploadDropzone');
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragging'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('dragging'));
  dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('dragging'); handleFileDrop(e.dataTransfer.files); });
}

async function handleFileDrop(files) { await uploadFiles(files); }
async function handleFileSelect(files) { await uploadFiles(files); }

async function uploadFiles(files) {
  const fd = new FormData();
  [...files].forEach(f => fd.append('files', f));
  if (_damFolder) fd.append('folder_id', _damFolder);

  const progressEl = document.getElementById('uploadProgress');
  const barEl = document.getElementById('uploadProgressBar');
  const msgEl = document.getElementById('uploadProgressMsg');
  const resultsEl = document.getElementById('uploadResults');

  if (progressEl) { progressEl.style.display = 'block'; }
  if (barEl) barEl.style.width = '30%';
  if (msgEl) msgEl.textContent = `Đang upload ${files.length} file(s)...`;

  try {
    const results = await API.assets.upload(fd);
    if (barEl) barEl.style.width = '100%';
    if (msgEl) msgEl.textContent = `Hoàn thành!`;

    const html = results.map(r => `
      <div style="display:flex;align-items:center;gap:10px;padding:8px;background:var(--bg-3);border-radius:4px;margin-bottom:6px">
        ${r.type==='image' && r.thumb_url ? `<img src="${r.thumb_url}" style="width:36px;height:36px;object-fit:cover;border-radius:3px" />` : `<span style="color:var(--gold)">${Utils.fileIcon(r.type)}</span>`}
        <div style="flex:1;min-width:0">
          <div style="font-size:12.5px;font-weight:500;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Utils.esc(r.original_name)}</div>
          <div style="font-size:11px;color:var(--text-muted)">${Utils.formatBytes(r.size)} ${r.duplicate ? '<span style="color:var(--yellow)">· Trùng lặp</span>' : ''}</div>
        </div>
        <span style="color:var(--green)"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></span>
      </div>`).join('');

    if (resultsEl) resultsEl.innerHTML = html;
    Toast.success(`Đã upload ${results.length} file(s)`);
    loadAssets();
  } catch (e) {
    if (msgEl) msgEl.textContent = 'Upload thất bại: ' + e.message;
    Toast.error(e.message);
  }
}

async function previewAsset(id) {
  try {
    const asset = await API.assets.get(id);
    Modal.open({
      title: Utils.esc(asset.original_name),
      wide: true,
      body: `
        <div style="display:grid;grid-template-columns:1fr 240px;gap:20px;align-items:start">
          <div>
            ${asset.type === 'image'
              ? `<img src="${asset.url}" style="width:100%;border-radius:6px;max-height:400px;object-fit:contain;background:var(--bg-4)" />`
              : asset.type === 'video'
              ? `<video controls style="width:100%;border-radius:6px"><source src="${asset.url}" /></video>`
              : `<div style="padding:48px;text-align:center;background:var(--bg-3);border-radius:6px">${Utils.fileIcon(asset.type)}<div style="margin-top:12px;font-size:13px;color:var(--text-muted)">${Utils.esc(asset.original_name)}</div></div>`}
          </div>
          <div style="display:flex;flex-direction:column;gap:12px">
            <div>
              <div class="field-label" style="margin-bottom:4px">URL</div>
              <code class="code-mono" style="font-size:10.5px;word-break:break-all">${asset.url}</code>
            </div>
            ${asset.webp_url ? `<div><div class="field-label" style="margin-bottom:4px">WebP URL</div><code class="code-mono" style="font-size:10.5px;word-break:break-all">${asset.webp_url}</code></div>` : ''}
            <div><span class="badge badge-${asset.type}">${asset.type}</span></div>
            ${asset.width ? `<div style="font-size:12px;color:var(--text-muted)">${asset.width} × ${asset.height} px</div>` : ''}
            <div style="font-size:12px;color:var(--text-muted)">${Utils.formatBytes(asset.size)}</div>
            <div style="font-size:12px;color:var(--text-muted)">v${asset.version}</div>
            <div class="field-group"><label class="field-label">Alt text</label><input type="text" id="assetAlt" class="field-input" value="${Utils.esc(asset.alt||'')}" /></div>
            <div class="field-group"><label class="field-label">Caption</label><input type="text" id="assetCaption" class="field-input" value="${Utils.esc(asset.caption||'')}" /></div>
            <button class="btn btn-primary btn-sm" style="justify-content:center" onclick="saveAssetMeta(${id})">Lưu thông tin</button>
            <button class="btn btn-secondary btn-sm" style="justify-content:center" onclick="copyAssetUrl('${Utils.esc(asset.url)}')">Copy URL</button>
            ${asset.type === 'image' ? `<button class="btn btn-secondary btn-sm" style="justify-content:center" onclick="convertWebP(${id})">Chuyển sang WebP</button>` : ''}
            <button class="btn btn-danger btn-sm" style="justify-content:center" onclick="deleteAsset(${id},'${Utils.esc(asset.name)}')">Xóa file</button>
          </div>
        </div>`,
    });
  } catch (e) { Toast.error(e.message); }
}

async function saveAssetMeta(id) {
  try {
    await API.assets.update(id, { alt: document.getElementById('assetAlt')?.value, caption: document.getElementById('assetCaption')?.value });
    Toast.success('Đã lưu thông tin');
  } catch (e) { Toast.error(e.message); }
}

async function copyAssetUrl(url) {
  await Utils.copy(url);
  Toast.info('Đã copy URL vào clipboard');
}

async function convertWebP(id) {
  try { await API.assets.convertWebp(id, 85); Toast.success('Đã chuyển sang WebP!'); }
  catch (e) { Toast.error(e.message); }
}

async function deleteAsset(id, name) {
  Modal.confirm(`Xóa file "<strong>${Utils.esc(name)}</strong>"?`, async () => {
    try { await API.assets.delete(id); Toast.success('Đã xóa file'); Modal.close(); loadAssets(); }
    catch (e) { Toast.error(e.message); }
  });
}

function showCreateFolderModal() {
  Modal.open({
    title: 'Tạo thư mục mới',
    body: `<div class="field-group"><label class="field-label">Tên thư mục <span class="req">*</span></label><input type="text" id="newFolderName" class="field-input" placeholder="Projects, Products, ..." /></div>`,
    footer: `
      <button class="btn btn-secondary" onclick="Modal.close()">Hủy</button>
      <button class="btn btn-primary" onclick="createFolder()">Tạo thư mục</button>`,
  });
}

async function createFolder() {
  const name = document.getElementById('newFolderName')?.value?.trim();
  if (!name) return Toast.warning('Nhập tên thư mục');
  try { await API.assets.createFolder({ name }); Toast.success('Đã tạo thư mục'); Modal.close(); loadFolders(); }
  catch (e) { Toast.error(e.message); }
}

window.renderAssetDAM = renderAssetDAM;
window.setDamFolder = setDamFolder;
window.setDamView = setDamView;
window.showUploadModal = showUploadModal;
window.handleFileDrop = handleFileDrop;
window.handleFileSelect = handleFileSelect;
window.previewAsset = previewAsset;
window.saveAssetMeta = saveAssetMeta;
window.copyAssetUrl = copyAssetUrl;
window.convertWebP = convertWebP;
window.deleteAsset = deleteAsset;
window.showCreateFolderModal = showCreateFolderModal;
window.createFolder = createFolder;
