import os
import sys
import requests
import json
import re

sys.stdout.reconfigure(encoding='utf-8')
output_base = r"d:\Sao Vàng\Website-SaoVang\website\assets\images\projects_drive"

# Let's inspect the drive folder page or download using gdown directly for each folder ID if possible
# Or parse folder IDs from the main folder HTML content
with open(r"C:\Users\Admin\.gemini\antigravity\brain\469e81bf-d2ad-40a7-9a19-a51cc47a8854\.system_generated\steps\172\content.md", "r", encoding="utf-8") as f:
    html = f.read()

# Find folder names and IDs in Google Drive HTML
pattern = r'\["([^"]+)",\["([^"]+)"\],"[^"]*",null,"application/vnd\.google-apps\.folder"'
matches = re.findall(pattern, html)
print(f"Found {len(matches)} folder matches via regex 1:")
for m in matches:
    print(m)

# Alternative regex for drive folders
matches2 = re.findall(r'\["([a-zA-Z0-9_-]{25,})",\s*\["([^"]+)"\]', html)
print(f"Found {len(matches2)} matches via regex 2:")
for m in matches2:
    print(m)
