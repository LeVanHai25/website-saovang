import sys
sys.stdout.reconfigure(encoding='utf-8')

DOMAIN = "https://www.cokhi-saovang.vn"
TODAY  = "2026-07-09"

NEW_URLS = [
    # ── 2 trang tools mới (ưu tiên cao) ──
    ("du-an-nhom.html",    "weekly",  "0.90"),
    ("bao-gia-nhom.html",  "weekly",  "0.90"),
    # ── 8 trang nhôm hãng ──
    ("nhom-xingfa.html",   "monthly", "0.85"),
    ("nhom-maxpro.html",   "monthly", "0.85"),
    ("nhom-civro.html",    "monthly", "0.85"),
    ("nhom-slim.html",     "monthly", "0.85"),
    ("nhom-kogen.html",    "monthly", "0.85"),
    ("nhom-pma.html",      "monthly", "0.85"),
    ("nhom-owin.html",     "monthly", "0.85"),
    ("nhom-topal.html",    "monthly", "0.85"),
    # ── 11 trang phụ kiện hãng ──
    ("phu-kien-cmech.html",    "monthly", "0.75"),
    ("phu-kien-bogo.html",     "monthly", "0.75"),
    ("phu-kien-draho.html",    "monthly", "0.75"),
    ("phu-kien-papo.html",     "monthly", "0.75"),
    ("phu-kien-opk.html",      "monthly", "0.75"),
    ("phu-kien-sigico.html",   "monthly", "0.75"),
    ("phu-kien-kinlong.html",  "monthly", "0.75"),
    ("phu-kien-janus.html",    "monthly", "0.75"),
    ("phu-kien-huy-hoang.html","monthly", "0.75"),
    ("phu-kien-hafele.html",   "monthly", "0.75"),
    ("phu-kien-3h.html",       "monthly", "0.75"),
]

SITEMAP_PATH = r"d:\Sao Vàng\Website-SaoVang\website\sitemap.xml"

with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Build new URL entries
new_entries = "\n"
for page, freq, priority in NEW_URLS:
    new_entries += f"""  <!-- {page} -->
  <url>
    <loc>{DOMAIN}/{page}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{priority}</priority>
  </url>\n\n"""

# Insert before </urlset>
if "</urlset>" in content:
    content = content.replace("</urlset>", new_entries + "</urlset>")
    with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Added {len(NEW_URLS)} new URLs to sitemap.xml")
else:
    print("❌ Could not find </urlset> in sitemap.xml")
