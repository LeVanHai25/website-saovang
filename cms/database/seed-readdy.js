/**
 * Database seeder — aligned with Readdy.cc preview data (12 Projects)
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt   = require('bcryptjs');
const { initDb } = require('./db');

async function seed() {
  console.log('🗃️  Initializing database with Readdy.cc aligned 12 projects data with sort order...');
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
    // Project categories (Aligned exactly with Readdy.cc and navbar)
    { name: 'Kết cấu cơ khí nhà ở', slug: 'ket-cau-co-khi-nha-o', content_type: 'project', color: '#8B0000' },
    { name: 'Cầu thang & Lan can', slug: 'cau-thang-lan-can', content_type: 'project', color: '#5b5b5b' },
    { name: 'Cổng & Hàng rào', slug: 'cong-hang-rao', content_type: 'project', color: '#2d5a27' },
    { name: 'Nhôm Kính', slug: 'nhom-kinh', content_type: 'project', color: '#0d4e8a' },
    
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

  // Clear existing project and content entries to prevent duplicates
  console.log('🧹 Cleaning existing content...');
  db.prepare("DELETE FROM content WHERE type = 'project'").run();

  // ── 12 Projects & Other Content ──────────────────────────
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
    
    // ── 12 Projects Aligned with Readdy.cc ───────────────────
    // Row 1 (Cơ Khí)
    {
      type:'project',
      title:'Biệt Thự Nghỉ Dưỡng Đà Lạt',
      slug:'biet-thu-nghi-duong-da-lat',
      status:'published',
      category:'Kết cấu cơ khí nhà ở',
      excerpt:'Thiết kế và thi công toàn bộ kết cấu cơ khí cho biệt thự nghỉ dưỡng 3 tầng: cầu thang inox, lan can kính, cổng ...',
      is_featured:1,
      sort_order:1,
      client:'Gia đình Nguyễn',
      project_value:'2.5 tỷ VNĐ',
      location:'Phường 10, Thành phố Đà Lạt, Lâm Đồng',
      year:'2024',
      area:'Kết cấu cơ khí toàn bộ', // Using 'area' as 'Phạm vi' to match routing
      duration:'4 tháng',
      challenge:'Địa hình đồi dốc phức tạp, sức gió giật lớn đòi hỏi kết cấu khung và liên kết cơ khí đạt độ an toàn cao nhất.',
      solution:'Thiết kế dầm thép uốn lốc kép bằng thép cường độ cao, hàn liên kết giấu mối tại thực địa kết hợp xử lý phun cát sơn epoxy.',
      result:'Sản phẩm kết cấu cơ khí đạt độ thẩm mỹ tinh xảo như tác phẩm nghệ thuật, mang lại góc nhìn panorama tuyệt vời.',
      gallery:'["/assets/images/project-dalat-villa.png"]',
      thumbnail:'/assets/images/project-dalat-villa.png'
    },
    {
      type:'project',
      title:'Penthouse Hà Nội',
      slug:'penthouse-ha-noi',
      status:'published',
      category:'Cầu thang & Lan can',
      excerpt:'Thiết kế và lắp đặt cầu thang inox 316 kết hợp lan can kính cường lực 12mm cho penthouse 2 tầng tại Hà Nội.',
      is_featured:1,
      sort_order:2,
      client:'Gia đình Trần',
      project_value:'850 triệu VNĐ',
      location:'KĐT Vinhomes Metropolis, Ba Đình, Hà Nội',
      year:'2024',
      area:'Cầu thang & Lan can kính',
      duration:'45 ngày',
      challenge:'Không gian vận chuyển lên tầng cao 32 cực kỳ hạn chế, yêu cầu thi công module lắp ráp không tỳ vết.',
      solution:'Bóc tách thiết kế dạng module lắp ráp thông minh, vận chuyển và liên kết hàn argon xử lý nguội giấu mối hoàn hảo.',
      result:'Cầu thang xoắn độc bản trở thành điểm nhấn xa hoa bậc nhất, mang lại sự sang trọng đỉnh cao cho căn hộ.',
      gallery:'["/assets/images/project-penthouse.png"]',
      thumbnail:'/assets/images/project-penthouse.png'
    },
    {
      type:'project',
      title:'Cổng Biệt Thự Vinhomes Riverside',
      slug:'cong-biet-thu-vinhomes-riverside',
      status:'published',
      category:'Cổng & Hàng rào',
      excerpt:'Thiết kế và thi công cổng tự động nghệ thuật kết hợp hàng rào inox cho biệt thự tại Vinhomes Riverside.',
      is_featured:1,
      sort_order:3,
      client:'Gia đình Lê',
      project_value:'320 triệu VNĐ',
      location:'Vinhomes Riverside, Long Biên, Hà Nội',
      year:'2023',
      area:'Cổng tự động & Hàng rào',
      duration:'35 ngày',
      challenge:'Yêu cầu các họa tiết sắt uốn nghệ thuật phải đối xứng hoàn hảo, lớp sơn phủ bền bỉ chống chịu thời tiết ngoài trời.',
      solution:'Gia công rèn uốn nóng 1100°C thủ công bởi nghệ nhân lành nghề, sơn phủ epoxy 4 lớp kháng tia UV chuyên dụng.',
      result:'Cổng vận hành êm ái qua điều khiển thông minh, mang lại mặt tiền tráng lệ, uy nghi cho dinh thự.',
      gallery:'["/assets/images/project-mansion-gate.png"]',
      thumbnail:'/assets/images/project-mansion-gate.png'
    },
    
    // Row 2 (Nhôm Kính)
    {
      type:'project',
      title:'Showroom Ô Tô BMW Hà Nội',
      slug:'showroom-o-to-bmw-ha-noi',
      status:'published',
      category:'Nhôm Kính',
      excerpt:'Thi công toàn bộ hệ mặt dựng Alu & Glass và cửa nhôm Xingfa cho showroom BMW rộng 2.000m² tại Hà Nội.',
      is_featured:1,
      sort_order:4,
      client:'BMW Việt Nam',
      project_value:'3.8 tỷ VNĐ',
      location:'Cầu Giấy, Hà Nội',
      year:'2024',
      area:'Vách kính mặt dựng & Cửa nhôm',
      duration:'60 ngày',
      challenge:'Khổ kính mặt ngoài siêu lớn yêu cầu độ phẳng tuyệt đối và khả năng cản lực cản nhiệt đạt chuẩn khắt khe từ hãng xe Đức.',
      solution:'Ứng dụng hệ vách dựng Semi-Unitized, nhôm định hình cao cấp và kính hộp dán an toàn 2 lớp cản nhiệt phản quang.',
      result:'Showroom hoàn thiện lộng lẫy, phản chiếu ánh sáng tuyệt hảo, tôn vinh đẳng cấp của các dòng xe sang trưng bày.',
      gallery:'["/assets/images/service-glass-facades.png"]',
      thumbnail:'/assets/images/service-glass-facades.png'
    },
    {
      type:'project',
      title:'Tòa Nhà Văn Phòng 20 Tầng',
      slug:'toa-nha-van-phong-20-tang',
      status:'published',
      category:'Nhôm Kính',
      excerpt:'Cung cấp và lắp đặt hệ mặt dựng Curtain Wall, cửa nhôm kính cho tòa tháp văn phòng 20 tầng tại trung...',
      is_featured:1,
      sort_order:5,
      client:'Tập đoàn Đất Xanh',
      project_value:'22 tỷ VNĐ',
      location:'Quận 2, TP. Hồ Chí Minh',
      year:'2024',
      area:'Mặt dựng & Cửa nhôm toàn bộ',
      duration:'120 ngày',
      challenge:'Áp lực tiến độ gấp, thi công lắp ráp an toàn trên cao tại mặt tiền đường phố sầm uất chịu lực gió bão lớn.',
      solution:'Sử dụng hệ thống vách dựng Unitized lắp ghép hoàn thiện tại xưởng trước khi đưa ra cẩu kéo lắp ráp dạng treo tại công trình.',
      result:'Bàn giao vượt tiến độ 10 ngày, đạt toàn bộ các kiểm tra chịu tải gió và kín nước tiêu chuẩn quốc tế.',
      gallery:'["/assets/images/project-vinhomes-villa.png"]',
      thumbnail:'/assets/images/project-vinhomes-villa.png'
    },
    {
      type:'project',
      title:'Biệt Thự Ven Sông Hàn',
      slug:'biet-thu-ven-song-han',
      status:'published',
      category:'Nhôm Kính',
      excerpt:'Lắp đặt toàn bộ cửa nhôm Xingfa cao cấp, lan can kính không khung và mái kính giếng trời cho biệt thự ven...',
      is_featured:1,
      sort_order:6,
      client:'Gia đình Trần',
      project_value:'1.2 tỷ VNĐ',
      location:'Quận Hải Châu, Đà Nẵng',
      year:'2023',
      area:'Cửa nhôm & Lan can kính',
      duration:'40 ngày',
      challenge:'Biệt thự đón trực diện gió muối biển ăn mòn cao, yêu cầu hệ cửa kính mở siêu rộng panorama nhìn ra sông Hàn.',
      solution:'Ứng dụng nhôm Xingfa Class A mạ sơn tĩnh điện kháng muối biển, phụ kiện cao cấp chống chịu rỉ sét.',
      result:'Hệ cửa trượt vận hành nhẹ nhàng bằng một ngón tay, mở ra không gian sống thoáng đãng hòa quyện cùng thiên nhiên.',
      gallery:'["/assets/images/project-villa.png"]',
      thumbnail:'/assets/images/project-villa.png'
    },
    
    // Row 3 (Nhôm Kính)
    {
      type:'project',
      title:'Khách Sạn 5 Sao Nha Trang',
      slug:'khach-san-5-sao-nha-trang',
      status:'published',
      category:'Nhôm Kính',
      excerpt:'Thi công vách kính mặt dựng và 200 phòng tắm kính cường lực cho khách sạn 5 sao ven biển Nha Trang.',
      is_featured:1,
      sort_order:7,
      client:'Tập đoàn VinGroup',
      project_value:'15 tỷ VNĐ',
      location:'Đường Trần Phú, Nha Trang, Khánh Hòa',
      year:'2023',
      area:'Mặt dựng & Phòng tắm kính',
      duration:'90 ngày',
      challenge:'Công trình ven biển có hơi muối cực cao đòi hỏi khả năng chống ăn mòn tuyệt đối của phụ kiện và hệ nhôm.',
      solution:'Sử dụng nhôm anodized cao cấp kháng muối biển và kính cường lực dán 2 lớp hộp khí trơ Low-E cản nhiệt.',
      result:'Toàn bộ mặt ngoài khách sạn lung linh sang trọng, cách âm tốt và cản nhiệt điều hòa xuất sắc.',
      gallery:'["/assets/images/products/nk-mat-dung.jpg"]',
      thumbnail:'/assets/images/products/nk-mat-dung.jpg'
    },
    {
      type:'project',
      title:'Trung Tâm Thương Mại Aeon Mall',
      slug:'trung-tam-thuong-mai-aeon-mall',
      status:'published',
      category:'Nhôm Kính',
      excerpt:'Cung cấp và lắp đặt hệ cửa nhôm kính, vách kính và mái kính cường lực cho trung tâm thương mại AEON Mall...',
      is_featured:1,
      sort_order:8,
      client:'AEON Việt Nam',
      project_value:'28 tỷ VNĐ',
      location:'Quận Long Biên, Hà Nội',
      year:'2022',
      area:'Cửa nhôm & Vách kính toàn bộ',
      duration:'150 ngày',
      challenge:'Mật độ sử dụng cực cao đòi hỏi hệ thống cửa tự động và vách kính sảnh đón phải siêu bền, an toàn tuyệt đối.',
      solution:'Thiết kế kết cấu khung nhôm gia cường lõi thép, kính cường lực 15mm chịu lực va đập và phụ kiện tự động Ý.',
      result:'Sảnh chính sang trọng, đón hàng triệu lượt khách mỗi năm, vận hành bền bỉ không sự cố kỹ thuật.',
      gallery:'["/assets/images/products/nk-vach-kinh.jpg"]',
      thumbnail:'/assets/images/products/nk-vach-kinh.jpg'
    },
    {
      type:'project',
      title:'Penthouse Landmark 81',
      slug:'penthouse-landmark-81',
      status:'published',
      category:'Nhôm Kính',
      excerpt:'Lắp đặt cửa nhôm Xingfa nhập khẩu và phòng tắm kính cao cấp cho penthouse tầng 70 tòa Landmark 81.',
      is_featured:1,
      sort_order:9,
      client:'Gia đình Nguyễn',
      project_value:'980 triệu VNĐ',
      location:'Bình Thạnh, TP. Hồ Chí Minh',
      year:'2022',
      area:'Cửa nhôm & Phòng tắm kính',
      duration:'30 ngày',
      challenge:'Áp lực gió ở độ cao trên 300m vô cùng lớn, yêu cầu hệ cửa nhôm kính chịu lực giật bão cực hạn.',
      solution:'Hệ nhôm Xingfa hệ 93 dày 2.0mm, kính hộp dán 2 lớp dán an toàn và hệ gioăng EPDM kép kín khít tuyệt đối.',
      result:'Độ cách âm hoàn hảo, ngăn gió rít và chống thấm dột 100% kể cả trong những trận mưa bão nhiệt đới dữ dội nhất.',
      gallery:'["/assets/images/products/nk-cua-nhom.jpg"]',
      thumbnail:'/assets/images/products/nk-cua-nhom.jpg'
    },
    
    // Row 4 (Nhôm Kính)
    {
      type:'project',
      title:'Resort Biển Phú Quốc',
      slug:'resort-bien-phu-quoc',
      status:'published',
      category:'Nhôm Kính',
      excerpt:'Thi công cửa nhôm kính và lan can kính cường lực cho 50 villa nghỉ dưỡng tại resort 5 sao Phú Quốc.',
      is_featured:1,
      sort_order:10,
      client:'Sun Group',
      project_value:'35 tỷ VNĐ',
      location:'Bãi Khem, Phú Quốc, Kiên Giang',
      year:'2021',
      area:'Cửa nhôm & Lan can kính',
      duration:'180 ngày',
      challenge:'Quy mô rộng lớn, gió mặn ven biển ăn mòn cao, yêu cầu thiết kế sang trọng hòa nhập với cảnh quan sinh thái.',
      solution:'Sử dụng dòng nhôm sơn tĩnh điện bột đặc biệt kháng muối biển bảo hành 25 năm, kính uốn cong nghệ thuật tại sảnh đón.',
      result:'Biệt thự nghỉ dưỡng lung linh dưới nắng hoàng hôn, đạt tiêu chuẩn khắt khe của tập đoàn quản lý khách sạn quốc tế.',
      gallery:'["/assets/images/project-resort-yacht.png"]',
      thumbnail:'/assets/images/project-resort-yacht.png'
    },
    {
      type:'project',
      title:'Nhà Phố Lô Góc Quận 7',
      slug:'nha-pho-lo-goc-quan-7',
      status:'published',
      category:'Nhôm Kính',
      excerpt:'Thi công cửa nhôm Xingfa và mái kính cường lực 15mm cho nhà phố lô góc 4 tầng tại Quận 7, TP. HCM.',
      is_featured:1,
      sort_order:11,
      client:'Gia đình Lê',
      project_value:'650 triệu VNĐ',
      location:'Khu đô thị Him Lam, Quận 7, TP. HCM',
      year:'2021',
      area:'Cửa nhôm & Mái kính',
      duration:'45 ngày',
      challenge:'Hai mặt tiền đón nắng gay gắt, yêu cầu giải pháp cản nhiệt tối đa nhưng vẫn giữ độ sáng tự nhiên rộng thoáng.',
      solution:'Lắp đặt nhôm Xingfa kết hợp kính Low-E phản quang cản nhiệt và hệ mái kính sảnh đón sắt nghệ thuật bảo vệ.',
      result:'Ngôi nhà mát mẻ, tiết kiệm điện năng điều hòa tới 35% và mang diện mạo trẻ trung, hiện đại nhất khu phố.',
      gallery:'["/assets/images/products/nk-mai-kinh.jpg"]',
      thumbnail:'/assets/images/products/nk-mai-kinh.jpg'
    },
    {
      type:'project',
      title:'Cao Ốc Văn Phòng Đà Nẵng',
      slug:'cao-oc-van-phong-da-nang',
      status:'published',
      category:'Nhôm Kính',
      excerpt:'Thi công hệ mặt dựng Alu & Glass và cửa nhôm cho tòa nhà văn phòng FPT Software 15 tầng tại Đà Nẵng.',
      is_featured:1,
      sort_order:12,
      client:'FPT Software',
      project_value:'12 tỷ VNĐ',
      location:'Khu Công nghệ cao Đà Nẵng',
      year:'2021',
      area:'Mặt dựng Alu & Glass',
      duration:'100 days',
      challenge:'Tòa nhà thiết kế góc nghiêng ấn tượng đòi hỏi kỹ thuật định vị đo đạc và thi công mặt dựng kính nghiêng cực kỳ phức tạp.',
      solution:'Dựng mô hình 3D chính xác, cắt ghép tấm Alu composite và vách kính cường lực 12mm chịu lực bằng máy CNC tinh xảo.',
      result:'Tòa nhà văn phòng hiện đại, biểu trưng cho sự đột phá công nghệ, là niềm tự hào kiến trúc số của doanh nghiệp.',
      gallery:'["/assets/images/products/nk-cua-keo.jpg"]',
      thumbnail:'/assets/images/products/nk-cua-keo.jpg'
    },

    // Products (Preserve existing high-quality items)
    { type:'product', title:'Cửa nhôm Xingfa Class A nhập khẩu',    slug:'cua-nhom-xingfa-class-a',    status:'published', category:'Cửa nhôm định hình', excerpt:'Nhôm định hình hệ cao cấp phủ PVDF kháng muối biển, phụ kiện Cogo/Hafele đồng bộ.', thumbnail:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80' },
    { type:'product', title:'Cửa trượt Slim profile siêu mảnh',    slug:'cua-truot-slim-profile',     status:'published', category:'Cửa nhôm định hình', excerpt:'Hệ cửa trượt khung nhôm siêu nhỏ gọn mang lại góc nhìn panorama tối đa, vận hành êm ái.', thumbnail:'/assets/images/product-glass.png' },
    { type:'product', title:'Vách mặt dựng Unitized cản nhiệt',   slug:'vach-mat-dung-unitized',      status:'published', category:'Kính cường lực & Phụ kiện', excerpt:'Vách kính mặt ngoài tòa nhà hệ Unitized, kính Low-E phản quang cách nhiệt cách âm vượt trội.', thumbnail:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },
    { type:'product', title:'Cổng nhôm đúc chân không hoàng gia', slug:'cong-nhom-duc-hoang-gia',     status:'published', category:'Sắt mở rộng', excerpt:'Đúc chân không nguyên khối hợp kim nhôm, sơn phủ đồng cổ sang trọng chống chịu thời tiết.', thumbnail:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
    { type:'product', title:'Cầu thang xoắn lốc uốn nghệ thuật', slug:'cau-thang-xoan-uon-my-thuat',  status:'published', category:'Sắt mở rộng', excerpt:'Cầu thang kết cấu thép uốn nghệ thuật, tay vịn bọc đồng hoặc mạ vàng titan đẳng cấp.', thumbnail:'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80' },
    { type:'product', title:'Lan can kính cường lực pad âm sàn',   slug:'lan-can-kinh-pad-am',         status:'published', category:'Kính cường lực & Phụ kiện', excerpt:'Lan can kính không tay vịn sử dụng pad inox 304 bắt âm sàn, kính dán 2 lớp cường lực 15.38mm.', thumbnail:'/assets/images/product-railing.png' },
    { type:'product', title:'Ống inox & Phụ kiện Marine 316L',    slug:'inox-marine-316l',            status:'published', category:'Inox & Phụ kiện du thuyền', excerpt:'Ống inox 316L chống ăn mòn lỗ trong môi trường nước biển, bề mặt bóng gương tinh xảo.', thumbnail:'/assets/images/product-inox-pipe.png' },
    
    // Articles (Preserve existing high-quality articles)
    { type:'article', title:'Xu hướng sử dụng nhôm kính kiến trúc 2026', slug:'xu-huong-nhom-kinh-2026', status:'published', category:'Xu hướng kiến trúc', excerpt:'Tổng hợp các xu hướng thiết kế vách kính tràn viền và nhôm slim hiện đại.' },
    { type:'article', title:'Tại sao Inox 316L lại bắt buộc cho du thuyền?',  slug:'tai-sao-inox-316l-du-thuyen', status:'published', category:'Kiến thức kỹ thuật', excerpt:'Phân tích khoa học sự kết hợp hoàn hảo giữa thẩm mỹ bóng bẩy và khả năng kháng nước biển mặn ăn mòn lỗ.' },
    { type:'article', title:'Sao Vàng bàn giao tổ hợp nhôm kính đảo Vinhomes', slug:'ban-giao-to-hop-nhom-kinh', status:'published', category:'Tin tức Sao Vàng', excerpt:'Bàn giao thành công gói thầu hơn 10 tỷ đồng nhôm kính cao cấp biệt thự sinh thái cao cấp.' }
  ];

  const insert = db.prepare(`
    INSERT OR REPLACE INTO content
      (type, title, slug, status, author_id, category, excerpt, tags, is_featured, published_at, thumbnail, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      c.status === 'published' ? new Date().toISOString() : null,
      c.thumbnail || null,
      c.sort_order || 0
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
  console.log(`✅ ${items.length} content items and metadata successfully seeded in db.sqlite with sort order`);
}

seed().then(() => {
  console.log('Seeder finished.');
  process.exit(0);
}).catch(err => {
  console.error('Seeder failed:', err);
  process.exit(1);
});
