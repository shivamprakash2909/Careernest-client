import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, IndianRupee, Clock, Building, Users, X } from "lucide-react";

export default function JobDetailsModal({ job, onClose }) {
  if (!job) return null;

  const formatSalary = (min, max) => {
    if (!min && !max) return "Salary not disclosed";
    if (min && max) {
      return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L per annum`;
    }
    return min ? `₹${(min / 100000).toFixed(1)}L+ per annum` : `Up to ₹${(max / 100000).toFixed(1)}L per annum`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 px-2 sm:px-0">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full relative mx-2 sm:mx-0">
        <Button variant="ghost" className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center sm:text-left">
              {job.title}
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-2 text-gray-600 mb-2">
              <Building className="w-4 h-4" />
              <span className="font-medium">{job.company}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-500 mb-2">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </span>
              {job.remote_option && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Remote Available
                </Badge>
              )}
            </div>
            <div className="flex items-center text-green-600 font-semibold mb-2 justify-center sm:justify-start">
              <IndianRupee className="w-4 h-4 mr-1" />
              <span>{formatSalary(job.salary_min, job.salary_max)}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm mb-2 justify-center sm:justify-start">
              <Clock className="w-4 h-4 mr-1" />
              <span>Posted recently</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
              <Badge variant="secondary">{job.job_type}</Badge>
              {job.experience_level && <Badge variant="outline">{job.experience_level}</Badge>}
              {job.skills &&
                job.skills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-blue-600 border-blue-600">
                    {skill}
                  </Badge>
                ))}
            </div>
            <div className="mb-4">
              <h4 className="font-semibold mb-1">Description</h4>
              <p className="text-gray-700 text-sm">{job.description}</p>
            </div>
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Requirements</h4>
                <ul className="list-disc list-inside text-gray-700 text-sm">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            {job.benefits && job.benefits.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Benefits</h4>
                <ul className="list-disc list-inside text-gray-700 text-sm">
                  {job.benefits.map((ben, idx) => (
                    <li key={idx}>{ben}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
