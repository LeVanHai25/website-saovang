import openpyxl

def dump_raw_tasks():
    path = "d:/Sao Vàng/Website-SaoVang/CKSV/3, CKSV, Nhiệm vụ Tổng đội thi công - 10.9.24.xlsx"
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb["Sheet1"]
    
    lines = []
    # Column A contains the task descriptions, Column B has another part or they are aligned differently.
    # Let's inspect rows 7 to 35, columns A, B, C, D
    for r in range(7, 36):
        row_vals = [str(ws.cell(r, c).value or '') for c in range(1, 10)]
        lines.append(f"Row {r:02d}: {row_vals}")
        
    with open("d:/Sao Vàng/Website-SaoVang/scripts/raw_tasks_dump.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print("Done")

if __name__ == "__main__":
    dump_raw_tasks()
