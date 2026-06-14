/**
 * Image processing service using Sharp
 * Handles: resize, crop, WebP convert, thumbnail, compression
 */
const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

/**
 * Process image: generate thumbnail + WebP version
 * @param {string} inputPath  - full disk path of original
 * @param {object} opts
 * @returns {object} { thumbPath, thumbUrl, webpPath, webpUrl, width, height }
 */
async function processImage(inputPath, opts = {}) {
  const dir      = path.dirname(inputPath);
  const base     = path.basename(inputPath, path.extname(inputPath));
  const thumbPath = path.join(dir, `${base}_thumb.webp`);
  const webpPath  = path.join(dir, `${base}.webp`);

  let width, height;

  try {
    // Get metadata
    const meta = await sharp(inputPath).metadata();
    width  = meta.width;
    height = meta.height;

    // Thumbnail (320px wide)
    await sharp(inputPath)
      .resize(320, null, { withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(thumbPath);

    // WebP version (original size, optimized)
    if (!inputPath.toLowerCase().endsWith('.svg')) {
      await sharp(inputPath)
        .webp({ quality: opts.quality || 82, effort: 4 })
        .toFile(webpPath);
    }
  } catch (err) {
    console.warn('Sharp processing error (non-fatal):', err.message);
    return { width: null, height: null, thumbPath: null, webpPath: null };
  }

  return { width, height, thumbPath, webpPath };
}

/**
 * Crop an image to specified region
 * @param {string} inputPath
 * @param {object} crop - { x, y, width, height }
 * @param {string} outputPath
 */
async function cropImage(inputPath, crop, outputPath) {
  await sharp(inputPath)
    .extract({ left: crop.x, top: crop.y, width: crop.width, height: crop.height })
    .toFile(outputPath);
  return outputPath;
}

/**
 * Resize image
 * @param {string} inputPath
 * @param {number} width
 * @param {number} height (optional)
 * @param {string} outputPath
 */
async function resizeImage(inputPath, width, height, outputPath) {
  await sharp(inputPath)
    .resize(width, height || null, { withoutEnlargement: true, fit: 'inside' })
    .toFile(outputPath);
  return outputPath;
}

/**
 * Convert image to WebP
 */
async function convertToWebP(inputPath, quality = 82) {
  const outPath = inputPath.replace(/\.(jpe?g|png|gif|bmp|tiff?)$/i, '.webp');
  await sharp(inputPath).webp({ quality, effort: 4 }).toFile(outPath);
  return outPath;
}

/**
 * Get image dimensions without processing
 */
async function getImageMeta(inputPath) {
  try {
    const meta = await sharp(inputPath).metadata();
    return { width: meta.width, height: meta.height, format: meta.format };
  } catch {
    return { width: null, height: null, format: null };
  }
}

module.exports = { processImage, cropImage, resizeImage, convertToWebP, getImageMeta };
