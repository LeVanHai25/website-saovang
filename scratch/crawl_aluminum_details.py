import os
import re
import urllib.request
import sys
import time
import json

sys.stdout.reconfigure(encoding='utf-8')

aluminum_urls = {
    "xingfa": "https://nhomkinhdaiphuc.com/san-pham/105-cua-nhom-xingfa.html",
    "maxpro": "https://nhomkinhdaiphuc.com/san-pham/137-cua-nhom-maxpro-jp.html",
    "slim": "https://nhomkinhdaiphuc.com/san-pham/134-cua-nhom-he-slim.html",
    "kogen": "https://nhomkinhdaiphuc.com/san-pham/159-cua-nhom-kogen.html",
    "pma": "https://nhomkinhdaiphuc.com/san-pham/160-cua-nhom-pma.html",
    "owin": "https://nhomkinhdaiphuc.com/san-pham/400-cua-nhom-owin.html",
    "topal": "https://nhomkinhdaiphuc.com/san-pham/403-cua-nhom-topal.html"
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

aluminum_brand_details = {}

for brand, url in aluminum_urls.items():
    print(f"Crawling text description for aluminum system: {brand}...")
    html = fetch_html(url)
    if html:
        # Search for seo content or description block
        seo_match = re.search(r'<div class="noidungseo[^"]*">(.*?)</div>\s*</div>', html, re.DOTALL | re.IGNORECASE)
        if not seo_match:
            seo_match = re.search(r'<div class="content-description">(.*?)</div>', html, re.DOTALL | re.IGNORECASE)
        if not seo_match:
            seo_match = re.search(r'<article[^>]*id="content"[^>]*>(.*?)</article>', html, re.DOTALL | re.IGNORECASE)
            
        if seo_match:
            text = seo_match.group(1)
            # Remove scripts and styles
            text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
            text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL | re.IGNORECASE)
            text = re.sub(r'</?(?:div|span|article|section)[^>]*>', '', text)
            text = re.sub(r'<h2>(.*?)</h2>', r'\n\n### \1\n', text)
            text = re.sub(r'<h3>(.*?)</h3>', r'\n\n#### \1\n', text)
            text = re.sub(r'<p>(.*?)</p>', r'\n\1\n', text)
            text = re.sub(r'<br\s*/?>', r'\n', text)
            text = re.sub(r'<[^>]*>', '', text)
            text = re.sub(r'\n\s*\n+', '\n\n', text)
            
            aluminum_brand_details[brand] = text.strip()
            print(f" -> Successfully extracted description ({len(text)} chars)")
        else:
            print(" -> No description block found")
        time.sleep(1)

# Save to file
output_path = r"d:\Sao Vàng\Website-SaoVang\scratch\aluminum_brand_details.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(aluminum_brand_details, f, ensure_ascii=False, indent=2)

print("Aluminum brand details crawling completed.")
