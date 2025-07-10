const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const otpUtils = require("../utils/otpUtils");

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    // Password is not required if OTP is provided
    check("password", "Password is required").optional({ checkFalsy: true }),
    check("otp", "OTP must be 6 digits")
      .optional({ checkFalsy: true })
      .isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    console.log("Login request received:", {
      body: req.body,
      headers: req.headers,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Login validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, otp, role } = req.body;
    console.log("Login credentials:", {
      email,
      hasPassword: !!password,
      hasOtp: !!otp,
      role,
    });

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (!user) {
        console.log("Login failed: User not found", { email });
        return res.status(400).json({ message: "Invalid credentials", code: "INVALID_LOGIN" });
      }

      console.log("User found:", {
        id: user._id,
        email: user.email,
        role: user.role,
        useOTP: user.useOTP,
      });

      // Check if the user has the required role
      if (role && user.role !== role) {
        console.log("Login failed: Role mismatch", {
          requestedRole: role,
          userRole: user.role,
        });
        return res.status(403).json({ message: "Access denied" });
      }

      let isAuthenticated = false;

      // Check if user is using OTP authentication
      if (user.useOTP) {
        // If user is using OTP but password was provided
        if (password && !otp) {
          console.log("Login failed: Password provided for OTP account");
          return res.status(400).json({
            message:
              "This account uses OTP authentication. Please request an OTP.",
            authMethod: "otp",
          });
        }

        // Verify OTP
        if (otp) {
          isAuthenticated = await otpUtils.verifyOTP(email, otp);
          console.log("OTP verification result:", { isAuthenticated });
          if (!isAuthenticated) {
            return res.status(400).json({ message: "Invalid or expired OTP", code: "INVALID_OTP" });
          }
        } else {
          console.log("Login failed: OTP required but not provided");
          return res.status(400).json({ message: "OTP is required" });
        }
      } else {
        // User is using password authentication
        // If user is using password but OTP was provided
        if (otp && !password) {
          console.log("Login failed: OTP provided for password account");
          return res.status(400).json({
            message:
              "This account uses password authentication. Please provide your password.",
            authMethod: "password",
          });
        }

        // Check password
        if (password) {
          isAuthenticated = await user.comparePassword(password);
          console.log("Password verification result:", { isAuthenticated });
          if (!isAuthenticated) {
            return res.status(400).json({ message: "Invalid credentials", code: "INVALID_PASSWORD" });
          }
        } else {
          console.log("Login failed: Password required but not provided");
          return res.status(400).json({ message: "Password is required" });
        }
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) {
            console.error("JWT sign error:", err);
            throw err;
          }
          console.log("Login successful, token generated");
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              useOTP: user.useOTP,
            },
          });
        }
      );
    } catch (err) {
      console.error("Login server error:", err);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email, pan, mobile } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (email) profileFields.email = email;
    if (pan) profileFields.pan = pan;
    if (mobile) profileFields.mobile = mobile;

    // Check if email is already in use by another user
    if (email) {
      const existingUser = await User.findOne({ email });
      if (
        existingUser &&
        existingUser._id.toString() !== req.user._id.toString()
      ) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: profileFields },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in update profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/auth/password
// @desc    Update user password
// @access  Private
router.put("/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check if all required fields are provided
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Get user with password
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in update password:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters")
      .optional({ checkFalsy: true }) // Password is optional if using OTP
      .isLength({ min: 6 }),
    check("useOTP", "useOTP must be a boolean").optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role = "user", useOTP = false } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: "User already exists", code: "EMAIL_IN_USE" });
      }

      // Validate that password is provided if not using OTP
      if (!useOTP && !password) {
        return res.status(400).json({
          message: "Password is required when not using OTP authentication",
        });
      }

      // Create user
      user = new User({
        name,
        email,
        password: useOTP ? undefined : password, // Only set password if not using OTP
        role,
        useOTP,
      });

      // Save user to database
      await user.save();

      // If using OTP, generate and send one
      if (useOTP) {
        await otpUtils.generateAndSaveOTP(email);
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              useOTP: user.useOTP,
            },
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST /api/auth/request-otp
// @desc    Request a new OTP for login
// @access  Public
router.post("/request-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    // If user doesn't exist, return success anyway to prevent email enumeration
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return res.status(200).json({
        message: "If your email is registered, you will receive an OTP",
      });
    }

    // Generate and save OTP
    await otpUtils.generateAndSaveOTP(email);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Request OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP without login
// @access  Public
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    // Verify OTP
    const isValid = await otpUtils.verifyOTP(email, otp);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Find the user to include in the response
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a temporary token for password reset
    const tempPayload = {
      user: {
        id: user.id,
        role: user.role,
        temp: true, // Mark as temporary token
      },
    };

    const tempToken = jwt.sign(
      tempPayload,
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Short expiration for security
    );

    res.status(200).json({ 
      message: "OTP verified successfully",
      tempToken
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/toggle-otp
// @desc    Toggle OTP authentication for a user
// @access  Private
router.post("/toggle-otp", protect, async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if this is a password reset request (from a temporary token)
    const isPasswordReset = req.user.temp === true;

    if (isPasswordReset) {
      // This is a password reset request
      if (!req.body.password) {
        return res.status(400).json({ message: "New password is required" });
      }

      // Set the new password
      user.password = req.body.password;
      
      // Make sure OTP is disabled for password auth
      if (user.useOTP) {
        user.useOTP = false;
      }

      await user.save();

      return res.json({
        message: "Password reset successfully",
        useOTP: user.useOTP,
      });
    } else {
      // Regular toggle OTP functionality
      // Toggle useOTP flag
      user.useOTP = !user.useOTP;

      // If enabling OTP, clear password
      if (user.useOTP) {
        user.password = undefined;
        // Generate and send OTP
        await otpUtils.generateAndSaveOTP(user.email);
      } else {
        // If disabling OTP, require password
        if (!req.body.password) {
          return res
            .status(400)
            .json({ message: "Password is required when disabling OTP" });
        }

        // Set password
        user.password = req.body.password;
      }

      await user.save();

      return res.json({
        message: user.useOTP
          ? "OTP authentication enabled"
          : "OTP authentication disabled",
        useOTP: user.useOTP,
      });
    }
  } catch (error) {
    console.error("Toggle OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
