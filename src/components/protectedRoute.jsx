import React from "react";
import { Navigate } from "react-router-dom";

// Protected Route component
const ProtectedRoute = ({ isLogin, children }) => {
  if (!isLogin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
