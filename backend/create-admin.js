// can create admin by giving adminEmail and adminPassword 
// run npm run seed:admin in the terminal
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/user");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "task-manager" });
    console.log("MongoDB connected successfully");

    const adminEmail = "liranramekar7@gmail.com";
    const adminPassword = "liran@123";

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log("Admin already exists:", adminEmail);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashed,
      role: "admin",
    });

    console.log("Admin created successfully!");
    console.log("Login Email:", adminEmail);
    console.log("Login Password:", adminPassword);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
