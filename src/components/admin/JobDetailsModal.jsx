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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{job.title}</span>
            {getStatusBadge(job.approval_status)}
          </DialogTitle>
          <DialogDescription>
            Review job details and approve or reject the application
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{job.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Posted: {formatDate(job.postedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>Type: {getJobTypeBadge(job.job_type)}</span>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Benefits</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.salary_min && job.salary_max && (
                <div>
                  <h3 className="font-semibold mb-1">Salary Range</h3>
                  <p className="text-gray-700">
                    ₹{job.salary_min.toLocaleString()} - ₹{job.salary_max.toLocaleString()}
                  </p>
                </div>
              )}
              {job.stipend && (
                <div>
                  <h3 className="font-semibold mb-1">Stipend</h3>
                  <p className="text-gray-700">{job.stipend}</p>
                </div>
              )}
              {job.experience_level && (
                <div>
                  <h3 className="font-semibold mb-1">Experience Level</h3>
                  <p className="text-gray-700">{job.experience_level}</p>
                </div>
              )}
              {job.duration && (
                <div>
                  <h3 className="font-semibold mb-1">Duration</h3>
                  <p className="text-gray-700">{job.duration}</p>
                </div>
              )}
              {job.remote_option && (
                <div>
                  <h3 className="font-semibold mb-1">Remote Option</h3>
                  <p className="text-gray-700">Yes</p>
                </div>
              )}
            </div>

            {/* Posted By */}
            <div>
              <h3 className="font-semibold mb-1">Posted By</h3>
              <p className="text-gray-700">{job.posted_by}</p>
            </div>

            {/* Admin Review Info */}
            {job.admin_review && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Admin Review</h3>
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
            <div className="space-y-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Comments (Optional)
                </label>
                <Textarea
                  placeholder="Add any comments about your decision..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => handleStatusChange("approved")}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusChange("rejected")}
                  disabled={isLoading}
                  variant="destructive"
                  className="flex-1"
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