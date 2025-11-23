import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreatePost() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

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
      await api.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Post creation failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-5">Create New Post</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          type="text"
          placeholder="Post title"
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <ReactQuill value={content} onChange={setContent} />

        <input type="file" onChange={handleImage} />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-40 h-40 object-cover rounded mt-3"
          />
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Publish
        </button>
      </form>
    </div>
  );
}