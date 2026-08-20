import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

curated_projects = [
    {
        "id": "sv-proj-yacht-tulip",
        "slug": "yacht-tulip",
        "sector": "yacht-metalwork",
        "system": "yacht-railing",
        "badge": "Du Thuyền 5 Sao",
        "title": "Du Thuyền Nghỉ Dưỡng 5 Sao Tulip Cruise",
        "client": "Công ty CP Du Thuyền Quốc Tế Tulip",
        "location": "Vịnh Hạ Long & Vịnh Lan Hạ, Quảng Ninh",
        "scale": "Du thuyền nghỉ dưỡng 5 sao vỏ thép 4 tầng boong, 48 phòng VIP",
        "categories": [
            "Lan can Inox 316 hàng hải toàn bộ 4 tầng boong",
            "Lan can kính mạn tàu & boong ngắm cảnh Sundeck 360°",
            "Hệ thống máng thu thoát nước Inox 316 hàn TIG kín nước",
            "Cụm louver điều hòa, lam chắn gió buồng máy và nẹp chỉ cabin"
        ],
        "materials": "100% Inox 316 / Inox 316L Marine Grade, Kính dán an toàn 2 lớp 15.52mm, Bulông Inox 316",
        "finishing": "Đánh bóng gương siêu mịn (Mirror Polish Ra < 0.2µm) & Hoàn thiện Satin mờ",
        "tolerance": "Dung sai uốn cong 3D theo vỏ tàu < 1.5mm, Mối hàn phẳng nhẵn 100%",
        "timeline": "90 ngày (Khảo sát vỏ tàu -> Gia công module -> Lắp dựng & Nghiệm thu tại âu tàu)",
        "value": "2.400.000.000 VNĐ",
        "description": "Dự án du thuyền 5 sao siêu sang tại Vịnh Hạ Long, đòi hỏi toàn bộ hệ thống lan can và phụ kiện kim loại phải đáp ứng tiêu chuẩn kháng ăn mòn muối biển khắt khe nhất, đồng thời đạt độ bóng gương hoàn mỹ phục vụ du khách thượng lưu quốc tế.",
        "challenge": "Thân vỏ tàu có độ cong 3D phức tạp, thay đổi liên tục từ mũi đến đuôi tàu. Môi trường biển mặn có độ ẩm và hàm lượng ion muối cao, dễ gây ăn mòn rỗ (pitting) tại các vị trí mối hàn nếu không được xử lý chuyên sâu.",
        "solution": "Sao Vàng tiến hành lấy dưỡng 3D trực tiếp trên thân tàu, lập bản vẽ Shop Drawing gia công từng module tại xưởng. Ứng dụng công nghệ hàn TIG khí Argon tinh khiết, sau đó xử lý tẩy mối hàn và thụ động hóa bề mặt (Passivation) kết hợp đánh bóng gương Mirror Polish Ra < 0.2µm.",
        "result": "Toàn bộ 4 tầng lan can Inox 316 ôm khít theo đường cong thân tàu, bề mặt sáng bóng phản chiếu hoàn hảo dưới ánh hoàng hôn vịnh biển, không xuất hiện bất kỳ vết ố hay ăn mòn sau thời gian dài vận hành.",
        "highlights": [
            "100% vật tư chuẩn mác thép Inox 316/316L Marine Grade chuyên dụng cho môi trường biển mặn.",
            "Kỹ thuật uốn 3D ôm sát độ cong khí động học của vỏ tàu với dung sai dưới 1.5mm.",
            "Quy trình thụ động hóa mối hàn triệt tiêu hoàn toàn nguy cơ rỉ sét tại các điểm liên kết."
        ],
        "gallery": [
            { "url": "assets/images/projects/yacht-tulip/hero.jpg", "caption": "Toàn cảnh hệ lan can Inox 316 & boong ngắm cảnh Sundeck du thuyền Tulip Cruise" },
            { "url": "assets/images/projects/yacht-tulip/detail-01.jpg", "caption": "Đường ống Inox 316 uốn cong 3D ôm trọn mạn tàu với bề mặt đánh bóng gương siêu mịn" },
            { "url": "assets/images/projects/yacht-tulip/detail-02.jpg", "caption": "Hệ lan can kính vô cực boong trên – mở rộng tầm nhìn 360 độ ngắm cảnh Vịnh Hạ Long" },
            { "url": "assets/images/projects/yacht-tulip/detail-03.jpg", "caption": "Cụm Louver điều hòa buồng máy Inox 316 cấu tạo 2 lớp chống tạt nước biển" },
            { "url": "assets/images/projects/yacht-tulip/detail-04.jpg", "caption": "Mối ghép đối đầu hàn TIG vi sinh được mài phẳng nhẵn và xử lý thụ động hóa" },
            { "url": "assets/images/projects/yacht-tulip/detail-05.jpg", "caption": "Chi tiết chân cột lan can bắt bulông âm sàn gia cường chịu lực gió bão cấp cao" }
        ]
    },
    {
        "id": "sv-proj-villa-anvuong",
        "slug": "villa-an-vuong",
        "sector": "residential-metalwork",
        "system": "balustrade-railing",
        "badge": "Biệt Thự Cao Cấp",
        "title": "Biệt Thự Cao Cấp An Vượng Villa",
        "client": "Tư gia Chủ đầu tư (KĐT Nam Cường)",
        "location": "KĐT Dương Nội, Nam Cường, Hà Đông, Hà Nội",
        "scale": "Biệt thự song lập 3 tầng + 1 tum (Diện tích sàn ~450m²)",
        "categories": [
            "Hệ lan can kính cường lực an toàn âm sàn toàn bộ ban công",
            "Tay vịn Inox 304 xước mờ Hairline gia công góc bo liền khối",
            "Khung kim loại bảo vệ, lam trang trí giếng trời & sảnh đón",
            "Chi tiết nẹp hoàn thiện liên kết đa vật liệu kim loại – đá – kính"
        ],
        "materials": "Inox 304 Architectural Grade, Kính dán an toàn 2 lớp 13.52mm phôi Low-Iron siêu trong, Chân ngàm Inox đúc",
        "finishing": "Xước mịn Hairline tinh xảo, Sơn nhiệt ngoài trời chống oxy hóa",
        "tolerance": "Độ thẳng góc lan can kính < 1mm/m, Khe hở ngàm khít tuyệt đối",
        "timeline": "45 ngày (Khảo sát lấy dưỡng -> Chế tác xưởng -> Lắp dựng hoàn thiện)",
        "value": "680.000.000 VNĐ",
        "description": "Dự án biệt thự hiện đại phong cách tối giản (Minimalism) tại KĐT Nam Cường, yêu cầu hệ lan can ban công thanh thoát, tối ưu hóa tầm nhìn sân vườn mà vẫn đảm bảo tiêu chuẩn an toàn chịu tải trọng cấp độ cao.",
        "challenge": "Chủ đầu tư yêu cầu loại bỏ hoàn toàn các trụ đỡ bằng kim loại cồng kềnh để tạo cảm giác kính tràn viền vô cực, đồng thời phải đảm bảo kính không bị rung lắc hay rạn nứt trước các cơn giông lốc mùa mưa bão miền Bắc.",
        "solution": "Sao Vàng thiết kế giải pháp chân ngàm Inox 304 đặc chịu lực âm sàn bê tông, gia cố liên kết bulông nở hóa chất chuyên dụng. Kính dán an toàn 13.52mm siêu trong được định vị bằng đệm cao su kỹ thuật EPDM đàn hồi cao.",
        "result": "Hệ lan can kính đứng vững chãi, mép trên kính phẳng tắp kết hợp cùng tay vịn Inox xước Hairline đồng màu, nâng tầm giá trị thẩm mỹ tổng thể cho toàn bộ mặt tiền biệt thự.",
        "highlights": [
            "Giải pháp ngàm âm sàn giấu chân trụ, tạo hiệu ứng kính tràn viền không giới hạn tầm nhìn.",
            "Kính dán an toàn Low-Iron có độ trong suốt vượt trội, không ngả xanh như kính thông thường.",
            "Tay vịn Inox xước Hairline cao cấp chống bám vân tay và không bám bụi bẩn."
        ],
        "gallery": [
            { "url": "assets/images/projects/villa-an-vuong/hero.jpg", "caption": "Mặt tiền biệt thự An Vượng Villa với hệ lan can kính âm sàn hiện đại và sang trọng" },
            { "url": "assets/images/projects/villa-an-vuong/detail-01.jpg", "caption": "Hiệu ứng kính tràn viền vô cực mở rộng tối đa tầm nhìn ra khuôn viên cảnh quan" },
            { "url": "assets/images/projects/villa-an-vuong/detail-02.jpg", "caption": "Tay vịn Inox 304 xước mờ Hairline uốn góc mượt mà, cảm giác cầm nắm chắc chắn" },
            { "url": "assets/images/projects/villa-an-vuong/detail-03.jpg", "caption": "Khe ngàm âm sàn chèn đệm cao su EPDM đàn hồi chống rung lắc và chống nứt kính" },
            { "url": "assets/images/projects/villa-an-vuong/detail-04.jpg", "caption": "Nẹp chỉ kim loại hoàn thiện sắc nét tại điểm tiếp giáp giữa kính và đá ban công" }
        ]
    },
    {
        "id": "sv-proj-yacht-azura",
        "slug": "yacht-azura",
        "sector": "yacht-metalwork",
        "system": "yacht-railing",
        "badge": "Du Thuyền Nghỉ Dưỡng",
        "title": "Du Thuyền Nghỉ Dưỡng Azura Cruise",
        "client": "Đơn vị Quản lý Khai thác Du thuyền Azura",
        "location": "Cảng Tuần Châu / Vịnh Hạ Long, Quảng Ninh",
        "scale": "Du thuyền tham quan & nghỉ dưỡng cao cấp 3 tầng",
        "categories": [
            "Lan can mạn tàu Inox 316 đánh bóng gương cao cấp",
            "Hệ lan can vách kính boong trên và khu vực mũi tàu",
            "Cụm Louver kỹ thuật thoát nhiệt hệ thống điều hòa trung tâm",
            "Máng xối Inox 316 và cầu thang boong kỹ thuật"
        ],
        "materials": "Inox 316 Marine Grade, Kính cường lực an toàn 12mm, Phụ kiện Inox 316",
        "finishing": "Đánh bóng gương (Mirror Polish) & Hoàn thiện Satin mờ",
        "tolerance": "Độ tròn đường ống sau uốn không méo mép, Dung sai < 1.0mm",
        "timeline": "60 ngày",
        "value": "1.600.000.000 VNĐ",
        "description": "Dự án hoàn thiện cơ khí du thuyền Azura Cruise với các hạng mục lan can mạn tàu, vách kính chắn gió mũi tàu và cụm louver thông gió buồng máy, tối ưu độ bền trong môi trường gió biển độ mặn cao.",
        "challenge": "Hệ thống vách kính mạn tàu phải chịu được xung áp của gió bão và rung chấn liên tục khi động cơ tàu hoạt động ở công suất cao.",
        "solution": "Chế tạo chân ngàm kẹp kính từ Inox 316 nguyên khối phay CNC chính xác, tích hợp gioăng chống rung silicon chuyên dụng hàng hải. Các đoạn lan can được chia module tiêu chuẩn lắp ráp bắt bulông kín khít.",
        "result": "Bàn giao đúng tiến độ hạ thủy của chủ tàu, toàn bộ hệ kết cấu đạt tiêu chuẩn đăng kiểm hàng hải, tăng thêm nét đẳng cấp cho du thuyền.",
        "highlights": [
            "Chân ngàm kẹp kính CNC từ phôi Inox 316 đặc chịu tải trọng va đập lớn.",
            "Louver điều hòa tối ưu khí động học, ngăn 99% tia nước biển bắn vào buồng máy.",
            "Bề mặt Inox đánh bóng gương cao cấp không bám bẩn và dễ dàng vệ sinh."
        ],
        "gallery": [
            { "url": "assets/images/projects/yacht-azura/hero.jpg", "caption": "Hệ lan can Inox 316 sáng bóng cùng vách kính mạn tàu du thuyền Azura Cruise" },
            { "url": "assets/images/projects/yacht-azura/detail-01.jpg", "caption": "Chi tiết chân ngàm kính Inox 316 phay CNC nguyên khối chắc chắn" },
            { "url": "assets/images/projects/yacht-azura/detail-02.jpg", "caption": "Mối hàn TIG vi sinh phẳng mịn, xử lý đánh bóng gương không để lại vết nối" },
            { "url": "assets/images/projects/yacht-azura/detail-03.jpg", "caption": "Hệ thống louver thoát nhiệt buồng máy Inox 316 gia công tinh xảo" },
            { "url": "assets/images/projects/yacht-azura/detail-04.jpg", "caption": "Bậc thang và tay vịn Inox 316 hoàn thiện an toàn cho du khách lên xuống boong" }
        ]
    },
    {
        "id": "sv-proj-villa-dothanh",
        "slug": "villa-do-thanh",
        "sector": "residential-metalwork",
        "system": "staircase-handrail",
        "badge": "Biệt Thự Tư Gia",
        "title": "Biệt Thự Đô Thành Villa",
        "client": "Tư gia Chủ đầu tư cao cấp",
        "location": "Khu Biệt thự Đô Thành, Việt Nam",
        "scale": "Biệt thự đơn lập sân vườn (Diện tích sàn ~600m²)",
        "categories": [
            "Cầu thang kết cấu thép bản dày chịu lực kết hợp tay vịn kim loại",
            "Hệ lan can ban công thép hộp định hình sơn PU ngoài trời",
            "Hàng rào kim loại bảo vệ khuôn viên đồng bộ kiến trúc",
            "Khung kim loại trang trí logia và hiên sau"
        ],
        "materials": "Thép kết cấu tiêu chuẩn SS400, Inox 304, Sơn Epoxy giàu kẽm + Sơn PU chống thời tiết",
        "finishing": "Sơn tĩnh điện & Sơn PU 2 thành phần ngoài trời, Mối hàn mài phẳng nhẵn",
        "tolerance": "Độ võng xương thang < L/500, Dung sai mối ghép < 0.8mm",
        "timeline": "60 ngày",
        "value": "850.000.000 VNĐ",
        "description": "Tổ hợp cơ khí kiến trúc hoàn thiện từ nội thất đến ngoại thất cho biệt thự Đô Thành, yêu cầu cao về độ cứng vững của kết cấu dầm thang và độ mịn màng của các đường nét kim loại.",
        "challenge": "Xương thang thép bản dài hơn 6 mét không được dùng cột chống giữa nhà để giữ trọn không gian thông thoáng, đòi hỏi tính toán kết cấu ngàm tường cực kỳ chuẩn xác.",
        "solution": "Sử dụng thép bản SS400 cắt laser CNC, thiết kế dạng dầm hộp ngàm âm dầm bê tông. Toàn bộ bề mặt thép được phun cát làm sạch Sa 2.5 trước khi sơn phủ Epoxy chống rỉ và PU hoàn thiện.",
        "result": "Cầu thang vững chãi, bước chân êm ái không hề có độ rung, đường nét mạnh mẽ hiện đại trở thành tâm điểm của không gian phòng khách biệt thự.",
        "highlights": [
            "Kết cấu xương thang dầm thép chịu lực không trụ chống, thanh thoát và bề thế.",
            "Quy trình sơn phủ bảo vệ 4 lớp chống bong tróc và ngả màu theo thời gian.",
            "Mối hàn thép mài phẳng mịn tạo cảm giác như một khối đúc liền mạch."
        ],
        "gallery": [
            { "url": "assets/images/projects/villa-do-thanh/hero.jpg", "caption": "Hệ lan can ban công & hàng rào kim loại biệt thự Đô Thành Villa" },
            { "url": "assets/images/projects/villa-do-thanh/detail-01.jpg", "caption": "Cầu thang kết cấu thép bản chịu lực thanh thoát không trụ chống giữa nhà" },
            { "url": "assets/images/projects/villa-do-thanh/detail-02.jpg", "caption": "Hệ tay vịn kim loại uốn định hình liên kết liền khối mượt mà" },
            { "url": "assets/images/projects/villa-do-thanh/detail-03.jpg", "caption": "Mối ghép góc được xử lý phẳng mịn trước khi sơn sấy tĩnh điện" },
            { "url": "assets/images/projects/villa-do-thanh/detail-04.jpg", "caption": "Hàng rào kim loại bảo vệ khuôn viên đồng bộ với tỷ lệ mặt đứng biệt thự" }
        ]
    },
    {
        "id": "sv-proj-yacht-calista",
        "slug": "yacht-calista",
        "sector": "yacht-metalwork",
        "system": "yacht-louver",
        "badge": "Du Thuyền Boutique",
        "title": "Du Thuyền Calista Cruise",
        "client": "Calista Cruises Vietnam",
        "location": "Vịnh Hạ Long, Tỉnh Quảng Ninh",
        "scale": "Du thuyền du lịch boutique sang trọng",
        "categories": [
            "Hệ louver thông gió và lấy khí tươi buồng máy chống tạt nước",
            "Hệ thống máng thoát nước boong Inox gia công uốn theo độ dốc",
            "Tay vịn Inox boong tàu và khu vực nhà hàng ngoài trời",
            "Nẹp chỉ kim loại ốp trang trí ngoại thất cabin"
        ],
        "materials": "100% Inox 316 & 316L Marine Grade chuyên dụng",
        "finishing": "Satin Hairline & Đánh bóng gương",
        "tolerance": "Độ kín khít máng xối 100%, Dung sai cánh louver < 1mm",
        "timeline": "45 ngày",
        "value": "1.100.000.000 VNĐ",
        "description": "Gia công chuyên sâu các hạng mục cơ khí kỹ thuật du thuyền Calista Cruise, tối ưu khả năng đối lưu không khí buồng máy và thoát nước mưa boong tàu trong điều kiện hành trình dài ngày trên biển.",
        "challenge": "Buồng máy phát điện sinh nhiệt lượng lớn, cần lưu lượng gió tươi cao nhưng tuyệt đối không được để hơi sương muối và nước mưa xâm nhập làm hỏng máy móc.",
        "solution": "Thiết kế cụm louver Inox 316 cấu trúc cánh bẫy nước 2 tầng chữ Z. Nước mưa được gạt giữ lại và dẫn thoát ra ngoài theo rãnh đáy, trong khi luồng khí tươi lưu thông tự nhiên.",
        "result": "Hệ thống vận hành hoàn hảo, buồng máy luôn khô ráo và mát mẻ, các chi tiết máng nước inox sáng bóng và sạch sẽ.",
        "highlights": [
            "Cấu tạo cánh Louver Z-Blade thông minh ngăn nước mưa và bụi muối biển tuyệt đối.",
            "Máng thoát nước Inox 316 uốn độ dốc chính xác, nước thoát tức thì không ứ đọng.",
            "Vật tư 100% Inox 316L chống ăn mòn lỗ trong môi trường nhiệt đới ẩm mặn."
        ],
        "gallery": [
            { "url": "assets/images/projects/yacht-calista/hero.jpg", "caption": "Hệ louver và chi tiết cơ khí hoàn thiện boong du thuyền Calista Cruise" },
            { "url": "assets/images/projects/yacht-calista/detail-01.jpg", "caption": "Cụm louver Inox 316 bẫy nước 2 tầng lấy khí tươi cho buồng máy" },
            { "url": "assets/images/projects/yacht-calista/detail-02.webp", "caption": "Máng thoát nước boong Inox 316 hàn TIG kín nước chạy dọc thân tàu" },
            { "url": "assets/images/projects/yacht-calista/detail-03.jpg", "caption": "Chi tiết tay vịn Inox boong tàu đánh bóng gương phản chiếu sắc nét" },
            { "url": "assets/images/projects/yacht-calista/detail-04.jpg", "caption": "Nẹp trang trí kim loại viền kính cabin sang trọng và tinh tế" }
        ]
    },
    {
        "id": "sv-proj-villa-linhhue",
        "slug": "villa-linh-hue",
        "sector": "residential-metalwork",
        "system": "gate-fence",
        "badge": "Biệt Thự Tân Cổ Điển",
        "title": "Biệt Thự Linh Huệ Villa",
        "client": "Gia đình Anh/Chị Linh Huệ",
        "location": "Khu biệt thự cao cấp, Việt Nam",
        "scale": "Biệt thự lâu đài tân cổ điển (Diện tích khuôn viên ~800m²)",
        "categories": [
            "Cổng chính biệt thự bằng thép & inox kết cấu mỹ thuật mạ màu cao cấp",
            "Hệ thống bản lề chịu tải lớn tích hợp motor cổng tự động âm sàn",
            "Lan can ban công uốn lượn phong cách tân cổ điển",
            "Hàng rào kim loại bao quanh khuôn viên và cổng phụ"
        ],
        "materials": "Thép rèn đặc uốn mỹ thuật, Khung chịu lực Inox/Thép bản dày, Sơn bảo vệ 4 lớp",
        "finishing": "Sơn giả cổ đồng cao cấp phủ bóng bảo vệ ngoài trời",
        "tolerance": "Khe hở cánh cổng < 5mm trên tổng chiều cao 3.8m, Bản lề không xệ cánh",
        "timeline": "50 ngày",
        "value": "920.000.000 VNĐ",
        "description": "Bộ cổng chính và hàng rào biệt thự Linh Huệ Villa là kiệt tác cơ khí mỹ thuật thủ công kết hợp kỹ thuật cơ khí chính xác, tạo nên vẻ đẹp uy nghi bề thế cho công trình lâu đài tân cổ điển.",
        "challenge": "Cánh cổng có trọng lượng lên đến hơn 1 tấn mỗi bên, kết cấu hoa văn rèn đặc đòi hỏi hệ bản lề chịu lực cực kỳ chính xác để không bị xệ cánh hay kẹt motor tự động sau nhiều năm vận hành.",
        "solution": "Gia công cụm bản lề cối chịu lực bằng thép hợp kim nhiệt luyện và vòng bi kín nước. Cánh cổng được căn chỉnh thăng bằng tuyệt đối trên bàn dưỡng trước khi lắp ráp hiện trường.",
        "result": "Cổng đóng mở êm ái chỉ với một nút bấm điều khiển, hoa văn kim loại rèn uốn tinh xảo sơn màu đồng cổ sang trọng tôn vinh đẳng cấp của gia chủ.",
        "highlights": [
            "Cánh cổng chịu tải trọng trên 1 tấn vận hành êm nhẹ với motor âm sàn thông minh.",
            "Hoa văn rèn mỹ thuật thủ công có chiều sâu và độ sắc nét cao.",
            "Lớp sơn giả cổ đồng phủ bóng PU cao cấp không phai màu trước thời tiết nắng mưa."
        ],
        "gallery": [
            { "url": "assets/images/projects/villa-linh-hue/hero.jpg", "caption": "Bộ cổng chính biệt thự lâu đài Linh Huệ Villa với hoa văn mỹ thuật uy nghi" },
            { "url": "assets/images/projects/villa-linh-hue/detail-01.jpg", "caption": "Chi tiết hoa văn rèn tay thủ công tinh xảo trên nền khung thép bản dày" },
            { "url": "assets/images/projects/villa-linh-hue/detail-02.jpg", "caption": "Cụm bản lề cối chịu lực gia công chính xác chống xệ cánh tuyệt đối" },
            { "url": "assets/images/projects/villa-linh-hue/detail-03.jpg", "caption": "Hàng rào kim loại bảo vệ đồng bộ ngôn ngữ tân cổ điển bao quanh khuôn viên" },
            { "url": "assets/images/projects/villa-linh-hue/detail-04.jpg", "caption": "Lớp sơn giả cổ đồng cao cấp ánh sắc kim loại bền bỉ ngoài trời" }
        ]
    },
    {
        "id": "sv-proj-yacht-leona",
        "slug": "yacht-leona",
        "sector": "yacht-metalwork",
        "system": "yacht-railing",
        "badge": "Du Thuyền Tham Quan",
        "title": "Du Thuyền Leona Cruise Hạ Long",
        "client": "Leona Cruise Group",
        "location": "Cảng tàu khách Quốc tế Hạ Long, Quảng Ninh",
        "scale": "Du thuyền tham quan trong ngày (Day Cruise) chuẩn VIP",
        "categories": [
            "Lan can Inox 316 boong ngắm cảnh tầng 2 và tầng 3",
            "Vách kính chắn gió phía trước mũi tàu",
            "Khung cửa Inox và tay vịn hành lang du khách",
            "Máng nước Inox và phụ kiện liên kết boong"
        ],
        "materials": "Inox 316 Marine Grade, Kính dán an toàn 2 lớp, Phụ kiện Inox 316",
        "finishing": "Đánh bóng gương (Mirror Polish)",
        "tolerance": "Chân trụ chịu lực tải trọng ngang > 150kg/m theo chuẩn đăng kiểm",
        "timeline": "40 ngày",
        "value": "950.000.000 VNĐ",
        "description": "Dự án sản xuất và lắp dựng hoàn thiện hệ lan can Inox 316 và kính chắn gió mũi tàu cho du thuyền tham quan Leona Cruise tại Cảng Quốc tế Hạ Long.",
        "challenge": "Tàu phục vụ hàng trăm du khách mỗi ngày nên hệ lan can cần có khả năng chịu lực tựa tựa lớn, tay vịn thoải mái và bề mặt bóng gương ít bám dấu vân tay, dễ lau chùi nhanh giữa các ca chạy tour.",
        "solution": "Tăng cường độ dày thành ống Inox 316 lên 2.0mm, gia cố bản mã chân trụ âm sàn boong thép. Bề mặt được xử lý đánh bóng gương theo cấp độ quang học hạn chế tối đa bám bẩn.",
        "result": "Hệ thống lan can vững chãi, sáng bóng lộng lẫy dưới ánh nắng mặt trời, mang lại sự an tâm tuyệt đối và trải nghiệm ngắm cảnh trọn vẹn cho du khách.",
        "highlights": [
            "Độ dày ống Inox 316 tiêu chuẩn 2.0mm chịu tải trọng đông người tựa ngắm cảnh an toàn.",
            "Bề mặt Inox Mirror Polish sáng bóng, vệ sinh lau chùi nhanh chóng.",
            "Khung kính chắn gió mũi tàu chịu áp lực gió lớn khi tàu chạy tốc độ cao."
        ],
        "gallery": [
            { "url": "assets/images/projects/yacht-leona/hero.webp", "caption": "Lan can Inox 316 sáng bóng boong ngắm cảnh du thuyền Leona Cruise Hạ Long" },
            { "url": "assets/images/projects/yacht-leona/detail-01.jpg", "caption": "Hệ lan can mạn tàu bo góc mượt mà đón ánh sáng tự nhiên trên vịnh" },
            { "url": "assets/images/projects/yacht-leona/detail-02.png", "caption": "Chi tiết chân trụ lan can Inox 316 bắt bulông âm sàn gia cường chịu lực" },
            { "url": "assets/images/projects/yacht-leona/detail-03.png", "caption": "Vách kính chắn gió phía trước mũi tàu mở rộng góc nhìn toàn cảnh" },
            { "url": "assets/images/projects/yacht-leona/detail-04.png", "caption": "Tay vịn Inox boong hành lang hoàn thiện trơn nhẵn thoải mái khi di chuyển" }
        ]
    },
    {
        "id": "sv-proj-villa-thanhhoa",
        "slug": "villa-thanh-hoa",
        "sector": "residential-metalwork",
        "system": "custom-metal",
        "badge": "Nhà Ở Cao Cấp",
        "title": "Công Trình Nhà Ở Cao Cấp Thanh Hóa",
        "client": "Chủ đầu tư tư nhân",
        "location": "TP. Thanh Hóa, Tỉnh Thanh Hóa",
        "scale": "Nhà phố biệt thự 4 tầng kết hợp kinh doanh cao cấp",
        "categories": [
            "Mái kính canopy sảnh chính kết cấu khung thép treo chịu lực",
            "Hệ lan can ban công kính kết hợp tay vịn kim loại",
            "Khung thép trang trí giếng trời lấy sáng tự nhiên",
            "Cửa cổng và vách ngăn kim loại theo thiết kế"
        ],
        "materials": "Thép hình I/H kết cấu, Kính cường lực 15mm, Phụ kiện Spider Inox 304, Sơn Epoxy",
        "finishing": "Sơn tĩnh điện & Sơn PU 2 thành phần chống gỉ",
        "tolerance": "Độ phẳng bề mặt mái kính < 1mm, Không đọng nước mưa",
        "timeline": "35 ngày",
        "value": "550.000.000 VNĐ",
        "description": "Hạng mục mái sảnh kính canopy vươn dài và hệ lan can kính mặt tiền cho công trình nhà ở cao cấp tại TP. Thanh Hóa, tạo nên diện mạo kiến trúc hiện đại và bề thế.",
        "challenge": "Mái sảnh kính có độ vươn lớn hơn 3 mét ra vỉa hè, cần tính toán giải pháp ty treo chịu tải trọng gió bão miền Trung mà không tạo cảm giác nặng nề.",
        "solution": "Ứng dụng hệ khung dầm thép hình kết hợp ty treo Inox chịu lực kéo cao. Máng gom nước mưa được giấu âm kín đáo bên trong dầm thép, dẫn nước xả thẳng vào ống thoát ngầm.",
        "result": "Mái sảnh nhẹ nhàng thanh thoát như đang bay lơ lửng, tạo điểm nhấn ấn tượng cho mặt tiền và che chắn mưa nắng hoàn hảo cho sảnh đón tiếp.",
        "highlights": [
            "Hệ ty treo chịu lực mái sảnh vươn dài trên 3 mét đảm bảo an toàn gió bão.",
            "Máng gom nước mưa âm kín đáo giúp mái luôn sạch sẽ không rớt nước viền.",
            "Hệ lan can kính cường lực 15mm thanh thoát, đón gió và ánh sáng tự nhiên."
        ],
        "gallery": [
            { "url": "assets/images/projects/villa-thanh-hoa/hero.jpg", "caption": "Mái kính canopy sảnh đón khung thép treo bề thế công trình Thanh Hóa" },
            { "url": "assets/images/projects/villa-thanh-hoa/detail-01.jpg", "caption": "Chi tiết ty treo Inox chịu lực kéo cao liên kết dầm sảnh vững chãi" },
            { "url": "assets/images/projects/villa-thanh-hoa/detail-02.jpg", "caption": "Hệ lan can ban công kính cường lực thanh thoát và đón gió" },
            { "url": "assets/images/projects/villa-thanh-hoa/detail-03.jpg", "caption": "Khung thép trang trí giếng trời lấy sáng tự nhiên cho toàn bộ ngôi nhà" },
            { "url": "assets/images/projects/villa-thanh-hoa/detail-04.jpg", "caption": "Mối nối kính xử lý silicon kết cấu chống dột và chống thấm nước tuyệt đối" }
        ]
    }
]

final_projects = []

for p in curated_projects:
    p_record = {
        "id": p["id"],
        "slug": p["slug"],
        "sector": p["sector"],
        "system": p["system"],
        "badge": p["badge"],
        "image": p["gallery"][0]["url"],
        "gallery": [g["url"] for g in p["gallery"]],
        "galleryWithCaptions": p["gallery"],
        "photoCount": len(p["gallery"]),
        "translations": {
            "vi": {
                "title": p["title"],
                "client": p["client"],
                "location": p["location"],
                "scale": p["scale"],
                "categories": p["categories"],
                "materials": p["materials"],
                "finishing": p["finishing"],
                "tolerance": p["tolerance"],
                "timeline": p["timeline"],
                "value": p["value"],
                "description": p["description"],
                "challenge": p["challenge"],
                "solution": p["solution"],
                "result": p["result"],
                "highlights": p["highlights"],
                "status": "Đã nghiệm thu bàn giao 100%"
            },
            "en": {
                "title": p["title"],
                "client": p["client"],
                "location": p["location"],
                "scale": p["scale"],
                "categories": p["categories"],
                "materials": p["materials"],
                "finishing": p["finishing"],
                "tolerance": p["tolerance"],
                "timeline": p["timeline"],
                "value": p["value"],
                "description": p["description"],
                "challenge": p["challenge"],
                "solution": p["solution"],
                "result": p["result"],
                "highlights": p["highlights"],
                "status": "Handed over 100%"
            }
        }
    }
    final_projects.append(p_record)

full_data = {
    "taxonomy": {
        "sectors": ["residential-metalwork", "yacht-metalwork", "custom-metalwork"],
        "systems": ["balustrade-railing", "staircase-handrail", "gate-fence", "canopy-skylight", "yacht-railing", "yacht-louver", "yacht-drainage", "custom-metal"],
        "materials": ["stainless-steel-316", "stainless-steel-304", "structural-steel", "tempered-glass", "laminated-glass"]
    },
    "projects": final_projects
}

out_file = r"d:\Sao Vàng\Website-SaoVang\website\data\projects.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(full_data, f, ensure_ascii=False, indent=2)

print(f"Successfully generated curated projects showcase database with {len(final_projects)} projects!")
total_images = sum(p["photoCount"] for p in final_projects)
print(f"Total curated premium images: {total_images}")
for p in final_projects:
    print(f" - {p['id']}: {p['translations']['vi']['title']} ({p['photoCount']} curated photos)")
