import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "@/components/common/ToastContext";

export default function ResumeBuilder() {
  const { showSuccess } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    about: "",
    collegeName: "",
    passingYear: "",
    branch: "",
    programme: "",
    skills: "",
    projects: [{ title: "", link: "" }],
    certifications: [{ title: "", link: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (type, index, field, value) => {
    const updated = [...form[type]];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, [type]: updated }));
  };

  const addField = (type) => {
    setForm((prev) => ({
      ...prev,
      [type]: [...prev[type], { title: "", link: "" }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Resume Data:", form);
    showSuccess("Resume data submitted to console.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8 font-sans">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">🎓 Resume Builder</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
            <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
            <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
            <Input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
          </div>

          {/* Dropdowns */}

          <div>
            <label className="block font-semibold mb-1 text-blue-700">College</label>
            <Input name="college" value={form.collegeName} onChange={handleChange} placeholder="College Name" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select name="programme" value={form.passingYear} onChange={handleChange} className="input">
              <SelectTrigger>
                <SelectValue placeholder="Passout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Passout Year</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
              </SelectContent>
            </Select>

            <Select name="branch" value={form.branch} onChange={handleChange} className="input">
              <SelectTrigger>
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select">Select Branch</SelectItem>
                <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                <SelectItem value="IT">Information Technology</SelectItem>
                <SelectItem value="ECE">Electronics & Communication</SelectItem>
                <SelectItem value="ME">Mechanical Engineering</SelectItem>
                <SelectItem value="EE">Electrical Engineering</SelectItem>
                <SelectItem value="CE">Civil Engineering</SelectItem>
                <SelectItem value="ICE">Instumentation and Control Engineering</SelectItem>
              </SelectContent>
            </Select>

            <Select name="passingYear" value={form.programme} onChange={handleChange} className="input">
              <SelectTrigger>
                <SelectValue placeholder="Programme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select">Select Programme</SelectItem>
                <SelectItem value="B.Tech">B.Tech</SelectItem>
                <SelectItem value="M.Tech">M.Tech</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* About Me */}
          <div>
            <label className="block font-semibold mb-1 text-blue-700">
              About Me <span className="text-gray-500">(max 200 words)</span>
            </label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              maxLength={1200}
              rows={4}
              className="border-1 rounded-lg w-full"
              placeholder="Describe yourself..."
            />
          </div>

          {/* Education */}

          {/* Skills */}
          <div>
            <label className="block font-semibold mb-1 text-blue-700">Skills</label>
            <Input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full"
              placeholder="Comma separated: HTML, CSS, React..."
            />
          </div>

          {/* Projects */}
          <div>
            <label className="block font-semibold mb-1 text-blue-700">Projects</label>
            {form.projects.map((proj, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
                <Input
                  value={proj.title}
                  onChange={(e) => handleNestedChange("projects", idx, "title", e.target.value)}
                  placeholder="Project Title"
                />
                <Input
                  value={proj.link}
                  onChange={(e) => handleNestedChange("projects", idx, "link", e.target.value)}
                  placeholder="Project Link"
                />
              </div>
            ))}
            <Button type="button" onClick={() => addField("projects")} className="text-white text-sm">
              + Add another project
            </Button>
          </div>

          {/* Certifications */}
          <div>
            <label className="block font-semibold mb-1 text-blue-700">Certifications</label>
            {form.certifications.map((cert, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
                <Input
                  value={cert.title}
                  onChange={(e) => handleNestedChange("certifications", idx, "title", e.target.value)}
                  placeholder="Certificate Title"
                />
                <Input
                  value={cert.link}
                  onChange={(e) => handleNestedChange("certifications", idx, "link", e.target.value)}
                  placeholder="Certificate Link"
                />
              </div>
            ))}
            <Button type="button" onClick={() => addField("certifications")} className="text-white text-sm">
              + Add another certification
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            Generate Resume
          </Button>
        </form>
      </div>
    </div>
  );
}
