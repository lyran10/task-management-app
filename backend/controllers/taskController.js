const Task = require("../models/task");
const asyncHandler = require("../utils/asyncHandler");

exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });
  if (!description) return res.status(400).json({ message: "Title is required" });
  if (!status) return res.status(400).json({ message: "Title is required" });

  const task = await Task.create({
    title,
    description: description || "",
    status: status || "Pending",
    createdBy: req.user._id
  });

  res.status(201).json(task);
});

exports.updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  if (status) task.status = status;
  await task.save();

  res.status(200).json(task);
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  await task.deleteOne();
  res.status(200).json({ message: "Task deleted" });
});

exports.listTasks = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || "1"));
  const limit = Math.max(1, parseInt(req.query.limit || "10"));
  const status = req.query.status;

  const q = { createdBy: req.user._id };

  if (status && ["Pending", "Completed"].includes(status)) {
    q.status = status;
  }

  const total = await Task.countDocuments(q);
  const tasks = await Task.find(q)
    // .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("createdBy", "name email role");

  res.json({
    tasks,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

