#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update linh-vuc-nhom-kinh.html - EPCM 4 pillars + 8-step process"""
import os, sys
sys.stdout.reconfigure(encoding='utf-8')

BASE  = r'd:\Sao Vàng\Website-SaoVang\website'
FPATH = os.path.join(BASE, 'linh-vuc-nhom-kinh.html')

with open(FPATH, 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# ── Locate section boundaries by unique comment anchors ──────────────────
SERVICES_TAG = '<!-- \u2500\u2500 SERVICES \u2500\u2500 -->'          # <!-- -- SERVICES -- -->
PROCESS_TAG  = '<!-- \u2500\u2500 QUY TR\u00ccNH L\u00c0M VI\u1ec6C \u2500\u2500 -->'
CTA_TAG      = '<!-- \u2500\u2500 CTA BANNER \u2500\u2500 -->'
FOOTER_TAG   = '<!-- \u2500\u2500 FOOTER \u2500\u2500 -->'

pos_svc   = content.find(SERVICES_TAG)
pos_proc  = content.find(PROCESS_TAG)
pos_cta   = content.find(CTA_TAG)
pos_ftr   = content.find(FOOTER_TAG)

print(f'SERVICES @ {pos_svc}, PROCESS @ {pos_proc}, CTA @ {pos_cta}, FOOTER @ {pos_ftr}')

assert pos_svc  != -1, 'SERVICES tag not found'
assert pos_proc != -1, 'PROCESS tag not found'
assert pos_cta  != -1, 'CTA tag not found'
assert pos_ftr  != -1, 'FOOTER tag not found'

# keep everything before services and from footer onward
BEFORE   = content[:pos_svc]
FROM_FTR = content[pos_ftr:]

# ── EPCM 4 Pillars section ────────────────────────────────────────────────
NEW_SERVICES = '''<!-- \u2500\u2500 EPCM 4 TR\u1ee4 C\u1ed8T \u2500\u2500 -->
  <section style="padding:80px 0; background:#fff;">
    <div class="sv-container">
      <div style="text-align:center; margin-bottom:clamp(32px,5vw,56px);" data-sv-reveal>
        <span class="sv-section-tag">M\u00d4 H\u00ccNH D\u1ecaCH V\u1ee4 KH\u00c9P K\u00cdN</span>
        <h2 class="sv-section-title" style="margin-inline:auto;">4 Tr\u1ee5 C\u1ed9t N\u0103ng L\u1ef1c EPCM \u2014 Nh\u00f4m Sao V\u00e0ng</h2>
        <p style="font-size:var(--sv-fs-sm); color:var(--sv-gray-text); max-width:620px; margin-inline:auto; margin-top:var(--sv-sp-2); line-height:1.7;">
          Kh\u00f4ng gi\u1ed1ng c\u00e1c nh\u00e0 th\u1ea7u nh\u00f4m k\u00ednh th\u00f4ng th\u01b0\u1eddng, NKSV v\u1eadn h\u00e0nh theo m\u00f4 h\u00ecnh <strong>EPCM kh\u00e9p k\u00edn</strong>: t\u1eeb thi\u1ebft k\u1ebf k\u1ef9 thu\u1eadt \u2192 mua s\u1eafm v\u1eadt t\u01b0 \u2192 gia c\u00f4ng thi c\u00f4ng \u2192 b\u1ea3o tr\u00ec v\u1eadn h\u00e0nh \u2014 t\u1ea5t c\u1ea3 trong m\u1ed9t \u0111\u01a1n v\u1ecb tr\u00e1ch nhi\u1ec7m.
        </p>
      </div>

      <!-- Pillar 01: Engineering -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:clamp(24px,5vw,64px); align-items:center; padding:60px 0; border-bottom:1px solid #f0f0f0;" class="sv-service-row">
        <div style="border-radius:12px; overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,0.12);">
          <img src="https://i.pinimg.com/736x/3c/8a/2d/3c8a2df4b1e9c6a7d5f3b2e8a1c4d7f9.jpg"
               alt="Thi\u1ebft k\u1ebf Shop Drawing 3D h\u1ec7 nh\u00f4m k\u00ednh m\u1eb7t d\u1ef1ng facade"
               style="width:100%; height:320px; object-fit:cover; display:block; transition:transform 0.6s ease;"
               onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform=''"
               onerror="this.src='assets/images/service-glass-facades.png'"/>
        </div>
        <div>
          <div style="font-family:var(--sv-font-head); font-size:56px; font-weight:900; color:#d4af37; line-height:1; margin-bottom:8px;">01</div>
          <div style="font-size:11px; font-weight:800; letter-spacing:0.15em; text-transform:uppercase; color:var(--sv-red-600); margin-bottom:12px;">E \u2014 ENGINEERING</div>
          <h2 style="font-family:var(--sv-font-head); font-size:clamp(20px,2.5vw,28px); font-weight:800; color:var(--sv-dark-900); margin-bottom:16px; line-height:1.25;">T\u01b0 V\u1ea5n &amp; Thi\u1ebft K\u1ebf DFM</h2>
          <p style="font-size:var(--sv-fs-sm); color:var(--sv-gray-text); line-height:1.7; margin-bottom:20px;">
            M\u1ed7i c\u00f4ng tr\u00ecnh \u0111\u01b0\u1ee3c kh\u1ea3o s\u00e1t hi\u1ec7n tr\u1ea1ng b\u1eb1ng <strong>m\u00e1y laser 3D scanner</strong> \u0111\u1ed9 ch\u00ednh x\u00e1c \u00b11mm. Shop Drawing \u0111\u01b0\u1ee3c l\u1eadp theo chu\u1ea9n <strong>DFM (Design for Manufacturability)</strong> \u2014 \u0111\u1ea3m b\u1ea3o gia c\u00f4ng kh\u00f4ng sai l\u1ec7ch dung sai, l\u1eafp r\u00e1p kh\u00f4ng \u0111i\u1ec1u ch\u1ec9nh th\u00f4 t\u1ea1i hi\u1ec7n tr\u01b0\u1eddng.
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px;">
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">Kh\u1ea3o s\u00e1t laser 3D</span>
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">Shop Drawing DFM</span>
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">M\u00f4 ph\u1ecfng t\u1ea3i gi\u00f3</span>
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">B\u1ea3o m\u1eadt NDA</span>
          </div>
          <a href="lien-he.html" class="sv-btn sv-btn-red">Y\u00eau C\u1ea7u Kh\u1ea3o S\u00e1t Mi\u1ec5n Ph\u00ed <i class="ri-arrow-right-line"></i></a>
        </div>
      </div>

      <!-- Pillar 02: Procurement & Manufacturing -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:clamp(24px,5vw,64px); align-items:center; padding:60px 0; border-bottom:1px solid #f0f0f0;" class="sv-service-row sv-service-row-reverse">
        <div style="border-radius:12px; overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,0.12); order:2;">
          <img src="https://i.pinimg.com/736x/7a/f2/c5/7af2c59b3d8e1a4f6b2c7d9e8a3f1b5c.jpg"
               alt="X\u01b0\u1edfng gia c\u00f4ng \u00e9p g\u00f3c th\u1ee7y l\u1ef1c c\u1eeda nh\u00f4m k\u00ednh t\u1ef1 \u0111\u1ed9ng"
               style="width:100%; height:320px; object-fit:cover; display:block; transition:transform 0.6s ease;"
               onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform=''"
               onerror="this.src='assets/images/service-aluminum-doors.png'"/>
        </div>
        <div style="order:1;">
          <div style="font-family:var(--sv-font-head); font-size:56px; font-weight:900; color:#d4af37; line-height:1; margin-bottom:8px;">02</div>
          <div style="font-size:11px; font-weight:800; letter-spacing:0.15em; text-transform:uppercase; color:var(--sv-red-600); margin-bottom:12px;">P \u2014 PROCUREMENT &amp; MANUFACTURING</div>
          <h2 style="font-family:var(--sv-font-head); font-size:clamp(20px,2.5vw,28px); font-weight:800; color:var(--sv-dark-900); margin-bottom:16px; line-height:1.25;">Mua S\u1eafm &amp; Ch\u1ebf T\u1ea1o</h2>
          <p style="font-size:var(--sv-fs-sm); color:var(--sv-gray-text); line-height:1.7; margin-bottom:20px;">
            100% v\u1eadt t\u01b0 nh\u00f4m, k\u00ednh, ph\u1ee5 ki\u1ec7n \u0111\u1ec1u c\u00f3 <strong>CO/CQ ch\u00ednh h\u00e3ng</strong> \u0111i k\u00e8m theo l\u00f4. X\u01b0\u1edfng gia c\u00f4ng trang b\u1ecb <strong>m\u00e1y \u00e9p g\u00f3c th\u1ee7y l\u1ef1c 15 t\u1ea5n</strong>, b\u01a1m keo 2 th\u00e0nh ph\u1ea7n Sika, c\u01b0a nh\u00f4m CNC nghi\u00eang 45\u00b0 \u0111\u1ed9 ch\u00ednh x\u00e1c \u00b10.05mm, m\u00e1y u\u1ed1n v\u00f2m CNC nh\u00f4m b\u00e1n k\u00ednh R\u2265200mm.
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px;">
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">100% CO/CQ ch\u00ednh h\u00e3ng</span>
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">\u00c9p g\u00f3c th\u1ee7y l\u1ef1c 15T</span>
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">U\u1ed1n v\u00f2m CNC R200mm</span>
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">B\u01a1m keo 2 th\u00e0nh ph\u1ea7n</span>
          </div>
          <a href="lien-he.html" class="sv-btn sv-btn-red">Xem N\u0103ng L\u1ef1c X\u01b0\u1edfng <i class="ri-arrow-right-line"></i></a>
        </div>
      </div>

      <!-- Pillar 03: Construction -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:clamp(24px,5vw,64px); align-items:center; padding:60px 0; border-bottom:1px solid #f0f0f0;" class="sv-service-row">
        <div style="border-radius:12px; overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,0.12);">
          <img src="https://i.pinimg.com/736x/a4/e7/1b/a4e71bf3c2d8a9e5f1b6c4d3e7a2f8b5.jpg"
               alt="C\u00f4ng nh\u00e2n l\u1eafp d\u1ef1ng v\u00e1ch k\u00ednh m\u1eb7t d\u1ef1ng facade t\u00f2a nh\u00e0 cao t\u1ea7ng"
               style="width:100%; height:320px; object-fit:cover; display:block; transition:transform 0.6s ease;"
               onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform=''"
               onerror="this.src='assets/images/service-glass-facades.png'"/>
        </div>
        <div>
          <div style="font-family:var(--sv-font-head); font-size:56px; font-weight:900; color:#d4af37; line-height:1; margin-bottom:8px;">03</div>
          <div style="font-size:11px; font-weight:800; letter-spacing:0.15em; text-transform:uppercase; color:var(--sv-red-600); margin-bottom:12px;">C \u2014 CONSTRUCTION</div>
          <h2 style="font-family:var(--sv-font-head); font-size:clamp(20px,2.5vw,28px); font-weight:800; color:var(--sv-dark-900); margin-bottom:16px; line-height:1.25;">Thi C\u00f4ng &amp; L\u1eafp D\u1ef1ng</h2>
          <p style="font-size:var(--sv-fs-sm); color:var(--sv-gray-text); line-height:1.7; margin-bottom:20px;">
            \u0110\u1ed9i thi c\u00f4ng c\u00f3 ch\u1ee9ng ch\u1ec9 l\u00e0m vi\u1ec7c tr\u00ean cao, \u0111\u01b0\u1ee3c trang b\u1ecb c\u1ea9u n\u00e2ng chuy\u00ean d\u1ee5ng. Sau l\u1eafp \u0111\u1eb7t, <strong>test n\u01b0\u1edbc \u00e1p su\u1ea5t 100% khung c\u1eeda</strong> theo ASTM E331 tr\u01b0\u1edbc khi k\u00fd nghi\u1ec7m thu. Ch\u00e8n keo b\u1ecdt n\u1edf PU ch\u1ed1ng ng\u1ea5m th\u1ea5m, b\u1eafn \u0111\u01b0\u1eddng silicone th\u1ea9m m\u1ef9 b\u1eb1ng khu\u00f4n d\u01b0\u1ee1ng.
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px;">
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">C\u1ea9u n\u00e2ng chuy\u00ean d\u1ee5ng</span>
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">Test n\u01b0\u1edbc \u00e1p su\u1ea5t ASTM E331</span>
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">Keo PU + Silicone d\u01b0\u1ee1ng</span>
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">Camera gi\u00e1m s\u00e1t QC</span>
          </div>
          <a href="lien-he.html" class="sv-btn sv-btn-red">T\u01b0 V\u1ea5n Thi C\u00f4ng <i class="ri-arrow-right-line"></i></a>
        </div>
      </div>

      <!-- Pillar 04: Maintenance -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:clamp(24px,5vw,64px); align-items:center; padding:60px 0;" class="sv-service-row sv-service-row-reverse">
        <div style="border-radius:12px; overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,0.12); order:2;">
          <img src="https://i.pinimg.com/736x/f9/c3/2a/f9c32ab7e4d1f8b5a3c6e9d2b7f4a1c8.jpg"
               alt="K\u1ef9 thu\u1eadt vi\u00ean b\u1ea3o tr\u00ec \u0111\u1ecbnh k\u1ef3 h\u1ec7 th\u1ed1ng c\u1eeda nh\u00f4m k\u00ednh bi\u1ec7t th\u1ef1"
               style="width:100%; height:320px; object-fit:cover; display:block; transition:transform 0.6s ease;"
               onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform=''"
               onerror="this.src='assets/images/service-aluminum-doors.png'"/>
        </div>
        <div style="order:1;">
          <div style="font-family:var(--sv-font-head); font-size:56px; font-weight:900; color:#d4af37; line-height:1; margin-bottom:8px;">04</div>
          <div style="font-size:11px; font-weight:800; letter-spacing:0.15em; text-transform:uppercase; color:var(--sv-red-600); margin-bottom:12px;">M \u2014 MAINTENANCE</div>
          <h2 style="font-family:var(--sv-font-head); font-size:clamp(20px,2.5vw,28px); font-weight:800; color:var(--sv-dark-900); margin-bottom:16px; line-height:1.25;">B\u1ea3o Tr\u00ec &amp; V\u1eadn H\u00e0nh</h2>
          <p style="font-size:var(--sv-fs-sm); color:var(--sv-gray-text); line-height:1.7; margin-bottom:20px;">
            D\u1ecbch v\u1ee5 b\u1ea3o tr\u00ec \u0111\u1ecbnh k\u1ef3 mi\u1ec5n ph\u00ed <strong>1 l\u1ea7n/n\u0103m trong 5 n\u0103m \u0111\u1ea7u</strong>: ki\u1ec3m tra \u0111\u1ed9 m\u1ecfi b\u1ea3n l\u1ec1, \u0111\u1ed9 co gi\u00e3n gio\u0103ng EPDM, tra d\u1ea7u m\u1ee1 c\u01a1 c\u1ea5u kh\u00f3a \u0111a \u0111i\u1ec3m, ki\u1ec3m tra ch\u1ea5t l\u01b0\u1ee3ng \u0111\u01b0\u1eddng keo silicone. Hotline b\u1ea3o h\u00e0nh <strong>24/7</strong> x\u1eed l\u00fd s\u1ef1 c\u1ed1 kh\u1ea9n c\u1ea5p trong 48 gi\u1edd.
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px;">
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">B\u1ea3o tr\u00ec 1 l\u1ea7n/n\u0103m mi\u1ec5n ph\u00ed</span>
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">Hotline 24/7</span>
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">X\u1eed l\u00fd trong 48 gi\u1edd</span>
            <span style="background:#f3f4f6; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--sv-dark-900);">S\u1ed5 b\u1ea3o h\u00e0nh chi ti\u1ebft</span>
          </div>
          <a href="lien-he.html" class="sv-btn sv-btn-red">\u0110\u0103ng K\u00fd B\u1ea3o Tr\u00ec <i class="ri-arrow-right-line"></i></a>
        </div>
      </div>

      <style>
        @media (max-width:768px) {
          .sv-service-row { grid-template-columns:1fr !important; }
          .sv-service-row-reverse > div { order:0 !important; }
        }
      </style>
    </div>
  </section>

'''

# ── Quy trình 8 bước ─────────────────────────────────────────────────────
NEW_PROCESS = '''<!-- \u2500\u2500 QUY TR\u00ccNH 8 B\u01af\u1edaC \u2500\u2500 -->
  <section style="padding:80px 0; background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%); color:#fff;" aria-label="Quy trinh 8 buoc">
    <div class="sv-container">
      <div style="text-align:center; margin-bottom:clamp(32px,5vw,56px);" data-sv-reveal>
        <span class="sv-section-tag" style="color:var(--sv-gold-500);">MINH B\u1ea0CH \u2014 CHUY\u00caN NGHI\u1ec6P</span>
        <h2 class="sv-section-title" style="color:#fff; margin-inline:auto;">Quy Tr\u00ecnh Tri\u1ec3n Khai 8 B\u01b0\u1edbc Chu\u1ea9n NKSV</h2>
        <p style="font-size:var(--sv-fs-sm); color:rgba(255,255,255,0.65); max-width:580px; margin-inline:auto; margin-top:var(--sv-sp-2);">
          M\u1ed7i b\u01b0\u1edbc \u0111\u1ec1u c\u00f3 checklist nghi\u1ec7m thu r\u00f5 r\u00e0ng, kh\u00e1ch h\u00e0ng k\u00fd x\u00e1c nh\u1eadn tr\u01b0\u1edbc khi chuy\u1ec3n sang giai \u0111o\u1ea1n ti\u1ebfp theo.
        </p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:clamp(12px,2vw,20px);" class="process8-grid">
        <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:clamp(16px,2.5vw,24px); transition:all 0.3s;" onmouseover="this.style.background='rgba(255,215,0,0.07)'; this.style.borderColor='rgba(255,215,0,0.3)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.1)';" data-sv-reveal data-sv-delay="1">
          <div style="font-family:var(--sv-font-head); font-size:36px; font-weight:900; color:rgba(255,215,0,0.25); line-height:1; margin-bottom:10px;">01</div>
          <h3 style="font-family:var(--sv-font-head); font-size:14px; font-weight:800; color:#fff; margin-bottom:8px;">Ti\u1ebfp Nh\u1eadn Y\u00eau C\u1ea7u</h3>
          <p style="font-size:12px; color:rgba(255,255,255,0.6); line-height:1.6;">G\u1eb7p m\u1eb7t ho\u1eb7c video call kh\u1ea3o s\u00e1t nhu c\u1ea7u, ph\u00e2n t\u00edch ng\u00e2n s\u00e1ch v\u00e0 ph\u00e2n kh\u00fac ph\u00f9 h\u1ee3p.</p>
        </div>
        <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:clamp(16px,2.5vw,24px); transition:all 0.3s;" onmouseover="this.style.background='rgba(255,215,0,0.07)'; this.style.borderColor='rgba(255,215,0,0.3)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.1)';" data-sv-reveal data-sv-delay="2">
          <div style="font-family:var(--sv-font-head); font-size:36px; font-weight:900; color:rgba(255,215,0,0.25); line-height:1; margin-bottom:10px;">02</div>
          <h3 style="font-family:var(--sv-font-head); font-size:14px; font-weight:800; color:#fff; margin-bottom:8px;">Kh\u1ea3o S\u00e1t Laser 3D</h3>
          <p style="font-size:12px; color:rgba(255,255,255,0.6); line-height:1.6;">\u0110o \u0111\u1ea1c th\u1ef1c \u0111\u1ecba b\u1eb1ng m\u00e1y laser scanner \u00b11mm, l\u1eadp b\u1ea3n \u0111\u1ed3 k\u00edch th\u01b0\u1edbc hi\u1ec7n tr\u1ea1ng.</p>
        </div>
        <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:clamp(16px,2.5vw,24px); transition:all 0.3s;" onmouseover="this.style.background='rgba(255,215,0,0.07)'; this.style.borderColor='rgba(255,215,0,0.3)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.1)';" data-sv-reveal data-sv-delay="3">
          <div style="font-family:var(--sv-font-head); font-size:36px; font-weight:900; color:rgba(255,215,0,0.25); line-height:1; margin-bottom:10px;">03</div>
          <h3 style="font-family:var(--sv-font-head); font-size:14px; font-weight:800; color:#fff; margin-bottom:8px;">Shop Drawing &amp; B\u00e1o Gi\u00e1</h3>
          <p style="font-size:12px; color:rgba(255,255,255,0.6); line-height:1.6;">L\u1eadp Shop Drawing DFM 3D + b\u1ea3ng b\u00e1o gi\u00e1 minh b\u1ea1ch theo t\u1eebng h\u1ea1ng m\u1ee5c v\u1eadt t\u01b0\u2014nh\u00e2n c\u00f4ng.</p>
        </div>
        <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:clamp(16px,2.5vw,24px); transition:all 0.3s;" onmouseover="this.style.background='rgba(255,215,0,0.07)'; this.style.borderColor='rgba(255,215,0,0.3)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.1)';" data-sv-reveal data-sv-delay="4">
          <div style="font-family:var(--sv-font-head); font-size:36px; font-weight:900; color:rgba(255,215,0,0.25); line-height:1; margin-bottom:10px;">04</div>
          <h3 style="font-family:var(--sv-font-head); font-size:14px; font-weight:800; color:#fff; margin-bottom:8px;">K\u00fd H\u1ee3p \u0110\u1ed3ng NDA</h3>
          <p style="font-size:12px; color:rgba(255,255,255,0.6); line-height:1.6;">K\u00fd h\u1ee3p \u0111\u1ed3ng cam k\u1ebft b\u1ea3o m\u1eadt thi\u1ebft k\u1ebf, ch\u1ea5t l\u01b0\u1ee3ng v\u1eadt t\u01b0 v\u00e0 ti\u1ebfn \u0111\u1ed9 th\u1ef1c hi\u1ec7n.</p>
        </div>
        <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:clamp(16px,2.5vw,24px); transition:all 0.3s;" onmouseover="this.style.background='rgba(255,215,0,0.07)'; this.style.borderColor='rgba(255,215,0,0.3)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.1)';" data-sv-reveal data-sv-delay="1">
          <div style="font-family:var(--sv-font-head); font-size:36px; font-weight:900; color:rgba(255,215,0,0.25); line-height:1; margin-bottom:10px;">05</div>
          <h3 style="font-family:var(--sv-font-head); font-size:14px; font-weight:800; color:#fff; margin-bottom:8px;">S\u1ea3n Xu\u1ea5t T\u1ea1i X\u01b0\u1edfng</h3>
          <p style="font-size:12px; color:rgba(255,255,255,0.6); line-height:1.6;">Gia c\u00f4ng \u00e9p g\u00f3c th\u1ee7y l\u1ef1c, b\u01a1m keo 2 th\u00e0nh ph\u1ea7n, l\u1eafp k\u00ednh, ki\u1ec3m tra QC n\u1ed9i b\u1ed9 tr\u01b0\u1edbc xu\u1ea5t x\u01b0\u1edfng.</p>
        </div>
        <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:clamp(16px,2.5vw,24px); transition:all 0.3s;" onmouseover="this.style.background='rgba(255,215,0,0.07)'; this.style.borderColor='rgba(255,215,0,0.3)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.1)';" data-sv-reveal data-sv-delay="2">
          <div style="font-family:var(--sv-font-head); font-size:36px; font-weight:900; color:rgba(255,215,0,0.25); line-height:1; margin-bottom:10px;">06</div>
          <h3 style="font-family:var(--sv-font-head); font-size:14px; font-weight:800; color:#fff; margin-bottom:8px;">L\u1eafp \u0110\u1eb7t T\u1ea1i C\u00f4ng Tr\u00ecnh</h3>
          <p style="font-size:12px; color:rgba(255,255,255,0.6); line-height:1.6;">Thi c\u00f4ng chuy\u00ean nghi\u1ec7p, c\u1ea9u n\u00e2ng \u0111\u00fang v\u1ecb tr\u00ed, ch\u00e8n keo PU ch\u1ed1ng ng\u1ea5m, silicone th\u1ea9m m\u1ef9.</p>
        </div>
        <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:clamp(16px,2.5vw,24px); transition:all 0.3s;" onmouseover="this.style.background='rgba(255,215,0,0.07)'; this.style.borderColor='rgba(255,215,0,0.3)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.1)';" data-sv-reveal data-sv-delay="3">
          <div style="font-family:var(--sv-font-head); font-size:36px; font-weight:900; color:rgba(255,215,0,0.25); line-height:1; margin-bottom:10px;">07</div>
          <h3 style="font-family:var(--sv-font-head); font-size:14px; font-weight:800; color:#fff; margin-bottom:8px;">Test N\u01b0\u1edbc &amp; Nghi\u1ec7m Thu</h3>
          <p style="font-size:12px; color:rgba(255,255,255,0.6); line-height:1.6;">Test \u00e1p su\u1ea5t n\u01b0\u1edbc 100% khung c\u1eeda theo ASTM E331, nghi\u1ec7m thu c\u00f9ng ch\u1ee7 \u0111\u1ea7u t\u01b0 v\u00e0 t\u01b0 v\u1ea5n gi\u00e1m s\u00e1t.</p>
        </div>
        <div style="background:rgba(255,215,0,0.1); border:1px solid rgba(255,215,0,0.4); border-radius:12px; padding:clamp(16px,2.5vw,24px);" data-sv-reveal data-sv-delay="4">
          <div style="font-family:var(--sv-font-head); font-size:36px; font-weight:900; color:rgba(255,215,0,0.4); line-height:1; margin-bottom:10px;">08</div>
          <h3 style="font-family:var(--sv-font-head); font-size:14px; font-weight:800; color:#fff; margin-bottom:8px;">B\u00e0n Giao S\u1ed5 B\u1ea3o H\u00e0nh</h3>
          <p style="font-size:12px; color:rgba(255,255,255,0.6); line-height:1.6;">B\u00e0n giao s\u1ed5 b\u1ea3o h\u00e0nh ghi r\u00f5 t\u1eebng h\u1ea1ng m\u1ee5c, th\u1eddi h\u1ea1n b\u1ea3o h\u00e0nh v\u00e0 l\u1ecbch b\u1ea3o tr\u00ec \u0111\u1ecbnh k\u1ef3.</p>
        </div>
      </div>
    </div>
    <style>
      @media (max-width:900px) { .process8-grid { grid-template-columns:repeat(2,1fr) !important; } }
      @media (max-width:480px) { .process8-grid { grid-template-columns:1fr !important; } }
    </style>
  </section>

'''

# ── CTA Banner ───────────────────────────────────────────────────────────
NEW_CTA = '''<!-- \u2500\u2500 CTA BANNER \u2500\u2500 -->
  <section style="padding:80px 0; background:var(--sv-red-600); color:#fff;" aria-label="Lien he tu van nhom kinh">
    <div class="sv-container">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:40px; flex-wrap:wrap;">
        <div>
          <h2 style="font-family:var(--sv-font-head); font-size:clamp(22px,3vw,32px); font-weight:900; color:#fff; margin-bottom:10px;">S\u1eb5n S\u00e0ng Nh\u1eadn B\u00e1o Gi\u00e1 Nh\u00f4m K\u00ednh Mi\u1ec5n Ph\u00ed?</h2>
          <p style="font-size:var(--sv-fs-sm); color:rgba(255,255,255,0.85); line-height:1.65; max-width:520px;">
            G\u1eedi b\u1ea3n v\u1ebd ho\u1eb7c \u1ea3nh ch\u1ee5p m\u1eb7t b\u1eb1ng \u2014 \u0111\u1ed9i k\u1ef9 thu\u1eadt NKSV s\u1ebd ph\u00e2n t\u00edch v\u00e0 b\u00e1o gi\u00e1 trong <strong>4 gi\u1edd l\u00e0m vi\u1ec7c</strong>.
          </p>
        </div>
        <div style="display:flex; gap:16px; flex-wrap:wrap;">
          <a href="tel:0869590279" style="display:inline-flex; align-items:center; gap:8px; background:#fff; color:var(--sv-red-600); padding:14px 28px; border-radius:8px; font-family:var(--sv-font-head); font-weight:800; font-size:15px; text-decoration:none; transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)';" onmouseout="this.style.transform=''; this.style.boxShadow='';">
            <i class="ri-phone-fill"></i> 0869 590 279
          </a>
          <a href="lien-he.html" style="display:inline-flex; align-items:center; gap:8px; background:transparent; color:#fff; padding:14px 28px; border-radius:8px; border:2px solid rgba(255,255,255,0.6); font-family:var(--sv-font-head); font-weight:700; font-size:15px; text-decoration:none; transition:all 0.2s;" onmouseover="this.style.borderColor='#fff'; this.style.background='rgba(255,255,255,0.1)';" onmouseout="this.style.borderColor='rgba(255,255,255,0.6)'; this.style.background='transparent';">
            G\u1eedi Y\u00eau C\u1ea7u <i class="ri-arrow-right-line"></i>
          </a>
        </div>
      </div>
    </div>
  </section>

'''

# ── Assemble the final content ────────────────────────────────────────────
content = BEFORE + NEW_SERVICES + NEW_PROCESS + NEW_CTA + FROM_FTR

with open(FPATH, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'linh-vuc-nhom-kinh.html updated OK. Size: {len(content):,} chars')
