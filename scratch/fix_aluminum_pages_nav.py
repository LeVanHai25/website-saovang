import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"

aluminum_pages = [
    "nhom-xingfa.html",
    "nhom-maxpro.html",
    "nhom-civro.html",
    "nhom-slim.html",
    "nhom-kogen.html",
    "nhom-pma.html",
    "nhom-owin.html",
    "nhom-topal.html",
    "nhom-sao-vang.html"
]

# Read streamlined nav from index.html
with open(os.path.join(BASE_DIR, "index.html"), "r", encoding="utf-8", errors="replace") as f:
    index_html = f.read()

nav_start = index_html.find("<!-- ── NAVBAR ── -->")
if nav_start == -1:
    nav_start = index_html.find("<nav")
nav_end = index_html.find("<!-- ── HERO ── -->")
if nav_end == -1:
    nav_end = index_html.find("</nav>") + 6

streamlined_nav = index_html[nav_start:nav_end]
print("Extracted streamlined nav from index.html successfully.")

for page in aluminum_pages:
    filepath = os.path.join(BASE_DIR, page)
    if not os.path.exists(filepath):
        print(f"File not found: {page}")
        continue

    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    p_nav_start = content.find("<!-- ── NAVBAR ── -->")
    if p_nav_start == -1:
        p_nav_start = content.find("<nav")
    p_nav_end = content.find("<!-- ── HERO ── -->")
    if p_nav_end == -1:
        p_nav_end = content.find("</nav>") + 6

    if p_nav_start != -1 and p_nav_end != -1:
        new_content = content[:p_nav_start] + streamlined_nav + content[p_nav_end:]
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated nav menu: {page}")
    else:
        print(f"Could not locate nav tags in: {page}")

print("Nav menu sync completed for all aluminum pages.")
