import openpyxl

def check_sheets():
    for fn in ["KeToan_SaoVang_1Bang.xlsx", "Bao_Gia_Sao_Vang_Chuyen_Nghiep.xlsx"]:
        try:
            wb = openpyxl.load_workbook(fn, read_only=True)
            print(f"{fn} sheets: {wb.sheetnames}")
        except Exception as e:
            print(f"Error reading {fn}: {e}")

if __name__ == "__main__":
    check_sheets()
