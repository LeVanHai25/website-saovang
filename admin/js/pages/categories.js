/**
 * Admin JS — Categories Manager page
 * CRUD danh mục cho: project, product, article, service
 */

const CAT_TYPES = [
  { value: 'project',  label: 'Dự Án',        icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { value: 'product',  label: 'Sản Phẩm',      icon: '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>' },
  { value: 'article',  label: 'Bài Viết',      icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>' },
  { value: 'service',  label: 'Dịch Vụ',       icon: '<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M4.93 4.93l1.41 1.41M21 12h-2M5 12H3M12 21v-2M12 5V3"/>' },
];

let _activeCatType = 'project';

async function renderCategories() {
  App.setBreadcrumb('Quản lý Danh mục');
  const wrap = document.getElementById('pageWrapper');
  wrap.innerHTML = `
  <div class="page">
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Quản lý Danh mục</h1>
        <p class="page-subtitle">Tổ chức nội dung theo nhóm cho website</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" id="addCatBtn">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Thêm danh mục
        </button>
      </div>
    </div>

    <!-- Type tabs -->
    <div class="tabs" id="catTypeTabs">
      ${CAT_TYPES.map(t => `
        <button class="tab-btn ${t.value === _activeCatType ? 'active' : ''}" data-type="${t.value}">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">${t.icon}</svg>
          ${t.label}
        </button>`).join('')}
    </div>

    <div id="catContent">
      <div class="page-loading"><div class="spinner"></div></div>
    </div>
  </div>`;

  // Tab switching
  document.querySelectorAll('#catTypeTabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _activeCatType = btn.dataset.type;
      document.querySelectorAll('#catTypeTabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadCategories();
    });
  });

  document.getElementById('addCatBtn').addEventListener('click', () => showCategoryModal());
  await loadCategories();
}

async function loadCategories() {
  const container = document.getElementById('catContent');
  try {
    const cats = await API.categories.list(_activeCatType);
    const typeLabel = CAT_TYPES.find(t => t.value === _activeCatType)?.label || _activeCatType;

    if (!cats.length) {
      container.innerHTML = `
        <div class="empty-state" style="margin-top:32px">
          <div class="empty-state-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg></div>
          <h3>Chưa có danh mục ${typeLabel}</h3>
          <p>Tạo danh mục đầu tiên để phân loại nội dung</p>
          <button class="btn btn-primary" onclick="showCategoryModal()">+ Tạo danh mục</button>
        </div>`;
      return;
    }

    container.innerHTML = `
      <div class="cat-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-top:8px">
        ${cats.map(cat => `
          <div class="cat-card" style="background:var(--bg-2);border:1.5px solid var(--border);border-radius:var(--radius);padding:20px;position:relative;transition:all var(--t)">
            <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:${Utils.esc(cat.color||'#c8860a')};border-radius:var(--radius) 0 0 var(--radius)"></div>
            <div style="display:flex;align-items:flex-start;gap:12px;padding-left:8px">
              <div style="width:42px;height:42px;border-radius:8px;background:${Utils.esc(cat.color||'#c8860a')}22;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="${Utils.esc(cat.color||'#c8860a')}" stroke-width="2">
                  ${CAT_TYPES.find(t=>t.value===_activeCatType)?.icon||''}
                </svg>
              </div>
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                  <strong style="font-size:15px;color:var(--text-primary)">${Utils.esc(cat.name)}</strong>
                  ${cat.is_active ? '' : '<span class="badge badge-archived" style="font-size:10px">Ẩn</span>'}
                </div>
                <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">
                  <code class="code-mono" style="font-size:11px">${Utils.esc(cat.slug)}</code>
                </div>
                ${cat.description ? `<p style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;line-height:1.5">${Utils.esc(cat.description)}</p>` : ''}
                <div style="display:flex;align-items:center;justify-content:space-between">
                  <span style="font-size:12px;color:var(--text-muted)">
                    <strong style="color:var(--gold)">${cat.item_count||0}</strong> nội dung
                  </span>
                  <div style="display:flex;gap:4px">
                    <button class="btn btn-ghost btn-sm" onclick="showCategoryModal(${JSON.stringify(cat).replace(/"/g,'&quot;')})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory(${cat.id},'${Utils.esc(cat.name)}',${cat.item_count||0})">Xóa</button>
                  </div>
                </div>
              </div>
            </div>
          </div>`).join('')}
      </div>
      <div style="margin-top:16px;font-size:12px;color:var(--text-muted)">
        ${cats.length} danh mục · Kéo thả để sắp xếp (tính năng sắp có)
      </div>`;
  } catch (e) { Toast.error(e.message); }
}

function showCategoryModal(rawCat = null) {
  const cat = typeof rawCat === 'string'
    ? JSON.parse(rawCat.replace(/&quot;/g, '"'))
    : rawCat;

  const typeLabel = CAT_TYPES.find(t => t.value === _activeCatType)?.label || _activeCatType;

  Modal.open({
    title: cat ? `Sửa danh mục: ${cat.name}` : `Thêm danh mục ${typeLabel}`,
    body: `
      <div class="form-row" style="margin-bottom:14px">
        <div class="field-group">
          <label class="field-label">Tên danh mục <span class="req">*</span></label>
          <input type="text" id="catName" class="field-input" value="${Utils.esc(cat?.name||'')}" placeholder="Ví dụ: Du thuyền" oninput="autoCatSlug()" />
        </div>
        <div class="field-group">
          <label class="field-label">Slug (URL)</label>
          <input type="text" id="catSlug" class="field-input" value="${Utils.esc(cat?.slug||'')}" placeholder="du-thuyen" />
        </div>
      </div>
      <div class="field-group" style="margin-bottom:14px">
        <label class="field-label">Mô tả ngắn</label>
        <input type="text" id="catDesc" class="field-input" value="${Utils.esc(cat?.description||'')}" placeholder="Mô tả danh mục này..." />
      </div>
      <div class="form-row" style="margin-bottom:14px">
        <div class="field-group">
          <label class="field-label">Màu nhận diện</label>
          <div style="display:flex;gap:8px;align-items:center">
            <input type="color" id="catColor" value="${cat?.color||'#c8860a'}" style="width:44px;height:36px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-3);cursor:pointer;padding:2px" />
            <input type="text" id="catColorHex" class="field-input" value="${cat?.color||'#c8860a'}" placeholder="#c8860a" style="flex:1" oninput="syncColorInput()" />
          </div>
          <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
            ${['#8B0000','#c8860a','#1a3a5c','#2d5a27','#4a4a4a','#7B3F00','#0d4e8a','#5d3a7a'].map(c =>
              `<button type="button" onclick="setColorPreset('${c}')" style="width:24px;height:24px;border-radius:4px;background:${c};border:2px solid transparent;cursor:pointer;transition:all .2s" title="${c}"></button>`
            ).join('')}
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Thứ tự hiển thị</label>
          <input type="number" id="catOrder" class="field-input" value="${cat?.sort_order||0}" min="0" />
          <label class="field-label" style="margin-top:12px">
            <label class="toggle-switch">
              <span class="toggle">
                <input type="checkbox" id="catActive" ${(cat?.is_active??1)?'checked':''} />
                <span class="toggle-slider"></span>
              </span>
              <span class="toggle-label">Hiện trên website</span>
            </label>
          </label>
        </div>
      </div>
      <div style="background:var(--bg-3);border-radius:var(--radius);padding:12px;display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;border-radius:6px;background:var(--catPreviewColor,#c8860a)22;display:flex;align-items:center;justify-content:center" id="catPreviewBox">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--catPreviewColor,#c8860a)" stroke-width="2" id="catPreviewIcon">
            ${CAT_TYPES.find(t=>t.value===_activeCatType)?.icon||''}
          </svg>
        </div>
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--text-primary)" id="catPreviewName">${Utils.esc(cat?.name||'Tên danh mục')}</div>
          <div style="font-size:11px;color:var(--text-muted)" id="catPreviewSlug">${cat?.slug||'slug-url'}</div>
        </div>
      </div>`,
    footer: `
      <button class="btn btn-secondary" onclick="Modal.close()">Hủy</button>
      <button class="btn btn-primary" onclick="saveCategory(${cat?.id||'null'})">
        ${cat ? 'Cập nhật' : 'Tạo danh mục'}
      </button>`,
  });

  // Live preview sync
  setTimeout(() => {
    const colorInput = document.getElementById('catColor');
    colorInput?.addEventListener('input', e => {
      document.getElementById('catColorHex').value = e.target.value;
      updateCatPreview();
    });
    document.getElementById('catName')?.addEventListener('input', updateCatPreview);
    updateCatPreview();
  }, 50);
}

function autoCatSlug() {
  const nameEl = document.getElementById('catName');
  const slugEl = document.getElementById('catSlug');
  if (!nameEl || !slugEl) return;
  slugEl.value = Utils.slugify(nameEl.value);
  updateCatPreview();
}

function syncColorInput() {
  const hex = document.getElementById('catColorHex')?.value;
  if (/^#[0-9a-f]{6}$/i.test(hex)) {
    const el = document.getElementById('catColor');
    if (el) el.value = hex;
    updateCatPreview();
  }
}

function setColorPreset(color) {
  const c = document.getElementById('catColor');
  const h = document.getElementById('catColorHex');
  if (c) c.value = color;
  if (h) h.value = color;
  updateCatPreview();
}

function updateCatPreview() {
  const name  = document.getElementById('catName')?.value || 'Tên danh mục';
  const slug  = document.getElementById('catSlug')?.value || 'slug-url';
  const color = document.getElementById('catColor')?.value || '#c8860a';
  const nameEl  = document.getElementById('catPreviewName');
  const slugEl  = document.getElementById('catPreviewSlug');
  const boxEl   = document.getElementById('catPreviewBox');
  const iconEl  = document.getElementById('catPreviewIcon');
  if (nameEl) nameEl.textContent = name;
  if (slugEl) slugEl.textContent = slug;
  if (boxEl)  boxEl.style.background = color + '22';
  if (iconEl) iconEl.style.setProperty('stroke', color);
}

async function saveCategory(id) {
  const name  = document.getElementById('catName')?.value?.trim();
  const slug  = document.getElementById('catSlug')?.value?.trim();
  if (!name) return Toast.warning('Nhập tên danh mục');

  const payload = {
    name, slug: slug || Utils.slugify(name),
    content_type:  _activeCatType,
    description:   document.getElementById('catDesc')?.value || '',
    color:         document.getElementById('catColor')?.value || '#c8860a',
    sort_order:    parseInt(document.getElementById('catOrder')?.value || 0),
    is_active:     document.getElementById('catActive')?.checked ? 1 : 0,
  };

  try {
    if (id) await API.categories.update(id, payload);
    else    await API.categories.create(payload);
    Toast.success(id ? 'Đã cập nhật danh mục!' : 'Đã tạo danh mục!');
    Modal.close();
    await loadCategories();
  } catch (e) { Toast.error(e.message); }
}

async function deleteCategory(id, name, count) {
  if (count > 0) {
    Modal.open({
      title: 'Không thể xóa',
      body: `<div class="empty-state"><p>Danh mục <strong>${Utils.esc(name)}</strong> đang được dùng bởi <strong>${count} nội dung</strong>. Hãy chuyển nội dung sang danh mục khác trước khi xóa.</p></div>`,
    });
    return;
  }
  Modal.confirm(`Xóa danh mục "<strong>${Utils.esc(name)}</strong>"?`, async () => {
    try {
      await API.categories.delete(id);
      Toast.success('Đã xóa danh mục');
      await loadCategories();
    } catch (e) { Toast.error(e.message); }
  });
}

window.renderCategories  = renderCategories;
window.showCategoryModal = showCategoryModal;
window.saveCategory      = saveCategory;
window.deleteCategory    = deleteCategory;
window.autoCatSlug       = autoCatSlug;
window.syncColorInput    = syncColorInput;
window.setColorPreset    = setColorPreset;
window.updateCatPreview  = updateCatPreview;
