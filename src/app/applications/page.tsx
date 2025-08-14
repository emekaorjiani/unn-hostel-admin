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

// Generate dummy applications data
function generateDummyApplications(): Application[] {
  const applications: Application[] = []
  const statuses: Application['status'][] = ['submitted', 'under_review', 'approved', 'rejected', 'waitlisted', 'draft']
  const types: Application['applicationType'][] = ['new', 'renewal', 'transfer', 'swap']
  const hostels = ['Zik Hall', 'Mariere Hall', 'Mellanby Hall', 'Kuti Hall', 'Alvan Ikoku Hall', 'Eni Njoku Hall']
  const faculties = ['Engineering', 'Sciences', 'Arts', 'Social Sciences', 'Medicine']
  
  for (let i = 1; i <= 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    const hostel = hostels[Math.floor(Math.random() * hostels.length)]
    const faculty = faculties[Math.floor(Math.random() * faculties.length)]
    
    applications.push({
      id: `app_${i}`,
      studentId: `student_${i}`,
      applicationWindowId: `window_${Math.floor(Math.random() * 3) + 1}`,
      academicYear: '2024/2025',
      semester: Math.random() > 0.5 ? 'First' : 'Second',
      applicationType: type,
      status,
      hostelPreferences: [
        {
          hostelId: `hostel_${Math.floor(Math.random() * 6) + 1}`,
          priority: Math.floor(Math.random() * 3) + 1
        }
      ],
      roommatePreferences: {
        preferences: {
          tribe: 'Any',
          studyTime: 'Night',
          noiseLevel: 'Low'
        }
      },
      specialRequests: Math.random() > 0.7 ? 'Quiet room preferred' : undefined,
      medicalConditions: Math.random() > 0.8 ? 'Asthma' : undefined,
      dietaryRestrictions: Math.random() > 0.9 ? 'Vegetarian' : undefined,
      isPWD: Math.random() > 0.95,
      pwdDetails: Math.random() > 0.95 ? 'Wheelchair accessible room needed' : undefined,
      isInternationalStudent: Math.random() > 0.9,
      isDistanceStudent: Math.random() > 0.8,
      isScholar: Math.random() > 0.85,
      scholarshipDetails: Math.random() > 0.85 ? 'Merit scholarship recipient' : undefined,
      totalFees: '150000',
      amountPaid: status === 'approved' ? '150000' : '0',
      paymentStatus: status === 'approved' ? 'paid' : 'pending',
      paymentDeadline: '2024-12-31',
      submittedAt: status !== 'draft' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      reviewedAt: ['approved', 'rejected', 'waitlisted'].includes(status) ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      reviewedBy: ['approved', 'rejected', 'waitlisted'].includes(status) ? 'admin_1' : undefined,
      reviewNotes: ['approved', 'rejected', 'waitlisted'].includes(status) ? 'Application reviewed and processed' : undefined,
      waitlistPosition: status === 'waitlisted' ? Math.floor(Math.random() * 20) + 1 : undefined,
      waitlistedAt: status === 'waitlisted' ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      documents: {
        idCard: Math.random() > 0.3 ? 'document_1.pdf' : undefined,
        scholarshipLetter: Math.random() > 0.7 ? 'scholarship_1.pdf' : undefined,
        medicalCertificate: Math.random() > 0.8 ? 'medical_1.pdf' : undefined
      },
      metadata: {},
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      allocations: []
    })
  }
  
  return applications
}

// Generate dummy students data
function generateDummyStudents(): Record<string, { firstName: string; lastName: string; matricNumber: string }> {
  const students: Record<string, { firstName: string; lastName: string; matricNumber: string }> = {}
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Emma', 'Robert', 'Olivia', 'William', 'Sophia', 'Richard', 'Isabella', 'Joseph', 'Mia', 'Thomas', 'Charlotte', 'Christopher', 'Amelia']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
  
  for (let i = 1; i <= 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const matricNumber = `2020/${Math.floor(Math.random() * 9000) + 1000}/${Math.floor(Math.random() * 900) + 100}`
    
    students[`student_${i}`] = {
      firstName,
      lastName,
      matricNumber
    }
  }
  
  return students
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

  // Fetch applications data from dummy data
  const fetchApplications = async () => {
    try {
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Generate dummy data
      const applicationsData = generateDummyApplications()
      const studentsData = generateDummyStudents()
      
      // Apply filters
      let filteredApplications = applicationsData
      
      if (statusFilter !== 'all') {
        filteredApplications = filteredApplications.filter(app => app.status === statusFilter)
      }
      
      if (academicYearFilter !== 'all') {
        filteredApplications = filteredApplications.filter(app => app.academicYear === academicYearFilter)
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredApplications = filteredApplications.filter(app => {
          const student = studentsData[app.studentId]
          return (
            student?.firstName.toLowerCase().includes(query) ||
            student?.lastName.toLowerCase().includes(query) ||
            student?.matricNumber.toLowerCase().includes(query) ||
            app.id.toLowerCase().includes(query)
          )
        })
      }
      
      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedApplications = filteredApplications.slice(startIndex, endIndex)
      
      setApplications(paginatedApplications)
      setStudents(studentsData)
      setTotalItems(filteredApplications.length)

      // Calculate stats
      const calculatedStats: ApplicationStats = {
        totalApplications: filteredApplications.length,
        approvedApplications: filteredApplications.filter(app => app.status === 'approved').length,
        rejectedApplications: filteredApplications.filter(app => app.status === 'rejected').length,
        pendingApplications: filteredApplications.filter(app => app.status === 'submitted').length,
        waitlistedApplications: filteredApplications.filter(app => app.status === 'waitlisted').length,
        applicationsByStatus: Object.entries(
          filteredApplications.reduce<Record<string, number>>((acc, app) => {
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

  // Use applications directly since filtering is now done client-side
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
