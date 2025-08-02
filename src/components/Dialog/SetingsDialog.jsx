import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/studentdialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/common/ToastContext";

export default function SettingsDialog() {
  const { showError, showSuccess } = useToast();
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }
    console.log("Password changed.");
  };

  const handleResetPassword = () => {
    showSuccess("Reset link sent to your registered email.");
  };

  const handleDeleteAccount = () => {
    console.log("Account deletion triggered.");
  };
  const handleUpdateUsername = () => {
    console.log("handle username triggered");
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="w-full text-left bg-white hover:bg-blue-100 p-4 rounded-xl border-l-4 border-blue-500 shadow-sm">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 mt-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <div>
              <p>Settings</p>
              <p className="text-xs font-normal text-gray-500">Customize your account preferences</p>
            </div>
          </div>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Account Settings</AlertDialogTitle>
          <AlertDialogDescription>Manage your credentials and account preferences.</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Username Update */}
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <Input
              placeholder="New username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1"
            />
            <Button
              variant="default"
              className="text-gray-50 bg-blue-500 hover:bg-blue-600 mt-2"
              onClick={handleUpdateUsername}
            >
              Update Username
            </Button>
          </div>

          {/* Change Password */}
          <div className="border-t pt-4">
            <label className="text-sm font-medium text-gray-700">Change Password</label>
            <Input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1"
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2"
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2"
            />
            <div className="flex gap-2 mt-3">
              <Button
                variant="default"
                className="text-gray-50 bg-blue-500 hover:bg-blue-600 mt-2"
                onClick={handleChangePassword}
              >
                Update Password
              </Button>
              <Button
                variant="default"
                className="text-gray-50 bg-blue-500 hover:bg-blue-600 mt-2"
                onClick={handleResetPassword}
              >
                Forgot Password?
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t pt-4">
            <label className="text-sm font-semibold text-red-600">Delete Account</label>
            <p className="text-sm text-gray-500 mb-2">This action is irreversible.</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>Yes, Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
