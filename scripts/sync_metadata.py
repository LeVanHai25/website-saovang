import os
import re
import json
import sys
import codecs

# SSoT (Single Source of Truth) Metadata values
OFFICIAL_COMPANY_NAME = "CÔNG TY CỔ PHẦN SẢN XUẤT CƠ KHÍ SAO VÀNG"
OFFICIAL_TAX_ID = "0110808047"
OFFICIAL_HEADQUARTERS_ADDRESS = "Tầng 3, TT7-35 Khu đô thị Văn Phú, phường Phú La, quận Hà Đông, TP Hà Nội, Việt Nam"
OFFICIAL_EMAIL = "cokhisaovangvn@gmail.com"
OFFICIAL_HOTLINE = "0869 590 279"
OFFICIAL_HOTLINE_PLAIN = "0869590279"
OFFICIAL_CANONICAL_DOMAIN = "https://www.cokhisaovang.com"

WEBSITE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "website"))
REPORT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "metadata_audit_report.json"))

def audit_html_file(file_path):
    issues = []
    
    with codecs.open(file_path, 'r', 'utf-8') as f:
        content = f.read()

    # 1. GTM placeholder GTM-XXXXXXX
    if "GTM-XXXXXXX" in content:
        issues.append({
            "type": "GTM_PLACEHOLDER",
            "message": "Found GTM-XXXXXXX placeholder in Google Tag Manager scripts."
        })

    # 2. Microsoft Clarity placeholder XXXXXXXXXX
    # Match specific pattern: "script", "XXXXXXXXXX"
    if re.search(r'"script",\s*"XXXXXXXXXX"', content) or "id=XXXXXXXXXX" in content or '"XXXXXXXXXX"' in content:
        if "XXXXXXXXXX" in content:
            issues.append({
                "type": "CLARITY_PLACEHOLDER",
                "message": "Found XXXXXXXXXX placeholder in Microsoft Clarity tracking code."
            })

    # 3. Old or inconsistent email addresses
    # Search for email domains like cokhi-saovang.vn or cokhisaovang.com that are not the official email
    found_emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', content)
    for email in found_emails:
        if email.lower() != OFFICIAL_EMAIL.lower() and email.lower() != "info@cokhisaovang.com":
            issues.append({
                "type": "INCONSISTENT_EMAIL",
                "message": f"Found inconsistent email address: {email} (Official is: {OFFICIAL_EMAIL})"
            })

    # 4. Inconsistent address strings
    # "171 Đi Bộ Hà Nội" or "Khâu Hùng" in places where the headquarters is expected
    # Let's search for "Hà Đông" or "Văn Phú" to make sure the address matches
    if "Văn Phú" in content and "Kiến Hưng" in content:
        issues.append({
            "type": "INCONSISTENT_ADDRESS",
            "message": "Found legacy headquarters ward 'Kiến Hưng' (Official is 'Phú La')."
        })
    if "171 Đi Bộ Hà Nội" in content and "footer" in file_path:
        issues.append({
            "type": "INCONSISTENT_ADDRESS",
            "message": "Found factory address in footer where headquarters is expected."
        })

    # 5. Canonical URLs using different domains
    canonical_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', content)
    if canonical_match:
        href = canonical_match.group(1)
        if not href.startswith(OFFICIAL_CANONICAL_DOMAIN):
            issues.append({
                "type": "CANONICAL_DOMAIN_MISMATCH",
                "message": f"Canonical URL domain mismatch: {href} (Official domain root is: {OFFICIAL_CANONICAL_DOMAIN})"
            })

    # 6. Relative OpenGraph image path
    og_img_match = re.search(r'<meta\s+property="og:image"\s+content="([^"]+)"', content)
    if og_img_match:
        img_href = og_img_match.group(1)
        if not img_href.startswith("http://") and not img_href.startswith("https://"):
            issues.append({
                "type": "RELATIVE_OG_IMAGE",
                "message": f"OpenGraph og:image uses a relative path: {img_href} (Should be absolute URL)"
            })

    return issues

def run_audit():
    print(f"Scanning directory: {WEBSITE_DIR}")
    if not os.path.exists(WEBSITE_DIR):
        print(f"Error: {WEBSITE_DIR} does not exist.")
        sys.exit(1)

    all_issues = {}
    total_files = 0
    total_issues = 0

    for root, dirs, files in os.walk(WEBSITE_DIR):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, WEBSITE_DIR)
                file_issues = audit_html_file(file_path)
                
                if file_issues:
                    all_issues[rel_path] = file_issues
                    total_issues += len(file_issues)
                total_files += 1

    report = {
        "summary": {
            "scannedDirectory": WEBSITE_DIR,
            "totalFilesScanned": total_files,
            "totalFilesWithIssues": len(all_issues),
            "totalIssuesFound": total_issues
        },
        "details": all_issues
    }

    with codecs.open(REPORT_PATH, 'w', 'utf-8') as rf:
        json.dump(report, rf, ensure_ascii=False, indent=2)

    print(f"\nAudit complete. Scanned {total_files} HTML files.")
    print(f"Found {total_issues} issues in {len(all_issues)} files.")
    print(f"Detailed audit report saved to: {REPORT_PATH}")

if __name__ == "__main__":
    run_audit()
