import { axiosInstance } from "@/lib/axios";

const API_URL = "/api/applications";

const headers = {
  "Content-Type": "application/json",
};

// Status mapping from frontend to backend
const statusMapping = {
  reviewing: "reviewed",
  interviewed: "shortlisted",
  accepted: "hired",
};

const ApplicationApi = {
  async list({ applicant_email, recruiter_email } = {}) {
    try {
      const jwt = localStorage.getItem("jwt");
      const adminToken = localStorage.getItem("admin-token");

      const requestHeaders = {
        ...headers,
        "x-admin-auth": "true",
        Authorization: `Bearer ${adminToken || jwt || "dummy-token"}`,
      };

      const params = {};
      if (applicant_email) params.applicant_email = applicant_email;
      if (recruiter_email) params.recruiter_email = recruiter_email;

      // console.log("Making request to:", API_URL);
      // console.log("Headers:", requestHeaders);
      // console.log("Query Params:", params);

      const response = await axiosInstance.get(API_URL, {
        headers: requestHeaders,
        params,
      });

      // console.log("Response status:", response.status);

      if (!(response.status === 200 || response.status === 201)) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Failed to fetch applications: ${response.status} - ${errorText}`);
      }

      const json = response.data;
      // console.log("API Response:", json);
      return json || [];
    } catch (error) {
      console.error("ApplicationApi.list error:", error);
      return [];
    }
  },

  async check(params) {
    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return false;

      const response = await axiosInstance.get(`${API_URL}/check`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${jwt}`,
        },
        params,
      });

      return response.data.hasApplied;
    } catch (error) {
      console.error("ApplicationApi.check error:", error);
      return false;
    }
  },

  async create(applicationData) {
    try {
      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        throw new Error("User not authenticated");
      }

      const requestHeaders = {
        ...headers,
        Authorization: `Bearer ${jwt}`,
      };

      console.log("Creating application with data:", applicationData);

      const response = await axiosInstance.post(API_URL, applicationData, {
        headers: requestHeaders,
      });

      console.log("Create response status:", response.status);

      if (!(response.status === 200 || response.status === 201)) {
        const errorText = await response.text();
        console.error("Create API Error:", errorText);
        throw new Error(`Failed to create application: ${response.status} - ${errorText}`);
      }

      const json = response.data;
      console.log("Create API Response:", json);
      return json;
    } catch (error) {
      console.error("ApplicationApi.create error:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const jwt = localStorage.getItem("jwt");
      const adminToken = localStorage.getItem("admin-token");

      const requestHeaders = {
        ...headers,
        "x-admin-auth": "true",
        Authorization: `Bearer ${adminToken || jwt || "dummy-token"}`,
      };

      // Map status if it's in the mapping
      const mappedData = { ...data };
      if (data.status && statusMapping[data.status]) {
        mappedData.status = statusMapping[data.status];
        console.log(`Mapping status from '${data.status}' to '${mappedData.status}'`);
      }

      const response = await axiosInstance.patch(`${API_URL}/${id}/status`, mappedData, {
        headers: requestHeaders,
      });

      if (!(response.status === 200 || response.status === 201)) {
        const errorText = await response.text();
        throw new Error(`Failed to update application: ${response.status} - ${errorText}`);
      }

      return response.data;
    } catch (error) {
      console.error("ApplicationApi.update error:", error);
      throw error;
    }
  },

  // Get applications for recruiter's posted jobs and internships
  async getRecruiterApplications({ status, application_type } = {}) {
    try {
      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        throw new Error("User not authenticated");
      }

      const requestHeaders = {
        ...headers,
        Authorization: `Bearer ${jwt}`,
      };

      const params = {};
      if (status) params.status = status;
      if (application_type) params.application_type = application_type;

      console.log("Making request to recruiter applications:", `${API_URL}/recruiter/applications`);
      console.log("Headers:", requestHeaders);
      console.log("Query Params:", params);

      const response = await axiosInstance.get(`${API_URL}/recruiter/applications`, {
        headers: requestHeaders,
        params,
      });

      console.log("Response status:", response.status);

      if (!(response.status === 200 || response.status === 201)) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Failed to fetch recruiter applications: ${response.status} - ${errorText}`);
      }

      const json = response.data;
      console.log("API Response:", json);
      return json || [];
    } catch (error) {
      console.error("ApplicationApi.getRecruiterApplications error:", error);
      return [];
    }
  },
};

export default ApplicationApi;
