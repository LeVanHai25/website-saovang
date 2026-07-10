import os
import re
import sys
import codecs

WEBSITE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "website"))

# SSoT (Single Source of Truth) Metadata values
OFFICIAL_HEADQUARTERS_WARD_OLD = ["Kiến Hưng", "kiến hưng"]
OFFICIAL_HEADQUARTERS_WARD_NEW = "Phú La"
OFFICIAL_EMAIL = "cokhisaovangvn@gmail.com"
OFFICIAL_CANONICAL_DOMAIN = "https://www.cokhisaovang.com"
OFFICIAL_CANONICAL_DOMAIN_OLD = [
    "https://www.CoKhiSaoVang.com", 
    "https://saovang.vn", 
    "https://www.cokhi-saovang.vn"
]

def fix_html_content(content, gtm_id=None, clarity_id=None):
    fixed = content
    changes_made = []

    # 1. Fix GTM ID if provided
    if gtm_id and "GTM-XXXXXXX" in fixed:
        fixed = fixed.replace("GTM-XXXXXXX", gtm_id)
        changes_made.append(f"Replaced GTM-XXXXXXX with {gtm_id}")

    # 2. Fix Microsoft Clarity ID if provided
    if clarity_id and "XXXXXXXXXX" in fixed:
        # Replace occurrences in script tag: "script", "XXXXXXXXXX"
        fixed = re.sub(r'"script",\s*"XXXXXXXXXX"', f'"script", "{clarity_id}"', fixed)
        fixed = fixed.replace("XXXXXXXXXX", clarity_id)
        changes_made.append(f"Replaced Clarity XXXXXXXXXX with {clarity_id}")

    # 3. Fix Inconsistent Emails
    # Replace email@example.com, info@cokhi-saovang.vn with cokhisaovangvn@gmail.com
    emails_to_replace = ["email@example.com", "info@cokhi-saovang.vn"]
    for old_email in emails_to_replace:
        if old_email in fixed:
            fixed = fixed.replace(old_email, OFFICIAL_EMAIL)
            changes_made.append(f"Replaced old email {old_email} with {OFFICIAL_EMAIL}")

    # 4. Fix Inconsistent Address Ward (Kiến Hưng -> Phú La)
    for old_ward in OFFICIAL_HEADQUARTERS_WARD_OLD:
        # Match "phường Kiến Hưng" or "Phường Kiến Hưng"
        pattern = re.compile(rf'([pP]hường\s+){old_ward}')
        if pattern.search(fixed):
            fixed = pattern.sub(rf'\1{OFFICIAL_HEADQUARTERS_WARD_NEW}', fixed)
            # Use ASCII representation for console logs to prevent Windows encoding errors
            changes_made.append(f"Replaced ward 'Kien Hung' with 'Phu La'")

    # 5. Fix Canonical URL Domain
    for old_domain in OFFICIAL_CANONICAL_DOMAIN_OLD:
        if old_domain in fixed:
            fixed = fixed.replace(old_domain, OFFICIAL_CANONICAL_DOMAIN)
            changes_made.append(f"Replaced domain {old_domain} with {OFFICIAL_CANONICAL_DOMAIN}")

    # 6. Fix OpenGraph relative image path
    # Find <meta property="og:image" content="assets/images/..."/>
    og_img_pattern = re.compile(r'(<meta\s+property="og:image"\s+content=")(assets/images/[^"]+)(")')
    if og_img_pattern.search(fixed):
        fixed = og_img_pattern.sub(rf'\1{OFFICIAL_CANONICAL_DOMAIN}/\2\3', fixed)
        changes_made.append("Converted relative og:image to absolute URL")

    return fixed, changes_made

def run_fix(apply_changes=False, gtm_id=None, clarity_id=None):
    print(f"Scanning website directory: {WEBSITE_DIR}")
    if not os.path.exists(WEBSITE_DIR):
        print(f"Error: {WEBSITE_DIR} does not exist.")
        sys.exit(1)

    total_files = 0
    modified_files = 0

    for root, dirs, files in os.walk(WEBSITE_DIR):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, WEBSITE_DIR)
                
                with codecs.open(file_path, 'r', 'utf-8') as f:
                    content = f.read()

                fixed_content, changes = fix_html_content(content, gtm_id, clarity_id)
                
                if changes:
                    # Replace non-ascii chars in rel_path for printing if any
                    safe_rel_path = rel_path.encode('ascii', 'ignore').decode('ascii')
                    if not safe_rel_path.strip():
                        safe_rel_path = file # fallback
                    print(f"\nFile: {safe_rel_path}")
                    for change in changes:
                        print(f"  - {change}")
                    
                    if apply_changes:
                        with codecs.open(file_path, 'w', 'utf-8') as f:
                            f.write(fixed_content)
                        modified_files += 1
                total_files += 1

    print(f"\nScan complete. Scanned {total_files} HTML files.")
    if apply_changes:
        print(f"Successfully updated {modified_files} HTML files.")
    else:
        print("[DRY RUN] No files were updated. Use '--apply' to write changes to disk.")

if __name__ == "__main__":
    apply = "--apply" in sys.argv
    
    # Parse custom GTM and Clarity IDs from arguments if present
    gtm = None
    clarity = None
    for arg in sys.argv:
        if arg.startswith("--gtm="):
            gtm = arg.split("=")[1]
        if arg.startswith("--clarity="):
            clarity = arg.split("=")[1]

    run_fix(apply, gtm, clarity)
