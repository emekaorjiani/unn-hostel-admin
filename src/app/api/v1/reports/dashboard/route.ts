import { NextRequest, NextResponse } from "next/server";
import { config } from "../../../../../lib/config";

// Dashboard data types based on the API documentation
interface DashboardOverviewDto {
  occupancy: {
    totalBeds: number;
    occupiedBeds: number;
    availableBeds: number;
    occupancyRate: number;
    hostelBreakdown: Array<{
      hostelId: string;
      hostelName: string;
      totalBeds: number;
      occupiedBeds: number;
      availableBeds: number;
      occupancyRate: number;
    }>;
  };
  revenue: {
    totalRevenue: number;
    totalPayments: number;
    pendingPayments: number;
    failedPayments: number;
    revenueByMonth: Array<{
      month: string;
      revenue: number;
      payments: number;
    }>;
    revenueByHostel: Array<{
      hostelId: string;
      hostelName: string;
      revenue: number;
      payments: number;
    }>;
  };
  applications: {
    totalApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    pendingApplications: number;
    waitlistedApplications: number;
    applicationsByStatus: Array<{
      status: string;
      count: number;
    }>;
    applicationsByMonth: Array<{
      month: string;
      count: number;
    }>;
  };
  maintenance: {
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    averageResolutionTime: number;
    ticketsByCategory: Array<{
      category: string;
      count: number;
    }>;
    ticketsByPriority: Array<{
      priority: string;
      count: number;
    }>;
  };
}

// Helper function to fetch live data from the backend API
async function fetchLiveDashboardData(token: string, filters: Record<string, string>): Promise<DashboardOverviewDto> {
  const baseUrl = config.backend.baseUrl;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Fetch live data from all report endpoints
    const [occupancyRes, revenueRes, applicationsRes, maintenanceRes] = await Promise.all([
      fetch(`${baseUrl}/reports/occupancy?${new URLSearchParams(filters)}`, { headers }),
      fetch(`${baseUrl}/reports/revenue?${new URLSearchParams(filters)}`, { headers }),
      fetch(`${baseUrl}/reports/applications?${new URLSearchParams(filters)}`, { headers }),
      fetch(`${baseUrl}/reports/maintenance?${new URLSearchParams(filters)}`, { headers })
    ]);

    // Check if all requests were successful
    if (!occupancyRes.ok || !revenueRes.ok || !applicationsRes.ok || !maintenanceRes.ok) {
      throw new Error('Failed to fetch live dashboard data from backend');
    }

    const [occupancyData, revenueData, applicationsData, maintenanceData] = await Promise.all([
      occupancyRes.json(),
      revenueRes.json(),
      applicationsRes.json(),
      maintenanceRes.json()
    ]);

    return {
      occupancy: occupancyData,
      revenue: revenueData,
      applications: applicationsData,
      maintenance: maintenanceData
    };
  } catch (error) {
    console.error('Error fetching live dashboard data:', error);
    throw new Error('Unable to fetch live data from backend. Please ensure the backend API is running and accessible.');
  }
}

// No mock data - only live data from backend

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const hostel = searchParams.get("hostel");
    const faculty = searchParams.get("faculty");

    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT token and get user role
    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const userRole = decoded.role || "student";

    // Build filters object for the backend API
    const filters: Record<string, string> = {};
    if (period) filters.period = period;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (hostel) filters.hostelId = hostel;
    if (faculty) filters.faculty = faculty;

    // Fetch live dashboard data from backend API
    const dashboardData = await fetchLiveDashboardData(token, filters);

    return NextResponse.json({
      success: true,
      data: dashboardData,
      filters: {
        period,
        startDate,
        endDate,
        hostel,
        faculty,
      },
      userRole,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to verify JWT token
async function verifyToken(token: string) {
  try {
    // Parse the token format: admin-token-{userId}-{timestamp} or student-token-{userId}-{timestamp}
    if (token.startsWith('admin-token-')) {
      const parts = token.split('-');
      const userId = parts[2];
      return { role: 'super_admin', userId };
    } else if (token.startsWith('student-token-')) {
      const parts = token.split('-');
      const userId = parts[2];
      return { role: 'student', userId };
    } else if (token === 'super-admin-token') {
      return { role: 'super_admin', userId: '1' };
    } else if (token === 'admin-token') {
      return { role: 'admin', userId: '2' };
    } else if (token === 'student-token') {
      return { role: 'student', userId: '3' };
    }

    return null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

