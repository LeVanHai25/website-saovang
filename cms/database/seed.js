/**
 * Database seeder — admin user + sample content
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt   = require('bcryptjs');
const { initDb } = require('./db');
const { seedDaiphucProducts } = require('./seed-daiphuc-products');

async function seed() {
  console.log('🗃️  Initializing database...');
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
    
    // Projects (Cơ khí & Nhôm kính)
    {
      type:'project',
      title:'Cầu thang xoắn nghệ thuật Penthouse Ciputra',
      slug:'cau-thang-xoan-ciputra',
      status:'published',
      category:'Cầu thang & Lan can',
      excerpt:'Tác phẩm cầu thang xoắn ốc kết cấu thép uốn mỹ thuật sơn tĩnh điện kết hợp tay vịn inox mạ vàng sang trọng.',
      is_featured:1,
      client:'Anh Hoàng Nam (Ciputra Hà Nội)',
      project_value:'850.000.000 VNĐ',
      location:'KĐT Ciputra, Tây Hồ, Hà Nội',
      year:'2025',
      area:'Chiều cao thông tầng 4.2m',
      duration:'45 ngày',
      challenge:'Uốn cong thép tấm dày 12mm với độ chính xác cao và xử lý bề mặt sơn tĩnh điện mạ vàng gương hoàn hảo không tì vết.',
      solution:'Ứng dụng công nghệ lốc ống CNC hiện đại và hoàn thiện phủ gương titan chịu lực cao chuyên dụng.',
      result:'Điểm nhấn nghệ thuật xa hoa trung tâm căn Penthouse, nhận được sự hài lòng tuyệt đối từ gia chủ.',
      gallery:'["https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80"]',
      thumbnail:'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80'
    },
    {
      type:'project',
      title:'Biệt thự tân cổ điển Chateau Phú Mỹ Hưng',
      slug:'biet-thu-chateau-phu-my-hung',
      status:'published',
      category:'Cổng & Hàng rào',
      excerpt:'Hạng mục cổng nhôm đúc chân không nguyên khối và hàng rào sắt mỹ nghệ uốn thủ công tinh xảo sơn phủ đồng giả cổ.',
      is_featured:1,
      client:'Chú Minh Quang (Phú Mỹ Hưng, Q.7)',
      project_value:'2.100.000.000 VNĐ',
      location:'Khu biệt thự lâu đài Chateau, Quận 7, TP.HCM',
      year:'2026',
      area:'Mặt tiền 24m, cổng chính cao 3.8m',
      duration:'60 ngày',
      challenge:'Yêu cầu hoa văn đúc nổi 3D sắc nét, không bọt khí và lớp sơn giả cổ có khả năng kháng tia cực tím cực tốt dưới thời tiết nắng nóng miền Nam.',
      solution:'Sử dụng công nghệ đúc chân không Nhật Bản, sơn phủ bảo vệ 4 lớp PVDF độc quyền chống bạc màu.',
      result:'Cổng và hàng rào uy nghi, sang trọng, thể hiện đẳng cấp hoàng gia của chủ nhân dinh thự.',
      gallery:'["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?auto=format&fit=crop&w=1200&q=80"]',
      thumbnail:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    },
    {
      type:'project',
      title:'Hệ thống vách kính mặt dựng Unitized toà nhà Techcombank',
      slug:'vach-kinh-techcombank',
      status:'published',
      category:'Vách kính & Mặt dựng',
      excerpt:'Thiết kế lắp đặt hệ vách kính dựng Unitized khổ lớn sử dụng nhôm hệ nhập khẩu và kính hộp Low-E cản nhiệt vượt trội.',
      is_featured:1,
      client:'Tập đoàn Techcombank (Hà Nội)',
      project_value:'5.200.000.000 VNĐ',
      location:'Quận Hai Bà Trưng, Hà Nội',
      year:'2026',
      area:'1.200 m2 bề mặt ngoài',
      duration:'90 ngày',
      challenge:'Thi công trên độ cao lớn, đòi hỏi nghiêm ngặt về độ phẳng, chống rung chấn và cách âm cách nhiệt tiêu chuẩn cao.',
      solution:'Sử dụng hệ vách dựng Unitized lắp ghép sẵn tại xưởng và cẩu lắp ráp module tiêu chuẩn châu Âu, kết hợp keo structural silicone chuyên dụng.',
      result:'Diện mạo toà nhà cực kỳ hiện đại, phản quang cao cấp, tiết kiệm 35% điện năng điều hòa.',
      gallery:'["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"]',
      thumbnail:'/assets/images/product-glass.png'
    },
    {
      type:'project',
      title:'Cửa nhôm Xingfa Class A dinh thự Starlake Tây Hồ',
      slug:'cua-nhom-starlake',
      status:'published',
      category:'Cửa nhôm & Cửa sổ',
      excerpt:'Hệ thống cửa sổ và cửa đi trượt nâng nhôm Xingfa Class A cao cấp tích hợp phụ kiện Cogo đồng bộ.',
      is_featured:1,
      client:'Chị Thu Hà (Starlake Tây Hồ Tây)',
      project_value:'1.400.000.000 VNĐ',
      location:'KĐT Tây Hồ Tây, Hà Nội',
      year:'2025',
      area:'350 m2 diện tích cửa',
      duration:'25 ngày',
      challenge:'Cần độ khít kín tuyệt đối chống nước mưa tạt trực tiếp và chịu sức gió giật mạnh vào mùa bão.',
      solution:'Tích hợp gioăng EPDM 3 lớp chất lượng cao kết hợp khóa đa điểm an toàn tuyệt đối.',
      result:'Biệt thự cực sang trọng, vận hành trượt êm ái nhẹ nhàng và hoàn toàn cách âm biệt lập.',
      gallery:'["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"]',
      thumbnail:'/assets/images/project-villa.png'
    },
    {
      type:'project',
      title:'Mái che kính nghệ thuật uốn mỹ thuật Vinhomes Riverside',
      slug:'mai-che-kinh-vinhomes-riverside',
      status:'published',
      category:'Cơ khí nghệ thuật',
      excerpt:'Thiết kế & thi công trọn gói hệ thống mái che kính cường lực kết cấu sắt nghệ thuật uốn cong cổ điển và hàng rào bao quanh.',
      is_featured:0,
      client:'Anh Lâm Tấn (Vinhomes Riverside)',
      project_value:'950.000.000 VNĐ',
      location:'Bằng Lăng, Vinhomes Riverside, Long Biên, Hà Nội',
      year:'2025',
      area:'Diện tích mái kính 80m2, lan can rào 45m',
      duration:'35 ngày',
      challenge:'Kết cấu hoa văn uốn rèn tay yêu cầu tính đối xứng hoàn hảo và kết nối chịu lực an toàn giữa khung sắt nghệ thuật uốn cong và hệ kính cường lực 12mm.',
      solution:'Gia công rèn nguội thủ công kết hợp kỹ thuật liên kết giấu mối hàn thẩm mỹ cao.',
      result:'Mái che kính đón sáng tuyệt đẹp, gia tăng vẻ quý phái và lãng mạn cho khuôn viên dinh thự.',
      gallery:'["https://images.unsplash.com/photo-1549294413-26f195afcbdb?auto=format&fit=crop&w=1200&q=80"]',
      thumbnail:'https://images.unsplash.com/photo-1549294413-26f195afcbdb?auto=format&fit=crop&w=800&q=80'
    },
    {
      type:'project',
      title:'Siêu du thuyền Horizon 32m - Lan can Inox Marine 316L',
      slug:'du-thuyen-horizon-lan-can-316l',
      status:'published',
      category:'Gia công du thuyền',
      excerpt:'Chế tác và lắp đặt hoàn chỉnh hệ lan can boong tàu chịu mặn vượt trội bằng thép không gỉ 316L đánh bóng hairline.',
      is_featured:0,
      client:'Hãng đóng tàu Horizon (Hạ Long)',
      project_value:'1.100.000.000 VNĐ',
      location:'Bến cảng Tuần Châu, Quảng Ninh',
      year:'2025',
      area:'Chiều dài lan can 72m',
      duration:'30 ngày',
      challenge:'Kháng muối biển ăn mòn cao, các mối hàn phải được mài phẳng mịn tuyệt đối tránh đọng muối và trầy xước.',
      solution:'Hàn khí Argon bảo vệ, mài bóng cấp độ gương gương 800-grit chuyên dụng hàng hải.',
      result:'Hệ lan can bóng bẩy thẩm mỹ cao, bền bỉ cùng nắng gió biển Hạ Long suốt 10 năm không hoen gỉ.',
      gallery:'["/assets/images/project-yacht.png"]',
      thumbnail:'/assets/images/project-yacht.png'
    },
    
    // Products
    { type:'product', title:'Cửa nhôm Xingfa Class A nhập khẩu',    slug:'cua-nhom-xingfa-class-a',    status:'published', category:'Cửa nhôm định hình', excerpt:'Nhôm định hình hệ cao cấp phủ PVDF kháng muối biển, phụ kiện Cogo/Hafele đồng bộ.', thumbnail:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80' },
    { type:'product', title:'Cửa trượt Slim profile siêu mảnh',    slug:'cua-truot-slim-profile',     status:'published', category:'Cửa nhôm định hình', excerpt:'Hệ cửa trượt khung nhôm siêu nhỏ gọn mang lại góc nhìn panorama tối đa, vận hành êm ái.', thumbnail:'/assets/images/product-glass.png' },
    { type:'product', title:'Vách mặt dựng Unitized cản nhiệt',   slug:'vach-mat-dung-unitized',      status:'published', category:'Kính cường lực & Phụ kiện', excerpt:'Vách kính mặt ngoài tòa nhà hệ Unitized, kính Low-E phản quang cách nhiệt cách âm vượt trội.', thumbnail:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },
    { type:'product', title:'Cổng nhôm đúc chân không hoàng gia', slug:'cong-nhom-duc-hoang-gia',     status:'published', category:'Sắt mỹ thuật chế tác', excerpt:'Đúc chân không nguyên khối hợp kim nhôm, sơn phủ đồng cổ sang trọng chống chịu thời tiết.', thumbnail:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
    { type:'product', title:'Cầu thang xoắn lốc uốn nghệ thuật', slug:'cau-thang-xoan-uon-my-thuat',  status:'published', category:'Sắt mỹ thuật chế tác', excerpt:'Cầu thang kết cấu thép uốn nghệ thuật, tay vịn bọc đồng hoặc mạ vàng titan đẳng cấp.', thumbnail:'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80' },
    { type:'product', title:'Lan can kính cường lực pad âm sàn',   slug:'lan-can-kinh-pad-am',         status:'published', category:'Kính cường lực & Phụ kiện', excerpt:'Lan can kính không tay vịn sử dụng pad inox 304 bắt âm sàn, kính dán 2 lớp cường lực 15.38mm.', thumbnail:'/assets/images/product-railing.png' },
    { type:'product', title:'Ống inox & Phụ kiện Marine 316L',    slug:'inox-marine-316l',            status:'published', category:'Inox & Phụ kiện du thuyền', excerpt:'Ống inox 316L chống ăn mòn lỗ trong môi trường nước biển, bề mặt bóng gương tinh xảo.', thumbnail:'/assets/images/product-inox-pipe.png' },
    
    // Articles
    { type:'article', title:'Xu hướng sử dụng nhôm kính kiến trúc 2026', slug:'xu-huong-nhom-kinh-2026', status:'published', category:'Xu hướng kiến trúc', excerpt:'Tổng hợp các xu hướng thiết kế vách kính tràn viền và nhôm slim hiện đại.' },
    { type:'article', title:'Tại sao Inox 316L lại bắt buộc cho du thuyền?',  slug:'tai-sao-inox-316l-du-thuyen', status:'published', category:'Kiến thức kỹ thuật', excerpt:'Phân tích khoa học sự khác biệt khả năng chống ăn mòn lỗ giữa inox 304 và 316L.' },
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

    // Seed project metadata if present
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
  console.log(`✅ ${items.length} content items and metadata seeded`);

  // ── Sample links ────────────────────────────────────────
  const links = [
    { label:'Website Sao Vàng',       url:'https://saovang.vn',                  type:'website'  },
    { label:'Facebook Sao Vàng',      url:'https://facebook.com/saovang',         type:'facebook' },
    { label:'Catalogue Sản Phẩm 2026',url:'/uploads/docs/catalogue-2026.pdf',    type:'pdf'      },
    { label:'Video Giới Thiệu',       url:'https://youtube.com/watch?v=demo',    type:'youtube'  },
  ];
  const insertLink = db.prepare('INSERT OR REPLACE INTO links (label, url, type, created_by) VALUES (?, ?, ?, ?)');
  for (const l of links) insertLink.run(l.label, l.url, l.type, adminId);
  console.log(`✅ ${links.length} links seeded`);

  // ── Sample form ─────────────────────────────────────────
  const formExists = db.prepare("SELECT id FROM forms WHERE slug = 'lien-he'").get();
  if (!formExists) {
    const fields = JSON.stringify([
      { id:'f1', type:'text',     label:'Họ và tên',        required:true,  placeholder:'Nguyễn Văn A' },
      { id:'f2', type:'tel',      label:'Số điện thoại',    required:true,  placeholder:'0869 590 279' },
      { id:'f3', type:'email',    label:'Email',            required:false, placeholder:'email@example.com' },
      { id:'f4', type:'select',   label:'Dịch vụ quan tâm', required:true,  options:['Cơ khí nghệ thuật','Nhôm kính cao cấp','Du thuyền','Cầu thang & Lan can'] },
      { id:'f5', type:'textarea', label:'Mô tả yêu cầu',    required:false, placeholder:'Mô tả chi tiết...' },
    ]);
    db.prepare('INSERT INTO forms (name, slug, description, fields, settings, created_by) VALUES (?,?,?,?,?,?)')
      .run('Form Liên Hệ','lien-he','Form tư vấn khách hàng', fields, JSON.stringify({ submit_msg:'Cảm ơn! Chúng tôi sẽ liên hệ sớm.', email_notify:'info@saovang.vn' }), adminId);
    console.log('✅ Sample form: Form Liên Hệ');
  }

  // Seed 119 imported products from Dai Phuc
  try {
    await seedDaiphucProducts(db);
  } catch (err) {
    console.error('Error seeding Dai Phuc products:', err.message);
  }

  // Force persist
  db._persist();

  console.log('\n🚀 Seed hoàn tất!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Admin URL : http://localhost:4000/admin`);
  console.log(`Login     : ${email}`);
  console.log(`Password  : ${password}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  setTimeout(() => process.exit(0), 500);
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
