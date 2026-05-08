import { useEffect, useState } from "react"
import API from "../api"
import Navbar from "../components/Navbar"

function Projects() {
  const [projects, setProjects] =
    useState([])

  const [form, setForm] = useState({
    title: "",
    description: "",
  })

  const [memberEmails, setMemberEmails] =
    useState({})

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  const fetchProjects = async () => {
    try {
      const res = await API.get(
        "/projects"
      )

      setProjects(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const loadProjects = async () => {
      await fetchProjects()
    }

    loadProjects()
  }, [])

  const createProject = async (e) => {
    e.preventDefault()

    try {
      await API.post(
        "/projects",
        form
      )

      setForm({
        title: "",
        description: "",
      })

      fetchProjects()
    } catch (err) {
      alert(
        err.response?.data?.message
      )
    }
  }

  const addMember = async (
    projectId
  ) => {
    try {
      await API.put(
        `/projects/${projectId}/add-member`,
        {
          email:
            memberEmails[projectId],
        }
      )

      alert("Member Added")

      setMemberEmails({
        ...memberEmails,
        [projectId]: "",
      })

      fetchProjects()
    } catch (err) {
      alert(
        err.response?.data?.message
      )
    }
  }

  const removeMember = async (
    projectId,
    userId
  ) => {
    try {
      await API.put(
        `/projects/${projectId}/remove-member`,
        {
          userId,
        }
      )

      fetchProjects()
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
        <h1 className="text-5xl font-bold mb-10">
          Projects
        </h1>

        {user?.role === "Admin" && (
          <form
            onSubmit={createProject}
            className="bg-zinc-900 p-6 rounded-2xl mb-10"
          >
            <h2 className="text-2xl font-semibold mb-5">
              Create Project
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Title"
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
                placeholder="Project Description"
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
            </div>

            <button className="bg-white text-black px-6 py-3 rounded-xl mt-5 font-semibold">
              Create Project
            </button>
          </form>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold mb-2">
                {project.title}
              </h2>

              <p className="text-zinc-400 mb-5">
                {project.description}
              </p>

              <div className="mb-5">
                <h3 className="font-semibold mb-2">
                  Admin
                </h3>

                <p className="text-sm text-zinc-400">
                  {
                    project.admin
                      ?.name
                  }
                </p>
              </div>

              <div className="mb-5">
                <h3 className="font-semibold mb-3">
                  Members
                </h3>

                <div className="space-y-2">
                  {project.members?.map(
                    (member) => (
                      <div
                        key={
                          member._id
                        }
                        className="flex justify-between items-center bg-black p-3 rounded-lg"
                      >
                        <div>
                          <p className="text-sm">
                            {
                              member.name
                            }
                          </p>

                          <p className="text-xs text-zinc-500">
                            {
                              member.email
                            }
                          </p>
                        </div>

                        {user?.role ===
                          "Admin" &&
                          project.admin
                            ?._id ===
                            user._id &&
                          member._id !==
                            user._id && (
                            <button
                              onClick={() =>
                                removeMember(
                                  project._id,
                                  member._id
                                )
                              }
                              className="text-red-500 text-sm"
                            >
                              Remove
                            </button>
                          )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {user?.role ===
                "Admin" &&
                project.admin?._id ===
                  user._id && (
                  <div>
                    <input
                      type="email"
                      placeholder="Enter member email"
                      value={
                        memberEmails[
                          project._id
                        ] || ""
                      }
                      className="w-full bg-black border border-zinc-700 p-3 rounded-xl mb-3"
                      onChange={(e) =>
                        setMemberEmails({
                          ...memberEmails,
                          [project._id]:
                            e.target
                              .value,
                        })
                      }
                    />

                    <button
                      onClick={() =>
                        addMember(
                          project._id
                        )
                      }
                      className="w-full bg-white text-black py-3 rounded-xl font-semibold"
                    >
                      Add Member
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Projects