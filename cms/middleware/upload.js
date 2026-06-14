/**
 * Multer upload middleware — handles all file types
 */
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const crypto = require('crypto');

const UPLOAD_BASE = path.join(__dirname, '../uploads');

// Ensure upload dirs exist
['images','videos','documents','archives','cad','others'].forEach(dir => {
  fs.mkdirSync(path.join(UPLOAD_BASE, dir), { recursive: true });
});

// Map MIME → folder
function getUploadDir(mimetype, originalname) {
  if (mimetype.startsWith('image/'))  return 'images';
  if (mimetype.startsWith('video/'))  return 'videos';
  if (['application/pdf','application/msword',
       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
       'application/vnd.ms-excel',
       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
       'application/vnd.ms-powerpoint',
       'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ].includes(mimetype)) return 'documents';
  if (['application/zip','application/x-zip-compressed',
       'application/x-rar-compressed','application/x-7z-compressed',
  ].includes(mimetype)) return 'archives';
  const ext = path.extname(originalname).toLowerCase();
  if (['.dwg','.dxf','.3dm','.stl','.step','.iges','.obj'].includes(ext)) return 'cad';
  return 'others';
}

// Disk storage with unique filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(UPLOAD_BASE, getUploadDir(file.mimetype, file.originalname));
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext)
      .toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 40);
    const uid  = crypto.randomBytes(6).toString('hex');
    const ts   = Date.now();
    cb(null, `${base}-${ts}-${uid}${ext}`);
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const ALLOWED_MIME = [
    // Images
    'image/jpeg','image/png','image/gif','image/webp','image/svg+xml','image/bmp','image/tiff',
    // Videos
    'video/mp4','video/quicktime','video/x-msvideo','video/webm','video/mpeg',
    // Documents
    'application/pdf','application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Archives
    'application/zip','application/x-zip-compressed',
    'application/x-rar-compressed','application/x-7z-compressed',
    'application/octet-stream', // CAD/3DM/DWG
  ];
  if (ALLOWED_MIME.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Allow by extension for CAD files
    const ext = path.extname(file.originalname).toLowerCase();
    const CAD = ['.dwg','.dxf','.3dm','.stl','.step','.iges','.obj','.fbx','.rvt'];
    if (CAD.includes(ext)) return cb(null, true);
    cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  }
};

const MAX_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '100');

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
});

// Helper: get relative path from absolute upload path
function getRelativePath(absolutePath) {
  return absolutePath.replace(UPLOAD_BASE, '').replace(/\\/g, '/');
}

module.exports = { upload, getUploadDir, getRelativePath, UPLOAD_BASE };
