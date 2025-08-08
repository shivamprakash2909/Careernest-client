import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, IndianRupee, Clock, Building, Users, X } from "lucide-react";

export default function InternshipDetailsModal({ internship, onClose }) {
  if (!internship) return null;

  const formatStipend = (internship) => {
    if (internship.stipend && internship.stipend.trim() !== "") {
      return internship.stipend;
    }
    return "Stipend not disclosed";
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
              {internship.title}
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-2 text-gray-600 mb-2">
              <Building className="w-4 h-4" />
              <span className="font-medium">{internship.company_name || internship.companyName}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-500 mb-2">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {internship.location}
              </span>
              {internship.remote_option && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Remote Available
                </Badge>
              )}
            </div>
            <div className="flex items-center text-green-600 font-semibold mb-2 justify-center sm:justify-start">
              <IndianRupee className="w-4 h-4 mr-1" />
              <span>{formatStipend(internship)}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm mb-2 justify-center sm:justify-start">
              <Clock className="w-4 h-4 mr-1" />
              <span>Duration: {internship.duration}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
              {internship.experience_level && <Badge variant="outline">{internship.experience_level}</Badge>}
              {internship.skills && (
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Skills Required
                </Badge>
              )}
            </div>
            <div className="mb-4">
              <h4 className="font-semibold mb-1">Description</h4>
              <p className="text-gray-700 text-sm">{internship.description}</p>
            </div>
            {internship.requirements && (
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Requirements</h4>
                <div className="text-gray-700 text-sm whitespace-pre-wrap">{internship.requirements}</div>
              </div>
            )}
            {internship.perks && (
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Perks & Benefits</h4>
                <div className="text-gray-700 text-sm whitespace-pre-wrap">{internship.perks}</div>
              </div>
            )}
            {internship.status && (
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Status</h4>
                <Badge
                  className={
                    internship.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : internship.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : internship.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {internship.status}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
