/**
 * Seed rich sample data — projects + products with proper slugs, excerpts, meta fields
 */
const { initDb } = require('./db');

initDb().then(db => {
  // ── Content meta helper ──────────────────────────────────
  const upsertMeta = db.prepare(`
    INSERT OR REPLACE INTO content_meta (content_id, field_key, field_value)
    VALUES (?, ?, ?)
  `);

  // ── Helper: update slug/category on existing content ────
  function updateContent(title, patch) {
    const row = db.prepare("SELECT id FROM content WHERE title = ?").get(title);
    if (!row) return null;
    const sets = Object.keys(patch).map(k => `${k}=?`).join(',');
    db.prepare(`UPDATE content SET ${sets}, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .run(...Object.values(patch), row.id);
    return row.id;
  }

  // ── Update existing projects with proper slugs ───────────
  const projectUpdates = [
    {
      title: 'Biệt Thự Nghỉ Dưỡng Đà Lạt',
      patch: { slug: 'biet-thu-nghi-duong-da-lat', category: 'Nhà ở & Biệt thự' },
      meta:  { client: 'Gia đình Nguyễn', project_value: '2.5 tỷ VNĐ', location: 'Đà Lạt, Lâm Đồng', year: '2024', area: '350m²', duration: '4 tháng', challenge: 'Địa hình dốc, vật liệu phải đặt hàng đặc biệt từ nước ngoài.', solution: 'Thiết kế kết cấu cầu thang xoắn ốc đặc biệt, lan can kính cường lực 12mm uốn cong theo địa hình.', result: 'Công trình hoàn thiện đúng tiến độ, được chủ đầu tư đánh giá 5 sao.' },
    },
    {
      title: 'Du Thuyền Cao Cấp 28m "Sao Biển"',
      patch: { slug: 'du-thuyen-cao-cap-28m-sao-bien', category: 'Du thuyền' },
      meta:  { client: 'Cty Du lịch Ha Long', project_value: '18 tỷ VNĐ', location: 'Vịnh Hạ Long, Quảng Ninh', year: '2024', duration: '8 tháng', challenge: 'Tiêu chuẩn kỹ thuật hàng hải quốc tế, chịu được sóng gió cấp 8.', solution: 'Sử dụng inox marine 316L và thép hàng hải chuyên dụng, hàn TIG đạt chuẩn Lloyds.', result: 'Du thuyền đã hoàn thành 200+ chuyến vịnh Hạ Long, được báo chí quốc tế đánh giá cao.' },
    },
  ];

  projectUpdates.forEach(({ title, patch, meta }) => {
    const id = updateContent(title, patch);
    if (id && meta) Object.entries(meta).forEach(([k, v]) => upsertMeta.run(id, k, v));
  });

  // ── Create new rich project entries ────────────────────
  const insertContent = db.prepare(`
    INSERT OR IGNORE INTO content
    (type, title, slug, excerpt, category, status, is_featured, published_at, author_id)
    VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?)
  `);

  const newProjects = [
    {
      type: 'project', title: 'Penthouse Tòa Sky Garden Hà Nội', slug: 'penthouse-sky-garden-ha-noi',
      excerpt: 'Thiết kế và lắp đặt cầu thang inox 316 kết hợp lan can kính cường lực 12mm cho penthouse 2 tầng tại Hà Nội, đạt chuẩn châu Âu.',
      category: 'Cầu thang & Lan can', featured: 1,
      meta: { client: 'Gia đình Trần', project_value: '850 triệu VNĐ', location: 'Hà Nội', year: '2024', area: '280m²', duration: '2 tháng' },
    },
    {
      type: 'project', title: 'Cổng Dinh Thự Cổ Điển Sài Gòn', slug: 'cong-dinh-thu-co-dien-sai-gon',
      excerpt: 'Cổng sắt rèn nghệ thuật, hàng rào nhôm đúc cổ điển cho dinh thự tư nhân — thiết kế độc bản, hoàn toàn thủ công.',
      category: 'Cổng & Hàng rào', featured: 0,
      meta: { client: 'Gia đình Hoàng', project_value: '450 triệu VNĐ', location: 'TP. Hồ Chí Minh', year: '2024', duration: '6 tuần' },
    },
    {
      type: 'project', title: 'Du Thuyền Resort 5 Sao Phú Quốc', slug: 'du-thuyen-resort-phu-quoc',
      excerpt: 'Thi công kết cấu cơ khí 12 cabin hạng sang theo tiêu chuẩn 5 sao quốc tế cho tập đoàn resort cao cấp tại Phú Quốc.',
      category: 'Du thuyền', featured: 1,
      meta: { client: 'Tập đoàn Sun Group', project_value: '24 tỷ VNĐ', location: 'Phú Quốc, Kiên Giang', year: '2024', duration: '12 tháng' },
    },
    {
      type: 'project', title: 'Biệt Thự Vinhomes Grand Park', slug: 'biet-thu-vinhomes-grand-park',
      excerpt: 'Hệ thống cầu thang, lan can, cổng và toàn bộ cơ khí nội ngoại thất cho biệt thự đơn lập cao cấp Vinhomes Grand Park.',
      category: 'Nhà ở & Biệt thự', featured: 0,
      meta: { client: 'Gia đình Phạm', project_value: '3.2 tỷ VNĐ', location: 'TP. Hồ Chí Minh', year: '2024', area: '420m²', duration: '5 tháng' },
    },
  ];

  newProjects.forEach(({ type, title, slug, excerpt, category, featured, meta }) => {
    const { lastInsertRowid } = insertContent.run(type, title, slug, excerpt, category, 'published', featured, 1);
    if (lastInsertRowid && meta) Object.entries(meta).forEach(([k, v]) => upsertMeta.run(lastInsertRowid, k, v));
  });

  // ── Update existing products with proper slugs ──────────
  const productUpdates = [
    {
      title: 'Inox 304 Tấm & Ống',
      patch: { slug: 'inox-304-tam-ong', category: 'Vật liệu Inox' },
      meta:  { brand: 'POSCO / TISCO', price: 'Liên hệ', unit: 'tấn/kg/m', in_stock: '1',
               specs: JSON.stringify({ 'Mác thép': '304 (18/8)', 'Độ dày tấm': '0.5 - 30mm', 'Khổ tấm': '1000x2000, 1220x2440mm', 'Đường kính ống': 'Ø10 - Ø800mm', 'Tiêu chuẩn': 'ASTM A240, AISI 304', 'Ứng dụng': 'Nội thất, lan can, thiết bị bếp' }) },
    },
    {
      title: 'Inox 316L Marine Grade',
      patch: { slug: 'inox-316l-marine-grade', category: 'Vật liệu hàng hải' },
      meta:  { brand: 'OUTOKUMPU', price: 'Liên hệ', unit: 'tấn/kg', in_stock: '1',
               specs: JSON.stringify({ 'Mác thép': '316L (18/10/2)', 'Thành phần Mo': '2.0 - 2.5%', 'Khả năng chống ăn mòn': 'Cấp độ cao (biển, hóa chất)', 'Nhiệt độ làm việc': '-200°C đến +800°C', 'Tiêu chuẩn': 'ASTM A240, EN 10088', 'Ứng dụng': 'Du thuyền, thiết bị hàng hải, y tế' }) },
    },
  ];

  productUpdates.forEach(({ title, patch, meta }) => {
    const id = updateContent(title, patch);
    if (id && meta) Object.entries(meta).forEach(([k, v]) => upsertMeta.run(id, k, v));
  });

  // ── New product entries ─────────────────────────────────
  const newProducts = [
    {
      title: 'Kính Cường Lực Tempered 10mm', slug: 'kinh-cuong-luc-tempered-10mm',
      excerpt: 'Kính cường lực đơn lớp 10mm, xử lý nhiệt theo tiêu chuẩn EN 12150, chịu lực gấp 5 lần kính thường.',
      category: 'Kính & Phụ kiện', featured: 0,
      meta: { brand: 'Guardian / AGC', price: 'Liên hệ', unit: 'm²', in_stock: '1',
              specs: JSON.stringify({ 'Độ dày': '8mm, 10mm, 12mm, 15mm, 19mm', 'Kích thước tối đa': '2440 x 4200mm', 'Tiêu chuẩn': 'EN 12150, ANSI Z97.1', 'Cường độ uốn vỡ': '>120 MPa', 'Ứng dụng': 'Lan can, vách ngăn, cửa, mái' }) },
    },
    {
      title: 'Phụ Kiện Lan Can Inox', slug: 'phu-kien-lan-can-inox',
      excerpt: 'Bộ phụ kiện lan can inox 304: chân đứng, kẹp kính, cầu nối, tay vịn ống — đồng bộ hệ thống, lắp ráp nhanh.',
      category: 'Kính & Phụ kiện', featured: 0,
      meta: { brand: 'SAO VÀNG', price: 'Liên hệ', unit: 'bộ/cái', in_stock: '1',
              specs: JSON.stringify({ 'Vật liệu': 'Inox 304, 316L', 'Hoàn thiện bề mặt': 'Đánh bóng gương, nhám mờ', 'Tải trọng thiết kế': '1.0 kN/m theo TCVN', 'Đường kính ống tay vịn': 'Ø38, Ø42.4, Ø50.8mm', 'Chứng nhận': 'ISO 9001:2015' }) },
    },
    {
      title: 'Thép Hộp Mạ Kẽm Kết Cấu', slug: 'thep-hop-ma-kem-ket-cau',
      excerpt: 'Thép hộp mạ kẽm nhúng nóng dùng cho khung kết cấu, khung mái, hàng rào — bảo vệ chống gỉ sét dài hạn 20+ năm.',
      category: 'Thép kết cấu', featured: 0,
      meta: { brand: 'Hòa Phát / POSCO', price: 'Liên hệ', unit: 'kg/m/thanh', in_stock: '1',
              specs: JSON.stringify({ 'Kích thước': '20x20 đến 200x200mm', 'Chiều dày thành': '1.5 - 8mm', 'Chiều dài thanh': '6m tiêu chuẩn', 'Lớp mạ kẽm': '80 - 120 g/m²', 'Tiêu chuẩn': 'TCVN 7470, EN 10219' }) },
    },
  ];

  newProducts.forEach(({ title, slug, excerpt, category, featured, meta }) => {
    const { lastInsertRowid } = insertContent.run('product', title, slug, excerpt, category, 'published', featured || 0, 1);
    if (lastInsertRowid && meta) Object.entries(meta).forEach(([k, v]) => upsertMeta.run(lastInsertRowid, k, v));
  });

  db._persist();
  console.log('Rich data seeded OK!');
  setTimeout(() => process.exit(0), 600);
}).catch(e => { console.error(e.message); process.exit(1); });
