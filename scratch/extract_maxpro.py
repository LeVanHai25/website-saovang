# -*- coding: utf-8 -*-
import re

file_path = r"C:\Users\Admin\.gemini\antigravity\brain\5a84d0ab-58a2-4873-b63f-009ddcae0916\.system_generated\steps\262\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Remove HTML tags to see plain text
def clean_html(raw_html):
    # simple clean
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, ' ', raw_html)
    # replace multiple spaces/newlines
    cleantext = re.sub(r'\s+', ' ', cleantext)
    return cleantext

plain_text = clean_html(text)

# Let's write a file with cleaner sections of the webpage
# Let's search for some sentences or headings in the cleaned text
words = plain_text.split()
# Join them with space, but let's do a regex search for the main body
# In nhomkinhdaiphuc.com, the main content is usually inside a div with class "content" or "detail" or similar.
# Let's search the HTML directly for main paragraphs using a simple regex:
paragraphs = re.findall(r'<p.*?>(.*?)</p>', text, re.DOTALL)
clean_paras = []
for p in paragraphs:
    p_clean = re.sub(r'<.*?>', '', p).strip()
    if p_clean and len(p_clean) > 20:
        clean_paras.append(p_clean)

# Let's write all cleaned paragraphs to a file
output_file = r"d:\Sao Vàng\Website-SaoVang\scratch\maxpro_paragraphs.txt"
with open(output_file, "w", encoding="utf-8") as out:
    out.write(f"Source: https://nhomkinhdaiphuc.com/catalogue/catalogue-nhom-maxpro-jp-nam-2023-day-du-cac-he-nhom-27.html\n\n")
    out.write("=== PARAGRAPHS ===\n")
    for idx, p in enumerate(clean_paras):
        out.write(f"{idx+1}: {p}\n\n")

print(f"Extracted {len(clean_paras)} paragraphs to {output_file}")
