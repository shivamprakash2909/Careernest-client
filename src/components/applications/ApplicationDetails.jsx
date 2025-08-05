import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, ExternalLink, FileText } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  reviewing: "bg-blue-100 text-blue-800 border-blue-200",
  shortlisted: "bg-purple-100 text-purple-800 border-purple-200",
  interviewed: "bg-indigo-100 text-indigo-800 border-indigo-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

export default function ApplicationDetails({ application, onStatusUpdate }) {
  // Assuming 'application' will always be provided when this component is rendered in a modal context.
  // The 'if (!application)' check and the placeholder UI are removed as per the outline.

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
          <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold text-sm sm:text-lg">
            {getInitials(application.student_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold truncate">{application.student_name}</h3>
          <p className="text-sm sm:text-base text-gray-600 truncate">{application.position_title}</p>
          <Badge className={`mt-1 sm:mt-2 text-xs sm:text-sm ${statusColors[application.status]} border`}>
            {application.status}
          </Badge>
        </div>
      </div>

      {/* Status Update */}
      <div>
        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Update Status</label>
        <Select value={application.status} onValueChange={(value) => onStatusUpdate(application.id, value)}>
          <SelectTrigger className="text-sm sm:text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="interviewed">Interviewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contact Information */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Contact Information</h4>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{application.student_email}</span>
          </div>
          {application.student_phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
              <span>{application.student_phone}</span>
            </div>
          )}
          {application.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{application.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Application Details */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Application Details</h4>
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div>
            <span className="text-gray-600">Position:</span>
            <p className="font-medium truncate">{application.position_title}</p>
          </div>
          <div>
            <span className="text-gray-600">Company:</span>
            <p className="font-medium truncate">{application.company_name}</p>
          </div>
          <div>
            <span className="text-gray-600">Type:</span>
            <Badge variant="outline" className="ml-2 text-xs">
              {application.position_type}
            </Badge>
          </div>
          <div>
            <span className="text-gray-600">Applied Date:</span>
            <p className="font-medium">
              {format(new Date(application.applied_date || application.created_date), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>

      {/* Education & Experience */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Education & Experience</h4>
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div>
            <span className="text-gray-600">Experience:</span>
            <p className="font-medium">{application.experience_years} years</p>
          </div>
          <div>
            <span className="text-gray-600">Education:</span>
            <p className="font-medium truncate">{application.education}</p>
          </div>
          {application.university && (
            <div>
              <span className="text-gray-600">University:</span>
              <p className="font-medium truncate">{application.university}</p>
            </div>
          )}
          {application.graduation_year && (
            <div>
              <span className="text-gray-600">Graduation Year:</span>
              <p className="font-medium">{application.graduation_year}</p>
            </div>
          )}
          {application.cgpa && (
            <div>
              <span className="text-gray-600">CGPA:</span>
              <p className="font-medium">{application.cgpa}/10</p>
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      {application.skills && application.skills.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Skills</h4>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {application.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Cover Letter */}
      {application.cover_letter && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Cover Letter</h4>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-700 max-h-24 sm:max-h-32 overflow-y-auto border">
            {application.cover_letter}
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="space-y-2 sm:space-y-3">
        {application.resume_url && (
          <Button
            variant="outline"
            className="w-full justify-start text-xs sm:text-sm h-8 sm:h-10"
            onClick={() => window.open(application.resume_url, "_blank")}
          >
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            <span className="hidden sm:inline">View Resume</span>
            <span className="sm:hidden">Resume</span>
            <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3 ml-auto" />
          </Button>
        )}

        {application.portfolio_url && (
          <Button
            variant="outline"
            className="w-full justify-start text-xs sm:text-sm h-8 sm:h-10"
            onClick={() => window.open(application.portfolio_url, "_blank")}
          >
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            <span className="hidden sm:inline">View Portfolio</span>
            <span className="sm:hidden">Portfolio</span>
            <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3 ml-auto" />
          </Button>
        )}
      </div>
    </div>
  );
}
