/**
 * Database seeder — admin user + sample content
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt   = require('bcryptjs');
const { initDb } = require('./db');

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

  // ── Sample content ──────────────────────────────────────
  const items = [
    { type:'page',    title:'Trang Chủ',                  slug:'trang-chu',                  status:'published', category:'Trang',         excerpt:'Trang chủ website Sao Vàng' },
    { type:'page',    title:'Giới Thiệu',                 slug:'gioi-thieu',                 status:'published', category:'Trang',         excerpt:'Giới thiệu công ty Sao Vàng' },
    { type:'service', title:'Cơ Khí Nhà Ở',              slug:'co-khi-nha-o',               status:'published', category:'Dịch vụ',       excerpt:'Thiết kế và thi công kết cấu cơ khí nhà ở cao cấp', tags:'["cơ khí","nhà ở","biệt thự"]' },
    { type:'service', title:'Du Thuyền Cao Cấp',          slug:'du-thuyen-cao-cap',          status:'published', category:'Dịch vụ',       excerpt:'Thi công du thuyền hạng sang tiêu chuẩn quốc tế',  tags:'["du thuyền","yacht","marine"]', is_featured:1 },
    { type:'project', title:'Biệt Thự Đà Lạt',           slug:'biet-thu-da-lat',            status:'published', category:'Nhà ở & Biệt thự', excerpt:'Cầu thang inox, lan can kính, cổng nhôm đúc cổ điển', is_featured:1 },
    { type:'project', title:'Du Thuyền 28m Sao Biển',    slug:'du-thuyen-28m-sao-bien',     status:'published', category:'Du thuyền',     excerpt:'Vỏ thép hàng hải và nội thất inox marine 316L',    is_featured:1 },
    { type:'product', title:'Inox 316L Marine Grade',    slug:'inox-316l-marine-grade',     status:'published', category:'Vật liệu inox', excerpt:'Inox chuyên dùng cho du thuyền, môi trường biển' },
    { type:'article', title:'Xu hướng lan can 2026',     slug:'xu-huong-lan-can-2026',      status:'published', category:'Xu hướng',      excerpt:'Top 5 xu hướng thiết kế lan can cao cấp năm 2026' },
    { type:'article', title:'So sánh Inox 304 vs 316L', slug:'so-sanh-inox-304-vs-316l',   status:'draft',     category:'Kiến thức',     excerpt:'Phân tích chi tiết sự khác biệt và ứng dụng' },
    { type:'hero',    title:'Hero Banner Trang Chủ',     slug:'hero-banner-trang-chu',      status:'published', category:'Banner',        excerpt:'Banner chính trang chủ' },
  ];

  const insert = db.prepare(`
    INSERT OR IGNORE INTO content
      (type, title, slug, status, author_id, category, excerpt, tags, is_featured, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of items) {
    insert.run(
      c.type, c.title, c.slug, c.status, adminId,
      c.category || null, c.excerpt || null,
      c.tags || null, c.is_featured || 0,
      c.status === 'published' ? new Date().toISOString() : null
    );
  }
  console.log(`✅ ${items.length} content items seeded`);

  // ── Sample links ────────────────────────────────────────
  const links = [
    { label:'Website Sao Vàng',       url:'https://saovang.vn',                  type:'website'  },
    { label:'Facebook Sao Vàng',      url:'https://facebook.com/saovang',         type:'facebook' },
    { label:'Catalogue Sản Phẩm 2026',url:'/uploads/docs/catalogue-2026.pdf',    type:'pdf'      },
    { label:'Video Giới Thiệu',       url:'https://youtube.com/watch?v=demo',    type:'youtube'  },
  ];
  const insertLink = db.prepare('INSERT OR IGNORE INTO links (label, url, type, created_by) VALUES (?, ?, ?, ?)');
  for (const l of links) insertLink.run(l.label, l.url, l.type, adminId);
  console.log(`✅ ${links.length} links seeded`);

  // ── Sample form ─────────────────────────────────────────
  const formExists = db.prepare("SELECT id FROM forms WHERE slug = 'lien-he'").get();
  if (!formExists) {
    const fields = JSON.stringify([
      { id:'f1', type:'text',     label:'Họ và tên',        required:true,  placeholder:'Nguyễn Văn A' },
      { id:'f2', type:'tel',      label:'Số điện thoại',    required:true,  placeholder:'0937729909' },
      { id:'f3', type:'email',    label:'Email',            required:false, placeholder:'email@example.com' },
      { id:'f4', type:'select',   label:'Dịch vụ quan tâm', required:true,  options:['Cơ khí nhà ở','Du thuyền','Cầu thang & Lan can','Bảo trì'] },
      { id:'f5', type:'textarea', label:'Mô tả yêu cầu',    required:false, placeholder:'Mô tả chi tiết...' },
    ]);
    db.prepare('INSERT INTO forms (name, slug, description, fields, settings, created_by) VALUES (?,?,?,?,?,?)')
      .run('Form Liên Hệ','lien-he','Form tư vấn khách hàng', fields, JSON.stringify({ submit_msg:'Cảm ơn! Chúng tôi sẽ liên hệ sớm.', email_notify:'info@saovang.vn' }), adminId);
    console.log('✅ Sample form: Form Liên Hệ');
  }

  // Force persist
  db._persist();

  console.log('\n🚀 Seed hoàn tất!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Admin URL : http://localhost:3000/admin`);
  console.log(`Login     : ${email}`);
  console.log(`Password  : ${password}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  setTimeout(() => process.exit(0), 500);
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
