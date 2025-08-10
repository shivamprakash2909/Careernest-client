import React, { useState, useEffect } from "react";
// import { User } from "@/entities/User";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../components/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  GraduationCap,
  Mail,
  User as UserIcon,
  Phone,
  MapPin,
  BookOpen,
  Upload,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useToast } from "@/components/common/ToastContext";
import { axiosInstance } from "@/lib/axios";

export default function StudentAuth() {
  const { showSuccess } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"
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
    location: "",
    education_level: "",
    field_of_study: "",
    graduation_year: "",
    skills: "",
    experience: "",
    bio: "",
    resume_url: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordMessage, setPasswordMessage] = useState(
    "Password must be at least 8 characters and include letters, numbers, and a special character."
  );
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const jwt = localStorage.getItem("jwt");
    const userData = localStorage.getItem("user");

    if (jwt && userData) {
      const user = JSON.parse(userData);
      if (user.role === "student") {
        navigate(createPageUrl("Home"));
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
    } else if (name === "bio") {
      // Limit bio to 2000 characters
      const limitedValue = value.slice(0, 2000);
      setFormData({ ...formData, [name]: limitedValue });
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
        { credential: credentialResponse.credential, user_type: "student" },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!(res.status === 200 || res.status === 201)) throw new Error("Google login failed");
      const data = res.data;
      localStorage.setItem("jwt", data.token);

      // Store user data in localStorage using actual data from backend
      const userData = {
        full_name: data.user?.name || data.user?.full_name || "Student User",
        name: data.user?.name || data.user?.full_name || "Student User",
        email: data.user?.email || "student@example.com",
        role: "student",
      };
      localStorage.setItem("user", JSON.stringify(userData));

      window.location.href = createPageUrl("Home");
    } catch (error) {
      setError("Google login failed. Please try again.");
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const res = await axiosInstance.post(
      "/api/auth/send-otp",
      { phone: formData.phone },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = res.data;
    if (data.success) {
      setOtpSent(true);
    } else {
      setError(data.message || "Failed to send OTP");
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const res = await axiosInstance.post(
      "/api/auth/verify-otp",
      { phone: formData.phone, otp },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = res.data;
    if (data.success) {
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = createPageUrl("Home");
    } else {
      setError(data.message || "Invalid OTP");
    }
    setIsLoading(false);
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
          `/api/auth/student/login`,
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
        window.location.href = createPageUrl("Home");
      }
      // Remove phone login mock user/token logic
    } catch (error) {
      setError(
        error.message ||
          (loginMethod === "email" ? "Invalid email or password" : "Phone login failed. Please try again.")
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
    setSuccessMessage(""); // Clear success message on new signup attempt
    try {
      if (
        !formData.full_name ||
        !formData.email ||
        !formData.phone ||
        !formData.password ||
        !formData.confirm_password
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
      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(formData.password)) {
        setError("Password must include a letter, a number, and a special character.");
        return;
      }

      // Validate bio length
      if (formData.bio && formData.bio.length < 50) {
        setError("Summary must be at least 50 characters long.");
        return;
      }

      // Call backend API for student registration
      const res = await axiosInstance.post(
        `/api/auth/student/register`,
        {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          location: formData.location,
          education_level: formData.education_level,
          field_of_study: formData.field_of_study,
          graduation_year: formData.graduation_year,
          skills: formData.skills,
          experience: formData.experience,
          bio: formData.bio,
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
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // On success, switch to sign-in mode and show a success message
      setIsLogin(true);
      setError("");
      setSuccessMessage("Registration successful! Please sign in to continue.");
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
    // Sign Up Form (keep existing complex form)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join CareerNest as a Student</h1>
            <p className="text-gray-600">Create your profile and start applying to your dream jobs</p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">
                <div className="flex justify-center space-x-1 mb-4">
                  <button
                    onClick={() => setIsLogin(true)}
                    className="px-6 py-2 rounded-lg font-medium transition-colors text-gray-600 hover:text-blue-600"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className="px-6 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white"
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
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <UserIcon className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
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
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) => handleSelectChange("location", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Bangalore">Bangalore</SelectItem>
                          <SelectItem value="Pune">Pune</SelectItem>
                          <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                          <SelectItem value="Noida">Noida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Your Password</h3>
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
                    </div>
                  </div>
                </div>

                {/* Education Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Education
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                      <Select
                        value={formData.education_level}
                        onValueChange={(value) => handleSelectChange("education_level", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High School">High School</SelectItem>
                          <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                          <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                      <Input
                        name="field_of_study"
                        value={formData.field_of_study}
                        onChange={handleInputChange}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                      <Select
                        value={formData.graduation_year}
                        onValueChange={(value) => handleSelectChange("graduation_year", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023">2021</SelectItem>
                          <SelectItem value="2024">2022</SelectItem>
                          <SelectItem value="2024">2023</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2026">2026</SelectItem>
                          <SelectItem value="2027">2027</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                      <Select
                        value={formData.experience}
                        onValueChange={(value) => handleSelectChange("experience", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fresher">Fresher</SelectItem>
                          <SelectItem value="0-1 years">0-1 years</SelectItem>
                          <SelectItem value="1-3 years">1-3 years</SelectItem>
                          <SelectItem value="3+ years">3+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Skills and Bio */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills & Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                      <Input
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="e.g., JavaScript, Python, React, Data Analysis"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                      <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself, your interests, and career goals..."
                        rows={4}
                        className={formData.bio && formData.bio.length < 50 ? "border-red-500" : ""}
                      />
                      <div className="mt-1 flex justify-between text-sm">
                        <span className={formData.bio && formData.bio.length < 50 ? "text-red-600" : "text-gray-500"}>
                          {formData.bio ? `${formData.bio.length} characters` : "0 characters"}
                        </span>
                        <span className="text-gray-500">
                          {formData.bio ? `${2000 - formData.bio.length} remaining` : "2000 remaining"}
                        </span>
                      </div>
                      {formData.bio && formData.bio.length < 50 && (
                        <p className="mt-1 text-sm text-red-600">Summary must be at least 50 characters long.</p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                >
                  {isLoading ? "Creating Account..." : "Create Student Account"}
                </Button>

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
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back Student!</h1>
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
                min="8"
                max="64"
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
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button onClick={() => setIsLogin(false)} className="font-semibold text-gray-900 hover:text-blue-600">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
