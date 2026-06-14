/** Block Editor — Drag-and-drop block builder (Notion-style) */
let _blocks = [];
let _dragSrc = null;

const BLOCK_TYPES = [
  { type:'hero',        label:'Hero Banner',  icon:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>` },
  { type:'image',       label:'Hình ảnh',     icon:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>` },
  { type:'text',        label:'Văn bản',      icon:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>` },
  { type:'gallery',     label:'Thư viện ảnh', icon:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` },
  { type:'video',       label:'Video',        icon:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>` },
  { type:'button',      label:'Nút CTA',      icon:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="10" rx="2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>` },
  { type:'columns',     label:'Cột',          icon:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="8" height="18" rx="1"/><rect x="14" y="3" width="8" height="18" rx="1"/></svg>` },
  { type:'cta',         label:'CTA Banner',   icon:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>` },
  { type:'embed',       label:'Nhúng',        icon:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>` },
  { type:'quote',       label:'Trích dẫn',    icon:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>` },
  { type:'divider',     label:'Phân cách',    icon:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>` },
  { type:'stats',       label:'Thống kê',     icon:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>` },
];

function initBlockEditor(blocks) {
  _blocks = blocks.map((b, i) => ({ ...b, _id: b.id || `b${i}-${Date.now()}`, data: b.data || {} }));
  renderBlocks();
}

function renderBlocks() {
  const canvas = document.getElementById('blockCanvas');
  if (!canvas) return;
  canvas.innerHTML = _blocks.length ? '' : `<div style="text-align:center;padding:32px;color:var(--text-muted);font-size:13px">Chưa có block nào — nhấn "Thêm Block" để bắt đầu</div>`;
  _blocks.forEach((block, idx) => canvas.appendChild(createBlockEl(block, idx)));
}

function createBlockEl(block, idx) {
  const el = document.createElement('div');
  el.className = 'block-item';
  el.dataset.idx = idx;
  el.draggable = true;
  el.innerHTML = `
    <div class="block-header">
      <span class="block-drag-handle" title="Kéo để sắp xếp">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>
      </span>
      <span class="block-type-badge">${block.type.toUpperCase()}</span>
      <span class="block-label">${block.label || block.data?.title || block.type}</span>
      <div class="block-actions">
        <button class="block-action-btn block-toggle-eye ${!block.visible ? 'hidden-state' : ''}" title="${block.visible ? 'Ẩn' : 'Hiện'}" onclick="toggleBlock(${idx})">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
            ${block.visible
              ? `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`
              : `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>`}
          </svg>
        </button>
        <button class="block-action-btn" title="Lên" onclick="moveBlock(${idx},-1)" ${idx===0?'disabled':''}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button class="block-action-btn" title="Xuống" onclick="moveBlock(${idx},1)" ${idx===_blocks.length-1?'disabled':''}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <button class="block-action-btn" title="Nhân bản" onclick="cloneBlock(${idx})">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        </button>
        <button class="block-action-btn danger" title="Xóa" onclick="removeBlock(${idx})">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--red-light)" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
        </button>
      </div>
    </div>
    <div class="block-body" style="${!block.visible ? 'opacity:0.4' : ''}">
      ${renderBlockFields(block, idx)}
    </div>`;

  // Drag events
  el.addEventListener('dragstart', e => { _dragSrc = idx; el.classList.add('dragging'); });
  el.addEventListener('dragend',   () => { el.classList.remove('dragging'); document.querySelectorAll('.block-item').forEach(b => b.classList.remove('drag-over')); });
  el.addEventListener('dragover',  e => { e.preventDefault(); el.classList.add('drag-over'); });
  el.addEventListener('drop',      e => { e.preventDefault(); if (_dragSrc !== null && _dragSrc !== idx) { const arr = [..._blocks]; [arr[_dragSrc], arr[idx]] = [arr[idx], arr[_dragSrc]]; _blocks = arr; renderBlocks(); } _dragSrc = null; });

  return el;
}

function renderBlockFields(block, idx) {
  const d = block.data || {};
  switch(block.type) {
    case 'hero': return `
      <div class="form-row">
        <div class="field-group"><label class="field-label">Tiêu đề</label><input type="text" class="field-input" value="${Utils.esc(d.title||'')}" oninput="_blocks[${idx}].data.title=this.value;updateBlockLabel(${idx},this.value)" /></div>
        <div class="field-group"><label class="field-label">Subtitle</label><input type="text" class="field-input" value="${Utils.esc(d.subtitle||'')}" oninput="_blocks[${idx}].data.subtitle=this.value" /></div>
      </div>
      <div class="form-row" style="margin-top:10px">
        <div class="field-group"><label class="field-label">Background Image URL</label><input type="text" class="field-input" value="${Utils.esc(d.bg||'')}" oninput="_blocks[${idx}].data.bg=this.value" placeholder="/uploads/..." /></div>
        <div class="field-group"><label class="field-label">Nút CTA</label><input type="text" class="field-input" value="${Utils.esc(d.cta||'')}" oninput="_blocks[${idx}].data.cta=this.value" placeholder="Text nút..." /></div>
      </div>`;

    case 'image': return `
      <div class="form-row">
        <div class="field-group"><label class="field-label">URL Hình ảnh</label><input type="text" class="field-input" value="${Utils.esc(d.url||'')}" oninput="_blocks[${idx}].data.url=this.value" placeholder="/uploads/..." /></div>
        <div class="field-group"><label class="field-label">Alt text</label><input type="text" class="field-input" value="${Utils.esc(d.alt||'')}" oninput="_blocks[${idx}].data.alt=this.value" /></div>
      </div>
      ${d.url ? `<img src="${Utils.esc(d.url)}" style="margin-top:10px;max-height:160px;border-radius:4px;object-fit:cover" />` : ''}`;

    case 'text': return `
      <div class="field-group">
        <label class="field-label">Nội dung văn bản</label>
        <textarea class="field-textarea" style="min-height:110px" oninput="_blocks[${idx}].data.content=this.value">${Utils.esc(d.content||'')}</textarea>
      </div>`;

    case 'video': return `
      <div class="field-group">
        <label class="field-label">URL Video (YouTube / MP4)</label>
        <input type="text" class="field-input" value="${Utils.esc(d.url||'')}" oninput="_blocks[${idx}].data.url=this.value" placeholder="https://youtube.com/..." />
      </div>`;

    case 'button': return `
      <div class="form-row">
        <div class="field-group"><label class="field-label">Text nút</label><input type="text" class="field-input" value="${Utils.esc(d.text||'')}" oninput="_blocks[${idx}].data.text=this.value" /></div>
        <div class="field-group"><label class="field-label">URL</label><input type="text" class="field-input" value="${Utils.esc(d.url||'')}" oninput="_blocks[${idx}].data.url=this.value" /></div>
      </div>`;

    case 'embed': return `
      <div class="field-group">
        <label class="field-label">Embed URL / Mã nhúng</label>
        <textarea class="field-textarea" style="font-family:var(--ff-mono);font-size:12px" oninput="_blocks[${idx}].data.code=this.value">${Utils.esc(d.code||'')}</textarea>
      </div>`;

    case 'quote': return `
      <div class="field-group" style="margin-bottom:10px">
        <label class="field-label">Nội dung trích dẫn</label>
        <textarea class="field-textarea" oninput="_blocks[${idx}].data.text=this.value">${Utils.esc(d.text||'')}</textarea>
      </div>
      <div class="field-group"><label class="field-label">Tác giả</label><input type="text" class="field-input" value="${Utils.esc(d.author||'')}" oninput="_blocks[${idx}].data.author=this.value" /></div>`;

    case 'cta': return `
      <div class="form-row">
        <div class="field-group"><label class="field-label">Tiêu đề</label><input type="text" class="field-input" value="${Utils.esc(d.title||'')}" oninput="_blocks[${idx}].data.title=this.value" /></div>
        <div class="field-group"><label class="field-label">Subtitle</label><input type="text" class="field-input" value="${Utils.esc(d.subtitle||'')}" oninput="_blocks[${idx}].data.subtitle=this.value" /></div>
      </div>
      <div class="form-row" style="margin-top:10px">
        <div class="field-group"><label class="field-label">Nút chính</label><input type="text" class="field-input" value="${Utils.esc(d.btn1||'')}" oninput="_blocks[${idx}].data.btn1=this.value" /></div>
        <div class="field-group"><label class="field-label">Nút phụ</label><input type="text" class="field-input" value="${Utils.esc(d.btn2||'')}" oninput="_blocks[${idx}].data.btn2=this.value" /></div>
      </div>`;

    case 'stats': return `
      <div class="field-group">
        <label class="field-label">Số liệu (JSON: [{num,label}])</label>
        <textarea class="field-textarea" style="font-family:var(--ff-mono);font-size:12px" oninput="_blocks[${idx}].data.items=this.value">${Utils.esc(d.items || '[{"num":"300+","label":"Công trình"},{"num":"50+","label":"Du thuyền"}]')}</textarea>
      </div>`;

    case 'gallery': return `
      <div class="field-group">
        <label class="field-label">URLs ảnh (mỗi dòng 1 URL)</label>
        <textarea class="field-textarea" style="font-family:var(--ff-mono);font-size:12px" oninput="_blocks[${idx}].data.urls=this.value.split('\\n').filter(Boolean)">${(d.urls||[]).join('\n')}</textarea>
      </div>`;

    case 'divider': return `<div style="border-top:1px dashed var(--border);margin:8px 0;text-align:center;font-size:11px;color:var(--text-muted)">— Phân cách —</div>`;

    default: return `<div style="font-size:12px;color:var(--text-muted);padding:8px">Block type: <code class="code-mono">${block.type}</code></div>`;
  }
}

function showBlockPicker() {
  Modal.open({
    title: 'Thêm Block',
    body: `<div class="block-picker-grid">
      ${BLOCK_TYPES.map(bt => `
        <div class="block-picker-item" onclick="addBlock('${bt.type}');Modal.close()">
          ${bt.icon}
          <span>${bt.label}</span>
        </div>
      `).join('')}
    </div>`,
  });
}

function addBlock(type) {
  _blocks.push({ _id: `b${Date.now()}`, type, visible: true, position: _blocks.length, data: {}, label: '' });
  renderBlocks();
  Toast.info(`Đã thêm block: ${type}`);
}

function removeBlock(idx) {
  _blocks.splice(idx, 1);
  renderBlocks();
}

function toggleBlock(idx) {
  _blocks[idx].visible = !_blocks[idx].visible;
  renderBlocks();
}

function moveBlock(idx, dir) {
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= _blocks.length) return;
  [_blocks[idx], _blocks[newIdx]] = [_blocks[newIdx], _blocks[idx]];
  renderBlocks();
}

function cloneBlock(idx) {
  const clone = JSON.parse(JSON.stringify(_blocks[idx]));
  clone._id = `b${Date.now()}`;
  _blocks.splice(idx + 1, 0, clone);
  renderBlocks();
  Toast.info('Đã nhân bản block');
}

function updateBlockLabel(idx, label) {
  if (_blocks[idx]) _blocks[idx].label = label;
}

function getBlocksData() {
  return _blocks.map((b, i) => ({ type: b.type, position: i, visible: b.visible, label: b.label || '', data: b.data || {} }));
}

/* Standalone Block Builder page */
async function renderBlockBuilder() {
  App.setBreadcrumb('Block Builder');
  document.getElementById('pageWrapper').innerHTML = `
  <div class="page">
    <div class="page-header">
      <div class="page-header-left"><h1 class="page-title">Block Builder</h1><p class="page-subtitle">Trình chỉnh sửa block kéo-thả. Mở từ trình soạn thảo nội dung.</p></div>
    </div>
    <div style="padding:48px;text-align:center;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius)">
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--gold)" stroke-width="1.5" style="margin:0 auto 16px"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
      <h3 style="font-size:16px;margin-bottom:8px">Block Builder tích hợp sẵn trong Content Editor</h3>
      <p style="color:var(--text-muted);font-size:13px;margin-bottom:20px">Mở một nội dung và sử dụng Block Builder ngay trong trình soạn thảo</p>
      <a href="#/content" class="btn btn-primary">Đến Quản lý Nội dung</a>
    </div>
  </div>`;
}

window.initBlockEditor = initBlockEditor;
window.showBlockPicker = showBlockPicker;
window.addBlock = addBlock;
window.removeBlock = removeBlock;
window.toggleBlock = toggleBlock;
window.moveBlock = moveBlock;
window.cloneBlock = cloneBlock;
window.updateBlockLabel = updateBlockLabel;
window.getBlocksData = getBlocksData;
window.renderBlockBuilder = renderBlockBuilder;
