#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script cập nhật menu điều hướng trên tất cả các trang HTML chính.
Hỗ trợ cả 2 dạng nav: có comment và không có comment.
"""

import os, re

BASE = r"d:\Sao Vàng\Website-SaoVang\website"

def make_desktop_nav(active_page):
    pages = [
        ("index.html",              "Trang Chủ"),
        ("co-khi-sao-vang.html",    "Cơ Khí Sao Vàng"),
        ("nhom-sao-vang.html",      "Nhôm Sao Vàng"),
    ]
    links = ""
    for href, label in pages:
        active = ' active' if href == active_page else ''
        links += f'        <a href="{href}" class="nav-menu-link{active}">{label}</a>\n'

    links += """\n        <!-- Dropdown Lĩnh Vực -->
        <div class="nav-dropdown-wrap">
          <a href="linh-vuc-hoat-dong.html" class="nav-menu-link">Lĩnh Vực Hoạt Động</a>
          <div class="nav-dropdown-menu" role="menu">
            <a href="linh-vuc-hoat-dong.html" class="nav-dropdown-item" role="menuitem">Tổng quan</a>
            <a href="linh-vuc-co-khi.html"     class="nav-dropdown-item" role="menuitem">Cơ Khí Sao Vàng</a>
            <a href="linh-vuc-nhom-kinh.html"  class="nav-dropdown-item" role="menuitem">Nhôm Sao Vàng</a>
          </div>
        </div>\n"""

    rest = [
        ("phu-kien.html",              "Phụ Kiện"),
        ("thu-vien-profile-nhom.html", "Profile Nhôm"),
        ("du-an.html",                 "Dự Án Đã Thực Hiện"),
        ("lien-he.html",               "Liên Hệ"),
    ]
    for href, label in rest:
        active = ' active' if href == active_page else ''
        links += f'        <a href="{href}" class="nav-menu-link{active}">{label}</a>\n'

    return f'      <!-- Desktop nav menu (tinh gọn) -->\n      <nav class="nav-menu" id="navMenu" role="navigation" aria-label="Menu chính">\n{links}      </nav>'


def make_mobile_drawer(active_page):
    items = [
        ("index.html",               "Trang Chủ"),
        ("co-khi-sao-vang.html",     "Cơ Khí Sao Vàng"),
        ("nhom-sao-vang.html",       "Nhôm Sao Vàng"),
        ("linh-vuc-hoat-dong.html",  "Lĩnh Vực Hoạt Động"),
        ("phu-kien.html",            "Phụ Kiện"),
        ("thu-vien-profile-nhom.html", "Profile Nhôm"),
        ("du-an.html",               "Dự Án Đã Thực Hiện"),
        ("lien-he.html",             "Liên Hệ"),
    ]
    links = ""
    for href, label in items:
        active = ' active' if href == active_page else ''
        links += f'    <a href="{href}" class="nav-drawer-link{active}">{label}</a>\n'
    links += '    <a href="tel:0869590279" style="margin-top:auto;" class="sv-btn sv-btn-gold">\n      <i class="ri-phone-fill"></i> 0869 590 279\n    </a>\n'
    return f'  <nav class="nav-drawer" id="navDrawer" role="dialog" aria-label="Menu di động">\n{links}  </nav>'


# Pattern 1: có comment <!-- Desktop nav menu -->
DESKTOP_PATTERN_1 = re.compile(
    r'([ \t]*)<!--[^\n]*Desktop nav menu[^\n]*-->\s*'
    r'<nav[^>]*id="navMenu"[^>]*>.*?</nav>',
    re.DOTALL
)

# Pattern 2: không có comment, nav với role navigation (phu-kien style)
DESKTOP_PATTERN_2 = re.compile(
    r'<nav\s+class="nav-menu"\s+role="navigation"[^>]*>.*?</nav>',
    re.DOTALL
)

# Mobile drawer pattern
DRAWER_PATTERN = re.compile(
    r'<nav\s+class="nav-drawer"\s+id="navDrawer"[^>]*>.*?</nav>',
    re.DOTALL
)

FILES = {
    "nhom-sao-vang.html":         "nhom-sao-vang.html",
    "linh-vuc-nhom-kinh.html":    "linh-vuc-nhom-kinh.html",
    "phu-kien.html":              "phu-kien.html",
    "thu-vien-profile-nhom.html": "thu-vien-profile-nhom.html",
    "du-an.html":                 "du-an.html",
    "lien-he.html":               "lien-he.html",
    "linh-vuc-hoat-dong.html":    "linh-vuc-hoat-dong.html",
    "linh-vuc-co-khi.html":       "linh-vuc-co-khi.html",
    "index.html":                 "index.html",
    "co-khi-sao-vang.html":       "co-khi-sao-vang.html",
    "nang-luc.html":              "nang-luc.html",
    "gioi-thieu.html":            "gioi-thieu.html",
}

results = []
for filename, active_page in FILES.items():
    fpath = os.path.join(BASE, filename)
    if not os.path.exists(fpath):
        results.append(f"  SKIP (not found): {filename}")
        continue

    with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    new_desktop = make_desktop_nav(active_page)
    new_drawer  = make_mobile_drawer(active_page)

    # Try pattern 1 first (with comment)
    content_new, n1 = DESKTOP_PATTERN_1.subn(new_desktop, content)
    if n1 == 0:
        # Try pattern 2 (without comment)
        content_new, n1 = DESKTOP_PATTERN_2.subn(new_desktop, content)

    # Replace mobile drawer
    content_new, n2 = DRAWER_PATTERN.subn(new_drawer, content_new)

    if n1 > 0 or n2 > 0:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content_new)
        results.append(f"  OK — desktop:{n1} drawer:{n2} — {filename}")
    else:
        results.append(f"  NO MATCH — {filename}")

print("Nav update results:")
for r in results:
    print(r)
print("\nDone.")
