'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  Check
} from 'lucide-react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { applicationService, hostelService, applicationWindowService } from '@/lib/services'
import { CreateApplicationData, Hostel, ApplicationWindow } from '@/lib/types'
import { safeLocalStorage } from '@/lib/utils'

interface ApplicationForm {
  applicationWindowId: string
  hostelId: string
  roomId: string
  bedId: string
  documents: File[]
}

export default function NewApplicationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form data
  const [formData, setFormData] = useState<ApplicationForm>({
    applicationWindowId: '',
    hostelId: '',
    roomId: '',
    bedId: '',
    documents: []
  })

  // Available data
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [applicationWindows, setApplicationWindows] = useState<ApplicationWindow[]>([])
  const [selectedWindow, setSelectedWindow] = useState<ApplicationWindow | null>(null)
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null)

  // Fetch available data
  const fetchAvailableData = async () => {
    try {
      setLoading(true)
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Fetch hostels using service
      const hostelsResponse = await hostelService.getAll()
      setHostels(hostelsResponse.data)
      
      // Fetch application windows using service
      const windowsResponse = await applicationWindowService.getAll()
      setApplicationWindows(windowsResponse.data)
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch available hostels'
      setError(errorMessage)
      console.error('Hostels fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchAvailableData()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.applicationWindowId || !formData.hostelId) {
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

      // Create application using service
      const applicationData: CreateApplicationData = {
        applicationWindowId: formData.applicationWindowId,
        hostelId: formData.hostelId,
        roomId: formData.roomId,
        bedId: formData.bedId,
        documents: formData.documents
      }

      const newApplication = await applicationService.create(applicationData)
      
      setSuccess('Application created successfully!')
      
      // Redirect to the new application after a short delay
      setTimeout(() => {
        router.push(`/applications/${newApplication.id}`)
      }, 2000)

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application'
      setError(errorMessage)
      console.error('Application submission error:', err)
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
    if (field === 'applicationWindowId') {
      const window = applicationWindows.find(w => w.id === value)
      setSelectedWindow(window || null)
    }

    // Update selected hostel when hostel changes
    if (field === 'hostelId') {
      const hostel = hostels.find(h => h.id === value)
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
            <p className="text-gray-600">Loading application form...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">New Application</h1>
            <p className="text-gray-600 mt-1">Create a new hostel application</p>
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
                    value={formData.applicationWindowId}
                    onChange={(e) => handleInputChange('applicationWindowId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select an application window</option>
                    {applicationWindows.map((window) => (
                      <option key={window.id} value={window.id}>
                        {window.name} ({new Date(window.startDate).toLocaleDateString()} - {new Date(window.endDate).toLocaleDateString()})
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
                        <span className="ml-2 text-blue-900">{new Date(selectedWindow.startDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-blue-600">End Date:</span>
                        <span className="ml-2 text-blue-900">{new Date(selectedWindow.endDate).toLocaleDateString()}</span>
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
                    value={formData.hostelId}
                    onChange={(e) => handleInputChange('hostelId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select a hostel</option>
                    {hostels.map((hostel) => (
                      <option key={hostel.id} value={hostel.id}>
                        {hostel.name} ({hostel.availableBeds} beds available)
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
                        <span className="ml-2 text-green-900">{selectedHostel.capacity}</span>
                      </div>
                      <div>
                        <span className="text-green-600">Available:</span>
                        <span className="ml-2 text-green-900">{selectedHostel.availableBeds}</span>
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
                      value={formData.roomId}
                      onChange={(e) => handleInputChange('roomId', e.target.value)}
                      placeholder="e.g., A101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bed Number
                    </label>
                    <Input
                      type="text"
                      value={formData.bedId}
                      onChange={(e) => handleInputChange('bedId', e.target.value)}
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
                Upload required documents for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Documents
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
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                    <div className="space-y-2">
                      {formData.documents.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{file.name}</span>
                            <span className="text-xs text-gray-500">
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
              disabled={submitting || !formData.applicationWindowId || !formData.hostelId}
            >
              {submitting ? (
                <>
                  <Clock className="h-4 w-4 animate-spin mr-2" />
                  Creating Application...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Application
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
