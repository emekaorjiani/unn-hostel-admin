import axios from "axios";
import { config } from "./config";

// API base configuration
const API_BASE_URL = config.backend.baseUrl;

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: config.backend.timeout,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  // Disable automatic request transformation
  transformRequest: [(data) => {
    if (data) {
      return JSON.stringify(data);
    }
    return data;
  }],
  // Force axios to send requests as-is
  withCredentials: false,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Ensure Accept header is set for all requests
    config.headers.Accept = "application/json";
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    
    // Add cache-busting header
    config.headers["Cache-Control"] = "no-cache";
    
    // Check for both admin and student tokens
    const adminToken = localStorage.getItem("auth_token");
    const studentToken = localStorage.getItem("student_token");
    const token = adminToken || studentToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug: Log the request headers
    console.log("Request headers:", config.headers);
    console.log("Request URL:", config.url);
    console.log("Request method:", config.method);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - let individual services handle the redirect
      // Don't automatically redirect here to avoid conflicts
      console.warn("401 Unauthorized - Service should handle redirect");
    }
    return Promise.reject(error);
  }
);

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Simple error handling utility
export const handleApiError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
    return String(error.response.data.message);
  }
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return "An unexpected error occurred";
};
