import os
import re

WEBSITE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"
CMS_DIR = r"d:\Sao Vàng\Website-SaoVang\cms"

# 1. Collect all html files with '-' in website/
html_files = [f for f in os.listdir(WEBSITE_DIR) if f.endswith('.html') and '-' in f]

# Build mapping
rename_map = {}
for f in html_files:
    new_f = f.replace('-', '')
    rename_map[f] = new_f

print(f"Found {len(rename_map)} files to rename:")
for old, new in sorted(rename_map.items()):
    print(f"  {old} -> {new}")

# Rename physical files using os.rename
for old, new in rename_map.items():
    old_path = os.path.join(WEBSITE_DIR, old)
    new_path = os.path.join(WEBSITE_DIR, new)
    if os.path.exists(old_path):
        os.rename(old_path, new_path)
        print(f"Renamed {old} to {new}")

# Update all references in all files under website/ and cms/
def update_references_in_dir(directory, extensions):
    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    modified = False
                    for old, new in rename_map.items():
                        if old in content:
                            content = content.replace(old, new)
                            modified = True
                    
                    if modified:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated references in {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

update_references_in_dir(WEBSITE_DIR, ['.html', '.js', '.css', '.json', '.xml', '.txt'])
update_references_in_dir(CMS_DIR, ['.js', '.json'])

print("All renaming and references updated successfully!")
