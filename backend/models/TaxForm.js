const mongoose = require("mongoose");

// File schema for document uploads
const FileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  path: {
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
  incomeTaxLoginCredentials: {
    type: String,
    trim: true,
  },
  hasHomeLoan: {
    type: Boolean,
    default: false,
  },
  hasPRAN: {
    type: Boolean,
    default: false,
  },
  pranNumber: {
    type: String,
    trim: true,
  },
  // Document uploads
  form16: FileSchema,
  bankStatements: FileSchema,
  investmentProof: FileSchema,
  tradingSummary: FileSchema,
  homeLoanCertificate: FileSchema,
  salarySlip: FileSchema,
  aadharCard: FileSchema,
  otherDocument: FileSchema,
  // Legacy support for existing documents
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
