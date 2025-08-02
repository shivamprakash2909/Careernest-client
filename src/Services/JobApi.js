// Use a simple approach for API base URL that works in browser
const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

class JobApi {
  static async create(jobData) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  static async filter(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          queryParams.append(key, filters[key]);
        }
      });

      const token = localStorage.getItem('jwt');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add JWT token if available (for recruiter requests)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/jobs?${queryParams}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  static async getById(jobId) {
    try {
      const token = localStorage.getItem('jwt');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add JWT token if available (for recruiter requests)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  }

  static async update(jobId, jobData) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  static async delete(jobId) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }
}

export default JobApi; 