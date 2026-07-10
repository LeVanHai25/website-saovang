# TÀI LIỆU HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM SPECIFICATION)
## SAO VÀNG — Design System v2.0
### Ngày cập nhật: 09/07/2026

---

## 1. HỆ BIẾN DESIGN TOKENS (CSS VARIABLES)

Toàn bộ hệ thống giao diện được kiểm soát tập trung qua các Custom Properties tại [tokens.css](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/website/assets/css/v2/tokens.css).

### 1.1. Bảng màu thương hiệu (Brand Palette)
* **Đỏ Thương Hiệu (Primary):** `--sv-red-600` (`#9B1C1C`) — màu đỏ đặc trưng của cơ khí công nghiệp nặng.
* **Vàng Gold (Accent):** `--sv-gold-600` (`#C9A227`) — màu vàng kim tạo điểm nhấn, thể hiện sự cao cấp của dòng sản phẩm SV Aluminium.
* **Vàng Sậm Đạt Chuẩn WCAG AA:** `--sv-gold-800` (`#9A7818`) — được cấu hình riêng thông qua biến `--sv-text-gold-aa` để đảm bảo độ tương phản tối thiểu **4.5:1** trên nền trắng.
* **Nền Tối (Dark Surface):** `--sv-dark-900` (`#0A0A0A`) — dùng cho các khu vực hero section, footer và container phụ trợ.
* **Nền Sáng (Light Surface):** `--sv-gray-025` (`#F7F7F7`) — nền đệm cho các khối nội dung để tạo nhịp điệu đọc.

### 1.2. Kích thước phông chữ linh hoạt (Fluid Typography)
Sử dụng hàm `clamp(min, preferred, max)` để tự động co giãn kích thước phông chữ mượt mà giữa màn hình di động (mobile) và máy tính (desktop) mà không cần viết media queries cho từng breakpoint:
* `--sv-text-xs`: `clamp(0.6875rem, 0.65rem + 0.12vw, 0.8125rem)` (11px – 13px)
* `--sv-text-base`: `clamp(0.875rem, 0.85rem + 0.15vw, 1rem)` (14px – 16px)
* `--sv-text-lg`: `clamp(1.125rem, 1rem + 0.5vw, 1.375rem)` (18px – 22px)
* `--sv-text-2xl`: `clamp(1.75rem, 1.3rem + 1.8vw, 2.5rem)` (28px – 40px)
* `--sv-text-hero`: `clamp(2.5rem, 1.8rem + 5vw, 5.5rem)` (40px – 88px)

---

## 2. HỆ THỐNG ĐỔ BÓNG CAO CẤP (PREMIUM ELEVATION)

Loại bỏ hoàn toàn các lớp đổ bóng cơ bản 1 lớp (gây cảm giác cứng và thiếu tự nhiên). Thay bằng hệ thống **đổ bóng khuếch tán đa tầng (Multi-layered Ambient Shadows)** mô phỏng môi trường ánh sáng vật lý thực tế:

* **Shadow Small (sm):**
  `box-shadow: 0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);`
* **Shadow Medium (md) - Dùng cho Card/Button thông dụng:**
  `box-shadow: 0 6px 12px -2px rgba(0,0,0,0.08), 0 3px 6px -3px rgba(0,0,0,0.04);`
* **Shadow Large (lg) - Dùng cho Slider/Dropdown:**
  `box-shadow: 0 12px 24px -4px rgba(0,0,0,0.10), 0 4px 12px -2px rgba(0,0,0,0.06);`
* **Shadow Extra Large (xl) - Dùng cho Modal/Popup:**
  `box-shadow: 0 20px 40px -6px rgba(0,0,0,0.12), 0 8px 20px -4px rgba(0,0,0,0.08);`

---

## 3. HỆ THỐNG LƯỚI 12 CỘT (12-COLUMN CSS GRID SYSTEM)

Để xây dựng bố cục trang web nhất quán, sử dụng lưới `.sv-grid-12` được tích hợp sẵn tại [base.css](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/website/assets/css/v2/base.css):

```html
<div class="sv-grid-12">
  <!-- Cột 1 chiếm 4 phần (1/3 màn hình) -->
  <div class="sv-span-4 sv-span-md-6 sv-span-sm-12">Nội dung 1</div>
  
  <!-- Cột 2 chiếm 8 phần (2/3 màn hình) -->
  <div class="sv-span-8 sv-span-md-6 sv-span-sm-12">Nội dung 2</div>
</div>
```

### Breakpoints hỗ trợ:
* Mặc định (Desktop): `.sv-span-[1-12]`
* Tablet (max-width: 1024px): `.sv-span-md-[1-12]`
* Mobile (max-width: 768px): `.sv-span-sm-[1-12]`

---

## 4. QUY CHUẨN MICRO-INTERACTIONS (HIỆU ỨNG TƯƠNG TÁC)

Mọi tương tác trên website phải đem lại cảm giác mượt mà, phản hồi lập tức và tôn trọng tùy chọn hệ thống của người dùng:

### 4.1. Tương tác Button (Button States)
* **Trạng thái hover:** Chuyển dịch nhẹ màu nền bằng `--sv-transition-base` (`0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`).
* **Trạng thái active (nhấn chuột):** Thu nhỏ nhẹ `transform: scale(0.98)` để mô phỏng cơ học đàn hồi.
* **Trạng thái focus (phím Tab):** Outline vàng bao quanh cách viền 3px để hỗ trợ khả năng tiếp cận người khiếm thị:
  `outline: 2px solid var(--sv-gold-600); outline-offset: 3px;`

### 4.2. Tương tác Card (Card Hover Effect)
Các khối thông tin (dự án, dịch vụ, sản phẩm) khi hover sẽ:
* Nâng nhẹ độ cao bằng cách đổi sang `--sv-shadow-lg`.
* Dịch chuyển trục Y lên trên `-4px` để tạo độ nổi khối trực quan.
* Zoom nhẹ hình ảnh bên trong thẻ `transform: scale(1.05)` (với `overflow: hidden`).

### 4.3. Tiết chế chuyển động (Reduced Motion Support)
Khi hệ điều hành của người dùng kích hoạt tính năng giảm chuyển động (Reduced Motion), toàn bộ animations và hiệu ứng chuyển dịch sẽ tự động tắt để tránh gây chóng mặt:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 5. THƯ VIỆN THÀNH PHẦN (COMPONENT LIBRARY)

Tất cả các thành phần UI dùng chung được định nghĩa tại [components.css](file:///d:/Sao%20V%C3%A0ng/Website-SaoVang/website/assets/css/v2/components.css).

* **Nút bấm (Buttons):** `.sv-btn`, `.sv-btn-primary`, `.sv-btn-accent`, `.sv-btn-outline`.
* **Thẻ thông tin (Cards):** `.sv-card`, `.sv-card-project`, `.sv-card-service`.
* **Biểu mẫu (Forms):** `.sv-form-group`, `.sv-form-input`, `.sv-form-label`.
* **Thanh điều hướng (Nav):** `.header-v2`, `.nav-menu-link`.
* **Trình chiếu (Sliders):** `.sv-slider-container`, `.sv-slide`.
