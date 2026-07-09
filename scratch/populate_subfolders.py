# -*- coding: utf-8 -*-
"""
THƯ VIỆN HỆ NHÔM SAO VÀNG
Script điền nội dung chi tiết cho các thư mục con trống
Phiên bản 3.0
"""
import os, sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

BASE  = r"d:\Sao Vàng\Website-SaoVang\BaoCao_ThuVien_CuaNhom"
ROOT  = os.path.join(BASE, "THƯ VIỆN HỆ NHÔM SAO VÀNG")

# ─────────────────────────────────────────────
# MẪU NỘI DUNG CHI TIẾT CHO CÁC TỆP TIN
# ─────────────────────────────────────────────

# 1. Hướng dẫn CAD
CAD_INSTRUCTION = """QUY CHUẨN VẼ CAD HỆ CỬA NHÔM SAO VÀNG GROUP
=================================================
1. HỆ LAYER TIÊU CHUẨN:
   - NET_THAY: Biên dạng nhôm chính (Màu 7 - Trắng/Đen, nét liền, nét 0.25mm)
   - NET_KHUAT: Bộ phận khuất, tường bê tông (Màu 8 - Xám, nét đứt, nét 0.13mm)
   - NET_KIEU: Đường tim kính, kính đơn/hộp (Màu 4 - Cyan, nét liền mảnh, nét 0.15mm)
   - DIM_TEXT: Kích thước và chú thích (Màu 2 - Vàng, nét liền mảnh, nét 0.15mm)
   - NET_GIOANG: Gioăng cao su và keo (Màu 1 - Đỏ, nét liền, nét 0.18mm)

2. QUY CHUẨN HATCH NÉT KÍNH:
   - Kính cường lực đơn: Hatch mẫu ANSI31, góc 45 độ, khoảng cách (scale) 10.
   - Kính hộp (Double Glazing): Vẽ 2 lớp kính đơn song song, ở giữa hatch mẫu AR-SAND (scale 0.5) mô phỏng hạt hút ẩm khí trơ.

3. KÝ HIỆU BẢN VẼ:
   - Mặt cắt đứng: Đánh dấu kí hiệu A-A (Cắt ngang qua cánh và khung bao trên/dưới).
   - Mặt cắt ngang: Đánh dấu kí hiệu B-B (Cắt ngang qua cánh và hai bên khung bao đứng).
   - Chiều mở cửa: Đường nét đứt hình tam giác chỉ về phía bản lề mở quay.
"""

# 2. Bản vẽ DXF mẫu đơn giản (Văn bản thuần túy định dạng DXF tối thiểu)
DXF_TEMPLATE = """0
SECTION
2
HEADER
9
$ACADVER
1
AC1015
0
ENDSEC
0
SECTION
2
TABLES
0
ENDSEC
0
SECTION
2
BLOCKS
0
ENDSEC
0
SECTION
2
ENTITIES
0
LINE
8
NET_THAY
10
0.0
20
0.0
30
0.0
11
100.0
21
0.0
31
0.0
0
LINE
8
NET_THAY
10
100.0
20
0.0
30
0.0
11
100.0
21
200.0
31
0.0
0
LINE
8
NET_THAY
10
100.0
20
200.0
30
0.0
11
0.0
21
200.0
31
0.0
0
LINE
8
NET_THAY
10
0.0
20
200.0
30
0.0
11
0.0
21
0.0
31
0.0
0
ENDSEC
0
EOF
"""

# 3. Quy chuẩn Profile Nhôm
PROFILE_GUIDE = """HƯỚNG DẪN ĐỌC VÀ KHẢO SÁT THANH PROFILE NHÔM
=================================================
1. PHÂN TÍCH MẶT CẮT KỸ THUẬT:
   - Bề rộng khung bao (Frame Depth): Xác định độ rộng tường cần thi công (Ví dụ: Hệ 55 rộng 55mm, Hệ 65 rộng 65mm).
   - Chiều dày vách nhôm (Wall Thickness): 
     * Hệ cửa sổ quay: 1.4mm - 1.6mm.
     * Hệ cửa đi quay: 1.8mm - 2.0mm.
     * Hệ chịu tải trọng gió bão / sảnh lớn: 2.2mm - 3.0mm.
   - Rãnh lắp phụ kiện (Hardware Groove): 
     * Rãnh C Châu Âu (C-slot 15/20mm): Tương thích CMECH, Roto, Siegenia.
     * Rãnh 22mm: Dùng cho phụ kiện phổ thông Kinlong.

2. CÁC KHOANG KỸ THUẬT:
   - Khoang chứa dải Polyamide cách nhiệt (Thermal Break): Ngăn truyền nhiệt.
   - Khoang thoát nước mưa: Có đột lỗ thoát nước một chiều kèm nắp che.
   - Khoang chứa ke góc (Corner Joint): Chứa ke ép góc nhôm đúc đúc sẵn + bơm keo epoxy định hình.
"""

# 4. Quy chuẩn Phụ kiện
HARDWARE_GUIDE = """TIÊU CHUẨN PHỐI HỢP PHỤ KIỆN VỚI HỆ CỬA NHÔM
=================================================
1. BẢN LỀ CỬA ĐI:
   - Bản lề 3D CMECH (Đoạt chuẩn EU): Khả năng chịu lực 120kg/cánh, chỉnh hướng 3D.
   - Bản lề thủy lực DICTATOR / Dorma: Dành cho cửa thủy lực bản rộng.
   - Bản lề xếp lùa OPK / Roto: Cho cửa đi trượt gấp đa cánh.

2. HỆ KHÓA ĐA ĐIỂM (MULTI-POINT LOCK):
   - Phân tán lực khóa trên 3-5 điểm dọc khung bao giúp ép gioăng cao su tối đa, cách âm vượt trội.
   - Tay nắm đồng bộ: Hoppe (Đức) sơn phủ xi mạ mờ, Giesse (Ý).

3. HỆ GIOĂNG CAO SU (SEAL STRIPS):
   - Gioăng EPDM đa khoang chống tia cực tím UV và lão hóa.
   - Gioăng chèn kính: Gioăng trong và ngoài ôm chặt kính hạn chế nước thẩm thấu.
"""

# 5. Hướng dẫn Lắp đặt
INSTALLATION_MANUAL = """QUY TRÌNH THI CÔNG LẮP DỰNG CỬA NHÔM KÍNH SAO VÀNG
===================================================
BƯỚC 1: KHẢO SÁT VÀ ĐO ĐẠC Ô CHỜ:
   - Kiểm tra kích thước ô chờ tường xây tô hoàn thiện (W, H, đường chéo d1, d2).
   - Kiểm tra cốt 0.0 sàn hoàn thiện để tính khe hở chân cửa. Sai số cho phép ±3mm.

BƯỚC 2: LIÊN KẾT KHUNG BAO VÀO TƯỜNG:
   - Định vị khung bao bằng vít nở inox SUS304 M8x80mm. Khoảng cách giữa các vít ≤ 600mm.
   - Đệm chêm nhựa hoặc cao su cứng tại các điểm bắt vít để cố định hình dạng nhôm.

BƯỚC 3: LẮP CÁNH CỬA VÀ KÍNH CƯỜNG LỰC:
   - Lắp bản lề và cánh vào khung bao.
   - Đặt kính chèn đệm nêm nhựa cứng xung quanh cạnh kính để nâng đỡ và phân bổ trọng lượng.

BƯỚC 4: BƠM KEO BỌT POLYURETHANE (PU):
   - Bơm keo bọt nở lấp đầy khe hở giữa khung nhôm và tường xây tô.
   - Chờ keo khô 60 phút, cắt bỏ phần thừa phẳng với mặt nhôm.

BƯỚC 5: BƠM KEO SILICON CHỐNG THẤM NGOÀI TRỜI:
   - Sử dụng keo silicon trung tính Dow Corning 791 hoặc Apollo A500.
   - Đường keo rộng 8-12mm căng phẳng mịn góc 45 độ đảm bảo nước mưa thoát nhanh.

BƯỚC 6: CĂN CHỈNH VÀ CHẠY THỬ PHỤ KIỆN:
   - Căn chỉnh bản lề 3D, thanh chuyển động khóa đa điểm.
   - Thử nghiệm đóng mở tối thiểu 10 lần đảm bảo êm ái, gioăng ép đều toàn viền.

BƯỚC 7: VỆ SINH VÀ BÀN GIAO:
   - Bóc màng PE bảo vệ nhôm, làm sạch kính và nhôm bằng dung dịch lau chuyên dụng.
   - Bàn giao chìa khóa và biên bản nghiệm thu kỹ thuật.
"""

# 6. Hướng dẫn Gia công
FABRICATION_MANUAL = """QUY TRÌNH GIA CÔNG SẢN XUẤT CỬA NHÔM TẠI XƯỞNG
===================================================
1. CẮT NHÔM:
   - Máy cắt 2 đầu CNC đạt độ chính xác chiều dài ±0.5mm, góc cắt 45 hoặc 90 độ hoàn chỉnh.
   - Sử dụng dầu làm mát bôi trơn lưỡi cắt hợp kim chuyên dụng.

2. ĐỘT DẬP VÀ KHOÉT KHÓA:
   - Khoét lỗ tay nắm, lỗ khóa, lỗ thoát nước mưa bằng máy phay CNC hoặc đột dập thủy lực.
   - Đảm bảo biên dạng lỗ khoét khớp hoàn toàn với thông số hãng phụ kiện.

3. LIÊN KẾT GÓC (ÉP GÓC THỦY LỰC):
   - Sử dụng ke góc nhôm đúc đúc sẵn kết hợp ke ma thuật tăng cứng.
   - Bơm keo ép góc PU (Polyurethane) chuyên dụng chịu nhiệt vào khoang nhôm trước khi ép.
   - Ép góc bằng máy ép góc thủy lực kỹ thuật số lực ép ≥ 50kN.

4. LUỒN GIOĂNG CAO SU:
   - Luồn gioăng EPDM đa khoang vào khe nhôm. Tại các góc cua, cắt chéo gioăng 45 độ và nhỏ keo 502/keo dán gioăng đặc chủng liên kết kín.

5. LẮP PHỤ KIỆN VÀ HOÀN THIỆN BAN ĐẦU:
   - Lắp sẵn bản lề, khóa, thanh truyền động theo bản vẽ thiết kế.
   - Quấn màng bảo vệ chống trầy xước bề mặt nhôm trước khi đóng gói xuất xưởng.
"""

# 7. Danh mục Tài liệu các hãng
MANUFACTURER_DOCS = """DANH MỤC THAM CHIẾU TÀI LIỆU GỐC CỦA CÁC HÃNG
===================================================
Thư mục này dùng để lưu trữ các file tài liệu gốc từ nhà sản xuất:
1. Viralwindow (Việt Nam) - Catalogue & Hướng dẫn gia công hệ VRE, VRA
2. Civro (Đức) - Catalogue kỹ thuật AW, AD, CSD, Lift Slide, MED coating
3. Maxpro JP (Nhật Bản) - Catalogue hệ R, SD, SFD bền màu 40 năm
4. Soco (Ý) - Catalogue hệ lùa 3 ray Soco 180, hệ Slim Soco
5. PAG (Việt Nam) - Catalogue nhôm cầu cách nhiệt và Seamless Welded hàn góc CNC
6. Owin (Việt Nam) - Catalogue cửa thủy lực Owin, cửa trượt quay Owin
7. Topal (Austdoor) - Catalogue hệ Prima, Slima rãnh C Châu Âu
8. EuroVN (QueenViet) - Catalogue hệ Gold, VIP vát cạnh 3D
9. Yangli (Trung Quốc) - Catalogue hệ vát cạnh rãnh C tiết kiệm
10. Xingfa (Trung Quốc) - Catalogue hệ mở quay 55, hệ lùa 93/95
11. YKK AP (Nhật Bản) - Catalogue hệ YKK WS55, lùa SL90 chuẩn JIS
12. Schüco (Đức) - Tài liệu hướng dẫn kỹ thuật AWS, ADS, ASS cao cấp
13. Reynaers (Bỉ) - Tài liệu hệ CS60, CS77, CP155 cao cấp
"""

# 8. Hồ sơ dự án mẫu
PROJECT_SAMPLE = """HỒ SƠ THIẾT KẾ CỬA NHÔM BIỆT THỰ VINHOMES RIVERSIDE
===================================================
- Chủ đầu tư: Ông Nguyễn Văn A
- Địa chỉ: Biệt thự mẫu Hoa Phượng, Vinhomes Riverside, Long Biên, Hà Nội.
- Giải pháp đề xuất từ R&D Sao Vàng:
  * Cửa đi chính đại sảnh: Hệ cửa thủy lực Owin HL180 mạ vàng titan sang trọng.
  * Cửa sổ xung quanh: Hệ cửa sổ quay vào/ra Civro AW65 kết hợp cầu cách nhiệt Technoform, xi mạ mờ MED độc quyền màu ghi ánh kim.
  * Lối ra sân vườn hồ bơi: Cửa lùa trượt nâng PAG 125 có cầu cách nhiệt kép, kính hộp Low-E 28mm cách âm tuyệt đối.
  * Hệ vách kính giếng trời: Mái kính Skylight Soco Fix vách nhôm kính Low-E màu Champagne.
- Tổng khối lượng thi công: 350 m2 cửa nhôm kính các loại.
"""

# 9. Danh sách Video ảnh sản phẩm
MEDIA_LIST = """DANH MỤC VIDEO HƯỚNG DẪN KỸ THUẬT VÀ LẮP ĐẶT (MEDIA)
===================================================
1. VIDEO HƯỚNG DẪN LẮP ĐẶT (INTERNAL):
   - [Video-01] Quy trình lắp đặt cửa trượt quay Owin ngoài công trình (Thời lượng 15:30)
   - [Video-02] Hướng dẫn căn chỉnh ray giảm chấn cửa Slim nội thất liên động (Thời lượng 10:45)
   - [Video-03] Thao tác ép góc CNC hệ nhôm cầu cách nhiệt PAG Seamless (Thời lượng 08:20)
   - [Video-04] Hướng dẫn nêm đệm kính chống sệ cánh cho cửa đi chính AD65 Civro (Thời lượng 12:15)

2. HÌNH ẢNH MẶT CẮT THỰC TẾ:
   - [Image-01] Mặt cắt chi tiết thanh profile VRE65 có cầu cách nhiệt.png
   - [Image-02] Hình ảnh thực tế bề mặt MED xi mạ của Civro màu mờ.jpg
   - [Image-03] Cơ cấu góc ép và rãnh phụ kiện rãnh C Châu Âu thực tế.jpg
"""

# ─────────────────────────────────────────────
# GHI FILE VÀO THƯ MỤC THỰC TẾ
# ─────────────────────────────────────────────

def write_txt_file(relative_path, content):
    full_path = os.path.join(ROOT, relative_path)
    # Ensure dir exists
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  [+] Created text file: {relative_path}")

def run_population():
    print("=" * 60)
    print("POPULATING EMPTY FOLDERS WITH SPECIFIC DETAILS...")
    print("=" * 60)

    # 1. 05_Thư viện CAD/Cửa đi
    write_txt_file(r"05_Thư viện CAD\Cửa đi\huong_dan_cad.txt", CAD_INSTRUCTION)
    write_txt_file(r"05_Thư viện CAD\Cửa đi\Ban_ve_mau_Cua_di.dxf", DXF_TEMPLATE)

    # 2. 05_Thư viện CAD/Cửa sổ
    write_txt_file(r"05_Thư viện CAD\Cửa sổ\huong_dan_cad.txt", CAD_INSTRUCTION)
    write_txt_file(r"05_Thư viện CAD\Cửa sổ\Ban_ve_mau_Cua_so.dxf", DXF_TEMPLATE)

    # 3. 05_Thư viện CAD/Cửa lùa
    write_txt_file(r"05_Thư viện CAD\Cửa lùa\huong_dan_cad.txt", CAD_INSTRUCTION)
    write_txt_file(r"05_Thư viện CAD\Cửa lùa\Ban_ve_mau_Cua_lua.dxf", DXF_TEMPLATE)

    # 4. 05_Thư viện CAD/Cửa Slim
    write_txt_file(r"05_Thư viện CAD\Cửa Slim\huong_dan_cad.txt", CAD_INSTRUCTION)
    write_txt_file(r"05_Thư viện CAD\Cửa Slim\Ban_ve_mau_Cua_Slim.dxf", DXF_TEMPLATE)

    # 5. 05_Thư viện CAD/Vách mặt dựng
    write_txt_file(r"05_Thư viện CAD\Vách mặt dựng\huong_dan_cad.txt", CAD_INSTRUCTION)
    write_txt_file(r"05_Thư viện CAD\Vách mặt dựng\Ban_ve_mau_Vach_mat_dung.dxf", DXF_TEMPLATE)

    # 6. 05_Thư viện CAD/Lan can & Mái kính
    write_txt_file(r"05_Thư viện CAD\Lan can & Mái kính\huong_dan_cad.txt", CAD_INSTRUCTION)

    # 7. 06_Thư viện Profile Nhôm
    write_txt_file(r"06_Thư viện Profile Nhôm\Quy_chuan_Profile_Nhom.txt", PROFILE_GUIDE)
    write_txt_file(r"06_Thư viện Profile Nhôm\Profile_Khung_Bao_He_65.dxf", DXF_TEMPLATE)
    write_txt_file(r"06_Thư viện Profile Nhôm\Profile_Canh_He_65.dxf", DXF_TEMPLATE)

    # 8. 07_Thư viện Phụ kiện
    write_txt_file(r"07_Thư viện Phụ kiện\Quy_chuan_Phu_kien.txt", HARDWARE_GUIDE)
    write_txt_file(r"07_Thư viện Phụ kiện\Ban_le_3D_Cmech.dxf", DXF_TEMPLATE)
    write_txt_file(r"07_Thư viện Phụ kiện\Khoa_Da_Diem_Hopo.dxf", DXF_TEMPLATE)

    # 9. 08_Hướng dẫn Lắp đặt
    write_txt_file(r"08_Hướng dẫn Lắp đặt\Quy_trinh_Lap_dat_Cong_truong.txt", INSTALLATION_MANUAL)

    # 10. 09_Hướng dẫn Gia công
    write_txt_file(r"09_Hướng dẫn Gia công\Quy_trinh_Gia_cong_Tai_xuong.txt", FABRICATION_MANUAL)

    # 11. 10_Catalogue theo Hãng
    write_txt_file(r"10_Catalogue theo Hãng\Danh_sach_tai_lieu_cac_hang.txt", MANUFACTURER_DOCS)

    # 12. 11_Hồ sơ Dự án Tham khảo
    write_txt_file(r"11_Hồ sơ Dự án Tham khảo\Ho_so_du_an_biet_thu_mau.txt", PROJECT_SAMPLE)

    # 13. 12_Hình ảnh & Video
    write_txt_file(r"12_Hình ảnh & Video\Danh_sach_video_anh_san_pham.txt", MEDIA_LIST)

    print()
    print("=" * 60)
    print("ALL SUBFOLDERS HAVE BEEN POPULATED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_population()
