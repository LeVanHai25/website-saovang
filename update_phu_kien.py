#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Chèn section giới thiệu thương hiệu chiều sâu (CMECH, BOGO, DRAHO)
và cam kết chính hãng vào phu-kien.html,
ngay sau stats-bar và trước filter-section.
"""
import os, sys
sys.stdout.reconfigure(encoding='utf-8')

BASE  = r'd:\Sao Vàng\Website-SaoVang\website'
FPATH = os.path.join(BASE, 'phu-kien.html')

with open(FPATH, 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Anchor: insert BEFORE filter-section
ANCHOR = '  <!-- \u2500\u2500 FILTER TABS \u2500\u2500 -->'
pos = content.find(ANCHOR)
assert pos != -1, f'Anchor not found!'
print(f'Anchor found at position {pos}')

BRAND_SECTION = '''
  <!-- \u2500\u2500 BRAND INTRO SECTION \u2500\u2500 -->
  <section style="padding:72px 0; background:#fff;" aria-label="Gi\u1edbi thi\u1ec7u th\u01b0\u01a1ng hi\u1ec7u ph\u1ee5 ki\u1ec7n">
    <div class="sv-container">
      <div style="text-align:center; margin-bottom:clamp(32px,5vw,52px);" data-sv-reveal>
        <span class="sv-section-tag">3 TH\u01af\u01a0NG HI\u1ec6U N\u1ed2NG C\u1ed0T</span>
        <h2 class="sv-section-title" style="margin-inline:auto;">Ph\u1ee5 Ki\u1ec7n Ch\u00ednh H\u00e3ng \u2014 Ph\u00e2n T\u00edch S\u00e2u T\u1eebng D\u00f2ng</h2>
        <p style="font-size:var(--sv-fs-sm); color:var(--sv-gray-text); max-width:620px; margin-inline:auto; margin-top:var(--sv-sp-2); line-height:1.7;">
          NKSV ch\u1ec9 ph\u00e2n ph\u1ed1i 3 th\u01b0\u01a1ng hi\u1ec7u c\u1ed1t l\u00f5i — m\u1ed7i th\u01b0\u01a1ng hi\u1ec7u gi\u1ea3i quy\u1ebft m\u1ed9t b\u00e0i to\u00e1n c\u1ee5 th\u1ec3 kh\u00e1c nhau v\u1ec1 hi\u1ec7u n\u0103ng, ng\u00e2n s\u00e1ch v\u00e0 m\u00f4i tr\u01b0\u1eddng s\u1eed d\u1ee5ng.
        </p>
      </div>

      <!-- CMECH -->
      <div style="display:grid; grid-template-columns:340px 1fr; gap:clamp(24px,4vw,56px); align-items:center; margin-bottom:72px; padding-bottom:72px; border-bottom:1px solid #f0f0f0;" class="brand-row" data-sv-reveal>
        <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%); border-radius:16px; padding:36px 28px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:16px; flex-shrink:0;">
          <div style="width:72px; height:72px; background:rgba(212,175,55,0.15); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32px; color:#d4af37;">
            <i class="ri-shield-star-line"></i>
          </div>
          <div style="font-family:var(--sv-font-head); font-size:28px; font-weight:900; color:#d4af37; letter-spacing:0.05em;">CMECH</div>
          <div style="font-size:12px; color:rgba(255,255,255,0.6); font-weight:600; text-transform:uppercase; letter-spacing:0.1em;">Made in USA</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; width:100%; margin-top:8px;">
            <div style="background:rgba(255,255,255,0.06); border-radius:8px; padding:12px 8px; text-align:center;">
              <div style="font-family:var(--sv-font-head); font-size:20px; font-weight:900; color:#d4af37;">100K</div>
              <div style="font-size:10px; color:rgba(255,255,255,0.5); margin-top:3px;">L\u1ea7n \u0111\u00f3ng m\u1edf</div>
            </div>
            <div style="background:rgba(255,255,255,0.06); border-radius:8px; padding:12px 8px; text-align:center;">
              <div style="font-family:var(--sv-font-head); font-size:20px; font-weight:900; color:#d4af37;">10x</div>
              <div style="font-size:10px; color:rgba(255,255,255,0.5); margin-top:3px;">Kh\u00e1ng mu\u1ed1i m\u1eb7n</div>
            </div>
          </div>
          <a href="lien-he.html" style="display:inline-flex; align-items:center; gap:6px; background:#d4af37; color:#0f172a; padding:10px 20px; border-radius:8px; font-family:var(--sv-font-head); font-weight:800; font-size:13px; text-decoration:none; transition:all 0.2s; margin-top:4px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(212,175,55,0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='';">
            B\u00e1o Gi\u00e1 CMECH <i class="ri-arrow-right-line"></i>
          </a>
        </div>
        <div>
          <div style="display:inline-block; background:#fef3c7; color:#92400e; font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; border-radius:4px; padding:4px 12px; margin-bottom:16px;">Ph\u00e2n Kh\u00fac Luxury &amp; Resort Bi\u1ec3n</div>
          <h3 style="font-family:var(--sv-font-head); font-size:clamp(20px,2.5vw,26px); font-weight:800; color:var(--sv-dark-900); margin-bottom:14px; line-height:1.3;">CMECH \u2014 Ch\u00ed L\u1ef1c C\u1ee7a M\u1ef9 \u0110\u1ec3 Gi\u1ea3i B\u00e0i To\u00e1n M\u00f4i Tr\u01b0\u1eddng Mu\u1ed1i Bi\u1ec3n</h3>
          <p style="font-size:var(--sv-fs-sm); color:var(--sv-gray-text); line-height:1.7; margin-bottom:20px;">
            CMECH (Hoa K\u1ef3) s\u1eed d\u1ee5ng c\u00f4ng ngh\u1ec7 x\u1eed l\u00fd b\u1ec1 m\u1eb7t \u0111\u1ed9c quy\u1ec1n <strong>M-Treatment</strong> \u2014 l\u1edbp m\u1ea1 \u0111a t\u1ea7ng k\u00edch th\u01b0\u1edbc nano kh\u00e1ng mu\u1ed1i NaCl g\u1ea5p 10 l\u1ea7n so v\u1edbi ti\u00eau chu\u1ea9n ASTM B117. T\u1ea5t c\u1ea3 c\u00e1c t\u1ea5m ch\u1ea5t li\u1ec7u c\u01a1 s\u1edf \u0111\u1ec1u l\u00e0 h\u1ee3p kim thau/inox 316L \u2014 kh\u00f4ng c\u00f3 thuy\u1ec1n th\u1ec5 k\u1ebfm ch\u1ea5t l\u01b0\u1ee3ng.
          </p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px;">
            <div style="border:1px solid #e5e7eb; border-radius:8px; padding:14px 16px;">
              <div style="font-size:11px; font-weight:700; color:var(--sv-red-600); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">D\u00f2ng London Series</div>
              <p style="font-size:12px; color:var(--sv-gray-text); line-height:1.5;">Tay n\u1eafm v\u00f4 \u0111\u1ecbch \u0111a \u0111i\u1ec3m kh\u00f3a, d\u1ea1ng th\u1eb3ng g\u00f3c vu\u00f4ng, m\u1ea1 PVD 18K Gold ho\u1eb7c Black Chrome. Chuy\u00ean cho bi\u1ec7t th\u1ef1 Luxury v\u00e0 c\u00e1c kh\u00e1ch s\u1ea1n 5 sao.</p>
            </div>
            <div style="border:1px solid #e5e7eb; border-radius:8px; padding:14px 16px;">
              <div style="font-size:11px; font-weight:700; color:var(--sv-red-600); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">D\u00f2ng New York Series</div>
              <p style="font-size:12px; color:var(--sv-gray-text); line-height:1.5;">Tay n\u1eafm ki\u1ec3u d\u00e1ng c\u1eeda \u0111i v\u0103n ph\u00f2ng hi\u1ec7n \u0111\u1ea1i, kh\u00f3a 3 \u0111i\u1ec3m k\u1ebft h\u1ee3p gi\u1ea3i ph\u00e1p ch\u1ed1ng v\u01b0\u1ee3t r\u00e0o 2 c\u1ea5p \u0111\u1ed9. Ph\u00f9 h\u1ee3p cho cao \u1ed1c v\u0103n ph\u00f2ng v\u00e0 resort.</p>
            </div>
            <div style="border:1px solid #e5e7eb; border-radius:8px; padding:14px 16px;">
              <div style="font-size:11px; font-weight:700; color:var(--sv-red-600); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">D\u00f2ng Metro Series</div>
              <p style="font-size:12px; color:var(--sv-gray-text); line-height:1.5;">Tay n\u1eafm m\u1ecdng gon ph\u00f9 h\u1ee3p c\u1eeda nh\u00f4m Slim 20-25mm. B\u1ec1 m\u1eb7t Matte Black ho\u1eb7c Satin Nickel. B\u1ea3o h\u00e0nh 10 n\u0103m ch\u1ed1ng \u0103n m\u00f2n mu\u1ed1i bi\u1ec3n.</p>
            </div>
            <div style="border:1px solid #fef3c7; background:#fffbeb; border-radius:8px; padding:14px 16px;">
              <div style="font-size:11px; font-weight:700; color:#92400e; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">Cam K\u1ebft Ch\u1ea5t L\u01b0\u1ee3ng</div>
              <p style="font-size:12px; color:#78350f; line-height:1.5;"><strong>B\u1ea3o h\u00e0nh 100,000 l\u1ea7n \u0111\u00f3ng m\u1edf</strong> kh\u00f4ng h\u1ecfng. Test chu\u1ea9n ANSI/BHMA A156.2 Grade 1 \u2014 ti\u00eau chu\u1ea9n cao nh\u1ea5t c\u1ee7a Hoa K\u1ef3 cho ph\u1ee5 ki\u1ec7n th\u01b0\u01a1ng m\u1ea1i.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- BOGO -->
      <div style="display:grid; grid-template-columns:1fr 340px; gap:clamp(24px,4vw,56px); align-items:center; margin-bottom:72px; padding-bottom:72px; border-bottom:1px solid #f0f0f0;" class="brand-row brand-row-reverse" data-sv-reveal>
        <div>
          <div style="display:inline-block; background:#dbeafe; color:#1e40af; font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; border-radius:4px; padding:4px 12px; margin-bottom:16px;">Ph\u00e2n Kh\u00fac Cao C\u1ea5p &amp; Bi\u1ec7t Th\u1ef1</div>
          <h3 style="font-family:var(--sv-font-head); font-size:clamp(20px,2.5vw,26px); font-weight:800; color:var(--sv-dark-900); margin-bottom:14px; line-height:1.3;">BOGO \u2014 B\u1ea3n L\u1ec1 4D \u0110\u1ee9c Qu\u1ed1c Ch\u01b0a T\u1eebng Th\u1ea5t B\u1ea1i Sau 15 N\u0103m</h3>
          <p style="font-size:var(--sv-fs-sm); color:var(--sv-gray-text); line-height:1.7; margin-bottom:20px;">
            BOGO (\u0110\u1ee9c/OEM cao c\u1ea5p) \u0111\u01b0\u1ee3c ch\u1ebf t\u1ea1o t\u1eeb h\u1ee3p kim nh\u00f4m \u0111\u00fac nguy\u00ean kh\u1ed1i ch\u1ea5t l\u01b0\u1ee3ng \u0111\u1eb7c bi\u1ec7t, xi m\u1ea1 Anodizing ng\u00e0nh Aerospace \u2014 c\u00f9ng lo\u1ea1i v\u1eadt li\u1ec7u \u0111\u01b0\u1ee3c d\u00f9ng trong c\u00f4ng nghi\u1ec7p h\u00e0ng kh\u00f4ng. B\u1ea3n l\u1ec1 4D c\u00f3 th\u1ec3 \u0111i\u1ec1u ch\u1ec9nh 4 h\u01b0\u1edbng ch\u1ec9nh c\u00e1nh sau l\u1eafp \u0111\u1eb7t m\u00e0 kh\u00f4ng c\u1ea7n th\u00e1o c\u1eeda.
          </p>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:24px;">
            <div style="background:var(--sv-gray-025,#f9fafb); border-radius:8px; padding:14px; text-align:center;">
              <div style="font-family:var(--sv-font-head); font-size:22px; font-weight:900; color:var(--sv-dark-900); margin-bottom:4px;">150kg</div>
              <div style="font-size:11px; color:var(--sv-gray-text);">Ch\u1ecbu l\u1ef1c t\u1ea3i t\u1ed1i \u0111a</div>
            </div>
            <div style="background:var(--sv-gray-025,#f9fafb); border-radius:8px; padding:14px; text-align:center;">
              <div style="font-family:var(--sv-font-head); font-size:22px; font-weight:900; color:var(--sv-dark-900); margin-bottom:4px;">4D</div>
              <div style="font-size:11px; color:var(--sv-gray-text);">Ch\u1ec9nh h\u01b0\u1edbng sau l\u1eafp</div>
            </div>
            <div style="background:var(--sv-gray-025,#f9fafb); border-radius:8px; padding:14px; text-align:center;">
              <div style="font-family:var(--sv-font-head); font-size:22px; font-weight:900; color:var(--sv-dark-900); margin-bottom:4px;">15Y</div>
              <div style="font-size:11px; color:var(--sv-gray-text);">B\u1ea3o h\u00e0nh \u0111\u1ed9 ch\u1ec9nh</div>
            </div>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px;">
            <span style="background:#eff6ff; color:#1e40af; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600;">B\u1ea3n l\u1ec1 4D ch\u00ednh c\u00e1nh 150kg</span>
            <span style="background:#eff6ff; color:#1e40af; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600;">Tay n\u1eafm Slim 18mm \u00e2m kh\u00f3a</span>
            <span style="background:#eff6ff; color:#1e40af; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600;">Anodizing Aerospace grade</span>
            <span style="background:#eff6ff; color:#1e40af; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600;">Ren R\u00e3nh C chu\u1ea9n \u0110\u1ee9c</span>
          </div>
          <a href="lien-he.html" class="sv-btn sv-btn-red">B\u00e1o Gi\u00e1 BOGO <i class="ri-arrow-right-line"></i></a>
        </div>
        <div style="background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%); border-radius:16px; padding:36px 28px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:16px; flex-shrink:0;">
          <div style="width:72px; height:72px; background:rgba(255,255,255,0.12); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32px; color:#93c5fd;">
            <i class="ri-settings-3-line"></i>
          </div>
          <div style="font-family:var(--sv-font-head); font-size:28px; font-weight:900; color:#fff; letter-spacing:0.05em;">BOGO</div>
          <div style="font-size:12px; color:rgba(255,255,255,0.7); font-weight:600; text-transform:uppercase; letter-spacing:0.1em;">German Engineering / OEM</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; width:100%; margin-top:8px;">
            <div style="background:rgba(255,255,255,0.1); border-radius:8px; padding:12px 8px; text-align:center;">
              <div style="font-family:var(--sv-font-head); font-size:20px; font-weight:900; color:#bfdbfe;">150kg</div>
              <div style="font-size:10px; color:rgba(255,255,255,0.6); margin-top:3px;">T\u1ea3i tr\u1ecdng</div>
            </div>
            <div style="background:rgba(255,255,255,0.1); border-radius:8px; padding:12px 8px; text-align:center;">
              <div style="font-family:var(--sv-font-head); font-size:20px; font-weight:900; color:#bfdbfe;">4D</div>
              <div style="font-size:10px; color:rgba(255,255,255,0.6); margin-top:3px;">Ch\u1ec9nh h\u01b0\u1edbng</div>
            </div>
          </div>
          <a href="lien-he.html" style="display:inline-flex; align-items:center; gap:6px; background:#fff; color:#1e40af; padding:10px 20px; border-radius:8px; font-family:var(--sv-font-head); font-weight:800; font-size:13px; text-decoration:none; transition:all 0.2s; margin-top:4px;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='';">
            B\u00e1o Gi\u00e1 BOGO <i class="ri-arrow-right-line"></i>
          </a>
        </div>
      </div>

      <!-- DRAHO -->
      <div style="display:grid; grid-template-columns:340px 1fr; gap:clamp(24px,4vw,56px); align-items:center; margin-bottom:72px; padding-bottom:72px; border-bottom:1px solid #f0f0f0;" class="brand-row" data-sv-reveal>
        <div style="background:linear-gradient(135deg,#065f46 0%,#059669 100%); border-radius:16px; padding:36px 28px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:16px; flex-shrink:0;">
          <div style="width:72px; height:72px; background:rgba(255,255,255,0.12); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32px; color:#6ee7b7;">
            <i class="ri-building-2-line"></i>
          </div>
          <div style="font-family:var(--sv-font-head); font-size:28px; font-weight:900; color:#fff; letter-spacing:0.05em;">DRAHO</div>
          <div style="font-size:12px; color:rgba(255,255,255,0.7); font-weight:600; text-transform:uppercase; letter-spacing:0.1em;">China Premium OEM</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; width:100%; margin-top:8px;">
            <div style="background:rgba(255,255,255,0.1); border-radius:8px; padding:12px 8px; text-align:center;">
              <div style="font-family:var(--sv-font-head); font-size:20px; font-weight:900; color:#6ee7b7;">500+</div>
              <div style="font-size:10px; color:rgba(255,255,255,0.6); margin-top:3px;">M\u00e3 s\u1ea3n ph\u1ea9m</div>
            </div>
            <div style="background:rgba(255,255,255,0.1); border-radius:8px; padding:12px 8px; text-align:center;">
              <div style="font-family:var(--sv-font-head); font-size:20px; font-weight:900; color:#6ee7b7;">-35%</div>
              <div style="font-size:10px; color:rgba(255,255,255,0.6); margin-top:3px;">So v\u1edbi CMECH</div>
            </div>
          </div>
          <a href="lien-he.html" style="display:inline-flex; align-items:center; gap:6px; background:#fff; color:#065f46; padding:10px 20px; border-radius:8px; font-family:var(--sv-font-head); font-weight:800; font-size:13px; text-decoration:none; transition:all 0.2s; margin-top:4px;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='';">
            B\u00e1o Gi\u00e1 DRAHO <i class="ri-arrow-right-line"></i>
          </a>
        </div>
        <div>
          <div style="display:inline-block; background:#dcfce7; color:#166534; font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; border-radius:4px; padding:4px 12px; margin-bottom:16px;">Ph\u00e2n Kh\u00fac Trung C\u1ea5p &amp; V\u0103n Ph\u00f2ng</div>
          <h3 style="font-family:var(--sv-font-head); font-size:clamp(20px,2.5vw,26px); font-weight:800; color:var(--sv-dark-900); margin-bottom:14px; line-height:1.3;">DRAHO \u2014 T\u1ed1i \u01afu Chi Ph\u00ed, Kh\u00f4ng Gi\u1ea3m Ch\u1ea5t L\u01b0\u1ee3ng</h3>
          <p style="font-size:var(--sv-fs-sm); color:var(--sv-gray-text); line-height:1.7; margin-bottom:20px;">
            DRAHO l\u00e0 l\u1ef1a ch\u1ecdn h\u00e0ng \u0111\u1ea7u cho c\u00e1c c\u00f4ng tr\u00ecnh v\u0103n ph\u00f2ng, chung c\u01b0 v\u00e0 nh\u00e0 ph\u1ed1 \u01b0u ti\u00ean ng\u00e2n s\u00e1ch. \u0110\u1ea7y \u0111\u1ee7 ch\u1ee7ng lo\u1ea1i: b\u1ea3n l\u1ec1 4D, thanh truy\u1ec1n \u0111\u1ed9ng, con l\u0103n b\u00e1nh xe, tay n\u1eafm kh\u00f3a \u0111a \u0111i\u1ec3m. S\u1ea3n xu\u1ea5t t\u1ea1i nh\u00e0 m\u00e1y OEM ISO 9001 ki\u1ec3m \u0111\u1ecbnh b\u1edfi Bureau Veritas.
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px;">
            <span style="background:#dcfce7; color:#166534; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600;">B\u1ea3n l\u1ec1 4D ti\u00eau chu\u1ea9n 80kg</span>
            <span style="background:#dcfce7; color:#166534; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600;">Thanh truy\u1ec1n \u0111\u1ed9ng \u0111a \u0111i\u1ec3m</span>
            <span style="background:#dcfce7; color:#166534; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600;">Con l\u0103n gi\u1ea3m ch\u1ea5n</span>
            <span style="background:#dcfce7; color:#166534; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600;">Tay n\u1eafm kh\u00f3a \u0111a d\u1ea1ng</span>
            <span style="background:#dcfce7; color:#166534; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600;">Giao h\u00e0ng HN 24h</span>
          </div>
          <a href="lien-he.html" class="sv-btn sv-btn-red">B\u00e1o Gi\u00e1 DRAHO <i class="ri-arrow-right-line"></i></a>
        </div>
      </div>

      <!-- CAM KẾT CHÍNH HÃNG -->
      <div style="background:linear-gradient(135deg,#7f1d1d 0%,#9b1c1c 100%); border-radius:20px; padding:clamp(32px,5vw,56px); color:#fff; display:grid; grid-template-columns:1fr 1fr; gap:clamp(24px,4vw,48px); align-items:center;" class="brand-row" data-sv-reveal>
        <div>
          <div style="font-size:11px; font-weight:800; letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.6); margin-bottom:12px;">CAM K\u1ebeT T\u1ee4 NKSV</div>
          <h3 style="font-family:var(--sv-font-head); font-size:clamp(20px,2.5vw,28px); font-weight:900; color:#fff; margin-bottom:16px; line-height:1.25;">100% Ch\u00ednh H\u00e3ng \u2014 \u0110\u1ec1n B\u00f9 G\u1ea5p \u0110\u00f4i N\u1ebfu Ph\u00e1t Hi\u1ec7n H\u00e0ng Gi\u1ea3</h3>
          <p style="font-size:var(--sv-fs-sm); color:rgba(255,255,255,0.8); line-height:1.7; margin-bottom:24px;">
            NKSV cam k\u1ebft: kh\u00f4ng tr\u00e1o \u0111\u1ed5i ph\u1ee5 ki\u1ec7n lo\u1ea1i 1 sang lo\u1ea1i 2, kh\u00f4ng cung c\u1ea5p h\u00e0ng nh\u00e1i h\u00e0ng k\u00e9m ch\u1ea5t l\u01b0\u1ee3ng. M\u1ecdi ph\u1ee5 ki\u1ec7n \u0111\u1ec1u c\u00f3 tem ch\u1ed1ng gi\u1ea3 v\u00e0 QR Code x\u00e1c th\u1ef1c xu\u1ea5t x\u01b0. N\u1ebfu ph\u00e1t hi\u1ec7n sai ph\u1ea1m, NKSV \u0111\u1ec1n b\u00f9 <strong style="color:#fbbf24;">g\u1ea5p \u0111\u00f4i gi\u00e1 tr\u1ecb h\u1ee3p \u0111\u1ed3ng</strong>.
          </p>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <a href="lien-he.html" style="display:inline-flex; align-items:center; gap:8px; background:#d4af37; color:#0f172a; padding:13px 24px; border-radius:8px; font-family:var(--sv-font-head); font-weight:800; font-size:14px; text-decoration:none; transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='';">
              <i class="ri-phone-fill"></i> 0869 590 279
            </a>
            <a href="lien-he.html" style="display:inline-flex; align-items:center; gap:8px; background:transparent; color:#fff; padding:13px 24px; border-radius:8px; border:2px solid rgba(255,255,255,0.4); font-family:var(--sv-font-head); font-weight:700; font-size:14px; text-decoration:none; transition:all 0.2s;" onmouseover="this.style.borderColor='#fff'; this.style.background='rgba(255,255,255,0.1)';" onmouseout="this.style.borderColor='rgba(255,255,255,0.4)'; this.style.background='transparent';">
              Xem Ch\u00ednh S\u00e1ch B\u1ea3o H\u00e0nh <i class="ri-arrow-right-line"></i>
            </a>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:20px; text-align:center;">
            <i class="ri-shield-check-line" style="font-size:28px; color:#fbbf24; display:block; margin-bottom:8px;"></i>
            <div style="font-size:12px; font-weight:700; color:#fff; margin-bottom:4px;">Tem Ch\u1ed1ng Gi\u1ea3</div>
            <div style="font-size:11px; color:rgba(255,255,255,0.6);">T\u1ea5t c\u1ea3 sp \u0111\u1ec1u c\u00f3 tem hologram ch\u1ed1ng sao ch\u00e9p</div>
          </div>
          <div style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:20px; text-align:center;">
            <i class="ri-qr-code-line" style="font-size:28px; color:#fbbf24; display:block; margin-bottom:8px;"></i>
            <div style="font-size:12px; font-weight:700; color:#fff; margin-bottom:4px;">QR Code X\u00e1c Th\u1ef1c</div>
            <div style="font-size:11px; color:rgba(255,255,255,0.6);">Qu\u00e9t m\u00e3 ki\u1ec3m tra l\u00f4 s\u1ea3n xu\u1ea5t th\u1ef1c t\u1ebf</div>
          </div>
          <div style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:20px; text-align:center;">
            <i class="ri-file-list-3-line" style="font-size:28px; color:#fbbf24; display:block; margin-bottom:8px;"></i>
            <div style="font-size:12px; font-weight:700; color:#fff; margin-bottom:4px;">CO/CQ Theo L\u00f4</div>
            <div style="font-size:11px; color:rgba(255,255,255,0.6);">Gi\u1ea5y ch\u1ee9ng nh\u1eadn xu\u1ea5t x\u1ee9 k\u00e8m theo t\u1eebng l\u00f4 h\u00e0ng</div>
          </div>
          <div style="background:rgba(255,215,0,0.15); border:1px solid rgba(255,215,0,0.3); border-radius:12px; padding:20px; text-align:center;">
            <i class="ri-money-dollar-circle-line" style="font-size:28px; color:#fbbf24; display:block; margin-bottom:8px;"></i>
            <div style="font-size:12px; font-weight:700; color:#fff; margin-bottom:4px;">\u0110\u1ec1n B\u00f9 G\u1ea5p \u0110\u00f4i</div>
            <div style="font-size:11px; color:rgba(255,255,255,0.6);">N\u1ebfu ph\u00e1t hi\u1ec7n h\u00e0ng kh\u00f4ng \u0111\u00fang nh\u00e3n hi\u1ec7u \u0111\u00e3 cam k\u1ebft</div>
          </div>
        </div>
      </div>
    </div>

    <style>
      @media (max-width: 900px) {
        .brand-row { grid-template-columns: 1fr !important; }
        .brand-row-reverse > div:first-child { order: 2; }
        .brand-row-reverse > div:last-child { order: 1; }
      }
    </style>
  </section>

'''

# Insert before filter tabs
content = content[:pos] + BRAND_SECTION + content[pos:]

with open(FPATH, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'phu-kien.html updated OK. New size: {len(content):,} chars')
