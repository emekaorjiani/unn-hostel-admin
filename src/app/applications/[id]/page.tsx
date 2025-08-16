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
  MapPin,
  Bed,
  CreditCard
} from 'lucide-react'
import DashboardLayout from '../../../components/layout/dashboard-layout'
import { apiClient } from '../../../lib/api'
import { safeLocalStorage } from '../../../lib/utils'

// Application interface matching the API response
interface Application {
  id: string
  application_window_id: string
  student_id: string
  hostel_id: string | null
  block_id: string | null
  room_id: string | null
  bed_id: string | null
  type: string
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted'
  priority: string
  priority_score: number
  reason: string
  preferences: any
  documents: any
  submitted_at: string | null
  processed_at: string | null
  processed_by: string | null
  admin_notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  // Payment information
  totalAmount?: number
  paidAmount?: number
  paymentStatus?: 'pending' | 'paid' | 'failed'
  // Student information
  student: {
    id: string
    first_name: string
    last_name: string
    email: string
    matric_number: string
    phone_number: string
    department: string
    level: string
    gender: string
    faculty?: string
  }
  // Application window information
  application_window: {
    id: string
    name: string
    description: string
    type: string
    status: string
    start_date: string
    end_date: string
  }
  // Hostel information
  hostel: {
    id: string
    name: string
    description: string
    type: string
    address: string
    capacity?: number
    availableBeds?: number
    occupiedBeds?: number
  }
  // Room and bed information
  block: any
  room: {
    id?: string
    number?: string
    type?: string
    capacity?: number
  } | null
  bed: {
    id?: string
    number?: string
    status?: string
  } | null
}

export default function ViewApplicationPage() {
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string
  
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetches application details from the API using the application ID
   * Handles authentication and data extraction from the API response
   */
  const fetchApplicationData = async () => {
    try {
      setError(null)
      setLoading(true)
      
      // Check for authentication token (supports both admin and student tokens)
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Fetch application details using the correct API endpoint
      const response = await apiClient.get(`/applications/${applicationId}`)
      const applicationData = response.data.data.application
      setApplication(applicationData)

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

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Application</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex space-x-3">
              <Button onClick={() => fetchApplicationData()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!application) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h2>
            <p className="text-gray-600 mb-4">The application you're looking for doesn't exist.</p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
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
          <div className="flex items-center space-x-4">
            <Button onClick={() => router.back()} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
              <p className="text-gray-600 mt-1">View application information and status</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={() => router.push(`/applications/${applicationId}/edit`)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {application.status === 'pending' && (
              <Button onClick={() => router.push(`/applications/${applicationId}/review`)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Review
              </Button>
            )}
          </div>
        </div>

        {/* Application Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Application Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Application #{application.id}</h3>
                <p className="text-sm text-gray-600">
                  Submitted on {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <Badge className={`${getStatusColor(application.status)} flex items-center`}>
                {getStatusIcon(application.status)}
                <span className="ml-1 capitalize">{application.status}</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Student Information */}
        {application.student && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Student Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Personal Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Name:</span>
                      <span className="text-sm text-gray-900">
                        {application.student.first_name} {application.student.last_name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Matric Number:</span>
                      <span className="text-sm text-gray-900">{application.student.matric_number}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{application.student.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{application.student.phone_number}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Academic Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Faculty:</span>
                      <span className="text-sm text-gray-900">{application.student.faculty || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Department:</span>
                      <span className="text-sm text-gray-900">{application.student.department || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Level:</span>
                      <span className="text-sm text-gray-900">{application.student.level || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Gender:</span>
                      <span className="text-sm text-gray-900 capitalize">{application.student.gender || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hostel Information */}
        {application.hostel && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Hostel Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Hostel Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Hostel:</span>
                      <span className="text-sm text-gray-900">{application.hostel.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Room:</span>
                      <span className="text-sm text-gray-900">
                        {application.room?.number || 'Not assigned'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Bed:</span>
                      <span className="text-sm text-gray-900">
                        {application.bed?.number || 'Not assigned'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{application.hostel.address}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Capacity & Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Total Capacity:</span>
                      <span className="text-sm text-gray-900">{application.hostel.capacity || 'Not available'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Available Beds:</span>
                      <span className="text-sm text-gray-900">{application.hostel.availableBeds || 'Not available'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Occupied Beds:</span>
                      <span className="text-sm text-gray-900">{application.hostel.occupiedBeds || 'Not available'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Payment Status</h3>
                <Badge className={`${getPaymentStatusColor(application.paymentStatus || 'pending')} flex items-center w-fit`}>
                  <CreditCard className="h-4 w-4 mr-1" />
                  <span className="capitalize">{application.paymentStatus || 'pending'}</span>
                </Badge>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Amount Details</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="text-sm font-medium text-gray-900">
                      ₦{(application.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Paid Amount:</span>
                    <span className="text-sm font-medium text-gray-900">
                      ₦{(application.paidAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Documents</h3>
                <div className="space-y-1">
                  {application.documents && application.documents.length > 0 ? (
                    application.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{doc.name}</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No documents uploaded</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Application Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                  <p className="text-sm text-gray-600">
                    {application.created_at ? new Date(application.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
              
              {application.status === 'approved' && (
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Approved</p>
                    <p className="text-sm text-gray-600">
                      {application.updated_at ? new Date(application.updated_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              )}

              {application.status === 'rejected' && (
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Rejected</p>
                    <p className="text-sm text-gray-600">
                      {application.updatedAt ? new Date(application.updatedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
