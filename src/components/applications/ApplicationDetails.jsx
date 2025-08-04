
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  reviewing: "bg-blue-100 text-blue-800 border-blue-200",
  shortlisted: "bg-purple-100 text-purple-800 border-purple-200",
  interviewed: "bg-indigo-100 text-indigo-800 border-indigo-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200"
};

export default function ApplicationDetails({ application, onStatusUpdate }) {
  // Assuming 'application' will always be provided when this component is rendered in a modal context.
  // The 'if (!application)' check and the placeholder UI are removed as per the outline.

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold text-lg">
            {getInitials(application.student_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-xl font-bold">{application.student_name}</h3>
          <p className="text-gray-600">{application.position_title}</p>
          <Badge 
            className={`mt-2 ${statusColors[application.status]} border`}
          >
            {application.status}
          </Badge>
        </div>
      </div>

      {/* Status Update */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Update Status
        </label>
        <Select 
          value={application.status} 
          onValueChange={(value) => onStatusUpdate(application.id, value)}
        >
          <SelectTrigger>
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
        <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{application.student_email}</span>
          </div>
          {application.student_phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{application.student_phone}</span>
            </div>
          )}
          {application.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{application.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Application Details */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Application Details</h4>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-600">Position:</span>
            <p className="font-medium">{application.position_title}</p>
          </div>
          <div>
            <span className="text-gray-600">Company:</span>
            <p className="font-medium">{application.company_name}</p>
          </div>
          <div>
            <span className="text-gray-600">Type:</span>
            <Badge variant="outline" className="ml-2">
              {application.position_type}
            </Badge>
          </div>
          <div>
            <span className="text-gray-600">Applied Date:</span>
            <p className="font-medium">
              {format(new Date(application.applied_date || application.created_date), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Education & Experience */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Education & Experience</h4>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-600">Experience:</span>
            <p className="font-medium">{application.experience_years} years</p>
          </div>
          <div>
            <span className="text-gray-600">Education:</span>
            <p className="font-medium">{application.education}</p>
          </div>
          {application.university && (
            <div>
              <span className="text-gray-600">University:</span>
              <p className="font-medium">{application.university}</p>
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
          <h4 className="font-semibold text-gray-900 mb-3">Skills</h4>
          <div className="flex flex-wrap gap-2">
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
          <h4 className="font-semibold text-gray-900 mb-3">Cover Letter</h4>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 max-h-32 overflow-y-auto border">
            {application.cover_letter}
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="space-y-3">
        {application.resume_url && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open(application.resume_url, '_blank')}
          >
            <FileText className="w-4 h-4 mr-2" />
            View Resume
            <ExternalLink className="w-3 h-3 ml-auto" />
          </Button>
        )}
        
        {application.portfolio_url && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open(application.portfolio_url, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Portfolio
            <ExternalLink className="w-3 h-3 ml-auto" />
          </Button>
        )}
      </div>
    </div>
  );
}