import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import { getAvatarUrl } from "../utils/imageUrl";

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, logout, setUser } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // If username is "me", load current user's profile
      const targetUsername = username === "me" ? currentUser?.username : username;
      
      if (!targetUsername) {
        setError("User not found");
        setLoading(false);
        return;
      }

      // Try to get user profile from backend first
      try {
        const { data: userData } = await api.get(`/auth/profile/${targetUsername}`);
        setProfileUser({
          ...userData,
          avatar: getAvatarUrl(userData.avatar)
        });
        
        // Get user's posts
        const { data: allPosts } = await api.get("/posts");
        const userPosts = allPosts.filter(
          post => post.author?.username === targetUsername
        );
        setPosts(userPosts);
      } catch (profileErr) {
        // If user profile endpoint fails, fall back to posts lookup
        const { data: allPosts } = await api.get("/posts");
        const userPosts = allPosts.filter(
          post => post.author?.username === targetUsername
        );
        
        if (userPosts.length > 0) {
          setProfileUser(userPosts[0].author);
          setPosts(userPosts);
        } else if (username === "me" && currentUser) {
          // If viewing own profile and no posts, show current user info
          setProfileUser(currentUser);
          setPosts([]);
        } else {
          setError("User not found");
        }
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editedUsername.trim()) {
      alert("Username cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("username", editedUsername.trim());
      
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const { data } = await api.patch("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Update current user in context and localStorage
      const updatedUser = {
        ...data,
        avatar: getAvatarUrl(data.avatar)
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // If username changed, navigate to new profile URL
      const usernameChanged = data.username !== profileUser.username;
      
      alert("Profile updated successfully!");
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      
      if (usernameChanged) {
        // Redirect to new username profile
        navigate(`/profile/${data.username}`, { replace: true });
      } else {
        // Just reload current profile
        await loadProfile();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(error.response?.data?.error || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm("Are you sure you want to delete your profile picture?")) {
      return;
    }

    setIsSaving(true);
    try {
      const { data } = await api.delete("/auth/profile/avatar");
      
      // Update current user in context and localStorage
      const updatedUser = {
        ...data,
        avatar: null
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setAvatarPreview(null);
      setAvatarFile(null);
      alert("Profile picture deleted successfully!");
      await loadProfile();
    } catch (error) {
      console.error("Failed to delete avatar:", error);
      alert("Failed to delete profile picture. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const isOwnProfile = currentUser && (
    username === "me" || 
    profileUser?.username === currentUser.username
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error || "User not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-10">
      {/* Header with Back Button and Logout */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {isOwnProfile && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0 relative">
            {(avatarPreview || getAvatarUrl(profileUser.avatar)) ? (
              <img
                src={avatarPreview || getAvatarUrl(profileUser.avatar)}
                alt={profileUser.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-5xl border-4 border-gray-200">
                {(isEditing ? editedUsername : profileUser.username)?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            
            {/* Camera Icon */}
            {isEditing && isOwnProfile && (
              <>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors border-2 border-white shadow-lg"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            {!isEditing ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profileUser.username}
                </h1>
                <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-semibold">{posts.length}</span>
                    <span>{posts.length === 1 ? 'Post' : 'Posts'}</span>
                  </div>
                  
                </div>
                
                
                {isOwnProfile && (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditedUsername(profileUser.username);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Edit Profile
                  </button>
                )}

                
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter username"
                  />
                </div>
                
                {/* Remove Avatar Button */}
                {profileUser.avatar && (
                  <div>
                    <button
                      onClick={handleDeleteAvatar}
                      disabled={isSaving}
                      className="text-sm text-red-600 hover:text-red-700 underline disabled:opacity-50"
                    >
                      Remove profile picture
                    </button>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isOwnProfile ? 'Your Posts' : `Posts by ${profileUser.username}`}
        </h2>
        
        {posts.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 text-lg mb-4">
              {isOwnProfile ? "You haven't created any posts yet." : "This user hasn't created any posts yet."}
            </p>
            {isOwnProfile && (
              <button
                onClick={() => navigate("/create")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Your First Post
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
