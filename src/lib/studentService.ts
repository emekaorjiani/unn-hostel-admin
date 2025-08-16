import { apiClient } from './api';

// Student dashboard data types based on API documentation
export interface StudentProfile {
  user: {
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

// Mock data for development when API is not available
const mockProfile: StudentProfile = {
  user: {
    id: 'mock-user-1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@unn.edu.ng',
    matric_number: '2021/123456',
    phone_number: '+2348012345678',
    faculty: 'Engineering',
    department: 'Computer Engineering',
    level: '300',
    gender: 'male',
    date_of_birth: '2000-01-01',
    address: '123 Main Street, Nsukka',
    state_of_origin: 'Enugu',
    nationality: 'Nigerian',
    status: 'active',
    is_email_verified: true,
    is_phone_verified: true,
    created_at: '2021-09-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }
};

const mockApplications: StudentApplication[] = [
  {
    id: 'app-1',
    hostel_name: 'Zik Hall',
    room_type: 'Single Room',
    status: 'approved',
    application_date: '2024-01-15',
    amount: 50000,
    payment_status: 'paid',
  },
  {
    id: 'app-2',
    hostel_name: 'Mariere Hall',
    room_type: 'Shared Room',
    status: 'pending',
    application_date: '2024-01-20',
    amount: 35000,
    payment_status: 'pending',
  }
];

const mockPayments: StudentPayment[] = [
  {
    id: 'pay-1',
    type: 'rent',
    amount: 50000,
    status: 'completed',
    date: '2024-01-15',
    method: 'card',
    reference: 'PAY-001',
    gateway: 'paystack',
  },
  {
    id: 'pay-2',
    type: 'deposit',
    amount: 25000,
    status: 'pending',
    date: '2024-01-20',
    method: 'transfer',
    reference: 'PAY-002',
    gateway: 'flutterwave',
  }
];

const mockMaintenanceTickets: MaintenanceTicket[] = [
  {
    id: 'ticket-1',
    issue: 'Broken Window',
    description: 'Window in room 101 is broken and needs replacement',
    status: 'in_progress',
    priority: 'medium',
    category: 'Repairs',
    created_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'ticket-2',
    issue: 'Electrical Problem',
    description: 'Power outlet not working in room 205',
    status: 'pending',
    priority: 'high',
    category: 'Electrical',
    created_at: '2024-01-18T00:00:00Z',
  }
];

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Application Approved',
    message: 'Your hostel application for Zik Hall has been approved',
    type: 'success',
    read: false,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'notif-2',
    title: 'Payment Due',
    message: 'Your rent payment is due in 5 days',
    type: 'warning',
    read: true,
    created_at: '2024-01-20T00:00:00Z',
  }
];

// Student service for API calls using correct endpoints from Postman docs
export const studentService = {
  // Get student profile - using correct endpoint from API docs
  async getProfile(): Promise<StudentProfile> {
    try {
      const response = await apiClient.get<{ success: boolean; data: StudentProfile }>('v1/auth/profile');
      console.log('API Profile response:', response.data);
    return response.data.data;
    } catch (error) {
      console.warn('Profile endpoint not available, using mock data:', error);
      return mockProfile;
    }
  },

  // Get student applications - using correct endpoint from API docs
  async getApplications(): Promise<StudentApplication[]> {
    try {
      // Get student profile to get the student ID
      const profile = await this.getProfile();
      const studentId = profile.user.id;
      
      // Use the correct endpoint structure with student ID
      const response = await apiClient.get<{ success: boolean; data: StudentApplication[] }>(`applications/student/${studentId}`);
      console.log('API Applications response:', response.data);
      return response.data.data;
    } catch (error) {
      console.warn('Applications endpoint not available, using mock data:', error);
      return mockApplications;
    }
  },

  // Get student payments - using correct endpoint from API docs
  async getPayments(): Promise<StudentPayment[]> {
    try {
      // Get student profile to get the student ID
      const profile = await this.getProfile();
      const studentId = profile.user.id;
      
      // Use the correct endpoint structure with student ID
      const response = await apiClient.get<{ success: boolean; data: StudentPayment[] }>(`payments/student/${studentId}`);
      console.log('API Payments response:', response.data);
      return response.data.data;
    } catch (error) {
      console.warn('Payments endpoint not available, using mock data:', error);
      return mockPayments;
    }
  },

  // Get maintenance tickets - using correct endpoint from API docs
  async getMaintenanceTickets(): Promise<MaintenanceTicket[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: MaintenanceTicket[] }>('maintenance/tickets');
      console.log('API Maintenance response:', response.data);
      return response.data.data;
    } catch (error) {
      console.warn('Maintenance tickets endpoint not available, using mock data:', error);
      return mockMaintenanceTickets;
    }
  },

  // Get notifications - using correct endpoint from API docs
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Notification[] }>('notifications');
      console.log('API Notifications response:', response.data);
      return response.data.data;
    } catch (error) {
      console.warn('Notifications endpoint not available, using mock data:', error);
      return mockNotifications;
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
      // Return mock data as fallback
      const quickStats = {
        totalApplications: mockApplications.length,
        approvedApplications: mockApplications.filter(app => app.status === 'approved').length,
        pendingPayments: mockPayments.filter(pay => pay.status === 'pending').length,
        activeTickets: mockMaintenanceTickets.filter(ticket => ticket.status === 'pending' || ticket.status === 'in_progress').length,
        unreadNotifications: mockNotifications.filter(notif => !notif.read).length,
      };
      
      return {
        profile: mockProfile,
        applications: mockApplications,
        payments: mockPayments,
        maintenanceTickets: mockMaintenanceTickets,
        notifications: mockNotifications,
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

  // Create new application - using correct endpoint from API docs
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
      const studentId = profile.user.id;
      
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

  // Make payment - using correct endpoint from API docs
  async makePayment(paymentData: {
    type: 'rent' | 'deposit' | 'application_fee';
    amount: number;
    gateway: string;
    reference?: string;
  }): Promise<StudentPayment> {
    try {
      // Get student profile to get the student ID
      const profile = await this.getProfile();
      const studentId = profile.user.id;
      
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

  // Create maintenance ticket - using correct endpoint from API docs
  async createMaintenanceTicket(ticketData: {
    issue: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
  }): Promise<MaintenanceTicket> {
    try {
      const response = await apiClient.post<{ success: boolean; data: MaintenanceTicket }>('maintenance/tickets', ticketData);
    return response.data.data;
    } catch (error) {
      console.error('Failed to create maintenance ticket via API:', error);
      // Return mock ticket
      const newTicket: MaintenanceTicket = {
        id: `ticket-${Date.now()}`,
        issue: ticketData.issue,
        description: ticketData.description,
        status: 'pending',
        priority: ticketData.priority,
        category: ticketData.category,
        created_at: new Date().toISOString(),
      };
      return newTicket;
    }
  },

  // Mark notification as read - using correct endpoint from API docs
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.put(`notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Failed to mark notification as read via API:', error);
      // In mock mode, we could update local state if needed
    }
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

  // Get payment gateways - using correct endpoint from API docs
  async getPaymentGateways(): Promise<any[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: any[] }>('payment-gateway');
      return response.data.data;
    } catch (error) {
      console.warn('Payment gateways endpoint not available:', error);
      return [
        { id: 'paystack', name: 'Paystack', is_active: true },
        { id: 'flutterwave', name: 'Flutterwave', is_active: true },
        { id: 'remita', name: 'Remita', is_active: true },
      ];
    }
  },

  // Additional methods from API docs
  // Get student documents
  async getDocuments(): Promise<any[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: any[] }>('student/documents');
      return response.data.data;
    } catch (error) {
      console.warn('Documents endpoint not available, using mock data:', error);
      return [
        {
          id: 'doc-1',
          name: 'Student ID Card',
          type: 'identification',
          status: 'approved',
          uploaded_at: '2024-01-01T00:00:00Z',
          size: '2.5 MB',
          file_type: 'PDF',
        },
        {
          id: 'doc-2',
          name: 'Academic Transcript',
          type: 'academic',
          status: 'pending',
          uploaded_at: '2024-01-15T00:00:00Z',
          size: '1.8 MB',
          file_type: 'PDF',
        }
      ];
    }
  },

  // Upload document
  async uploadDocument(documentData: FormData): Promise<any> {
    try {
      const response = await apiClient.post<{ success: boolean; data: any }>('student/documents', documentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to upload document via API:', error);
      // Return mock upload result
      return {
        id: `doc-${Date.now()}`,
        name: 'Uploaded Document',
        status: 'pending',
        uploaded_at: new Date().toISOString(),
      };
    }
  },

  // Get student settings
  async getSettings(): Promise<any> {
    try {
      const response = await apiClient.get<{ success: boolean; data: any }>('student/settings');
      return response.data.data;
    } catch (error) {
      console.warn('Settings endpoint not available, using mock data:', error);
      return {
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        privacy: {
          profile_visible: true,
          contact_visible: false,
        },
      };
    }
  },

  // Update student settings
  async updateSettings(settingsData: any): Promise<any> {
    try {
      const response = await apiClient.put<{ success: boolean; data: any }>('student/settings', settingsData);
      return response.data.data;
    } catch (error) {
      console.error('Failed to update settings via API:', error);
      // Return mock updated settings
      return {
        ...settingsData,
        updated_at: new Date().toISOString(),
      };
    }
  },

  // Get student statistics
  async getStatistics(): Promise<any> {
    try {
      const response = await apiClient.get<{ success: boolean; data: any }>('student/statistics');
    return response.data.data;
    } catch (error) {
      console.warn('Statistics endpoint not available, using mock data:', error);
      return {
        total_applications: 5,
        approved_applications: 3,
        total_payments: 150000,
        pending_payments: 25000,
        active_tickets: 2,
        resolved_tickets: 8,
      };
    }
  },
};
