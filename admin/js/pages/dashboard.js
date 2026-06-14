/** Dashboard Page */
async function renderDashboard() {
  App.setBreadcrumb('Dashboard');

  const wrap = document.getElementById('pageWrapper');
  wrap.innerHTML = `<div class="page">
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Tổng quan hệ thống quản trị Sao Vàng</p>
      </div>
      <div class="page-actions">
        <a href="#/content/new" class="btn btn-primary">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tạo nội dung mới
        </a>
      </div>
    </div>
    <div class="stat-grid" id="statGrid">
      ${[1,2,3,4].map(() => `<div class="stat-card"><div class="spinner" style="margin:20px auto"></div></div>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:20px">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--text-secondary);margin-bottom:14px;text-transform:uppercase;letter-spacing:.06em">Nội dung gần đây</div>
        <div class="table-wrap" id="recentContent"><div class="page-loading"><div class="spinner"></div></div></div>
      </div>
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--text-secondary);margin-bottom:14px;text-transform:uppercase;letter-spacing:.06em">Hoạt động</div>
        <div class="table-wrap" id="quickActions" style="padding:16px;display:flex;flex-direction:column;gap:8px">
          ${[
            ['#/content/new?type=article','Viết bài viết mới','green',`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`],
            ['#/assets','Upload tài nguyên','blue',`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>`],
            ['#/content/new?type=product','Thêm sản phẩm','gold',`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>`],
            ['#/forms','Xem form submissions','purple',`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`],
            ['#/settings','Cài đặt website','red',`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M4.93 4.93l1.41 1.41M21 12h-2M5 12H3M12 21v-2M12 5V3"/></svg>`],
          ].map(([href, label, color, icon]) => `
            <a href="${href}" style="display:flex;align-items:center;gap:12px;padding:11px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:var(--radius-sm);transition:all var(--t);color:var(--text-secondary);font-size:13px;font-weight:500" 
               onmouseover="this.style.borderColor='var(--${color === 'gold' ? 'gold' : color === 'green' ? 'green' : color === 'blue' ? 'blue' : color === 'purple' ? 'purple' : 'red-light'})';this.style.color='var(--text-primary)'"
               onmouseout="this.style.borderColor='';this.style.color='var(--text-secondary)'">
              <span style="color:var(--${color === 'gold' ? 'gold' : color === 'green' ? 'green' : color === 'blue' ? 'blue' : color === 'purple' ? 'purple' : 'red-light'})">${icon}</span>
              ${label}
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  </div>`;

  // Load stats
  try {
    const [stats, assetStats] = await Promise.all([API.content.stats(), API.assets.stats()]);

    document.getElementById('statGrid').innerHTML = `
      <div class="stat-card">
        <div class="stat-card-header">
          <div class="stat-card-icon" style="background:var(--blue-dim);color:var(--blue)">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
        </div>
        <div class="stat-card-num">${stats.total}</div>
        <div class="stat-card-label">Tổng nội dung</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-header">
          <div class="stat-card-icon" style="background:var(--green-dim);color:var(--green)">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
        <div class="stat-card-num" style="color:var(--green)">${stats.published}</div>
        <div class="stat-card-label">Đã xuất bản</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-header">
          <div class="stat-card-icon" style="background:var(--yellow-dim);color:var(--yellow)">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
        </div>
        <div class="stat-card-num" style="color:var(--yellow)">${stats.draft}</div>
        <div class="stat-card-label">Bản nháp</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-header">
          <div class="stat-card-icon" style="background:var(--purple-dim);color:var(--purple)">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        </div>
        <div class="stat-card-num" style="color:var(--purple)">${assetStats.total}</div>
        <div class="stat-card-label">Tài nguyên media (${Utils.formatBytes(assetStats.totalSize)})</div>
      </div>
    `;

    // Update draft count badge
    const badge = document.getElementById('draftCount');
    if (badge) badge.textContent = stats.draft || '';
  } catch (e) {
    document.getElementById('statGrid').innerHTML = `<div style="padding:20px;color:var(--text-muted);font-size:13px;grid-column:1/-1">Không thể tải thống kê</div>`;
  }

  // Load recent content
  try {
    const { data } = await API.content.list({ limit: 8, sort: 'updated_at', order: 'desc' });
    const tbody = data.map(c => `
      <tr>
        <td class="title-cell"><a href="#/content/${c.id}">${Utils.esc(Utils.truncate(c.title, 45))}</a></td>
        <td>${Utils.typeBadge(c.type)}</td>
        <td>${Utils.statusBadge(c.status)}</td>
        <td>${Utils.timeAgo(c.updated_at)}</td>
      </tr>
    `).join('');
    document.getElementById('recentContent').innerHTML = `
      <table class="data-table">
        <thead><tr><th>Tiêu đề</th><th>Loại</th><th>Trạng thái</th><th>Cập nhật</th></tr></thead>
        <tbody>${tbody || '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:24px">Chưa có nội dung</td></tr>'}</tbody>
      </table>`;
  } catch {
    document.getElementById('recentContent').innerHTML = `<div style="padding:20px;color:var(--text-muted);font-size:13px">Không thể tải dữ liệu</div>`;
  }
}
window.renderDashboard = renderDashboard;
