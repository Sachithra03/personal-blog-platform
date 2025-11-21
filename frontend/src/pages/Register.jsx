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
        <div className = "h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96">
                <h1 className= "text-2xl font-bold mb-5"> Register</h1>

                {error && <p className="text-red-600">{error}</p>}

                <input
                    name="username"
                    placeholder="Username"
                    onChange={change}
                    className="border p-2 w-full mb-3"
                    required    
                />

                <input
                    name="email"
                    placeholder="Email"
                    onChange={change}
                    className="border p-2 w-full mb-3"
                    required    
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={change}
                    className="border p-2 w-full mb-3"
                    required    
                />

                <button className = "bg-blue-600 text-white w-full py-2 rounded">
                    Register
                </button>

                <p className = "text-center mt-3">
                    Already have an account?
                    <a href="/login" className="text-blue-600">Login</a>
                </p>

            </form>
        </div>
    )


}


