const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/User");

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Create a nodemailer transporter
 * @returns {object} Nodemailer transporter
 */
const createTransporter = () => {
  // For production, use actual SMTP credentials
  // For development, you can use services like Mailtrap or Ethereal
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.ethereal.email",
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send OTP via email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP to send
 * @returns {Promise} Email sending result
 */
const sendOTPByEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@comfinancial.com",
      to: email,
      subject: "Your OTP for Com Financial Services Authentication",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your One-Time Password</h2>
          <p>Use the following OTP to complete your authentication:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

/**
 * Generate and save OTP for a user
 * @param {string} email - User email
 * @returns {Promise<string>} Generated OTP
 */
const generateAndSaveOTP = async (email) => {
  try {
    // Generate OTP
    const otp = generateOTP();

    // Set expiry time (10 minutes from now)
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    // Save OTP to user record
    await User.findOneAndUpdate({ email }, { otp, otpExpiry }, { new: true });

    // Send OTP via email
    try {
      await sendOTPByEmail(email, otp);
      console.log(`OTP sent successfully to ${email}`);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Continue execution even if email fails
      // This allows the OTP to be saved in the database even if email sending fails
    }

    return otp;
  } catch (error) {
    console.error("Error generating OTP:", error);
    throw new Error("Failed to generate OTP");
  }
};

/**
 * Verify OTP for a user
 * @param {string} email - User email
 * @param {string} otp - OTP to verify
 * @returns {Promise<boolean>} Verification result
 */
const verifyOTP = async (email, otp) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return false;
    }

    // Check if OTP matches and is not expired
    if (user.otp === otp && user.otpExpiry > new Date()) {
      // Clear OTP after successful verification
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new Error("Failed to verify OTP");
  }
};

module.exports = {
  generateOTP,
  sendOTPByEmail,
  generateAndSaveOTP,
  verifyOTP,
};
