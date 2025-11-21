import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem("token") || "");

    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        if (token) localStorage.setItem("token", token);
    }, [user, token]);

    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return(
        <AuthContext.Provider value = {{ user, setUser, token, setToken, logout}}>
            {children}
        </AuthContext.Provider>
    );



}; 