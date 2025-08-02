import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
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
      await axios.put("/api/admin/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      setSuccess("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
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
      <main className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-2">Manage your credentials and account preferences.</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* Change Password Section */}
          <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-200 p-8 max-w-lg mx-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Old Password"
                  required
                  className="h-8 text-base rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
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
                  className="h-8 text-base rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
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
                  className="h-8 text-base rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 w-full text-base font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-200 transition text-white shadow-md"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
              {/* Logout Button */}
              <div className="pt-4">
                <Button
                  type="button"
                  onClick={handleLogout}
                  className="h-10 w-full text-base font-semibold rounded-lg bg-red-500 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-200 transition text-white shadow-md"
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