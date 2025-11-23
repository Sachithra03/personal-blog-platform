import React from "react";

export default function PostCard({ post }) {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <article className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Cover Image - Full display without cropping */}
      {post.coverImage && (
        <div className="w-full">
          <img
            src={`http://localhost:5000/${post.coverImage}`}
            alt={post.title}
            className="w-full h-auto object-contain max-h-96"
          />
        </div>
      )}

      <div className="p-6">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-3 text-gray-900">
          <a href={`/post/${post._id}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </a>
        </h2>

        {/* Creation Date */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>

        {/* Content Preview with Rich Text Support */}
        <div className="text-gray-700 mb-4 line-clamp-3">
          <p dangerouslySetInnerHTML={{ 
            __html: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : '')
          }} />
        </div>

        {/* Author Information */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {post.author?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {post.author?.username || "Unknown Author"}
              </p>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>

          <a 
            href={`/post/${post._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Read more →
          </a>
        </div>
      </div>
    </article>
  );
}