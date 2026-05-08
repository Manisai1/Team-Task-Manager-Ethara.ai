const express = require("express")

const Task = require("../models/Task")
const Project = require("../models/Project")
const User = require("../models/User")

const auth = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message:
          "Only Admin can create tasks",
      })
    }

    const {
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      project,
    } = req.body

    if (
      !title ||
      !description ||
      !dueDate
    ) {
      return res.status(400).json({
        message: "All fields required",
      })
    }

    let assignedUser = null

    if (assignedTo) {
      assignedUser =
        await User.findById(assignedTo)

      if (!assignedUser) {
        return res.status(404).json({
          message:
            "Assigned user not found",
        })
      }
    }

    let projectExists = null

    if (project) {
      projectExists =
        await Project.findById(project)

      if (!projectExists) {
        return res.status(404).json({
          message:
            "Project not found",
        })
      }
    }

    const newTask = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      project,
      createdBy: req.user._id,
    })

    const populatedTask =
      await Task.findById(newTask._id)
        .populate(
          "assignedTo",
          "name email role"
        )
        .populate("project", "title")

    res.status(201).json(
      populatedTask
    )
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    })
  }
})

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
        .populate(
          "createdBy",
          "name email"
        )
    } else {
      tasks = await Task.find({
        assignedTo: req.user._id,
      })
        .populate(
          "assignedTo",
          "name email role"
        )
        .populate("project", "title")
        .populate(
          "createdBy",
          "name email"
        )
    }

    res.json(tasks)
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    })
  }
})

router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.id
    )

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      })
    }

    if (
      req.user.role !== "Admin" &&
      task.assignedTo &&
      task.assignedTo.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access Denied",
      })
    }

    if (req.body.status) {
      task.status = req.body.status
    }

    if (
      req.user.role === "Admin"
    ) {
      if (req.body.title) {
        task.title = req.body.title
      }

      if (req.body.description) {
        task.description =
          req.body.description
      }

      if (req.body.priority) {
        task.priority =
          req.body.priority
      }

      if (req.body.dueDate) {
        task.dueDate =
          req.body.dueDate
      }

      if (req.body.assignedTo) {
        task.assignedTo =
          req.body.assignedTo
      }
    }

    await task.save()

    const updatedTask =
      await Task.findById(task._id)
        .populate(
          "assignedTo",
          "name email role"
        )
        .populate("project", "title")

    res.json(updatedTask)
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    })
  }
})

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message:
          "Only Admin can delete tasks",
      })
    }

    const task = await Task.findById(
      req.params.id
    )

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      })
    }

    await Task.findByIdAndDelete(
      req.params.id
    )

    res.json({
      message:
        "Task deleted successfully",
    })
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    })
  }
})

module.exports = router