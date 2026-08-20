import openpyxl

def check_recruitment_sheets():
    lines = []
    for fn in ["CKSV_Form_Tuyen_Dung_Tho_Co_Khi.xlsx", "CKSV_Form_Tuyen_Dung_Tho_Co_Khi_Phan_Bo.xlsx"]:
        try:
            wb = openpyxl.load_workbook(fn, read_only=True)
            lines.append(f"{fn} sheets: {wb.sheetnames}")
        except Exception as e:
            lines.append(f"Error reading {fn}: {repr(e)}")
            
    with open("d:/Sao Vàng/Website-SaoVang/scripts/sheet_check_results.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print("Done")

if __name__ == "__main__":
    check_recruitment_sheets()
