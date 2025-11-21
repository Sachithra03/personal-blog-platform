import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between">
      <a href="/" className="text-xl font-bold">Blog Platform</a>

      {user ? (
        <div className="flex gap-4 items-center">
          <span>Hello, {user.username}</span>
          <button className="bg-red-500 px-3 py-1 rounded" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <a href="/login" className="text-blue-400">Login</a>
      )}
    </div>
  );
}