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
    education_level: "",
    // Job Description
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    skills: "",
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

  // Character count functions
  const getCharacterCount = (text) => {
    if (!text || typeof text !== "string") return 0;
    return text.trim().length;
  };

  const getCharacterCountMessage = (text, minChars, maxChars) => {
    const count = getCharacterCount(text);
    if (count < minChars) {
      return `Minimum ${minChars} characters required.`;
    } else if (count > maxChars) {
      return `Maximum ${maxChars} characters allowed.`;
    }
    return `Minimum ${minChars} characters and maximum ${maxChars} characters required`;
  };

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

  const validateSalary = (min, max) => {
    if (min && max && Number(min) > Number(max)) {
      return false;
    }
    if (min && Number(min) < 0) {
      return false;
    }
    if (max && Number(max) < 0) {
      return false;
    }
    return true;
  };

  const validateForm = () => {
    // Validate salary values
    if (!validateSalary(form.salary_min, form.salary_max)) {
      showError("Invalid salary values. Min salary cannot be greater than max salary, and values cannot be negative.");
      return false;
    }

    // Validate character counts
    const descriptionChars = getCharacterCount(form.description);
    const responsibilitiesChars = getCharacterCount(form.responsibilities);
    const requirementsChars = getCharacterCount(form.requirements);
    const skillsChars = getCharacterCount(form.skills);
    const benefitsChars = getCharacterCount(form.benefits);
    const companyDescChars = getCharacterCount(form.company_description);

    // Debug logging
    console.log("Description character count:", descriptionChars);
    console.log("Description text:", form.description);

    if (descriptionChars < 50) {
      showError(`Job Description must have at least 50 characters. Current: ${descriptionChars} characters.`);
      return false;
    }
    if (descriptionChars > 2500) {
      showError(`Job Description must have no more than 500 characters. Current: ${descriptionChars} characters.`);
      return false;
    }

    if (responsibilitiesChars < 50) {
      showError(`Key Responsibilities must have at least 50 characters. Current: ${responsibilitiesChars} characters.`);
      return false;
    }
    if (responsibilitiesChars > 500) {
      showError(
        `Key Responsibilities must have no more than 500 characters. Current: ${responsibilitiesChars} characters.`
      );
      return false;
    }

    if (requirementsChars < 50) {
      showError(`Requirements must have at least 50 characters. Current: ${requirementsChars} characters.`);
      return false;
    }
    if (requirementsChars > 500) {
      showError(`Requirements must have no more than 500 characters. Current: ${requirementsChars} characters.`);
      return false;
    }

    // Validate skills as comma-separated values
    const skills = form.skills
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    if (skills.length < 2) {
      showError("Please add at least 2 skills separated by commas.");
      return false;
    }

    if (benefitsChars < 50) {
      showError(`Benefits & Perks must have at least 50 characters. Current: ${benefitsChars} characters.`);
      return false;
    }
    if (benefitsChars > 500) {
      showError(`Benefits & Perks must have no more than 500 characters. Current: ${benefitsChars} characters.`);
      return false;
    }

    if (companyDescChars < 50) {
      showError(`Company Description must have at least 50 characters. Current: ${companyDescChars} characters.`);
      return false;
    }
    if (companyDescChars > 500) {
      showError(`Company Description must have no more than 500 characters. Current: ${companyDescChars} characters.`);
      return false;
    }

    return true;
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

    if (!validateForm()) {
      return;
    }

    const payload = {
      ...form,
      // Convert skills string to array
      skills: form.skills
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* ⬅️ Back Button */}
      <button onClick={handleGoBack} className="flex items-center text-sm text-blue-600 hover:underline mb-4 sm:mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Go Back
      </button>

      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="title" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
              Job Title *
            </label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="company" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
              Company Name *
            </label>
            <Input id="company" name="company" value={form.company} onChange={handleChange} required />
          </div>
        </div>

        {/* Location and Work Arrangement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="location" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
              Location *
            </label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="city, state"
              required
            />
          </div>

          <div>
            <label htmlFor="job_type" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
              Job Type *
            </label>
            <select
              id="job_type"
              name="job_type"
              value={form.job_type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm sm:text-base"
              required
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
        </div>

        {/* Salary Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div>
            <label htmlFor="salary_min" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
              Minimum Salary (₹)
            </label>
            <Input
              type="number"
              id="salary_min"
              name="salary_min"
              value={form.salary_min}
              onChange={handleChange}
              placeholder="e.g., 300000"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="salary_max" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
              Maximum Salary (₹)
            </label>
            <Input
              type="number"
              id="salary_max"
              name="salary_max"
              value={form.salary_max}
              onChange={handleChange}
              placeholder="e.g., 600000"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="salary_type" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
              Salary Type
            </label>
            <select
              id="salary_type"
              name="salary_type"
              value={form.salary_type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm sm:text-base"
              required
            >
              <option value="Per Annum">Per Annum</option>
              <option value="Per Month">Per Month</option>
            </select>
          </div>

          <div>
            <label htmlFor="number_of_openings" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label htmlFor="experience_level" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
              Experience Level
            </label>
            <select
              id="experience_level"
              name="experience_level"
              value={form.experience_level}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm sm:text-base"
              required
            >
              <option value="Fresher">Fresher</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div>
            <label htmlFor="experience_years_min" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
              Min Experience (Years)
            </label>
            <Input
              type="number"
              id="experience_years_min"
              name="experience_years_min"
              value={form.experience_years_min}
              onChange={handleChange}
              placeholder="0"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="experience_years_max" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
              Max Experience (Years)
            </label>
            <Input
              type="number"
              id="experience_years_max"
              name="experience_years_max"
              value={form.experience_years_max}
              onChange={handleChange}
              placeholder="5"
              min="0"
              required
            />
          </div>
        </div>

        {/* Education Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="education_level" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
              Education Level
            </label>
            <Input
              id="education_level"
              name="education_level"
              value={form.education_level}
              onChange={handleChange}
              placeholder="e.g., Bachelor's Degree, Master's Degree, Any..."
              required
            />
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="description" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
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
            className="text-sm sm:text-base"
          />
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {getCharacterCountMessage(form.description, 50, 2500)}
          </p>
        </div>

        {/* Responsibilities */}
        <div>
          <label htmlFor="responsibilities" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
            Key Responsibilities *
          </label>
          <Textarea
            id="responsibilities"
            name="responsibilities"
            value={form.responsibilities}
            onChange={handleChange}
            placeholder="Describe the key responsibilities and tasks the employee will be expected to perform..."
            rows={6}
            required
            className="text-sm sm:text-base"
          />
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {getCharacterCountMessage(form.responsibilities, 50, 500)}
          </p>
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
            Requirements *
          </label>
          <Textarea
            id="requirements"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="Describe the requirements and qualifications needed for this job..."
            rows={6}
            required
            className="text-sm sm:text-base"
          />
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {getCharacterCountMessage(form.requirements, 50, 500)}
          </p>
        </div>

        {/* Skills */}
        <div>
          <label htmlFor="skills" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
            Required Skills * (Add skills separated by commas)
          </label>
          <Textarea
            id="skills"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, Node.js, MongoDB, Git, AWS, Docker..."
            rows={4}
            required
            className="text-sm sm:text-base"
          />
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Add multiple skills separated by commas (e.g., JavaScript, React, Node.js)
          </p>
        </div>

        {/* Benefits */}
        <div>
          <label htmlFor="benefits" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
            Benefits & Perks *
          </label>
          <Textarea
            id="benefits"
            name="benefits"
            value={form.benefits}
            onChange={handleChange}
            placeholder="Describe the benefits, perks, and additional advantages of this job..."
            rows={6}
            required
            className="text-sm sm:text-base"
          />
          <p className="text-xs sm:text-sm text-gray-600 mt-1">{getCharacterCountMessage(form.benefits, 50, 500)}</p>
        </div>

        {/* Work Arrangement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex items-center gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <Checkbox
              id="remote_option"
              checked={form.remote_option}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, remote_option: checked }))}
            />
            <label htmlFor="remote_option" className="font-medium text-sm sm:text-base">
              Remote Work Option
            </label>
          </div>

          <div className="flex items-center gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <Checkbox
              id="work_from_home"
              checked={form.work_from_home}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, work_from_home: checked }))}
            />
            <label htmlFor="work_from_home" className="font-medium text-sm sm:text-base">
              Work from Office
            </label>
          </div>
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="company_website" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
              Company Website
            </label>
            <Input
              type="text"
              id="company_website"
              name="company_website"
              value={form.company_website}
              onChange={handleChange}
              placeholder="https://www.company.com or http://company.com"
            />
          </div>

          <div>
            <label htmlFor="company_description" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
              Company Description *
            </label>
            <Textarea
              id="company_description"
              name="company_description"
              value={form.company_description}
              onChange={handleChange}
              placeholder="Brief description about your company..."
              rows={3}
              required
              className="text-sm sm:text-base"
            />
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {getCharacterCountMessage(form.company_description, 50, 500)}
            </p>
          </div>
        </div>

        <Button
          type="submit"
          variant="default"
          className="bg-blue-500 hover:bg-blue-600 w-full text-sm sm:text-base py-2 sm:py-3"
        >
          Post Job
        </Button>
      </form>
    </div>
  );
}
