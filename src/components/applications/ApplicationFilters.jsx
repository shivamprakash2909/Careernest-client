import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function ApplicationFilters({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full sm:w-32 md:w-40 text-xs sm:text-sm">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="reviewing">Reviewing</SelectItem>
          <SelectItem value="shortlisted">Shortlisted</SelectItem>
          <SelectItem value="interviewed">Interviewed</SelectItem>
          <SelectItem value="accepted">Accepted</SelectItem>
          <SelectItem value="hired">Hired</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-full sm:w-28 md:w-36 text-xs sm:text-sm">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="job">Jobs</SelectItem>
          <SelectItem value="internship">Internships</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-full sm:w-28 md:w-36 text-xs sm:text-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-created_date">Latest First</SelectItem>
          <SelectItem value="student_name">Name A-Z</SelectItem>
          <SelectItem value="position_title">Position A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
