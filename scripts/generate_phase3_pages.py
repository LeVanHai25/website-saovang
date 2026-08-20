import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. cuanhomkinh.html
cuanhomkinh_html = """<!DOCTYPE html>
<html lang="vi">
<head>
  <link rel="icon" type="image/svg+xml" href="assets/images/logo-sv-main.svg" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0F172A" />
  <title>Cửa Nhôm Kính Kiến Trúc Cao Cấp | SV ALUMINIUM — Sao Vàng</title>
  <meta name="description" content="Khám phá các giải pháp cửa nhôm kính kiến trúc SV ALUMINIUM: Cửa mở quay rãnh C Châu Âu, cửa lùa Panorama L180, cửa Slim tối giản và cửa thủy lực bản lớn cho biệt thự, penthouse và resort." />
  <meta name="keywords" content="cửa nhôm kính cao cấp, cửa lùa panorama, cửa nhôm slim, cửa mở quay rãnh c, cửa thủy lực biệt thự, cửa xếp trượt, sao vàng aluminium" />
  
  <meta property="og:title" content="Cửa Nhôm Kính Kiến Trúc Cao Cấp | SV ALUMINIUM — Sao Vàng" />
  <meta property="og:description" content="Hệ cửa nhôm kính từ phân khúc tiêu chuẩn đến cao cấp cho Residence, Villa, Hospitality & Yacht." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="assets/images/projects/villa-an-vuong/hero.jpg" />
  <link rel="canonical" href="https://www.cokhisaovang.com/cuanhomkinh.html" />

  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" />
  <link rel="stylesheet" href="assets/css/main.css" />

  <style>
    :root {
      --sv-dark: #0F172A;
      --sv-dark-card: #1E293B;
      --sv-gold: #C9A227;
      --sv-gold-light: #E5C158;
      --sv-slate: #64748B;
      --sv-bg-light: #F8FAFC;
      --ff-head: 'Montserrat', sans-serif;
      --ff-body: 'Inter', sans-serif;
    }

    body { font-family: var(--ff-body); color: #334155; background-color: #FFFFFF; }
    
    .al-tag {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: var(--ff-head); font-size: 11px; font-weight: 800;
      letter-spacing: 0.14em; text-transform: uppercase; color: var(--sv-gold); margin-bottom: 12px;
    }
    .al-title {
      font-family: var(--ff-head); font-size: clamp(24px, 4vw, 36px);
      font-weight: 800; color: var(--sv-dark); line-height: 1.25; margin-bottom: 16px;
    }
    .al-title-light { color: #FFFFFF; }
    .al-subtitle { font-size: clamp(14px, 1.8vw, 16px); color: var(--sv-slate); line-height: 1.7; max-width: 700px; }

    /* HERO */
    .door-hero {
      position: relative; background: radial-gradient(circle at 50% 30%, #1E293B 0%, #0F172A 100%);
      color: #FFFFFF; padding: 150px 0 90px; text-align: center; border-bottom: 1px solid rgba(201, 162, 39, 0.2);
    }
    .door-hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(201, 162, 39, 0.12); border: 1px solid rgba(201, 162, 39, 0.4);
      padding: 6px 18px; border-radius: 30px; font-family: var(--ff-head);
      font-size: 11px; font-weight: 800; color: var(--sv-gold); text-transform: uppercase;
      letter-spacing: 0.12em; margin-bottom: 20px;
    }
    .door-hero-h1 {
      font-family: var(--ff-head); font-size: clamp(28px, 5vw, 48px);
      font-weight: 900; line-height: 1.2; margin-bottom: 16px;
    }
    .door-hero-h1 span {
      background: linear-gradient(135deg, #FFFFFF 0%, var(--sv-gold) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .door-hero-p { font-size: clamp(14.5px, 1.8vw, 17px); color: #94A3B8; max-width: 760px; margin: 0 auto 30px; line-height: 1.7; }

    /* DOOR CATEGORY CARD */
    .door-cat-card {
      background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px;
      padding: 36px; margin-bottom: 32px; transition: all 0.3s ease;
    }
    .door-cat-card:hover { border-color: var(--sv-gold); box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
    .door-cat-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 24px; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid #F1F5F9; padding-bottom: 20px;
    }
    .door-cat-title { font-family: var(--ff-head); font-size: 22px; font-weight: 800; color: var(--sv-dark); }
    .door-cat-sub { font-size: 13.5px; color: var(--sv-slate); margin-top: 4px; }

    /* SYSTEM ITEM IN GRID */
    .sys-box-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; }
    .sys-box {
      background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px;
      padding: 20px; transition: all 0.2s ease;
    }
    .sys-box:hover { background: #FFFFFF; border-color: var(--sv-gold); box-shadow: 0 4px 14px rgba(0,0,0,0.04); }
    .sys-box-code {
      display: inline-block; background: #0F172A; color: var(--sv-gold);
      font-family: var(--ff-head); font-size: 10.5px; font-weight: 800;
      padding: 3px 8px; border-radius: 4px; text-transform: uppercase; margin-bottom: 8px;
    }
    .sys-box-title { font-family: var(--ff-head); font-size: 15.5px; font-weight: 800; color: var(--sv-dark); margin-bottom: 6px; }
    .sys-box-raw { font-size: 11px; color: #94A3B8; margin-bottom: 8px; }
    .sys-box-desc { font-size: 13px; color: #64748B; line-height: 1.6; }

    .al-btn-gold {
      background: linear-gradient(135deg, #C9A227 0%, #B89218 100%);
      color: #0F172A; font-family: var(--ff-head); font-size: 13px; font-weight: 800;
      padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
      box-shadow: 0 4px 14px rgba(201, 162, 39, 0.3); transition: all 0.3s ease;
    }
    .al-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(201, 162, 39, 0.5); color: #000; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <header class="header-v2" id="navbar" role="banner">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo" aria-label="SV ALUMINIUM">
        <img width="220" height="60" fetchpriority="high" loading="eager" src="assets/images/logo-nhom.png" alt="SV ALUMINIUM" style="height: 46px; width: auto; display: block;" />
      </a>
      <nav class="nav-menu" id="navMenu" role="navigation" aria-label="Menu chính">
        <a href="index.html" class="nav-menu-link">Trang Chủ</a>
        <a href="gioithieu.html" class="nav-menu-link">Giới Thiệu</a>
        <a href="cokhisaovang.html" class="nav-menu-link">Cơ Khí Sao Vàng</a>
        <a href="nhomsaovang.html" class="nav-menu-link">SV Aluminium</a>
        <a href="cuanhomkinh.html" class="nav-menu-link active">Cửa Nhôm Kính</a>
        <a href="vachkinh.html" class="nav-menu-link">Vách Kính &amp; Mặt Dựng</a>
        <a href="thuvienprofilenhom.html" class="nav-menu-link">Thư Viện Profile</a>
        <a href="duan.html" class="nav-menu-link">Dự Án</a>
        <a href="lienhe.html" class="nav-menu-link">Liên Hệ</a>
      </nav>
      <div class="nav-actions">
        <a href="cuanhomkinh.html#doorRfq" class="btn-primary" style="font-family: var(--ff-head); font-size: 12.5px; font-weight: 800; padding: 10px 20px; border-radius: 4px; background: #C9A227; color: #0F172A; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
          <i class="ri-file-text-line"></i> BÁO GIÁ CỬA
        </a>
      </div>
    </div>
  </header>

  <!-- HERO -->
  <section class="door-hero">
    <div class="container">
      <div class="door-hero-badge"><i class="ri-door-open-line"></i> SV ALUMINIUM &bull; ARCHITECTURAL DOORS</div>
      <h1 class="door-hero-h1">HỆ CỬA NHÔM KÍNH<br><span>KIẾN TRÚC CAO CẤP</span></h1>
      <p class="door-hero-p">
        Phát triển theo tư duy ứng dụng thực tế: Từ cửa mở quay tiêu chuẩn rãnh C Châu Âu đến cửa lùa Panorama L180 vô cực, cửa Slim tràn viền và cửa thủy lực bản lớn cho biệt thự, penthouse và resort.
      </p>
      <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
        <a href="#openingDoors" class="al-btn-gold"><i class="ri-arrow-down-line"></i> KHÁM PHÁ 4 NHÓM ỨNG DỤNG CỬA</a>
        <a href="thuvienprofilenhom.html" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #FFF; padding: 12px 24px; border-radius: 6px; font-family: var(--ff-head); font-size: 13px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
          <i class="ri-book-read-line"></i> THƯ VIỆN PROFILE &amp; CAD
        </a>
      </div>
    </div>
  </section>

  <!-- 4 DOOR CATEGORIES -->
  <section style="padding: 80px 0; background: #F8FAFC;">
    <div class="container">

      <!-- 01. OPENING DOORS -->
      <div class="door-cat-card" id="openingDoors">
        <div class="door-cat-header">
          <div>
            <span class="al-tag"><i class="ri-checkbox-circle-line"></i> NHÓM 01 &bull; CỬA MỞ QUAY CHÂU ÂU</span>
            <div class="door-cat-title">Cửa Đi &amp; Cửa Sổ Mở Quay / Mở Hất (5 Hệ)</div>
            <div class="door-cat-sub">Đồng bộ rãnh C Châu Âu, gioăng EPDM 3 lớp kín khít, khóa đa điểm chống cạy phá.</div>
          </div>
          <span style="font-family: var(--ff-head); font-size: 12px; font-weight: 800; color: #0284C7; background: #E0F2FE; padding: 6px 12px; border-radius: 20px;">
            5 Hệ Tiêu Biểu
          </span>
        </div>
        <div class="sys-box-grid">
          <div class="sys-box">
            <span class="sys-box-code">XF55-FLAT</span>
            <div class="sys-box-title">XF55 Cánh Phẳng</div>
            <div class="sys-box-raw">Mã: Seaaluk, Yongxing</div>
            <div class="sys-box-desc">Mặt phẳng hiện đại liền khối, tối ưu công năng đóng mở cửa đi 1-2-4 cánh và cửa sổ.</div>
          </div>
          <div class="sys-box">
            <span class="sys-box-code">XF55-MULTI</span>
            <div class="sys-box-title">XF55 Đa Khoang Cách Âm</div>
            <div class="sys-box-raw">Mã: Seaaluk, Yongxing</div>
            <div class="sys-box-desc">Cấu trúc đa khoang rỗng triệt tiêu tiếng ồn đô thị, tăng khả năng cách nhiệt tiết kiệm điện.</div>
          </div>
          <div class="sys-box">
            <span class="sys-box-code">C55-EURO</span>
            <div class="sys-box-title">C55 Rãnh C Châu Âu</div>
            <div class="sys-box-raw">Mã: Seaaluk C65</div>
            <div class="sys-box-desc">Đồng bộ phụ kiện rãnh C tiêu chuẩn quốc tế (Cmech, Hopo, Sigico), đầm chắc và bền bỉ.</div>
          </div>
          <div class="sys-box" style="border-color: rgba(201, 162, 39, 0.4); background: #FFFDF9;">
            <span class="sys-box-code" style="background: #0F172A; color: #C9A227;">C65-SIGNATURE</span>
            <div class="sys-box-title">C65 Rãnh C Bản Lớn</div>
            <div class="sys-box-raw">Mã: Seaaluk C75, Yongxing C65</div>
            <div class="sys-box-desc">Bản nhôm dày dặn, gioăng 3 lớp EPDM chịu áp lực gió bão cho cửa biệt thự ven biển.</div>
          </div>
          <div class="sys-box">
            <span class="sys-box-code">XFV55</span>
            <div class="sys-box-title">XFV55 Vát Cạnh 55</div>
            <div class="sys-box-raw">Mã: Seaaluk, Yongxing</div>
            <div class="sys-box-desc">Đường nét vát cạnh mềm mại, thoát nước mưa nhanh chóng và hạn chế bám bụi bẩn.</div>
          </div>
        </div>
      </div>

      <!-- 02. SLIDING & PANORAMA -->
      <div class="door-cat-card" id="slidingDoors">
        <div class="door-cat-header">
          <div>
            <span class="al-tag"><i class="ri-checkbox-circle-line"></i> NHÓM 02 &bull; CỬA LÙA &amp; PANORAMA</span>
            <div class="door-cat-title">Cửa Lùa Trượt &amp; Trượt Nâng Khổ Lớn (4 Hệ)</div>
            <div class="door-cat-sub">Tối ưu diện tích mở, ray trượt Inox siêu êm và cơ cấu Lift &amp; Slide đẳng cấp.</div>
          </div>
          <span style="font-family: var(--ff-head); font-size: 12px; font-weight: 800; color: #D97706; background: #FEF3C7; padding: 6px 12px; border-radius: 20px;">
            Panorama View
          </span>
        </div>
        <div class="sys-box-grid">
          <div class="sys-box">
            <span class="sys-box-code">XF93</span>
            <div class="sys-box-title">Xingfa 93 Cửa Lùa</div>
            <div class="sys-box-raw">Mã: Seaaluk, Yongxing</div>
            <div class="sys-box-desc">Hệ trượt 2 ray kinh tế, vận hành êm nhẹ cho cửa ban công căn hộ và lối ra sân sau.</div>
          </div>
          <div class="sys-box">
            <span class="sys-box-code">L94-L95</span>
            <div class="sys-box-title">L94 / L95 Ray Inox</div>
            <div class="sys-box-raw">Mã: Seaaluk, Yongxing</div>
            <div class="sys-box-desc">Ray Inox chống mài mòn kết hợp bánh xe bi kép, trượt êm mượt với cánh kính khổ lớn.</div>
          </div>
          <div class="sys-box">
            <span class="sys-box-code">L120-3RAIL</span>
            <div class="sys-box-title">L120 Cửa Lùa 3 Ray</div>
            <div class="sys-box-raw">Mã: Seaaluk, Yongxing</div>
            <div class="sys-box-desc">3 ray trượt mở xếp 67% diện tích ô chờ, tối đa hóa lưu thông gió và ánh sáng tự nhiên.</div>
          </div>
          <div class="sys-box" style="border-color: #C9A227; background: #0F172A; color: #FFFFFF;">
            <span class="sys-box-code" style="background: #C9A227; color: #0F172A;">L180-PANORAMA</span>
            <div class="sys-box-title" style="color: #FFFFFF;">L180 Lift &amp; Slide Panorama</div>
            <div class="sys-box-raw" style="color: #94A3B8;">Trượt nâng hạ gioăng kín nước</div>
            <div class="sys-box-desc" style="color: #CBD5E1;">Đỉnh cao cửa trượt kiến trúc: Chịu tải cánh siêu lớn, nâng hạ nhẹ nhàng, kín khít hoàn hảo view biển.</div>
          </div>
        </div>
      </div>

      <!-- 03. SLIM SYSTEMS -->
      <div class="door-cat-card" id="slimDoors">
        <div class="door-cat-header">
          <div>
            <span class="al-tag"><i class="ri-checkbox-circle-line"></i> NHÓM 03 &bull; HỆ NHÔM SLIM TỐI GIẢN</span>
            <div class="door-cat-title">Cửa Nhôm Slim Minimalist (2 Hệ)</div>
            <div class="door-cat-sub">Khung viền siêu mỏng tối đa hóa diện tích kính, phong cách tối giản thanh lịch.</div>
          </div>
          <span style="font-family: var(--ff-head); font-size: 12px; font-weight: 800; color: #7C3AED; background: #EDE9FE; padding: 6px 12px; border-radius: 20px;">
            Minimalist Style
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
          <div class="sys-box" style="border-left: 4px solid #0284C7;">
            <span class="sys-box-code" style="background: #0284C7; color: #FFF;">SEA-SLIM40 &bull; NỘI THẤT</span>
            <div class="sys-box-title">Slim 40 Nội Thất (Treo Trên Không Ray Dưới)</div>
            <div class="sys-box-desc" style="margin-bottom: 12px;">
              Giải pháp cửa lùa treo và vách ngăn không ray dưới chân, tạo cảm giác sàn nhà liền mạch thông thoáng giữa phòng khách, bếp và phòng ngủ.
            </div>
            <div style="font-size: 11.5px; color: #64748B; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #E2E8F0;">
              ✓ Không ray dưới &bull; Giảm chấn 2 chiều &bull; Kính siêu trong / gân sọc
            </div>
          </div>

          <div class="sys-box" style="border-left: 4px solid #C9A227; background: #FFFDF9;">
            <span class="sys-box-code" style="background: #C9A227; color: #0F172A;">SEA-SLIM-L130 &bull; NGOẠI THẤT</span>
            <div class="sys-box-title">Slim 130 Ngoại Thất Chịu Lực</div>
            <div class="sys-box-desc" style="margin-bottom: 12px;">
              Đột phá kết hợp giữa ngôn ngữ thiết kế Minimalist siêu mỏng và khả năng chịu tải trọng gió bão, chống thấm nước mưa ngoài trời cho ban công biệt thự.
            </div>
            <div style="font-size: 11.5px; color: #64748B; background: #FFFFFF; padding: 8px 12px; border-radius: 6px; border: 1px solid #E2E8F0;">
              ✓ Khung gia cường chịu gió &bull; Kính cường lực dày &bull; Kín nước ngoài trời
            </div>
          </div>
        </div>
      </div>

      <!-- 04. SPECIAL DOORS -->
      <div class="door-cat-card" id="specialDoors">
        <div class="door-cat-header">
          <div>
            <span class="al-tag"><i class="ri-checkbox-circle-line"></i> NHÓM 04 &bull; CỬA ĐẶC BIỆT</span>
            <div class="door-cat-title">Cửa Thủy Lực Bản Lớn &amp; Cửa Xếp Trượt (3 Hệ)</div>
            <div class="door-cat-sub">Đại sảnh bề thế và giải pháp xếp gọn giải phóng 100% không gian mở.</div>
          </div>
          <span style="font-family: var(--ff-head); font-size: 12px; font-weight: 800; color: #059669; background: #D1FAE5; padding: 6px 12px; border-radius: 20px;">
            Grand Format
          </span>
        </div>
        <div class="sys-box-grid">
          <div class="sys-box">
            <span class="sys-box-code">VH65-TL60</span>
            <div class="sys-box-title">Cửa Thủy Lực Bản Cánh Lớn</div>
            <div class="sys-box-raw">Yongxing VH65 / Seaaluk TL60</div>
            <div class="sys-box-desc">Khung nhôm bản to kết hợp bản lề sàn thủy lực, đóng mở 2 chiều êm ái cho cửa chính đại sảnh biệt thự.</div>
          </div>
          <div class="sys-box">
            <span class="sys-box-code">F63</span>
            <div class="sys-box-title">Cửa Xếp Trượt 63</div>
            <div class="sys-box-raw">Mã: Yongxing F63</div>
            <div class="sys-box-desc">Màu Xám Vô Cực Nhũ Bạc sang trọng, xếp gọn các cánh cửa mở rộng tối đa lối đi ra sân vườn.</div>
          </div>
          <div class="sys-box" style="border-color: rgba(201, 162, 39, 0.4); background: #FFFDF9;">
            <span class="sys-box-code" style="background: #0F172A; color: #C9A227;">X80-SOCO80</span>
            <div class="sys-box-title">Cửa Xếp Trượt Khẩu Độ Lớn X80</div>
            <div class="sys-box-raw">Seaaluk X80, Yongxing Soco80</div>
            <div class="sys-box-desc">Profile rãnh C bản 80 chịu tải trọng nặng, cho phép thiết kế các cánh cửa cao rộng cho resort và hồ bơi.</div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- RFQ FORM -->
  <section style="padding: 80px 0; background: #FFFFFF;" id="doorRfq">
    <div class="container" style="max-width: 800px;">
      <div style="text-align: center; margin-bottom: 36px;">
        <span class="al-tag"><i class="ri-file-text-line"></i> DỰ TOÁN CỬA NHÔM KÍNH</span>
        <h2 class="al-title">Nhận Tư Vấn Cấu Hình &amp; Báo Giá Cửa</h2>
        <p class="al-subtitle" style="margin: 0 auto;">Gửi mặt bằng hoặc quy cách kích thước cửa để kỹ sư Sao Vàng tư vấn giải pháp tối ưu.</p>
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px;">
        <form id="doorRfqForm" onsubmit="event.preventDefault();">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <input type="text" required placeholder="Họ tên / Đơn vị *" style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px; background: #FFF;" />
            <input type="tel" required placeholder="Số điện thoại / Zalo *" style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px; background: #FFF;" />
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <select style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px; background: #FFF;">
              <option>Loại công trình: Biệt Thự / Penthouse</option>
              <option>Nhà Ở / Nhà Phố</option>
              <option>Căn Hộ Cao Cấp</option>
              <option>Resort / Khách Sạn</option>
              <option>Du Thuyền (Yacht Division)</option>
            </select>
            <select style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px; background: #FFF;">
              <option>Hệ cửa quan tâm: Cửa Lùa Panorama L180</option>
              <option>Cửa Slim 130 Ngoại Thất</option>
              <option>Cửa Slim 40 Nội Thất</option>
              <option>Cửa Mở Quay C65 Rãnh C</option>
              <option>Cửa Xếp Trượt X80</option>
              <option>Cửa Thủy Lực VH65</option>
              <option>Chưa xác định (Cần tư vấn)</option>
            </select>
          </div>
          <div style="margin-bottom: 16px;">
            <input type="file" id="doorRfqFile" multiple style="width: 100%; padding: 10px; border: 1px dashed #94A3B8; border-radius: 6px; background: #FFFFFF; font-size: 13px;" />
            <span style="font-size: 11px; color: #64748B; margin-top: 4px; display: block;">Hỗ trợ upload bản vẽ (.dwg, .dxf, .pdf, .step, .zip) tối đa 50MB</span>
          </div>
          <div style="margin-bottom: 20px;">
            <textarea rows="3" placeholder="Ghi chú kích thước sơ bộ hoặc yêu cầu kỹ thuật..." style="width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px; background: #FFF; resize: vertical;"></textarea>
          </div>
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px 16px; margin-bottom: 20px; font-size: 12.5px; color: #64748B;">
            <i class="ri-shield-check-line" style="color: #C9A227;"></i> Hỗ trợ tiếp nhận hồ sơ dự án theo thỏa thuận bảo mật (NDA) khi có yêu cầu.
          </div>
          <div style="text-align: center;">
            <button type="submit" class="al-btn-gold" style="border: none; cursor: pointer; padding: 14px 32px; font-size: 14px;">
              <i class="ri-send-plane-line"></i> GỬI YÊU CẦU DỰ TOÁN CỬA
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer-v2" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-brand">
            <img width="200" height="60" loading="lazy" src="assets/images/logo-nhom-white.png" alt="SV ALUMINIUM" style="height: 44px; width: auto; display: block; margin-bottom: 12px;" />
            <p class="footer-desc">SV ALUMINIUM &bull; Architectural Aluminium Systems — Giải pháp nhôm kính từ phân khúc tiêu chuẩn đến kiến trúc cao cấp cho Residence, Villa, Hospitality &amp; Yacht.</p>
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">HỆ THỐNG NHÔM KÍNH</div>
          <div class="footer-links">
            <a href="cuanhomkinh.html" class="footer-link">Cửa Nhôm Kính Cao Cấp</a>
            <a href="vachkinh.html" class="footer-link">Vách Kính &amp; Mặt Dựng</a>
            <a href="thuvienprofilenhom.html" class="footer-link">Thư Viện Profile Nhôm</a>
            <a href="nhomsaovang.html#finishesSection" class="footer-link">Bảng Màu &amp; Anodize ED</a>
            <a href="duan.html" class="footer-link">Dự Án Đã Thực Hiện</a>
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">LIÊN HỆ KỸ THUẬT</div>
          <div class="footer-contact-item"><i class="ri-phone-fill"></i> Hotline / Zalo: 0869 590 279</div>
          <div class="footer-contact-item"><i class="ri-mail-fill"></i> cokhisaovangvn@gmail.com</div>
          <div class="footer-contact-item"><i class="ri-map-pin-fill"></i> Tầng 3, TT7-35 KĐT Văn Phú, Hà Đông, Hà Nội</div>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; 2026 CÔNG TY CỔ PHẦN SẢN XUẤT CƠ KHÍ SAO VÀNG. MST: 0110808047.</p>
      </div>
    </div>
  </footer>

  <script src="assets/js/main.js"></script>
  <script src="assets/js/aluminium-rfq.js"></script>
</body>
</html>
"""

# 2. vachkinh.html
vachkinh_html = """<!DOCTYPE html>
<html lang="vi">
<head>
  <link rel="icon" type="image/svg+xml" href="assets/images/logo-sv-main.svg" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0F172A" />
  <title>Vách Kính &amp; Mặt Dựng Kiến Trúc | SV ALUMINIUM — Sao Vàng</title>
  <meta name="description" content="Giải pháp vách kính thông tầng, vách ngăn Slim nội thất và mặt dựng nhôm kính MD50/MD52/MD65 cho biệt thự hiện đại, showroom và tòa nhà quy mô của SV ALUMINIUM." />
  <meta name="keywords" content="vách kính mặt dựng, mặt dựng nhôm kính md65, vách kính slim nội thất, vách kính thông tầng, mặt dựng stick giấu đố, sao vàng aluminium" />
  
  <meta property="og:title" content="Vách Kính &amp; Mặt Dựng Kiến Trúc | SV ALUMINIUM — Sao Vàng" />
  <meta property="og:description" content="Giải pháp mặt dựng và vách kính kiến trúc cho công trình quy mô và yêu cầu kỹ thuật cao." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="assets/images/projects/yacht-tulip/hero.jpg" />
  <link rel="canonical" href="https://www.cokhisaovang.com/vachkinh.html" />

  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" />
  <link rel="stylesheet" href="assets/css/main.css" />

  <style>
    :root {
      --sv-dark: #0F172A;
      --sv-dark-card: #1E293B;
      --sv-gold: #C9A227;
      --sv-gold-light: #E5C158;
      --sv-slate: #64748B;
      --sv-bg-light: #F8FAFC;
      --ff-head: 'Montserrat', sans-serif;
      --ff-body: 'Inter', sans-serif;
    }

    body { font-family: var(--ff-body); color: #334155; background-color: #FFFFFF; }
    
    .al-tag {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: var(--ff-head); font-size: 11px; font-weight: 800;
      letter-spacing: 0.14em; text-transform: uppercase; color: var(--sv-gold); margin-bottom: 12px;
    }
    .al-title {
      font-family: var(--ff-head); font-size: clamp(24px, 4vw, 36px);
      font-weight: 800; color: var(--sv-dark); line-height: 1.25; margin-bottom: 16px;
    }
    .al-title-light { color: #FFFFFF; }
    .al-subtitle { font-size: clamp(14px, 1.8vw, 16px); color: var(--sv-slate); line-height: 1.7; max-width: 700px; }

    /* HERO */
    .facade-hero {
      position: relative; background: radial-gradient(circle at 50% 30%, #1E293B 0%, #0F172A 100%);
      color: #FFFFFF; padding: 150px 0 90px; text-align: center; border-bottom: 1px solid rgba(201, 162, 39, 0.2);
    }
    .facade-hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(201, 162, 39, 0.12); border: 1px solid rgba(201, 162, 39, 0.4);
      padding: 6px 18px; border-radius: 30px; font-family: var(--ff-head);
      font-size: 11px; font-weight: 800; color: var(--sv-gold); text-transform: uppercase;
      letter-spacing: 0.12em; margin-bottom: 20px;
    }
    .facade-hero-h1 {
      font-family: var(--ff-head); font-size: clamp(28px, 5vw, 48px);
      font-weight: 900; line-height: 1.2; margin-bottom: 16px;
    }
    .facade-hero-h1 span {
      background: linear-gradient(135deg, #FFFFFF 0%, var(--sv-gold) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .facade-hero-p { font-size: clamp(14.5px, 1.8vw, 17px); color: #94A3B8; max-width: 760px; margin: 0 auto 30px; line-height: 1.7; }

    /* FACADE CARD */
    .facade-card {
      background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px;
      padding: 36px; margin-bottom: 30px; transition: all 0.3s ease;
    }
    .facade-card:hover { border-color: var(--sv-gold); box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
    .facade-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 20px; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid #F1F5F9; padding-bottom: 16px;
    }
    .facade-title { font-family: var(--ff-head); font-size: 22px; font-weight: 800; color: var(--sv-dark); }
    .facade-desc { font-size: 13.5px; color: var(--sv-slate); line-height: 1.6; }

    .al-btn-gold {
      background: linear-gradient(135deg, #C9A227 0%, #B89218 100%);
      color: #0F172A; font-family: var(--ff-head); font-size: 13px; font-weight: 800;
      padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
      box-shadow: 0 4px 14px rgba(201, 162, 39, 0.3); transition: all 0.3s ease;
    }
    .al-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(201, 162, 39, 0.5); color: #000; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <header class="header-v2" id="navbar" role="banner">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo" aria-label="SV ALUMINIUM">
        <img width="220" height="60" fetchpriority="high" loading="eager" src="assets/images/logo-nhom.png" alt="SV ALUMINIUM" style="height: 46px; width: auto; display: block;" />
      </a>
      <nav class="nav-menu" id="navMenu" role="navigation" aria-label="Menu chính">
        <a href="index.html" class="nav-menu-link">Trang Chủ</a>
        <a href="gioithieu.html" class="nav-menu-link">Giới Thiệu</a>
        <a href="cokhisaovang.html" class="nav-menu-link">Cơ Khí Sao Vàng</a>
        <a href="nhomsaovang.html" class="nav-menu-link">SV Aluminium</a>
        <a href="cuanhomkinh.html" class="nav-menu-link">Cửa Nhôm Kính</a>
        <a href="vachkinh.html" class="nav-menu-link active">Vách Kính &amp; Mặt Dựng</a>
        <a href="thuvienprofilenhom.html" class="nav-menu-link">Thư Viện Profile</a>
        <a href="duan.html" class="nav-menu-link">Dự Án</a>
        <a href="lienhe.html" class="nav-menu-link">Liên Hệ</a>
      </nav>
      <div class="nav-actions">
        <a href="vachkinh.html#facadeRfq" class="btn-primary" style="font-family: var(--ff-head); font-size: 12.5px; font-weight: 800; padding: 10px 20px; border-radius: 4px; background: #C9A227; color: #0F172A; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
          <i class="ri-file-text-line"></i> DỰ TOÁN VÁCH
        </a>
      </div>
    </div>
  </header>

  <!-- HERO -->
  <section class="facade-hero">
    <div class="container">
      <div class="facade-hero-badge"><i class="ri-building-2-line"></i> SV ALUMINIUM &bull; ARCHITECTURAL FACADES</div>
      <h1 class="facade-hero-h1">HỆ VÁCH KÍNH &amp;<br><span>MẶT DỰNG KIẾN TRÚC</span></h1>
      <p class="facade-hero-p">
        Giải pháp mặt dựng nhôm kính MD50/MD52/MD65 và vách ngăn Slim nội thất cho biệt thự thông tầng, tòa nhà văn phòng, showroom và công trình quy mô yêu cầu kỹ thuật cao.
      </p>
      <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
        <a href="#facadeList" class="al-btn-gold"><i class="ri-arrow-down-line"></i> KHÁM PHÁ CÁC GIẢI PHÁP MẶT DỰNG</a>
        <a href="thuvienprofilenhom.html" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #FFF; padding: 12px 24px; border-radius: 6px; font-family: var(--ff-head); font-size: 13px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
          <i class="ri-book-read-line"></i> TRA CỨU TIẾT DIỆN PROFILE
        </a>
      </div>
    </div>
  </section>

  <!-- 5 FACADE CATEGORIES -->
  <section style="padding: 80px 0; background: #F8FAFC;" id="facadeList">
    <div class="container">

      <!-- 01. VÁCH KÍNH CỐ ĐỊNH -->
      <div class="facade-card">
        <div class="facade-header">
          <div>
            <span class="al-tag"><i class="ri-layout-masonry-line"></i> 01 — VÁCH KÍNH NHÔM TIÊU CHUẨN</span>
            <div class="facade-title">Vách Kính Cố Định Cách Âm &amp; Lấy Sáng</div>
            <div class="facade-desc">Giải pháp vách kính nhôm hệ định hình ngăn chia không gian phòng khách, phòng ngủ và hành lang.</div>
          </div>
          <span style="font-size: 11.5px; font-weight: 700; color: #0284C7; background: #E0F2FE; padding: 6px 12px; border-radius: 4px;">
            Nhà Ở &bull; Căn Hộ
          </span>
        </div>
        <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0;">
          Sử dụng hệ thanh nhôm định hình kết hợp kính an toàn dán 2 lớp hoặc kính cường lực, gioăng đệm EPDM chống rung, triệt tiêu tiếng ồn đô thị và đón trọn vẹn ánh sáng tự nhiên.
        </p>
      </div>

      <!-- 02. SLIM INTERIOR -->
      <div class="facade-card">
        <div class="facade-header">
          <div>
            <span class="al-tag"><i class="ri-layout-grid-line"></i> 02 — VÁCH KÍNH SLIM NỘI THẤT</span>
            <div class="facade-title">Vách Ngăn Slim 40 Khung Siêu Mảnh (Minimalist)</div>
            <div class="facade-desc">Đường nét thanh mảnh tối giản, xóa nhòa ranh giới giữa các phòng chức năng.</div>
          </div>
          <span style="font-size: 11.5px; font-weight: 700; color: #7C3AED; background: #EDE9FE; padding: 6px 12px; border-radius: 4px;">
            Minimalist Interior
          </span>
        </div>
        <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0;">
          Ứng dụng hệ nhôm Slim 40 phôi siêu mỏng kết hợp kính siêu trong (Low-Iron) hoặc kính sọc Fluted, tạo không gian mở sang trọng giữa phòng khách, phòng ăn và phòng làm việc.
        </p>
      </div>

      <!-- 03. MD50 / MD52 -->
      <div class="facade-card">
        <div class="facade-header">
          <div>
            <span class="al-tag"><i class="ri-building-line"></i> 03 — MẶT DỰNG MD50 / MD52</span>
            <div class="facade-title">Mặt Dựng Nhôm Kính MD50 &amp; MD52 (Lộ Đố / Giấu Đố)</div>
            <div class="facade-desc">Giải pháp bao che mặt tiền showroom, văn phòng và vách kính thông tầng biệt thự.</div>
          </div>
          <span style="font-size: 11.5px; font-weight: 700; color: #D97706; background: #FEF3C7; padding: 6px 12px; border-radius: 4px;">
            Mã: Seaaluk, Yongxing
          </span>
        </div>
        <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0;">
          Hệ mặt dựng Stick bản nhôm 50-52mm chắc khỏe, cho phép lựa chọn hai phong cách: Giấu đố liền mạch tạo bức tường kính phẳng tắp hoặc Lộ đố ngang/dọc tạo điểm nhấn hình khối khỏe khoắn cho công trình.
        </p>
      </div>

      <!-- 04. MD65 HIGH-SPAN -->
      <div class="facade-card" style="border-color: #C9A227; background: #0F172A; color: #FFFFFF;">
        <div class="facade-header" style="border-bottom-color: #334155;">
          <div>
            <span class="al-tag" style="color: #C9A227;"><i class="ri-shield-star-line"></i> 04 — MẶT DỰNG KHỔ LỚN MD65</span>
            <div class="facade-title" style="color: #FFFFFF;">Mặt Dựng Khổ Lớn MD65 (High-Rise &amp; Marine Facade)</div>
            <div class="facade-desc" style="color: #94A3B8;">Giải pháp mặt dựng cho công trình quy mô và yêu cầu kỹ thuật cao.</div>
          </div>
          <span style="font-size: 11.5px; font-weight: 800; color: #0F172A; background: #C9A227; padding: 6px 12px; border-radius: 4px;">
            Ultra Luxury Facade
          </span>
        </div>
        <p style="font-size: 13.5px; color: #CBD5E1; line-height: 1.7; margin: 0;">
          Bản nhôm kết cấu 65mm gia cường mô-men quán tính chống võng dầm nhịp lớn, tối ưu cho tòa nhà cao tầng, resort biển chịu tải trọng gió bão lớn và vách kính khổ lớn thông tầng 2-3 tầng biệt thự.
        </p>
      </div>

      <!-- 05. BESPOKE GLAZING -->
      <div class="facade-card">
        <div class="facade-header">
          <div>
            <span class="al-tag"><i class="ri-magic-line"></i> 05 — GIẢI PHÁP THEO THIẾT KẾ RIÊNG</span>
            <div class="facade-title">Vách Kính Canopy, Giếng Trời &amp; Góc Uốn Cong (Bespoke)</div>
            <div class="facade-desc">Gia công chính xác theo bản vẽ kiến trúc độc bản của Kiến trúc sư.</div>
          </div>
          <span style="font-size: 11.5px; font-weight: 700; color: #059669; background: #D1FAE5; padding: 6px 12px; border-radius: 4px;">
            Bespoke Architecture
          </span>
        </div>
        <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0;">
          Kết hợp giữa kết cấu dầm thép định hình và chân spider Inox 304/316, kính hộp Low-E dán an toàn chống nóng tạo nên các mái sảnh canopy vươn dài, giếng trời đón sáng và vách kính uốn cong mềm mại.
        </p>
      </div>

    </div>
  </section>

  <!-- RFQ FORM -->
  <section style="padding: 80px 0; background: #FFFFFF;" id="facadeRfq">
    <div class="container" style="max-width: 800px;">
      <div style="text-align: center; margin-bottom: 36px;">
        <span class="al-tag"><i class="ri-file-text-line"></i> DỰ TOÁN MẶT DỰNG &amp; VÁCH KÍNH</span>
        <h2 class="al-title">Gửi Bản Vẽ &amp; Yêu Cầu Kỹ Thuật Mặt Dựng</h2>
        <p class="al-subtitle" style="margin: 0 auto;">Đội ngũ kỹ sư kết cấu Sao Vàng sẽ phân tích tải trọng, đề xuất phương án và phản hồi dự toán chi tiết.</p>
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px;">
        <form id="facadeRfqForm" onsubmit="event.preventDefault();">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <input type="text" required placeholder="Họ tên / Đơn vị tư vấn thiết kế *" style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px; background: #FFF;" />
            <input type="tel" required placeholder="Số điện thoại / Zalo *" style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px; background: #FFF;" />
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <select style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px; background: #FFF;">
              <option>Hạng mục: Mặt Dựng MD65 Khổ Lớn</option>
              <option>Mặt Dựng MD50 / MD52</option>
              <option>Vách Kính Slim 40 Nội Thất</option>
              <option>Vách Kính Thông Tầng Biệt Thự</option>
              <option>Mái Kính Canopy &amp; Giếng Trời</option>
            </select>
            <input type="text" placeholder="Địa điểm công trình (Tỉnh/TP)" style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px; background: #FFF;" />
          </div>
          <div style="margin-bottom: 16px;">
            <input type="file" id="facadeRfqFile" multiple style="width: 100%; padding: 10px; border: 1px dashed #94A3B8; border-radius: 6px; background: #FFFFFF; font-size: 13px;" />
            <span style="font-size: 11px; color: #64748B; margin-top: 4px; display: block;">Hỗ trợ upload bản vẽ CAD (.dwg, .dxf), file PDF, STEP hoặc ZIP (Tối đa 50MB)</span>
          </div>
          <div style="margin-bottom: 20px;">
            <textarea rows="3" placeholder="Ghi chú khối lượng m2 ước tính hoặc yêu cầu kính (Low-E, phản quang, kính hộp)..." style="width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px; background: #FFF; resize: vertical;"></textarea>
          </div>
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px 16px; margin-bottom: 20px; font-size: 12.5px; color: #64748B;">
            <i class="ri-shield-check-line" style="color: #C9A227;"></i> Hỗ trợ tiếp nhận hồ sơ dự án theo thỏa thuận bảo mật (NDA) khi có yêu cầu.
          </div>
          <div style="text-align: center;">
            <button type="submit" class="al-btn-gold" style="border: none; cursor: pointer; padding: 14px 32px; font-size: 14px;">
              <i class="ri-send-plane-line"></i> GỬI YÊU CẦU DỰ TOÁN VÁCH KÍNH
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer-v2" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-brand">
            <img width="200" height="60" loading="lazy" src="assets/images/logo-nhom-white.png" alt="SV ALUMINIUM" style="height: 44px; width: auto; display: block; margin-bottom: 12px;" />
            <p class="footer-desc">SV ALUMINIUM &bull; Architectural Aluminium Systems — Giải pháp nhôm kính từ phân khúc tiêu chuẩn đến kiến trúc cao cấp cho Residence, Villa, Hospitality &amp; Yacht.</p>
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">HỆ THỐNG NHÔM KÍNH</div>
          <div class="footer-links">
            <a href="cuanhomkinh.html" class="footer-link">Cửa Nhôm Kính Cao Cấp</a>
            <a href="vachkinh.html" class="footer-link">Vách Kính &amp; Mặt Dựng</a>
            <a href="thuvienprofilenhom.html" class="footer-link">Thư Viện Profile Nhôm</a>
            <a href="nhomsaovang.html#finishesSection" class="footer-link">Bảng Màu &amp; Anodize ED</a>
            <a href="duan.html" class="footer-link">Dự Án Đã Thực Hiện</a>
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">LIÊN HỆ KỸ THUẬT</div>
          <div class="footer-contact-item"><i class="ri-phone-fill"></i> Hotline / Zalo: 0869 590 279</div>
          <div class="footer-contact-item"><i class="ri-mail-fill"></i> cokhisaovangvn@gmail.com</div>
          <div class="footer-contact-item"><i class="ri-map-pin-fill"></i> Tầng 3, TT7-35 KĐT Văn Phú, Hà Đông, Hà Nội</div>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; 2026 CÔNG TY CỔ PHẦN SẢN XUẤT CƠ KHÍ SAO VÀNG. MST: 0110808047.</p>
      </div>
    </div>
  </footer>

  <script src="assets/js/main.js"></script>
  <script src="assets/js/aluminium-rfq.js"></script>
</body>
</html>
"""

with open(r"d:\Sao Vàng\Website-SaoVang\website\cuanhomkinh.html", "w", encoding="utf-8") as f:
    f.write(cuanhomkinh_html)
print("✅ Updated cuanhomkinh.html with aluminium-rfq.js")

with open(r"d:\Sao Vàng\Website-SaoVang\website\vachkinh.html", "w", encoding="utf-8") as f:
    f.write(vachkinh_html)
print("✅ Updated vachkinh.html with aluminium-rfq.js")
