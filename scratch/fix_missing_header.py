import os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"

TARGET_PAGES = [
    # Nhôm
    "nhom-sao-vang.html", "nhom-xingfa.html", "nhom-maxpro.html",
    "nhom-civro.html", "nhom-slim.html", "nhom-kogen.html",
    "nhom-pma.html", "nhom-owin.html", "nhom-topal.html",
    # Phụ kiện
    "phu-kien.html", "phu-kien-cmech.html", "phu-kien-bogo.html",
    "phu-kien-draho.html", "phu-kien-papo.html", "phu-kien-opk.html",
    "phu-kien-sigico.html", "phu-kien-kinlong.html", "phu-kien-janus.html",
    "phu-kien-huy-hoang.html", "phu-kien-hafele.html", "phu-kien-3h.html",
    # Thư viện & Tools
    "thu-vien-profile-nhom.html", "du-an-nhom.html", "bao-gia-nhom.html"
]

# Read template header from index.html
index_path = os.path.join(BASE_DIR, "index.html")
with open(index_path, "r", encoding="utf-8", errors="replace") as f:
    index_content = f.read()

# Extract the header block from index.html
# Standard header-v2 container starts with <header class="header-v2" and ends with </header>
header_match = re.search(r'<header class="header-v2".*?</header>', index_content, re.DOTALL)
if not header_match:
    print("Error: Could not extract <header class=\"header-v2\"> from index.html")
    sys.exit(1)

base_header_template = header_match.group(0)
print("Base header template successfully loaded.")

def get_active_link_href(page):
    if page == "index.html":
        return "index.html"
    elif page == "co-khi-sao-vang.html":
        return "co-khi-sao-vang.html"
    elif page.startswith("nhom-") or page == "thu-vien-profile-nhom.html":
        return "nhom-sao-vang.html"
    elif page.startswith("phu-kien"):
        return "phu-kien.html"
    elif page == "du-an-nhom.html":
        return "du-an-nhom.html"
    elif page == "du-an.html":
        return "du-an.html"
    elif page == "lien-he.html":
        return "lien-he.html"
    return "index.html"

def customize_header(template, active_href):
    # Remove active class from all links first
    clean_template = re.sub(r'class="nav-menu-link active"', 'class="nav-menu-link"', template)
    clean_template = re.sub(r'class="nav-menu-link\s+active"', 'class="nav-menu-link"', clean_template)

    # Add active class to the correct link
    # Match href="active_href" or href='./active_href'
    pattern = rf'href=["\']\./?{active_href}["\'] class=["\']nav-menu-link["\']'
    replacement = f'href="{active_href}" class="nav-menu-link active"'

    if re.search(pattern, clean_template):
        customized = re.sub(pattern, replacement, clean_template)
    else:
        # Try finding href without leading ./
        pattern2 = rf'href=["\']{active_href}["\'] class=["\']nav-menu-link["\']'
        customized = re.sub(pattern2, replacement, clean_template)

    return customized

updated_count = 0
for page in TARGET_PAGES:
    filepath = os.path.join(BASE_DIR, page)
    if not os.path.exists(filepath):
        print(f"File missing: {page}")
        continue

    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    # Find the starting point of the navigation area to remove
    start_pos = -1
    end_pos = -1

    # Look for header v2 first
    header_v2_start = content.find('<header class="header-v2"')
    if header_v2_start != -1:
        start_pos = header_v2_start
        header_v2_end = content.find('</header>', start_pos)
        if header_v2_end != -1:
            end_pos = header_v2_end + 9  # len('</header>')
    else:
        # Look for header v1
        header_v1_start = content.find('<header class="header"')
        if header_v1_start != -1:
            start_pos = header_v1_start
            header_v1_end = content.find('</header>', start_pos)
            if header_v1_end != -1:
                end_pos = header_v1_end + 9
        else:
            # Look for orphan nav-menu class
            nav_start = content.find('<nav class="nav-menu"')
            if nav_start != -1:
                start_pos = nav_start
                # Find trailing </header> first (since it was orphan closed with </header>)
                trailing_header_end = content.find('</header>', start_pos)
                if trailing_header_end != -1:
                    end_pos = trailing_header_end + 9
                else:
                    # Fallback to </nav>
                    nav_end = content.find('</nav>', start_pos)
                    if nav_end != -1:
                        end_pos = nav_end + 6

    # Generate custom header with correct active class
    active_href = get_active_link_href(page)
    custom_header = customize_header(base_header_template, active_href)

    if start_pos != -1 and end_pos != -1:
        # Replace the old navigation block
        new_content = content[:start_pos] + custom_header + content[end_pos:]
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"✅ Header replaced and synchronized: {page} (Active link: {active_href})")
        updated_count += 1
    else:
        # If not found, insert after <body> or Tag Manager noscript block
        body_pos = content.find('<body>')
        if body_pos != -1:
            insert_pos = body_pos + 6
            # Check if noscript block of GTM is present right after body
            noscript_end = content.find('</noscript>', insert_pos)
            if noscript_end != -1 and noscript_end - insert_pos < 200:
                insert_pos = noscript_end + 11

            new_content = content[:insert_pos] + "\n" + custom_header + "\n" + content[insert_pos:]
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"⚠️  Header prepended (not found before): {page} (Active link: {active_href})")
            updated_count += 1
        else:
            print(f"❌ Error: Could not find <body> tag in {page}")

print(f"\nCompleted. Fully synchronized and corrected headers on {updated_count}/{len(TARGET_PAGES)} pages.")
