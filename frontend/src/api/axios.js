// Import axios library.
import axios from 'axios';

// Create axios instance with base URL from environment.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000
});

// Request interceptor injecting JWT bearer token from sessionStorage if present.
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor automatically handling 401 authorization expiry and formatting error messages.
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // If unauthorized, clear local state session storage and redirect to login.
      if (error.response.status === 401) {
        sessionStorage.clear();
        // Avoid infinite redirects if already on login or public pages
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/register' && path !== '/') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error.response.data.message || 'Something went wrong.');
    }
    return Promise.reject(error.message || 'Network connectivity error.');
  }
);

// Export api client.
export default api;
