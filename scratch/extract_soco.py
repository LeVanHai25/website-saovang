# -*- coding: utf-8 -*-
import re

file_path = r"C:\Users\Admin\.gemini\antigravity\brain\5a84d0ab-58a2-4873-b63f-009ddcae0916\.system_generated\steps\487\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Extract paragraphs and list items
paragraphs = re.findall(r'<p.*?>(.*?)</p>', text, re.DOTALL)
list_items = re.findall(r'<li.*?>(.*?)</li>', text, re.DOTALL)

clean_paras = []
for p in paragraphs:
    p_clean = re.sub(r'<.*?>', '', p).strip()
    if p_clean and len(p_clean) > 20:
        clean_paras.append(p_clean)

clean_lis = []
for li in list_items:
    li_clean = re.sub(r'<.*?>', '', li).strip()
    if li_clean and len(li_clean) > 10:
        clean_lis.append(li_clean)

# Write to text file
output_file = r"d:\Sao Vàng\Website-SaoVang\scratch\soco_paragraphs.txt"
with open(output_file, "w", encoding="utf-8") as out:
    out.write("Source: https://nhomkinhdaiphuc.com/catalogue/catalogue-nhom-soco-44.html\n\n")
    out.write("=== PARAGRAPHS ===\n")
    for idx, p in enumerate(clean_paras):
        out.write(f"{idx+1}: {p}\n\n")
    out.write("\n=== LIST ITEMS ===\n")
    for idx, li in enumerate(clean_lis):
        out.write(f"{idx+1}: {li}\n\n")

print(f"Extracted {len(clean_paras)} paragraphs and {len(clean_lis)} list items to {output_file}")
