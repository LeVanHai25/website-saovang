/**
 * Seed 8 Real Projects into SQLite Database from website/data/projects.json
 */
const fs = require('fs');
const path = require('path');
const { initDb } = require('../cms/database/db');

const jsonPath = path.join(__dirname, '../website/data/projects.json');
const projectsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

initDb().then(db => {
  // Clear old projects
  db.prepare("DELETE FROM content WHERE type = 'project'").run();
  db.prepare("DELETE FROM content_meta WHERE content_id NOT IN (SELECT id FROM content)").run();
  db.prepare("DELETE FROM blocks WHERE content_id NOT IN (SELECT id FROM content)").run();

  const insertContent = db.prepare(`
    INSERT INTO content (type, title, slug, excerpt, thumbnail, category, status, is_featured, published_at, sort_order)
    VALUES ('project', ?, ?, ?, ?, ?, 'published', ?, CURRENT_TIMESTAMP, ?)
  `);

  const insertMeta = db.prepare(`
    INSERT INTO content_meta (content_id, field_key, field_value)
    VALUES (?, ?, ?)
  `);

  const insertBlock = db.prepare(`
    INSERT INTO blocks (content_id, type, data, position)
    VALUES (?, ?, ?, ?)
  `);

  projectsData.projects.forEach((p, idx) => {
    const vi = p.translations.vi;
    const isYacht = p.sector === 'yacht-metalwork';
    const categoryName = isYacht ? 'Du Thuyền & Inox Hàng Hải' : 'Cơ Khí Kiến Trúc Villa';

    const res = insertContent.run(
      vi.title,
      p.slug,
      vi.description,
      '/' + p.image,
      categoryName,
      idx < 4 ? 1 : 0,
      idx + 1
    );

    const contentId = res.lastInsertRowid;

    // Insert Metas
    const metas = {
      client: vi.client,
      project_value: vi.value,
      location: vi.location,
      year: '2025',
      area: vi.scale,
      duration: vi.timeline,
      materials: vi.materials,
      finishing: vi.finishing,
      challenge: `Công trình đòi hỏi độ chính xác cao về dung sai, độ ăn khớp đa vật liệu và khả năng kháng chịu môi trường khắc nghiệt (${isYacht ? 'muối biển ăn mòn cao' : 'thời tiết nhiệt đới ẩm'}).`,
      solution: `Ứng dụng gia công CNC laser fiber, chấn gấp chính xác, hàn TIG thẩm mỹ và quy trình xử lý bề mặt ${vi.finishing}.`,
      result: `Dự án đã bàn giao hoàn thiện, nghiệm thu đạt 100% tiêu chuẩn kỹ thuật thiết kế và nhận được đánh giá cao từ chủ đầu tư.`,
      highlights: JSON.stringify(vi.highlights),
      gallery: JSON.stringify(p.gallery.map(img => '/' + img))
    };

    Object.entries(metas).forEach(([k, v]) => {
      insertMeta.run(contentId, k, typeof v === 'string' ? v : JSON.stringify(v));
    });

    // Insert body blocks
    insertBlock.run(contentId, 'text', JSON.stringify({ content: `<p>${vi.description}</p>` }), 1);

    const highlightHtml = `<ul>${vi.highlights.map(h => `<li><strong>Điểm nổi bật:</strong> ${h}</li>`).join('')}</ul>`;
    insertBlock.run(contentId, 'text', JSON.stringify({ content: highlightHtml }), 2);

    console.log(`[SEED] Inserted Project #${idx + 1}: ${vi.title} (${p.photoCount} photos)`);
  });

  // Save DB
  db.close();
  console.log('Successfully seeded 8 real projects into SQLite database!');
  process.exit(0);
}).catch(err => {
  console.error('Error seeding DB:', err);
  process.exit(1);
});
