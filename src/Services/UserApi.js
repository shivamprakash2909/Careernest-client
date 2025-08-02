import { axiosInstance } from "@/lib/axios";

// Use a simple approach for API base URL that works in browser

class UserApi {
  static async me() {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axiosInstance.get(`/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!(response.status === 200 || response.status === 201)) {
        throw new Error("Failed to fetch user profile");
      }

      const data = response.data;
      return data.user; // Extract user from the response
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Return user data from localStorage as fallback
      const userStr = localStorage.getItem("user");
      if (userStr && userStr !== "undefined") {
        return JSON.parse(userStr);
      }
      throw error;
    }
  }

  static async updateProfile(userData) {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axiosInstance.put(`/api/user/profile`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!(response.status === 200 || response.status === 201)) {
        throw new Error("Failed to update user profile");
      }

      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
}

export default UserApi;
