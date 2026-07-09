import os
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Paths
BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"
CRAWLED_ACC_PATH = r"d:\Sao Vàng\Website-SaoVang\scratch\crawled_accessories.json"
BRAND_DETAILS_PATH = r"d:\Sao Vàng\Website-SaoVang\scratch\brand_details.json"
EXISTING_ACC_PATH = r"d:\Sao Vàng\Website-SaoVang\scratch\nksv_existing_accessories.json"

# Load databases
with open(CRAWLED_ACC_PATH, "r", encoding="utf-8") as f:
    crawled_data = json.load(f)
with open(BRAND_DETAILS_PATH, "r", encoding="utf-8") as f:
    brand_details = json.load(f)
with open(EXISTING_ACC_PATH, "r", encoding="utf-8") as f:
    existing_data = json.load(f)

# Combine NKSV existing products with crawled products to enrich database
enriched_data = {}
all_categories = set(crawled_data.keys()).union(set(existing_data.keys()))

for cat in all_categories:
    enriched_data[cat] = []
    seen_names = set()
    
    # 1. Add NKSV existing first to preserve order
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
            
    # 2. Add crawled data
    if cat in crawled_data:
        for p in crawled_data[cat]:
            name = p["name"]
            # Clean generic prefixes
            clean_name = re.sub(r'^Phụ [Kk]iện\s+(?:Cửa\s+)?(?:Slim|Trượt\s+Quay|Papo|Opk|Draho|Bogo|Cmech|Huy\s+Hoàng|KinLong|Janus|Candy|Sigico|Cửa\s+Kính|Hafele|3H|YKEBR)\s*[-.:]?\s*', '', name, flags=re.IGNORECASE)
            
            # Skip if already exists or clean name exists
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

# Read nav & footer from existing phu-kien.html
with open(os.path.join(BASE_DIR, "phu-kien.html"), "r", encoding="utf-8", errors="replace") as f:
    original_html = f.read()

# Extract Navbar (from <!-- ── NAVBAR ── --> to <!-- ── HERO ── -->)
nav_start = original_html.find("<!-- ── NAVBAR ── -->")
if nav_start == -1:
    nav_start = original_html.find("<nav")
nav_end = original_html.find("<!-- ── HERO ── -->")
if nav_end == -1:
    nav_end = original_html.find("</nav>") + 6

navbar_content = original_html[nav_start:nav_end]

# Extract Footer (from <!-- ── FOOTER ── --> to </html>)
footer_start = original_html.find("<!-- ── FOOTER ── -->")
if footer_start == -1:
    footer_start = original_html.find("<footer")
footer_content = original_html[footer_start:]

# Brand Metadata
brand_metadata = {
    "cmech": {"name": "CMECH", "origin": "Hoa Kỳ (USA)", "segment": "Luxury / Biệt thự biển", "color": "#d4af37", "gradient": "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)"},
    "bogo": {"name": "BOGO", "origin": "Đức / OEM", "segment": "Cao cấp / Biệt thự", "color": "#1e3a8a", "gradient": "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%)"},
    "draho": {"name": "DRAHO", "origin": "Trung Quốc (Premium)", "segment": "Trung cấp / Nhà phố / Cao ốc", "color": "#065f46", "gradient": "linear-gradient(135deg,#065f46 0%,#059669 100%)"},
    "papo": {"name": "PAPO", "origin": "Hồng Kông", "segment": "Chuyên Phòng Tắm Kính & Cabin tắm", "color": "#7c2d12", "gradient": "linear-gradient(135deg,#7c2d12 0%,#ea580c 100%)"},
    "opk": {"name": "OPK", "origin": "Đức (Chuyên Ray Lùa)", "segment": "Cao cấp / Cửa Slim siêu êm", "color": "#4c1d95", "gradient": "linear-gradient(135deg,#4c1d95 0%,#7c3aed 100%)"},
    "sigico": {"name": "SIGICO", "origin": "Đức", "segment": "Cao cấp / Phong cách Châu Âu rãnh C", "color": "#111827", "gradient": "linear-gradient(135deg,#111827 0%,#374151 100%)"},
    "kinlong": {"name": "KINLONG", "origin": "Trung Quốc (Chính hãng)", "segment": "Phổ thông / Đa công trình", "color": "#1e293b", "gradient": "linear-gradient(135deg,#1e293b 0%,#334155 100%)"},
    "janus": {"name": "JANUS", "origin": "Đức / OEM", "segment": "Cao cấp / Đa sắc màu (Gold/Black)", "color": "#78350f", "gradient": "linear-gradient(135deg,#78350f 0%,#d97706 100%)"},
    "huy-hoang": {"name": "HUY HOÀNG", "origin": "Việt Nam (Con Voi)", "segment": "Tiêu chuẩn quốc gia / Bền bỉ", "color": "#991b1b", "gradient": "linear-gradient(135deg,#991b1b 0%,#dc2626 100%)"},
    "hafele": {"name": "HAFELE", "origin": "Đức", "segment": "Luxury / Ngũ kim thông minh", "color": "#0f172a", "gradient": "linear-gradient(135deg,#0f172a 0%,#0284c7 100%)"},
    "3h": {"name": "3H", "origin": "Hebel Trung Quốc", "segment": "Tiêu chuẩn / Đồng bộ Xingfa", "color": "#3f6212", "gradient": "linear-gradient(135deg,#3f6212 0%,#65a30d 100%)"},
}

def generate_brand_page(brand_id, meta):
    name = meta["name"]
    origin = meta["origin"]
    segment = meta["segment"]
    color = meta["color"]
    grad = meta["gradient"]
    
    desc_html = brand_details.get(brand_id, "")
    if not desc_html and brand_id == "3h":
        desc_html = brand_details.get("phu-kien-3h", "")
    if not desc_html:
        desc_html = f"Thương hiệu phụ kiện nhôm kính {name} cao cấp, nhập khẩu chính hãng đồng bộ, cung cấp các giải pháp hoàn hảo cho hệ thống cửa nhôm kính hiện đại."
        
    formatted_desc = ""
    for chunk in desc_html.split("\n\n"):
        if chunk.strip().startswith("###"):
            formatted_desc += f"<h3 class='brand-subtitle'>{chunk.replace('###', '').strip()}</h3>"
        elif chunk.strip().startswith("####"):
            formatted_desc += f"<h4 class='brand-sub-subtitle'>{chunk.replace('####', '').strip()}</h4>"
        elif chunk.strip():
            formatted_desc += f"<p class='brand-desc-p'>{chunk.strip()}</p>"

    prods = enriched_data.get(brand_id, [])
    if not prods and brand_id == "3h":
        prods = enriched_data.get("phu-kien-3h", [])
        
    prod_cards_html = ""
    for p in prods[:20]:
        prod_cards_html += f'''
          <div class="pk-card" data-sv-reveal>
            <div class="pk-card-img">
              <img src="{p['image']}" alt="{p['name']}" loading="lazy" onerror="this.src='assets/images/no-image.svg'" />
              <span class="pk-card-badge" style="background:{color};">{name}</span>
            </div>
            <div class="pk-card-body">
              <div class="pk-card-name">{p['name']}</div>
              <a href="lien-he.html" class="pk-card-btn" style="background:transparent; border:1px solid {color}; color:{color};">Liên hệ báo giá <i class="ri-arrow-right-line"></i></a>
            </div>
          </div>
        '''
        
    template = f'''<!DOCTYPE html>
<html lang="vi">
<head>
  <link rel="icon" type="image/svg+xml" href="assets/images/logo-sv-main.svg" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="{color}" />
  <title>Phụ Kiện {name} Chính Hãng Cao Cấp | SAO VÀNG</title>
  <meta name="description" content="Sao Vàng cung cấp phụ kiện {name} chính hãng chất lượng cao. Đầy đủ {name} bản lề, khóa đa điểm, tay nắm chống muối mặn. Bảo hành dài hạn." />
  <meta name="keywords" content="phụ kiện {brand_id}, phụ kiện {name}, {name} chính hãng, phụ kiện nhôm kính" />
  
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" />
  <link rel="stylesheet" href="assets/css/main.css" />
  
  <style>
    .brand-hero {{
      background: {grad};
      padding: 120px 0 60px;
      color: #fff;
      text-align: center;
      position: relative;
      overflow: hidden;
    }}
    .brand-hero::after {{
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(circle at 50% 120%, rgba(255,255,255,0.1), transparent 70%);
    }}
    .brand-tag {{
      display: inline-block;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(4px);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-bottom: 16px;
      text-transform: uppercase;
    }}
    .brand-title {{
      font-family: var(--sv-font-head);
      font-size: clamp(32px, 5vw, 56px);
      font-weight: 900;
      margin-bottom: 8px;
    }}
    .brand-subtitle-hero {{
      font-size: clamp(14px, 2vw, 18px);
      opacity: 0.8;
      max-width: 600px;
      margin: 0 auto 24px;
    }}
    
    .brand-stats {{
      display: flex;
      justify-content: center;
      gap: clamp(16px, 4vw, 40px);
      flex-wrap: wrap;
      margin-top: 32px;
    }}
    .brand-stat-card {{
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 16px 24px;
      min-width: 140px;
      backdrop-filter: blur(8px);
    }}
    .brand-stat-num {{
      font-family: var(--sv-font-head);
      font-size: 28px;
      font-weight: 900;
      color: #fff;
    }}
    .brand-stat-label {{
      font-size: 11px;
      color: rgba(255,255,255,0.6);
      margin-top: 4px;
      text-transform: uppercase;
      font-weight: 600;
    }}
    
    .brand-detail-section {{
      padding: 80px 0;
      background: #ffffff;
    }}
    .brand-content-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: start;
    }}
    @media (max-width: 900px) {{
      .brand-content-grid {{ grid-template-columns: 1fr; gap: 40px; }}
    }}
    .brand-info-column {{
      padding-right: 20px;
    }}
    .brand-subtitle {{
      font-family: var(--sv-font-head);
      font-size: 22px;
      font-weight: 800;
      color: var(--sv-dark-900);
      margin: 28px 0 14px;
      border-left: 4px solid {color};
      padding-left: 14px;
    }}
    .brand-sub-subtitle {{
      font-family: var(--sv-font-head);
      font-size: 16px;
      font-weight: 700;
      color: var(--sv-dark-800);
      margin: 18px 0 8px;
    }}
    .brand-desc-p {{
      font-size: var(--sv-fs-sm);
      color: var(--sv-gray-text);
      line-height: 1.7;
      margin-bottom: 16px;
    }}
    
    .brand-sidebar {{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 32px;
    }}
    .sidebar-title {{
      font-family: var(--sv-font-head);
      font-size: 18px;
      font-weight: 800;
      color: var(--sv-dark-900);
      margin-bottom: 20px;
    }}
    .sidebar-list {{
      list-style: none;
      padding: 0;
      margin: 0 0 24px;
    }}
    .sidebar-list li {{
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 13px;
      color: var(--sv-gray-text);
      display: flex;
      justify-content: space-between;
    }}
    .sidebar-list li strong {{
      color: var(--sv-dark-900);
    }}
    
    .brand-products-section {{
      padding: 80px 0;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }}
    
    .pk-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 30px;
      margin-top: 40px;
    }}
    .pk-card {{
      background: #fff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      transition: all 0.3s ease;
    }}
    .pk-card:hover {{
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.06);
    }}
    .pk-card-img {{
      position: relative;
      height: 220px;
      background: #f1f5f9;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
    }}
    .pk-card-img img {{
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
    }}
    .pk-card-badge {{
      position: absolute;
      top: 12px; left: 12px;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
      letter-spacing: 0.05em;
    }}
    .pk-card-body {{
      padding: 20px;
    }}
    .pk-card-name {{
      font-family: var(--sv-font-head);
      font-size: 14px;
      font-weight: 700;
      color: var(--sv-dark-900);
      margin-bottom: 16px;
      min-height: 40px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }}
    .pk-card-btn {{
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%;
      padding: 10px;
      border-radius: 6px;
      font-family: var(--sv-font-head);
      font-size: 12px;
      font-weight: 800;
      text-decoration: none;
      transition: all 0.2s;
    }}
  </style>
</head>
<body>

  {navbar_content}

  <section class="brand-hero">
    <div class="sv-container">
      <span class="brand-tag">THƯƠNG HIỆU PHỤ KIỆN</span>
      <h1 class="brand-title">Phụ Kiện {name}</h1>
      <p class="brand-subtitle-hero">Dòng sản phẩm nhập khẩu cao cấp đồng hành cùng các giải pháp cửa nhôm kính Sao Vàng</p>
      
      <div class="brand-stats">
        <div class="brand-stat-card">
          <div class="brand-stat-num">{origin}</div>
          <div class="brand-stat-label">Xuất Xứ</div>
        </div>
        <div class="brand-stat-card">
          <div class="brand-stat-num">{len(prods)}</div>
          <div class="brand-stat-label">Mã Sản Phẩm</div>
        </div>
        <div class="brand-stat-card">
          <div class="brand-stat-num">100%</div>
          <div class="brand-stat-label">Chính Hãng</div>
        </div>
      </div>
    </div>
  </section>

  <section class="brand-detail-section">
    <div class="sv-container">
      <div class="brand-content-grid">
        <div class="brand-info-column">
          <h2 class="sv-section-title" style="margin-left:0; text-align:left;">Tổng Quan Về Hãng</h2>
          {formatted_desc}
        </div>
        
        <div class="brand-sidebar">
          <h3 class="sidebar-title">Thông Số Kỹ Thuật {name}</h3>
          <ul class="sidebar-list">
            <li>Xuất xứ chính hãng: <strong>{origin}</strong></li>
            <li>Phân khúc thị trường: <strong>{segment}</strong></li>
            <li>Xử lý bề mặt nổi trội: <strong>Chống oxi hóa / Mạ Anodized</strong></li>
            <li>Ứng dụng chính: <strong>Cửa đi, Cửa sổ, Vách nhôm kính</strong></li>
            <li>Cam kết từ Sao Vàng: <strong>Đền bù gấp đôi nếu phát hiện hàng nhái</strong></li>
            <li>Chính sách bảo hành: <strong>Đổi mới 1-1 trong 24 tháng</strong></li>
          </ul>
          
          <a href="lien-he.html" class="sv-btn sv-btn-red" style="width:100%; display:flex; justify-content:center;">NHẬN BÁO GIÁ {name} <i class="ri-arrow-right-line"></i></a>
        </div>
      </div>
    </div>
  </section>

  <section class="brand-products-section">
    <div class="sv-container">
      <div style="text-align:center;">
        <span class="sv-section-tag">DANH MỤC SẢN PHẨM</span>
        <h2 class="sv-section-title" style="margin-inline:auto;">Sản Phẩm {name} Nổi Bật</h2>
      </div>
      
      <div class="pk-grid">
        {prod_cards_html}
      </div>
    </div>
  </section>

  {footer_content}
</body>
</html>
'''
    return template

# Generate pages
for brand_id, meta in brand_metadata.items():
    page_html = generate_brand_page(brand_id, meta)
    filename = f"phu-kien-{brand_id}.html"
    filepath = os.path.join(BASE_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(page_html)
    print(f"Generated brand page: {filename}")

# Clean up wrong filename
wrong_file = os.path.join(BASE_DIR, "phu-kien-phu-kien-3h.html")
if os.path.exists(wrong_file):
    os.remove(wrong_file)
    print("Cleaned up wrong phu-kien-phu-kien-3h.html file.")

print("Brand pages generation complete.")
