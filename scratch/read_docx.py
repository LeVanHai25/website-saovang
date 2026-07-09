import os
import sys
import subprocess

try:
    import docx
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx"])
    import docx

from docx import Document

files = [
    "BaoCao_DinhHuong_Website_SaoVang.docx",
    "BaoCao_YTuong_NoiDung_Website_SaoVang.docx",
    "BÁO CÁO Ý TƯỞNG THIẾT KẾ WEBSITE.docx"
]

output_path = r"d:\Sao Vàng\Website-SaoVang\scratch\docx_content.txt"
with open(output_path, "w", encoding="utf-8") as out:
    for f in files:
        path = os.path.join(r"d:\Sao Vàng\Website-SaoVang", f)
        if os.path.exists(path):
            out.write(f"\n==================== {f} ====================\n")
            doc = Document(path)
            for p in doc.paragraphs:
                if p.text.strip():
                    out.write(p.text + "\n")
            out.write("=============================================\n\n")
        else:
            out.write(f"File not found: {path}\n")

print(f"Content written to {output_path}")
