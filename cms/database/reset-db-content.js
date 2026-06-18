/**
 * SAO VÀNG — Database Reset & Seeding Script for 15 Premium Projects
 */
const { initDb } = require('./db');

initDb().then(db => {
  // 1. Clear existing projects and services
  db.prepare("DELETE FROM content WHERE type = 'project' OR type = 'service'").run();
  db.prepare("DELETE FROM content_meta WHERE content_id NOT IN (SELECT id FROM content)").run();
  db.prepare("DELETE FROM blocks WHERE content_id NOT IN (SELECT id FROM content)").run();
  console.log('Cleared existing projects, services, meta and blocks.');

  // 2. Insert services
  const services = [
    { title: 'Chế Tác Cơ Khí Nghệ Thuật', slug: 'co-khi-nghe-thuat', type: 'service' },
    { title: 'Cửa Nhôm & Cửa Sổ', slug: 'cua-nhom-cua-so', type: 'service' },
    { title: 'Vách Kính & Mặt Dựng', slug: 'vach-kinh-mat-dung', type: 'service' },
    { title: 'Cầu Thang & Lan Can', slug: 'cau-thang-lan-can', type: 'service' },
    { title: 'Cổng & Hàng Rào', slug: 'cong-hang-rao', type: 'service' },
    { title: 'Bảo Trì & Dịch Vụ', slug: 'bao-tri-dich-vu', type: 'service' },
  ];

  const serviceInsert = db.prepare(`
    INSERT INTO content (type, title, slug, status, is_featured, published_at)
    VALUES (?, ?, ?, 'published', 0, CURRENT_TIMESTAMP)
  `);

  services.forEach(s => {
    serviceInsert.run(s.type, s.title, s.slug);
    console.log(`Inserted service: ${s.title}`);
  });

  // 3. Define 15 highly detailed projects
  const projects = [
    {
      title: 'Cầu thang xoắn nghệ thuật Penthouse Ciputra',
      slug: 'cau-thang-xoan-ciputra',
      category: 'Cầu thang & Lan can',
      thumbnail: '/assets/images/project-penthouse.png',
      excerpt: 'Tác phẩm cầu thang xoắn ốc kết cấu thép uốn mỹ thuật sơn tĩnh điện kết hợp tay vịn inox mạ vàng sang trọng.',
      featured: 1,
      meta: {
        client: 'Anh Nguyễn Hoàng Gia',
        project_value: '850 triệu VNĐ',
        location: 'KĐT Ciputra, Hà Nội',
        year: '2025',
        area: '45 m²',
        duration: '45 ngày',
        challenge: 'Vận chuyển thép tấm lốc 12mm lên penthouse tầng 38 qua giếng trời nhỏ hẹp. Đảm bảo độ dung sai kết cấu xoắn ốc dưới 1mm để kính cường lực uốn cong khít hoàn hảo.',
        solution: 'Sử dụng công nghệ cắt laser fiber CNC cắt bản mã tại xưởng. Chia module cầu thang thành 3 phân đoạn, cẩu kéo chuyên dụng từ tầng mái và lắp ráp cơ khí chính xác bằng liên kết hàn argon kết hợp bulông cường độ cao.',
        result: 'Cầu thang hoàn thành đúng hạn, kết cấu vững chãi tuyệt đối, đạt độ thẩm mỹ cao, tay vịn inox mạ vàng gương PVD không tỳ vết. Chủ đầu tư đánh giá rất cao.',
        gallery: JSON.stringify([
          '/assets/images/project-penthouse.png',
          '/assets/images/service-artistic-stairs.png',
          '/assets/images/hero-interior.png',
          '/assets/images/team-workshop.png'
        ])
      }
    },
    {
      title: 'Cổng nhôm đúc chân không Chateau Phú Mỹ Hưng',
      slug: 'biet-thu-chateau-phu-my-hung',
      category: 'Cổng & Hàng rào',
      thumbnail: '/assets/images/project-mansion-gate.png',
      excerpt: 'Hạng mục cổng nhôm đúc chân không nguyên khối và hàng rào sắt mỹ nghệ uốn thủ công tinh xảo sơn phủ đồng giả cổ.',
      featured: 1,
      meta: {
        client: 'Biệt thự Chateau Phú Mỹ Hưng',
        project_value: '1.2 tỷ VNĐ',
        location: 'Quận 7, TP.HCM',
        year: '2025',
        area: '38 m²',
        duration: '60 ngày',
        challenge: 'Cổng chính cao 4.2m nặng gần 2 tấn yêu cầu đúc nguyên tấm không ghép nối để đảm bảo tính mỹ thuật hoàng gia, đồng thời hệ thống bản lề tự động âm sàn phải chịu tải trọng bền bỉ.',
        solution: 'Áp dụng công nghệ đúc chân không hợp kim nhôm chất lượng cao tại xưởng cơ khí Sao Vàng. Thiết kế khuôn mẫu CNC độ chi tiết cực cao. Hệ thống mô-tơ cổng tự động âm sàn nhập khẩu từ Ý chịu tải tới 2.5 tấn.',
        result: 'Sản phẩm hoàn thiện lộng lẫy, bề mặt sơn mạ đồng giả cổ 5 lớp chống oxi hóa vượt trội trước muối biển. Vận hành êm ái, trơn tru thông qua remote và điện thoại.',
        gallery: JSON.stringify([
          '/assets/images/project-mansion-gate.png',
          '/assets/images/service-cast-gates.png',
          '/assets/images/project-villa.png'
        ])
      }
    },
    {
      title: 'Mặt dựng kính Unitized toà nhà Techcombank Hà Nội',
      slug: 'vach-kinh-techcombank',
      category: 'Vách kính & Mặt dựng',
      thumbnail: '/assets/images/service-glass-facades.png',
      excerpt: 'Thiết kế lắp đặt hệ vách kính dựng Unitized khổ lớn sử dụng nhôm hệ nhập khẩu và kính hộp Low-E cản nhiệt vượt trội.',
      featured: 1,
      meta: {
        client: 'Tổng thầu Coteccons / Ngân hàng Techcombank',
        project_value: '15 tỷ VNĐ',
        location: 'Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
        year: '2025',
        area: '5,200 m²',
        duration: '120 ngày',
        challenge: 'Thi công mặt ngoài toà nhà trung tâm thành phố với áp lực thời gian lớn, yêu cầu hệ số an toàn chịu lực gió bão cao và độ cách âm tuyệt đối giữa các tầng văn phòng.',
        solution: 'Sử dụng hệ thống thanh nhôm định hình cao cấp và kính hộp Low-E dán an toàn hai lớp cách nhiệt. Lắp ghép dạng tấm Unitized hoàn thiện trực tiếp tại xưởng Sao Vàng trước khi đưa ra công trường cẩu lắp ráp treo.',
        result: 'Đạt tiến độ xuất sắc trước 10 ngày. Hệ mặt dựng đạt các chỉ số kiểm tra độ kín nước, độ kín khí và chịu tải gió theo tiêu chuẩn quốc tế ASTM.',
        gallery: JSON.stringify([
          '/assets/images/service-glass-facades.png',
          '/assets/images/product-glass.png',
          '/assets/images/workshop_cnc.png'
        ])
      }
    },
    {
      title: 'Cửa nhôm Slim Villa Vinhomes Ocean Park',
      slug: 'cua-nhom-vinhomes-ocean-park',
      category: 'Cửa nhôm & Cửa sổ',
      thumbnail: '/assets/images/project-vinhomes-villa.png',
      excerpt: 'Hệ thống cửa sổ và cửa đi trượt nâng nhôm Xingfa Class A cao cấp tích hợp phụ kiện Cogo đồng bộ.',
      featured: 1,
      meta: {
        client: 'Chú Nguyễn Huy Hoàng',
        project_value: '2.1 tỷ VNĐ',
        location: 'KĐT Vinhomes Ocean Park, Gia Lâm, Hà Nội',
        year: '2026',
        area: '320 m²',
        duration: '50 ngày',
        challenge: 'Biệt thự mặt hồ có diện tích mở kính cực lớn, yêu cầu cánh cửa nhôm trượt Slim cao 3.2m siêu mảnh nhưng phải chịu được sức hút gió lớn và không bị thấm nước khi mưa bão.',
        solution: 'Thiết kế thanh nhôm Slim profile siêu dày 2.2mm gia cường lõi thép. Tích hợp kính hộp temper 8-12-8mm bơm khí trơ cách âm cách nhiệt. Toàn bộ phụ kiện tay nắm, bánh xe giảm chấn nhập khẩu đồng bộ Đức.',
        result: 'Hệ cửa mở trượt êm nhẹ bằng một ngón tay, view panorama không góc chết ra hồ nước tuyệt đẹp. Khả năng chống ồn và cản nhiệt điều hòa giảm hoá đơn điện tới 30%.',
        gallery: JSON.stringify([
          '/assets/images/project-vinhomes-villa.png',
          '/assets/images/service-aluminum-doors.png',
          '/assets/images/product-glass.png'
        ])
      }
    },
    {
      title: 'Lan can Inox Marine du thuyền Horizon 32m',
      slug: 'du-thuyen-horizon-lan-can-316l',
      category: 'Du thuyền',
      thumbnail: '/assets/images/project-saobien-yacht.png',
      excerpt: 'Chế tác và lắp đặt hoàn chỉnh hệ lan can boong tàu chịu mặn vượt trội bằng thép không gỉ 316L đánh bóng hairline.',
      featured: 1,
      meta: {
        client: 'Công ty Du thuyền Viễn Đông',
        project_value: '450 triệu VNĐ',
        location: 'Cảng Tuần Châu, Hạ Long, Quảng Ninh',
        year: '2025',
        area: '110 mét tới',
        duration: '30 ngày',
        challenge: 'Môi trường biển mặn khắc nghiệt cực kỳ dễ làm rỉ sét inox thông thường. Các mối hàn phải được đánh bóng hoàn toàn phẳng để chống bám muối đọng nước gây ăn mòn.',
        solution: 'Sử dụng inox chuyên dụng hàng hải Inox Marine 316L nhập khẩu từ Nhật Bản. Kỹ thuật hàn TIG khí Argon bảo vệ nghiêm ngặt. Đánh bóng điện hóa kết hợp đánh bóng hairline thủ công đạt độ nhẵn gương.',
        result: 'Hệ lan can có tính chống chịu ăn mòn xuất sắc, không hề có hiện tượng gỉ vàng sau 1 năm chạy biển. Độ sáng bóng sang trọng nâng tầm đẳng cấp chiếc du thuyền.',
        gallery: JSON.stringify([
          '/assets/images/project-saobien-yacht.png',
          '/assets/images/project-yacht.png',
          '/assets/images/welding_work.png'
        ])
      }
    },
    {
      title: 'Cầu thang kính xoắn ốc Villa nghỉ dưỡng Đà Lạt',
      slug: 'cau-thang-kinh-da-lat',
      category: 'Cầu thang & Lan can',
      thumbnail: '/assets/images/project-dalat-villa.png',
      excerpt: 'Kiến trúc cầu thang xoắn độc bản uốn lượn mềm mại kết cấu thép bản mã đôi, lan can kính chịu lực cong 15mm.',
      featured: 1,
      meta: {
        client: 'Chị Trần Thuỳ Trang',
        project_value: '650 triệu VNĐ',
        location: 'Phường 4, TP. Đà Lạt, Lâm Đồng',
        year: '2025',
        area: '32 m²',
        duration: '40 ngày',
        challenge: 'Độ ẩm Đà Lạt cao dễ gây rỉ sét kết cấu sắt bên trong. Yêu cầu lắp đặt kính cong chịu lực 15mm gia nhiệt chính xác theo đường lượn của dầm thép uốn cong kép.',
        solution: 'Kết cấu dầm xoắn kép sơn phủ epoxy chống ẩm cao cấp của Jotun. Đo đạc bằng máy quét laser 3D trước khi đặt gia công kính uốn cong temper tại nhà máy chuyên dụng.',
        result: 'Chiếc cầu thang trở thành điểm nhấn kiến trúc nghệ thuật lung linh giữa trung tâm phòng khách villa, thu hút mọi ánh nhìn từ khách tới thăm.',
        gallery: JSON.stringify([
          '/assets/images/project-dalat-villa.png',
          '/assets/images/service-artistic-stairs.png',
          '/assets/images/product-railing.png'
        ])
      }
    },
    {
      title: 'Cổng sắt rèn nghệ thuật Dinh thự Starlake Tây Hồ',
      slug: 'cong-sat-r-starlake',
      category: 'Cổng & Hàng rào',
      thumbnail: '/assets/images/product-gate.png',
      excerpt: 'Cổng chính biệt thự chế tác từ sắt vuông đặc rèn tay thủ công mỹ nghệ, kết hợp chi tiết hoa văn mạ vàng 24K sang quý.',
      featured: 1,
      meta: {
        client: 'Bác Phạm Quang Nghĩa',
        project_value: '950 triệu VNĐ',
        location: 'KĐT Starlake Tây Hồ Tây, Bắc Từ Liêm, Hà Nội',
        year: '2025',
        area: '24 m²',
        duration: '45 ngày',
        challenge: 'Yêu cầu các chi tiết uốn lượn đối xứng tuyệt đối qua trục cổng. Sắt rèn tay phải có bề mặt gai rèn cổ điển đặc thù nhưng không được có xỉ hàn hay lỗi rỗ nứt.',
        solution: 'Đội ngũ nghệ nhân rèn uốn sắt uốn tay nóng ở nhiệt độ 1100°C. Xử lý bề mặt bằng công nghệ phun cát áp lực cao loại bỏ tạp chất, nhúng kẽm nóng chống gỉ sét vĩnh viễn trước khi sơn phủ màu.',
        result: 'Tác phẩm cổng sắt nghệ thuật tinh xảo khẳng định vị thế và gu thẩm mỹ đỉnh cao cổ điển của gia chủ dinh thự.',
        gallery: JSON.stringify([
          '/assets/images/product-gate.png',
          '/assets/images/service-cast-gates.png',
          '/assets/images/service-mechanical-art.png'
        ])
      }
    },
    {
      title: 'Vách kính mặt dựng Unitized toà nhà VP Duy Tân',
      slug: 'vach-kinh-vp-duy-tan',
      category: 'Vách kính & Mặt dựng',
      thumbnail: '/assets/images/product-glass.png',
      excerpt: 'Lắp đặt hệ thống vách dựng nhôm Xingfa hệ 65 dày 2.5mm kết hợp kính dán phản quang cản nhiệt cho văn phòng.',
      featured: 0,
      meta: {
        client: 'Công ty Cổ phần Đầu tư Hòa Bình',
        project_value: '8.5 tỷ VNĐ',
        location: 'Duy Tân, Cầu Giấy, Hà Nội',
        year: '2025',
        area: '2,800 m²',
        duration: '90 ngày',
        challenge: 'Đảm bảo thi công an toàn trên cao tại mặt tiền đường phố đông đúc sầm uất. Kính phản quang chống lóa nhưng phải giữ được độ sáng truyền dẫn tự nhiên tối ưu.',
        solution: 'Thiết kế biện pháp bao che lưới chắn bụi và chống rơi chuyên dụng. Sử dụng kính dán an toàn phản quang xanh biển nhập khẩu của Bỉ, hệ khung nhôm sơn tĩnh điện độ bền màu 20 năm.',
        result: 'Hệ mặt dựng hoàn thành bóng bẩy, phản chiếu mây trời tuyệt đẹp, giải quyết triệt để vấn đề chói nắng hướng Tây của tòa nhà văn phòng.',
        gallery: JSON.stringify([
          '/assets/images/product-glass.png',
          '/assets/images/service-glass-facades.png',
          '/assets/images/laser_cutting.png'
        ])
      }
    },
    {
      title: 'Cửa nhôm Xingfa Class A Biệt thự Ecopark Grand',
      slug: 'cua-nhom-ecopark-grand',
      category: 'Cửa nhôm & Cửa sổ',
      thumbnail: '/assets/images/product-inox-pipe.png',
      excerpt: 'Toàn bộ hệ thống cửa đi, cửa sổ nhôm Xingfa Class A phủ PVDF cao cấp tích hợp phụ kiện cao cấp chính hãng.',
      featured: 0,
      meta: {
        client: 'Anh Lê Hoàng Nam',
        project_value: '1.8 tỷ VNĐ',
        location: 'KĐT Ecopark Grand - The Island, Hưng Yên',
        year: '2025',
        area: '260 m²',
        duration: '45 ngày',
        challenge: 'Khu biệt thự đảo có gió lốc hồ rất mạnh kèm độ ẩm hơi nước cao. Cửa đi mở quay yêu cầu cách âm tốt để giữ không gian nghỉ dưỡng tĩnh lặng.',
        solution: 'Ứng dụng dòng nhôm Xingfa Class A với công nghệ sơn kháng muối biển. Sử dụng gioăng EPDM 3 lớp cao cấp cách âm, cách nước tuyệt đối, phụ kiện SIGICO Đức đồng bộ màu champagne.',
        result: 'Cửa đóng mở chắc nịch như xe hơi hạng sang, khả năng ngăn mưa bão tràn nước đạt 100% kiểm nghiệm thực tế.',
        gallery: JSON.stringify([
          '/assets/images/product-inox-pipe.png',
          '/assets/images/service-aluminum-doors.png',
          '/assets/images/team_engineers.png'
        ])
      }
    },
    {
      title: 'Hệ thống lan can sắt mỹ thuật Resort Flamingo Đại Lải',
      slug: 'lan-can-flamingo-dai-lai',
      category: 'Cầu thang & Lan can',
      thumbnail: '/assets/images/product-railing.png',
      excerpt: 'Gia công lắp đặt hệ thống lan can ban công uốn sắt mỹ nghệ đồng bộ cho 120 căn villa nghỉ dưỡng sinh thái.',
      featured: 0,
      meta: {
        client: 'Tập đoàn Flamingo Group',
        project_value: '3.2 tỷ VNĐ',
        location: 'Flamingo Đại Lải, Vĩnh Phúc',
        year: '2026',
        area: '980 mét tới',
        duration: '75 ngày',
        challenge: 'Thời gian thi công đồng loạt cực kỳ gấp rút. Chất lượng các ban công sắt phải đồng đều tăm tắp dù làm bằng tay nghệ nhân uốn.',
        solution: 'Sử dụng khuôn uốn mẫu định hình thủy lực CNC gia công hàng loạt phôi sắt dẻo. Hàn kết cấu bằng đồ gá chính xác tại xưởng Sao Vàng. Chia 3 đội thi công lắp ráp cuốn chiếu liên tục.',
        result: 'Bàn giao vượt tiến độ 5 ngày. Dự án đạt tiêu chuẩn thẩm mỹ hài hòa với thiên nhiên xanh mát của resort Flamingo.',
        gallery: JSON.stringify([
          '/assets/images/product-railing.png',
          '/assets/images/service-artistic-stairs.png',
          '/assets/images/workshop_cnc.png'
        ])
      }
    },
    {
      title: 'Mái kính nghệ thuật Biệt thự Ciputra Tây Hồ',
      slug: 'mai-kinh-ciputra-tay-ho',
      category: 'Cơ khí nghệ thuật',
      thumbnail: '/assets/images/service-mechanical-art.png',
      excerpt: 'Hệ mái che kính cường lực sảnh chính kết cấu khung thép uốn mỹ thuật và hoa văn đúc cổ điển.',
      featured: 0,
      meta: {
        client: 'Anh Nguyễn Minh Đức',
        project_value: '520 triệu VNĐ',
        location: 'Khu Q, KĐT Ciputra, Tây Hồ, Hà Nội',
        year: '2025',
        area: '35 m²',
        duration: '25 ngày',
        challenge: 'Yêu cầu kết cấu chịu lực treo consol vươn xa 3m không dùng cột đỡ dưới sảnh, đảm bảo không rung lắc dưới sức gió mạnh.',
        solution: 'Tính toán mô phỏng chịu lực trên phần mềm SAP2000 chuyên dụng. Khung thép hộp cường độ cao hàn liên kết bulông hóa chất Ramset cấy sâu vào dầm bê tông cốt thép toà nhà.',
        result: 'Mái kính vững chãi thanh thoát, che chắn mưa hiệu quả và tạo nên diện mạo mặt tiền biệt thự vô cùng sang trọng.',
        gallery: JSON.stringify([
          '/assets/images/service-mechanical-art.png',
          '/assets/images/laser_cutting.png',
          '/assets/images/project-villa.png'
        ])
      }
    },
    {
      title: 'Cầu thang kết cấu thép xương cá Villa Tây Hồ',
      slug: 'cau-thang-xuong-ca-tay-ho',
      category: 'Cầu thang & Lan can',
      thumbnail: '/assets/images/product-staircase.png',
      excerpt: 'Cầu thang kết cấu khung xương thép hộp đôi chịu lực giấu kín, mặt bậc gỗ lim Nam Phi tự nhiên sang trọng.',
      featured: 0,
      meta: {
        client: 'Anh Hoàng Văn Sơn',
        project_value: '350 triệu VNĐ',
        location: 'Phố Quảng Khánh, Tây Hồ, Hà Nội',
        year: '2025',
        area: '28 m²',
        duration: '35 ngày',
        challenge: 'Yêu cầu kết cấu treo bậc thoáng không rung khi bước chân đi lại nhanh, gỗ mặt bậc không nứt nẻ cong vênh dưới độ ẩm hồ Tây.',
        solution: 'Kết cấu tấm thép hộp dày 8mm hàn liên kết định vị vững vàng vào tường chịu lực. Gỗ mặt bậc xử lý sấy tẩm chân không đạt độ ẩm tiêu chuẩn 12% chống co ngót.',
        result: 'Bàn giao cầu thang đi êm ru không tiếng động nhỏ, tạo không gian mở thông thoáng ngập ánh sáng cho giếng trời biệt thự.',
        gallery: JSON.stringify([
          '/assets/images/product-staircase.png',
          '/assets/images/service-artistic-stairs.png',
          '/assets/images/team_engineers.png'
        ])
      }
    },
    {
      title: 'Hệ cửa trượt nâng nhôm Civro Biệt thự mặt biển Hạ Long',
      slug: 'cua-nhom-civro-ha-long',
      category: 'Cửa nhôm & Cửa sổ',
      thumbnail: '/assets/images/project-resort-yacht.png',
      excerpt: 'Hệ thống cửa đi trượt nâng siêu phân khúc Civro Đức kết hợp kính hộp cản nhiệt Low-E 19mm.',
      featured: 1,
      meta: {
        client: 'Bác Trần Minh Tuấn',
        project_value: '2.8 tỷ VNĐ',
        location: 'KĐT Bán đảo Tuần Châu, Hạ Long, Quảng Ninh',
        year: '2026',
        area: '180 m²',
        duration: '55 ngày',
        challenge: 'Công trình sát mép nước biển, gió bão biển cực lớn giật cấp 12. Kính hộp khổ lớn nặng 300kg/cánh yêu cầu kéo đẩy siêu êm nhẹ.',
        solution: 'Hệ thống thanh nhôm cầu cách nhiệt Civro dày 3.0mm mạ anodized màu ghi xám cao cấp nhất. Phụ kiện bánh xe ray trượt nâng Sobinco chịu lực vượt trội nâng hạ nhẹ nhàng.',
        result: 'Cửa siêu chịu bão, đóng kín hoàn toàn cách âm tiếng sóng biển rì rào đem lại sự tĩnh lặng tuyệt hảo bên trong dinh thự.',
        gallery: JSON.stringify([
          '/assets/images/project-resort-yacht.png',
          '/assets/images/service-aluminum-doors.png',
          '/assets/images/workshop_cnc.png'
        ])
      }
    },
    {
      title: 'Cầu thang xoắn xương cá inox gương lâu đài Ninh Bình',
      slug: 'cau-thang-inox-guong-ninh-binh',
      category: 'Cầu thang & Lan can',
      thumbnail: '/assets/images/project-yacht.png',
      excerpt: 'Tác phẩm nghệ thuật cầu thang xoắn ốc uốn thép uốn lượn, tay vịn và ốp ngoài inox mạ vàng gương sáng loáng.',
      featured: 0,
      meta: {
        client: 'Dinh thự lâu đài Thành Thắng',
        project_value: '1.4 tỷ VNĐ',
        location: 'TP. Ninh Bình, Tỉnh Ninh Bình',
        year: '2025',
        area: '55 m²',
        duration: '70 ngày',
        challenge: 'Bề mặt inox mạ vàng gương rất dễ xước khi uốn lượn và hàn. Đòi hỏi kỹ thuật hàn ngầm mài giũa đánh bóng thủ công đỉnh cao không được thấy vết ghép nối.',
        solution: 'Ốp các module inox mạ gương PVD bảo vệ màng film dày. Kỹ sư Sao Vàng chế tác mài đánh bóng mirror bóng loáng liên tiếp bằng nỉ lông cừu đạt độ bóng soi gương.',
        result: 'Tác phẩm nghệ thuật lộng lẫy phản chiếu ánh đèn chùm pha lê nguy nga, nhận được lời tán dung nồng nhiệt từ gia chủ lâu đài.',
        gallery: JSON.stringify([
          '/assets/images/project-yacht.png',
          '/assets/images/service-artistic-stairs.png',
          '/assets/images/welding_work.png'
        ])
      }
    },
    {
      title: 'Hàng rào cổng nhôm đúc Biệt thự đảo Ecopark Grand',
      slug: 'hang-rao-nhom-duc-ecopark',
      category: 'Cổng & Hàng rào',
      thumbnail: '/assets/images/project-villa.png',
      excerpt: 'Hạng mục thi công đồng bộ cổng nhôm đúc mỹ thuật và hệ hàng rào bảo vệ mạ kẽm sơn tĩnh điện biệt thự mặt hồ.',
      featured: 1,
      meta: {
        client: 'Chú Hoàng Kim Long',
        project_value: '2.2 tỷ VNĐ',
        location: 'KĐT Ecopark Grand, Hưng Yên',
        year: '2025',
        area: '88 m²',
        duration: '65 ngày',
        challenge: 'Hàng rào uốn cong chạy dài bao bọc sườn biệt thự đảo hướng ra lòng hồ nước, yêu cầu thẩm mỹ thoáng đãng hài hòa cảnh quan sinh thái biệt thự đảo.',
        solution: 'Đúc các modul hàng rào nhôm nguyên tấm hoa văn cổ điển tối giản tinh tế. Trụ cổng xây ốp đá tự nhiên kết hợp đèn cổng đúc đồng đồng bộ.',
        result: 'Công trình hàng rào cổng vững chãi an toàn, bảo vệ tuyệt đối biệt thự trong khi tôn vinh vẻ đẹp kiến trúc xanh đẳng cấp.',
        gallery: JSON.stringify([
          '/assets/images/project-villa.png',
          '/assets/images/service-cast-gates.png',
          '/assets/images/workshop_cnc.png'
        ])
      }
    }
  ];

  const projInsert = db.prepare(`
    INSERT INTO content (type, title, slug, excerpt, category, status, is_featured, thumbnail, published_at)
    VALUES ('project', ?, ?, ?, ?, 'published', ?, ?, CURRENT_TIMESTAMP)
  `);

  const metaInsert = db.prepare(`
    INSERT INTO content_meta (content_id, field_key, field_value, field_type)
    VALUES (?, ?, ?, 'text')
  `);

  const blockInsert = db.prepare(`
    INSERT INTO blocks (content_id, type, position, data, visible)
    VALUES (?, 'text', 0, ?, 1)
  `);

  projects.forEach((p, index) => {
    // Insert content
    const info = projInsert.run(p.title, p.slug, p.excerpt, p.category, p.featured, p.thumbnail);
    const contentId = info.lastInsertRowid;
    console.log(`Inserted project #${contentId}: ${p.title}`);

    // Insert metadata
    Object.entries(p.meta).forEach(([key, val]) => {
      metaInsert.run(contentId, key, val);
    });

    // Insert rich body block with detailed project review
    const blockData = JSON.stringify({
      content: `<p>${p.excerpt}</p>
      <h3 style="margin-top:20px;color:var(--red);font-weight:700">Quy Trình Thi Công Thực Tế:</h3>
      <ul style="margin-left:20px;margin-top:10px;line-height:1.8">
        <li><strong>Bước 1 (Before):</strong> Khảo sát thực tế mặt bằng hiện trạng bằng thiết bị quét 3D laser tiên tiến, dựng mô phỏng kết cấu thép và vách kính trên phần mềm Tekla/Revit để khách hàng và chủ đầu tư kiểm duyệt.</li>
        <li><strong>Bước 2 (During):</strong> Cắt laser fiber phôi thép tấm CNC, nghệ nhân uốn rèn tay các hoa văn sắt mỹ thuật thủ công ở nhiệt độ đỏ rực hoặc đúc hút chân không nhôm nguyên khối. Toàn bộ mối hàn được hàn TIG/MIG chuyên dụng bảo vệ khí Argon bởi đội thợ đạt chứng chỉ quốc tế AWS/ASME.</li>
        <li><strong>Bước 3 (After):</strong> Xử lý bề mặt phun cát mạ kẽm nhúng nóng chống gỉ sét trọn đời, sơn lót epoxy kháng ẩm chống ăn mòn muối biển và phủ màu mạ titan sang trọng. Vận chuyển lắp ráp cẩu kéo module an toàn và cân chỉnh cơ khí hoàn hảo tại công trình.</li>
      </ul>`
    });
    blockInsert.run(contentId, blockData);
  });

  db._persist();
  console.log('Database content reset successfully with 15 highly detailed projects!');
  setTimeout(() => process.exit(0), 500);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
