import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/common/ToastContext";
import { axiosInstance } from "@/lib/axios";

export default function PostInternship() {
  const navigate = useNavigate();
  const { showError, showSuccess, showWarning } = useToast();
  const [form, setForm] = useState({
    title: "",
    company: "",
    // Location and Work Arrangement
    location: "",
    remote_option: false,
    work_from_home: false,
    // Duration and Timing
    duration: "",
    start_date: "",
    end_date: "",
    // Stipend/Compensation
    stipend: "",
    stipend_type: "Fixed",
    stipend_amount_min: "",
    stipend_amount_max: "",
    // Education Requirements
    education_level: "Any",
    education_level_manual: "",
    // Internship Description
    description: "",
    responsibilities: "",
    requirements: "",
    skills: "",
    // Perks and Benefits
    perks: "",
    // Application Details
    application_deadline: "",
    number_of_openings: 1,
    // Company Information
    company_website: "",
    company_description: "",
  });

  const [recruiter, setRecruiter] = useState(null);
  const [showEducationManual, setShowEducationManual] = useState(false);

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

  const handleArrayChange = (e, key) => {
    const items = e.target.value.split(",").map((item) => item.trim());
    setForm((prev) => ({ ...prev, [key]: items }));
  };

  const validateStipend = (min, max) => {
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
    // Validate stipend values
    if (!validateStipend(form.stipend_amount_min, form.stipend_amount_max)) {
      showError(
        "Invalid stipend values. Min stipend cannot be greater than max stipend, and values cannot be negative."
      );
      return false;
    }

    // Validate character counts
    const descriptionChars = getCharacterCount(form.description);
    const responsibilitiesChars = getCharacterCount(form.responsibilities);
    const requirementsChars = getCharacterCount(form.requirements);
    const skillsChars = getCharacterCount(form.skills);
    const perksChars = getCharacterCount(form.perks);
    const companyDescChars = getCharacterCount(form.company_description);

    // Debug logging
    console.log("Description character count:", descriptionChars);
    console.log("Description text:", form.description);

    if (descriptionChars < 50) {
      showError(`Internship Description must have at least 50 characters. Current: ${descriptionChars} characters.`);
      return false;
    }
    if (descriptionChars > 2500) {
      showError(
        `Internship Description must have no more than 500 characters. Current: ${descriptionChars} characters.`
      );
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

    if (skillsChars < 50) {
      showError(`Required Skills must have at least 50 characters. Current: ${skillsChars} characters.`);
      return false;
    }
    if (skillsChars > 500) {
      showError(`Required Skills must have no more than 500 characters. Current: ${skillsChars} characters.`);
      return false;
    }

    if (perksChars < 50) {
      showError(`Perks & Benefits must have at least 50 characters. Current: ${perksChars} characters.`);
      return false;
    }
    if (perksChars > 500) {
      showError(`Perks & Benefits must have no more than 500 characters. Current: ${perksChars} characters.`);
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
      showError("Only recruiters can post internships. Please log in as a recruiter.");
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
      // Use manual education level if selected, otherwise use dropdown
      education_level: showEducationManual ? form.education_level_manual : form.education_level,
      // Convert number fields to numbers
      stipend_amount_min: form.stipend_amount_min ? Number(form.stipend_amount_min) : undefined,
      stipend_amount_max: form.stipend_amount_max ? Number(form.stipend_amount_max) : undefined,
      number_of_openings: Number(form.number_of_openings),
      // Convert date fields
      start_date: form.start_date ? new Date(form.start_date) : undefined,
      end_date: form.end_date ? new Date(form.end_date) : undefined,
      application_deadline: form.application_deadline ? new Date(form.application_deadline) : undefined,
      posted_by: recruiter.email,
    };

    try {
      console.log("Payload being sent:", payload);
      const jwt = localStorage.getItem("jwt");
      const response = await axiosInstance.post("/api/internships/create", payload, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });

      // Show success message with approval notice
      showSuccess(
        "Internship posted successfully! Your internship is now pending admin approval. You will be notified once it's approved."
      );
      navigate("/p/internships");
    } catch (error) {
      console.error("Internship creation failed", error.response?.data || error.message);
      showError(error.response?.data?.error || "Failed to post internship. Please check all fields.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* ⬅️ Back Button */}
      <button onClick={handleGoBack} className="flex items-center text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Go Back
      </button>

      <h2 className="text-xl sm:text-2xl font-bold mb-6">Post a New Internship</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">
              Internship Title *
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

        {/* Location */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block mb-1 font-medium">
              Location *
            </label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="city, State"
              required
            />
          </div>
        </div>

        {/* Duration and Timing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="duration" className="block mb-1 font-medium">
              Internship Duration *
            </label>
            <select
              id="duration"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>
                Select duration
              </option>
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
              <option value="3 weeks">3 weeks</option>
              <option value="1 month">1 month</option>
              <option value="2 months">2 months</option>
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
            </select>
          </div>

          <div>
            <label htmlFor="start_date" className="block mb-1 font-medium">
              Start Date
            </label>
            <Input
              type="date"
              id="start_date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]} // prevents selecting past dates
            />
          </div>
        </div>

        {/* Stipend Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="stipend_amount_min" className="block mb-1 font-medium">
              Min Stipend (₹)
            </label>
            <Input
              type="number"
              id="stipend_amount_min"
              name="stipend_amount_min"
              value={form.stipend_amount_min}
              onChange={handleChange}
              placeholder="e.g., 5000"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="stipend_amount_max" className="block mb-1 font-medium">
              Max Stipend (₹)
            </label>
            <Input
              type="number"
              id="stipend_amount_max"
              name="stipend_amount_max"
              value={form.stipend_amount_max}
              onChange={handleChange}
              placeholder="e.g., 15000"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="stipend_type" className="block mb-1 font-medium">
              Stipend Type
            </label>
            <select
              id="stipend_type"
              name="stipend_type"
              value={form.stipend_type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Fixed">Fixed</option>
              <option value="Unpaid">Unpaid</option>
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

        {/* Education Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label htmlFor="education_level" className="block mb-1 font-medium">
              Education Level
            </label>
            <div className="space-y-2">
              <select
                id="education_level"
                name="education_level"
                value={form.education_level}
                onChange={(e) => {
                  handleChange(e);
                  setShowEducationManual(e.target.value === "Other");
                }}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Any">Any</option>
                <option value="High School">High School</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
                <option value="Other">Other (Write manually)</option>
              </select>

              {showEducationManual && (
                <Input
                  name="education_level_manual"
                  value={form.education_level_manual}
                  onChange={handleChange}
                  placeholder="Enter the required education of student"
                />
              )}
            </div>
          </div>
        </div>

        {/* Internship Description */}
        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Internship Description *
          </label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the internship role, learning opportunities, and what you're looking for in a candidate..."
            rows={6}
            required
          />
          <p className="text-sm text-gray-600 mt-1">{getCharacterCountMessage(form.description, 50, 2500)}</p>
        </div>

        {/* Responsibilities */}
        <div>
          <label htmlFor="responsibilities" className="block mb-1 font-medium">
            Key Responsibilities *
          </label>
          <Textarea
            id="responsibilities"
            name="responsibilities"
            value={form.responsibilities}
            onChange={handleChange}
            placeholder="Describe the key responsibilities and tasks the intern will be expected to perform..."
            rows={4}
            required
          />
          <p className="text-sm text-gray-600 mt-1">{getCharacterCountMessage(form.responsibilities, 50, 500)}</p>
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block mb-1 font-medium">
            Requirements *
          </label>
          <Textarea
            id="requirements"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="Describe the requirements and qualifications needed for this internship..."
            rows={10}
            required
          />
          <p className="text-sm text-gray-600 mt-1">{getCharacterCountMessage(form.requirements, 50, 500)}</p>
        </div>

        {/* Skills */}
        <div>
          <label htmlFor="skills" className="block mb-1 font-medium">
            Required Skills *
          </label>
          <Textarea
            id="skills"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Describe the skills, technologies, and competencies required for this internship..."
            rows={4}
            required
          />
          <p className="text-sm text-gray-600 mt-1">{getCharacterCountMessage(form.skills, 50, 500)}</p>
        </div>

        {/* Perks */}
        <div>
          <label htmlFor="perks" className="block mb-1 font-medium">
            Perks & Benefits *
          </label>
          <Textarea
            id="perks"
            name="perks"
            value={form.perks}
            onChange={handleChange}
            placeholder="Describe the perks, benefits, and additional advantages of this internship..."
            rows={4}
            required
          />
          <p className="text-sm text-gray-600 mt-1">{getCharacterCountMessage(form.perks, 50, 500)}</p>
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
              Work from Office
            </label>
          </div>
        </div>

        {/* Application Deadline */}
        {/* <div>
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
        </div> */}

        {/* Company Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company_website" className="block mb-1 font-medium">
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
            <label htmlFor="company_description" className="block mb-1 font-medium">
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
            />
            <p className="text-sm text-gray-600 mt-1">{getCharacterCountMessage(form.company_description, 50, 500)}</p>
          </div>
        </div>

        <Button type="submit" variant="default" className="bg-blue-500 hover:bg-blue-600 w-full">
          Post Internship
        </Button>
      </form>
    </div>
  );
}
