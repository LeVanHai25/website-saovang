import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\Admin\.gemini\antigravity\brain\469e81bf-d2ad-40a7-9a19-a51cc47a8854\.system_generated\steps\172\content.md", "r", encoding="utf-8") as f:
    text = f.read()

keywords = ["Tulip", "leona", "LINH HU", "THANH", "Calista", "Azura", "AN V"]
for kw in keywords:
    pos = 0
    while True:
        idx = text.find(kw, pos)
        if idx == -1:
            break
        print(f"Keyword '{kw}' found at {idx}:")
        snippet = text[max(0, idx-300):min(len(text), idx+300)]
        print(repr(snippet))
        print("="*60)
        pos = idx + len(kw)
        break
