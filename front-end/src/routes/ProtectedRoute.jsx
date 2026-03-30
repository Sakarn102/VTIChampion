import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    console.log("ProtectedRoute: No user found, redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log(
    `ProtectedRoute: User role [${user.role}], Allowed roles: ${JSON.stringify(allowedRoles || "any")}`,
  );

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(
      `ProtectedRoute: Access denied! Redirecting role [${user.role}] to appropriate home.`,
    );
    if (user.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "TEACHER") {
      return <Navigate to="/teacher/dashboard" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
