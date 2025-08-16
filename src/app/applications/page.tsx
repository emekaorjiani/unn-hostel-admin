'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react'
import DashboardLayout from '../../components/layout/dashboard-layout'
import { applicationService } from '../../lib/services'
import { safeLocalStorage } from '../../lib/utils'
import { PaginatedResponse, apiClient } from '../../lib/api'

// Application interface matching the API response
interface Application {
  id: string
  createdAt: string
  totalAmount: number
  paymentStatus: 'pending' | 'paid' | 'failed'
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted' | 'cancelled'
  student: {
    firstName: string
    lastName: string
    matricNumber: string
    department: string
    level: number
  }
  hostel: {
    name: string
    type: string
  }
  room: {
    number: string
  }
  bed: {
    number: string
  }
}

interface ApplicationStats {
  totalApplications: number
  approvedApplications: number
  rejectedApplications: number
  pendingApplications: number
  waitlistedApplications: number
  applicationsByStatus: Array<{
    status: string
    count: number
  }>
  applicationsByMonth: Array<{
    month: string
    count: number
  }>
}

export default function ApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<ApplicationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [academicYearFilter, setAcademicYearFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  /**
   * Fetches applications data from the API with filtering and pagination support
   * Handles authentication, query parameters, and response data extraction
   */
  const fetchApplications = async () => {
    try {
      setError(null)
      setLoading(true)
      
      // Check for authentication token (supports both admin and student tokens)
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Prepare query parameters for filtering and pagination
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      }

      // Add status filter if not showing all statuses
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }

      // Add academic year filter if not showing all years
      if (academicYearFilter !== 'all') {
        params.academicYear = academicYearFilter
      }

      // Add search query if provided
      if (searchQuery) {
        params.search = searchQuery
      }

      // Fetch applications from API using the dashboard endpoint
      const response = await apiClient.get('/admin/dashboard/applications', { params })
      
      // Extract data from the response structure
      const responseData = response.data
      setApplications(responseData.data || [])
      setTotalItems(responseData.pagination?.totalItems || 0)
      setTotalPages(responseData.pagination?.totalPages || 0)

      // Extract statistics from the response
      if (responseData.statistics) {
        setStats({
          totalApplications: responseData.statistics.totalApplications || 0,
          approvedApplications: responseData.statistics.approvedApplications || 0,
          rejectedApplications: responseData.statistics.rejectedApplications || 0,
          pendingApplications: responseData.statistics.pendingApplications || 0,
          waitlistedApplications: responseData.statistics.waitlistedApplications || 0,
          applicationsByStatus: [],
          applicationsByMonth: []
        })
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch applications'
      setError(errorMessage)
      console.error('Applications fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch and refetch when filters/pagination change
  useEffect(() => {
    fetchApplications()
  }, [currentPage, itemsPerPage, statusFilter, academicYearFilter])

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1) // Reset to first page when searching
      fetchApplications()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  // Handle application actions
  const handleViewApplication = (id: string) => {
    router.push(`/applications/${id}`)
  }

  const handleEditApplication = (id: string) => {
    router.push(`/applications/${id}/edit`)
  }

  const handleReviewApplication = (id: string) => {
    router.push(`/applications/${id}/review`)
  }

  const handleDeleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return
    }

    try {
      await apiClient.delete(`/admin/applications/${id}`)
      // Refresh the applications list
      fetchApplications()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete application'
      setError(errorMessage)
      console.error('Delete application error:', err)
    }
  }

  // Loading state
  if (loading && applications.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Loading applications...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600 mt-1">Manage student hostel applications</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={fetchApplications} variant="outline" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => router.push('/applications/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalApplications}</div>
                  <div className="text-sm text-gray-600">Total Applications</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.approvedApplications}</div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.rejectedApplications}</div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.waitlistedApplications}</div>
                  <div className="text-sm text-gray-600">Waitlisted</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by student name, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                <select
                  value={academicYearFilter}
                  onChange={(e) => setAcademicYearFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Years</option>
                  <option value="2024/2025">2024/2025</option>
                  <option value="2023/2024">2023/2024</option>
                  <option value="2022/2023">2022/2023</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({totalItems})</CardTitle>
            <CardDescription>
              Showing {applications.length} of {totalItems} applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || statusFilter !== 'all' || academicYearFilter !== 'all'
                    ? 'Try adjusting your filters or search terms.'
                    : 'No applications have been submitted yet.'}
                </p>
                {searchQuery || statusFilter !== 'all' || academicYearFilter !== 'all' ? (
                  <Button onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setAcademicYearFilter('all')
                  }} variant="outline">
                    Clear Filters
                  </Button>
                ) : (
                  <Button onClick={() => router.push('/applications/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Application
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Hostel</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Payment</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {application.student?.firstName} {application.student?.lastName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {application.student?.matricNumber}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {application.hostel?.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              Room {application.room?.number}, Bed {application.bed?.number}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(application.status)}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1 capitalize">{application.status}</span>
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              ₦{application.totalAmount?.toLocaleString()}
                            </div>
                            <Badge className={
                              application.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : application.paymentStatus === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }>
                              {application.paymentStatus}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              onClick={() => handleViewApplication(application.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleEditApplication(application.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {application.status === 'pending' && (
                              <Button
                                onClick={() => handleReviewApplication(application.id)}
                                variant="outline"
                                size="sm"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              onClick={() => handleDeleteApplication(application.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
