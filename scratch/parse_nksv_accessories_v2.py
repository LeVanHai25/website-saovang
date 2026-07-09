import os
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

filepath = r"d:\Sao Vàng\Website-SaoVang\website\phu-kien.html"

with open(filepath, "r", encoding="utf-8", errors="replace") as f:
    html = f.read()

# Splitting by category block
# <div class="pk-category" data-cat="([^"]+)">
cat_blocks = re.split(r'<div class="pk-category"\s+data-cat="([^"]+)">', html)

existing_products = {}

for i in range(1, len(cat_blocks), 2):
    cat_id = cat_blocks[i]
    cat_html = cat_blocks[i+1]
    
    # We want to find the end of this category block
    # It ends at the next class="pk-category" or similar wrapper
    next_cat_idx = cat_html.find('class="pk-category"')
    if next_cat_idx != -1:
        cat_html = cat_html[:next_cat_idx]
        
    # Now find all cards inside this clean html
    # Let's search for <div class="pk-card"> ... and match up to the end of card.
    # Cards typically end with </div>\n          </div>
    card_matches = re.finditer(r'<div class="pk-card">(.*?)</div>\s*</div>\s*(?:</div>\s*)?(?:<!--|$)', cat_html, re.DOTALL)
    
    # A safer way is to just find all card bodies
    card_bodies = re.findall(r'<div class="pk-card-body">\s*<div class="pk-card-name">(.*?)</div>', cat_html, re.DOTALL)
    
    # Find all images inside pk-card-img
    card_imgs = re.findall(r'<div class="pk-card-img">\s*<img\s+[^>]*src="([^"]+)"', cat_html, re.DOTALL | re.IGNORECASE)
    
    print(f"Category {cat_id}: Found {len(card_bodies)} bodies and {len(card_imgs)} images.")
    
    # Pair them up
    count = min(len(card_bodies), len(card_imgs))
    for idx in range(count):
        name = card_bodies[idx].strip()
        img = card_imgs[idx].strip()
        if cat_id not in existing_products:
            existing_products[cat_id] = []
        existing_products[cat_id].append({
            "name": name,
            "image": img,
            "url": "lien-he.html"
        })

output_path = r"d:\Sao Vàng\Website-SaoVang\scratch\nksv_existing_accessories.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(existing_products, f, ensure_ascii=False, indent=2)

print("Saved existing NKSV products successfully.")
