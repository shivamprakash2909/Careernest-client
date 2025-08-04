import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, MapPin, Building, Calendar } from "lucide-react";

export default function JobDetailsModal({ isOpen, onOpenChange, job, onStatusChange }) {
  const [comments, setComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadge = (status) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const getJobTypeBadge = (jobType) => {
    const variants = {
      "Full-time": "bg-blue-100 text-blue-800",
      "Part-time": "bg-purple-100 text-purple-800",
      "Contract": "bg-orange-100 text-orange-800",
      "Internship": "bg-green-100 text-green-800",
    };
    return <Badge className={variants[jobType] || "bg-gray-100 text-gray-800"}>{jobType}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleStatusChange = async (status) => {
    if (!job) return;
    
    setIsLoading(true);
    try {
      await onStatusChange(job._id, status, comments);
      setComments("");
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-4 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-4">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg sm:text-xl">
            <span className="flex-1">{job.title}</span>
            {getStatusBadge(job.approval_status)}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Review job details and approve or reject the application
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Job Header Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">{job.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm sm:text-base">{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm sm:text-base">Posted: {formatDate(job.postedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm sm:text-base">Type: {getJobTypeBadge(job.job_type)}</span>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base">{job.description}</p>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm sm:text-base">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Benefits</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm sm:text-base">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {job.salary_min && job.salary_max && (
                <div>
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Salary Range</h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    ₹{job.salary_min.toLocaleString()} - ₹{job.salary_max.toLocaleString()}
                  </p>
                </div>
              )}
              {job.stipend && (
                <div>
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Stipend</h3>
                  <p className="text-gray-700 text-sm sm:text-base">{job.stipend}</p>
                </div>
              )}
              {job.experience_level && (
                <div>
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Experience Level</h3>
                  <p className="text-gray-700 text-sm sm:text-base">{job.experience_level}</p>
                </div>
              )}
              {job.duration && (
                <div>
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Duration</h3>
                  <p className="text-gray-700 text-sm sm:text-base">{job.duration}</p>
                </div>
              )}
              {job.remote_option && (
                <div>
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Remote Option</h3>
                  <p className="text-gray-700 text-sm sm:text-base">Yes</p>
                </div>
              )}
            </div>

            {/* Posted By */}
            <div>
              <h3 className="font-semibold mb-1 text-sm sm:text-base">Posted By</h3>
              <p className="text-gray-700 text-sm sm:text-base">{job.posted_by}</p>
            </div>

            {/* Admin Review Info */}
            {job.admin_review && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Admin Review</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Reviewed by:</span> {job.admin_review.reviewed_by}</p>
                  <p><span className="font-medium">Reviewed at:</span> {formatDate(job.admin_review.reviewed_at)}</p>
                  {job.admin_review.comments && (
                    <p><span className="font-medium">Comments:</span> {job.admin_review.comments}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Approval Actions */}
          {job.approval_status === "pending" && (
            <div className="space-y-3 sm:space-y-4 border-t pt-3 sm:pt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Comments (Optional)
                </label>
                <Textarea
                  placeholder="Add any comments about your decision..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={() => handleStatusChange("approved")}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 h-10 sm:h-11 text-sm sm:text-base"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusChange("rejected")}
                  disabled={isLoading}
                  variant="destructive"
                  className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 