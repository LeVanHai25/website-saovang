import os
from docx import Document

folder = r"d:\Sao Vàng\Website-SaoVang\BaoCao_ThuVien_PhuKien\Tổng  hợp phụ kiện cửa nhôm các hãng"
output_path = r"d:\Sao Vàng\Website-SaoVang\scratch\accessory_summary.txt"

files_to_read = [
    "ThuVien_PhuKien_Cmech.docx",
    "ThuVien_PhuKien_Bogo.docx",
    "ThuVien_PhuKien_Draho.docx"
]

with open(output_path, "w", encoding="utf-8") as out:
    for filename in files_to_read:
        path = os.path.join(folder, filename)
        if os.path.exists(path):
            out.write(f"==================== {filename} ====================\n")
            doc = Document(path)
            # Write first 30 paragraphs
            count = 0
            for p in doc.paragraphs:
                if p.text.strip():
                    out.write(p.text + "\n")
                    count += 1
                    if count >= 30:
                        break
            out.write("=============================================\n\n")
        else:
            out.write(f"File not found: {path}\n")

print(f"Content written to {output_path}")
