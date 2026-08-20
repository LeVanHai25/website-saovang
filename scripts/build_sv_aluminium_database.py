import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

data_dir = os.path.join('website', 'data', 'aluminium')
os.makedirs(data_dir, exist_ok=True)

# 1. groups.json
groups_data = {
    "version": "1.0",
    "updated_at": "2026-08-20",
    "groups": [
        {
            "id": "opening",
            "order": 1,
            "code": "GRP-01",
            "name_vi": "Cửa Mở Quay Châu Âu",
            "name_en": "European Opening Systems",
            "tagline_vi": "Giải pháp cửa đi và cửa sổ mở quay tiêu chuẩn rãnh C và đa khoang",
            "tagline_en": "Standard & thermal-break opening door & window systems",
            "description_vi": "Hệ thống cửa mở quay 1 cánh, 2 cánh, 4 cánh và cửa sổ mở hất/quay tích hợp rãnh C tiêu chuẩn Châu Âu và gioăng EPDM đa tầng cách âm kín khít.",
            "icon": "ri-door-open-line",
            "system_ids": ["xf55-flat", "xf55-multi", "c55", "c65", "xfv55"]
        },
        {
            "id": "sliding-panorama",
            "order": 2,
            "code": "GRP-02",
            "name_vi": "Cửa Lùa & Panorama Khổ Lớn",
            "name_en": "Large Sliding & Panoramic Systems",
            "tagline_vi": "Mở rộng không gian và tối đa hóa tầm nhìn cảnh quan",
            "tagline_en": "Expansive architectural sliding & lift-and-slide systems",
            "description_vi": "Hệ cửa lùa trượt 2 ray, 3 ray và trượt nâng (Lift & Slide) khẩu độ lớn, vận hành êm ái, tối ưu cho phòng khách view sân vườn, penthouse và biệt thự hướng biển.",
            "icon": "ri-aspect-ratio-line",
            "system_ids": ["xf93", "l94-l95", "l120", "l180"]
        },
        {
            "id": "slim",
            "order": 3,
            "code": "GRP-03",
            "name_vi": "Hệ Nhôm Slim Tối Giản",
            "name_en": "Minimalist Slim Aluminium Systems",
            "tagline_vi": "Khung nhôm siêu mảnh tối ưu ánh sáng và độ thông thoáng",
            "tagline_en": "Ultra-slim profile systems for modern minimal aesthetics",
            "description_vi": "Đường nét thanh mảnh hiện đại cho không gian nội thất tối giản (Slim 40) và hệ cửa Slim ngoại thất chịu lực tải gió (Slim 130).",
            "icon": "ri-layout-grid-line",
            "system_ids": ["slim-40", "slim-130"]
        },
        {
            "id": "special",
            "order": 4,
            "code": "GRP-04",
            "name_vi": "Cửa Thủy Lực & Xếp Trượt Đặc Biệt",
            "name_en": "Hydraulic & Heavy-Duty Folding Systems",
            "tagline_vi": "Bản cánh lớn bề thế cho sảnh chính và giải pháp xếp trượt siêu rộng",
            "tagline_en": "Grand entrance hydraulic doors & multi-panel bi-fold systems",
            "description_vi": "Cửa thủy lực bản cánh lớn chịu tải cao cho đại sảnh và cửa xếp trượt đa cánh giải phóng 100% không gian mở liên kết sân vườn hồ bơi.",
            "icon": "ri-split-cells-horizontal",
            "system_ids": ["vh65-tl60", "f63", "x80-soco80"]
        },
        {
            "id": "facade",
            "order": 5,
            "code": "GRP-05",
            "name_vi": "Vách Kính & Mặt Dựng Kiến Trúc",
            "name_en": "Architectural Facade & Curtain Wall Systems",
            "tagline_vi": "Giải pháp bao che mặt đứng cho công trình quy mô và kiến trúc hiện đại",
            "tagline_en": "Engineered building envelope & curtain wall solutions",
            "description_vi": "Hệ mặt dựng lộ đố, giấu đố và vách kính thông tầng khổ lớn được thiết kế đồng bộ với hệ thống phụ kiện liên kết chịu lực chuyên dụng.",
            "icon": "ri-building-2-line",
            "system_ids": ["md50-md52", "md65"]
        }
    ]
}

# 2. markets.json
markets_data = {
    "markets": [
        {
            "id": "residential",
            "name_vi": "Nhà Ở & Nhà Phố",
            "name_en": "Townhouse & Residential",
            "description_vi": "Giải pháp nhôm kính bền bỉ, tối ưu công năng, thẩm mỹ hiện đại và chi phí hợp lý.",
            "icon": "ri-home-4-line",
            "typical_systems": ["xf55-flat", "xfv55", "xf93", "l94-l95"]
        },
        {
            "id": "apartment",
            "name_vi": "Căn Hộ & Chung Cư Cao Cấp",
            "name_en": "Apartment & Condominium",
            "description_vi": "Cách âm chống ồn, chống thấm nước mưa áp lực cao, an toàn cho ban công và logia tầng cao.",
            "icon": "ri-building-line",
            "typical_systems": ["xf55-multi", "c65", "l94-l95", "slim-40"]
        },
        {
            "id": "villa",
            "name_vi": "Biệt Thự & Penthouse",
            "name_en": "Luxury Villa & Penthouse",
            "description_vi": "Hệ cửa khẩu độ lớn Panorama, cửa Slim tràn viền và màu sắc tinh xảo nâng tầm kiến trúc độc bản.",
            "icon": "ri-hotel-line",
            "typical_systems": ["l180", "slim-130", "c65", "x80-soco80", "vh65-tl60"]
        },
        {
            "id": "hospitality",
            "name_vi": "Resort & Khách Sạn Nghỉ Dưỡng",
            "name_en": "Resort & Hospitality",
            "description_vi": "Tối ưu hóa góc nhìn đại dương, đón ánh sáng tự nhiên và khả năng vận hành bền bỉ trước khí hậu biển.",
            "icon": "ri-sun-cloudy-line",
            "typical_systems": ["l180", "x80-soco80", "c65", "md65"]
        },
        {
            "id": "commercial",
            "name_vi": "Tòa Nhà & Showroom Thương Mại",
            "name_en": "Commercial & Building Facade",
            "description_vi": "Hệ mặt dựng kết cấu chịu lực, vách kính khổ lớn và cửa tự động/thủy lực lưu lượng lớn.",
            "icon": "ri-store-2-line",
            "typical_systems": ["md50-md52", "md65", "vh65-tl60"]
        },
        {
            "id": "yacht",
            "name_vi": "Du Thuyền & Công Trình Biển Mặn (Yacht Division)",
            "name_en": "Yacht & Marine Metalwork Division",
            "is_dedicated_division": True,
            "description_vi": "Phân nhánh chuyên biệt với yêu cầu vật liệu Inox 316/Nhôm kháng muối biển và tiêu chuẩn kỹ thuật hàng hải.",
            "icon": "ri-ship-line",
            "typical_systems": ["l180", "slim-130", "c65"]
        }
    ]
}

# 3. levels.json
levels_data = {
    "levels": [
        {
            "id": "essential",
            "name_vi": "Essential",
            "label_vi": "Phân Khúc Tiêu Chuẩn",
            "tagline_vi": "Functional Architectural Solutions",
            "description_vi": "Giải pháp nhôm kính thiết thực, đảm bảo 100% công năng, kết cấu bền bỉ và tối ưu chi phí đầu tư.",
            "badge_color": "#475569"
        },
        {
            "id": "premium",
            "name_vi": "Premium",
            "label_vi": "Phân Khúc Nâng Cao",
            "tagline_vi": "Enhanced Architectural Solutions",
            "description_vi": "Hoàn thiện bề mặt cao cấp, cấu hình cách âm cách nhiệt tăng cường, đa dạng tùy chọn màu sắc thời thượng.",
            "badge_color": "#0284C7"
        },
        {
            "id": "signature",
            "name_vi": "Signature",
            "label_vi": "Phân Khúc Cao Cấp",
            "tagline_vi": "High-End Architectural Systems",
            "description_vi": "Hệ nhôm rãnh C Châu Âu, hệ lùa 3 ray bản lớn và cửa Slim tối giản định hình phong cách kiến trúc tinh tế.",
            "badge_color": "#D97706"
        },
        {
            "id": "ultra-luxury",
            "name_vi": "Ultra Luxury",
            "label_vi": "Phân Khúc Độc Bản & Siêu Cao Cấp",
            "tagline_vi": "Bespoke Architectural Solutions",
            "description_vi": "Giải pháp cửa trượt nâng Panorama L180, xếp trượt khẩu độ lớn và bề mặt mạ Anodize ED cho các công trình siêu sang.",
            "badge_color": "#C9A227"
        }
    ]
}

# 4. finishes.json & colors.json
finishes_data = {
    "tiers": [
        {
            "id": "powder-coating",
            "name_vi": "Sơn Tĩnh Điện Cao Cấp",
            "name_en": "Premium Powder Coating",
            "description_vi": "Công nghệ sơn sấy tĩnh điện tự động bảo vệ bề mặt chống oxy hóa, bền màu trước tác động thời tiết.",
            "colors": [
                { "id": "white", "name_vi": "Trắng Sứ", "hex": "#F8FAFC", "is_feature": False },
                { "id": "cafe", "name_vi": "Nâu Café", "hex": "#4A3728", "is_feature": False },
                { "id": "black", "name_vi": "Đen Tiêu Chuẩn", "hex": "#1E293B", "is_feature": False },
                { "id": "wood", "name_vi": "Vân Gỗ Tự Nhiên", "hex": "#8B5A2B", "is_feature": False },
                { "id": "stone-gray", "name_vi": "Xám Đá", "hex": "#64748B", "is_feature": False },
                { "id": "metallic-gray", "name_vi": "Xám Ánh Kim", "hex": "#475569", "is_feature": True, "badge": "Màu Chủ Lực" },
                { "id": "infinity-silver-gray", "name_vi": "Xám Vô Cực Nhũ Bạc", "hex": "#334155", "is_feature": True, "badge": "Màu Độc Bản" }
            ]
        },
        {
            "id": "special-finish",
            "name_vi": "Xử Lý Bề Mặt Tinh Chỉnh",
            "name_en": "Special Architectural Finish",
            "description_vi": "Dòng hoàn thiện bề mặt mờ sâu và xử lý chuyên dụng cho không gian nội thất cao cấp.",
            "colors": [
                { "id": "matte-black", "name_vi": "Đen Mờ (Matte Black)", "hex": "#0F172A", "is_feature": False },
                { "id": "anode-black", "name_vi": "Đen Anode", "hex": "#18181B", "is_feature": True },
                { "id": "matte-gold", "name_vi": "Vàng Mờ (Matte Gold)", "hex": "#CA8A04", "is_feature": False }
            ]
        },
        {
            "id": "anodize-ed",
            "name_vi": "Mạ Anodize ED · Champagne Series",
            "name_en": "Anodize ED Champagne Series",
            "description_vi": "Công nghệ mạ điện di (Electrodeposition Anodizing) tạo lớp phủ cứng vững chống ăn mòn muối biển, phù hợp cho môi trường ven biển và du thuyền.",
            "colors": [
                { "id": "champagne-v8", "name_vi": "Champagne V8", "hex": "#D4AF37", "is_feature": True, "badge": "Cao Cấp Ngoài Trời" },
                { "id": "champagne-y01", "name_vi": "Champagne Y01", "hex": "#E5C158", "is_feature": True, "badge": "Kháng Khí Hậu Biển" }
            ]
        }
    ]
}

# 5. applications.json
applications_data = {
    "applications": [
        { "id": "main-entrance", "name_vi": "Cửa Đi Chính Sảnh", "group": "door" },
        { "id": "balcony-sliding", "name_vi": "Cửa Đi Ban Công Lùa", "group": "door" },
        { "id": "living-panorama", "name_vi": "Cửa Panorama Phòng Khách", "group": "door" },
        { "id": "bedroom-door", "name_vi": "Cửa Đi Thông Phòng", "group": "door" },
        { "id": "window-casement", "name_vi": "Cửa Sổ Mở Quay / Hất", "group": "window" },
        { "id": "window-sliding", "name_vi": "Cửa Sổ Lùa Trượt", "group": "window" },
        { "id": "garden-folding", "name_vi": "Cửa Xếp Trượt Sân Vườn", "group": "door" },
        { "id": "slim-interior-partition", "name_vi": "Vách Kính & Cửa Slim Nội Thất", "group": "slim" },
        { "id": "slim-exterior-door", "name_vi": "Cửa Slim Ngoại Thất Chịu Lực", "group": "slim" },
        { "id": "curtain-wall-facade", "name_vi": "Mặt Dựng Vách Kính Tòa Nhà", "group": "facade" }
    ]
}

# 6. systems.json (16 Systems)
systems_data = {
    "version": "1.0",
    "total_systems": 16,
    "systems": [
        # GROUP 01 — OPENING
        {
            "id": "xf55-flat",
            "code": "XF55-FLAT",
            "name": "Xingfa 55 Cánh Phẳng",
            "raw_code": "XF55 (Seaaluk, Yongxing)",
            "group_id": "opening",
            "brands": ["Sea Aluki", "Yongxing"],
            "market_ids": ["residential", "apartment", "villa"],
            "level": { "recommended_value": "essential", "status": "pending_verification" },
            "applications": ["Cửa đi mở quay 1-2-4 cánh", "Cửa sổ mở quay", "Cửa sổ mở hất"],
            "glassCompatibility": {
                "status": "pending_verification",
                "types": ["Kính dán an toàn 6.38 - 10.38mm", "Kính cường lực 8 - 10mm", "Kính hộp cách âm"]
            },
            "finishes": {
                "powderColors": ["white", "cafe", "black", "wood", "stone-gray", "metallic-gray", "infinity-silver-gray"],
                "specialColors": [],
                "anodizeColors": ["champagne-v8", "champagne-y01"]
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "profile_structure": "Thanh nhôm định hình hệ 55 cánh phẳng",
                "corner_connection": "Ép góc kỹ thuật số hoặc bắt ke vĩnh cửu"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-yongxing.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Cửa Nhôm Xingfa 55 Cánh Phẳng",
                "tagline": "Thiết kế phẳng hiện đại, tối ưu công năng đóng mở",
                "description": "Hệ nhôm cánh phẳng tạo mặt phẳng tinh tế giữa khung bao và cánh cửa, phù hợp cho kiến trúc nhà phố và căn hộ hiện đại.",
                "is_featured": False
            }
        },
        {
            "id": "xf55-multi",
            "code": "XF55-MULTI",
            "name": "Xingfa 55 Đa Khoang",
            "raw_code": "XF55 (Seaaluk, Yongxing)",
            "group_id": "opening",
            "brands": ["Sea Aluki", "Yongxing"],
            "market_ids": ["apartment", "villa", "hospitality"],
            "level": { "recommended_value": "premium", "status": "pending_verification" },
            "applications": ["Cửa đi cách âm cao cấp", "Cửa sổ chống ồn tầng cao"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính hộp cách âm cách nhiệt", "Kính an toàn"] },
            "finishes": {
                "powderColors": ["white", "cafe", "black", "wood", "stone-gray", "metallic-gray", "infinity-silver-gray"],
                "specialColors": [],
                "anodizeColors": ["champagne-v8", "champagne-y01"]
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "profile_structure": "Cấu trúc đa khoang tăng cường khả năng cách âm cách nhiệt"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-yongxing.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Cửa Nhôm Xingfa 55 Đa Khoang",
                "tagline": "Cách âm vượt trội và độ cứng vững tăng cường",
                "description": "Cấu trúc nhiều khoang rỗng bên trong giúp triệt tiêu sóng âm và tối ưu hóa hiệu quả tiết kiệm năng lượng điều hòa.",
                "is_featured": False
            }
        },
        {
            "id": "c55",
            "code": "C55",
            "name": "C55 (Rãnh C Châu Âu)",
            "raw_code": "Seaaluk C65",
            "group_id": "opening",
            "brands": ["Sea Aluki"],
            "market_ids": ["villa", "residence", "hospitality"],
            "level": { "recommended_value": "signature", "status": "pending_verification" },
            "applications": ["Cửa đi mở quay tiêu chuẩn Châu Âu", "Cửa sổ rãnh C đồng bộ phụ kiện cao cấp"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính cường lực", "Kính hộp"] },
            "finishes": {
                "powderColors": ["metallic-gray"],
                "specialColors": [],
                "anodizeColors": []
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "groove_standard": "Tiêu chuẩn rãnh C Châu Âu (Euro-Groove Standard)"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-yongxing.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Cửa Nhôm C55 Tiêu Chuẩn Rãnh C Châu Âu",
                "tagline": "Tích hợp phụ kiện rãnh C đồng bộ chuẩn quốc tế",
                "description": "Giải pháp đồng bộ với các dòng phụ kiện Châu Âu cao cấp như Cmech, Hopo, Sigico, vận hành đầm chắc và bền bỉ.",
                "is_featured": False
            }
        },
        {
            "id": "c65",
            "code": "C65",
            "name": "C65 (Rãnh C Châu Âu)",
            "raw_code": "Seaaluk C75, Yongxing C65",
            "group_id": "opening",
            "brands": ["Sea Aluki", "Yongxing"],
            "market_ids": ["villa", "residence", "hospitality", "yacht"],
            "level": { "recommended_value": "signature", "status": "pending_verification" },
            "applications": ["Cửa đi mở quay kích thước lớn", "Cửa ban công biệt thự view biển"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính hộp Low-E", "Kính dán an toàn dày"] },
            "finishes": {
                "powderColors": ["metallic-gray", "infinity-silver-gray"],
                "specialColors": [],
                "anodizeColors": ["champagne-v8", "champagne-y01"]
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "groove_standard": "Rãnh C Châu Âu tăng cứng bản cánh"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-yongxing.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Cửa Nhôm Cao Cấp C65 Rãnh C",
                "tagline": "Bề thế, chịu áp lực gió lớn và thẩm mỹ tinh xảo",
                "description": "Hệ profile bản lớn chắc khỏe, tích hợp gioăng EPDM 3 lớp và phụ kiện rãnh C đa điểm cho cửa biệt thự và công trình ven biển.",
                "is_featured": True
            }
        },
        {
            "id": "xfv55",
            "code": "XFV55",
            "name": "XFV55 Vát Cạnh 55",
            "raw_code": "XFV55 (Seaaluk, Yongxing)",
            "group_id": "opening",
            "brands": ["Sea Aluki", "Yongxing"],
            "market_ids": ["residential", "apartment"],
            "level": { "recommended_value": "essential", "status": "pending_verification" },
            "applications": ["Cửa đi mở quay", "Cửa sổ mở hất / mở quay"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính dán an toàn", "Kính cường lực"] },
            "finishes": {
                "powderColors": ["white", "cafe", "black", "wood", "stone-gray", "metallic-gray", "infinity-silver-gray"],
                "specialColors": [],
                "anodizeColors": []
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "profile_structure": "Mép chỉ vát cạnh thanh thoát, chống bám bụi nước"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-yongxing.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Cửa Nhôm XFV55 Vát Cạnh",
                "tagline": "Đường nét vát cạnh mềm mại, hạn chế bám bụi bẩn",
                "description": "Thiết kế gờ vát cạnh tạo điểm nhấn thanh thoát trên khung cửa, đồng thời giúp thoát nước nhanh và dễ dàng vệ sinh.",
                "is_featured": False
            }
        },

        # GROUP 02 — SLIDING & PANORAMA
        {
            "id": "xf93",
            "code": "XF93",
            "name": "Xingfa 93 Cửa Lùa",
            "raw_code": "XF93 (Seaaluk, Yongxing)",
            "group_id": "sliding-panorama",
            "brands": ["Sea Aluki", "Yongxing"],
            "market_ids": ["residential", "apartment"],
            "level": { "recommended_value": "essential", "status": "pending_verification" },
            "applications": ["Cửa đi lùa 2 cánh, 4 cánh", "Cửa sổ lùa trượt"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính an toàn 6.38 - 8.38mm", "Kính cường lực 8mm"] },
            "finishes": {
                "powderColors": ["white", "cafe", "black", "wood", "stone-gray", "metallic-gray", "infinity-silver-gray"],
                "specialColors": [],
                "anodizeColors": []
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "rail_type": "Ray trượt đôi 2 ray kết hợp bánh xe chịu tải"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-yongxing.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Cửa Lùa Xingfa 93 Tiêu Chuẩn",
                "tagline": "Vận hành êm nhẹ, tiết kiệm tối đa diện tích đóng mở",
                "description": "Giải pháp cửa trượt truyền thống hiệu quả cao cho không gian ban công nhà phố, căn hộ và lối ra sân sau.",
                "is_featured": False
            }
        },
        {
            "id": "l94-l95",
            "code": "L94-L95",
            "name": "L94 / L95 Cửa Lùa",
            "raw_code": "L94, L95 (Seaaluk, Yongxing)",
            "group_id": "sliding-panorama",
            "brands": ["Sea Aluki", "Yongxing"],
            "market_ids": ["apartment", "villa", "residence"],
            "level": { "recommended_value": "premium", "status": "pending_verification" },
            "applications": ["Cửa đi lùa ban công lớn", "Cửa sổ trượt cách âm"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính cường lực 10mm", "Kính hộp"] },
            "finishes": {
                "powderColors": ["stone-gray", "metallic-gray", "infinity-silver-gray"],
                "specialColors": [],
                "anodizeColors": ["champagne-v8", "champagne-y01"]
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "rail_type": "Ray inox chống mài mòn, bánh xe đôi êm nhẹ"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-yongxing.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Cửa Lùa Nâng Cấp L94 / L95",
                "tagline": "Khung nhôm dày dặn, ray trượt Inox lướt êm ái",
                "description": "Cải tiến với ray Inox chống rỉ sét và bánh xe bi kép giúp cánh cửa trượt êm mượt ngay cả với khổ kính lớn.",
                "is_featured": False
            }
        },
        {
            "id": "l120",
            "code": "L120",
            "name": "L120 Cửa Lùa 3 Ray",
            "raw_code": "L120 (Seaaluk, Yongxing)",
            "group_id": "sliding-panorama",
            "brands": ["Sea Aluki", "Yongxing"],
            "market_ids": ["villa", "residence", "hospitality"],
            "level": { "recommended_value": "signature", "status": "pending_verification" },
            "applications": ["Cửa lùa 3 ray mở 2/3 diện tích ô chờ", "Cửa phòng khách liên kết sân vườn"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính an toàn dày", "Kính hộp cách âm"] },
            "finishes": {
                "powderColors": ["metallic-gray", "infinity-silver-gray"],
                "specialColors": [],
                "anodizeColors": ["champagne-v8", "champagne-y01"]
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "rail_type": "Hệ 3 ray trượt độc lập, tích hợp ray lưới chống côn trùng"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-yongxing.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Cửa Lùa 3 Ray Khẩu Độ Lớn L120",
                "tagline": "Giải phóng 67% diện tích mở, tối đa hóa lưu thông gió",
                "description": "Hệ 3 ray thông minh cho phép lùa xếp 3 cánh về một phía, mở rộng tầm nhìn sân vườn và đón gió tự nhiên tối đa.",
                "is_featured": True
            }
        },
        {
            "id": "l180",
            "code": "L180",
            "name": "L180 Panorama Lift & Slide",
            "raw_code": "L180 (Seaaluk, Yongxing)",
            "group_id": "sliding-panorama",
            "brands": ["Sea Aluki", "Yongxing"],
            "market_ids": ["villa", "penthouse", "hospitality", "yacht"],
            "level": { "recommended_value": "ultra-luxury", "status": "pending_verification" },
            "applications": ["Cửa trượt nâng khổ lớn Panorama", "Cửa phòng khách biệt thự hướng biển", "Penthouse view 360°"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính hộp Low-E dán an toàn 2 lớp", "Kính phản quang Solar"] },
            "finishes": {
                "powderColors": ["metallic-gray", "infinity-silver-gray"],
                "specialColors": [],
                "anodizeColors": ["champagne-v8", "champagne-y01"]
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "mechanism": "Cơ cấu trượt nâng (Lift and Slide) hạ gioăng ép kín nước tuyệt đối khi đóng"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-yongxing.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Cửa Trượt Nâng Panorama Siêu Khổ L180",
                "tagline": "Kiến tạo tầm nhìn vô cực cho kiến trúc đặc biệt",
                "description": "Đỉnh cao của giải pháp cửa trượt kiến trúc: Cơ cấu Lift & Slide nâng hạ cánh khi trượt, chịu tải trọng cánh siêu lớn và kín khít hoàn hảo trước gió bão biển.",
                "is_featured": True
            }
        },

        # GROUP 03 — SLIM
        {
            "id": "slim-40",
            "code": "SEA-SLIM40",
            "name": "Slim 40 Nội Thất",
            "raw_code": "SEA-SLIM40",
            "group_id": "slim",
            "brands": ["Sea Aluki"],
            "market_ids": ["apartment", "villa", "residence"],
            "level": { "recommended_value": "signature", "status": "pending_verification" },
            "applications": ["Cửa lùa không ray dưới", "Cửa mở quay phòng ngủ/vệ sinh", "Vách ngăn phòng khách và bếp"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính dán an toàn 8.38mm phôi siêu trong", "Kính gân sọc Fluted"] },
            "finishes": {
                "powderColors": ["metallic-gray"],
                "specialColors": ["matte-black", "anode-black", "matte-gold"],
                "anodizeColors": []
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "rail_type": "Treo trên không ray dưới, tích hợp giảm chấn 2 chiều đóng mở êm"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-cua-nhom-slim-catalogue-tai-lieu-ky-thuat-cua-nhom-slim.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Nhôm Slim 40 Tối Giản Nội Thất",
                "tagline": "Khung viền siêu mỏng, không ray dưới liền mạch mặt sàn",
                "description": "Giải pháp ngăn chia không gian tinh tế không cần ray dưới chân, tạo cảm giác sàn nhà liền mạch và thông thoáng tuyệt đối.",
                "is_featured": True
            }
        },
        {
            "id": "slim-130",
            "code": "SEA-SLIM-L130",
            "name": "Slim 130 Ngoại Thất",
            "raw_code": "SEA-SLIM-L130",
            "group_id": "slim",
            "brands": ["Sea Aluki"],
            "market_ids": ["villa", "residence", "hospitality", "yacht"],
            "level": { "recommended_value": "ultra-luxury", "status": "pending_verification" },
            "applications": ["Cửa Slim ban công ngoài trời", "Cửa lùa Slim mặt tiền chịu gió bão"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính cường lực an toàn dày", "Kính hộp"] },
            "finishes": {
                "powderColors": ["metallic-gray"],
                "specialColors": [],
                "anodizeColors": []
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "structure": "Khung nhôm Slim gia cường kết cấu chịu tải gió ngoài trời"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-cua-nhom-slim-catalogue-tai-lieu-ky-thuat-cua-nhom-slim.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Cửa Nhôm Slim 130 Ngoại Thất Chịu Lực",
                "tagline": "Vẻ đẹp thanh mảnh tối giản nhưng vững chãi trước mưa bão ngoài trời",
                "description": "Kết hợp hoàn hảo giữa ngôn ngữ thiết kế Minimalist khung siêu mỏng và khả năng chịu áp lực gió, kín nước tiêu chuẩn ngoài trời.",
                "is_featured": True
            }
        },

        # GROUP 04 — SPECIAL
        {
            "id": "vh65-tl60",
            "code": "VH65-TL60",
            "name": "Cửa Thủy Lực Bản Lớn",
            "raw_code": "Yongxing VH65, Seaaluk TL60",
            "group_id": "special",
            "brands": ["Yongxing", "Sea Aluki"],
            "market_ids": ["villa", "commercial", "residence"],
            "level": { "recommended_value": "signature", "status": "pending_verification" },
            "applications": ["Cửa chính đại sảnh biệt thự", "Cửa showroom / tòa nhà thương mại"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính cường lực 10 - 12mm", "Kính dán an toàn 2 lớp"] },
            "finishes": {
                "powderColors": ["white", "cafe", "black", "wood", "stone-gray", "metallic-gray", "infinity-silver-gray"],
                "specialColors": [],
                "anodizeColors": []
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "sub_codes": { "yongxing": "VH65", "seaaluk": "TL60" },
                "mechanism": "Bản lề sàn thủy lực chịu tải trọng cánh lớn đóng mở 2 chiều êm ái"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-yongxing.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Cửa Thủy Lực Bản Cánh Lớn Bề Thế",
                "tagline": "Khung nhôm bản dày vững chãi, tôn vinh vị thế sảnh đón tiếp",
                "description": "Khung nhôm bản to kết hợp kính cường lực dày và phụ kiện bản lề sàn thủy lực, đóng mở 2 chiều êm ái cho cửa chính biệt thự.",
                "is_featured": False
            }
        },
        {
            "id": "f63",
            "code": "F63",
            "name": "Cửa Xếp Trượt 63",
            "raw_code": "Yongxing F63",
            "group_id": "special",
            "brands": ["Yongxing"],
            "market_ids": ["villa", "residence", "hospitality"],
            "level": { "recommended_value": "premium", "status": "pending_verification" },
            "applications": ["Cửa xếp trượt 3-4-6 cánh ra sân vườn", "Vách ngăn xếp gọn đa năng"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính cường lực", "Kính dán an toàn"] },
            "finishes": {
                "powderColors": ["infinity-silver-gray"],
                "specialColors": [],
                "anodizeColors": []
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "system_type": "Xếp trượt ray trên kết hợp ray dẫn hướng dưới"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-yongxing.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Cửa Xếp Trượt Đa Cánh F63",
                "tagline": "Màu Xám Vô Cực Nhũ Bạc sang trọng, xếp gọn tối ưu không gian",
                "description": "Giải pháp mở rộng khẩu độ lớn bằng cách xếp gọn các cánh cửa về hai bên, xóa nhòa ranh giới giữa nội thất và ngoại thất.",
                "is_featured": False
            }
        },
        {
            "id": "x80-soco80",
            "code": "X80-SOCO80",
            "name": "Cửa Xếp Trượt 80",
            "raw_code": "Seaaluk X80, Yongxing Soco80",
            "group_id": "special",
            "brands": ["Sea Aluki", "Yongxing"],
            "market_ids": ["villa", "residence", "hospitality"],
            "level": { "recommended_value": "ultra-luxury", "status": "pending_verification" },
            "applications": ["Cửa xếp trượt khẩu độ lớn resort", "Cửa biệt thự sân vườn hồ bơi"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính hộp cách âm", "Kính an toàn dày"] },
            "finishes": {
                "powderColors": ["metallic-gray", "infinity-silver-gray"],
                "specialColors": [],
                "anodizeColors": []
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "sub_codes": { "seaaluk": "X80", "yongxing": "Soco80" },
                "roller_system": "Cụm bánh xe treo chịu tải trọng nặng chống võng xệ"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-soco-dinh-hinh-phong-cach-kien-truc-chau-au.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Cửa Xếp Trượt Khẩu Độ Siêu Rộng X80 / Soco80",
                "tagline": "Chịu tải trọng cánh lớn, vận hành mượt mà cho biệt thự nghỉ dưỡng",
                "description": "Hệ profile rãnh C bản 80 chịu lực cao, cho phép thiết kế các cánh cửa cao và rộng, tạo lối đi thông thoáng kết nối trọn vẹn cảnh quan bên ngoài.",
                "is_featured": True
            }
        },

        # GROUP 05 — FACADE
        {
            "id": "md50-md52",
            "code": "MD50-MD52",
            "name": "Mặt Dựng MD50 / MD52",
            "raw_code": "Seaaluk, Yongxing",
            "group_id": "facade",
            "brands": ["Sea Aluki", "Yongxing"],
            "market_ids": ["commercial", "hospitality", "villa"],
            "level": { "recommended_value": "signature", "status": "pending_verification" },
            "applications": ["Mặt dựng vách kính lộ đố", "Mặt dựng vách kính giấu đố", "Vách kính thông tầng biệt thự"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính hộp phản quang Low-E", "Kính dán an toàn 2 lớp"] },
            "finishes": {
                "powderColors": ["white", "cafe", "black", "wood", "stone-gray", "metallic-gray", "infinity-silver-gray"],
                "specialColors": [],
                "anodizeColors": []
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "facade_type": "Hệ mặt dựng Stick lộ đố / giấu đố bản 50-52mm"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-yongxing.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Vách Kính Mặt Dựng MD50 / MD52",
                "tagline": "Tối ưu hóa khả năng đón sáng và tạo diện mạo hiện đại cho công trình",
                "description": "Giải pháp vách kính mặt tiền và thông tầng cho văn phòng, showroom và biệt thự hiện đại với hai tùy chọn giấu đố liền mạch hoặc lộ đố khỏe khoắn.",
                "is_featured": False
            }
        },
        {
            "id": "md65",
            "code": "MD65",
            "name": "Mặt Dựng Khổ Lớn MD65",
            "raw_code": "Seaaluk, Yongxing",
            "group_id": "facade",
            "brands": ["Sea Aluki", "Yongxing"],
            "market_ids": ["commercial", "hospitality", "villa"],
            "level": { "recommended_value": "ultra-luxury", "status": "pending_verification" },
            "applications": ["Mặt dựng tòa nhà cao tầng", "Vách kính khổ lớn chịu áp lực gió cao", "Khách sạn ven biển"],
            "glassCompatibility": { "status": "pending_verification", "types": ["Kính hộp Low-E 24-28mm", "Kính cường lực an toàn khổ lớn"] },
            "finishes": {
                "powderColors": ["white", "cafe", "black", "wood", "stone-gray", "metallic-gray", "infinity-silver-gray"],
                "specialColors": [],
                "anodizeColors": []
            },
            "technicalSpecs": {
                "status": "pending_verification",
                "facade_type": "Hệ mặt dựng bản 65mm gia cường chống võng dầm kính nhịp lớn"
            },
            "documents": { "catalogue": "assets/docs/downloads/catalogue-nhom-yongxing.pdf", "cad": None },
            "marketing": {
                "title_vi": "Hệ Mặt Dựng Kiến Trúc Khổ Lớn MD65",
                "tagline": "Giải pháp mặt dựng cho công trình quy mô và yêu cầu kỹ thuật cao",
                "description": "Bản nhôm kết cấu 65mm vững chãi chịu tải trọng kính lớn và áp lực gió bão cao tầng, tối ưu cho tòa nhà biểu tượng và resort ven biển.",
                "is_featured": True
            }
        }
    ]
}

# 7. verification.json
verification_data = {
    "policy": "No unverified technical parameters or absolute warranty claims shall be published without manufacturer test reports or official certificates.",
    "status_definitions": {
        "verified": "Thông số đã được đối chiếu và xác minh với hồ sơ kỹ thuật chính thức từ nhà máy sản xuất.",
        "pending_verification": "Thông số đang trong quá trình chờ cung cấp và xác thực tài liệu từ đối tác/nhà máy.",
        "not_available": "Thông số chưa có sẵn hoặc được sản xuất theo yêu cầu đặt hàng riêng (Bespoke)."
    },
    "anodize_ed_warranty_claim_policy": {
        "status": "pending_official_warranty_certificate",
        "guideline": "Hiển thị 'Anodize ED | Champagne Series — Lựa chọn hoàn thiện phù hợp cho công trình ngoài trời và ven biển'. Chỉ công bố mốc '15 năm' khi có chứng thư bảo hành chính thức."
    },
    "nda_policy": {
        "wording": "Hỗ trợ tiếp nhận hồ sơ dự án theo thỏa thuận bảo mật (NDA) khi có yêu cầu."
    }
}

# Write all JSON files
files_map = {
    "groups.json": groups_data,
    "markets.json": markets_data,
    "levels.json": levels_data,
    "finishes.json": finishes_data,
    "colors.json": finishes_data, # alias for convenience
    "applications.json": applications_data,
    "systems.json": systems_data,
    "verification.json": verification_data
}

for filename, content in files_map.items():
    file_path = os.path.join(data_dir, filename)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    print(f"✅ Generated: {file_path}")

print(f"\n🎉 PHASE 1 SUCCESS: All {len(files_map)} JSON data files created successfully in {data_dir}!")
