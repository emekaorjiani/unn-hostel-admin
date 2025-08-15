'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Badge } from '../../../../components/ui/badge'
import { 
  FileText, 
  ArrowLeft, 
  Save, 
  Building, 
  User, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  RefreshCw,
  Send,
  Mail
} from 'lucide-react'
import DashboardLayout from '../../../../components/layout/dashboard-layout'
import { apiClient } from '../../../../lib/api'
import { safeLocalStorage } from '../../../../lib/utils'

// Type definitions for application data structures
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

// Type definition for the review form data
interface ReviewForm {
  status: 'approved' | 'rejected' | 'waitlisted' | 'under_review'
  reviewNotes: string
  sendNotification: boolean
  notificationMessage: string
}

// Type definition for student information
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
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
  isVerified: boolean
}

// Type definition for hostel information
interface Hostel {
  id: string
  name: string
  description: string
  gender: 'male' | 'female' | 'mixed'
  capacity: number
  availableBeds: number
  pricePerSemester: number
}

export default function ReviewApplicationPage() {
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string
  
  // State management for application data and UI
  const [application, setApplication] = useState<Application | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [hostel, setHostel] = useState<Hostel | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Review form state with default values
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    status: 'under_review',
    reviewNotes: '',
    sendNotification: true,
    notificationMessage: ''
  })

  /**
   * Fetches application data and related information (student, hostel)
   * Handles authentication and error states
   */
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

      // Initialize review form with current application status
      setReviewForm(prev => ({
        ...prev,
        status: applicationData.status === 'submitted' ? 'under_review' : applicationData.status,
        reviewNotes: applicationData.reviewNotes || '',
        notificationMessage: getDefaultNotificationMessage(applicationData.status)
      }))

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

  /**
   * Generates default notification messages based on application status
   * @param status - The application status
   * @returns Default notification message for the status
   */
  const getDefaultNotificationMessage = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'Congratulations! Your hostel application has been approved. Please proceed with payment within 7 days to secure your accommodation.'
      case 'rejected':
        return 'We regret to inform you that your hostel application has been rejected. Please contact the hostel office for more information.'
      case 'waitlisted':
        return 'Your hostel application has been waitlisted. We will notify you if a space becomes available.'
      case 'under_review':
        return 'Your hostel application is currently under review. We will notify you once a decision has been made.'
      default:
        return ''
    }
  }

  // Fetch application data on component mount
  useEffect(() => {
    if (applicationId) {
      fetchApplicationData()
    }
  }, [applicationId])

  /**
   * Handles form input changes and updates the review form state
   * Automatically updates notification message when status changes
   * @param field - The field to update
   * @param value - The new value for the field
   */
  const handleInputChange = (field: keyof ReviewForm, value: string | boolean) => {
    setReviewForm(prev => {
      const updatedForm = {
        ...prev,
        [field]: value
      }

      // Update notification message when status changes
      if (field === 'status' && typeof value === 'string') {
        updatedForm.notificationMessage = getDefaultNotificationMessage(value)
      }

      return updatedForm
    })
  }

  /**
   * Returns the appropriate CSS classes for status badge colors
   * @param status - The status to get color for
   * @returns CSS classes for the status badge
   */
  const getStatusColor = (status: string): string => {
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

  /**
   * Returns the appropriate icon component for each status
   * @param status - The status to get icon for
   * @returns JSX element with the status icon
   */
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

  /**
   * Handles form submission for reviewing the application
   * Validates required fields and submits the review
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)
      setSuccess(null)

      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Validate required fields
      if (!reviewForm.status || !reviewForm.reviewNotes.trim()) {
        throw new Error('Please fill in all required fields')
      }

      // Submit review to API
      const response = await apiClient.post(`/applications/${applicationId}/review`, {
        status: reviewForm.status,
        reviewNotes: reviewForm.reviewNotes,
        sendNotification: reviewForm.sendNotification,
        notificationMessage: reviewForm.notificationMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSuccess('Application reviewed successfully!')
      
      // Redirect to application view after a short delay
      setTimeout(() => {
        router.push(`/applications/${applicationId}`)
      }, 2000)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to review application'
      setError(errorMessage)
      console.error('Application review error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state component
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading application for review...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state component
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

  // Not found state component
  if (!application) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Application Not Found</h3>
          <p className="text-gray-600">The application you&apos;re looking for doesn&apos;t exist.</p>
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
        {/* Page Header */}
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
              <h1 className="text-2xl font-bold text-gray-900">Review Application</h1>
              <p className="text-gray-600">Review and make decision on application</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/applications/${applicationId}`)}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Application Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Application Summary</span>
                  <Badge className={getStatusColor(application.status)}>
                    {getStatusIcon(application.status)}
                    <span className="ml-1">{application.status.replace('_', ' ')}</span>
                  </Badge>
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
                    <label className="block text-sm font-medium text-gray-700">Hostel</label>
                    <p className="text-sm text-gray-900 mt-1">{application.hostelName}</p>
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
                    <label className="block text-sm font-medium text-gray-700">Application Type</label>
                    <p className="text-sm text-gray-900 mt-1 capitalize">{application.applicationType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Information Card */}
            {student && (
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
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900 mt-1">{student.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900 mt-1">{student.phoneNumber}</p>
                    </div>
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
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hostel Information Card */}
            {hostel && (
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <p className="text-sm text-gray-900 mt-1 capitalize">{hostel.gender}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Application Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent>
                {application.preferences && (application.preferences?.length || 0) > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Preferences</label>
                    <div className="flex flex-wrap gap-2">
                      {application.preferences.map((preference, index) => (
                        <Badge key={index} variant="outline">
                          {preference}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {application.additionalNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <p className="text-sm text-gray-900">{application.additionalNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Review Form */}
          <div className="space-y-6">
            {/* Review Decision Form */}
            <Card>
              <CardHeader>
                <CardTitle>Review Decision</CardTitle>
                <CardDescription>
                  Make a decision on this application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Decision Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Decision *
                    </label>
                    <select
                      value={reviewForm.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                      <option value="waitlisted">Waitlist</option>
                    </select>
                  </div>

                  {/* Review Notes Textarea */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Notes *
                    </label>
                    <textarea
                      value={reviewForm.reviewNotes}
                      onChange={(e) => handleInputChange('reviewNotes', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your review notes..."
                      required
                    />
                  </div>

                  {/* Notification Toggle */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={reviewForm.sendNotification}
                      onChange={(e) => handleInputChange('sendNotification', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">Send notification to student</label>
                  </div>

                  {/* Notification Message Textarea */}
                  {reviewForm.sendNotification && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notification Message
                      </label>
                      <textarea
                        value={reviewForm.notificationMessage}
                        onChange={(e) => handleInputChange('notificationMessage', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter notification message..."
                      />
                    </div>
                  )}

                  {/* Form Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={submitting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || !reviewForm.status || !reviewForm.reviewNotes.trim()}
                      className="flex-1 flex items-center space-x-2"
                    >
                      {submitting ? (
                        <>
                          <Clock className="h-4 w-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Review</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/applications/${applicationId}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Details
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
