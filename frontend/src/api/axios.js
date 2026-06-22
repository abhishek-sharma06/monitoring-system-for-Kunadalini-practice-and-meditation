import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 15000
});

// Request interceptor - attach JWT token from sessionStorage.
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors and format error messages.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error or server unreachable (no response received)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject('Request timed out. Please try again.');
      }
      return Promise.reject('Unable to connect to server. Please check if the server is running.');
    }

    const { status, data } = error.response;

    // 401 - Unauthorized: clear session and redirect
    if (status === 401) {
      sessionStorage.clear();
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/login/user' && path !== '/login/admin' &&
          path !== '/register' && path !== '/' && path !== '/verify-email') {
        window.location.href = '/login/user';
      }
    }

    // Extract the server's error message, or fall back to a generic one
    const serverMessage = data?.message;
    if (serverMessage) {
      return Promise.reject(serverMessage);
    }

    // Fallback messages based on status code
    const fallbackMessages = {
      400: 'Invalid request. Please check your input.',
      401: 'Unauthorized. Please log in again.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      429: 'Too many requests. Please try again later.',
      500: 'Server error. Please try again later.',
    };

    return Promise.reject(fallbackMessages[status] || 'Something went wrong. Please try again.');
  }
);

export default api;
