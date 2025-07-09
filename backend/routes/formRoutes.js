const express = require("express");
const router = express.Router();
const TaxForm = require("../models/TaxForm");
const Contact = require("../models/Contact");
const upload = require("../middleware/upload");
const { handleMulterError } = require("../middleware/upload");
const { protect } = require("../middleware/auth");

// @route   POST /api/forms/tax
// @desc    Submit tax filing form with documents
// @access  Public
router.post(
  "/tax",
  (req, res, next) => {
    console.log("Processing tax form upload request");
    next();
  },
  upload.array("documents", 10), // Allow up to 10 documents with a single field
  handleMulterError,
  async (req, res) => {
    try {
      console.log("Tax form submission received");
      console.log("Request body:", req.body);
      console.log(
        "Files received:",
        req.files ? req.files.length : "No files"
      );

      const {
        fullName,
        email,
        phone,
        pan,
        hasIncomeTaxLogin,
        incomeTaxLoginCredentials,
        hasHomeLoan,
        hasPRAN,
        pranNumber,
      } = req.body;

      // Validate required fields
      if (!fullName || !email || !phone || !pan) {
        console.log("Missing required fields");
        return res
          .status(400)
          .json({ message: "All required fields must be provided" });
      }

      // Validate PAN format (AAAAA0000A)
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        console.log("Invalid PAN format:", pan);
        return res.status(400).json({ message: "Invalid PAN format" });
      }

      // Validate conditional fields
      if (hasIncomeTaxLogin === "true" && !incomeTaxLoginCredentials) {
        console.log("Missing income tax login credentials");
        return res
          .status(400)
          .json({ message: "Income tax login credentials are required" });
      }

      if (hasPRAN === "true" && !pranNumber) {
        console.log("Missing PRAN number");
        return res.status(400).json({ message: "PRAN number is required" });
      }

      // Process uploaded files
      const formData = {
        fullName,
        email,
        phone,
        pan,
        hasIncomeTaxLogin: hasIncomeTaxLogin === "true",
        incomeTaxLoginCredentials: incomeTaxLoginCredentials || "",
        hasHomeLoan: hasHomeLoan === "true",
        hasPRAN: hasPRAN === "true",
        pranNumber: pranNumber || "",
        status: "Pending",
        documents: []
      };
      
      // Get document types from request body
      const documentTypes = {};
      Object.keys(req.body).forEach(key => {
        if (key.startsWith('documentType_')) {
          const fileId = key.replace('documentType_', '');
          documentTypes[fileId] = req.body[key];
          // Remove these fields from formData
          delete formData[key];
        }
      });
      
      // Process each file with its document type
      if (req.files && req.files.length > 0) {
        console.log(`Processing ${req.files.length} uploaded files`);
        
        req.files.forEach((file, index) => {
          const fileId = req.body[`fileId_${index}`] || `file_${index}`;
          const docType = documentTypes[fileId] || 'otherDocument';
          
          console.log(`Processing file: ${docType}`, {
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            extension: file.originalname.split('.').pop().toLowerCase()
          });
          
          // Add to documents array
          formData.documents.push({
            documentType: docType,
            fileName: file.filename,
            originalName: file.originalname,
            path: `/uploads/${file.filename}`,
            fileType: file.mimetype,
            fileSize: file.size,
          });
          
          // Remove the fileId field
          delete formData[`fileId_${index}`];
        });
      } else {
        console.log("No files were uploaded");
      }

      // Create new tax form submission
      const taxForm = new TaxForm(formData);

      await taxForm.save();
      console.log("Tax form saved successfully with ID:", taxForm._id);

      res.status(201).json({
        success: true,
        message: "Tax form submitted successfully",
        formId: taxForm._id,
      });
    } catch (error) {
      console.error("Error in tax form submission:", error);
      res.status(500).json({
        message: "Server error while processing tax form",
        error: error.message,
      });
    }
  }
);

// @route   POST /api/forms/contact
// @desc    Submit contact form
// @access  Public
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new contact submission
    const contact = new Contact({
      name,
      email,
      message,
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/forms/user-submissions
// @desc    Get all tax form submissions for the logged-in user
// @access  Private
router.get("/user-submissions", protect, async (req, res) => {
  try {
    // Get user email from the authenticated user
    const userEmail = req.user.email;

    // Find all tax forms submitted by this user
    const submissions = await TaxForm.find({ email: userEmail })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("-incomeTaxLoginCredentials"); // Exclude sensitive data

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching user submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/forms/user-submissions/:id
// @desc    Get a specific tax form submission for the logged-in user
// @access  Private
router.get("/user-submissions/:id", protect, async (req, res) => {
  try {
    const submission = await TaxForm.findById(req.params.id)
      .select("-incomeTaxLoginCredentials"); // Exclude sensitive data

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Check if the submission belongs to the logged-in user
    if (submission.email !== req.user.email) {
      return res.status(403).json({ message: "Not authorized to view this submission" });
    }

    res.json(submission);
  } catch (error) {
    console.error("Error fetching submission details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
