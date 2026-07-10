import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

filepath = r"d:\Sao Vàng\Website-SaoVang\website\nhom-sao-vang.html"

with open(filepath, "r", encoding="utf-8", errors="replace") as f:
    html = f.read()

# Let's search for brand names or categories mentioned in nhom-sao-vang.html
# e.g., Xingfa, Civro, Maxpro, PMA, Owin, etc.
keywords = ["Xingfa", "Maxpro", "Civro", "PMA", "Owin", "Kogen", "Slim", "Topal", "Yongxing", "Kenwin", "Zhongkai", "Soco", "Hondalex", "JMA"]
print("Mentions of aluminum systems in NKSV nhom-sao-vang.html:")
for kw in keywords:
    count = len(re.findall(kw, html, re.IGNORECASE))
    print(f" - {kw}: {count} times")

# Let's check thu-vien-profile-nhom.html
filepath_lib = r"d:\Sao Vàng\Website-SaoVang\website\thu-vien-profile-nhom.html"
if os.path.exists(filepath_lib):
    with open(filepath_lib, "r", encoding="utf-8", errors="replace") as f:
        html_lib = f.read()
    print("\nMentions of aluminum systems in NKSV thu-vien-profile-nhom.html:")
    for kw in keywords:
        count = len(re.findall(kw, html_lib, re.IGNORECASE))
        print(f" - {kw}: {count} times")
else:
    print("\nthu-vien-profile-nhom.html does not exist.")
