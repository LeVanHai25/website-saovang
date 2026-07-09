import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

filepath = r"d:\Sao Vàng\Website-SaoVang\website\phu-kien.html"

with open(filepath, "r", encoding="utf-8", errors="replace") as f:
    html = f.read()

# Find categories
categories = re.findall(r'<!-- ══ (\d+)\.\s*(.*?)\s*══ -->', html)
print("Current categories in NKSV phu-kien.html:")
for cat_num, cat_name in categories:
    print(f" - Category {cat_num}: {cat_name.strip()}")

# Find category data attributes
print("\nParsed categories by data-cat:")
cat_divs = re.finditer(r'<div class="pk-category"\s+data-cat="([^"]+)">\s*<div class="pk-category-header">.*?<h2[^>]*>(.*?)</h2>', html, re.DOTALL | re.IGNORECASE)
for m in cat_divs:
    cat_id = m.group(1)
    title_raw = m.group(2)
    # Clean tags from title
    title = re.sub(r'<[^>]*>', '', title_raw).strip()
    # Count products in this category
    # Find next pk-category or end of layout
    cat_start = m.start()
    # search for next pk-category
    next_cat = html.find('class="pk-category"', cat_start + 50)
    if next_cat == -1:
        next_cat = html.find('</main>', cat_start)
    cat_content = html[cat_start:next_cat]
    cards = re.findall(r'<div class="pk-card">', cat_content)
    print(f" - {cat_id}: {title} ({len(cards)} products)")
