/**
 * SAO VÀNG — Placeholder Image Generator
 * Creates minimal SVG placeholder images for missing assets
 */
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../../website/assets/images');

// Create directory if needed
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

// SVG placeholder factory
const makeSVG = (label, bg = '#1a1a2e', accent = '#C8860A', w = 800, h = 600) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect width="${w}" height="${h}" fill="url(#grad)" opacity=".6"/>
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:.15"/>
      <stop offset="100%" style="stop-color:transparent;stop-opacity:0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="0" x2="${w}" y2="${h}" stroke="${accent}" stroke-opacity=".08" stroke-width="1"/>
  <line x1="${w}" y1="0" x2="0" y2="${h}" stroke="${accent}" stroke-opacity=".08" stroke-width="1"/>
  <circle cx="${w/2}" cy="${h/2 - 20}" r="${Math.min(w,h)*0.12}" fill="none" stroke="${accent}" stroke-opacity=".25" stroke-width="1.5"/>
  <text x="${w/2}" y="${h/2 + 8}" text-anchor="middle" dominant-baseline="middle"
    font-family="Arial, sans-serif" font-size="${Math.min(w,h)*0.045}" font-weight="700"
    fill="${accent}" opacity=".7">${label}</text>
  <text x="${w/2}" y="${h/2 + 36}" text-anchor="middle" dominant-baseline="middle"
    font-family="Arial, sans-serif" font-size="${Math.min(w,h)*0.022}" font-weight="400"
    fill="rgba(255,255,255,.3)">SAO VÀNG</text>
</svg>`;

const PLACEHOLDER_IMAGES = [
  // Missing product images
  { name: 'product-inox.png',          label: 'Inox 316 Premium',     w: 600, h: 450 },
  { name: 'product-railing.png',        label: 'Lan Can Nghệ Thuật',   w: 600, h: 450 },
  { name: 'product-gate.png',           label: 'Cổng Tự Động',         w: 600, h: 450 },
  { name: 'product-glass.png',          label: 'Vách Kính Cường Lực',  w: 600, h: 450 },
  { name: 'product-staircase.png',      label: 'Cầu Thang Xoắn',       w: 600, h: 450 },
  { name: 'product-yacht.png',          label: 'Nội Thất Du Thuyền',   w: 600, h: 450 },
  // Project images
  { name: 'project-1.png',             label: 'Biệt Thự TP.HCM',      w: 800, h: 600 },
  { name: 'project-2.png',             label: 'Du Thuyền Hạ Long',    w: 800, h: 600 },
  { name: 'project-3.png',             label: 'Villa Đà Lạt',          w: 800, h: 600 },
  { name: 'project-4.png',             label: 'Resort Nha Trang',      w: 800, h: 600 },
  { name: 'project-5.png',             label: 'Penthouse HN',          w: 800, h: 600 },
  { name: 'project-6.png',             label: 'Marina Vũng Tàu',       w: 800, h: 600 },
  // Blog/news thumbnails
  { name: 'news-1.png',                label: 'Tin Tức Cơ Khí',        w: 720, h: 405 },
  { name: 'news-2.png',                label: 'Xu Hướng Thiết Kế',     w: 720, h: 405 },
  { name: 'news-3.png',                label: 'Kỹ Thuật Inox',         w: 720, h: 405 },
  { name: 'news-4.png',                label: 'Dự Án Mới',             w: 720, h: 405 },
  // About / team
  { name: 'team-workshop.png',         label: 'Xưởng Sản Xuất 5000m²', w: 800, h: 533 },
  { name: 'ceo.png',                   label: 'Giám Đốc Điều Hành',    w: 400, h: 500, bg: '#111', accent: '#C8860A' },
  // Hero fallbacks
  { name: 'hero-bg.png',               label: 'Sao Vàng Premium',      w: 1440, h: 800 },
  { name: 'hero-services.png',         label: 'Dịch Vụ Cơ Khí',       w: 1440, h: 600 },
];

let created = 0, skipped = 0;

PLACEHOLDER_IMAGES.forEach(({ name, label, bg = '#0d0d1a', accent = '#C8860A', w = 800, h = 600 }) => {
  const filePath = path.join(IMAGES_DIR, name);
  // Skip if file already exists and is >1KB (real image)
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1024) {
    skipped++;
    return;
  }
  const svg = makeSVG(label, bg, accent, w, h);
  // Write as SVG first (rename to .png so browsers serve it — modern browsers render SVG regardless of extension)
  fs.writeFileSync(filePath, svg, 'utf8');
  console.log(`  ✓  ${name.padEnd(35)} ${w}×${h}`);
  created++;
});

console.log(`\n  Created: ${created} | Skipped (exists): ${skipped}\n`);
