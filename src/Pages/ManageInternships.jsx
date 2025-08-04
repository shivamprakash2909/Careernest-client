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

export default function ManageInternships() {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recruiter, setRecruiter] = useState(null);
  const [showDetails, setShowDetails] = useState({});
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

  const toggleDetails = (internshipId) => {
    setShowDetails((prev) => ({
      ...prev,
      [internshipId]: !prev[internshipId],
    }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/p/recruiterdashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Internships</h1>
              <p className="text-gray-600">Manage your internship postings</p>
            </div>
          </div>
          <Link to="/p/post-internships">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Post New Internship
            </Button>
          </Link>
        </div>

        {/* Internships List */}
        <div className="space-y-6">
          {internships.length > 0 ? (
            internships.map((internship) => (
              <Card key={internship._id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{internship.title}</h3>
                        <Badge
                          className={
                            internship.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : internship.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {internship.status || "pending"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {internship.company} • {internship.location} • {internship.duration}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">Stipend: {internship.stipend}</p>

                      {showDetails[internship._id] && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-2">Description:</h4>
                          <p className="text-gray-700 mb-3">{internship.description}</p>
                          <h4 className="font-semibold mb-2">Requirements:</h4>
                          <p className="text-gray-700">{internship.requirements}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => toggleDetails(internship._id)}>
                        <Eye className="w-4 h-4 mr-1" />
                        {showDetails[internship._id] ? "Hide" : "View"}
                      </Button>
                      <Link to={`/p/edit-internship/${internship._id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(internship._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <Plus className="w-12 h-12 text-gray-300 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No internships posted yet</h3>
                <p className="text-gray-500 mb-4">Start by posting your first internship to attract candidates</p>
                <Link to="/p/post-internships">
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
    </div>
  );
}
