import { useState } from "react"

import {
  Link,
  useNavigate,
} from "react-router-dom"

import API from "../api"

function Signup() {
  const navigate = useNavigate()

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "Member",
    })

  const submit = async (e) => {
    e.preventDefault()

    try {
      await API.post(
        "/auth/signup",
        form
      )

      alert("Signup Successful")

      navigate("/")
    } catch (err) {
      alert(
        err.response?.data
          ?.message
      )
    }
  }

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-5">
      <form
        onSubmit={submit}
        className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-md"
      >
        <h1 className="text-4xl text-white font-bold mb-8">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl mb-4"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name:
                e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl mb-4"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl mb-4"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <select
          className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl mb-6"
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role:
                e.target.value,
            })
          }
        >
          <option value="Member">
            Member
          </option>

          <option value="Admin">
            Admin
          </option>
        </select>

        <button className="w-full bg-white text-black p-4 rounded-xl font-semibold">
          Signup
        </button>

        <p className="text-zinc-400 text-center mt-6">
          Already have account?

          <Link
            to="/"
            className="text-white ml-2"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signup