import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

export default function App(){
  return(
    <BrowserRouter>
    <Navbar />

      <Routes>
        <Route path="/" element={<h1 className="text-center mt-10 text-3xl"> Home Page</h1>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>

    </BrowserRouter>
  )
}