import { useEffect, useState } from "react"

import API from "../api"
import Navbar from "../components/Navbar"

function Tasks() {
  const [tasks, setTasks] =
    useState([])

  const [projects, setProjects] =
    useState([])

  const [users, setUsers] =
    useState([])

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    assignedTo: "",
    project: "",
  })

  const fetchTasks = async () => {
    try {
      const res = await API.get(
        "/tasks"
      )

      setTasks(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await API.get(
        "/projects"
      )

      setProjects(res.data)

      const allMembers =
        res.data.flatMap(
          (project) =>
            project.members || []
        )

      const uniqueUsers =
        Array.from(
          new Map(
            allMembers.map((u) => [
              u._id,
              u,
            ])
          ).values()
        )

      setUsers(uniqueUsers)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchProjects()
  }, [])

  const createTask = async (e) => {
    e.preventDefault()

    try {
      await API.post("/tasks", form)

      alert("Task Created")

      setForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        assignedTo: "",
        project: "",
      })

      fetchTasks()
    } catch (err) {
      alert(
        err.response?.data?.message
      )
    }
  }

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      await API.put(
        `/tasks/${id}`,
        {
          status,
        }
      )

      fetchTasks()
    } catch (err) {
      alert(
        err.response?.data?.message
      )
    }
  }

  const deleteTask = async (id) => {
    try {
      await API.delete(
        `/tasks/${id}`
      )

      fetchTasks()
    } catch (err) {
      alert(
        err.response?.data?.message
      )
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white p-10">
        <div className="mb-10">
          <p className="uppercase text-sm tracking-widest text-zinc-500 mb-2">
            Workspace
          </p>

          <h1 className="text-5xl font-bold mb-3">
            Tasks
          </h1>

          <p className="text-zinc-400">
            Manage and track work
          </p>
        </div>

        {user?.role === "Admin" && (
          <form
            onSubmit={createTask}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl mb-10"
          >
            <h2 className="text-2xl font-bold mb-6">
              Create Task
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              <input
                type="text"
                placeholder="Task Title"
                value={form.title}
                className="bg-black border border-zinc-700 p-4 rounded-xl"
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Description"
                value={form.description}
                className="bg-black border border-zinc-700 p-4 rounded-xl"
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
              />

              <input
                type="date"
                value={form.dueDate}
                className="bg-black border border-zinc-700 p-4 rounded-xl"
                onChange={(e) =>
                  setForm({
                    ...form,
                    dueDate:
                      e.target.value,
                  })
                }
              />

              <select
                value={form.priority}
                className="bg-black border border-zinc-700 p-4 rounded-xl"
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority:
                      e.target.value,
                  })
                }
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>

              <select
                value={form.project}
                className="bg-black border border-zinc-700 p-4 rounded-xl"
                onChange={(e) =>
                  setForm({
                    ...form,
                    project:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select Project
                </option>

                {projects.map(
                  (project) => (
                    <option
                      key={
                        project._id
                      }
                      value={
                        project._id
                      }
                    >
                      {
                        project.title
                      }
                    </option>
                  )
                )}
              </select>

              <select
                value={
                  form.assignedTo
                }
                className="bg-black border border-zinc-700 p-4 rounded-xl"
                onChange={(e) =>
                  setForm({
                    ...form,
                    assignedTo:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Assign User
                </option>

                {users.map((u) => (
                  <option
                    key={u._id}
                    value={u._id}
                  >
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold">
              Create Task
            </button>
          </form>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">
                  {task.title}
                </h2>

                <span className="text-sm text-zinc-500">
                  {task.status}
                </span>
              </div>

              <p className="text-zinc-400 mb-5">
                {task.description}
              </p>

              <div className="space-y-2 text-sm text-zinc-500 mb-6">
                <p>
                  Priority:{" "}
                  {task.priority}
                </p>

                <p>
                  Due:{" "}
                  {new Date(
                    task.dueDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  Assigned To:{" "}
                  {task.assignedTo
                    ?.name || "N/A"}
                </p>

                <p>
                  Project:{" "}
                  {task.project
                    ?.title || "N/A"}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    updateStatus(
                      task._id,
                      "In Progress"
                    )
                  }
                  className="bg-blue-500 px-4 py-2 rounded-lg text-sm"
                >
                  In Progress
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      task._id,
                      "Done"
                    )
                  }
                  className="bg-green-500 px-4 py-2 rounded-lg text-sm"
                >
                  Done
                </button>

                {user?.role ===
                  "Admin" && (
                  <button
                    onClick={() =>
                      deleteTask(
                        task._id
                      )
                    }
                    className="bg-red-500 px-4 py-2 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Tasks