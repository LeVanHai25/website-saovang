import os
import codecs
import re

WEBSITE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "website"))

def update_navbar_in_files(apply_changes=False):
    print(f"Scanning directory: {WEBSITE_DIR}")
    if not os.path.exists(WEBSITE_DIR):
        print(f"Error: {WEBSITE_DIR} does not exist.")
        return

    # Replacements list
    # Format: (target_regex, replacement_string, description)
    replacements = [
        (
            re.compile(r'<a\s+href="nhom-sao-vang\.html"\s+class="nav-menu-link">Nhôm Sao Vàng</a>'),
            '<a href="nhom-sao-vang.html" class="nav-menu-link">SV Aluminium</a>',
            "Updated navbar link to 'SV Aluminium'"
        ),
        (
            re.compile(r'<a\s+href="nhom-sao-vang\.html"\s+class="nav-menu-link\s+active">Nhôm Sao Vàng</a>'),
            '<a href="nhom-sao-vang.html" class="nav-menu-link active">SV Aluminium</a>',
            "Updated active navbar link to 'SV Aluminium'"
        ),
        (
            re.compile(r'<a\s+href="linh-vuc-nhom-kinh\.html"\s+class="nav-dropdown-item"\s+role="menuitem">Nhôm Sao Vàng</a>'),
            '<a href="linh-vuc-nhom-kinh.html"  class="nav-dropdown-item" role="menuitem">Nhôm Kính SV Aluminium</a>',
            "Updated dropdown menuitem to 'Nhôm Kính SV Aluminium'"
        ),
        (
            re.compile(r'<a\s+href="linh-vuc-nhom-kinh\.html"\s+class="nav-dropdown-item\s+active"\s+role="menuitem">Nhôm Sao Vàng</a>'),
            '<a href="linh-vuc-nhom-kinh.html"  class="nav-dropdown-item active" role="menuitem">Nhôm Kính SV Aluminium</a>',
            "Updated active dropdown menuitem to 'Nhôm Kính SV Aluminium'"
        )
    ]

    total_files = 0
    updated_files = 0

    for root, dirs, files in os.walk(WEBSITE_DIR):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, WEBSITE_DIR)
                
                with codecs.open(file_path, 'r', 'utf-8') as f:
                    content = f.read()

                new_content = content
                file_changes = []
                
                for pattern, replacement, desc in replacements:
                    if pattern.search(new_content):
                        new_content = pattern.sub(replacement, new_content)
                        file_changes.append(desc)

                if file_changes:
                    # Clean up file path string for safe console print
                    safe_rel_path = rel_path.encode('ascii', 'ignore').decode('ascii')
                    if not safe_rel_path.strip():
                        safe_rel_path = file
                    print(f"\nFile: {safe_rel_path}")
                    for change in file_changes:
                        print(f"  - {change}")
                    
                    if apply_changes:
                        with codecs.open(file_path, 'w', 'utf-8') as f:
                            f.write(new_content)
                        updated_files += 1
                
                total_files += 1

    print(f"\nScan complete. Scanned {total_files} HTML files.")
    if apply_changes:
        print(f"Successfully updated navbar in {updated_files} HTML files.")
    else:
        print("[DRY RUN] No files were updated. Use '--apply' to write changes to disk.")

if __name__ == "__main__":
    import sys
    apply = "--apply" in sys.argv
    update_navbar_in_files(apply)
