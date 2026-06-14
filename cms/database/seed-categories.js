const { initDb } = require('./db');
initDb().then(db => {
  db.exec(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, slug TEXT NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'project',
    description TEXT, color TEXT DEFAULT '#c8860a',
    icon TEXT, sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(slug, content_type)
  )`);

  const ins = db.prepare('INSERT OR IGNORE INTO categories (name,slug,content_type,color,sort_order) VALUES (?,?,?,?,?)');

  // Project categories
  [
    ['Nhà ở & Biệt thự','nha-o-biet-thu','project','#8B0000',1],
    ['Du thuyền','du-thuyen','project','#c8860a',2],
    ['Cầu thang & Lan can','cau-thang-lan-can','project','#1a3a5c',3],
    ['Cổng & Hàng rào','cong-hang-rao','project','#2d5a27',4],
    ['Khung thép kết cấu','khung-thep','project','#4a4a4a',5],
    ['Công trình công cộng','cong-trinh-cong-cong','project','#7B3F00',6],
  ].forEach(r => ins.run(...r));

  // Product categories
  [
    ['Vật liệu Inox','vat-lieu-inox','product','#c8860a',1],
    ['Kính & Phụ kiện','kinh-phu-kien','product','#1a3a5c',2],
    ['Thép kết cấu','thep-ket-cau','product','#4a4a4a',3],
    ['Vật liệu hàng hải','vat-lieu-hang-hai','product','#0d4e8a',4],
    ['Sơn & Bảo vệ bề mặt','son-bao-ve','product','#2d5a27',5],
    ['Thiết bị gia công','thiet-bi-gia-cong','product','#7B3F00',6],
  ].forEach(r => ins.run(...r));

  // Article categories
  [
    ['Xu hướng thiết kế','xu-huong','article','#c8860a',1],
    ['Kiến thức vật liệu','kien-thuc','article','#1a3a5c',2],
    ['Tin tức công ty','tin-tuc-cong-ty','article','#2d5a27',3],
    ['Dự án nổi bật','du-an-noi-bat','article','#8B0000',4],
  ].forEach(r => ins.run(...r));

  // Settings
  db.prepare('INSERT OR IGNORE INTO settings (key,value,type,label,group_name) VALUES (?,?,?,?,?)').run('site_logo','','text','Logo URL','general');
  db.prepare('INSERT OR IGNORE INTO settings (key,value,type,label,group_name) VALUES (?,?,?,?,?)').run('company_short','SAO VÀNG','text','Tên viết tắt','general');
  db.prepare('INSERT OR IGNORE INTO settings (key,value,type,label,group_name) VALUES (?,?,?,?,?)').run('company_full','Công ty TNHH ĐT TM và DV Kỹ Thuật Sao Vàng','text','Tên đầy đủ công ty','general');
  db.prepare('INSERT OR IGNORE INTO settings (key,value,type,label,group_name) VALUES (?,?,?,?,?)').run('logo_badge','SV','text','Logo badge text (2 ký tự)','general');

  db._persist();
  console.log('Categories seeded OK!');
  setTimeout(() => process.exit(0), 500);
}).catch(e => { console.error(e.message); process.exit(1); });
