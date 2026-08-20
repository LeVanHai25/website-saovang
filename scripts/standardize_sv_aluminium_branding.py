import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

WEBSITE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"

# Replacements mapping with context preservation
replacements = [
    ("NHÔM SAO VÀNG", "SV ALUMINIUM"),
    ("Nhôm Kính Sao Vàng", "SV Aluminium"),
    ("nhôm kính sao vàng", "SV Aluminium"),
    ("Nhôm Sao Vàng", "SV Aluminium"),
    ("Nhôm sao vàng", "SV Aluminium"),
    ("nhôm sao vàng", "SV Aluminium"),
    ("Nhôm Kính SV Aluminium", "SV Aluminium"),
    ("Nhôm Kính SV ALUMINIUM", "SV ALUMINIUM")
]

modified_count = 0

for root, dirs, files in os.walk(WEBSITE_DIR):
    for f in files:
        if f.endswith(('.html', '.js', '.json')):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()

            new_content = content
            for old_str, new_str in replacements:
                new_content = new_content.replace(old_str, new_str)

            if new_content != content:
                with open(filepath, "w", encoding="utf-8") as file:
                    file.write(new_content)
                modified_count += 1
                rel_path = os.path.relpath(filepath, WEBSITE_DIR)
                print(f"✓ Updated branding in: {rel_path}")

print(f"\n🎉 Successfully standardized 'SV Aluminium' across {modified_count} files!")
