/** Form Builder */
let _formFields = [], _editingFormId = null;

const FIELD_TYPES = [
  { type:'text',      label:'Văn bản ngắn' },
  { type:'textarea',  label:'Văn bản dài'  },
  { type:'number',    label:'Số'           },
  { type:'email',     label:'Email'        },
  { type:'tel',       label:'Điện thoại'   },
  { type:'select',    label:'Dropdown'     },
  { type:'radio',     label:'Radio'        },
  { type:'checkbox',  label:'Checkbox'     },
  { type:'date',      label:'Ngày'         },
  { type:'file',      label:'Upload file'  },
];

async function renderFormBuilder() {
  App.setBreadcrumb('Form Builder');
  const wrap = document.getElementById('pageWrapper');
  wrap.innerHTML = `<div class="page">
    <div class="page-header">
      <div class="page-header-left"><h1 class="page-title">Form Builder</h1><p class="page-subtitle">Tạo form tùy chỉnh không cần code</p></div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showFormEditorModal()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tạo form mới
        </button>
      </div>
    </div>
    <div class="table-wrap" id="formList">
      <div class="page-loading"><div class="spinner"></div></div>
    </div>
  </div>`;
  await loadForms();
}

async function loadForms() {
  try {
    const forms = await API.forms.list();
    document.getElementById('formList').innerHTML = `
      <table class="data-table">
        <thead><tr><th>Tên Form</th><th>Slug</th><th>Trạng thái</th><th>Submissions</th><th>Ngày tạo</th><th>Thao tác</th></tr></thead>
        <tbody>${forms.length ? forms.map(f => `
          <tr>
            <td class="title-cell">${Utils.esc(f.name)}</td>
            <td><code class="code-mono">${f.slug}</code></td>
            <td><span class="badge ${f.is_active ? 'badge-published' : 'badge-archived'}">${f.is_active ? 'Hoạt động' : 'Tắt'}</span></td>
            <td><strong>${f.submission_count || 0}</strong></td>
            <td>${Utils.formatDate(f.created_at)}</td>
            <td><div style="display:flex;gap:4px">
              <button class="btn btn-ghost btn-sm" onclick="editForm(${f.id})">Sửa</button>
              <button class="btn btn-ghost btn-sm" onclick="viewSubmissions(${f.id},'${Utils.esc(f.name)}')">Submissions</button>
              <button class="btn btn-ghost btn-sm" onclick="showEmbedCode('${Utils.esc(f.slug)}')">Embed</button>
              <button class="btn btn-danger btn-sm" onclick="deleteForm(${f.id})">Xóa</button>
            </div></td>
          </tr>`).join('') : `<tr><td colspan="6"><div class="empty-state"><h3>Chưa có form nào</h3></div></td></tr>`}
        </tbody>
      </table>`;
  } catch (e) { Toast.error(e.message); }
}

function showFormEditorModal(form = null) {
  _editingFormId = form?.id || null;
  _formFields = form?.fields ? (Array.isArray(form.fields) ? form.fields : JSON.parse(form.fields)) : [];
  Modal.open({
    title: form ? 'Sửa Form' : 'Tạo Form mới',
    wide: true,
    body: `
      <div class="form-row" style="margin-bottom:14px">
        <div class="field-group"><label class="field-label">Tên form <span class="req">*</span></label><input type="text" id="fName" class="field-input" value="${Utils.esc(form?.name||'')}" placeholder="Form Liên Hệ" /></div>
        <div class="field-group"><label class="field-label">Slug</label><input type="text" id="fSlug" class="field-input" value="${Utils.esc(form?.slug||'')}" placeholder="lien-he" /></div>
      </div>
      <div class="field-group" style="margin-bottom:16px"><label class="field-label">Mô tả</label><input type="text" id="fDesc" class="field-input" value="${Utils.esc(form?.description||'')}" /></div>

      <div style="font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">Các trường</div>
      <div id="fieldCanvas" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">
        ${_formFields.map((f,i) => fieldItemHTML(f,i)).join('')}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${FIELD_TYPES.map(ft => `
          <button class="btn btn-secondary btn-sm" onclick="addFormField('${ft.type}','${ft.label}')">
            + ${ft.label}
          </button>`).join('')}
      </div>
      <div class="divider"></div>
      <div class="form-row">
        <div class="field-group"><label class="field-label">Thông báo sau submit</label><input type="text" id="fSubmitMsg" class="field-input" value="${Utils.esc(form?.settings?.submit_msg||'Cảm ơn! Chúng tôi sẽ liên hệ sớm.')}" /></div>
        <div class="field-group"><label class="field-label">Email nhận thông báo</label><input type="text" id="fEmailNotify" class="field-input" value="${Utils.esc(form?.settings?.email_notify||'')}" /></div>
      </div>
    `,
    footer: `
      <button class="btn btn-secondary" onclick="Modal.close()">Hủy</button>
      <button class="btn btn-primary" onclick="saveForm()">Lưu Form</button>`,
  });
}

function fieldItemHTML(f, i) {
  return `<div class="form-section" style="margin:0;padding:12px" id="field-${i}">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <span class="badge badge-${f.type === 'email' ? 'published' : 'draft'}">${f.type}</span>
      <input type="text" class="field-input" style="flex:1" value="${Utils.esc(f.label||'')}" placeholder="Nhãn trường..." oninput="_formFields[${i}].label=this.value" />
      <label class="toggle-switch"><span class="toggle"><input type="checkbox" ${f.required?'checked':''} oninput="_formFields[${i}].required=this.checked" /><span class="toggle-slider"></span></span><span class="toggle-label" style="font-size:11px">Bắt buộc</span></label>
      <button class="btn btn-ghost btn-icon btn-sm" onclick="removeFormField(${i})"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--red-light)" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    ${['select','radio'].includes(f.type) ? `
    <div class="field-group">
      <label class="field-label">Tùy chọn (mỗi dòng 1)</label>
      <textarea class="field-textarea" style="min-height:60px;font-size:12px" oninput="_formFields[${i}].options=this.value.split('\\n').filter(Boolean)">${(f.options||[]).join('\n')}</textarea>
    </div>` : ''}
  </div>`;
}

function addFormField(type, label) {
  _formFields.push({ id: `f${Date.now()}`, type, label, required: false, placeholder: '' });
  const canvas = document.getElementById('fieldCanvas');
  if (canvas) {
    const div = document.createElement('div');
    div.innerHTML = fieldItemHTML(_formFields[_formFields.length-1], _formFields.length-1);
    canvas.appendChild(div.firstElementChild);
  }
}

function removeFormField(i) {
  _formFields.splice(i, 1);
  const canvas = document.getElementById('fieldCanvas');
  if (canvas) canvas.innerHTML = _formFields.map((f,idx) => fieldItemHTML(f,idx)).join('');
}

async function saveForm() {
  const name = document.getElementById('fName')?.value?.trim();
  if (!name) return Toast.warning('Nhập tên form');
  const payload = {
    name,
    slug: document.getElementById('fSlug')?.value?.trim() || Utils.slugify(name),
    description: document.getElementById('fDesc')?.value,
    fields: _formFields,
    settings: {
      submit_msg: document.getElementById('fSubmitMsg')?.value,
      email_notify: document.getElementById('fEmailNotify')?.value,
    },
  };
  try {
    if (_editingFormId) await API.forms.update(_editingFormId, payload);
    else await API.forms.create(payload);
    Toast.success('Đã lưu form!');
    Modal.close();
    loadForms();
  } catch (e) { Toast.error(e.message); }
}

async function editForm(id) {
  try { const form = await API.forms.get(id); showFormEditorModal(form); }
  catch (e) { Toast.error(e.message); }
}

async function viewSubmissions(id, name) {
  try {
    const subs = await API.forms.submissions(id);
    Modal.open({
      title: `Submissions — ${name} (${subs.length})`,
      wide: true,
      body: subs.length ? `
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead><tr><th>Thời gian</th><th>Dữ liệu</th><th>IP</th></tr></thead>
            <tbody>${subs.map(s => `
              <tr>
                <td style="white-space:nowrap;font-size:12px">${Utils.formatDateTime(s.created_at)}</td>
                <td><div style="max-width:400px;font-size:12px;color:var(--text-secondary)">
                  ${Object.entries(s.data || {}).map(([k,v]) => `<div><strong>${Utils.esc(k)}:</strong> ${Utils.esc(String(v))}</div>`).join('')}
                </div></td>
                <td style="font-size:11px;color:var(--text-muted)">${s.ip_address||'—'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>` : `<div class="empty-state"><h3>Chưa có submission</h3></div>`,
    });
  } catch (e) { Toast.error(e.message); }
}

function showEmbedCode(slug) {
  const code = `<form action="/api/forms/${slug}/submit" method="POST">\n  <!-- Thêm các trường form ở đây -->\n  <button type="submit">Gửi</button>\n</form>\n\n<!-- Hoặc fetch API -->\nfetch('/api/forms/${slug}/submit', {\n  method: 'POST',\n  headers: {'Content-Type':'application/json'},\n  body: JSON.stringify({ name: '...', email: '...' })\n})`;
  Modal.open({ title: 'Mã nhúng Form', body: `<textarea class="field-textarea" style="font-family:var(--ff-mono);font-size:12px;min-height:180px" readonly>${Utils.esc(code)}</textarea>` });
}

async function deleteForm(id) {
  Modal.confirm('Xóa form này? Các submissions cũng sẽ bị xóa.', async () => {
    try { await API.forms.delete(id); Toast.success('Đã xóa form'); loadForms(); }
    catch (e) { Toast.error(e.message); }
  });
}

window.renderFormBuilder = renderFormBuilder;
window.showFormEditorModal = showFormEditorModal;
window.addFormField = addFormField;
window.removeFormField = removeFormField;
window.saveForm = saveForm;
window.editForm = editForm;
window.viewSubmissions = viewSubmissions;
window.showEmbedCode = showEmbedCode;
window.deleteForm = deleteForm;
