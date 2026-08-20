import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = r"d:\Sao Vàng\Website-SaoVang"
DATA_DIR = os.path.join(ROOT_DIR, "website", "data", "aluminium")
OUTPUT_FILE = os.path.join(ROOT_DIR, "website", "nhomsaovang.html")

# Load JSON Data
with open(os.path.join(DATA_DIR, "systems.json"), "r", encoding="utf-8") as f:
    systems = json.load(f)

with open(os.path.join(DATA_DIR, "solutions.json"), "r", encoding="utf-8") as f:
    solutions = json.load(f)

with open(os.path.join(DATA_DIR, "markets.json"), "r", encoding="utf-8") as f:
    markets = json.load(f)

with open(os.path.join(DATA_DIR, "levels.json"), "r", encoding="utf-8") as f:
    levels = json.load(f)

with open(os.path.join(DATA_DIR, "materials.json"), "r", encoding="utf-8") as f:
    materials = json.load(f)

with open(os.path.join(DATA_DIR, "case_studies.json"), "r", encoding="utf-8") as f:
    case_studies = json.load(f)

html_template = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <link rel="icon" type="image/svg+xml" href="assets/images/logo-sv-main.svg" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0F172A" />
  <title>SV ALUMINIUM | Architectural Aluminium Systems — Sao Vàng</title>
  <meta name="description" content="SV ALUMINIUM — Giải pháp nhôm kính kiến trúc từ phân khúc tiêu chuẩn đến Ultra Luxury cho Residence, Villa, Hospitality & SV Marine Yacht Division. Khám phá 6 tầng giải pháp, 16 hệ nhôm chiến lược và công nghệ Anodize ED." />
  <meta name="keywords" content="nhôm kiến trúc, cửa nhôm cao cấp, cửa lùa panorama, nhôm slim, cửa thủy lực, mặt dựng nhôm kính, cửa nhôm rãnh C, anodize ED champagne, sao vàng aluminium" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="SV ALUMINIUM | Architectural Aluminium Systems — Sao Vàng" />
  <meta property="og:description" content="Giải pháp nhôm kính từ phân khúc tiêu chuẩn đến Ultra Luxury cho Residence, Villa, Hospitality & Yacht." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="assets/images/projects/yacht-tulip/hero.jpg" />
  <link rel="canonical" href="https://www.cokhisaovang.com/nhomsaovang.html" />

  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" />
  <link rel="stylesheet" href="assets/css/main.css" />
  
  <style>
    :root {{
      --sv-dark: #0F172A;
      --sv-dark-card: #1E293B;
      --sv-dark-border: #334155;
      --sv-gold: #C9A227;
      --sv-gold-light: #E5C158;
      --sv-gold-dim: rgba(201, 162, 39, 0.15);
      --sv-slate: #64748B;
      --sv-bg-light: #F8FAFC;
      --ff-head: 'Montserrat', sans-serif;
      --ff-body: 'Inter', sans-serif;
    }}

    body {{
      font-family: var(--ff-body);
      color: #334155;
      background-color: #FFFFFF;
      overflow-x: hidden;
    }}

    .al-tag {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: var(--ff-head);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--sv-gold);
      margin-bottom: 12px;
    }}
    .al-title {{
      font-family: var(--ff-head);
      font-size: clamp(24px, 4vw, 36px);
      font-weight: 800;
      color: var(--sv-dark);
      line-height: 1.25;
      margin-bottom: 16px;
    }}
    .al-title-light {{
      color: #FFFFFF;
    }}
    .al-subtitle {{
      font-size: clamp(14px, 1.8vw, 16px);
      color: var(--sv-slate);
      line-height: 1.7;
      max-width: 700px;
    }}
    .al-subtitle-light {{
      color: #94A3B8;
    }}

    /* 01. HERO SECTION */
    .al-hero {{
      position: relative;
      background: radial-gradient(circle at 50% 30%, #1E293B 0%, #0F172A 100%);
      color: #FFFFFF;
      padding: 160px 0 100px;
      overflow: hidden;
      border-bottom: 1px solid rgba(201, 162, 39, 0.2);
    }}
    .al-hero::before {{
      content: '';
      position: absolute;
      inset: 0;
      background: url('assets/images/projects/yacht-tulip/hero.jpg') center/cover no-repeat;
      opacity: 0.12;
      pointer-events: none;
    }}
    .al-hero-content {{
      position: relative;
      z-index: 2;
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
    }}
    .al-hero-badge {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(201, 162, 39, 0.12);
      border: 1px solid rgba(201, 162, 39, 0.4);
      padding: 6px 18px;
      border-radius: 30px;
      font-family: var(--ff-head);
      font-size: 11.5px;
      font-weight: 800;
      color: var(--sv-gold);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: 24px;
    }}
    .al-hero-h1 {{
      font-family: var(--ff-head);
      font-size: clamp(32px, 5.5vw, 54px);
      font-weight: 900;
      letter-spacing: -0.02em;
      line-height: 1.15;
      margin-bottom: 20px;
      text-transform: uppercase;
    }}
    .al-hero-h1 span {{
      background: linear-gradient(135deg, #FFFFFF 0%, var(--sv-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}
    .al-hero-p {{
      font-size: clamp(15px, 2vw, 17.5px);
      color: #94A3B8;
      line-height: 1.75;
      max-width: 760px;
      margin: 0 auto 36px;
    }}
    .al-hero-actions {{
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }}
    .al-btn-gold {{
      background: var(--sv-gold);
      color: #0F172A;
      font-family: var(--ff-head);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 14px 28px;
      border-radius: 4px;
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }}
    .al-btn-gold:hover {{
      background: var(--sv-gold-light);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(201, 162, 39, 0.4);
    }}
    .al-btn-outline {{
      background: transparent;
      color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.3);
      font-family: var(--ff-head);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 14px 28px;
      border-radius: 4px;
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }}
    .al-btn-outline:hover {{
      border-color: var(--sv-gold);
      color: var(--sv-gold);
      background: rgba(201, 162, 39, 0.05);
    }}

    /* STATS BAR */
    .al-stats-bar {{
      background: #0B1120;
      border-bottom: 1px solid #1E293B;
      padding: 30px 0;
    }}
    .al-stats-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      text-align: center;
    }}
    .al-stat-num {{
      font-family: var(--ff-head);
      font-size: clamp(28px, 4vw, 40px);
      font-weight: 900;
      color: var(--sv-gold);
      line-height: 1;
      margin-bottom: 6px;
    }}
    .al-stat-label {{
      font-size: 12.5px;
      font-weight: 600;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }}

    /* SECTION PADDINGS */
    .al-section {{
      padding: 90px 0;
    }}
    .al-section-dark {{
      background: var(--sv-dark);
      color: #FFFFFF;
    }}
    .al-section-light {{
      background: var(--sv-bg-light);
    }}

    /* CARDS */
    .sol-card {{
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 32px;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }}
    .sol-card:hover {{
      border-color: var(--sv-gold);
      box-shadow: 0 12px 32px rgba(0,0,0,0.06);
      transform: translateY(-4px);
    }}

    .finder-pill {{
      background: #1E293B;
      border: 1px solid #334155;
      color: #94A3B8;
      padding: 8px 16px;
      border-radius: 20px;
      font-family: var(--ff-head);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }}
    .finder-pill:hover {{
      border-color: var(--sv-gold);
      color: #FFFFFF;
    }}
    .finder-pill.active {{
      background: var(--sv-gold);
      border-color: var(--sv-gold);
      color: #0F172A;
      box-shadow: 0 2px 10px rgba(201, 162, 39, 0.4);
    }}

    @media (max-width: 991px) {{
      .al-stats-grid {{ grid-template-columns: repeat(2, 1fr); gap: 24px; }}
    }}
    @media (max-width: 576px) {{
      .al-stats-grid {{ grid-template-columns: 1fr; }}
    }}
  </style>
</head>
<body>

  <!-- SECTION 1 - HEADER -->
  <header class="header-v2" id="navbar" role="banner">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo" aria-label="SV ALUMINIUM — Trang chủ">
        <img width="220" height="60" fetchpriority="high" loading="eager" src="assets/images/logo-nhom.png" alt="SV ALUMINIUM — Architectural Systems" style="height: 46px; width: auto; display: block;" />
      </a>
      <nav class="nav-menu" id="navMenu" role="navigation" aria-label="Menu chính">
        <a href="index.html" class="nav-menu-link">Trang Chủ</a>
        <a href="gioithieu.html" class="nav-menu-link">Giới Thiệu</a>
        <a href="cokhisaovang.html" class="nav-menu-link">Cơ Khí Sao Vàng</a>
        <a href="nhomsaovang.html" class="nav-menu-link active">SV Aluminium</a>
        <a href="cuanhomkinh.html" class="nav-menu-link">Cửa Nhôm Kính</a>
        <a href="vachkinh.html" class="nav-menu-link">Vách Kính &amp; Mặt Dựng</a>
        <a href="thuvienprofilenhom.html" class="nav-menu-link">Thư Viện Profile</a>
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

  <!-- 01. HERO SECTION -->
  <section class="al-hero">
    <div class="container">
      <div class="al-hero-content">
        <div class="al-hero-badge">
          <i class="ri-shield-star-line"></i> SV ALUMINIUM &bull; ARCHITECTURAL ALUMINIUM SYSTEMS
        </div>
        <h1 class="al-hero-h1">
          GIẢI PHÁP NHÔM KÍNH KIẾN TRÚC<br />
          <span>TỪ TIÊU CHUẨN ĐẾN ĐỘC BẢN</span>
        </h1>
        <p class="al-hero-p">
          Nền tảng giải pháp nhôm kính kiến trúc toàn diện phục vụ từ phân khúc Essential đến Ultra Luxury cho Residence, Villa, Penthouse, Resort 5 Sao và Phân hiệu chuyên biệt <strong>SV Marine / Yacht Division</strong>.
        </p>
        <div class="al-hero-actions">
          <a href="#solutionsSection" class="al-btn-gold">
            <i class="ri-layout-grid-line"></i> Khám Phá 6 Giải Pháp
          </a>
          <a href="#smartFinderSection" class="al-btn-outline">
            <i class="ri-magic-line"></i> Bắt Đầu Tư Vấn 6 Bước
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- STATS BAR -->
  <div class="al-stats-bar">
    <div class="container">
      <div class="al-stats-grid">
        <div>
          <div class="al-stat-num">16</div>
          <div class="al-stat-label">Hệ Nhôm Chiến Lược</div>
        </div>
        <div>
          <div class="al-stat-num">06</div>
          <div class="al-stat-label">Giải Pháp Kiến Trúc</div>
        </div>
        <div>
          <div class="al-stat-num">04</div>
          <div class="al-stat-label">Tầng Giá Trị Định Vị</div>
        </div>
        <div>
          <div class="al-stat-num">3 Tầng</div>
          <div class="al-stat-label">Hoàn Thiện &amp; Anodize ED</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 02. MARKETS & BUILDING TYPES -->
  <section class="al-section al-section-light" id="marketsSection">
    <div class="container">
      <div style="text-align: center; max-width: 760px; margin: 0 auto 50px;">
        <span class="al-tag"><i class="ri-building-line"></i> PHÂN KHÚC CÔNG TRÌNH</span>
        <h2 class="al-title">Được Thiết Kế Cho Từng Loại Hình Kiến Trúc</h2>
        <p class="al-subtitle" style="margin: 0 auto;">Từ không gian sống hiện đại đến những công trình nghỉ dưỡng và du thuyền siêu sang ngoài biển mặn.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
"""

for m in markets:
    is_marine = m['id'] == 'marine-yacht'
    html_template += f"""
        <div style="background: {'#0F172A' if is_marine else '#FFFFFF'}; border: 1px solid {'#C9A227' if is_marine else '#E2E8F0'}; border-radius: 10px; padding: 24px; color: {'#FFFFFF' if is_marine else '#1E293B'}; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="font-family: var(--ff-head); font-size: 15px; font-weight: 800; color: {'#E5C158' if is_marine else '#0F172A'}; margin-bottom: 8px;">
            {'🛥️ ' if is_marine else '🏛️ '}{m['name']}
          </div>
          <p style="font-size: 13px; color: {'#94A3B8' if is_marine else '#64748B'}; line-height: 1.6; margin: 0;">
            {m['description']}
          </p>
        </div>
    """

html_template += f"""
      </div>
    </div>
  </section>

  <!-- 03. 4 ARCHITECTURAL LEVELS -->
  <section class="al-section" style="background: #FFFFFF;" id="levelsSection">
    <div class="container">
      <div style="text-align: center; max-width: 760px; margin: 0 auto 50px;">
        <span class="al-tag"><i class="ri-vip-crown-line"></i> 4 TẦNG GIÁ TRỊ ĐỊNH VỊ</span>
        <h2 class="al-title">Chuẩn Mực Định Vị Không Gian &amp; Mức Đầu Tư</h2>
        <p class="al-subtitle" style="margin: 0 auto;">Không dùng cách phân loại giá rẻ, chúng tôi định vị giải pháp nhôm kính theo 4 tầng giá trị kiến trúc chuyên nghiệp.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
"""

for lvl in levels:
    html_template += f"""
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-top: 4px solid #C9A227; border-radius: 10px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-family: var(--ff-head); font-size: 16px; font-weight: 900; color: #0F172A;">{lvl['name']}</span>
              <span style="color: #C9A227; font-weight: 800; font-size: 14px;">{lvl['investment']}</span>
            </div>
            <div style="font-family: var(--ff-head); font-size: 12px; font-weight: 700; color: #C9A227; margin-bottom: 12px; text-transform: uppercase;">
              {lvl['tagline']}
            </div>
            <p style="font-size: 13.5px; color: #64748B; line-height: 1.6; margin-bottom: 16px;">
              {lvl['description']}
            </p>
          </div>
          <div style="font-size: 12px; color: #0F172A; font-weight: 600; border-top: 1px dashed #CBD5E1; padding-top: 12px;">
            <strong>Công trình:</strong> {lvl['target_buildings']}
          </div>
        </div>
    """

html_template += f"""
      </div>
    </div>
  </section>

  <!-- 04. THE SOLUTION LAYER (6 SOLUTIONS) -->
  <section class="al-section al-section-dark" id="solutionsSection">
    <div class="container">
      <div style="text-align: center; max-width: 760px; margin: 0 auto 50px;">
        <span class="al-tag"><i class="ri-lightbulb-line"></i> 6 TẦNG GIẢI PHÁP KIẾN TRÚC</span>
        <h2 class="al-title al-title-light">Chọn Giải Pháp Trước Khi Chọn Mã Hệ</h2>
        <p class="al-subtitle al-subtitle-light" style="margin: 0 auto;">Khách hàng không cần nhớ mã nhôm phức tạp. Hãy chọn bài toán không gian của bạn để nhận giải pháp đồng bộ.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
"""

for sol in solutions:
    html_template += f"""
        <div class="sol-card" style="background: #1E293B; border-color: #334155;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-family: var(--ff-head); font-size: 11px; font-weight: 800; color: #C9A227; text-transform: uppercase;">{sol['code']}</span>
              <span style="font-size: 11px; font-weight: 700; background: rgba(201, 162, 39, 0.15); color: #E5C158; padding: 2px 8px; border-radius: 4px;">{sol['level_tier']}</span>
            </div>
            <h3 style="font-family: var(--ff-head); font-size: 18px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">{sol['name']}</h3>
            <div style="font-size: 12.5px; font-weight: 600; color: #94A3B8; margin-bottom: 14px; font-style: italic;">{sol['tagline']}</div>
            <p style="font-size: 13.5px; color: #CBD5E1; line-height: 1.6; margin-bottom: 16px;">
              {sol['description']}
            </p>
            <div style="background: #0F172A; border-radius: 8px; padding: 12px; font-size: 12px; color: #94A3B8; margin-bottom: 18px;">
              <div style="margin-bottom: 4px;"><strong style="color: #E2E8F0;">Không gian:</strong> {", ".join(sol['target_spaces'])}</div>
              <div style="margin-bottom: 4px;"><strong style="color: #E2E8F0;">Kính khuyến nghị:</strong> {sol['glass_recommended']}</div>
              <div><strong style="color: #E2E8F0;">Hoàn thiện:</strong> {sol['finish_recommended']}</div>
            </div>
          </div>
          <a href="thuvienprofilenhom.html?sol={sol['id']}" class="al-btn-gold" style="text-align: center; justify-content: center; font-size: 12px; padding: 10px 16px;">
            Xem Các Hệ Nhôm Tương Ứng &rarr;
          </a>
        </div>
    """

html_template += f"""
      </div>
    </div>
  </section>

  <!-- 05. 16 SYSTEMS PREVIEW -->
  <section class="al-section al-section-light" id="systemsSection">
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; flex-wrap: wrap; gap: 16px;">
        <div>
          <span class="al-tag"><i class="ri-archive-line"></i> 16 HỆ NHÔM CHIẾN LƯỢC</span>
          <h2 class="al-title" style="margin-bottom: 0;">Khám Phá Danh Mục Profile Chuẩn Hóa</h2>
        </div>
        <a href="thuvienprofilenhom.html" class="al-btn-gold" style="font-size: 12px; padding: 10px 20px;">
          Mở Thư Viện Profile Kỹ Thuật <i class="ri-arrow-right-line"></i>
        </a>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
"""

for sys_item in systems[:8]:  # Show top 8 preview cards
    html_template += f"""
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; transition: all 0.3s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-family: var(--ff-head); font-size: 11px; font-weight: 800; color: #C9A227;">{sys_item['code']}</span>
            <span style="font-size: 10.5px; font-weight: 700; color: #16A34A; background: #DCFCE7; padding: 2px 6px; border-radius: 4px;">{sys_item['verification']['badge']}</span>
          </div>
          <h4 style="font-family: var(--ff-head); font-size: 16px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">{sys_item['name']}</h4>
          <div style="font-size: 11.5px; color: #64748B; margin-bottom: 10px;">{sys_item['group_name']}</div>
          <p style="font-size: 12.5px; color: #475569; line-height: 1.5; margin-bottom: 12px;">
            {sys_item['description'][:95]}...
          </p>
          <a href="thuvienprofilenhom.html?sys={sys_item['id']}" style="font-family: var(--ff-head); font-size: 12px; font-weight: 700; color: #C9A227; text-decoration: none;">
            Xem Hồ Sơ Profile &rarr;
          </a>
        </div>
    """

html_template += f"""
      </div>
    </div>
  </section>

  <!-- 06. MATERIAL & GLASS ECOSYSTEM -->
  <section class="al-section" style="background: #FFFFFF;" id="finishesSection">
    <div class="container">
      <div style="text-align: center; max-width: 760px; margin: 0 auto 50px;">
        <span class="al-tag"><i class="ri-palette-line"></i> BỘ SƯU TẬP VẬT LIỆU &amp; BỀ MẶT</span>
        <h2 class="al-title">Hệ Sinh Thái Màu Sắc &amp; Kính Kiến Trúc</h2>
        <p class="al-subtitle" style="margin: 0 auto;">Công nghệ sơn tĩnh điện cao cấp, công nghệ mạ Anodize ED Champagne và hệ kính hộp cản nhiệt chân không.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
        <!-- Powder Coating -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 28px;">
          <h3 style="font-family: var(--ff-head); font-size: 17px; font-weight: 800; color: #0F172A; margin-bottom: 16px;">
            <i class="ri-paint-brush-line" style="color: #C9A227;"></i> Sơn Tĩnh Điện Cao Cấp
          </h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
"""

for pc in materials['powder_coating']:
    html_template += f"""
            <div style="display: flex; align-items: center; gap: 12px; background: #FFFFFF; padding: 10px 14px; border-radius: 8px; border: 1px solid #F1F5F9;">
              <span style="width: 24px; height: 24px; border-radius: 50%; background: {pc['hex']}; border: 1px solid #CBD5E1; display: inline-block;"></span>
              <div>
                <div style="font-size: 13px; font-weight: 700; color: #1E293B;">{pc['name']}</div>
                <div style="font-size: 11.5px; color: #64748B;">{pc['feature']}</div>
              </div>
            </div>
    """

html_template += f"""
          </div>
        </div>

        <!-- Anodize ED & Special -->
        <div style="background: #0F172A; border: 1px solid #C9A227; border-radius: 12px; padding: 28px; color: #FFFFFF;">
          <h3 style="font-family: var(--ff-head); font-size: 17px; font-weight: 800; color: #E5C158; margin-bottom: 16px;">
            <i class="ri-sparkling-fill" style="color: #C9A227;"></i> Công Nghệ Anodize ED
          </h3>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
"""

for an in materials['anodize_ed']:
    html_template += f"""
            <div style="display: flex; align-items: center; gap: 12px; background: #1E293B; padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(201,162,39,0.3);">
              <span style="width: 24px; height: 24px; border-radius: 50%; background: {an['hex']}; border: 1px solid #E5C158; display: inline-block;"></span>
              <div>
                <div style="font-size: 13px; font-weight: 700; color: #FFFFFF;">{an['name']}</div>
                <div style="font-size: 11.5px; color: #94A3B8;">{an['feature']}</div>
              </div>
            </div>
    """

html_template += f"""
          </div>
          <div style="font-size: 12px; color: #CBD5E1; line-height: 1.6; background: rgba(201, 162, 39, 0.1); padding: 12px; border-radius: 6px; border-left: 3px solid #C9A227;">
            🛡️ <strong>Kháng muối biển:</strong> Mạ Anodize ED giúp thanh nhôm đanh cứng, chống tia UV và chịu môi trường biển bền bỉ vượt bậc cho các công trình ven biển và du thuyền Yacht.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 07. PROJECT CASE STUDIES -->
  <section class="al-section al-section-light" id="caseStudiesSection">
    <div class="container">
      <div style="text-align: center; max-width: 760px; margin: 0 auto 50px;">
        <span class="al-tag"><i class="ri-folder-shield-2-line"></i> DỰ ÁN THỰC TẾ TIÊU BIỂU</span>
        <h2 class="al-title">Hồ Sơ Giải Pháp Dự Án Đã Thực Hiện</h2>
        <p class="al-subtitle" style="margin: 0 auto;">Khách hàng cao cấp mua giải pháp trọn gói hoàn hảo, không chỉ mua thanh nhôm đơn lẻ.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
"""

for cs in case_studies[:3]:
    html_template += f"""
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.04);">
          <div style="height: 180px; background: url('{cs['image']}') center/cover no-repeat; position: relative;">
            <div style="position: absolute; bottom: 12px; left: 12px; background: rgba(15, 23, 42, 0.85); color: #C9A227; font-family: var(--ff-head); font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 4px;">
              {cs['market']} &bull; {cs['location']}
            </div>
          </div>
          <div style="padding: 24px;">
            <h3 style="font-family: var(--ff-head); font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">{cs['title']}</h3>
            <div style="font-size: 12.5px; font-weight: 700; color: #C9A227; margin-bottom: 12px;">{cs['solution']}</div>
            <div style="font-size: 12.5px; color: #64748B; margin-bottom: 14px;">
              <div><strong>Hệ nhôm:</strong> {cs['system_used']}</div>
              <div><strong>Hoàn thiện:</strong> {cs['finish']}</div>
            </div>
            <div style="background: #F8FAFC; border-left: 3px solid #0F172A; padding: 10px 12px; font-size: 12px; color: #334155; line-height: 1.5;">
              <strong>Giải pháp:</strong> {cs['solution_applied']}
            </div>
          </div>
        </div>
    """

html_template += f"""
      </div>
    </div>
  </section>

  <!-- 08. SMART PRODUCT FINDER (6 STEPS WIZARD) -->
  <section class="al-section al-section-dark" id="smartFinderSection">
    <div class="container">
      <div style="text-align: center; max-width: 760px; margin: 0 auto 40px;">
        <span class="al-tag"><i class="ri-magic-line"></i> SMART SOLUTION FINDER (6 BƯỚC)</span>
        <h2 class="al-title al-title-light">Tìm Hệ Nhôm Tối Ưu Cho Công Trình Của Bạn</h2>
        <p class="al-subtitle al-subtitle-light" style="margin: 0 auto;">Hệ thống tư vấn giải pháp tự động tính toán điểm phù hợp (Recommendation Score %) dựa trên yêu cầu không gian và mức đầu tư.</p>
      </div>

      <div style="background: #1E293B; border: 1px solid #334155; border-radius: 14px; padding: 36px; max-width: 960px; margin: 0 auto 40px;">
        
        <!-- Step 1: Project -->
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-family: var(--ff-head); font-size: 13px; font-weight: 800; color: #C9A227; text-transform: uppercase; margin-bottom: 10px;">
            01. LOẠI HÌNH CÔNG TRÌNH
          </label>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="finder-pill" onclick="setFinderStep('project', 'residence', this)">Nhà Phố</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('project', 'apartment', this)">Căn Hộ</button>
            <button type="button" class="finder-pill active" onclick="setFinderStep('project', 'villa', this)">Biệt Thự / Villa</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('project', 'penthouse', this)">Penthouse</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('project', 'resort', this)">Resort / Khách Sạn</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('project', 'marine-yacht', this)">🛥️ Du Thuyền Yacht</button>
          </div>
        </div>

        <!-- Step 2: Space -->
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-family: var(--ff-head); font-size: 13px; font-weight: 800; color: #C9A227; text-transform: uppercase; margin-bottom: 10px;">
            02. KHÔNG GIAN / HẠNG MỤC CẦN LẮP
          </label>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="finder-pill" onclick="setFinderStep('space', 'entrance', this)">Cửa Chính Đại Sảnh</button>
            <button type="button" class="finder-pill active" onclick="setFinderStep('space', 'living-balcony', this)">Phòng Khách &amp; Ban Công</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('space', 'panorama', this)">Panorama View Biển</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('space', 'bedroom', this)">Phòng Ngủ Cách Âm</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('space', 'interior-slim', this)">Vách Slim Thông Phòng</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('space', 'pool-garden', this)">Hồ Bơi / Sân Vườn</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('space', 'facade', this)">Mặt Dựng / Thông Tầng</button>
          </div>
        </div>

        <!-- Step 3: Opening Mechanism -->
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-family: var(--ff-head); font-size: 13px; font-weight: 800; color: #C9A227; text-transform: uppercase; margin-bottom: 10px;">
            03. KIỂU MỞ MONG MUỐN
          </label>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="finder-pill" onclick="setFinderStep('opening', 'swing', this)">Mở Quay</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('opening', 'sliding', this)">Trượt Lùa</button>
            <button type="button" class="finder-pill active" onclick="setFinderStep('opening', 'lift-slide', this)">Trượt Nâng Lift &amp; Slide</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('opening', 'bifold', this)">Xếp Trượt Bi-Folding</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('opening', 'slim-hanging', this)">Slim Treo Không Ray Sàn</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('opening', 'hydraulic', this)">Thủy Lực 2 Chiều</button>
          </div>
        </div>

        <!-- Step 4: Performance -->
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-family: var(--ff-head); font-size: 13px; font-weight: 800; color: #C9A227; text-transform: uppercase; margin-bottom: 10px;">
            04. ƯU TIÊN HIỆU NĂNG
          </label>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="finder-pill" onclick="setFinderStep('performance', 'acoustic', this)">Cách Âm Đa Khoang</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('performance', 'thermal', this)">Cản Nhiệt Low-E</button>
            <button type="button" class="finder-pill active" onclick="setFinderStep('performance', 'max-span', this)">Khổ Lớn Mở Tối Đa</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('performance', 'weather-marine', this)">Kháng Muối Biển &amp; Gió Bão</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('performance', 'minimalist-profile', this)">Viền Nhôm Siêu Mảnh</button>
          </div>
        </div>

        <!-- Step 5: Level -->
        <div style="margin-bottom: 28px;">
          <label style="display: block; font-family: var(--ff-head); font-size: 13px; font-weight: 800; color: #C9A227; text-transform: uppercase; margin-bottom: 10px;">
            05. TẦNG GIÁ TRỊ &amp; MỨC ĐẦU TƯ
          </label>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="finder-pill" onclick="setFinderStep('level', 'essential', this)">Essential (●●○○)</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('level', 'premium', this)">Premium (●●●○)</button>
            <button type="button" class="finder-pill active" onclick="setFinderStep('level', 'signature', this)">Signature (●●●●)</button>
            <button type="button" class="finder-pill" onclick="setFinderStep('level', 'ultra_luxury', this)">Ultra Luxury (●●●●●)</button>
          </div>
        </div>

        <!-- RESULTS CONTAINER -->
        <div id="finderResults">
          <!-- Populated via aluminium-finder.js -->
        </div>

      </div>
    </div>
  </section>

  <!-- 09. DUAL RFQ SECTION (QUICK & TECHNICAL) -->
  <section class="al-section al-section-light" id="rfqSection">
    <div class="container">
      <div style="text-align: center; max-width: 760px; margin: 0 auto 40px;">
        <span class="al-tag"><i class="ri-mail-send-line"></i> YÊU CẦU DỰ TOÁN KỸ THUẬT</span>
        <h2 class="al-title">Đăng Ký Tư Vấn &amp; Tiếp Nhận Bản Vẽ Kỹ Thuật</h2>
        <p class="al-subtitle" style="margin: 0 auto;">Hỗ trợ tiếp nhận hồ sơ dự án theo thỏa thuận bảo mật (NDA). Tải lên bản vẽ CAD, PDF, Excel lên đến 50MB.</p>
      </div>

      <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 14px; padding: 40px; max-width: 840px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        <form id="alRfqForm" onsubmit="event.preventDefault(); document.getElementById('rfqSuccessMsg').style.display='block';">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Họ Tên / Đơn Vị *</label>
              <input type="text" required placeholder="Nguyễn Văn A / Công ty Kiến Trúc..." style="width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px;" />
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Số Điện Thoại / Zalo *</label>
              <input type="tel" required placeholder="0988 888 888..." style="width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Email Nhận Báo Giá</label>
              <input type="email" placeholder="email@domain.com" style="width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px;" />
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Phân Khúc Công Trình</label>
              <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px; background: #FFF;">
                <option>Biệt Thự / Villa</option>
                <option>Nhà Phố / Shophouse</option>
                <option>Penthouse / Căn Hộ Cao Cấp</option>
                <option>Resort / Khách Sạn</option>
                <option>Showroom / Tòa Nhà</option>
                <option>Du Thuyền / Công Trình Biển Mặn</option>
              </select>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 13px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Mô Tả Yêu Cầu / Khối Lượng / Hệ Nhôm Quan Tâm</label>
            <textarea id="rfqNotes" rows="3" placeholder="Nhập ghi chú yêu cầu hoặc đề xuất từ Smart Finder..." style="width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px;"></textarea>
          </div>

          <div style="margin-bottom: 24px; background: #F8FAFC; border: 2px dashed #CBD5E1; border-radius: 8px; padding: 20px; text-align: center;">
            <i class="ri-upload-cloud-2-line" style="font-size: 32px; color: #C9A227; display: block; margin-bottom: 6px;"></i>
            <label style="font-size: 13px; font-weight: 700; color: #0F172A; cursor: pointer;">
              Tải lên hồ sơ bản vẽ kỹ thuật (.dwg, .dxf, .pdf, .step, .xlsx, .zip)
              <input type="file" id="drawingUpload" multiple style="display: none;" onchange="document.getElementById('fileListLabel').innerText = Array.from(this.files).map(f => f.name).join(', ');" />
            </label>
            <div id="fileListLabel" style="font-size: 12px; color: #64748B; margin-top: 6px;">Hỗ trợ tệp dung lượng tối đa 50MB</div>
          </div>

          <div style="margin-bottom: 24px; font-size: 12.5px; color: #64748B;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" checked /> Yêu cầu áp dụng thỏa thuận bảo mật thông tin dự án (NDA).
            </label>
          </div>

          <button type="submit" style="width: 100%; background: #C9A227; color: #0F172A; font-family: var(--ff-head); font-size: 14px; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; padding: 16px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.3s ease;">
            GỬI YÊU CẦU DỰ TOÁN KỸ THUẬT
          </button>

          <div id="rfqSuccessMsg" style="display: none; margin-top: 16px; padding: 14px; background: #DCFCE7; color: #166534; font-size: 13px; border-radius: 6px; text-align: center; font-weight: 700;">
            ✅ Đã tiếp nhận yêu cầu dự toán thành công! Kỹ sư Sao Vàng sẽ liên hệ trong vòng 24 giờ làm việc.
          </div>
        </form>
      </div>
    </div>
  </section>

  <!-- SECTION - FOOTER -->
  <footer class="footer-v2" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-brand">
            <img width="200" height="60" loading="lazy" src="assets/images/logo-nhom-white.png" alt="SV ALUMINIUM" style="height: 44px; width: auto; display: block; margin-bottom: 12px;" />
            <p class="footer-desc">SV ALUMINIUM &bull; Architectural Aluminium Systems — Giải pháp nhôm kính từ phân khúc tiêu chuẩn đến Ultra Luxury cho Residence, Villa, Hospitality &amp; SV Marine Yacht Division.</p>
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
  <script src="assets/js/aluminium-finder.js"></script>
  <script src="assets/js/aluminium-rfq.js"></script>
</body>
</html>
"""

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(html_template)

print(f"✅ Successfully generated Master Hub {OUTPUT_FILE} with 6-Step Finder and Solution Architecture!")
