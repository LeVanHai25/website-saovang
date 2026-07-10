import os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"

# ── Load canonical header from index.html ──────────────────────
index_path = os.path.join(BASE_DIR, "index.html")
with open(index_path, "r", encoding="utf-8", errors="replace") as f:
    index_content = f.read()

header_match = re.search(r'<header class="header-v2".*?</header>', index_content, re.DOTALL)
if not header_match:
    print("ERROR: Cannot extract header from index.html")
    sys.exit(1)
base_header = header_match.group(0)

def customize_active(template, active_href):
    clean = re.sub(r' active(?=["\'])', '', template)
    clean = re.sub(r'class="nav-menu-link active"', 'class="nav-menu-link"', clean)
    pattern = rf'(href=["\']{re.escape(active_href)}["\'] class=["\']nav-menu-link["\'])'
    replacement = rf'href="{active_href}" class="nav-menu-link active"'
    return re.sub(pattern, replacement, clean)

# ─────────────────────────────────────────────────────────────────
# FIX 1: bao-gia-nhom.html — <body class="calc-page">
# ─────────────────────────────────────────────────────────────────
filepath = os.path.join(BASE_DIR, "bao-gia-nhom.html")
with open(filepath, "r", encoding="utf-8", errors="replace") as f:
    content = f.read()

# Find old navbar block (the self-written one)
old_nav_start = content.find('<nav class="navbar"')
if old_nav_start == -1:
    old_nav_start = content.find('<nav class="nav-menu"')

# Find end of old nav area: either </header> or </nav> + all extras up to the main content
# The nav in bao-gia-nhom.html ends at the first </nav> that closes the .navbar
nav_end_match = re.search(r'</ul>\s*</div>\s*</nav>', content[old_nav_start:]) if old_nav_start != -1 else None

if old_nav_start != -1 and nav_end_match:
    nav_end = old_nav_start + nav_end_match.end()
    custom_header = customize_active(base_header, "bao-gia.html")  # Báo giá closest match
    new_content = content[:old_nav_start] + custom_header + "\n" + content[nav_end:]
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("✅ bao-gia-nhom.html: old navbar replaced with header-v2")
else:
    # Fallback: find <body class="..."> and insert after it
    body_match = re.search(r'<body[^>]*>', content)
    if body_match:
        insert_pos = body_match.end()
        custom_header = customize_active(base_header, "bao-gia.html")
        new_content = content[:insert_pos] + "\n" + custom_header + "\n" + content[insert_pos:]
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("✅ bao-gia-nhom.html: header-v2 prepended after <body>")
    else:
        print("❌ bao-gia-nhom.html: FAILED — could not find insertion point")

# ─────────────────────────────────────────────────────────────────
# FIX 2: du-an-nhom.html — remove orphan <nav class="navbar"> block
# ─────────────────────────────────────────────────────────────────
filepath = os.path.join(BASE_DIR, "du-an-nhom.html")
with open(filepath, "r", encoding="utf-8", errors="replace") as f:
    content = f.read()

# The orphan navbar is: <!-- NAV: injected from index.html by script -->
# followed by <nav class="navbar" ...>...</nav>
orphan_comment = '<!-- NAV: injected from index.html by script -->'
comment_pos = content.find(orphan_comment)
if comment_pos != -1:
    # Find the closing </nav> of the orphan block
    orphan_nav_end = content.find('</nav>', comment_pos)
    if orphan_nav_end != -1:
        # Remove the entire orphan block from comment to end of </nav>
        orphan_end = orphan_nav_end + 6  # len('</nav>')
        new_content = content[:comment_pos] + content[orphan_end:]
        # Also strip any extra blank lines created
        new_content = re.sub(r'\n{3,}', '\n\n', new_content)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("✅ du-an-nhom.html: orphan <nav class='navbar'> block removed")
    else:
        print("⚠️  du-an-nhom.html: orphan comment found but no closing </nav>")
else:
    print("✓  du-an-nhom.html: no orphan nav comment found (already clean)")

# ─────────────────────────────────────────────────────────────────
# VERIFY: Quick check on nhom-xingfa.html and phu-kien.html
# ─────────────────────────────────────────────────────────────────
for check_page in ["nhom-xingfa.html", "phu-kien.html", "phu-kien-cmech.html", "thu-vien-profile-nhom.html"]:
    fpath = os.path.join(BASE_DIR, check_page)
    with open(fpath, "r", encoding="utf-8", errors="replace") as f:
        c = f.read()
    has_header_v2  = '<header class="header-v2"' in c
    has_nav_inner  = '<div class="nav-inner">' in c
    has_logo       = 'class="nav-logo"' in c
    has_hotline    = 'class="nav-hotline"' in c
    has_hamburger  = 'class="nav-hamburger"' in c
    orphan_nav     = bool(re.search(r'<body[^>]*>\s*<nav class="nav-menu"', c))
    print(f"\n  [{check_page}]")
    print(f"    header-v2: {has_header_v2} | nav-inner: {has_nav_inner} | logo: {has_logo}")
    print(f"    hotline: {has_hotline} | hamburger: {has_hamburger} | orphan-nav: {orphan_nav}")

print("\nPatch complete.")
