import React, { useState, useEffect } from "react";
import { fetchInternshipsFromAPI, updateInternshipStatus } from "../Services/InternshipApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, XCircle, Briefcase, Users, Settings, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import StatCard from "../components/admin/StatCard";
import InternshipTable from "../components/admin/InternshipTable";
import InternshipDetailsModal from "../components/admin/InternshipDetailsModal";
import AdminAuth from "./AdminAuth";
import JobTable from "../components/admin/JobTable";
import JobDetailsModal from "../components/admin/JobDetailsModal";
import { axiosInstance } from "@/lib/axios";

// Admin Dashboard Component
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [internships, setInternships] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [internshipStats, setInternshipStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [jobStats, setJobStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const fetchInternships = async () => {
    try {
      const data = await fetchInternshipsFromAPI();
      if (!Array.isArray(data)) {
        console.error("Failed to fetch internships: Response is not an array", data);
        setInternships([]);
        setInternshipStats({ pending: 0, approved: 0, rejected: 0 });
        return;
      }
      setInternships(data);

      const pending = data.filter((i) => i.status === "pending").length;
      const approved = data.filter((i) => i.status === "approved").length;
      const rejected = data.filter((i) => i.status === "rejected").length;
      setInternshipStats({ pending, approved, rejected });
    } catch (error) {
      console.error("Failed to fetch internships:", error);
      setInternships([]);
      setInternshipStats({ pending: 0, approved: 0, rejected: 0 });
    }
  };

  const fetchJobs = async () => {
    try {
      const adminToken = localStorage.getItem("admin-token");
      const response = await axiosInstance.get("/api/jobs/admin/all", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "x-admin-auth": "true",
        },
      });
      const data = response.data;
      setJobs(data);

      const pending = data.filter((j) => j.approval_status === "pending").length;
      const approved = data.filter((j) => j.approval_status === "approved").length;
      const rejected = data.filter((j) => j.approval_status === "rejected").length;
      setJobStats({ pending, approved, rejected });
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([fetchInternships(), fetchJobs()]);
    setIsLoading(false);
  };

  useEffect(() => {
    const adminAuth = localStorage.getItem("admin-auth");
    const adminDataStr = localStorage.getItem("admin-data");

    if (adminAuth === "true") {
      setIsAuthenticated(true);
      if (adminDataStr) {
        setAdminData(JSON.parse(adminDataStr));
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const handleInternshipStatusChange = async (id, status, comments = "") => {
    try {
      const adminToken = localStorage.getItem("admin-token");
      const adminData = JSON.parse(localStorage.getItem("admin-data") || "{}");

      await axiosInstance.put(
        `/api/internships/${id}/approve`,
        { status, comments },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "x-admin-auth": "true",
            "x-admin-email": adminData.email || "admin@careernest.com",
          },
        }
      );
      await fetchInternships(); // refresh data after update
      if (isInternshipModalOpen) setIsInternshipModalOpen(false);
    } catch (error) {
      console.error("Failed to update internship status:", error);
    }
  };

  const handleJobStatusChange = async (id, approval_status, comments = "") => {
    try {
      const adminToken = localStorage.getItem("admin-token");
      const adminData = JSON.parse(localStorage.getItem("admin-data") || "{}");

      await axiosInstance.put(
        `/api/jobs/${id}/approve`,
        { approval_status, comments },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "x-admin-auth": "true",
            "x-admin-email": adminData.email || "admin@careernest.com",
          },
        }
      );
      await fetchJobs(); // refresh data after update
      if (isJobModalOpen) setIsJobModalOpen(false);
    } catch (error) {
      console.error("Failed to update job status:", error);
    }
  };

  const handleViewInternshipDetails = (internship) => {
    setSelectedInternship(internship);
    setIsInternshipModalOpen(true);
  };

  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleSettingsClick = () => {
    navigate("/p/adminsettings");
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("admin-data");
    localStorage.removeItem("admin-auth");
    navigate("/p/adminpage");
  };

  const mapInternship = (internship) => ({
    ...internship,
    id: internship._id,
    companyName: internship.company,
    companyLogoUrl: internship.company_logo || `https://avatar.vercel.sh/${internship.company}.png`,
    recruiterName: internship.posted_by,
  });

  if (!isAuthenticated) {
    return <AdminAuth onLogin={() => setIsAuthenticated(true)} />;
  }

  const filteredInternships = (status) => internships.filter((i) => i.status === status);
  const filteredJobs = (status) => jobs.filter((j) => j.approval_status === status && j.job_type !== "Internship");

  // Only count jobs that are not internships for job stats
  const filteredJobsList = jobs.filter((j) => j.job_type !== "Internship");
  const filteredJobStats = {
    pending: filteredJobs("pending").length,
    approved: filteredJobs("approved").length,
    rejected: filteredJobs("rejected").length,
  };
  // Use internshipStats as is
  const totalPending = internshipStats.pending + filteredJobStats.pending;
  const totalApproved = internshipStats.approved + filteredJobStats.approved;
  const totalRejected = internshipStats.rejected + filteredJobStats.rejected;

  return (
    <div className="bg-gray-50/50 min-h-screen relative">
      {/* Header is in Layout.js */}
      <main className="p-2 sm:p-4 md:p-6 lg:p-8 pb-20 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>

            {/* Hamburger Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="sm:hidden p-2 h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0">
                <SheetHeader className="px-6 py-4 border-b">
                  <SheetTitle className="text-left">Admin Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-1">Account</h3>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-12 px-4"
                      onClick={() => {
                        handleSettingsClick();
                        setIsMenuOpen(false);
                      }}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-1">Admin Info</h3>
                    {adminData && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium">{adminData.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{adminData.email}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t">
                    <Button
                      variant="destructive"
                      className="w-full h-12"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Welcome Message */}
          {adminData && <div className="hidden sm:block text-sm text-gray-600">Welcome, {adminData.name}</div>}
        </div>

        {/* Overall Stat Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <StatCard title="Total Pending" value={totalPending} icon={Clock} color="text-yellow-500" />
          <StatCard title="Total Approved" value={totalApproved} icon={CheckCircle} color="text-green-500" />
          <StatCard title="Total Rejected" value={totalRejected} icon={XCircle} color="text-red-500" />
          <StatCard
            title="Total Items"
            value={totalPending + totalApproved + totalRejected}
            icon={Briefcase}
            color="text-blue-500"
          />
        </div>

        {/* Main Content Tabs */}
        <div className="w-full overflow-x-hidden">
          <Tabs defaultValue="internships" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jobs" className="text-xs sm:text-sm">
                Jobs
              </TabsTrigger>
              <TabsTrigger value="internships" className="text-xs sm:text-sm">
                Internships
              </TabsTrigger>
            </TabsList>

            {/* Internships Tab */}
            <TabsContent value="internships">
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Internship Applications</CardTitle>
                  <CardDescription className="text-sm">Review, approve, or reject internship posts.</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="mb-3 sm:mb-4 grid grid-cols-3 w-full min-w-0">
                      <TabsTrigger value="pending" className="text-xs sm:text-sm px-2 sm:px-3">
                        Pending ({internshipStats.pending})
                      </TabsTrigger>
                      <TabsTrigger value="approved" className="text-xs sm:text-sm px-2 sm:px-3">
                        Approved ({internshipStats.approved})
                      </TabsTrigger>
                      <TabsTrigger value="rejected" className="text-xs sm:text-sm px-2 sm:px-3">
                        Rejected ({internshipStats.rejected})
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending">
                      <InternshipTable
                        internships={filteredInternships("pending").map(mapInternship)}
                        onStatusChange={handleInternshipStatusChange}
                        onViewDetails={handleViewInternshipDetails}
                      />
                    </TabsContent>
                    <TabsContent value="approved">
                      <InternshipTable
                        internships={filteredInternships("approved").map(mapInternship)}
                        onStatusChange={handleInternshipStatusChange}
                        onViewDetails={handleViewInternshipDetails}
                      />
                    </TabsContent>
                    <TabsContent value="rejected">
                      <InternshipTable
                        internships={filteredInternships("rejected").map(mapInternship)}
                        onStatusChange={handleInternshipStatusChange}
                        onViewDetails={handleViewInternshipDetails}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="jobs">
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Job Applications</CardTitle>
                  <CardDescription className="text-sm">Review, approve, or reject job posts.</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="mb-3 sm:mb-4 grid grid-cols-3 w-full min-w-0">
                      <TabsTrigger value="pending" className="text-xs sm:text-sm px-2 sm:px-3">
                        Pending ({filteredJobStats.pending})
                      </TabsTrigger>
                      <TabsTrigger value="approved" className="text-xs sm:text-sm px-2 sm:px-3">
                        Approved ({filteredJobStats.approved})
                      </TabsTrigger>
                      <TabsTrigger value="rejected" className="text-xs sm:text-sm px-2 sm:px-3">
                        Rejected ({filteredJobStats.rejected})
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending">
                      <JobTable
                        jobs={filteredJobs("pending")}
                        onStatusChange={handleJobStatusChange}
                        onViewDetails={handleViewJobDetails}
                      />
                    </TabsContent>
                    <TabsContent value="approved">
                      <JobTable
                        jobs={filteredJobs("approved")}
                        onStatusChange={handleJobStatusChange}
                        onViewDetails={handleViewJobDetails}
                      />
                    </TabsContent>
                    <TabsContent value="rejected">
                      <JobTable
                        jobs={filteredJobs("rejected")}
                        onStatusChange={handleJobStatusChange}
                        onViewDetails={handleViewJobDetails}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Modals */}
      <InternshipDetailsModal
        isOpen={isInternshipModalOpen}
        onOpenChange={setIsInternshipModalOpen}
        internship={selectedInternship}
        onStatusChange={handleInternshipStatusChange}
      />

      <JobDetailsModal
        isOpen={isJobModalOpen}
        onOpenChange={setIsJobModalOpen}
        job={selectedJob}
        onStatusChange={handleJobStatusChange}
      />
    </div>
  );
}
