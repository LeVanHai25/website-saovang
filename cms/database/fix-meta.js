/**
 * Fix missing meta fields + update slugs for existing content
 */
const { initDb } = require('./db');

initDb().then(db => {
  const upsertMeta = db.prepare(`
    INSERT OR REPLACE INTO content_meta (content_id, field_key, field_value)
    VALUES (?, ?, ?)
  `);

  const fixes = [
    // id=5 Biệt Thự Đà Lạt
    { id: 5, slug: 'biet-thu-da-lat', category: 'Nhà ở & Biệt thự',
      meta: { client: 'Gia đình Nguyễn', project_value: '2.5 tỷ VNĐ', location: 'Đà Lạt, Lâm Đồng', year: '2024', area: '350m²', duration: '4 tháng',
              challenge: 'Địa hình dốc, vật liệu phải đặt hàng đặc biệt từ nước ngoài.',
              solution:  'Thiết kế kết cấu cầu thang xoắn ốc đặc biệt, lan can kính cường lực 12mm uốn cong theo địa hình.',
              result:    'Công trình hoàn thiện đúng tiến độ, được chủ đầu tư đánh giá 5 sao.' } },
    // id=6 Du Thuyền 28m Sao Biển
    { id: 6, slug: 'du-thuyen-28m-sao-bien', category: 'Du thuyền',
      meta: { client: 'Cty Du lịch Hạ Long', project_value: '18 tỷ VNĐ', location: 'Vịnh Hạ Long, Quảng Ninh', year: '2023', duration: '8 tháng',
              challenge: 'Tiêu chuẩn kỹ thuật hàng hải quốc tế, chịu được sóng gió cấp 8.',
              solution:  'Sử dụng inox marine 316L và thép hàng hải chuyên dụng, hàn TIG đạt chuẩn Lloyds.',
              result:    'Du thuyền đã hoàn thành 200+ chuyến vịnh Hạ Long, được báo chí quốc tế đánh giá cao.' } },
    // id=7 Inox 316L
    { id: 7, slug: 'inox-316l-marine-grade', category: 'Vật liệu hàng hải',
      meta: { brand: 'OUTOKUMPU', price: 'Liên hệ', unit: 'kg / tấm', in_stock: '1',
              specs: JSON.stringify({ 'Mác thép': '316L (18/10/2)', 'Thành phần Mo': '2.0 – 2.5%', 'Chống ăn mòn': 'Cấp độ cao (biển, hóa chất)', 'Nhiệt độ': '–200°C đến +800°C', 'Tiêu chuẩn': 'ASTM A240, EN 10088', 'Ứng dụng': 'Du thuyền, thiết bị hàng hải, y tế' }) } },
    // id=12 Penthouse Sky Garden
    { id: 12, slug: 'penthouse-sky-garden-ha-noi', category: 'Cầu thang & Lan can',
      meta: { client: 'Gia đình Trần', project_value: '850 triệu VNĐ', location: 'Hà Nội', year: '2024', area: '280m²', duration: '2 tháng' } },
    // id=13 Cổng Dinh Thự
    { id: 13, slug: 'cong-dinh-thu-co-dien-sai-gon', category: 'Cổng & Hàng rào',
      meta: { client: 'Gia đình Hoàng', project_value: '450 triệu VNĐ', location: 'TP. Hồ Chí Minh', year: '2023', duration: '6 tuần' } },
    // id=14 Du Thuyền Phú Quốc
    { id: 14, slug: 'du-thuyen-resort-phu-quoc', category: 'Du thuyền',
      meta: { client: 'Tập đoàn Sun Group', project_value: '24 tỷ VNĐ', location: 'Phú Quốc', year: '2024', duration: '12 tháng' } },
    // id=15 Vinhomes
    { id: 15, slug: 'biet-thu-vinhomes-grand-park', category: 'Nhà ở & Biệt thự',
      meta: { client: 'Gia đình Phạm', project_value: '3.2 tỷ VNĐ', location: 'TP. Hồ Chí Minh', year: '2024', area: '420m²', duration: '5 tháng' } },
  ];

  fixes.forEach(({ id, slug, category, meta }) => {
    // Update slug + category
    db.prepare('UPDATE content SET slug=?, category=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(slug, category, id);
    // Upsert meta
    if (meta) Object.entries(meta).forEach(([k, v]) => upsertMeta.run(id, k, v));
    console.log(`Fixed id=${id}: slug=${slug}`);
  });

  // Add Inox 304 product with proper fields
  const inox304 = db.prepare("SELECT id FROM content WHERE title LIKE '%Inox 304%'").get();
  if (inox304) {
    db.prepare("UPDATE content SET slug='inox-304-tam-ong', category='Vật liệu Inox' WHERE id=?").run(inox304.id);
    [
      ['brand', 'POSCO / TISCO'],
      ['price', 'Liên hệ'],
      ['unit', 'kg / tấm'],
      ['in_stock', '1'],
      ['specs', JSON.stringify({ 'Mác thép': '304 (18/8)', 'Độ dày tấm': '0.5 – 30mm', 'Khổ tấm': '1000×2000, 1220×2440mm', 'Đường kính ống': 'Ø10 – Ø800mm', 'Tiêu chuẩn': 'ASTM A240, AISI 304', 'Ứng dụng': 'Nội thất, lan can, thiết bị bếp' })],
    ].forEach(([k,v]) => upsertMeta.run(inox304.id, k, v));
    console.log(`Fixed Inox 304 id=${inox304.id}`);
  }

  db._persist();
  console.log('All fixes applied!');
  setTimeout(() => process.exit(0), 500);
}).catch(e => { console.error(e.message); process.exit(1); });
