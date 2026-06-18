/**
 * SAO VÀNG — Website SEO & Footer Patcher
 * Updates all HTML files to reflect:
 *   - The new slogan: "Bền vững với thời gian – Đem tinh hoa về cho đất Việt"
 *   - The balanced services list in footers and descriptions (Cơ khí & Nhôm cửa, cửa sổ)
 */
const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.join(__dirname, '../website');

const NEW_SLOGAN_TITLE = "SAO VÀNG — Bền vững với thời gian, đem tinh hoa về cho đất Việt";
const NEW_SLOGAN_DESC = "Công ty TNHH ĐT TM và DV Kỹ Thuật Sao Vàng — Chuyên tư vấn, thiết kế, thi công Cơ khí nghệ thuật và hệ thống Cửa nhôm & Cửa sổ, Vách kính kiến trúc cao cấp từ năm 2017.";

const FOOTER_REPLACEMENT = `      <div class="footer-col">
        <h4>Dịch Vụ</h4>
        <ul>
          <li><a href="linh-vuc-hoat-dong.html#co-khi-nghe-thuat">Cơ khí nghệ thuật</a></li>
          <li><a href="linh-vuc-hoat-dong.html#cua-nhom-cua-so">Cửa nhôm &amp; Cửa sổ</a></li>
          <li><a href="linh-vuc-hoat-dong.html#vach-kinh-mat-dung">Vách kính &amp; Mặt dựng</a></li>
          <li><a href="linh-vuc-hoat-dong.html#cau-thang-lan-can">Cầu thang &amp; Lan can</a></li>
          <li><a href="linh-vuc-hoat-dong.html#cong-hang-rao">Cổng &amp; Hàng rào</a></li>
          <li><a href="linh-vuc-hoat-dong.html#bao-tri-dich-vu">Bảo trì &amp; Dịch vụ</a></li>
        </ul>
      </div>`;

const htmlFiles = fs.readdirSync(WEBSITE_DIR).filter(f => f.endsWith('.html'));

htmlFiles.forEach(filename => {
  const filePath = path.join(WEBSITE_DIR, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Patch Title & Meta descriptions (specifically for index.html or general)
  if (filename === 'index.html') {
    // Title
    const titleRegex = /<title>[\s\S]*?<\/title>/i;
    if (titleRegex.test(content)) {
      content = content.replace(titleRegex, `<title>${NEW_SLOGAN_TITLE}</title>`);
      modified = true;
    }
    // Meta Description
    const descRegex = /<meta\s+name="description"\s+content="[^"]*"/i;
    if (descRegex.test(content)) {
      content = content.replace(descRegex, `<meta name="description" content="${NEW_SLOGAN_DESC}"`);
      modified = true;
    }
    // OG Title
    const ogTitleRegex = /<meta\s+property="og:title"\s+content="[^"]*"/i;
    if (ogTitleRegex.test(content)) {
      content = content.replace(ogTitleRegex, `<meta property="og:title" content="${NEW_SLOGAN_TITLE}"`);
      modified = true;
    }
    // OG Description
    const ogDescRegex = /<meta\s+property="og:description"\s+content="[^"]*"/i;
    if (ogDescRegex.test(content)) {
      content = content.replace(ogDescRegex, `<meta property="og:description" content="Tư vấn miễn phí · Vật liệu cao cấp · Cơ khí nghệ thuật &amp; Nhôm kính kiến trúc."`);
      modified = true;
    }
  }

  // 2. Patch the Service list in the footer
  // Match `<div class="footer-col">` followed by `<h4>Dịch Vụ</h4>` and its `<ul>...</ul>` block
  const footerRegex = /<div class="footer-col">\s*<h4>Dịch Vụ<\/h4>[\s\S]*?<\/ul>\s*<\/div>/i;
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, FOOTER_REPLACEMENT);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Patched: ${filename}`);
  } else {
    console.log(`ℹ️ Unchanged: ${filename}`);
  }
});

console.log("All patches finished successfully.");
