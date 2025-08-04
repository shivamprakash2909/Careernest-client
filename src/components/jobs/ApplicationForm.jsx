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

export default function ApplicationForm({ job, onClose, onSuccess }) {
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

  // Determine if this is an internship or job application
  const isInternship = job.job_type === "Internship";

  // Initialize the form
  useEffect(() => {
    async function initializeForm() {
      try {
        if (!user?.email) return;
        setIsChecking(false);
      } catch (error) {
        console.error('Error initializing form:', error);
        setIsChecking(false);
      }
    }

    initializeForm();
  }, [user?.email]);

  if (!isStudent) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Apply for {job.title}</CardTitle>
          <p className="text-center text-gray-600">
            at {job.company} • {job.location}
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 mb-4 font-semibold">
            You must be logged in as a student to apply for this {isInternship ? 'internship' : 'job'}.
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
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) {
        throw new Error('Please log in to apply');
      }

      const applicationData = {
        applicant_email: user.email,
        applicant_name: formData.applicant_name || user.full_name,
        phone: formData.phone,
        experience: formData.experience,
        cover_letter: formData.cover_letter,
        resume_url: formData.resume_url,
        application_type: isInternship ? 'internship' : 'job',
        [isInternship ? 'internship_id' : 'job_id']: job.id || job._id
      };

      // Create the application directly
      await ApplicationApi.create(applicationData);

      onSuccess(`${isInternship ? 'Internship' : 'Job'} application submitted successfully!`);
      
      // Show success message
      onSuccess(`${isInternship ? 'Internship' : 'Job'} application submitted successfully!`);
      
      // Close the form
      onClose();
      
      // Navigate to My Applications
      try {
        // Ensure we're properly wrapped in StudentLayout
        navigate('/p/applications', { 
          replace: true,
          state: { from: 'application' }
        });
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback navigation
        window.location.href = '/p/applications';
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      // If user not logged in, redirect to login
      if (error.message?.includes("not authenticated")) {
        await User.loginWithRedirect(window.location.href);
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
        <CardTitle className="text-2xl text-center">Apply for {job.title}</CardTitle>
        <p className="text-center text-gray-600">
          at {job.company} • {job.location}
          {isInternship && job.duration && ` • ${job.duration}`}
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
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isInternship ? 'Relevant Experience' : 'Years of Experience'}
              </label>
              <Input
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder={isInternship ? "Projects, coursework, etc." : "e.g., 3 years"}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter *</label>
            <Textarea
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleInputChange}
              placeholder={`Tell us why you're interested in this ${isInternship ? 'internship' : 'position'} and what makes you a great candidate...`}
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSubmitting ? "Submitting..." : `Submit ${isInternship ? 'Internship' : 'Job'} Application`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
