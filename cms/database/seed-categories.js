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
    ['Cơ khí nghệ thuật','co-khi-nghe-thuat','project','#8B0000',1],
    ['Nhôm kính cao cấp','nhom-kinh-cao-cap','project','#0d4e8a',2],
    ['Du thuyền hạng sang','du-thuyen-hang-sang','project','#c8860a',3],
    ['Cửa & Vách kính','cua-vach-kinh','project','#1a3a5c',4],
    ['Cầu thang & Lan can','cau-thang-lan-can','project','#5b5b5b',5],
    ['Cổng & Hàng rào','cong-hang-rao','project','#2d5a27',6],
  ].forEach(r => ins.run(...r));

  // Product categories
  [
    ['Cửa nhôm định hình','cua-nhom-dinh-hinh','product','#0d4e8a',1],
    ['Kính cường lực & Phụ kiện','kinh-cuong-luc','product','#1a3a5c',2],
    ['Lan can & Phụ kiện Inox','lan-can-inox','product','#c8860a',3],
    ['Thép kết cấu','thep-ket-cau','product','#4a4a4a',4],
  ].forEach(r => ins.run(...r));

  // Article categories
  [
    ['Xu hướng kiến trúc','xu-huong-kien-truc','article','#c8860a',1],
    ['Kiến thức kỹ thuật','kien-thuc-ky-thuat','article','#1a3a5c',2],
    ['Tin tức Sao Vàng','tin-tuc-sao-vang','article','#2d5a27',3],
  ].forEach(r => ins.run(...r));

  // Settings
  db.prepare('INSERT OR IGNORE INTO settings (key,value,type,label,group_name) VALUES (?,?,?,?,?)').run('site_logo','','text','Logo URL','general');
  db.prepare('INSERT OR IGNORE INTO settings (key,value,type,label,group_name) VALUES (?,?,?,?,?)').run('company_short','SAO VÀNG','text','Tên viết tắt','general');
  db.prepare('INSERT OR IGNORE INTO settings (key,value,type,label,group_name) VALUES (?,?,?,?,?)').run('company_full','CÔNG TY CỔ PHẦN SẢN XUẤT CƠ KHÍ SAO VÀNG','text','Tên đầy đủ công ty','general');
  db.prepare('INSERT OR IGNORE INTO settings (key,value,type,label,group_name) VALUES (?,?,?,?,?)').run('logo_badge','SV','text','Logo badge text (2 ký tự)','general');

  db._persist();
  console.log('Categories seeded OK!');
  setTimeout(() => process.exit(0), 500);
}).catch(e => { console.error(e.message); process.exit(1); });
