import zipfile
import xml.etree.ElementTree as ET

def read_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # Namespaces
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            text_runs = []
            for para in root.findall('.//w:p', ns):
                para_text = []
                for run in para.findall('.//w:t', ns):
                    para_text.append(run.text)
                if para_text:
                    text_runs.append("".join(para_text))
            return "\n".join(text_runs)
    except Exception as e:
        return f"Error reading docx: {e}"

if __name__ == "__main__":
    path = "d:/Sao Vàng/Website-SaoVang/Logo/Thông tin công ty CKSV.docx"
    text = read_docx(path)
    with open("d:/Sao Vàng/Website-SaoVang/scripts/company_info_dump.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Done")
