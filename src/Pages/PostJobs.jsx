import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/common/ToastContext";
import { axiosInstance } from "@/lib/axios";

const locations = ["Noida", "Delhi", "Pune", "Mumbai", "Bangalore", "Hyderabad"];

export default function PostJob() {
  const navigate = useNavigate();
  const { showError, showSuccess, showWarning } = useToast();
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    // Salary/Compensation
    salary_min: "",
    salary_max: "",
    salary_type: "Per Annum",
    salary_currency: "INR",
    // Job Details
    job_type: "Full-time",
    experience_level: "Entry Level",
    experience_years_min: "",
    experience_years_max: "",
    // Education Requirements
    education_level: "Any",
    // Job Description
    description: "",
    responsibilities: [],
    requirements: [],
    benefits: [],
    skills: [],
    // Work Arrangement
    remote_option: false,
    work_from_home: false,
    // Application Details
    application_deadline: "",
    number_of_openings: 1,
    // Company Information
    company_website: "",
    company_description: "",
  });

  const [recruiter, setRecruiter] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const jwt = localStorage.getItem("jwt");

    if (!user || !jwt || user.role !== "recruiter") {
      navigate("/p/recruiterauth");
    } else {
      setRecruiter(user);
      // Initialize company in form if available
      setForm((prev) => ({
        ...prev,
        company: user.company_name || "",
      }));
    }
  }, [navigate]);

  const handleGoBack = () => {
    navigate(-1); // 👈 go to previous page
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, key) => {
    const items = e.target.value.split(",").map((item) => item.trim());
    setForm((prev) => ({ ...prev, [key]: items }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recruiter) {
      showError("Only recruiters can post jobs. Please log in as a recruiter.");
      navigate("/p/recruiterauth");
      return;
    }

    if (!form.company || form.company.trim() === "") {
      showWarning("Company name is required. Please update your profile or enter company name.");
      return;
    }

    const payload = {
      ...form,
      // Convert number fields to numbers
      salary_min: form.salary_min ? Number(form.salary_min) : undefined,
      salary_max: form.salary_max ? Number(form.salary_max) : undefined,
      experience_years_min: form.experience_years_min ? Number(form.experience_years_min) : undefined,
      experience_years_max: form.experience_years_max ? Number(form.experience_years_max) : undefined,
      number_of_openings: Number(form.number_of_openings),
      // Convert date fields
      application_deadline: form.application_deadline ? new Date(form.application_deadline) : undefined,
      posted_by: recruiter.email,
    };

    try {
      console.log("Payload being sent:", payload);
      const jwt = localStorage.getItem("jwt");
      const response = await axiosInstance.post("/api/jobs", payload, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });

      // Show success message with approval notice
      showSuccess(
        "Job posted successfully! Your job is now pending admin approval. You will be notified once it's approved."
      );
      navigate("/p/jobs");
    } catch (error) {
      console.error("Job creation failed", error.response?.data || error.message);
      showError(error.response?.data?.error || "Failed to post Job. Please check all fields.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ⬅️ Back Button */}
      <button onClick={handleGoBack} className="flex items-center text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Go Back
      </button>

      <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">
              Job Title *
            </label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="company" className="block mb-1 font-medium">
              Company Name *
            </label>
            <Input id="company" name="company" value={form.company} onChange={handleChange} required />
          </div>
        </div>

        {/* Location and Work Arrangement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block mb-1 font-medium">
              Location *
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
            <label htmlFor="job_type" className="block mb-1 font-medium">
              Job Type *
            </label>
            <select
              id="job_type"
              name="job_type"
              value={form.job_type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
        </div>

        {/* Salary Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="salary_min" className="block mb-1 font-medium">
              Minimum Salary (₹)
            </label>
            <Input
              type="number"
              id="salary_min"
              name="salary_min"
              value={form.salary_min}
              onChange={handleChange}
              placeholder="e.g., 300000"
            />
          </div>

          <div>
            <label htmlFor="salary_max" className="block mb-1 font-medium">
              Maximum Salary (₹)
            </label>
            <Input
              type="number"
              id="salary_max"
              name="salary_max"
              value={form.salary_max}
              onChange={handleChange}
              placeholder="e.g., 600000"
            />
          </div>

          <div>
            <label htmlFor="salary_type" className="block mb-1 font-medium">
              Salary Type
            </label>
            <select
              id="salary_type"
              name="salary_type"
              value={form.salary_type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Per Annum">Per Annum</option>
              <option value="Per Month">Per Month</option>
              <option value="Per Hour">Per Hour</option>
              <option value="Per Project">Per Project</option>
            </select>
          </div>

          <div>
            <label htmlFor="number_of_openings" className="block mb-1 font-medium">
              Number of Openings
            </label>
            <Input
              type="number"
              id="number_of_openings"
              name="number_of_openings"
              value={form.number_of_openings}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        {/* Experience Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            >
              <option value="Fresher">Fresher</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div>
            <label htmlFor="experience_years_min" className="block mb-1 font-medium">
              Min Experience (Years)
            </label>
            <Input
              type="number"
              id="experience_years_min"
              name="experience_years_min"
              value={form.experience_years_min}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="experience_years_max" className="block mb-1 font-medium">
              Max Experience (Years)
            </label>
            <Input
              type="number"
              id="experience_years_max"
              name="experience_years_max"
              value={form.experience_years_max}
              onChange={handleChange}
              placeholder="5"
            />
          </div>
        </div>

        {/* Education Requirements */}
        <div>
          <label htmlFor="education_level" className="block mb-1 font-medium">
            Education Level
          </label>
          <select
            id="education_level"
            name="education_level"
            value={form.education_level}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Any">Any</option>
            <option value="High School">High School</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Job Description *
          </label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
            rows={6}
            required
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
            value={form.responsibilities.join(", ")}
            onChange={(e) => handleArrayChange(e, "responsibilities")}
            placeholder="Enter key responsibilities separated by commas..."
            rows={3}
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
            value={form.requirements.join(", ")}
            onChange={(e) => handleArrayChange(e, "requirements")}
            placeholder="Enter requirements separated by commas..."
            rows={3}
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
            value={form.skills.join(", ")}
            onChange={(e) => handleArrayChange(e, "skills")}
            placeholder="Enter required skills separated by commas..."
            rows={3}
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
            value={form.benefits.join(", ")}
            onChange={(e) => handleArrayChange(e, "benefits")}
            placeholder="Enter benefits and perks separated by commas..."
            rows={3}
          />
        </div>

        {/* Work Arrangement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remote_option"
              checked={form.remote_option}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, remote_option: checked }))}
            />
            <label htmlFor="remote_option" className="font-medium">
              Remote Work Option
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="work_from_home"
              checked={form.work_from_home}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, work_from_home: checked }))}
            />
            <label htmlFor="work_from_home" className="font-medium">
              Work from Home
            </label>
          </div>
        </div>

        {/* Application Deadline */}
        <div>
          <label htmlFor="application_deadline" className="block mb-1 font-medium">
            Application Deadline
          </label>
          <Input
            type="date"
            id="application_deadline"
            name="application_deadline"
            value={form.application_deadline}
            onChange={handleChange}
          />
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company_website" className="block mb-1 font-medium">
              Company Website
            </label>
            <Input
              type="url"
              id="company_website"
              name="company_website"
              value={form.company_website}
              onChange={handleChange}
              placeholder="https://company.com"
            />
          </div>

          <div>
            <label htmlFor="company_description" className="block mb-1 font-medium">
              Company Description
            </label>
            <Textarea
              id="company_description"
              name="company_description"
              value={form.company_description}
              onChange={handleChange}
              placeholder="Brief description about your company..."
              rows={3}
            />
          </div>
        </div>

        <Button type="submit" variant="default" className="bg-blue-500 hover:bg-blue-600 w-full">
          Post Job
        </Button>
      </form>
    </div>
  );
}
