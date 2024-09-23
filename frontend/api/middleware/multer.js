const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files in 'uploads/' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.csv'); // Save with unique filename
  }
});

// Multer middleware with file filtering
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'csvfile' && file.mimetype === 'text/csv') {
      cb(null, true); // Accept the file if it's a CSV
    } else {
      console.log('Unexpected field or file type:', file.fieldname, file.mimetype);
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname)); // Reject if the field or file is unexpected
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024 // Limit file size to 2MB
  }
}).single('csvfile'); // Expect only a single file with the fieldname 'csvfile'

module.exports = upload;
