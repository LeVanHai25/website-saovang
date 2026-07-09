import os
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load crawled accessories
json_path = r"d:\Sao Vàng\Website-SaoVang\scratch\crawled_accessories.json"
with open(json_path, "r", encoding="utf-8") as f:
    crawled_data = json.load(f)

# Load NKSV products from HTML
nksv_path = r"d:\Sao Vàng\Website-SaoVang\website\phu-kien.html"
with open(nksv_path, "r", encoding="utf-8", errors="replace") as f:
    html_nksv = f.read()

# Parse NKSV products
nksv_prods = re.findall(r'<div class="pk-card-name">(.*?)</div>', html_nksv)
nksv_set = {p.strip().lower() for p in nksv_prods}

# Let's map NKSV category elements to compare per-category
# NKSV has: slim, truot-quay, draho, bogo, kinlong, janus, huy-hoang, cmech, khoa-dt, candy, opk
# Đại Phúc has: slim, truot-quay, papo, opk, draho, bogo, cmech, huy-hoang, kinlong, janus, khoa-dt, candy, sigico, cua-kinh, hafele, ykebr, phu-kien-3h

# Output comparison results
report_path = r"d:\Sao Vàng\Website-SaoVang\scratch\accessory_comparison_report.md"

# We'll normalize names for fuzzy matching
def normalize_name(name):
    # Remove accents, common prefixes
    n = name.lower()
    n = re.sub(r'phụ kiện cửa slim|phụ kiện cửa trượt quay|phụ kiện', '', n)
    n = re.sub(r'[^a-z0-9àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]', '', n)
    return n.strip()

nksv_normalized = {normalize_name(p): p for p in nksv_prods}

gap_data = {}
total_missing = 0
total_matched = 0

for cat, items in crawled_data.items():
    gap_data[cat] = {
        "matched": [],
        "missing": []
    }
    for item in items:
        name = item["name"]
        norm = normalize_name(name)
        
        # Check fuzzy match
        matched_nksv = None
        for n_norm, original in nksv_normalized.items():
            if norm == n_norm or (len(norm) > 4 and norm in n_norm) or (len(n_norm) > 4 and n_norm in norm):
                matched_nksv = original
                break
                
        if matched_nksv:
            gap_data[cat]["matched"].append({"crawled": name, "nksv": matched_nksv})
            total_matched += 1
        else:
            gap_data[cat]["missing"].append(item)
            total_missing += 1

print(f"Comparison summary:")
print(f" - Matched: {total_matched}")
print(f" - Missing: {total_missing}")

with open(report_path, "w", encoding="utf-8") as f:
    f.write("# BÁO CÁO SO SÁNH PHỤ KIỆN: SAO VÀNG VS ĐẠI PHÚC\n\n")
    f.write(f"- **Tổng số sản phẩm phụ kiện Đại Phúc**: {total_matched + total_missing}\n")
    f.write(f"- **Đã có trên web Sao Vàng**: {total_matched} sản phẩm\n")
    f.write(f"- **Còn thiếu (Cần cập nhật)**: {total_missing} sản phẩm\n\n")
    
    f.write("## Danh mục hoàn toàn thiếu trên Sao Vàng (Mới)\n")
    new_cats = ["papo", "sigico", "cua-kinh", "hafele", "ykebr", "phu-kien-3h"]
    for nc in new_cats:
        if nc in gap_data:
            f.write(f"- **{nc.upper()}**: Có {len(gap_data[nc]['missing'])} sản phẩm mới.\n")
    f.write("\n")
    
    f.write("## Chi tiết khoảng trống nội dung (Gap Analysis) theo từng danh mục\n\n")
    for cat, data in gap_data.items():
        missing_list = data["missing"]
        matched_list = data["matched"]
        f.write(f"### {cat.upper()} (Thiếu: {len(missing_list)} | Đã có: {len(matched_list)})\n")
        if matched_list:
            f.write("<details><summary>Xem danh sách đã có</summary>\n\n")
            for m in matched_list:
                f.write(f"- `{m['crawled']}` (Trùng với: *{m['nksv']}*)\n")
            f.write("\n</details>\n\n")
            
        if missing_list:
            f.write("#### Danh sách sản phẩm cần cập nhật:\n")
            f.write("| Tên sản phẩm | Link nguồn | Ảnh minh họa |\n")
            f.write("|---|---|---|\n")
            for item in missing_list[:12]: # Limit print preview to 12 items for readability
                f.write(f"| {item['name']} | [Link]({item['url']}) | ![]({item['image']}) |\n")
            if len(missing_list) > 12:
                f.write(f"| ... và {len(missing_list) - 12} sản phẩm khác | | |\n")
            f.write("\n")

print("Comparison report generated successfully.")
