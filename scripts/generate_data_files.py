import os
import json
import codecs

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))

projects_data = [
  {
    "projectId": "proj-01",
    "title": "Villas Cao Cấp Resort Sanctuary Hồ Tràm",
    "clientName": "Tập đoàn Sanctuary Residences",
    "location": "Xuyên Mộc, Bà Rịa - Vũng Tàu",
    "completionYear": 2025,
    "materialsUsed": ["nhom-maxpro-ed", "kinh-hop-low-e-12mm", "phu-kien-cmech", "keo-dow-corning-795"],
    "machinesUtilized": ["bending-machine-cnc", "welding-mig-tig"],
    "scopeOfWork": "Thi công lắp đặt trọn gói hệ cửa nhôm kính lùa slim bản lớn và vách kính mặt dựng chống ăn mòn muối biển cho 15 căn biệt thự nghỉ dưỡng sát bờ biển.",
    "verifiedEvidenceDoc": "assets/docs/certificates/quacert-sanctuary-project.pdf",
    "gallery": [
      "assets/images/projects/sanctuary-villa-01.webp",
      "assets/images/projects/sanctuary-villa-02.webp"
    ]
  },
  {
    "projectId": "proj-02",
    "title": "Biệt Thự Tân Cổ Điển KĐT Vinhomes Riverside",
    "clientName": "Tư nhân (Chủ đầu tư biệt thự)",
    "location": "Long Biên, Hà Nội",
    "completionYear": 2024,
    "materialsUsed": ["nhom-civro-germany", "kinh-dan-cuong-luc-sgp", "phu-kien-sobinco", "keo-dow-corning-995"],
    "machinesUtilized": ["bending-machine-cnc"],
    "scopeOfWork": "Gia công uốn vòm nhôm kính nghệ thuật hình elip bán kính cong nhỏ và lắp đặt hệ cửa mở quay rãnh C tiêu chuẩn Châu Âu cách âm tuyệt đối.",
    "verifiedEvidenceDoc": "assets/docs/certificates/vinhomes-riverside-acceptance.pdf",
    "gallery": [
      "assets/images/projects/vinhomes-riverside-01.webp",
      "assets/images/projects/vinhomes-riverside-02.webp"
    ]
  },
  {
    "projectId": "proj-03",
    "title": "Tòa Nhà Văn Phòng Techcombank Facade Tower",
    "clientName": "Tổng thầu Coteccons",
    "location": "Quận 1, TP Hồ Chí Minh",
    "completionYear": 2025,
    "materialsUsed": ["nhom-xingfa-qd", "kinh-dan-an-toan-pvb", "keo-dow-corning-795", "phu-kien-kinlong"],
    "machinesUtilized": ["cnc-haas-vf2", "laser-cutting-fiber"],
    "scopeOfWork": "Thiết kế, chế tạo và thi công vách kính mặt dựng hệ Unitized chịu tải lực gió cực cao (>2.0 kPa) kết hợp hệ thống kết cấu thép nâng sảnh canopy lớn chân nhện Spider.",
    "verifiedEvidenceDoc": "assets/docs/certificates/tcb-facade-test-report.pdf",
    "gallery": [
      "assets/images/projects/tcb-facade-01.webp",
      "assets/images/projects/tcb-facade-02.webp"
    ]
  },
  {
    "projectId": "proj-04",
    "title": "Nhà Máy Linh Kiện Điện Tử Pegatron Hải Phòng",
    "clientName": "Tổng thầu B2B Industrial Construction",
    "location": "KCN Đình Vũ, Hải Phòng",
    "completionYear": 2024,
    "materialsUsed": ["thep-hinh-i-h", "nhom-pma-standard", "kinh-cuong-luc-10mm", "keo-polyurethane-foam"],
    "machinesUtilized": ["laser-cutting-fiber", "welding-mig-tig"],
    "scopeOfWork": "Chế tạo kết cấu dầm cột thép nhà xưởng nhịp lớn (khẩu độ 48m) đạt tiêu chuẩn hàn AWS D1.1 và lắp đặt vách ngăn kính cường lực phòng lab sạch kiểm thử sản phẩm.",
    "verifiedEvidenceDoc": "assets/docs/certificates/pegatron-wps-aws-certificate.pdf",
    "gallery": [
      "assets/images/projects/pegatron-factory-01.webp",
      "assets/images/projects/pegatron-factory-02.webp"
    ]
  },
  {
    "projectId": "proj-05",
    "title": "Lan Can Inox Kính Cầu Cảng Siêu Du Thuyền Tuần Châu",
    "clientName": "Tập đoàn Tuần Châu Marina",
    "location": "Hạ Long, Quảng Ninh",
    "completionYear": 2025,
    "materialsUsed": ["inox-316l-marine", "kinh-dan-cuong-luc-sgp", "keo-dow-corning-795"],
    "machinesUtilized": ["cnc-dmg-mori", "welding-mig-tig"],
    "scopeOfWork": "Gia công inox 316L bóng gương 8K uốn lượn nghệ thuật kết hợp pát định vị đúc inox nguyên khối và vách lan can kính dán an toàn chịu bão biển.",
    "verifiedEvidenceDoc": "assets/docs/certificates/tuan-chau-marina-marine-inox.pdf",
    "gallery": [
      "assets/images/projects/tuan-chau-marina-01.webp",
      "assets/images/projects/tuan-chau-marina-02.webp"
    ]
  },
  {
    "projectId": "proj-06",
    "title": "Mái Kính Canopy Giếng Trời Tự Động Biệt Thự Ciputra",
    "clientName": "Tư nhân",
    "location": "Tây Hồ, Hà Nội",
    "completionYear": 2024,
    "materialsUsed": ["thep-hinh-i-h", "kinh-dan-cuong-luc-sgp", "keo-dow-corning-795", "sensor-automatic-slide"],
    "machinesUtilized": ["laser-cutting-fiber", "bending-machine-cnc"],
    "scopeOfWork": "Thi công lắp đặt trọn gói hệ giếng trời lấy sáng kết cấu khung sắt CNC nghệ thuật cắt laser dày 12mm, tích hợp động cơ điện cảm biến mưa tự động đóng mở thông minh.",
    "verifiedEvidenceDoc": "assets/docs/certificates/ciputra-canopy-acceptance-cert.pdf",
    "gallery": [
      "assets/images/projects/ciputra-canopy-01.webp",
      "assets/images/projects/ciputra-canopy-02.webp"
    ]
  }
]

materials_data = [
  {
    "materialId": "nhom-maxpro-ed",
    "category": "Aluminium Profile",
    "name": "Thanh nhôm profile Maxpro.JP ED",
    "origin": "Nhật Bản",
    "technicalSpecs": {
      "surfaceTreatment": "Mạ điện di ED (Electrodeposition Anodized)",
      "durabilityStandard": "JIS H8602 (Nhật Bản)",
      "hardness": "10 - 12 Webster HW",
      "saltSprayResistance": "> 2000 giờ thảm phun muối biển",
      "warrantyColor": "25 - 40 năm"
    }
  },
  {
    "materialId": "nhom-civro-germany",
    "category": "Aluminium Profile",
    "name": "Thanh nhôm profile Civro rãnh C",
    "origin": "Công nghệ Đức",
    "technicalSpecs": {
      "structure": "Cấu trúc đa khoang tích hợp rãnh C châu Âu",
      "thermalBreak": "Dải polyamide cách nhiệt độ dày 24mm",
      "uValue": "1.3 - 1.8 W/m2.K (Cản nhiệt cực cao)",
      "compatibility": "Phụ kiện CMECH Mỹ, Sobinco Bỉ"
    }
  },
  {
    "materialId": "nhom-xingfa-qd",
    "category": "Aluminium Profile",
    "name": "Thanh nhôm profile Xingfa Quảng Đông nhập khẩu",
    "origin": "Trung Quốc (Tem đỏ chính hãng)",
    "technicalSpecs": {
      "surfaceTreatment": "Sơn tĩnh điện bột ngoài trời AkzoNobel",
      "alloyGrade": "6063-T5",
      "thickness": "1.4mm - 2.5mm",
      "warrantyColor": "5 năm"
    }
  },
  {
    "materialId": "kinh-hop-low-e-12mm",
    "category": "Glass",
    "name": "Kính hộp Low-E cản nhiệt hút chân không",
    "origin": "Guardian Glass (Mỹ) gia công Quatest",
    "technicalSpecs": {
      "structure": "Kính 5mm Low-E + 12mm Argon Spacer + Kính 5mm cường lực",
      "uValue": "< 1.5 W/m2.K",
      "shgc": "0.38 (Hệ số hấp thụ nhiệt mặt trời thấp)",
      "vlt": "62% (Hệ số truyền sáng tự nhiên cao)"
    }
  },
  {
    "materialId": "kinh-dan-cuong-luc-sgp",
    "category": "Glass",
    "name": "Kính dán an toàn nhiều lớp phim SentryGlas (SGP)",
    "origin": "DuPont (Mỹ) gia công",
    "technicalSpecs": {
      "filmType": "SentryGlas Ionoplast Interlayer (SGP)",
      "structure": "Kính cường lực 6mm + 1.52mm SGP film + Kính cường lực 6mm",
      "strength": "Cứng hơn 5 lần, chịu lực uốn gấp 100 lần phim PVB thông thường",
      "safety": "Kính vỡ vẫn giữ nguyên kết cấu đứng vững chịu bão lớn"
    }
  },
  {
    "materialId": "inox-316l-marine",
    "category": "Stainless Steel",
    "name": "Thép không gỉ mác Inox SUS316L chuyên dụng hàng hải",
    "origin": "Posco (Hàn Quốc) nhập khẩu",
    "technicalSpecs": {
      "alloyGrade": "SUS316L (Low Carbon)",
      "carbonContent": "< 0.03%",
      "finish": "Bóng gương 8K (Mirror finish) hoặc xước niken mịn",
      "corrosionResistance": "Kháng hóa chất clorua và muối mặn biển tuyệt đối"
    }
  },
  {
    "materialId": "keo-dow-corning-795",
    "category": "Silicone Sealant",
    "name": "Keo silicone kết cấu Dow Corning 795",
    "origin": "Dow Chemical (Mỹ)",
    "technicalSpecs": {
      "jointMovement": "+-50% co giãn dịch chuyển",
      "standard": "ASTM C920, ASTM C1184",
      "application": "Dùng định vị liên kết kính mặt dựng facade vách kính lớn chịu tải gió"
    }
  }
]

downloads_data = [
  {
    "assetId": "dl-cap-statement",
    "title": "Sao Vàng Corporate Capability Statement 2026",
    "fileType": "PDF Document",
    "fileSize": "12.4 MB",
    "downloadUrl": "assets/docs/downloads/sao-vang-capability-statement-2026.pdf",
    "description": "Hồ sơ năng lực điện tử chi tiết về hệ thống nhà xưởng, máy móc CNC, chứng chỉ kỹ thuật ISO/AWS và danh sách dự án thầu tiêu biểu của Sao Vàng."
  },
  {
    "assetId": "dl-cat-sv-aluminium",
    "title": "Catalogue Hệ Cửa Nhôm & Profile Kỹ Thuật SV Aluminium",
    "fileType": "PDF Document",
    "fileSize": "18.6 MB",
    "downloadUrl": "assets/docs/downloads/sv-aluminium-profile-catalogue.pdf",
    "description": "Tài liệu kỹ thuật tổng hợp mặt cắt thanh nhôm profile các hệ SV65, SV93, SV100 tích hợp dải cầu cách nhiệt và phương án phụ kiện lắp đặt."
  },
  {
    "assetId": "dl-cad-sv65-facade",
    "title": "Bản vẽ AutoCAD mặt dựng Facade kính hệ SV65",
    "fileType": "ZIP Archive (DWG/DXF files)",
    "fileSize": "4.8 MB",
    "downloadUrl": "assets/docs/downloads/cad-sv65-facade-sections.zip",
    "description": "Thư viện bản vẽ CAD kỹ thuật mặt cắt chi tiết nút giao vách kính mặt dựng hệ Stick và Unitized SV65 phục vụ KTS triển khai Shop Drawing."
  },
  {
    "assetId": "dl-wps-aws-certs",
    "title": "Quy trình đặc tả hàn WPS & Chứng chỉ thợ hàn AWS",
    "fileType": "PDF Document",
    "fileSize": "3.5 MB",
    "downloadUrl": "assets/docs/downloads/sao-vang-wps-aws-certificates.pdf",
    "description": "Hồ sơ quy trình kỹ thuật hàn kết cấu thép AWS D1.1 và hàn inox AWS D1.6 được chứng thực bởi Trung tâm Đo lường Chất lượng."
  }
]

media_data = [
  {
    "mediaId": "media-factory-cnc",
    "category": "Factory",
    "path": "assets/images/factory/workshop-cnc-main.webp",
    "webpVersion": "assets/images/factory/workshop-cnc-main.webp",
    "thumbnail": "assets/images/factory/thumb-workshop-cnc.webp",
    "altText": "Toàn cảnh khu vực gia công cơ khí chính xác CNC với máy phay Haas tại xưởng Sao Vàng Hà Nội",
    "tags": ["factory", "cnc", "haas", "machining"],
    "keywords": "xưởng cơ khí hà nội, máy cnc haas, xưởng gia công chính xác",
    "license": "Copyright © 2026 Sao Vang JSC. All rights reserved."
  },
  {
    "mediaId": "media-machine-laser",
    "category": "Machines",
    "path": "assets/images/machines/laser-bodor-c3.webp",
    "webpVersion": "assets/images/machines/laser-bodor-c3.webp",
    "thumbnail": "assets/images/machines/thumb-laser-bodor.webp",
    "altText": "Máy cắt laser fiber Bodor C3 đang gia công cắt bản mã dầm thép tại xưởng",
    "tags": ["machines", "laser-cutting", "bodor", "metalplate"],
    "keywords": "máy cắt laser fiber bodor, cắt laser bản mã thép",
    "license": "Copyright © 2026 Sao Vang JSC. All rights reserved."
  },
  {
    "mediaId": "media-proj-sanctuary",
    "category": "Projects",
    "path": "assets/images/projects/sanctuary-villa-lounge.webp",
    "webpVersion": "assets/images/projects/sanctuary-villa-lounge.webp",
    "thumbnail": "assets/images/projects/thumb-sanctuary-villa.webp",
    "altText": "Hệ cửa nhôm kính lùa slim SV Aluminium mạ điện di ED Maxpro lắp dựng tại resort Sanctuary Hồ Tràm",
    "tags": ["projects", "sv-aluminium", "maxpro-ed", "villa"],
    "keywords": "cửa nhôm slim biệt thự biển, nhôm maxpro ed hồ tràm",
    "license": "Copyright © 2026 Sao Vang JSC. All rights reserved."
  }
]

def generate_json_files():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

    files_to_write = [
        ("projects.json", projects_data, "6 B2B projects"),
        ("materials.json", materials_data, "7 materials records"),
        ("downloads.json", downloads_data, "4 download assets"),
        ("media.json", media_data, "3 media records")
    ]

    for filename, data, desc in files_to_write:
        f_path = os.path.join(DATA_DIR, filename)
        count = len(data)
        print(f"Writing: {filename} ({count} records) [{desc}]")
        with codecs.open(f_path, 'w', 'utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
    print("\nSUCCESSFULLY GENERATED ALL DATABASE DATA FOUNDATION FILES.")

if __name__ == "__main__":
    generate_json_files()
