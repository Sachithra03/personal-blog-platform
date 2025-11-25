import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { getPostImageUrl, getAvatarUrl } from "../utils/imageUrl";

export default function PostCard({ post: initialPost, onDelete }) {
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(initialPost);
  const [isLiking, setIsLiking] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format relative time for post
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return formatDate(dateString);
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

  // Handle comment submission
  const handleComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please login to comment");
      return;
    }

    if (!commentText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    if (isCommenting) return;

    setIsCommenting(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, {
        text: commentText
      });
      setPost(data);
      setCommentText(""); 
      setShowComments(true); // Show comments
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsCommenting(false);
    }
  };

  // Format comment date
  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Check if current user is the post owner
  const isOwner = user && post.author && (
    user.id === post.author._id || 
    user._id === post.author._id ||
    user.username === post.author.username
  );

  
  const handleUpdate = () => {
    
    navigate(`/edit/${post._id}`);
  }

  // Handle delete post
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/posts/${post._id}`);
      if (onDelete) {
        onDelete(post._id);
      }
      alert("Post deleted successfully");
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  return (
    <article className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        {/* Author Information with Menu */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.author?.username}`} className="flex-shrink-0">
              {getAvatarUrl(post.author?.avatar) ? (
                <img
                  src={getAvatarUrl(post.author.avatar)}
                  alt={post.author.username}
                  className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg hover:bg-blue-600 transition-colors">
                  {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </Link>
            <div>
              <Link 
                to={`/profile/${post.author?.username}`}
                className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {post.author?.username || "Unknown Author"}
              </Link>
              <p className="text-sm text-gray-500">
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </div>

          {/* Three Dots Menu - Only for post owner */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Post options"
              >
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="w-full px-4 py-3 text-left text-black-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg className="w-5 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-.828.516L7 15l1.656-4.172a2 2 0 01.516-.828z" />
                    </svg>
                    {isUpdating ? "Updating..." : "Update Post"}
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {isDeleting ? "Deleting..." : "Delete Post"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Title */}
        <h2 className="text-2xl font-bold mb-3 text-gray-900">
          <Link to={`/post/${post._id}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h2>

        

        {/* Content Preview */}
        <div className="text-gray-700 mb-4 line-clamp-3">
          <p dangerouslySetInnerHTML={{ 
            __html: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : '')
          }} />
        </div>
      </div>

      {/* Cover Image  */}
      {post.coverImage && post.coverImage.data && (
        <div className="w-full">
          <img
            src={getPostImageUrl(post._id)}
            alt={post.title}
            className="w-full h-auto object-contain max-h-96"
          />
        </div>
      )}

      {/* Like Section */}
      <div className="p-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-lg transition-all text-base font-semibold ${
              isLiked 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${isLiking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <svg 
              className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`}
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
            <span>
              {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
            </span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all text-base font-semibold"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>
              {post.comments?.length || 0} {post.comments?.length === 1 ? 'Comment' : 'Comments'}
            </span>
          </button>
        </div>

        {/* Comment Form */}
        {user && (
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isCommenting}
              />
              <button
                type="submit"
                disabled={isCommenting || !commentText.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isCommenting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        )}

        {/* Comments Display */}
        {showComments && post.comments && post.comments.length > 0 && (
          <div className="space-y-3 mt-4">
            {post.comments.slice().reverse().map((comment, index) => (
              <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                {getAvatarUrl(comment.user?.avatar) ? (
                  <img
                    src={getAvatarUrl(comment.user.avatar)}
                    alt={comment.user.username}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">
                      {comment.user?.username || "Unknown User"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatCommentDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 break-words">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {showComments && (!post.comments || post.comments.length === 0) && (
          <p className="text-gray-500 text-sm text-center py-4">No comments yet. Be the first to comment!</p>
        )}

        <Link 
          to={`/post/${post._id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mt-4"
        >
          Read full post 
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

    </article>
  );
}