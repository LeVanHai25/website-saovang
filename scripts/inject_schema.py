"""
GIAI ĐOẠN 2B — JSON-LD Schema Injection System
SAO VÀNG Digital Ecosystem

Mục đích:
- Đọc dữ liệu từ data/*.json (Single Source of Truth)
- Tạo đúng chuẩn Schema.org cho từng loại trang
- Inject/thay thế <script type="application/ld+json"> vào tất cả HTML files

Chạy DRY RUN:  python inject_schema.py
Chạy APPLY:    python inject_schema.py --apply
"""

import os
import re
import json
import codecs
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
WEBSITE_DIR = os.path.join(BASE_DIR, "website")
DATA_DIR    = os.path.join(BASE_DIR, "data")

# ─── Load SSoT data ───────────────────────────────────────────────────────────
def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with codecs.open(path, "r", "utf-8") as f:
        return json.load(f)

company  = load_json("company.json")["company"]
services = load_json("services.json")
faq_list = load_json("faq.json")

DOMAIN = company["canonicalDomain"]
HQ     = company["addresses"]["headquarters"]
PHONE  = f"+84{company['phone'][1:]}"   # "0869..." → "+84869590279"
EMAIL  = company["email"]
TAX_ID = company["taxId"]

# ─── Schema Builders ──────────────────────────────────────────────────────────

def build_organization_schema():
    """Core Organization + LocalBusiness (used in every page's @graph)"""
    return {
        "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
        "@id": f"{DOMAIN}/#organization",
        "name": "Cơ Khí Sao Vàng",
        "legalName": company["legalName"],
        "url": DOMAIN,
        "logo": {
            "@type": "ImageObject",
            "url": f"{DOMAIN}/assets/images/logo-sv-main.svg",
            "width": 200,
            "height": 200
        },
        "image": f"{DOMAIN}/assets/images/hero-bg.jpg",
        "description": (
            "CÔNG TY CỔ PHẦN SẢN XUẤT CƠ KHÍ SAO VÀNG — "
            "Chuyên gia gia công cơ khí chính xác CNC, kết cấu thép, "
            "inox du thuyền, cửa nhôm kính, mặt dựng curtain wall và lan can kính cường lực "
            "tại Hà Nội. MST: 0110808047."
        ),
        "telephone": PHONE,
        "email": EMAIL,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": HQ["street"],
            "addressLocality": HQ["district"],
            "addressRegion": "Hà Nội",
            "postalCode": "100000",
            "addressCountry": "VN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "20.9715",
            "longitude": "105.7825"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "52",
            "bestRating": "5",
            "worstRating": "1"
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "08:00",
                "closes": "17:30"
            }
        ],
        "taxID": TAX_ID,
        "sameAs": [
            f"https://zalo.me/{company['phone']}",
            f"{DOMAIN}"
        ],
        "areaServed": {
            "@type": "Country",
            "name": "Việt Nam"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Dịch vụ Cơ Khí & Nhôm Kính Sao Vàng",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": s["title"],
                        "url": f"{DOMAIN}/{s['slug']}.html"
                    }
                }
                for s in services
            ]
        },
        "knowsAbout": [
            "Gia công cơ khí chính xác CNC",
            "Kết cấu thép công nghiệp AWS D1.1",
            "Cửa nhôm kính kiến trúc cao cấp",
            "Mặt dựng kính curtain wall",
            "Inox 316L marine grade",
            "Lan can kính cường lực",
            "Mái kính canopy giếng trời"
        ]
    }


def build_website_schema():
    return {
        "@type": "WebSite",
        "@id": f"{DOMAIN}/#website",
        "url": DOMAIN,
        "name": "Cơ Khí Sao Vàng — B2B Industrial Mechanical & Architectural Glass",
        "description": "Website chính thức của Công ty Cổ phần Sản xuất Cơ khí Sao Vàng",
        "publisher": {"@id": f"{DOMAIN}/#organization"},
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": f"{DOMAIN}/san-pham.html?q={{search_term_string}}"
            },
            "query-input": "required name=search_term_string"
        },
        "inLanguage": "vi-VN"
    }


def build_faq_schema():
    """Build FAQPage schema for index + relevant service pages"""
    return {
        "@type": "FAQPage",
        "@id": f"{DOMAIN}/#faq",
        "mainEntity": [
            {
                "@type": "Question",
                "name": item["question"],
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item["answer"]
                }
            }
            for item in faq_list[:10]   # Top 10 FAQs for the homepage
        ]
    }


def build_service_schema(service_slug):
    """Build detailed Service schema for individual service pages"""
    svc = next((s for s in services if s["slug"] == service_slug), None)
    if not svc:
        return None
    return {
        "@type": "Service",
        "@id": f"{DOMAIN}/{svc['slug']}.html#service",
        "name": svc["title"],
        "description": svc["fullDescription"],
        "provider": {"@id": f"{DOMAIN}/#organization"},
        "areaServed": {
            "@type": "Country",
            "name": "Việt Nam"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": svc["title"],
            "itemListElement": [
                {
                    "@type": "Offer",
                    "description": spec
                }
                for spec in svc["technicalSpecs"]
            ]
        },
        "url": f"{DOMAIN}/{svc['slug']}.html"
    }


def build_breadcrumb_schema(page_title, page_url):
    return {
        "@type": "BreadcrumbList",
        "@id": f"{page_url}#breadcrumb",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Trang Chủ",
                "item": f"{DOMAIN}/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": page_title,
                "item": page_url
            }
        ]
    }


def build_howto_schema():
    return {
        "@type": "HowTo",
        "@id": f"{DOMAIN}/#howto",
        "name": "Quy trình Báo giá & Triển khai thầu Cơ Khí - Nhôm Kính Sao Vàng",
        "description": "5 bước chuẩn hóa chuyên nghiệp dành cho Chủ đầu tư và Tổng thầu Xây dựng.",
        "step": [
            {
                "@type": "HowToStep",
                "position": 1,
                "name": "Tiếp nhận thông tin & Khảo sát",
                "text": "Sao Vàng thu nhận hồ sơ dự toán thầu, bản vẽ CAD và đo đạc hiện trạng bằng máy laser chuyên dụng."
            },
            {
                "@type": "HowToStep",
                "position": 2,
                "name": "Tư vấn kỹ thuật & DFM Check",
                "text": "Rà soát kỹ thuật bản vẽ hoàn toàn miễn phí, phân tích các rủi ro chế tạo và đề xuất phương án tối ưu hóa vật tư."
            },
            {
                "@type": "HowToStep",
                "position": 3,
                "name": "Đơn giá chi tiết & Đàm phán",
                "text": "Lập bảng tiên lượng dự toán thầu (BOQ) và đề xuất biện pháp thi công tối ưu trong vòng 24 - 48 giờ."
            },
            {
                "@type": "HowToStep",
                "position": 4,
                "name": "Sản xuất gia công CNC",
                "text": "Tiến hành gia công cơ khí phay tiện CNC, cắt laser kim loại tấm và đùn ép/sơn phủ nhôm tại nhà xưởng đạt chuẩn AWS/ASME."
            },
            {
                "@type": "HowToStep",
                "position": 5,
                "name": "Lắp dựng & Nghiệm thu",
                "text": "Vận chuyển và lắp dựng tại công trường bởi đội thợ lành nghề, nghiệm thu đo kiểm bằng thiết bị chuyên sâu và bàn giao hồ sơ bảo hành."
            }
        ]
    }


# ─── Page-type routing ────────────────────────────────────────────────────────

# Map filename → (page_title, list_of_extra_schema_builders)
PAGE_CONFIG = {
    "index.html": {
        "title":   "Cơ Khí Sao Vàng — Cơ Khí Chính Xác & Nhôm Kính Cao Cấp",
        "schemas": ["organization", "website", "faq", "howto"]
    },
    "lien-he.html": {
        "title":   "Liên Hệ — Cơ Khí Sao Vàng",
        "schemas": ["organization", "website", "breadcrumb"]
    },
    "gioi-thieu.html": {
        "title":   "Giới Thiệu Công Ty — Cơ Khí Sao Vàng",
        "schemas": ["organization", "website", "breadcrumb"]
    },
    "gia-cong-cnc-chinh-xac.html": {
        "title":   "Gia Công CNC Chính Xác",
        "service": "gia-cong-cnc-chinh-xac",
        "schemas": ["organization", "service", "breadcrumb"]
    },
    "gia-cong-inox.html": {
        "title":   "Gia Công Inox",
        "service": "gia-cong-inox",
        "schemas": ["organization", "service", "breadcrumb"]
    },
    "ket-cau-thep.html": {
        "title":   "Kết Cấu Thép",
        "service": "ket-cau-thep",
        "schemas": ["organization", "service", "breadcrumb"]
    },
    "co-khi-nghe-thuat.html": {
        "title":   "Cơ Khí Mỹ Thuật",
        "service": "co-khi-nghe-thuat",
        "schemas": ["organization", "service", "breadcrumb"]
    },
    "cua-nhom-kinh.html": {
        "title":   "Cửa Nhôm Kính Cao Cấp",
        "service": "cua-nhom-kinh",
        "schemas": ["organization", "service", "breadcrumb"]
    },
    "vach-kinh.html": {
        "title":   "Vách Kính Mặt Dựng",
        "service": "vach-kinh",
        "schemas": ["organization", "service", "breadcrumb"]
    },
    "lan-can-kinh.html": {
        "title":   "Lan Can Kính Cường Lực",
        "service": "lan-can-kinh",
        "schemas": ["organization", "service", "breadcrumb"]
    },
    "mai-kinh.html": {
        "title":   "Mái Kính Canopy",
        "service": "mai-kinh",
        "schemas": ["organization", "service", "breadcrumb"]
    },
    "nang-luc.html": {
        "title":   "Năng Lực Sản Xuất",
        "schemas": ["organization", "website", "breadcrumb"]
    },
    "linh-vuc-co-khi.html": {
        "title":   "Lĩnh Vực Cơ Khí",
        "schemas": ["organization", "website", "breadcrumb"]
    },
    "linh-vuc-nhom-kinh.html": {
        "title":   "Lĩnh Vực Nhôm Kính",
        "schemas": ["organization", "website", "breadcrumb"]
    },
    "tai-lieu.html": {
        "title":   "Tài Liệu Kỹ Thuật",
        "schemas": ["organization", "website", "breadcrumb"]
    },
    "theo-doi.html": {
        "title":   "Theo Dõi Đơn Hàng B2B",
        "schemas": ["organization", "website", "breadcrumb"]
    },
}


def build_graph_for_page(filename):
    """Build the full @graph array for a given HTML file"""
    config = PAGE_CONFIG.get(filename)
    page_url = f"{DOMAIN}/{filename}"
    graph = []

    # Always inject organization for all pages, even unconfigured ones
    if config is None:
        # Default: organization only
        graph.append(build_organization_schema())
        return graph

    schema_types = config.get("schemas", ["organization"])
    title        = config.get("title", "Cơ Khí Sao Vàng")
    service_slug = config.get("service")

    for st in schema_types:
        if st == "organization":
            graph.append(build_organization_schema())
        elif st == "website":
            graph.append(build_website_schema())
        elif st == "faq":
            graph.append(build_faq_schema())
        elif st == "service" and service_slug:
            svc_schema = build_service_schema(service_slug)
            if svc_schema:
                graph.append(svc_schema)
        elif st == "breadcrumb":
            graph.append(build_breadcrumb_schema(title, page_url))
        elif st == "howto":
            graph.append(build_howto_schema())

    return graph


def generate_ld_json(filename):
    graph = build_graph_for_page(filename)
    ld = {
        "@context": "https://schema.org",
        "@graph": graph
    }
    return json.dumps(ld, ensure_ascii=False, indent=2)


# ─── Injector ─────────────────────────────────────────────────────────────────

LD_PATTERN = re.compile(
    r'<script\s+type="application/ld\+json".*?</script>',
    re.DOTALL | re.IGNORECASE
)

def inject_schema_into_file(file_path, filename, apply=False):
    with codecs.open(file_path, "r", "utf-8") as f:
        content = f.read()

    new_ld = f'<script type="application/ld+json">\n{generate_ld_json(filename)}\n</script>'

    existing = LD_PATTERN.findall(content)

    if existing:
        # Replace the FIRST existing LD+JSON block; remove any extras
        first_replaced = False
        def replacer(m):
            nonlocal first_replaced
            if not first_replaced:
                first_replaced = True
                return new_ld
            return ""   # Remove duplicate LD blocks
        new_content = LD_PATTERN.sub(replacer, content)
        action = f"REPLACED {len(existing)} existing LD+JSON block(s)"
    else:
        # Inject before </head>
        if "</head>" in content:
            new_content = content.replace("</head>", f"  {new_ld}\n</head>", 1)
            action = "INJECTED before </head>"
        else:
            new_content = content
            action = "SKIPPED — no </head> tag found"

    if apply:
        with codecs.open(file_path, "w", "utf-8") as f:
            f.write(new_content)

    return action


def run(apply_changes=False):
    print(f"Schema Injection — {'APPLY MODE' if apply_changes else 'DRY RUN MODE'}")
    print(f"Scanning: {WEBSITE_DIR}\n")

    total = 0
    updated = 0

    for fname in sorted(os.listdir(WEBSITE_DIR)):
        if not fname.endswith(".html"):
            continue
        fpath = os.path.join(WEBSITE_DIR, fname)
        safe_name = fname.encode("ascii", "replace").decode("ascii")
        try:
            action = inject_schema_into_file(fpath, fname, apply=apply_changes)
            print(f"  [{safe_name:45s}] {action}")
            updated += 1
        except Exception as e:
            err = str(e).encode("ascii", "replace").decode("ascii")
            print(f"  [{safe_name:45s}] ERROR: {err}")
        total += 1

    print(f"\nDone. Processed {updated}/{total} HTML files.")
    if not apply_changes:
        print("Run with --apply to write changes.")


if __name__ == "__main__":
    apply = "--apply" in sys.argv
    run(apply)
