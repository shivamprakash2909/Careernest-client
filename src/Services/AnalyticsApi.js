import { axiosInstance } from "@/lib/axios";

class AnalyticsApi {
  static async getRecruiterAnalytics() {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axiosInstance.get(`/api/jobs/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!(response.status === 200 || response.status === 201)) {
        throw new Error("Failed to fetch analytics data");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  }
}

export default AnalyticsApi;
