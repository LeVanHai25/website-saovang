# -*- coding: utf-8 -*-
import os
import subprocess
import sys

docx_path = r"d:\Sao Vàng\Website-SaoVang\scratch\create_catalogue_docx.py"
xlsx_path = r"d:\Sao Vàng\Website-SaoVang\scratch\create_catalogue_xlsx.py"
tracker_path = r"d:\Sao Vàng\Website-SaoVang\scratch\create_master_tracker_xlsx.py"

# --- 1. PATCH DOCX GENERATOR ---
if os.path.exists(docx_path):
    print("Modifying create_catalogue_docx.py...")
    with open(docx_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Update table size from rows=6 to rows=7
    content = content.replace("table = doc.add_table(rows=6, cols=5)", "table = doc.add_table(rows=7, cols=5)")
    
    # Update compare_data list
    old_compare = """    compare_data = [
        ("Schüco (Đức)", "Nhập khẩu Đức", "2.0mm - 3.5mm", "Schüco đồng bộ, Roto, CMECH", "Siêu cao cấp (Luxury)"),
        ("Reynaers (Bỉ)", "Nhập khẩu Bỉ", "2.0mm - 3.2mm", "Reynaers đồng bộ, CMECH", "Siêu cao cấp (Luxury)"),
        ("Technal / Cortizo", "Pháp / T.Ban Nha", "1.8mm - 3.0mm", "CMECH, Roto, Hopo", "Cao cấp / Cận cao cấp"),
        ("Xingfa Quảng Đông", "Nhập khẩu Trung Quốc", "1.4mm - 2.0mm", "Kinlong, Cogo, Draho, Hopo", "Trung cấp / Phổ thông"),
        ("PMA / Topal / Viralwindow", "Sản xuất Việt Nam", "1.2mm - 2.0mm", "Draho, Kinlong, Sigico, Bogo", "Phổ thông / Tiết kiệm")
    ]"""
    
    new_compare = """    compare_data = [
        ("Schüco (Đức)", "Nhập khẩu Đức", "2.0mm - 3.5mm", "Schüco đồng bộ, Roto, CMECH", "Siêu cao cấp (Luxury)"),
        ("Reynaers (Bỉ)", "Nhập khẩu Bỉ", "2.0mm - 3.2mm", "Reynaers đồng bộ, CMECH", "Siêu cao cấp (Luxury)"),
        ("Technal / Cortizo", "Pháp / T.Ban Nha", "1.8mm - 3.0mm", "CMECH, Roto, Hopo", "Cao cấp / Cận cao cấp"),
        ("Viralwindow (VN)", "Sản xuất VN (Chuẩn Âu)", "1.4mm - 2.0mm", "Viral đồng bộ, Cmech, Hopo", "Cao cấp / Cận cao cấp"),
        ("Xingfa Quảng Đông", "Nhập khẩu Trung Quốc", "1.4mm - 2.0mm", "Kinlong, Cogo, Draho, Hopo", "Trung cấp / Phổ thông"),
        ("PMA / Topal", "Sản xuất Việt Nam", "1.2mm - 2.0mm", "Draho, Kinlong, Sigico, Bogo", "Phổ thông / Tiết kiệm")
    ]"""
    
    content = content.replace(old_compare, new_compare)
    
    with open(docx_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[SUCCESS] Modified create_catalogue_docx.py")

# --- 2. PATCH XLSX CATALOGUE ---
if os.path.exists(xlsx_path):
    print("Modifying create_catalogue_xlsx.py...")
    with open(xlsx_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    old_xlsx_rows = """        # VR
        ("Viralwindow (Việt Nam)", "VRA55 / VRE65 Series", "Cửa đi/sổ mở quay", "Cửa sổ hất bản lề chữ A góc 45 độ", 
         "Kín nước cao, chống va đập gió bão căn hộ tầm trung, sơn tĩnh điện bảo hành mờ mịn vân cát 10 năm.", 
         "MC-Viralwindow VRA55-01", "https://nhomkinhdaiphuc.com/upload/henhom/vr55.webp", 
         "Phụ kiện Draho, Sigico, Sigico, Bogo", "Phổ thông", "Cạnh nhôm vuông phẳng góc cứng cáp dễ cắt lắp."),

        ("Viralwindow (Việt Nam)", "Viralwindow VR Slim", "Cửa lùa Slim ngoại thất", "Cửa lùa 2 ray Slim kính hộp có gioăng nén", 
         "Vách kính phòng khách biệt thự hiện đại view vườn rộng rãi tối giản, đố giữa mảnh rãnh trượt êm khít.", 
         "MC-VRSLIM-OUT", "https://nhomkinhdaiphuc.com/upload/henhom/vr-slim.webp", 
         "Hệ phụ kiện chốt đa điểm âm Viralwindow VR Slim", "Trung Cấp / Cận cao cấp", "Ray inox chịu tải bánh xe kép chống bụi chèn chặt."),"""
         
    new_xlsx_rows = """        # Viralwindow (Châu Á)
        ("Viralwindow (Việt Nam)", "VRA55 (Châu Á)", "Cửa đi/sổ mở quay", "Cửa đi & Cửa sổ mở quay VRA55", 
         "Cửa đi mở quay, cửa sổ mở quay, sổ mở hất, vách kính cố định (Cánh phẳng khung, kính lõm).", 
         "MC-VRA55-01", "https://nhomkinhdaiphuc.com/upload/henhom/vr55.webp", 
         "Phụ kiện Viral đồng bộ, Cmech, Hopo", "Trung Cấp / Phổ thông", "Hệ cánh phẳng khung thiết kế hiện đại, chống nước mưa và cách âm tốt."),
        
        ("Viralwindow (Việt Nam)", "VRA63 (Châu Á)", "Cửa xếp trượt (Folding)", "Cửa xếp trượt VRA63", 
         "Cửa đi mở xếp trượt góc hoặc xếp gấp phẳng, tối ưu không gian rộng mở.", 
         "MC-VRA63-02", "https://nhomkinhdaiphuc.com/upload/henhom/vr63.webp", 
         "Phụ kiện trượt xếp Viral đồng bộ", "Trung Cấp", "Bánh xe chịu lực trượt trên dưới cực kỳ chắc chắn."),
         
        ("Viralwindow (Việt Nam)", "VRA64 (Châu Á)", "Cửa sổ trượt lùa", "Cửa sổ trượt VRA64", 
         "Cửa sổ mở trượt lùa 2 cánh, 4 cánh, tiết kiệm không gian mở cánh sổ.", 
         "MC-VRA64-03", "https://nhomkinhdaiphuc.com/upload/henhom/vr64.webp", 
         "Bánh xe & khóa sập Viral, Draho", "Trung Cấp / Phổ thông", "Nhôm độ dày 1.2mm - 1.4mm kinh tế và bền bỉ."),
         
        ("Viralwindow (Việt Nam)", "VRA94 / VRA80", "Cửa đi trượt lùa", "Cửa trượt VRA94", 
         "Cửa đi mở trượt lùa 2 ray vận hành êm ái trên hệ ray inox dẫn hướng.", 
         "MC-VRA94-04", "https://nhomkinhdaiphuc.com/upload/henhom/vr94.webp", 
         "Khóa đa điểm & bánh xe Viral, Cogo", "Trung Cấp", "Độ dày nhôm 1.4mm chịu gió rung tốt."),
         
        ("Viralwindow (Việt Nam)", "VRA120 (Châu Á)", "Cửa đi trượt lùa", "Cửa trượt VRA120", 
         "Cửa đi mở trượt lùa 3 ray lồng cánh, mở rộng 2/3 diện tích lối đi.", 
         "MC-VRA120-05", "https://nhomkinhdaiphuc.com/upload/henhom/vra120.webp", 
         "Phụ kiện khóa đa điểm đồng bộ Viral", "Trung Cấp", "Tích hợp ray inox dẫn hướng chống trơn trượt."),
         
        # Viralwindow (Châu Âu)
        ("Viralwindow (Việt Nam)", "VRE55 (Châu Âu)", "Cửa mở quay", "Cửa mở quay tiêu chuẩn VRE55", 
         "Cửa sổ mở quay, mở hất hoặc cửa đi bản nhỏ (thiết kế cánh ôm khung tạo điểm nhấn).", 
         "MC-VRE55-06", "https://nhomkinhdaiphuc.com/upload/henhom/vre55.webp", 
         "Phụ kiện Viral đồng bộ, Cmech", "Cận Cao Cấp", "Kết cấu rãnh C tiêu chuẩn Châu Âu chống xệ cánh tốt."),
         
        ("Viralwindow (Việt Nam)", "VRE65 (Châu Âu)", "Cửa mở quay Premium", "Cửa mở quay Premium VRE65", 
         "Cửa đi mở quay, cửa sổ mở quay lật (Hệ rãnh C tiêu chuẩn Châu Âu, cánh ôm khung tăng độ kín khít).", 
         "MC-VRE65-07", "https://nhomkinhdaiphuc.com/upload/henhom/vre65.webp", 
         "Phụ kiện khóa gạt đa điểm Cmech, Roto", "Cao Cấp", "Cánh ôm khung sang trọng, cách âm tốt nhất phân hệ VRE."),
         
        ("Viralwindow (Việt Nam)", "VRE75 (Châu Âu)", "Cửa xếp gấp", "Cửa xếp gấp VRE75", 
         "Cửa đi mở xếp trượt xếp lùa phân khúc cao cấp cho biệt thự, resort.", 
         "MC-VRE75-08", "https://nhomkinhdaiphuc.com/upload/henhom/vre75.webp", 
         "Phụ kiện xếp trượt đồng bộ Cmech, Roto", "Cao Cấp", "Cơ cấu trục quay xoay cánh trượt trơn chu cách âm cách nhiệt tốt."),
         
        ("Viralwindow (Việt Nam)", "VRE77 (Châu Âu)", "Cửa xếp gấp ẩn bản lề", "Cửa xếp gấp ẩn bản lề VRE77", 
         "Cửa đi xếp trượt Luxury, bản lề được giấu kín hoàn toàn trong khe nhôm tăng thẩm mỹ tối đa.", 
         "MC-VRE77-09", "https://nhomkinhdaiphuc.com/upload/henhom/vre77.webp", 
         "Hệ bản lề ẩn & khóa Cmech Luxury", "Luxury (Siêu cao cấp)", "Thiết kế giấu bản lề độc quyền, chống bụi bẩn và chống cạy phá."),
         
        ("Viralwindow (Việt Nam)", "VRE94 (Châu Âu)", "Cửa sổ trượt lùa", "Cửa sổ trượt VRE94", 
         "Cửa sổ mở trượt lùa bản dày chịu lực gió bão lớn tiêu chuẩn Châu Âu.", 
         "MC-VRE94-10", "https://nhomkinhdaiphuc.com/upload/henhom/vre94.webp", 
         "Khóa sập & Bánh xe chịu lực Cmech", "Cận Cao Cấp", "Sử dụng nhôm định hình bản rộng dầy dặn."),
         
        ("Viralwindow (Việt Nam)", "VRE120 (Châu Âu)", "Cửa trượt nâng (Lift & Slide)", "Cửa trượt nâng Lift & Slide VRE120", 
         "Cửa đi mở trượt lùa 2 ray, có phụ kiện nâng hạ cánh giúp đóng mở siêu nhẹ và nén gioăng kín khí.", 
         "MC-VRE120-11", "https://nhomkinhdaiphuc.com/upload/henhom/vre120ls.webp", 
         "Phụ kiện nâng hạ CMECH, Roto chính hãng", "Cao Cấp", "Khung bao cánh dày 2.0mm chịu lực gió tốt."),
         
        ("Viralwindow (Việt Nam)", "VRE180 (Châu Âu)", "Cửa lùa siêu khổ", "Cửa lùa siêu khổ VRE180", 
         "Cửa đi mở trượt lùa 3 ray tích hợp lưới chống côn trùng bằng inox không gỉ.", 
         "MC-VRE180-12", "https://nhomkinhdaiphuc.com/upload/henhom/vre180.webp", 
         "Khóa đa điểm & lưới inox đồng bộ Viral", "Cao Cấp / Luxury", "Khổ lớn jumbo đón sáng, ngăn muỗi và bảo vệ an toàn."),
         
        # Viralwindow (Chuyên Dụng)
        ("Viralwindow (Việt Nam)", "VR100 (Chuyên Dụng)", "Cửa trượt quay", "Cửa mở trượt quay VR100", 
         "Cửa đi mở trượt kết hợp mở quay (Slide & Turn), không ray dưới sàn tránh vấp ngã và dễ vệ sinh.", 
         "MC-VR100-13", "https://nhomkinhdaiphuc.com/upload/henhom/vr100.webp", 
         "Phụ kiện trượt quay đồng bộ Viral", "Trung Cấp / Cận cao cấp", "Mở rộng 100% diện tích lối đi bằng cách lùa rồi quay cánh."),
         
        ("Viralwindow (Việt Nam)", "VR150 (Chuyên Dụng)", "Cửa thủy lực", "Cửa thủy lực đại sảnh VR150", 
         "Cửa đi bản lề sàn (thủy lực), bản cánh lớn phào nổi nghệ thuật sang trọng cho lâu đài biệt thự.", 
         "MC-VR150-14", "https://nhomkinhdaiphuc.com/upload/henhom/vr150.webp", 
         "Bản lề sàn Adler/Hafele, phụ kiện đồng bộ", "Cận Cao Cấp", "Bản cánh rộng lớn 136mm dày 2.0mm chắc chắn."),
         
        # Viralwindow (Cách Nhiệt)
        ("Viralwindow (Việt Nam)", "VRX75 (Cách Nhiệt)", "Cửa cầu cách nhiệt", "Cửa nhôm cầu cách nhiệt VRX75", 
         "Cửa đi và cửa sổ mở quay đa khoang có cầu Polyamide cách âm cách nhiệt hiệu quả cao.", 
         "MC-VRX75-15", "https://nhomkinhdaiphuc.com/upload/henhom/vrx75.webp", 
         "Phụ kiện khóa đa điểm Cmech rãnh C, Roto", "Cao Cấp", "Dải cách nhiệt polyamide đa khoang kết hợp kính hộp Low-E."),"""
         
    content = content.replace(old_xlsx_rows, new_xlsx_rows)
    
    with open(xlsx_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[SUCCESS] Modified create_catalogue_xlsx.py")

# --- 3. PATCH MASTER TRACKER ---
if os.path.exists(tracker_path):
    print("Modifying create_master_tracker_xlsx.py...")
    with open(tracker_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Replace VR codes with standard Viralwindow ones in the tracker
    # Since VRA and VRE systems are already well mapped, let's keep it simple
    content = content.replace("VR65-TB", "VRX75-TB")
    
    with open(tracker_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[SUCCESS] Modified create_master_tracker_xlsx.py")
