import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Building,
  Users,
  CheckCircle,
  ArrowLeft,
  Calendar,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { createPageUrl } from "../components/utils";
import LoadingSpinner from "../components/common/LoadingSpinner";
import InternshipApplicationForm from "../components/jobs/InternshipApplicationForm";
import { axiosInstance } from "@/lib/axios";

export default function InternshipDetails() {
  const { internshipId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applicationStatus, setApplicationStatus] = useState(""); // "success", "error", or ""

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const shouldShowForm = searchParams.get("apply") === "true";

    if (internshipId) {
      loadInternship(internshipId);
      if (shouldShowForm) {
        setShowApplicationForm(true);
      }
    } else {
      setIsLoading(false);
      setInternship(null);
    }
  }, [internshipId, location.search]);

  const loadInternship = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/jobs/internships/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      console.log("Loaded internship:", data);
      setInternship(data);
    } catch (error) {
      console.error("Error loading internship:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isStudent = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const jwt = localStorage.getItem("jwt");
      return user && jwt && user.role === "student";
    } catch {
      return false;
    }
  };

  const handleApplicationSuccess = (message, type = "success") => {
    setApplicationMessage(message);
    setApplicationStatus(type);
    setShowApplicationForm(false);

    if (type === "success") {
      // Navigate to My Applications after a delay
      setTimeout(() => {
        navigate("/p/applications");
      }, 2000);
    }
  };

  // Helper to format stipend - show original value
  const formatStipend = (stipend) => {
    if (!stipend) return "Not specified";

    // Handle different stipend formats
    const stipendStr = stipend.toString().trim();

    // If it's already in a readable format with ₹ symbol, return as is
    if (stipendStr.includes("₹")) {
      return stipendStr;
    }

    // Extract numeric part from stipend string (handle formats like "10,000/month")
    const match = stipendStr.replace(/,/g, "").match(/(\d+)/);
    if (match) {
      const value = parseInt(match[1], 10);
      if (!isNaN(value)) {
        // Check if the original string has "/month" or similar
        if (stipendStr.includes("/month") || stipendStr.includes("/mo")) {
          return `₹${value.toLocaleString()}/month`;
        }
        return `₹${value.toLocaleString()}`;
      }
    }

    // If it's a simple number, format it
    const numValue = parseFloat(stipendStr);
    if (!isNaN(numValue)) {
      return `₹${numValue.toLocaleString()}`;
    }

    return stipendStr; // fallback to original if not a number
  };

  if (isLoading) return <LoadingSpinner />;

  if (!internship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Internship Not Found</h2>
          <p className="text-gray-600 mb-6">The internship you're looking for doesn't exist or has been removed.</p>
          <Link to={createPageUrl("Internships")}>
            <Button className="bg-blue-600 hover:bg-blue-700">Browse All Internships</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (showApplicationForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowApplicationForm(false)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Internship Details</span>
            </Button>
          </div>

          {applicationMessage && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                applicationStatus === "error"
                  ? "bg-red-100 border border-red-400 text-red-700"
                  : "bg-green-100 border border-green-400 text-green-700"
              }`}
            >
              {applicationMessage}
            </div>
          )}

          <InternshipApplicationForm
            internship={internship}
            onClose={() => {
              setShowApplicationForm(false);
              setApplicationMessage("");
              setApplicationStatus("");
            }}
            onSuccess={handleApplicationSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <Link to={createPageUrl("Internships")}>
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Internships</span>
            </Button>
          </Link>

          {isStudent() && internship.status === "approved" && (
            <Link to={`/p/internship-details/${internship._id}?apply=true`}>
              <Button className="bg-blue-600 hover:bg-blue-700">Apply for Internship</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2">{internship.title}</CardTitle>
                    <div className="flex items-center space-x-2 text-gray-600 mb-4">
                      <Building className="w-5 h-5" />
                      <span className="text-lg font-medium">{internship.company}</span>
                    </div>
                  </div>
                  {internship.company_logo && (
                    <img
                      src={internship.company_logo}
                      alt={internship.company}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{internship.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{internship.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-semibold">{formatStipend(internship.stipend)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Posted recently</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">About the Internship</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{internship.description}</p>
                </div>

                {/* Requirements */}
                {internship.requirements && internship.requirements.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Requirements
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {internship.requirements.map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                {internship.skills && internship.skills.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Skills Required
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {internship.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-blue-600 border-blue-600">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply Card */}
            {isStudent() && internship.status === "approved" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Ready to Apply?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Take the first step towards your dream internship. Submit your application now!
                  </p>
                  <Link to={`/p/internship-details/${internship._id}?apply=true`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply for Internship</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">About {internship.company}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{internship.company}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{internship.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Internship Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Internship Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{internship.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stipend:</span>
                    <span className="font-medium text-green-600">{formatStipend(internship.stipend)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{internship.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted:</span>
                    <span className="font-medium">Recently</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
