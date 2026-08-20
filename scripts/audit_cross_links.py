import os
import re
import sys
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = r"d:\Sao Vàng\Website-SaoVang\website"
pages = ["nhomsaovang.html", "cuanhomkinh.html", "vachkinh.html", "thuvienprofilenhom.html"]

print("==================================================")
print("🔗 AUDIT LIÊN KẾT CHÉO (CROSS-LINKS) TRONG HỆ THỐNG")
print("==================================================")

total_links = 0
broken_links = 0

for page in pages:
    fpath = os.path.join(ROOT_DIR, page)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all hrefs
    links = re.findall(r'href="([^"#][^"]*)"', content)
    print(f"\n📄 Trang [{page}]: {len(links)} liên kết")
    for link in links:
        if link.startswith("http") or link.startswith("tel:") or link.startswith("mailto:"):
            continue
        total_links += 1
        target_path = os.path.join(ROOT_DIR, link.split('#')[0])
        if os.path.exists(target_path):
            print(f"  ✓ {link:<35} --> Tồn tại")
        else:
            print(f"  ❌ {link:<35} --> GÃY / KHÔNG TỒN TẠI")
            broken_links += 1

print("\n==================================================")
print(f"TỔNG KẾT: Đã quét {total_links} liên kết nội bộ. Gãy: {broken_links}")
print("==================================================")
