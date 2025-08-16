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

// Student service for API calls
export const studentService = {
  // Get student profile
  async getProfile(): Promise<StudentProfile> {
    const response = await apiClient.get<{ success: boolean; data: StudentProfile }>('/auth/profile');
    return response.data.data;
  },

  // Get student applications
  async getApplications(): Promise<StudentApplication[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: StudentApplication[] }>('/applications');
      return response.data.data;
    } catch (error) {
      console.warn('Applications endpoint not available, returning empty array');
      return [];
    }
  },

  // Get student payments
  async getPayments(): Promise<StudentPayment[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: StudentPayment[] }>('/payments');
      return response.data.data;
    } catch (error) {
      console.warn('Payments endpoint not available, returning empty array');
      return [];
    }
  },

  // Get maintenance tickets
  async getMaintenanceTickets(): Promise<MaintenanceTicket[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: MaintenanceTicket[] }>('/maintenance/tickets');
      return response.data.data;
    } catch (error) {
      console.warn('Maintenance tickets endpoint not available, returning empty array');
      return [];
    }
  },

  // Get notifications
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Notification[] }>('/notifications');
      return response.data.data;
    } catch (error) {
      console.warn('Notifications endpoint not available, returning empty array');
      return [];
    }
  },

  // Get dashboard data (combined)
  async getDashboardData(): Promise<StudentDashboardData> {
    try {
      // Fetch all data in parallel
      const [profile, applications, payments, maintenanceTickets, notifications] = await Promise.all([
        this.getProfile(),
        this.getApplications(),
        this.getPayments(),
        this.getMaintenanceTickets(),
        this.getNotifications(),
      ]);

      // Calculate quick stats
      const quickStats = {
        totalApplications: applications.length,
        approvedApplications: applications.filter(app => app.status === 'approved').length,
        pendingPayments: payments.filter(pay => pay.status === 'pending').length,
        activeTickets: maintenanceTickets.filter(ticket => ticket.status === 'pending' || ticket.status === 'in_progress').length,
        unreadNotifications: notifications.filter(notif => !notif.read).length,
      };

      return {
        profile,
        applications,
        payments,
        maintenanceTickets,
        notifications,
        quickStats,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Create new application
  async createApplication(applicationData: {
    hostel_id: string;
    room_type: string;
    preferred_room_number?: string;
    special_requirements?: string;
  }): Promise<StudentApplication> {
    const response = await apiClient.post<{ success: boolean; data: StudentApplication }>('/applications', applicationData);
    return response.data.data;
  },

  // Make payment
  async makePayment(paymentData: {
    type: 'rent' | 'deposit' | 'application_fee';
    amount: number;
    gateway: string;
    reference?: string;
  }): Promise<StudentPayment> {
    const response = await apiClient.post<{ success: boolean; data: StudentPayment }>('/payments', paymentData);
    return response.data.data;
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

  // Get available hostels for application
  async getAvailableHostels(): Promise<any[]> {
    const response = await apiClient.get<{ success: boolean; data: any[] }>('/hostels/available');
    return response.data.data;
  },

  // Get payment gateways
  async getPaymentGateways(): Promise<any[]> {
    const response = await apiClient.get<{ success: boolean; data: any[] }>('/payment-gateways');
    return response.data.data;
  },
};
