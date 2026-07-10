import os
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Paths
BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"
ALUMINUM_DETAILS_PATH = r"d:\Sao Vàng\Website-SaoVang\scratch\aluminum_brand_details.json"

# Load brand details
with open(ALUMINUM_DETAILS_PATH, "r", encoding="utf-8") as f:
    brand_details = json.load(f)

# Read nav & footer from existing nhom-sao-vang.html
with open(os.path.join(BASE_DIR, "nhom-sao-vang.html"), "r", encoding="utf-8", errors="replace") as f:
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

# Brand Metadata
aluminum_metadata = {
    "xingfa": {
        "name": "Nhôm Xingfa Quảng Đông", 
        "origin": "Quảng Đông (Trung Quốc)", 
        "segment": "Phổ thông / Trung cấp", 
        "color": "#e11d48", 
        "gradient": "linear-gradient(135deg,#991b1b 0%,#e11d48 100%)",
        "cad_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/05_Thư viện CAD/Cửa lùa/Ban_ve_mau_Cua_lua.dxf",
        "pdf_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/01_Sổ tay Kỹ thuật Tổng hợp.docx",
        "products": [
            {"name": "Cửa đi mở quay nhôm Xingfa 4 cánh", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-xingfa-4-canh-mo-quay_142345095096/cua-nhom-xingfa-4-canh-mo-quay.webp"},
            {"name": "Cửa sổ nhôm Xingfa mở quay 2 cánh", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-nhom-xingfa-mo-quay-2-canh_868949141616/cua-so-nhom-xingfa-mo-quay-2-canh.webp"},
            {"name": "Cửa sổ nhôm Xingfa mở quay 4 cánh", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-nhom-xingfa-mo-quay-4-canh_509513106880/cua-so-nhom-xingfa-mo-quay-4-canh.webp"},
            {"name": "Cửa đi xếp trượt nhôm Xingfa 6 cánh", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-xep-truot-nhom-xingfa_509510578643/cua-xep-truot-nhom-xingfa.webp"}
        ]
    },
    "maxpro": {
        "name": "Nhôm Cao Cấp Maxpro.JP", 
        "origin": "Nhật Bản (Anodized)", 
        "segment": "Cao cấp / Biệt thự biển", 
        "color": "#b45309", 
        "gradient": "linear-gradient(135deg,#78350f 0%,#d97706 100%)",
        "cad_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/05_Thư viện CAD/Vách mặt dựng/Ban_ve_mau_Vach_mat_dung.dxf",
        "pdf_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/08_Catalogue theo Hãng/ThuVien_HeCuaNhom_Maxpro.docx",
        "products": [
            {"name": "Cửa đi mở quay nhôm Maxpro hệ 83", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-di-4-canh-mo-quay-nhom-maxpro-jp-he-83_065319346843/cua-di-4-canh-mo-quay-nhom-maxpro-jp-he-83.webp"},
            {"name": "Cửa sổ lùa 4 cánh nhôm Maxpro hệ 65", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-lua-4-canh-nhom-maxpro-he-65_176059058518/cua-so-lua-4-canh-nhom-maxpro-he-65.webp"},
            {"name": "Cửa xếp trượt nhôm Maxpro hệ 80", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-xep-truot-nhom-maxpro-he-80_369042559844/cua-xep-truot-nhom-maxpro-he-80.webp"}
        ]
    },
    "civro": {
        "name": "Nhôm Cầu Cách Nhiệt Civro", 
        "origin": "Đức (Germany Technology)", 
        "segment": "Siêu cao cấp / Biệt thự Luxury", 
        "color": "#1e293b", 
        "gradient": "linear-gradient(135deg,#0f172a 0%,#334155 100%)",
        "cad_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/08_Catalogue theo Hãng/Catalogue_HeCuaNhom_Civro.xlsx",
        "pdf_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/08_Catalogue theo Hãng/ThuVien_HeCuaNhom_Civro.docx",
        "products": [
            {"name": "Cửa đi mở quay trượt nâng Civro siêu tải", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/catalogue/catalogue-nhom-civro_330059/catalogue-nhom-civro.webp"},
            {"name": "Cửa xếp trượt Civro âm bản lề rãnh C", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/assets/images/nhomkinhdaiphuc/nhom-kinh-dai-phuc.webp"}
        ]
    },
    "slim": {
        "name": "Hệ Nhôm Slim Siêu Mảnh", 
        "origin": "Châu Âu (Tối giản)", 
        "segment": "Cao cấp / Tối giản diện tích", 
        "color": "#475569", 
        "gradient": "linear-gradient(135deg,#1e293b 0%,#64748b 100%)",
        "cad_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/05_Thư viện CAD/Cửa Slim/Ban_ve_mau_Cua_Slim.dxf",
        "pdf_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/08_Catalogue theo Hãng/ThuVien_HeCuaNhom_Slim.docx",
        "products": [
            {"name": "Cửa lùa Slim 2 cánh không ray dưới", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/banh-xe-giam-chan-cua-lua-slim_377335539699/phu-kien-cua-slim-banh-xe-giam-chan-cua-lua-slim.webp"},
            {"name": "Cửa đi Slim mở quay 1 cánh thanh mảnh", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-slim-1-canh-mo-quay_871152100477/cua-nhom-slim-1-canh-mo-quay.webp"},
            {"name": "Vách ngăn phòng hệ Slim kính cường lực", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/vach-ngan-phong-he-slim-co-cua-mo-quay_735361595727/vach-ngan-phong-he-slim-co-cua-mo-quay.webp"}
        ]
    },
    "kogen": {
        "name": "Nhôm Kogen Phong Cách Đức", 
        "origin": "Đức (Kogen Technology)", 
        "segment": "Cao cấp / Thiết kế hiện đại", 
        "color": "#0369a1", 
        "gradient": "linear-gradient(135deg,#0c4a6e 0%,#0284c7 100%)",
        "cad_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/08_Catalogue theo Hãng/Catalogue_HeCuaNhom_Slim.xlsx",
        "pdf_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/08_Catalogue theo Hãng/ThuVien_HeCuaNhom_Kogen.docx",
        "products": [
            {"name": "Cửa lùa Slim 138 nhôm Kogen siêu rộng", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-lua-slim-138-nhom-kogen_142345095096/cua-lua-slim-138-nhom-kogen.webp"},
            {"name": "Cửa nhôm Kogen xếp gấp hệ 68 ẩn bản lề", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-kogen-xep-gap-he-68-an-ban-le_868949141616/cua-nhom-kogen-xep-gap-he-68-an-ban-le.webp"},
            {"name": "Cửa trượt lật nhôm Kogen cao cấp", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-truot-lat-nhom-kogen_509513106880/cua-truot-lat-nhom-kogen.webp"}
        ]
    },
    "pma": {
        "name": "Nhôm PMA Tiêu Chuẩn Châu Âu", 
        "origin": "Châu Âu / Việt Nam", 
        "segment": "Phổ thông / Trung cấp", 
        "color": "#15803d", 
        "gradient": "linear-gradient(135deg,#166534 0%,#22c55e 100%)",
        "cad_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/08_Catalogue theo Hãng/Catalogue_HeCuaNhom_EuroVN.xlsx",
        "pdf_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/08_Catalogue theo Hãng/ThuVien_HeCuaNhom_PMA.docx",
        "products": [
            {"name": "Cửa đi mở quay PMA Lux65 rãnh C", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-di-mo-quay-cao-cap-pma-he-ranh-c-chau-au-lux65_046567162833/cua-di-mo-quay-cao-cap-pma-he-ranh-c-chau-au-lux65.webp"},
            {"name": "Cửa xếp trượt nhôm PMA hệ 80 Lux65", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-xep-truot-nhom-pma-he-80-lux65_722273917280/cua-xep-truot-nhom-pma-he-80-lux65.webp"},
            {"name": "Cửa nhôm PMA phào kép Platinum", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-di-mo-quay-nhom-pma-he-phao-kep-pma-platinum_731570069044/cua-di-mo-quay-nhom-pma-he-phao-kep-pma-platinum.webp"}
        ]
    },
    "owin": {
        "name": "Nhôm Cao Cấp Owin Rãnh C", 
        "origin": "Đức / OEM", 
        "segment": "Trung cấp / Cao cấp", 
        "color": "#4338ca", 
        "gradient": "linear-gradient(135deg,#3730a3 0%,#4f46e5 100%)",
        "cad_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/08_Catalogue theo Hãng/Catalogue_HeCuaNhom_Owin.xlsx",
        "pdf_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/08_Catalogue theo Hãng/ThuVien_HeCuaNhom_Owin.docx",
        "products": [
            {"name": "Cửa đi mở quay nhôm Owin đồng bộ", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/catalogue/catalogue-nhom-owin_363800/catalogue-nhom-owin.webp"}
        ]
    },
    "topal": {
        "name": "Nhôm Topal Austdoor", 
        "origin": "Tập đoàn Austdoor (Việt Nam)", 
        "segment": "Phổ thông / Tiêu chuẩn quốc gia", 
        "color": "#b91c1c", 
        "gradient": "linear-gradient(135deg,#7f1d1d 0%,#dc2626 100%)",
        "cad_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/08_Catalogue theo Hãng/Catalogue_HeCuaNhom_Topal.xlsx",
        "pdf_file": "BaoCao_ThuVien_CuaNhom/THƯ VIỆN HỆ NHÔM SAO VÀNG/08_Catalogue theo Hãng/ThuVien_HeCuaNhom_Topal.docx",
        "products": [
            {"name": "Cửa nhôm Topal hệ thủy lực bản lớn", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/catalogue/catalogue-nhom-topal-he-thuy-luc_211342/catalogue-nhom-topal-he-thuy-luc.webp"},
            {"name": "Cửa đi mở quay Topal Prima rãnh C", "image": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/catalogue/catalogue-nhom-topal_551789/catalogue-nhom-topal.webp"}
        ]
    }
}

def generate_brand_page(brand_id, meta):
    name = meta["name"]
    origin = meta["origin"]
    segment = meta["segment"]
    color = meta["color"]
    grad = meta["gradient"]
    cad_path = meta["cad_file"]
    pdf_path = meta["pdf_file"]
    
    desc_html = brand_details.get(brand_id, "")
    if not desc_html:
        desc_html = f"Thương hiệu nhôm kính {name} cao cấp, nhập khẩu đồng bộ chính hãng, mang lại khả năng cách âm, cách nhiệt hoàn hảo và độ bền cơ học vượt trội cho công trình."
        
    formatted_desc = ""
    for chunk in desc_html.split("\n\n"):
        if chunk.strip().startswith("###"):
            formatted_desc += f"<h3 class='brand-subtitle'>{chunk.replace('###', '').strip()}</h3>"
        elif chunk.strip().startswith("####"):
            formatted_desc += f"<h4 class='brand-sub-subtitle'>{chunk.replace('####', '').strip()}</h4>"
        elif chunk.strip():
            formatted_desc += f"<p class='brand-desc-p'>{chunk.strip()}</p>"

    # Product cards HTML
    prod_cards_html = ""
    for p in meta["products"]:
        prod_cards_html += f'''
          <div class="pk-card" data-sv-reveal>
            <div class="pk-card-img">
              <img src="{p['image']}" alt="{p['name']}" loading="lazy" onerror="this.src='assets/images/no-image.svg'" />
              <span class="pk-card-badge" style="background:{color};">{name}</span>
            </div>
            <div class="pk-card-body">
              <div class="pk-card-name">{p['name']}</div>
              <a href="lien-he.html" class="pk-card-btn" style="background:transparent; border:1px solid {color}; color:{color};">Báo giá công trình <i class="ri-arrow-right-line"></i></a>
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
  <title>Cửa Nhôm {name} Chính Hãng | SAO VÀNG</title>
  <meta name="description" content="Sao Vàng cung cấp các giải pháp cửa nhôm {name} nhập khẩu cao cấp đồng bộ chính hãng. Tư vấn thiết kế, báo giá lắp đặt trọn gói rẻ nhất." />
  <meta name="keywords" content="cửa nhôm {brand_id}, cửa nhôm {name}, {name} chính hãng, mặt cắt nhôm {brand_id}" />
  
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
      font-size: 24px;
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
    
    .tech-download-card {{
      background: #fffbeb;
      border: 1px dashed #d97706;
      border-radius: 12px;
      padding: 20px;
      margin-top: 24px;
      display: flex; flex-direction: column; gap: 14px;
    }}
    .tech-download-title {{
      font-family: var(--sv-font-head);
      font-size: 15px;
      font-weight: 800;
      color: #92400e;
      display: flex; align-items: center; gap: 6px;
    }}
    .tech-download-btn {{
      display: flex; align-items: center; justify-content: center; gap: 8px;
      background: #d97706;
      color: #fff;
      font-family: var(--sv-font-head);
      font-size: 13px;
      font-weight: 800;
      padding: 12px;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s;
    }}
    .tech-download-btn:hover {{
      background: #b45309;
    }}
  </style>
</head>
<body>

  {navbar_content}

  <section class="brand-hero">
    <div class="sv-container">
      <span class="brand-tag">HỆ THỐNG PROFILE NHÔM</span>
      <h1 class="brand-title">{name}</h1>
      <p class="brand-subtitle-hero">Dòng nhôm chất lượng cao được Sao Vàng lắp đặt chính hãng đồng bộ cho các giải pháp kiến trúc</p>
      
      <div class="brand-stats">
        <div class="brand-stat-card">
          <div class="brand-stat-num">{origin}</div>
          <div class="brand-stat-label">Xuất Xứ</div>
        </div>
        <div class="brand-stat-card">
          <div class="brand-stat-num">{len(meta["products"])}</div>
          <div class="brand-stat-label">Mẫu Thiết Kế</div>
        </div>
        <div class="brand-stat-card">
          <div class="brand-stat-num">{segment}</div>
          <div class="brand-stat-label">Phân Khúc</div>
        </div>
      </div>
    </div>
  </section>

  <section class="brand-detail-section">
    <div class="sv-container">
      <div class="brand-content-grid">
        <div class="brand-info-column">
          <h2 class="sv-section-title" style="margin-left:0; text-align:left;">Ưu Điểm & Đặc Tính</h2>
          {formatted_desc}
        </div>
        
        <div class="brand-sidebar">
          <h3 class="sidebar-title">Thông Số Kỹ Thuật</h3>
          <ul class="sidebar-list">
            <li>Xuất xứ nhôm: <strong>{origin}</strong></li>
            <li>Phân khúc dự án: <strong>{segment}</strong></li>
            <li>Sơn phủ bề mặt: <strong>Tĩnh điện / PVDF / Anodized</strong></li>
            <li>Độ bền màu sắc: <strong>10 - 25 năm chính hãng</strong></li>
            <li>Ứng dụng tối ưu: <strong>Cửa mở quay, cửa lùa trượt, vách ngăn</strong></li>
          </ul>
          
          <div class="tech-download-card">
            <div class="tech-download-title">
              <i class="ri-folder-zip-line"></i> TÀI LIỆU KỸ THUẬT & CAD PROFILE
            </div>
            <p style="font-size:12px; color:#78350f; line-height:1.5; margin:0;">
              Tải đầy đủ thư viện bản vẽ mặt cắt nhôm và tài liệu AutoCAD để hỗ trợ bóc tách khối lượng và thiết kế.
            </p>
            <a href="{cad_path}" class="tech-download-btn" download>
              Tải Bản Vẽ CAD (.dxf) <i class="ri-download-2-line"></i>
            </a>
            <a href="{pdf_path}" class="tech-download-btn" style="background:transparent; border:1px solid #d97706; color:#d97706;" download>
              Tải Sổ Tay Kỹ Thuật <i class="ri-file-pdf-2-line"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="brand-products-section">
    <div class="sv-container">
      <div style="text-align:center;">
        <span class="sv-section-tag">MẪU CỬA ĐẸP</span>
        <h2 class="sv-section-title" style="margin-inline:auto;">Giải Pháp Thiết Kế Cửa {name}</h2>
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

# Generate Brand Pages
for brand_id, meta in aluminum_metadata.items():
    page_html = generate_brand_page(brand_id, meta)
    filename = f"nhom-{brand_id}.html"
    filepath = os.path.join(BASE_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(page_html)
    print(f"Generated aluminum brand page: {filename}")

# Design dashboard nhom-sao-vang.html
redesigned_dashboard_html = f'''<!DOCTYPE html>
<html lang="vi">
<head>
  <link rel="icon" type="image/svg+xml" href="assets/images/logo-sv-main.svg" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#9B1C1C" />
  <title>Cổng Thông Tin Profile Nhôm & Catalogue Lắp Đặt | SAO VÀNG</title>
  <meta name="description" content="Sao Vàng phân phối và thi công các hệ nhôm kính cao cấp chính hãng: Xingfa, Maxpro, Civro, Slim, Kogen, PMA. Tích hợp bản vẽ CAD và so sánh kỹ thuật." />
  <meta name="keywords" content="nhôm xingfa, nhôm maxpro, nhôm civro, nhôm kogen, nhôm pma, profile nhôm, bản vẽ cad cửa nhôm" />
  
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" />
  <link rel="stylesheet" href="assets/css/main.css" />
  
  <style>
    :root {{
      --sv-red: #9B1C1C;
      --sv-gold: #d4af37;
    }}
    .dashboard-hero {{
      background: linear-gradient(135deg, #0f1115 0%, #1a1c23 100%);
      padding: 140px 0 80px;
      color: #fff;
      text-align: center;
      position: relative;
      overflow: hidden;
    }}
    .dashboard-hero::before {{
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(circle at 50% 120%, rgba(155, 28, 28, 0.12), transparent 70%);
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
    
    .brand-section {{
      padding: 80px 0;
      background: #f8fafc;
    }}
    .brand-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
      margin-top: 40px;
    }}
    .brand-card {{
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 30px 24px;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      min-height: 220px;
    }}
    .brand-card:hover {{
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.06);
      border-color: var(--sv-red);
    }}
    .brand-logo-name {{
      font-family: var(--sv-font-head);
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 0.02em;
      color: var(--sv-dark-900);
      margin-bottom: 8px;
    }}
    .brand-tagline {{
      font-size: 12px;
      color: var(--sv-gray-text);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}
    .brand-btn-explore {{
      font-family: var(--sv-font-head);
      font-size: 12px;
      font-weight: 800;
      color: var(--sv-red);
      margin-top: 20px;
      display: flex; align-items: center; gap: 4px;
    }}
  </style>
</head>
<body>

  {navbar_content}

  <section class="dashboard-hero">
    <div class="sv-container">
      <span class="brand-tag" style="background:rgba(255,255,255,0.1); padding:6px 14px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:0.1em;">CỔNG THÔNG TIN PROFILE</span>
      <h1 class="dashboard-title">Hệ Thống Profile Nhôm Kính</h1>
      <p class="dashboard-desc">
        Xem chi tiết ưu nhược điểm, thông số kỹ thuật và tải bản vẽ AutoCAD mặt cắt hệ nhôm từ các thương hiệu hàng đầu thế giới.
      </p>
    </div>
  </section>

  <section class="brand-section">
    <div class="sv-container">
      <div style="text-align:center;">
        <span class="sv-section-tag">CHỌN HÃNG THÔNG TIN</span>
        <h2 class="sv-section-title" style="margin-inline:auto;">Thương Hiệu Hệ Nhôm Phân Phối</h2>
      </div>
      
      <div class="brand-grid">
        <a href="nhom-xingfa.html" class="brand-card">
          <div>
            <div class="brand-logo-name" style="color:#e11d48;">XINGFA</div>
            <div class="brand-tagline">Quảng Đông (Trung Quốc)</div>
          </div>
          <div class="brand-btn-explore">Xem Kỹ Thuật & Bản Vẽ CAD <i class="ri-arrow-right-line"></i></div>
        </a>
        <a href="nhom-maxpro.html" class="brand-card">
          <div>
            <div class="brand-logo-name" style="color:#b45309;">MAXPRO.JP</div>
            <div class="brand-tagline">Nhật Bản (Anodized)</div>
          </div>
          <div class="brand-btn-explore">Xem Kỹ Thuật & Bản Vẽ CAD <i class="ri-arrow-right-line"></i></div>
        </a>
        <a href="nhom-civro.html" class="brand-card">
          <div>
            <div class="brand-logo-name" style="color:#1e293b;">CIVRO</div>
            <div class="brand-tagline">Công Nghệ Đức</div>
          </div>
          <div class="brand-btn-explore">Xem Kỹ Thuật & Bản Vẽ CAD <i class="ri-arrow-right-line"></i></div>
        </a>
        <a href="nhom-slim.html" class="brand-card">
          <div>
            <div class="brand-logo-name" style="color:#475569;">SLIM SYSTEM</div>
            <div class="brand-tagline">Cửa lùa siêu mảnh hiện đại</div>
          </div>
          <div class="brand-btn-explore">Xem Kỹ Thuật & Bản Vẽ CAD <i class="ri-arrow-right-line"></i></div>
        </a>
        <a href="nhom-kogen.html" class="brand-card">
          <div>
            <div class="brand-logo-name" style="color:#0369a1;">KOGEN</div>
            <div class="brand-tagline">Phong cách Đức cao cấp</div>
          </div>
          <div class="brand-btn-explore">Xem Kỹ Thuật & Bản Vẽ CAD <i class="ri-arrow-right-line"></i></div>
        </a>
        <a href="nhom-pma.html" class="brand-card">
          <div>
            <div class="brand-logo-name" style="color:#15803d;">PMA</div>
            <div class="brand-tagline">Tiêu Chuẩn Châu Âu</div>
          </div>
          <div class="brand-btn-explore">Xem Kỹ Thuật & Bản Vẽ CAD <i class="ri-arrow-right-line"></i></div>
        </a>
        <a href="nhom-owin.html" class="brand-card">
          <div>
            <div class="brand-logo-name" style="color:#4338ca;">OWIN</div>
            <div class="brand-tagline">Nhôm Owin rãnh C</div>
          </div>
          <div class="brand-btn-explore">Xem Kỹ Thuật & Bản Vẽ CAD <i class="ri-arrow-right-line"></i></div>
        </a>
        <a href="nhom-topal.html" class="brand-card">
          <div>
            <div class="brand-logo-name" style="color:#b91c1c;">TOPAL</div>
            <div class="brand-tagline">Tập đoàn Austdoor</div>
          </div>
          <div class="brand-btn-explore">Xem Kỹ Thuật & Bản Vẽ CAD <i class="ri-arrow-right-line"></i></div>
        </a>
      </div>
    </div>
  </section>

  {footer_content}
</body>
</html>
'''

# Save redesigned nhom-sao-vang.html
with open(os.path.join(BASE_DIR, "nhom-sao-vang.html"), "w", encoding="utf-8") as f:
    f.write(redesigned_dashboard_html)
print("Generated redesigned nhom-sao-vang.html dashboard.")
