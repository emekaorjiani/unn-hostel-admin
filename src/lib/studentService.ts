import { apiClient } from './api';

// Student dashboard data types based on API documentation
export interface StudentProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  matric_number: string;
  phone_number?: string;
  faculty?: string;
  department?: string;
  level?: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  state_of_origin?: string;
  nationality?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Application Window interface for the required field
export interface ApplicationWindow {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  description?: string;
}

// Hostel interface based on actual API response
export interface Hostel {
  id: string;
  name: string;
  type: 'male' | 'female' | 'mixed';
  price: number;
  available: number;
  description: string;
  amenities: string[];
}

export interface StudentApplication {
  id: string;
  hostel_name: string;
  room_type: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  application_date: string;
  amount: number;
  payment_status: 'pending' | 'paid' | 'failed';
}

export interface StudentPayment {
  id: string;
  type: 'rent' | 'deposit' | 'application_fee';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
  method: string;
  reference: string;
  gateway: string;
}

export interface MaintenanceTicket {
  id: string;
  issue: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  resolved_at?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export interface StudentDashboardData {
  profile: StudentProfile;
  applications: StudentApplication[];
  payments: StudentPayment[];
  maintenanceTickets: MaintenanceTicket[];
  notifications: Notification[];
  quickStats: {
    totalApplications: number;
    approvedApplications: number;
    pendingPayments: number;
    activeTickets: number;
    unreadNotifications: number;
  };
}

/**
 * Student service for API calls
 * Provides methods to interact with student-related endpoints
 */
export const studentService = {
  /**
   * Fetches the current student's profile information
   * @returns Promise<StudentProfile> - Student profile data
   */
  async getProfile(): Promise<StudentProfile> {
    const response = await apiClient.get<{ success: boolean; data: StudentProfile }>('/auth/profile');
    return response.data.data;
  },

  // Get student applications
  async getApplications(): Promise<StudentApplication[]> {
    try {
      // Get student profile to get the student ID
      const profile = await this.getProfile();
      const studentId = profile.id;
      
      // Use the correct endpoint structure with student ID
      const response = await apiClient.get<{ success: boolean; data: StudentApplication[] }>(`applications/student/${studentId}`);
      console.log('API Applications response:', response.data);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.warn('Applications endpoint not available, returning empty array');
      return [];
    }
  },

  // Get student payments
  async getPayments(): Promise<StudentPayment[]> {
    try {
      // Get student profile to get the student ID
      const profile = await this.getProfile();
      const studentId = profile.id;
      
      // Use the correct endpoint structure with student ID
      const response = await apiClient.get<{ success: boolean; data: StudentPayment[] }>(`payments/student/${studentId}`);
      console.log('API Payments response:', response.data);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.warn('Payments endpoint not available, returning empty array');
      return [];
    }
  },

  // Get maintenance tickets
  async getMaintenanceTickets(): Promise<MaintenanceTicket[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: MaintenanceTicket[] }>('/maintenance/tickets');
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.warn('Maintenance tickets endpoint not available, returning empty array');
      return [];
    }
  },

  // Get notifications
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Notification[] }>('/notifications');
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.warn('Notifications endpoint not available, returning empty array');
      return [];
    }
  },

  /**
   * Fetches all dashboard data in parallel and calculates quick statistics
   * @returns Promise<StudentDashboardData> - Complete dashboard data with calculated stats
   */
  async getDashboardData(): Promise<StudentDashboardData> {
    try {
      // Fetch all data in parallel for better performance
      const [profile, applications, payments, maintenanceTickets, notifications] = await Promise.all([
        this.getProfile(),
        this.getApplications(),
        this.getPayments(),
        this.getMaintenanceTickets(),
        this.getNotifications(),
      ]);

      // Ensure all data is properly handled as arrays and add null checks
      const safeApplications = Array.isArray(applications) ? applications : [];
      const safePayments = Array.isArray(payments) ? payments : [];
      const safeMaintenanceTickets = Array.isArray(maintenanceTickets) ? maintenanceTickets : [];
      const safeNotifications = Array.isArray(notifications) ? notifications : [];

      // Calculate quick statistics for dashboard display
      const quickStats = {
        totalApplications: safeApplications.length,
        approvedApplications: safeApplications.filter(app => app.status === 'approved').length,
        pendingPayments: safePayments.filter(pay => pay.status === 'pending').length,
        activeTickets: safeMaintenanceTickets.filter(ticket => ticket.status === 'pending' || ticket.status === 'in_progress').length,
        unreadNotifications: safeNotifications.filter(notif => !notif.read).length,
      };

      return {
        profile,
        applications: safeApplications,
        payments: safePayments,
        maintenanceTickets: safeMaintenanceTickets,
        notifications: safeNotifications,
        quickStats,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Return empty data as fallback
      const quickStats = {
        totalApplications: 0,
        approvedApplications: 0,
        pendingPayments: 0,
        activeTickets: 0,
        unreadNotifications: 0,
      };
      
      return {
        profile: {} as StudentProfile,
        applications: [],
        payments: [],
        maintenanceTickets: [],
        notifications: [],
        quickStats,
      };
    }
  },

  // Get available application windows
  async getApplicationWindows(): Promise<ApplicationWindow[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: ApplicationWindow[] }>('application-windows');
      return response.data.data;
    } catch (error) {
      console.warn('Application windows endpoint not available, using default window:', error);
      // Return a default active window if API fails
      return [{
        id: 'default-window',
        name: 'Default Application Window',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        is_active: true,
        description: 'Default application period'
      }];
    }
  },

  // Create new application
  async createApplication(applicationData: {
    hostel_id: string;
    room_type: string;
    preferred_room_number?: string;
    special_requirements?: string;
    emergency_contact?: string;
    emergency_phone?: string;
    parent_name?: string;
    parent_phone?: string;
    parent_email?: string;
    application_date?: string;
    status?: string;
    application_window_id: string; // Required field from API
  }): Promise<StudentApplication> {
    try {
      // Get student profile to get the student ID
      const profile = await this.getProfile();
      const studentId = profile.id;
      
      // Use the correct endpoint structure - POST to applications with student_id in body
      const dataWithStudentId = {
        ...applicationData,
        student_id: studentId
      };
      
      const response = await apiClient.post<{ success: boolean; data: StudentApplication }>(
        'applications', 
        dataWithStudentId
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to create application:', error);
      throw error;
    }
  },

  // Make payment
  async makePayment(paymentData: {
    type: 'rent' | 'deposit' | 'application_fee';
    amount: number;
    gateway: string;
    reference?: string;
  }): Promise<StudentPayment> {
    try {
      // Get student profile to get the student ID
      const profile = await this.getProfile();
      const studentId = profile.id;
      
      // Add student_id to the payment data
      const dataWithStudentId = {
        ...paymentData,
        student_id: studentId
      };
      
      const response = await apiClient.post<{ success: boolean; data: StudentPayment }>('payments', dataWithStudentId);
      return response.data.data;
    } catch (error) {
      console.error('Failed to make payment via API:', error);
      // Return mock payment
      const newPayment: StudentPayment = {
        id: `pay-${Date.now()}`,
        type: paymentData.type,
        amount: paymentData.amount,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        method: 'card',
        reference: paymentData.reference || `PAY-${Date.now()}`,
        gateway: paymentData.gateway,
      };
      return newPayment;
    }
  },

  // Create maintenance ticket
  async createMaintenanceTicket(ticketData: {
    issue: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
  }): Promise<MaintenanceTicket> {
    const response = await apiClient.post<{ success: boolean; data: MaintenanceTicket }>('/maintenance/tickets', ticketData);
    return response.data.data;
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<void> {
    await apiClient.put(`/notifications/${notificationId}/read`);
  },

  // Get available hostels for application - using correct endpoint from API docs
  async getAvailableHostels(): Promise<Hostel[]> {
    try {
      // Check if user is authenticated
      const adminToken = localStorage.getItem("auth_token");
      const studentToken = localStorage.getItem("student_token");
      
      if (!adminToken && !studentToken) {
        console.warn('No authentication token found, redirecting to login');
        // Redirect to student login if no token
        window.location.href = '/student/auth/login';
        return [];
      }
      
      const response = await apiClient.get<{ success: boolean; data: { hostels: any[] } }>('hostels');
      console.log('API Hostels response:', response.data);
      
      // Transform API response to match our Hostel interface
      const apiHostels = response.data.data.hostels || [];
      const transformedHostels: Hostel[] = apiHostels.map(apiHostel => {
        // Parse amenities from JSON string to array
        let parsedAmenities: string[] = [];
        try {
          if (typeof apiHostel.amenities === 'string') {
            parsedAmenities = JSON.parse(apiHostel.amenities);
          } else if (Array.isArray(apiHostel.amenities)) {
            parsedAmenities = apiHostel.amenities;
          } else {
            parsedAmenities = ['Basic amenities'];
          }
        } catch (e) {
          console.warn(`Failed to parse amenities for hostel ${apiHostel.id}:`, apiHostel.amenities, e);
          parsedAmenities = ['Basic amenities'];
        }

        // Calculate available beds/rooms and price from nested rooms array if available
        let totalAvailable = 0;
        let lowestPrice = Infinity;
        
        if (Array.isArray(apiHostel.rooms)) {
          apiHostel.rooms.forEach((room: any) => {
            const occupiedBeds = parseInt(room.occupied_beds || '0');
            const capacity = parseInt(room.capacity || '0');
            if (capacity > occupiedBeds) {
              totalAvailable += (capacity - occupiedBeds);
            }
            const price = parseFloat(room.price_per_bed || '0');
            if (price > 0 && price < lowestPrice) {
              lowestPrice = price;
            }
          });
        }

        return {
          id: apiHostel.id,
          name: apiHostel.name,
          type: apiHostel.gender || 'mixed', // Map gender to type
          price: lowestPrice === Infinity ? 0 : lowestPrice, // Use lowest price from rooms
          available: totalAvailable, // Sum of available beds from rooms
          description: apiHostel.description || 'No description available',
          amenities: parsedAmenities,
        };
      });
      
      return transformedHostels;
    } catch (error: any) {
      console.warn('Hostels endpoint error:', error);
      
      // If it's an authentication error, redirect to login
      if (error.response?.status === 401) {
        console.warn('Authentication failed, redirecting to login');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('student_token');
        window.location.href = '/student/auth/login';
        return [];
      }
      
      // For other errors, return mock data
      console.warn('Hostels endpoint not available, using mock data:', error);
      return [
        {
          id: 'hostel-1',
          name: 'Zik Hall',
          type: 'male',
          price: 50000,
          available: 25,
          description: 'Modern hostel with excellent facilities',
          amenities: ['WiFi', 'Security', 'Laundry', 'Kitchen'],
        },
        {
          id: 'hostel-2',
          name: 'Mariere Hall',
          type: 'female',
          price: 45000,
          available: 18,
          description: 'Comfortable accommodation for female students',
          amenities: ['WiFi', 'Security', 'Laundry', 'Study Room'],
        }
      ];
    }
  },

  // Get payment gateways
  async getPaymentGateways(): Promise<any[]> {
    const response = await apiClient.get<{ success: boolean; data: any[] }>('/payment-gateways');
    return response.data.data;
  },

  // Update student settings
  async updateSettings(settings: {
    profile?: Partial<StudentProfile>;
    notifications?: {
      emailNotifications: boolean;
      smsNotifications: boolean;
      pushNotifications: boolean;
      paymentReminders: boolean;
      maintenanceUpdates: boolean;
      academicUpdates: boolean;
      hostelAnnouncements: boolean;
    };
    security?: {
      currentPassword: string;
      newPassword: string;
    };
  }): Promise<void> {
    try {
      if (settings.profile) {
        // Update profile
        await apiClient.put<{ success: boolean }>('/auth/profile', settings.profile);
      }
      
      if (settings.notifications) {
        // Update notification preferences
        await apiClient.put<{ success: boolean }>('/notifications/preferences', settings.notifications);
      }
      
      if (settings.security) {
        // Update password
        await apiClient.put<{ success: boolean }>('/auth/change-password', {
          current_password: settings.security.currentPassword,
          new_password: settings.security.newPassword
        });
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  },
};
