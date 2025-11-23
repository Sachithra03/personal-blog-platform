import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const { setUser, setToken } = useContext(AuthContext);

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");


    const change = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value});
    };


    const submit = async (e) => {
        e.preventDefault();
        try{
            await api.post("/auth/register", form);

             // auto login after registration
            const { data} = await api.post("/auth/login", {
                email: form.email,
                password: form.password,
            });
            
            setUser(data.user);
            setToken(data.token);

            navigate("/");
        }catch(err){
            setError(err.response?.data?.message || "Registration failed.");
        }
    };

    return(
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 to-purple-100 px-4">
            <div className="w-full max-w-md">
                <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-2xl transform transition-all hover:scale-[1.01]">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Join our community today</p>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input
                                name="username"
                                placeholder="Choose a username"
                                onChange={change}
                                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                required    
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                onChange={change}
                                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                required    
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a strong password"
                                onChange={change}
                                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                required    
                            />
                        </div>
                    </div>

                    <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-full py-3 rounded-lg mt-6 font-semibold hover:from-indigo-700 hover:to-purple-700 transform transition-all hover:shadow-lg active:scale-95">
                        Create Account
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <a href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors">
                                Sign in
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )


}


