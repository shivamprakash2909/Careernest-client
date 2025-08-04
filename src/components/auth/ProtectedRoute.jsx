import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { createPageUrl } from "../utils";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const jwt = localStorage.getItem("jwt");
      const userData = localStorage.getItem("user");

      if (jwt && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Admin protected route logic
  if (requiredRole === "admin") {
    const adminAuth = localStorage.getItem("admin-auth");
    if (adminAuth !== "true") {
      return <Navigate to={createPageUrl("adminauth")} replace state={{ from: location }} />;
    }
    // If admin-auth is present, allow access
    return children;
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on the route
    const isStudentRoute =
      location.pathname.includes("student") ||
      location.pathname.includes("editresume") ||
      location.pathname.includes("updateprofile") ||
      location.pathname.includes("uploadresume") ||
      (location.pathname.includes("applications") && !location.pathname.includes("job-applications"));

    const loginPath = isStudentRoute ? createPageUrl("studentauth") : createPageUrl("recruiterauth");

    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // Check role requirement if specified
  if (requiredRole && user && user.role !== requiredRole) {
    // Redirect to appropriate page based on user role
    const redirectPath =
      user.role === "student" ? createPageUrl("Home") : createPageUrl("recruiterdashboard");
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
