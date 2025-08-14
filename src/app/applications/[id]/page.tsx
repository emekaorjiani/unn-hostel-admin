'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { 
  FileText, 
  ArrowLeft, 
  Edit, 
  Eye, 
  User, 
  Building, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import DashboardLayout from '../../../components/layout/dashboard-layout'
import { apiClient } from '../../../lib/api'
import { safeLocalStorage } from '../../../lib/utils'

interface Application {
  id: string
  studentId: string
  studentName: string
  matricNumber: string
  email: string
  phoneNumber: string
  hostelId: string
  hostelName: string
  academicYear: string
  semester: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'cancelled' | 'waitlisted'
  applicationType: 'new' | 'renewal' | 'transfer' | 'swap'
  preferences: string[]
  additionalNotes?: string
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
  reviewNotes?: string
  createdAt: string
  updatedAt: string
}

interface Student {
  id: string
  firstName: string
  lastName: string
  matricNumber: string
  email: string
  phoneNumber: string
  faculty: string
  department: string
  level: string
  gender: 'male' | 'female'
  address: string
  stateOfOrigin: string
  localGovernment: string
  emergencyContact: string
  emergencyPhone: string
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
  isVerified: boolean
  isInternationalStudent: boolean
  isPWD: boolean
}

interface Hostel {
  id: string
  name: string
  description: string
  gender: 'male' | 'female' | 'mixed'
  capacity: number
  availableBeds: number
  pricePerSemester: number
  address: string
  blocks: Array<{
    id: string
    name: string
    floors: number
    roomsPerFloor: number
  }>
}

export default function ViewApplicationPage() {
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string
  
  const [application, setApplication] = useState<Application | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [hostel, setHostel] = useState<Hostel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch application data
  const fetchApplicationData = async () => {
    try {
      setError(null)
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Fetch application details
      const applicationRes = await apiClient.get(`/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const applicationData = applicationRes.data
      setApplication(applicationData)

      // Fetch student details if available
      if (applicationData.studentId) {
        try {
          const studentRes = await apiClient.get(`/students/${applicationData.studentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const studentData = studentRes.data
          setStudent(studentData)
        } catch (err) {
          console.warn('Could not fetch student details:', err)
        }
      }

      // Fetch hostel details if available
      if (applicationData.hostelId) {
        try {
          const hostelRes = await apiClient.get(`/hostels/${applicationData.hostelId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const hostelData = hostelRes.data
          setHostel(hostelData)
        } catch (err) {
          console.warn('Could not fetch hostel details:', err)
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch application data'
      setError(errorMessage)
      console.error('Application fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    if (applicationId) {
      fetchApplicationData()
    }
  }, [applicationId])

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'under_review': return 'bg-orange-100 text-orange-800'
      case 'waitlisted': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'submitted': return <FileText className="h-4 w-4" />
      case 'under_review': return <Clock className="h-4 w-4" />
      case 'waitlisted': return <AlertCircle className="h-4 w-4" />
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
            <p className="text-gray-600">Loading application details...</p>
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
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Application</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <Button 
                onClick={fetchApplicationData} 
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

  // Not found state
  if (!application) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Application Not Found</h3>
          <p className="text-gray-600">The application you're looking for doesn't exist.</p>
          <Button 
            onClick={() => router.push('/applications')} 
            className="mt-4"
          >
            Back to Applications
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
              <p className="text-gray-600">View application information and status</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/applications/${applicationId}/edit`)}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/applications/${applicationId}/review`)}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Review</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Application Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Application Status</span>
                  <Badge className={getStatusColor(application.status)}>
                    {getStatusIcon(application.status)}
                    <span className="ml-1">{application.status.replace('_', ' ')}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application ID</label>
                    <p className="text-sm text-gray-900 mt-1">{application.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Type</label>
                    <p className="text-sm text-gray-900 mt-1 capitalize">{application.applicationType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                    <p className="text-sm text-gray-900 mt-1">{application.academicYear}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Semester</label>
                    <p className="text-sm text-gray-900 mt-1 capitalize">{application.semester}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {application.submittedAt 
                        ? new Date(application.submittedAt).toLocaleDateString()
                        : 'Not submitted'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(application.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Student Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student Name</label>
                    <p className="text-sm text-gray-900 mt-1">{application.studentName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Matric Number</label>
                    <p className="text-sm text-gray-900 mt-1">{application.matricNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900 mt-1">{application.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="text-sm text-gray-900 mt-1">{application.phoneNumber}</p>
                  </div>
                  {student && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Faculty</label>
                        <p className="text-sm text-gray-900 mt-1">{student.faculty}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <p className="text-sm text-gray-900 mt-1">{student.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Level</label>
                        <p className="text-sm text-gray-900 mt-1">{student.level}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <p className="text-sm text-gray-900 mt-1 capitalize">{student.gender}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hostel Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Hostel Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hostel Name</label>
                    <p className="text-sm text-gray-900 mt-1">{application.hostelName}</p>
                  </div>
                  {hostel && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <p className="text-sm text-gray-900 mt-1 capitalize">{hostel.gender}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Capacity</label>
                        <p className="text-sm text-gray-900 mt-1">{hostel.capacity} beds</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Available Beds</label>
                        <p className="text-sm text-gray-900 mt-1">{hostel.availableBeds || 'N/A'} beds</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price per Semester</label>
                        <p className="text-sm text-gray-900 mt-1">₦{(hostel.pricePerSemester || 0).toLocaleString()}</p>
                      </div>
                    </>
                  )}
                </div>
                {hostel?.description && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900 mt-1">{hostel.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preferences */}
                          {application.preferences && (application.preferences?.length || 0) > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Room Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {application.preferences.map((preference, index) => (
                      <Badge key={index} variant="outline">
                        {preference}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Notes */}
            {application.additionalNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-900">{application.additionalNotes}</p>
                </CardContent>
              </Card>
            )}

            {/* Review Information */}
            {(application.reviewedAt || application.reviewedBy || application.reviewNotes) && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {application.reviewedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Reviewed At</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {new Date(application.reviewedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {application.reviewedBy && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Reviewed By</label>
                        <p className="text-sm text-gray-900 mt-1">{application.reviewedBy}</p>
                      </div>
                    )}
                  </div>
                  {application.reviewNotes && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Review Notes</label>
                      <p className="text-sm text-gray-900 mt-1">{application.reviewNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/applications/${applicationId}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Application
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/applications/${applicationId}/review`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Review Application
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Application Created</p>
                      <p className="text-xs text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {application.submittedAt && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                        <p className="text-xs text-gray-500">
                          {new Date(application.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {application.reviewedAt && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Application Reviewed</p>
                        <p className="text-xs text-gray-500">
                          {new Date(application.reviewedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
