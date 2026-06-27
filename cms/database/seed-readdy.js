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
    
    // Product categories (Detailed Sub-categories)
    { name: 'Cửa Nhôm Xingfa',          slug: 'cua-nhom-xingfa',          content_type: 'product', color: '#1a5c9e' },
    { name: 'Cửa Nhôm Xingfa Class A',  slug: 'cua-nhom-xingfa-class-a',  content_type: 'product', color: '#155b8e' },
    { name: 'Cửa Trượt Quay',           slug: 'cua-truot-quay',           content_type: 'product', color: '#2d8a5e' },
    { name: 'Cửa Nhôm Slim',            slug: 'cua-nhom-slim',            content_type: 'product', color: '#4a4a7a' },
    { name: 'Cửa Nhôm Thủy Lực',       slug: 'cua-nhom-thuy-luc',       content_type: 'product', color: '#7a4a1a' },
    { name: 'Cửa Lưới Chống Muỗi',     slug: 'cua-luoi-chong-muoi',     content_type: 'product', color: '#2d7a3a' },
    { name: 'Cửa Nhôm Kogen',           slug: 'cua-nhom-kogen',           content_type: 'product', color: '#7a5a1a' },
    { name: 'Cửa Nhôm PMA',             slug: 'cua-nhom-pma',             content_type: 'product', color: '#1a5a7a' },
    { name: 'Cửa Nhôm Yongxing',        slug: 'cua-nhom-yongxing',        content_type: 'product', color: '#5a1a7a' },
    { name: 'Cửa Nhôm Owin',            slug: 'cua-nhom-owin',            content_type: 'product', color: '#7a1a5a' },
    { name: 'Cửa Nhôm Topal',           slug: 'cua-nhom-topal',           content_type: 'product', color: '#1a7a5a' },
    { name: 'Cửa Nhôm Kenwin',          slug: 'cua-nhom-kenwin',          content_type: 'product', color: '#5a7a1a' },
    { name: 'Cửa Nhôm Tấm Tổ Ong',     slug: 'cua-nhom-tam-to-ong',     content_type: 'product', color: '#8B4513' },
    { name: 'Cửa Tự Động',             slug: 'cua-tu-dong',             content_type: 'product', color: '#1a4a7a' },
    { name: 'Cửa nhôm định hình',       slug: 'cua-nhom-dinh-hinh',       content_type: 'product', color: '#0d4e8a' },

    { name: 'Kính cường lực & Phụ kiện', slug: 'kinh-cuong-luc', content_type: 'product', color: '#1a3a5c' },
    { name: 'Sắt mỹ thuật chế tác', slug: 'sat-my-thuat-che-tac', content_type: 'product', color: '#8B0000' },
    { name: 'Gia công Inox', slug: 'gia-cong-inox', content_type: 'product', color: '#c8860a' },
    
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
     { type:'product', title:'Ống inox & Phụ kiện Inox Công Nghiệp',    slug:'inox-marine-316l',            status:'published', category:'Gia công Inox', excerpt:'Ống inox 316L, 304 tiêu chuẩn công nghiệp và vi sinh, khả năng chịu áp lực cao, kháng axit vượt trội.', thumbnail:'/assets/images/product-inox-pipe.png' },
    
    // Articles (Preserve existing high-quality articles)
    { type:'article', title:'Xu hướng sử dụng nhôm kính kiến trúc 2026', slug:'xu-huong-nhom-kinh-2026', status:'published', category:'Xu hướng kiến trúc', excerpt:'Tổng hợp các xu hướng thiết kế vách kính tràn viền và nhôm slim hiện đại.' },
    { type:'article', title:'Tại sao Inox 316L lại bắt buộc cho bồn chứa vi sinh?',  slug:'tai-sao-inox-316l-du-thuyen', status:'published', category:'Kiến thức kỹ thuật', excerpt:'Phân tích tính chất hóa học và độ nhẵn bề mặt của Inox 316L giúp chống bám bẩn vi khuẩn trong chế biến thực phẩm.' },
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

  await seedNhomKinhProducts(db);

  db._persist();
  console.log(`✅ ${items.length} content items and metadata successfully seeded in db.sqlite with sort order`);
}


/**
 * Seed 114 Nhôm Kính products from Đại Phúc (company's old products)
 * Images: local /uploads/products/<slug>.webp (preferred) or remote fallback from nhomkinhdaiphuc.com
 */
async function seedNhomKinhProducts(db) {
  console.log('🌱 Seeding 114 Nhôm Kính products from Đại Phúc...');
  const adminId = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('superadmin')?.id || 1;
  
  const products = [
    {
        "slug": "cua-so-nhom-xingfa-mo-hat-1-canh",
        "title": "Cửa Sổ Nhôm Xingfa Mở Hất 1 Cánh",
        "category": "Cửa nhôm định hình",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Cửa Sổ Nhôm Xingfa Mở Hất 1 Cánh - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Sổ Nhôm Xingfa Mở Hất 1 Cánh</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-nhom-xingfa-mo-hat-1-canh.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-nhom-xingfa-mo-hat-1-canh_828760998073/cua-so-nhom-xingfa-mo-hat-1-canh.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-nhom-xingfa-mo-hat-1-canh-504.html"
    },
    {
        "slug": "cua-so-nhom-xingfa-mo-hat-2-canh",
        "title": "Cửa Sổ Nhôm Xingfa Mở Hất 2 Cánh",
        "category": "Cửa nhôm định hình",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Cửa Sổ Nhôm Xingfa Mở Hất 2 Cánh - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Sổ Nhôm Xingfa Mở Hất 2 Cánh</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-nhom-xingfa-mo-hat-2-canh.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-nhom-xingfa-mo-hat-2-canh_713087323503/cua-so-nhom-xingfa-mo-hat-2-canh.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-nhom-xingfa-mo-hat-2-canh-505.html"
    },
    {
        "slug": "cua-so-nhom-xingfa-mo-quay-1-canh",
        "title": "Cửa Sổ Nhôm Xingfa Mở Quay 1 Cánh",
        "category": "Cửa nhôm định hình",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Cửa Sổ Nhôm Xingfa Mở Quay 1 Cánh - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Sổ Nhôm Xingfa Mở Quay 1 Cánh</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-nhom-xingfa-mo-quay-1-canh.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-nhom-xingfa-mo-quay-1-canh_499053618371/cua-so-nhom-xingfa-mo-quay-1-canh.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-nhom-xingfa-mo-quay-1-canh-507.html"
    },
    {
        "slug": "cua-so-nhom-xingfa-mo-quay-2-canh",
        "title": "Cửa Sổ Nhôm Xingfa Mở Quay 2 Cánh",
        "category": "Cửa nhôm định hình",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Cửa Sổ Nhôm Xingfa Mở Quay 2 Cánh - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Sổ Nhôm Xingfa Mở Quay 2 Cánh</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-nhom-xingfa-mo-quay-2-canh.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-nhom-xingfa-mo-quay-2-canh_745460215890/cua-so-nhom-xingfa-mo-quay-2-canh.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-nhom-xingfa-mo-quay-2-canh-514.html"
    },
    {
        "slug": "cua-so-nhom-xingfa-mo-quay-4-canh",
        "title": "Cửa Sổ Nhôm Xingfa Mở Quay 4 Cánh",
        "category": "Cửa nhôm định hình",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Cửa Sổ Nhôm Xingfa Mở Quay 4 Cánh - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Sổ Nhôm Xingfa Mở Quay 4 Cánh</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-nhom-xingfa-mo-quay-4-canh.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-nhom-xingfa-mo-quay-4-canh_773717913962/cua-so-nhom-xingfa-mo-quay-4-canh.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-nhom-xingfa-mo-quay-4-canh-518.html"
    },
    {
        "slug": "cua-so-nhom-xingfa-mo-truot-2-canh",
        "title": "Cửa sổ nhôm xingfa mở trượt 2 cánh",
        "category": "Cửa nhôm định hình",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Cửa sổ nhôm xingfa mở trượt 2 cánh - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa sổ nhôm xingfa mở trượt 2 cánh</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-nhom-xingfa-mo-truot-2-canh.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-nhom-xingfa-mo-truot-2-canh_996050468381/cua-so-nhom-xingfa-mo-truot-2-canh.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-nhom-xingfa-mo-truot-2-canh-519.html"
    },
    {
        "slug": "cua-truot-quay-4-canh-mau-van-go",
        "title": "Cửa trượt quay 4 cánh màu vân gỗ",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa trượt quay 4 cánh màu vân gỗ - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa trượt quay 4 cánh màu vân gỗ</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-truot-quay-4-canh-mau-van-go.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-truot-quay-4-canh-mau-van-go_808194771329/cua-truot-quay-4-canh-mau-van-go.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-truot-quay-4-canh-mau-van-go-622.html"
    },
    {
        "slug": "cua-truot-quay-4-canh-mau-xam-ghi",
        "title": "Cửa trượt quay 4 cánh màu xám ghi",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa trượt quay 4 cánh màu xám ghi - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa trượt quay 4 cánh màu xám ghi</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-truot-quay-4-canh-mau-xam-ghi.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-truot-quay-4-canh-mau-xam-ghi_046567162833/cua-truot-quay-4-canh-mau-xam-ghi.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-truot-quay-4-canh-mau-xam-ghi-623.html"
    },
    {
        "slug": "cua-truot-quay-4-canh-mau-trang",
        "title": "Cửa trượt quay 4 cánh màu trắng",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa trượt quay 4 cánh màu trắng - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa trượt quay 4 cánh màu trắng</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-truot-quay-4-canh-mau-trang.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-truot-quay-4-canh-mau-trang_722273917280/cua-truot-quay-4-canh-mau-trang.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-truot-quay-4-canh-mau-trang-624.html"
    },
    {
        "slug": "cua-truot-quay-4-canh-mau-nau-ca-phe",
        "title": "Cửa trượt quay 4 cánh màu nâu cà phê",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa trượt quay 4 cánh màu nâu cà phê - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa trượt quay 4 cánh màu nâu cà phê</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-truot-quay-4-canh-mau-nau-ca-phe.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-truot-quay-4-canh-mau-nau-ca-phe_731570069044/cua-truot-quay-4-canh-mau-nau-ca-phe.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-truot-quay-4-canh-mau-nau-ca-phe-625.html"
    },
    {
        "slug": "cua-truot-quay-2-canh-mau-van-go",
        "title": "Cửa trượt quay 2 cánh màu vân gỗ",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa trượt quay 2 cánh màu vân gỗ - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa trượt quay 2 cánh màu vân gỗ</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-truot-quay-2-canh-mau-van-go.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-truot-quay-2-canh-mau-van-go_635319346843/cua-truot-quay-2-canh-mau-van-go.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-truot-quay-2-canh-mau-van-go-626.html"
    },
    {
        "slug": "cua-truot-quay-2-canh-mau-xam-ghi",
        "title": "Cửa trượt quay 2 cánh màu xám ghi",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa trượt quay 2 cánh màu xám ghi - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa trượt quay 2 cánh màu xám ghi</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-truot-quay-2-canh-mau-xam-ghi.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-truot-quay-2-canh-mau-xam-ghi_369042559844/cua-truot-quay-2-canh-mau-xam-ghi.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-truot-quay-2-canh-mau-xam-ghi-627.html"
    },
    {
        "slug": "cua-nhom-slim-cover",
        "title": "Cửa Nhôm Slim Cover",
        "category": "Cửa nhôm định hình",
        "brand": "Slim",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Slim Cover - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Slim Cover</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Slim định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-slim-cover.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-slim-cover_293450407016/cua-nhom-slim-cover.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-slim-cover-793.html"
    },
    {
        "slug": "cua-lua-nhom-slim-khong-ray-cua-nhom-cao-cap-toi-uu-khong-gian",
        "title": "Cửa Lùa Nhôm Slim Không Ray - Cửa Nhôm Cao Cấp Tối Ưu Không Gian",
        "category": "Cửa nhôm định hình",
        "brand": "Slim",
        "unit": "m²",
        "excerpt": "Cửa Lùa Nhôm Slim Không Ray - Cửa Nhôm Cao Cấp Tối Ưu Không Gian - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Lùa Nhôm Slim Không Ray - Cửa Nhôm Cao Cấp Tối Ưu Không Gian</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Slim định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-lua-nhom-slim-khong-ray-cua-nhom-cao-cap-toi-uu-khong-gian.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-lua-nhom-slim-khong-ray-cua-nhom-cao-cap-toi-uu-khong-gian_191228949680/cua-lua-nhom-slim-khong-ray-cua-nhom-cao-cap-toi-uu-khong-gian.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-lua-nhom-slim-khong-ray-cua-nhom-cao-cap-toi-uu-khong-gian-595.html"
    },
    {
        "slug": "cua-nhom-slim-1-canh-mo-quay",
        "title": "Cửa Nhôm Slim 1 Cánh Mở Quay",
        "category": "Cửa nhôm định hình",
        "brand": "Slim",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Slim 1 Cánh Mở Quay - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Slim 1 Cánh Mở Quay</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Slim định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-slim-1-canh-mo-quay.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-slim-1-canh-mo-quay_985371955150/cua-nhom-slim-1-canh-mo-quay.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-slim-1-canh-mo-quay-639.html"
    },
    {
        "slug": "cua-nhom-slim-mo-quay-2-canh",
        "title": "Cửa Nhôm Slim Mở Quay 2 Cánh",
        "category": "Cửa nhôm định hình",
        "brand": "Slim",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Slim Mở Quay 2 Cánh - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Slim Mở Quay 2 Cánh</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Slim định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-slim-mo-quay-2-canh.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-slim-mo-quay-2-canh_529452195936/cua-nhom-slim-mo-quay-2-canh.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-slim-mo-quay-2-canh-640.html"
    },
    {
        "slug": "vach-ngan-phong-he-slim-co-cua-mo-quay",
        "title": "Vách ngăn phòng hệ slim có cửa mở quay",
        "category": "Cửa nhôm định hình",
        "brand": "Slim",
        "unit": "m²",
        "excerpt": "Vách ngăn phòng hệ slim có cửa mở quay - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Vách ngăn phòng hệ slim có cửa mở quay</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Slim định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/vach-ngan-phong-he-slim-co-cua-mo-quay.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/vach-ngan-phong-he-slim-co-cua-mo-quay_973935250247/vach-ngan-phong-he-slim-co-cua-mo-quay.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/vach-ngan-phong-he-slim-co-cua-mo-quay-641.html"
    },
    {
        "slug": "cua-truot-slim-1-canh-khong-ray-duoi",
        "title": "Cửa trượt slim 1 cánh không ray dưới",
        "category": "Cửa nhôm định hình",
        "brand": "Slim",
        "unit": "m²",
        "excerpt": "Cửa trượt slim 1 cánh không ray dưới - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa trượt slim 1 cánh không ray dưới</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Slim định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-truot-slim-1-canh-khong-ray-duoi.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-truot-slim-1-canh-khong-ray-duoi_619471937461/cua-truot-slim-1-canh-khong-ray-duoi.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-truot-slim-1-canh-khong-ray-duoi-642.html"
    },
    {
        "slug": "cua-nhom-slim-cover-2-canh-lua-khong-rung-lac",
        "title": "Cửa nhôm Slim Cover 2 cánh lùa không rung lắc",
        "category": "Cửa nhôm định hình",
        "brand": "Slim",
        "unit": "m²",
        "excerpt": "Cửa nhôm Slim Cover 2 cánh lùa không rung lắc - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm Slim Cover 2 cánh lùa không rung lắc</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Slim định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-slim-cover-2-canh-lua-khong-rung-lac.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-slim-cover-2-canh-lua-khong-rung-lac_652141587999/cua-nhom-slim-cover-2-canh-lua-khong-rung-lac.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-slim-cover-2-canh-lua-khong-rung-lac-958.html"
    },
    {
        "slug": "cua-nhom-slim-cover-3-canh-lua-qua-lai-khong-rung-lac",
        "title": "Cửa nhôm Slim Cover 3 cánh lùa qua lại không rung lắc",
        "category": "Cửa nhôm định hình",
        "brand": "Slim",
        "unit": "m²",
        "excerpt": "Cửa nhôm Slim Cover 3 cánh lùa qua lại không rung lắc - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm Slim Cover 3 cánh lùa qua lại không rung lắc</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Slim định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-slim-cover-3-canh-lua-qua-lai-khong-rung-lac.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-slim-cover-3-canh-lua-qua-lai-khong-rung-lac_880445495366/cua-nhom-slim-cover-3-canh-lua-qua-lai-khong-rung-lac.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-slim-cover-3-canh-lua-qua-lai-khong-rung-lac-959.html"
    },
    {
        "slug": "cua-nhom-slim-cover-4-canh-lua-doi-xung",
        "title": "Cửa nhôm Slim Cover 4 cánh lùa đối xứng",
        "category": "Cửa nhôm định hình",
        "brand": "Slim",
        "unit": "m²",
        "excerpt": "Cửa nhôm Slim Cover 4 cánh lùa đối xứng - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm Slim Cover 4 cánh lùa đối xứng</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Slim định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-slim-cover-4-canh-lua-doi-xung.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-slim-cover-4-canh-lua-doi-xung_697696456236/cua-nhom-slim-cover-4-canh-lua-doi-xung.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-slim-cover-4-canh-lua-doi-xung-960.html"
    },
    {
        "slug": "cua-nhom-slim-cover-mo-quay",
        "title": "Cửa nhôm Slim cover mở quay",
        "category": "Cửa nhôm định hình",
        "brand": "Slim",
        "unit": "m²",
        "excerpt": "Cửa nhôm Slim cover mở quay - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm Slim cover mở quay</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Slim định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-slim-cover-mo-quay.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-slim-cover-mo-quay_838993678776/cua-nhom-slim-cover-mo-quay.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-slim-cover-mo-quay-961.html"
    },
    {
        "slug": "cua-kinh-cuong-luc-2-canh-lua",
        "title": "Cửa kính cường lực 2 cánh lùa",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa kính cường lực 2 cánh lùa - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa kính cường lực 2 cánh lùa</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-kinh-cuong-luc-2-canh-lua.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-kinh-cuong-luc-2-canh-lua_407022305841/cua-kinh-cuong-luc-2-canh-lua.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-kinh-cuong-luc-2-canh-lua-508.html"
    },
    {
        "slug": "cua-kinh-cuong-luc-mo-2-canh-10-ly",
        "title": "Cửa kính cường lực mở 2 cánh 10 ly",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa kính cường lực mở 2 cánh 10 ly - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa kính cường lực mở 2 cánh 10 ly</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-kinh-cuong-luc-mo-2-canh-10-ly.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-kinh-cuong-luc-mo-2-canh-10-ly_737605231790/cua-kinh-cuong-luc-mo-2-canh-10-ly.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-kinh-cuong-luc-mo-2-canh-10-ly-509.html"
    },
    {
        "slug": "cua-kinh-cuong-luc-10-ly-mo-1-canh",
        "title": "Cửa kính cường lực 10 ly mở 1 cánh",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa kính cường lực 10 ly mở 1 cánh - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa kính cường lực 10 ly mở 1 cánh</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-kinh-cuong-luc-10-ly-mo-1-canh.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-kinh-cuong-luc-10-ly-mo-1-canh_151369016925/cua-kinh-cuong-luc-10-ly-mo-1-canh.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-kinh-cuong-luc-10-ly-mo-1-canh-510.html"
    },
    {
        "slug": "cua-kinh-cuong-luc-1-canh-mo-truot",
        "title": "Cửa kính cường lực 1 cánh mở trượt",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa kính cường lực 1 cánh mở trượt - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa kính cường lực 1 cánh mở trượt</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-kinh-cuong-luc-1-canh-mo-truot.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-kinh-cuong-luc-1-canh-mo-truot_583340954859/cua-kinh-cuong-luc-1-canh-mo-truot.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-kinh-cuong-luc-1-canh-mo-truot-653.html"
    },
    {
        "slug": "cua-kinh-cuong-luc-3-canh-cung-lua",
        "title": "Cửa kính cường lực 3 cánh cùng lùa",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa kính cường lực 3 cánh cùng lùa - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa kính cường lực 3 cánh cùng lùa</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-kinh-cuong-luc-3-canh-cung-lua.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-kinh-cuong-luc-3-canh-cung-lua_145833145817/cua-kinh-cuong-luc-3-canh-cung-lua.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-kinh-cuong-luc-3-canh-cung-lua-727.html"
    },
    {
        "slug": "vach-kinh-cuong-luc",
        "title": "Vách Kính Cường Lực",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Vách Kính Cường Lực - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Vách Kính Cường Lực</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Kính cường lực an toàn tiêu chuẩn AS/NZS",
            "Kính": "Độ dày 8mm - 12mm, xử lý nhiệt cường hóa đạt tiêu chuẩn quốc tế",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/vach-kinh-cuong-luc.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/vach-kinh-cuong-luc_103598007113/vach-kinh-cuong-luc.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/vach-kinh-cuong-luc-1611.html"
    },
    {
        "slug": "cua-nhom-thuy-luc-mau-go-mun",
        "title": "Cửa nhôm thủy lực màu gỗ mun",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa nhôm thủy lực màu gỗ mun - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm thủy lực màu gỗ mun</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-thuy-luc-mau-go-mun.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-thuy-luc-mau-go-mun_732820577628/cua-nhom-thuy-luc-mau-go-mun.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-thuy-luc-mau-go-mun-656.html"
    },
    {
        "slug": "cua-nhom-thuy-luc-mau-van-go-trac",
        "title": "Cửa Nhôm Thủy Lực Màu Vân Gỗ Trắc",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Thủy Lực Màu Vân Gỗ Trắc - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Thủy Lực Màu Vân Gỗ Trắc</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-thuy-luc-mau-van-go-trac.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-thuy-luc-mau-van-go-trac_510395447865/cua-nhom-thuy-luc-mau-van-go-trac.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-thuy-luc-mau-van-go-trac-657.html"
    },
    {
        "slug": "cua-nhom-thuy-luc-mau-van-go-hoang-dan",
        "title": "Cửa nhôm thủy lực màu vân gỗ hoàng đàn",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa nhôm thủy lực màu vân gỗ hoàng đàn - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm thủy lực màu vân gỗ hoàng đàn</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-thuy-luc-mau-van-go-hoang-dan.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-thuy-luc-mau-van-go-hoang-dan_474018885634/cua-nhom-thuy-luc-mau-van-go-hoang-dan.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-thuy-luc-mau-van-go-hoang-dan-658.html"
    },
    {
        "slug": "cua-nhom-thuy-luc-mau-xam-dam",
        "title": "Cửa nhôm thủy lực màu xám đậm",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa nhôm thủy lực màu xám đậm - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm thủy lực màu xám đậm</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-thuy-luc-mau-xam-dam.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-thuy-luc-mau-xam-dam_992379534418/cua-nhom-thuy-luc-mau-xam-dam.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-thuy-luc-mau-xam-dam-659.html"
    },
    {
        "slug": "cua-nhom-thuy-luc-mau-vang-gold",
        "title": "Cửa nhôm thủy lực màu vàng gold",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa nhôm thủy lực màu vàng gold - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm thủy lực màu vàng gold</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-thuy-luc-mau-vang-gold.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-thuy-luc-mau-vang-gold_692794929305/cua-nhom-thuy-luc-mau-vang-gold.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-thuy-luc-mau-vang-gold-660.html"
    },
    {
        "slug": "cua-nhom-thuy-luc-mau-go-huong",
        "title": "Cửa nhôm thủy lực màu gỗ hương",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa nhôm thủy lực màu gỗ hương - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm thủy lực màu gỗ hương</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-thuy-luc-mau-go-huong.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-thuy-luc-mau-go-huong_472325047890/cua-nhom-thuy-luc-mau-go-huong.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-thuy-luc-mau-go-huong-661.html"
    },
    {
        "slug": "cua-so-1-canh-mo-quay-nhom-maxprojp-he-83",
        "title": "Cửa sổ 1 cánh mở quay nhôm Maxpro.jp hệ 83",
        "category": "Cửa nhôm định hình",
        "brand": "Maxpro",
        "unit": "m²",
        "excerpt": "Cửa sổ 1 cánh mở quay nhôm Maxpro.jp hệ 83 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa sổ 1 cánh mở quay nhôm Maxpro.jp hệ 83</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Maxpro định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-1-canh-mo-quay-nhom-maxprojp-he-83.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-1-canh-mo-quay-nhom-maxpro-jp-he-83_495255456833/cua-so-1-canh-mo-quay-nhom-maxpro-jp-he-83.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-1-canh-mo-quay-nhom-maxpro-jp-he-83-677.html"
    },
    {
        "slug": "cua-so-2-canh-mo-quay-nhom-maxprojp-he-83",
        "title": "Cửa sổ 2 cánh mở quay nhôm Maxpro.jp hệ 83",
        "category": "Cửa nhôm định hình",
        "brand": "Maxpro",
        "unit": "m²",
        "excerpt": "Cửa sổ 2 cánh mở quay nhôm Maxpro.jp hệ 83 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa sổ 2 cánh mở quay nhôm Maxpro.jp hệ 83</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Maxpro định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-2-canh-mo-quay-nhom-maxprojp-he-83.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-2-canh-mo-quay-nhom-maxpro-jp-he-83_504253803913/cua-so-2-canh-mo-quay-nhom-maxpro-jp-he-83.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-2-canh-mo-quay-nhom-maxpro-jp-he-83-678.html"
    },
    {
        "slug": "cua-so-mo-lua-2-canh-nhom-maxpro-he-65",
        "title": "Cửa sổ mở lùa 2 cánh nhôm Maxpro hệ 65",
        "category": "Cửa nhôm định hình",
        "brand": "Maxpro",
        "unit": "m²",
        "excerpt": "Cửa sổ mở lùa 2 cánh nhôm Maxpro hệ 65 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa sổ mở lùa 2 cánh nhôm Maxpro hệ 65</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Maxpro định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-mo-lua-2-canh-nhom-maxpro-he-65.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-mo-lua-2-canh-nhom-maxpro-he-65_603930996907/cua-so-mo-lua-2-canh-nhom-maxpro-he-65.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-mo-lua-2-canh-nhom-maxpro-he-65-679.html"
    },
    {
        "slug": "cua-di-4-canh-mo-quay-nhom-maxprojp-he-83",
        "title": "Cửa đi 4 cánh mở quay nhôm Maxpro.jp hệ 83",
        "category": "Cửa nhôm định hình",
        "brand": "Maxpro",
        "unit": "m²",
        "excerpt": "Cửa đi 4 cánh mở quay nhôm Maxpro.jp hệ 83 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa đi 4 cánh mở quay nhôm Maxpro.jp hệ 83</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Maxpro định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-di-4-canh-mo-quay-nhom-maxprojp-he-83.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-di-4-canh-mo-quay-nhom-maxpro-jp-he-83_016000683479/cua-di-4-canh-mo-quay-nhom-maxpro-jp-he-83.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-di-4-canh-mo-quay-nhom-maxpro-jp-he-83-680.html"
    },
    {
        "slug": "cua-so-4-canh-nhom-maxprojp-he-83",
        "title": "Cửa sổ 4 cánh nhôm MAXPRO.JP – hệ 83",
        "category": "Cửa nhôm định hình",
        "brand": "Maxpro",
        "unit": "m²",
        "excerpt": "Cửa sổ 4 cánh nhôm MAXPRO.JP – hệ 83 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa sổ 4 cánh nhôm MAXPRO.JP – hệ 83</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Maxpro định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-4-canh-nhom-maxprojp-he-83.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-4-canh-nhom-maxpro-jp--he-83_710573616250/cua-so-4-canh-nhom-maxpro-jp-he-83.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-4-canh-nhom-maxpro-jp-he-83-681.html"
    },
    {
        "slug": "cua-so-lua-4-canh-nhom-maxpro-he-65",
        "title": "Cửa Sổ Lùa 4 Cánh Nhôm Maxpro hệ 65",
        "category": "Cửa nhôm định hình",
        "brand": "Maxpro",
        "unit": "m²",
        "excerpt": "Cửa Sổ Lùa 4 Cánh Nhôm Maxpro hệ 65 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Sổ Lùa 4 Cánh Nhôm Maxpro hệ 65</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Maxpro định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-lua-4-canh-nhom-maxpro-he-65.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-lua-4-canh-nhom-maxpro_148518929607/cua-so-lua-4-canh-nhom-maxpro-he-65.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-lua-4-canh-nhom-maxpro-he-65-783.html"
    },
    {
        "slug": "phong-tam-kinh-cuong-luc-cua-quay-90-do",
        "title": "Phòng tắm kính cường lực cửa quay 90 độ",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "Bộ",
        "excerpt": "Phòng tắm kính cường lực cửa quay 90 độ - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Phòng tắm kính cường lực cửa quay 90 độ</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Kính cường lực Hải Long 8mm, khung phụ kiện inox 304 bóng gương",
            "Kính": "Kính cường lực an toàn cân bằng nhiệt 8-10mm",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/phong-tam-kinh-cuong-luc-cua-quay-90-do.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/phong-tam-kinh-cuong-luc-cua-quay-90-do_256223307709/phong-tam-kinh-cuong-luc-cua-quay-90-do.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/phong-tam-kinh-cuong-luc-cua-quay-90-do-513.html"
    },
    {
        "slug": "phong-tam-kinh-cuong-luc-cua-lua",
        "title": "Phòng tắm kính cường lực cửa lùa",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "Bộ",
        "excerpt": "Phòng tắm kính cường lực cửa lùa - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Phòng tắm kính cường lực cửa lùa</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Kính cường lực Hải Long 8mm, khung phụ kiện inox 304 bóng gương",
            "Kính": "Kính cường lực an toàn cân bằng nhiệt 8-10mm",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/phong-tam-kinh-cuong-luc-cua-lua.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/phong-tam-kinh-cuong-luc-cua-lua_969404368194/phong-tam-kinh-cuong-luc-cua-lua.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/phong-tam-kinh-cuong-luc-cua-lua-515.html"
    },
    {
        "slug": "phong-tam-kinh-canh-mo-truot-90-do",
        "title": "Phòng tắm kính, cánh mở trượt 90 độ",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "Bộ",
        "excerpt": "Phòng tắm kính, cánh mở trượt 90 độ - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Phòng tắm kính, cánh mở trượt 90 độ</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Kính cường lực Hải Long 8mm, khung phụ kiện inox 304 bóng gương",
            "Kính": "Kính cường lực an toàn cân bằng nhiệt 8-10mm",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/phong-tam-kinh-canh-mo-truot-90-do.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/phong-tam-kinh-papo-canh-mo-truot-90-do-ma-pt06_222628370092/phong-tam-kinh-canh-mo-truot-90-do.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/phong-tam-kinh-canh-mo-truot-90-do-812.html"
    },
    {
        "slug": "phong-tam-kinh-kim-cuong-lua-135-do",
        "title": "Phòng tắm kính kim cương lùa 135 độ",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "Bộ",
        "excerpt": "Phòng tắm kính kim cương lùa 135 độ - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Phòng tắm kính kim cương lùa 135 độ</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Kính cường lực Hải Long 8mm, khung phụ kiện inox 304 bóng gương",
            "Kính": "Kính cường lực an toàn cân bằng nhiệt 8-10mm",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/phong-tam-kinh-kim-cuong-lua-135-do.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/phong-tam-kinh-kim-cuong-lua-135-do_154384658062/phong-tam-kinh-kim-cuong-lua-135-do.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/phong-tam-kinh-kim-cuong-lua-135-do-813.html"
    },
    {
        "slug": "phong-tam-kinh-fendi-fiu-1x4-goc-vuong-inox-bong",
        "title": "Phòng Tắm Kính Fendi FIU-1X4 Góc Vuông Inox Bóng",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "Fendi",
        "unit": "Bộ",
        "excerpt": "Phòng Tắm Kính Fendi FIU-1X4 Góc Vuông Inox Bóng - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Phòng Tắm Kính Fendi FIU-1X4 Góc Vuông Inox Bóng</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Kính cường lực Hải Long 8mm, khung phụ kiện inox 304 bóng gương",
            "Kính": "Kính cường lực an toàn cân bằng nhiệt 8-10mm",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/phong-tam-kinh-fendi-fiu-1x4-goc-vuong-inox-bong.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/phong-tam-kinh-fendi-fiu-1x4-goc-vuong-inox-bong_827303925865/phong-tam-kinh-fendi-fiu-1x4-goc-vuong-inox-bong.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/phong-tam-kinh-fendi-fiu-1x4-goc-vuong-inox-bong-957.html"
    },
    {
        "slug": "phong-tam-kinh-gymek-mo-quay-90-do-su-dung-ban-le-kinh-tuong",
        "title": "Phòng tắm kính Gymek mở quay 90 độ, sử dụng bản lề kính - tường",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "Gymek",
        "unit": "Bộ",
        "excerpt": "Phòng tắm kính Gymek mở quay 90 độ, sử dụng bản lề kính - tường - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Phòng tắm kính Gymek mở quay 90 độ, sử dụng bản lề kính - tường</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Kính cường lực Hải Long 8mm, khung phụ kiện inox 304 bóng gương",
            "Kính": "Kính cường lực an toàn cân bằng nhiệt 8-10mm",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/phong-tam-kinh-gymek-mo-quay-90-do-su-dung-ban-le-kinh-tuong.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/phong-tam-kinh-gymek-mo-quay-90-do-su-dung-ban-le-kinh-tuong_007922652199/phong-tam-kinh-gymek-mo-quay-90-do-su-dung-ban-le-kinh-tuong.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/phong-tam-kinh-gymek-mo-quay-90-do-su-dung-ban-le-kinh-tuong-962.html"
    },
    {
        "slug": "cau-thang-kinh-cuong-luc-gia-cau-thang-kinh-cuong-luc",
        "title": "Cầu thang kính cường lực. Giá cầu thang kính cường lực",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cầu thang kính cường lực. Giá cầu thang kính cường lực - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cầu thang kính cường lực. Giá cầu thang kính cường lực</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Kính cường lực an toàn tiêu chuẩn AS/NZS",
            "Kính": "Độ dày 8mm - 12mm, xử lý nhiệt cường hóa đạt tiêu chuẩn quốc tế",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cau-thang-kinh-cuong-luc-gia-cau-thang-kinh-cuong-luc.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cau-thang-kinh-cuong-luc-gia-cau-thang-kinh-cuong-luc_806394604202/cau-thang-kinh-cuong-luc-gia-cau-thang-kinh-cuong-luc.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cau-thang-kinh-cuong-luc-gia-cau-thang-kinh-cuong-luc-541.html"
    },
    {
        "slug": "lan-can-kinh-khong-tru-tay-vin-nhom-maxpro",
        "title": "Lan Can Kính Không Trụ Tay Vịn Nhôm Maxpro",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "Maxpro",
        "unit": "m²",
        "excerpt": "Lan Can Kính Không Trụ Tay Vịn Nhôm Maxpro - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Lan Can Kính Không Trụ Tay Vịn Nhôm Maxpro</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Maxpro định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/lan-can-kinh-khong-tru-tay-vin-nhom-maxpro.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/lan-can-kinh-khong-tru-tay-vin-nhom-maxpro_163233594611/lan-can-kinh-khong-tru-tay-vin-nhom-maxpro.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/lan-can-kinh-khong-tru-tay-vin-nhom-maxpro-814.html"
    },
    {
        "slug": "cua-truot-tu-dong-kth-k2-tai-trong-100kg-x-2-canh",
        "title": "Cửa trượt tự động KTH - K2 (Tải trọng 100Kg x 2 cánh)",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa trượt tự động KTH - K2 (Tải trọng 100Kg x 2 cánh) - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa trượt tự động KTH - K2 (Tải trọng 100Kg x 2 cánh)</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-truot-tu-dong-kth-k2-tai-trong-100kg-x-2-canh.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-truot-tu-dong-kth-k2-tai-trong-100kg-x-2-canh-_915155572174/cua-truot-tu-dong-kth-k2-tai-trong-100kg-x-2-canh-.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-truot-tu-dong-kth-k2-tai-trong-100kg-x-2-canh--555.html"
    },
    {
        "slug": "cua-kinh-tu-dong-chu-v",
        "title": "Cửa kính tự động chữ V",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa kính tự động chữ V - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa kính tự động chữ V</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-kinh-tu-dong-chu-v.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-kinh-tu-dong-chu-v_123318155050/cua-kinh-tu-dong-chu-v.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-kinh-tu-dong-chu-v-556.html"
    },
    {
        "slug": "cua-truot-cong-tu-dong-san-xuat-tai-dai-loan",
        "title": "Cửa trượt cong tự động sản xuất tại Đài Loan",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa trượt cong tự động sản xuất tại Đài Loan - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa trượt cong tự động sản xuất tại Đài Loan</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-truot-cong-tu-dong-san-xuat-tai-dai-loan.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-truot-cong-tu-dong-san-xuat-tai-dai-loan_054821591021/cua-truot-cong-tu-dong-san-xuat-tai-dai-loan.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-truot-cong-tu-dong-san-xuat-tai-dai-loan-557.html"
    },
    {
        "slug": "cua-truot-tu-dong-2-canh-deper-125b",
        "title": "Cửa Trượt Tự Động 2 Cánh DEPER 125B",
        "category": "Cửa nhôm định hình",
        "brand": "DEPER",
        "unit": "m²",
        "excerpt": "Cửa Trượt Tự Động 2 Cánh DEPER 125B - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Trượt Tự Động 2 Cánh DEPER 125B</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm DEPER định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-truot-tu-dong-2-canh-deper-125b.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-truot-tu-dong-2-canh-deper-125b_108197606169/cua-truot-tu-dong-2-canh-deper-125b.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-truot-tu-dong-2-canh-deper-125b-967.html"
    },
    {
        "slug": "cua-tu-dong-cao-cap-grizzly",
        "title": "Cửa tự động cao cấp Grizzly",
        "category": "Cửa nhôm định hình",
        "brand": "Grizzly",
        "unit": "m²",
        "excerpt": "Cửa tự động cao cấp Grizzly - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa tự động cao cấp Grizzly</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Grizzly định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-tu-dong-cao-cap-grizzly.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-tu-dong-cao-cap-grizzly_593229775451/cua-tu-dong-cao-cap-grizzly.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-tu-dong-cao-cap-grizzly-1621.html"
    },
    {
        "slug": "cua-kinh-lua-tu-dong-taesung-han-quoc",
        "title": "Cửa kính lùa tự động Taesung Hàn Quốc",
        "category": "Cửa nhôm định hình",
        "brand": "Taesung",
        "unit": "m²",
        "excerpt": "Cửa kính lùa tự động Taesung Hàn Quốc - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa kính lùa tự động Taesung Hàn Quốc</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Taesung định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-kinh-lua-tu-dong-taesung-han-quoc.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-kinh-lua-tu-dong-taesung-han-quoc_477954777025/cua-kinh-lua-tu-dong-taesung-han-quoc.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-kinh-lua-tu-dong-taesung-han-quoc-1622.html"
    },
    {
        "slug": "vach-kinh-cuong-luc-10-ly",
        "title": "Vách kính cường lực 10 ly",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Vách kính cường lực 10 ly - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Vách kính cường lực 10 ly</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Kính cường lực an toàn tiêu chuẩn AS/NZS",
            "Kính": "Độ dày 8mm - 12mm, xử lý nhiệt cường hóa đạt tiêu chuẩn quốc tế",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/vach-kinh-cuong-luc-10-ly.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/vach-kinh-cuong-luc-10-ly_839957573929/vach-kinh-cuong-luc-10-ly.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/vach-kinh-cuong-luc-10-ly-511.html"
    },
    {
        "slug": "vach-kinh-cuong-luc-12-ly",
        "title": "Vách kính cường lực 12 ly",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Vách kính cường lực 12 ly - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Vách kính cường lực 12 ly</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Kính cường lực an toàn tiêu chuẩn AS/NZS",
            "Kính": "Độ dày 8mm - 12mm, xử lý nhiệt cường hóa đạt tiêu chuẩn quốc tế",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/vach-kinh-cuong-luc-12-ly.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/vach-kinh-cuong-luc-12-ly_896236217717/vach-kinh-cuong-luc-12-ly.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/vach-kinh-cuong-luc-12-ly-512.html"
    },
    {
        "slug": "vach-mat-dung-lo-do-xingfa-he-65",
        "title": "Vách mặt dựng lộ đố Xingfa hệ 65",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Vách mặt dựng lộ đố Xingfa hệ 65 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Vách mặt dựng lộ đố Xingfa hệ 65</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/vach-mat-dung-lo-do-xingfa-he-65.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/vach-mat-dung-lo-do-xingfa-he-65_689461311221/vach-mat-dung-lo-do-xingfa-he-65.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/vach-mat-dung-lo-do-xingfa-he-65-558.html"
    },
    {
        "slug": "vach-mat-dung-nhom-xingfa-giau-do",
        "title": "Vách Mặt Dựng Nhôm Xingfa Giấu Đố",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Vách Mặt Dựng Nhôm Xingfa Giấu Đố - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Vách Mặt Dựng Nhôm Xingfa Giấu Đố</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/vach-mat-dung-nhom-xingfa-giau-do.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/vach-mat-dung-nhom-xingfa-giau-do_221082054049/vach-mat-dung-nhom-xingfa-giau-do.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/vach-mat-dung-nhom-xingfa-giau-do-1658.html"
    },
    {
        "slug": "vach-kinh-mat-dung",
        "title": "Vách Kính Mặt Dựng",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Vách Kính Mặt Dựng - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Vách Kính Mặt Dựng</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/vach-kinh-mat-dung.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/vach-kinh-mat-dung_594201322689/vach-kinh-mat-dung.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/vach-kinh-mat-dung-1676.html"
    },
    {
        "slug": "vach-nhom-kinh-xingfa",
        "title": "Vách Nhôm Kính Xingfa",
        "category": "Cửa nhôm định hình",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Vách Nhôm Kính Xingfa - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Vách Nhôm Kính Xingfa</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/vach-nhom-kinh-xingfa.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/vach-nhom-kinh-xingfa_003593695519/vach-nhom-kinh-xingfa.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/vach-nhom-kinh-xingfa-1677.html"
    },
    {
        "slug": "cua-luoi-cuon-ngang-2-canh-khong-bung-mep-co-giam-toc",
        "title": "Cửa lưới cuốn ngang 2 cánh không bung mép, có giảm tốc",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa lưới cuốn ngang 2 cánh không bung mép, có giảm tốc - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa lưới cuốn ngang 2 cánh không bung mép, có giảm tốc</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-luoi-cuon-ngang-2-canh-khong-bung-mep-co-giam-toc.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-luoi-chong-muoi-tu-cuon-ngang-2-canh_303047525176/cua-luoi-cuon-ngang-2-canh-khong-bung-mep-co-giam-toc.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-luoi-cuon-ngang-2-canh-khong-bung-mep-co-giam-toc-662.html"
    },
    {
        "slug": "cua-luoi-cuon-ngang-1-canh-giam-toc-khong-bung-mep",
        "title": "Cửa lưới cuốn ngang 1 cánh giảm tốc không bung mép",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa lưới cuốn ngang 1 cánh giảm tốc không bung mép - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa lưới cuốn ngang 1 cánh giảm tốc không bung mép</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-luoi-cuon-ngang-1-canh-giam-toc-khong-bung-mep.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-luoi-cuon-ngang-1-canh-giam-toc-khong-bung-mep_043599474547/cua-luoi-cuon-ngang-1-canh-giam-toc-khong-bung-mep.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-luoi-cuon-ngang-1-canh-giam-toc-khong-bung-mep-666.html"
    },
    {
        "slug": "cua-luoi-cuon-len-khong-bung-mepco-giam-toc",
        "title": "Cửa lưới cuốn lên không bung mép,có giảm tốc",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa lưới cuốn lên không bung mép,có giảm tốc - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa lưới cuốn lên không bung mép,có giảm tốc</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-luoi-cuon-len-khong-bung-mepco-giam-toc.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-luoi-cuon-len-khong-bung-mep-co-giam-toc_216593648069/cua-luoi-cuon-len-khong-bung-mepco-giam-toc.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-luoi-cuon-len-khong-bung-mepco-giam-toc-667.html"
    },
    {
        "slug": "cua-luoi-xep-2-canh-2-xich-cho-cua-di-khong-ray",
        "title": "Cửa lưới xếp 2 cánh 2 xích cho cửa đi không ray",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa lưới xếp 2 cánh 2 xích cho cửa đi không ray - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa lưới xếp 2 cánh 2 xích cho cửa đi không ray</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-luoi-xep-2-canh-2-xich-cho-cua-di-khong-ray.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-luoi-xep-2-canh-2-xich-cho-cua-di-khong-ray_944741482732/cua-luoi-xep-2-canh-2-xich-cho-cua-di-khong-ray.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-luoi-xep-2-canh-2-xich-cho-cua-di-khong-ray-668.html"
    },
    {
        "slug": "cua-luoi-chong-muoi-dang-xep-cao-cap",
        "title": "Cửa lưới chống muỗi dạng xếp cao cấp",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa lưới chống muỗi dạng xếp cao cấp - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa lưới chống muỗi dạng xếp cao cấp</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-luoi-chong-muoi-dang-xep-cao-cap.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-luoi-chong-muoi-dang-xep-cao-cap_564778674803/cua-luoi-chong-muoi-dang-xep-cao-cap.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-luoi-chong-muoi-dang-xep-cao-cap-669.html"
    },
    {
        "slug": "cua-luoi-chong-muoi-tu-cuon-quang-minh",
        "title": "Cửa Lưới Chống Muỗi Tự Cuốn Quang Minh",
        "category": "Cửa nhôm định hình",
        "brand": "Quang Minh",
        "unit": "m²",
        "excerpt": "Cửa Lưới Chống Muỗi Tự Cuốn Quang Minh - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Lưới Chống Muỗi Tự Cuốn Quang Minh</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Quang Minh định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-luoi-chong-muoi-tu-cuon-quang-minh.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-luoi-chong-muoi-tu-cuon-quang-minh_703380165376/cua-luoi-chong-muoi-tu-cuon-quang-minh.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-luoi-chong-muoi-tu-cuon-quang-minh-1585.html"
    },
    {
        "slug": "cua-di-mo-quay-nhom-kogen-he-60",
        "title": "Cửa đi mở quay nhôm Kogen hệ 60",
        "category": "Cửa nhôm định hình",
        "brand": "Kogen",
        "unit": "m²",
        "excerpt": "Cửa đi mở quay nhôm Kogen hệ 60 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa đi mở quay nhôm Kogen hệ 60</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Kogen định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-di-mo-quay-nhom-kogen-he-60.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-di-mo-quay-nhom-kogen-he-60_268114303275/cua-di-mo-quay-nhom-kogen-he-60.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-di-mo-quay-nhom-kogen-he-60-968.html"
    },
    {
        "slug": "cua-so-mo-quay-nhom-kogen-he-60",
        "title": "Cửa sổ mở quay nhôm Kogen hệ 60",
        "category": "Cửa nhôm định hình",
        "brand": "Kogen",
        "unit": "m²",
        "excerpt": "Cửa sổ mở quay nhôm Kogen hệ 60 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa sổ mở quay nhôm Kogen hệ 60</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Kogen định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-mo-quay-nhom-kogen-he-60.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-mo-quay-nhom-kogen-he-60_375544100997/cua-so-mo-quay-nhom-kogen-he-60.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-mo-quay-nhom-kogen-he-60-969.html"
    },
    {
        "slug": "cua-di-mo-truot-nhom-kogen",
        "title": "Cửa đi mở trượt nhôm Kogen",
        "category": "Cửa nhôm định hình",
        "brand": "Kogen",
        "unit": "m²",
        "excerpt": "Cửa đi mở trượt nhôm Kogen - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa đi mở trượt nhôm Kogen</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Kogen định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-di-mo-truot-nhom-kogen.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-di-mo-truot-nhom-kogen_292526730839/cua-di-mo-truot-nhom-kogen.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-di-mo-truot-nhom-kogen-970.html"
    },
    {
        "slug": "cua-di-mo-truot-nhom-kogen-3-ray",
        "title": "Cửa đi mở trượt nhôm Kogen 3 ray",
        "category": "Cửa nhôm định hình",
        "brand": "Kogen",
        "unit": "m²",
        "excerpt": "Cửa đi mở trượt nhôm Kogen 3 ray - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa đi mở trượt nhôm Kogen 3 ray</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Kogen định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-di-mo-truot-nhom-kogen-3-ray.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-di-mo-truot-nhom-kogen-3-ray_670690382959/cua-di-mo-truot-nhom-kogen-3-ray.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-di-mo-truot-nhom-kogen-3-ray-971.html"
    },
    {
        "slug": "cua-so-mo-truot-nhom-kogen",
        "title": "Cửa Sổ Mở Trượt Nhôm Kogen",
        "category": "Cửa nhôm định hình",
        "brand": "Kogen",
        "unit": "m²",
        "excerpt": "Cửa Sổ Mở Trượt Nhôm Kogen - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Sổ Mở Trượt Nhôm Kogen</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Kogen định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-mo-truot-nhom-kogen.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-mo-truot-nhom-kogen_079431725054/cua-so-mo-truot-nhom-kogen.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-mo-truot-nhom-kogen-972.html"
    },
    {
        "slug": "cua-lua-slim-138-nhom-kogen",
        "title": "Cửa Lùa Slim 138 Nhôm Kogen",
        "category": "Cửa nhôm định hình",
        "brand": "Kogen",
        "unit": "m²",
        "excerpt": "Cửa Lùa Slim 138 Nhôm Kogen - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Lùa Slim 138 Nhôm Kogen</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Kogen định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-lua-slim-138-nhom-kogen.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-lua-slim-138-nhom-kogen_680292925215/cua-lua-slim-138-nhom-kogen.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-lua-slim-138-nhom-kogen-973.html"
    },
    {
        "slug": "kinh-soc-8mm-cuong-luc",
        "title": "Kính sọc 8mm cường lực",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Kính sọc 8mm cường lực - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Kính sọc 8mm cường lực</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/kinh-soc-8mm-cuong-luc.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/kinh-soc-8mm-cuong-luc_145922666072/kinh-soc-8mm-cuong-luc.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/kinh-soc-8mm-cuong-luc-715.html"
    },
    {
        "slug": "kinh-xam-khoi-8mm-cuong-luc",
        "title": "Kính xám khói 8mm cường lực",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Kính xám khói 8mm cường lực - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Kính xám khói 8mm cường lực</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/kinh-xam-khoi-8mm-cuong-luc.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/kinh-xam-khoi-8mm-cuong-luc_994026673699/kinh-xam-khoi-8mm-cuong-luc.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/kinh-xam-khoi-8mm-cuong-luc-716.html"
    },
    {
        "slug": "rem-trong-kinh-hop",
        "title": "Rèm trong kính hộp",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Rèm trong kính hộp - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Rèm trong kính hộp</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/rem-trong-kinh-hop.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/rem-trong-kinh-hop_707310218439/rem-trong-kinh-hop.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/rem-trong-kinh-hop-717.html"
    },
    {
        "slug": "kinh-dien-thong-minh",
        "title": "Kính Điện Thông Minh",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Kính Điện Thông Minh - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Kính Điện Thông Minh</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/kinh-dien-thong-minh.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/kinh-dien-thong-minh_819014463877/kinh-dien-thong-minh.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/kinh-dien-thong-minh-718.html"
    },
    {
        "slug": "kinh-soc-mau-tra-8-mm",
        "title": "Kính sọc màu trà 8 mm",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Kính sọc màu trà 8 mm - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Kính sọc màu trà 8 mm</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/kinh-soc-mau-tra-8-mm.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/kinh-soc-mau-tra-8-mm_579567370718/kinh-soc-mau-tra-8-mm.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/kinh-soc-mau-tra-8-mm-719.html"
    },
    {
        "slug": "kinh-hoa-dong",
        "title": "Kính Hoa Đồng",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Kính Hoa Đồng - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Kính Hoa Đồng</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/kinh-hoa-dong.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/kinh-hoa-dong_586627785365/kinh-hoa-dong.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/kinh-hoa-dong-720.html"
    },
    {
        "slug": "cua-di-mo-quay-cao-cap-pma-he-ranh-c-chau-au-lux65",
        "title": "Cửa Đi Mở Quay Cao Cấp PMA Hệ Rãnh C Châu Âu Lux65",
        "category": "Cửa nhôm định hình",
        "brand": "PMA",
        "unit": "m²",
        "excerpt": "Cửa Đi Mở Quay Cao Cấp PMA Hệ Rãnh C Châu Âu Lux65 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Đi Mở Quay Cao Cấp PMA Hệ Rãnh C Châu Âu Lux65</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm PMA định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-di-mo-quay-cao-cap-pma-he-ranh-c-chau-au-lux65.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-di-mo-quay-cao-cap-pma-he-ranh-c-chau-au-lux65_251381064832/cua-di-mo-quay-cao-cap-pma-he-ranh-c-chau-au-lux65.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-di-mo-quay-cao-cap-pma-he-ranh-c-chau-au-lux65-978.html"
    },
    {
        "slug": "cua-so-nhom-pma-mo-quay-he-lux65",
        "title": "Cửa sổ nhôm PMA mở quay hệ Lux65",
        "category": "Cửa nhôm định hình",
        "brand": "PMA",
        "unit": "m²",
        "excerpt": "Cửa sổ nhôm PMA mở quay hệ Lux65 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa sổ nhôm PMA mở quay hệ Lux65</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm PMA định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-nhom-pma-mo-quay-he-lux65.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-nhom-pma-mo-quay-he-lux65_488492177212/cua-so-nhom-pma-mo-quay-he-lux65.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-nhom-pma-mo-quay-he-lux65-998.html"
    },
    {
        "slug": "cua-xep-truot-nhom-pma-he-80-lux65",
        "title": "Cửa xếp trượt nhôm PMA hệ 80 Lux65",
        "category": "Cửa nhôm định hình",
        "brand": "PMA",
        "unit": "m²",
        "excerpt": "Cửa xếp trượt nhôm PMA hệ 80 Lux65 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa xếp trượt nhôm PMA hệ 80 Lux65</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm PMA định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-xep-truot-nhom-pma-he-80-lux65.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-xep-truot-nhom-pma-he-80-lux65_042842026327/cua-xep-truot-nhom-pma-he-80-lux65.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-xep-truot-nhom-pma-he-80-lux65-999.html"
    },
    {
        "slug": "cua-di-mo-quay-pma-he-classic-58",
        "title": "Cửa đi mở quay PMA hệ Classic 58",
        "category": "Cửa nhôm định hình",
        "brand": "PMA",
        "unit": "m²",
        "excerpt": "Cửa đi mở quay PMA hệ Classic 58 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa đi mở quay PMA hệ Classic 58</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm PMA định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-di-mo-quay-pma-he-classic-58.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-di-mo-quay-pma-he-classic-58_400818992183/cua-di-mo-quay-pma-he-classic-58.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-di-mo-quay-pma-he-classic-58-1016.html"
    },
    {
        "slug": "cua-nhom-pma-ban-to-mau-van-go",
        "title": "Cửa nhôm PMA bản to màu vân gỗ",
        "category": "Cửa nhôm định hình",
        "brand": "PMA",
        "unit": "m²",
        "excerpt": "Cửa nhôm PMA bản to màu vân gỗ - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm PMA bản to màu vân gỗ</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm PMA định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-pma-ban-to-mau-van-go.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-pma-ban-to-mau-van-go_335148129340/cua-nhom-pma-ban-to-mau-van-go.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-pma-ban-to-mau-van-go-1278.html"
    },
    {
        "slug": "cua-so-mo-quay-nhom-pma-he-classic-58",
        "title": "Cửa sổ mở quay nhôm PMA hệ Classic 58",
        "category": "Cửa nhôm định hình",
        "brand": "PMA",
        "unit": "m²",
        "excerpt": "Cửa sổ mở quay nhôm PMA hệ Classic 58 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa sổ mở quay nhôm PMA hệ Classic 58</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm PMA định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-mo-quay-nhom-pma-he-classic-58.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-mo-quay-nhom-pma-he-classic-58_781499881521/cua-so-mo-quay-nhom-pma-he-classic-58.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-mo-quay-nhom-pma-he-classic-58-1616.html"
    },
    {
        "slug": "cua-nhom-xingfa-class-a-he-65",
        "title": "Cửa Nhôm Xingfa Class A Hệ 65",
        "category": "Cửa nhôm định hình",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Xingfa Class A Hệ 65 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Xingfa Class A Hệ 65</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-xingfa-class-a-he-65.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-xingfa-class-a-he-65_089319388908/cua-nhom-xingfa-class-a-he-65.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-xingfa-class-a-he-65-1580.html"
    },
    {
        "slug": "cua-so-lua-nhom-xingfa-class-a-he-a72",
        "title": "Cửa sổ lùa nhôm Xingfa Class A hệ A72",
        "category": "Cửa nhôm định hình",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Cửa sổ lùa nhôm Xingfa Class A hệ A72 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa sổ lùa nhôm Xingfa Class A hệ A72</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-lua-nhom-xingfa-class-a-he-a72.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-lua-nhom-xingfa-class-a-he-a72_080673865354/cua-so-lua-nhom-xingfa-class-a-he-a72.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-lua-nhom-xingfa-class-a-he-a72-1581.html"
    },
    {
        "slug": "cua-di-xep-truot-nhom-xingfa-class-a-he-ac80",
        "title": "Cửa đi xếp trượt nhôm Xingfa Class A hệ AC80",
        "category": "Cửa nhôm định hình",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Cửa đi xếp trượt nhôm Xingfa Class A hệ AC80 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa đi xếp trượt nhôm Xingfa Class A hệ AC80</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-di-xep-truot-nhom-xingfa-class-a-he-ac80.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-di-xep-truot-nhom-xingfa-class-a-he-ac80_124757509029/cua-di-xep-truot-nhom-xingfa-class-a-he-ac80.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-di-xep-truot-nhom-xingfa-class-a-he-ac80-1582.html"
    },
    {
        "slug": "cua-di-lua-nhom-xingfa-class-a-he-a115",
        "title": "Cửa đi lùa nhôm Xingfa Class A hệ A115",
        "category": "Cửa nhôm định hình",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Cửa đi lùa nhôm Xingfa Class A hệ A115 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa đi lùa nhôm Xingfa Class A hệ A115</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-di-lua-nhom-xingfa-class-a-he-a115.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-di-lua-nhom-xingfa-class-a-he-a115_130300382437/cua-di-lua-nhom-xingfa-class-a-he-a115.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-di-lua-nhom-xingfa-class-a-he-a115-1583.html"
    },
    {
        "slug": "cua-nhom-xingfa-he-55-son-anodized-ed",
        "title": "Cửa Nhôm Xingfa Hệ 55 Sơn ANODIZED-ED",
        "category": "Cửa nhôm định hình",
        "brand": "Xingfa",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Xingfa Hệ 55 Sơn ANODIZED-ED - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Xingfa Hệ 55 Sơn ANODIZED-ED</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Xingfa định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-xingfa-he-55-son-anodized-ed.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-xingfa-he-55-son-anodized-ed_077822306438/cua-nhom-xingfa-he-55-son-anodized-ed.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-xingfa-he-55-son-anodized-ed-1584.html"
    },
    {
        "slug": "cua-nhom-tam-to-ong-vota",
        "title": "Cửa Nhôm Tấm Tổ Ong Vota",
        "category": "Cửa nhôm định hình",
        "brand": "Vota",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Tấm Tổ Ong Vota - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Tấm Tổ Ong Vota</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Vota định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-tam-to-ong-vota.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-tam-to-ong-vota_076575734145/cua-nhom-tam-to-ong-vota.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-tam-to-ong-vota-1620.html"
    },
    {
        "slug": "cua-nhom-to-ong-van-go-al01",
        "title": "Cửa nhôm tổ ong vân gỗ Al01",
        "category": "Cửa nhôm định hình",
        "brand": "SAO VÀNG",
        "unit": "m²",
        "excerpt": "Cửa nhôm tổ ong vân gỗ Al01 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm tổ ong vân gỗ Al01</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-to-ong-van-go-al01.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-to-ong-van-go-al01_317024539920/cua-nhom-to-ong-van-go-al01.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-to-ong-van-go-al01-1637.html"
    },
    {
        "slug": "cua-nhom-tam-to-ong-maxal",
        "title": "Cửa Nhôm Tấm Tổ Ong Maxal",
        "category": "Cửa nhôm định hình",
        "brand": "Maxal",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Tấm Tổ Ong Maxal - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Tấm Tổ Ong Maxal</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Maxal định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-tam-to-ong-maxal.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-tam-to-ong-maxal_211643256051/cua-nhom-tam-to-ong-maxal.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-tam-to-ong-maxal-1661.html"
    },
    {
        "slug": "cua-nhom-yongxing-he-55-mo-lua",
        "title": "Cửa Nhôm Yongxing Hệ 55 Mở Lùa",
        "category": "Cửa nhôm định hình",
        "brand": "Yongxing",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Yongxing Hệ 55 Mở Lùa - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Yongxing Hệ 55 Mở Lùa</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Yongxing định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-yongxing-he-55-mo-lua.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-yongxing-he-55-mo-lua_675710881439/cua-nhom-yongxing-he-55-mo-lua.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-yongxing-he-55-mo-lua-1598.html"
    },
    {
        "slug": "cua-nhom-yongxing-he-55-vat-canh",
        "title": "Cửa Nhôm Yongxing Hệ 55 Vát Cạnh",
        "category": "Cửa nhôm định hình",
        "brand": "Yongxing",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Yongxing Hệ 55 Vát Cạnh - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Yongxing Hệ 55 Vát Cạnh</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Yongxing định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-yongxing-he-55-vat-canh.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-yongxing-he-55-vat-canh_069979445577/cua-nhom-yongxing-he-55-vat-canh.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-yongxing-he-55-vat-canh-1599.html"
    },
    {
        "slug": "cua-nhom-yongxing-he-63-xep-truot",
        "title": "Cửa Nhôm Yongxing Hệ 63 Xếp Trượt",
        "category": "Cửa nhôm định hình",
        "brand": "Yongxing",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Yongxing Hệ 63 Xếp Trượt - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Yongxing Hệ 63 Xếp Trượt</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Yongxing định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-yongxing-he-63-xep-truot.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-yongxing-he-63-xep-truot_505852286695/cua-nhom-yongxing-he-63-xep-truot.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-yongxing-he-63-xep-truot-1600.html"
    },
    {
        "slug": "cua-nhom-yongxing-he-8090",
        "title": "Cửa nhôm Yongxing hệ 8090",
        "category": "Cửa nhôm định hình",
        "brand": "Yongxing",
        "unit": "m²",
        "excerpt": "Cửa nhôm Yongxing hệ 8090 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm Yongxing hệ 8090</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Yongxing định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-yongxing-he-8090.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-yongxing-he-8090_140912868148/cua-nhom-yongxing-he-8090.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-yongxing-he-8090-1601.html"
    },
    {
        "slug": "cua-nhom-yongxing-he-94-mo-lua",
        "title": "Cửa nhôm Yongxing hệ 94 mở lùa",
        "category": "Cửa nhôm định hình",
        "brand": "Yongxing",
        "unit": "m²",
        "excerpt": "Cửa nhôm Yongxing hệ 94 mở lùa - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm Yongxing hệ 94 mở lùa</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Yongxing định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-yongxing-he-94-mo-lua.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-yongxing-he-94-mo-lua_229167026734/cua-nhom-yongxing-he-94-mo-lua.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-yongxing-he-94-mo-lua-1602.html"
    },
    {
        "slug": "cua-nhom-yongxing-he-slim",
        "title": "Cửa nhôm Yongxing hệ Slim",
        "category": "Cửa nhôm định hình",
        "brand": "Yongxing",
        "unit": "m²",
        "excerpt": "Cửa nhôm Yongxing hệ Slim - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa nhôm Yongxing hệ Slim</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Yongxing định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-yongxing-he-slim.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-yongxing-he-slim_817866297830/cua-nhom-yongxing-he-slim.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-yongxing-he-slim-1603.html"
    },
    {
        "slug": "canh-kinh-tu-ao-lua",
        "title": "Cánh kính tủ áo lùa",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "Bộ",
        "excerpt": "Cánh kính tủ áo lùa - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cánh kính tủ áo lùa</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/canh-kinh-tu-ao-lua.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/canh-kinh-tu-ao-lua_488793013042/canh-kinh-tu-ao-lua.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/canh-kinh-tu-ao-lua-1640.html"
    },
    {
        "slug": "canh-kinh-tu-ao-mo",
        "title": "Cánh kính tủ áo mở",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "Bộ",
        "excerpt": "Cánh kính tủ áo mở - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cánh kính tủ áo mở</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/canh-kinh-tu-ao-mo.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/canh-kinh-tu-ao-mo_145840493450/canh-kinh-tu-ao-mo.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/canh-kinh-tu-ao-mo-1641.html"
    },
    {
        "slug": "tu-ao-canh-kinh-ban-le-am",
        "title": "Tủ Áo Cánh Kính Bản Lề Âm",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "Bộ",
        "excerpt": "Tủ Áo Cánh Kính Bản Lề Âm - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Tủ Áo Cánh Kính Bản Lề Âm</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/tu-ao-canh-kinh-ban-le-am.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/tu-ao-canh-kinh-ban-le-am_994111858859/tu-ao-canh-kinh-ban-le-am.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/tu-ao-canh-kinh-ban-le-am-1643.html"
    },
    {
        "slug": "tu-bep-canh-kinh-nhom-tam",
        "title": "Tủ Bếp Cánh Kính Nhôm Tấm",
        "category": "Kính cường lực & Phụ kiện",
        "brand": "SAO VÀNG",
        "unit": "Bộ",
        "excerpt": "Tủ Bếp Cánh Kính Nhôm Tấm - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Tủ Bếp Cánh Kính Nhôm Tấm</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Hợp kim nhôm định hình cao cấp",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/tu-bep-canh-kinh-nhom-tam.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/tu-bep-canh-kinh-nhom-tam_564551357835/tu-bep-canh-kinh-nhom-tam.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/tu-bep-canh-kinh-nhom-tam-1644.html"
    },
    {
        "slug": "cua-nhom-thuy-luc-owin",
        "title": "Cửa Nhôm Thủy Lực Owin",
        "category": "Cửa nhôm định hình",
        "brand": "Owin",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Thủy Lực Owin - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Thủy Lực Owin</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Owin định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-thuy-luc-owin.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-thuy-luc-owin_673319644515/cua-nhom-thuy-luc-owin.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-thuy-luc-owin-1659.html"
    },
    {
        "slug": "cua-truot-quay-owin",
        "title": "Cửa Trượt Quay Owin",
        "category": "Cửa nhôm định hình",
        "brand": "Owin",
        "unit": "m²",
        "excerpt": "Cửa Trượt Quay Owin - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Trượt Quay Owin</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Owin định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-truot-quay-owin.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-truot-quay-owin_333104712505/cua-truot-quay-owin.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-truot-quay-owin-1660.html"
    },
    {
        "slug": "cua-nhom-owin-he-khuon-phao-ban-canh-160",
        "title": "Cửa Nhôm Owin Hệ Khuôn Phào Bản Cánh 160",
        "category": "Cửa nhôm định hình",
        "brand": "Owin",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Owin Hệ Khuôn Phào Bản Cánh 160 - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Owin Hệ Khuôn Phào Bản Cánh 160</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Owin định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-owin-he-khuon-phao-ban-canh-160.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-owin-he-khuon-phao-ban-canh-160_701644740083/cua-nhom-owin-he-khuon-phao-ban-canh-160.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-owin-he-khuon-phao-ban-canh-160-1682.html"
    },
    {
        "slug": "cua-nhom-owin-he-chan-song",
        "title": "Cửa Nhôm Owin Hệ Chấn Song",
        "category": "Cửa nhôm định hình",
        "brand": "Owin",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Owin Hệ Chấn Song - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Owin Hệ Chấn Song</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Owin định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-owin-he-chan-song.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-owin-he-chan-song_870980572402/cua-nhom-owin-he-chan-song.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-owin-he-chan-song-1683.html"
    },
    {
        "slug": "cua-so-nhom-topal-prima-mo-quay",
        "title": "Cửa sổ nhôm Topal PRIMA  mở quay",
        "category": "Cửa nhôm định hình",
        "brand": "Topal",
        "unit": "m²",
        "excerpt": "Cửa sổ nhôm Topal PRIMA  mở quay - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa sổ nhôm Topal PRIMA  mở quay</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Topal định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-nhom-topal-prima-mo-quay.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-nhom-topal-prima-mo-quay_824128229371/cua-so-nhom-topal-prima-mo-quay.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-nhom-topal-prima-mo-quay-1756.html"
    },
    {
        "slug": "cua-so-truot-nhom-topal-prima",
        "title": "Cửa sổ trượt nhôm Topal PRIMA",
        "category": "Cửa nhôm định hình",
        "brand": "Topal",
        "unit": "m²",
        "excerpt": "Cửa sổ trượt nhôm Topal PRIMA - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa sổ trượt nhôm Topal PRIMA</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Topal định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-truot-nhom-topal-prima.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-truot-nhom-topal-prima_436351484922/cua-so-truot-nhom-topal-prima.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-truot-nhom-topal-prima-1757.html"
    },
    {
        "slug": "cua-so-nhom-topal-prima-he-gap-truot",
        "title": "Cửa sổ nhôm Topal PRIMA hệ gấp trượt",
        "category": "Cửa nhôm định hình",
        "brand": "Topal",
        "unit": "m²",
        "excerpt": "Cửa sổ nhôm Topal PRIMA hệ gấp trượt - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa sổ nhôm Topal PRIMA hệ gấp trượt</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Topal định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-nhom-topal-prima-he-gap-truot.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-nhom-topal-prima-he-gap-truot_347369348398/cua-so-nhom-topal-prima-he-gap-truot.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-nhom-topal-prima-he-gap-truot-1758.html"
    },
    {
        "slug": "cua-so-truot-topal-slima",
        "title": "Cửa Sổ Trượt Topal Slima",
        "category": "Cửa nhôm định hình",
        "brand": "Topal",
        "unit": "m²",
        "excerpt": "Cửa Sổ Trượt Topal Slima - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Sổ Trượt Topal Slima</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Topal định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-truot-topal-slima.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-truot-topal-slima_199242159674/cua-so-truot-topal-slima.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-truot-topal-slima-1759.html"
    },
    {
        "slug": "cua-so-mo-hat-topal-slima",
        "title": "Cửa Sổ Mở Hất Topal Slima",
        "category": "Cửa nhôm định hình",
        "brand": "Topal",
        "unit": "m²",
        "excerpt": "Cửa Sổ Mở Hất Topal Slima - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Sổ Mở Hất Topal Slima</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Topal định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-mo-hat-topal-slima.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-mo-hat-topal-slima_290537684666/cua-so-mo-hat-topal-slima.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-mo-hat-topal-slima-1760.html"
    },
    {
        "slug": "cua-so-mo-quay-topal-slima",
        "title": "Cửa Sổ Mở Quay Topal Slima",
        "category": "Cửa nhôm định hình",
        "brand": "Topal",
        "unit": "m²",
        "excerpt": "Cửa Sổ Mở Quay Topal Slima - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Sổ Mở Quay Topal Slima</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Topal định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-so-mo-quay-topal-slima.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-so-mo-quay-topal-slima_614698675367/cua-so-mo-quay-topal-slima.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-so-mo-quay-topal-slima-1761.html"
    },
    {
        "slug": "cua-nhom-kenwin-he-55s",
        "title": "Cửa Nhôm Kenwin Hệ 55S",
        "category": "Cửa nhôm định hình",
        "brand": "Kenwin",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Kenwin Hệ 55S - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Kenwin Hệ 55S</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Kenwin định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-kenwin-he-55s.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-kenwin-he-55s_541400273963/cua-nhom-kenwin-he-55s.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-kenwin-he-55s-1773.html"
    },
    {
        "slug": "cua-nhom-kenwin-he-thuy-luc",
        "title": "Cửa Nhôm Kenwin Hệ Thủy Lực",
        "category": "Cửa nhôm định hình",
        "brand": "Kenwin",
        "unit": "m²",
        "excerpt": "Cửa Nhôm Kenwin Hệ Thủy Lực - Sản phẩm nhôm kính chất lượng cao, được thiết kế và gia công tinh xảo theo tiêu chuẩn kiến trúc hiện đại, bền đẹp cho mọi công trình.",
        "bodyContent": "<strong>Cửa Nhôm Kenwin Hệ Thủy Lực</strong> được gia công, sản xuất bằng dây chuyền máy móc công nghệ hiện đại bậc nhất tại xưởng Sao Vàng. Với kỹ thuật chế tác chính xác, tính thẩm mỹ vượt trội và khả năng cách âm, chống nước tuyệt đối, đây là giải pháp cửa vách kính hoàn hảo mang lại sự bền vững, tiện nghi và sang trọng cho biệt thự, căn hộ và công trình kiến trúc cao cấp.",
        "specs": {
            "Chất liệu": "Nhôm Kenwin định hình cao cấp nhập khẩu",
            "Kính": "Kính cường lực an toàn Hải Long (5mm - 12mm)",
            "Màu sắc": "Xám ghi, trắng sứ, nâu cafe, vân gỗ sang trọng",
            "Phụ kiện": "Hệ phụ kiện đồng bộ cao cấp Kinlong, Draho, Bogo chính hãng",
            "Bảo hành": "5 năm cho khung nhôm, 2 năm hệ phụ kiện"
        },
        "localImg": "/uploads/products/cua-nhom-kenwin-he-thuy-luc.webp",
        "remoteImg": "https://nhomkinhdaiphuc.com/thumb/350x350/1/upload/product/cua-nhom-kenwin-he-thuy-luc_254007365260/cua-nhom-kenwin-he-thuy-luc.webp",
        "daiphucUrl": "https://nhomkinhdaiphuc.com/san-pham/cua-nhom-kenwin-he-thuy-luc-1774.html"
    }
];
  
  let count = 0;
  const insertContent = db.prepare(`
    INSERT OR REPLACE INTO content (type, title, slug, status, author_id, thumbnail, excerpt, category, published_at, created_at, updated_at)
    VALUES ('product', ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMeta = db.prepare(`
    INSERT OR REPLACE INTO content_meta (content_id, field_key, field_value, field_type)
    VALUES (?, ?, ?, 'text')
  `);
  const insertBlock = db.prepare(`
    INSERT OR REPLACE INTO blocks (content_id, type, position, data, visible, created_at, updated_at)
    VALUES (?, 'text', 0, ?, 1, ?, ?)
  `);
  
  const now = new Date().toISOString();
  const dbNow = now.replace('T', ' ').substring(0, 19);
  
  function classifyTitle(title) {
    const t = (title || '').toLowerCase();
    if ((t.includes('xingfa') || t.includes('xinfga')) && (t.includes('class a') || t.includes('class-a') || t.includes('classa'))) {
      return 'Cửa Nhôm Xingfa Class A';
    }
    if (t.includes('xingfa') || t.includes('xinfga')) {
      return 'Cửa Nhôm Xingfa';
    }
    if (t.includes('trượt quay') || t.includes('truot quay')) {
      return 'Cửa Trượt Quay';
    }
    if (t.includes('slim')) {
      return 'Cửa Nhôm Slim';
    }
    if (t.includes('thủy lực') || t.includes('thuy luc') || t.includes('maxpro')) {
      return 'Cửa Nhôm Thủy Lực';
    }
    if (t.includes('lưới') || t.includes('luoi')) {
      return 'Cửa Lưới Chống Muỗi';
    }
    if (t.includes('kogen')) {
      return 'Cửa Nhôm Kogen';
    }
    if (t.includes('pma')) {
      return 'Cửa Nhôm PMA';
    }
    if (t.includes('yongxing')) {
      return 'Cửa Nhôm Yongxing';
    }
    if (t.includes('owin')) {
      return 'Cửa Nhôm Owin';
    }
    if (t.includes('topal')) {
      return 'Cửa Nhôm Topal';
    }
    if (t.includes('kenwin')) {
      return 'Cửa Nhôm Kenwin';
    }
    if (t.includes('tổ ong') || t.includes('to ong') || t.includes('tấm tổ') || t.includes('tam to')) {
      return 'Cửa Nhôm Tấm Tổ Ong';
    }
    if (t.includes('tự động') || t.includes('tu dong')) {
      return 'Cửa Tự Động';
    }
    return 'Cửa nhôm định hình';
  }

  for (const p of products) {
    const fs = require('fs');
    const path = require('path');
    
    // Check if local image exists, otherwise use remote URL
    const localImgPath = path.join(__dirname, '..', 'uploads', 'products', p.slug + '.webp');
    const thumbnail = fs.existsSync(localImgPath) ? p.localImg : p.remoteImg;
    
    // Resolve dynamic category for aluminum doors
    let category = p.category;
    if (category === 'Cửa nhôm định hình') {
      category = classifyTitle(p.title);
    }

    const existing = db.prepare('SELECT id FROM content WHERE slug = ? AND type = ?').get(p.slug, 'product');
    let contentId;
    if (existing) {
      // Update thumbnail, excerpt, and category to latest
      db.prepare('UPDATE content SET thumbnail = ?, excerpt = ?, category = ?, updated_at = ? WHERE id = ?')
        .run(thumbnail, p.excerpt, category, dbNow, existing.id);
      contentId = existing.id;
    } else {
      const res = insertContent.run(p.title, p.slug, adminId, thumbnail, p.excerpt, category, now, dbNow, dbNow);
      contentId = res.lastInsertRowid;
    }
    
    // Upsert meta fields
    const metaFields = [
      { key: 'brand', val: p.brand },
      { key: 'price', val: '' },
      { key: 'unit', val: p.unit },
      { key: 'in_stock', val: '1' },
      { key: 'gallery', val: JSON.stringify([thumbnail]) },
      { key: 'specs', val: JSON.stringify(p.specs) }
    ];
    for (const field of metaFields) {
      const existMeta = db.prepare("SELECT id FROM content_meta WHERE content_id = ? AND field_key = ?").get(contentId, field.key);
      if (existMeta) {
        db.prepare("UPDATE content_meta SET field_value = ? WHERE id = ?").run(field.val, existMeta.id);
      } else {
        insertMeta.run(contentId, field.key, field.val);
      }
    }
    
    // Upsert block
    const existBlock = db.prepare("SELECT id FROM blocks WHERE content_id = ? AND position = 0").get(contentId);
    const blockData = JSON.stringify({ content: p.bodyContent });
    if (existBlock) {
      db.prepare("UPDATE blocks SET data = ?, updated_at = ? WHERE id = ?").run(blockData, dbNow, existBlock.id);
    } else {
      insertBlock.run(contentId, blockData, dbNow, dbNow);
    }
    
    count++;
  }
  
  console.log(`✅ Seeded/updated ${count} Nhôm Kính products successfully.`);
}

seed().then(() => {
  console.log('Seeder finished.');
  process.exit(0);
}).catch(err => {
  console.error('Seeder failed:', err);
  process.exit(1);
});
