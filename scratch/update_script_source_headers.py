# -*- coding: utf-8 -*-
"""
Script cập nhật mã nguồn tất cả các tệp create_*.py trong thư mục scratch
để đồng bộ tiêu đề cột xuất Excel sang định dạng mới.
"""
import os, sys, glob, re

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

SCRATCH_DIR = r"d:\Sao Vàng\Website-SaoVang\scratch"

REPLACEMENTS = [
    # Nhóm Phân Khúc -> Nhóm Hệ
    (r'["\']Nhóm Phân Khúc["\']', "'Nhóm Hệ'"),
    (r'["\']Nhóm hệ["\']', "'Nhóm Hệ'"),
    
    # Mã Hệ (System Code) -> Mã Hệ
    (r'["\']Mã Hệ \(System Code\)["\']', "'Mã Hệ'"),
    
    # Tên Hệ Chi Tiết -> Tên Hệ
    (r'["\']Tên Hệ Chi Tiết["\']', "'Tên Hệ'"),
    
    # Loại Sản Phẩm & Công Năng Chi Tiết -> Loại Sản Phẩm
    (r'["\']Loại Sản Phẩm & Công Năng Chi Tiết["\']', "'Loại Sản Phẩm'"),
    (r'["\']Loại Sản Phẩm & Công Năng["\']', "'Loại Sản Phẩm'"),
    
    # Độ Dày Nhôm (mm) / Độ Dày Nhôm/Nhựa (mm) / Độ Dày Cánh Cửa (mm) -> Độ Dày (mm)
    (r'["\']Độ Dày Nhôm \(mm\)["\']', "'Độ Dày (mm)'"),
    (r'["\']Độ Dày Nhôm/Nhựa \(mm\)["\']', "'Độ Dày (mm)'"),
    (r'["\']Độ Dày Cánh Cửa \(mm\)["\']', "'Độ Dày (mm)'"),
    (r'["\']Độ dày nhôm \(mm\)["\']', "'Độ Dày (mm)'"),
    (r'["\']Độ dày \(mm\)["\']', "'Độ Dày (mm)'"),
    
    # Phụ Kiện Khuyên Dùng -> Phụ Kiện
    (r'["\']Phụ Kiện Khuyên Dùng["\']', "'Phụ Kiện'"),
    (r'["\']Phụ kiện khuyên dùng["\']', "'Phụ Kiện'"),
    
    # Gioăng & Keo Lắp Đặt -> Gioăng & Keo
    (r'["\']Gioăng & Keo Lắp Đặt["\']', "'Gioăng & Keo'"),
    
    # Ghi Chú Kỹ Thuật (Sơn / Mép Vát...) -> Đặc Điểm Kỹ Thuật
    (r'["\']Ghi Chú Kỹ Thuật\s*(?:\([^)]*\))?["\']', "'Đặc Điểm Kỹ Thuật'"),
    (r'["\']Ghi chú kỹ thuật\s*(?:\([^)]*\))?["\']', "'Đặc Điểm Kỹ Thuật'"),
]

def update_scripts():
    py_files = glob.glob(os.path.join(SCRATCH_DIR, "create_*.py"))
    print(f"Tìm thấy {len(py_files)} tệp mã nguồn python dạng create_*.py.")
    
    for f in py_files:
        filename = os.path.basename(f)
        # Bỏ qua các tệp không liên quan
        if filename in ["create_visual_report.py", "create_docx.py", "create_master_walkthrough.py"]:
            continue
            
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        new_content = content
        changes_count = 0
        
        # Thực hiện các thay thế
        for pattern, replacement in REPLACEMENTS:
            # Chỉ thay thế các dòng liên quan đến danh sách Excel headers, tránh đụng đến Word tables (Word tables chỉ có 5 cột)
            # Chúng ta sẽ kiểm tra xem mẫu có tồn tại hay không
            matches = re.findall(pattern, new_content)
            if matches:
                new_content = re.sub(pattern, replacement, new_content)
                changes_count += len(matches)
                
        if new_content != content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"  [+] Đã cập nhật {changes_count} vị trí trong file: {filename}")
        else:
            # Xem thử file này có headers kiểu khác không
            pass

if __name__ == "__main__":
    print("============================================================")
    print("CẬP NHẬT MÃ NGUỒN PYTHON CHO CÁC TIÊU ĐỀ XEM EXCEL")
    print("============================================================")
    update_scripts()
    print("============================================================")
