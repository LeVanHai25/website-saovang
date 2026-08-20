import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

data = {
  "taxonomy": {
    "sectors": ["residential-metalwork", "yacht-metalwork", "custom-metalwork"],
    "systems": ["balustrade-railing", "staircase-handrail", "gate-fence", "canopy-skylight", "yacht-railing", "yacht-louver", "yacht-drainage", "custom-metal"],
    "materials": ["stainless-steel-316", "stainless-steel-304", "structural-steel", "tempered-glass", "laminated-glass"]
  },
  "projects": [
    {
      "id": "sv-proj-villa-anvuong",
      "sector": "residential-metalwork",
      "system": "balustrade-railing",
      "materials": ["stainless-steel-304", "tempered-glass"],
      "image": "assets/images/projects/villa-an-vuong/hero.jpg",
      "gallery": [
        "assets/images/projects/villa-an-vuong/hero.jpg",
        "assets/images/projects/villa-an-vuong/detail-01.jpg",
        "assets/images/projects/villa-an-vuong/detail-02.jpg",
        "assets/images/projects/villa-an-vuong/detail-03.jpg"
      ],
      "translations": {
        "vi": {
          "title": "Biệt Thự An Vượng Villa",
          "description": "Gia công và lắp đặt hoàn thiện hệ lan can kính, lan can kim loại và các chi tiết cơ khí kiến trúc theo thiết kế biệt thự cao cấp.",
          "location": "KĐT Nam Cường - Dương Nội, Hà Nội",
          "scale": "Toàn bộ hệ lan can & chi tiết kim loại hoàn thiện biệt thự",
          "status": "Hoàn thành & Bàn giao"
        },
        "en": {
          "title": "An Vuong Luxury Villa",
          "description": "Fabrication and installation of glass balustrades, metal railings, and architectural metalwork according to customized villa design.",
          "location": "Hanoi, Vietnam",
          "scale": "Complete balustrade system & finished metal details",
          "status": "Completed"
        }
      }
    },
    {
      "id": "sv-proj-villa-dothanh",
      "sector": "residential-metalwork",
      "system": "balustrade-railing",
      "materials": ["structural-steel", "stainless-steel-304"],
      "image": "assets/images/projects/villa-do-thanh/hero.jpg",
      "gallery": [
        "assets/images/projects/villa-do-thanh/hero.jpg",
        "assets/images/projects/villa-do-thanh/detail-01.jpg",
        "assets/images/projects/villa-do-thanh/detail-02.jpg"
      ],
      "translations": {
        "vi": {
          "title": "Biệt Thự Đô Thành Villa",
          "description": "Triển khai kỹ thuật và thi công các hạng mục lan can ban công, hàng rào kim loại và tay vịn theo bản vẽ thiết kế.",
          "location": "Việt Nam",
          "scale": "Hệ lan can, cổng rào và kết cấu kim loại hoàn thiện",
          "status": "Hoàn thành & Bàn giao"
        },
        "en": {
          "title": "Do Thanh Residence Villa",
          "description": "Engineering and execution of balcony railings, metal fencing, and handrails following architectural specifications.",
          "location": "Vietnam",
          "scale": "Balustrades, fencing, and architectural metalwork",
          "status": "Completed"
        }
      }
    },
    {
      "id": "sv-proj-villa-linhhue",
      "sector": "residential-metalwork",
      "system": "gate-fence",
      "materials": ["structural-steel", "stainless-steel-304"],
      "image": "assets/images/projects/villa-linh-hue/hero.jpg",
      "gallery": [
        "assets/images/projects/villa-linh-hue/hero.jpg",
        "assets/images/projects/villa-linh-hue/detail-01.jpg",
        "assets/images/projects/villa-linh-hue/detail-02.jpg"
      ],
      "translations": {
        "vi": {
          "title": "Biệt Thự Linh Huệ Villa",
          "description": "Chế tác và lắp dựng hệ cổng biệt thự, lan can kim loại và hạng mục cơ khí hoàn thiện theo hồ sơ thiết kế.",
          "location": "Việt Nam",
          "scale": "Cổng chính biệt thự, hệ lan can và chi tiết kim loại",
          "status": "Hoàn thành & Bàn giao"
        },
        "en": {
          "title": "Linh Hue Luxury Villa",
          "description": "Fabrication and erection of entrance gates, metal railings, and finishing metalwork according to engineering drawings.",
          "location": "Vietnam",
          "scale": "Main entrance gate, balustrades, and metal details",
          "status": "Completed"
        }
      }
    },
    {
      "id": "sv-proj-villa-thanhhoa",
      "sector": "residential-metalwork",
      "system": "custom-metal",
      "materials": ["structural-steel", "stainless-steel-304", "tempered-glass"],
      "image": "assets/images/projects/villa-thanh-hoa/hero.jpg",
      "gallery": [
        "assets/images/projects/villa-thanh-hoa/hero.jpg",
        "assets/images/projects/villa-thanh-hoa/detail-01.jpg"
      ],
      "translations": {
        "vi": {
          "title": "Công Trình Nhà Ở Cao Cấp Thanh Hóa",
          "description": "Gia công kết cấu thép, hệ lan can và khung kim loại kiến trúc hoàn thiện đồng bộ tại công trình.",
          "location": "Thanh Hóa, Việt Nam",
          "scale": "Toàn bộ hệ cơ khí hoàn thiện nhà ở",
          "status": "Hoàn thành & Bàn giao"
        },
        "en": {
          "title": "Thanh Hoa Premium Residence",
          "description": "Fabrication of structural steel frames, railings, and synchronized architectural metal finishes.",
          "location": "Thanh Hoa, Vietnam",
          "scale": "Complete residential metalwork package",
          "status": "Completed"
        }
      }
    },
    {
      "id": "sv-proj-yacht-tulip",
      "sector": "yacht-metalwork",
      "system": "yacht-railing",
      "materials": ["stainless-steel-316", "tempered-glass"],
      "image": "assets/images/projects/yacht-tulip/hero.jpg",
      "gallery": [
        "assets/images/projects/yacht-tulip/hero.jpg",
        "assets/images/projects/yacht-tulip/detail-01.jpg",
        "assets/images/projects/yacht-tulip/detail-02.jpg",
        "assets/images/projects/yacht-tulip/detail-03.jpg"
      ],
      "translations": {
        "vi": {
          "title": "Du Thuyền Tulip Cruise (5 Sao)",
          "description": "Chế tác và lắp dựng toàn bộ hệ lan can inox hàng hải 316, lan can kính boong ngắm cảnh, hệ máng nước inox và chi tiết kim loại hoàn thiện du thuyền.",
          "location": "Vịnh Hạ Long, Quảng Ninh",
          "scale": "Toàn bộ hệ lan can inox 316, lan can kính mạn tàu & chi tiết inox boong",
          "status": "Hoàn thành & Bàn giao"
        },
        "en": {
          "title": "Tulip Cruise 5-Star Luxury Yacht",
          "description": "Fabrication and installation of marine-grade 316 stainless steel railings, sun deck glass balustrades, stainless drainage, and yacht metal fittings.",
          "location": "Ha Long Bay, Vietnam",
          "scale": "Complete 316 SS railing package & sun deck glass balustrades",
          "status": "Completed"
        }
      }
    },
    {
      "id": "sv-proj-yacht-azura",
      "sector": "yacht-metalwork",
      "system": "yacht-railing",
      "materials": ["stainless-steel-316", "tempered-glass"],
      "image": "assets/images/projects/yacht-azura/hero.jpg",
      "gallery": [
        "assets/images/projects/yacht-azura/hero.jpg",
        "assets/images/projects/yacht-azura/detail-01.jpg",
        "assets/images/projects/yacht-azura/detail-02.jpg"
      ],
      "translations": {
        "vi": {
          "title": "Du Thuyền Azura Cruise",
          "description": "Triển khai kỹ thuật và gia công hệ lan can inox 316, lan can kính mạn tàu, hệ louver điều hòa và máng thoát nước inox chống ăn mòn biển.",
          "location": "Hạ Long, Quảng Ninh",
          "scale": "Hệ lan can inox 316 & chi tiết cơ khí hoàn thiện du thuyền",
          "status": "Hoàn thành & Bàn giao"
        },
        "en": {
          "title": "Azura Cruise Luxury Yacht",
          "description": "Engineering and fabrication of 316 stainless steel railings, shipside glass balustrades, AC louvers, and corrosion-resistant marine drainage.",
          "location": "Ha Long Bay, Vietnam",
          "scale": "316 SS railings and marine finishing metalwork",
          "status": "Completed"
        }
      }
    },
    {
      "id": "sv-proj-yacht-calista",
      "sector": "yacht-metalwork",
      "system": "yacht-louver",
      "materials": ["stainless-steel-316"],
      "image": "assets/images/projects/yacht-calista/hero.jpg",
      "gallery": [
        "assets/images/projects/yacht-calista/hero.jpg",
        "assets/images/projects/yacht-calista/detail-01.jpg"
      ],
      "translations": {
        "vi": {
          "title": "Du Thuyền Calista Cruise",
          "description": "Gia công hệ lan can inox du thuyền, máng nước inox, louver điều hòa và các hạng mục cơ khí hoàn thiện theo thiết kế du thuyền.",
          "location": "Quảng Ninh, Việt Nam",
          "scale": "Hạng mục cơ khí hoàn thiện du thuyền",
          "status": "Hoàn thành & Bàn giao"
        },
        "en": {
          "title": "Calista Cruise Luxury Yacht",
          "description": "Fabrication of yacht stainless steel railings, stainless gutters, AC louvers, and customized marine metal details.",
          "location": "Vietnam",
          "scale": "Complete yacht metalwork and finishing package",
          "status": "Completed"
        }
      }
    },
    {
      "id": "sv-proj-yacht-leona",
      "sector": "yacht-metalwork",
      "system": "yacht-railing",
      "materials": ["stainless-steel-316", "tempered-glass"],
      "image": "assets/images/projects/yacht-leona/hero.jpg",
      "gallery": [
        "assets/images/projects/yacht-leona/hero.jpg",
        "assets/images/projects/yacht-leona/detail-01.jpg"
      ],
      "translations": {
        "vi": {
          "title": "Du Thuyền Leona Cruise Hạ Long",
          "description": "Sản xuất và lắp đặt hệ lan can inox 316, lan can kính boong tàu và các kết cấu kim loại hoàn thiện trên du thuyền tham quan cao cấp.",
          "location": "Vịnh Hạ Long, Quảng Ninh",
          "scale": "Toàn bộ hệ lan can và kết cấu inox du thuyền",
          "status": "Hoàn thành & Bàn giao"
        },
        "en": {
          "title": "Leona Cruise Ha Long",
          "description": "Manufacturing and installation of 316 stainless steel railings, deck glass balustrades, and finishing metal structures on luxury day cruise.",
          "location": "Ha Long Bay, Vietnam",
          "scale": "Full yacht railings and stainless steel structures",
          "status": "Completed"
        }
      }
    }
  ]
}

with open(r"d:\Sao Vàng\Website-SaoVang\website\data\projects.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("website/data/projects.json updated successfully with 8 100% REAL projects!")
