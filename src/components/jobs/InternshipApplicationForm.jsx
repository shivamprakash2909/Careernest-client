import React, { useState, useEffect } from "react";
import ApplicationApi from "../../Services/ApplicationApi";
import UserApi from "../../Services/UserApi";
// import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InternshipApplicationForm({ internship, onClose, onSuccess }) {
  console.log("InternshipApplicationForm received internship:", internship);

  // Get internship ID from URL params as fallback
  const urlParams = new URLSearchParams(window.location.search);
  const internshipIdFromUrl = window.location.pathname.split("/").pop();
  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_email: "",
    phone: "",
    experience: "",
    cover_letter: "",
    resume_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [hasApplied, setHasApplied] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  // Authorization check
  const userStr = localStorage.getItem("user");
  let user = null;
  try {
    user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }
  const jwt = localStorage.getItem("jwt");
  const isStudent = user && jwt && user.role === "student";

  // Check if user has already applied
  useEffect(() => {
    async function checkApplication() {
      try {
        if (!user?.email) return;

        console.log("Checking internship application status for:", {
          applicant_email: user.email,
          internship_id: internship.id || internship._id || internshipIdFromUrl,
          application_type: "internship",
        });

        const applications = await ApplicationApi.list({
          applicant_email: user.email,
          internship_id: internship.id || internship._id || internshipIdFromUrl,
          application_type: "internship",
        });

        console.log("Found internship applications:", applications);
        setHasApplied(applications.length > 0);
      } catch (error) {
        console.error("Error checking internship application status:", error);
        setHasApplied(false);
      } finally {
        setIsChecking(false);
      }
    }

    checkApplication();
  }, [internship.id, internship._id, internshipIdFromUrl, user?.email]);

  // Initialize the form
  useEffect(() => {
    async function initializeForm() {
      try {
        if (!user?.email) return;
        setIsChecking(false);
      } catch (error) {
        console.error("Error initializing form:", error);
        setIsChecking(false);
      }
    }

    initializeForm();
  }, [user?.email]);

  if (!isStudent) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Apply for {internship.title}</CardTitle>
          <p className="text-center text-gray-600">
            at {internship.company} • {internship.location}
            {internship.duration && ` • ${internship.duration}`}
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 mb-4 font-semibold">
            You must be logged in as a student to apply for this internship.
          </div>
          <div className="flex justify-center">
            <Button onClick={() => navigate("/p/studentauth")}>Login as Student</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await UploadFile({ file });
      setFormData({
        ...formData,
        resume_url: result.file_url,
      });
      setUploadedFileName(file.name);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.email) {
        throw new Error("Please log in to apply");
      }

      const applicationData = {
        applicant_email: user.email,
        applicant_name: formData.applicant_name || user.full_name,
        phone: formData.phone,
        experience: formData.experience,
        cover_letter: formData.cover_letter,
        resume_url: formData.resume_url,
        application_type: "internship",
        internship_id: internship.id || internship._id || internshipIdFromUrl,
      };

      console.log("Sending application data:", applicationData);
      console.log("Internship object:", internship);
      console.log("Internship ID from URL:", internshipIdFromUrl);
      console.log("Final internship_id being sent:", internship.id || internship._id || internshipIdFromUrl);

      // Create the application directly
      await ApplicationApi.create(applicationData);

      onSuccess("Internship application submitted successfully!");

      // Show success message
      onSuccess("Internship application submitted successfully!");

      // Close the form
      onClose();

      // Navigate to My Applications
      try {
        // Ensure we're properly wrapped in StudentLayout
        navigate("/p/applications", {
          replace: true,
          state: { from: "internship_application" },
        });
      } catch (error) {
        console.error("Navigation error:", error);
        // Fallback navigation
        window.location.href = "/p/applications";
      }
    } catch (error) {
      console.error("Error submitting internship application:", error);
      // If user not logged in, redirect to login
      if (error.message?.includes("not authenticated")) {
        await User.loginWithRedirect(window.location.href);
      } else if (error.message?.includes("already applied")) {
        setHasApplied(true);
        onSuccess(
          "You have already applied for this internship. Check your application status in My Applications.",
          "warning"
        );
        setTimeout(() => {
          navigate("/p/applications");
        }, 2000);
      } else {
        onSuccess("Failed to submit application. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Apply for {internship.title}</CardTitle>
        <p className="text-center text-gray-600">
          at {internship.company} • {internship.location}
          {internship.duration && ` • ${internship.duration}`}
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <Input
                name="applicant_name"
                value={formData.applicant_name}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <Input
                name="applicant_email"
                type="email"
                value={formData.applicant_email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 9876543210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relevant Experience</label>
              <Input
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Projects, coursework, etc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter *</label>
            <Textarea
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleInputChange}
              placeholder="Tell us why you're interested in this internship and what makes you a great candidate..."
              rows={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
            <input
            required
            type="text" name="resume_url"
            value={formData.resume_url}
            onChange={handleInputChange}
            placeholder="Paste your resume link here"
            className=" block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-600">
              {isSubmitting ? "Submitting..." : "Submit Internship Application"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
