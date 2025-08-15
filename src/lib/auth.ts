import { apiClient, fetchCsrfToken } from "./api";

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
  firstName: string;
  lastName: string;
  role:
    | "student"
    | "hall_admin"
    | "bursary"
    | "maintenance"
    | "security"
    | "super_admin";
  matricNumber?: string;
  status: "active" | "inactive" | "suspended" | "pending_verification";
}

export interface BackendAuthResponse {
  access_token: string;
  user: BackendUser;
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
      // Fetch CSRF token before login
      await fetchCsrfToken();
      
      const response = await apiClient.post<BackendAuthResponse>(
        "/auth/login",
        credentials
      );

      console.log("Backend response:", response.data);

      const backendResponse = response.data;

      if (!backendResponse.access_token) {
        throw new Error("Access token not found in response");
      }

      // Store tokens in localStorage
      localStorage.setItem("auth_token", backendResponse.access_token);

      // Convert backend user to frontend admin profile format
      const adminProfile: AdminProfile = {
        id: backendResponse.user.id,
        email: backendResponse.user.email,
        firstName: backendResponse.user.firstName,
        lastName: backendResponse.user.lastName,
        role:
          backendResponse.user.role === "super_admin" ? "super_admin" : "admin",
        isActive: backendResponse.user.status === "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("admin_profile", JSON.stringify(adminProfile));

      return {
        accessToken: backendResponse.access_token,
        admin: adminProfile,
      };
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        throw new Error(String(error.response.data.message));
      }
      throw new Error("Login failed. Please check your credentials.");
    }
  },

  // Login student with matric number
  async loginWithMatric(
    credentials: MatricLoginCredentials
  ): Promise<LoginResponse> {
    try {
      // Fetch CSRF token before login
      await fetchCsrfToken();
      
      const response = await apiClient.post<BackendAuthResponse>(
        "/auth/login/matric",
        credentials
      );

      console.log("Backend response:", response.data);

      const backendResponse = response.data;

      if (!backendResponse.access_token) {
        throw new Error("Access token not found in response");
      }

      // Store tokens in localStorage
      localStorage.setItem("student_token", backendResponse.access_token);

      // Convert backend user to frontend student profile format
      const studentProfile: StudentProfile = {
        id: backendResponse.user.id,
        email: backendResponse.user.email,
        firstName: backendResponse.user.firstName,
        lastName: backendResponse.user.lastName,
        matricNumber:
          backendResponse.user.matricNumber || credentials.matricNumber,
        role: "student",
        isActive: backendResponse.user.status === "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("student_profile", JSON.stringify(studentProfile));

      return {
        accessToken: backendResponse.access_token,
        student: studentProfile,
      };
    } catch (error: unknown) {
      console.error("Student login error:", error);
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        throw new Error(String(error.response.data.message));
      }
      throw new Error("Login failed. Please check your credentials.");
    }
  },

  // Logout admin user
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("admin_profile");
    }
  },

  // Logout student
  async logoutStudent(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Student logout API error:", error);
    } finally {
      localStorage.removeItem("student_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("student_profile");
    }
  },

  // Get current admin profile
  async getProfile(): Promise<AdminProfile> {
    const response = await apiClient.get<BackendUser>("/auth/profile");

    const backendUser = response.data;
    const adminProfile: AdminProfile = {
      id: backendUser.id,
      email: backendUser.email,
      firstName: backendUser.firstName || backendUser.email.split('@')[0], // Fallback to email prefix
      lastName: backendUser.lastName || 'User', // Fallback to 'User'
      role: backendUser.role === "super_admin" ? "super_admin" : "admin",
      isActive: backendUser.status === "active" || true, // Default to active if not provided
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store the profile in localStorage
    localStorage.setItem("admin_profile", JSON.stringify(adminProfile));
    return adminProfile;
  },

  // Get current student profile
  async getStudentProfile(): Promise<StudentProfile> {
    const response = await apiClient.get<BackendUser>("/auth/profile");

    const backendUser = response.data;
    const studentProfile: StudentProfile = {
      id: backendUser.id,
      email: backendUser.email,
      firstName: backendUser.firstName || backendUser.email.split('@')[0], // Fallback to email prefix
      lastName: backendUser.lastName || 'Student', // Fallback to 'Student'
      matricNumber: backendUser.matricNumber || "",
      role: "student",
      isActive: backendUser.status === "active" || true, // Default to active if not provided
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store the profile in localStorage
    localStorage.setItem("student_profile", JSON.stringify(studentProfile));
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
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      role: backendUser.role === "super_admin" ? "super_admin" : "admin",
      isActive: backendUser.status === "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("admin_profile", JSON.stringify(updatedProfile));
    return updatedProfile;
  },

  // Refresh JWT token
  async refreshToken(): Promise<{ accessToken: string }> {
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
    localStorage.setItem("auth_token", access_token);

    return { accessToken: access_token };
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem("auth_token");
    return !!token;
  },

  // Check if student is authenticated
  isStudentAuthenticated(): boolean {
    const token = localStorage.getItem("student_token");
    return !!token;
  },

  // Get stored admin profile
  getStoredProfile(): AdminProfile | null {
    const profile = localStorage.getItem("admin_profile");
    return profile ? JSON.parse(profile) : null;
  },

  // Get stored student profile
  getStoredStudentProfile(): StudentProfile | null {
    const profile = localStorage.getItem("student_profile");
    return profile ? JSON.parse(profile) : null;
  },

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  // Get student access token
  getStudentAccessToken(): string | null {
    return localStorage.getItem("student_token");
  },
};
