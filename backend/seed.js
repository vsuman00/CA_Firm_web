const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    seedAdmin();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Seed admin user
async function seedAdmin() {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@comfinancial.com" });

    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: "Admin User",
      email: "admin@comfinancial.com",
      password: "admin123",
      role: "admin",
    });

    await admin.save();

    console.log("Admin user created successfully");
    console.log("Email: admin@comfinancial.com");
    console.log("Password: admin123");
    console.log("IMPORTANT: Change these credentials in production!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
}
