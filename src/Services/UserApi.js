// Use a simple approach for API base URL that works in browser
const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

class UserApi {
  static async me() {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      return data.user; // Extract user from the response
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Return user data from localStorage as fallback
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'undefined') {
        return JSON.parse(userStr);
      }
      throw error;
    }
  }

  static async updateProfile(userData) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

export default UserApi; 