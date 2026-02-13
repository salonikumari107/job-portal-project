import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  console.log('Checking file:', file.originalname, file.mimetype);
  // Allowed extensions
  const filetypes = /pdf|doc|docx/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  // More lenient MIME check - some browsers/OS send different mimes
  const isPdf = file.mimetype === 'application/pdf';
  const isDoc = file.mimetype.includes('word') || 
                file.mimetype.includes('msword') || 
                file.mimetype.includes('officedocument') ||
                file.mimetype === 'application/octet-stream'; // Fallback for some browsers

  if (extname && (isPdf || isDoc)) {
    return cb(null, true);
  } else {
    cb(new Error(`Only PDF, DOC, and DOCX files allowed! (Received: ${file.mimetype})`));
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

export default upload;
