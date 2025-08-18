import { useEffect, useState } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import InternshipCard from "../components/jobs/InternshipCard";
import Chatbot from "../components/Chatbot";
import { axiosInstance } from "@/lib/axios";

export default function StudentDashboard() {
  const [internships, setInternships] = useState([]);
  const [originalInternships, setOriginalInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentName, setStudentName] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  useEffect(() => {
    // Get student name from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const fullName = user.full_name || user.name || "Student";
        setStudentName(fullName);
        setFirstName(fullName.split(" ")[0]);
        // console.log("studentName:", fullName);
        // console.log("firstname:", fullName.split(" ")[0]);
      } catch (e) {
        setStudentName("Student");
        setFirstName("Student");
      }
    }
    loadInternships();
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;
    axiosInstance
      .get(`/api/user/profile`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .then((res) => res.data)
      .then((data) => {
        if (data.user) setProfile(data.user);
        else setError("Failed to load profile");
      })
      .catch(() => setError("Failed to load profile"));
  }, []);

  const loadInternships = async () => {
    try {
      const response = await axiosInstance.get("/api/jobs/internships", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;

      // Preserve original response from backend
      setOriginalInternships(Array.isArray(data) ? data : []);

      // Check if user is a recruiter
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const isRecruiter = user.role === "recruiter";

      let internshipsList = [];
      if (isRecruiter) {
        internshipsList = (Array.isArray(data) ? data : []).filter((internship) => internship.posted_by === user.email);
      } else {
        internshipsList = (Array.isArray(data) ? data : []).filter((internship) => internship.status === "approved");
      }

      // Sort by createdAt descending (newest first)
      internshipsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setInternships(internshipsList);
    } catch (error) {
      console.error("Error loading internships:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="min-h-screen bg-white font-sans">
        {/* Main Section */}
        <div className="flex flex-col">
          <main className="p-6">
            <div className="bg-blue-100 border-l-4 border-blue-400 shadow p-6 rounded-xl mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {firstName} ! 👋</h2>
              <p className="text-gray-600 text-sm">
                Explore the latest internships and build your career with confidence
              </p>
            </div>

            {/* Featured Opportunities */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">Featured Opportunities</h3>
              <div className="space-y-4 max-w-4xl w-full mx-auto px-2">
                {internships.slice(0, 6).map((internship) => (
                  <InternshipCard key={internship._id || internship.id} job={internship} isInternship />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* Chatbot */}
      <Chatbot />
    </>
  );
}
