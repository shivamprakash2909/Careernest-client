import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const adminToken = localStorage.getItem("admin-token");
      await axiosInstance.put(
        "/api/admin/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setSuccess("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Password change error:", error);
      setError(error.response?.data?.error || "Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("admin-data");
    localStorage.removeItem("admin-auth");
    navigate("/p/adminpage");
  };

  const handleBackToDashboard = () => {
    navigate("/p/adminpage");
  };

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <main className="p-2 sm:p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your credentials and account preferences.</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm sm:text-base">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Change Password Section */}
          <div className="bg-white/90 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8 max-w-lg mx-auto">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-3 sm:space-y-4">
              <div>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Old Password"
                  required
                  className="h-10 sm:h-11 text-sm sm:text-base rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
              <div>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="New Password"
                  required
                  className="h-10 sm:h-11 text-sm sm:text-base rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
              <div>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm Password"
                  required
                  className="h-10 sm:h-11 text-sm sm:text-base rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 sm:h-11 w-full text-sm sm:text-base font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-200 transition text-white shadow-md"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
              {/* Logout Button */}
              <div className="pt-3 sm:pt-4">
                <Button
                  type="button"
                  onClick={handleLogout}
                  className="h-10 sm:h-11 w-full text-sm sm:text-base font-semibold rounded-lg bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-200 transition text-white shadow-md"
                >
                  Logout
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
