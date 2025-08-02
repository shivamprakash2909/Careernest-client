export async function fetchInternshipsFromAPI() {
  try {
    const adminToken = localStorage.getItem("admin-token");
    console.log("Fetching internships with admin token:", adminToken);
    
    const response = await fetch("/api/jobs/internships", {
      headers: {
        "Content-Type": "application/json",
        "x-admin-auth": "true",
        Authorization: `Bearer ${adminToken || 'dummy-token'}`,
      },
    });
    
    console.log("Internship API response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Internship API Error:", errorText);
      throw new Error(`Failed to fetch internships: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Internship API response:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchInternshipsFromAPI:", error);
    return [];
  }
}

// Add method to fetch internships with filters for recruiters
export async function fetchInternships(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        queryParams.append(key, filters[key]);
      }
    });

    const jwt = localStorage.getItem("jwt");
    const headers = {
      "Content-Type": "application/json",
    };

    // Add JWT token if available (for recruiter requests)
    if (jwt) {
      headers["Authorization"] = `Bearer ${jwt}`;
    }

    const response = await fetch(`/api/jobs/internships?${queryParams}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch internships");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching internships:", error);
    throw error;
  }
}

// Create new internship
export async function createInternship(internshipData) {
  try {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(internshipData),
    });

    if (!response.ok) {
      throw new Error("Failed to create internship");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating internship:", error);
    throw error;
  }
}

// Update internship
export async function updateInternship(internshipId, updateData) {
  try {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch(`/api/jobs/internships/${internshipId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error("Failed to update internship");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating internship:", error);
    throw error;
  }
}

// Delete internship
export async function deleteInternship(internshipId) {
  try {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch(`/api/jobs/internships/${internshipId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete internship");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting internship:", error);
    throw error;
  }
}

export async function updateInternshipStatus(entityId, status) {
  const adminToken = localStorage.getItem("admin-token");
  const response = await fetch(`/api/jobs/internships/${entityId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-auth": "true",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status }),
  });
  return response.json();
}
