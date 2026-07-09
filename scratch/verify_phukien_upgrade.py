import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"

brand_pages = [
    "phu-kien-cmech.html",
    "phu-kien-bogo.html",
    "phu-kien-draho.html",
    "phu-kien-papo.html",
    "phu-kien-opk.html",
    "phu-kien-sigico.html",
    "phu-kien-kinlong.html",
    "phu-kien-janus.html",
    "phu-kien-huy-hoang.html",
    "phu-kien-hafele.html",
    "phu-kien-3h.html"
]

all_ok = True

print("=== KIỂM TRA CHẤT LƯỢNG NÂNG CẤP TRANG PHỤ KIỆN ===")

# 1. Verify main phu-kien.html
pk_path = os.path.join(BASE_DIR, "phu-kien.html")
if os.path.exists(pk_path):
    size = os.path.getsize(pk_path)
    with open(pk_path, "r", encoding="utf-8", errors="replace") as f:
        c = f.read()
    has_db = "PRODUCTS_DB" in c
    has_side_panel = "side-panel" in c
    has_search = "db-search-input" in c
    status = "OK" if (has_db and has_side_panel and has_search) else "ERROR"
    if status == "ERROR":
        all_ok = False
    print(f"phu-kien.html: Size={size:,} bytes | PRODUCTS_DB={has_db} | SidePanel={has_side_panel} | Search={has_search} -> [{status}]")
else:
    print("phu-kien.html: [MISSING] -> ERROR")
    all_ok = False

# 2. Verify Brand Pages
for page in brand_pages:
    filepath = os.path.join(BASE_DIR, page)
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            c = f.read()
        has_nav = "nav-menu-link" in c
        has_footer = "footer-bottom" in c or "CoKhiSaoVang" in c
        has_stats = "brand-stats" in c
        has_closing = "</html>" in c
        
        status = "OK" if (has_nav and has_footer and has_stats and has_closing) else "ERROR"
        if status == "ERROR":
            all_ok = False
            
        print(f"{page}: Size={size:,} bytes | Nav={has_nav} | Stats={has_stats} | HTML_Close={has_closing} -> [{status}]")
    else:
        print(f"{page}: [MISSING] -> ERROR")
        all_ok = False

print("\nKẾT LUẬN: " + ("TẤT CẢ KIỂM TRA ĐẠT CHUẨN" if all_ok else "PHÁT HIỆN LỖI CẦN KHẮC PHỤC"))
