import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ArrowLeft } from "lucide-react";
import AnalyticsApi from "../Services/AnalyticsApi";
import { useNavigate } from "react-router-dom";

const COLORS = ["#2563eb", "#22c55e", "#f59e42"];

const statBoxStyle = "flex-1 bg-white rounded-xl shadow p-2 flex flex-col items-center justify-center min-w-[180px]";

export default function Analytics() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for stats and chart data
  const [stats, setStats] = useState({
    totalPostings: 0,
    totalActive: 0,
    totalHired: 0,
    totalInactive: 0,
  });
  const [monthlyHiring, setMonthlyHiring] = useState([]);
  const [monthlyJobs, setMonthlyJobs] = useState([]);

  // Fetch analytics data from backend
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setIsLoading(true);
        setError(null);

        const analyticsData = await AnalyticsApi.getRecruiterAnalytics();

        setStats(analyticsData.stats);
        setMonthlyHiring(analyticsData.monthlyHiring);
        setMonthlyJobs(analyticsData.monthlyJobs);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const pieData = [
    { name: "Active", value: stats.totalActive },
    { name: "Inactive", value: stats.totalInactive },
    { name: "Total", value: stats.totalPostings },
  ];

  const handleGoBack = () => {
    navigate(-1); // 👈 go to previous page
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-2 sm:px-4 md:px-6 lg:px-8 w-full">
        <button onClick={handleGoBack} className="flex items-center text-sm text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Go Back
        </button>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-2 sm:px-4 md:px-6 lg:px-8 w-full">
        <button onClick={handleGoBack} className="flex items-center text-sm text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Go Back
        </button>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-2 sm:px-4 md:px-6 lg:px-8 w-full">
      {/* ⬅️ Back Button */}
      <button onClick={handleGoBack} className="flex items-center text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Go Back
      </button>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Recruiter Analytics</h1>
      {/* Stat Boxes */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 mb-8 w-full">
        <div className={statBoxStyle + " w-full sm:w-1/3 min-w-0"}>
          <span className="text-3xl font-bold text-blue-600">{stats.totalPostings}</span>
          <span className="mt-2 text-gray-600">Total Postings</span>
        </div>
        <div className={statBoxStyle + " w-full sm:w-1/3 min-w-0"}>
          <span className="text-3xl font-bold text-green-600">{stats.totalActive}</span>
          <span className="mt-2 text-gray-600">Active Postings</span>
        </div>
        <div className={statBoxStyle + " w-full sm:w-1/3 min-w-0"}>
          <span className="text-3xl font-bold text-orange-500">{stats.totalHired}</span>
          <span className="mt-2 text-gray-600">Total Hired</span>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
        {/* Bar Chart: Month-wise Hiring */}
        <div className="w-full overflow-x-auto">
          <Card className="p-4 min-w-[320px]">
            <h2 className="text-lg font-semibold mb-4">Month-wise Hiring Report</h2>
            <ResponsiveContainer width="100%" height={250} minWidth={320}>
              <BarChart data={monthlyHiring} margin={{ left: 0, right: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-40} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="hired" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        {/* Bar Chart: Month-wise Jobs Posted */}
        <div className="w-full overflow-x-auto">
          <Card className="p-4 min-w-[320px]">
            <h2 className="text-lg font-semibold mb-4">Month-wise Jobs Posted</h2>
            <ResponsiveContainer width="100%" height={250} minWidth={320}>
              <BarChart data={monthlyJobs} margin={{ left: 0, right: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-40} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="jobs" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        {/* Pie Chart: Postings Status */}
        <div className="w-full col-span-1 md:col-span-2 flex justify-center overflow-x-auto">
          <Card className="p-4 w-full max-w-xl min-w-[320px]">
            <h2 className="text-lg font-semibold mb-4">Postings Status</h2>
            <ResponsiveContainer width="100%" height={300} minWidth={320}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
