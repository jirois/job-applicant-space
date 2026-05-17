import axios from "axios";

// Base axios instance -- all API calls go through this.
// Centralizing here means we change the base URL in one place,
// not scattered across every component.

const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
});

// Request interceptor -- attaches JWT to every outgoing request.
// Components never touch localStorage for the token directly.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Response interceptor -- globally handles 401 (token expired/invalid).
// Clears storage and redirects to login without every component handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
