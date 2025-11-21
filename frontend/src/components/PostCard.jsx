import React from "react";

export default function PostCard({ post }) {
  return (
    <a
      href={`/post/${post._id}`}
      className="block bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      {post.coverImage && (
        <img
          src={`http://localhost:5000/${post.coverImage}`}
          alt="cover"
          className="h-48 w-full object-cover"
        />
      )}

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">
          {post.title}
        </h2>

        <p className="text-gray-600 text-sm mb-3">
          {post.content.replace(/<[^>]+>/g, "").substring(0, 120)}...
        </p>

        <div className="flex items-center gap-2 mt-3">
          {post.author?.avatar && (
            <img
              src={post.author.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span className="text-gray-700 text-sm">
            {post.author?.username || "Unknown"}
          </span>
        </div>
      </div>
    </a>
  );
}