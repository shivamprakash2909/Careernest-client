import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User as UserIcon,
  Settings,
  HelpCircle,
  Mail,
  Shield,
  Key,
  Trash2,
  LogOut,
  ChevronDown,
  FileText,
  UploadCloud,
} from "lucide-react";
import { useToast } from "@/components/common/ToastContext";

export default function UserProfileDropdown({ user, onLogout }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { showInfo } = useToast();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear JWT from localStorage
      localStorage.removeItem("jwt");
      // Clear any other user data
      localStorage.removeItem("user");

      // Call the onLogout callback to refresh parent state immediately
      if (onLogout) {
        onLogout();
      }

      // Redirect to home page
      navigate("/p/home");
    } catch (error) {
      console.error("Error logging out:", error);
      // Still call onLogout to refresh state even if logout fails
      if (onLogout) {
        onLogout();
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleChangePassword = () => {
    // In a real app, this would open a change password modal
    showInfo("Password change functionality would be implemented here");
  };

  const handleChangeEmail = () => {
    // In a real app, this would open a change email modal
    showInfo("Email change functionality would be implemented here");
  };

  const handleDeleteAccount = () => {
    // In a real app, this would open a confirmation modal
    const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmed) {
      showInfo("Account deletion functionality would be implemented here");
    }
  };

  if (!user) {
    return null;
  }

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isStudent = user.role === "student" || user.user_type === "student";
  const isRecruiter = user.role === "recruiter" || user.user_type === "recruiter";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {getUserInitials(user.full_name || user.name)}
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">{user.full_name || user.name || "User"}</span>
            <span className="text-xs text-gray-500">{isStudent ? "Student" : isRecruiter ? "Recruiter" : "User"}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-gray-900">{user.full_name || user.name || "User"}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to={createPageUrl(isRecruiter ? "recruiterprofileview" : "profileview")} className="flex items-center">
            <UserIcon className="w-4 h-4 mr-2" />
            Your Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-gray-500 font-normal">SUPPORT</DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <Link to={createPageUrl("FAQ")} className="flex items-center">
            <HelpCircle className="w-4 h-4 mr-2" />
            Help Center
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="mailto:support@careernest.in" className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Contact Us
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isStudent || isRecruiter ? (
          <>
            <DropdownMenuLabel className="text-xs text-gray-500 font-normal">SETTINGS</DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <Link to={createPageUrl(isRecruiter ? "updateprofile" : "editprofile")} className="flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                Update Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to={createPageUrl(isRecruiter ? "recruitersettings" : "settings")} className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
          </>
        ) : null}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="flex items-center text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
