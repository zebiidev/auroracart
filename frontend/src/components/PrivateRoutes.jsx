import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Outlet, Navigate } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";

const PrivateRoutes = ({ role }) => {
  const { user, authLoading } = useSelector((state) => state.auth);

  if (authLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <FadeLoader />
      </div>
    );
  }

  if (!user) {
    if (!toast.isActive("login-toast")) {
      toast.error("Please login first", { toastId: "login-toast" });
    }
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    if (!toast.isActive("access-toast")) {
      toast.error("Access denied", { toastId: "access-toast" });
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
