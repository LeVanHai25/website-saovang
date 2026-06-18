/** Seed sample news articles for Sao Vàng */
const { initDb } = require('./db');
initDb().then(db => {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO content
    (type, title, slug, excerpt, category, status, is_featured, published_at, author_id)
    VALUES ('article',?,?,?,?,'published',?,CURRENT_TIMESTAMP,1)
  `);
  const articles = [
    { title: 'Xu Hướng Cầu Thang Inox 2024: Tối Giản & Sang Trọng', slug: 'xu-huong-cau-thang-inox-2024', excerpt: 'Năm 2024, xu hướng thiết kế cầu thang inox dịch chuyển mạnh về phong cách tối giản — kết hợp inox 304 đánh bóng gương với kính cường lực 12mm tạo nên những công trình vừa nhẹ nhàng, vừa đẳng cấp. Khám phá các mẫu cầu thang nổi bật nhất năm nay.', cat: 'Xu hướng thiết kế', featured: 1 },
    { title: 'Inox 316L vs 304: Khi Nào Nên Dùng Loại Nào?', slug: 'inox-316l-vs-304-khi-nao-dung', excerpt: 'Một trong những câu hỏi phổ biến nhất từ khách hàng: "Nên dùng inox 304 hay 316L?" Câu trả lời phụ thuộc vào môi trường sử dụng, ngân sách và yêu cầu kỹ thuật. Bài viết này sẽ giúp bạn lựa chọn đúng loại inox cho dự án của mình.', cat: 'Kiến thức vật liệu', featured: 1 },
    { title: 'Sao Vàng Hoàn Thành Du Thuyền 28m "Sao Biển" Cho Hạ Long', slug: 'hoan-thanh-du-thuyen-28m-sao-bien', excerpt: 'Sau 8 tháng thi công với hơn 50 thợ lành nghề, Sao Vàng đã bàn giao thành công du thuyền 28m "Sao Biển" cho đối tác du lịch Hạ Long. Đây là dự án du thuyền lớn nhất mà công ty từng thực hiện, với toàn bộ kết cấu inox 316L marine grade chuẩn quốc tế.', cat: 'Tin tức công ty', featured: 0 },
    { title: 'Tiêu Chuẩn Kỹ Thuật Lan Can Theo TCVN 9386:2012', slug: 'tieu-chuan-lan-can-tcvn-9386', excerpt: 'Lan can không chỉ là yếu tố thẩm mỹ mà còn là thiết bị bảo vệ sinh mạng con người. TCVN 9386:2012 quy định tải trọng thiết kế 1.0 kN/m — tức lan can phải chịu được lực ngang 100kg/m. Hiểu đúng tiêu chuẩn để lựa chọn vật liệu phù hợp.', cat: 'Kiến thức vật liệu', featured: 0 },
    { title: 'Bí Quyết Bảo Trì Inox Để Luôn Sáng Bóng Như Mới', slug: 'bao-tri-inox-sang-bong', excerpt: 'Inox 304 tuy bền nhưng vẫn có thể bị mờ, xỉn màu nếu không được bảo dưỡng đúng cách — đặc biệt ở vùng ven biển hoặc khu vực có hóa chất. Bài viết chia sẻ quy trình vệ sinh và bảo trì inox 4 bước đơn giản mà hiệu quả, giúp công trình luôn như mới.', cat: 'Kiến thức vật liệu', featured: 0 },
    { title: 'Sao Vàng Nhận Giải "Thương Hiệu Cơ Khí Mới Xuất Sắc 2024"', slug: 'giai-thuong-thuong-hieu-co-khi-moi-xuat-sac-2024', excerpt: 'Với thành tích bứt phá vượt bậc trong năm đầu thành lập 2024, hoàn thành xuất sắc nhiều công trình lớn đầu tiên đạt tiến độ 100%, Sao Vàng vinh dự nhận giải thưởng "Thương Hiệu Cơ Khí Mới Xuất Sắc 2024". Đây là bước đệm tuyệt vời để khẳng định uy tín vượt trội.', cat: 'Tin tức công ty', featured: 0 },
    { title: 'Thiết Kế Cổng Sắt Nghệ Thuật: Từ Ý Tưởng Đến Thực Tế', slug: 'thiet-ke-cong-sat-nghe-thuat', excerpt: 'Cổng sắt rèn nghệ thuật không đơn giản là "uốn sắt cho đẹp" — đó là sự kết hợp giữa kỹ thuật gia công nhiệt, thẩm mỹ kiến trúc và hiểu biết về vật liệu. Cùng Sao Vàng khám phá quy trình từ phác thảo ý tưởng đến sản phẩm hoàn thiện của một chiếc cổng dinh thự cao cấp.', cat: 'Xu hướng thiết kế', featured: 0 },
    { title: 'Kính Cường Lực 10mm Cho Lan Can: Những Điều Cần Biết', slug: 'kinh-cuong-luc-10mm-lan-can', excerpt: 'Lan can kính ngày càng được ưa chuộng vì vẻ đẹp thoáng đãng, hiện đại. Nhưng không phải loại kính nào cũng phù hợp — cần kính cường lực đúng tiêu chuẩn, khung inox phù hợp và lắp đặt đúng kỹ thuật. Hướng dẫn đầy đủ từ Sao Vàng.', cat: 'Kiến thức vật liệu', featured: 0 },
  ];
  articles.forEach(a => insert.run(a.title, a.slug, a.excerpt, a.cat, a.featured));
  db._persist();
  console.log(`Seeded ${articles.length} articles!`);
  setTimeout(() => process.exit(0), 500);
}).catch(e => { console.error(e.message); process.exit(1); });
