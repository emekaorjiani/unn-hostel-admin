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
import { apiClient } from '../../lib/api'
import { safeLocalStorage } from '../../lib/utils'

interface Application {
  id: string
  studentId: string
  applicationWindowId: string
  academicYear: string
  semester: string
  applicationType: 'new' | 'renewal' | 'transfer' | 'swap'
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'cancelled' | 'waitlisted'
  hostelPreferences: Array<{
    hostelId: string
    priority: number
  }>
  roommatePreferences: {
    preferences: {
      tribe: string
      studyTime: string
      noiseLevel: string
    }
  }
  specialRequests?: string
  medicalConditions?: string
  dietaryRestrictions?: string
  isPWD: boolean
  pwdDetails?: string
  isInternationalStudent: boolean
  isDistanceStudent: boolean
  isScholar: boolean
  scholarshipDetails?: string
  totalFees: string
  amountPaid: string
  paymentStatus: 'pending' | 'paid' | 'partial' | 'failed'
  paymentDeadline: string
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
  reviewNotes?: string
  waitlistPosition?: number
  waitlistedAt?: string
  documents: {
    idCard?: string
    scholarshipLetter?: string
    medicalCertificate?: string
  }
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
  deletedAt?: string
  allocations: Record<string, unknown>[]
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
  const [students, setStudents] = useState<Record<string, { firstName: string; lastName: string; matricNumber: string }>>({})
  const [stats, setStats] = useState<ApplicationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [academicYearFilter, setAcademicYearFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  // Fetch applications data from real backend
  const fetchApplications = async () => {
    try {
      setError(null)
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Fetch applications data from real backend with pagination
      const applicationsRes = await apiClient.get('/applications', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          academicYear: academicYearFilter !== 'all' ? academicYearFilter : undefined,
          search: searchQuery || undefined
        }
      })

      // Handle different response structures
      const applicationsData = applicationsRes.data?.applications || applicationsRes.data?.data || applicationsRes.data || []
      const totalCount = applicationsRes.data?.total || applicationsRes.data?.totalCount || applicationsData.length
      
      setApplications(applicationsData)

      // Fetch student details for each application
      const studentIds = [...new Set(applicationsData.map((app: Application) => app.studentId))]
      const studentsData: Record<string, { firstName: string; lastName: string; matricNumber: string }> = {}
      
      for (const studentId of studentIds) {
        try {
          const studentRes = await apiClient.get(`/students/${studentId}`)
          const student = studentRes.data as { firstName?: string; lastName?: string; matricNumber?: string }
          studentsData[studentId] = {
            firstName: student.firstName || '',
            lastName: student.lastName || '',
            matricNumber: student.matricNumber || ''
          }
        } catch (err) {
          console.error(`Failed to fetch student ${studentId}:`, err)
          studentsData[studentId] = {
            firstName: 'Unknown',
            lastName: 'Student',
            matricNumber: 'N/A'
          }
        }
      }
      
      setStudents(studentsData)
      setTotalItems(totalCount)

      // Calculate stats manually since the stats API might not work
      const calculatedStats: ApplicationStats = {
        totalApplications: totalCount,
        approvedApplications: applicationsData.filter((app: Application) => app.status === 'approved').length,
        rejectedApplications: applicationsData.filter((app: Application) => app.status === 'rejected').length,
        pendingApplications: applicationsData.filter((app: Application) => app.status === 'submitted').length,
        waitlistedApplications: applicationsData.filter((app: Application) => app.status === 'waitlisted').length,
        applicationsByStatus: Object.entries(
          applicationsData.reduce<Record<string, number>>((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1
            return acc
          }, {})
        ).map(([status, count]) => ({ status, count })),
        applicationsByMonth: []
      }
      
      setStats(calculatedStats)
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
  }, [currentPage, itemsPerPage, statusFilter, academicYearFilter, searchQuery])

  // Use applications directly since filtering is now done server-side
  const filteredApplications = applications

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'waitlisted': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'under_review': return <Clock className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading applications...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Applications</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <Button 
                onClick={fetchApplications} 
                className="mt-3"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600 mt-1">
              Manage hostel applications and review submissions
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={fetchApplications}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              size="sm"
              onClick={() => router.push('/applications/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-gray-600">
                  All time applications
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.approvedApplications}</div>
                <p className="text-xs text-gray-600">
                  Successfully approved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingApplications}</div>
                <p className="text-xs text-gray-600">
                  Awaiting review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Waitlisted</CardTitle>
                <FileText className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.waitlistedApplications}</div>
                <p className="text-xs text-gray-600">
                  On waitlist
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, matric number, or student ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="waitlisted">Waitlisted</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year
                </label>
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
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            <CardDescription>
              Review and manage hostel applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Hostel</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Academic Year</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {students[application.studentId]?.firstName && students[application.studentId]?.lastName
                                ? `${students[application.studentId].firstName} ${students[application.studentId].lastName}`
                                : `Student ID: ${application.studentId}`
                              }
                            </div>
                            <div className="text-sm text-gray-600">
                              {students[application.studentId]?.matricNumber || 'Matric: N/A'}
                            </div>
                            <div className="text-xs text-gray-500">Type: {application.applicationType}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">
                                            {(application.hostelPreferences?.length || 0) > 0 ?
                  `${application.hostelPreferences.length} preferences` :
                  'No preferences'
                }
                          </div>
                          <div className="text-xs text-gray-600">
                            {(application.hostelPreferences?.length || 0) > 0 && 
                              `Priority: ${application.hostelPreferences[0]?.priority || 'N/A'}`
                            }
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">{application.academicYear}</div>
                          <div className="text-xs text-gray-600">{application.semester}</div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="capitalize">
                            {application.applicationType}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${getStatusColor(application.status)} flex items-center w-fit`}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1 capitalize">{application.status.replace('_', ' ')}</span>
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">
                            {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Not submitted'}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/applications/${application.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/applications/${application.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/applications/${application.id}/review`)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalItems > itemsPerPage && (
          <Card className="mt-6">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} applications
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, Math.ceil(totalItems / itemsPerPage)) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(Math.ceil(totalItems / itemsPerPage), currentPage + 1))}
                    disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
