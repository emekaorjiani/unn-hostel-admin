import { apiClient } from "./api";

// Authentication types based on backend OpenAPI schema
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface MatricLoginCredentials {
  matricNumber: string;
  password: string;
}

export interface BackendUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role:
    | "student"
    | "hall_admin"
    | "bursary"
    | "maintenance"
    | "security"
    | "super_admin";
  matric_number?: string;
  status: "active" | "inactive" | "suspended" | "pending_verification";
}

export interface BackendAuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    expires_in: number;
    user: BackendUser;
  };
}

// Frontend types for compatibility
export interface AdminProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "super_admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  matricNumber: string;
  role: "student";
  isActive: boolean;
  department?: string;
  level?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  admin?: AdminProfile;
  student?: StudentProfile;
}

// Authentication service
export const authService = {
  // Login admin user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log("Admin login - calling /auth/login endpoint");
      console.log("Admin login credentials:", { email: credentials.email, password: "***" });
      
      const response = await apiClient.post<BackendAuthResponse>(
        "/auth/login",
        {
          login_type: "admin",
          email: credentials.email,
          password: credentials.password
        }
      );

      console.log("Backend response:", response.data);

      const backendResponse = response.data;

      if (!backendResponse.success || !backendResponse.data.token) {
        throw new Error("Access token not found in response");
      }

      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("auth_token", backendResponse.data.token);
      }

      // Convert backend user to frontend admin profile format
      const adminProfile: AdminProfile = {
        id: backendResponse.data.user.id,
        email: backendResponse.data.user.email,
        firstName: backendResponse.data.user.first_name,
        lastName: backendResponse.data.user.last_name,
        role:
          backendResponse.data.user.role === "super_admin" ? "super_admin" : "admin",
        isActive: backendResponse.data.user.status === "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem("admin_profile", JSON.stringify(adminProfile));
      }

      return {
        accessToken: backendResponse.data.token,
        admin: adminProfile,
      };
    } catch (error: unknown) {
      console.error("Login error:", error);
      
      // Log detailed error information
      if (error && typeof error === 'object' && 'response' in error && error.response) {
        const response = error.response as any;
        console.error("Error response status:", response.status);
        console.error("Error response data:", response.data);
        console.error("Error response headers:", response.headers);
        
        if (response.data && typeof response.data === 'object') {
          if ('message' in response.data) {
            throw new Error(String(response.data.message));
          } else if ('errors' in response.data && Array.isArray(response.data.errors)) {
            throw new Error(`Validation errors: ${response.data.errors.join(', ')}`);
          } else {
            throw new Error(`API Error: ${JSON.stringify(response.data)}`);
          }
        }
      }
      
      throw new Error("Login failed. Please check your credentials.");
    }
  },

  // Login student with matric number
  async loginWithMatric(
    credentials: MatricLoginCredentials
  ): Promise<LoginResponse> {
    try {
      console.log("Student login - calling /auth/login endpoint");
      console.log("Student login credentials:", { matricNumber: credentials.matricNumber, password: "***" });
      
      const response = await apiClient.post<BackendAuthResponse>(
        "/v1/auth/login",
        {
          login_type: "student",
          matric_number: credentials.matricNumber,
          password: credentials.password
        }
      );

      console.log("Backend response:", response.data);

      const backendResponse = response.data;

      if (!backendResponse.success || !backendResponse.data.token) {
        throw new Error("Access token not found in response");
      }

      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("student_token", backendResponse.data.token);
      }

      // Convert backend user to frontend student profile format
      const studentProfile: StudentProfile = {
        id: backendResponse.data.user.id,
        email: backendResponse.data.user.email,
        firstName: backendResponse.data.user.first_name,
        lastName: backendResponse.data.user.last_name,
        matricNumber:
          backendResponse.data.user.matric_number || credentials.matricNumber,
        role: "student",
        isActive: backendResponse.data.user.status === "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem("student_profile", JSON.stringify(studentProfile));
      }

      return {
        accessToken: backendResponse.data.token,
        student: studentProfile,
      };
    } catch (error: unknown) {
      console.error("Student login error:", error);
      
      // Log detailed error information
      if (error && typeof error === 'object' && 'response' in error && error.response) {
        const response = error.response as any;
        console.error("Error response status:", response.status);
        console.error("Error response data:", response.data);
        console.error("Error response headers:", response.headers);
        
        if (response.data && typeof response.data === 'object') {
          if ('message' in response.data) {
            throw new Error(String(response.data.message));
          } else if ('errors' in response.data && Array.isArray(response.data.errors)) {
            throw new Error(`Validation errors: ${response.data.errors.join(', ')}`);
          } else {
            throw new Error(`API Error: ${JSON.stringify(response.data)}`);
          }
        }
      }
      
      throw new Error("Login failed. Please check your credentials.");
    }
  },

  // Comprehensive logout method that tries all possible endpoints
  async tryLogoutEndpoints(userType: 'admin' | 'student', userId?: string): Promise<void> {
    const endpoints = [
      // Try with user ID first
      ...(userId ? [
        `POST /auth/logout/${userType}/${userId}`,
        `GET /auth/logout/${userType}/${userId}`,
      ] : []),
      // Try generic endpoints
      'POST /auth/logout',
      'GET /auth/logout',
      // Try v1 endpoints
      'POST /v1/auth/logout',
      'GET /v1/auth/logout',
      // Try user-specific without type
      ...(userId ? [
        `POST /auth/logout/${userId}`,
        `GET /auth/logout/${userId}`,
      ] : []),
    ];

    for (const endpoint of endpoints) {
      try {
        const [method, path] = endpoint.split(' ');
        if (method === 'POST') {
          await apiClient.post(path);
          console.log(`Logout successful with ${endpoint}`);
          return; // Success, exit early
        } else if (method === 'GET') {
          await apiClient.get(path);
          console.log(`Logout successful with ${endpoint}`);
          return; // Success, exit early
        }
      } catch (error) {
        console.warn(`Logout failed with ${endpoint}:`, error);
        // Continue to next endpoint
      }
    }
    
    console.warn('All logout endpoints failed, proceeding with local logout');
  },

  // Logout admin user
  async logout(): Promise<void> {
    try {
      // Get admin profile to get the user ID
      const adminProfile = this.getStoredProfile();
      const userId = adminProfile?.id;
      
      // Try all possible logout endpoints
      await this.tryLogoutEndpoints('admin', userId);
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with local logout even if API fails
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("admin_profile");
      }
    }
  },

  // Logout student
  async logoutStudent(): Promise<void> {
    try {
      // Get student profile to get the user ID
      const studentProfile = this.getStoredStudentProfile();
      const userId = studentProfile?.id;
      
      // Try all possible logout endpoints
      await this.tryLogoutEndpoints('student', userId);
    } catch (error) {
      console.error("Student logout API error:", error);
      // Continue with local logout even if API fails
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("student_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("student_profile");
      }
    }
  },

  // Get current admin profile
  async getProfile(): Promise<AdminProfile> {
    const response = await apiClient.get<BackendUser>("/auth/profile");

    const backendUser = response.data;
    const adminProfile: AdminProfile = {
      id: backendUser.id,
      email: backendUser.email,
      firstName: backendUser.first_name || backendUser.email.split('@')[0], // Fallback to email prefix
      lastName: backendUser.last_name || 'User', // Fallback to 'User'
      role: backendUser.role === "super_admin" ? "super_admin" : "admin",
      isActive: backendUser.status === "active" || true, // Default to active if not provided
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store the profile in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("admin_profile", JSON.stringify(adminProfile));
    }
    return adminProfile;
  },

  // Get current student profile
  async getStudentProfile(): Promise<StudentProfile> {
    const response = await apiClient.get<BackendUser>("/auth/profile");

    const backendUser = response.data;
    const studentProfile: StudentProfile = {
      id: backendUser.id,
      email: backendUser.email,
      firstName: backendUser.first_name || backendUser.email.split('@')[0], // Fallback to email prefix
      lastName: backendUser.last_name || 'Student', // Fallback to 'Student'
      matricNumber: backendUser.matric_number || "",
      role: "student",
      isActive: backendUser.status === "active" || true, // Default to active if not provided
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store the profile in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("student_profile", JSON.stringify(studentProfile));
    }
    return studentProfile;
  },

  // Update admin profile
  async updateProfile(
    profileData: Partial<AdminProfile>
  ): Promise<AdminProfile> {
    const response = await apiClient.put<BackendUser>(
      "/auth/profile",
      profileData
    );

    const backendUser = response.data;
    const updatedProfile: AdminProfile = {
      id: backendUser.id,
      email: backendUser.email,
      firstName: backendUser.first_name,
      lastName: backendUser.last_name,
      role: backendUser.role === "super_admin" ? "super_admin" : "admin",
      isActive: backendUser.status === "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem("admin_profile", JSON.stringify(updatedProfile));
    }
    return updatedProfile;
  },

  // Refresh JWT token
  async refreshToken(): Promise<{ accessToken: string }> {
    if (typeof window === 'undefined') {
      throw new Error("Cannot refresh token on server side");
    }
    
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post<{ access_token: string }>(
      "/auth/refresh",
      {
        refreshToken,
      }
    );

    const { access_token } = response.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem("auth_token", access_token);
    }

    return { accessToken: access_token };
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem("auth_token");
    return !!token;
  },

  // Check if student is authenticated
  isStudentAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem("student_token");
    return !!token;
  },

  // Get stored admin profile
  getStoredProfile(): AdminProfile | null {
    if (typeof window === 'undefined') return null;
    const profile = localStorage.getItem("admin_profile");
    return profile ? JSON.parse(profile) : null;
  },

  // Get stored student profile
  getStoredStudentProfile(): StudentProfile | null {
    if (typeof window === 'undefined') return null;
    const profile = localStorage.getItem("student_profile");
    return profile ? JSON.parse(profile) : null;
  },

  // Get access token
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("auth_token");
  },

  // Get student access token
  getStudentAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("student_token");
  },
};
