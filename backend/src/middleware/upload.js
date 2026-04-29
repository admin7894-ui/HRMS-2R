
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (_, f, cb) => cb(null, Date.now() + '-' + f.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
module.exports = upload;
