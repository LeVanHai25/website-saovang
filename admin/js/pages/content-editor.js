/** Content Editor — Universal form + SEO + block editor integration */
let _currentContent = null;

async function renderContentEditor(id) {
  App.setBreadcrumb(id ? 'Sửa nội dung' : 'Tạo nội dung');
  const wrap = document.getElementById('pageWrapper');
  wrap.innerHTML = `<div class="page-loading"><div class="spinner"></div><span>Đang tải...</span></div>`;

  let content = { type: '', title: '', slug: '', status: 'draft', tags: [], meta: {}, blocks: [] };

  if (id) {
    try { content = await API.content.get(id); }
    catch (e) { Toast.error('Không tìm thấy nội dung'); window.location.hash = '#/content'; return; }
  }
  _currentContent = content;

  const tags = Utils.parseTags(content.tags);

  wrap.innerHTML = `
  <div class="page" style="max-width:none;display:grid;grid-template-columns:1fr 320px;gap:20px;align-items:start">
    <!-- Main column -->
    <div>
      <!-- Title -->
      <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:16px">
        <input type="text" id="ceTitle" class="field-input" placeholder="Tiêu đề nội dung..."
          style="font-size:22px;font-weight:700;border:none;background:none;padding:0;color:var(--text-primary);width:100%;outline:none"
          value="${Utils.esc(content.title)}" oninput="autoSlug(this.value)" />
        <div style="display:flex;align-items:center;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
          <span style="font-size:12px;color:var(--text-muted)">Slug:</span>
          <code id="ceSlugDisplay" style="font-size:12px;color:var(--cyan);font-family:var(--ff-mono);cursor:pointer" onclick="editSlug()">/${content.slug || '—'}</code>
          <input type="text" id="ceSlug" class="hidden field-input" style="font-size:12px;font-family:var(--ff-mono);padding:4px 8px;max-width:280px" value="${Utils.esc(content.slug)}" onblur="hideSlugEdit()" />
        </div>
      </div>

      <!-- Excerpt -->
      <div class="form-section">
        <div class="form-section-title">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
          Tóm tắt
        </div>
        <textarea id="ceExcerpt" class="field-textarea" placeholder="Mô tả ngắn gọn về nội dung này..." style="min-height:90px">${Utils.esc(content.excerpt || '')}</textarea>
      </div>

      <!-- Block Editor -->
      <div class="form-section">
        <div class="form-section-title">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          Block Builder
          <span style="font-size:11px;color:var(--text-muted);font-weight:400;margin-left:auto">Kéo thả để sắp xếp</span>
        </div>
        <div class="block-canvas" id="blockCanvas"></div>
        <button class="add-block-btn" style="margin-top:10px" onclick="showBlockPicker()">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Thêm Block
        </button>
      </div>

      <!-- SEO -->
      <div class="form-section">
        <div class="form-section-title">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          SEO
        </div>
        <div class="form-row" style="margin-bottom:12px">
          <div class="field-group">
            <label class="field-label">Meta Title</label>
            <input type="text" id="ceSeoTitle" class="field-input" placeholder="SEO title (để trống = tên nội dung)" value="${Utils.esc(content.seo_title || '')}" />
          </div>
          <div class="field-group">
            <label class="field-label">OG Title</label>
            <input type="text" id="ceOgTitle" class="field-input" placeholder="Open Graph title" value="${Utils.esc(content.og_title || '')}" />
          </div>
        </div>
        <div class="field-group" style="margin-bottom:12px">
          <label class="field-label">Meta Description</label>
          <textarea id="ceSeoDesc" class="field-textarea" placeholder="Meta description (160 ký tự tốt nhất)" style="min-height:70px">${Utils.esc(content.seo_desc || '')}</textarea>
        </div>
        <div class="field-group">
          <label class="field-label">OG Description</label>
          <textarea id="ceOgDesc" class="field-textarea" style="min-height:60px">${Utils.esc(content.og_desc || '')}</textarea>
        </div>
      </div>
    </div>

    <!-- Sidebar column -->
    <div style="position:sticky;top:20px;display:flex;flex-direction:column;gap:14px">
      <!-- Publish panel -->
      <div class="form-section" style="margin-bottom:0">
        <div class="form-section-title">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Xuất bản
        </div>
        <div class="field-group" style="margin-bottom:14px">
          <label class="field-label">Trạng thái</label>
          <select id="ceStatus" class="field-select">
            <option value="draft"    ${content.status==='draft'    ?'selected':''}>Nháp</option>
            <option value="review"   ${content.status==='review'   ?'selected':''}>Chờ duyệt</option>
            <option value="approved" ${content.status==='approved' ?'selected':''}>Đã duyệt</option>
            <option value="published"${content.status==='published'?'selected':''}>Đã đăng</option>
            <option value="archived" ${content.status==='archived' ?'selected':''}>Lưu trữ</option>
          </select>
        </div>
        <div class="field-group" style="margin-bottom:14px">
          <label class="field-label">Đặt lịch đăng</label>
          <input type="datetime-local" id="ceScheduled" class="field-input" value="${content.scheduled_at ? content.scheduled_at.slice(0,16) : ''}" />
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="saveContent('publish')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Lưu &amp; Xuất bản
          </button>
          <button class="btn btn-secondary" style="width:100%;justify-content:center" onclick="saveContent('save')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Lưu nháp
          </button>
          ${id ? `<button class="btn btn-ghost" style="width:100%;justify-content:center;font-size:12px" onclick="viewRevisions(${id})">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
            Lịch sử phiên bản
          </button>` : ''}
        </div>
      </div>

      <!-- Meta -->
      <div class="form-section" style="margin-bottom:0">
        <div class="form-section-title">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/></svg>
          Thông tin
        </div>
        <div class="field-group" style="margin-bottom:10px">
          <label class="field-label">Loại</label>
          <select id="ceType" class="field-select" onchange="onTypeChange(this.value)">
            ${['page','article','product','project','service','hero','popup','download','gallery','video'].map(t => `<option value="${t}" ${content.type===t?'selected':''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="field-group" style="margin-bottom:10px">
          <label class="field-label">Danh mục</label>
          <select id="ceCategory" class="field-select">
            <option value="">-- Đang tải... --</option>
            ${content.category ? `<option value="${Utils.esc(content.category)}" selected>${Utils.esc(content.category)}</option>` : ''}
          </select>
        </div>
        <div class="field-group" style="margin-bottom:10px">
          <label class="field-label">Tags</label>
          <div class="tag-input" id="tagInput">
            ${tags.map(t => tagChipHTML(t)).join('')}
            <input type="text" id="tagInputField" placeholder="Thêm tag..." onkeydown="handleTagInput(event)" />
          </div>
        </div>
        <div class="field-group" style="margin-bottom:10px">
          <label class="field-label">Thumbnail URL &nbsp;<button type="button" class="btn btn-ghost btn-sm" style="font-size:10px;padding:2px 7px" onclick="openThumbPicker()">Chọn từ Media</button></label>
          <input type="text" id="ceThumbnail" class="field-input" value="${Utils.esc(content.thumbnail || '')}" placeholder="/uploads/..." />
          <div id="thumbPreview" style="margin-top:6px;${content.thumbnail?'':'display:none'}">
            <img src="${Utils.esc(content.thumbnail||'')}" style="width:100%;border-radius:4px;max-height:90px;object-fit:cover" />
          </div>
        </div>
        <div class="field-group">
          <label class="toggle-switch" style="cursor:pointer">
            <span class="toggle"><input type="checkbox" id="ceFeatured" ${content.is_featured ? 'checked' : ''} /><span class="toggle-slider"></span></span>
            <span class="toggle-label">Nội dung nổi bật</span>
          </label>
        </div>
      </div>

      <!-- Extended Meta Fields (project / product) -->
      <div class="form-section" style="margin-bottom:0" id="metaFieldsPanel" ${['project','product'].includes(content.type)?'':'hidden'}>
        <div class="form-section-title">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Thông tin mở rộng
        </div>
        <div id="metaFieldsBody">${buildMetaFieldsHTML(content)}</div>
      </div>
    </div>
  </div>`;


  // Init blocks
  initBlockEditor(content.blocks || []);

  // Load categories for current type
  const initType = content.type || 'article';
  loadCategoryOptions(initType, content.category);

  // Thumbnail preview
  const thumbInput = document.getElementById('ceThumbnail');
  if (thumbInput) {
    thumbInput.addEventListener('input', () => {
      const prev = document.getElementById('thumbPreview');
      const img  = prev?.querySelector('img');
      if (prev && img) { img.src = thumbInput.value; prev.style.display = thumbInput.value ? 'block' : 'none'; }
    });
  }
}

async function loadCategoryOptions(type, selectedValue) {
  const sel = document.getElementById('ceCategory');
  if (!sel) return;
  try {
    const cats = await API.categories.list(type);
    sel.innerHTML = '<option value="">-- Chọn danh mục --</option>' +
      cats.map(c => `<option value="${Utils.esc(c.name)}" ${c.name === selectedValue ? 'selected' : ''}>${Utils.esc(c.name)}</option>`).join('') +
      `<option value="__custom__">+ Nhập tên khác...</option>`;

    sel.addEventListener('change', () => {
      if (sel.value === '__custom__') {
        const custom = prompt('Nhập tên danh mục:');
        if (custom) {
          const opt = new Option(custom, custom, true, true);
          sel.insertBefore(opt, sel.lastElementChild);
          sel.value = custom;
        } else { sel.value = ''; }
      }
    });
  } catch {
    sel.innerHTML = `<option value="${Utils.esc(selectedValue||'')}" selected>${Utils.esc(selectedValue||'Nhập tên danh mục')}</option>`;
  }
}

async function onTypeChange(type) {
  // Reload category dropdown
  const currentCat = document.getElementById('ceCategory')?.value || '';
  await loadCategoryOptions(type, currentCat);

  // Show/hide meta fields panel
  const panel = document.getElementById('metaFieldsPanel');
  if (panel) {
    panel.style.display = ['project','product'].includes(type) ? '' : 'none';
    const body = document.getElementById('metaFieldsBody');
    if (body) body.innerHTML = buildMetaFieldsHTML({ type, meta: {} });
  }
}

function buildMetaFieldsHTML(content) {
  const type = content.type || '';
  const meta = content.meta || {};

  const projectFields = [
    { key: 'client',        label: 'Chủ đầu tư',     placeholder: 'Gia đình Nguyễn' },
    { key: 'project_value', label: 'Giá trị hợp đồng', placeholder: '2.5 tỷ VNĐ' },
    { key: 'location',      label: 'Địa điểm',         placeholder: 'Hà Nội' },
    { key: 'year',          label: 'Năm thực hiện',    placeholder: '2024' },
    { key: 'area',          label: 'Diện tích',         placeholder: '350m²' },
    { key: 'duration',      label: 'Thời gian',         placeholder: '4 tháng' },
    { key: 'challenge',     label: 'Thách thức',        placeholder: 'Mô tả thách thức...', textarea: true },
    { key: 'solution',      label: 'Giải pháp',         placeholder: 'Giải pháp thực hiện...', textarea: true },
    { key: 'result',        label: 'Kết quả',           placeholder: 'Kết quả đạt được...', textarea: true },
  ];

  const productFields = [
    { key: 'brand',  label: 'Thương hiệu / Xuất xứ', placeholder: 'POSCO / TISCO' },
    { key: 'price',  label: 'Giá (hiển thị)',          placeholder: 'Liên hệ' },
    { key: 'unit',   label: 'Đơn vị tính',             placeholder: 'kg / tấm / cái' },
    { key: 'in_stock', label: 'Còn hàng',              placeholder: '1' },
    { key: 'specs',  label: 'Thông số kỹ thuật (JSON)', placeholder: '{"Độ dày":"10mm"}', textarea: true },
  ];

  const fields = type === 'project' ? projectFields : type === 'product' ? productFields : [];
  if (!fields.length) return '<p style="font-size:13px;color:var(--text-muted)">Chọn loại "project" hoặc "product" để hiển thị trường mở rộng.</p>';

  return fields.map(f => {
    const val = meta[f.key] || '';
    return f.textarea
      ? `<div class="field-group" style="margin-bottom:10px"><label class="field-label">${f.label}</label><textarea id="meta_${f.key}" class="field-textarea" placeholder="${f.placeholder}" style="min-height:64px">${Utils.esc(val)}</textarea></div>`
      : `<div class="field-group" style="margin-bottom:10px"><label class="field-label">${f.label}</label><input type="text" id="meta_${f.key}" class="field-input" value="${Utils.esc(val)}" placeholder="${f.placeholder}" /></div>`;
  }).join('');
}

function openThumbPicker() {
  // Open Asset DAM in modal to pick thumbnail
  Modal.open({
    title: 'Chọn Thumbnail từ Media',
    size: 'lg',
    body: `<div style="text-align:center;padding:32px;color:var(--text-muted)">
      <p>Tính năng này sẽ tích hợp với Media DAM trong phiên bản tiếp theo.</p>
      <p style="font-size:13px;margin-top:8px">Hiện tại hãy copy URL từ <a href="#/assets" style="color:var(--gold)">Thư viện Media</a> và dán vào ô Thumbnail URL.</p>
    </div>`,
  });
}

window.onTypeChange    = onTypeChange;
window.openThumbPicker = openThumbPicker;


function tagChipHTML(t) {
  return `<span class="tag-chip">${Utils.esc(t)}<button onclick="removeTag('${Utils.esc(t)}')" type="button">&times;</button></span>`;
}

function handleTagInput(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = e.target.value.trim().replace(/,$/, '');
    if (val) { addTag(val); e.target.value = ''; }
  }
}

function addTag(t) {
  const wrap = document.getElementById('tagInput');
  const chip = document.createElement('span');
  chip.className = 'tag-chip';
  chip.innerHTML = `${Utils.esc(t)}<button onclick="this.parentElement.remove()" type="button">&times;</button>`;
  wrap.insertBefore(chip, document.getElementById('tagInputField'));
}

function removeTag(t) {
  const chips = document.querySelectorAll('.tag-chip');
  chips.forEach(c => { if (c.textContent.trim().startsWith(t)) c.remove(); });
}

function getTags() {
  return [...document.querySelectorAll('.tag-chip')].map(c => c.firstChild.textContent.trim()).filter(Boolean);
}

function autoSlug(title) {
  const slug = Utils.slugify(title);
  const disp = document.getElementById('ceSlugDisplay');
  const input = document.getElementById('ceSlug');
  if (disp) disp.textContent = '/' + (slug || '—');
  if (input && !input.dataset.manual) input.value = slug;
}

function editSlug() {
  document.getElementById('ceSlugDisplay').classList.add('hidden');
  const input = document.getElementById('ceSlug');
  input.classList.remove('hidden');
  input.dataset.manual = '1';
  input.focus();
}

function hideSlugEdit() {
  const input = document.getElementById('ceSlug');
  const disp  = document.getElementById('ceSlugDisplay');
  disp.textContent = '/' + (input.value || '—');
  disp.classList.remove('hidden');
  input.classList.add('hidden');
}

async function saveContent(action = 'save') {
  const title = document.getElementById('ceTitle')?.value?.trim();
  if (!title) return Toast.warning('Nhập tiêu đề');

  const type = document.getElementById('ceType')?.value;

  // Collect meta_ fields (project / product extended info)
  const meta = {};
  document.querySelectorAll('[id^="meta_"]').forEach(el => {
    const key = el.id.replace('meta_', '');
    const val = el.tagName === 'TEXTAREA' ? el.value : el.value;
    if (val.trim()) meta[key] = val.trim();
  });

  const payload = {
    type,
    title,
    slug:         document.getElementById('ceSlug')?.value?.trim() || Utils.slugify(title),
    status:       action === 'publish' ? 'published' : (document.getElementById('ceStatus')?.value || 'draft'),
    excerpt:      document.getElementById('ceExcerpt')?.value,
    category:     document.getElementById('ceCategory')?.value,
    thumbnail:    document.getElementById('ceThumbnail')?.value,
    is_featured:  document.getElementById('ceFeatured')?.checked,
    scheduled_at: document.getElementById('ceScheduled')?.value || null,
    seo_title:    document.getElementById('ceSeoTitle')?.value,
    seo_desc:     document.getElementById('ceSeoDesc')?.value,
    og_title:     document.getElementById('ceOgTitle')?.value,
    og_desc:      document.getElementById('ceOgDesc')?.value,
    tags:         getTags(),
    blocks:       getBlocksData(),
    meta,          // extended fields
  };

  try {
    const id = _currentContent?.id;
    if (id) {
      await API.content.update(id, payload);
    } else {
      const { id: newId } = await API.content.create(payload);
      _currentContent = { id: newId };
      window.location.hash = `#/content/${newId}`;
    }
    Toast.success(action === 'publish' ? 'Đã xuất bản!' : 'Đã lưu nháp!');
  } catch (e) { Toast.error(e.message); }
}


function viewRevisions(id) {
  window.location.hash = `#/workflow/${id}`;
}

window.renderContentEditor = renderContentEditor;
window.autoSlug = autoSlug;
window.editSlug = editSlug;
window.hideSlugEdit = hideSlugEdit;
window.saveContent = saveContent;
window.handleTagInput = handleTagInput;
window.addTag = addTag;
window.removeTag = removeTag;
window.viewRevisions = viewRevisions;
