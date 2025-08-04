import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, MapPin, Briefcase, IndianRupee, Clock } from 'lucide-react';

export default function InternshipDetailsModal({ isOpen, onOpenChange, internship, onStatusChange }) {
  const [comments, setComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (status) => {
    if (!internship) return;
    
    setIsLoading(true);
    try {
      await onStatusChange(internship.id, status, comments);
      setComments("");
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!internship) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-4 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-800">{internship.title}</DialogTitle>
              <DialogDescription className="text-sm sm:text-md text-gray-600 mt-1">
                at {internship.companyName}
              </DialogDescription>
            </div>
            <img src={internship.companyLogoUrl || `https://avatar.vercel.sh/${internship.companyName}.png`} alt={internship.companyName} className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-contain border p-1 flex-shrink-0" />
          </div>
        </DialogHeader>
        <div className="mt-3 sm:mt-4 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" /> <span>{internship.location}</span></div>
            <div className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-gray-400 flex-shrink-0" /> <span>{internship.stipend}</span></div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400 flex-shrink-0" /> <span>{internship.duration}</span></div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Job Description</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{internship.description}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Recruiter Information</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Name:</strong> {internship.recruiterName}</p>
              <p><strong>Email:</strong> {internship.recruiterEmail}</p>
            </div>
          </div>

          {/* Admin Review Info */}
          {internship.admin_review && (
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Admin Review</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Reviewed by:</span> {internship.admin_review.reviewed_by}</p>
                <p><span className="font-medium">Reviewed at:</span> {new Date(internship.admin_review.reviewed_at).toLocaleDateString()}</p>
                {internship.admin_review.comments && (
                  <p><span className="font-medium">Comments:</span> {internship.admin_review.comments}</p>
                )}
              </div>
            </div>
          )}

          {/* Approval Actions */}
          {internship.status === "pending" && (
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

          <div className="flex justify-end gap-3 pt-3 sm:pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 sm:h-10 text-sm sm:text-base">Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}