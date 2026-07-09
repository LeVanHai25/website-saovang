# -*- coding: utf-8 -*-
import os

wt_path = r"C:\Users\Admin\.gemini\antigravity\brain\5a84d0ab-58a2-4873-b63f-009ddcae0916\walkthrough.md"

if os.path.exists(wt_path):
    print("Reading walkthrough.md to append EuroVN...")
    with open(wt_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    # 1. Update outputs list (we will replace the Civro lines to include EuroVN as well)
    # Let's search for the Civro lines and append EuroVN
    search_str = """   - Word Độc quyền Civro (.docx): [ThuVien_HeCuaNhom_Civro.docx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/ThuVien_HeCuaNhom_Civro.docx)
   - Excel Độc quyền Civro (.xlsx): [Catalogue_HeCuaNhom_Civro.xlsx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/Catalogue_HeCuaNhom_Civro.xlsx)"""
    
    replace_str = """   - Word Độc quyền Civro (.docx): [ThuVien_HeCuaNhom_Civro.docx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/ThuVien_HeCuaNhom_Civro.docx)
   - Excel Độc quyền Civro (.xlsx): [Catalogue_HeCuaNhom_Civro.xlsx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/Catalogue_HeCuaNhom_Civro.xlsx)
   - Word Độc quyền EuroVN (.docx): [ThuVien_HeCuaNhom_EuroVN.docx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/ThuVien_HeCuaNhom_EuroVN.docx)
   - Excel Độc quyền EuroVN (.xlsx): [Catalogue_HeCuaNhom_EuroVN.xlsx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/Catalogue_HeCuaNhom_EuroVN.xlsx)"""
    
    if search_str in content:
        content = content.replace(search_str, replace_str)
        print("Updated output files list section with EuroVN.")
    
    # 2. Update validation section
    # Let's search for "## Kết quả Kiểm chứng" and update it
    pos = content.find("## Kết quả Kiểm chứng")
    if pos != -1:
        header_part = content[:pos]
        new_validation_part = """## Kết quả Kiểm chứng
- **Tài liệu Word (Tổng hợp)**:
  - Lệnh chạy: `python scratch/create_catalogue_docx.py`
  - Kết quả: Hoàn thành thành công. Tệp tin [ThuVien_HeCuaNhom_SaoVang.docx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/ThuVien_HeCuaNhom_SaoVang.docx) đã được xuất thành công.
- **Tài liệu Excel (Catalogue)**:
  - Lệnh chạy: `python scratch/create_catalogue_xlsx.py`
  - Kết quả: Hoàn thành thành công. Tệp tin [ThuVien_HeCuaNhom_SaoVang.xlsx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/ThuVien_HeCuaNhom_SaoVang.xlsx) đã được xuất.
- **Tài liệu Excel (Master Tracker)**:
  - Lệnh chạy: `python scratch/create_master_tracker_xlsx.py`
  - Kết quả: Hoàn thành thành công. Tệp tin [Master_Tracker_HeCuaNhom.xlsx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/Master_Tracker_HeCuaNhom.xlsx) đã được xuất.
- **Tài liệu Độc quyền Viralwindow (Word & Excel)**:
  - Lệnh chạy: `python scratch/create_viralwindow_exclusive.py`
  - Kết quả: Hoàn thành xuất sắc. Sinh ra [ThuVien_HeCuaNhom_Viralwindow.docx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/ThuVien_HeCuaNhom_Viralwindow.docx) và [Catalogue_HeCuaNhom_Viralwindow.xlsx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/Catalogue_HeCuaNhom_Viralwindow.xlsx).
- **Tài liệu Độc quyền Maxpro JP (Word & Excel)**:
  - Lệnh chạy: `python scratch/create_maxpro_exclusive.py`
  - Kết quả: Hoàn thành xuất sắc. Sinh ra [ThuVien_HeCuaNhom_Maxpro.docx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/ThuVien_HeCuaNhom_Maxpro.docx) và [Catalogue_HeCuaNhom_Maxpro.xlsx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/Catalogue_HeCuaNhom_Maxpro.xlsx).
- **Tài liệu Độc quyền Yangli (Word & Excel)**:
  - Lệnh chạy: `python scratch/create_yangli_exclusive.py`
  - Kết quả: Hoàn thành xuất sắc. Sinh ra [ThuVien_HeCuaNhom_Yangli.docx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/ThuVien_HeCuaNhom_Yangli.docx) và [Catalogue_HeCuaNhom_Yangli.xlsx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/Catalogue_HeCuaNhom_Yangli.xlsx).
- **Tài liệu Độc quyền Topal (Word & Excel)**:
  - Lệnh chạy: `python scratch/create_topal_exclusive.py`
  - Kết quả: Hoàn thành xuất sắc. Sinh ra tệp Word [ThuVien_HeCuaNhom_Topal.docx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/ThuVien_HeCuaNhom_Topal.docx) và tệp Excel [Catalogue_HeCuaNhom_Topal.xlsx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/Catalogue_HeCuaNhom_Topal.xlsx).
- **Tài liệu Độc quyền Owin (Word & Excel)**:
  - Lệnh chạy: `python scratch/create_owin_exclusive.py`
  - Kết quả: Hoàn thành xuất sắc. Sinh ra tệp Word [ThuVien_HeCuaNhom_Owin.docx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/ThuVien_HeCuaNhom_Owin.docx) và tệp Excel [Catalogue_HeCuaNhom_Owin.xlsx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/Catalogue_HeCuaNhom_Owin.xlsx).
- **Tài liệu Độc quyền Civro (Word & Excel)**:
  - Lệnh chạy: `python scratch/create_civro_exclusive.py`
  - Kết quả: Hoàn thành xuất sắc. Sinh ra tệp Word [ThuVien_HeCuaNhom_Civro.docx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/ThuVien_HeCuaNhom_Civro.docx) và tệp Excel [Catalogue_HeCuaNhom_Civro.xlsx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/Catalogue_HeCuaNhom_Civro.xlsx).
- **Tài liệu Độc quyền EuroVN / QueenViet (Word & Excel)**:
  - Lệnh chạy: `python scratch/create_queenviet_exclusive.py`
  - Kết quả: Hoàn thành xuất sắc. Sinh ra tệp Word [ThuVien_HeCuaNhom_EuroVN.docx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/ThuVien_HeCuaNhom_EuroVN.docx) mô tả chi tiết các hệ trượt quay mở 100% không ray dưới, hệ thủy lực bản to chỉ gỗ phào nổi, hệ tích hợp chấn song bảo vệ nhôm đúc, và tệp Excel [Catalogue_HeCuaNhom_EuroVN.xlsx](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/BaoCao_ThuVien_CuaNhom/Catalogue_HeCuaNhom_EuroVN.xlsx) phân loại 6 hệ đắc dụng.
"""
        with open(wt_path, "w", encoding="utf-8") as f:
            f.write(header_part + new_validation_part)
        print("Successfully updated walkthrough.md validation section with EuroVN")
    else:
        print("Header not found in walkthrough.md")
else:
    print("walkthrough.md not found.")
