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
  },
  withCredentials: true, // Enable cookies for CSRF token
});

// CSRF token management
let csrfToken: string | null = null;

// Utility function to get CSRF token from cookies
const getCsrfTokenFromCookies = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
  if (csrfCookie) {
    return decodeURIComponent(csrfCookie.split('=')[1]);
  }
  return null;
};

// Function to fetch CSRF token from Laravel Sanctum
export const fetchCsrfToken = async (): Promise<string> => {
  // Check if we already have a token
  const existingToken = csrfToken || getCsrfTokenFromCookies();
  if (existingToken) {
    csrfToken = existingToken;
    return existingToken;
  }

  try {
    // Fetch CSRF token from Laravel Sanctum
    // Use the base domain without /api/v1 for Sanctum endpoints
    const sanctumUrl = API_BASE_URL.replace('/api/v1', '').replace('/api', '');
    await axios.get(`${sanctumUrl}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
    
    // Extract the CSRF token from cookies
    const token = getCsrfTokenFromCookies();
    if (token) {
      csrfToken = token;
      return token;
    }
    
    throw new Error('Failed to fetch CSRF token');
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw new Error('Failed to fetch CSRF token');
  }
};

// Request interceptor to add auth token and CSRF token
apiClient.interceptors.request.use(
  async (config) => {
    // Check for both admin and student tokens
    const adminToken = localStorage.getItem("auth_token");
    const studentToken = localStorage.getItem("student_token");
    const token = adminToken || studentToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token for non-GET requests (POST, PUT, DELETE, etc.)
    if (config.method && config.method !== 'get' && config.method !== 'GET') {
      try {
        const csrfToken = await fetchCsrfToken();
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      } catch (error) {
        console.warn('Failed to fetch CSRF token:', error);
      }
    }

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
    
    // Handle CORS errors
    if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS')) {
      console.error('CORS Error - Check backend CORS configuration');
    }
    
    // Handle CSRF token errors
    if (error.response?.status === 419) {
      console.error('CSRF Token Error - Token may be invalid or expired');
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
