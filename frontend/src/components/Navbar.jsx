import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between">
      <Link to="/" className="text-xl font-bold">Blog Platform</Link>

      {user && (
  <Link
    to="/create"
    className="text-white bg-green-600 px-3 py-1 rounded mr-3"
  >
    + New Post
  </Link>
)}

      {user ? (
        <div className="flex gap-4 items-center">
          <Link to="/profile/me" className="hover:text-blue-400 transition-colors">
            Hello, {user.username}
          </Link>
        </div>
      ) : (
        <Link to="/login" className="text-blue-400">Login</Link>
      )}
    </div>
  );
}