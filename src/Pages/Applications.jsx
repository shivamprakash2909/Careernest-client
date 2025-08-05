import React, { useState, useEffect } from "react";
import ApplicationApi from "../Services/ApplicationApi";
import { fetchInternshipsFromAPI } from "../Services/InternshipApi";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ApplicationFilters from "../components/applications/ApplicationFilters";
import ApplicationList from "../components/applications/ApplicationList";
import ApplicationDetails from "../components/applications/ApplicationDetails";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Reverse status mapping for display
const reverseStatusMapping = {
  reviewed: "reviewing",
  shortlisted: "interviewed",
  hired: "accepted",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("-created_date");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isRecruiter, setIsRecruiter] = useState(true);

  useEffect(() => {
    loadApplications();
  }, [sortBy]);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchTerm, statusFilter, typeFilter]);

  // Function to map backend status to frontend display status
  const mapStatusForDisplay = (status) => {
    return reverseStatusMapping[status] || status;
  };

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const isUserRecruiter = user?.role === "recruiter";
      setIsRecruiter(isUserRecruiter);

      console.log("isRecruiter:", isUserRecruiter);
      console.log("User role:", user?.role);
      console.log("Fetching applications...");

      let applicationsData = [];

      if (isUserRecruiter) {
        // Use the new recruiter-specific API endpoint
        applicationsData = await ApplicationApi.getRecruiterApplications();
        console.log("Recruiter applications:", applicationsData);

        // Transform recruiter applications to match expected format
        const transformedApplications = (applicationsData || []).map((app) => ({
          id: app._id,
          student_name: app.applicant_name,
          position_title: app.title || "Unknown Position",
          position_type: app.application_type,
          status: mapStatusForDisplay(app.status || "pending"),
          created_date: app.created_date,
          company_name: app.company_name,
          email: app.applicant_email,
          phone: app.phone,
          resume_url: app.resume_url,
          cover_letter: app.cover_letter,
          // Include additional fields from the new API
          location: app.location,
          salary: app.salary,
          stipend: app.stipend,
          duration: app.duration,
          job_id: app.job_id,
          internship_id: app.internship_id,
          // Add any other fields that need mapping
          ...app,
        }));

        console.log("Transformed recruiter applications:", transformedApplications);
        setApplications(transformedApplications);
      } else {
        // For non-recruiters (students), use the existing logic
        const [regularApplications, internshipData] = await Promise.all([
          ApplicationApi.list().catch((error) => {
            console.error("Error fetching regular applications:", error);
            return [];
          }),
          fetchInternshipsFromAPI().catch((error) => {
            console.error("Error fetching internships:", error);
            return [];
          }),
        ]);

        console.log("Regular applications:", regularApplications);
        console.log("Internship data:", internshipData);

        // Transform regular applications to match expected format
        const transformedRegularApplications = (regularApplications || []).map((app) => ({
          id: app._id,
          student_name: app.applicant_name,
          position_title: app.job_id?.title || app.internship_id?.title || "Unknown Position",
          position_type: app.application_type === "internship" ? "internship" : "job",
          status: mapStatusForDisplay(app.status || "pending"),
          created_date: app.created_date || app.createdAt,
          company_name: app.company_name || app.job_id?.company || app.internship_id?.company,
          email: app.applicant_email,
          phone: app.phone,
          resume_url: app.resume_url,
          cover_letter: app.cover_letter,
          // Add any other fields that need mapping
          ...app,
        }));

        // Transform internship data to match application format
        const transformedInternships = (internshipData || []).map((internship) => ({
          id: internship._id,
          student_name: internship.student_name || internship.applicant_name || internship.posted_by,
          position_title: internship.position_title || internship.job_title || internship.title,
          position_type: "internship",
          status: mapStatusForDisplay(internship.status || "pending"),
          created_date: internship.createdAt || internship.created_date || internship.postedAt,
          company_name: internship.company_name || internship.company,
          email: internship.email,
          phone: internship.phone,
          resume_url: internship.resume_url,
          cover_letter: internship.cover_letter,
          // Add any other fields that need mapping
          ...internship,
        }));

        console.log("Transformed regular applications:", transformedRegularApplications);
        console.log("Transformed internships:", transformedInternships);

        // Combine both types of applications
        const allApplications = [...transformedRegularApplications, ...transformedInternships];

        console.log("All applications combined:", allApplications);

        // Sort by creation date (newest first)
        const sortedApplications = allApplications.sort((a, b) => {
          const dateA = new Date(a.created_date || a.createdAt);
          const dateB = new Date(b.created_date || b.createdAt);
          return dateB - dateA;
        });

        console.log("Final sorted applications:", sortedApplications);
        setApplications(sortedApplications);
      }
    } catch (error) {
      console.error("Error loading applications:", error);
      setApplications([]);
    }
    setIsLoading(false);
  };

  const filterAndSortApplications = () => {
    let filtered = [...applications];

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          (app.student_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (app.position_title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (app.company_name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((app) => app.position_type === typeFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      // Determine if it's a regular application or internship
      const application = applications.find((app) => app.id === applicationId);

      if (application.position_type === "internship") {
        // Update internship status using InternshipApi
        const { updateInternshipStatus } = await import("../Services/InternshipApi");
        await updateInternshipStatus(applicationId, newStatus);
      } else {
        // Update regular application status
        await ApplicationApi.update(applicationId, { status: newStatus });
      }

      // Update local state
      const updatedApplications = applications.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      );
      setApplications(updatedApplications);

      if (selectedApplication?.id === applicationId) {
        setSelectedApplication((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSelectionChange = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSelectAll = (isChecked) => {
    setSelectedIds(isChecked ? filteredApplications.map((app) => app.id) : []);
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedIds.length === 0) return;

    setIsLoading(true);
    try {
      const updates = selectedIds.map(async (id) => {
        const application = applications.find((app) => app.id === id);

        if (application.position_type === "internship") {
          const { updateInternshipStatus } = await import("../Services/InternshipApi");
          return updateInternshipStatus(id, status);
        } else {
          return ApplicationApi.update(id, { status });
        }
      });

      await Promise.all(updates);
      setSelectedIds([]);
      await loadApplications();
    } catch (error) {
      console.error("Error during bulk update:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            {isRecruiter ? "Applications for Your Postings" : "Applications"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            {isRecruiter
              ? "Review and manage applications for your posted jobs and internships"
              : "Manage and review student applications"}
          </p>
        </div>

        {/* Search and Filters Card */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm sm:text-base"
                  />
                </div>
              </div>
              {/* Filters */}
              <div className="w-full lg:w-auto">
                <ApplicationFilters
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions Card */}
        {selectedIds.length > 0 && (
          <Card className="mb-4 bg-indigo-50 border-indigo-200 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <p className="font-medium text-indigo-800 text-sm sm:text-base">
                  {selectedIds.length} application(s) selected.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs sm:text-sm font-medium mr-2">Bulk Actions:</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkStatusUpdate("shortlisted")}
                      className="text-xs sm:text-sm"
                    >
                      Shortlist
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleBulkStatusUpdate("rejected")}
                      className="text-xs sm:text-sm"
                    >
                      Reject
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setSelectedIds([])} className="h-8 w-8">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Applications List */}
        <div className="w-full">
          <ApplicationList
            applications={filteredApplications}
            isLoading={isLoading}
            onSelectApplication={setSelectedApplication}
            onStatusUpdate={handleStatusUpdate}
            selectedApplication={selectedApplication}
            selectedIds={selectedIds}
            onSelectionChange={handleSelectionChange}
            onSelectAll={handleSelectAll}
          />
        </div>
      </div>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={(isOpen) => !isOpen && setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl p-0 mx-4 sm:mx-0">
          {selectedApplication && (
            <div className="max-h-[90vh] overflow-y-auto">
              <DialogHeader className="p-4 sm:p-6 pb-4">
                <DialogTitle className="text-lg sm:text-xl">Application Details</DialogTitle>
              </DialogHeader>
              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                <ApplicationDetails application={selectedApplication} onStatusUpdate={handleStatusUpdate} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
