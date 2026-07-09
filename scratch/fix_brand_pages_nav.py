import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"

# The 11 brand pages
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

# Read the standard nav menu block from index.html (which is already streamlined and updated)
# Wait, let's look at index.html nav block
with open(os.path.join(BASE_DIR, "index.html"), "r", encoding="utf-8", errors="replace") as f:
    index_html = f.read()

# Grab nav from index.html
# Standard NKSV nav is bounded by <!-- ── NAVBAR ── --> and <!-- ── HERO ── -->
nav_start = index_html.find("<!-- ── NAVBAR ── -->")
if nav_start == -1:
    nav_start = index_html.find("<nav")
nav_end = index_html.find("<!-- ── HERO ── -->")
if nav_end == -1:
    nav_end = index_html.find("</nav>") + 6

streamlined_nav = index_html[nav_start:nav_end]
print("Extracted streamlined nav menu from index.html successfully.")

# Modify each brand page to replace its navbar section with the streamlined one
for page in brand_pages:
    filepath = os.path.join(BASE_DIR, page)
    if not os.path.exists(filepath):
        print(f"File not found: {page}")
        continue
        
    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
        
    # Find navbar section in brand page
    p_nav_start = content.find("<!-- ── NAVBAR ── -->")
    if p_nav_start == -1:
        p_nav_start = content.find("<nav")
    p_nav_end = content.find("<!-- ── HERO ── -->")
    if p_nav_end == -1:
        p_nav_end = content.find("</nav>") + 6
        
    if p_nav_start != -1 and p_nav_end != -1:
        # Replace
        new_content = content[:p_nav_start] + streamlined_nav + content[p_nav_end:]
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated nav menu for: {page}")
    else:
        print(f"Could not locate nav tags in: {page}")

print("Nav menu sync completed for brand pages.")
