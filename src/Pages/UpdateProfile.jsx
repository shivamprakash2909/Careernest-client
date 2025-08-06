import React, { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";

export default function UpdateProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    programme: "",
    branch: "",
    year: "",
    collegeName: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    github: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    twitter: "",
    portfolio: "",
    about: "",
    image: null,
    // Recruiter fields
    company_name: "",
    company_size: "",
    industry: "",
    job_title: "",
    company_website: "",
    company_description: "",
    location: "",
  });
  const [userRole, setUserRole] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from backend
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;
    axiosInstance
      .get(`/api/user/profile`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .then((res) => res.data)
      .then((data) => {
        if (data.user) {
          setProfile({ ...profile, ...data.user });
          setUserRole(data.user.role);
          if (data.user.image) setPreviewUrl(data.user.image);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleSelectChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB
        setError("Image size should not exceed 2MB.");
        return;
      }
      if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
        setError("Only JPG/JPEG images are allowed.");
        return;
      }
    }
    setProfile((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  function sanitizeProfileData(data) {
    const clean = {};
    for (const key in data) {
      if (data[key] === null || data[key] === undefined) continue;
      if (typeof data[key] === "object" && !Array.isArray(data[key]) && data[key] !== null) {
        // Only keep address if it has at least one string value
        const nested = {};
        for (const k in data[key]) {
          if (typeof data[key][k] === "string" && data[key][k].trim() !== "") {
            nested[k] = data[key][k];
          }
        }
        if (Object.keys(nested).length > 0) clean[key] = nested;
      } else if (typeof data[key] === "string" && data[key].trim() !== "") {
        clean[key] = data[key];
      }
    }
    return clean;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setError("Not authenticated");
      return;
    }
    let updateData = sanitizeProfileData(profile);
    // If image is a file, convert to base64
    if (profile.image && typeof profile.image !== "string") {
      const reader = new FileReader();
      reader.onloadend = async () => {
        updateData.image = reader.result;
        await sendUpdate(updateData, jwt);
      };
      reader.readAsDataURL(profile.image);
      return;
    }
    await sendUpdate(updateData, jwt);
  };

  async function sendUpdate(updateData, jwt) {
    try {
      const res = await axiosInstance.patch(`/api/user/profile`, updateData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!(res.status === 200 || res.status === 201)) {
        const err = res.data;
        setError(err.error || "Profile update failed");
        return;
      }
      setSuccess("Profile updated successfully!");
      const userRole = profile.role || localStorage.getItem("userRole");
      const redirectPath = userRole === "recruiter" ? "/p/recruiterprofileview" : "/p/profileview";
      setTimeout(() => navigate(redirectPath), 1200);
    } catch (err) {
      setError("Profile update failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 font-sans">
        {/* Upload Image */}
        <div className="flex flex-col items-center gap-3">
          {/* Image Preview Container */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 shadow-2xl bg-gradient-to-br from-blue-400 to-blue-600">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-2xl">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
          </div>
          {/* Hidden File Input */}
          <input
            type="file"
            id="profilePicInput"
            accept="image/jpeg,image/jpg"
            onChange={handleImageChange}
            className="hidden"
          />
          {/* Optional: Hint Text */}
          {/* <p className="text-sm text-gray-500">Tap the photo to upload or update</p> */}
        </div>
        <h1 className="text-3xl font-bold text-center text-blue-800 mt-6 mb-6">📝 Update Profile</h1>
        {success && <div className="text-green-600 text-center mb-4">{success}</div>}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Demographic Info */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Demographic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" value={profile.name} onChange={handleChange} placeholder="Full Name" />
              <Input name="email" value={profile.email} onChange={handleChange} placeholder="Email" disabled />
              <Input name="phone" value={profile.phone} onChange={handleChange} placeholder="Phone Number" />
            </div>
          </div>
          {/* Address Info */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Full Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="street"
                value={profile.address?.street || ""}
                onChange={handleAddressChange}
                placeholder="Street"
              />
              <Input
                name="city"
                value={profile.address?.city || ""}
                onChange={handleAddressChange}
                placeholder="City"
              />
              <Input
                name="state"
                value={profile.address?.state || ""}
                onChange={handleAddressChange}
                placeholder="State"
              />
              <Input
                name="PIN"
                value={profile.address?.zip || ""}
                onChange={handleAddressChange}
                placeholder="PIN/ZIP Code"
              />
            </div>
          </div>
          {/* Student or Recruiter Info */}
          {userRole === "recruiter" ? (
            <>
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-2">Company Details</h2>
                <Input
                  name="company_name"
                  value={profile.company_name}
                  onChange={handleChange}
                  required
                  placeholder="Company Name"
                />
                <Input
                  name="company_size"
                  value={profile.company_size}
                  onChange={handleChange}
                  required
                  placeholder="Company Size"
                />
                <Input
                  name="industry"
                  value={profile.industry}
                  onChange={handleChange}
                  placeholder="Industry"
                  required
                />
                <Input
                  name="job_title"
                  value={profile.job_title}
                  onChange={handleChange}
                  placeholder="Job Title"
                  required
                />
                <Input
                  name="company_website"
                  value={profile.company_website}
                  onChange={handleChange}
                  required
                  placeholder="Company Website"
                />
                <Input
                  name="company_description"
                  value={profile.company_description}
                  onChange={handleChange}
                  required
                  placeholder="Company Description"
                />
                <Input
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  required
                  placeholder="Location"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Select value={profile.gender} onValueChange={(val) => handleSelectChange("gender", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <h2 className="text-xl font-semibold text-blue-600 mb-2">College Details</h2>
                <Input
                  name="collegeName"
                  required
                  value={profile.collegeName}
                  onChange={handleChange}
                  placeholder="College Name"
                  className="mb-3"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={profile.programme} onValueChange={(val) => handleSelectChange("programme", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Programme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B.Tech">B.Tech</SelectItem>
                      <SelectItem value="M.Tech">M.Tech</SelectItem>
                      <SelectItem value="MBA">MBA</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={profile.branch} onValueChange={(val) => handleSelectChange("branch", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSE">CSE</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="ECE">ECE</SelectItem>
                      <SelectItem value="ME">ME</SelectItem>
                      <SelectItem value="EE">EE</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={profile.year} onValueChange={(val) => handleSelectChange("year", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Passing Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(6)].map((_, i) => {
                        const year = 2025 + i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
          {/* Social Media */}
          {userRole === "student" ? (
            <>
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-2">Social Media Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input name="github" value={profile.github} onChange={handleChange} placeholder="GitHub Profile" />
                  <Input
                    name="linkedin"
                    value={profile.linkedin}
                    required
                    onChange={handleChange}
                    placeholder="LinkedIn Profile"
                  />
                  <Input
                    name="instagram"
                    value={profile.instagram}
                    onChange={handleChange}
                    placeholder="Instagram Profile"
                  />
                  <Input
                    name="portfolio"
                    value={profile.portfolio}
                    onChange={handleChange}
                    placeholder="Portfolio Website"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-2">Social Media Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleChange}
                    required
                    placeholder="LinkedIn Profile"
                  />
                  <Input
                    name="instagram"
                    value={profile.instagram}
                    onChange={handleChange}
                    placeholder="Instagram Profile"
                  />
                </div>
              </div>
            </>
          )}
          {/* About Me */}
          {userRole === "student" ? (
            <>
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-2">About Me</h2>
                <textarea
                  name="about"
                  required
                  value={profile.about}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write about yourself (max 200 characters)"
                  maxLength={200}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-2">About Company</h2>
                <textarea
                  name="about"
                  required
                  value={profile.about}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write about yourself (max 500 characters)"
                  minLength={50}
                  maxLength={500}
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Save Profile
          </Button>
        </form>
      </div>
    </div>
  );
}
