const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async logout() {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
};
