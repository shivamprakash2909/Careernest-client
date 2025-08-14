import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "./components/utils";
import {
  Menu,
  X,
  Briefcase,
  Users,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  User,
  HelpCircle,
  MessageCircle,
  FileText,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Chatbot from "./components/Chatbot";
import UserProfileDropdown from "@/components/layout/UserProfileDropdown";
import NotificationIcon from "@/components/notifications/NotificationIcon";
 

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, [location.pathname]); // Re-check user status on page navigation

  const checkUser = async () => {
    setIsLoading(true);
    try {
      // Check if JWT exists in localStorage
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        // In a real app, you would verify the JWT with your backend
        // For now, we'll create a mock user object
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // Create a default user object if none exists
          setUser({
            full_name: "Demo User",
            email: "demo@example.com",
            role: "student",
          });
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null); // User is not logged in
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    // Reset user state immediately when logout is triggered
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

  const navItems = [
    { name: "Home", href: createPageUrl("Home") },
    { name: "Jobs", href: createPageUrl("Jobs") },
    { name: "Internships", href: createPageUrl("Internships") },
    { name: "About", href: createPageUrl("About") },
    { name: "FAQ", href: createPageUrl("FAQ") },
  ];

  const isActive = (href) => location.pathname === href;

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
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons and Profile */}
            <div className="hidden lg:flex items-center space-x-2">
              {isLoading ? (
                <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : user ? (
                <>
                  <NotificationIcon />
                  <UserProfileDropdown user={user} onLogout={handleLogout} />
                </>
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
              className="block lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation for Non-Students */}
        {mobileMenuOpen && (!user || user.role !== "student") && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Click outside to close */}
            <div className="fixed inset-0" onClick={() => setMobileMenuOpen(false)} />
            {/* Mobile Menu */}
            <div
              className="fixed top-0 left-0 h-full w-3/4 max-w-sm bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User Profile Section */}
              {user && (
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
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
                    <div className="flex items-center space-x-2">
                      <NotificationIcon />
                      <button
                        onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 transition-transform ${moreDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
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
                      <a
                        href="mailto:support@careernest.in"
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                      >
                        <MessageCircle className="w-4 h-4 mr-3" />
                        Contact Us
                      </a>

                      <div className="border-t border-gray-200 my-2"></div>

                      {/* SETTINGS Section */}

                      <div className="px-4 py-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Settings</p>
                      </div>
                      <button
                        onClick={() => handleNavigationClick(createPageUrl("updateProfile"))}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Update Profile
                      </button>
                      {user.role === "student" ? (
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
                      ) : (
                        <button
                          onClick={() => handleNavigationClick(createPageUrl("recruitersettings"))}
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
                      )}
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
              )}

              {/* Navigation Menu */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-4 space-y-1">
                  {/* Main Navigation */}
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigationClick(item.href)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href) ? "text-blue-600 bg-blue-50" : "text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Auth Buttons for Non-Logged In Users */}
              {!user && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex flex-col space-y-2">
                    <Link to={createPageUrl("StudentAuth")} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
                        Student
                      </Button>
                    </Link>
                    <Link to={createPageUrl("RecruiterAuth")} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Recruiter</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Sidebar for Students */}
        {mobileMenuOpen && user && user.role === "student" && (
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
                  <div className="flex items-center space-x-1">
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
                  <div className="flex items-center space-x-2">
                    <NotificationIcon />
                    <button
                      onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${moreDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
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
                      onClick={() => handleNavigationClick(createPageUrl("updateProfile"))}
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
                    Home
                  </button>
                  <button
                    onClick={() => handleNavigationClick(createPageUrl("Jobs"))}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      isActive(createPageUrl("Jobs")) ? "text-blue-600 bg-blue-50" : "text-gray-900 hover:bg-gray-100"
                    }`}
                  >
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
                    Internships
                  </button>
                  {/* <button
                    onClick={() => handleNavigationClick(createPageUrl("editResume"))}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      isActive(createPageUrl("editResume"))
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Resume
                  </button> */}
                  <button
                    onClick={() => handleNavigationClick(createPageUrl("About"))}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      isActive(createPageUrl("About")) ? "text-blue-600 bg-blue-50" : "text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    About
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Chatbot */}
      <Chatbot />

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CareerNest</span>
              </div>
              <p className="text-gray-400 text-sm">
                Global platform connecting passionate individuals with impactful volunteer opportunities and internships
                across leading organizations worldwide.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link to={createPageUrl("Jobs")} className="hover:text-white transition-colors">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Internships")} className="hover:text-white transition-colors">
                    Find Internships
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("StudentAuth")} className="hover:text-white transition-colors">
                    Student Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link to={createPageUrl("post-jobs")} className="hover:text-white transition-colors">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("post-internships")} className="hover:text-white transition-colors">
                    Post a Internship
                  </Link>
                </li>

                <li>
                  <Link to={createPageUrl("RecruiterAuth")} className="hover:text-white transition-colors">
                    Recruiter Login
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("About")} className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@careernest.in</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 9876543210</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Mumbai, India</span>
                </li>
              </ul>
            </div>
          </div>
          {/* Admin Login Section 
          {!user && (
            <div className="mt-8 flex justify-center">
              <Link to={createPageUrl("adminauth")} className="no-underline">
                <Button
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-600 hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-white"
                  style={{ minWidth: 160 }}
                >
                  <UserIcon className="w-5 h-5" />
                  Admin Login
                </Button>
              </Link>
            </div>
          )}
          */}

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 CareerNest. All rights reserved.</p>
            <div className="flex justify-center items-center gap-6 mt-4">
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-6 h-6 hover:scale-110 transition-transform text-gray-400" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="w-6 h-6 hover:scale-110 transition-transform text-gray-400" />
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="w-6 h-6 hover:scale-110 transition-transform text-gray-400" />
              </a>
              <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="w-6 h-6 hover:scale-110 transition-transform text-gray-400" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Admin

export const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Remove handleAdminLogout and isSettingsPage logic since logout button will be removed

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      <aside className="w-64 bg-white border-r flex-shrink-0 hidden md:flex flex-col">
        <div className="h-16 border-b flex items-center px-6">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="font-bold text-xl text-gray-800">CareerNest</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link
            to={createPageUrl("adminpage")}
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-lg"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to={createPageUrl("adminsettings")}
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-lg"
          >
            <User className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white flex md:hidden items-center px-6">
          <h1 className="font-semibold text-lg">Admin Panel</h1>
        </header>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};
