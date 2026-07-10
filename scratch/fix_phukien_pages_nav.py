import os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"

phu_kien_pages = [
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
    "phu-kien-3h.html",
]

# Read nav from index.html
with open(os.path.join(BASE_DIR, "index.html"), "r", encoding="utf-8", errors="replace") as f:
    index_html = f.read()

# Try to extract nav block
patterns = [
    ("<!-- ── NAVBAR ── -->", "<!-- ── HERO ── -->"),
    ("<nav ", "</nav>"),
]

nav_block = None
for start_marker, end_marker in patterns:
    s = index_html.find(start_marker)
    e = index_html.find(end_marker)
    if s != -1 and e != -1 and e > s:
        if end_marker == "</nav>":
            e += 6
        nav_block = index_html[s:e]
        print(f"Nav extracted using markers: '{start_marker}' → '{end_marker}'")
        break

if not nav_block:
    print("ERROR: Could not extract nav block from index.html")
    sys.exit(1)

updated = 0
skipped = 0
for page in phu_kien_pages:
    filepath = os.path.join(BASE_DIR, page)
    if not os.path.exists(filepath):
        print(f"  MISSING: {page}")
        skipped += 1
        continue

    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    # Find nav block in the page
    for start_marker, end_marker in patterns:
        s = content.find(start_marker)
        e = content.find(end_marker)
        if s != -1 and e != -1 and e > s:
            if end_marker == "</nav>":
                e += 6
            new_content = content[:s] + nav_block + content[e:]
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"  ✅ Nav updated: {page}")
            updated += 1
            break
    else:
        print(f"  ⚠️  Nav marker not found: {page}")
        skipped += 1

print(f"\nDone. Updated: {updated}, Skipped/Missing: {skipped}")
