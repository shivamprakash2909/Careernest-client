import { axiosInstance } from "@/lib/axios";

// Use a simple approach for API base URL that works in browser

class JobApi {
  static async create(jobData) {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axiosInstance.post(`/api/jobs`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!(response.status === 200 || response.status === 201)) {
        throw new Error("Failed to create job");
      }

      return response.data;
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  }

  static async filter(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          queryParams.append(key, filters[key]);
        }
      });

      const token = localStorage.getItem("jwt");
      const headers = {
        "Content-Type": "application/json",
      };

      // Add JWT token if available (for recruiter requests)
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axiosInstance.get(`/api/jobs?${queryParams}`, {
        headers,
      });

      if (!(response.status === 200 || response.status === 201)) {
        throw new Error("Failed to fetch jobs");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  }

  static async getById(jobId) {
    try {
      const token = localStorage.getItem("jwt");
      const headers = {
        "Content-Type": "application/json",
      };

      // Add JWT token if available (for recruiter requests)
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axiosInstance.get(`/api/jobs/${jobId}`, {
        headers,
      });

      if (!(response.status === 200 || response.status === 201)) {
        throw new Error("Failed to fetch job");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching job:", error);
      throw error;
    }
  }

  static async update(jobId, jobData) {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axiosInstance.put(`/api/jobs/${jobId}`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!(response.status === 200 || response.status === 201)) {
        throw new Error("Failed to update job");
      }

      return response.data;
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    }
  }

  static async delete(jobId) {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axiosInstance.delete(`/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!(response.status === 200 || response.status === 201)) {
        throw new Error("Failed to delete job");
      }

      return response.data;
    } catch (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  }
}

export default JobApi;
