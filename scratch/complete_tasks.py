# -*- coding: utf-8 -*-
import os

task_path = r"C:\Users\Admin\.gemini\antigravity\brain\5a84d0ab-58a2-4873-b63f-009ddcae0916\task.md"

task_content = """# Checklist Công việc: Tái cấu trúc Thư viện Nhôm Sao Vàng

- [x] **Giai đoạn 1: Khởi tạo cấu trúc thư mục & Di chuyển tài liệu gốc**
  - [x] Tạo thư mục gốc `THƯ VIỆN HỆ NHÔM SAO VÀNG` và các thư mục con (CAD, Profile, Hardware, Manuals...)
  - [x] Sao chép toàn bộ tài liệu hãng cũ (Viralwindow, Maxpro JP, Yangli, Topal, Owin, Civro, EuroVN, PAG, Soco, Slim) vào `08_Catalogues by Manufacturer` làm tài liệu gốc
- [x] **Giai đoạn 2: Xây dựng cơ sở dữ liệu gốc (02_Master Database.xlsx)**
  - [x] Thiết lập cấu trúc cơ sở dữ liệu (ID, Nhóm, Hệ, Hãng, Profile, CAD, PDF, Link)
  - [x] Tích hợp thông tin chi tiết của hơn 80 hệ cửa nhôm từ 10 hãng lớn
  - [x] Áp dụng bộ lọc AutoFilter và định dạng màu sắc dòng kẻ chuyên nghiệp
- [x] **Giai đoạn 3: Biên soạn Master Technical Handbook (01_Master Technical Handbook.docx)**
  - [x] Thiết lập bìa, mục lục tự động và định dạng trang lề 1 inch
  - [x] Biên soạn Volume 01 đến Volume 13 với nội dung chuyên sâu
  - [x] Tích hợp mẫu thiết kế hệ nhôm tiêu chuẩn cho các phân hệ cốt lõi (Cửa lùa, Slim, Cầu cách nhiệt, Thủy lực)
  - [x] Xây dựng BẢNG SO SÁNH trực quan chéo giữa các hãng dạng ma trận tích chọn (✓ / ✗)
  - [x] Viết phần hướng dẫn Tra cứu nhanh theo công trình (Biệt thự, nhà phố, cao tầng) và Bảng phân loại
- [x] **Giai đoạn 4: Kiểm chứng & Hoàn thiện báo cáo**
  - [x] Chạy kiểm thử tự động toàn bộ kịch bản sinh dữ liệu
  - [x] Kiểm tra thủ công định dạng tệp Word/Excel đầu ra
  - [x] Cập nhật tệp walkthrough.md và báo cáo kết quả chi tiết
"""

with open(task_path, "w", encoding="utf-8") as f:
    f.write(task_content)

print("task.md successfully updated!")
