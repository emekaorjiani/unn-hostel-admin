import { apiClient } from './api'

// Dashboard Overview Interface
export interface DashboardOverview {
  overview: {
    total_hostels: number
    total_students: number
    total_applications: number
    pending_applications: number
    approved_applications: number
    total_revenue: string
    monthly_revenue: number
    occupancy_rate: number
    maintenance_tickets: number
    security_incidents: number
    active_visitor_passes: number
    unread_notifications: number
  }
  charts: {
    revenue_trend: Array<{ month: string; value: number }>
    occupancy_trend: Array<{ month: string; value: number }>
    applications_trend: Array<{ month: string; value: number }>
    maintenance_trend: Array<{ month: string; value: number }>
  }
  recent_activities: Array<{
    type: string
    title: string
    description: string
    timestamp: string
    user: string
    status: string
    priority: string
    metadata: any
  }>
}

// Hostel Interface
export interface Hostel {
  id: string
  name: string
  description: string
  type: 'male' | 'female' | 'mixed'
  address: string
  phone_number: string
  email: string
  capacity: number
  occupied_beds: number
  available_beds: number
  occupancy_rate: number
  status: 'active' | 'inactive' | 'maintenance'
  blocks: Block[]
  created_at: string
  updated_at: string
}

export interface Block {
  id: string
  name: string
  description: string
  floors: number
  rooms: Room[]
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  number: string
  type: 'single' | 'double' | 'triple' | 'quad'
  capacity: number
  occupied_beds: number
  available_beds: number
  status: 'available' | 'occupied' | 'maintenance'
  beds: Bed[]
  created_at: string
  updated_at: string
}

export interface Bed {
  id: string
  number: string
  status: 'available' | 'occupied' | 'maintenance' | 'reserved'
  student_id?: string
  student_name?: string
  created_at: string
  updated_at: string
}

export interface HostelStats {
  total_hostels: number
  active_hostels: number
  male_hostels: number
  female_hostels: number
  mixed_hostels: number
}

// Application Interface
export interface Application {
  id: string
  student_id: string
  student_name: string
  matric_number: string
  hostel_id: string
  hostel_name: string
  room_type: string
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted'
  type: string
  academic_year: string
  semester: string
  submitted_at: string
  processed_at?: string
  approved_at?: string
  rejection_reason?: string
  waitlist_position?: number
  application_window_id?: string
  window_name?: string
}

export interface ApplicationStats {
  total_applications: number
  pending_applications: number
  approved_applications: number
  rejected_applications: number
  waitlisted_applications: number
  this_month_applications: number
  approval_rate: number
}

// Payment Interface
export interface Payment {
  id: string
  student_id: string
  application_id: string | null
  amount: string
  currency: string
  payment_method: string
  payment_gateway: string
  reference: string
  status: 'pending' | 'successful' | 'failed'
  gateway_response: string | null
  transaction_id: string
  payment_date: string
  due_date: string | null
  description: string
  receipt_url: string | null
  metadata: any
  created_at: string
  updated_at: string
  deleted_at: string | null
  fee_id: string | null
  student: {
    id: string
    first_name: string
    last_name: string
    email: string
    matric_number: string
    staff_id: string | null
    phone_number: string
    role: string
    status: string
    is_email_verified: boolean
    is_phone_verified: boolean
    two_factor_enabled: boolean
    last_login_at: string | null
    last_login_ip: string | null
    preferences: any
    profile_picture: string | null
    faculty: string | null
    department: string
    level: string
    gender: string
    date_of_birth: string | null
    emergency_contact: string | null
    emergency_phone: string | null
    address: string | null
    state_of_origin: string | null
    local_government: string | null
    tribe: string | null
    religion: string | null
    is_pwd: boolean
    pwd_details: string | null
    is_international_student: boolean
    nationality: string | null
    passport_number: string | null
    nin_number: string | null
    employee_id: string | null
    designation: string | null
    admin_department: string | null
    permissions: any
    created_at: string
    updated_at: string
    deleted_at: string | null
  }
}

export interface PaymentStats {
  total_payments: number
  successful_payments: number
  failed_payments: number
  pending_payments: number
  total_revenue: string
  monthly_revenue: number
  average_payment_amount: string
}

// Maintenance Interface
export interface MaintenanceTicket {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  reporter_id: string
  reporter_name: string
  assigned_to_id?: string
  assigned_to_name?: string
  location: string
  estimated_completion?: string
  completed_at?: string
  rating?: number
  feedback?: string
  created_at: string
  updated_at: string
}

export interface MaintenanceStats {
  total_tickets: number
  open_tickets: number
  in_progress_tickets: number
  completed_tickets: number
  urgent_tickets: number
  high_priority_tickets: number
  average_resolution_time: number
}

// Student Interface
export interface Student {
  id: string
  first_name: string
  last_name: string
  email: string
  matric_number: string
  phone_number?: string
  faculty?: string
  department?: string
  level?: string
  gender?: string
  date_of_birth?: string
  address?: string
  state_of_origin?: string
  nationality?: string
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
  is_email_verified: boolean
  is_phone_verified: boolean
  has_application: boolean
  has_allocation: boolean
  created_at: string
  updated_at: string
}

export interface StudentStats {
  total_students: number
  active_students: number
  inactive_students: number
  students_with_applications: number
  students_with_allocations: number
  new_students_this_month: number
}

// Report Interface
export interface Report {
  id: string
  name: string
  description: string
  endpoint: string
  parameters: string[]
  category: string
  is_active: boolean
  created_at: string
}

export interface ReportStats {
  total_reports_generated: number
  reports_this_month: number
  most_accessed_report: string
  average_report_generation_time: string
}

// Settings Interface
export interface SystemSettings {
  site_name: string
  site_description: string
  contact_email: string
  contact_phone: string
  maintenance_mode: boolean
  registration_enabled: boolean
  application_windows_enabled: boolean
  payment_gateways: string[]
  default_currency: string
  timezone: string
}

// Pagination Interface
export interface Pagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
}

// API Response Interfaces
export interface DashboardOverviewResponse {
  success: boolean
  message: string
  data: {
    overview: {
      total_hostels: number
      total_students: number
      total_applications: number
      pending_applications: number
      approved_applications: number
      rejected_applications: number
      waitlisted_applications: number
      total_revenue: string
      monthly_revenue: number
      occupancy_rate: number
      maintenance_tickets: number
      open_maintenance_tickets: number
      in_progress_maintenance_tickets: number
      completed_maintenance_tickets: number
      security_incidents: number
      open_security_incidents: number
      active_visitor_passes: number
      unread_notifications: number
      total_payments: number
      successful_payments: number
      failed_payments: number
      pending_payments: number
      average_payment_amount: string
      total_allocations: number
      active_allocations: number
      expired_allocations: number
      total_fees: number
      active_fees: number
      total_wallets: number
      active_wallets: number
      total_wallet_transactions: number
      this_month_transactions: number
    }
    charts: {
      revenue_trend: {
        labels: string[]
        data: string[]
      }
      occupancy_trend: {
        labels: string[]
        data: number[]
      }
      applications_trend: {
        labels: string[]
        data: number[]
      }
      maintenance_trend: {
        labels: string[]
        data: number[]
      }
      payment_trend: {
        labels: string[]
        data: number[]
      }
      student_enrollment_trend: {
        labels: string[]
        data: number[]
      }
    }
    recent_activities: Array<{
      type: string
      title: string
      description: string
      timestamp: string
      user: string
      status: string
      priority: string
      metadata: any
    }>
    quick_stats: {
      approval_rate: number
      payment_success_rate: number
      average_resolution_time: number
      student_satisfaction_score: number
      system_uptime: number
      active_sessions: number
      peak_hours: string
      most_active_hostel: string
    }
  }
}

export interface HostelsResponse {
  success: boolean
  message: string
  data: {
    hostels: Hostel[]
    statistics: HostelStats
    pagination: Pagination
  }
}

export interface ApplicationsResponse {
  success: boolean
  message: string
  data: {
    applications: Application[]
    statistics: ApplicationStats
    pagination: Pagination
  }
}

export interface PaymentsResponse {
  success: boolean
  message: string
  data: {
    payments: Payment[]
    statistics: PaymentStats
    pagination: Pagination
  }
}

export interface MaintenanceResponse {
  success: boolean
  message: string
  data: {
    tickets: MaintenanceTicket[]
    statistics: MaintenanceStats
    pagination: Pagination
  }
}

export interface StudentsResponse {
  success: boolean
  message: string
  data: {
    students: Student[]
    statistics: StudentStats
    pagination: Pagination
  }
}

export interface ReportsResponse {
  success: boolean
  message: string
  data: {
    available_reports: Report[]
    recent_reports: any[]
    report_statistics: ReportStats
  }
}

export interface SettingsResponse {
  success: boolean
  message: string
  data: {
    system_settings: SystemSettings
    user_preferences: any
    notification_settings: any
  }
}

// Dashboard Service
export const dashboardService = {
  // Get dashboard overview - using the correct endpoint
  async getOverview(): Promise<DashboardOverview> {
    try {
      const response = await apiClient.get<DashboardOverviewResponse>('/admin/dashboard/overview')
      const apiData = response.data.data
      
      // The API already returns the data in the correct format
      const transformedData: DashboardOverview = {
        overview: {
          total_hostels: apiData.overview.total_hostels,
          total_students: apiData.overview.total_students,
          total_applications: apiData.overview.total_applications,
          pending_applications: apiData.overview.pending_applications,
          approved_applications: apiData.overview.approved_applications,
          total_revenue: apiData.overview.total_revenue,
          monthly_revenue: apiData.overview.monthly_revenue,
          occupancy_rate: apiData.overview.occupancy_rate,
          maintenance_tickets: apiData.overview.maintenance_tickets,
          security_incidents: apiData.overview.security_incidents,
          active_visitor_passes: apiData.overview.active_visitor_passes,
          unread_notifications: apiData.overview.unread_notifications
        },
        charts: {
          revenue_trend: apiData.charts.revenue_trend.data.map((value, index) => ({
            month: apiData.charts.revenue_trend.labels[index],
            value: parseFloat(value) || 0
          })),
          occupancy_trend: apiData.charts.occupancy_trend.data.map((value, index) => ({
            month: apiData.charts.occupancy_trend.labels[index],
            value: value
          })),
          applications_trend: apiData.charts.applications_trend.data.map((value, index) => ({
            month: apiData.charts.applications_trend.labels[index],
            value: value
          })),
          maintenance_trend: apiData.charts.maintenance_trend.data.map((value, index) => ({
            month: apiData.charts.maintenance_trend.labels[index],
            value: value
          }))
        },
        recent_activities: apiData.recent_activities
      }
      
      return transformedData
    } catch (error) {
      console.error('Error fetching dashboard overview:', error)
      throw error
    }
  },

  // Get hostels with pagination and filters - using hostel service endpoint
  async getHostels(params?: {
    page?: number
    limit?: number
    type?: string
    search?: string
  }): Promise<{ hostels: Hostel[], statistics: HostelStats, pagination: Pagination }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.type) queryParams.append('type', params.type)
      if (params?.search) queryParams.append('search', params.search)

      const response = await apiClient.get<HostelsResponse>(`/hostels?${queryParams.toString()}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching hostels:', error)
      throw error
    }
  },

  // Get applications with pagination and filters - using the correct endpoint
  async getApplications(params?: {
    page?: number
    limit?: number
    status?: string
    type?: string
    search?: string
  }): Promise<{ applications: Application[], statistics: ApplicationStats, pagination: Pagination }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.status) queryParams.append('status', params.status)
      if (params?.type) queryParams.append('type', params.type)
      if (params?.search) queryParams.append('search', params.search)

      const response = await apiClient.get<ApplicationsResponse>(`/admin/dashboard/applications?${queryParams.toString()}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching applications:', error)
      throw error
    }
  },

  // Get payments with pagination and filters - using the correct endpoint
  async getPayments(params?: {
    page?: number
    limit?: number
    status?: string
    payment_method?: string
    search?: string
  }): Promise<{ payments: Payment[], statistics: PaymentStats, pagination: Pagination }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.status) queryParams.append('status', params.status)
      if (params?.payment_method) queryParams.append('payment_method', params.payment_method)
      if (params?.search) queryParams.append('search', params.search)

      const response = await apiClient.get<PaymentsResponse>(`/admin/dashboard/payments?${queryParams.toString()}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching payments:', error)
      throw error
    }
  },

  // Get maintenance tickets with pagination and filters - using maintenance service endpoint
  async getMaintenance(params?: {
    page?: number
    limit?: number
    status?: string
    category?: string
    priority?: string
    search?: string
  }): Promise<{ tickets: MaintenanceTicket[], statistics: MaintenanceStats, pagination: Pagination }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.status) queryParams.append('status', params.status)
      if (params?.category) queryParams.append('category', params.category)
      if (params?.priority) queryParams.append('priority', params.priority)
      if (params?.search) queryParams.append('search', params.search)

      const response = await apiClient.get<MaintenanceResponse>(`/maintenance/tickets?${queryParams.toString()}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching maintenance tickets:', error)
      throw error
    }
  },

  // Get students with pagination and filters - using admin dashboard endpoint
  async getStudents(params?: {
    page?: number
    limit?: number
    status?: string
    faculty?: string
    department?: string
    level?: string
    search?: string
  }): Promise<{ students: Student[], statistics: StudentStats, pagination: Pagination }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.status) queryParams.append('status', params.status)
      if (params?.faculty) queryParams.append('faculty', params.faculty)
      if (params?.department) queryParams.append('department', params.department)
      if (params?.level) queryParams.append('level', params.level)
      if (params?.search) queryParams.append('search', params.search)

      const response = await apiClient.get<StudentsResponse>(`/admin/dashboard/students?${queryParams.toString()}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching students:', error)
      throw error
    }
  },

  // Get reports - using report service endpoint
  async getReports(): Promise<{ available_reports: Report[], recent_reports: any[], report_statistics: ReportStats }> {
    try {
      const response = await apiClient.get<ReportsResponse>('/reports')
      return response.data.data
    } catch (error) {
      console.error('Error fetching reports:', error)
      throw error
    }
  },

  // Get settings - using settings endpoint
  async getSettings(): Promise<{ system_settings: SystemSettings, user_preferences: any, notification_settings: any }> {
    try {
      const response = await apiClient.get<SettingsResponse>('/settings')
      return response.data.data
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  }
}
