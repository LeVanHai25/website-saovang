#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tái cấu trúc nội dung chính nhom-sao-vang.html
Thêm các section mới theo kế hoạch Senior Software Architect:
  - Section 3b: 4 giá trị cốt lõi
  - Section 4b: Giải pháp theo loại công trình (tabs)
  - Section 4c: Hướng dẫn chọn nhôm theo ngân sách
  - Section 4d: Bảng so sánh kỹ thuật Civro/Maxpro/Xingfa/PMA
  - Section 5b: 10 lý do chọn NKSV
  - Section 6b: Case Studies thực tế
"""

import os, re

BASE = r"d:\Sao Vàng\Website-SaoVang\website"
FPATH = os.path.join(BASE, "nhom-sao-vang.html")

# ── Nội dung mới sẽ chèn sau section 3 (brand-intro) và trước section 4 (division-section) ──

NEW_SECTIONS = '''
    <!-- ════════════════════════════════════════════
         SECTION 3b: 4 GIÁ TRỊ CỐT LÕI
    ════════════════════════════════════════════ -->
    <section style="padding-block: var(--sv-section-py); background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: var(--sv-white);" aria-label="Giá trị cốt lõi">
      <div class="sv-container">
        <div style="text-align:center; margin-bottom: clamp(32px,5vw,56px);" data-sv-reveal>
          <span class="sv-section-tag" style="color: var(--sv-gold-500);">TRIẾT LÝ KINH DOANH</span>
          <h2 class="sv-section-title" style="color: var(--sv-white); margin-inline:auto;">4 Giá Trị Cốt Lõi NKSV</h2>
          <p style="font-size: var(--sv-fs-sm); color: rgba(255,255,255,0.65); max-width: 600px; margin-inline: auto; margin-top: var(--sv-sp-2);">
            Mỗi công trình chúng tôi thực hiện đều phải thỏa mãn đồng thời bốn tiêu chí không thể thỏa hiệp.
          </p>
        </div>

        <div style="display:grid; grid-template-columns: repeat(2,1fr); gap: clamp(16px,3vw,32px);" class="core-values-grid">
          <!-- Giá trị 1 -->
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--sv-radius-lg); padding: clamp(24px,4vw,40px); transition: all 0.3s ease; cursor:default;" onmouseover="this.style.background='rgba(255,215,0,0.07)'; this.style.borderColor='rgba(255,215,0,0.3)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.1)';" data-sv-reveal data-sv-delay="1">
            <div style="width:52px; height:52px; background: rgba(245,158,11,0.15); border-radius: var(--sv-radius-md); display:flex; align-items:center; justify-content:center; margin-bottom: var(--sv-sp-4); font-size:24px; color: var(--sv-gold-500);">
              <i class="ri-palette-line"></i>
            </div>
            <h3 style="font-family: var(--sv-font-head); font-size: var(--sv-fs-md); font-weight: 800; color: var(--sv-white); margin-bottom: var(--sv-sp-2);">Thẩm Mỹ Tinh Xảo</h3>
            <p style="font-size: var(--sv-fs-sm); color: rgba(255,255,255,0.65); line-height: 1.6;">
              Đường nét thanh thoát, góc cạnh sắc sảo 0.1mm — mỗi chi tiết nhôm kính đều là tuyên ngôn thẩm mỹ. Không chấp nhận vết xước bề mặt, khe hở cánh hay cong vênh khung sau 5 năm.
            </p>
          </div>

          <!-- Giá trị 2 -->
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--sv-radius-lg); padding: clamp(24px,4vw,40px); transition: all 0.3s ease; cursor:default;" onmouseover="this.style.background='rgba(255,215,0,0.07)'; this.style.borderColor='rgba(255,215,0,0.3)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.1)';" data-sv-reveal data-sv-delay="2">
            <div style="width:52px; height:52px; background: rgba(245,158,11,0.15); border-radius: var(--sv-radius-md); display:flex; align-items:center; justify-content:center; margin-bottom: var(--sv-sp-4); font-size:24px; color: var(--sv-gold-500);">
              <i class="ri-shield-check-line"></i>
            </div>
            <h3 style="font-family: var(--sv-font-head); font-size: var(--sv-fs-md); font-weight: 800; color: var(--sv-white); margin-bottom: var(--sv-sp-2);">Hiệu Năng Kỹ Thuật</h3>
            <p style="font-size: var(--sv-fs-sm); color: rgba(255,255,255,0.65); line-height: 1.6;">
              Cách âm ≥40 dB, cản nhiệt U-value ≤ 1.4 W/m²K, chịu áp gió cấp 12. Kính hộp Low-E bơm khí Argon, gioăng EPDM ba lớp, cấu trúc cầu cách nhiệt ngăn cầu lạnh/nhiệt.
            </p>
          </div>

          <!-- Giá trị 3 -->
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--sv-radius-lg); padding: clamp(24px,4vw,40px); transition: all 0.3s ease; cursor:default;" onmouseover="this.style.background='rgba(255,215,0,0.07)'; this.style.borderColor='rgba(255,215,0,0.3)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.1)';" data-sv-reveal data-sv-delay="3">
            <div style="width:52px; height:52px; background: rgba(245,158,11,0.15); border-radius: var(--sv-radius-md); display:flex; align-items:center; justify-content:center; margin-bottom: var(--sv-sp-4); font-size:24px; color: var(--sv-gold-500);">
              <i class="ri-file-certificate-line"></i>
            </div>
            <h3 style="font-family: var(--sv-font-head); font-size: var(--sv-fs-md); font-weight: 800; color: var(--sv-white); margin-bottom: var(--sv-sp-2);">Minh Bạch Tuyệt Đối</h3>
            <p style="font-size: var(--sv-fs-sm); color: rgba(255,255,255,0.65); line-height: 1.6;">
              100% vật tư nhôm, kính, phụ kiện đều có CO/CQ chính hãng đi kèm theo lô hàng. Không tráo hàng, không thay thế phụ kiện loại 2. Camera giám sát toàn bộ xưởng gia công.
            </p>
          </div>

          <!-- Giá trị 4 -->
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--sv-radius-lg); padding: clamp(24px,4vw,40px); transition: all 0.3s ease; cursor:default;" onmouseover="this.style.background='rgba(255,215,0,0.07)'; this.style.borderColor='rgba(255,215,0,0.3)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.1)';" data-sv-reveal data-sv-delay="4">
            <div style="width:52px; height:52px; background: rgba(245,158,11,0.15); border-radius: var(--sv-radius-md); display:flex; align-items:center; justify-content:center; margin-bottom: var(--sv-sp-4); font-size:24px; color: var(--sv-gold-500);">
              <i class="ri-time-line"></i>
            </div>
            <h3 style="font-family: var(--sv-font-head); font-size: var(--sv-fs-md); font-weight: 800; color: var(--sv-white); margin-bottom: var(--sv-sp-2);">Cam Kết Dài Hạn 40 Năm</h3>
            <p style="font-size: var(--sv-fs-sm); color: rgba(255,255,255,0.65); line-height: 1.6;">
              Mạ điện di Anodized ED chống muối biển và ăn mòn hóa học 40 năm bảo hành màu sắc. Bảo trì định kỳ miễn phí 1 năm/lần trong 5 năm đầu. Hotline 24/7 xử lý sự cố khẩn cấp.
            </p>
          </div>
        </div>
      </div>
      <style>
        @media (max-width: 640px) { .core-values-grid { grid-template-columns: 1fr !important; } }
      </style>
    </section>


    <!-- ════════════════════════════════════════════
         SECTION 4b: GIẢI PHÁP THEO TỪNG LOẠI CÔNG TRÌNH
    ════════════════════════════════════════════ -->
    <section style="padding-block: var(--sv-section-py); background: var(--sv-white);" aria-label="Giải pháp theo loại công trình">
      <div class="sv-container">
        <div style="text-align:center; margin-bottom: clamp(28px,4vw,48px);" data-sv-reveal>
          <span class="sv-section-tag">GIẢI PHÁP ĐÚNG NGƯỜI — ĐÚNG NHU CẦU</span>
          <h2 class="sv-section-title" style="margin-inline:auto;">Chúng Tôi Thiết Kế Giải Pháp Riêng Cho Từng Loại Công Trình</h2>
        </div>

        <!-- Tab buttons -->
        <div id="projectTypeTabs" style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-bottom: clamp(24px,4vw,40px);" role="tablist" aria-label="Loại công trình">
          <button onclick="switchProjectTab(0)" class="proj-tab proj-tab-active" role="tab" aria-selected="true" id="ptab-0">🏰 Biệt thự & Lâu đài</button>
          <button onclick="switchProjectTab(1)" class="proj-tab" role="tab" aria-selected="false" id="ptab-1">🌊 Resort ven biển</button>
          <button onclick="switchProjectTab(2)" class="proj-tab" role="tab" aria-selected="false" id="ptab-2">🏘️ Nhà phố & Chung cư</button>
          <button onclick="switchProjectTab(3)" class="proj-tab" role="tab" aria-selected="false" id="ptab-3">🏢 Văn phòng & Cao ốc</button>
          <button onclick="switchProjectTab(4)" class="proj-tab" role="tab" aria-selected="false" id="ptab-4">🏭 Nhà xưởng & Nhà máy</button>
        </div>

        <!-- Tab content panels -->
        <div class="proj-panel" id="ppanel-0" role="tabpanel" aria-labelledby="ptab-0">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:clamp(16px,3vw,40px); align-items:center;">
            <div>
              <h3 style="font-family: var(--sv-font-head); font-size: var(--sv-fs-xl); font-weight:800; color: var(--sv-dark-900); margin-bottom: var(--sv-sp-3);">Siêu Biệt Thự & Lâu Đài</h3>
              <p style="font-size: var(--sv-fs-sm); color: var(--sv-gray-text); line-height:1.7; margin-bottom: var(--sv-sp-4);">
                Khách hàng phân khúc Luxury ≥ 8 triệu/m² yêu cầu mức độ hoàn thiện tuyệt đối. Mỗi chi tiết từ khe hở cánh đến tay nắm mạ vàng đều phải thể hiện đẳng cấp.
              </p>
              <ul style="list-style:none; padding:0; margin:0 0 var(--sv-sp-5) 0; display:flex; flex-direction:column; gap: var(--sv-sp-2);">
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Nhôm cầu cách nhiệt Civro / Eurowindow Elite</strong> — profile 65-80mm, dày 2.0mm+ chứng nhận Passive House</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Kính hộp Low-E tích hợp rèm tự động</strong> — 6+12Ar+6mm, cản nhiệt 70%, rèm điều khiển app</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Phụ kiện CMECH London Series mạ vàng 24K</strong> — bảo hành 100,000 lần đóng mở</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Uốn vòm cầu thang elip CNC</strong> — kết cấu thép đỡ nhôm kính cong bán kính tùy thiết kế</span></li>
              </ul>
              <a href="lien-he.html" class="sv-btn sv-btn-red">Tư Vấn Giải Pháp Luxury <i class="ri-arrow-right-line"></i></a>
            </div>
            <div style="border-radius: var(--sv-radius-lg); overflow:hidden; aspect-ratio:4/3;">
              <img src="https://i.pinimg.com/736x/8f/c9/26/8fc926d6ee88fe0a326b2b27f72c7c34.jpg"
                   alt="Cửa vòm nhôm kính uốn cong tân cổ điển biệt thự sang trọng"
                   style="width:100%; height:100%; object-fit:cover; transition: transform 0.5s ease;"
                   onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'"
                   onerror="this.src='assets/images/service-glass-facades.png'"/>
            </div>
          </div>
        </div>

        <div class="proj-panel" id="ppanel-1" style="display:none;" role="tabpanel" aria-labelledby="ptab-1">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:clamp(16px,3vw,40px); align-items:center;">
            <div>
              <h3 style="font-family: var(--sv-font-head); font-size: var(--sv-fs-xl); font-weight:800; color: var(--sv-dark-900); margin-bottom: var(--sv-sp-3);">Resort & Khách Sạn Ven Biển</h3>
              <p style="font-size: var(--sv-fs-sm); color: var(--sv-gray-text); line-height:1.7; margin-bottom: var(--sv-sp-4);">
                Môi trường muối biển ăn mòn cực mạnh đòi hỏi giải pháp đặc biệt. Thất bại trong lựa chọn vật liệu sẽ gây rỉ sét, bong tróc bề mặt chỉ sau 2-3 năm — ảnh hưởng nghiêm trọng đến thương hiệu resort.
              </p>
              <ul style="list-style:none; padding:0; margin:0 0 var(--sv-sp-5) 0; display:flex; flex-direction:column; gap: var(--sv-sp-2);">
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Nhôm Maxpro.JP mạ điện di Anodized ED</strong> — kháng muối mặn cấp AA25, bảo hành màu 40 năm</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Cửa lùa Panorama chống bão cấp 12</strong> — khả năng chịu áp gió 2,400 Pa theo AAMA 2100</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Phụ kiện chống muối CMECH M-Treatment</strong> — lớp mạ kháng NaCl gấp 10 lần tiêu chuẩn</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Gioăng EPDM cao cấp</strong> — chống thấm nước biển cấp độ ASTM E331 với áp suất 137 Pa</span></li>
              </ul>
              <a href="lien-he.html" class="sv-btn sv-btn-red">Tư Vấn Giải Pháp Resort <i class="ri-arrow-right-line"></i></a>
            </div>
            <div style="border-radius: var(--sv-radius-lg); overflow:hidden; aspect-ratio:4/3;">
              <img src="https://i.pinimg.com/736x/44/28/bf/4428bf9c9ab7df85a0e7caf4e3b5c2f6.jpg"
                   alt="Vách kính mặt dựng curtain wall resort ven biển"
                   style="width:100%; height:100%; object-fit:cover; transition: transform 0.5s ease;"
                   onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'"
                   onerror="this.src='assets/images/service-glass-facades.png'"/>
            </div>
          </div>
        </div>

        <div class="proj-panel" id="ppanel-2" style="display:none;" role="tabpanel" aria-labelledby="ptab-2">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:clamp(16px,3vw,40px); align-items:center;">
            <div>
              <h3 style="font-family: var(--sv-font-head); font-size: var(--sv-fs-xl); font-weight:800; color: var(--sv-dark-900); margin-bottom: var(--sv-sp-3);">Nhà Phố & Chung Cư</h3>
              <p style="font-size: var(--sv-fs-sm); color: var(--sv-gray-text); line-height:1.7; margin-bottom: var(--sv-sp-4);">
                Phân khúc đông đảo nhất, cần cân bằng tốt giữa chất lượng — thẩm mỹ — chi phí. Ưu tiên tính ổn định lâu dài, dễ bảo trì và khả năng nâng cấp linh hoạt.
              </p>
              <ul style="list-style:none; padding:0; margin:0 0 var(--sv-sp-5) 0; display:flex; flex-direction:column; gap: var(--sv-sp-2);">
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Nhôm Xingfa Quảng Đông / Topal Prima / Owin</strong> — tốt nhất phân khúc 3-5 triệu/m²</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Kính cường lực đơn 5-8mm hoặc kính dán</strong> — chứng nhận TCVN 7455:2004</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Vấu hãm chốt an toàn chống trộm</strong> — tăng cường an ninh nhà phố hẻm cần bảo vệ</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Bảo hành 5 năm toàn diện</strong> — cánh, kính, phụ kiện, đường keo silicone</span></li>
              </ul>
              <a href="lien-he.html" class="sv-btn sv-btn-red">Nhận Báo Giá Nhà Phố <i class="ri-arrow-right-line"></i></a>
            </div>
            <div style="border-radius: var(--sv-radius-lg); overflow:hidden; aspect-ratio:4/3;">
              <img src="https://i.pinimg.com/736x/21/df/b8/21dfb8b1ea7e3f5c9b8e4d3a1c7b9f2e.jpg"
                   alt="Cửa lùa nhôm Slim hiện đại nhà phố"
                   style="width:100%; height:100%; object-fit:cover; transition: transform 0.5s ease;"
                   onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'"
                   onerror="this.src='assets/images/service-aluminum-doors.png'"/>
            </div>
          </div>
        </div>

        <div class="proj-panel" id="ppanel-3" style="display:none;" role="tabpanel" aria-labelledby="ptab-3">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:clamp(16px,3vw,40px); align-items:center;">
            <div>
              <h3 style="font-family: var(--sv-font-head); font-size: var(--sv-fs-xl); font-weight:800; color: var(--sv-dark-900); margin-bottom: var(--sv-sp-3);">Văn Phòng & Cao Ốc</h3>
              <p style="font-size: var(--sv-fs-sm); color: var(--sv-gray-text); line-height:1.7; margin-bottom: var(--sv-sp-4);">
                Các tòa nhà thương mại yêu cầu hệ nhôm kính đồng bộ quy mô lớn, đảm bảo tính đồng nhất thẩm mỹ và hiệu năng năng lượng theo tiêu chuẩn LEED/LOTUS.
              </p>
              <ul style="list-style:none; padding:0; margin:0 0 var(--sv-sp-5) 0; display:flex; flex-direction:column; gap: var(--sv-sp-2);">
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Vách mặt dựng Curtain Wall Unitized / Stick</strong> — hệ đúc sẵn lắp nhanh, chịu gió lớn</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Vách kính cách âm phòng họp 40dB</strong> — kính hộp 6+14Ar+6 SGG Climaplus</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Cửa nhôm tự động motor tốc độ cao</strong> — tích hợp kiểm soát truy cập thẻ từ/vân tay</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Thiết kế Shop Drawing BIM 3D</strong> — phối hợp đồng bộ với các ban kết cấu và M&E</span></li>
              </ul>
              <a href="lien-he.html" class="sv-btn sv-btn-red">Tư Vấn Giải Pháp Cao Ốc <i class="ri-arrow-right-line"></i></a>
            </div>
            <div style="border-radius: var(--sv-radius-lg); overflow:hidden; aspect-ratio:4/3;">
              <img src="https://i.pinimg.com/736x/55/e8/1a/55e81af2c3d7b8e4f9a2c1d0b6e8f3a1.jpg"
                   alt="Vách kính curtain wall cao ốc văn phòng"
                   style="width:100%; height:100%; object-fit:cover; transition: transform 0.5s ease;"
                   onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'"
                   onerror="this.src='assets/images/service-glass-facades.png'"/>
            </div>
          </div>
        </div>

        <div class="proj-panel" id="ppanel-4" style="display:none;" role="tabpanel" aria-labelledby="ptab-4">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:clamp(16px,3vw,40px); align-items:center;">
            <div>
              <h3 style="font-family: var(--sv-font-head); font-size: var(--sv-fs-xl); font-weight:800; color: var(--sv-dark-900); margin-bottom: var(--sv-sp-3);">Nhà Xưởng & Nhà Máy</h3>
              <p style="font-size: var(--sv-fs-sm); color: var(--sv-gray-text); line-height:1.7; margin-bottom: var(--sv-sp-4);">
                Môi trường công nghiệp đòi hỏi tính bền bỉ cao, dễ vệ sinh và đảm bảo an toàn PCCC. Chi phí bảo trì thấp nhất trong vòng đời 20 năm là ưu tiên hàng đầu.
              </p>
              <ul style="list-style:none; padding:0; margin:0 0 var(--sv-sp-5) 0; display:flex; flex-direction:column; gap: var(--sv-sp-2);">
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Cửa nhôm kính bản lớn chịu lực</strong> — cánh đơn 1.2m × 2.4m, bản lề 4D 3 điểm chịu 200kg</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Cửa nhôm kính chống cháy EI30/EI60</strong> — đạt tiêu chuẩn PCCC TCVN 2622-1995</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Mái cầu phong kính sảnh nhập hàng</strong> — hệ kính cường lực khung thép hàn CNC chịu tải 150kg/m²</span></li>
                <li style="display:flex; gap:10px; align-items:flex-start; font-size: var(--sv-fs-sm); color: var(--sv-gray-text);"><i class="ri-checkbox-circle-fill" style="color: var(--sv-gold-500); flex-shrink:0; margin-top:2px;"></i><span><strong>Vách ngăn khu sản xuất GMP</strong> — phòng sạch, phòng lạnh kín khí, phòng cách ly tiêu chuẩn</span></li>
              </ul>
              <a href="lien-he.html" class="sv-btn sv-btn-red">Tư Vấn Giải Pháp Công Nghiệp <i class="ri-arrow-right-line"></i></a>
            </div>
            <div style="border-radius: var(--sv-radius-lg); overflow:hidden; aspect-ratio:4/3;">
              <img src="https://i.pinimg.com/736x/71/e6/78/71e6785f3c9ab4d1e8f2b3c9a7d0e2f5.jpg"
                   alt="Mái kính sảnh nhà xưởng nhà máy"
                   style="width:100%; height:100%; object-fit:cover; transition: transform 0.5s ease;"
                   onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'"
                   onerror="this.src='assets/images/service-glass-facades.png'"/>
            </div>
          </div>
        </div>
      </div>

      <style>
        .proj-tab {
          padding: 10px 20px;
          border: 1.5px solid var(--sv-gray-200);
          background: var(--sv-white);
          color: var(--sv-gray-text);
          border-radius: 50px;
          font-family: var(--sv-font-head);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .proj-tab:hover { border-color: var(--sv-red-600); color: var(--sv-red-600); }
        .proj-tab-active {
          background: var(--sv-red-600);
          color: var(--sv-white);
          border-color: var(--sv-red-600);
          box-shadow: 0 4px 15px rgba(155,28,28,0.25);
        }
        .proj-panel { animation: fadeInPanel 0.35s ease; }
        @keyframes fadeInPanel { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        @media (max-width:768px) {
          .proj-panel > div { grid-template-columns: 1fr !important; }
        }
      </style>
      <script>
        function switchProjectTab(idx) {
          document.querySelectorAll('.proj-tab').forEach((t,i) => {
            t.classList.toggle('proj-tab-active', i === idx);
            t.setAttribute('aria-selected', i === idx);
          });
          document.querySelectorAll('.proj-panel').forEach((p,i) => {
            p.style.display = i === idx ? '' : 'none';
          });
        }
      </script>
    </section>


    <!-- ════════════════════════════════════════════
         SECTION 4c: HƯỚNG DẪN CHỌN NHÔM THEO NGÂN SÁCH
    ════════════════════════════════════════════ -->
    <section style="padding-block: var(--sv-section-py); background: var(--sv-gray-025);" aria-label="Hướng dẫn chọn nhôm theo ngân sách">
      <div class="sv-container">
        <div style="text-align:center; margin-bottom: clamp(28px,4vw,48px);" data-sv-reveal>
          <span class="sv-section-tag">ĐỊNH HƯỚNG TÀI CHÍNH THÔNG MINH</span>
          <h2 class="sv-section-title" style="margin-inline:auto;">Chọn Hệ Nhôm Phù Hợp Với Ngân Sách Của Bạn</h2>
          <p style="font-size: var(--sv-fs-sm); color: var(--sv-gray-text); max-width:580px; margin-inline:auto; margin-top: var(--sv-sp-2);">
            Bảng hướng dẫn giúp bạn ra quyết định đầu tư sáng suốt — không thiếu chất lượng, không lãng phí ngân sách.
          </p>
        </div>
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:clamp(12px,2vw,24px);" class="budget-grid">
          <!-- Phổ thông -->
          <div style="background: var(--sv-white); border: 2px solid var(--sv-gray-200); border-radius: var(--sv-radius-lg); padding: clamp(20px,3vw,32px); display:flex; flex-direction:column; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.1)'" onmouseout="this.style.transform=''; this.style.boxShadow=''" data-sv-reveal data-sv-delay="1">
            <div style="background: #e5e7eb; color:#6b7280; font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; border-radius:4px; padding:4px 10px; display:inline-block; margin-bottom:16px; width:fit-content;">Phổ Thông</div>
            <div style="font-family: var(--sv-font-head); font-size: clamp(22px,3vw,32px); font-weight:900; color: var(--sv-dark-900); margin-bottom:4px;">< 3 tr/m²</div>
            <div style="font-size:12px; color: var(--sv-gray-text); margin-bottom:16px;">Dưới 3 triệu đồng/m²</div>
            <ul style="list-style:none; padding:0; margin:0 0 auto; display:flex; flex-direction:column; gap:10px; font-size:13px; color: var(--sv-gray-text);">
              <li>✓ Nhôm Xingfa 55-65mm loại A</li>
              <li>✓ Kính cường lực đơn 5-6mm</li>
              <li>✓ Phụ kiện DRAHO cơ bản</li>
              <li>✓ Bảo hành 3 năm cánh+phụ kiện</li>
            </ul>
          </div>
          <!-- Trung cấp -->
          <div style="background: var(--sv-white); border: 2px solid var(--sv-gray-200); border-radius: var(--sv-radius-lg); padding: clamp(20px,3vw,32px); display:flex; flex-direction:column; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.1)'" onmouseout="this.style.transform=''; this.style.boxShadow=''" data-sv-reveal data-sv-delay="2">
            <div style="background: #dbeafe; color:#1d4ed8; font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; border-radius:4px; padding:4px 10px; display:inline-block; margin-bottom:16px; width:fit-content;">Trung Cấp</div>
            <div style="font-family: var(--sv-font-head); font-size: clamp(22px,3vw,32px); font-weight:900; color: var(--sv-dark-900); margin-bottom:4px;">3 – 5 tr/m²</div>
            <div style="font-size:12px; color: var(--sv-gray-text); margin-bottom:16px;">3 đến 5 triệu đồng/m²</div>
            <ul style="list-style:none; padding:0; margin:0 0 auto; display:flex; flex-direction:column; gap:10px; font-size:13px; color: var(--sv-gray-text);">
              <li>✓ Nhôm Topal Prima / Owin 65-70mm</li>
              <li>✓ Kính hộp 4+9A+4 chống nóng</li>
              <li>✓ Phụ kiện BOGO / DRAHO Pro</li>
              <li>✓ Bảo hành 5 năm toàn diện</li>
            </ul>
          </div>
          <!-- Cao cấp -->
          <div style="background: var(--sv-white); border: 2px solid var(--sv-red-600); border-radius: var(--sv-radius-lg); padding: clamp(20px,3vw,32px); display:flex; flex-direction:column; position:relative; transition: all 0.3s ease; box-shadow: 0 8px 24px rgba(155,28,28,0.12);" onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='0 16px 40px rgba(155,28,28,0.2)'" onmouseout="this.style.transform=''; this.style.boxShadow='0 8px 24px rgba(155,28,28,0.12)'" data-sv-reveal data-sv-delay="3">
            <div style="position:absolute; top:-12px; left:50%; transform:translateX(-50%); background: var(--sv-red-600); color:white; font-size:11px; font-weight:800; border-radius:20px; padding:4px 14px; white-space:nowrap;">⭐ PHỔ BIẾN NHẤT</div>
            <div style="background: #fee2e2; color: var(--sv-red-600); font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; border-radius:4px; padding:4px 10px; display:inline-block; margin-bottom:16px; width:fit-content;">Cao Cấp</div>
            <div style="font-family: var(--sv-font-head); font-size: clamp(22px,3vw,32px); font-weight:900; color: var(--sv-dark-900); margin-bottom:4px;">5 – 8 tr/m²</div>
            <div style="font-size:12px; color: var(--sv-gray-text); margin-bottom:16px;">5 đến 8 triệu đồng/m²</div>
            <ul style="list-style:none; padding:0; margin:0 0 auto; display:flex; flex-direction:column; gap:10px; font-size:13px; color: var(--sv-gray-text);">
              <li>✓ Nhôm Civro / PMA 70-80mm cầu cách nhiệt</li>
              <li>✓ Kính hộp Low-E 6+12Ar+6mm</li>
              <li>✓ Phụ kiện CMECH / BOGO 4D</li>
              <li>✓ Bảo hành 10 năm + bảo trì miễn phí 1 năm</li>
            </ul>
          </div>
          <!-- Luxury -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 2px solid rgba(255,215,0,0.4); border-radius: var(--sv-radius-lg); padding: clamp(20px,3vw,32px); display:flex; flex-direction:column; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='0 12px 32px rgba(255,215,0,0.15)'" onmouseout="this.style.transform=''; this.style.boxShadow=''" data-sv-reveal data-sv-delay="4">
            <div style="background: rgba(255,215,0,0.15); color: var(--sv-gold-500); font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; border-radius:4px; padding:4px 10px; display:inline-block; margin-bottom:16px; width:fit-content;">Luxury</div>
            <div style="font-family: var(--sv-font-head); font-size: clamp(22px,3vw,32px); font-weight:900; color: var(--sv-white); margin-bottom:4px;">> 8 tr/m²</div>
            <div style="font-size:12px; color: rgba(255,255,255,0.5); margin-bottom:16px;">Trên 8 triệu đồng/m²</div>
            <ul style="list-style:none; padding:0; margin:0 0 auto; display:flex; flex-direction:column; gap:10px; font-size:13px; color: rgba(255,255,255,0.7);">
              <li>✓ Nhôm Maxpro.JP Anodized ED 40 năm</li>
              <li>✓ Kính hộp 3 lớp Low-E+rèm tích hợp</li>
              <li>✓ Phụ kiện CMECH London mạ vàng 24K</li>
              <li>✓ Bảo hành 40 năm màu + 10 năm phụ kiện</li>
            </ul>
          </div>
        </div>
      </div>
      <style>
        @media (max-width:900px) { .budget-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width:480px) { .budget-grid { grid-template-columns: 1fr !important; } }
      </style>
    </section>


    <!-- ════════════════════════════════════════════
         SECTION 4d: BẢNG SO SÁNH KỸ THUẬT
    ════════════════════════════════════════════ -->
    <section style="padding-block: var(--sv-section-py); background: var(--sv-white);" aria-label="Bảng so sánh nhôm kính">
      <div class="sv-container">
        <div style="text-align:center; margin-bottom: clamp(28px,4vw,48px);" data-sv-reveal>
          <span class="sv-section-tag">SO SÁNH CHUYÊN SÂU</span>
          <h2 class="sv-section-title" style="margin-inline:auto;">Bảng So Sánh Kỹ Thuật Các Dòng Nhôm Cao Cấp</h2>
          <p style="font-size: var(--sv-fs-sm); color: var(--sv-gray-text); max-width:600px; margin-inline:auto; margin-top: var(--sv-sp-2);">
            Dữ liệu thu thập từ tài liệu kỹ thuật chính hãng và thực tế thi công của NKSV tại hơn 200 công trình.
          </p>
        </div>
        <div style="overflow-x:auto; -webkit-overflow-scrolling:touch;" data-sv-reveal>
          <table style="width:100%; border-collapse:collapse; font-size: clamp(12px,1.3vw,14px); min-width:640px;">
            <thead>
              <tr style="background: var(--sv-dark-900); color: var(--sv-white);">
                <th style="padding:14px 16px; text-align:left; font-family: var(--sv-font-head); font-weight:700; border-radius: var(--sv-radius-sm) 0 0 0;">Tiêu Chí</th>
                <th style="padding:14px 16px; text-align:center; font-family: var(--sv-font-head); font-weight:700;">Civro (TBN)</th>
                <th style="padding:14px 16px; text-align:center; font-family: var(--sv-font-head); font-weight:700; background: rgba(155,28,28,0.8);">Maxpro.JP (Nhật)</th>
                <th style="padding:14px 16px; text-align:center; font-family: var(--sv-font-head); font-weight:700;">Xingfa (TQ)</th>
                <th style="padding:14px 16px; text-align:center; font-family: var(--sv-font-head); font-weight:700; border-radius: 0 var(--sv-radius-sm) 0 0;">PMA (VN)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background:#f9fafb;">
                <td style="padding:13px 16px; font-weight:600; color: var(--sv-dark-900);">Xuất xứ</td>
                <td style="padding:13px 16px; text-align:center;">Tây Ban Nha</td>
                <td style="padding:13px 16px; text-align:center; background:rgba(155,28,28,0.04); font-weight:600;">Nhật Bản</td>
                <td style="padding:13px 16px; text-align:center;">Trung Quốc</td>
                <td style="padding:13px 16px; text-align:center;">Việt Nam</td>
              </tr>
              <tr>
                <td style="padding:13px 16px; font-weight:600; color: var(--sv-dark-900);">Độ dày profile</td>
                <td style="padding:13px 16px; text-align:center;">1.8 – 2.0mm</td>
                <td style="padding:13px 16px; text-align:center; background:rgba(155,28,28,0.04); font-weight:600; color: var(--sv-red-600);">2.0 – 2.5mm ★</td>
                <td style="padding:13px 16px; text-align:center;">1.4 – 1.8mm</td>
                <td style="padding:13px 16px; text-align:center;">1.6 – 2.0mm</td>
              </tr>
              <tr style="background:#f9fafb;">
                <td style="padding:13px 16px; font-weight:600; color: var(--sv-dark-900);">Bảo hành màu sắc</td>
                <td style="padding:13px 16px; text-align:center;">15 năm</td>
                <td style="padding:13px 16px; text-align:center; background:rgba(155,28,28,0.04); font-weight:600; color: var(--sv-red-600);">40 năm ★</td>
                <td style="padding:13px 16px; text-align:center;">5 – 10 năm</td>
                <td style="padding:13px 16px; text-align:center;">10 năm</td>
              </tr>
              <tr>
                <td style="padding:13px 16px; font-weight:600; color: var(--sv-dark-900);">Kháng muối biển</td>
                <td style="padding:13px 16px; text-align:center;">Tốt (AA15)</td>
                <td style="padding:13px 16px; text-align:center; background:rgba(155,28,28,0.04); font-weight:600; color: var(--sv-red-600);">Xuất sắc (AA25) ★</td>
                <td style="padding:13px 16px; text-align:center;">Trung bình</td>
                <td style="padding:13px 16px; text-align:center;">Tốt</td>
              </tr>
              <tr style="background:#f9fafb;">
                <td style="padding:13px 16px; font-weight:600; color: var(--sv-dark-900);">Uốn vòm cong</td>
                <td style="padding:13px 16px; text-align:center;">Có thể (R≥300mm)</td>
                <td style="padding:13px 16px; text-align:center; background:rgba(155,28,28,0.04); font-weight:600; color: var(--sv-red-600);">Có thể (R≥200mm) ★</td>
                <td style="padding:13px 16px; text-align:center;">Hạn chế</td>
                <td style="padding:13px 16px; text-align:center;">Có thể (R≥250mm)</td>
              </tr>
              <tr>
                <td style="padding:13px 16px; font-weight:600; color: var(--sv-dark-900);">Hệ Slim (đố mảnh)</td>
                <td style="padding:13px 16px; text-align:center;">Có (18-20mm)</td>
                <td style="padding:13px 16px; text-align:center; background:rgba(155,28,28,0.04); font-weight:600; color: var(--sv-red-600);">Có (15-18mm) ★</td>
                <td style="padding:13px 16px; text-align:center;">Không</td>
                <td style="padding:13px 16px; text-align:center;">Có (20mm)</td>
              </tr>
              <tr style="background:#f9fafb;">
                <td style="padding:13px 16px; font-weight:600; color: var(--sv-dark-900);">Phân khúc giá</td>
                <td style="padding:13px 16px; text-align:center;">Cao cấp</td>
                <td style="padding:13px 16px; text-align:center; background:rgba(155,28,28,0.04); font-weight:600;">Luxury</td>
                <td style="padding:13px 16px; text-align:center;">Phổ thông – Trung cấp</td>
                <td style="padding:13px 16px; text-align:center;">Trung cấp – Cao cấp</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style="font-size:12px; color: var(--sv-gray-text); margin-top: var(--sv-sp-4); text-align:center; opacity:0.7;">
          ★ Số liệu từ tài liệu kỹ thuật chính hãng. NKSV là đại lý phân phối chính thức được ủy quyền.
        </p>
      </div>
    </section>


    <!-- ════════════════════════════════════════════
         SECTION 5b: 10 LÝ DO CHỌN NKSV
    ════════════════════════════════════════════ -->
    <section style="padding-block: var(--sv-section-py); background: var(--sv-gray-025);" aria-label="10 lý do chọn Nhôm Sao Vàng">
      <div class="sv-container">
        <div style="text-align:center; margin-bottom: clamp(28px,4vw,48px);" data-sv-reveal>
          <span class="sv-section-tag">TẠI SAO HƠN 500 ĐỐI TÁC LỰA CHỌN</span>
          <h2 class="sv-section-title" style="margin-inline:auto;">10 Lý Do Nhà Thầu & Kiến Trúc Sư Tin Chọn NKSV</h2>
        </div>
        <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:clamp(10px,2vw,20px);" class="reasons-grid">
          <!-- 1 -->
          <div style="background: var(--sv-white); border-radius: var(--sv-radius-md); padding: clamp(16px,2.5vw,24px); text-align:center; border: 1px solid var(--sv-gray-200); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'; this.style.borderColor='rgba(155,28,28,0.2)';" onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='var(--sv-gray-200)';" data-sv-reveal data-sv-delay="1">
            <div style="font-size:32px; margin-bottom:12px;">🏗️</div>
            <div style="font-size:11px; font-weight:800; font-family: var(--sv-font-head); color: var(--sv-red-600); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">01</div>
            <p style="font-size:13px; color: var(--sv-dark-900); font-weight:600; line-height:1.4;">Tích hợp 19 dòng nhôm cao cấp trong một đơn vị</p>
          </div>
          <!-- 2 -->
          <div style="background: var(--sv-white); border-radius: var(--sv-radius-md); padding: clamp(16px,2.5vw,24px); text-align:center; border: 1px solid var(--sv-gray-200); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'; this.style.borderColor='rgba(155,28,28,0.2)';" onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='var(--sv-gray-200)';" data-sv-reveal data-sv-delay="2">
            <div style="font-size:32px; margin-bottom:12px;">🔧</div>
            <div style="font-size:11px; font-weight:800; font-family: var(--sv-font-head); color: var(--sv-red-600); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">02</div>
            <p style="font-size:13px; color: var(--sv-dark-900); font-weight:600; line-height:1.4;">Nền tảng cơ khí CNC uốn vòm nhôm tùy biến</p>
          </div>
          <!-- 3 -->
          <div style="background: var(--sv-white); border-radius: var(--sv-radius-md); padding: clamp(16px,2.5vw,24px); text-align:center; border: 1px solid var(--sv-gray-200); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'; this.style.borderColor='rgba(155,28,28,0.2)';" onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='var(--sv-gray-200)';" data-sv-reveal data-sv-delay="3">
            <div style="font-size:32px; margin-bottom:12px;">📐</div>
            <div style="font-size:11px; font-weight:800; font-family: var(--sv-font-head); color: var(--sv-red-600); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">03</div>
            <p style="font-size:13px; color: var(--sv-dark-900); font-weight:600; line-height:1.4;">Khảo sát thực địa laser 3D miễn phí</p>
          </div>
          <!-- 4 -->
          <div style="background: var(--sv-white); border-radius: var(--sv-radius-md); padding: clamp(16px,2.5vw,24px); text-align:center; border: 1px solid var(--sv-gray-200); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'; this.style.borderColor='rgba(155,28,28,0.2)';" onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='var(--sv-gray-200)';" data-sv-reveal data-sv-delay="4">
            <div style="font-size:32px; margin-bottom:12px;">🏅</div>
            <div style="font-size:11px; font-weight:800; font-family: var(--sv-font-head); color: var(--sv-red-600); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">04</div>
            <p style="font-size:13px; color: var(--sv-dark-900); font-weight:600; line-height:1.4;">Bảo hành màu 40 năm — dài nhất thị trường VN</p>
          </div>
          <!-- 5 -->
          <div style="background: var(--sv-white); border-radius: var(--sv-radius-md); padding: clamp(16px,2.5vw,24px); text-align:center; border: 1px solid var(--sv-gray-200); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'; this.style.borderColor='rgba(155,28,28,0.2)';" onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='var(--sv-gray-200)';" data-sv-reveal data-sv-delay="5">
            <div style="font-size:32px; margin-bottom:12px;">🛡️</div>
            <div style="font-size:11px; font-weight:800; font-family: var(--sv-font-head); color: var(--sv-red-600); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">05</div>
            <p style="font-size:13px; color: var(--sv-dark-900); font-weight:600; line-height:1.4;">100% CO/CQ chính hãng — không hàng OEM giả</p>
          </div>
          <!-- 6 -->
          <div style="background: var(--sv-white); border-radius: var(--sv-radius-md); padding: clamp(16px,2.5vw,24px); text-align:center; border: 1px solid var(--sv-gray-200); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'; this.style.borderColor='rgba(155,28,28,0.2)';" onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='var(--sv-gray-200)';" data-sv-reveal data-sv-delay="1">
            <div style="font-size:32px; margin-bottom:12px;">⚙️</div>
            <div style="font-size:11px; font-weight:800; font-family: var(--sv-font-head); color: var(--sv-red-600); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">06</div>
            <p style="font-size:13px; color: var(--sv-dark-900); font-weight:600; line-height:1.4;">Xưởng ép góc thủy lực 15 tấn — khung cứng tuyệt đối</p>
          </div>
          <!-- 7 -->
          <div style="background: var(--sv-white); border-radius: var(--sv-radius-md); padding: clamp(16px,2.5vw,24px); text-align:center; border: 1px solid var(--sv-gray-200); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'; this.style.borderColor='rgba(155,28,28,0.2)';" onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='var(--sv-gray-200)';" data-sv-reveal data-sv-delay="2">
            <div style="font-size:32px; margin-bottom:12px;">💧</div>
            <div style="font-size:11px; font-weight:800; font-family: var(--sv-font-head); color: var(--sv-red-600); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">07</div>
            <p style="font-size:13px; color: var(--sv-dark-900); font-weight:600; line-height:1.4;">Test nước áp suất chống thấm 100% trước bàn giao</p>
          </div>
          <!-- 8 -->
          <div style="background: var(--sv-white); border-radius: var(--sv-radius-md); padding: clamp(16px,2.5vw,24px); text-align:center; border: 1px solid var(--sv-gray-200); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'; this.style.borderColor='rgba(155,28,28,0.2)';" onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='var(--sv-gray-200)';" data-sv-reveal data-sv-delay="3">
            <div style="font-size:32px; margin-bottom:12px;">🔄</div>
            <div style="font-size:11px; font-weight:800; font-family: var(--sv-font-head); color: var(--sv-red-600); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">08</div>
            <p style="font-size:13px; color: var(--sv-dark-900); font-weight:600; line-height:1.4;">Bảo trì định kỳ miễn phí 1 lần/năm trong 5 năm</p>
          </div>
          <!-- 9 -->
          <div style="background: var(--sv-white); border-radius: var(--sv-radius-md); padding: clamp(16px,2.5vw,24px); text-align:center; border: 1px solid var(--sv-gray-200); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'; this.style.borderColor='rgba(155,28,28,0.2)';" onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='var(--sv-gray-200)';" data-sv-reveal data-sv-delay="4">
            <div style="font-size:32px; margin-bottom:12px;">📋</div>
            <div style="font-size:11px; font-weight:800; font-family: var(--sv-font-head); color: var(--sv-red-600); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">09</div>
            <p style="font-size:13px; color: var(--sv-dark-900); font-weight:600; line-height:1.4;">Hợp đồng NDA bảo mật thiết kế — an tâm thi công</p>
          </div>
          <!-- 10 -->
          <div style="background: var(--sv-white); border-radius: var(--sv-radius-md); padding: clamp(16px,2.5vw,24px); text-align:center; border: 1px solid var(--sv-gray-200); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'; this.style.borderColor='rgba(155,28,28,0.2)';" onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='var(--sv-gray-200)';" data-sv-reveal data-sv-delay="5">
            <div style="font-size:32px; margin-bottom:12px;">🤝</div>
            <div style="font-size:11px; font-weight:800; font-family: var(--sv-font-head); color: var(--sv-red-600); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">10</div>
            <p style="font-size:13px; color: var(--sv-dark-900); font-weight:600; line-height:1.4;">Chính sách chiết khấu nhà thầu 7–12% theo sản lượng</p>
          </div>
        </div>
      </div>
      <style>
        @media (max-width:900px) { .reasons-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width:540px) { .reasons-grid { grid-template-columns: repeat(2,1fr) !important; } }
      </style>
    </section>


    <!-- ════════════════════════════════════════════
         SECTION 6b: CASE STUDIES THỰC TẾ
    ════════════════════════════════════════════ -->
    <section style="padding-block: var(--sv-section-py); background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: var(--sv-white);" aria-label="Case studies thực tế">
      <div class="sv-container">
        <div style="text-align:center; margin-bottom: clamp(28px,4vw,48px);" data-sv-reveal>
          <span class="sv-section-tag" style="color: var(--sv-gold-500);">BÀI HỌC THỰC TIỄN TỪ CÔNG TRÌNH</span>
          <h2 class="sv-section-title" style="color: var(--sv-white); margin-inline:auto;">2 Dự Án Điển Hình — Chứng Minh Năng Lực Vượt Trội</h2>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:clamp(20px,4vw,48px);" class="casestudy-grid">
          <!-- Case 1 -->
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--sv-radius-lg); overflow:hidden; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='0 20px 48px rgba(0,0,0,0.3)';" onmouseout="this.style.transform=''; this.style.boxShadow='';" data-sv-reveal data-sv-delay="1">
            <div style="aspect-ratio:16/9; overflow:hidden;">
              <img src="https://i.pinimg.com/736x/df/ba/68/dfba68e3f2a9b4c1d7e8f5c3b2a1d4e7.jpg"
                   alt="Resort ven biển Mũi Né — dự án nhôm Maxpro kháng muối biển"
                   style="width:100%; height:100%; object-fit:cover; transition: transform 0.5s ease;"
                   onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'"
                   onerror="this.src='assets/images/project-villa.png'"/>
            </div>
            <div style="padding: clamp(20px,3vw,32px);">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                <span style="background: rgba(245,158,11,0.2); color: var(--sv-gold-500); font-size:11px; font-weight:800; border-radius:4px; padding:3px 10px;">RESORT VEN BIỂN</span>
                <span style="font-size:12px; color: rgba(255,255,255,0.5);">Mũi Né, Bình Thuận</span>
              </div>
              <h3 style="font-family: var(--sv-font-head); font-size: clamp(16px,2vw,20px); font-weight:800; color: var(--sv-white); margin-bottom:12px; line-height:1.3;">Thay Thế Toàn Bộ 320 Cánh Cửa Bị Rỉ Sét Do Muối Biển</h3>
              <p style="font-size: var(--sv-fs-sm); color: rgba(255,255,255,0.65); line-height:1.65; margin-bottom:16px;">
                Resort 4 sao ven biển Mũi Né lắp nhôm thông thường bị rỉ sét, bong tróc sau 3 năm. NKSV tư vấn và thay thế toàn bộ bằng <strong style="color:var(--sv-gold-500);">nhôm Maxpro.JP Anodized ED AA25</strong> kết hợp phụ kiện chống muối CMECH M-Treatment.
              </p>
              <div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:16px;">
                <div style="text-align:center;"><div style="font-family: var(--sv-font-head); font-size:24px; font-weight:900; color: var(--sv-gold-500);">320</div><div style="font-size:11px; color:rgba(255,255,255,0.5);">Cánh cửa thay thế</div></div>
                <div style="text-align:center;"><div style="font-family: var(--sv-font-head); font-size:24px; font-weight:900; color: var(--sv-gold-500);">40</div><div style="font-size:11px; color:rgba(255,255,255,0.5);">Năm bảo hành màu</div></div>
                <div style="text-align:center;"><div style="font-family: var(--sv-font-head); font-size:24px; font-weight:900; color: var(--sv-gold-500);">45</div><div style="font-size:11px; color:rgba(255,255,255,0.5);">Ngày thi công</div></div>
              </div>
            </div>
          </div>
          <!-- Case 2 -->
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--sv-radius-lg); overflow:hidden; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='0 20px 48px rgba(0,0,0,0.3)';" onmouseout="this.style.transform=''; this.style.boxShadow='';" data-sv-reveal data-sv-delay="2">
            <div style="aspect-ratio:16/9; overflow:hidden;">
              <img src="https://i.pinimg.com/736x/b0/a0/0c/b0a00cf3d7e8b1c2a5f9e4d3b8c7a2f1.jpg"
                   alt="Siêu biệt thự Phú Mỹ Hưng — cửa vòm nhôm kính uốn elip"
                   style="width:100%; height:100%; object-fit:cover; transition: transform 0.5s ease;"
                   onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'"
                   onerror="this.src='assets/images/project-dalat-villa.png'"/>
            </div>
            <div style="padding: clamp(20px,3vw,32px);">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                <span style="background: rgba(155,28,28,0.3); color: #fca5a5; font-size:11px; font-weight:800; border-radius:4px; padding:3px 10px;">SIÊU BIỆT THỰ</span>
                <span style="font-size:12px; color: rgba(255,255,255,0.5);">Phú Mỹ Hưng, TP.HCM</span>
              </div>
              <h3 style="font-family: var(--sv-font-head); font-size: clamp(16px,2vw,20px); font-weight:800; color: var(--sv-white); margin-bottom:12px; line-height:1.3;">Cửa Vòm Elip Uốn CNC Nhôm Dày 2.5mm Chịu Kính Hộp 120kg</h3>
              <p style="font-size: var(--sv-fs-sm); color: rgba(255,255,255,0.65); line-height:1.65; margin-bottom:16px;">
                Siêu biệt thự tân cổ điển yêu cầu cửa vào chính dạng vòm elip bán kính R220mm, tổng trọng lượng kính hộp Low-E 120kg/cánh. NKSV CKSV phối hợp <strong style="color:var(--sv-gold-500);">uốn vòm CNC nhôm dày 2.5mm</strong> + kết cấu thép đỡ tích hợp bản lề 4D 200kg.
              </p>
              <div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:16px;">
                <div style="text-align:center;"><div style="font-family: var(--sv-font-head); font-size:24px; font-weight:900; color: var(--sv-gold-500);">R220</div><div style="font-size:11px; color:rgba(255,255,255,0.5);">mm bán kính elip</div></div>
                <div style="text-align:center;"><div style="font-family: var(--sv-font-head); font-size:24px; font-weight:900; color: var(--sv-gold-500);">120</div><div style="font-size:11px; color:rgba(255,255,255,0.5);">kg trọng lượng kính</div></div>
                <div style="text-align:center;"><div style="font-family: var(--sv-font-head); font-size:24px; font-weight:900; color: var(--sv-gold-500);">2.5</div><div style="font-size:11px; color:rgba(255,255,255,0.5);">mm dày nhôm</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        @media (max-width:768px) { .casestudy-grid { grid-template-columns: 1fr !important; } }
      </style>
    </section>
'''

# Chèn NEW_SECTIONS trước section division-section (section cũ section 4)
ANCHOR = '    <!-- ════════════════════════════════════════════\r\n         SECTION 4: 6 LĨNH VỰC/DỊCH VỤ CỐT LÕI'
ANCHOR_UNIX = '    <!-- ════════════════════════════════════════════\n         SECTION 4: 6 LĨNH VỰC/DỊCH VỤ CỐT LÕI'

with open(FPATH, 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

if ANCHOR in content:
    content = content.replace(ANCHOR, NEW_SECTIONS + '\n\n' + ANCHOR)
    print("Replaced with CRLF anchor")
elif ANCHOR_UNIX in content:
    content = content.replace(ANCHOR_UNIX, NEW_SECTIONS + '\n\n' + ANCHOR_UNIX)
    print("Replaced with LF anchor")
else:
    # Fallback: insert before division-section
    fallback = '<section class="division-section"'
    if fallback in content:
        content = content.replace(fallback, NEW_SECTIONS + '\n\n    ' + fallback)
        print("Replaced with fallback anchor")
    else:
        print("ERROR: Could not find anchor point!")
        exit(1)

with open(FPATH, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"nhom-sao-vang.html updated. New size: {len(content):,} chars")
