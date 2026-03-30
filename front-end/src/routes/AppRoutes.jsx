import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// Shared Pages
import Login from "../pages/Shared/Login";
import Home from "../pages/Shared/Home";
import Register from "../pages/Shared/Register";
import VerifyOtp from "../pages/Shared/VerifyOtp";
import Profile from "../pages/Shared/Profile";
import ResetPassword from "../pages/Shared/ResetPassword";
import ForgotPassword from "../pages/Shared/ForgotPassword";

// Admin Pages
import AdminLayout from "../pages/Admin/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UserManagement from "../pages/Admin/UserManagement";
import ClassManagement from "../pages/Admin/ClassManagement";
import ExamManagement from "../pages/Admin/ExamManagement";
import QuestionManagement from "../pages/Admin/QuestionManagement";
import ResultsManagement from "../pages/Admin/ResultsManagement";
import GenericAdminPage from "../pages/Admin/GenericAdminPage";

// Teacher Layout
import TeacherLayout from "../layouts/TeacherLayout";
import StudentLayout from "../layouts/StudentLayout";

// Instructor Pages
import ExamList from "../pages/Instructor/ExamList";
import CreateExam from "../pages/Instructor/CreateExam";
import EditExam from "../pages/Instructor/EditExam";
import ExamDetail from "../pages/Instructor/ExamDetail";
import ExamQuestions from "../pages/Instructor/ExamQuestions";
import ClassList from "../pages/Instructor/ClassList";
import ClassDetail from "../pages/Instructor/ClassDetail";
import TeacherDashboard from "../pages/Instructor/TeacherDashboard";
import HelpCenter from "../pages/Instructor/HelpCenter";

// HomeRedirect để điều hướng user về đúng workspace
const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "TEACHER") return <Navigate to="/teacher/dashboard" replace />;
  return <Navigate to="/home" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Guest Only */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <GuestRoute>
            <VerifyOtp />
          </GuestRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <GuestRoute>
            <ResetPassword />
          </GuestRoute>
        }
      />

      {/* Root Redirect Logic */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="classes" element={<ClassManagement />} />
        <Route path="exams" element={<ExamManagement />} />
        <Route path="questions" element={<QuestionManagement />} />
        <Route path="results" element={<ResultsManagement />} />
        <Route
          path="reports"
          element={<GenericAdminPage title="Báo cáo & Phân tích" />}
        />
        <Route
          path="settings"
          element={<GenericAdminPage title="Cài đặt hệ thống" />}
        />
        <Route
          path="notifications"
          element={<GenericAdminPage title="Quản lý Thông báo" />}
        />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Teacher Routes */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={<TeacherDashboard />}
        />
        <Route path="exams" element={<ExamList />} />
        <Route path="exams/create" element={<CreateExam />} />
        <Route path="exams/:examId" element={<ExamDetail />} />
        <Route path="exams/:examId/questions" element={<ExamQuestions />} />
        <Route path="exams/:examId/edit" element={<EditExam />} />
        <Route
          path="students"
          element={<ClassList />}
        />
        <Route
          path="students/:classId"
          element={<ClassDetail />}
        />
        <Route path="help" element={<HelpCenter />} />
        <Route
          path="notifications"
          element={<GenericAdminPage title="Thông báo Giảng viên" />}
        />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Student Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/results" element={<ResultsManagement />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
