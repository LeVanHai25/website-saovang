# -*- coding: utf-8 -*-
import os
import shutil

# 1. Define paths
base_dir = r"d:\Sao Vàng\Website-SaoVang"
target_dir = os.path.join(base_dir, "BaoCao_ThuVien_CuaNhom")

# 2. Create the target directory if not exists
os.makedirs(target_dir, exist_ok=True)
print(f"Created target folder: {target_dir}")

# 3. List of files to move
files_to_move = [
    "ThuVien_HeCuaNhom_SaoVang.docx",
    "ThuVien_HeCuaNhom_SaoVang.xlsx",
    "Master_Tracker_HeCuaNhom.xlsx",
    "ThuVien_HeCuaNhom_Viralwindow.docx",
    "Catalogue_HeCuaNhom_Viralwindow.xlsx"
]

# Move existing files if possible (if not open in Word/Excel)
for f_name in files_to_move:
    src = os.path.join(base_dir, f_name)
    dst = os.path.join(target_dir, f_name)
    if os.path.exists(src):
        try:
            # Check if destination exists, remove it first
            if os.path.exists(dst):
                os.remove(dst)
            shutil.move(src, dst)
            print(f"[SUCCESS] Moved {f_name} to target folder.")
        except Exception as e:
            print(f"[WARNING] Could not move {f_name}: {e}. (It might be open in another application)")

# 4. Update the generator scripts to save to the new folder
scripts_to_update = {
    r"d:\Sao Vàng\Website-SaoVang\scratch\create_catalogue_docx.py": [
        (r'output_path = r"d:\\Sao Vàng\\Website-SaoVang\\ThuVien_HeCuaNhom_SaoVang.docx"', 
         r'output_path = r"d:\Sao Vàng\Website-SaoVang\BaoCao_ThuVien_CuaNhom\ThuVien_HeCuaNhom_SaoVang.docx"'),
        (r'output_path = r"d:\\\\Sao Vàng\\\\Website-SaoVang\\\\ThuVien_HeCuaNhom_SaoVang.docx"', 
         r'output_path = r"d:\Sao Vàng\Website-SaoVang\BaoCao_ThuVien_CuaNhom\ThuVien_HeCuaNhom_SaoVang.docx"')
    ],
    r"d:\Sao Vàng\Website-SaoVang\scratch\create_catalogue_xlsx.py": [
        (r'output_path = r"d:\\Sao Vàng\\Website-SaoVang\\ThuVien_HeCuaNhom_SaoVang.xlsx"', 
         r'output_path = r"d:\Sao Vàng\Website-SaoVang\BaoCao_ThuVien_CuaNhom\ThuVien_HeCuaNhom_SaoVang.xlsx"')
    ],
    r"d:\Sao Vàng\Website-SaoVang\scratch\create_master_tracker_xlsx.py": [
        (r'output_path = r"d:\\Sao Vàng\\Website-SaoVang\\Master_Tracker_HeCuaNhom.xlsx"', 
         r'output_path = r"d:\Sao Vàng\Website-SaoVang\BaoCao_ThuVien_CuaNhom\Master_Tracker_HeCuaNhom.xlsx"')
    ],
    r"d:\Sao Vàng\Website-SaoVang\scratch\create_viralwindow_exclusive.py": [
        (r'output_path = r"d:\\Sao Vàng\\Website-SaoVang\\ThuVien_HeCuaNhom_Viralwindow.docx"', 
         r'output_path = r"d:\Sao Vàng\Website-SaoVang\BaoCao_ThuVien_CuaNhom\ThuVien_HeCuaNhom_Viralwindow.docx"'),
        (r'output_path = r"d:\\Sao Vàng\\Website-SaoVang\\Catalogue_HeCuaNhom_Viralwindow.xlsx"', 
         r'output_path = r"d:\Sao Vàng\Website-SaoVang\BaoCao_ThuVien_CuaNhom\Catalogue_HeCuaNhom_Viralwindow.xlsx"')
    ]
}

for script_path, replacements in scripts_to_update.items():
    if os.path.exists(script_path):
        with open(script_path, "r", encoding="utf-8") as file:
            content = file.read()
            
        orig_content = content
        for old, new in replacements:
            content = content.replace(old, new)
            # In case backslashes are single or double in the file
            content = content.replace(old.replace(r"\\", "\\"), new)
            
        if content != orig_content:
            # Ensure target folder creation is inside the script as well
            if "import os" in content and "os.makedirs" not in content:
                # Add folder creation helper
                content = content.replace(
                    'output_path = ',
                    'os.makedirs(os.path.dirname(output_path), exist_ok=True)\n    output_path = '
                )
            with open(script_path, "w", encoding="utf-8") as file:
                file.write(content)
            print(f"[SUCCESS] Updated output paths in script: {script_path}")
        else:
            print(f"[INFO] Script output path already updated or pattern not found: {script_path}")

print("Path migration completed.")
