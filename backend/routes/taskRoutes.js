// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { protect, requireAdmin } = require("../middleware/auth");
const {
  createTask,
  updateTask,
  deleteTask,
  listTasks
} = require("../controllers/taskController");

router.get("/", protect, listTasks);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, requireAdmin, deleteTask);

module.exports = router;
