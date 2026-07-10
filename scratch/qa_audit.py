import os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"

TARGET_PAGES = [
    # Nhôm
    "nhom-sao-vang.html", "nhom-xingfa.html", "nhom-maxpro.html",
    "nhom-civro.html", "nhom-slim.html", "nhom-kogen.html",
    "nhom-pma.html", "nhom-owin.html", "nhom-topal.html",
    # Phụ kiện
    "phu-kien.html", "phu-kien-cmech.html", "phu-kien-bogo.html",
    "phu-kien-draho.html", "phu-kien-papo.html", "phu-kien-opk.html",
    "phu-kien-sigico.html", "phu-kien-kinlong.html", "phu-kien-janus.html",
    "phu-kien-huy-hoang.html", "phu-kien-hafele.html", "phu-kien-3h.html",
    # Thư viện
    "thu-vien-profile-nhom.html",
]

ALL_PAGES_IN_SITE = set(f for f in os.listdir(BASE_DIR) if f.endswith(".html"))

issues = {}

def check_page(page):
    filepath = os.path.join(BASE_DIR, page)
    page_issues = []

    if not os.path.exists(filepath):
        return [f"FILE MISSING: {page}"]

    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    # 1. Check title
    if not re.search(r'<title>[^<]+</title>', content, re.I):
        page_issues.append("❌ Missing <title> tag")

    # 2. Check meta description
    if not re.search(r'<meta\s+name=["\']description["\']', content, re.I):
        page_issues.append("❌ Missing meta description")

    # 3. Check canonical
    if not re.search(r'<link\s+rel=["\']canonical["\']', content, re.I):
        page_issues.append("⚠️  Missing canonical link")

    # 4. Check h1
    h1_count = len(re.findall(r'<h1[\s>]', content, re.I))
    if h1_count == 0:
        page_issues.append("❌ No <h1> tag found")
    elif h1_count > 1:
        page_issues.append(f"⚠️  Multiple <h1> tags ({h1_count} found)")

    # 5. Check internal href links (local .html files only, skip absolute URLs)
    local_links = re.findall(r'href=["\'](?!https?://)([^"\'#?]+\.html)["\']', content)
    broken = []
    for link in local_links:
        # Strip leading ./
        link_clean = link.lstrip("./")
        if link_clean not in ALL_PAGES_IN_SITE:
            broken.append(link)
    if broken:
        unique_broken = list(set(broken))[:5]
        page_issues.append(f"❌ Broken internal links ({len(set(broken))}): {', '.join(unique_broken)}")

    # 6. Check charset
    if not re.search(r'<meta\s+charset', content, re.I):
        page_issues.append("❌ Missing charset meta")

    # 7. Check viewport
    if not re.search(r'<meta\s+name=["\']viewport["\']', content, re.I):
        page_issues.append("⚠️  Missing viewport meta")

    # 8. File size warning
    size_kb = os.path.getsize(filepath) / 1024
    if size_kb > 500:
        page_issues.append(f"⚠️  Large file size: {size_kb:.0f} KB (consider lazy loading)")

    return page_issues

total_issues = 0
all_ok = []

print("=" * 68)
print("  QA AUDIT REPORT — Nhôm Kính Sao Vàng")
print("=" * 68)

for page in TARGET_PAGES:
    result = check_page(page)
    if result:
        issues[page] = result
        total_issues += len(result)
        print(f"\n📄 {page}")
        for iss in result:
            print(f"   {iss}")
    else:
        all_ok.append(page)

print("\n" + "=" * 68)
print(f"  ✅ PASSED ({len(all_ok)} pages): " + ", ".join(all_ok[:5]) + ("..." if len(all_ok) > 5 else ""))
print(f"  ⚠️  TOTAL ISSUES: {total_issues} across {len(issues)} pages")
print("=" * 68)
