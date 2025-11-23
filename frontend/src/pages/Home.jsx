import { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/posts");
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 pb-10">
      {/* Hero Section */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Welcome to Our Blog Platform
        </h1>
        <p className="text-lg text-gray-600">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-xl text-gray-500 mb-2">No posts yet</p>
          <p className="text-gray-400">Be the first to share your story!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post, index) => (
            <div 
              key={post._id} 
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PostCard post={post} onDelete={handleDeletePost} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}