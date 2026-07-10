import os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"

# Ảnh hero above-the-fold — KHÔNG thêm lazy, thêm fetchpriority="high"
HERO_IMAGES = {
    "hero-bg.jpg", "hero-bg.png", "hero-interior.png",
    "hero-doors.png", "hero-services.png", "hero-yacht.png",
    "logo-sv-main.svg", "logo-sv-main.png", "logo-sv-aluminium.png",
    "logo-cty.png", "logo-cty-white.png", "logo-nhom.png", "logo-nhom-white.png",
    "banner-nhom.png",
}

# Kích thước chuẩn theo tên file
SIZE_MAP = {
    "hero-interior.png":        (1920, 1080),
    "hero-doors.png":           (1920, 1080),
    "hero-services.png":        (1920, 1080),
    "hero-yacht.png":           (1920, 1080),
    "hero-bg.jpg":              (1920, 1080),
    "hero-bg.png":              (1920, 1080),
    "banner-nhom.png":          (1600, 600),
    "project-villa.png":        (800, 600),
    "project-penthouse.png":    (800, 600),
    "project-vinhomes-villa.png":(800, 600),
    "project-dalat-villa.png":  (800, 600),
    "project-showroom-auto.png":(800, 600),
    "project-mansion-gate.png": (800, 600),
    "project-resort-yacht.png": (800, 600),
    "project-saobien-yacht.png":(800, 600),
    "project-yacht.png":        (800, 600),
    "service-aluminum-doors.png":(800, 600),
    "service-artistic-stairs.png":(800, 600),
    "service-cast-gates.png":   (800, 600),
    "service-glass-facades.png":(800, 600),
    "service-maintenance.png":  (800, 600),
    "service-mechanical-art.png":(800, 600),
    "about-workshop.jpg":       (800, 600),
    "team_engineers.png":       (800, 600),
    "welding_work.png":         (800, 600),
    "workshop_cnc.png":         (800, 600),
    "laser_cutting.png":        (800, 600),
    "product-glass.png":        (600, 450),
    "product-inox-pipe.png":    (600, 450),
    "product-railing.png":      (600, 450),
    "logo-sv-main.png":         (200, 60),
    "logo-sv-main.svg":         (200, 60),
    "logo-sv-aluminium.png":    (200, 60),
}

def get_filename(src):
    return src.split("/")[-1].split("?")[0]

def process_img_tag(match, filepath):
    full_tag = match.group(0)
    src_match = re.search(r'src=["\']([^"\']+)["\']', full_tag)
    if not src_match:
        return full_tag

    src = src_match.group(1)
    fname = get_filename(src)

    is_hero = any(h in fname for h in HERO_IMAGES)

    # Skip SVG icons from remixicon CDN
    if 'cdnjs' in src or 'googleapis' in src or 'gstatic' in src:
        return full_tag

    # Already has loading attribute?
    has_loading = 'loading=' in full_tag
    has_fetchpriority = 'fetchpriority=' in full_tag
    has_decoding = 'decoding=' in full_tag
    has_width = re.search(r'\bwidth=["\']?\d', full_tag)
    has_height = re.search(r'\bheight=["\']?\d', full_tag)

    new_tag = full_tag

    # Add loading
    if not has_loading:
        if is_hero:
            new_tag = new_tag.replace('<img ', '<img loading="eager" ', 1)
        else:
            new_tag = new_tag.replace('<img ', '<img loading="lazy" ', 1)

    # Add fetchpriority for hero
    if is_hero and not has_fetchpriority:
        new_tag = new_tag.replace('<img ', '<img fetchpriority="high" ', 1)

    # Add decoding="async" for non-hero
    if not is_hero and not has_decoding:
        new_tag = new_tag.replace('<img ', '<img decoding="async" ', 1)

    # Add width + height if known and missing
    if fname in SIZE_MAP and not has_width and not has_height:
        w, h = SIZE_MAP[fname]
        new_tag = new_tag.replace('<img ', f'<img width="{w}" height="{h}" ', 1)

    return new_tag

IMG_PATTERN = re.compile(r'<img\b[^>]*>', re.IGNORECASE)

total_modified = 0
total_imgs = 0

html_files = [f for f in os.listdir(BASE_DIR) if f.endswith('.html')]
print(f"Processing {len(html_files)} HTML files...\n")

for fname in sorted(html_files):
    fpath = os.path.join(BASE_DIR, fname)
    with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    img_count = len(IMG_PATTERN.findall(content))
    new_content = IMG_PATTERN.sub(lambda m: process_img_tag(m, fpath), content)

    if new_content != content:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        total_modified += 1
        total_imgs += img_count
        print(f"  ✅ {fname} ({img_count} images updated)")
    else:
        print(f"  ✓  {fname} (no changes needed)")

print(f"\n{'='*60}")
print(f"Done. Modified {total_modified}/{len(html_files)} files, ~{total_imgs} images optimized.")
print(f"Core Web Vitals improvements applied:")
print(f"  - loading='lazy' on all non-hero images")
print(f"  - loading='eager' + fetchpriority='high' on hero images")
print(f"  - decoding='async' on non-hero images")
print(f"  - width/height attributes added where known")
