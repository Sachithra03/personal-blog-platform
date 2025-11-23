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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-2xl transform transition-all hover:scale-[1.01]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onChange={change}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onChange={change}
                required
              />
            </div>
          </div>

          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-full py-3 rounded-lg mt-6 font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all hover:shadow-lg active:scale-95">
            Sign In
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                Create one
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}