import React, { useState, useEffect } from "react";
import ApplicationApi from "../../Services/ApplicationApi";
import UserApi from "../../Services/UserApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function InternshipApplicationForm({ internship, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_email: "",
    phone: "",
    university: "",
    course: "",
    graduation_year: "",
    current_semester: "",
    technical_skills: "",
    github_profile: "",
    linkedin_profile: "",
    portfolio_url: "",
    cover_letter: "",
    resume_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  let user = null;
  try {
    user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }
  const jwt = localStorage.getItem("jwt");
  const isStudent = user && jwt && user.role === "student";

  useEffect(() => {
    async function initializeForm() {
      try {
        if (!user?.email) return;

        const checkParams = {
          applicant_email: user.email,
          application_type: "internship",
          internship_id: internship.id || internship._id,
        };

        const alreadyApplied = await ApplicationApi.check(checkParams);
        setHasApplied(alreadyApplied);
      } catch (error) {
        console.error("Error checking application status:", error);
      } finally {
        setIsChecking(false);
      }
    }

    if (isStudent) {
      initializeForm();
    } else {
      setIsChecking(false);
    }
  }, [user?.email, internship.id, internship._id, isStudent]);

  if (!isStudent) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Apply for {internship.title}</CardTitle>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user || !user.email) {
        throw new Error("Please log in to apply");
      }

      const applicationData = {
        ...formData,
        applicant_email: user.email,
        application_type: "internship",
        internship_id: internship.id || internship._id,
      };

      await ApplicationApi.create(applicationData);

      onSuccess("Internship application submitted successfully!");
      onClose();
      navigate("/p/applications", { replace: true });
    } catch (error) {
      console.error("Error submitting application:", error);
      if (error.response && error.response.status === 409) {
        setHasApplied(true);
        onSuccess(error.response.data.error, "error");
      } else if (error.message?.includes("not authenticated")) {
        await UserApi.loginWithRedirect(window.location.href);
      } else {
        onSuccess("Failed to submit application. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking) {
    return <div>Loading...</div>;
  }

  if (hasApplied) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Apply for {internship.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-green-600 mb-4 font-semibold">
            You have already applied for this internship.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Apply for {internship.title}</CardTitle>
        <p className="text-center text-gray-600">
          at {internship.company} • {internship.location} • {internship.duration}
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields... */}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
              <Input
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                placeholder="Your university"
              />
            </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                    <Input
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        placeholder="Your course"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                    <Input
                        name="graduation_year"
                        value={formData.graduation_year}
                        onChange={handleInputChange}
                        placeholder="Your graduation year"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
                <Input
                    name="current_semester"
                    value={formData.current_semester}
                    onChange={handleInputChange}
                    placeholder="Your current semester"
                />
            </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
            <Textarea
              name="technical_skills"
              value={formData.technical_skills}
              onChange={handleInputChange}
              placeholder="Your technical skills"
              rows={3}
            />
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Github Profile</label>
                    <Input
                        name="github_profile"
                        value={formData.github_profile}
                        onChange={handleInputChange}
                        placeholder="https://github.com/your-profile"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                    <Input
                        name="linkedin_profile"
                        value={formData.linkedin_profile}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/your-profile"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
                <Input
                    name="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={handleInputChange}
                    placeholder="https://your-portfolio.com"
                />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume URL</label>
            <Input
              name="resume_url"
              value={formData.resume_url}
              onChange={handleInputChange}
              placeholder="Paste your resume link here"
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
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}