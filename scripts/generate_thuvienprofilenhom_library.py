import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

html_content = """<!DOCTYPE html>
<html lang="vi">
<head>
  <link rel="icon" type="image/svg+xml" href="assets/images/logo-sv-main.svg" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0F172A" />
  <title>Thư Viện Hệ Nhôm &amp; Profile Kỹ Thuật | SV ALUMINIUM — Sao Vàng</title>
  <meta name="description" content="Thư viện tra cứu 16 hệ nhôm chiến lược SV ALUMINIUM: Bảng thông số mặt cắt, nhóm công năng, bảng màu sơn tĩnh điện, tùy chọn mạ Anodize ED và tải Catalogue / Bản vẽ CAD chính thức." />
  <meta name="keywords" content="thư viện profile nhôm, bản vẽ cad cửa nhôm, mặt cắt nhôm xingfa, nhôm slim, nhôm l180 panorama, catalogue nhôm yongxing, sao vàng aluminium" />
  
  <meta property="og:title" content="Thư Viện Hệ Nhôm &amp; Profile Kỹ Thuật | SV ALUMINIUM — Sao Vàng" />
  <meta property="og:description" content="Tra cứu danh mục 16 hệ nhôm chiến lược, thông số tiết diện, tùy chọn hoàn thiện và tải tài liệu kỹ thuật có quản lý kiểm định." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="assets/images/projects/yacht-tulip/hero.jpg" />
  <link rel="canonical" href="https://www.cokhisaovang.com/thuvienprofilenhom.html" />

  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" />
  <link rel="stylesheet" href="assets/css/main.css" />

  <style>
    :root {
      --sv-dark: #0F172A;
      --sv-dark-card: #1E293B;
      --sv-gold: #C9A227;
      --sv-gold-light: #E5C158;
      --sv-slate: #64748B;
      --sv-bg-light: #F8FAFC;
      --ff-head: 'Montserrat', sans-serif;
      --ff-body: 'Inter', sans-serif;
    }

    body { font-family: var(--ff-body); color: #334155; background-color: #FFFFFF; }
    
    .al-tag {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: var(--ff-head); font-size: 11px; font-weight: 800;
      letter-spacing: 0.14em; text-transform: uppercase; color: var(--sv-gold); margin-bottom: 12px;
    }
    .al-title {
      font-family: var(--ff-head); font-size: clamp(24px, 4vw, 36px);
      font-weight: 800; color: var(--sv-dark); line-height: 1.25; margin-bottom: 16px;
    }

    /* HERO */
    .lib-hero {
      position: relative; background: radial-gradient(circle at 50% 30%, #1E293B 0%, #0F172A 100%);
      color: #FFFFFF; padding: 150px 0 80px; text-align: center; border-bottom: 1px solid rgba(201, 162, 39, 0.2);
    }
    .lib-hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(201, 162, 39, 0.12); border: 1px solid rgba(201, 162, 39, 0.4);
      padding: 6px 18px; border-radius: 30px; font-family: var(--ff-head);
      font-size: 11px; font-weight: 800; color: var(--sv-gold); text-transform: uppercase;
      letter-spacing: 0.12em; margin-bottom: 20px;
    }
    .lib-hero-h1 {
      font-family: var(--ff-head); font-size: clamp(28px, 5vw, 48px);
      font-weight: 900; line-height: 1.2; margin-bottom: 16px;
    }
    .lib-hero-h1 span {
      background: linear-gradient(135deg, #FFFFFF 0%, var(--sv-gold) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .lib-hero-p { font-size: clamp(14.5px, 1.8vw, 17px); color: #94A3B8; max-width: 760px; margin: 0 auto 24px; line-height: 1.7; }

    /* FILTER BAR */
    .filter-panel {
      background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px;
      padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); margin-top: -40px;
      position: relative; z-index: 10; margin-bottom: 40px;
    }
    .filter-row {
      display: flex; gap: 16px; flex-wrap: wrap; align-items: center; justify-content: space-between;
    }
    .filter-search-box {
      flex: 1; min-width: 260px; position: relative;
    }
    .filter-search-box input {
      width: 100%; padding: 12px 16px 12px 42px; border: 1px solid #CBD5E1;
      border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s;
    }
    .filter-search-box input:focus { border-color: var(--sv-gold); }
    .filter-search-icon {
      position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
      color: #94A3B8; font-size: 18px;
    }

    .filter-tab-group {
      display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; max-width: 100%;
    }
    .filter-tab-btn {
      padding: 8px 16px; border-radius: 20px; font-family: var(--ff-head);
      font-size: 12px; font-weight: 700; border: 1px solid #E2E8F0;
      background: #F8FAFC; color: #475569; cursor: pointer; white-space: nowrap;
      transition: all 0.2s ease;
    }
    .filter-tab-btn:hover { border-color: var(--sv-gold); color: #0F172A; }
    .filter-tab-btn.active {
      background: #0F172A; color: var(--sv-gold); border-color: #0F172A;
    }

    /* TABLE VIEW */
    .lib-table-wrap {
      background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px;
      overflow-x: auto; box-shadow: 0 4px 16px rgba(0,0,0,0.02);
    }
    .lib-table {
      width: 100%; border-collapse: collapse; text-align: left; min-width: 900px;
    }
    .lib-table th {
      background: #F8FAFC; padding: 16px 20px; font-family: var(--ff-head);
      font-size: 11.5px; font-weight: 800; color: #0F172A; text-transform: uppercase;
      letter-spacing: 0.05em; border-bottom: 1px solid #E2E8F0;
    }
    .lib-table td {
      padding: 16px 20px; border-bottom: 1px solid #F1F5F9; font-size: 13px;
      vertical-align: middle; color: #475569;
    }
    .lib-table tr:hover td { background: #FAFBFD; }

    .sys-code-badge {
      display: inline-block; background: #0F172A; color: var(--sv-gold);
      font-family: var(--ff-head); font-size: 11px; font-weight: 800;
      padding: 4px 10px; border-radius: 4px; letter-spacing: 0.04em;
    }
    .level-badge {
      display: inline-block; font-family: var(--ff-head); font-size: 10px;
      font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;
    }
    .level-essential { background: #F1F5F9; color: #475569; }
    .level-premium { background: #E0F2FE; color: #0284C7; }
    .level-signature { background: #FEF3C7; color: #D97706; }
    .level-ultra { background: #0F172A; color: #C9A227; }

    .anodize-badge {
      display: inline-flex; align-items: center; gap: 4px;
      background: #FFFDF5; border: 1px solid rgba(201, 162, 39, 0.4);
      color: #92400E; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px;
    }

    .btn-detail {
      background: #FFFFFF; border: 1px solid #CBD5E1; color: #0F172A;
      padding: 6px 14px; border-radius: 6px; font-family: var(--ff-head);
      font-size: 12px; font-weight: 700; cursor: pointer; display: inline-flex;
      align-items: center; gap: 4px; transition: all 0.2s ease;
    }
    .btn-detail:hover { border-color: var(--sv-gold); background: #FFFDF9; color: #C9A227; }

    /* DRAWER / MODAL */
    .drawer-overlay {
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(4px); z-index: 1000; display: none;
      align-items: center; justify-content: center; padding: 20px;
    }
    .drawer-box {
      background: #FFFFFF; border-radius: 14px; max-width: 720px; width: 100%;
      max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      position: relative; padding: 32px;
    }
    .drawer-close {
      position: absolute; right: 20px; top: 20px; background: #F1F5F9;
      border: none; width: 36px; height: 36px; border-radius: 50%;
      font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <header class="header-v2" id="navbar" role="banner">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo" aria-label="Sao Vàng">
        <img width="200" height="60" fetchpriority="high" loading="eager" src="assets/images/logo-sv-main.svg" alt="SAO VÀNG" style="height: 48px; width: auto; display: block;" />
      </a>
      <nav class="nav-menu" id="navMenu" role="navigation" aria-label="Menu chính">
        <a href="index.html" class="nav-menu-link">Trang Chủ</a>
        <a href="gioithieu.html" class="nav-menu-link">Giới Thiệu</a>
        <a href="cokhisaovang.html" class="nav-menu-link">Cơ Khí Sao Vàng</a>
        <a href="nhomsaovang.html" class="nav-menu-link">SV Aluminium</a>
        <a href="cuanhomkinh.html" class="nav-menu-link">Cửa Nhôm Kính</a>
        <a href="vachkinh.html" class="nav-menu-link">Vách Kính &amp; Mặt Dựng</a>
        <a href="thuvienprofilenhom.html" class="nav-menu-link active">Thư Viện Profile</a>
        <a href="duan.html" class="nav-menu-link">Dự Án</a>
        <a href="lienhe.html" class="nav-menu-link">Liên Hệ</a>
      </nav>
      <div class="nav-actions">
        <a href="nhomsaovang.html#rfqSection" class="btn-primary" style="font-family: var(--ff-head); font-size: 12.5px; font-weight: 800; padding: 10px 20px; border-radius: 4px; background: #C9A227; color: #0F172A; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
          <i class="ri-file-text-line"></i> YÊU CẦU DỰ TOÁN
        </a>
      </div>
    </div>
  </header>

  <!-- HERO -->
  <section class="lib-hero">
    <div class="container">
      <div class="lib-hero-badge"><i class="ri-database-2-line"></i> SV ALUMINIUM &bull; TECHNICAL LIBRARY</div>
      <h1 class="lib-hero-h1">THƯ VIỆN HỆ NHÔM &amp;<br><span>PROFILE KỸ THUẬT</span></h1>
      <p class="lib-hero-p">
        Tra cứu danh mục 16 hệ nhôm chiến lược, nhóm công năng, bảng màu hoàn thiện, tùy chọn Anodize ED và tải hồ sơ kỹ thuật / Catalogue có quản lý trạng thái kiểm định minh bạch.
      </p>
    </div>
  </section>

  <!-- MAIN LIBRARY SECTION -->
  <section style="padding: 0 0 90px; background: #F8FAFC;">
    <div class="container">

      <!-- FILTER PANEL -->
      <div class="filter-panel">
        <div class="filter-row" style="margin-bottom: 16px;">
          <div class="filter-search-box">
            <i class="ri-search-line filter-search-icon"></i>
            <input type="text" id="sysSearchInput" placeholder="Tìm theo mã hệ (ví dụ: XF55, L180, Slim 40, C65, MD65)..." onkeyup="filterSystems()" />
          </div>
          <div style="display: flex; gap: 10px;">
            <select id="levelSelect" onchange="filterSystems()" style="padding: 10px 14px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 13px; font-family: var(--ff-head); font-weight: 600;">
              <option value="all">Tất Cả Cấp Độ</option>
              <option value="essential">Essential (Tiêu chuẩn)</option>
              <option value="premium">Premium (Nâng cao)</option>
              <option value="signature">Signature (Cao cấp)</option>
              <option value="ultra-luxury">Ultra Luxury (Độc bản)</option>
            </select>
            <select id="finishSelect" onchange="filterSystems()" style="padding: 10px 14px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 13px; font-family: var(--ff-head); font-weight: 600;">
              <option value="all">Tất Cả Bề Mặt</option>
              <option value="anodize">Có Tùy Chọn Anodize ED</option>
              <option value="feature_colors">Màu Xám Ánh Kim / Nhũ Bạc</option>
            </select>
          </div>
        </div>

        <!-- Group Tabs -->
        <div class="filter-tab-group" id="groupTabs">
          <button class="filter-tab-btn active" onclick="setGroupFilter('all', this)">Tất Cả (16 Hệ)</button>
          <button class="filter-tab-btn" onclick="setGroupFilter('opening', this)">01. Cửa Mở Quay (5)</button>
          <button class="filter-tab-btn" onclick="setGroupFilter('sliding-panorama', this)">02. Cửa Lùa &amp; Panorama (4)</button>
          <button class="filter-tab-btn" onclick="setGroupFilter('slim', this)">03. Hệ Nhôm Slim (2)</button>
          <button class="filter-tab-btn" onclick="setGroupFilter('special', this)">04. Cửa Đặc Biệt (3)</button>
          <button class="filter-tab-btn" onclick="setGroupFilter('facade', this)">05. Mặt Dựng Kiến Trúc (2)</button>
        </div>
      </div>

      <!-- MASTER TABLE -->
      <div class="lib-table-wrap">
        <table class="lib-table">
          <thead>
            <tr>
              <th>Mã Hệ</th>
              <th>Tên Hệ Nhôm &amp; Mã Gốc</th>
              <th>Nhóm Công Năng</th>
              <th>Phân Khúc Đề Xuất</th>
              <th>Màu Sơn Tĩnh Điện</th>
              <th>Mạ Anodize ED</th>
              <th style="text-align: right;">Chi Tiết &amp; CAD</th>
            </tr>
          </thead>
          <tbody id="systemsTableBody">
            <!-- Systems rendered dynamically via JavaScript from JSON -->
          </tbody>
        </table>
      </div>

      <!-- Verification Policy Note -->
      <div style="margin-top: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px 20px; display: flex; align-items: center; gap: 12px; font-size: 12.5px; color: #64748B;">
        <i class="ri-information-line" style="color: #0284C7; font-size: 18px; flex-shrink: 0;"></i>
        <span>
          <strong>Chính sách kiểm định dữ liệu:</strong> Mọi thông số kỹ thuật (độ dày kính, kích thước cánh, kết cấu rãnh) đều có cờ trạng thái kiểm định rõ ràng nhằm đảm bảo tính chính xác và minh bạch tuyệt đối cho hồ sơ thiết kế.
        </span>
      </div>

    </div>
  </section>

  <!-- DETAIL DRAWER MODAL -->
  <div class="drawer-overlay" id="detailDrawer" onclick="closeDrawer(event)">
    <div class="drawer-box" onclick="event.stopPropagation()">
      <button class="drawer-close" onclick="closeDrawerDirect()">&times;</button>
      <div id="drawerContent">
        <!-- Injected dynamically -->
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="footer-v2" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-brand">
            <img width="180" height="54" loading="lazy" src="assets/images/logo-sv-main.svg" alt="SAO VÀNG" style="height: 44px; width: auto; display: block; margin-bottom: 12px;" />
            <p class="footer-desc">SV ALUMINIUM &bull; Architectural Aluminium Systems — Giải pháp nhôm kính từ phân khúc tiêu chuẩn đến kiến trúc cao cấp cho Residence, Villa, Hospitality &amp; Yacht.</p>
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">HỆ THỐNG NHÔM KÍNH</div>
          <div class="footer-links">
            <a href="cuanhomkinh.html" class="footer-link">Cửa Nhôm Kính Cao Cấp</a>
            <a href="vachkinh.html" class="footer-link">Vách Kính &amp; Mặt Dựng</a>
            <a href="thuvienprofilenhom.html" class="footer-link">Thư Viện Profile Nhôm</a>
            <a href="nhomsaovang.html#finishesSection" class="footer-link">Bảng Màu &amp; Anodize ED</a>
            <a href="duan.html" class="footer-link">Dự Án Đã Thực Hiện</a>
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">LIÊN HỆ KỸ THUẬT</div>
          <div class="footer-contact-item"><i class="ri-phone-fill"></i> Hotline / Zalo: 0869 590 279</div>
          <div class="footer-contact-item"><i class="ri-mail-fill"></i> cokhisaovangvn@gmail.com</div>
          <div class="footer-contact-item"><i class="ri-map-pin-fill"></i> Tầng 3, TT7-35 KĐT Văn Phú, Hà Đông, Hà Nội</div>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; 2026 CÔNG TY CỔ PHẦN SẢN XUẤT CƠ KHÍ SAO VÀNG. MST: 0110808047.</p>
      </div>
    </div>
  </footer>

  <script src="assets/js/main.js"></script>
  <script src="assets/js/aluminium-rfq.js"></script>
  <script>
    let allSystems = [];
    let currentGroup = 'all';

    async function initLibrary() {
      try {
        const res = await fetch('data/aluminium/systems.json');
        const data = await res.json();
        allSystems = data.systems || [];
        renderSystems();
      } catch (err) {
        console.error('Error loading aluminium systems:', err);
      }
    }

    function setGroupFilter(grp, btn) {
      currentGroup = grp;
      document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterSystems();
    }

    function filterSystems() {
      const search = document.getElementById('sysSearchInput').value.toLowerCase();
      const level = document.getElementById('levelSelect').value;
      const finish = document.getElementById('finishSelect').value;

      const filtered = allSystems.filter(s => {
        // Group filter
        if (currentGroup !== 'all' && s.group_id !== currentGroup) return false;
        
        // Search filter
        if (search) {
          const matchSearch = s.code.toLowerCase().includes(search) || 
                              s.name.toLowerCase().includes(search) || 
                              (s.raw_code && s.raw_code.toLowerCase().includes(search));
          if (!matchSearch) return false;
        }

        // Level filter
        if (level !== 'all' && s.level && s.level.recommended_value !== level) return false;

        // Finish filter
        if (finish === 'anodize') {
          if (!s.finishes.anodizeColors || s.finishes.anodizeColors.length === 0) return false;
        } else if (finish === 'feature_colors') {
          const pCols = s.finishes.powderColors || [];
          if (!pCols.includes('metallic-gray') && !pCols.includes('infinity-silver-gray')) return false;
        }

        return true;
      });

      renderTable(filtered);
    }

    function renderSystems() {
      renderTable(allSystems);
    }

    function renderTable(list) {
      const tbody = document.getElementById('systemsTableBody');
      if (!tbody) return;

      if (!list || list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 32px; color: #94A3B8;">Không tìm thấy hệ nhôm phù hợp với bộ lọc.</td></tr>`;
        return;
      }

      const groupNames = {
        'opening': 'Cửa Mở Quay',
        'sliding-panorama': 'Cửa Lùa & Panorama',
        'slim': 'Hệ Nhôm Slim',
        'special': 'Cửa Đặc Biệt',
        'facade': 'Mặt Dựng Facade'
      };

      const levelClasses = {
        'essential': 'level-essential',
        'premium': 'level-premium',
        'signature': 'level-signature',
        'ultra-luxury': 'level-ultra'
      };

      tbody.innerHTML = list.map(s => {
        const lvl = s.level ? s.level.recommended_value : 'essential';
        const hasAnodize = s.finishes && s.finishes.anodizeColors && s.finishes.anodizeColors.length > 0;
        
        // Powder color summary text
        const pColors = s.finishes.powderColors || [];
        let pColorText = 'Đa dạng màu';
        if (pColors.includes('infinity-silver-gray') && pColors.includes('metallic-gray')) {
          pColorText = 'Xám Vô Cực, Xám Ánh Kim...';
        } else if (pColors.length === 1 && pColors[0] === 'infinity-silver-gray') {
          pColorText = 'Xám Vô Cực Nhũ Bạc';
        } else if (pColors.length === 1 && pColors[0] === 'metallic-gray') {
          pColorText = 'Xám Ánh Kim';
        }

        return `
          <tr>
            <td><span class="sys-code-badge">${s.code}</span></td>
            <td>
              <strong style="color: #0F172A; display: block; font-size: 14px;">${s.name}</strong>
              <span style="font-size: 11px; color: #94A3B8;">${s.raw_code || ''}</span>
            </td>
            <td><span style="font-weight: 600; color: #475569;">${groupNames[s.group_id] || s.group_id}</span></td>
            <td>
              <span class="level-badge ${levelClasses[lvl] || 'level-essential'}">${lvl.toUpperCase()}</span>
              <span style="font-size: 10px; color: #94A3B8; display: block; margin-top: 2px;">◐ Đang kiểm chứng</span>
            </td>
            <td><span style="font-size: 12px; color: #475569;">${pColorText}</span></td>
            <td>
              ${hasAnodize ? `<span class="anodize-badge"><i class="ri-sparkling-fill" style="color:#C9A227"></i> Champagne V8/Y01</span>` : `<span style="color:#CBD5E1; font-size:12px;">Theo đặt hàng</span>`}
            </td>
            <td style="text-align: right;">
              <button class="btn-detail" onclick="openSystemDetail('${s.id}')">
                <i class="ri-eye-line"></i> Xem Profile
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    function openSystemDetail(sysId) {
      const s = allSystems.find(x => x.id === sysId);
      if (!s) return;

      const groupNames = {
        'opening': 'Cửa Mở Quay Châu Âu',
        'sliding-panorama': 'Cửa Lùa & Panorama Khổ Lớn',
        'slim': 'Hệ Nhôm Slim Tối Giản',
        'special': 'Cửa Thủy Lực & Xếp Trượt Đặc Biệt',
        'facade': 'Vách Kính & Mặt Dựng Kiến Trúc'
      };

      const hasAnodize = s.finishes && s.finishes.anodizeColors && s.finishes.anodizeColors.length > 0;

      const html = `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
          <span class="sys-code-badge" style="font-size:12px; padding:5px 12px;">${s.code}</span>
          <span style="font-family:var(--ff-head); font-size:11px; font-weight:800; color:#C9A227; text-transform:uppercase;">${groupNames[s.group_id] || ''}</span>
        </div>
        <h2 style="font-family:var(--ff-head); font-size:24px; font-weight:800; color:#0F172A; margin:0 0 8px;">${s.name}</h2>
        <p style="font-size:12px; color:#94A3B8; margin-bottom:20px;">Mã đối chiếu catalog: <strong>${s.raw_code || ''}</strong> &bull; Nhà máy: <strong>${(s.brands || []).join(', ')}</strong></p>

        <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:16px; margin-bottom:20px;">
          <div style="font-family:var(--ff-head); font-size:12px; font-weight:800; color:#0F172A; margin-bottom:6px;">MÔ TẢ GIẢI PHÁP KIẾN TRÚC</div>
          <p style="font-size:13.5px; color:#475569; line-height:1.6; margin:0;">${s.marketing ? s.marketing.description : ''}</p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px; font-size:13px;">
          <div>
            <strong style="display:block; color:#0F172A; margin-bottom:4px;">Ứng Dụng Thực Tế:</strong>
            <ul style="margin:0; padding-left:18px; color:#64748B;">
              ${(s.applications || []).map(a => `<li>${a}</li>`).join('')}
            </ul>
          </div>
          <div>
            <strong style="display:block; color:#0F172A; margin-bottom:4px;">Tùy Chọn Bề Mặt:</strong>
            <div style="color:#64748B;">
              <div>&bull; Sơn tĩnh điện: ${(s.finishes.powderColors || []).join(', ')}</div>
              <div>&bull; Mạ Anodize ED: ${hasAnodize ? 'Champagne V8, Champagne Y01' : 'Theo đơn đặt hàng'}</div>
            </div>
          </div>
        </div>

        <div style="background:#FFFDF9; border:1px solid rgba(201,162,39,0.3); border-radius:8px; padding:14px; margin-bottom:24px; font-size:12px; color:#78350F;">
          <strong>Trạng thái xác minh kỹ thuật:</strong> Thông số tiết diện &amp; tải trọng đang ở chế độ <code>pending_verification</code>, đối chiếu trực tiếp theo bản vẽ dự án cụ thể.
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; border-top:1px solid #E2E8F0; padding-top:20px;">
          <a href="${s.documents && s.documents.catalogue ? s.documents.catalogue : 'nhomsaovang.html#rfqSection'}" target="_blank" style="background:#F1F5F9; color:#0F172A; font-family:var(--ff-head); font-size:12.5px; font-weight:700; padding:10px 20px; border-radius:6px; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
            <i class="ri-file-download-line"></i> Tải Catalogue PDF
          </a>
          <a href="nhomsaovang.html#rfqSection" style="background:#C9A227; color:#0F172A; font-family:var(--ff-head); font-size:12.5px; font-weight:800; padding:10px 20px; border-radius:6px; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
            <i class="ri-file-text-line"></i> Yêu Cầu Báo Giá Hệ Này
          </a>
        </div>
      `;

      document.getElementById('drawerContent').innerHTML = html;
      document.getElementById('detailDrawer').style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer(e) {
      if (e.target.id === 'detailDrawer') closeDrawerDirect();
    }
    function closeDrawerDirect() {
      document.getElementById('detailDrawer').style.display = 'none';
      document.body.style.overflow = '';
    }

    document.addEventListener('DOMContentLoaded', initLibrary);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawerDirect(); });
  </script>
</body>
</html>
"""

with open(r"d:\Sao Vàng\Website-SaoVang\website\thuvienprofilenhom.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("✅ Generated thuvienprofilenhom.html Aluminium System Library!")
