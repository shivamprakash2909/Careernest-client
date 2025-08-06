import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/common/ToastContext";
import { axiosInstance } from "@/lib/axios";

const locations = ["Noida", "Delhi", "Pune", "Mumbai", "Bangalore", "Hyderabad", "Remote", "Work from Home"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const experienceLevels = ["Fresher", "Entry Level", "Mid Level", "Senior Level", "Executive"];
const salaryTypes = ["Per Annum", "Per Month", "Per Hour", "Per Project"];
const educationLevels = ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Any"];

export default function EditJob() {
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (jobId) {
      loadJob(jobId);
    } else {
      navigate("/p/manage-jobs");
    }
    // eslint-disable-next-line
  }, [jobId]);

  const loadJob = async (jobId) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/api/jobs/${jobId}`, {
        headers: { "Content-Type": "application/json" },
      });
      const data = response.data;
      setForm(data);
    } catch (error) {
      console.error("Error loading job:", error);
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
      await axiosInstance.put(`/api/jobs/${jobId}`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      setSuccess(true);
      setTimeout(() => navigate("/p/manage-jobs"), 1200);
    } catch (error) {
      showError("Failed to update job.");
    }
  };

  if (isLoading || !form) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 w-full sm:p-8 md:p-10 lg:p-12">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Edit Job</h2>
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
          Job updated successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Job Title
          </label>
          <Input id="title" name="title" value={form.title} onChange={handleChange} required className="w-full" />
        </div>
        {/* Responsive grid for location and salary fields */}
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

        {/* Salary/Compensation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="salary_min" className="block mb-1 font-medium">
              Minimum Salary (₹)
            </label>
            <Input
              id="salary_min"
              name="salary_min"
              type="number"
              min="0"
              value={form.salary_min || ""}
              onChange={handleChange}
              placeholder="e.g., 50000"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="salary_max" className="block mb-1 font-medium">
              Maximum Salary (₹)
            </label>
            <Input
              id="salary_max"
              name="salary_max"
              type="number"
              min="0"
              value={form.salary_max || ""}
              onChange={handleChange}
              placeholder="e.g., 80000"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="salary_type" className="block mb-1 font-medium">
              Salary Type
            </label>
            <select
              id="salary_type"
              name="salary_type"
              value={form.salary_type || "Per Annum"}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {salaryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Job Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="job_type" className="block mb-1 font-medium">
              Job Type
            </label>
            <select
              id="job_type"
              name="job_type"
              value={form.job_type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select job type</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="experience_level" className="block mb-1 font-medium">
              Experience Level
            </label>
            <select
              id="experience_level"
              name="experience_level"
              value={form.experience_level}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select experience level</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Experience Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="experience_years_min" className="block mb-1 font-medium">
              Minimum Experience (years)
            </label>
            <Input
              id="experience_years_min"
              name="experience_years_min"
              type="number"
              min="0"
              value={form.experience_years_min || ""}
              onChange={handleChange}
              placeholder="e.g., 2"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="experience_years_max" className="block mb-1 font-medium">
              Maximum Experience (years)
            </label>
            <Input
              id="experience_years_max"
              name="experience_years_max"
              type="number"
              min="0"
              value={form.experience_years_max || ""}
              onChange={handleChange}
              placeholder="e.g., 5"
              className="w-full"
            />
          </div>
        </div>

        {/* Education */}
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

        {/* Benefits */}
        <div>
          <label htmlFor="benefits" className="block mb-1 font-medium">
            Benefits & Perks
          </label>
          <Textarea
            id="benefits"
            name="benefits"
            value={form.benefits ? form.benefits.join(", ") : ""}
            onChange={(e) => handleArrayChange(e, "benefits")}
            placeholder="Enter benefits and perks, separated by commas..."
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
          Update Job
        </Button>
      </form>
    </div>
  );
}
