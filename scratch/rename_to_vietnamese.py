# -*- coding: utf-8 -*-
import os
import shutil

base_dir = r"d:\Sao Vàng\Website-SaoVang\BaoCao_ThuVien_CuaNhom"
master_dir = os.path.join(base_dir, "THƯ VIỆN HỆ NHÔM SAO VÀNG")

# 1. First remove the old master directory to prevent mixing old and new naming structures
if os.path.exists(master_dir):
    print("Removing old master folder...")
    shutil.rmtree(master_dir)

# 2. Re-create the folder structure with Vietnamese names
subfolders = [
    "03_Thư viện CAD/Cửa đi",
    "03_Thư viện CAD/Cửa sổ",
    "03_Thư viện CAD/Cửa lùa",
    "03_Thư viện CAD/Cửa Slim",
    "03_Thư viện CAD/Vách mặt dựng",
    "04_Thư viện Profile Nhôm",
    "05_Thư viện Phụ kiện",
    "06_Hướng dẫn Lắp đặt",
    "07_Hướng dẫn Gia công",
    "08_Catalogue theo Hãng",
    "09_Hồ sơ Dự án Tham khảo",
    "10_Hình ảnh & Video"
]

print("Creating Vietnamese directory structure...")
for sub in subfolders:
    path = os.path.join(master_dir, sub)
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "_huong_dan.txt"), "w", encoding="utf-8") as f:
        f.write(f"Thu muc nay luu tru tai lieu: {sub}\nVui long chen tep lien quan vao day.")

# 3. Copy manufacturer catalogues into the new Vietnamese folder name
print("Migrating previous manufacturer catalogues into '08_Catalogue theo Hang'...")
dest_catalog_dir = os.path.join(master_dir, "08_Catalogue theo Hãng")
for filename in os.listdir(base_dir):
    file_path = os.path.join(base_dir, filename)
    if os.path.isfile(file_path):
        if any(h in filename for h in ["Viralwindow", "Maxpro", "Yangli", "Topal", "Owin", "Civro", "EuroVN", "PAG", "Slim", "Soco"]):
            dest_path = os.path.join(dest_catalog_dir, filename)
            shutil.copy2(file_path, dest_path)

print("Vietnamese directory setup completed successfully!")
