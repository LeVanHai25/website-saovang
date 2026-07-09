# -*- coding: utf-8 -*-
import os

files_to_patch = [
    r"d:\Sao Vàng\Website-SaoVang\scratch\create_catalogue_docx.py",
    r"d:\Sao Vàng\Website-SaoVang\scratch\create_catalogue_xlsx.py",
    r"d:\Sao Vàng\Website-SaoVang\scratch\create_master_tracker_xlsx.py"
]

replacements = [
    # General terms
    ("PMA, VR, Topal...", "PMA, Viralwindow, Topal..."),
    ("PMA / Topal / VR", "PMA / Topal / Viralwindow"),
    ("VR (Việt Nam)", "Viralwindow (Việt Nam)"),
    
    # Specific codes in docx
    ("VR55", "Viralwindow VRA55"),
    ("VR Thermal Break 65", "Viralwindow VRE65 Cầu cách nhiệt"),
    ("VR Pivot Luxury 70", "Viralwindow VR Slim Pivot"),
    ("VR93", "Viralwindow VRA94 / VRE120"),
    ("VR55 Window", "Viralwindow VRA55"),
    ("VR Slim", "Viralwindow VR Slim"),
    
    # Specific rows in xlsx
    ("VR55 Series", "VRA55 / VRE65 Series"),
    ("MC-VR55-01", "MC-VRA55-01"),
    
    # Specific items in master tracker
    ("Xingfa, PMA, VR, Topal", "Xingfa, PMA, Viralwindow, Topal"),
    ("XF55, PMA55, VR55", "XF55, PMA55, VRA55"),
    ("XF55, Platinum, VR55", "XF55, Platinum, VRE55"),
    ("Schüco, Reynaers, Cortizo, VR", "Schüco, Reynaers, Cortizo, Viralwindow"),
    ("ADS 75.SI, ML8-HI, VR65-TB", "ADS 75.SI, ML8-HI, VRE65-TB"),
    ("Xingfa, PMA, VR", "Xingfa, PMA, Viralwindow"),
    ("Cortizo, Reynaers, VR", "Cortizo, Reynaers, Viralwindow"),
    ("Pivot XXL, ML Pivot, VR Pivot", "Pivot XXL, ML Pivot, VR Pivot"),
    ("XF93, PMA93, VR93, Topal XF", "XF93, PMA93, VRA94, Topal XF"),
    ("Alugood, QueenViet, VR, PMA", "Alugood, QueenViet, Viralwindow, PMA"),
    ("PMA, VR, QueenViet", "PMA, Viralwindow, QueenViet"),
    ("PMA, VR, Bogo, Sigico", "PMA, Viralwindow, Bogo, Sigico"),
]

for f in files_to_patch:
    if os.path.exists(f):
        print(f"Patching: {f}")
        with open(f, "r", encoding="utf-8") as file:
            content = file.read()
        
        orig_content = content
        for old, new in replacements:
            content = content.replace(old, new)
            
        if content != orig_content:
            with open(f, "w", encoding="utf-8") as file:
                file.write(content)
            print(f"[SUCCESS] Patched: {f}")
        else:
            print(f"[INFO] No changes needed for: {f}")
    else:
        print(f"[ERROR] File not found: {f}")
print("Finished patching all files.")
