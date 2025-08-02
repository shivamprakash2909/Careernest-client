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
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-800">{internship.title}</DialogTitle>
              <DialogDescription className="text-md text-gray-600 mt-1">
                at {internship.companyName}
              </DialogDescription>
            </div>
            <img src={internship.companyLogoUrl || `https://avatar.vercel.sh/${internship.companyName}.png`} alt={internship.companyName} className="h-16 w-16 rounded-lg object-contain border p-1" />
          </div>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /> {internship.location}</div>
            <div className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-gray-400" /> {internship.stipend}</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400" /> {internship.duration}</div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Job Description</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{internship.description}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Recruiter Information</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Name:</strong> {internship.recruiterName}</p>
              <p><strong>Email:</strong> {internship.recruiterEmail}</p>
            </div>
          </div>

          {/* Admin Review Info */}
          {internship.admin_review && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Admin Review</h3>
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

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}