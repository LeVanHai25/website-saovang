# -*- coding: utf-8 -*-

file_path = r"C:\Users\Admin\.gemini\antigravity\brain\5a84d0ab-58a2-4873-b63f-009ddcae0916\.system_generated\steps\262\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Let's search for "bao gồm các hệ sản phẩm nhôm sau" in the raw text
pos = text.find("bao gồm các hệ sản phẩm nhôm sau")
if pos != -1:
    print(f"Found keyword at index {pos}")
    # Print the next 2500 characters of raw HTML to see what follows
    snippet = text[pos:pos+5000]
    output_file = r"d:\Sao Vàng\Website-SaoVang\scratch\maxpro_raw_snippet.txt"
    with open(output_file, "w", encoding="utf-8") as out:
        out.write(snippet)
    print(f"Saved raw HTML snippet to {output_file}")
else:
    print("Keyword not found.")
