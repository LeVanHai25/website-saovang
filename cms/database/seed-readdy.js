/**
 * Database seeder — aligned with Readdy.cc preview data
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt   = require('bcryptjs');
const { initDb } = require('./db');

async function seed() {
  console.log('🗃️  Initializing database with Readdy.cc aligned data...');
  const db = await initDb();

  // ── Admin user ──────────────────────────────────────────
  const email    = process.env.ADMIN_EMAIL    || 'admin@saovang.vn';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const hash     = bcrypt.hashSync(password, 10);

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (!existing) {
    db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'superadmin')")
      .run('Super Admin', email, hash);
    console.log(`✅ Admin: ${email} / ${password}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${email}`);
  }

  const editorExists = db.prepare('SELECT id FROM users WHERE email = ?').get('editor@saovang.vn');
  if (!editorExists) {
    db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'editor')")
      .run('Biên Tập Viên', 'editor@saovang.vn', bcrypt.hashSync('Editor@123', 10));
    console.log('✅ Editor: editor@saovang.vn / Editor@123');
  }

  const adminId = db.prepare('SELECT id FROM users WHERE email = ?').get(email)?.id;

  // ── Sample Categories ──────────────────────────────────────
  const categories = [
    // Project categories
    { name: 'Cơ khí nghệ thuật', slug: 'co-khi-nghe-thuat', content_type: 'project', color: '#8B0000' },
    { name: 'Cửa nhôm & Cửa sổ', slug: 'cua-nhom-cua-so', content_type: 'project', color: '#0d4e8a' },
    { name: 'Vách kính & Mặt dựng', slug: 'vach-kinh-mat-dung', content_type: 'project', color: '#1a3a5c' },
    { name: 'Cầu thang & Lan can', slug: 'cau-thang-lan-can', content_type: 'project', color: '#5b5b5b' },
    { name: 'Cổng & Hàng rào', slug: 'cong-hang-rao', content_type: 'project', color: '#2d5a27' },
    { name: 'Gia công du thuyền', slug: 'gia-cong-du-thuyen', content_type: 'project', color: '#c8860a' },
    
    // Product categories
    { name: 'Cửa nhôm định hình', slug: 'cua-nhom-dinh-hinh', content_type: 'product', color: '#0d4e8a' },
    { name: 'Kính cường lực & Phụ kiện', slug: 'kinh-cuong-luc', content_type: 'product', color: '#1a3a5c' },
    { name: 'Sắt mỹ thuật chế tác', slug: 'sat-my-thuat-che-tac', content_type: 'product', color: '#8B0000' },
    { name: 'Inox & Phụ kiện du thuyền', slug: 'inox-phu-kien-du-thuyen', content_type: 'product', color: '#c8860a' },
    
    // Article categories
    { name: 'Xu hướng kiến trúc', slug: 'xu-huong-kien-truc', content_type: 'article', color: '#c8860a' },
    { name: 'Kiến thức kỹ thuật', slug: 'kien-thuc-ky-thuat', content_type: 'article', color: '#1a3a5c' },
    { name: 'Tin tức Sao Vàng', slug: 'tin-tuc-sao-vang', content_type: 'article', color: '#2d5a27' }
  ];

  const insertCat = db.prepare('INSERT OR REPLACE INTO categories (name, slug, content_type, color) VALUES (?, ?, ?, ?)');
  for (const cat of categories) {
    insertCat.run(cat.name, cat.slug, cat.content_type, cat.color);
  }
  console.log(`✅ ${categories.length} categories seeded`);

  // Clear existing project and content entries to prevent duplicates and clean up database
  console.log('🧹 Cleaning existing content...');
  db.prepare("DELETE FROM content WHERE type = 'project'").run();

  // ── Sample Content ──────────────────────────────────────
  const items = [
    { type:'page',    title:'Trang Chủ',                  slug:'trang-chu',                  status:'published', category:'Trang',         excerpt:'Trang chủ website Cơ Khí & Nhôm Kính Sao Vàng' },
    { type:'page',    title:'Giới Thiệu',                 slug:'gioi-thieu',                 status:'published', category:'Trang',         excerpt:'Giới thiệu công ty Sao Vàng' },
    
    // Services
    { type:'service', title:'Cơ Khí Nghệ Thuật',          slug:'co-khi-nghe-thuat',          status:'published', category:'Dịch vụ',       excerpt:'Chế tác sắt nghệ thuật, hoa văn uốn mỹ thuật thủ công, mái kính nghệ thuật sang trọng cho biệt thự, lâu đài.', tags:'["cơ khí","nghệ thuật","sắt mỹ nghệ"]' },
    { type:'service', title:'Cửa Nhôm & Cửa Sổ',          slug:'cua-nhom-cua-so',            status:'published', category:'Dịch vụ',       excerpt:'Sản xuất & thi công cửa đi, cửa sổ nhôm kính cao cấp các hệ Xingfa Class A, Slim siêu mảnh, cửa trượt giảm chấn.', tags:'["cửa nhôm","cửa sổ","nhôm kính"]', is_featured:1 },
    { type:'service', title:'Vách Kính & Mặt Dựng',        slug:'vach-kinh-mat-dung',         status:'published', category:'Dịch vụ',       excerpt:'Hệ vách kính mặt dựng Unitized cản nhiệt Low-E, cabin kính phòng tắm và hệ vách ngăn kính cường lực văn phòng.', tags:'["vách kính","mặt dựng","kính cường lực"]', is_featured:1 },
    { type:'service', title:'Cầu Thang & Lan Can',        slug:'cau-thang-lan-can',          status:'published', category:'Dịch vụ',       excerpt:'Cầu thang xoắn kết cấu thép uốn nghệ thuật, lan can inox 316 mạ titan vàng gương, lan can kính chịu lực.', tags:'["cầu thang","lan can","titan"]' },
    { type:'service', title:'Cổng & Hàng Rào',            slug:'cong-hang-rao',              status:'published', category:'Dịch vụ',       excerpt:'Cổng nhôm đúc nguyên tấm tinh xảo, hàng rào sắt rèn mỹ thuật mạ kẽm nóng sơn tĩnh điện bền bỉ ngoài trời.', tags:'["cổng nhôm đúc","hàng rào","sắt rèn"]' },
    { type:'service', title:'Bảo Trì & Dịch Vụ',          slug:'bao-tri-dich-vu',            status:'published', category:'Dịch vụ',       excerpt:'Bảo trì hệ thống cửa nhôm kính, thay thế phụ kiện chính hãng, xử lý chống thấm dột vách kính, đánh bóng inox du thuyền.', tags:'["bảo trì","phụ kiện","sửa chữa"]' },
    
    // Aligned 6 Projects from Readdy
    {
      type:'project',
      title:'Biệt Thự Nghỉ Dưỡng Đà Lạt',
      slug:'biet-thu-nghi-duong-da-lat',
      status:'published',
      category:'Cửa nhôm & Cửa sổ',
      excerpt:'Công trình biệt thự cao cấp sử dụng hệ thống cửa nhôm kính cách âm cách nhiệt Low-E cản nhiệt vượt trội kết hợp lan can kính.',
      is_featured:1,
      client:'Gia đình Ông Nguyễn Văn Thành',
      project_value:'2.500.000.000 VNĐ',
      location:'Phường 10, Thành phố Đà Lạt, Lâm Đồng',
      year:'2024',
      area:'Diện tích sàn 350m2, 120m2 cửa kính',
      duration:'4 tháng',
      challenge:'Địa hình đồi dốc phức tạp, sức gió giật lớn vào mùa mưa bão đòi hỏi giải pháp cửa có tính kín khít và chịu tải cao.',
      solution:'Ứng dụng hệ nhôm Xingfa Class A nhập khẩu, kính hộp Low-E 5-9-5mm và phụ kiện Cogo cao cấp đồng bộ.',
      result:'Biệt thự hoàn thiện với góc nhìn toàn cảnh đồi thông cực kỳ thoáng đãng, cách âm tốt và cản nhiệt tối ưu.',
      gallery:'["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"]',
      thumbnail:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    },
    {
      type:'project',
      title:'Du Thuyền Cao Cấp 28m',
      slug:'du-thuyen-cao-cap-28m',
      status:'published',
      category:'Gia công du thuyền',
      excerpt:'Chế tác toàn bộ hệ thống lan can boong tàu, khung kết cấu chịu lực và chi tiết trang trí inox Marine hàng hải 316L đánh bóng gương.',
      is_featured:1,
      client:'Công ty Cổ phần Du lịch Hạ Long Luxury',
      project_value:'18.000.000.000 VNĐ',
      location:'Cảng tàu khách quốc tế Tuần Châu, Quảng Ninh',
      year:'2024',
      area:'Chiều dài boong tàu 28m, lan can 76m',
      duration:'8 tháng',
      challenge:'Môi trường biển mặn ăn mòn cực cao, các mối hàn inox phải đạt độ ngấu tuyệt đối không rỗ khí và xử lý bề mặt nhẵn mịn chống bám muối.',
      solution:'Sử dụng inox 316L tiêu chuẩn hàng hải châu Âu, hàn Argon kỹ thuật cao và đánh bóng gương cấp độ 800-grit.',
      result:'Hạng mục cơ khí du thuyền đạt tiêu chuẩn đăng kiểm quốc tế Lloyds, sáng bóng sang trọng và bền bỉ tuyệt đối trước gió muối.',
      gallery:'["https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80"]',
      thumbnail:'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80'
    },
    {
      type:'project',
      title:'Penthouse Hà Nội',
      slug:'penthouse-ha-noi',
      status:'published',
      category:'Cầu thang & Lan can',
      excerpt:'Thiết kế và chế tác nghệ thuật cầu thang xoắn ốc kết cấu thép uốn CNC kết hợp lan can kính cường lực âm sàn sang trọng.',
      is_featured:1,
      client:'Gia đình Bà Trần Thị Thu Hương',
      project_value:'850.000.000 VNĐ',
      location:'Khu đô thị Vinhomes Metropolis, Ba Đình, Hà Nội',
      year:'2024',
      area:'Chiều cao thông tầng 4.5m',
      duration:'45 ngày',
      challenge:'Khối lượng kết cấu lớn, không gian vận chuyển lên tầng cao 32 cực kỳ hạn chế, yêu cầu thi công an toàn tuyệt đối.',
      solution:'Bóc tách thiết kế dạng module lắp ráp thông minh, vận chuyển bằng cẩu chuyên dụng và hàn lắp ráp giấu mối tại thực địa.',
      result:'Trở thành điểm nhấn kiến trúc xa hoa nhất của căn hộ Penthouse, mang lại sự hài lòng tuyệt đối cho chủ đầu tư.',
      gallery:'["https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80"]',
      thumbnail:'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80'
    },
    {
      type:'project',
      title:'Du Thuyền Nội Thất Gỗ & Inox',
      slug:'du-thuyen-noi-that-go-inox',
      status:'published',
      category:'Gia công du thuyền',
      excerpt:'Gia công các chi tiết inox trang trí nghệ thuật boong tàu, phòng cabin chính và đồ nội thất kim loại kết hợp gỗ teak cao cấp.',
      is_featured:1,
      client:'Hãng đóng tàu Marina Yacht Club',
      project_value:'1.100.000.000 VNĐ',
      location:'Cảng du thuyền Ana Marina, Nha Trang, Khánh Hòa',
      year:'2022',
      area:'Trang bị trọn gói nội thất 6 cabin cao cấp',
      duration:'3 tháng',
      challenge:'Các góc boong uốn cong đa chiều phức tạp, yêu cầu gia công cơ khí uốn cong đạt độ khớp khít với mép gỗ teak tự nhiên.',
      solution:'Đo đạc dựng hình bằng thiết bị quét 3D laser và gia công cắt uốn CNC siêu chính xác tại xưởng.',
      result:'Phần nội thất du thuyền đạt độ thẩm mỹ tinh xảo như tác phẩm nghệ thuật thủ công siêu sang.',
      gallery:'["https://images.unsplash.com/photo-1520923642038-b4259acecbd7?auto=format&fit=crop&w=1200&q=80"]',
      thumbnail:'https://images.unsplash.com/photo-1520923642038-b4259acecbd7?auto=format&fit=crop&w=800&q=80'
    },
    {
      type:'project',
      title:'Cổng & Hàng Rào Biệt Thự',
      slug:'cong-hang-rao-biet-thu',
      status:'published',
      category:'Cổng & Hàng rào',
      excerpt:'Hạng mục cổng hợp kim nhôm đúc chân không nguyên khối và hàng rào sắt rèn mỹ thuật mạ kẽm sơn tĩnh điện cao cấp.',
      is_featured:1,
      client:'Gia đình Ông Phạm Quốc Bảo',
      project_value:'320.000.000 VNĐ',
      location:'Khu biệt thự Vinhomes Grand Park, Quận 9, TP.HCM',
      year:'2023',
      area:'Cổng chính rộng 4.2m cao 3.2m, rào sắt 32m',
      duration:'35 ngày',
      challenge:'Yêu cầu hoa văn đúc nổi cổ điển châu Âu cực kỳ chi tiết, nước sơn phải chịu đựng được nắng mưa không bong tróc oxy hóa.',
      solution:'Áp dụng công nghệ đúc chân không Nhật Bản, sơn tĩnh điện ngoài trời 4 lớp chống tia UV chuyên dụng.',
      result:'Khung cảnh mặt tiền dinh thự uy nghi, tráng lệ, thể hiện vị thế và thẩm mỹ đẳng cấp của gia chủ.',
      gallery:'["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80"]',
      thumbnail:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'
    },
    {
      type:'project',
      title:'Khung Thép Nhà Phố 5 Tầng',
      slug:'khung-thep-nha-pho-5-tang',
      status:'published',
      category:'Cơ khí nghệ thuật',
      excerpt:'Thi công kết cấu khung thép tiền chế chịu lực chịu tải cao kết hợp tấm sàn bê tông nhẹ cho công trình nhà phố hiện đại.',
      is_featured:1,
      client:'Gia đình Anh Lê Minh Luận',
      project_value:'1.800.000.000 VNĐ',
      location:'Phường Thảo Điền, Quận 2, TP. Hồ Chí Minh',
      year:'2023',
      area:'Tổng diện tích sàn thi công 450m2',
      duration:'50 ngày',
      challenge:'Nền đất yếu đặc thù ven sông Thảo Điền đòi hỏi kết cấu công trình phải giảm nhẹ tải trọng móng tối đa mà vẫn chịu lực vững vàng.',
      solution:'Thiết kế kết cấu thép hình chữ I đúc cường độ cao, liên kết bulông neo cường độ cao mạ kẽm và sàn bê tông nhẹ ALC.',
      result:'Giảm 45% trọng lượng công trình, tiến độ thi công rút ngắn một nửa so với xây bê tông truyền thống, đạt độ ổn định vững chãi.',
      gallery:'["https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"]',
      thumbnail:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
    },
    
    // Products (Preserve existing high-quality items)
    { type:'product', title:'Cửa nhôm Xingfa Class A nhập khẩu',    slug:'cua-nhom-xingfa-class-a',    status:'published', category:'Cửa nhôm định hình', excerpt:'Nhôm định hình hệ cao cấp phủ PVDF kháng muối biển, phụ kiện Cogo/Hafele đồng bộ.', thumbnail:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80' },
    { type:'product', title:'Cửa trượt Slim profile siêu mảnh',    slug:'cua-truot-slim-profile',     status:'published', category:'Cửa nhôm định hình', excerpt:'Hệ cửa trượt khung nhôm siêu nhỏ gọn mang lại góc nhìn panorama tối đa, vận hành êm ái.', thumbnail:'/assets/images/product-glass.png' },
    { type:'product', title:'Vách mặt dựng Unitized cản nhiệt',   slug:'vach-mat-dung-unitized',      status:'published', category:'Kính cường lực & Phụ kiện', excerpt:'Vách kính mặt ngoài tòa nhà hệ Unitized, kính Low-E phản quang cách nhiệt cách âm vượt trội.', thumbnail:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },
    { type:'product', title:'Cổng nhôm đúc chân không hoàng gia', slug:'cong-nhom-duc-hoang-gia',     status:'published', category:'Sắt mỹ thuật chế tác', excerpt:'Đúc chân không nguyên khối hợp kim nhôm, sơn phủ đồng cổ sang trọng chống chịu thời tiết.', thumbnail:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
    { type:'product', title:'Cầu thang xoắn lốc uốn nghệ thuật', slug:'cau-thang-xoan-uon-my-thuat',  status:'published', category:'Sắt mỹ thuật chế tác', excerpt:'Cầu thang kết cấu thép uốn nghệ thuật, tay vịn bọc đồng hoặc mạ vàng titan đẳng cấp.', thumbnail:'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80' },
    { type:'product', title:'Lan can kính cường lực pad âm sàn',   slug:'lan-can-kinh-pad-am',         status:'published', category:'Kính cường lực & Phụ kiện', excerpt:'Lan can kính không tay vịn sử dụng pad inox 304 bắt âm sàn, kính dán 2 lớp cường lực 15.38mm.', thumbnail:'/assets/images/product-railing.png' },
    { type:'product', title:'Ống inox & Phụ kiện Marine 316L',    slug:'inox-marine-316l',            status:'published', category:'Inox & Phụ kiện du thuyền', excerpt:'Ống inox 316L chống ăn mòn lỗ trong môi trường nước biển, bề mặt bóng gương tinh xảo.', thumbnail:'/assets/images/product-inox-pipe.png' },
    
    // Articles (Preserve existing high-quality articles)
    { type:'article', title:'Xu hướng sử dụng nhôm kính kiến trúc 2026', slug:'xu-huong-nhom-kinh-2026', status:'published', category:'Xu hướng kiến trúc', excerpt:'Tổng hợp các xu hướng thiết kế vách kính tràn viền và nhôm slim hiện đại.' },
    { type:'article', title:'Tại sao Inox 316L lại bắt buộc cho du thuyền?',  slug:'tai-sao-inox-316l-du-thuyen', status:'published', category:'Kiến thức kỹ thuật', excerpt:'Phân tích khoa học sự kết hợp hoàn hảo giữa thẩm mỹ bóng bẩy và khả năng kháng nước biển mặn ăn mòn lỗ.' },
    { type:'article', title:'Sao Vàng bàn giao tổ hợp nhôm kính đảo Vinhomes', slug:'ban-giao-to-hop-nhom-kinh', status:'published', category:'Tin tức Sao Vàng', excerpt:'Bàn giao thành công gói thầu hơn 10 tỷ đồng nhôm kính cao cấp biệt thự sinh thái cao cấp.' }
  ];

  const insert = db.prepare(`
    INSERT OR REPLACE INTO content
      (type, title, slug, status, author_id, category, excerpt, tags, is_featured, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMeta = db.prepare(`
    INSERT OR REPLACE INTO content_meta (content_id, field_key, field_value, field_type)
    VALUES (?, ?, ?, 'text')
  `);

  for (const c of items) {
    const res = insert.run(
      c.type, c.title, c.slug, c.status, adminId,
      c.category || null, c.excerpt || null,
      c.tags || null, c.is_featured || 0,
      c.status === 'published' ? new Date().toISOString() : null
    );

    const contentId = res.lastInsertRowid;

    // Seed project metadata
    if (c.type === 'project' && contentId) {
      if (c.client)        insertMeta.run(contentId, 'client', c.client);
      if (c.project_value) insertMeta.run(contentId, 'project_value', c.project_value);
      if (c.location)      insertMeta.run(contentId, 'location', c.location);
      if (c.year)          insertMeta.run(contentId, 'year', c.year);
      if (c.area)          insertMeta.run(contentId, 'area', c.area);
      if (c.duration)      insertMeta.run(contentId, 'duration', c.duration);
      if (c.challenge)     insertMeta.run(contentId, 'challenge', c.challenge);
      if (c.solution)      insertMeta.run(contentId, 'solution', c.solution);
      if (c.result)        insertMeta.run(contentId, 'result', c.result);
      if (c.gallery)       insertMeta.run(contentId, 'gallery', c.gallery);
    }
  }

  db._persist();
  console.log(`✅ ${items.length} content items and metadata successfully seeded in db.sqlite`);
}

seed().then(() => {
  console.log('Seeder finished.');
  process.exit(0);
}).catch(err => {
  console.error('Seeder failed:', err);
  process.exit(1);
});
