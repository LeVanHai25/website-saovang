import os
import codecs

WEBSITE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "website"))
INDEX_PATH = os.path.join(WEBSITE_DIR, "index.html")
CSS_DIR = os.path.join(WEBSITE_DIR, "assets", "css")
HOME_CSS_PATH = os.path.join(CSS_DIR, "home.css")

def extract_homepage_css():
    print(f"Reading: {INDEX_PATH}")
    if not os.path.exists(INDEX_PATH):
        print("Error: index.html not found.")
        return

    with codecs.open(INDEX_PATH, 'r', 'utf-8') as f:
        content = f.read()

    # Find the style block between the first <style> in <head> and </style> before </head>
    # We locate it by finding '<!-- Page-specific styles -->' and matching up to the next '</style>'
    marker = '<!-- Page-specific styles -->'
    if marker not in content:
        print("Error: Page-specific styles marker not found in index.html.")
        return

    marker_idx = content.find(marker)
    start_style_idx = content.find('<style>', marker_idx)
    if start_style_idx == -1:
        print("Error: <style> tag after marker not found.")
        return
    
    end_style_idx = content.find('</style>', start_style_idx)
    if end_style_idx == -1:
        print("Error: </style> tag not found.")
        return

    # Extract the CSS content inside the tags
    css_content = content[start_style_idx + len('<style>'):end_style_idx].strip()
    
    # Write to home.css
    if not os.path.exists(CSS_DIR):
        os.makedirs(CSS_DIR)
        
    print(f"Writing CSS to: {HOME_CSS_PATH}")
    with codecs.open(HOME_CSS_PATH, 'w', 'utf-8') as cf:
        cf.write(css_content)

    # Replace the inline style block in index.html with a <link> tag
    replacement_link = '  <link rel="stylesheet" href="assets/css/home.css" />'
    
    # We replace from the <style> tag to the </style> tag (inclusive)
    updated_content = (
        content[:start_style_idx] + 
        replacement_link + 
        content[end_style_idx + len('</style>'):]
    )

    # Save the updated index.html
    print(f"Updating: {INDEX_PATH}")
    with codecs.open(INDEX_PATH, 'w', 'utf-8') as f:
        f.write(updated_content)

    print("SUCCESSFULLY EXTRACTED CSS AND UPDATED INDEX.HTML")

if __name__ == "__main__":
    extract_homepage_css()
