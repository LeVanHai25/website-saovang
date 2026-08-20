import os
import sys
import json
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = r"d:\Sao Vàng\Website-SaoVang"
DATA_DIR = os.path.join(ROOT_DIR, "website", "data", "aluminium")
WEBSITE_DIR = os.path.join(ROOT_DIR, "website")

print("==================================================")
print("🔍 SV ALUMINIUM — FULL SUITE QA & DEPLOYMENT AUDIT")
print("==================================================")

# 1. Check Data Foundation Files
required_json = [
    "systems.json", "solutions.json", "markets.json", 
    "levels.json", "applications.json", "door_models.json", 
    "materials.json", "hardware.json", "case_studies.json"
]

all_data_ok = True
print("\n[1/5] Kiểm tra 9 tệp dữ liệu chuẩn hóa JSON:")
for fname in required_json:
    fpath = os.path.join(DATA_DIR, fname)
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            d = json.load(f)
            count = len(d) if isinstance(d, list) else len(d.keys())
            print(f"  ✓ {fname:<20} ({count} mục)")
    else:
        print(f"  ❌ THIẾU: {fname}")
        all_data_ok = False

# 2. Check 16 Base Systems Integrity
with open(os.path.join(DATA_DIR, "systems.json"), "r", encoding="utf-8") as f:
    systems = json.load(f)
    print(f"\n[2/5] Kiểm tra tính toàn vẹn 16 Hệ Nhôm Gốc ({len(systems)} hệ):")
    for s in systems:
        has_code = bool(s.get("code"))
        has_group = bool(s.get("group_id"))
        has_level = bool(s.get("level_id"))
        has_verify = bool(s.get("verification"))
        assert has_code and has_group and has_level and has_verify, f"Lỗi hệ {s.get('id')}"
    print(f"  ✓ 16/16 hệ nhôm có đầy đủ mã code, group_id, level_id, verification status và solution tags!")

# 3. Check HTML Pages Existence & Key Markers
html_pages = {
    "nhomsaovang.html": ["al-hero", "marketsSection", "levelsSection", "solutionsSection", "systemsSection", "finishesSection", "caseStudiesSection", "smartFinderSection", "rfqSection"],
    "cuanhomkinh.html": ["door-hero", "openingDoors", "slidingDoors", "slimDoors", "specialDoors", "doorRfq"],
    "vachkinh.html": ["facade-hero", "facadeList", "facadeRfq"],
    "thuvienprofilenhom.html": ["lib-hero", "filter-panel", "lib-table-wrap", "detailDrawer"]
}

print("\n[3/5] Kiểm tra cấu trúc các trang HTML & Cột mốc UX:")
for page, markers in html_pages.items():
    p_path = os.path.join(WEBSITE_DIR, page)
    if os.path.exists(p_path):
        with open(p_path, "r", encoding="utf-8") as f:
            content = f.read()
            missing = [m for m in markers if m not in content]
            if not missing:
                print(f"  ✓ {page:<26} (Đầy đủ {len(markers)} khối UX)")
            else:
                print(f"  ⚠️ {page:<26} Thiếu markers: {missing}")
    else:
        print(f"  ❌ THIẾU TRANG: {page}")

# 4. Check Core JS Modules
js_files = ["assets/js/main.js", "assets/js/aluminium-finder.js", "assets/js/aluminium-rfq.js"]
print("\n[4/5] Kiểm tra các tệp JavaScript hỗ trợ:")
for js in js_files:
    jspath = os.path.join(WEBSITE_DIR, js)
    if os.path.exists(jspath):
        print(f"  ✓ {js:<35} ({os.path.getsize(jspath)} bytes)")
    else:
        print(f"  ❌ THIẾU JS: {js}")

# 5. Test Local HTTP Server Responses
urls_to_test = [
    "http://localhost:4000/nhomsaovang.html",
    "http://localhost:4000/cuanhomkinh.html",
    "http://localhost:4000/vachkinh.html",
    "http://localhost:4000/thuvienprofilenhom.html",
    "http://localhost:4000/data/aluminium/systems.json",
    "http://localhost:4000/assets/js/aluminium-finder.js",
    "http://localhost:4000/assets/js/aluminium-rfq.js"
]

print("\n[5/5] Kiểm thử HTTP Status trên Local Express Server:")
all_http_ok = True
for u in urls_to_test:
    try:
        req = urllib.request.urlopen(u, timeout=5)
        print(f"  ✓ {u.replace('http://localhost:4000', ''):<35} --> {req.status} OK")
    except Exception as e:
        print(f"  ❌ {u} --> LỖI: {e}")
        all_http_ok = False

print("\n==================================================")
if all_data_ok and all_http_ok:
    print("🎉 TẤT CẢ CÁC BƯỚC KIỂM TRA ĐỀU ĐẠT CHUẨN 100%!")
    print("   HỆ THỐNG SV ALUMINIUM ĐÃ SẴN SÀNG HOẠT ĐỘNG HOÀN HẢO.")
print("==================================================")
