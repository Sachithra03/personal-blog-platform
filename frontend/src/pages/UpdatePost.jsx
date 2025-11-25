import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect } from "react";
import {useParams} from "react-router-dom";
import { getPostImageUrl } from "../utils/imageUrl";

export default function UpdatePost() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const {id} = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async() => {
      try{
        const { data} = await api.get(`/posts/${id}`);
        setTitle(data.title);
        setContent(data.content);

        if(data.coverImage && data.coverImage.data){
          setPreview(getPostImageUrl(id));
        }
      }catch(error){
        console.error("Failed to load post: ", error);
        alert("Failed to load post");
      }finally{
        setLoading(false);
      }
    };
    loadPost();
  }, [id] );


  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await api.put(`/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post updated successfully")
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Post update failed");
    }
  };

  if(loading){
    return(
      <div className="text-center mt-20 text-xl front-semibold text-gray-600">
        Loading Post...
        </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-10">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Post</h1>
          <p className="text-gray-600">Update your Post</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              placeholder="Enter an engaging title..."
              className="border border-gray-300 p-4 w-full rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <ReactQuill 
                value={content} 
                onChange={setContent}
                placeholder="Tell your story..."
                className="h-64"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input 
                type="file" 
                onChange={handleImage}
                accept="image/*"
                className="hidden"
                id="image-upload"
              />
              <label 
                htmlFor="image-upload" 
                className="cursor-pointer flex flex-col items-center"
              >
                {preview ? (
                  <div className="relative group">
                    <img
                      src={preview}
                      alt="preview"
                      className="max-w-md w-full h-64 object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-blue-600 font-semibold hover:text-blue-700">Upload a cover image</span>
                    <span className="text-gray-500 text-sm mt-1">PNG, JPG up to 10MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all hover:shadow-lg active:scale-95"
            >
              Update Post
            </button>
            <button 
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}