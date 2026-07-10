"""
GIAI ĐOẠN 1D — Image CLS Audit & Fix
SAO VÀNG Digital Ecosystem

Mục đích:
- Quét tất cả HTML tìm <img> tag thiếu width/height
- Báo cáo CLS risk (Cumulative Layout Shift)
- Mode --apply sẽ thêm placeholder dimensions để ngăn CLS

DRY RUN:  python img_cls_audit.py
APPLY:    python img_cls_audit.py --apply
"""

import os, re, sys, codecs

WEBSITE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "website"))

# Regex: match <img> tags — capture all attributes
IMG_TAG_RE = re.compile(r'(<img\b[^>]*>)', re.IGNORECASE)
HAS_WIDTH  = re.compile(r'\bwidth\s*=', re.IGNORECASE)
HAS_HEIGHT = re.compile(r'\bheight\s*=', re.IGNORECASE)

# Known image dimensions lookup (to add real dims where possible)
KNOWN_SIZES = {
    "logo-sv-main.svg":      (160, 60),
    "logo-sv-white.svg":     (160, 60),
    "logo-sv-dark.svg":      (160, 60),
    "hero-bg.jpg":           (1920, 1080),
    "hero-bg.webp":          (1920, 1080),
    "og-image.jpg":          (1200, 630),
}

def get_known_size(src_attr):
    """Return (w,h) tuple if we know the real size, else None"""
    if not src_attr:
        return None
    filename = os.path.basename(src_attr.split("?")[0])
    return KNOWN_SIZES.get(filename)

def fix_img_tag(tag_html):
    """Add width/height to an img tag if missing"""
    src_match = re.search(r'\bsrc\s*=\s*["\']([^"\']*)["\']', tag_html, re.IGNORECASE)
    src_val = src_match.group(1) if src_match else ""

    missing_w = not HAS_WIDTH.search(tag_html)
    missing_h = not HAS_HEIGHT.search(tag_html)

    if not (missing_w or missing_h):
        return tag_html, False   # Nothing to fix

    known = get_known_size(src_val)
    w, h = known if known else (800, 600)   # sensible fallback

    # Insert before the closing >
    insert = ""
    if missing_w:
        insert += f' width="{w}"'
    if missing_h:
        insert += f' height="{h}"'

    fixed = tag_html.rstrip(">").rstrip("/").rstrip() + insert + ">"
    return fixed, True

def process_file(file_path, apply=False):
    with codecs.open(file_path, "r", "utf-8") as f:
        content = f.read()

    tags_found     = IMG_TAG_RE.findall(content)
    tags_to_fix    = [t for t in tags_found if not HAS_WIDTH.search(t) or not HAS_HEIGHT.search(t)]

    if not tags_to_fix:
        return 0

    if apply:
        new_content = content
        fixes = 0
        for tag in tags_to_fix:
            fixed, changed = fix_img_tag(tag)
            if changed:
                new_content = new_content.replace(tag, fixed, 1)
                fixes += 1
        with codecs.open(file_path, "w", "utf-8") as f:
            f.write(new_content)
        return fixes

    return len(tags_to_fix)

def run(apply_changes=False):
    mode = "APPLY MODE" if apply_changes else "DRY RUN MODE"
    print(f"Image CLS Audit — {mode}")
    print(f"Scanning: {WEBSITE_DIR}\n")

    total_files = 0
    affected_files = 0
    total_issues = 0

    for fname in sorted(os.listdir(WEBSITE_DIR)):
        if not fname.endswith(".html"):
            continue
        fpath = os.path.join(WEBSITE_DIR, fname)
        safe = fname.encode("ascii", "replace").decode("ascii")
        count = process_file(fpath, apply=apply_changes)
        if count:
            action = f"FIXED {count}" if apply_changes else f"{count} img tags missing width/height"
            print(f"  [{safe:45s}] {action}")
            affected_files += 1
            total_issues += count
        total_files += 1

    print(f"\nSummary: {total_issues} img tags in {affected_files}/{total_files} files need CLS fix.")
    if not apply_changes:
        print("Run with --apply to add missing width/height attributes.")

if __name__ == "__main__":
    apply = "--apply" in sys.argv
    run(apply)
