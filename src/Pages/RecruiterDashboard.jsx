import React, { useState, useEffect } from "react";
import UserApi from "../Services/UserApi";
import JobApi from "../Services/JobApi";
import ApplicationApi from "../Services/ApplicationApi";
import { fetchInternships } from "../Services/InternshipApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, Users, Eye, Edit, Trash2, Building } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Link } from "react-router-dom";

export default function RecruiterDashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await UserApi.me();
      setUser(userData);

      // Load jobs for the current recruiter
      const jobData = await JobApi.filter({ posted_by: userData.email });
      setJobs(jobData);

      // Load internships for the current recruiter
      const internshipData = await fetchInternships({ posted_by: userData.email });
      setInternships(internshipData);

      // Load applications (this might need to be filtered by recruiter's jobs)
      const applicationData = await ApplicationApi.list();
      setApplications(applicationData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Set empty arrays as fallback to prevent further errors
      setJobs([]);
      setInternships([]);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const activeJobs = jobs.filter((job) => job.status === "active").length;
  const totalApplications = applications.filter((app) => jobs.some((job) => job._id === app.job_id || job.id === app.job_id)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-0 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.full_name || "Recruiter"}!</p>
          </div>
          <div className="flex gap-4">
            <Link to="/p/post-jobs">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4" />
              Post New Job
            </Button>
          </Link>
          <Link to="/p/post-internships">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4" />
              Post New Internship
            </Button>
          </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 sm:p-1">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{activeJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-1">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-1">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Company</p>
                  <p className="text-lg font-bold text-gray-900">{user?.company_name || "Not Set"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Your Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length > 0 ? (
              <div className="space-y-4">
                                 {jobs.map((job) => (
                   <div key={job._id || job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">
                        {job.location} • {job.job_type}
                      </p>
                      <Badge
                        className={
                          job.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No jobs posted yet</h3>
                <p className="text-gray-500 mb-4">Start by posting your first job to attract candidates</p>
                <Link to="/p/post-jobs">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Your First Job
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Internships */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Internship Postings</CardTitle>
          </CardHeader>
          <CardContent>
            {internships.length > 0 ? (
              <div className="space-y-4">
                                 {internships.map((internship) => (
                   <div key={internship._id || internship.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{internship.title}</h3>
                      <p className="text-sm text-gray-600">
                        {internship.location} • {internship.duration}
                      </p>
                      <Badge
                        className={
                          internship.status === "approved" ? "bg-green-100 text-green-800" : 
                          internship.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {internship.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No internships posted yet</h3>
                <p className="text-gray-500 mb-4">Start by posting your first internship to attract candidates</p>
                <Link to="/p/post-internships">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Your First Internship
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
