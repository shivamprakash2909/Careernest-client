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

export default function PostInternship() {
  const navigate = useNavigate();
  const { showError, showSuccess, showWarning } = useToast();
  const [form, setForm] = useState({
    title: "",
    company: "",
    // Internship Details
    internship_type: "Summer Internship",
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
    academic_year: "Any",
    // Internship Description
    description: "",
    responsibilities: [],
    requirements: [],
    skills: [],
    // Perks and Benefits
    perks: [],
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
      showError("Only recruiters can post internships. Please log in as a recruiter.");
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
    <div className="max-w-3xl mx-auto p-6">
      {/* ⬅️ Back Button */}
      <button onClick={handleGoBack} className="flex items-center text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Go Back
      </button>

      <h2 className="text-2xl font-bold mb-6">Post a New Internship</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Internship Type and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="internship_type" className="block mb-1 font-medium">
              Internship Type *
            </label>
            <select
              id="internship_type"
              name="internship_type"
              value={form.internship_type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="Summer Internship">Summer Internship</option>
              <option value="Winter Internship">Winter Internship</option>
              <option value="Semester Internship">Semester Internship</option>
              <option value="Project Internship">Project Internship</option>
              <option value="Research Internship">Research Internship</option>
            </select>
          </div>

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
        </div>

        {/* Duration and Timing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="duration" className="block mb-1 font-medium">
              Duration *
            </label>
            <Input
              type="text"
              id="duration"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g., 2 months"
              required
            />
          </div>

          <div>
            <label htmlFor="start_date" className="block mb-1 font-medium">
              Start Date
            </label>
            <Input type="date" id="start_date" name="start_date" value={form.start_date} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="end_date" className="block mb-1 font-medium">
              End Date
            </label>
            <Input type="date" id="end_date" name="end_date" value={form.end_date} onChange={handleChange} />
          </div>
        </div>

        {/* Stipend Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <option value="Performance Based">Performance Based</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Stipend + Performance Bonus">Stipend + Performance Bonus</option>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label htmlFor="academic_year" className="block mb-1 font-medium">
              Academic Year
            </label>
            <select
              id="academic_year"
              name="academic_year"
              value={form.academic_year}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Any">Any</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Final Year">Final Year</option>
            </select>
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

        {/* Perks */}
        <div>
          <label htmlFor="perks" className="block mb-1 font-medium">
            Perks & Benefits
          </label>
          <Textarea
            id="perks"
            name="perks"
            value={form.perks.join(", ")}
            onChange={(e) => handleArrayChange(e, "perks")}
            placeholder="Enter perks and benefits separated by commas..."
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
          Post Internship
        </Button>
      </form>
    </div>
  );
}
