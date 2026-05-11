const multer = require('multer');
const { MAX_FILE_BYTES, UPLOAD_MIME_TYPES } = require('../config');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (UPLOAD_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de ficheiro não suportado: ${file.mimetype}`));
    }
  },
});

const uploadMiddleware = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'pattern', maxCount: 1 },
]);

module.exports = { uploadMiddleware };
