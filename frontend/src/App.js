import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";

export default function App(){
  return(
    <BrowserRouter>
    <Navbar />

      <Routes>
       
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}