# -*- coding: utf-8 -*-
import os
import re
import sys
import urllib.request
import json
import codecs
import unicodedata

sys.stdout.reconfigure(encoding='utf-8')

# Paths
MD_PATH = r"C:\Users\Admin\.gemini\antigravity\brain\a782702f-b9cb-4f92-b130-7fa46bf72693\profile_nhom_daiphuc.md"
IMAGES_DIR = r"d:\Sao Vàng\Website-SaoVang\website\assets\images\profiles"
JSON_DEST_1 = r"d:\Sao Vàng\Website-SaoVang\data\profiles.json"
JSON_DEST_2 = r"d:\Sao Vàng\Website-SaoVang\website\data\profiles.json"

# Ensure directories exist
os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(os.path.dirname(JSON_DEST_2), exist_ok=True)

def slugify(text):
    text = text.lower()
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^a-z0-9\- ]', '', text)
    text = text.replace(' ', '-')
    return re.sub(r'-+', '-', text).strip('-')

def parse_and_download():
    if not os.path.exists(MD_PATH):
        print(f"Error: {MD_PATH} not found.")
        return

    with codecs.open(MD_PATH, 'r', 'utf-8') as f:
        content = f.read()

    # Split content by profile sections
    # Profiles start with ### <a name="profile-X"></a>X. Title
    sections = re.split(r'### <a name="profile-\d+"></a>', content)
    
    profiles = []
    
    # The first section is metadata / table of contents, skip it
    for idx, sec in enumerate(sections[1:], start=1):
        sec = sec.strip()
        if not sec:
            continue

        # Extract title (first line)
        lines = sec.split('\n')
        title_line = lines[0].strip()
        # Title format: "X. Title Description" or just "Title"
        title = re.sub(r'^\d+\.\s*', '', title_line)
        slug = slugify(title)

        print(f"\n[{idx}/33] Processing: {title} (slug: {slug})")

        # Extract source URL
        url_match = re.search(r'-\s*\*\*URL nguồn:\*\*\s*\[Xem trên Dai Phuc\]\(([^)]+)\)', sec)
        source_url = url_match.group(1) if url_match else ""

        # Extract brand
        brand_match = re.search(r'-\s*\*\*Thương hiệu:\*\*\s*(.+)', sec)
        brand = brand_match.group(1).strip() if brand_match else "SV ALUMINIUM"

        # Specifications section
        specs = []
        spec_sec_match = re.search(r'#### Thông số kỹ thuật\n(.*?)(?=\n####|\n---|$)', sec, re.DOTALL)
        if spec_sec_match:
            spec_lines = spec_sec_match.group(1).strip().split('\n')
            specs = [l.strip('- ').strip() for l in spec_lines if l.strip()]

        # Applications section
        apps = []
        app_sec_match = re.search(r'#### Ứng dụng thực tế\n(.*?)(?=\n####|\n---|$)', sec, re.DOTALL)
        if app_sec_match:
            app_lines = app_sec_match.group(1).strip().split('\n')
            apps = [l.strip('- ').strip() for l in app_lines if l.strip()]

        # Drawings section (Table parse)
        drawings = []
        draw_sec_match = re.search(r'#### Danh sách mặt cắt thanh nhôm.*?\n\|.*?\n\|.*?\n(.*?)(?=\n---|\n####|$)', sec, re.DOTALL)
        if draw_sec_match:
            rows = draw_sec_match.group(1).strip().split('\n')
            for r_idx, row in enumerate(rows):
                row = row.strip()
                if not row or not row.startswith('|'):
                    continue
                # Split row cols
                cols = [c.strip() for c in row.split('|')][1:-1]
                if len(cols) < 4:
                    continue

                code = cols[0].replace('**', '').strip()
                name = cols[1].strip()
                weight = cols[2].strip()
                
                # Image URL from markdown syntax `![alt](url)`
                img_match = re.search(r'!\[.*?\]\(([^)]+)\)', cols[3])
                remote_img_url = img_match.group(1) if img_match else ""

                local_img_path = ""
                if remote_img_url:
                    # Determine file extension and name
                    ext = os.path.splitext(remote_img_url)[1]
                    if not ext or len(ext) > 5:
                        ext = ".png"
                    
                    # Clean filename
                    safe_code = re.sub(r'[^a-zA-Z0-9_\-]', '', code)
                    img_filename = f"{slug}_{safe_code}{ext}"
                    local_dest_path = os.path.join(IMAGES_DIR, slug, img_filename)
                    os.makedirs(os.path.dirname(local_dest_path), exist_ok=True)

                    # Download with basic User-Agent to avoid blocker
                    try:
                        req = urllib.request.Request(
                            remote_img_url, 
                            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
                        )
                        with urllib.request.urlopen(req, timeout=10) as response, open(local_dest_path, 'wb') as out_file:
                            out_file.write(response.read())
                        local_img_path = f"assets/images/profiles/{slug}/{img_filename}"
                        print(f"  - Downloaded drawing {code} -> {img_filename}")
                    except Exception as e:
                        print(f"  - [FAIL] Download drawing {code} from {remote_img_url}: {e}")
                        # Fallback to remote url
                        local_img_path = remote_img_url
                
                drawings.append({
                    "code": code,
                    "name": name,
                    "weight": weight,
                    "imageUrl": local_img_path
                })

        profiles.append({
            "id": slug,
            "title": title,
            "brandName": "SV ALUMINIUM" if brand.lower() in ["xingfa", "maxpro.jp", "slim", "alugood", "cover"] else brand,
            "origin": brand,
            "sourceUrl": source_url,
            "specifications": specs,
            "applications": apps,
            "drawings": drawings
        })

    # Save to JSON destinations
    with codecs.open(JSON_DEST_1, 'w', 'utf-8') as f:
        json.dump(profiles, f, ensure_ascii=False, indent=2)
    print(f"\nSaved SSoT JSON database to: {JSON_DEST_1}")

    with codecs.open(JSON_DEST_2, 'w', 'utf-8') as f:
        json.dump(profiles, f, ensure_ascii=False, indent=2)
    print(f"Saved duplicate static JSON database to: {JSON_DEST_2}")

if __name__ == "__main__":
    parse_and_download()
