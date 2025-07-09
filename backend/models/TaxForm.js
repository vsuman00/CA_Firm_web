const mongoose = require("mongoose");

// File schema for document uploads
const FileSchema = new mongoose.Schema({
  documentType: {
    type: String,
    required: true,
    enum: [
      "form16",
      "bankStatement",
      "investmentProof",
      "tradingSummary",
      "homeLoanCertificate",
      "salarySlip",
      "aadharCard",
      "other"
    ]
  },
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileData: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: String,
    required: true
  }
});

const TaxFormSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  pan: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  // Conditional fields
  hasIncomeTaxLogin: {
    type: Boolean,
    default: false,
  },
  incomeTaxLoginId: {
    type: String,
    trim: true,
  },
  incomeTaxLoginPassword: {
    type: String,
    trim: true,
  },
  hasHomeLoan: {
    type: Boolean,
    default: false,
  },
  homeLoanSanctionDate: {
    type: String,
    trim: true,
  },
  homeLoanAmount: {
    type: String,
    trim: true,
  },
  homeLoanCurrentDue: {
    type: String,
    trim: true,
  },
  homeLoanTotalInterest: {
    type: String,
    trim: true,
  },
  hasPranNumber: {
    type: Boolean,
    default: false,
  },
  pranNumber: {
    type: String,
    trim: true,
  },
  // Document uploads - consolidated into a single array
  documents: [FileSchema],
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Filed"],
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
TaxFormSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("TaxForm", TaxFormSchema);
