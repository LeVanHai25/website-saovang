import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"d:\Sao Vàng\Website-SaoVang\website\assets\images\projects"

projects_config = [
    {
        "id": "sv-proj-yacht-tulip",
        "slug": "yacht-tulip",
        "sector": "yacht-metalwork",
        "system": "yacht-railing",
        "badge": "Du Thuyền 5 Sao",
        "title": "Du Thuyền Nghỉ Dưỡng Tulip Cruise (5 Sao)",
        "client": "Công ty Du thuyền Quốc tế Tulip Cruise",
        "location": "Vịnh Hạ Long & Vịnh Lan Hạ, Quảng Ninh",
        "scale": "Du thuyền nghỉ dưỡng 5 sao vỏ thép, 4 tầng boong (48 phòng nghỉ VIP)",
        "categories": [
            "Lan can Inox 316 hàng hải toàn bộ 4 tầng boong",
            "Lan can kính mạn tàu & boong ngắm cảnh Sundeck 360 độ",
            "Hệ thống máng thu thoát nước Inox 316 kín nước tuyệt đối",
            "Hệ louver điều hòa, lam chắn gió buồng máy và nẹp chỉ trang trí"
        ],
        "materials": "100% Inox 316 & 316L Marine Grade, Kính dán an toàn 2 lớp 15.52mm, Bulông Inox 316",
        "finishing": "Đánh bóng gương siêu mịn (Mirror Polish Ra < 0.2µm) & Xước Satin sang trọng",
        "timeline": "90 ngày (Khảo sát lấy dưỡng tại vỏ tàu -> Chế tác xưởng -> Lắp dựng hoàn thiện)",
        "value": "~2.4 Tỷ VNĐ",
        "description": "Dự án du thuyền nghỉ dưỡng siêu sang chuẩn quốc tế tại Vịnh Hạ Long, đòi hỏi toàn bộ cấu kiện kim loại phải sử dụng chuẩn mác thép Inox 316 kháng ăn mòn muối biển khắt khe và độ hoàn thiện bóng gương không tì vết để phục vụ khách du lịch thượng lưu.",
        "highlights": [
            "Toàn bộ đường ống Inox 316 được uốn 3D bám sát 100% độ cong khí động học của thân vỏ tàu.",
            "Xử lý thụ động hóa mối hàn (Passivation) ngăn chặn triệt để hiện tượng ăn mòn rỗ (pitting) trong môi trường biển mặn.",
            "Hệ lan can kính vô cực boong Sundeck chịu tải trọng gió bão cấp cao và triệt tiêu rung chấn khi tàu hành trình."
        ]
    },
    {
        "id": "sv-proj-villa-anvuong",
        "slug": "villa-an-vuong",
        "sector": "residential-metalwork",
        "system": "balustrade-railing",
        "badge": "Biệt Thự Cao Cấp",
        "title": "Biệt Thự Cao Cấp An Vượng Villa",
        "client": "Tư gia Chủ đầu tư (KĐT Nam Cường)",
        "location": "Phân khu An Vượng Villa, KĐT Dương Nội, Hà Đông, Hà Nội",
        "scale": "Biệt thự song lập 3 tầng + 1 tum (Diện tích sàn ~450m²)",
        "categories": [
            "Hệ lan can kính cường lực an toàn âm sàn toàn bộ ban công mặt tiền",
            "Tay vịn Inox 304 xước mờ Hairline gia công uốn góc liền khối",
            "Khung kim loại bảo vệ, lam trang trí giếng trời & sảnh đón",
            "Chi tiết nẹp hoàn thiện liên kết đa vật liệu (kim loại - kính - đá)"
        ],
        "materials": "Inox 304 Architectural Grade, Kính dán an toàn 2 lớp 13.52mm Low-Iron siêu trong, Chân ngàm Inox đúc",
        "finishing": "Xước mịn Hairline tinh tế, Sơn sấy nhiệt ngoài trời",
        "timeline": "45 ngày (Lập Shop Drawing -> Chế tác -> Thi công hoàn thiện)",
        "value": "~680 Triệu VNĐ",
        "description": "Dự án biệt thự phong cách hiện đại tối giản (Minimalism), đòi hỏi hệ lan can ban công mở rộng tối đa tầm nhìn cảnh quan mà vẫn đảm bảo độ chịu lực, an toàn tuyệt đối và tính thẩm mỹ đồng nhất với kiến trúc tổng thể.",
        "highlights": [
            "Kỹ thuật ngàm kính âm sàn triệt tiêu hoàn toàn trụ đỡ lộ ra ngoài, tạo hiệu ứng kính tràn viền vô cực sang trọng.",
            "Khe ngàm được chèn đệm cao su kỹ thuật EPDM chống rung lắc và chống nứt kính dưới áp lực gió tầng cao.",
            "Tay vịn Inox xước Hairline đồng màu, mối ghép phẳng mịn không gờ mép."
        ]
    },
    {
        "id": "sv-proj-yacht-azura",
        "slug": "yacht-azura",
        "sector": "yacht-metalwork",
        "system": "yacht-railing",
        "badge": "Du Thuyền Nghỉ Dưỡng",
        "title": "Du Thuyền Nghỉ Dưỡng Azura Cruise",
        "client": "Đơn vị Quản lý Khai thác Du thuyền Azura",
        "location": "Cảng Tuần Châu / Vịnh Hạ Long, Quảng Ninh",
        "scale": "Du thuyền tham quan & nghỉ dưỡng cao cấp 3 tầng",
        "categories": [
            "Lan can mạn tàu Inox 316 đánh bóng gương cao cấp",
            "Hệ lan can vách kính boong trên và khu vực mũi tàu",
            "Cụm Louver kỹ thuật thoát nhiệt hệ thống điều hòa trung tâm",
            "Máng xối Inox và cầu thang leo boong kỹ thuật"
        ],
        "materials": "Inox 316 Marine Grade, Kính cường lực an toàn 12mm, Phụ kiện Inox 316",
        "finishing": "Đánh bóng gương (Mirror Polish) & Hoàn thiện Satin mờ",
        "timeline": "60 ngày",
        "value": "~1.6 Tỷ VNĐ",
        "description": "Hạng mục cơ khí hoàn thiện du thuyền Azura Cruise tập trung vào hệ thống lan can và vách kính mở rộng tối đa tầm nhìn cho du khách, đồng thời hệ thống louver buồng máy vận hành thông gió tối ưu chống đọng muối.",
        "highlights": [
            "Chân ngàm kính cắt CNC từ phôi Inox 316 nguyên khối chịu lực va đập của sóng gió cấp cao.",
            "Các cụm module được chia nhỏ thông minh, lắp ghép nhanh chóng tại bến tàu mà không ảnh hưởng đến tiến độ đóng tàu.",
            "Bề mặt Inox 316 xử lý bóng gương hoàn hảo, tăng vẻ tráng lệ khi phản chiếu ánh hoàng hôn trên vịnh."
        ]
    },
    {
        "id": "sv-proj-villa-dothanh",
        "slug": "villa-do-thanh",
        "sector": "residential-metalwork",
        "system": "staircase-handrail",
        "badge": "Biệt Thự Tư Gia",
        "title": "Biệt Thự Đô Thành Villa",
        "client": "Tư gia Chủ đầu tư cao cấp",
        "location": "Khu Biệt thự Đô Thành, Việt Nam",
        "scale": "Biệt thự đơn lập sân vườn (Diện tích sàn ~600m²)",
        "categories": [
            "Cầu thang kết cấu thép bản dày kết hợp tay vịn kim loại chế tác",
            "Hệ lan can ban công thép định hình sơn hoàn thiện cao cấp",
            "Hàng rào kim loại bảo vệ khuôn viên đồng bộ phong cách kiến trúc",
            "Khung trang trí kim loại khu vực logia và hiên sau"
        ],
        "materials": "Thép kết cấu SS400, Inox 304, Hệ sơn Epoxy giàu kẽm + Sơn phủ PU chống thời tiết",
        "finishing": "Sơn hoàn thiện PU 2 thành phần ngoài trời, Mối hàn xử lý phẳng mịn",
        "timeline": "60 ngày",
        "value": "~850 Triệu VNĐ",
        "description": "Tổ hợp cơ khí kiến trúc hoàn thiện từ nội thất đến ngoại thất cho biệt thự, yêu cầu cao về độ cứng vững của kết cấu xương thang chịu lực và độ phẳng mịn của các mối hàn nối kim loại.",
        "highlights": [
            "Kết cấu dầm thép cầu thang được tính toán ứng suất chính xác, triệt tiêu độ rung khi di chuyển.",
            "Toàn bộ mối ghép thép được mài phẳng và xử lý bề mặt trước khi sơn, tạo bề mặt nhẵn bóng không vết nối.",
            "Hàng rào thép hộp mạ kẽm sơn phủ 4 lớp bền màu trên 10 năm."
        ]
    },
    {
        "id": "sv-proj-yacht-calista",
        "slug": "yacht-calista",
        "sector": "yacht-metalwork",
        "system": "yacht-louver",
        "badge": "Du Thuyền Boutique",
        "title": "Du Thuyền Calista Cruise",
        "client": "Calista Cruises Vietnam",
        "location": "Vịnh Hạ Long, Tỉnh Quảng Ninh",
        "scale": "Du thuyền du lịch boutique sang trọng",
        "categories": [
            "Hệ louver thông gió và lấy khí tươi điều hòa buồng máy chống tạt nước",
            "Hệ thống máng thoát nước boong Inox gia công uốn theo độ dốc thoát nước",
            "Tay vịn Inox boong tàu và khu vực nhà hàng ngoài trời",
            "Nẹp chỉ kim loại ốp trang trí ngoại thất cabin"
        ],
        "materials": "Inox 316 & 316L Marine Grade chuyên dụng",
        "finishing": "Satin Hairline & Đánh bóng gương",
        "timeline": "45 ngày",
        "value": "~1.1 Tỷ VNĐ",
        "description": "Tập trung vào các chi tiết cơ khí kỹ thuật chuyên sâu của du thuyền Calista Cruise, nơi xử lý thoát nước và đối lưu khí buồng máy đòi hỏi độ chính xác tuyệt đối theo đường cong thân tàu.",
        "highlights": [
            "Cấu tạo louver khí động học 2 lớp: ngăn 99% tia nước biển tạt vào nhưng vẫn đảm bảo lưu lượng gió làm mát máy phát điện.",
            "Đường hàn TIG vi sinh phẳng nhẵn bên trong lòng máng nước giúp nước thoát nhanh, không đọng cặn bẩn.",
            "Vật tư 100% Inox 316L chống rỗ bề mặt trong môi trường biển nhiệt đới."
        ]
    },
    {
        "id": "sv-proj-villa-linhhue",
        "slug": "villa-linh-hue",
        "sector": "residential-metalwork",
        "system": "gate-fence",
        "badge": "Biệt Thự Tân Cổ Điển",
        "title": "Biệt Thự Linh Huệ Villa",
        "client": "Gia đình Anh/Chị Linh Huệ",
        "location": "Khu biệt thự cao cấp, Việt Nam",
        "scale": "Biệt thự lâu đài tân cổ điển (Diện tích khuôn viên ~800m²)",
        "categories": [
            "Cổng chính biệt thự bằng thép & inox kết cấu mỹ thuật mạ màu cao cấp",
            "Hệ thống bản lề chịu tải lớn tích hợp motor cổng tự động âm sàn",
            "Lan can ban công uốn lượn phong cách tân cổ điển",
            "Hàng rào kim loại bao quanh khuôn viên và cổng phụ"
        ],
        "materials": "Thép rèn đặc uốn mỹ thuật, Khung chịu lực Inox/Thép bản dày, Sơn bảo vệ 4 lớp",
        "finishing": "Sơn giả cổ đồng cao cấp phủ bóng bảo vệ ngoài trời",
        "timeline": "50 ngày",
        "value": "~920 Triệu VNĐ",
        "description": "Cổng chính và hàng rào đóng vai trò là điểm nhấn nhận diện thương quyền của toàn bộ công trình, đòi hỏi kỹ thuật uốn uốn cong kim loại chính xác theo bản vẽ phối cảnh của Kiến trúc sư.",
        "highlights": [
            "Cổng nặng hơn 1 tấn nhưng vận hành đóng mở êm ái nhờ hệ bản lề cơ khí gia công CNC chính xác.",
            "Lớp sơn phủ chống ngả màu và chống rỉ sét đạt độ bền màu trên 10 năm trước thời tiết khắc nghiệt.",
            "Họa tiết kim loại được đúc và uốn thủ công tinh xảo, tỷ lệ cân đối hoàn hảo."
        ]
    },
    {
        "id": "sv-proj-yacht-leona",
        "slug": "yacht-leona",
        "sector": "yacht-metalwork",
        "system": "yacht-railing",
        "badge": "Du Thuyền Tham Quan",
        "title": "Du Thuyền Leona Cruise Hạ Long",
        "client": "Leona Cruise Group",
        "location": "Cảng tàu khách Quốc tế Hạ Long, Quảng Ninh",
        "scale": "Du thuyền tham quan trong ngày (Day Cruise) chuẩn VIP",
        "categories": [
            "Lan can Inox 316 boong ngắm cảnh tầng 2 và tầng 3",
            "Vách kính chắn gió phía trước mũi tàu",
            "Khung cửa Inox và tay vịn hành lang du khách",
            "Máng nước Inox và phụ kiện liên kết boong"
        ],
        "materials": "Inox 316 Marine Grade, Kính dán an toàn 2 lớp, Phụ kiện Inox 316",
        "finishing": "Đánh bóng gương (Mirror Polish)",
        "timeline": "40 ngày",
        "value": "~950 Triệu VNĐ",
        "description": "Phục vụ lượng lớn khách du lịch mỗi ngày, yêu cầu hệ lan can có độ bền cơ học cao, tay vịn thoải mái và thẩm mỹ sang trọng, dễ dàng lau chùi vệ sinh trong suốt quá trình vận hành tour.",
        "highlights": [
            "Bề mặt Inox được đánh bóng gương cao cấp, hạn chế tối đa bám dấu vân tay và bụi bẩn.",
            "Kết cấu chân cột lan can bắt bulông âm sàn Inox 316 gia cường bên dưới boong tàu, đảm bảo an toàn tuyệt đối khi đông người cùng tựa ngắm cảnh.",
            "Khung kính chắn gió mũi tàu chịu áp lực gió biển vận tốc cao khi tàu chạy nhanh."
        ]
    },
    {
        "id": "sv-proj-villa-thanhhoa",
        "slug": "villa-thanh-hoa",
        "sector": "residential-metalwork",
        "system": "custom-metal",
        "badge": "Nhà Ở Cao Cấp",
        "title": "Công Trình Nhà Ở Cao Cấp Thanh Hóa",
        "client": "Chủ đầu tư tư nhân",
        "location": "TP. Thanh Hóa, Tỉnh Thanh Hóa",
        "scale": "Nhà phố biệt thự 4 tầng kết hợp kinh doanh cao cấp",
        "categories": [
            "Mái kính canopy sảnh chính kết cấu khung thép treo chịu lực",
            "Hệ lan can ban công kính kết hợp tay vịn kim loại",
            "Khung thép trang trí giếng trời lấy sáng tự nhiên",
            "Cửa cổng và vách ngăn kim loại theo thiết kế"
        ],
        "materials": "Thép hình I/H kết cấu, Kính cường lực 15mm, Phụ kiện Spider Inox 304, Sơn Epoxy",
        "finishing": "Sơn tĩnh điện & Sơn PU 2 thành phần chống gỉ",
        "timeline": "35 ngày",
        "value": "~550 Triệu VNĐ",
        "description": "Hạng mục mái sảnh kính vươn dài tạo điểm nhấn kiến trúc bề thế cho mặt tiền công trình, tích hợp hệ thống máng xối gom nước mưa âm kín đáo và hệ lan can kính thanh thoát.",
        "highlights": [
            "Hệ ty treo chịu lực mái sảnh tính toán chịu tải trọng gió bão vùng ven biển miền Trung.",
            "Mối nối kính và khung thép được xử lý silicon kết cấu chống thấm nước tuyệt đối.",
            "Hệ khung sơn tĩnh điện chống trầy xước và bền bỉ theo thời gian."
        ]
    }
]

final_projects = []

for p in projects_config:
    slug = p["slug"]
    proj_dir = os.path.join(base_dir, slug)
    
    if os.path.exists(proj_dir):
        files = sorted([f for f in os.listdir(proj_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))])
        # Make sure hero is first
        gallery = []
        if "hero.jpg" in files or "hero.webp" in files or "hero.png" in files:
            hero_file = [f for f in files if f.startswith("hero")][0]
            gallery.append(f"assets/images/projects/{slug}/{hero_file}")
            for f in files:
                if f != hero_file:
                    gallery.append(f"assets/images/projects/{slug}/{f}")
        else:
            gallery = [f"assets/images/projects/{slug}/{f}" for f in files]
    else:
        gallery = [f"assets/images/projects/{slug}/hero.jpg"]
        
    p_record = {
        "id": p["id"],
        "slug": p["slug"],
        "sector": p["sector"],
        "system": p["system"],
        "badge": p["badge"],
        "image": gallery[0] if gallery else f"assets/images/projects/{slug}/hero.jpg",
        "gallery": gallery,
        "photoCount": len(gallery),
        "translations": {
            "vi": {
                "title": p["title"],
                "client": p["client"],
                "location": p["location"],
                "scale": p["scale"],
                "categories": p["categories"],
                "materials": p["materials"],
                "finishing": p["finishing"],
                "timeline": p["timeline"],
                "value": p["value"],
                "description": p["description"],
                "highlights": p["highlights"],
                "status": "Đã hoàn thành & Bàn giao"
            },
            "en": {
                "title": p["title"],
                "client": p["client"],
                "location": p["location"],
                "scale": p["scale"],
                "categories": p["categories"],
                "materials": p["materials"],
                "finishing": p["finishing"],
                "timeline": p["timeline"],
                "value": p["value"],
                "description": p["description"],
                "highlights": p["highlights"],
                "status": "Completed & Handed over"
            }
        }
    }
    final_projects.append(p_record)

full_data = {
    "taxonomy": {
        "sectors": ["residential-metalwork", "yacht-metalwork", "custom-metalwork"],
        "systems": ["balustrade-railing", "staircase-handrail", "gate-fence", "canopy-skylight", "yacht-railing", "yacht-louver", "yacht-drainage", "custom-metal"],
        "materials": ["stainless-steel-316", "stainless-steel-304", "structural-steel", "tempered-glass", "laminated-glass"]
    },
    "projects": final_projects
}

out_file = r"d:\Sao Vàng\Website-SaoVang\website\data\projects.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(full_data, f, ensure_ascii=False, indent=2)

print(f"Successfully generated full projects database with {len(final_projects)} projects!")
total_images = sum(p["photoCount"] for p in final_projects)
print(f"Total authentic images indexed across all projects: {total_images}")
for p in final_projects:
    print(f" - {p['id']}: {p['translations']['vi']['title']} ({p['photoCount']} photos)")
