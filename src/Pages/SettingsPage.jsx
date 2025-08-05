import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { getUserInfo, validateJWT } from "@/components/utils";
import { useToast } from "@/components/common/ToastContext";
import { axiosInstance } from "@/lib/axios";

export default function SettingsPage() {
  const { showError, showSuccess } = useToast();
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [nameStatus, setNameStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const oldPasswordRef = useRef(null);

  useEffect(() => {
    // Detect if user is a Google user (no password set)
    const userInfo = getUserInfo();
    if (!userInfo || !userInfo.tokenValid) {
      console.log("No valid JWT token found");
      return;
    }

    const jwt = localStorage.getItem("jwt");
    console.log("JWT token found:", jwt.substring(0, 20) + "...");

    axiosInstance
      .get("/api/user/password-status", {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .then((res) => {
        console.log("Password status response:", res.status);
        if (!(res.status === 200 || res.status === 201)) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.data;
      })
      .then((data) => {
        console.log("Password status data:", data);
        if (data.hasPassword === false) {
          setIsGoogleUser(true);
        } else {
          setIsGoogleUser(false);
        }
      })
      .catch((error) => {
        console.error("Error checking password status:", error);
        setIsGoogleUser(false);
      });
  }, []);

  // Auto-focus old password field when switching to Change Password form
  useEffect(() => {
    if (!isGoogleUser && oldPasswordRef.current) {
      oldPasswordRef.current.focus();
    }
  }, [isGoogleUser]);

  const handleChangePassword = async () => {
    setPasswordStatus("");
    setShowPasswordSuccess(false);
    if (isGoogleUser) {
      // Google user: only need new password and confirm
      if (!newPassword || !confirmPassword) {
        setPasswordStatus("Please fill in all fields.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordStatus("Passwords do not match.");
        return;
      }
      if (newPassword.length < 8) {
        setPasswordStatus("Password must be at least 8 characters.");
        return;
      }
      try {
        const jwt = localStorage.getItem("jwt");
        const res = await axiosInstance.patch(
          "/api/user/password",
          { newPassword },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        if (!(res.status === 200 || res.status === 201)) {
          const err = res.data;
          setPasswordStatus(err.error || "Failed to set password.");
          return;
        }
        setPasswordStatus("Password set successfully!");
        setShowPasswordSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
        setIsGoogleUser(false); // Update state to show "Change Password" form
        // Clear success message after 3 seconds
        setTimeout(() => setShowPasswordSuccess(false), 3000);
      } catch (err) {
        setPasswordStatus("An error occurred. Please try again.");
      }
    } else {
      // Normal user: require old password
      if (!oldPassword || !newPassword || !confirmPassword) {
        setPasswordStatus("Please fill in all fields.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordStatus("Passwords do not match.");
        return;
      }
      if (newPassword.length < 8) {
        setPasswordStatus("Password must be at least 8 characters.");
        return;
      }
      try {
        const jwt = localStorage.getItem("jwt");
        const res = await axiosInstance.patch(
          "/api/user/password",
          { oldPassword, newPassword },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        if (!(res.status === 200 || res.status === 201)) {
          const err = res.data;
          setPasswordStatus(err.error || "Failed to update password.");
          return;
        }
        setPasswordStatus("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err) {
        setPasswordStatus("An error occurred. Please try again.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      const res = await axiosInstance.delete("/api/user/account", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!(res.status === 200 || res.status === 201)) {
        const err = res.data;
        showError(err.error || "Failed to delete account. Please try again.");
        setShowDeleteConfirm(false);
        return;
      }

      // Account deleted successfully

      // Clear all local storage
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");

      // Redirect to login page
      window.location.href = "/";
    } catch (err) {
      showError("An error occurred while deleting your account. Please try again.");
      setShowDeleteConfirm(false);
    }
  };

  const handleUpdateName = async () => {
    setNameStatus("");
    if (!name.trim()) {
      setNameStatus("Name cannot be empty.");
      return;
    }
    try {
      const jwt = localStorage.getItem("jwt");
      const res = await axiosInstance.patch(
        "/api/user/profile",
        { name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (!(res.status === 200 || res.status === 201)) {
        const err = res.data;
        setNameStatus(err.error || "Failed to update name.");
        return;
      }
      const data = res.data;
      // Update localStorage user
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.name = data.user.name;
      user.full_name = data.user.name;
      localStorage.setItem("user", JSON.stringify(user));
      setNameStatus("Name updated successfully!");
      window.location.reload(); // Reload to update user dropdown
    } catch (err) {
      setNameStatus("An error occurred. Please try again.");
    }
  };

  // Check if user is logged in
  const userInfo = getUserInfo();

  if (!userInfo) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-red-50 rounded-lg">
        <h1 className="text-2xl font-bold mb-2 text-red-800">Authentication Required</h1>
        <p className="text-sm text-red-600 mb-6">
          You need to be logged in to access account settings. Please log in first.
        </p>
        <button
          onClick={() => (window.location.href = "/p/recruiterauth")}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!userInfo.tokenValid) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-yellow-50 rounded-lg">
        <h1 className="text-2xl font-bold mb-2 text-yellow-800">Session Expired</h1>
        <p className="text-sm text-yellow-600 mb-6">Your session has expired. Please log in again to continue.</p>
        <p className="text-xs text-yellow-500 mb-4">Reason: {userInfo.tokenReason}</p>
        <button
          onClick={() => {
            localStorage.removeItem("jwt");
            localStorage.removeItem("user");
            window.location.href = "/p/recruiterauth";
          }}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
        >
          Log In Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-blue-50 rounded-lg">
      <h1 className="text-2xl font-bold mb-2">Account Settings</h1>
      <p className="text-sm text-gray-600 mb-6">Manage your credentials and account preferences.</p>

      {/* Debug Information (remove in production) */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Debug Info:</h3>
          <p className="text-xs text-gray-600">
            User: {userInfo.name} ({userInfo.role})
          </p>
          <p className="text-xs text-gray-600">Token Valid: {userInfo.tokenValid ? "Yes" : "No"}</p>
          {!userInfo.tokenValid && <p className="text-xs text-red-600">Reason: {userInfo.tokenReason}</p>}
        </div>
      )} */}

      {/* Name Update */}
      <div className="space-y-2 mb-6">
        <label className="text-sm font-medium text-gray-700">Name</label>
        <Input placeholder="New name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button variant="default" className="text-white bg-blue-500 hover:bg-blue-600" onClick={handleUpdateName}>
          Update Name
        </Button>
        {nameStatus && (
          <div className={`text-sm mt-1 ${nameStatus.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {nameStatus}
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="space-y-2 mb-6 border-t pt-4">
        {showPasswordSuccess && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg mb-4">
            <p className="text-sm font-medium">🎉 Password set successfully!</p>
            <p className="text-xs">
              You can now log in with either Google or email/password. Use the form below to change your password
              anytime.
            </p>
          </div>
        )}

        {isGoogleUser ? (
          <>
            <label className="text-sm font-medium text-gray-700">Set Password</label>
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex gap-2 mt-3">
              <Button
                variant="default"
                className="text-white bg-blue-500 hover:bg-blue-600"
                onClick={handleChangePassword}
              >
                Set Password
              </Button>
            </div>
            {passwordStatus && (
              <div className={`text-sm mt-1 ${passwordStatus.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {passwordStatus}
              </div>
            )}
          </>
        ) : (
          <>
            <label className="text-sm font-medium text-gray-700">Change Password</label>
            <Input
              ref={oldPasswordRef}
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex gap-2 mt-3">
              <Button
                variant="default"
                className="text-white bg-blue-500 hover:bg-blue-600"
                onClick={handleChangePassword}
              >
                Update Password
              </Button>
            </div>
            {passwordStatus && (
              <div className={`text-sm mt-1 ${passwordStatus.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {passwordStatus}
              </div>
            )}
          </>
        )}
      </div>

      {/* Danger Zone */}
      <div className="border-t pt-4">
        <label className="text-sm font-semibold text-red-600">Delete Account</label>
        <p className="text-sm text-gray-500 mb-2">This action is irreversible.</p>
        <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
          Delete Account
        </Button>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg space-y-3">
          <p className="text-sm text-red-600 font-semibold">Are you absolutely sure?</p>
          <p className="text-sm text-gray-700">This will permanently delete your account and all associated data.</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Yes, Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
