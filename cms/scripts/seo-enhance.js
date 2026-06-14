/**
 * SAO VÀNG — SEO & Schema.org Enhancer
 * Adds:
 *  1. Schema.org LocalBusiness JSON-LD to index.html
 *  2. Open Graph meta to all inner pages
 *  3. <link rel="canonical"> to all pages
 *  4. loading="lazy" to all img tags (except above-fold hero)
 *  5. alt="" on any image missing alt
 */
const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.join(__dirname, '../../website');
const BASE_URL = 'https://saovang.vn';

const PAGES = {
  'index.html':              { title: 'SAO VÀNG — Thiết Kế & Thi Công Cơ Khí Nhà Ở & Du Thuyền Cao Cấp', desc: 'Công ty TNHH Sao Vàng — Thiết kế, gia công và lắp đặt cơ khí nhà ở, biệt thự và du thuyền cao cấp từ năm 2017. 300+ công trình, 50+ du thuyền, bảo hành 5 năm.' },
  'gioi-thieu.html':         { title: 'Giới Thiệu Công Ty | SAO VÀNG', desc: 'Công ty Sao Vàng thành lập 2017, đội ngũ 120+ kỹ sư, xưởng sản xuất 5,000m², chứng nhận quốc tế AWS và ASME.' },
  'linh-vuc-hoat-dong.html': { title: 'Lĩnh Vực Hoạt Động | SAO VÀNG', desc: 'Cơ khí nhà ở, du thuyền, cầu thang & lan can, cổng & hàng rào, cửa & vách kính, bảo trì.' },
  'du-an.html':              { title: 'Dự Án Đã Thực Hiện | SAO VÀNG', desc: '300+ công trình từ biệt thự đến du thuyền cao cấp tại TP.HCM, Hà Nội, Đà Lạt và Vịnh Hạ Long.' },
  'san-pham.html':           { title: 'Sản Phẩm | SAO VÀNG', desc: 'Catalog sản phẩm cơ khí cao cấp: inox 316, kính cường lực, nhôm định hình, hàng rào và lan can.' },
  'tin-tuc.html':            { title: 'Tin Tức & Kiến Thức | SAO VÀNG', desc: 'Tin tức, kiến thức kỹ thuật và xu hướng thiết kế cơ khí cao cấp từ đội ngũ chuyên gia Sao Vàng.' },
  'lien-he.html':            { title: 'Liên Hệ | SAO VÀNG', desc: 'Liên hệ Sao Vàng để được tư vấn miễn phí. Hotline: 093 7729 909. Email: info@saovang.vn.' },
};

// Schema.org LocalBusiness JSON-LD for homepage
const SCHEMA_LD = `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Công ty TNHH ĐT TM và DV Kỹ Thuật Sao Vàng",
  "alternateName": "Sao Vàng Tech",
  "url": "https://saovang.vn",
  "logo": "https://saovang.vn/assets/images/logo.png",
  "description": "Chuyên thiết kế, gia công và lắp đặt kết cấu cơ khí nhà ở, biệt thự và du thuyền hạng sang từ năm 2017.",
  "foundingDate": "2017",
  "telephone": "+84937729909",
  "email": "info@saovang.vn",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "VN",
    "addressRegion": "TP. Hồ Chí Minh"
  },
  "areaServed": ["TP. Hồ Chí Minh", "Hà Nội", "Đà Lạt", "Vịnh Hạ Long"],
  "priceRange": "$$",
  "openingHours": "Mo-Sa 07:30-17:30",
  "sameAs": [
    "https://zalo.me/0937729909"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Dịch Vụ Cơ Khí Cao Cấp",
    "itemListElement": [
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Thiết kế cơ khí nhà ở"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Thi công du thuyền cao cấp"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Cầu thang & lan can inox"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Cổng & hàng rào cao cấp"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Bảo trì & sửa chữa"}}
    ]
  }
}
</script>`;

// FAQ Schema for inner pages
const FAQ_SCHEMA = `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Sao Vàng bảo hành bao lâu?",
      "acceptedAnswer": {"@type": "Answer", "text": "Sao Vàng bảo hành lên đến 5 năm và bảo trì định kỳ miễn phí trong năm đầu."}
    },
    {
      "@type": "Question",
      "name": "Có thiết kế theo yêu cầu không?",
      "acceptedAnswer": {"@type": "Answer", "text": "Có, Sao Vàng nhận thiết kế và gia công theo bản vẽ kỹ thuật riêng của khách hàng."}
    },
    {
      "@type": "Question",
      "name": "Thời gian thi công một công trình là bao lâu?",
      "acceptedAnswer": {"@type": "Answer", "text": "Tùy quy mô, thông thường từ 2–8 tuần. Kỹ sư sẽ tư vấn và cam kết tiến độ trong hợp đồng."}
    }
  ]
}
</script>`;

let totalFixed = 0;

Object.entries(PAGES).forEach(([filename, meta]) => {
  const filePath = `${WEBSITE_DIR}\\${filename}`;
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');

  // ── 1. Canonical link ─────────────────────────────────────
  if (!html.includes('rel="canonical"')) {
    html = html.replace('</head>', `  <link rel="canonical" href="${BASE_URL}/${filename}" />\n</head>`);
  }

  // ── 2. Open Graph meta ────────────────────────────────────
  if (!html.includes('og:title')) {
    const ogMeta = `  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${BASE_URL}/${filename}" />
  <meta property="og:image" content="${BASE_URL}/assets/images/hero-interior.png" />
  <meta property="og:locale" content="vi_VN" />
  <meta name="twitter:card" content="summary_large_image" />`;
    html = html.replace('<link rel="stylesheet"', ogMeta + '\n  <link rel="stylesheet"');
  }

  // ── 3. Schema.org JSON-LD ─────────────────────────────────
  if (filename === 'index.html' && !html.includes('application/ld+json')) {
    html = html.replace('</body>', SCHEMA_LD + '\n</body>');
  }
  if (filename === 'lien-he.html' && !html.includes('application/ld+json')) {
    html = html.replace('</body>', FAQ_SCHEMA + '\n</body>');
  }

  // ── 4. Add loading="lazy" to below-fold images ────────────
  // Skip hero images (page-hero-bg, hero-bg, first img) — they should load eagerly
  let imgCount = 0;
  html = html.replace(/<img([^>]+)>/g, (match, attrs) => {
    imgCount++;
    // Skip if already has loading attr
    if (attrs.includes('loading=')) return match;
    // Skip hero images (first img in page, or those in hero containers)
    if (imgCount <= 1) return match;
    // Skip logo images
    if (attrs.includes('logo')) return match;
    return `<img${attrs} loading="lazy">`;
  });

  // ── 5. Add missing alt attributes ────────────────────────
  html = html.replace(/<img([^>]+)>/g, (match, attrs) => {
    if (!attrs.includes('alt=')) {
      return `<img${attrs} alt="">`;
    }
    return match;
  });

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  ✓  ${filename}`);
  totalFixed++;
});

console.log(`\n  ✅ SEO enhanced: ${totalFixed} pages.\n`);
