import { useEffect, useState } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MyApplicationCard from "@/components/jobs/MyApplicationCard";
import ApplicationApi from "../Services/ApplicationApi";
import { useToast } from "../components/common/ToastContext";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        setError(null);

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.email) {
          throw new Error("Please log in to view your applications");
        }

        const data = await ApplicationApi.list({ applicant_email: user.email });
        setApplications(data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err.message || "Failed to fetch applications");
        showToast(err.message || "Failed to fetch applications", "error");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [showToast]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-blue-900">My Applications</h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-blue-500 hover:text-blue-700">
            Try Again
          </button>
        </div>
      ) : applications.length > 0 ? (
        <div className="grid gap-6">
          {applications.map((app) => (
            <MyApplicationCard key={app._id} app={app} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p>No applications found.</p>
          <a href="/p/jobs" className="text-blue-500 hover:text-blue-700 mt-2 inline-block">
            Browse Jobs
          </a>
        </div>
      )}
    </div>
  );
}
