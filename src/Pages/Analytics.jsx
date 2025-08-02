// BACKEND INTEGRATION NOTE:
// Expected endpoint: GET /api/recruiter/analytics
// Response: {
//   stats: { totalPostings: number, totalActive: number, totalHired: number, totalInactive: number },
//   monthlyHiring: Array<{ month: string, hired: number }>,
//   monthlyJobs: Array<{ month: string, jobs: number }>
// }
import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ArrowLeft } from "lucide-react";

const COLORS = ["#2563eb", "#22c55e", "#f59e42"];

const statBoxStyle = "flex-1 bg-white rounded-xl shadow p-2 flex flex-col items-center justify-center min-w-[180px]";

export default function Analytics() {
  // Placeholder state for stats and chart data
  const [stats, setStats] = useState({
    totalPostings: 31,
    totalActive: 15,
    totalHired: 31,
    totalInactive: 16,
  });
  const [monthlyHiring, setMonthlyHiring] = useState([
    { month: "Jan", hired: 2 },
    { month: "Feb", hired: 1 },
    { month: "Mar", hired: 2 },
    { month: "Apr", hired: 1 },
    { month: "May", hired: 2 },
    { month: "Jun", hired: 2 },
    { month: "Jul", hired: 3 },
    { month: "Aug", hired: 5 },
    { month: "Sep", hired: 4 },
    { month: "Oct", hired: 6 },
    { month: "Nov", hired: 2 },
    { month: "Dec", hired: 1 },
  ]);
  const [monthlyJobs, setMonthlyJobs] = useState([
    { month: "Jan", jobs: 4 },
    { month: "Feb", jobs: 2 },
    { month: "Mar", jobs: 1 },
    { month: "Apr", jobs: 3 },
    { month: "May", jobs: 2 },
    { month: "Jun", jobs: 1 },
    { month: "Jul", jobs: 2 },
    { month: "Aug", jobs: 3 },
    { month: "Sep", jobs: 1 },
    { month: "Oct", jobs: 1 },
    { month: "Nov", jobs: 3 },
    { month: "Dec", jobs: 8 },
  ]);

  // Example backend integration (uncomment and update endpoint when backend is ready)
  // useEffect(() => {
  //   async function fetchAnalytics() {
  //     const jwt = localStorage.getItem("jwt");
  //     // Call the backend API to get analytics data for the recruiter
  //     // Endpoint: /api/recruiter/analytics (see top of file for expected response)
  //     const res = await axiosInstance.get("/api/recruiter/analytics", {
  //       headers: { Authorization: `Bearer ${jwt}` },
  //     });
  //     setStats(res.data.stats);
  //     setMonthlyHiring(res.data.monthlyHiring);
  //     setMonthlyJobs(res.data.monthlyJobs);
  //   }
  //   fetchAnalytics();
  // }, []);

  const pieData = [
    { name: "Active", value: stats.totalActive },
    { name: "Inactive", value: stats.totalInactive },
    { name: "Total", value: stats.totalPostings },
  ];

  const handleGoBack = () => {
    navigate(-1); // 👈 go to previous page
  };

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
