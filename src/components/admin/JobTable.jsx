import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";

export default function JobTable({ jobs, onStatusChange, onViewDetails }) {
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
      Contract: "bg-orange-100 text-orange-800",
      Internship: "bg-green-100 text-green-800",
    };
    return <Badge className={variants[jobType] || "bg-gray-100 text-gray-800"}>{jobType}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-sm sm:text-base">No jobs found in this category.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm w-[35%] sm:w-[30%]">Job Title</TableHead>
            <TableHead className="text-xs sm:text-sm hidden sm:table-cell w-[25%] sm:w-[20%]">Company</TableHead>
            <TableHead className="text-xs sm:text-sm hidden md:table-cell w-[15%]">Location</TableHead>
            <TableHead className="text-xs sm:text-sm w-[15%] sm:w-[10%]">Type</TableHead>
            <TableHead className="text-xs sm:text-sm w-[15%] sm:w-[10%]">Status</TableHead>
            <TableHead className="text-xs sm:text-sm hidden lg:table-cell w-[10%]">Posted</TableHead>
            <TableHead className="text-xs sm:text-sm w-[10%]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job._id}>
              <TableCell className="py-2 sm:py-3">
                <div
                  className="text-xs sm:text-sm font-medium max-w-[80px] sm:max-w-[120px] md:max-w-[150px] truncate"
                  title={job.title}
                >
                  {job.title}
                </div>
              </TableCell>
              <TableCell className="py-2 sm:py-3 hidden sm:table-cell">
                <div className="text-xs sm:text-sm max-w-[60px] md:max-w-[80px] truncate" title={job.company}>
                  {job.company}
                </div>
              </TableCell>
              <TableCell className="py-2 sm:py-3 hidden md:table-cell">
                <div className="text-xs sm:text-sm max-w-[50px] lg:max-w-[70px] truncate" title={job.location}>
                  {job.location}
                </div>
              </TableCell>
              <TableCell className="py-2 sm:py-3">
                <div className="text-xs">{getJobTypeBadge(job.job_type)}</div>
              </TableCell>
              <TableCell className="py-2 sm:py-3">
                <div className="text-xs">{getStatusBadge(job.approval_status)}</div>
              </TableCell>
              <TableCell className="py-2 sm:py-3 hidden lg:table-cell">
                <div className="text-xs sm:text-sm max-w-[60px] truncate">{formatDate(job.postedAt)}</div>
              </TableCell>
              <TableCell className="py-2 sm:py-3">
                <div className="flex items-center justify-end gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(job)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  {job.approval_status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 h-7 w-7 sm:h-8 sm:w-8 p-0"
                        onClick={() => onStatusChange(job._id, "approved")}
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 h-7 w-7 sm:h-8 sm:w-8 p-0"
                        onClick={() => onStatusChange(job._id, "rejected")}
                      >
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
