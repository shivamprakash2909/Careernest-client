import React, { useState, useEffect } from "react";
import { fetchInternshipsFromAPI, updateInternshipStatus } from "../Services/InternshipApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, XCircle, Briefcase, Users, Settings } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import StatCard from "../components/admin/StatCard";
import InternshipTable from "../components/admin/InternshipTable";
import InternshipDetailsModal from "../components/admin/InternshipDetailsModal";
import AdminAuth from "./AdminAuth";
import JobTable from "../components/admin/JobTable";
import JobDetailsModal from "../components/admin/JobDetailsModal";

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
  
  const navigate = useNavigate();

  const fetchInternships = async () => {
    try {
      const data = await fetchInternshipsFromAPI();
      if (!Array.isArray(data)) {
        console.error('Failed to fetch internships: Response is not an array', data);
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
      const response = await axios.get("/api/jobs/admin/all", {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-auth': 'true'
        }
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
      
      await axios.put(`/api/internships/${id}/approve`, 
        { status, comments },
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'x-admin-auth': 'true',
            'x-admin-email': adminData.email || 'admin@careernest.com'
          }
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
      
      await axios.put(`/api/jobs/${id}/approve`, 
        { approval_status, comments },
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'x-admin-auth': 'true',
            'x-admin-email': adminData.email || 'admin@careernest.com'
          }
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
      <main className="p-4 sm:p-6 lg:p-8 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          {adminData && (
            <div className="text-sm text-gray-600">
              Welcome, {adminData.name}
            </div>
          )}
        </div>

        {/* Overall Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard title="Total Pending" value={totalPending} icon={Clock} color="text-yellow-500" />
          <StatCard title="Total Approved" value={totalApproved} icon={CheckCircle} color="text-green-500" />
          <StatCard title="Total Rejected" value={totalRejected} icon={XCircle} color="text-red-500" />
          <StatCard title="Total Items" value={totalPending + totalApproved + totalRejected} icon={Briefcase} color="text-blue-500" />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="internships" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
          </TabsList>

          {/* Internships Tab */}
          <TabsContent value="internships">
            <Card>
              <CardHeader>
                <CardTitle>Internship Applications</CardTitle>
                <CardDescription>Review, approve, or reject internship posts.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="pending">Pending ({internshipStats.pending})</TabsTrigger>
                    <TabsTrigger value="approved">Approved ({internshipStats.approved})</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected ({internshipStats.rejected})</TabsTrigger>
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
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>Review, approve, or reject job posts.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="pending">Pending ({filteredJobStats.pending})</TabsTrigger>
                    <TabsTrigger value="approved">Approved ({filteredJobStats.approved})</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected ({filteredJobStats.rejected})</TabsTrigger>
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
