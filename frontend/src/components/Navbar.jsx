import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  // Helper function to get full avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('http')) return avatar;
    return `http://localhost:5000/${avatar.replace(/\\/g, '/')}`;
  };

  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Blog Platform</Link>

      <div className="flex items-center gap-4">
        {user && (
          <Link
            to="/create"
            className="text-white bg-green-600 px-3 py-1 rounded"
          >
            + New Post
          </Link>
        )}

        {user ? (
          <Link 
            to="/profile/me" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title={`View ${user.username}'s profile`}
          >
            {getAvatarUrl(user.avatar) ? (
              <img
                src={getAvatarUrl(user.avatar)}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold border-2 border-white">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </Link>
        ) : (
          <Link to="/login" className="text-blue-400 hover:text-blue-300">Login</Link>
        )}
      </div>
    </div>
  );
}