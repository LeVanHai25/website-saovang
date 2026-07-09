import os
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Paths
BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"
CRAWLED_ACC_PATH = r"d:\Sao Vàng\Website-SaoVang\scratch\crawled_accessories.json"
EXISTING_ACC_PATH = r"d:\Sao Vàng\Website-SaoVang\scratch\nksv_existing_accessories.json"

# Load databases
with open(CRAWLED_ACC_PATH, "r", encoding="utf-8") as f:
    crawled_data = json.load(f)
with open(EXISTING_ACC_PATH, "r", encoding="utf-8") as f:
    existing_data = json.load(f)

# Combine databases
enriched_data = {}
all_categories = set(crawled_data.keys()).union(set(existing_data.keys()))

for cat in all_categories:
    enriched_data[cat] = []
    seen_names = set()
    
    if cat in existing_data:
        for p in existing_data[cat]:
            name = p["name"]
            enriched_data[cat].append({
                "name": name,
                "image": p["image"],
                "url": p.get("url", "lien-he.html"),
                "source": "nksv"
            })
            seen_names.add(name.lower())
            
    if cat in crawled_data:
        for p in crawled_data[cat]:
            name = p["name"]
            clean_name = re.sub(r'^Phụ [Kk]iện\s+(?:Cửa\s+)?(?:Slim|Trượt\s+Quay|Papo|Opk|Draho|Bogo|Cmech|Huy\s+Hoàng|KinLong|Janus|Candy|Sigico|Cửa\s+Kính|Hafele|3H|YKEBR)\s*[-.:]?\s*', '', name, flags=re.IGNORECASE)
            
            if name.lower() not in seen_names and clean_name.lower() not in seen_names:
                img_url = p["image"]
                if not img_url:
                    img_url = "assets/images/no-image.svg"
                enriched_data[cat].append({
                    "name": clean_name,
                    "image": img_url,
                    "url": "lien-he.html",
                    "source": "crawled"
                })
                seen_names.add(clean_name.lower())

# Read header & footer from original phu-kien.html
filepath = os.path.join(BASE_DIR, "phu-kien.html")
with open(filepath, "r", encoding="utf-8", errors="replace") as f:
    original_html = f.read()

# Extract Navbar
nav_start = original_html.find("<!-- ── NAVBAR ── -->")
if nav_start == -1:
    nav_start = original_html.find("<nav")
nav_end = original_html.find("<!-- ── HERO ── -->")
if nav_end == -1:
    nav_end = original_html.find("</nav>") + 6
navbar_content = original_html[nav_start:nav_end]

# Extract Footer
footer_start = original_html.find("<!-- ── FOOTER ── -->")
if footer_start == -1:
    footer_start = original_html.find("<footer")
footer_content = original_html[footer_start:]

# We need to construct the JavaScript database to embed in the page
# This database will be used for the instant searching and category filtering
js_products_db = []
for cat, items in enriched_data.items():
    # Map category to display name
    cat_display_map = {
        "slim": "Cửa Slim",
        "truot-quay": "Trượt Quay",
        "draho": "Draho",
        "bogo": "Bogo",
        "kinlong": "Kinlong",
        "janus": "Janus",
        "huy-hoang": "Huy Hoàng",
        "cmech": "Cmech",
        "khoa-dt": "Khóa Điện Tử",
        "candy": "Candy",
        "opk": "OPK",
        "papo": "Papo",
        "sigico": "Sigico",
        "cua-kinh": "Cửa Kính cường lực",
        "hafele": "Hafele",
        "ykebr": "YKEBR",
        "phu-kien-3h": "3H"
    }
    cat_display = cat_display_map.get(cat, cat.upper())
    for p in items:
        js_products_db.append({
            "name": p["name"],
            "image": p["image"],
            "category": cat,
            "categoryName": cat_display,
            "brand": cat.upper()
        })

js_db_str = json.dumps(js_products_db, ensure_ascii=False, indent=2)

# Redesigned phu-kien.html contents
redesigned_html = f'''<!DOCTYPE html>
<html lang="vi">
<head>
  <link rel="icon" type="image/svg+xml" href="assets/images/logo-sv-main.svg" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#9B1C1C" />
  <title>Phụ Kiện Nhôm Kính Cao Cấp — Cmech, Bogo, Draho, Sigico | SAO VÀNG</title>
  <meta name="description" content="Sao Vàng phân phối phụ kiện nhôm kính cao cấp đồng bộ chính hãng: Cmech Mỹ, Bogo Đức, Draho, Janus, Sigico, Hafele. Lắp đặt và bảo hành 100% chính hãng." />
  <meta name="keywords" content="phụ kiện nhôm kính, phụ kiện cửa nhôm, phụ kiện slim, cmech, bogo, draho, sigico, hafele, kinlong, huy hoang" />
  
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" />
  <link rel="stylesheet" href="assets/css/main.css" />
  
  <style>
    /* Custom Styling for Redesigned Dashboard */
    :root {{
      --sv-gold: #d4af37;
      --sv-red: #9B1C1C;
    }}
    .dashboard-hero {{
      background: linear-gradient(135deg, #0f1115 0%, #1c1f26 100%);
      padding: 140px 0 80px;
      color: #fff;
      text-align: center;
      position: relative;
      overflow: hidden;
    }}
    .dashboard-hero::before {{
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(circle at 50% 120%, rgba(155, 28, 28, 0.15), transparent 70%);
    }}
    .dashboard-title {{
      font-family: var(--sv-font-head);
      font-size: clamp(32px, 5vw, 52px);
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
    }}
    .dashboard-desc {{
      font-size: clamp(14px, 2vw, 18px);
      color: rgba(255,255,255,0.7);
      max-width: 680px;
      margin: 0 auto 32px;
      line-height: 1.6;
    }}
    
    /* Search Box styling */
    .search-wrapper {{
      max-width: 580px;
      margin: 0 auto;
      position: relative;
      z-index: 10;
    }}
    .search-box {{
      width: 100%;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 99px;
      padding: 18px 30px 18px 60px;
      color: #fff;
      font-size: 15px;
      font-family: var(--sv-font-body);
      outline: none;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }}
    .search-box:focus {{
      background: rgba(255, 255, 255, 0.12);
      border-color: var(--sv-gold);
      box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
    }}
    .search-wrapper i {{
      position: absolute;
      left: 24px; top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      color: rgba(255,255,255,0.4);
      pointer-events: none;
      transition: all 0.3s;
    }}
    .search-box:focus + i {{
      color: var(--sv-gold);
    }}
    
    /* Brand catalog panel */
    .brand-section {{
      padding: 60px 0;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }}
    .brand-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }}
    .brand-item-card {{
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      min-height: 200px;
    }}
    .brand-item-card:hover {{
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.06);
      border-color: var(--sv-red);
    }}
    .brand-logo-txt {{
      font-family: var(--sv-font-head);
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }}
    .brand-origin {{
      font-size: 11px;
      color: var(--sv-gray-text);
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }}
    .brand-explore-btn {{
      font-size: 12px;
      font-weight: 800;
      color: var(--sv-red);
      margin-top: 20px;
      display: flex; align-items: center; gap: 4px;
    }}
    
    /* Layout */
    .catalog-layout {{
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 40px;
      padding: 80px 0;
    }}
    @media (max-width: 991px) {{
      .catalog-layout {{ grid-template-columns: 1fr; }}
    }}
    
    /* Sidebar filters */
    .filter-sidebar {{
      position: sticky;
      top: 90px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      height: fit-content;
    }}
    .filter-title {{
      font-family: var(--sv-font-head);
      font-size: 16px;
      font-weight: 800;
      color: var(--sv-dark-900);
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #f1f5f9;
    }}
    .filter-list {{
      list-style: none;
      padding: 0; margin: 0;
      display: flex; flex-direction: column; gap: 6px;
    }}
    .filter-btn-item {{
      width: 100%;
      text-align: left;
      padding: 12px 16px;
      border-radius: 8px;
      background: transparent;
      border: none;
      font-size: 13px;
      font-weight: 600;
      color: var(--sv-gray-text);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}
    .filter-btn-item:hover {{
      background: #f1f5f9;
      color: var(--sv-dark-900);
    }}
    .filter-btn-item.active {{
      background: var(--sv-red);
      color: #fff;
    }}
    .filter-count {{
      background: #f1f5f9;
      color: var(--sv-gray-text);
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 20px;
    }}
    .filter-btn-item.active .filter-count {{
      background: rgba(255,255,255,0.2);
      color: #fff;
    }}
    
    /* Products Grid */
    .pk-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 24px;
    }}
    .pk-card {{
      background: #fff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
    }}
    .pk-card:hover {{
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.06);
    }}
    .pk-card-img {{
      position: relative;
      height: 200px;
      background: #f8fafc;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
    }}
    .pk-card-img img {{
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
    }}
    .pk-card-badge {{
      position: absolute;
      top: 12px; left: 12px;
      background: var(--sv-red);
      color: #fff;
      font-size: 9px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 20px;
      text-transform: uppercase;
    }}
    .pk-card-body {{
      padding: 16px;
    }}
    .pk-card-name {{
      font-family: var(--sv-font-head);
      font-size: 13px;
      font-weight: 700;
      color: var(--sv-dark-900);
      margin-bottom: 12px;
      min-height: 38px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }}
    .pk-card-btn {{
      display: flex; align-items: center; justify-content: center; gap: 4px;
      width: 100%;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      font-family: var(--sv-font-head);
      font-size: 11px;
      font-weight: 800;
      color: var(--sv-gray-text);
      text-decoration: none;
      transition: all 0.2s;
    }}
    .pk-card:hover .pk-card-btn {{
      background: var(--sv-red);
      border-color: var(--sv-red);
      color: #fff;
    }}
    
    /* Slide-over Side Panel */
    .side-panel {{
      position: fixed;
      top: 0; right: -420px;
      width: 400px; height: 100%;
      background: #fff;
      box-shadow: -10px 0 40px rgba(0,0,0,0.15);
      z-index: 1000;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
    }}
    .side-panel.open {{
      right: 0;
    }}
    .panel-backdrop {{
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 999;
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s;
    }}
    .panel-backdrop.open {{
      opacity: 1; pointer-events: auto;
    }}
    .panel-header {{
      padding: 24px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}
    .panel-title {{
      font-family: var(--sv-font-head);
      font-size: 16px;
      font-weight: 800;
      color: var(--sv-dark-900);
    }}
    .panel-close-btn {{
      background: transparent; border: none;
      font-size: 24px; cursor: pointer;
      color: var(--sv-gray-text);
    }}
    .panel-body {{
      padding: 24px;
      overflow-y: auto;
      flex: 1;
      display: flex; flex-direction: column; gap: 20px;
    }}
    .panel-img-box {{
      height: 240px;
      background: #f8fafc;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
    }}
    .panel-img-box img {{
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
    }}
    .panel-info-list {{
      list-style: none; padding: 0; margin: 0;
    }}
    .panel-info-list li {{
      padding: 10px 0;
      border-bottom: 1px solid #f1f5f9;
      font-size: 13px;
      color: var(--sv-gray-text);
      display: flex; justify-content: space-between;
    }}
    .panel-info-list li strong {{
      color: var(--sv-dark-900);
    }}
  </style>
</head>
<body>

  {navbar_content}

  <section class="dashboard-hero">
    <div class="sv-container">
      <h1 class="dashboard-title">Phụ Kiện Nhôm Kính Cao Cấp</h1>
      <p class="dashboard-desc">Hệ thống danh mục phụ kiện đồng bộ thông minh. Khám phá giải pháp khóa từ, bản lề, tay nắm cao cấp nhập khẩu đồng bộ 100%.</p>
      
      <div class="search-wrapper">
        <input type="text" id="db-search-input" class="search-box" placeholder="Tìm kiếm nhanh phụ kiện (ví dụ: Bản lề, Tay nắm, Khóa...)" />
        <i class="ri-search-line"></i>
      </div>
    </div>
  </section>

  <!-- ── BRAND QUICK EXPLORE ── -->
  <section class="brand-section">
    <div class="sv-container">
      <div style="text-align:center; margin-bottom:30px;">
        <span class="sv-section-tag">HÃNG LIÊN KẾT CHÍNH HÃNG</span>
        <h2 class="sv-section-title" style="margin-inline:auto;">Thương Hiệu Phụ Kiện Nổi Tiếng</h2>
      </div>
      
      <div class="brand-grid">
        <a href="phu-kien-cmech.html" class="brand-item-card">
          <div class="brand-logo-txt" style="color:#d4af37;">CMECH</div>
          <div class="brand-origin">Xuất xứ: Mỹ (USA)</div>
          <div class="brand-explore-btn">Xem chi tiết hãng <i class="ri-arrow-right-line"></i></div>
        </a>
        <a href="phu-kien-bogo.html" class="brand-item-card">
          <div class="brand-logo-txt" style="color:#1e3a8a;">BOGO</div>
          <div class="brand-origin">Xuất xứ: Đức / OEM</div>
          <div class="brand-explore-btn">Xem chi tiết hãng <i class="ri-arrow-right-line"></i></div>
        </a>
        <a href="phu-kien-draho.html" class="brand-item-card">
          <div class="brand-logo-txt" style="color:#065f46;">DRAHO</div>
          <div class="brand-origin">Xuất xứ: Trung Quốc</div>
          <div class="brand-explore-btn">Xem chi tiết hãng <i class="ri-arrow-right-line"></i></div>
        </a>
        <a href="phu-kien-papo.html" class="brand-item-card">
          <div class="brand-logo-txt" style="color:#7c2d12;">PAPO</div>
          <div class="brand-origin">Xuất xứ: Hồng Kông</div>
          <div class="brand-explore-btn">Xem chi tiết hãng <i class="ri-arrow-right-line"></i></div>
        </a>
        <a href="phu-kien-opk.html" class="brand-item-card">
          <div class="brand-logo-txt" style="color:#4c1d95;">OPK</div>
          <div class="brand-origin">Xuất xứ: Đức</div>
          <div class="brand-explore-btn">Xem chi tiết hãng <i class="ri-arrow-right-line"></i></div>
        </a>
        <a href="phu-kien-sigico.html" class="brand-item-card">
          <div class="brand-logo-txt" style="color:#111827;">SIGICO</div>
          <div class="brand-origin">Xuất xứ: Đức</div>
          <div class="brand-explore-btn">Xem chi tiết hãng <i class="ri-arrow-right-line"></i></div>
        </a>
      </div>
    </div>
  </section>

  <!-- ── MAIN PRODUCTS PANEL ── -->
  <section style="background:#fff;">
    <div class="sv-container">
      <div class="catalog-layout">
        
        <!-- Left Filter Sidebar -->
        <aside class="filter-sidebar">
          <h3 class="filter-title">Danh Mục Phụ Kiện</h3>
          <ul class="filter-list">
            <li>
              <button class="filter-btn-item active" onclick="setCategory('all')">
                Tất Cả Phụ Kiện <span class="filter-count" id="count-all">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('slim')">
                Hệ Cửa Slim <span class="filter-count" id="count-slim">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('truot-quay')">
                Cửa Trượt Quay <span class="filter-count" id="count-truot-quay">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('cmech')">
                Hãng CMECH <span class="filter-count" id="count-cmech">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('bogo')">
                Hãng BOGO <span class="filter-count" id="count-bogo">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('draho')">
                Hãng DRAHO <span class="filter-count" id="count-draho">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('sigico')">
                Hãng SIGICO <span class="filter-count" id="count-sigico">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('hafele')">
                Hãng HAFELE <span class="filter-count" id="count-hafele">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('papo')">
                Hãng PAPO (Vách kính) <span class="filter-count" id="count-papo">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('opk')">
                Hãng OPK (Lùa) <span class="filter-count" id="count-opk">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('kinlong')">
                Hãng KINLONG <span class="filter-count" id="count-kinlong">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('janus')">
                Hãng JANUS <span class="filter-count" id="count-janus">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('huy-hoang')">
                Hãng HUY HOÀNG <span class="filter-count" id="count-huy-hoang">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('3h')">
                Hãng 3H <span class="filter-count" id="count-3h">0</span>
              </button>
            </li>
            <li>
              <button class="filter-btn-item" onclick="setCategory('khoa-dt')">
                Khóa Điện Tử <span class="filter-count" id="count-khoa-dt">0</span>
              </button>
            </li>
          </ul>
        </aside>
        
        <!-- Right Products Grid Container -->
        <div>
          <div class="pk-grid" id="products-grid-container">
            <!-- Dynamically populated via JS -->
          </div>
          <div id="no-results-msg" style="display:none; text-align:center; padding:60px 0; color:var(--sv-gray-text);">
            <i class="ri-inbox-archive-line" style="font-size:48px; margin-bottom:12px; display:block;"></i>
            Không tìm thấy sản phẩm phụ kiện nào khớp với từ khóa của bạn.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── SLIDE OVER DETAIL PANEL ── -->
  <div class="panel-backdrop" id="panel-backdrop" onclick="closeDetailPanel()"></div>
  <div class="side-panel" id="side-panel">
    <div class="panel-header">
      <h3 class="panel-title">Chi Tiết Phụ Kiện</h3>
      <button class="panel-close-btn" onclick="closeDetailPanel()"><i class="ri-close-line"></i></button>
    </div>
    <div class="panel-body">
      <div class="panel-img-box">
        <img id="panel-img" src="" alt="" />
      </div>
      <h2 class="sv-section-title" id="panel-name" style="margin-left:0; text-align:left; font-size:18px;"></h2>
      
      <ul class="panel-info-list">
        <li>Thương hiệu phân phối: <strong id="panel-brand"></strong></li>
        <li>Danh mục phụ kiện: <strong id="panel-category"></strong></li>
        <li>Chất liệu cấu tạo: <strong>Inox 304 / Inox 316 / Hợp kim nhôm</strong></li>
        <li>Tình trạng phân phối: <strong style="color:#22c55e;">Sẵn hàng (Hà Nội & HCM)</strong></li>
        <li>Thời gian bảo hành: <strong>24 tháng chính hãng</strong></li>
      </ul>
      
      <a href="lien-he.html" class="sv-btn sv-btn-red" style="width:100%; display:flex; justify-content:center; margin-top:auto;">YÊU CẦU BÁO GIÁ NGAY <i class="ri-arrow-right-line"></i></a>
    </div>
  </div>

  <script type="text/javascript">
    const PRODUCTS_DB = {js_db_str};
    
    let currentCategory = 'all';
    let searchQuery = '';
    
    function setCategory(cat) {{
      currentCategory = cat;
      
      // Update UI active state
      document.querySelectorAll('.filter-btn-item').forEach(btn => {{
        btn.classList.remove('active');
      }});
      // Find button by onclick attribute containing category ID
      const btn = Array.from(document.querySelectorAll('.filter-btn-item')).find(b => b.getAttribute('onclick').includes(`'${{cat}}'`));
      if (btn) btn.classList.add('active');
      
      renderGrid();
    }}
    
    function renderGrid() {{
      const grid = document.getElementById('products-grid-container');
      const noResults = document.getElementById('no-results-msg');
      
      // Filter list
      const filtered = PRODUCTS_DB.filter(p => {{
        const matchesCat = (currentCategory === 'all' || p.category === currentCategory || (currentCategory === '3h' && p.category === 'phu-kien-3h'));
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
      }});
      
      // Populate HTML
      grid.innerHTML = '';
      if (filtered.length === 0) {{
        noResults.style.display = 'block';
      }} else {{
        noResults.style.display = 'none';
        filtered.forEach(p => {{
          const card = document.createElement('div');
          card.className = 'pk-card';
          card.onclick = () => openDetailPanel(p);
          card.innerHTML = `
            <div class="pk-card-img">
              <img src="${{p.image}}" alt="${{p.name}}" loading="lazy" onerror="this.src='assets/images/no-image.svg'" />
              <span class="pk-card-badge">${{p.categoryName}}</span>
            </div>
            <div class="pk-card-body">
              <div class="pk-card-name">${{p.name}}</div>
              <button class="pk-card-btn">Xem chi tiết <i class="ri-eye-line"></i></button>
            </div>
          `;
          grid.appendChild(card);
        }});
      }}
    }}
    
    function updateCounts() {{
      document.getElementById('count-all').innerText = PRODUCTS_DB.length;
      
      const counts = {{}};
      PRODUCTS_DB.forEach(p => {{
        let cat = p.category;
        if (cat === 'phu-kien-3h') cat = '3h';
        counts[cat] = (counts[cat] || 0) + 1;
      }});
      
      Object.keys(counts).forEach(cat => {{
        const el = document.getElementById(`count-${{cat}}`);
        if (el) el.innerText = counts[cat];
      }});
    }}
    
    // Panel controls
    function openDetailPanel(product) {{
      document.getElementById('panel-img').src = product.image;
      document.getElementById('panel-name').innerText = product.name;
      document.getElementById('panel-brand').innerText = product.brand;
      document.getElementById('panel-category').innerText = product.categoryName;
      
      document.getElementById('side-panel').classList.add('open');
      document.getElementById('panel-backdrop').classList.add('open');
    }}
    
    function closeDetailPanel() {{
      document.getElementById('side-panel').classList.remove('open');
      document.getElementById('panel-backdrop').classList.remove('open');
    }}
    
    // Initialize search
    document.getElementById('db-search-input').addEventListener('input', (e) => {{
      searchQuery = e.target.value;
      renderGrid();
    }});
    
    window.addEventListener('DOMContentLoaded', () => {{
      updateCounts();
      renderGrid();
    }});
  </script>

  {footer_content}
</body>
</html>
'''

# Save updated phu-kien.html
with open(filepath, "w", encoding="utf-8") as f:
    f.write(redesigned_html)

print("Redesigned phu-kien.html dashboard created successfully.")
