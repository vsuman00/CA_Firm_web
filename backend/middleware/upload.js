const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  console.log("Creating uploads directory:", uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
} else {
  console.log("Uploads directory exists:", uploadDir);
  // Check if directory is writable
  try {
    fs.accessSync(uploadDir, fs.constants.W_OK);
    console.log("Uploads directory is writable");
  } catch (err) {
    console.error("Uploads directory is not writable:", err);
  }
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(`Setting destination for file: ${file.originalname}`);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const newFilename = uniqueSuffix + ext;
    console.log(
      `Generated filename: ${newFilename} for original: ${file.originalname}`
    );
    cb(null, newFilename);
  },
});

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
