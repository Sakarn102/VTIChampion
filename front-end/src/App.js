import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Shared/Login";
import Home from "./pages/Shared/Home";
import Register from "./pages/Shared/Register";
import VerifyOtp from "./pages/Shared/VerifyOtp.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route path="/home" element={<Home />} />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
