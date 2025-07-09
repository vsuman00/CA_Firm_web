const express = require("express");
const router = express.Router();
const TaxForm = require("../models/TaxForm");
const Contact = require("../models/Contact");
const { protect, admin } = require("../middleware/auth");
const path = require("path");
const fs = require("fs");

// Apply auth middleware to all admin routes
router.use(protect);
router.use(admin);

// @route   GET /api/admin/forms
// @desc    Get all tax form submissions with optional filters
// @access  Private/Admin
router.get("/forms", async (req, res) => {
  try {
    const {
      pan,
      name,
      startDate,
      endDate,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = {};

    if (pan) filter.pan = { $regex: pan, $options: "i" };
    if (name) filter.fullName = { $regex: name, $options: "i" };
    if (status) filter.status = status;

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Get forms with pagination
    const forms = await TaxForm.find(filter)
      .select("-documents.fileData") // Exclude file data to reduce payload size
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await TaxForm.countDocuments(filter);

    res.json({
      forms,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get forms error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/forms/:id
// @desc    Get single tax form submission
// @access  Private/Admin
router.get("/forms/:id", async (req, res) => {
  try {
    const form = await TaxForm.findById(req.params.id)
      .select("-documents.fileData"); // Exclude file data to reduce payload size

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(form);
  } catch (error) {
    console.error("Get form error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/forms/:id/status
// @desc    Update form status
// @access  Private/Admin
router.put("/forms/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["Pending", "Reviewed", "Filed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const form = await TaxForm.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    form.status = status;
    form.updatedAt = Date.now();

    await form.save();

    res.json({
      success: true,
      message: "Form status updated",
      form,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get("/stats", async (req, res) => {
  try {
    // Get counts by status
    const total = await TaxForm.countDocuments();
    const pending = await TaxForm.countDocuments({ status: "Pending" });
    const reviewed = await TaxForm.countDocuments({ status: "Reviewed" });
    const filed = await TaxForm.countDocuments({ status: "Filed" });

    // Get recent submissions
    const recent = await TaxForm.find().sort({ createdAt: -1 }).limit(5);

    // Get contact form count
    const contacts = await Contact.countDocuments();

    res.json({
      taxForms: {
        total,
        pending,
        reviewed,
        filed,
      },
      contacts,
      recent,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/contacts
// @desc    Get all contact form submissions
// @access  Private/Admin
router.get("/contacts", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments();

    res.json({
      contacts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
