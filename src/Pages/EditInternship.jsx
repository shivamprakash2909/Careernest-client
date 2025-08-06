import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/common/ToastContext";
import { axiosInstance } from "@/lib/axios";

const locations = ["Noida", "Delhi", "Pune", "Mumbai", "Bangalore", "Hyderabad", "Remote", "Work from Home"];
const durations = ["1 month", "2 months", "3 months", "6 months", "1 year"];
const internshipTypes = [
  "Summer Internship",
  "Winter Internship",
  "Semester Internship",
  "Project Internship",
  "Research Internship",
];
const stipendTypes = ["Fixed", "Performance Based", "Unpaid", "Stipend + Performance Bonus"];
const educationLevels = ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Any"];
const academicYears = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "Any"];

export default function EditInternship() {
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { internshipId } = useParams();
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (internshipId) {
      loadInternship(internshipId);
    } else {
      navigate("/p/manage-internships");
    }
    // eslint-disable-next-line
  }, [internshipId]);

  const loadInternship = async (internshipId) => {
    setIsLoading(true);
    try {
      const jwt = localStorage.getItem("jwt");
      const response = await axiosInstance.get(`/api/jobs/internships/${internshipId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = response.data;
      setForm(data);
    } catch (error) {
      console.error("Error loading internship:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, key) => {
    const items = e.target.value.split(",").map((item) => item.trim());
    setForm((prev) => ({ ...prev, [key]: items }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      await axiosInstance.put(`/api/jobs/internships/${internshipId}`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      setSuccess(true);
      setTimeout(() => navigate("/p/manage-internships"), 1200);
    } catch (error) {
      showError("Failed to update internship.");
    }
  };

  if (isLoading || !form) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 w-full sm:p-8 md:p-10 lg:p-12">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Edit Internship</h2>
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
          Internship updated successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Internship Title
          </label>
          <Input id="title" name="title" value={form.title} onChange={handleChange} required className="w-full" />
        </div>
        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block mb-1 font-medium">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="company" className="block mb-1 font-medium">
              Company
            </label>
            <Input
              id="company"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
        </div>
        {/* Internship Type and Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="internship_type" className="block mb-1 font-medium">
              Internship Type
            </label>
            <select
              id="internship_type"
              name="internship_type"
              value={form.internship_type || "Summer Internship"}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {internshipTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="duration" className="block mb-1 font-medium">
              Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select duration</option>
              {durations.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block mb-1 font-medium">
              Start Date
            </label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              value={form.start_date ? new Date(form.start_date).toISOString().split("T")[0] : ""}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block mb-1 font-medium">
              End Date
            </label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              value={form.end_date ? new Date(form.end_date).toISOString().split("T")[0] : ""}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        {/* Stipend/Compensation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="stipend_amount_min" className="block mb-1 font-medium">
              Minimum Stipend (₹)
            </label>
            <Input
              id="stipend_amount_min"
              name="stipend_amount_min"
              type="number"
              min="0"
              value={form.stipend_amount_min || ""}
              onChange={handleChange}
              placeholder="e.g., 5000"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="stipend_amount_max" className="block mb-1 font-medium">
              Maximum Stipend (₹)
            </label>
            <Input
              id="stipend_amount_max"
              name="stipend_amount_max"
              type="number"
              min="0"
              value={form.stipend_amount_max || ""}
              onChange={handleChange}
              placeholder="e.g., 15000"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="stipend_type" className="block mb-1 font-medium">
              Stipend Type
            </label>
            <select
              id="stipend_type"
              name="stipend_type"
              value={form.stipend_type || "Fixed"}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {stipendTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Legacy stipend field for backward compatibility */}
        <div>
          <label htmlFor="stipend" className="block mb-1 font-medium">
            Stipend (Legacy Format)
          </label>
          <Input
            id="stipend"
            name="stipend"
            type="text"
            value={form.stipend || ""}
            onChange={handleChange}
            placeholder="e.g., 10000/month"
            className="w-full"
          />
        </div>

        {/* Education Requirements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="education_level" className="block mb-1 font-medium">
              Education Level
            </label>
            <select
              id="education_level"
              name="education_level"
              value={form.education_level || "Any"}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {educationLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="academic_year" className="block mb-1 font-medium">
              Academic Year
            </label>
            <select
              id="academic_year"
              name="academic_year"
              value={form.academic_year || "Any"}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>

        {/* Responsibilities */}
        <div>
          <label htmlFor="responsibilities" className="block mb-1 font-medium">
            Key Responsibilities
          </label>
          <Textarea
            id="responsibilities"
            name="responsibilities"
            value={form.responsibilities ? form.responsibilities.join(", ") : ""}
            onChange={(e) => handleArrayChange(e, "responsibilities")}
            placeholder="Enter key responsibilities, separated by commas..."
            rows={4}
            className="w-full"
          />
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block mb-1 font-medium">
            Requirements
          </label>
          <Textarea
            id="requirements"
            name="requirements"
            value={form.requirements ? form.requirements.join(", ") : ""}
            onChange={(e) => handleArrayChange(e, "requirements")}
            placeholder="Enter requirements, separated by commas..."
            rows={4}
            className="w-full"
          />
        </div>

        {/* Skills */}
        <div>
          <label htmlFor="skills" className="block mb-1 font-medium">
            Required Skills
          </label>
          <Textarea
            id="skills"
            name="skills"
            value={form.skills ? form.skills.join(", ") : ""}
            onChange={(e) => handleArrayChange(e, "skills")}
            placeholder="Enter required skills, separated by commas..."
            rows={4}
            className="w-full"
          />
        </div>

        {/* Perks */}
        <div>
          <label htmlFor="perks" className="block mb-1 font-medium">
            Perks & Benefits
          </label>
          <Textarea
            id="perks"
            name="perks"
            value={form.perks ? form.perks.join(", ") : ""}
            onChange={(e) => handleArrayChange(e, "perks")}
            placeholder="Enter perks and benefits, separated by commas..."
            rows={4}
            className="w-full"
          />
        </div>
        {/* Work Arrangement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              id="remote_option"
              name="remote_option"
              type="checkbox"
              checked={form.remote_option || false}
              onChange={(e) => setForm((prev) => ({ ...prev, remote_option: e.target.checked }))}
              className="h-4 w-4"
            />
            <label htmlFor="remote_option" className="font-medium">
              Remote Work Available
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="work_from_home"
              name="work_from_home"
              type="checkbox"
              checked={form.work_from_home || false}
              onChange={(e) => setForm((prev) => ({ ...prev, work_from_home: e.target.checked }))}
              className="h-4 w-4"
            />
            <label htmlFor="work_from_home" className="font-medium">
              Work from Home Available
            </label>
          </div>
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="application_deadline" className="block mb-1 font-medium">
              Application Deadline
            </label>
            <Input
              id="application_deadline"
              name="application_deadline"
              type="date"
              value={form.application_deadline ? new Date(form.application_deadline).toISOString().split("T")[0] : ""}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="number_of_openings" className="block mb-1 font-medium">
              Number of Openings
            </label>
            <Input
              id="number_of_openings"
              name="number_of_openings"
              type="number"
              min="1"
              value={form.number_of_openings || 1}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company_website" className="block mb-1 font-medium">
              Company Website
            </label>
            <Input
              id="company_website"
              name="company_website"
              type="url"
              value={form.company_website || ""}
              onChange={handleChange}
              placeholder="https://company.com"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="company_logo" className="block mb-1 font-medium">
              Company Logo URL
            </label>
            <Input
              id="company_logo"
              name="company_logo"
              type="url"
              value={form.company_logo || ""}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company_description" className="block mb-1 font-medium">
            Company Description
          </label>
          <Textarea
            id="company_description"
            name="company_description"
            value={form.company_description || ""}
            onChange={handleChange}
            placeholder="Brief description about the company..."
            rows={3}
            className="w-full"
          />
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          Update Internship
        </Button>
      </form>
    </div>
  );
}
