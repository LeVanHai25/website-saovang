import openpyxl

def dump_sheets_info():
    path = "d:/Sao Vàng/Website-SaoVang/CKSV/bảng duyển dụng/CKSV THANG BẢNG LƯƠNG & FOM TUYỂN DỤNG.xlsx"
    wb = openpyxl.load_workbook(path, read_only=True)
    
    with open("d:/Sao Vàng/Website-SaoVang/scripts/recruitment_sheets_info.txt", "w", encoding="utf-8") as f:
        f.write(f"Sheet names: {wb.sheetnames}\n")
        
    print("Done")

if __name__ == "__main__":
    dump_sheets_info()
