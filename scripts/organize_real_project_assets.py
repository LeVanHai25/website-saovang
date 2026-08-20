import os
import sys
import shutil
import json

sys.stdout.reconfigure(encoding='utf-8')

src_base = r"d:\Sao Vàng\Website-SaoVang\website\assets\images\projects_drive"
dest_base = r"d:\Sao Vàng\Website-SaoVang\website\assets\images\projects"
os.makedirs(dest_base, exist_ok=True)

mapping = {
    "AN VƯỢNG VILLA": "villa-an-vuong",
    "Biệt thự ĐÔ THÀNH VILLA": "villa-do-thanh",
    "LINH HUỆ VILLA": "villa-linh-hue",
    "THANH HÓA": "villa-thanh-hoa",
    "Du thuyền Azura": "yacht-azura",
    "Du thuyền Calista": "yacht-calista",
    "du thuyền leona cruise": "yacht-leona",
    "Du thuyền Tulip Cruise": "yacht-tulip"
}

project_records = []

for src_folder, slug in mapping.items():
    src_dir = os.path.join(src_base, src_folder)
    target_dir = os.path.join(dest_base, slug)
    os.makedirs(target_dir, exist_ok=True)
    
    if not os.path.exists(src_dir):
        print(f"Folder not found: {src_dir}")
        continue
        
    all_files = [f for f in os.listdir(src_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    print(f"Processing {src_folder}: {len(all_files)} images -> {slug}")
    
    saved_paths = []
    for idx, fname in enumerate(all_files, 1):
        ext = os.path.splitext(fname)[1].lower()
        if idx == 1:
            dest_name = f"hero{ext}"
        else:
            dest_name = f"detail-{idx-1:02d}{ext}"
            
        src_path = os.path.join(src_dir, fname)
        dest_path = os.path.join(target_dir, dest_name)
        shutil.copy2(src_path, dest_path)
        rel_path = f"assets/images/projects/{slug}/{dest_name}"
        saved_paths.append(rel_path)
        
    project_records.append({
        "slug": slug,
        "src_folder": src_folder,
        "images": saved_paths
    })

print(f"\nSuccessfully organized {len(project_records)} real project folders with standardized paths!")
