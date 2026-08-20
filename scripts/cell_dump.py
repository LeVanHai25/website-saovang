import os
import openpyxl

def cell_by_cell_dump():
    base_dir = "d:/Sao Vàng/Website-SaoVang/CKSV"
    filepath = os.path.join(base_dir, "3, CKSV, Nhiệm vụ Tổng đội thi công - 10.9.24.xlsx")
    
    wb = openpyxl.load_workbook(filepath, data_only=True)
    ws = wb["Sheet1"]
    
    output_lines = []
    output_lines.append("CELL BY CELL DUMP OF Sheet1 COLUMNS G TO P:")
    output_lines.append("Row | Col G (STT) | Col H (Nhiệm vụ) | Col I (Kết quả) | Col J (Đáp ứng) | Col K (Nhận xét) | Col L (Bậc) | Col M (Lương lĩnh) | Col N (Tổng lương) | Col P (Phụ cấp)")
    output_lines.append("-" * 120)
    
    for r in range(6, 40):
        vals = []
        for c in ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P']:
            cell_val = ws[f"{c}{r}"].value
            vals.append(str(cell_val).replace('\n', ' ') if cell_val is not None else "")
        output_lines.append(f"Row {r:2d} | " + " | ".join(f"{v:12s}"[:15] for v in vals))
        
    output_path = "d:/Sao Vàng/Website-SaoVang/scripts/cell_dump.txt"
    with open(output_path, "w", encoding="utf-8") as f_out:
        f_out.write("\n".join(output_lines))
    print(f"Dump written to {output_path}")

if __name__ == "__main__":
    cell_by_cell_dump()
