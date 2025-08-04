import React, { useState, useEffect } from "react";
import {
  FileText,
  Briefcase,
  LayoutDashboard,
  Send,
  Bell,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  LogOut,
  ChevronDown,
  ChevronUp,
  Settings,
  User,
  HelpCircle,
  MessageCircle,
  Building,
  Home,
  BriefcaseBusiness,
  LucideBrainCog,
  Rocket,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "./components/utils";
import { Button } from "@/components/ui/button";
import UserProfileDropdown from "@/components/layout/UserProfileDropdown";

export default function StudentLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, [location.pathname]);

  const checkUser = async () => {
    setIsLoading(true);
    try {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          setUser({
            full_name: "Demo Student",
            email: "student@example.com",
            role: "student",
          });
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoading(false);
    setMobileMenuOpen(false);
    navigate("/p/home");
  };

  const handleNavigationClick = (href) => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    navigate(href);
  };

  const goToNotifications = () => {
    navigate("/notifications");
  };

  const isActive = (href) => location.pathname === href;

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CareerNest</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <Link
                to={createPageUrl("Home")}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to={createPageUrl("Jobs")}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Jobs
              </Link>
              <Link
                to={createPageUrl("Internships")}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Internships
              </Link>
              {/* <Link
                to={createPageUrl("editResume")}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(createPageUrl("editResume"))
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Resume
              </Link> */}
              <Link
                to={createPageUrl("applications")}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(createPageUrl("applications"))
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                My Applications
              </Link>
            </nav>

            {/* Auth Buttons and Profile */}
            <div className="hidden lg:flex items-center space-x-3">
              {isLoading ? (
                <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : user ? (
                <UserProfileDropdown user={user} onLogout={handleLogout} />
              ) : (
                <>
                  <Link to={createPageUrl("StudentAuth")}>
                    <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      Student Sign In
                    </Button>
                  </Link>
                  <Link to={createPageUrl("RecruiterAuth")}>
                    <Button className="bg-blue-600 hover:bg-blue-700">Recruiter</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="block lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Click outside to close */}
          <div className="fixed inset-0" onClick={() => setMobileMenuOpen(false)} />
          {/* Sidebar */}
          <div
            className="fixed left-0 top-0 h-full w-3/4 max-w-sm bg-white shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Profile Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.full_name
                      ? user.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.full_name || user.name || "User"}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${moreDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {/* More Dropdown */}
              {moreDropdownOpen && (
                <div className="mt-3 space-y-1">
                  {/* Your Profile Section */}
                  <button
                    onClick={() => handleNavigationClick(createPageUrl("profile"))}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Your Profile
                  </button>

                  <div className="border-t border-gray-200 my-2"></div>

                  {/* SUPPORT Section */}
                  <div className="px-4 py-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Support</p>
                  </div>
                  <button
                    onClick={() => handleNavigationClick(createPageUrl("help"))}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                  >
                    <HelpCircle className="w-4 h-4 mr-3" />
                    Help Center
                  </button>
                  <button
                    onClick={() => handleNavigationClick(createPageUrl("contact"))}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-3" />
                    Contact Us
                  </button>

                  <div className="border-t border-gray-200 my-2"></div>

                  {/* SETTINGS Section */}
                  <div className="px-4 py-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Settings</p>
                  </div>
                  <button
                    onClick={() => handleNavigationClick(createPageUrl("editprofile"))}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Update Profile
                  </button>
                  {/* <button
                    onClick={() => handleNavigationClick(createPageUrl("editResume"))}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Edit Resume
                  </button>
                  <button
                    onClick={() => handleNavigationClick(createPageUrl("uploadResume"))}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload Resume
                  </button> */}
                  <button
                    onClick={() => handleNavigationClick(createPageUrl("settings"))}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-1">
                {/* Main Navigation */}
                <button
                  onClick={() => handleNavigationClick(createPageUrl("Home"))}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive(createPageUrl("Home")) ? "text-blue-600 bg-blue-50" : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Home className="w-4 h-4 mr-3 inline" />
                  Home
                </button>
                <button
                  onClick={() => handleNavigationClick(createPageUrl("Studentdashboard"))}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive(createPageUrl("Studentdashboard"))
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-3 inline" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavigationClick(createPageUrl("Jobs"))}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive(createPageUrl("Jobs")) ? "text-blue-600 bg-blue-50" : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Briefcase className="w-4 h-4 mr-3 inline" />
                  Jobs
                </button>
                <button
                  onClick={() => handleNavigationClick(createPageUrl("Internships"))}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive(createPageUrl("Internships"))
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <BriefcaseBusiness className="w-4 h-4 mr-3 inline" />
                  Internships
                </button>
                <button
                  onClick={() => handleNavigationClick(createPageUrl("applications"))}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive(createPageUrl("applications"))
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FileText className="w-4 h-4 mr-3 inline" />
                  My Applications
                </button>
                <button
                  onClick={() => handleNavigationClick(createPageUrl("Preparation"))}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive(createPageUrl("Preparation"))
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <LucideBrainCog className="w-4 h-4 mr-3 inline" />
                  Preparation
                </button>
                <button
                  onClick={() => handleNavigationClick(createPageUrl("Hackathons"))}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive(createPageUrl("Hackathons"))
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Rocket className="w-4 h-4 mr-3 inline" />
                  Hackathons
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="flex lg:flex-row bg-white font-sans">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-80 bg-blue-50 shadow-lg lg:rounded-xl m-0 lg:m-4 p-4 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 border-b pb-2">
            <Building className="w-5 h-5" />
            Student Dashboard
          </h2>

          <nav className="space-y-4 text-sm font-semibold text-gray-800">
            {[
              { name: "Dashboard", href: createPageUrl("Studentdashboard") },
              // { name: "Jobs", href: createPageUrl("Jobs") },
              // { name: "Internships", href: createPageUrl("Internships") },
              { name: "My Applications", href: createPageUrl("Applications") },
              { name: "Preparation", href: createPageUrl("Preparation") },
              { name: "Hackathons", href: createPageUrl("Hackathons") },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block bg-white hover:bg-blue-100 p-4 rounded-xl border-l-4 shadow-sm transition-colors duration-200 ${
                  isActive(item.href) ? "border-blue-500 bg-blue-50" : "border-transparent hover:border-blue-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-2 sm:px-4 py-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
