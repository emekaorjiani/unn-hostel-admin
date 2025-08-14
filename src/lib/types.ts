// Common types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Application Window types
export interface ApplicationWindow extends BaseEntity {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  maxApplications: number;
  currentApplications: number;
  status: "draft" | "active" | "closed";
}

export interface CreateApplicationWindowData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  maxApplications: number;
}

// Application types
export interface Application extends BaseEntity {
  studentId: string;
  applicationWindowId: string;
  hostelId: string;
  roomId: string;
  bedId: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  documents: ApplicationDocument[];
  paymentStatus: "pending" | "paid" | "failed";
  totalAmount: number;
  paidAmount: number;
  student: Student;
  hostel: Hostel;
  room: Room;
  bed: Bed;
}

export interface ApplicationDocument extends BaseEntity {
  name: string;
  type: "identification" | "academic" | "medical" | "other";
  url: string;
  size: number;
}

export interface CreateApplicationData {
  applicationWindowId: string;
  hostelId: string;
  roomId: string;
  bedId: string;
  documents: File[];
}

// Hostel types
export interface Hostel extends BaseEntity {
  name: string;
  description: string;
  address: string;
  capacity: number;
  occupiedBeds: number;
  availableBeds: number;
  blocks: Block[];
  amenities: string[];
  rules: string[];
  contactInfo: ContactInfo;
}

export interface Block extends BaseEntity {
  name: string;
  hostelId: string;
  capacity: number;
  occupiedBeds: number;
  availableBeds: number;
  rooms: Room[];
}

export interface Room extends BaseEntity {
  number: string;
  blockId: string;
  capacity: number;
  occupiedBeds: number;
  availableBeds: number;
  type: "single" | "double" | "triple" | "quad";
  price: number;
  beds: Bed[];
}

export interface Bed extends BaseEntity {
  number: string;
  roomId: string;
  status: "available" | "occupied" | "maintenance" | "reserved";
  studentId?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

// Student types
export interface Student extends BaseEntity {
  matricNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female";
  department: string;
  level: number;
  isActive: boolean;
  applications: Application[];
}

// Payment types
export interface Payment extends BaseEntity {
  applicationId: string;
  studentId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: "card" | "bank_transfer" | "cash" | "online";
  gateway: string;
  reference: string;
  description: string;
  metadata: Record<string, unknown>;
}

export interface PaymentGateway {
  id: string;
  name: string;
  isActive: boolean;
  config: Record<string, unknown>;
}

// Room Selection types
export interface RoomSelectionSession extends BaseEntity {
  applicationWindowId: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "active" | "completed" | "cancelled";
  maxParticipants: number;
  currentParticipants: number;
  selections: RoomSelection[];
}

export interface RoomSelection extends BaseEntity {
  sessionId: string;
  studentId: string;
  applicationId: string;
  status: "queued" | "active" | "completed" | "cancelled";
  queuePosition: number;
  selectedRoomId?: string;
  selectedBedId?: string;
  startTime?: string;
  endTime?: string;
}

// Maintenance types
export interface MaintenanceTicket extends BaseEntity {
  title: string;
  description: string;
  category: "electrical" | "plumbing" | "structural" | "appliance" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "assigned" | "in_progress" | "resolved" | "closed";
  studentId?: string;
  roomId?: string;
  assignedTo?: string;
  estimatedCompletion?: string;
  actualCompletion?: string;
  images: string[];
}

export interface VisitorPass extends BaseEntity {
  visitorName: string;
  visitorPhone: string;
  purpose: string;
  studentId: string;
  roomId: string;
  validFrom: string;
  validUntil: string;
  status: "active" | "expired" | "cancelled";
}

export interface SecurityIncident extends BaseEntity {
  title: string;
  description: string;
  type: "theft" | "vandalism" | "noise" | "unauthorized_access" | "other";
  severity: "low" | "medium" | "high" | "critical";
  status: "reported" | "investigating" | "resolved" | "closed";
  location: string;
  reportedBy: string;
  assignedTo?: string;
  resolution?: string;
}

// Notification types
export interface Notification extends BaseEntity {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category: "application" | "payment" | "maintenance" | "security" | "general";
  recipientId?: string;
  recipientType: "student" | "admin" | "all";
  isRead: boolean;
  readAt?: string;
  metadata: Record<string, unknown>;
}

export interface NotificationTemplate extends BaseEntity {
  name: string;
  title: string;
  message: string;
  type: "email" | "sms" | "push" | "in_app";
  variables: string[];
  isActive: boolean;
}

// Report types
export interface DashboardStats {
  totalStudents: number;
  totalApplications: number;
  pendingApplications: number;
  totalHostels: number;
  totalRooms: number;
  availableBeds: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeMaintenanceTickets: number;
  recentActivities: ActivityLog[];
}

export interface ActivityLog extends BaseEntity {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  userType: "student" | "admin";
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
}

// User types
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "super_admin" | "student";
  isActive: boolean;
  lastLoginAt?: string;
  permissions: string[];
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "file"
    | "date";
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: Record<string, unknown>;
}

// Filter and pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  [key: string]: unknown;
}

export interface QueryParams extends PaginationParams, FilterParams {}

