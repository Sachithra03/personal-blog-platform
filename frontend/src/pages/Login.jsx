import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      setUser(data.user);
      setToken(data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-5">Login</h1>
        {error && <p className="text-red-600">{error}</p>}

        <input
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={change}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={change}
          required
        />

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Login
        </button>

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600">Register</a>
        </p>
      </form>
    </div>
  );
}