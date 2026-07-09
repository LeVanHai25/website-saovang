# -*- coding: utf-8 -*-
import os

def update_co_khi_sao_vang():
    file_path = r"d:\Sao Vàng\Website-SaoVang\website\co-khi-sao-vang.html"
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the main tag content
    start_tag = '<main id="main-content">'
    end_tag = '</main>'
    
    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag)

    if start_idx == -1 or end_idx == -1:
        print("Error: main tags not found in co-khi-sao-vang.html")
        return

    # New EPCM content
    new_main_content = """<main id="main-content">

    <!-- ════════════════════════════════════════════
         SECTION 2: PAGE HERO
    ════════════════════════════════════════════ -->
    <section class="page-hero" aria-label="Cơ Khí Sao Vàng Hero Banner">
      <div class="page-hero-bg" aria-hidden="true">
        <img src="https://i.pinimg.com/736x/2a/39/fa/2a39fabec655ea7df8a0c2ff665a6a0a.jpg" alt="Xưởng cơ khí CNC Sao Vàng" />
      </div>
      <div class="page-hero-content">
        <span class="page-hero-tag">Giải Pháp EPCM Tổng Thể</span>
        <h1 class="page-hero-title">CƠ KHÍ SAO VÀNG</h1>
        <p class="page-hero-desc" style="font-weight: 700; text-transform: uppercase; color: var(--sv-gold-500); margin-bottom: 12px; letter-spacing: 0.05em;">Giải Pháp Cơ Khí Toàn Diện — Từ Ý Tưởng Đến Công Trình</p>
        <p class="page-hero-desc" style="font-size: 15px;">Chúng tôi đồng hành cùng khách hàng từ ý tưởng, thiết kế DFM, sản xuất tại xưởng đến thi công lắp đặt và bảo trì công trình trọn gói (EPCM), loại bỏ mọi rủi ro nhà thầu phụ trung gian.</p>
      </div>
    </section>


    <!-- ════════════════════════════════════════════
         SECTION 3: GIỚI THIỆU THƯƠNG HIỆU & TẦM NHÌN
    ════════════════════════════════════════════ -->
    <section class="brand-intro" aria-label="Giới thiệu thương hiệu">
      <div class="sv-container">
        <div class="intro-grid">
          
          <!-- Text -->
          <div data-sv-reveal>
            <span class="sv-section-tag">TÁI ĐỊNH VỊ THƯƠNG HIỆU CKSV</span>
            <h2 class="sv-section-title">Nhà Cung Cấp Giải Phải Cơ Khí Tổng Thể</h2>
            <p style="font-size:var(--sv-fs-md); line-height:1.65; color:var(--sv-gray-text); margin-bottom:var(--sv-sp-4); font-weight:300;">
              Hiện nay, phần lớn doanh nghiệp cơ khí tại Việt Nam đang giới thiệu năng lực theo cách truyền thống là liệt kê danh sách máy móc và dịch vụ gia công đơn lẻ. Tại **Cơ Khí Sao Vàng (CKSV)**, chúng tôi tin rằng khách hàng không đơn thuần mua thời gian chạy máy CNC mà họ mua một kết quả hoàn chỉnh, tiến độ cam kết và một đầu mối duy nhất chịu trách nhiệm.
            </p>
            <p style="font-size:var(--sv-fs-sm); line-height:1.6; color:var(--sv-gray-text); margin-bottom:var(--sv-sp-6);">
              Vì vậy, CKSV chính thức tái định vị từ một xưởng gia công thông thường thành đơn vị cung cấp giải pháp cơ khí tổng thể theo mô hình chuỗi giá trị khép kín **EPCM (Engineering – Procurement – Construction – Maintenance)**.
            </p>
            <div style="display:flex; gap:16px; flex-wrap:wrap;">
              <a href="#quickQuote" class="sv-btn sv-btn-gold">BÁO GIÁ NHANH &amp; NDA <i class="ri-arrow-right-line" aria-hidden="true"></i></a>
              <a href="nang-luc.html" class="sv-btn sv-btn-outline-gold">NĂNG LỰC SẢN XUẤT</a>
            </div>
          </div>

          <!-- Image -->
          <div class="intro-image-wrap" data-sv-reveal="right">
            <img src="https://i.pinimg.com/736x/1a/0f/58/1a0f58eb8082697858c8ecb47690fb0a3a.jpg" alt="Mối hàn Inox TIG vảy cá tại Sao Vàng" />
            <div class="intro-experience-badge" aria-label="Cam kết bảo hành kết cấu 5 năm">
              <span class="intro-experience-num">5 Năm</span>
              <span class="intro-experience-lbl">Bảo hành kết cấu</span>
            </div>
          </div>

        </div>

        <!-- Vision, Mission & Values subgrid -->
        <div class="brand-vision-mission">
          <div class="brand-vm-card">
            <h3 class="brand-vm-title"><i class="ri-eye-line"></i> Tầm Nhìn</h3>
            <p class="brand-vm-desc">Trở thành thương hiệu hàng đầu Việt Nam cung cấp giải pháp cơ khí tổng thể cho các công trình công nghiệp quy mô lớn và kiến trúc dân dụng cao cấp, chuẩn hóa chuỗi giá trị EPCM.</p>
          </div>
          <div class="brand-vm-card">
            <h3 class="brand-vm-title"><i class="ri-compass-3-line"></i> Sứ Mệnh</h3>
            <p class="brand-vm-desc">Đồng hành từ ý tưởng sơ khởi đến khi công trình vận hành an toàn, tối ưu hóa giá trị đầu tư cho khách hàng bằng giải pháp trọn gói kỹ thuật cao và loại bỏ hoàn toàn các rủi ro trung gian.</p>
          </div>
          <div class="brand-vm-card">
            <h3 class="brand-vm-title"><i class="ri-heart-line"></i> Giá Trị Cốt Lõi</h3>
            <p class="brand-vm-desc">Chính trực (100% CO/CQ, bảo mật NDA), Chuyên nghiệp (AWS, ASME), Tư duy thực chiến (Triết lý DFM tối ưu hóa kết cấu và hao phí phôi), Bền vững lâu dài.</p>
          </div>
        </div>

      </div>
    </section>


    <!-- ════════════════════════════════════════════
         SECTION 4: 5 LỢI THẾ CẠNH TRANH CỐT LÕI (USPs)
    ════════════════════════════════════════════ -->
    <section class="division-section" aria-label="Lợi thế cạnh tranh cốt lõi của CKSV">
      <div class="sv-container">
        
        <div style="text-align:center; margin-bottom:var(--sv-sp-8);" data-sv-reveal>
          <span class="sv-section-tag">TẠI SAO CHỌN CƠ KHÍ SAO VÀNG?</span>
          <h2 class="sv-section-title" style="margin-inline:auto;">5 Lợi Thế Cạnh Tranh Cốt Lõi (USPs)</h2>
          <p style="font-size:var(--sv-fs-sm); color:var(--sv-gray-text); max-width:600px; margin-inline:auto; margin-top:var(--sv-sp-2);">
            Giữa hàng ngàn doanh nghiệp cơ khí trên thị trường, CKSV tự tin khẳng định những giá trị khác biệt vượt trội sau đây.
          </p>
        </div>

        <div class="division-grid" style="grid-template-columns: repeat(5, 1fr);">
          
          <!-- USP 1 -->
          <div class="division-card" data-sv-reveal data-sv-delay="1">
            <div class="division-icon" aria-hidden="true">
              <i class="ri-git-merge-line"></i>
            </div>
            <h3 class="division-title" style="font-size: 14px;">Chuỗi Dịch Vụ Khép Kín EPCM</h3>
            <p class="division-desc" style="font-size: 12px; line-height: 1.5;">Đảm nhận toàn bộ vòng đời dự án: Khảo sát → Thiết kế DFM → Chế tạo tại xưởng → Thi công lắp dựng → Bảo trì. Khách hàng chỉ làm việc với một đầu mối chịu trách nhiệm duy nhất.</p>
          </div>

          <!-- USP 2 -->
          <div class="division-card" data-sv-reveal data-sv-delay="2">
            <div class="division-icon" aria-hidden="true">
              <i class="ri-pencil-ruler-2-line"></i>
            </div>
            <h3 class="division-title" style="font-size: 14px;">Tư Duy Thiết Kế Thực Chiến DFM</h3>
            <p class="division-desc" style="font-size: 12px; line-height: 1.5;">Ứng dụng thiết kế DFM (Design for Manufacturing) trên SolidWorks/Inventor, chủ động phát hiện lỗi và hiệu chỉnh kết cấu 3D, giúp triệt tiêu 98% sai lệch khi thi công.</p>
          </div>

          <!-- USP 3 -->
          <div class="division-card" data-sv-reveal data-sv-delay="3">
            <div class="division-icon" aria-hidden="true">
              <i class="ri-tools-line"></i>
            </div>
            <h3 class="division-title" style="font-size: 14px;">Năng Lực Tùy Biến Độc Bản</h3>
            <p class="division-desc" style="font-size: 12px; line-height: 1.5;">Chúng tôi không bán sản phẩm đại trà có sẵn. CKSV chuyên thiết kế và chế tạo tùy biến hoàn toàn theo đúng nhu cầu và bản vẽ kỹ thuật chi tiết của đối tác.</p>
          </div>

          <!-- USP 4 -->
          <div class="division-card" data-sv-reveal data-sv-delay="4">
            <div class="division-icon" aria-hidden="true">
              <i class="ri-checkbox-circle-line"></i>
            </div>
            <h3 class="division-title" style="font-size: 14px;">Chất Lượng B2B Chuẩn Mực</h3>
            <p class="division-desc" style="font-size: 12px; line-height: 1.5;">Cam kết 100% phôi vật tư chính hãng có chứng chỉ CO/CQ rõ ràng, mối hàn đạt tiêu chuẩn AWS/ASME, dung sai kiểm soát chặt chẽ qua thiết bị đo kiểm hiện đại.</p>
          </div>

          <!-- USP 5 -->
          <div class="division-card" data-sv-reveal data-sv-delay="5">
            <div class="division-icon" aria-hidden="true">
              <i class="ri-coins-line"></i>
            </div>
            <h3 class="division-title" style="font-size: 14px;">Tối Ưu Hóa Chi Phí Tổng Thể</h3>
            <p class="division-desc" style="font-size: 12px; line-height: 1.5;">Thông qua khâu thiết kế chịu lực hợp lý tránh dư thừa và tiến độ thi công đồng bộ nhanh hơn 20%, giúp dự án sớm đưa vào khai thác và tối ưu hóa tổng chi phí.</p>
          </div>

        </div>
      </div>
    </section>


    <!-- ════════════════════════════════════════════
         SECTION 5: 4 TRỤ CỘT NĂNG LỰC DỊCH VỤ (EPCM)
    ════════════════════════════════════════════ -->
    <section class="division-section" style="background: var(--sv-white);" aria-label="4 trụ cột năng lực hoạt động">
      <div class="sv-container">
        
        <div style="text-align:center; margin-bottom:var(--sv-sp-8);" data-sv-reveal>
          <span class="sv-section-tag">NĂNG LỰC HÀNH ĐỘNG</span>
          <h2 class="sv-section-title" style="margin-inline:auto;">4 Trụ Cột Năng Lực Dịch Vụ</h2>
          <p style="font-size:var(--sv-fs-sm); color:var(--sv-gray-text); max-width:600px; margin-inline:auto; margin-top:var(--sv-sp-2);">
            Cơ cấu năng lực của CKSV được tổ chức chặt chẽ theo 4 mảng chiến lược đại diện cho chuỗi giá trị đầy đủ của một dự án cơ khí hiện đại.
          </p>
        </div>

        <div class="epcm-tabs-container">
          <!-- Tab Buttons -->
          <div class="epcm-tabs">
            <button class="epcm-tab-btn active" data-tab="tab-engineering">01. Engineering (Kỹ Thuật)</button>
            <button class="epcm-tab-btn" data-tab="tab-manufacturing">02. Manufacturing (Gia Công)</button>
            <button class="epcm-tab-btn" data-tab="tab-installation">03. Installation (Thi Công)</button>
            <button class="epcm-tab-btn" data-tab="tab-maintenance">04. Maintenance (Bảo Trì)</button>
          </div>

          <!-- Tab Content 1 -->
          <div class="epcm-tab-content active" id="tab-engineering">
            <div>
              <h3 class="sv-section-title" style="font-size: 24px; text-align: left; margin-bottom: var(--sv-sp-4);">Trụ Cột 01: Engineering Services (Kỹ Thuật &amp; Thiết Kế)</h3>
              <p style="font-size:var(--sv-fs-sm); line-height:1.6; color:var(--sv-gray-text); margin-bottom:var(--sv-sp-4);">
                Đây là giai đoạn khởi đầu quyết định sự thành bại và tính kinh tế của dự án. Chúng tôi biến mọi ý tưởng sơ khởi của đối tác thành giải pháp kỹ thuật có tính khả thi cao trước khi đưa vào sản xuất hàng loạt.
              </p>
              <div class="epcm-features-list">
                <span class="epcm-feature-item">Khảo sát &amp; đo đạc hiện trạng laser 3D</span>
                <span class="epcm-feature-item">Tư vấn giải pháp kỹ thuật tối ưu hóa kết cấu</span>
                <span class="epcm-feature-item">Thiết kế kỹ thuật 2D/3D SolidWorks, Inventor</span>
                <span class="epcm-feature-item">Triển khai bản vẽ Shop Drawing định hướng DFM</span>
                <span class="epcm-feature-item">Phân tích chịu lực &amp; mô phỏng ứng suất FEA</span>
                <span class="epcm-feature-item">Bóc tách khối lượng BOM vật tư chuẩn xác</span>
              </div>
            </div>
            <div class="epcm-tab-img">
              <img src="https://i.pinimg.com/736x/88/a4/09/88a409e51c89f53835cc988d451e5e6e3c.jpg" alt="Thiết kế cơ khí Solidworks DFM tại Sao Vàng" />
            </div>
          </div>

          <!-- Tab Content 2 -->
          <div class="epcm-tab-content" id="tab-manufacturing">
            <div>
              <h3 class="sv-section-title" style="font-size: 24px; text-align: left; margin-bottom: var(--sv-sp-4);">Trụ Cột 02: Manufacturing Services (Gia Công &amp; Chế Tạo)</h3>
              <p style="font-size:var(--sv-fs-sm); line-height:1.6; color:var(--sv-gray-text); margin-bottom:var(--sv-sp-4);">
                Sơ hữu hệ thống nhà xưởng hiện đại cùng trang thiết bị CNC đồng bộ kết hợp tay nghề thủ công tinh xảo, chúng tôi sản xuất chính xác từng micromet, đáp ứng các yêu cầu khắt khe của đối tác B2B.
              </p>
              <div class="epcm-features-list">
                <span class="epcm-feature-item">Gia công cơ khí chính xác phay, tiện CNC</span>
                <span class="epcm-feature-item">Cắt laser fiber kim loại tấm, inox, nhôm</span>
                <span class="epcm-feature-item">Chấn gấp thủy lực CNC độ chính xác cao</span>
                <span class="epcm-feature-item">Chế tạo dầm thép nhà tiền chế, kết cấu chịu lực</span>
                <span class="epcm-feature-item">Gia công Inox 316L Marine Grade chuyên dụng du thuyền</span>
                <span class="epcm-feature-item">Sản xuất OEM/ODM vỏ máy, jig gá số lượng lớn</span>
              </div>
            </div>
            <div class="epcm-tab-img">
              <img src="https://i.pinimg.com/736x/2a/39/fa/2a39fabec655ea7df8a0c2ff665a6a0a.jpg" alt="Đầu cắt laser fiber CNC gia công tấm" />
            </div>
          </div>

          <!-- Tab Content 3 -->
          <div class="epcm-tab-content" id="tab-installation">
            <div>
              <h3 class="sv-section-title" style="font-size: 24px; text-align: left; margin-bottom: var(--sv-sp-4);">Trụ Cột 03: Installation Services (Thi Công &amp; Lắp Đặt)</h3>
              <p style="font-size:var(--sv-fs-sm); line-height:1.6; color:var(--sv-gray-text); margin-bottom:var(--sv-sp-4);">
                Đội ngũ kỹ thuật thi công lành nghề trực tiếp lắp dựng an toàn tại hiện trường bằng thiết bị cẩu nâng chuyên dụng, cam kết lực xiết bu-lông, độ thăng bằng phẳng và nghiệm thu chất lượng chuẩn mực.
              </p>
              <div class="epcm-features-list">
                <span class="epcm-feature-item">Lắp dựng kết cấu thép dầm cột nhà xưởng</span>
                <span class="epcm-feature-item">Thi công cầu thang xoắn ốc thép bản Penthouse biệt thự</span>
                <span class="epcm-feature-item">Lắp đặt vách kính mặt dựng Unitized, cabin tắm mạ vàng</span>
                <span class="epcm-feature-item">Định vị cân chỉnh đồng tâm băng tải, thiết bị bồn bể</span>
                <span class="epcm-feature-item">Đo đạc kiểm thử độ võng kết cấu</span>
                <span class="epcm-feature-item">Nghiệm thu kiểm thử mối hàn không phá hủy NDT</span>
              </div>
            </div>
            <div class="epcm-tab-img">
              <img src="https://i.pinimg.com/736x/0d/16/a6/0d16a6cb8f1b6269b61dbdbef7bc9f1a2.jpg" alt="Thi công kết cấu thép ngoài hiện trường" />
            </div>
          </div>

          <!-- Tab Content 4 -->
          <div class="epcm-tab-content" id="tab-maintenance">
            <div>
              <h3 class="sv-section-title" style="font-size: 24px; text-align: left; margin-bottom: var(--sv-sp-4);">Trụ Cột 04: Maintenance Services (Bảo Trì &amp; Vận Hành)</h3>
              <p style="font-size:var(--sv-fs-sm); line-height:1.6; color:var(--sv-gray-text); margin-bottom:var(--sv-sp-4);">
                Sự đồng hành của CKSV không dừng lại sau khi bàn giao nghiệm thu. Chúng tôi cung cấp chính sách bảo trì vận hành dài lâu giúp bảo vệ tuyệt đối giá trị đầu tư của đối tác qua thời gian.
              </p>
              <div class="epcm-features-list">
                <span class="epcm-feature-item">Kiểm tra định kỳ độ võng kết cấu thép</span>
                <span class="epcm-feature-item">Đo kiểm tra an toàn áp lực bồn bể chứa hóa chất</span>
                <span class="epcm-feature-item">Bảo dưỡng, bôi trơn con lăn hệ thống băng tải</span>
                <span class="epcm-feature-item">Xử lý khẩn cấp sự cố hư hỏng mối hàn trong 24 giờ</span>
                <span class="epcm-feature-item">Tính toán gia cường, cải tạo nâng tải trọng khung thép</span>
                <span class="epcm-feature-item">Cải tạo hệ thống đường ống công nghệ nhà máy</span>
              </div>
            </div>
            <div class="epcm-tab-img">
              <img src="https://i.pinimg.com/736x/2e/ab/cc/2eabcc08a80808047ce561c28cdeaa31.jpg" alt="Inox du thuyền 316L hàng hải" />
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Tab Interactive Script -->
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        const tabBtns = document.querySelectorAll('.epcm-tab-btn');
        const tabContents = document.querySelectorAll('.epcm-tab-content');
        
        tabBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetId).classList.add('active');
          });
        });
      });
    </script>


    <!-- ════════════════════════════════════════════
         SECTION 5.5: CHIẾN LƯỢC PHÂN TÁCH ĐỐI TƯỢNG KHÁCH HÀNG
    ════════════════════════════════════════════ -->
    <section class="client-segments" aria-label="Phân tách phân khúc khách hàng">
      <div class="sv-container">
        
        <div style="text-align:center; margin-bottom:var(--sv-sp-8);" data-sv-reveal>
          <span class="sv-section-tag">TIẾP CẬN CHUYÊN BIỆT</span>
          <h2 class="sv-section-title" style="margin-inline:auto;">Giải Pháp Chuyên Biệt Cho Từng Phân Khúc</h2>
          <p style="font-size:var(--sv-fs-sm); color:var(--sv-gray-text); max-width:600px; margin-inline:auto; margin-top:var(--sv-sp-2);">
            Chúng tôi hiểu rằng mỗi nhóm đối tượng khách hàng có những yêu cầu khắt khe khác nhau về mặt kỹ thuật và tính thẩm mỹ.
          </p>
        </div>

        <div class="segments-grid">
          <!-- Segment 1: B2B Project & Industrial -->
          <div class="segment-card" data-sv-reveal>
            <div class="segment-header">Khách Hàng Dự Án &amp; Công Nghiệp (B2B)</div>
            <div class="segment-body">
              <p class="segment-desc">Dành cho các Tổng thầu xây dựng lớn, Chủ đầu tư dự án công nghiệp, nhà máy FDI (Nhật Bản, Hàn Quốc, Đài Loan...) và các đơn vị vận hành hàng hải, cảng biển.</p>
              <div class="segment-criteria-title">Tiêu chí quyết định mua hàng:</div>
              <div class="segment-criteria-list">
                <span class="segment-criteria-item"><i class="ri-checkbox-circle-fill"></i> Năng lực pháp lý, hồ sơ đấu thầu và chứng chỉ hành nghề</span>
                <span class="segment-criteria-item"><i class="ri-checkbox-circle-fill"></i> Chứng chỉ vật liệu đầu vào chính gốc (100% CO/CQ)</span>
                <span class="segment-criteria-item"><i class="ri-checkbox-circle-fill"></i> Tiêu chuẩn kỹ thuật hàn quốc tế AWS, ASME và kiểm soát dung sai</span>
                <span class="segment-criteria-item"><i class="ri-checkbox-circle-fill"></i> Cam kết đúng tiến độ dự án và bảo hành kết cấu lâu dài</span>
              </div>
            </div>
          </div>

          <!-- Segment 2: B2C Architecture & Residential -->
          <div class="segment-card" data-sv-reveal data-sv-delay="1">
            <div class="segment-header">Khách Hàng Kiến Trúc &amp; Dân Dụng (B2C &amp; B2B2C)</div>
            <div class="segment-body">
              <p class="segment-desc">Dành cho Chủ biệt thự lâu đài hạng sang, các Kiến trúc sư thiết kế nội/ngoại thất, và các Nhà thầu xây dựng nhà dân dụng cao cấp.</p>
              <div class="segment-criteria-title">Tiêu chí quyết định mua hàng:</div>
              <div class="segment-criteria-list">
                <span class="segment-criteria-item"><i class="ri-checkbox-circle-fill"></i> Tính thẩm mỹ tinh xảo, độ uốn lượn uốn cong mượt mà độc bản</span>
                <span class="segment-criteria-item"><i class="ri-checkbox-circle-fill"></i> Chất lượng hoàn thiện bề mặt (đánh bóng gương, mối hàn vô hình)</span>
                <span class="segment-criteria-item"><i class="ri-checkbox-circle-fill"></i> Sự phối hợp hài hòa đa vật liệu (thép rèn, inox PVD, kính cường lực)</span>
                <span class="segment-criteria-item"><i class="ri-checkbox-circle-fill"></i> Thương hiệu uy tín, có hồ sơ các công trình cao cấp thực tế</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>


    <!-- ════════════════════════════════════════════
         SECTION 6: DỰ ÁN CƠ KHÍ TIÊU BIỂU
    ════════════════════════════════════════════ -->
    <section class="projects-section" aria-label="Dự án cơ khí tiêu biểu">
      <div class="sv-container">
        
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:var(--sv-sp-8); flex-wrap:wrap; gap:16px;">
          <div data-sv-reveal>
            <span class="sv-section-tag">HỒ SƠ CÔNG TRÌNH THỰC TẾ</span>
            <h2 class="sv-section-title" style="margin-bottom:0;">Công Trình Cơ Khí Tiêu Biểu</h2>
          </div>
          <a href="du-an.html" class="sv-btn sv-btn-outline-gold" data-sv-reveal="fade">XEM TẤT CẢ DỰ ÁN <i class="ri-arrow-right-up-line"></i></a>
        </div>

        <div class="projects-grid">
          
          <!-- Dự án 1 -->
          <article class="project-card" data-category="cokhi" data-sv-reveal data-sv-delay="1">
            <div class="project-card-image">
              <img src="https://i.pinimg.com/736x/0d/16/a6/0d16a6cb8f1b6269b61dbdbef7bc9f1a2.jpg" alt="Cẩu dựng khung kết cấu thép nhà xưởng" loading="lazy" />
              <div class="project-card-overlay">
                <span class="project-card-view-lbl">Xem chi tiết <i class="ri-arrow-right-line" aria-hidden="true"></i></span>
              </div>
            </div>
            <div class="project-card-info">
              <span class="project-card-cat">Kết Cấu Thép</span>
              <h3 class="project-card-title">Kết Cấu Thép Khung Nhà Xưởng FDI</h3>
              <p class="project-card-desc">Lắp dựng hệ dầm cột chịu tải cho nhà máy sản xuất công nghiệp.</p>
              <a href="du-an-chi-tiet.html" class="project-card-link" aria-label="Xem dự án Kết cấu thép nhà xưởng"></a>
            </div>
          </article>

          <!-- Dự án 2 -->
          <article class="project-card" data-category="cokhi" data-sv-reveal data-sv-delay="2">
            <div class="project-card-image">
              <img src="https://i.pinimg.com/736x/2e/ab/cc/2eabcc08a80808047ce561c28cdeaa31.jpg" alt="Inox lan can du thuyền Marina 316" loading="lazy" />
              <div class="project-card-overlay">
                <span class="project-card-view-lbl">Xem chi tiết <i class="ri-arrow-right-line" aria-hidden="true"></i></span>
              </div>
            </div>
            <div class="project-card-info">
              <span class="project-card-cat">Inox Hàng Hải</span>
              <h3 class="project-card-title">Hệ Lan Can Inox Du Thuyền 316L</h3>
              <p class="project-card-desc">Gia công chế tác và đánh bóng gương lan can du thuyền kháng ăn mòn muối biển.</p>
              <a href="du-an-chi-tiet.html" class="project-card-link" aria-label="Xem dự án Inox Du Thuyền"></a>
            </div>
          </article>

          <!-- Dự án 3 -->
          <article class="project-card" data-category="cokhi" data-sv-reveal data-sv-delay="3">
            <div class="project-card-image">
              <img src="https://i.pinimg.com/736x/fa/69/cf/fa69cf2418241829e15ce6e3c8872e42.jpg" alt="Cầu thang xoắn ốc thép bản CNC nghệ thuật" loading="lazy" />
              <div class="project-card-overlay">
                <span class="project-card-view-lbl">Xem chi tiết <i class="ri-arrow-right-line" aria-hidden="true"></i></span>
              </div>
            </div>
            <div class="project-card-info">
              <span class="project-card-cat">Cầu Thang Xoắn</span>
              <h3 class="project-card-title">Cầu Thang Thép Bản Xoắn Ốc Penthouse</h3>
              <p class="project-card-desc">Thiết kế rèn uốn cong xoắn nghệ thuật tạo điểm nhấn cho không gian sang trọng.</p>
              <a href="du-an-chi-tiet.html" class="project-card-link" aria-label="Xem dự án Cầu Thang Xoắn Penthouse"></a>
            </div>
          </article>

        </div>
      </div>
    </section>


    <!-- ════════════════════════════════════════════
         SECTION 7: SMART QUOTE & NDA FORM
    ════════════════════════════════════════════ -->
    <section class="smart-quote-section" id="quickQuote" aria-label="Yêu cầu báo giá nhanh và cam kết bảo mật NDA">
      <div class="sv-container">
        <div class="smart-quote-container">
          
          <div style="text-align:center; margin-bottom:var(--sv-sp-6);">
            <span class="sv-section-tag" style="color: var(--sv-gold-500);">YÊU CẦU BÁO GIÁ THÔNG MINH</span>
            <h2 class="sv-section-title" style="color: var(--sv-white); margin-inline:auto;">Gửi Bản Vẽ — Nhận Báo Giá Kèm Cam Kết Bảo Mật NDA</h2>
            <p style="font-size:var(--sv-fs-sm); color:rgba(255,255,255,0.7); max-width:620px; margin-inline:auto; margin-top:var(--sv-sp-2); font-weight: 300;">
              CKSV cam kết bảo vệ tuyệt đối bản vẽ công nghệ độc quyền của khách hàng. Hãy tải lên file thiết kế (.dwg, .dxf, .step, .pdf, .zip), đội ngũ kỹ sư của chúng tôi sẽ phản hồi báo giá chi tiết và tư vấn DFM trong vòng 24 giờ.
            </p>
          </div>

          <form class="smart-quote-form" id="smartQuoteForm" enctype="multipart/form-data">
            <div class="sq-form-row">
              <div class="sq-form-group">
                <label for="sqName">Họ và Tên / Tên Doanh Nghiệp *</label>
                <input type="text" id="sqName" name="name" required placeholder="Ví dụ: Công ty Cổ phần A" />
              </div>
              <div class="sq-form-group">
                <label for="sqPhone">Số Điện Thoại Liên Hệ *</label>
                <input type="tel" id="sqPhone" name="phone" required placeholder="Ví dụ: 0912345678" />
              </div>
            </div>

            <div class="sq-form-row">
              <div class="sq-form-group">
                <label for="sqEmail">Địa Chỉ Email *</label>
                <input type="email" id="sqEmail" name="email" required placeholder="Ví dụ: contact@company.com" />
              </div>
              <div class="sq-form-group">
                <label for="sqPillar">Dịch Vụ Quan Tâm</label>
                <select id="sqPillar" name="pillar">
                  <option value="engineering">Engineering (Thiết kế Shop Drawing, FEA uốn kéo)</option>
                  <option value="manufacturing">Manufacturing (Gia công CNC, Kim loại tấm, Cắt Laser)</option>
                  <option value="installation">Installation (Lắp dựng Kết cấu thép, Cầu thang xoắn, Kính)</option>
                  <option value="maintenance">Maintenance (Bảo trì kết cấu định kỳ, Sửa chữa khẩn cấp)</option>
                </select>
              </div>
            </div>

            <div class="sq-form-row">
              <div class="sq-form-group">
                <label for="sqMessage">Yêu Cầu Chi Tiết (Mác vật liệu, Dung sai, Độ dày sơn...)</label>
                <textarea id="sqMessage" name="message" rows="3" placeholder="Mô tả sơ bộ các yêu cầu kỹ thuật đặc thù của dự án..."></textarea>
              </div>
              <div class="sq-form-group" style="justify-content: flex-end;">
                <label>Đính Kèm Bản Vẽ Kỹ Thuật (Tối đa 20MB)</label>
                <div class="sq-file-upload-wrapper">
                  <input type="file" id="sqFile" name="attachment" class="sq-file-upload-input" accept=".pdf,.dwg,.dxf,.step,.zip,.rar" />
                  <div class="sq-file-upload-btn">
                    <i class="ri-upload-cloud-2-line"></i> Tải bản vẽ lên...
                  </div>
                  <span class="sq-file-name" id="sqFileName">Chưa có file nào được chọn</span>
                </div>
                <div class="sq-nda-wrapper">
                  <input type="checkbox" id="sqNda" required checked />
                  <label for="sqNda">Tôi yêu cầu ký kết thỏa thuận bảo mật <a href="chinh-sach-bao-mat.html" target="_blank">NDA</a> trước khi gửi thông tin chi tiết.</label>
                </div>
              </div>
            </div>

            <div style="margin-top: 24px;">
              <button type="submit" class="sq-btn-submit">Gửi Bản Vẽ &amp; Nhận Báo Giá DFM Trong 24 Giờ</button>
            </div>
            
            <div id="sqAlert" style="margin-top: 16px; padding: 12px; border-radius: 4px; display: none; font-size: 13px; text-align: center;"></div>
          </form>

        </div>
      </div>
    </section>

    <!-- File name selection and Form submit logic -->
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        const fileInput = document.getElementById('sqFile');
        const fileNameSpan = document.getElementById('sqFileName');
        
        if (fileInput && fileNameSpan) {
          fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
              fileNameSpan.textContent = e.target.files[0].name;
            } else {
              fileNameSpan.textContent = "Chưa có file nào được chọn";
            }
          });
        }
        
        const form = document.getElementById('smartQuoteForm');
        const alertBox = document.getElementById('sqAlert');
        
        if (form) {
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!alertBox) return;
            
            alertBox.style.display = 'block';
            alertBox.style.background = '#fef3c7';
            alertBox.style.color = '#92400e';
            alertBox.textContent = 'Đang mã hóa dữ liệu bản vẽ và truyền tải bảo mật...';
            
            const formData = new FormData(form);
            formData.append('source', 'Form Báo giá Thông minh CKSV');
            
            try {
              const response = await fetch('/api/contact', {
                method: 'POST',
                body: formData
              });
              const result = await response.json();
              if (response.ok) {
                alertBox.style.background = '#d1fae5';
                alertBox.style.color = '#065f46';
                alertBox.textContent = 'Gửi dữ liệu thành công! Cam kết NDA đã được kích hoạt. Bộ phận kỹ sư sẽ gửi phản hồi báo giá DFM trong 24 giờ.';
                form.reset();
                fileNameSpan.textContent = "Chưa có file nào được chọn";
              } else {
                throw new Error(result.error || 'Có lỗi phát sinh khi truyền tải dữ liệu.');
              }
            } catch (err) {
              alertBox.style.background = '#fee2e2';
              alertBox.style.color = '#991b1b';
              alertBox.textContent = err.message || 'Lỗi kết nối máy chủ, vui lòng liên hệ hotline 0869 590 279.';
            }
          });
        }
      });
    </script>
</main>"""

    # We do a replacement of start_tag to end_tag (inclusive)
    new_content = content[:start_idx] + new_main_content + content[end_idx + len(end_tag):]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully updated co-khi-sao-vang.html main section")

def update_linh_vuc_co_khi():
    file_path = r"d:\Sao Vàng\Website-SaoVang\website\linh-vuc-co-khi.html"
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # We want to replace the SERVICES section
    # Let's locate the services-section and process-section
    start_tag = '<!-- ── SERVICES ── -->'
    end_tag = '<!-- ── QUY TRÌNH LÀM VIỆC ── -->'
    
    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag)

    if start_idx == -1 or end_idx == -1:
        print("Error: services/process section tags not found in linh-vuc-co-khi.html")
        return

    # New services structure based on the 4 EPCM pillars
    new_services_html = """<!-- ── SERVICES (4 TRỤ CỘT EPCM) ── -->
  <section class="services-section">
    <div class="container">

      <!-- Trụ cột 01: Engineering Services -->
      <div class="service-item">
        <div class="service-img">
          <img src="https://i.pinimg.com/736x/88/a4/09/88a409e51c89f53835cc988d451e5e6e3c.jpg" alt="Dịch vụ thiết kế kỹ thuật cơ khí DFM" loading="lazy" />
        </div>
        <div class="service-content">
          <div class="service-number">01</div>
          <h2 class="service-title">Engineering Services (Kỹ Thuật &amp; Thiết Kế)</h2>
          <p class="service-desc">Đây là giai đoạn khởi đầu quyết định sự thành bại và tính kinh tế của dự án. Chúng tôi nhận yêu cầu và bản vẽ phác thảo sơ bộ của khách hàng để tối ưu hóa thiết kế, đảm bảo tính khả thi cao nhất trước khi sản xuất thực tế tại xưởng.</p>
          <div class="service-features">
            <span class="service-feature">Khảo sát laser 3D hiện trạng công trình</span>
            <span class="service-feature">Tư vấn mác vật tư &amp; tính toán chịu tải</span>
            <span class="service-feature">Thiết kế 3D SolidWorks, Inventor, Tekla</span>
            <span class="service-feature">Triển khai bản vẽ Shop Drawing thực chiến</span>
            <span class="service-feature">Phân tích mô phỏng ứng suất FEA</span>
            <span class="service-feature">Bóc tách khối lượng BOM vật liệu</span>
          </div>
          <a href="co-khi-sao-vang.html#quickQuote" class="btn-quote">
            YÊU CẦU BÁO GIÁ &amp; NDA
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      <!-- Trụ cột 02: Manufacturing Services -->
      <div class="service-item reverse">
        <div class="service-img">
          <img src="https://i.pinimg.com/736x/2a/39/fa/2a39fabec655ea7df8a0c2ff665a6a0a.jpg" alt="Gia công cơ khí chính xác tại xưởng Sao Vàng" loading="lazy" />
        </div>
        <div class="service-content">
          <div class="service-number">02</div>
          <h2 class="service-title">Manufacturing Services (Gia Công &amp; Chế Tạo)</h2>
          <p class="service-desc">Vận hành theo quy trình một chiều tại nhà xưởng hiện đại, kết hợp giữa công nghệ CNC chính xác cao và tay nghề rèn đúc thủ công tinh xảo của đội thợ nghệ nhân. Chúng tôi gia công tùy biến hoàn toàn theo yêu cầu bản vẽ.</p>
          <div class="service-features">
            <span class="service-feature">Gia công phay, tiện CNC chính xác</span>
            <span class="service-feature">Cắt Laser Fiber tốc độ cao kim loại tấm</span>
            <span class="service-feature">Chấn gấp thủy lực CNC độ chính xác cao</span>
            <span class="service-feature">Chế tạo dầm thép nhà xưởng tiền chế</span>
            <span class="service-feature">Gia công Inox 316L du thuyền đánh bóng gương</span>
            <span class="epcm-feature-item">Sản xuất hàng loạt OEM/ODM &amp; Jig gá</span>
          </div>
          <a href="co-khi-sao-vang.html#quickQuote" class="btn-quote">
            YÊU CẦU BÁO GIÁ &amp; NDA
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      <!-- Trụ cột 03: Installation Services -->
      <div class="service-item">
        <div class="service-img">
          <img src="https://i.pinimg.com/736x/0d/16/a6/0d16a6cb8f1b6269b61dbdbef7bc9f1a2.jpg" alt="Thi công lắp dựng kết cấu thép" loading="lazy" />
        </div>
        <div class="service-content">
          <div class="service-number">03</div>
          <h2 class="service-title">Installation Services (Thi Công &amp; Lắp Đặt)</h2>
          <p class="service-desc">Đưa sản phẩm chế tác từ xưởng lắp dựng an toàn và đạt độ thẩm mỹ cao nhất tại công trình. Đội ngũ kỹ sư trực tiếp thi công, tuân thủ nghiêm ngặt an toàn lao động và cam kết tiến độ chặt chẽ bằng văn bản.</p>
          <div class="service-features">
            <span class="service-feature">Lắp dựng kết cấu thép bằng cẩu nâng chuyên dụng</span>
            <span class="service-feature">Thi công cầu thang xoắn thép bản uốn nghệ thuật</span>
            <span class="service-feature">Lắp dựng hệ mặt dựng kính Unitized tòa nhà</span>
            <span class="service-feature">Cân chỉnh thăng bằng đồng tâm băng tải, bồn bể</span>
            <span class="service-feature">Kiểm tra mối hàn hiện trường chuẩn NDT</span>
            <span class="service-feature">Nghiệm thu đo đạc độ võng kết cấu</span>
          </div>
          <a href="co-khi-sao-vang.html#quickQuote" class="btn-quote">
            YÊU CẦU BÁO GIÁ &amp; NDA
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      <!-- Trụ cột 04: Maintenance Services -->
      <div class="service-item reverse">
        <div class="service-img">
          <img src="https://i.pinimg.com/736x/2e/ab/cc/2eabcc08a80808047ce561c28cdeaa31.jpg" alt="Dịch vụ bảo trì và vận hành cơ khí" loading="lazy" />
        </div>
        <div class="service-content">
          <div class="service-number">04</div>
          <h2 class="service-title">Maintenance Services (Bảo Trì &amp; Vận Hành)</h2>
          <p class="service-desc">Chính sách đồng hành dài lâu của CKSV giúp bảo vệ giá trị đầu tư của khách hàng. Chúng tôi bảo trì kết cấu định kỳ và khắc phục nhanh chóng các sự cố phát sinh tại hiện trường để không làm gián đoạn sản xuất.</p>
          <div class="service-features">
            <span class="service-feature">Bảo trì kết cấu định kỳ &amp; căn chỉnh hệ thống</span>
            <span class="service-feature">Kiểm tra an toàn áp lực bồn bể chứa hóa chất</span>
            <span class="service-feature">Khắc phục nhanh sự cố rò rỉ mối hàn trong 24h</span>
            <span class="service-feature">Sửa chữa khẩn cấp hư hỏng hệ cửa nhôm kính</span>
            <span class="service-feature">Gia cường uốn nắn nâng tải trọng kết cấu khung thép</span>
            <span class="service-feature">Nâng cấp công nghệ hệ thống đường ống công nghiệp</span>
          </div>
          <a href="co-khi-sao-vang.html#quickQuote" class="btn-quote">
            YÊU CẦU BÁO GIÁ &amp; NDA
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

    </div>
  </section>

  """

    # We do a replacement of start_tag to end_tag (not inclusive of end_tag)
    new_content = content[:start_idx] + new_services_html + content[end_idx:]
    
    # Let's also update the process section to match EPCM
    process_start = '<!-- ── QUY TRÌNH LÀM VIỆC ── -->'
    process_end = '<!-- ── CTA BANNER ── -->'
    
    p_start_idx = new_content.find(process_start)
    p_end_idx = new_content.find(process_end)
    
    if p_start_idx != -1 and p_end_idx != -1:
        new_process_html = """<!-- ── QUY TRÌNH LÀM VIỆC (EPCM) ── -->
  <section class="process-section">
    <div class="container">
      <div class="section-eyebrow">QUY TRÌNH EPCM KHÉP KÍN</div>
      <h2 class="section-title">Quy Trình Triển Khai Giải Pháp Cơ Khí</h2>
      <div class="process-grid">
        <div class="process-step">
          <div class="process-num">01</div>
          <div class="process-step-title">Kỹ Thuật (Engineering)</div>
          <div class="process-step-desc">Khảo sát laser 3D, thiết kế DFM trên SolidWorks, mô phỏng chịu tải FEA và ký bảo mật NDA.</div>
        </div>
        <div class="process-step">
          <div class="process-num">02</div>
          <div class="process-step-title">Mua Sắm (Procurement)</div>
          <div class="process-step-desc">Mua sắm vật tư chính hãng 100% có chứng chỉ CO/CQ rõ ràng từ nhà sản xuất uy tín.</div>
        </div>
        <div class="process-step">
          <div class="process-num">03</div>
          <div class="process-step-title">Chế Tạo (Manufacturing)</div>
          <div class="process-step-desc">Gia công chính xác CNC phay tiện, cắt laser fiber và hàn chất lượng cao đạt chuẩn AWS/ASME.</div>
        </div>
        <div class="process-step">
          <div class="process-num">04</div>
          <div class="process-step-title">Thi Công (Construction)</div>
          <div class="process-step-desc">Lắp dựng hiện trường nhanh chóng, cẩu nâng chuyên dụng, kiểm tra NDT mối hàn và nghiệm thu.</div>
        </div>
        <div class="process-step">
          <div class="process-num">05</div>
          <div class="process-step-title">Bảo Trì (Maintenance)</div>
          <div class="process-step-desc">Bàn giao sổ bảo hành kết cấu lên đến 5 năm, bảo dưỡng định kỳ và sửa sự cố khẩn cấp trong 24h.</div>
        </div>
      </div>
    </div>
  </section>

  """
        new_content = new_content[:p_start_idx] + new_process_html + new_content[p_end_idx:]

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully updated linh-vuc-co-khi.html services and process")

def update_nang_luc():
    file_path = r"d:\Sao Vàng\Website-SaoVang\website\nang-luc.html"
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update QA/QC block contents to match AWS/ASME, CO/CQ, CMM, 5-year warranty
    qaqc_start = '<!-- QA/QC SYSTEM -->'
    qaqc_end = '<!-- 7-STEP PROCESS -->'
    
    start_idx = content.find(qaqc_start)
    end_idx = content.find(qaqc_end)

    if start_idx == -1 or end_idx == -1:
        print("Error: QA/QC section tags not found in nang-luc.html")
        return

    new_qaqc_html = """<!-- QA/QC SYSTEM -->
    <section class="qaqc-section">
      <div class="container">
        <div style="text-align: center; max-width: 750px; margin: 0 auto var(--sp-6);">
          <span class="tag white">TIÊU CHUẨN CHẤT LƯỢNG</span>
          <h2 class="section-title white" style="margin-inline: auto;">Kiểm Soát QA/QC &amp; Cam Kết Bảo Mật B2B</h2>
          <p class="section-desc white" style="margin-inline: auto;">Tại Sao Vàng, chất lượng không chỉ là lời hứa suông mà được kiểm soát định lượng rõ ràng qua các tiêu chuẩn quốc tế và cam kết pháp lý chặt chẽ.</p>
        </div>

        <div class="qaqc-grid">
          <div class="qaqc-card">
            <h3>1. Cam Kết Nguồn Gốc Vật Tư (CO/CQ)</h3>
            <p>100% phôi thép, inox (304, 316L), nhôm định hình đầu vào đều có đầy đủ chứng chỉ xuất xứ (CO) và chứng chỉ chất lượng (CQ) từ các tập đoàn Posco, Hòa Phát, Outokumpu... Nói không với vật liệu trôi nổi kém chất lượng.</p>
          </div>

          <div class="qaqc-card">
            <h3>2. Tiêu Chuẩn Hàn Quốc Tế AWS/ASME</h3>
            <p>Đội ngũ thợ hàn của CKSV được đào tạo bài bản và kiểm tra sát hạch định kỳ, sở hữu các chứng chỉ hàn kết cấu tiêu chuẩn quốc tế (AWS D1.1, ASME IX). Đảm bảo mối hàn chịu tải lớn, ngấu đều và bền bỉ tuyệt đối.</p>
          </div>

          <div class="qaqc-card">
            <h3>3. Kiểm Soát Dung Sai &amp; Đo Kiểm CMM</h3>
            <p>Tất cả chi tiết máy và linh kiện cơ khí sau gia công CNC đều trải qua quy trình đo kiểm nghiêm ngặt bằng thước cặp điện tử chính xác cao hoặc máy đo tọa độ CMM chuyên dụng để bảo đảm dung sai bản vẽ.</p>
          </div>

          <div class="qaqc-card">
            <h3>4. Bảo Hành Kết Cấu Lên Đến 5 Năm</h3>
            <p>CKSV tự tin cam kết bảo hành chất lượng kết cấu chịu lực của công trình lên tới 5 năm, hỗ trợ kiểm tra định kỳ miễn phí và sửa chữa nhanh các lỗi mối hàn phát sinh ngoài ý muốn.</p>
          </div>

          <div class="qaqc-card">
            <h3>5. Bảo Mật Thiết Kế Bản Vẽ Tuyệt Đối (NDA)</h3>
            <p>CKSV cam kết bảo vệ 100% tài sản trí tuệ và bí mật công nghệ của khách hàng. Chúng tôi sẵn sàng ký thỏa thuận bảo mật NDA trước khi tiếp nhận bản vẽ 2D/3D chi tiết máy từ đối tác.</p>
          </div>
        </div>
      </div>
    </section>

    """

    new_content = content[:start_idx] + new_qaqc_html + content[end_idx:]
    
    # 2. Update warranty text in step 7 of the process
    # Let's locate "sổ bảo hành kết cấu 5 năm"
    old_step7 = "bảo hành kết cấu 5 năm"
    # Wait, the step 7 already has: "bảo hành kết cấu 5 năm" - which is fine.
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully updated nang-luc.html QA/QC section")

if __name__ == "__main__":
    update_co_khi_sao_vang()
    update_linh_vuc_co_khi()
    update_nang_luc()
