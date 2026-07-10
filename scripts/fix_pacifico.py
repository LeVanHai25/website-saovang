import os
import sys
import re
import codecs

WEBSITE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "website"))

def scan_and_fix_pacifico(apply_changes=False):
    print(f"Scanning directory: {WEBSITE_DIR}")
    if not os.path.exists(WEBSITE_DIR):
        print(f"Error: {WEBSITE_DIR} does not exist.")
        sys.exit(1)

    matched_files = []
    
    # Patterns for Pacifico font in google fonts urls
    pacifico_pattern = re.compile(r'family=Pacifico&?')
    # In some files it could be &family=Pacifico
    amp_pacifico_pattern = re.compile(r'&family=Pacifico')
    # Or family=Pacifico without & (at the end)
    family_pacifico_pattern = re.compile(r'family=Pacifico')

    for root, dirs, files in os.walk(WEBSITE_DIR):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                
                with codecs.open(file_path, 'r', 'utf-8') as f:
                    content = f.read()
                
                if "Pacifico" in content:
                    matched_files.append((file_path, file))

    if not matched_files:
        print("No files found containing references to 'Pacifico' font.")
        return

    print(f"\nFound {len(matched_files)} HTML files containing 'Pacifico' reference:")
    for path, name in matched_files:
        print(f" - {name}")

    if not apply_changes:
        print("\n[DRY RUN] No changes were made. Run with '--apply' to clean up these files.")
        return

    print("\nApplying changes...")
    for path, name in matched_files:
        with codecs.open(path, 'r', 'utf-8') as f:
            content = f.read()
        
        # Clean up the imports
        new_content = content
        
        # Replace different variations of Pacifico in Google Font urls
        new_content = amp_pacifico_pattern.sub('', new_content)
        new_content = pacifico_pattern.sub('', new_content)
        new_content = family_pacifico_pattern.sub('', new_content)
        
        # If there are any other direct mentions in CSS or font declarations, clean them
        # Let's inspect where it might be used
        # We also need to check if the URL format was left with trailing/leading issues
        
        with codecs.open(path, 'w', 'utf-8') as f:
            f.write(new_content)
        print(f"Cleaned font imports in: {name}")

    print("\n Pacifico font cleanup complete.")

if __name__ == "__main__":
    apply = "--apply" in sys.argv
    scan_and_fix_pacifico(apply)
