import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { getPostImageUrl, getAvatarUrl } from "../utils/imageUrl";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/posts/${id}`);
      // Fetch fresh post data with populated fields
      const { data: fullPost } = await api.get(`/posts`);
      const foundPost = fullPost.find(p => p._id === id);
      setPost(foundPost || data);
    } catch (err) {
      console.error("Failed to load post:", err);
      setError("Failed to load post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  const isLiked = user && post?.likes?.some(likeId => 
    likeId === user.id || likeId === user._id || likeId.toString() === (user.id || user._id)
  );

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like posts");
      return;
    }

    if (isLiking) return;

    setIsLiking(true);
    try {
      const { data } = await api.patch(`/posts/${post._id}/like`);
      // Reload to get populated data
      await loadPost();
    } catch (error) {
      console.error("Failed to like post:", error);
      alert("Failed to like post. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

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
      await api.post(`/posts/${post._id}/comment`, {
        text: commentText
      });
      setCommentText("");
      await loadPost(); // Reload to get updated comments
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error || "Post not found"}</p>
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
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Author Information */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-4 mb-6">
            <Link to={`/profile/${post.author?.username}`} className="flex-shrink-0">
              {getAvatarUrl(post.author) ? (
                <img
                  src={getAvatarUrl(post.author)}
                  alt={post.author.username}
                  className="w-16 h-16 rounded-full object-cover hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl hover:bg-blue-600 transition-colors">
                  {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </Link>
            <div>
              <Link 
                to={`/profile/${post.author?.username}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {post.author?.username || "Unknown Author"}
              </Link>
              <div className="flex items-center text-gray-500 text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>
        </div>

        {/* Cover Image */}
        {post.coverImage && post.coverImage.data && (
          <div className="w-full">
            <img
              src={getPostImageUrl(post._id)}
              alt={post.title}
              className="w-full h-auto object-contain max-h-[600px]"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Like and Comment Counts */}
        <div className="px-8 py-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-lg transition-all text-lg font-semibold ${
                isLiked 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${isLiking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <svg 
                className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`}
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

            <div className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-gray-100 text-gray-600 text-lg font-semibold">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>
                {post.comments?.length || 0} {post.comments?.length === 1 ? 'Comment' : 'Comments'}
              </span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="px-8 pb-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">Comments</h3>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleComment} className="mb-6">
              <div className="flex gap-3">
                {getAvatarUrl(user) ? (
                  <img
                    src={getAvatarUrl(user)}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isCommenting}
                  />
                  <button
                    type="submit"
                    disabled={isCommenting || !commentText.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    {isCommenting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">
                Please{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  login
                </button>
                {' '}to comment on this post.
              </p>
            </div>
          )}

          {/* Comments List */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.slice().reverse().map((comment, index) => (
                <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                  {getAvatarUrl(comment.user) ? (
                    <img
                      src={getAvatarUrl(comment.user)}
                      alt={comment.user.username}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {comment.user?.username || "Unknown User"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatCommentDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 break-words">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
