import { apiClient, ApiResponse, PaginatedResponse } from "./api";
import {
  ApplicationWindow,
  CreateApplicationWindowData,
  Application,
  CreateApplicationData,
  Hostel,
  Block,
  Room,
  Bed,
  Payment,
  PaymentGateway,
  RoomSelectionSession,
  RoomSelection,
  MaintenanceTicket,
  VisitorPass,
  SecurityIncident,
  Notification,
  NotificationTemplate,
  DashboardStats,
  Student,
  User,
  QueryParams,
} from "./types";

// Application Windows Service
export const applicationWindowService = {
  // Get all application windows
  async getAll(
    params?: QueryParams
  ): Promise<PaginatedResponse<ApplicationWindow>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<ApplicationWindow>>
    >("/windows", { params });
    return response.data.data;
  },

  // Create new application window
  async create(data: CreateApplicationWindowData): Promise<ApplicationWindow> {
    const response = await apiClient.post<ApiResponse<ApplicationWindow>>(
      "/windows",
      data
    );
    return response.data.data;
  },

  // Get specific application window
  async getById(id: string): Promise<ApplicationWindow> {
    const response = await apiClient.get<ApiResponse<ApplicationWindow>>(
      `/windows/${id}`
    );
    return response.data.data;
  },

  // Update application window
  async update(
    id: string,
    data: Partial<CreateApplicationWindowData>
  ): Promise<ApplicationWindow> {
    const response = await apiClient.put<ApiResponse<ApplicationWindow>>(
      `/windows/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete application window
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/windows/${id}`);
  },

  // Publish application window
  async publish(id: string): Promise<ApplicationWindow> {
    const response = await apiClient.put<ApiResponse<ApplicationWindow>>(
      `/windows/${id}/publish`
    );
    return response.data.data;
  },

  // Unpublish application window
  async unpublish(id: string): Promise<ApplicationWindow> {
    const response = await apiClient.put<ApiResponse<ApplicationWindow>>(
      `/windows/${id}/unpublish`
    );
    return response.data.data;
  },

  // Get window statistics
  async getStats(id: string): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      `/windows/${id}/stats`
    );
    return response.data.data;
  },
};

// Applications Service
export const applicationService = {
  // Get all applications
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Application>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Application>>
    >("/applications", { params });
    return response.data.data;
  },

  // Create application (admin)
  async create(data: CreateApplicationData): Promise<Application> {
    const response = await apiClient.post<ApiResponse<Application>>(
      "/applications",
      data
    );
    return response.data.data;
  },

  // Get specific application
  async getById(id: string): Promise<Application> {
    const response = await apiClient.get<ApiResponse<Application>>(
      `/applications/${id}`
    );
    return response.data.data;
  },

  // Update application
  async update(
    id: string,
    data: Partial<CreateApplicationData>
  ): Promise<Application> {
    const response = await apiClient.put<ApiResponse<Application>>(
      `/applications/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete application
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/applications/${id}`);
  },

  // Approve application
  async approve(id: string): Promise<Application> {
    const response = await apiClient.put<ApiResponse<Application>>(
      `/applications/${id}/approve`
    );
    return response.data.data;
  },

  // Reject application
  async reject(id: string, reason?: string): Promise<Application> {
    const response = await apiClient.put<ApiResponse<Application>>(
      `/applications/${id}/reject`,
      { reason }
    );
    return response.data.data;
  },

  // Get application statistics
  async getStats(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      "/applications/stats"
    );
    return response.data.data;
  },
};

// Hostels Service
export const hostelService = {
  // Get all hostels
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Hostel>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Hostel>>
    >("/hostels", { params });
    return response.data.data;
  },

  // Create new hostel
  async create(data: Partial<Hostel>): Promise<Hostel> {
    const response = await apiClient.post<ApiResponse<Hostel>>(
      "/hostels",
      data
    );
    return response.data.data;
  },

  // Get specific hostel
  async getById(id: string): Promise<Hostel> {
    const response = await apiClient.get<ApiResponse<Hostel>>(`/hostels/${id}`);
    return response.data.data;
  },

  // Update hostel
  async update(id: string, data: Partial<Hostel>): Promise<Hostel> {
    const response = await apiClient.put<ApiResponse<Hostel>>(
      `/hostels/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete hostel
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/hostels/${id}`);
  },

  // Add block to hostel
  async addBlock(hostelId: string, data: Partial<Block>): Promise<Block> {
    const response = await apiClient.post<ApiResponse<Block>>(
      `/hostels/${hostelId}/blocks`,
      data
    );
    return response.data.data;
  },

  // Get hostel blocks
  async getBlocks(hostelId: string): Promise<Block[]> {
    const response = await apiClient.get<ApiResponse<Block[]>>(
      `/hostels/${hostelId}/blocks`
    );
    return response.data.data;
  },

  // Add room to block
  async addRoom(blockId: string, data: Partial<Room>): Promise<Room> {
    const response = await apiClient.post<ApiResponse<Room>>(
      `/hostels/blocks/${blockId}/rooms`,
      data
    );
    return response.data.data;
  },

  // Get block rooms
  async getRooms(blockId: string): Promise<Room[]> {
    const response = await apiClient.get<ApiResponse<Room[]>>(
      `/hostels/blocks/${blockId}/rooms`
    );
    return response.data.data;
  },

  // Add bed to room
  async addBed(roomId: string, data: Partial<Bed>): Promise<Bed> {
    const response = await apiClient.post<ApiResponse<Bed>>(
      `/hostels/rooms/${roomId}/beds`,
      data
    );
    return response.data.data;
  },

  // Get room beds
  async getBeds(roomId: string): Promise<Bed[]> {
    const response = await apiClient.get<ApiResponse<Bed[]>>(
      `/hostels/rooms/${roomId}/beds`
    );
    return response.data.data;
  },

  // Update bed status
  async updateBedStatus(bedId: string, status: Bed["status"]): Promise<Bed> {
    const response = await apiClient.put<ApiResponse<Bed>>(
      `/hostels/beds/${bedId}/status`,
      { status }
    );
    return response.data.data;
  },

  // Get hostel statistics
  async getStats(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      "/hostels/stats/overview"
    );
    return response.data.data;
  },

  // Get available beds
  async getAvailableBeds(params?: QueryParams): Promise<Bed[]> {
    const response = await apiClient.get<ApiResponse<Bed[]>>(
      "/hostels/beds/available",
      { params }
    );
    return response.data.data;
  },
};

// Payments Service
export const paymentService = {
  // Get all payments
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Payment>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Payment>>
    >("/payments", { params });
    return response.data.data;
  },

  // Create manual payment
  async create(data: Partial<Payment>): Promise<Payment> {
    const response = await apiClient.post<ApiResponse<Payment>>(
      "/payments",
      data
    );
    return response.data.data;
  },

  // Initiate payment with gateway
  async initiate(data: {
    applicationId: string;
    amount: number;
    gateway: string;
  }): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(
      "/payments/initiate",
      data
    );
    return response.data.data;
  },

  // Verify payment
  async verify(reference: string): Promise<Payment> {
    const response = await apiClient.post<ApiResponse<Payment>>(
      "/payments/verify",
      { reference }
    );
    return response.data.data;
  },

  // Get student payments
  async getStudentPayments(studentId: string): Promise<Payment[]> {
    const response = await apiClient.get<ApiResponse<Payment[]>>(
      `/payments/student/${studentId}`
    );
    return response.data.data;
  },

  // Get payment statistics
  async getStats(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>("/payments/stats");
    return response.data.data;
  },

  // Get available payment gateways
  async getGateways(): Promise<PaymentGateway[]> {
    const response = await apiClient.get<ApiResponse<PaymentGateway[]>>(
      "/payments/gateways"
    );
    return response.data.data;
  },

  // Get gateway config
  async getGatewayConfig(gateway: string): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      `/payments/gateways/${gateway}/config`
    );
    return response.data.data;
  },
};

// Room Selection Service
export const roomSelectionService = {
  // Create selection session
  async createSession(
    data: Partial<RoomSelectionSession>
  ): Promise<RoomSelectionSession> {
    const response = await apiClient.post<ApiResponse<RoomSelectionSession>>(
      "/room-selection/sessions",
      data
    );
    return response.data.data;
  },

  // Get all sessions
  async getSessions(
    params?: QueryParams
  ): Promise<PaginatedResponse<RoomSelectionSession>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<RoomSelectionSession>>
    >("/room-selection/sessions", { params });
    return response.data.data;
  },

  // Get active session
  async getActiveSession(
    applicationWindowId: string
  ): Promise<RoomSelectionSession> {
    const response = await apiClient.get<ApiResponse<RoomSelectionSession>>(
      `/room-selection/sessions/active/${applicationWindowId}`
    );
    return response.data.data;
  },

  // Start selection session
  async startSession(id: string): Promise<RoomSelectionSession> {
    const response = await apiClient.put<ApiResponse<RoomSelectionSession>>(
      `/room-selection/sessions/${id}/start`
    );
    return response.data.data;
  },

  // Create room selection
  async createSelection(data: Partial<RoomSelection>): Promise<RoomSelection> {
    const response = await apiClient.post<ApiResponse<RoomSelection>>(
      "/room-selection/selections",
      data
    );
    return response.data.data;
  },

  // Get selection details
  async getSelection(id: string): Promise<RoomSelection> {
    const response = await apiClient.get<ApiResponse<RoomSelection>>(
      `/room-selection/selections/${id}`
    );
    return response.data.data;
  },

  // Update selection
  async updateSelection(
    id: string,
    data: Partial<RoomSelection>
  ): Promise<RoomSelection> {
    const response = await apiClient.put<ApiResponse<RoomSelection>>(
      `/room-selection/selections/${id}`,
      data
    );
    return response.data.data;
  },

  // Get available beds for selection
  async getAvailableBeds(selectionId: string): Promise<Bed[]> {
    const response = await apiClient.get<ApiResponse<Bed[]>>(
      `/room-selection/selections/${selectionId}/available-beds`
    );
    return response.data.data;
  },

  // Join selection queue
  async joinQueue(selectionId: string): Promise<RoomSelection> {
    const response = await apiClient.post<ApiResponse<RoomSelection>>(
      `/room-selection/selections/${selectionId}/join-queue`
    );
    return response.data.data;
  },

  // Activate selection
  async activateSelection(selectionId: string): Promise<RoomSelection> {
    const response = await apiClient.put<ApiResponse<RoomSelection>>(
      `/room-selection/selections/${selectionId}/activate`
    );
    return response.data.data;
  },

  // Complete selection
  async completeSelection(
    selectionId: string,
    data: { roomId: string; bedId: string }
  ): Promise<RoomSelection> {
    const response = await apiClient.put<ApiResponse<RoomSelection>>(
      `/room-selection/selections/${selectionId}/complete`,
      data
    );
    return response.data.data;
  },

  // Get session statistics
  async getSessionStats(sessionId: string): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      `/room-selection/sessions/${sessionId}/stats`
    );
    return response.data.data;
  },

  // Get selection status
  async getSelectionStatus(selectionId: string): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      `/room-selection/selections/${selectionId}/status`
    );
    return response.data.data;
  },

  // Get queue status
  async getQueueStatus(sessionId: string): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      `/room-selection/sessions/${sessionId}/queue-status`
    );
    return response.data.data;
  },
};

// Maintenance Service
export const maintenanceService = {
  // Get all maintenance tickets
  async getTickets(
    params?: QueryParams
  ): Promise<PaginatedResponse<MaintenanceTicket>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<MaintenanceTicket>>
    >("/maintenance/tickets", { params });
    return response.data.data;
  },

  // Create maintenance ticket
  async createTicket(
    data: Partial<MaintenanceTicket>
  ): Promise<MaintenanceTicket> {
    const response = await apiClient.post<ApiResponse<MaintenanceTicket>>(
      "/maintenance/tickets",
      data
    );
    return response.data.data;
  },

  // Get specific ticket
  async getTicket(id: string): Promise<MaintenanceTicket> {
    const response = await apiClient.get<ApiResponse<MaintenanceTicket>>(
      `/maintenance/tickets/${id}`
    );
    return response.data.data;
  },

  // Update ticket status
  async updateTicketStatus(
    id: string,
    status: MaintenanceTicket["status"]
  ): Promise<MaintenanceTicket> {
    const response = await apiClient.put<ApiResponse<MaintenanceTicket>>(
      `/maintenance/tickets/${id}/status`,
      { status }
    );
    return response.data.data;
  },

  // Assign ticket
  async assignTicket(
    id: string,
    assignedTo: string
  ): Promise<MaintenanceTicket> {
    const response = await apiClient.put<ApiResponse<MaintenanceTicket>>(
      `/maintenance/tickets/${id}/assign`,
      { assignedTo }
    );
    return response.data.data;
  },

  // Get visitor passes
  async getVisitorPasses(
    params?: QueryParams
  ): Promise<PaginatedResponse<VisitorPass>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<VisitorPass>>
    >("/maintenance/visitor-passes", { params });
    return response.data.data;
  },

  // Create visitor pass
  async createVisitorPass(data: Partial<VisitorPass>): Promise<VisitorPass> {
    const response = await apiClient.post<ApiResponse<VisitorPass>>(
      "/maintenance/visitor-passes",
      data
    );
    return response.data.data;
  },

  // Expire visitor pass
  async expireVisitorPass(id: string): Promise<VisitorPass> {
    const response = await apiClient.put<ApiResponse<VisitorPass>>(
      `/maintenance/visitor-passes/${id}/expire`
    );
    return response.data.data;
  },

  // Get security incidents
  async getSecurityIncidents(
    params?: QueryParams
  ): Promise<PaginatedResponse<SecurityIncident>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<SecurityIncident>>
    >("/maintenance/security-incidents", { params });
    return response.data.data;
  },

  // Create security incident
  async createSecurityIncident(
    data: Partial<SecurityIncident>
  ): Promise<SecurityIncident> {
    const response = await apiClient.post<ApiResponse<SecurityIncident>>(
      "/maintenance/security-incidents",
      data
    );
    return response.data.data;
  },

  // Resolve incident
  async resolveIncident(
    id: string,
    resolution: string
  ): Promise<SecurityIncident> {
    const response = await apiClient.put<ApiResponse<SecurityIncident>>(
      `/maintenance/security-incidents/${id}/resolve`,
      { resolution }
    );
    return response.data.data;
  },

  // Get maintenance statistics
  async getStats(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      "/maintenance/stats"
    );
    return response.data.data;
  },
};

// Notifications Service
export const notificationService = {
  // Get all notifications
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Notification>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Notification>>
    >("/notifications", { params });
    return response.data.data;
  },

  // Create notification
  async create(data: Partial<Notification>): Promise<Notification> {
    const response = await apiClient.post<ApiResponse<Notification>>(
      "/notifications",
      data
    );
    return response.data.data;
  },

  // Send bulk notifications
  async sendBulk(data: {
    recipients: string[];
    notification: Partial<Notification>;
  }): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(
      "/notifications/bulk",
      data
    );
    return response.data.data;
  },

  // Get unread count
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(
      "/notifications/unread-count"
    );
    return response.data.data.count;
  },

  // Mark as read
  async markAsRead(id: string): Promise<Notification> {
    const response = await apiClient.put<ApiResponse<Notification>>(
      `/notifications/${id}/read`
    );
    return response.data.data;
  },

  // Mark all as read
  async markAllAsRead(): Promise<void> {
    await apiClient.put("/notifications/mark-all-read");
  },

  // Delete notification
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },

  // Create notification template
  async createTemplate(
    data: Partial<NotificationTemplate>
  ): Promise<NotificationTemplate> {
    const response = await apiClient.post<ApiResponse<NotificationTemplate>>(
      "/notifications/templates",
      data
    );
    return response.data.data;
  },

  // Send template
  async sendTemplate(
    templateName: string,
    data: { recipients: string[]; variables: Record<string, any> }
  ): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/notifications/templates/${templateName}/send`,
      data
    );
    return response.data.data;
  },

  // Get notification statistics
  async getStats(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      "/notifications/stats"
    );
    return response.data.data;
  },

  // Retry failed notifications
  async retryFailed(): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(
      "/notifications/retry-failed"
    );
    return response.data.data;
  },

  // Cleanup old notifications
  async cleanup(): Promise<void> {
    await apiClient.delete("/notifications/cleanup");
  },
};

// Users Service
export const userService = {
  // Get all users
  async getAll(params?: QueryParams): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
      "/users",
      { params }
    );
    return response.data.data;
  },

  // Create user
  async create(data: Partial<User>): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>("/users", data);
    return response.data.data;
  },

  // Get specific user
  async getById(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  // Update user
  async update(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete user
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  // Update user role
  async updateRole(id: string, role: User["role"]): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${id}/role`,
      { role }
    );
    return response.data.data;
  },

  // Update user status
  async updateStatus(id: string, isActive: boolean): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${id}/status`,
      { isActive }
    );
    return response.data.data;
  },
};

// Reports Service
export const reportService = {
  // Get occupancy reports
  async getOccupancyReports(params?: QueryParams): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      "/reports/occupancy",
      { params }
    );
    return response.data.data;
  },

  // Get revenue reports
  async getRevenueReports(params?: QueryParams): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>("/reports/revenue", {
      params,
    });
    return response.data.data;
  },

  // Get application reports
  async getApplicationReports(params?: QueryParams): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      "/reports/applications",
      { params }
    );
    return response.data.data;
  },

  // Get maintenance reports
  async getMaintenanceReports(params?: QueryParams): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      "/reports/maintenance",
      { params }
    );
    return response.data.data;
  },

  // Get user activity reports
  async getUserActivityReports(params?: QueryParams): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      "/reports/user-activity",
      { params }
    );
    return response.data.data;
  },

  // Export reports
  async exportReport(reportType: string, params?: QueryParams): Promise<Blob> {
    const response = await apiClient.get(`/reports/export/${reportType}`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  // Get dashboard data
  async getDashboardData(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      "/reports/dashboard"
    );
    return response.data.data;
  },
};
