const express = require("express")

const Project = require("../models/Project")
const User = require("../models/User")

const auth = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title || !description) {
      return res.status(400).json({
        message: "All fields required",
      })
    }

    const project = await Project.create({
      title,
      description,
      admin: req.user._id,
      members: [req.user._id],
    })

    res.status(201).json(project)
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    })
  }
})

router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user._id,
    })
      .populate("members", "name email role")
      .populate("admin", "name email")

    res.json(projects)
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    })
  }
})

router.put(
  "/:id/add-member",
  auth,
  async (req, res) => {
    try {
      const { email } = req.body

      const project = await Project.findById(
        req.params.id
      )

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        })
      }

      if (
        project.admin.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "Only admin can add members",
        })
      }

      const user = await User.findOne({
        email: email.toLowerCase(),
      })

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        })
      }

      const alreadyMember =
        project.members.some(
          (memberId) =>
            memberId.toString() ===
            user._id.toString()
        )

      if (alreadyMember) {
        return res.status(400).json({
          message:
            "User already a member",
        })
      }

      project.members.push(user._id)

      await project.save()

      const updatedProject =
        await Project.findById(project._id)
          .populate(
            "members",
            "name email role"
          )
          .populate(
            "admin",
            "name email"
          )

      res.json(updatedProject)
    } catch (err) {
      res.status(500).json({
        message: "Server Error",
      })
    }
  }
)

router.put(
  "/:id/remove-member",
  auth,
  async (req, res) => {
    try {
      const { userId } = req.body

      const project = await Project.findById(
        req.params.id
      )

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        })
      }

      if (
        project.admin.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "Only admin can remove members",
        })
      }

      project.members =
        project.members.filter(
          (memberId) =>
            memberId.toString() !== userId
        )

      await project.save()

      res.json({
        message:
          "Member removed successfully",
      })
    } catch (err) {
      res.status(500).json({
        message: "Server Error",
      })
    }
  }
)

module.exports = router