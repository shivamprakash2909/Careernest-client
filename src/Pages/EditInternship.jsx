import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/common/ToastContext";
import { axiosInstance } from "@/lib/axios";

const locations = ["Noida", "Delhi", "Pune", "Mumbai", "Bangalore", "Hyderabad"];
const durations = ["1 month", "2 months", "3 months", "6 months", "1 year"];

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
        {/* Responsive grid for location and stipend fields */}
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
            <label htmlFor="stipend" className="block mb-1 font-medium">
              Stipend
            </label>
            <Input
              id="stipend"
              name="stipend"
              value={form.stipend}
              onChange={handleChange}
              className="w-full"
              placeholder="e.g., ₹10,000/month"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div>
            <label htmlFor="company" className="block mb-1 font-medium">
              Company
            </label>
            <Input
              id="company"
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full"
              required
            />
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
              value={Array.isArray(form.requirements) ? form.requirements.join(", ") : form.requirements}
              onChange={(e) => handleArrayChange(e, "requirements")}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="skills" className="block mb-1 font-medium">
              Skills 
            </label>
            <Input
              id="skills"
              name="skills"
              value={Array.isArray(form.skills) ? form.skills.join(", ") : form.skills}
              onChange={(e) => handleArrayChange(e, "skills")}
              className="w-full"
            />
          </div>
        </div>
        <div>
          <label htmlFor="benefits" className="block mb-1 font-medium">
            Benefits
          </label>
          <Input
            id="benefits"
            name="benefits"
            value={Array.isArray(form.benefits) ? form.benefits.join(", ") : form.benefits}
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
          Update Internship
        </Button>
      </form>
    </div>
  );
}
