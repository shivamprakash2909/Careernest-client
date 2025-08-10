import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Building,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  GraduationCap,
  BookOpen,
  IndianRupee,
  Calendar,
  User,
} from "lucide-react";

export default function JobCard({ job, isInternship = false }) {
  // Check if user is a recruiter
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isRecruiter = user.role === "recruiter";
  const isMyJob = isRecruiter && job.posted_by === user.email;

  // Debug logging
  console.log("InternshipCard received job data:", job);
  console.log("Skills data:", job.skills);

  // Helper to get skills text (handle both string and array formats)
  const getSkillsText = () => {
    if (!job.skills) return "";
    if (typeof job.skills === "string") return job.skills;
    if (Array.isArray(job.skills)) return job.skills.join(", ");
    return "";
  };

  const getApprovalStatusBadge = (status) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return <Badge className={`text-xs ${variants[status]}`}>{status}</Badge>;
  };

  // Helper to format stipend with new structure
  const formatStipend = (stipend) => {
    if (!stipend) return "Not specified";

    // Handle different stipend formats
    const stipendStr = stipend.toString().trim();

    // If it's already in a readable format with ₹ symbol, return as is
    if (stipendStr.includes("₹")) {
      return stipendStr;
    }

    // Extract numeric part from stipend string (handle formats like "10,000/month")
    const match = stipendStr.replace(/,/g, "").match(/(\d+)/);
    if (match) {
      const value = parseInt(match[1], 10);
      if (!isNaN(value)) {
        // Check if the original string has "/month" or similar
        if (stipendStr.includes("/month") || stipendStr.includes("/mo")) {
          return `₹${value.toLocaleString()}/month`;
        }
        return `₹${value.toLocaleString()}`;
      }
    }

    // If it's a simple number, format it
    const numValue = parseFloat(stipendStr);
    if (!isNaN(numValue)) {
      return `₹${numValue.toLocaleString()}`;
    }

    return stipendStr; // fallback to original if not a number
  };

  const getExperienceBadgeColor = (level) => {
    switch (level) {
      case "Entry Level":
        return "bg-green-100 text-green-800";
      case "Mid Level":
        return "bg-blue-100 text-blue-800";
      case "Senior Level":
        return "bg-purple-100 text-purple-800";
      case "Executive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Display stipend for internships
  const displayCompensation = () => {
    const formatStipendRange = (min, max, type = "Fixed") => {
      if (min && max) {
        const range = `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
        return type === "Fixed" ? range : `${range} (${type})`;
      }
      if (min) {
        const minStipend = `₹${min.toLocaleString()}+`;
        return type === "Fixed" ? minStipend : `${minStipend} (${type})`;
      }
      if (max) {
        const maxStipend = `Up to ₹${max.toLocaleString()}`;
        return type === "Fixed" ? maxStipend : `${maxStipend} (${type})`;
      }
      return "Not specified";
    };

    return (
      <span className="flex items-center text-green-600 font-semibold text-xs sm:text-sm">
        {formatStipendRange(job.stipend_amount_min, job.stipend_amount_max, job.stipend_type)}
      </span>
    );
  };

  // Helper to truncate text for display
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 w-full max-w-full overflow-hidden">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-row items-start justify-between gap-2 sm:gap-3 lg:gap-4">
          <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4 flex-1 min-w-0">
            {job.company_logo && (
              <img
                src={job.company_logo}
                alt={job.company}
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 leading-tight break-words">
                {job.title}
              </CardTitle>
              <div className="flex items-center space-x-2 text-gray-600 mb-1 sm:mb-2">
                <Building className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm lg:text-base truncate break-words max-w-full">
                  {job.company}
                </span>
              </div>

              {/* Location and Duration */}
              <div className="flex flex-wrap gap-1 sm:gap-2 lg:gap-4 text-gray-600 text-xs sm:text-sm">
                <span className="flex items-center min-w-0">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </span>
                <span className="flex items-center min-w-0">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{job.duration || job.job_type}</span>
                </span>
                {job.start_date && (
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                    <span className="hidden sm:inline">Starts: {new Date(job.start_date).toLocaleDateString()}</span>
                    <span className="sm:hidden">
                      Start: {new Date(job.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Status and Actions */}
          <div className="text-right flex flex-col items-end gap-1 sm:gap-2 w-auto min-w-0 flex-shrink-0">
            <div className="flex items-center text-green-600 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base truncate min-w-0 w-auto max-w-full">
              {displayCompensation()}
            </div>
            {/* Status Badge */}
            {isMyJob && (
              <div className="flex items-center gap-1">
                {(job.approval_status === "pending" || job.status === "pending") && <AlertCircle className="w-3 h-3" />}
                {(job.approval_status === "approved" || job.status === "approved") && (
                  <CheckCircle className="w-3 h-3" />
                )}
                {(job.approval_status === "rejected" || job.status === "rejected") && <XCircle className="w-3 h-3" />}
                {getApprovalStatusBadge(job.approval_status || job.status)}
              </div>
            )}

            {/* Posted Info */}
            <div className="flex items-center text-gray-500 text-xs">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Posted recently</span>
              <span className="sm:hidden">Recent</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Badges Section */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {job.experience_level && (
            <Badge className={`text-xs ${getExperienceBadgeColor(job.experience_level)}`}>{job.experience_level}</Badge>
          )}
          {job.education_level && job.education_level !== "Any" && (
            <Badge variant="outline" className="text-xs text-purple-600 border-purple-600">
              <GraduationCap className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">{job.education_level}</span>
              <span className="sm:hidden">Edu</span>
            </Badge>
          )}
          {job.remote_option && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
              <span className="hidden sm:inline">Remote Available</span>
              <span className="sm:hidden">Remote</span>
            </Badge>
          )}
          {job.work_from_home && (
            <Badge variant="outline" className="text-xs text-blue-600 border-blue-600">
              <span className="hidden sm:inline">Work from Office</span>
              <span className="sm:hidden">Office</span>
            </Badge>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 break-words">
            {truncateText(job.description, 150)}
          </p>
        )}

        {/* Key Information Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm">
          {job.responsibilities && (
            <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-1 flex items-center">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Key Responsibilities</span>
                <span className="sm:hidden">Responsibilities</span>
              </h4>
              <p className="text-gray-600 line-clamp-2 break-words">{truncateText(job.responsibilities, 80)}</p>
            </div>
          )}

          {job.requirements && (
            <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-1 flex items-center">
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Requirements</span>
                <span className="sm:hidden">Reqs</span>
              </h4>
              <p className="text-gray-600 line-clamp-2 break-words">{truncateText(job.requirements, 80)}</p>
            </div>
          )}

          {getSkillsText().trim() !== "" && (
            <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-1 flex items-center">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Skills Required</span>
                <span className="sm:hidden">Skills</span>
              </h4>
              <p className="text-gray-600 line-clamp-2 break-words">{truncateText(getSkillsText(), 80)}</p>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500">
            {job.perks && (
              <span className="flex items-center">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Perks Available</span>
                <span className="sm:hidden">Perks</span>
              </span>
            )}
            {job.number_of_openings && job.number_of_openings > 1 && (
              <span className="flex items-center">
                <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">{job.number_of_openings} openings</span>
                <span className="sm:hidden">{job.number_of_openings} open</span>
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link to={`/p/internship-details/${job._id}`} className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9">
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">Details</span>
              </Button>
            </Link>
            {(job.approval_status === "approved" || job.status === "approved") && (
              <Link to={`/p/internship-details/${job._id}?apply=true`} className="w-full sm:w-auto">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                >
                  <span className="hidden sm:inline">{isInternship ? "Apply for Internship" : "Apply Now"}</span>
                  <span className="sm:hidden">Apply</span>
                </Button>
              </Link>
            )}
            {(job.approval_status === "pending" || job.status === "pending") && (
              <Button
                size="sm"
                variant="outline"
                disabled
                className="text-yellow-600 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
              >
                <span className="hidden sm:inline">Pending Approval</span>
                <span className="sm:hidden">Pending</span>
              </Button>
            )}
            {(job.approval_status === "rejected" || job.status === "rejected") && (
              <Button
                size="sm"
                variant="outline"
                disabled
                className="text-red-600 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
              >
                <span className="hidden sm:inline">Rejected</span>
                <span className="sm:hidden">Rejected</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
