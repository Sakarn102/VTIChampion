import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Shared/Login";
import Home from "./pages/Shared/Home";
import Register from "./pages/Shared/Register";
import VerifyOtp from "./pages/Shared/VerifyOtp";
import LayoutRoot from "./layout/LayoutRoot";
import ExamList from "./pages/Instructor/ExamList";
import CreateExam from "./pages/Instructor/CreateExam";
import ExamDetail from "./pages/Instructor/ExamDetail";
import EditExam from "./pages/Instructor/EditExam";
import Profile from "./pages/Shared/Profile";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import ClassManagement from "./pages/Admin/ClassManagement";
import ExamManagement from "./pages/Admin/ExamManagement";
import QuestionManagement from "./pages/Admin/QuestionManagement";
import ResultsManagement from "./pages/Admin/ResultsManagement";
import GenericAdminPage from "./pages/Admin/GenericAdminPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route path="/" element={<LayoutRoot />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="exam-list" element={<ExamList />} />
        <Route path="create-exam" element={<CreateExam />} />
        <Route path="exams/:examId" element={<ExamDetail />} />
        <Route path="exams/edit/:examId" element={<EditExam />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="classes" element={<ClassManagement />} />
        <Route path="exams" element={<ExamManagement />} />
        <Route path="questions" element={<QuestionManagement />} />
        <Route path="results" element={<ResultsManagement />} />
        <Route path="reports" element={<GenericAdminPage title="Báo cáo & Phân tích" />} />
        <Route path="settings" element={<GenericAdminPage title="Cài đặt hệ thống" />} />
        <Route path="notifications" element={<GenericAdminPage title="Quản lý Thông báo" />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
