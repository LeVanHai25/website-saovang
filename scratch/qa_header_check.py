import os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"

TARGET_PAGES = [
    "nhom-sao-vang.html", "nhom-xingfa.html", "nhom-maxpro.html",
    "nhom-civro.html", "nhom-slim.html", "nhom-kogen.html",
    "nhom-pma.html", "nhom-owin.html", "nhom-topal.html",
    "phu-kien.html", "phu-kien-cmech.html", "phu-kien-bogo.html",
    "phu-kien-draho.html", "phu-kien-papo.html", "phu-kien-opk.html",
    "phu-kien-sigico.html", "phu-kien-kinlong.html", "phu-kien-janus.html",
    "phu-kien-huy-hoang.html", "phu-kien-hafele.html", "phu-kien-3h.html",
    "thu-vien-profile-nhom.html", "du-an-nhom.html", "bao-gia-nhom.html"
]

PASS, FAIL = 0, 0
print(f"{'PAGE':<35} {'HDR-V2':^8} {'LOGO':^6} {'HOTLINE':^9} {'HAMBURGER':^11} {'STATUS'}")
print("─" * 85)

for page in TARGET_PAGES:
    fpath = os.path.join(BASE_DIR, page)
    if not os.path.exists(fpath):
        print(f"{'[MISSING] '+page:<35}")
        FAIL += 1
        continue

    with open(fpath, "r", encoding="utf-8", errors="replace") as f:
        c = f.read()

    has_hdr   = '<header class="header-v2"' in c
    has_logo  = 'class="nav-logo"' in c
    has_htln  = 'class="nav-hotline"' in c
    has_hmb   = 'class="nav-hamburger"' in c
    orphan    = bool(re.search(r'<body[^>]*>\s*\n?\s*<nav class="nav-menu"', c))

    all_ok = has_hdr and has_logo and has_htln and has_hmb and not orphan
    status = "✅ PASS" if all_ok else "❌ FAIL"
    if all_ok: PASS += 1
    else: FAIL += 1

    print(f"{page:<35} {'✓' if has_hdr else '✗':^8} {'✓' if has_logo else '✗':^6} {'✓' if has_htln else '✗':^9} {'✓' if has_hmb else '✗':^11} {status}")

print("─" * 85)
print(f"Result: {PASS} PASS / {FAIL} FAIL / {len(TARGET_PAGES)} total")
