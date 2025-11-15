const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password, role: role === "admin" ? "admin" : "user" });
  const token = signToken(user);
  res.status(201).json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await user.comparePassword(password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);
  res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password reset successfully" });
});

