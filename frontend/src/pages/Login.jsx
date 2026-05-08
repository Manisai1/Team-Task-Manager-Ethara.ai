import { useState } from "react"

import {
  Link,
  useNavigate,
} from "react-router-dom"

import API from "../api"

function Login() {
  const navigate = useNavigate()

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    })

  const submit = async (e) => {
    e.preventDefault()

    try {
      const res = await API.post(
        "/auth/login",
        form
      )

      localStorage.setItem(
        "token",
        res.data.token
      )

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      )

      alert("Login Successful")

      navigate("/dashboard")
    } catch (err) {
      alert(
        err.response?.data
          ?.message ||
          "Login Failed"
      )
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center items-center p-5">
      <form
        onSubmit={submit}
        className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-4xl font-bold text-center mb-3 text-black">
          Welcome Back
        </h1>

        <p className="text-center text-zinc-500 mb-8">
          Login to continue
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-zinc-300 bg-zinc-100 text-black p-4 rounded-2xl mb-5"
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
          className="w-full border border-zinc-300 bg-zinc-100 text-black p-4 rounded-2xl mb-6"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <button className="w-full bg-black text-white p-4 rounded-2xl font-semibold">
          Login
        </button>

        <p className="text-center mt-6 text-zinc-600">
          Don't have an account?

          <Link
            to="/signup"
            className="text-blue-600 ml-2 font-semibold"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login