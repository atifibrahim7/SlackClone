// Simple authentication service for React Native app
const API_BASE_URL = 'https://clean-things-enjoy.loca.lt'; // Update with your tunnel URL

class SimpleAuthService {
  // Simple login - creates user if doesn't exist
  async login(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      return result.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Check API health
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

export default new SimpleAuthService();

