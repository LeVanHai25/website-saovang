import os
import zipfile
import xml.etree.ElementTree as ET
import codecs

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_PATH = r"C:/Users/Admin/.gemini/antigravity/brain/a782702f-b9cb-4f92-b130-7fa46bf72693/scratch/strategy_docs_summary.txt"

def get_docx_text(path):
    try:
        with zipfile.ZipFile(path) as z:
            xml_content = z.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            paragraphs = []
            for p in root.findall('.//w:p', namespaces):
                texts = []
                for r in p.findall('.//w:r', namespaces):
                    t = r.find('w:t', namespaces)
                    if t is not None and t.text:
                        texts.append(t.text)
                paragraphs.append("".join(texts))
            return "\n".join(paragraphs)
    except Exception as e:
        return f"Error reading {path}: {str(e)}"

def parse_all_docs():
    files_to_parse = [
        "BaoCao_ChienLuoc_HoSoDauThau_SVAluminium.docx",
        "BaoCao_ChienLuoc_TaiDinhVi_NKSV.docx",
        "BaoCao_ChungMinhNguonGoc_SVAluminium.docx",
        "BaoCao_YTuong_NoiDung_Website_SaoVang.docx",
        "Bo_Ho_So_Chien_Luoc_CKSV.docx",
        "Báo cáo nội dung chiến lược lĩnh vực cơ khí.docx",
        "Báo cáo nội dung chiến lược lĩnh vực nhôm kính.docx",
        "Logo/Bao_cao_phuong_an_bao_ho_nhan_hieu.docx",
        "Logo/Danh_muc_thong_tin_dang_ky_MSMV_SaoVang.docx"
    ]

    out_lines = []

    for f_name in files_to_parse:
        f_path = os.path.join(ROOT_DIR, f_name.replace("/", os.sep))
        safe_print_name = f_name.encode('ascii', 'ignore').decode('ascii')
        
        if os.path.exists(f_path):
            print(f"Parsing: {safe_print_name}")
            text = get_docx_text(f_path)
            
            # Extract key sections containing projects or materials
            out_lines.append("="*80)
            out_lines.append(f"DOCUMENT: {f_name}")
            out_lines.append("="*80)
            
            # Simple keyword filtering to extract relevant paragraphs
            keywords = ["dự án", "công trình", "biệt thự", "nhôm", "kính", "vật tư", "thiết bị", "chứng chỉ", "iso", "aws", "asme"]
            paragraphs = text.split("\n")
            matched_count = 0
            
            for p in paragraphs:
                p_lower = p.lower()
                if any(kw in p_lower for kw in keywords):
                    out_lines.append(p.strip())
                    matched_count += 1
            
            print(f"  - Extracted {matched_count} matching paragraphs.")
        else:
            print(f"Skip (Not Found): {safe_print_name}")

    out_dir = os.path.dirname(OUTPUT_PATH)
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    with codecs.open(OUTPUT_PATH, 'w', 'utf-8') as out_f:
        out_f.write("\n".join(out_lines))
    print(f"\nSummary successfully written to: {OUTPUT_PATH}")

if __name__ == "__main__":
    parse_all_docs()
