// This script helps create an admin user in the database
// Run it once with: node utils/createAdmin.js

if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Admin = require("../models/Admin.js");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/Scholarship";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");

    const adminUsername = "admin";
    const adminPassword = "admin123";
    const adminEmail = "admin@scholarease.com";

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: adminUsername });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // Create new admin
    const newAdmin = new Admin({
      username: adminUsername,
      password: adminPassword,
      email: adminEmail,
    });

    await newAdmin.save();
    console.log("✓ Admin created successfully");
    console.log(`Username: ${adminUsername}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Email: ${adminEmail}`);
    console.log("\nPlease change the password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
