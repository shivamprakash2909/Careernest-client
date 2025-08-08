import React, { useState, useEffect } from "react";
// import { Job } from "../Entities/Job.json";
import { Link } from "react-router-dom";
import { createPageUrl } from "../components/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, GraduationCap, Filter, Calendar } from "lucide-react";
import JobCard from "../components/jobs/InternshipCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { axiosInstance } from "@/lib/axios";

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    loadInternships();
  }, []);

  useEffect(() => {
    filterInternships();
  }, [internships, searchTerm, locationFilter, durationFilter]);

  const loadInternships = async () => {
    try {
      const response = await axiosInstance.get("/api/jobs/internships", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;

      // Check if user is a recruiter
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const isRecruiter = user.role === "recruiter";

      if (isRecruiter) {
        // For recruiters, show all their internships (approved, pending, rejected)
        const recruiterInternships = (Array.isArray(data) ? data : []).filter(
          (internship) => internship.posted_by === user.email
        );
        setInternships(recruiterInternships);
      } else {
        // For students, only show approved internships
        setInternships((Array.isArray(data) ? data : []).filter((internship) => internship.status === "approved"));
      }
    } catch (error) {
      console.error("Error loading internships:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterInternships = () => {
    let filtered = internships;

    if (searchTerm) {
      filtered = filtered.filter(
        (internship) =>
          internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((internship) => internship.location === locationFilter);
    }

    if (durationFilter !== "all") {
      filtered = filtered.filter((internship) => {
        if (!internship.duration) return false;
        const duration = internship.duration.toLowerCase();
        switch (durationFilter) {
          case "1-3":
            return duration.includes("1") || duration.includes("2") || duration.includes("3");
          case "3-6":
            return duration.includes("3") || duration.includes("4") || duration.includes("5") || duration.includes("6");
          case "6+":
            return (
              duration.includes("6") ||
              duration.includes("7") ||
              duration.includes("8") ||
              duration.includes("9") ||
              duration.includes("10") ||
              duration.includes("11") ||
              duration.includes("12")
            );
          default:
            return true;
        }
      });
    }

    setFilteredInternships(filtered);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
              Start Your Career Journey
            </h1>
            <p className="text-lg sm:text-xl text-green-100 mb-6 sm:mb-8 px-2">
              Currently {internships.length}+ internship opportunities available
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-green-100 px-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Student Friendly</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Flexible Duration</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm sm:text-base">Paid Opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Recruiter Notice */}
        {user && user.role === "recruiter" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-start sm:items-center">
              <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-2 sm:ml-3">
                <h3 className="text-xs sm:text-sm font-medium text-green-800">Recruiter Dashboard</h3>
                <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-700">
                  <p>You can see all your posted internships here, including pending, approved, and rejected ones.</p>
                  <p className="mt-1">Only approved internships are visible to students.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="sm:col-span-2 lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                placeholder="Search internships or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                <SelectItem value="Noida">Noida</SelectItem>
              </SelectContent>
            </Select>

            <Select value={durationFilter} onValueChange={setDurationFilter}>
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="1-3">1-3 Months</SelectItem>
                <SelectItem value="3-6">3-6 Months</SelectItem>
                <SelectItem value="6+">6+ Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            <span className="text-sm sm:text-base text-gray-700">
              Showing {filteredInternships.length} internships
            </span>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-gray-500">Sort by:</span>
            <Select defaultValue="newest" className="flex-1 sm:flex-none">
              <SelectTrigger className="w-full sm:w-32 text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="stipend">Stipend</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Internship Listings */}
        <div className="grid gap-4 sm:gap-6">
          {filteredInternships.length > 0 ? (
            filteredInternships.map((internship) => {
              const mappedInternship = { ...internship, id: internship._id };
              return <JobCard key={internship._id} job={mappedInternship} isInternship={true} />;
            })
          ) : (
            <div className="text-center py-8 sm:py-12 px-4">
              <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No internships found</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">Try adjusting your filters or search terms</p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setLocationFilter("all");
                  setDurationFilter("all");
                }}
                className="mt-2 sm:mt-4 text-sm sm:text-base"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
