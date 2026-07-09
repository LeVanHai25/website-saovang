import os
import re
import urllib.request
import urllib.parse
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

# The target categories on Dai Phuc
categories = {
    "slim": "https://nhomkinhdaiphuc.com/phu-kien/138-phu-ken-cua-slim.html",
    "truot-quay": "https://nhomkinhdaiphuc.com/phu-kien/132-phu-kien-cua-truot-quay.html",
    "papo": "https://nhomkinhdaiphuc.com/phu-kien/155-phu-kien-papo.html",
    "opk": "https://nhomkinhdaiphuc.com/phu-kien/156-phu-kien-opk.html",
    "draho": "https://nhomkinhdaiphuc.com/phu-kien/130-phu-kien-draho.html",
    "bogo": "https://nhomkinhdaiphuc.com/phu-kien/127-phu-kien-bogo.html",
    "cmech": "https://nhomkinhdaiphuc.com/phu-kien/129-phu-kien-cmech.html",
    "huy-hoang": "https://nhomkinhdaiphuc.com/phu-kien/131-phu-kien-huy-hoang.html",
    "kinlong": "https://nhomkinhdaiphuc.com/phu-kien/128-phu-kien-kinlong.html",
    "janus": "https://nhomkinhdaiphuc.com/phu-kien/140-phu-kien-janus.html",
    "khoa-dt": "https://nhomkinhdaiphuc.com/phu-kien/139-khoa-dien-tu.html",
    "candy": "https://nhomkinhdaiphuc.com/phu-kien/157-phu-kien-candy.html",
    "sigico": "https://nhomkinhdaiphuc.com/phu-kien/161-phu-kien-sigico.html",
    "cua-kinh": "https://nhomkinhdaiphuc.com/phu-kien/162-phu-kien-cua-kinh.html",
    "hafele": "https://nhomkinhdaiphuc.com/phu-kien/164-phu-kien-hafele.html",
    "ykebr": "https://nhomkinhdaiphuc.com/phu-kien/401-phu-kien-ykebr.html",
    "phu-kien-3h": "https://nhomkinhdaiphuc.com/phu-kien/404-phu-kien-3h.html"
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def fetch_html(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            return response.read().decode('utf-8', errors='replace')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

def parse_category_products(html):
    products = []
    # Structure of item in grid:
    # <div class="item_product_content">
    # or similar containing links: <a href="phu-kien/..." title="...">
    matches = re.finditer(r'<a\s+href="(phu-kien/[^"]+)"\s+title="([^"]+)"', html)
    for m in matches:
        url = "https://nhomkinhdaiphuc.com/" + m.group(1)
        name = m.group(2).strip()
        
        # Look for image nearby
        start = max(0, m.start() - 300)
        end = min(len(html), m.end() + 300)
        nearby_html = html[start:end]
        img_match = re.search(r'data-src="([^"]+)"|src="([^"]+)"', nearby_html)
        img_url = img_match.group(1) or img_match.group(2) if img_match else ""
        if img_url and not img_url.startswith("http"):
            img_url = "https://nhomkinhdaiphuc.com/" + img_url
            
        if name not in [p["name"] for p in products]:
            products.append({
                "name": name,
                "url": url,
                "image": img_url
            })
    return products

crawled_data = {}

for cat, url in categories.items():
    print(f"Crawling {cat} from {url}...")
    html = fetch_html(url)
    if html:
        prods = parse_category_products(html)
        crawled_data[cat] = prods
        print(f" -> Found {len(prods)} products")
        time.sleep(1) # delay
    else:
        print(f" -> Failed to fetch")

# Save crawled results to a summary file for reference
import json
output_path = r"d:\Sao Vàng\Website-SaoVang\scratch\crawled_accessories.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(crawled_data, f, ensure_ascii=False, indent=2)

print("Crawling complete. Saved to crawled_accessories.json")
