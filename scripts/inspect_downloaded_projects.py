import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"d:\Sao Vàng\Website-SaoVang\website\assets\images\projects_drive"

for root, dirs, files in os.walk(base_dir):
    print(f"Folder: {os.path.basename(root)} - {len(files)} files")
    for f in files[:5]:
        print(f"  - {f}")
