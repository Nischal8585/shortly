import axios from 'axios';

// Get base URL from environment or default to backend API path
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject Bearer JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shortly_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 Unauthorized and clear token storage
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('shortly_auth_token');
    }
    return Promise.reject(error);
  }
);

export default api;
