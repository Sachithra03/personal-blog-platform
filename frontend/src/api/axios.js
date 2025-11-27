import axios from "axios";

const api = axios.create({
    // Prefer env override; fall back to backend default PORT=5001
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/api",
});

// Add token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;