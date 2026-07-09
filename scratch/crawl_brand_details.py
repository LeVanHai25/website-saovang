import os
import re
import urllib.request
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

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
        return ""

brand_descriptions = {}

for brand, url in categories.items():
    print(f"Crawling text description for brand: {brand}...")
    html = fetch_html(url)
    if html:
        # Search for seo content or description block
        # Usually it is in <div class="noidungseo"> or similar
        seo_match = re.search(r'<div class="noidungseo[^"]*">(.*?)</div>\s*</div>', html, re.DOTALL | re.IGNORECASE)
        if not seo_match:
            # try finding description block
            seo_match = re.search(r'<div class="content-description">(.*?)</div>', html, re.DOTALL | re.IGNORECASE)
        if not seo_match:
            # fallback: find standard article contents
            seo_match = re.search(r'<article[^>]*id="content"[^>]*>(.*?)</article>', html, re.DOTALL | re.IGNORECASE)
            
        if seo_match:
            text = seo_match.group(1)
            # Remove scripts and style tags
            text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
            text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL | re.IGNORECASE)
            # Basic html cleaning
            text = re.sub(r'</?(?:div|span|article|section)[^>]*>', '', text)
            # Replace lists and paragraphs for readable presentation
            text = re.sub(r'<h2>(.*?)</h2>', r'\n\n### \1\n', text)
            text = re.sub(r'<h3>(.*?)</h3>', r'\n\n#### \1\n', text)
            text = re.sub(r'<p>(.*?)</p>', r'\n\1\n', text)
            text = re.sub(r'<br\s*/?>', r'\n', text)
            # Remove any left HTML tags
            text = re.sub(r'<[^>]*>', '', text)
            # clean spacing
            text = re.sub(r'\n\s*\n+', '\n\n', text)
            brand_descriptions[brand] = text.strip()
            print(f" -> Successfully extracted description ({len(text)} chars)")
        else:
            print(" -> No description block found")
        time.sleep(1)

# Save to file
import json
output_path = r"d:\Sao Vàng\Website-SaoVang\scratch\brand_details.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(brand_descriptions, f, ensure_ascii=False, indent=2)

print("Brand crawling completed.")
