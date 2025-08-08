import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Building, Users, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export default function JobCard({ job, isInternship = false }) {
  // Check if user is a recruiter
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isRecruiter = user.role === "recruiter";
  const isMyJob = isRecruiter && job.posted_by === user.email;

  const getApprovalStatusBadge = (status) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return <Badge className={`text-xs ${variants[status]}`}>{status}</Badge>;
  };

  const formatSalary = (min, max, type = "Per Annum") => {
    if (min && max) {
      const range = `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
      return type === "Per Annum" ? range : `${range} ${type}`;
    }
    if (min) {
      const minSalary = `₹${min.toLocaleString()}+`;
      return type === "Per Annum" ? minSalary : `${minSalary} ${type}`;
    }
    if (max) {
      const maxSalary = `Up to ₹${max.toLocaleString()}`;
      return type === "Per Annum" ? maxSalary : `${maxSalary} ${type}`;
    }
    return "Not specified";
  };

  // Helper to format stipend - show original value
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

  // Display stipend if present, otherwise salary
  const displayCompensation = () => {
    if (isInternship && job.stipend) {
      return <span className="flex items-center text-green-600 font-semibold text-xs sm:text-sm">{formatStipend(job.stipend)}</span>;
    }
    return (
      <span className="flex items-center text-green-600 font-semibold text-xs sm:text-sm">
        {formatSalary(job.salary_min, job.salary_max, job.salary_type)}
      </span>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 sm:gap-3 lg:gap-4">
          <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4 flex-1">
            {job.company_logo && (
              <img src={job.company_logo} alt={job.company} className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 leading-tight">{job.title}</CardTitle>
              <div className="flex items-center space-x-2 text-gray-600 mb-1 sm:mb-2">
                <Building className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm lg:text-base truncate">{job.company}</span>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2 lg:gap-4 text-gray-600 text-xs sm:text-sm">
                <span className="flex items-center min-w-0">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="hidden sm:inline">{job.job_type}</span>
                  <span className="sm:hidden">{job.job_type === "Full-time" ? "FT" : job.job_type === "Part-time" ? "PT" : job.job_type}</span>
                </span>
                {displayCompensation()}
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1 sm:gap-2">
            <div className="flex items-center text-green-600 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">
              {isInternship && job.stipend ? (
                <span className="text-right">{formatStipend(job.stipend)}</span>
              ) : (
                <span className="text-right">{formatSalary(job.salary_min, job.salary_max, job.salary_type)}</span>
              )}
            </div>
            <div className="flex items-center text-gray-500 text-xs">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Posted recently</span>
              <span className="sm:hidden">Recent</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3 lg:mb-4">
          <Badge className={`text-xs ${getExperienceBadgeColor(job.experience_level)}`}>
            <span className="hidden sm:inline">{job.experience_level}</span>
            <span className="sm:hidden">
              {job.experience_level === "Entry Level" ? "Entry" : 
               job.experience_level === "Mid Level" ? "Mid" : 
               job.experience_level === "Senior Level" ? "Senior" : 
               job.experience_level === "Executive" ? "Exec" : job.experience_level}
            </span>
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <span className="hidden sm:inline">{job.job_type}</span>
            <span className="sm:hidden">{job.job_type === "Full-time" ? "FT" : job.job_type === "Part-time" ? "PT" : job.job_type}</span>
          </Badge>
          {isMyJob && (
            <div className="flex items-center gap-1">
              {(job.approval_status === "pending" || job.status === "pending") && <AlertCircle className="w-3 h-3" />}
              {(job.approval_status === "approved" || job.status === "approved") && <CheckCircle className="w-3 h-3" />}
              {(job.approval_status === "rejected" || job.status === "rejected") && <XCircle className="w-3 h-3" />}
              {getApprovalStatusBadge(job.approval_status || job.status)}
            </div>
          )}
          {job.skills &&
            job.skills.slice(0, 2).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs text-blue-600 border-blue-600">
                <span className="hidden sm:inline">{skill}</span>
                <span className="sm:hidden">{skill.length > 8 ? skill.substring(0, 8) + "..." : skill}</span>
              </Badge>
            ))}
          {job.skills && job.skills.length > 2 && (
            <Badge variant="outline" className="text-xs text-gray-500">
              <span className="hidden sm:inline">+{job.skills.length - 2} more</span>
              <span className="sm:hidden">+{job.skills.length - 2}</span>
            </Badge>
          )}
        </div>

        {job.description && (
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 line-clamp-2 leading-relaxed">
            {job.description.length > 120 ? job.description.substring(0, 120) + "..." : job.description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 text-xs sm:text-sm text-gray-500">
            {job.benefits && job.benefits.length > 0 && (
              <span className="flex items-center">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">{job.benefits.length} benefits</span>
                <span className="sm:hidden">{job.benefits.length} perks</span>
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 w-full sm:w-auto">
            <Link to={`/p/job-details/${job._id}`} className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9">
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">Details</span>
              </Button>
            </Link>
            {(job.approval_status === "approved" || job.status === "approved") && (
              <Link to={`/p/job-details/${job._id}?apply=true`} className="w-full sm:w-auto">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9">
                  {isInternship ? (
                    <span className="hidden sm:inline">Apply for Job</span>
                  ) : (
                    <span className="hidden sm:inline">Apply Now</span>
                  )}
                  <span className="sm:hidden">Apply</span>
                </Button>
              </Link>
            )}
            {(job.approval_status === "pending" || job.status === "pending") && (
              <Button size="sm" variant="outline" disabled className="text-yellow-600 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9">
                <span className="hidden sm:inline">Pending Approval</span>
                <span className="sm:hidden">Pending</span>
              </Button>
            )}
            {(job.approval_status === "rejected" || job.status === "rejected") && (
              <Button size="sm" variant="outline" disabled className="text-red-600 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9">
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
