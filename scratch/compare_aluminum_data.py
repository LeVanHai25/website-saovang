import os
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# The target output report path
report_path = r"d:\Sao Vàng\Website-SaoVang\scratch\aluminum_comparison_report.md"

# 1. Analyze Dai Phuc Aluminum categories and files
# From menu analysis we know they cover:
# - Cửa nhôm Xingfa
# - Cửa nhôm hệ Slim
# - Cửa nhôm Slim Cover
# - Cửa nhôm thủy lực
# - Cửa nhôm Maxpro.JP
# - Cửa nhôm Kogen
# - Cửa nhôm PMA
# - Cửa nhôm Xingfa Class A
# - Cửa nhôm tấm tổ ong
# - Cửa nhôm Yongxing
# - Cửa nhôm Owin
# - Cửa nhôm Topal
# - Cửa nhôm Kenwin

# Let's count products from crawled data
# Let's read all parsed files to classify
steps_dir = r"C:\Users\Admin\.gemini\antigravity\brain\1fa78ea5-e878-400b-b754-b19d66fc5aa5\.system_generated\steps"
daiphuc_aluminum = {}

for root, dirs, files in os.walk(steps_dir):
    for f in files:
        if f == "content.md":
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8", errors="replace") as file:
                lines = file.readlines()
            
            source_url = ""
            for line in lines[:10]:
                if line.startswith("Source:"):
                    source_url = line.split("Source:", 1)[1].strip()
                    break
            
            if not source_url or "san-pham" not in source_url:
                continue
                
            content_str = "".join(lines)
            
            # Find products in this page
            matches = re.finditer(r'<a\s+href="(san-pham/[^"]+)"\s+title="([^"]+)"', content_str)
            for m in matches:
                url = "https://nhomkinhdaiphuc.com/" + m.group(1)
                name = m.group(2).strip()
                
                # classify brand
                brand = "Khác"
                if "xingfa" in url.lower() or "xingfa" in name.lower():
                    brand = "Xingfa"
                elif "maxpro" in url.lower() or "maxpro" in name.lower():
                    brand = "Maxpro.JP"
                elif "slim" in url.lower() or "slim" in name.lower():
                    brand = "Slim"
                elif "kogen" in url.lower() or "kogen" in name.lower():
                    brand = "Kogen"
                elif "pma" in url.lower() or "pma" in name.lower():
                    brand = "PMA"
                elif "owin" in url.lower() or "owin" in name.lower():
                    brand = "Owin"
                elif "topal" in url.lower() or "topal" in name.lower():
                    brand = "Topal"
                elif "kenwin" in url.lower() or "kenwin" in name.lower():
                    brand = "Kenwin"
                elif "yongxing" in url.lower() or "yongxing" in name.lower():
                    brand = "Yongxing"
                elif "to-ong" in url.lower() or "tổ ong" in name.lower():
                    brand = "Tấm Tổ Ong"
                elif "thuy-luc" in url.lower() or "thủy lực" in name.lower():
                    brand = "Thủy Lực"
                
                if brand not in daiphuc_aluminum:
                    daiphuc_aluminum[brand] = []
                if name not in [p["name"] for p in daiphuc_aluminum[brand]]:
                    daiphuc_aluminum[brand].append({"name": name, "url": url})

# Write the analysis report
with open(report_path, "w", encoding="utf-8") as f:
    f.write("# BÁO CÁO SO SÁNH TRANG NHÔM KÍNH: SAO VÀNG VS ĐẠI PHÚC\n\n")
    f.write("> [!NOTE]\n")
    f.write("> Báo cáo so sánh chi tiết danh mục, sản phẩm, và cấu trúc kỹ thuật giữa Nhôm Kính Sao Vàng và đối thủ Nhôm Kính Đại Phúc.\n\n")
    
    f.write("## 1. Cấu trúc danh mục hệ nhôm\n\n")
    f.write("| Hệ Nhôm | Trực quan trên web Đại Phúc | Sao Vàng (`nhom-sao-vang.html`) | Thư viện Profile Sao Vàng |\n")
    f.write("|---|---|---|---|\n")
    
    brands_comparison = [
        ("Xingfa Quảng Đông", "Có (Danh mục con & bài viết)", "Có (Mục so sánh & Giá)", "Có (Đầy đủ mặt cắt)"),
        ("Xingfa Class A", "Có (Dòng cao cấp anode)", "Không", "Không"),
        ("Maxpro.JP (Nhật)", "Có (Danh mục con & bài viết)", "Có (Mục so sánh & Giá)", "Có (Đầy đủ mặt cắt)"),
        ("Civro (Đức)", "Có (Catalogue)", "Có (Mục so sánh & Giá)", "Không"),
        ("Kogen (Đức)", "Có (Danh mục con & bài viết)", "Không", "Không"),
        ("Slim System", "Có (Danh mục con & bài viết)", "Có (Mục so sánh & Giá)", "Có (Đầy đủ mặt cắt)"),
        ("PMA System", "Có (Danh mục con & bài viết)", "Có (Mục so sánh & Giá)", "Không"),
        ("Owin", "Có (Bài viết giới thiệu)", "Có (Giá tham khảo)", "Có (Đầy đủ mặt cắt)"),
        ("Yongxing", "Có (Bài viết)", "Không", "Không"),
        ("Kenwin", "Có (Bài viết)", "Không", "Không"),
        ("Topal (Austdoor)", "Có (Bài viết)", "Có (Giá tham khảo)", "Không"),
        ("Cửa Thủy Lực", "Có (Bài viết)", "Không", "Không"),
        ("Nhôm Tấm Tổ Ong", "Có (Mới cập nhật)", "Không", "Không"),
    ]
    for row in brands_comparison:
        f.write(f"| {row[0]} | {row[1]} | {row[2]} | {row[3]} |\n")
    f.write("\n\n")
    
    f.write("## 2. Chi tiết sản phẩm thu thập được từ Đại Phúc\n\n")
    for brand, items in sorted(daiphuc_aluminum.items()):
        f.write(f"### Nhóm: {brand} ({len(items)} sản phẩm)\n")
        f.write("| Tên sản phẩm | Link tham khảo đối thủ |\n")
        f.write("|---|---|\n")
        for item in items[:8]: # Show top 8 for readability
            f.write(f"| {item['name']} | [{item['url']}]({item['url']}) |\n")
        if len(items) > 8:
            f.write(f"| ... và {len(items) - 8} sản phẩm khác | |\n")
        f.write("\n")
        
    f.write("## 3. Khoảng trống nội dung chính (Gaps Analysis)\n\n")
    f.write("### A. Điểm thiếu hụt nghiêm trọng của Sao Vàng:\n")
    f.write("1. **Thiếu bài viết & sản phẩm của các hệ nhôm mới**: Trang `nhom-sao-vang.html` hiện tại của chúng ta chỉ là 1 trang Landing Page tổng hợp dài, không có các trang con chuyên biệt cho từng hãng nhôm (như cách chúng ta làm với trang Phụ Kiện). Đối thủ Đại Phúc xây dựng các trang chuyên biệt cho **Xingfa, Slim, Maxpro, Kogen, PMA** để kéo traffic từ khóa ngách cực kỳ mạnh.\n")
    f.write("2. **Thư viện Profile Nhôm thiếu hụt**: Trang `thu-vien-profile-nhom.html` của chúng ta hiện chỉ có 4 hãng nhôm cơ bản (Xingfa, Maxpro, Owin, Slim) nhưng lại thiếu hoàn toàn bản vẽ mặt cắt AutoCAD và profile của **Civro, PMA, Kogen, Topal**.\n")
    f.write("3. **Thiếu các giải pháp hiện đại**: Không có thông tin về **Cửa nhôm Thuỷ lực cánh kính bản lớn** và **Cửa nhôm tấm tổ ong (VOTA)** - vốn là hai dòng sản phẩm đang là xu thế thiết kế nội thất hiện đại tại Việt Nam.\n\n")
    
    f.write("### B. Đề xuất chiến lược nâng cấp trang nhôm của Sao Vàng:\n")
    f.write("- **Phương án 1**: Tách trang `nhom-sao-vang.html` thành mô hình Dashboard tương tự Phụ Kiện. Tạo các trang con: `nhom-xingfa.html`, `nhom-maxpro.html`, `nhom-civro.html`, `nhom-slim.html`, `nhom-kogen.html`, `nhom-pma.html`.\n")
    f.write("- **Phương án 2**: Bổ sung tài liệu mặt cắt CAD & PDF bản vẽ của Civro, PMA, Kogen vào thư viện profile nhôm để tăng điểm uy tín đối với giới thầu thợ thiết kế kiến trúc.\n")

print("Aluminum comparison report written successfully.")
