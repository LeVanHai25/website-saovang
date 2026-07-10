import os, sys
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"d:\Sao Vàng\Website-SaoVang\website"

# ──────────────────────────────────────────────────────────────
# Map: brand page → danh sách dự án công trình thực tế
# Dùng ảnh có sẵn trong assets/images/
# ──────────────────────────────────────────────────────────────
BRAND_GALLERY = {
    "nhom-xingfa.html": {
        "brand_name": "Xingfa",
        "brand_color": "#e11d48",
        "projects": [
            {"img": "assets/images/project-villa.png",            "title": "Biệt Thự Thảo Điền",        "location": "TP. Hồ Chí Minh", "type": "Biệt thự", "system": "Xingfa 55 Cửa Lùa"},
            {"img": "assets/images/project-vinhomes-villa.png",   "title": "Biệt Thự Vinhomes Grand",   "location": "TP. Hồ Chí Minh", "type": "Biệt thự", "system": "Xingfa 65 Cửa Đi"},
            {"img": "assets/images/hero-doors.png",               "title": "Nhà Phố Quận 9",            "location": "TP. Hồ Chí Minh", "type": "Nhà phố",  "system": "Xingfa 55 Mở Quay"},
            {"img": "assets/images/service-aluminum-doors.png",   "title": "Văn Phòng Bình Dương",      "location": "Bình Dương",       "type": "Văn phòng","system": "Xingfa 60 Cửa Lùa"},
            {"img": "assets/images/project-showroom-auto.png",    "title": "Showroom Ô Tô Q.Bình Thạnh","location": "TP. Hồ Chí Minh", "type": "Thương mại","system": "Xingfa 70 Vách Kính"},
            {"img": "assets/images/project-dalat-villa.png",      "title": "Villa Đà Lạt View Thung Lũng","location": "Đà Lạt",         "type": "Resort",   "system": "Xingfa 55 Cửa Lùa"},
        ]
    },
    "nhom-maxpro.html": {
        "brand_name": "Maxpro.JP",
        "brand_color": "#b45309",
        "projects": [
            {"img": "assets/images/project-resort-yacht.png",     "title": "Resort Biển Phú Quốc",      "location": "Phú Quốc",         "type": "Resort",   "system": "Maxpro 65 Anodized"},
            {"img": "assets/images/project-saobien-yacht.png",    "title": "Biệt Thự Biển Mũi Né",      "location": "Phan Thiết",        "type": "Biệt thự", "system": "Maxpro 55 Anodized"},
            {"img": "assets/images/project-vinhomes-villa.png",   "title": "Penthouse Biển Đà Nẵng",    "location": "Đà Nẵng",          "type": "Penthouse","system": "Maxpro 83 Cửa Lùa"},
            {"img": "assets/images/hero-interior.png",            "title": "Sky Villa Nha Trang",       "location": "Nha Trang",         "type": "Biệt thự", "system": "Maxpro 65 Mở Quay"},
            {"img": "assets/images/project-penthouse.png",        "title": "Penthouse Q.1 TP.HCM",      "location": "TP. Hồ Chí Minh",  "type": "Penthouse","system": "Maxpro 55 Vách Kính"},
        ]
    },
    "nhom-civro.html": {
        "brand_name": "Civro",
        "brand_color": "#1e293b",
        "projects": [
            {"img": "assets/images/project-mansion-gate.png",     "title": "Biệt Thự Luxury Thủ Đức",   "location": "TP. Hồ Chí Minh", "type": "Biệt thự", "system": "Civro Cách Nhiệt 73"},
            {"img": "assets/images/project-villa.png",            "title": "Villa Compound Quận 9",     "location": "TP. Hồ Chí Minh", "type": "Biệt thự", "system": "Civro Cách Nhiệt 60"},
            {"img": "assets/images/project-vinhomes-villa.png",   "title": "Penthouse Luxury Hà Nội",   "location": "Hà Nội",           "type": "Penthouse","system": "Civro Tilt & Turn"},
            {"img": "assets/images/hero-interior.png",            "title": "Biệt Thự Ecopark Hưng Yên", "location": "Hưng Yên",         "type": "Biệt thự", "system": "Civro Cách Nhiệt 86"},
        ]
    },
    "nhom-slim.html": {
        "brand_name": "Slim System",
        "brand_color": "#475569",
        "projects": [
            {"img": "assets/images/hero-interior.png",            "title": "Penthouse View Panorama Q.2","location": "TP. Hồ Chí Minh", "type": "Penthouse","system": "Slim Lùa Không Ray"},
            {"img": "assets/images/project-penthouse.png",        "title": "Sky Villa Landmark 81",     "location": "TP. Hồ Chí Minh", "type": "Penthouse","system": "Slim 10mm Frameless"},
            {"img": "assets/images/project-dalat-villa.png",      "title": "Villa Đà Lạt Tầm Nhìn Rộng","location": "Đà Lạt",          "type": "Resort",   "system": "Slim Lùa 3 Cánh"},
            {"img": "assets/images/project-resort-yacht.png",     "title": "Resort 5* Phú Quốc",        "location": "Phú Quốc",         "type": "Resort",   "system": "Slim Fold & Slide"},
            {"img": "assets/images/hero-doors.png",               "title": "Showroom Kiến Trúc Q.1",    "location": "TP. Hồ Chí Minh", "type": "Thương mại","system": "Slim 12mm Full-Height"},
        ]
    },
    "nhom-kogen.html": {
        "brand_name": "Kogen",
        "brand_color": "#0369a1",
        "projects": [
            {"img": "assets/images/project-villa.png",            "title": "Biệt Thự Cửa Xếp Gấp Q.7", "location": "TP. Hồ Chí Minh", "type": "Biệt thự", "system": "Kogen Bi-Fold 68"},
            {"img": "assets/images/project-penthouse.png",        "title": "Penthouse Cửa Trượt Lật",   "location": "TP. Hồ Chí Minh", "type": "Penthouse","system": "Kogen Tilt & Slide"},
            {"img": "assets/images/project-dalat-villa.png",      "title": "Villa Đà Lạt Cửa Gấp",     "location": "Đà Lạt",           "type": "Resort",   "system": "Kogen Bi-Fold 5 Cánh"},
            {"img": "assets/images/hero-interior.png",            "title": "Căn Hộ Cao Cấp Quận 2",    "location": "TP. Hồ Chí Minh",  "type": "Căn hộ",   "system": "Kogen Lùa Slim"},
        ]
    },
    "nhom-pma.html": {
        "brand_name": "PMA",
        "brand_color": "#15803d",
        "projects": [
            {"img": "assets/images/hero-doors.png",               "title": "Nhà Phố Quận Bình Thạnh",   "location": "TP. Hồ Chí Minh", "type": "Nhà phố",  "system": "PMA Classic 58 Mở Quay"},
            {"img": "assets/images/service-aluminum-doors.png",   "title": "Văn Phòng Khu CNC Quận 12", "location": "TP. Hồ Chí Minh", "type": "Văn phòng","system": "PMA Lux65 Cửa Lùa"},
            {"img": "assets/images/project-showroom-auto.png",    "title": "Showroom Kinh Doanh Q.Gò Vấp","location": "TP. Hồ Chí Minh","type": "Thương mại","system": "PMA Platinum XF"},
            {"img": "assets/images/project-villa.png",            "title": "Biệt Thự Quận 9",           "location": "TP. Hồ Chí Minh", "type": "Biệt thự", "system": "PMA Lux65 Vách Kính"},
            {"img": "assets/images/project-vinhomes-villa.png",   "title": "Nhà Phố Vinhomes",          "location": "TP. Hồ Chí Minh", "type": "Nhà phố",  "system": "PMA Classic 58 Lùa"},
        ]
    },
    "nhom-owin.html": {
        "brand_name": "Owin",
        "brand_color": "#4338ca",
        "projects": [
            {"img": "assets/images/hero-doors.png",               "title": "Nhà Phố Quận Tân Bình",     "location": "TP. Hồ Chí Minh", "type": "Nhà phố",  "system": "Owin 55 Mở Quay"},
            {"img": "assets/images/service-aluminum-doors.png",   "title": "Văn Phòng Bình Dương",      "location": "Bình Dương",       "type": "Văn phòng","system": "Owin 60 Cửa Lùa"},
            {"img": "assets/images/project-showroom-auto.png",    "title": "Cửa Hàng Quận 10",          "location": "TP. Hồ Chí Minh", "type": "Thương mại","system": "Owin 55 Kính Cường Lực"},
            {"img": "assets/images/project-villa.png",            "title": "Chung Cư Bình Tân",         "location": "TP. Hồ Chí Minh", "type": "Căn hộ",   "system": "Owin 55 Mở Quay"},
        ]
    },
    "nhom-topal.html": {
        "brand_name": "Topal",
        "brand_color": "#b91c1c",
        "projects": [
            {"img": "assets/images/hero-doors.png",               "title": "Nhà Phố Quận Gò Vấp",      "location": "TP. Hồ Chí Minh", "type": "Nhà phố",  "system": "Topal 55 Mở Quay"},
            {"img": "assets/images/service-aluminum-doors.png",   "title": "Trường Học Bình Chánh",     "location": "TP. Hồ Chí Minh", "type": "Công cộng","system": "Topal 60 Cửa Lùa"},
            {"img": "assets/images/project-showroom-auto.png",    "title": "Siêu Thị Quận Bình Dương",  "location": "Bình Dương",       "type": "Thương mại","system": "Topal 70 Mặt Dựng"},
            {"img": "assets/images/project-villa.png",            "title": "Biệt Thự Quận Thủ Đức",    "location": "TP. Hồ Chí Minh", "type": "Biệt thự", "system": "Topal Premium 65"},
            {"img": "assets/images/project-vinhomes-villa.png",   "title": "Nhà Phố Đồng Nai",         "location": "Đồng Nai",         "type": "Nhà phố",  "system": "Topal 55 Mở Quay"},
        ]
    },
}

# ──────────────────────────────────────────────────────────────
# HTML Gallery Section Template
# ──────────────────────────────────────────────────────────────
def build_gallery_html(brand_name, brand_color, projects):
    cards_html = ""
    for i, p in enumerate(projects):
        type_colors = {
            "Biệt thự": "#7c3aed", "Penthouse": "#0369a1", "Resort": "#059669",
            "Nhà phố": "#b45309", "Văn phòng": "#475569", "Thương mại": "#e11d48",
            "Căn hộ": "#0891b2", "Công cộng": "#6b7280"
        }
        tag_color = type_colors.get(p['type'], "#6b7280")
        cards_html += f"""
          <div class="sv-gal-card" data-type="{p['type']}" onclick="openLightbox({i})">
            <div class="sv-gal-img-wrap">
              <img src="{p['img']}" loading="lazy" decoding="async"
                   width="600" height="400"
                   alt="{p['title']} — {p['system']} | Sao Vàng"
                   style="width:100%;height:220px;object-fit:cover;display:block;">
              <div class="sv-gal-overlay">
                <span style="background:{tag_color};color:#fff;font-size:10px;font-weight:800;padding:3px 10px;border-radius:20px;text-transform:uppercase;">{p['type']}</span>
                <div style="margin-top:8px;font-size:13px;font-weight:700;color:#fff;">{p['system']}</div>
              </div>
            </div>
            <div class="sv-gal-info">
              <div style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:700;color:#1a2940;margin-bottom:4px;">{p['title']}</div>
              <div style="font-size:12px;color:#64748b;display:flex;align-items:center;gap:5px;">
                <i class="ri-map-pin-2-line"></i> {p['location']}
              </div>
            </div>
          </div>"""

    # Build lightbox data
    lb_data = "[" + ",".join([
        f'{{"img":"{p["img"]}","title":"{p["title"]}","location":"{p["location"]}","system":"{p["system"]}","type":"{p["type"]}"}}'
        for p in projects
    ]) + "]"

    type_filters = sorted(set(p['type'] for p in projects))
    filter_btns = '<button class="sv-gal-tab active" data-filter="all" onclick="filterGallery(this,\'all\')">Tất Cả</button>'
    for t in type_filters:
        filter_btns += f'<button class="sv-gal-tab" data-filter="{t}" onclick="filterGallery(this,\'{t}\')">{t}</button>'

    return f"""
    <!-- ══ GALLERY CÔNG TRÌNH THỰC TẾ ══════════════════════════════════ -->
    <section id="cong-trinh" style="background:#f8fafc;padding:70px 0 80px;border-top:1px solid #e2e8f0;">
      <div style="max-width:1280px;margin:0 auto;padding-inline:24px;">

        <!-- Header -->
        <div style="text-align:center;margin-bottom:40px;">
          <span style="display:inline-block;background:{brand_color};color:#fff;font-size:10px;font-weight:800;letter-spacing:.15em;padding:4px 14px;border-radius:20px;text-transform:uppercase;margin-bottom:12px;">CÔNG TRÌNH THỰC TẾ</span>
          <h2 style="font-family:'Montserrat',sans-serif;font-size:clamp(22px,3vw,32px);font-weight:900;color:#1a2940;margin:0 0 10px;">Dự Án Đã Thi Công — Nhôm {brand_name}</h2>
          <p style="font-size:14px;color:#64748b;max-width:520px;margin:0 auto;line-height:1.6;">Hình ảnh thực tế từ các công trình biệt thự, penthouse và nhà phố đã hoàn thành sử dụng hệ nhôm {brand_name}.</p>
        </div>

        <!-- Filter Tabs -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:32px;" id="galFilterBar">
          {filter_btns}
        </div>

        <!-- Gallery Grid -->
        <div id="galGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;">
          {cards_html}
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-top:48px;">
          <p style="font-size:14px;color:#64748b;margin-bottom:16px;">Bạn muốn công trình tương tự?</p>
          <a href="bao-gia.html" style="display:inline-flex;align-items:center;gap:8px;background:{brand_color};color:#fff;font-family:'Montserrat',sans-serif;font-size:14px;font-weight:800;padding:14px 32px;border-radius:50px;text-decoration:none;letter-spacing:.03em;transition:opacity .2s;" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
            <i class="ri-send-plane-line"></i> Nhận Báo Giá Miễn Phí
          </a>
        </div>
      </div>

      <!-- Lightbox -->
      <div id="galLightbox" onclick="closeLightbox()" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9999;align-items:center;justify-content:center;padding:20px;">
        <button onclick="closeLightbox()" style="position:absolute;top:20px;right:24px;background:none;border:none;color:#fff;font-size:32px;cursor:pointer;z-index:1;">&#x2715;</button>
        <button onclick="prevSlide(event)" style="position:absolute;left:20px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.1);border:none;color:#fff;font-size:28px;width:50px;height:50px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;">&#8249;</button>
        <button onclick="nextSlide(event)" style="position:absolute;right:20px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.1);border:none;color:#fff;font-size:28px;width:50px;height:50px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;">&#8250;</button>
        <div style="max-width:860px;width:100%;text-align:center;" onclick="event.stopPropagation()">
          <img id="lbImg" src="" alt="" style="width:100%;max-height:70vh;object-fit:contain;border-radius:12px;">
          <div style="margin-top:16px;">
            <div id="lbTitle" style="font-family:'Montserrat',sans-serif;font-size:18px;font-weight:800;color:#fff;margin-bottom:6px;"></div>
            <div id="lbSub" style="font-size:13px;color:rgba(255,255,255,.6);"></div>
          </div>
        </div>
      </div>
    </section>
    <!-- ══ END GALLERY ══ -->

    <style>
      .sv-gal-card {{border-radius:12px;overflow:hidden;background:#fff;border:1px solid #e2e8f0;cursor:pointer;transition:transform .3s,box-shadow .3s;}}
      .sv-gal-card:hover {{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.1);}}
      .sv-gal-img-wrap {{position:relative;overflow:hidden;}}
      .sv-gal-overlay {{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 50%);opacity:0;transition:opacity .3s;display:flex;flex-direction:column;justify-content:flex-end;padding:16px;}}
      .sv-gal-card:hover .sv-gal-overlay {{opacity:1;}}
      .sv-gal-info {{padding:14px 16px;}}
      .sv-gal-tab {{padding:7px 18px;border-radius:50px;font-size:12px;font-weight:700;cursor:pointer;border:2px solid #e2e8f0;background:#fff;color:#555;transition:all .2s;font-family:'Montserrat',sans-serif;}}
      .sv-gal-tab:hover,.sv-gal-tab.active {{background:{brand_color};border-color:{brand_color};color:#fff;}}
      #galLightbox.open {{display:flex!important;}}
    </style>

    <script>
      const _galData = {lb_data};
      let _galIdx = 0;
      function openLightbox(i) {{
        _galIdx = i; _renderLb();
        document.getElementById('galLightbox').classList.add('open');
        document.getElementById('galLightbox').style.display='flex';
      }}
      function closeLightbox() {{
        document.getElementById('galLightbox').classList.remove('open');
        document.getElementById('galLightbox').style.display='none';
      }}
      function _renderLb() {{
        const d = _galData[_galIdx];
        document.getElementById('lbImg').src = d.img;
        document.getElementById('lbImg').alt = d.title;
        document.getElementById('lbTitle').textContent = d.title;
        document.getElementById('lbSub').textContent = d.location + ' · ' + d.system;
      }}
      function prevSlide(e) {{ e.stopPropagation(); _galIdx=(_galIdx-1+_galData.length)%_galData.length; _renderLb(); }}
      function nextSlide(e) {{ e.stopPropagation(); _galIdx=(_galIdx+1)%_galData.length; _renderLb(); }}
      function filterGallery(btn, type) {{
        document.querySelectorAll('.sv-gal-tab').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.sv-gal-card').forEach(card=>{{
          card.style.display = (type==='all' || card.dataset.type===type) ? '' : 'none';
        }});
      }}
      document.addEventListener('keydown', e=>{{ if(e.key==='Escape') closeLightbox(); if(e.key==='ArrowLeft') prevSlide(e); if(e.key==='ArrowRight') nextSlide(e); }});
    </script>"""

# ──────────────────────────────────────────────────────────────
# Chèn gallery vào từng trang nhôm (trước thẻ <footer>)
# ──────────────────────────────────────────────────────────────
updated = 0
for page, data in BRAND_GALLERY.items():
    filepath = os.path.join(BASE_DIR, page)
    if not os.path.exists(filepath):
        print(f"  MISSING: {page}")
        continue

    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # Skip nếu đã có gallery
    if 'sv-gal-card' in content or 'GALLERY CÔNG TRÌNH' in content:
        print(f"  ✓ Already has gallery: {page}")
        continue

    gallery_html = build_gallery_html(data['brand_name'], data['brand_color'], data['projects'])

    # Chèn trước <footer
    if '<footer' in content:
        content = content.replace('<footer', gallery_html + '\n    <footer', 1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✅ Gallery added ({len(data['projects'])} projects): {page}")
        updated += 1
    else:
        print(f"  ⚠️  No <footer> found: {page}")

print(f"\nDone. Gallery added to {updated}/8 aluminum brand pages.")
