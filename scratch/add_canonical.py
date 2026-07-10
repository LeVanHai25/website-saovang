import os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"
DOMAIN = "https://www.CoKhiSaoVang.com"

PAGES = {
    # Nhôm
    "nhom-sao-vang.html":        "Hệ Nhôm Sao Vàng — Xingfa · Maxpro · Civro · Kogen | Cơ Khí Sao Vàng",
    "nhom-xingfa.html":          "Nhôm Xingfa Quảng Đông — Hệ Cửa Cao Cấp Chính Hãng | Sao Vàng",
    "nhom-maxpro.html":          "Nhôm Maxpro.JP — Anodized Chống Muối Mặn Nhật Bản | Sao Vàng",
    "nhom-civro.html":           "Nhôm Civro — Cầu Cách Nhiệt Luxury Công Nghệ Đức | Sao Vàng",
    "nhom-slim.html":            "Nhôm Slim System — Cửa Lùa Panorama Khung Siêu Mảnh | Sao Vàng",
    "nhom-kogen.html":           "Nhôm Kogen — Cửa Xếp Gấp & Trượt Lật Cao Cấp | Sao Vàng",
    "nhom-pma.html":             "Nhôm PMA — Hệ Rãnh C Lux65 Tiêu Chuẩn Châu Âu | Sao Vàng",
    "nhom-owin.html":            "Nhôm Owin — Hệ Cửa Rãnh C Đồng Bộ Nhà Phố | Sao Vàng",
    "nhom-topal.html":           "Nhôm Topal Austdoor — Tiêu Chuẩn Quốc Gia Việt Nam | Sao Vàng",
    # Phụ kiện
    "phu-kien.html":             "Phụ Kiện Cửa Nhôm — Dashboard Tra Cứu Toàn Diện | Sao Vàng",
    "phu-kien-cmech.html":       "Phụ Kiện CMECH — Bản Lề · Khóa · Ray Trượt Cao Cấp | Sao Vàng",
    "phu-kien-bogo.html":        "Phụ Kiện BOGO — Bộ Giải Pháp Phụ Kiện Nhôm Kính | Sao Vàng",
    "phu-kien-draho.html":       "Phụ Kiện DRAHO — Tay Nắm & Phụ Kiện Cao Cấp | Sao Vàng",
    "phu-kien-papo.html":        "Phụ Kiện PAPO — Bản Lề & Tay Nắm Nhập Khẩu | Sao Vàng",
    "phu-kien-opk.html":         "Phụ Kiện OPK — Phụ Kiện Cửa Kính & Nhôm OPK | Sao Vàng",
    "phu-kien-sigico.html":      "Phụ Kiện SIGICO — Khóa & Tay Nắm Sigico Chính Hãng | Sao Vàng",
    "phu-kien-kinlong.html":     "Phụ Kiện KINLONG — Bản Lề Kinlong Chống Gỉ | Sao Vàng",
    "phu-kien-janus.html":       "Phụ Kiện JANUS — Tay Nắm & Khóa Janus Cao Cấp | Sao Vàng",
    "phu-kien-huy-hoang.html":   "Phụ Kiện Huy Hoàng — Phụ Kiện Nhôm Nội Địa Uy Tín | Sao Vàng",
    "phu-kien-hafele.html":      "Phụ Kiện Häfele — Bản Lề & Khóa Häfele Đức | Sao Vàng",
    "phu-kien-3h.html":          "Phụ Kiện 3H — Phụ Kiện Cửa 3H Toàn Diện | Sao Vàng",
}

added = 0
for page, title in PAGES.items():
    filepath = os.path.join(BASE_DIR, page)
    if not os.path.exists(filepath):
        print(f"  MISSING: {page}")
        continue

    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    # Skip if already has canonical
    if re.search(r'<link\s+rel=["\']canonical["\']', content, re.I):
        print(f"  ✓ Already has canonical: {page}")
        continue

    canonical_tag = f'  <link rel="canonical" href="{DOMAIN}/{page}" />\n'

    # Insert before </head>
    if '</head>' in content:
        content = content.replace('</head>', canonical_tag + '</head>', 1)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  ✅ Added canonical: {page}")
        added += 1
    else:
        print(f"  ⚠️  No </head> found: {page}")

print(f"\nDone. Added canonical to {added} pages.")
