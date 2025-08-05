import React, { useState, useEffect } from "react";
import {
  FileText,
  Briefcase,
  LayoutDashboard,
  Send,
  Bell,
  Menu,
  X,
  Users,
  Building,
  Plus,
  LogOut,
  ChevronDown,
  User,
  HelpCircle,
  MessageCircle,
  BarChart3,
  Settings,
  Home,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "./components/utils";
import { Button } from "@/components/ui/button";
import UserProfileDropdown from "@/components/layout/UserProfileDropdown";

export default function RecruiterLayout({ children }) {
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
            full_name: "Demo Recruiter",
            email: "recruiter@example.com",
            role: "recruiter",
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

  const navItems = [
    { name: "Dashboard", href: createPageUrl("recruiterdashboard") },
    // { name: "Post Jobs", href: createPageUrl("post-jobs") },
    // { name: "Post Internships", href: createPageUrl("post-internships") },
    { name: "Manage Jobs", href: createPageUrl("manage-jobs") },
    { name: "Manage Internships", href: createPageUrl("manage-internships") },
    { name: "Applications", href: createPageUrl("job-applications") },
    { name: "Analytics", href: createPageUrl("analytics") },
  ];

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
          <div className="flex flex-wrap justify-between items-center h-16 gap-4">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CareerNest</span>
            </Link>

            <nav className="hidden lg:flex flex-wrap gap-4">
              {["Home", "Jobs", "Internships", "About", "FAQ"].map((page) => (
                <Link
                  key={page}
                  to={createPageUrl(page)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  {page}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              {isLoading ? (
                <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : user ? (
                <UserProfileDropdown user={user} onLogout={handleLogout} />
              ) : (
                <>
                  <Link to={createPageUrl("StudentAuth")}>
                    <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      Student
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
              className="sm:block lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation for Non-Recruiters */}
        {/* {mobileMenuOpen && (!user || user.role !== "recruiter") && (
          <div className="block lg:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {["Home", "Jobs", "Internships", "About", "FAQ"].map((page) => (
                <Link
                  key={page}
                  to={createPageUrl(page)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {page}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex flex-col space-y-2 px-3">
                  {isLoading ? (
                    <div className="w-full h-10 bg-gray-200 rounded animate-pulse my-2"></div>
                  ) : user ? (
                    <UserProfileDropdown user={user} onLogout={handleLogout} />
                  ) : (
                    <>
                      <Link to={createPageUrl("StudentAuth")}>
                        <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
                          Student
                        </Button>
                      </Link>
                      <Link to={createPageUrl("RecruiterAuth")}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Recruiter</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )} */}
      </header>
      {/* Mobile Sidebar for Recruiters */}
      {mobileMenuOpen && user && user.role === "recruiter" && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Click outside to close */}
          <div className="fixed inset-0" onClick={() => setMobileMenuOpen(false)} />
          {/* Sidebar */}
          <div
            className="fixed left-0 top-0 h-full w-2/3 max-w-sm bg-white shadow-xl overflow-hidden"
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
                      : "R"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.full_name || user.name || "Recruiter"}</p>
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
                    onClick={() => handleNavigationClick(createPageUrl("recruiterprofileview"))}
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
                    onClick={() => handleNavigationClick(createPageUrl("faq"))}
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
                    onClick={() => handleNavigationClick(createPageUrl("updateprofile"))}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Update Profile
                  </button>
                  <button
                    onClick={() => handleNavigationClick(createPageUrl("recruitersettings"))}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-3" />
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
                  onClick={() => handleNavigationClick(createPageUrl("recruiterdashboard"))}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive(createPageUrl("recruiterdashboard"))
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-3 inline" />
                  Dashboard
                </button>
                {/* <button
                    onClick={() => handleNavigationClick(createPageUrl("post-jobs"))}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      isActive(createPageUrl("post-jobs"))
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Plus className="w-4 h-4 mr-3 inline" />
                    Post Jobs
                  </button> */}
                <button
                  onClick={() => handleNavigationClick(createPageUrl("manage-jobs"))}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive(createPageUrl("manage-jobs"))
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Briefcase className="w-4 h-4 mr-3 inline" />
                  Manage Jobs
                </button>
                <button
                  onClick={() => handleNavigationClick(createPageUrl("manage-internships"))}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive(createPageUrl("manage-internships"))
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Plus className="w-4 h-4 mr-3 inline" />
                  Manage Internships
                </button>
                <button
                  onClick={() => handleNavigationClick(createPageUrl("job-applications"))}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive(createPageUrl("job-applications"))
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FileText className="w-4 h-4 mr-3 inline" />
                  Applications
                </button>
                <button
                  onClick={() => handleNavigationClick(createPageUrl("analytics"))}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive(createPageUrl("analytics"))
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mr-3 inline" />
                  Analytics
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="flex lg:flex-row bg-white font-sans ">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-80 bg-blue-50 shadow-lg lg:rounded-xl m-0 lg:m-4 p-4 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 border-b pb-2">
            <Building className="w-5 h-5" />
            Recruiter Dashboard
          </h2>

          <nav className="space-y-4 text-sm font-semibold text-gray-800">
            {navItems.map((item) => (
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
