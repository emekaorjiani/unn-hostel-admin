'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  ArrowLeft, 
  Save, 
  Building, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock} from 'lucide-react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { apiClient } from '@/lib/api'
import { safeLocalStorage } from '@/lib/utils'

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
  }
  application_window: {
    id: string
    name: string
    description: string
    type: string
    status: string
    start_date: string
    end_date: string
  }
  hostel: {
    id: string
    name: string
    description: string
    type: string
    address: string
  }
  block: any
  room: any
  bed: any
}

interface ApplicationForm {
  application_window_id: string
  hostel_id: string
  room_id: string
  bed_id: string
  documents: File[]
}

interface Hostel {
  id: string
  name: string
  description: string
  type: string
  address: string
}

interface ApplicationWindow {
  id: string
  name: string
  description: string
  type: string
  status: string
  start_date: string
  end_date: string
}

export default function EditApplicationPage() {
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form data
  const [formData, setFormData] = useState<ApplicationForm>({
    application_window_id: '',
    hostel_id: '',
    room_id: '',
    bed_id: '',
    documents: []
  })

  // Available data
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [applicationWindows, setApplicationWindows] = useState<ApplicationWindow[]>([])
  const [selectedWindow, setSelectedWindow] = useState<ApplicationWindow | null>(null)
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null)
  const [originalApplication, setOriginalApplication] = useState<Application | null>(null)

  // Fetch application and available data
  const fetchData = async () => {
    try {
      setLoading(true)
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Fetch current application using API
      const applicationResponse = await apiClient.get(`/applications/${applicationId}`)
      const application = applicationResponse.data.data.application
      setOriginalApplication(application)
      
      // Set form data from application
      setFormData({
        application_window_id: application.application_window_id || '',
        hostel_id: application.hostel_id || '',
        room_id: application.room_id || '',
        bed_id: application.bed_id || '',
        documents: []
      })

      // Fetch hostels using API
      const hostelsResponse = await apiClient.get('/admin/dashboard/hostels')
      const hostelsData = hostelsResponse.data.data?.hostels || hostelsResponse.data.hostels || hostelsResponse.data.data || []
      setHostels(hostelsData)
      
      // Fetch application windows using fallback data (since API doesn't exist)
      const fallbackWindows: ApplicationWindow[] = [
        {
          id: 'window-1',
          name: '2024/2025 Academic Year - First Semester',
          description: 'Application window for first semester hostel accommodation',
          type: 'returning',
          status: 'active',
          start_date: '2024-08-01T00:00:00Z',
          end_date: '2024-08-31T23:59:59Z'
        },
        {
          id: 'window-2',
          name: '2024/2025 Academic Year - Second Semester',
          description: 'Application window for second semester hostel accommodation',
          type: 'returning',
          status: 'scheduled',
          start_date: '2024-12-01T00:00:00Z',
          end_date: '2024-12-31T23:59:59Z'
        },
        {
          id: 'window-3',
          name: '2024/2025 Freshman Application',
          description: 'Application window for incoming freshmen students',
          type: 'freshman',
          status: 'active',
          start_date: '2024-07-01T00:00:00Z',
          end_date: '2024-07-31T23:59:59Z'
        }
      ]
      setApplicationWindows(fallbackWindows)

      // Set selected window and hostel
      if (application.application_window_id) {
        const window = fallbackWindows.find(w => w.id === application.application_window_id)
        setSelectedWindow(window || null)
      }

      if (application.hostel_id) {
        const hostel = hostelsData.find((h: any) => h.id === application.hostel_id)
        setSelectedHostel(hostel || null)
      }
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch application data'
      setError(errorMessage)
      console.error('Data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    if (applicationId) {
      fetchData()
    }
  }, [applicationId])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.application_window_id || !formData.hostel_id) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Update application using API
      const applicationData = {
        application_window_id: formData.application_window_id,
        hostel_id: formData.hostel_id,
        room_id: formData.room_id,
        bed_id: formData.bed_id,
        documents: formData.documents
      }

      const updatedApplication = await apiClient.put(`/applications/${applicationId}`, applicationData)
      
      setSuccess('Application updated successfully!')
      
      // Redirect to the application view after a short delay
      setTimeout(() => {
        router.push(`/applications/${applicationId}`)
      }, 2000)

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update application'
      setError(errorMessage)
      console.error('Application update error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle form field changes
  const handleInputChange = (field: keyof ApplicationForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Update selected window when application window changes
    if (field === 'application_window_id') {
      const window = applicationWindows.find(w => w.id === value)
      setSelectedWindow(window || null)
    }

    // Update selected hostel when hostel changes
    if (field === 'hostel_id') {
      const hostel = hostels.find((h: any) => h.id === value)
      setSelectedHostel(hostel || null)
    }
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }))
  }

  // Remove file
  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Loading application data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error && !originalApplication) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Application</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex space-x-3">
              <Button onClick={() => fetchData()} variant="outline">
                <Clock className="h-4 w-4 mr-2" />
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

  if (!originalApplication) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h2>
            <p className="text-gray-600 mb-4">The application you're trying to edit doesn't exist.</p>
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
        <div className="flex items-center space-x-4">
          <Button onClick={() => router.back()} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Application</h1>
            <p className="text-gray-600 mt-1">Update application information</p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800">{success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Application Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Current Application Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Application #{originalApplication.id}</h3>
                <p className="text-sm text-gray-600">
                  Created on {originalApplication.created_at ? new Date(originalApplication.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <Badge className={
                originalApplication.status === 'approved' ? 'bg-green-100 text-green-800' :
                originalApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                originalApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }>
                {originalApplication.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Application Window Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Application Window</span>
              </CardTitle>
              <CardDescription>
                Select the application window for this application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Window *
                  </label>
                  <select
                    value={formData.application_window_id}
                    onChange={(e) => handleInputChange('application_window_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select an application window</option>
                    {applicationWindows.map((window) => (
                      <option key={window.id} value={window.id}>
                        {window.name} ({new Date(window.start_date).toLocaleDateString()} - {new Date(window.end_date).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedWindow && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium text-blue-900">{selectedWindow.name}</h4>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">{selectedWindow.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">Start Date:</span>
                        <span className="ml-2 text-blue-900">{new Date(selectedWindow.start_date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-blue-600">End Date:</span>
                        <span className="ml-2 text-blue-900">{new Date(selectedWindow.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge className={selectedWindow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {selectedWindow.status === 'active' ? 'Active' : 'Draft'}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hostel Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Hostel Selection</span>
              </CardTitle>
              <CardDescription>
                Choose the hostel, room, and bed for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hostel *
                  </label>
                  <select
                    value={formData.hostel_id}
                    onChange={(e) => handleInputChange('hostel_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select a hostel</option>
                    {hostels.map((hostel) => (
                      <option key={hostel.id} value={hostel.id}>
                        {hostel.name} ({(hostel as any).availableBeds || 0} beds available)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedHostel && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building className="h-4 w-4 text-green-600" />
                      <h4 className="font-medium text-green-900">{selectedHostel.name}</h4>
                    </div>
                    <p className="text-sm text-green-700 mb-2">{selectedHostel.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-green-600">Capacity:</span>
                        <span className="ml-2 text-green-900">{(selectedHostel as any).capacity || 0}</span>
                      </div>
                      <div>
                        <span className="text-green-600">Available:</span>
                        <span className="ml-2 text-green-900">{(selectedHostel as any).availableBeds || 0}</span>
                      </div>
                      <div>
                        <span className="text-green-600">Address:</span>
                        <span className="ml-2 text-green-900">{selectedHostel.address}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Number
                    </label>
                    <Input
                      type="text"
                      value={formData.room_id}
                      onChange={(e) => handleInputChange('room_id', e.target.value)}
                      placeholder="e.g., A101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bed Number
                    </label>
                    <Input
                      type="text"
                      value={formData.bed_id}
                      onChange={(e) => handleInputChange('bed_id', e.target.value)}
                      placeholder="e.g., 1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Documents</span>
              </CardTitle>
              <CardDescription>
                Upload additional documents for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Documents */}
                {originalApplication.documents && originalApplication.documents.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Documents:</h4>
                    <div className="space-y-2">
                      {originalApplication.documents.map((doc: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{doc.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Existing
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Documents */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Additional Documents
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                  </p>
                </div>

                {formData.documents.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">New Files:</h4>
                    <div className="space-y-2">
                      {formData.documents.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-blue-900">{file.name}</span>
                            <span className="text-xs text-blue-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !formData.application_window_id || !formData.hostel_id}
            >
              {submitting ? (
                <>
                  <Clock className="h-4 w-4 animate-spin mr-2" />
                  Updating Application...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Application
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
