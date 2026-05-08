import { useEffect, useState } from "react"

import API from "../api"
import Navbar from "../components/Navbar"

function Dashboard() {
  const [data, setData] = useState({
    total: 0,
    todo: 0,
    progress: 0,
    done: 0,
    overdue: 0,
    tasksPerUser: {},
    recentTasks: [],
  })

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await API.get(
          "/dashboard"
        )

        setData(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    loadDashboard()
  }, [])

  const cards = [
    {
      title: "Total Tasks",
      value: data.total,
      accent: "#6EE7B7",
    },

    {
      title: "To Do",
      value: data.todo,
      accent: "#FCD34D",
    },

    {
      title: "In Progress",
      value: data.progress,
      accent: "#93C5FD",
    },

    {
      title: "Completed",
      value: data.done,
      accent: "#86EFAC",
    },

    {
      title: "Overdue",
      value: data.overdue,
      accent: "#FCA5A5",
    },
  ]

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white p-10">
        <div className="mb-10">
          <p className="uppercase text-sm tracking-widest text-zinc-500 mb-2">
            Overview
          </p>

          <h1 className="text-5xl font-bold mb-3">
            Dashboard
          </h1>

          <p className="text-zinc-400">
            Welcome back, {user?.name}
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5 mb-12">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >
              <p className="text-zinc-500 text-sm uppercase tracking-wider mb-4">
                {card.title}
              </p>

              <h2
                className="text-5xl font-bold"
                style={{
                  color: card.accent,
                }}
              >
                {card.value}
              </h2>
            </div>
          ))}
        </div>

        {user?.role === "Admin" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">
                Tasks Per User
              </h2>

              <div className="space-y-4">
                {Object.entries(
                  data.tasksPerUser || {}
                ).map(
                  ([name, count]) => (
                    <div
                      key={name}
                      className="flex justify-between items-center bg-black p-4 rounded-xl"
                    >
                      <span>
                        {name}
                      </span>

                      <span className="text-green-400 font-bold">
                        {count}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">
                Recent Tasks
              </h2>

              <div className="space-y-4">
                {data.recentTasks?.map(
                  (task) => (
                    <div
                      key={task._id}
                      className="bg-black p-4 rounded-xl"
                    >
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">
                          {
                            task.title
                          }
                        </h3>

                        <span className="text-sm text-zinc-500">
                          {
                            task.status
                          }
                        </span>
                      </div>

                      <p className="text-sm text-zinc-400">
                        {
                          task.description
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard