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
    company: "", // <-- added company here
    location: "",
    stipend: "",
    duration: "",
    description: "",
    requirements: [],
    skills: [],
    remote_option: false,
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
      stipend: String(form.stipend), // ensure stipend is string as per schema
      posted_by: recruiter.email,
      job_type: "Full-time", // required field for validation
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
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Job Title
          </label>
          <Input id="title" name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="company" className="block mb-1 font-medium">
            Company Name
          </label>
          <Input id="company" name="company" value={form.company} onChange={handleChange} required />
        </div>

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
          <label htmlFor="stipend" className="block mb-1 font-medium">
            Stipend (₹)
          </label>
          <Input type="number" id="stipend" name="stipend" value={form.stipend} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="duration" className="block mb-1 font-medium">
            Duration
          </label>
          <Input type="number" id="duration" name="duration" value={form.duration} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <Textarea id="description" name="description" value={form.description} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="requirements" className="block mb-1 font-medium">
            Requirements (comma separated)
          </label>
          <Input
            id="requirements"
            name="requirements"
            value={form.requirements.join(", ")}
            onChange={(e) => handleArrayChange(e, "requirements")}
          />
        </div>

        <div>
          <label htmlFor="skills" className="block mb-1 font-medium">
            Skills (comma separated)
          </label>
          <Input
            id="skills"
            name="skills"
            value={form.skills.join(", ")}
            onChange={(e) => handleArrayChange(e, "skills")}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remote_option"
            checked={form.remote_option}
            onCheckedChange={(checked) => setForm((prev) => ({ ...prev, remote_option: checked }))}
          />
          <label htmlFor="remote_option" className="font-medium">
            Remote Option Available
          </label>
        </div>

        <Button type="submit" variant="default" className="bg-blue-500 hover:bg-blue-600 w-full">
          Post Job
        </Button>
      </form>
    </div>
  );
}
