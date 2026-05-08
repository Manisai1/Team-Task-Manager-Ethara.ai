const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()

const authRoutes = require(
  "./src/routes/authRoutes"
)

const projectRoutes = require(
  "./src/routes/projectRoutes"
)

const taskRoutes = require(
  "./src/routes/taskRoutes"
)

const dashboardRoutes = require(
  "./src/routes/dashboardRoutes"
)

const app = express()

app.use(cors())

app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    message:
      "Team Task Manager API Running",
  })
})

app.use("/api/auth", authRoutes)

app.use("/api/projects", projectRoutes)

app.use("/api/tasks", taskRoutes)

app.use(
  "/api/dashboard",
  dashboardRoutes
)

const PORT =
  process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected")

    app.listen(PORT, () => {
      console.log(
        `Server Running on Port ${PORT}`
      )
    })
  })
  .catch((err) => {
    console.log(err)
  })