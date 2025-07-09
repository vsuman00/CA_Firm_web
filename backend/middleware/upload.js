const multer = require("multer");
const path = require("path");

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

console.log("Using memory storage for file uploads");

// File filter function - now accepts all file types
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  console.log(`Checking file: ${file.originalname}, extension: ${ext}`);
  
  // Accept all file types
  console.log(`File accepted: ${file.originalname}`);
  cb(null, true);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size to match frontend
  },
});

// Add error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large. Maximum size is 50MB.",
      });
    }
    return res.status(400).json({
      message: `Upload error: ${err.message}`,
    });
  } else if (err) {
    console.error("Upload error:", err);
    return res.status(400).json({
      message: err.message,
    });
  }
  next();
};

module.exports = upload;
module.exports.handleMulterError = handleMulterError;
