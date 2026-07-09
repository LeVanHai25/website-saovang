# -*- coding: utf-8 -*-
import os

files_to_fix = [
    r"d:\Sao Vàng\Website-SaoVang\scratch\create_catalogue_docx.py",
    r"d:\Sao Vàng\Website-SaoVang\scratch\create_catalogue_xlsx.py",
    r"d:\Sao Vàng\Website-SaoVang\scratch\create_master_tracker_xlsx.py",
    r"d:\Sao Vàng\Website-SaoVang\scratch\create_viralwindow_exclusive.py"
]

for f_path in files_to_fix:
    if os.path.exists(f_path):
        with open(f_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        orig_content = content
        # Swap the two lines using regex or standard replace
        # We can find where 'os.makedirs(os.path.dirname(output_path), exist_ok=True)' is followed by 'output_path = '
        # Since python files use \n or \r\n, we can clean it up.
        
        lines = content.splitlines()
        new_lines = []
        skip = False
        
        for i in range(len(lines)):
            if skip:
                skip = False
                continue
            
            curr_line = lines[i]
            if "os.makedirs(os.path.dirname(output_path), exist_ok=True)" in curr_line and i + 1 < len(lines) and "output_path = " in lines[i + 1]:
                # Swap them
                next_line = lines[i + 1]
                # Indentation of current line
                indent = curr_line[:len(curr_line) - len(curr_line.lstrip())]
                new_lines.append(next_line)
                new_lines.append(indent + "os.makedirs(os.path.dirname(output_path), exist_ok=True)")
                skip = True
            else:
                new_lines.append(curr_line)
                
        content_fixed = "\n".join(new_lines)
        if content_fixed != orig_content:
            with open(f_path, "w", encoding="utf-8") as f:
                f.write(content_fixed)
            print(f"[SUCCESS] Swappedmakedirs in {f_path}")
        else:
            print(f"[INFO] No change needed for {f_path}")
    else:
        print(f"[ERROR] File not found: {f_path}")
