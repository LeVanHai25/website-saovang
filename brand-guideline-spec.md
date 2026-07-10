# HƯỚNG DẪN QUY CHUẨN THƯƠNG HIỆU & HỆ THỐNG PHÁP LÝ (BRAND SPECIFICATION)
## SAO VÀNG — B2B Industrial Mechanical & Architectural Glass
### Phiên bản: 1.0 | Ngày ban hành: 09/07/2026

---

## 1. ĐỊNH VỊ THƯƠNG HIỆU (BRAND IDENTITY)

Theo kết quả tra cứu pháp lý nhãn hiệu số **02 NH 260629** ngày 29/06/2026 từ Cục Sở hữu Trí tuệ (được tư vấn bởi ENCOLAWS), thương hiệu của chúng ta được chia thành hai luồng nhận diện riêng biệt nhằm tránh xung đột sở hữu trí tuệ:

### 1.1. Thương hiệu doanh nghiệp & Dịch vụ: SAO VÀNG
* **Phạm vi bảo hộ độc quyền:** Nhóm 19 (Kính xây dựng), Nhóm 35 (Thương mại kính & cơ khí), Nhóm 37 (Thi công xây dựng cơ khí & kính), Nhóm 40 (Gia công cơ khí kim loại).
* **Ứng dụng:** Tên pháp nhân công ty, dịch vụ gia công cơ khí chính xác, chế tạo kết cấu thép, cơ khí mỹ thuật, và các hoạt động ký kết hợp đồng thầu phụ.
* **Tagline định vị:** *Đẳng Cấp Kỹ Nghệ • Kiến Tạo Giá Trị Bền Vững*

### 1.2. Thương hiệu dòng sản phẩm: SV ALUMINIUM
* **Phạm vi bảo hộ độc quyền:** Nhóm 06 (Thanh nhôm định hình, cửa nhôm, phụ kiện hợp kim nhôm) và giữ nguyên toàn bộ mảng thương mại, thi công lắp đặt liên quan đến nhôm.
* **Ứng dụng:** Nhãn hiệu in trên các sản phẩm thanh nhôm định hình, hệ cửa nhôm kính cao cấp, vách kính mặt dựng, lan can kính và các catalogue giới thiệu hệ nhôm.
* **Tagline định vị:** *Nâng Tầm Kiến Trúc*

---

## 2. HỆ THỐNG MÀU SẮC (COLOR SYSTEM)

Màu sắc thương hiệu của Sao Vàng phải được quản lý thống nhất thông qua các biến màu (Design Tokens) trong CSS, tuyệt đối không sử dụng các mã màu hardcode khác trong giao diện.

| Nhóm màu | Tên biến CSS | Mã màu HEX | Ứng dụng & Quy định |
|---|---|---|---|
| **Đỏ Brand** | `--sv-red-600` | `#9B1C1C` | Màu đỏ thương hiệu chính. Dùng cho Header, Footer, và các nút CTA chính của phân hệ Nhôm. |
| **Đỏ Tối** | `--sv-red-850` | `#7B1212` | Nền background của Footer trang chủ và các trang con. |
| **Vàng Gold** | `--sv-gold-600` | `#C9A227` | Màu vàng thương hiệu chính. Dùng cho accents, icons, hover button và số liệu statistics. |
| **Vàng Đậm** | `--sv-gold-800` | `#9A7818` | **BẮT BUỘC** dùng cho chữ (Text) màu vàng trên nền sáng để đạt tiêu chuẩn tương phản WCAG AA. |
| **Nền Tối** | `--sv-dark-900` | `#0A0A0A` | Màu nền chủ đạo của Hero Section và các vùng tối (dark mode) của website. |
| **Nền Sáng** | `--sv-gray-025` | `#F7F7F7` | Nền chung cho các section nội dung sáng màu để tạo chiều sâu trực quan. |

---

## 3. HỆ THỐNG PHÔNG CHỮ (TYPOGRAPHY)

* **Font chữ tiêu đề (Heading Font):** `Montserrat`
  * *Quy chuẩn:* Viết hoa (uppercase), font-weight tối thiểu `700` (Bold) hoặc `900` (Black).
  * *letter-spacing:* `var(--sv-tracking-wide)` (`0.05em`) đối với tiêu đề nhỏ và `0.1em` đối với tiêu đề lớn để mang lại cảm giác công nghiệp, vững chãi.
* **Font chữ nội dung (Body Font):** `Inter`
  * *Quy chuẩn:* Font-weight `400` (Regular) hoặc `500` (Medium).
  * *line-height:* `1.6` (24px đối với cỡ chữ 15px tiêu chuẩn) để đảm bảo độ dễ đọc tối đa trên thiết bị di động.

---

## 4. TIÊU CHUẨN TIẾP CẬN WCAG 2.1 AA (ACCESSIBILITY)

Tất cả các thành phần giao diện khi được thiết kế hoặc cập nhật phải đạt mức độ tiếp cận **WCAG 2.1 AA**:
1. **Tỷ lệ tương phản chữ (Contrast Ratio):**
   * Chữ nhỏ (dưới 18px): Tỷ lệ tương phản tối thiểu là **4.5:1** so với nền. Do màu vàng gold `--sv-gold-600` trên nền trắng chỉ đạt **2.1:1**, tuyệt đối không được viết chữ màu vàng này trực tiếp trên nền trắng. Phải thay bằng màu vàng sậm `--sv-gold-800` (#9A7818) hoặc dùng màu đỏ `#9B1C1C` trên nền trắng.
2. **Keyboard Focus:**
   * Mọi liên kết và button khi được nhấn phím Tab phải có viền outline nổi bật: `outline: 2px solid var(--sv-gold-600); outline-offset: 2px;`.
3. **Mô tả hình ảnh (Alt Text):**
   * Mọi thẻ `<img>` bắt buộc phải có thuộc tính `alt` mô tả nội dung hình ảnh thực tế (Ví dụ: `alt="Máy gia công trung tâm CNC Haas tại xưởng Cơ Khí Sao Vàng"`). Không dùng alt chung chung như `alt="ảnh dự án"` hoặc để trống.

---

## 5. ĐỒNG BỘ SIÊU DỮ LIỆU PHÁP LÝ (CORPORATE METADATA SSoT)

Tất cả tài liệu tiếp thị, hồ sơ năng lực và website phải sử dụng bộ thông tin pháp lý đồng bộ sau:

* **Tên doanh nghiệp chính thức:** CÔNG TY CỔ PHẦN SẢN XUẤT CƠ KHÍ SAO VÀNG
* **Mã số thuế:** `0110808047`
* **Địa chỉ trụ sở chính (Pháp lý & Schema):** Tầng 3, TT7-35 Khu đô thị Văn Phú, phường Phú La, quận Hà Đông, TP Hà Nội, Việt Nam.
* **Văn phòng giao dịch & Nhà xưởng (Contact page):** 171 Đường Đi Bộ Hà Nội, Phường Khâu Hùng, Hà Nội.
* **Hotline kỹ thuật & bán hàng:** `0869 590 279`
* **Email chính thức:** `cokhisaovangvn@gmail.com`
* **Website Canonical Domain:** `https://www.cokhisaovang.com`

---

## 6. QUY CHUẨN MEDIA & TƯ LIỆU THỰC TẾ (MEDIA GUIDELINE)

* **Không sử dụng ảnh Stock:** Cấm tuyệt đối việc sử dụng ảnh từ Unsplash hoặc Shutterstock cho các dự án và máy móc. Nếu chưa có ảnh thật, sử dụng ảnh render từ bản vẽ 3D thiết kế của Sao Vàng.
* **Quy cách định dạng:**
  * Toàn bộ ảnh xuất bản phải được nén sang định dạng `.webp` chất lượng nén 80-85%.
  * File ảnh gốc phải được đặt tên theo cấu trúc: `[linh-vuc]-[ten-san-pham]-[kich-thuoc/loai].webp` (Ví dụ: `ck-cua-cong-cnc-01.webp`).
  * Tất cả hình ảnh trong HTML phải khai báo rõ thuộc tính `width` và `height` trên thẻ `<img>` để tối ưu chỉ số CLS (Cumulative Layout Shift) của Google.

---

## 7. CHECKLIST TÍN HIỆU TIN CẬY (TRUST SIGNALS CHECKLIST)

Mỗi trang landing page dịch vụ thầu phải hiển thị tối thiểu 3 trong 6 tín hiệu tin cậy sau:
- [ ] Mã số thuế doanh nghiệp liên kết đến trang tra cứu quốc gia.
- [ ] Ảnh chụp hoặc bản quét PDF chứng nhận ISO 9001:2015.
- [ ] Ảnh chụp thực tế máy móc thiết bị có logo Sao Vàng dán trực tiếp.
- [ ] Bản đồ nhúng địa điểm Google Maps văn phòng và nhà xưởng.
- [ ] Logo chứng chỉ hàn của kỹ sư thi công (chứng chỉ AWS).
- [ ] Nút tải hồ sơ năng lực (Capability Statement) bản PDF thực tế.
