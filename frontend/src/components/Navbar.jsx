import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAvatarUrl } from "../utils/imageUrl";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-2xl border-b border-blue-800/30 backdrop-blur-md">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all transform group-hover:scale-110 group-hover:rotate-3">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
        </div>
        <div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-indigo-300 transition-all">
            BlogSpace
          </span>
          <div className="text-xs text-blue-300/80 font-medium tracking-wide">Share Your Story</div>
        </div>
      </Link>

      {/* Center Navigation */}
      <div className="hidden md:flex items-center gap-6">
        
        {user && (
          <Link
            to="/create"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isActive('/create')
                ? 'bg-emerald-600/50 text-white shadow-lg shadow-emerald-500/30'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-800/30'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create
          </Link>
        )}
      </div>

      {/* Right Side - User Menu */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all group"
            >
              {getAvatarUrl(user.avatar) ? (
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 shadow-lg group-hover:border-blue-300 transition-all ring-2 ring-blue-400/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-blue-400 shadow-lg group-hover:border-blue-300 transition-all ring-2 ring-blue-400/30">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-white">{user.username}</div>
                <div className="text-xs text-blue-300">View profile</div>
              </div>
              <svg className={`w-4 h-4 text-blue-300 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <div className="font-semibold text-gray-900">{user.username}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
                
                <Link
                  to="/profile/me"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">My Profile</span>
                </Link>

                <Link
                  to="/create"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 transition-colors md:hidden"
                >
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">Create Post</span>
                </Link>

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                    window.location.href = '/';
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full border-t border-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 font-semibold text-blue-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}