import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import {
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Phone,
  Building,
  Users,
  Briefcase,
  Globe as GlobeIcon,
} from "lucide-react";
import { axiosInstance } from "@/lib/axios";

export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setError("Not authenticated");
      return;
    }
    axiosInstance
      .get("/api/user/profile", {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .then((res) => res.data)
      .then((data) => {
        if (data.user) {
          setProfile(data.user);
          setUserRole(data.user.role);
        } else {
          setError("Failed to load profile");
        }
      })
      .catch(() => setError("Failed to load profile"));
  }, []);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }
  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section with Profile Picture */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 shadow-2xl bg-gradient-to-br from-blue-400 to-blue-600">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-2xl">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.name}</h1>
          <div className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg mb-4">
            {userRole === "recruiter" ? "Recruiter" : "Student"}
          </div>

          {/* Contact Information */}
          <div className="flex flex-wrap justify-center gap-6 text-gray-600">
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{profile.email}</span>
              </div>
            )}
            {profile.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  {profile.address.city}, {profile.address.state}
                </span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{profile.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - About, Education, Experience */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About me</h2>
              <p className="text-gray-600 leading-relaxed">{profile.about}</p>
            </div>

            {/* Education Section */}
            {/* <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-gray-900 font-semibold">{profile.collegeName}</h3>
                    <p className="text-gray-600 text-sm">
                      {profile.programme && profile.branch
                        ? `${profile.programme}, ${profile.branch}`
                        : "Degree Program"}
                      {profile.year && `, ${profile.year}`}
                    </p>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Experience Section */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Experience</h2>
              <div className="space-y-4">
                {userRole === "recruiter" ? (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-gray-900 font-semibold">{profile.job_title || "Job Title"}</h3>
                      <p className="text-gray-600 text-sm mb-2">{profile.company_name || "Company Name"}</p>
                      <p className="text-gray-600 text-sm">
                        {profile.company_description ||
                          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-gray-900 font-semibold">Student</h3>
                      <p className="text-gray-600 text-sm mb-2">{profile.collegeName || "University"}</p>
                      <p className="text-gray-600 text-sm">
                        Currently pursuing {profile.programme || "degree"} in {profile.branch || "field of study"}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Information Section */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {userRole === "recruiter" ? "Company Details" : "College Details"}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {userRole === "recruiter" ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Company Name</p>
                        <p className="text-gray-900 font-medium">{profile.company_name || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Company Size</p>
                        <p className="text-gray-900 font-medium">{profile.company_size || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Industry</p>
                        <p className="text-gray-900 font-medium">{profile.industry || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Job Title</p>
                        <p className="text-gray-900 font-medium">{profile.job_title || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <GlobeIcon className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Website</p>
                        <p className="text-gray-900 font-medium">{profile.company_website || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Location</p>
                        <p className="text-gray-900 font-medium">{profile.location || "Not specified"}</p>
                      </div>
                    </div>
                    {profile.company_description && (
                      <div className="md:col-span-2">
                        <p className="text-gray-500 text-sm mb-2">Description</p>
                        <p className="text-gray-600 text-sm">{profile.company_description}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-gray-500 text-sm">College Name</p>
                        <p className="text-gray-900 font-medium">{profile.collegeName || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Programme</p>
                        <p className="text-gray-900 font-medium">{profile.programme || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Branch</p>
                        <p className="text-gray-900 font-medium">{profile.branch || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Passing Year</p>
                        <p className="text-gray-900 font-medium">{profile.year || "Not specified"}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Address Section */}
            {profile.address && (
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Address</h2>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="text-gray-900">{profile.address.street}</p>
                    <p className="text-gray-600">
                      {profile.address.city}, {profile.address.state} {profile.address.zip}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Social Links */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Social Links</h2>
              <div className="flex flex-wrap gap-4">
                {profile.github && (
                  <button
                    type="button"
                    onClick={() => window.open(profile.github, "_blank", "noopener,noreferrer")}
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5 text-gray-700" />
                  </button>
                )}
                {profile.linkedin && (
                  <button
                    type="button"
                    onClick={() => window.open(profile.linkedin, "_blank", "noopener,noreferrer")}
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-gray-700" />
                  </button>
                )}
                {profile.facebook && (
                  <button
                    type="button"
                    onClick={() => window.open(profile.facebook, "_blank", "noopener,noreferrer")}
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-gray-700" />
                  </button>
                )}
                {profile.instagram && (
                  <button
                    type="button"
                    onClick={() => window.open(profile.instagram, "_blank", "noopener,noreferrer")}
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-gray-700" />
                  </button>
                )}
                {profile.twitter && (
                  <button
                    type="button"
                    onClick={() => window.open(profile.twitter, "_blank", "noopener,noreferrer")}
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5 text-gray-700" />
                  </button>
                )}
                {profile.portfolio && (
                  <button
                    type="button"
                    onClick={() => window.open(profile.portfolio, "_blank", "noopener,noreferrer")}
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                    aria-label="Portfolio"
                  >
                    <Globe className="w-5 h-5 text-gray-700" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => navigate(userRole === "student" ? "/p/editprofile" : "/p/updateprofile")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
