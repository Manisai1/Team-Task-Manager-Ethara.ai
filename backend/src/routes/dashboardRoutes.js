const express = require("express")

const Task = require("../models/Task")

const auth = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/", auth, async (req, res) => {
  try {
    let tasks

    if (req.user.role === "Admin") {
      tasks = await Task.find()
        .populate(
          "assignedTo",
          "name email role"
        )
        .populate("project", "title")
    } else {
      tasks = await Task.find({
        assignedTo: req.user._id,
      })
        .populate(
          "assignedTo",
          "name email role"
        )
        .populate("project", "title")
    }

    const total = tasks.length

    const todo = tasks.filter(
      (task) => task.status === "To Do"
    ).length

    const progress = tasks.filter(
      (task) =>
        task.status === "In Progress"
    ).length

    const done = tasks.filter(
      (task) => task.status === "Done"
    ).length

    const overdue = tasks.filter(
      (task) =>
        new Date(task.dueDate) <
          new Date() &&
        task.status !== "Done"
    ).length

    const tasksPerUser = {}

    tasks.forEach((task) => {
      if (task.assignedTo) {
        const userName =
          task.assignedTo.name

        tasksPerUser[userName] =
          (tasksPerUser[userName] || 0) + 1
      }
    })

    const recentTasks = tasks
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 5)

    res.json({
      total,
      todo,
      progress,
      done,
      overdue,
      tasksPerUser,
      recentTasks,
    })
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    })
  }
})

module.exports = router