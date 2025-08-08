import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchInternships, deleteInternship } from "../Services/InternshipApi";
import { useToast } from "@/components/common/ToastContext";
import InternshipDetailsModal from "../components/jobs/InternshipDetailsModal";

export default function ManageInternships() {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recruiter, setRecruiter] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const jwt = localStorage.getItem("jwt");
    if (!user || !jwt || user.role !== "recruiter") {
      navigate("/p/recruiterauth");
    } else {
      setRecruiter(user);
      loadInternships(user.email);
    }
    // eslint-disable-next-line
  }, []);

  const loadInternships = async (email) => {
    setIsLoading(true);
    try {
      const data = await fetchInternships({ posted_by: email });
      setInternships(data);
    } catch (error) {
      console.error("Error loading internships:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (internshipId) => {
    if (window.confirm("Are you sure you want to delete this internship?")) {
      try {
        await deleteInternship(internshipId);
        setInternships(internships.filter((internship) => internship._id !== internshipId));
        showSuccess("Internship deleted successfully");
      } catch (error) {
        console.error("Error deleting internship:", error);
        showError("Failed to delete internship");
      }
    }
  };

  const handleViewDetails = (internship) => {
    setSelectedInternship(internship);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInternship(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Link to="/p/recruiterdashboard">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Internships</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your internship postings</p>
            </div>
          </div>
          <Link to="/p/post-internships" className="w-full sm:w-auto">
            <Button className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Post New Internship</span>
              <span className="sm:hidden">Post Internship</span>
            </Button>
          </Link>
        </div>

        {/* Internships List */}
        <div className="space-y-4 sm:space-y-6">
          {internships.length > 0 ? (
            internships.map((internship) => (
              <Card key={internship._id} className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{internship.title}</h3>
                        <Badge
                          className={
                            internship.status === "approved"
                              ? "bg-green-100 text-green-800 w-fit"
                              : internship.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 w-fit"
                              : "bg-gray-100 text-gray-800 w-fit"
                          }
                        >
                          {internship.status || "pending"}
                        </Badge>
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <p className="text-sm sm:text-base text-gray-600">
                          {internship.company} • {internship.location} • {internship.duration}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Stipend:{" "}
                          {(() => {
                            const formatStipendRange = (min, max, type = "Fixed") => {
                              if (min && max) {
                                return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
                              }
                              if (min) {
                                return `₹${min.toLocaleString()}+`;
                              }
                              if (max) {
                                return `Up to ₹${max.toLocaleString()}`;
                              }
                              return "Not specified";
                            };
                            return formatStipendRange(
                              internship.stipend_amount_min,
                              internship.stipend_amount_max,
                              internship.stipend_type
                            );
                          })()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 lg:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(internship)}
                        className="flex-1 sm:flex-none"
                      >
                        <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View</span>
                        <span className="sm:hidden">Details</span>
                      </Button>
                      <Link to={`/p/edit-internship/${internship._id}`} className="flex-1 sm:flex-none">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="w-4 h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Edit</span>
                          <span className="sm:hidden">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                        onClick={() => handleDelete(internship._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Delete</span>
                        <span className="sm:hidden">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mb-4">
                  <Plus className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No internships posted yet</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4 max-w-md mx-auto">
                  Start by posting your first internship to attract candidates
                </p>
                <Link to="/p/post-internships" className="inline-block">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Your First Internship
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Internship Details Modal */}
      {showModal && selectedInternship && (
        <InternshipDetailsModal internship={selectedInternship} onClose={closeModal} />
      )}
    </div>
  );
}
