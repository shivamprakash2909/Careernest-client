import { useEffect, useState } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import JobCard from "../components/jobs/JobCard";
import Chatbot from "../components/Chatbot";
import { axiosInstance } from "@/lib/axios";
import axios from "axios";

export default function StudentDashboard() {
  const [internships, setInternships] = useState([]);
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
        console.log("studentName:", fullName);
        console.log("firstname:", fullName.split(" ")[0]);
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
      const response = await axios.get("https://app.base44.com/api/apps/687508e8c02e10285e949016/entities/Job", {
        headers: {
          api_key: "fc6a61ef692346c9b3d1d0749378bd8e",
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      const internshipJobs = data.filter((job) => job.job_type === "Internship");
      setInternships(internshipJobs);
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
                  <JobCard key={internship.id} job={internship} />
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
