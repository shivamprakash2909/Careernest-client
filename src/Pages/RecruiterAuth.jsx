import React, { useState, useEffect } from "react";
// import { User } from "@/entities/User";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../components/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Eye, EyeOff, AlertCircle, Mail, Phone, CheckCircle } from "lucide-react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useToast } from "@/components/common/ToastContext";
import { axiosInstance } from "@/lib/axios";

export default function RecruiterAuth() {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordMessage, setPasswordMessage] = useState(
    "Password must be at least 8 characters and include letters, numbers, and a special character."
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    company_name: "",
    company_size: "",
    industry: "",
    location: "",
    job_title: "",
    company_website: "",
    company_description: "",
  });
  // Remove passwordLength state and generatePassword function

  //password generation
  const generatePassword = () => {
    const length = 12;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]<>?,.";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData({ ...formData, password: result, confirm_password: result });
  };

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    // Check if user is already logged in
    const jwt = localStorage.getItem("jwt");
    const userData = localStorage.getItem("user");

    if (jwt && userData) {
      const user = JSON.parse(userData);
      if (user.role === "recruiter") {
        navigate(createPageUrl("/recruiterdashboard"));
      }
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Only allow numbers and max 10 digits
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: cleaned });
    } else if (name === "password") {
      setFormData({ ...formData, [name]: value });
      // Password strength logic
      if (value.length < 8) {
        setPasswordStrength("Weak");
      } else if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(value)) {
        setPasswordStrength("Strong");
      } else {
        setPasswordStrength("Medium");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
    setSuccessMessage(""); // Clear success message on input change
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const backendURL = import.meta.env.VITE_BASE_URL || "";
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError("");
    try {
      // Send credential to backend and get JWT
      const res = await axiosInstance.post(
        `${backendURL}/api/auth/google`,
        { credential: credentialResponse.credential, user_type: "recruiter" },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = res.data;
      if (!(res.status === 200 || res.status === 201)) {
        setError(data.error || "Google login failed");
        return;
      }
      localStorage.setItem("jwt", data.token);
      // Store user data in localStorage using actual data from backend
      const userData = {
        full_name: data.user?.name || data.user?.full_name || "Recruiter User",
        name: data.user?.name || data.user?.full_name || "Recruiter User",
        email: data.user?.email || "recruiter@example.com",
        role: "recruiter",
      };
      localStorage.setItem("user", JSON.stringify(userData));

      window.location.href = createPageUrl("/recruiterdashboard");
    } catch (error) {
      setError(error.message || "Google login failed. Please try again.");
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (loginMethod === "email") {
        if (!formData.email || !formData.password) {
          setError("Please fill in all required fields");
          return;
        }

        // Call backend API for email login
        const res = await axiosInstance.post(
          `/api/auth/recruiter/login`,
          { email: formData.email, password: formData.password },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!(res.status === 200 || res.status === 201)) {
          const errorData = res.data;
          throw new Error(errorData.error || "Login failed");
        }

        const data = res.data;
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        // loginMethod === "phone"
        if (!formData.phone) {
          setError("Please enter your phone number");
          return;
        }

        // For phone login, create a mock user (in real app, implement OTP verification)
        const userData = {
          full_name: "Demo Recruiter",
          name: "Demo Recruiter",
          email: formData.phone + "@example.com",
          role: "recruiter",
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("jwt", "mock-jwt-token");
      }

      window.location.href = createPageUrl("/recruiterdashboard");
    } catch (error) {
      setError(
        error.message || loginMethod === "email" ? "Invalid email or password" : "Phone login failed. Please try again."
      );
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage(""); // Clear success message on sign-up attempt
    try {
      if (
        !formData.full_name ||
        !formData.email ||
        !formData.phone ||
        !formData.password ||
        !formData.confirm_password ||
        !formData.company_name
      ) {
        setError("Please fill in all required fields.");
        return;
      }
      if (formData.phone.length !== 10) {
        setError("Phone number must be exactly 10 digits.");
        return;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (formData.password !== formData.confirm_password) {
        setError("Passwords do not match.");
        return;
      }
      // Password regex: at least 8 chars, 1 letter, 1 number, 1 special char
      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(formData.password)) {
        setError("Password must include a letter, a number, and a special character.");
        return;
      }

      // Call backend API for recruiter registration
      const res = await axiosInstance.post(
        `/api/auth/recruiter/register`,
        {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          company_name: formData.company_name,
          company_size: formData.company_size,
          industry: formData.industry,
          location: formData.location,
          job_title: formData.job_title,
          company_website: formData.company_website,
          company_description: formData.company_description,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!(res.status === 200 || res.status === 201)) {
        const errorData = res.data;
        throw new Error(errorData.error || "Registration failed");
      }

      const data = res.data;

      // On success, switch to sign-in mode and show a success message
      setIsLogin(true);
      setError("");
      setSuccessMessage("Registration successful! Please sign in to continue.");

      // Clear the form data
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
        company_name: "",
        company_size: "",
        industry: "",
        location: "",
        job_title: "",
        company_website: "",
        company_description: "",
      });
      return;
    } catch (error) {
      setError(error.message || "Sign up failed. Please try again.");
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/p/forgot-password");
  };

  if (!isLogin) {
    // Sign Up Form
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join CareerNest as a Recruiter</h1>
            <p className="text-gray-600">Start posting jobs and connect with top talent across India</p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">
                <div className="flex justify-center space-x-1 mb-4">
                  <button
                    onClick={() => setIsLogin(true)}
                    className="px-6 py-2 rounded-lg font-medium transition-colors text-gray-600 hover:text-indigo-600"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className="px-6 py-2 rounded-lg font-medium transition-colors bg-indigo-600 text-white"
                  >
                    Sign Up
                  </button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <Input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@company.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <Input
                        name="job_title"
                        value={formData.job_title}
                        onChange={handleInputChange}
                        placeholder="e.g., HR Manager, Talent Acquisition"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create your Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                      <div className="relative">
                        <Input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="mt-1 text-xs">
                        <span>Password strength: {passwordStrength}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">{passwordMessage}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                      <div className="relative">
                        <Input
                          name="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirm_password}
                          onChange={handleInputChange}
                          placeholder="Confirm password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="mt-2 px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                      >
                        Auto Generate Password
                      </button>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                      <Input
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                      <Select
                        value={formData.company_size}
                        onValueChange={(value) => handleSelectChange("company_size", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Domain</label>
                      <input
                        type="text"
                        placeholder="Enter company domain"
                        value={formData.industry}
                        onChange={(e) => handleSelectChange("industry", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                      />
                    </div>
                    {/* --------Company Address ---------*/}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                      <input
                        type="text"
                        placeholder="Enter company address"
                        value={formData.location}
                        onChange={(e) => handleSelectChange("location", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                    <Input
                      name="company_website"
                      value={formData.company_website}
                      onChange={handleInputChange}
                      placeholder="Enter your company's website,LinkedIn or any other social media link"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                    <Textarea
                      name="company_description"
                      value={formData.company_description}
                      onChange={handleInputChange}
                      placeholder="Brief description of your company and what you do..."
                      rows={5}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 text-lg"
                >
                  {isLoading ? "Creating Account..." : "Create Recruiter Account"}
                </Button>
              </form>
              <br />
              {/* Google Sign Up */}
              <GoogleOAuthProvider clientId={clientId}>
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => setError("Google login failed. Please try again.")}
                    theme="filled_blue"
                    size="large"
                    text="signin_with"
                    shape="pill"
                    logo_alignment="left"
                    width="320" // use fixed pixel value instead of 100%
                    locale="en-US"
                    context="signin"
                    prompt_parent_id="google-signin-button"
                  />
                </div>
              </GoogleOAuthProvider>

              <div className="text-center pt-4 border-t">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // New Clean Sign In Form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link to={createPageUrl("Home")} className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-lg">Back</span>
        </Link>

        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back Recruiter!</h1>
          <p className="text-gray-600">Welcome back! Please enter your details.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            {successMessage}
          </div>
        )}

        {/* Login Form - Only Email Login Allowed */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="h-12"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="h-12 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <button type="button" onClick={handleForgotPassword} className="text-sm text-gray-600 hover:text-gray-900">
              Forgot password
            </button>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 h-12 rounded-lg font-medium"
          >
            {isLoading ? "Signing in..." : "Login"}
          </Button>
        </form>
        <br />
        <GoogleOAuthProvider clientId={clientId}>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setError("Google login failed. Please try again.")}
              theme="filled_blue"
              size="large"
              text="signin_with"
              shape="pill"
              logo_alignment="left"
              width="320" // use fixed pixel value instead of 100%
              locale="en-US"
              context="signin"
              prompt_parent_id="google-signin-button"
            />
          </div>
        </GoogleOAuthProvider>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button onClick={() => setIsLogin(false)} className="font-semibold text-gray-900 hover:text-blue-600">
              Sign up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
