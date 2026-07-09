import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load NKSV products
filepath_nksv = r"d:\Sao Vàng\Website-SaoVang\website\phu-kien.html"
with open(filepath_nksv, "r", encoding="utf-8", errors="replace") as f:
    html_nksv = f.read()

nksv_prods = re.findall(r'<div class="pk-card-name">(.*?)</div>', html_nksv)
nksv_prods_cleaned = {re.sub(r'\s+', ' ', p).strip().lower() for p in nksv_prods}

print(f"Total NKSV products found: {len(nksv_prods_cleaned)}")

# Let's read all parsed files to list Đại Phúc accessory products
# The parsed products list is in:
# C:\Users\Admin\.gemini\antigravity\brain\1fa78ea5-e878-400b-b754-b19d66fc5aa5\daiphuc_knowledge_base.md
# We can load it or we can directly extract from steps
steps_dir = r"C:\Users\Admin\.gemini\antigravity\brain\1fa78ea5-e878-400b-b754-b19d66fc5aa5\.system_generated\steps"

daiphuc_accs = {} # category -> list of items

for root, dirs, files in os.walk(steps_dir):
    for f in files:
        if f == "content.md":
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8", errors="replace") as file:
                lines = file.readlines()
            
            source_url = ""
            for line in lines[:10]:
                if line.startswith("Source:"):
                    source_url = line.split("Source:", 1)[1].strip()
                    break
            
            if not source_url or "phu-kien" not in source_url:
                continue
                
            content_str = "".join(lines)
            
            # Find accessories in this page
            # Usually they are formatted as product cards or lists
            # Let's extract them
            # Format: <div class="name"><a href="..." title="...">Product Name</a></div>
            matches = re.finditer(r'<a\s+href="(phu-kien/[^"]+)"\s+title="([^"]+)"', content_str)
            for m in matches:
                url = "https://nhomkinhdaiphuc.com/" + m.group(1)
                name = m.group(2).strip()
                # Find category from URL or text
                # e.g., phu-kien/138-phu-ken-cua-slim.html -> slim
                cat = "other"
                if "slim" in url.lower():
                    cat = "slim"
                elif "truot-quay" in url.lower() or "truotquay" in url.lower():
                    cat = "truot-quay"
                elif "draho" in url.lower():
                    cat = "draho"
                elif "bogo" in url.lower():
                    cat = "bogo"
                elif "kinlong" in url.lower():
                    cat = "kinlong"
                elif "janus" in url.lower():
                    cat = "janus"
                elif "huy-hoang" in url.lower() or "huyhoang" in url.lower():
                    cat = "huy-hoang"
                elif "cmech" in url.lower():
                    cat = "cmech"
                elif "khoa-dien-tu" in url.lower() or "smart-lock" in url.lower() or "khoa-dt" in url.lower() or "khoa-digital" in url.lower():
                    cat = "khoa-dt"
                elif "candy" in url.lower():
                    cat = "candy"
                elif "opk" in url.lower():
                    cat = "opk"
                elif "sigico" in url.lower():
                    cat = "sigico"
                elif "hafele" in url.lower():
                    cat = "hafele"
                elif "3h" in url.lower():
                    cat = "3h"
                elif "papo" in url.lower():
                    cat = "papo"
                
                # Check for item name and image URL
                # Substring around match
                start = max(0, m.start() - 300)
                end = min(len(content_str), m.end() + 300)
                nearby_html = content_str[start:end]
                img_match = re.search(r'data-src="([^"]+)"|src="([^"]+)"', nearby_html)
                img_url = img_match.group(1) or img_match.group(2) if img_match else ""
                if img_url and not img_url.startswith("http"):
                    img_url = "https://nhomkinhdaiphuc.com/" + img_url
                
                if cat not in daiphuc_accs:
                    daiphuc_accs[cat] = {}
                daiphuc_accs[cat][name] = {
                    "url": url,
                    "image": img_url
                }

print(f"Total Dai Phuc accessory categories: {len(daiphuc_accs)}")
for cat, items in daiphuc_accs.items():
    print(f" - {cat}: {len(items)} items")

# Compare
missing = {}
for cat, items in daiphuc_accs.items():
    missing[cat] = []
    for item_name, info in items.items():
        # Check if item name is similar to any in NKSV
        cleaned_item_name = item_name.lower().replace("phụ kiện cửa slim", "").replace("phụ kiện cửa trượt quay", "").strip()
        matched = False
        for nksv_p in nksv_prods_cleaned:
            # simple check: if clean item name is in nksv product name or vice versa
            if cleaned_item_name in nksv_p or nksv_p in cleaned_item_name:
                matched = True
                break
        if not matched:
            missing[cat].append({
                "name": item_name,
                "url": info["url"],
                "image": info["image"]
            })

print("\nMissing items count per category:")
for cat, items in missing.items():
    print(f" - {cat}: {len(items)} items missing")
    if items:
        print(f"   Example: {items[0]['name']}")
