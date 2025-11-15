// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// connect to Mongo
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "task-manager" });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

connectDB();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// basic health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

