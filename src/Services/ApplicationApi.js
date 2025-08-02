
const API_URL = '/api/applications';

const headers = {
  'Content-Type': 'application/json'
};

// Status mapping from frontend to backend
const statusMapping = {
  'reviewing': 'reviewed',
  'interviewed': 'shortlisted', 
  'accepted': 'hired'
};

const ApplicationApi = {
  async list() {
    try {
      const jwt = localStorage.getItem("jwt");
      const adminToken = localStorage.getItem("admin-token");
      
      const requestHeaders = {
        ...headers,
        "x-admin-auth": "true",
        Authorization: `Bearer ${adminToken || jwt || 'dummy-token'}`,
      };

      console.log("Making request to:", API_URL);
      console.log("Headers:", requestHeaders);

      const response = await fetch(API_URL, { 
        headers: requestHeaders 
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Failed to fetch applications: ${response.status} - ${errorText}`);
      }
      
      const json = await response.json();
      console.log("API Response:", json);
      return json || [];
    } catch (error) {
      console.error("ApplicationApi.list error:", error);
      return [];
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

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(applicationData),
      });
      
      console.log("Create response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create API Error:", errorText);
        throw new Error(`Failed to create application: ${response.status} - ${errorText}`);
      }
      
      const json = await response.json();
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
        Authorization: `Bearer ${adminToken || jwt || 'dummy-token'}`,
      };

      // Map status if it's in the mapping
      const mappedData = { ...data };
      if (data.status && statusMapping[data.status]) {
        mappedData.status = statusMapping[data.status];
        console.log(`Mapping status from '${data.status}' to '${mappedData.status}'`);
      }

      const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify(mappedData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update application: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("ApplicationApi.update error:", error);
      throw error;
    }
  }
};

export default ApplicationApi;

