import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function PostCard({ post: initialPost }) {
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(initialPost);
  const [isLiking, setIsLiking] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if current user has liked the post
  const isLiked = user && post.likes?.some(likeId => 
    likeId === user.id || likeId === user._id || likeId.toString() === (user.id || user._id)
  );

  // Handle like/unlike
  const handleLike = async (e) => {
    // Prevent navigation when clicking like button
    e.preventDefault(); 
    
    if (!user) {
      alert("Please login to like posts");
      return;
    }

    // Prevent double-clicking
    if (isLiking) return; 

    setIsLiking(true);
    try {
      const { data } = await api.patch(`/posts/${post._id}/like`);
      setPost(data); // Update post with new likes array
    } catch (error) {
      console.error("Failed to like post:", error);
      alert("Failed to like post. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        {/* Author Information */}
        <div className="flex items-center gap-3 mb-4">
          {post.author?.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.username}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
              {post.author?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <p className="text-base font-semibold text-gray-900">
              {post.author?.username || "Unknown Author"}
            </p>
            
            {/* Creation Date */}
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          </div>

          </div>
          
        </div>
        {/* Title */}
        <h2 className="text-2xl font-bold mb-3 text-gray-900">
          <a href={`/post/${post._id}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </a>
        </h2>

        

        {/* Content Preview */}
        <div className="text-gray-700 mb-4 line-clamp-3">
          <p dangerouslySetInnerHTML={{ 
            __html: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : '')
          }} />
        </div>
      </div>

      {/* Cover Image  */}
      {post.coverImage && (
        <div className="w-full">
          <img
            src={`http://localhost:5000/${post.coverImage}`}
            alt={post.title}
            className="w-full h-auto object-contain max-h-96"
          />
        </div>
      )}

      {/* Like Section */}
      <div className="p-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isLiked 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${isLiking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <svg 
              className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            <span className="font-medium">
              {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
            </span>
          </button>

          <a 
            href={`/post/${post._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
          >
            Read more 
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

    </article>
  );
}