import os
import re
import urllib.parse

# Path to system generated steps directory
steps_dir = r"C:\Users\Admin\.gemini\antigravity\brain\1fa78ea5-e878-400b-b754-b19d66fc5aa5\.system_generated\steps"

knowledge_base = {
    "site_overview": {},
    "categories": set(),
    "products": [],
    "accessories": [],
    "catalogues": [],
    "download_links": [],
    "images": [],
    "faq": [],
    "seo_meta": {},
    "pricing_tables": []
}

def extract_meta_tags(html):
    meta = {}
    title_match = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE)
    if title_match:
        meta["title"] = title_match.group(1).strip()
    
    desc_match = re.search(r'<meta\s+name="description"\s+content="(.*?)"', html, re.IGNORECASE)
    if desc_match:
        meta["description"] = desc_match.group(1).strip()
    elif re.search(r'<meta\s+property="og:description"\s+content="(.*?)"', html, re.IGNORECASE):
        meta["description"] = re.search(r'<meta\s+property="og:description"\s+content="(.*?)"', html, re.IGNORECASE).group(1).strip()
        
    keywords_match = re.search(r'<meta\s+name="keywords"\s+content="(.*?)"', html, re.IGNORECASE)
    if keywords_match:
        meta["keywords"] = keywords_match.group(1).strip()
        
    return meta

def extract_products_from_page(html, source_url):
    products = []
    # Regex to find items like <div class="item_product_content"> or similar product card structures
    # Often they have links like: <a href="san-pham/..." title="...">
    matches = re.finditer(r'<a\s+href="(san-pham/[^"]+)"\s+title="([^"]+)"', html)
    for m in matches:
        url = m.group(1)
        name = m.group(2)
        if url not in [p["url"] for p in products]:
            # Try to find corresponding image nearby (if any)
            # Find the substring around this match
            start = max(0, m.start() - 300)
            end = min(len(html), m.end() + 300)
            nearby_html = html[start:end]
            img_match = re.search(r'data-src="([^"]+)"|src="([^"]+)"', nearby_html)
            img_url = img_match.group(1) or img_match.group(2) if img_match else ""
            products.append({
                "name": name,
                "url": "https://nhomkinhdaiphuc.com/" + url,
                "image": "https://nhomkinhdaiphuc.com/" + img_url if img_url and not img_url.startswith("http") else img_url,
                "source_page": source_url
            })
    return products

def extract_accessories_from_page(html, source_url):
    accs = []
    matches = re.finditer(r'<a\s+href="(phu-kien/[^"]+)"\s+title="([^"]+)"', html)
    for m in matches:
        url = m.group(1)
        name = m.group(2)
        if url not in [a["url"] for a in accs]:
            accs.append({
                "name": name,
                "url": "https://nhomkinhdaiphuc.com/" + url,
                "source_page": source_url
            })
    return accs

def extract_images(html, source_url):
    images = []
    # Find all images
    matches = re.finditer(r'<img\s+[^>]*src="([^"]+)"[^>]*alt="([^"]*)"|<img\s+[^>]*data-src="([^"]+)"[^>]*alt="([^"]*)"', html)
    for m in matches:
        src = m.group(1) or m.group(3)
        alt = m.group(2) or m.group(4) or ""
        if src and not src.endswith("no-image.svg") and not src.endswith("user.svg") and "logo" not in src.lower():
            full_url = "https://nhomkinhdaiphuc.com/" + src if not src.startswith("http") else src
            filename = os.path.basename(urllib.parse.urlparse(full_url).path)
            images.append({
                "url": full_url,
                "alt": alt.strip(),
                "filename": filename,
                "source_page": source_url
            })
    return images

def extract_downloads(html, source_url):
    downloads = []
    matches = re.finditer(r'<a\s+[^>]*href="([^"]*\.(?:pdf|zip|rar|xlsx|docx))"[^>]*>', html, re.IGNORECASE)
    for m in matches:
        href = m.group(1)
        full_url = "https://nhomkinhdaiphuc.com/" + href if not href.startswith("http") else href
        downloads.append({
            "url": full_url,
            "filename": os.path.basename(urllib.parse.urlparse(full_url).path),
            "source_page": source_url
        })
    return downloads

def extract_tables(html, source_url):
    tables = []
    # Basic table extractor
    matches = re.finditer(r'<table[^>]*>(.*?)</table>', html, re.DOTALL | re.IGNORECASE)
    for m in matches:
        table_html = m.group(1)
        # Parse rows
        rows = []
        for r_match in re.finditer(r'<tr[^>]*>(.*?)</tr>', table_html, re.DOTALL | re.IGNORECASE):
            cells = []
            for c_match in re.finditer(r'<t[dh][^>]*>(.*?)</t[dh]>', r_match.group(1), re.DOTALL | re.IGNORECASE):
                # Clean html tags inside cell
                cell_text = re.sub(r'<[^>]*>', '', c_match.group(1)).strip()
                cell_text = re.sub(r'\s+', ' ', cell_text)
                cells.append(cell_text)
            if cells:
                rows.append(cells)
        if rows:
            tables.append({
                "source_page": source_url,
                "rows": rows
            })
    return tables

# Main crawler loop over steps
for root, dirs, files in os.walk(steps_dir):
    for f in files:
        if f == "content.md":
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8", errors="replace") as file:
                lines = file.readlines()
            
            # Find the source URL from metadata header
            source_url = ""
            for line in lines[:10]:
                if line.startswith("Source:"):
                    source_url = line.split("Source:", 1)[1].strip()
                    break
            
            content_str = "".join(lines)
            
            if not source_url:
                continue
                
            print(f"Parsing: {source_url}")
            
            # 1. SEO metadata
            meta = extract_meta_tags(content_str)
            knowledge_base["seo_meta"][source_url] = meta
            
            # 2. Extract products
            prods = extract_products_from_page(content_str, source_url)
            knowledge_base["products"].extend(prods)
            
            # 3. Extract accessories
            accs = extract_accessories_from_page(content_str, source_url)
            knowledge_base["accessories"].extend(accs)
            
            # 4. Extract images
            imgs = extract_images(content_str, source_url)
            knowledge_base["images"].extend(imgs)
            
            # 5. Extract downloads
            dls = extract_downloads(content_str, source_url)
            knowledge_base["download_links"].extend(dls)
            
            # 6. Extract tables (specs/pricing)
            tbls = extract_tables(content_str, source_url)
            knowledge_base["pricing_tables"].extend(tbls)
            
            # Extract specific content block if it's the target page
            if "catalogue-cua-truot-quay-eurotech-33.html" in source_url:
                # Get the content description block
                desc_match = re.search(r'<div class="content-description">(.*?)</div>', content_str, re.DOTALL | re.IGNORECASE)
                if desc_match:
                    desc_text = desc_match.group(1)
                    # Convert basic tags to markdown
                    desc_text = re.sub(r'<h2>(.*?)</h2>', r'\n\n### \1\n', desc_text)
                    desc_text = re.sub(r'<p>(.*?)</p>', r'\n\1\n', desc_text)
                    desc_text = re.sub(r'<[^>]*>', '', desc_text)
                    knowledge_base["eurotech_catalogue_text"] = desc_text.strip()
                    
                # Extract download rar/pdf
                dl_match = re.search(r'<a class="download"[^>]*href="([^"]+)"[^>]*>', content_str, re.IGNORECASE)
                if dl_match:
                    knowledge_base["eurotech_download"] = "https://nhomkinhdaiphuc.com/" + dl_match.group(1)

# Clean duplicates
unique_products = {}
for p in knowledge_base["products"]:
    unique_products[p["url"]] = p
knowledge_base["products"] = list(unique_products.values())

unique_accs = {}
for a in knowledge_base["accessories"]:
    unique_accs[a["url"]] = a
knowledge_base["accessories"] = list(unique_accs.values())

unique_imgs = {}
for img in knowledge_base["images"]:
    unique_imgs[img["url"]] = img
knowledge_base["images"] = list(unique_imgs.values())

unique_dls = {}
for dl in knowledge_base["download_links"]:
    unique_dls[dl["url"]] = dl
knowledge_base["download_links"] = list(unique_dls.values())

print(f"Extracted {len(knowledge_base['products'])} unique products.")
print(f"Extracted {len(knowledge_base['accessories'])} unique accessories.")
print(f"Extracted {len(knowledge_base['images'])} unique images.")
print(f"Extracted {len(knowledge_base['download_links'])} unique download links.")
print(f"Extracted {len(knowledge_base['pricing_tables'])} tables.")

# Write report to markdown file in artifacts
output_md = r"C:\Users\Admin\.gemini\antigravity\brain\1fa78ea5-e878-400b-b754-b19d66fc5aa5\daiphuc_knowledge_base.md"

with open(output_md, "w", encoding="utf-8") as f:
    f.write("# KNOWLEDGE BASE - NHOMKINHDAIPHUC.COM\n\n")
    f.write("## 1. Tổng quan & Cấu trúc danh mục\n\n")
    f.write("- **Tên doanh nghiệp**: Công Ty TNHH Nhôm Kính Đại Phúc\n")
    f.write("- **Hotline**: 09.19.02.00.88 - 09.22.24.66.99\n")
    f.write("- **Địa chỉ**: 1/5 Đường số 5, Phường 17, Q. Gò Vấp, TP. Hồ Chí Minh\n")
    f.write("- **Email**: daiphucnhomkinh@gmail.com\n\n")
    
    f.write("### Danh mục sản phẩm chủ đạo\n")
    f.write("1. **Cửa Nhôm Xingfa** (Nhập khẩu Quảng Đông)\n")
    f.write("2. **Cửa Trượt Quay** (Hệ Eurotech, PMA, Zhongkai...)\n")
    f.write("3. **Cửa Nhôm Hệ Slim & Slim Cover** (Cửa siêu nhỏ gọn, lùa giảm chấn)\n")
    f.write("4. **Cửa Nhôm Thủy Lực** (Bản lề sàn cánh kính khung nhôm bản lớn)\n")
    f.write("5. **Cửa Nhôm Maxpro.JP** (Thương hiệu Nhật Bản cao cấp anodized)\n")
    f.write("6. **Cửa Nhôm Kogen** (Hệ nhôm phong cách Đức cao cấp)\n")
    f.write("7. **Cửa Nhôm PMA & Xingfa Class A**\n")
    f.write("8. **Cửa Nhôm Owin, Kenwin, Topal, Yongxing**\n")
    f.write("9. **Kính Cường Lực & Vách Kính**\n")
    f.write("10. **Phòng Tắm Kính & Cầu Thang - Lan Can Kính**\n\n")

    f.write("## 2. Chi tiết: Catalogue Cửa Trượt Quay Eurotech\n\n")
    f.write(f"- **URL trang**: https://nhomkinhdaiphuc.com/catalogue/catalogue-cua-truot-quay-eurotech-33.html\n")
    if "eurotech_download" in knowledge_base:
        f.write(f"- **Link Download File Gốc**: [{os.path.basename(knowledge_base['eurotech_download'])}]({knowledge_base['eurotech_download']})\n\n")
    
    f.write("### Nội dung giới thiệu\n")
    if "eurotech_catalogue_text" in knowledge_base:
        f.write(knowledge_base["eurotech_catalogue_text"] + "\n\n")
    else:
        f.write("Không trích xuất được khối nội dung giới thiệu.\n\n")
        
    f.write("## 3. Danh sách sản phẩm\n\n")
    f.write("| Tên sản phẩm | URL | Ảnh minh họa |\n")
    f.write("|---|---|---|\n")
    for p in knowledge_base["products"]:
        f.write(f"| {p['name']} | [{p['url']}]({p['url']}) | ![{p['name']}]({p['image']}) |\n")
    f.write("\n\n")
    
    f.write("## 4. Danh sách phụ kiện\n\n")
    f.write("| Tên phụ kiện | URL |\n")
    f.write("|---|---|\n")
    for a in knowledge_base["accessories"]:
        f.write(f"| {a['name']} | [{a['url']}]({a['url']}) |\n")
    f.write("\n\n")
    
    f.write("## 5. File PDF & Catalogue Download Links\n\n")
    f.write("| Tên file | URL Download |\n")
    f.write("|---|---|\n")
    for dl in knowledge_base["download_links"]:
        f.write(f"| {dl['filename']} | [Download]({dl['url']}) |\n")
    f.write("\n\n")
    
    f.write("## 6. Danh sách hình ảnh thu thập được\n\n")
    f.write("| Tên File | Alt Text | URL Ảnh Gốc |\n")
    f.write("|---|---|---|\n")
    for img in knowledge_base["images"][:50]:  # Limit to 50 for display
        f.write(f"| {img['filename']} | {img['alt']} | [Link]({img['url']}) |\n")
    f.write("\n\n")
    
    f.write("## 7. Bảng thông số kỹ thuật & Báo giá trích xuất\n\n")
    for idx, tbl in enumerate(knowledge_base["pricing_tables"]):
        f.write(f"### Bảng {idx+1} (Trích từ: {tbl['source_page']})\n\n")
        rows = tbl["rows"]
        if not rows:
            continue
        # Headers
        headers = rows[0]
        f.write("| " + " | ".join(headers) + " |\n")
        f.write("|" + "|".join(["---" for _ in headers]) + "|\n")
        for row in rows[1:]:
            # Ensure row length matches header length
            if len(row) < len(headers):
                row.extend([""] * (len(headers) - len(row)))
            elif len(row) > len(headers):
                row = row[:len(headers)]
            f.write("| " + " | ".join(row) + " |\n")
        f.write("\n\n")
        
    f.write("## 8. Phân tích SEO & Chiến lược tiếp thị\n\n")
    f.write("### Cấu trúc Headings tiêu chuẩn (On-page SEO)\n")
    f.write("- Trang sử dụng tốt thẻ Title và Meta Description có độ dài hợp chuẩn, chứa từ khóa mục tiêu: `Cửa Trượt Quay`, `Catalogue`, `Eurotech`.\n")
    f.write("- Các thẻ H1 chứa từ khóa SEO chính xác (ví dụ: `Cửa Trượt Quay – Giá Cửa Trượt Quay Tốt Nhất Cho Ngôi Nhà Của Bạn`).\n")
    f.write("- Nội dung bài viết chi tiết, có phân chia mục lục (Table of Contents) rõ ràng, tăng trải nghiệm người dùng và giúp Google index tốt các đoạn nội dung con (Anchor links).\n\n")
    
    f.write("### Điểm mạnh & Điểm yếu của đối thủ\n")
    f.write("- **Điểm mạnh**:\n")
    f.write("  - Cung cấp catalogue cho phép tải xuống (dạng .rar chứa ảnh hoặc PDF), đây là nam châm hút lead rất mạnh.\n")
    f.write("  - Có đầy đủ các hệ cửa từ bình dân đến cao cấp giúp khách hàng dễ so sánh.\n")
    f.write("  - Hướng dẫn cấu tạo chi tiết, dễ hiểu cho người dùng cuối.\n")
    f.write("- **Điểm yếu**:\n")
    f.write("  - File catalogue nén dạng .rar làm tăng rào cản sử dụng (người dùng điện thoại khó giải nén để xem trực tiếp, nên đổi thành PDF xem trực tuyến).\n")
    f.write("  - Hình ảnh sản phẩm còn nhiều watermark hoặc chất lượng chưa đồng đều.\n\n")

print("Knowledge Base written successfully.")
