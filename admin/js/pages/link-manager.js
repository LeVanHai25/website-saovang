/** Link Manager, Workflow, Users, Settings pages */

// ═══ LINK MANAGER ════════════════════════════════════════════
async function renderLinkManager() {
  App.setBreadcrumb('Quản lý Liên kết');
  const wrap = document.getElementById('pageWrapper');
  wrap.innerHTML = `<div class="page">
    <div class="page-header">
      <div class="page-header-left"><h1 class="page-title">Smart Link System</h1><p class="page-subtitle">Quản lý và theo dõi tất cả liên kết</p></div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showLinkModal()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Thêm liên kết
        </button>
      </div>
    </div>
    <div class="table-wrap" id="linkList"><div class="page-loading"><div class="spinner"></div></div></div>
  </div>`;
  await loadLinks();
}

async function loadLinks() {
  try {
    const links = await API.links.list();
    document.getElementById('linkList').innerHTML = `
      <table class="data-table">
        <thead><tr><th>Nhãn</th><th>Loại</th><th>URL</th><th>Clicks</th><th>Tab</th><th>Thao tác</th></tr></thead>
        <tbody>${links.length ? links.map(l => `
          <tr>
            <td class="title-cell" style="display:flex;align-items:center;gap:8px">
              <span style="color:var(--gold)">${Utils.linkTypeIcon(l.type)}</span>
              ${Utils.esc(l.label)}
            </td>
            <td><span class="badge badge-${l.type==='youtube'?'video':l.type==='pdf'?'document':'page'}">${l.type}</span></td>
            <td style="max-width:220px"><a href="${Utils.esc(l.url)}" target="_blank" style="color:var(--text-muted);font-size:12px;font-family:var(--ff-mono);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block">${Utils.esc(Utils.truncate(l.url,40))}</a></td>
            <td><strong style="color:var(--gold)">${l.clicks}</strong></td>
            <td>${l.open_new_tab ? '<span class="badge badge-published">Cửa sổ mới</span>' : '<span class="badge badge-draft">Cùng tab</span>'}</td>
            <td><div style="display:flex;gap:4px">
              <button class="btn btn-ghost btn-sm" onclick="editLink(${l.id})">Sửa</button>
              <button class="btn btn-ghost btn-sm" onclick="copyLinkUrl('${Utils.esc(l.url)}')">Copy</button>
              <button class="btn btn-danger btn-sm" onclick="deleteLink(${l.id})">Xóa</button>
            </div></td>
          </tr>`).join('') : `<tr><td colspan="6"><div class="empty-state"><h3>Chưa có liên kết</h3></div></td></tr>`}
        </tbody>
      </table>`;
  } catch (e) { Toast.error(e.message); }
}

function showLinkModal(link = null) {
  const types = ['website','pdf','drive','youtube','facebook','instagram','figma','map','form','custom'];
  Modal.open({
    title: link ? 'Sửa liên kết' : 'Thêm liên kết',
    body: `
      <div class="form-row" style="margin-bottom:12px">
        <div class="field-group"><label class="field-label">Nhãn <span class="req">*</span></label><input type="text" id="lLabel" class="field-input" value="${Utils.esc(link?.label||'')}" placeholder="Catalogue 2026" /></div>
        <div class="field-group"><label class="field-label">Loại</label>
          <select id="lType" class="field-select">
            ${types.map(t => `<option value="${t}" ${link?.type===t?'selected':''}>${t}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="field-group" style="margin-bottom:12px"><label class="field-label">URL <span class="req">*</span></label><input type="text" id="lUrl" class="field-input" value="${Utils.esc(link?.url||'')}" placeholder="https://..." /></div>
      <div class="field-group" style="margin-bottom:12px"><label class="field-label">Mô tả</label><input type="text" id="lDesc" class="field-input" value="${Utils.esc(link?.description||'')}" /></div>
      <div style="display:flex;gap:20px">
        <label class="toggle-switch"><span class="toggle"><input type="checkbox" id="lNewTab" ${(link?.open_new_tab??1)?'checked':''} /><span class="toggle-slider"></span></span><span class="toggle-label">Mở cửa sổ mới</span></label>
        <label class="toggle-switch"><span class="toggle"><input type="checkbox" id="lTrack" ${(link?.track_clicks??1)?'checked':''} /><span class="toggle-slider"></span></span><span class="toggle-label">Theo dõi clicks</span></label>
      </div>`,
    footer: `
      <button class="btn btn-secondary" onclick="Modal.close()">Hủy</button>
      <button class="btn btn-primary" onclick="saveLink(${link?.id||'null'})">Lưu</button>`,
  });
}

async function saveLink(id) {
  const label = document.getElementById('lLabel')?.value?.trim();
  const url   = document.getElementById('lUrl')?.value?.trim();
  if (!label || !url) return Toast.warning('Nhập nhãn và URL');
  const payload = {
    label, url,
    type:         document.getElementById('lType')?.value,
    description:  document.getElementById('lDesc')?.value,
    open_new_tab: document.getElementById('lNewTab')?.checked,
    track_clicks: document.getElementById('lTrack')?.checked,
  };
  try {
    if (id) await API.links.update(id, payload);
    else    await API.links.create(payload);
    Toast.success('Đã lưu liên kết!');
    Modal.close();
    loadLinks();
  } catch (e) { Toast.error(e.message); }
}

async function editLink(id) {
  const links = await API.links.list();
  const link  = links.find(l => l.id === id);
  if (link) showLinkModal(link);
}

async function copyLinkUrl(url) { await Utils.copy(url); Toast.info('Đã copy URL'); }

async function deleteLink(id) {
  Modal.confirm('Xóa liên kết này?', async () => {
    try { await API.links.delete(id); Toast.success('Đã xóa'); loadLinks(); }
    catch (e) { Toast.error(e.message); }
  });
}

// ═══ WORKFLOW ════════════════════════════════════════════════
async function renderWorkflow() {
  App.setBreadcrumb('Workflow & Phiên bản');
  document.getElementById('pageWrapper').innerHTML = `<div class="page">
    <div class="page-header">
      <div class="page-header-left"><h1 class="page-title">Workflow & Version History</h1><p class="page-subtitle">Theo dõi trạng thái nội dung và lịch sử phiên bản</p></div>
    </div>
    <div class="form-section" style="margin-bottom:20px">
      <div class="form-section-title">Sơ đồ Workflow</div>
      <div style="display:flex;align-items:center;gap:0;overflow-x:auto;padding:8px 0">
        ${[['Nháp','draft','var(--text-muted)'],['Chờ duyệt','review','var(--yellow)'],['Đã duyệt','approved','var(--blue)'],['Đã đăng','published','var(--green)'],['Lưu trữ','archived','var(--text-muted)']].map(([l,s,c],i,arr) => `
          <div style="display:flex;align-items:center">
            <div style="text-align:center;padding:16px 20px;background:var(--bg-3);border-radius:8px;border:1.5px solid ${c}30;min-width:100px">
              <div style="width:10px;height:10px;border-radius:50%;background:${c};margin:0 auto 8px"></div>
              <div style="font-size:12px;font-weight:700;color:${c}">${l}</div>
            </div>
            ${i < arr.length-1 ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--border-2)" stroke-width="2" style="flex-shrink:0"><polyline points="9 18 15 12 9 6"/></svg>` : ''}
          </div>`).join('')}
      </div>
    </div>
    <div class="form-section">
      <div class="form-section-title">Kiểm tra phiên bản nội dung</div>
      <div style="display:flex;gap:10px;align-items:center">
        <input type="number" id="revContentId" class="field-input" placeholder="ID nội dung..." style="max-width:200px" />
        <button class="btn btn-primary" onclick="loadRevisions()">Xem lịch sử</button>
      </div>
      <div id="revisionList" style="margin-top:16px"></div>
    </div>
  </div>`;
}

async function loadRevisions() {
  const id = document.getElementById('revContentId')?.value;
  if (!id) return Toast.warning('Nhập ID nội dung');
  try {
    const revs = await API.revisions.list(id);
    document.getElementById('revisionList').innerHTML = revs.length ? `
      <div class="workflow-timeline">
        ${revs.map((r, i) => `
          <div class="timeline-item">
            <div class="timeline-line">
              <div class="timeline-dot ${i===0?'active':''}"></div>
              ${i < revs.length-1 ? '<div class="timeline-connector"></div>' : ''}
            </div>
            <div class="timeline-content">
              <div class="timeline-title">v${r.version} — ${Utils.esc(r.message||'Cập nhật')}</div>
              <div class="timeline-meta">${Utils.esc(r.changed_by_name||'—')} · ${Utils.formatDateTime(r.created_at)}</div>
              ${i > 0 ? `<button class="btn btn-secondary btn-sm" style="margin-top:8px" onclick="restoreRevision(${id},${r.version})">Khôi phục v${r.version}</button>` : ''}
            </div>
          </div>`).join('')}
      </div>` : `<div class="empty-state"><h3>Không có lịch sử</h3></div>`;
  } catch (e) { Toast.error(e.message); }
}

async function restoreRevision(contentId, version) {
  Modal.confirm(`Khôi phục nội dung về phiên bản v${version}?`, async () => {
    try { await API.revisions.restore(contentId, version); Toast.success('Đã khôi phục!'); loadRevisions(); }
    catch (e) { Toast.error(e.message); }
  });
}

// ═══ USERS ════════════════════════════════════════════════════
async function renderUsers() {
  App.setBreadcrumb('Người dùng');
  document.getElementById('pageWrapper').innerHTML = `<div class="page">
    <div class="page-header">
      <div class="page-header-left"><h1 class="page-title">Quản lý Người Dùng</h1><p class="page-subtitle">Tài khoản và phân quyền hệ thống</p></div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showUserModal()">+ Thêm người dùng</button>
      </div>
    </div>
    <div class="table-wrap" id="userList"><div class="page-loading"><div class="spinner"></div></div></div>
  </div>`;
  await loadUsers();
}

async function loadUsers() {
  try {
    const users = await API.users.list();
    const ROLE_COLORS = { superadmin: 'var(--red-light)', admin: 'var(--gold)', editor: 'var(--blue)', viewer: 'var(--text-muted)' };
    document.getElementById('userList').innerHTML = `
      <table class="data-table">
        <thead><tr><th>Tên</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Đăng nhập lần cuối</th><th>Thao tác</th></tr></thead>
        <tbody>${users.map(u => `
          <tr>
            <td style="display:flex;align-items:center;gap:10px">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0">${(u.name||'?')[0].toUpperCase()}</div>
              <span style="font-weight:500;color:var(--text-primary)">${Utils.esc(u.name)}</span>
            </td>
            <td style="font-size:13px;color:var(--text-muted)">${Utils.esc(u.email)}</td>
            <td><span style="font-size:11px;font-weight:700;padding:3px 8px;background:${ROLE_COLORS[u.role]}20;color:${ROLE_COLORS[u.role]};border-radius:4px;text-transform:uppercase;letter-spacing:.04em">${u.role}</span></td>
            <td>${u.is_active ? '<span class="badge badge-published">Hoạt động</span>' : '<span class="badge badge-archived">Vô hiệu</span>'}</td>
            <td style="font-size:12px;color:var(--text-muted)">${Utils.timeAgo(u.last_login)}</td>
            <td><div style="display:flex;gap:4px">
              <button class="btn btn-ghost btn-sm" onclick="showUserModal(${JSON.stringify(u).replace(/"/g,'&quot;')})">Sửa</button>
              <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id},'${Utils.esc(u.name)}')">Xóa</button>
            </div></td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  } catch (e) { Toast.error(e.message); }
}

function showUserModal(user = null) {
  const u = typeof user === 'string' ? JSON.parse(user.replace(/&quot;/g,'"')) : user;
  Modal.open({
    title: u ? `Sửa: ${u.name}` : 'Thêm người dùng',
    body: `
      <div class="form-row" style="margin-bottom:12px">
        <div class="field-group"><label class="field-label">Họ tên <span class="req">*</span></label><input type="text" id="uName" class="field-input" value="${Utils.esc(u?.name||'')}" /></div>
        <div class="field-group"><label class="field-label">Email <span class="req">*</span></label><input type="email" id="uEmail" class="field-input" value="${Utils.esc(u?.email||'')}" /></div>
      </div>
      <div class="form-row" style="margin-bottom:12px">
        <div class="field-group"><label class="field-label">Mật khẩu ${u?'(để trống = không đổi)':''}<span class="req">${u?'':'*'}</span></label><input type="password" id="uPass" class="field-input" placeholder="••••••••" /></div>
        <div class="field-group"><label class="field-label">Vai trò</label>
          <select id="uRole" class="field-select">
            ${['superadmin','admin','editor','viewer'].map(r => `<option value="${r}" ${u?.role===r?'selected':''}>${r}</option>`).join('')}
          </select>
        </div>
      </div>
      ${u ? `<label class="toggle-switch"><span class="toggle"><input type="checkbox" id="uActive" ${u.is_active?'checked':''} /><span class="toggle-slider"></span></span><span class="toggle-label">Tài khoản hoạt động</span></label>` : ''}`,
    footer: `
      <button class="btn btn-secondary" onclick="Modal.close()">Hủy</button>
      <button class="btn btn-primary" onclick="saveUser(${u?.id||'null'})">Lưu</button>`,
  });
}

async function saveUser(id) {
  const name  = document.getElementById('uName')?.value?.trim();
  const email = document.getElementById('uEmail')?.value?.trim();
  const pass  = document.getElementById('uPass')?.value;
  const role  = document.getElementById('uRole')?.value;
  if (!name || !email) return Toast.warning('Nhập đầy đủ thông tin');
  if (!id && !pass) return Toast.warning('Nhập mật khẩu');
  const payload = { name, email, role };
  if (pass) payload.password = pass;
  const isActiveEl = document.getElementById('uActive');
  if (isActiveEl) payload.is_active = isActiveEl.checked;
  try {
    if (id) await API.users.update(id, payload);
    else    await API.users.create(payload);
    Toast.success('Đã lưu!'); Modal.close(); loadUsers();
  } catch (e) { Toast.error(e.message); }
}

async function deleteUser(id, name) {
  Modal.confirm(`Xóa người dùng "<strong>${Utils.esc(name)}</strong>"?`, async () => {
    try { await API.users.delete(id); Toast.success('Đã xóa'); loadUsers(); }
    catch (e) { Toast.error(e.message); }
  });
}

// ═══ SETTINGS ════════════════════════════════════════════════
async function renderSettings() {
  App.setBreadcrumb('Cài đặt');
  document.getElementById('pageWrapper').innerHTML = `<div class="page">
    <div class="page-header">
      <div class="page-header-left"><h1 class="page-title">Cài đặt Hệ thống</h1><p class="page-subtitle">Cấu hình website, thương hiệu và tích hợp dịch vụ</p></div>
    </div>
    <div class="tabs">
      <button class="tab-btn active" data-tab="branding">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        Thương hiệu
      </button>
      <button class="tab-btn" data-tab="general">Chung</button>
      <button class="tab-btn" data-tab="seo">SEO</button>
      <button class="tab-btn" data-tab="social">Mạng xã hội</button>
      <button class="tab-btn" data-tab="cdn">CDN &amp; Storage</button>
      <button class="tab-btn" data-tab="email">Email</button>
    </div>
    <div id="settingsContent"><div class="page-loading"><div class="spinner"></div></div></div>
  </div>`;

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.tab === 'branding') loadBrandingSettings();
      else loadSettingsGroup(btn.dataset.tab);
    });
  });

  await loadBrandingSettings();
}

const SETTINGS_FIELDS = {
  general: [
    { key:'site_name',     label:'Tên website (ngắn)',  type:'text' },
    { key:'company_short', label:'Tên viết tắt',         type:'text' },
    { key:'company_full',  label:'Tên công ty đầy đủ',   type:'text' },
    { key:'site_tagline',  label:'Tagline / Khẩu hiệu',  type:'text' },
    { key:'site_email',    label:'Email liên hệ',        type:'email' },
    { key:'site_phone',    label:'Số điện thoại',         type:'text' },
    { key:'site_address',  label:'Địa chỉ',               type:'text' },
  ],
  seo: [
    { key:'seo_title_suffix', label:'Hậu tố tiêu đề SEO',         type:'text' },
    { key:'seo_description',  label:'Meta description mặc định', type:'textarea' },
  ],
  social: [
    { key:'facebook_url', label:'Facebook URL', type:'url' },
    { key:'youtube_url',  label:'YouTube URL',  type:'url' },
    { key:'zalo_url',     label:'Zalo URL/OA',  type:'url' },
  ],
  cdn: [
    { key:'cdn_enabled',  label:'Bật CDN',      type:'toggle' },
    { key:'cdn_base_url', label:'CDN Base URL', type:'url'   },
  ],
  email: [
    { key:'smtp_host', label:'SMTP Host',     type:'text'     },
    { key:'smtp_port', label:'SMTP Port',     type:'number'   },
    { key:'smtp_user', label:'SMTP Username', type:'text'     },
    { key:'smtp_pass', label:'SMTP Password', type:'password' },
  ],
};

async function loadBrandingSettings() {
  try {
    const { values } = await API.settings.get('general');
    const logoUrl   = values.site_logo || '';
    const badgeText = values.logo_badge || 'SV';
    const compShort = values.company_short || values.site_name || 'SAO VÀNG';

    document.getElementById('settingsContent').innerHTML = `
      <div class="form-section">
        <div class="form-section-title">Logo & Thương hiệu</div>

        <!-- Logo Preview -->
        <div style="display:flex;gap:24px;align-items:flex-start;margin-bottom:28px;flex-wrap:wrap">
          <div style="flex-shrink:0">
            <div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">Xem trước Logo</div>
            <div style="background:var(--bg-3);border:1.5px solid var(--border);border-radius:var(--radius);padding:16px 24px;display:flex;align-items:center;gap:10px" id="logoPreviewBox">
              <div id="logoBadgePreview" style="width:36px;height:36px;background:var(--gold);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff;flex-shrink:0">${Utils.esc(badgeText)}</div>
              <span id="logoNamePreview" style="font-family:'Inter',sans-serif;font-weight:800;font-size:16px;color:var(--text-primary);letter-spacing:.06em">${Utils.esc(compShort)}</span>
            </div>
            ${logoUrl ? `<div style="margin-top:10px"><img src="${Utils.esc(logoUrl)}" alt="Logo" style="height:44px;object-fit:contain;border:1px solid var(--border);border-radius:var(--radius-sm);padding:4px;background:#fff" /></div>` : ''}
          </div>
          <div style="flex:1;min-width:260px">
            <div class="field-group" style="margin-bottom:14px">
              <label class="field-label">Upload logo hình (PNG/SVG, tối đa 5MB)</label>
              <div style="display:flex;gap:8px;align-items:center">
                <label for="logoFileInput" class="btn btn-secondary" style="cursor:pointer;margin:0">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Chọn file logo
                </label>
                <input type="file" id="logoFileInput" accept="image/*" style="display:none" onchange="uploadLogo(this)" />
                <span id="logoUploadStatus" style="font-size:12px;color:var(--text-muted)">JPG, PNG, SVG, WebP</span>
              </div>
              ${logoUrl ? `<div style="display:flex;align-items:center;gap:6px;margin-top:8px"><span style="font-size:12px;color:var(--green,#22c55e)"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Logo đã cài đặt</span><a href="${Utils.esc(logoUrl)}" target="_blank" style="font-size:11px;color:var(--text-muted)">Xem</a></div>` : ''}
            </div>
            <div class="field-group" style="margin-bottom:14px">
              <label class="field-label">Logo badge (2 ký tự hiển khi không có ảnh)</label>
              <div style="display:flex;gap:8px;align-items:center">
                <input type="text" id="logoBadgeInput" class="field-input" value="${Utils.esc(badgeText)}" maxlength="3" style="max-width:80px;font-weight:900;text-align:center;font-size:18px;letter-spacing:2px" oninput="document.getElementById('logoBadgePreview').textContent=this.value" />
                <span style="font-size:12px;color:var(--text-muted)">Hiển thị trong sidebar, header và footer</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Company Names -->
        <div class="form-row" style="margin-bottom:14px">
          <div class="field-group">
            <label class="field-label">Tên viết tắt (hiển trong header)</label>
            <input type="text" id="s_company_short" class="field-input" value="${Utils.esc(values.company_short||'')}" placeholder="SAO VÀNG" oninput="document.getElementById('logoNamePreview').textContent=this.value" />
          </div>
          <div class="field-group">
            <label class="field-label">Tên đầy đủ công ty</label>
            <input type="text" id="s_company_full" class="field-input" value="${Utils.esc(values.company_full||'')}" placeholder="Công ty TNHH ...." />
          </div>
        </div>
        <div class="form-row" style="margin-bottom:14px">
          <div class="field-group">
            <label class="field-label">Tagline / Khẩu hiệu</label>
            <input type="text" id="s_site_tagline" class="field-input" value="${Utils.esc(values.site_tagline||'')}" placeholder="Cơ Khí Cao Cấp" />
          </div>
          <div class="field-group">
            <label class="field-label">Website URL</label>
            <input type="url" id="s_site_url" class="field-input" value="${Utils.esc(values.site_url||'')}" placeholder="https://saovang.vn" />
          </div>
        </div>

        <!-- Colors -->
        <div class="form-section-title" style="margin-top:20px;font-size:12px">Màu thương hiệu</div>
        <div class="form-row" style="margin-bottom:20px">
          <div class="field-group">
            <label class="field-label">Màu chính (Primary)</label>
            <div style="display:flex;gap:8px;align-items:center">
              <input type="color" id="s_color_primary" value="${Utils.esc(values.color_primary||'#8B0000')}" style="width:44px;height:36px;border:1px solid var(--border);border-radius:4px;cursor:pointer;padding:2px;background:var(--bg-3)" />
              <input type="text" class="field-input" value="${Utils.esc(values.color_primary||'#8B0000')}" oninput="document.getElementById('s_color_primary').value=this.value" style="flex:1" />
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Màu Gold (Accent)</label>
            <div style="display:flex;gap:8px;align-items:center">
              <input type="color" id="s_color_gold" value="${Utils.esc(values.color_gold||'#c8860a')}" style="width:44px;height:36px;border:1px solid var(--border);border-radius:4px;cursor:pointer;padding:2px;background:var(--bg-3)" />
              <input type="text" class="field-input" value="${Utils.esc(values.color_gold||'#c8860a')}" oninput="document.getElementById('s_color_gold').value=this.value" style="flex:1" />
            </div>
          </div>
        </div>

        <button class="btn btn-primary" onclick="saveBrandingSettings()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
          Lưu thương hiệu
        </button>
      </div>`;
  } catch (e) { Toast.error(e.message); }
}

async function uploadLogo(input) {
  const file = input.files[0];
  if (!file) return;
  const statusEl = document.getElementById('logoUploadStatus');
  statusEl.textContent = 'Đang tải lên...';
  const fd = new FormData();
  fd.append('logo', file);
  try {
    const { url } = await API.categories.uploadLogo(fd);
    statusEl.innerHTML = `<span style="color:var(--green,#22c55e)">✓ Upload thành công!</span>`;
    Toast.success('Logo đã cài đặt!');
    await loadBrandingSettings();
  } catch (e) {
    statusEl.textContent = 'Lỗi: ' + e.message;
    Toast.error(e.message);
  }
}

async function saveBrandingSettings() {
  const payload = {
    company_short: document.getElementById('s_company_short')?.value,
    company_full:  document.getElementById('s_company_full')?.value,
    site_tagline:  document.getElementById('s_site_tagline')?.value,
    site_url:      document.getElementById('s_site_url')?.value,
    logo_badge:    document.getElementById('logoBadgeInput')?.value,
    color_primary: document.getElementById('s_color_primary')?.value,
    color_gold:    document.getElementById('s_color_gold')?.value,
  };
  try {
    await API.settings.update(payload);
    Toast.success('Đã lưu thương hiệu!');
    if (payload.logo_badge) {
      const badge = document.getElementById('adminLogoBadge');
      if (badge) badge.textContent = payload.logo_badge;
    }
    if (payload.company_short) {
      const name = document.getElementById('adminBrandName');
      if (name) name.textContent = payload.company_short;
    }
  } catch (e) { Toast.error(e.message); }
}

async function loadSettingsGroup(group) {
  const fields = SETTINGS_FIELDS[group] || [];
  try {
    const { values } = await API.settings.get(group);
    const html = fields.map(f => {
      const val = values[f.key] || '';
      if (f.type === 'toggle') return `
        <div class="field-group" style="margin-bottom:16px">
          <label class="toggle-switch"><span class="toggle"><input type="checkbox" id="s_${f.key}" ${val==='1'||val==='true'?'checked':''} /><span class="toggle-slider"></span></span><span class="toggle-label">${f.label}</span></label>
        </div>`;
      if (f.type === 'textarea') return `
        <div class="field-group" style="margin-bottom:16px">
          <label class="field-label">${f.label}</label>
          <textarea id="s_${f.key}" class="field-textarea">${Utils.esc(val)}</textarea>
        </div>`;
      return `
        <div class="field-group" style="margin-bottom:16px">
          <label class="field-label">${f.label}</label>
          <input type="${f.type}" id="s_${f.key}" class="field-input" value="${Utils.esc(val)}" />
        </div>`;
    }).join('');

    document.getElementById('settingsContent').innerHTML = `
      <div class="form-section">
        <div class="form-section-title">${group.charAt(0).toUpperCase()+group.slice(1)}</div>
        ${html}
        <div style="margin-top:8px">
          <button class="btn btn-primary" onclick="saveSettings('${group}')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
            Lưu cài đặt
          </button>
        </div>
      </div>`;
  } catch (e) { Toast.error(e.message); }
}

async function saveSettings(group) {
  const fields = SETTINGS_FIELDS[group] || [];
  const payload = {};
  fields.forEach(f => {
    const el = document.getElementById(`s_${f.key}`);
    if (!el) return;
    payload[f.key] = f.type === 'toggle' ? (el.checked ? '1' : '0') : el.value;
  });
  try {
    await API.settings.update(payload);
    Toast.success('Đã lưu cài đặt!');
  } catch (e) { Toast.error(e.message); }
}

window.renderLinkManager = renderLinkManager;
window.showLinkModal = showLinkModal;
window.saveLink = saveLink;
window.editLink = editLink;
window.copyLinkUrl = copyLinkUrl;
window.deleteLink = deleteLink;

window.renderWorkflow = renderWorkflow;
window.loadRevisions = loadRevisions;
window.restoreRevision = restoreRevision;

window.renderUsers = renderUsers;
window.showUserModal = showUserModal;
window.saveUser = saveUser;
window.deleteUser = deleteUser;

window.renderSettings    = renderSettings;
window.loadBrandingSettings = loadBrandingSettings;
window.uploadLogo        = uploadLogo;
window.saveBrandingSettings = saveBrandingSettings;
window.saveSettings      = saveSettings;
