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
    return <Badge className={variants[status]}>{status}</Badge>;
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
      return <span className="flex items-center text-green-600 font-semibold">{formatStipend(job.stipend)}</span>;
    }
    return (
      <span className="flex items-center text-green-600 font-semibold">
        {formatSalary(job.salary_min, job.salary_max, job.salary_type)}
      </span>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {job.company_logo && (
              <img src={job.company_logo} alt={job.company} className="w-12 h-12 rounded-lg object-cover" />
            )}
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-1">{job.title}</CardTitle>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <Building className="w-4 h-4" />
                <span className="font-medium">{job.company}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {job.job_type}
                </span>
                {displayCompensation()}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-600 font-semibold mb-2">
              {isInternship && job.stipend ? (
                <span>{formatStipend(job.stipend)}</span>
              ) : (
                <span>{formatSalary(job.salary_min, job.salary_max, job.salary_type)}</span>
              )}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>Posted recently</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getExperienceBadgeColor(job.experience_level)}>{job.experience_level}</Badge>
          <Badge variant="secondary">{job.job_type}</Badge>
          {isMyJob && (
            <div className="flex items-center gap-1">
              {(job.approval_status === "pending" || job.status === "pending") && <AlertCircle className="w-3 h-3" />}
              {(job.approval_status === "approved" || job.status === "approved") && <CheckCircle className="w-3 h-3" />}
              {(job.approval_status === "rejected" || job.status === "rejected") && <XCircle className="w-3 h-3" />}
              {getApprovalStatusBadge(job.approval_status || job.status)}
            </div>
          )}
          {job.skills &&
            job.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-blue-600 border-blue-600">
                {skill}
              </Badge>
            ))}
          {job.skills && job.skills.length > 3 && (
            <Badge variant="outline" className="text-gray-500">
              +{job.skills.length - 3} more
            </Badge>
          )}
        </div>

        {job.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description.substring(0, 150)}...</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {job.benefits && job.benefits.length > 0 && (
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {job.benefits.length} benefits
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Link to={`/p/job-details/${job._id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            {(job.approval_status === "approved" || job.status === "approved") && (
              <Link to={`/p/job-details/${job._id}?apply=true`}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  {isInternship ? "Apply for Job" : "Apply Now"}
                </Button>
              </Link>
            )}
            {(job.approval_status === "pending" || job.status === "pending") && (
              <Button size="sm" variant="outline" disabled className="text-yellow-600">
                Pending Approval
              </Button>
            )}
            {(job.approval_status === "rejected" || job.status === "rejected") && (
              <Button size="sm" variant="outline" disabled className="text-red-600">
                Rejected
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
