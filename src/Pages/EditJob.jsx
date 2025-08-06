import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/common/ToastContext";
import { axiosInstance } from "@/lib/axios";

const locations = ["Noida", "Delhi", "Pune", "Mumbai", "Bangalore", "Hyderabad"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"];

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
          {/* Stipend field for jobs with stipend */}
          <div>
            <label htmlFor="stipend" className="block mb-1 font-medium">
              Salary (₹)
            </label>
            <Input
              id="stipend"
              name="stipend"
              type="number"
              min="0"
              value={form.stipend || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 10000"
              required
            />
          </div>
        </div>
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
        {/* Responsive grid for array fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="requirements" className="block mb-1 font-medium">
              Requirements
            </label>
            <Input
              id="requirements"
              name="requirements"
              value={form.requirements.join(", ")}
              onChange={(e) => handleArrayChange(e, "requirements")}
              className="w-full"
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
              className="w-full"
            />
          </div>
        </div>
        <div>
          <label htmlFor="benefits" className="block mb-1 font-medium">
            Benefits (comma separated)
          </label>
          <Input
            id="benefits"
            name="benefits"
            value={form.benefits.join(", ")}
            onChange={(e) => handleArrayChange(e, "benefits")}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="remote_option"
            name="remote_option"
            type="checkbox"
            checked={form.remote_option}
            onChange={(e) => setForm((prev) => ({ ...prev, remote_option: e.target.checked }))}
            className="h-4 w-4"
          />
          <label htmlFor="remote_option" className="font-medium">
            Remote Option Available
          </label>
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          Update Job
        </Button>
      </form>
    </div>
  );
}
