const express = require("express");
const router = express.Router();
const TaxForm = require("../models/TaxForm");
const Contact = require("../models/Contact");
const upload = require("../middleware/upload");

// @route   POST /api/forms/tax
// @desc    Submit tax filing form with documents
// @access  Public
router.post(
  "/tax",
  upload.fields([
    { name: "form16", maxCount: 1 },
    { name: "bankStatements", maxCount: 1 },
    { name: "investmentProof", maxCount: 1 },
    { name: "tradingSummary", maxCount: 1 },
    { name: "homeLoanCertificate", maxCount: 1 },
    { name: "salarySlip", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
    { name: "otherDocument", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
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
        return res
          .status(400)
          .json({ message: "All required fields must be provided" });
      }

      // Validate PAN format (AAAAA0000A)
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        return res.status(400).json({ message: "Invalid PAN format" });
      }

      // Validate conditional fields
      if (hasIncomeTaxLogin === "true" && !incomeTaxLoginCredentials) {
        return res
          .status(400)
          .json({ message: "Income tax login credentials are required" });
      }

      if (hasPRAN === "true" && !pranNumber) {
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
      };

      // Process each file field
      if (req.files) {
        Object.entries(req.files).forEach(([fieldName, files]) => {
          if (files && files.length > 0) {
            const file = files[0];
            formData[fieldName] = {
              fileName: file.filename,
              originalName: file.originalname,
              path: `/uploads/${file.filename}`,
              fileType: file.mimetype,
              fileSize: file.size,
            };
          }
        });
      }

      // Create new tax form submission
      const taxForm = new TaxForm(formData);

      await taxForm.save();

      res.status(201).json({
        success: true,
        message: "Tax form submitted successfully",
        formId: taxForm._id,
      });
    } catch (error) {
      console.error("Tax form submission error:", error);
      res.status(500).json({ message: "Server error" });
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

module.exports = router;
