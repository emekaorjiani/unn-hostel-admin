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
import { apiClient } from '@/lib/api'
import { safeLocalStorage } from '@/lib/utils'

interface ApplicationForm {
  studentId: string
  studentName: string
  matricNumber: string
  hostelId: string
  hostelName: string
  academicYear: string
  semester: string
  applicationType: 'new' | 'renewal' | 'transfer' | 'swap'
  preferences: string[]
  additionalNotes?: string
}

interface Hostel {
  id: string
  name: string
  description: string
  gender: 'male' | 'female' | 'mixed'
  capacity: number
  availableBeds: number
  pricePerSemester: number
}

interface ApplicationWindow {
  id: string
  name: string
  type: 'freshman' | 'returning' | 'transfer' | 'international' | 'graduate' | 'staff'
  startDate: string
  endDate: string
  isActive: boolean
  isPublished: boolean
}

export default function NewApplicationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form data
  const [formData, setFormData] = useState<ApplicationForm>({
    studentId: '',
    studentName: '',
    matricNumber: '',
    hostelId: '',
    hostelName: '',
    academicYear: '',
    semester: '',
    applicationType: 'new',
    preferences: [],
    additionalNotes: ''
  })

  // Available data
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [applicationWindows, setApplicationWindows] = useState<ApplicationWindow[]>([])
  const [selectedWindow, setSelectedWindow] = useState<ApplicationWindow | null>(null)

  // Fetch available data
  const fetchAvailableData = async () => {
    try {
      setLoading(true)
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Fetch hostels
      const hostelsRes = await apiClient.get('/hostels')
      const hostelsData = Array.isArray(hostelsRes.data) 
        ? hostelsRes.data 
        : hostelsRes.data?.data || hostelsRes.data?.hostels || []
      
      // Fetch application windows
      const windowsRes = await apiClient.get('/windows')
      const windowsData = Array.isArray(windowsRes.data) 
        ? windowsRes.data 
        : windowsRes.data?.data || windowsRes.data?.windows || []
      
      setHostels(hostelsData)
      setApplicationWindows(windowsData.filter((w: ApplicationWindow) => w.isActive && w.isPublished))
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch available data'
      setError(errorMessage)
      console.error('Data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchAvailableData()
  }, [])

  // Handle form input changes
  const handleInputChange = (field: keyof ApplicationForm, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle hostel selection
  const handleHostelChange = (hostelId: string) => {
    const selectedHostel = hostels.find(h => h.id === hostelId)
    setFormData(prev => ({
      ...prev,
      hostelId,
      hostelName: selectedHostel?.name || ''
    }))
  }

  // Handle application window selection
  const handleWindowChange = (windowId: string) => {
    const selectedWindow = applicationWindows.find(w => w.id === windowId)
    setSelectedWindow(selectedWindow || null)
  }

  // Handle preference changes
  const handlePreferenceChange = (preference: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: checked 
        ? [...prev.preferences, preference]
        : prev.preferences.filter(p => p !== preference)
    }))
  }

  // Submit application
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
      if (!formData.hostelId || !formData.academicYear || !formData.semester) {
        throw new Error('Please fill in all required fields')
      }

      // Create application
      const response = await apiClient.post('/applications', {
        ...formData,
        applicationWindowId: selectedWindow?.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSuccess('Application created successfully!')
      
      // Redirect to applications list after a short delay
      setTimeout(() => {
        router.push('/applications')
      }, 2000)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create application'
      setError(errorMessage)
      console.error('Application creation error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading application form...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
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
              <h1 className="text-2xl font-bold text-gray-900">New Application</h1>
              <p className="text-gray-600">Create a new hostel application</p>
            </div>
          </div>
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
                Select the application window for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applicationWindows.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No active application windows available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applicationWindows.map((window) => (
                    <div
                      key={window.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedWindow?.id === window.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleWindowChange(window.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{window.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{window.type}</p>
                        </div>
                        <Badge variant={window.isActive ? "default" : "secondary"}>
                          {window.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {new Date(window.startDate).toLocaleDateString()} - {new Date(window.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                Choose your preferred hostel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hostels.map((hostel) => (
                  <div
                    key={hostel.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.hostelId === hostel.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleHostelChange(hostel.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{hostel.name}</h3>
                        <p className="text-sm text-gray-600">{hostel.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {hostel.gender}
                        </Badge>
                        {formData.hostelId === hostel.id ? (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Available Beds:</span>
                        <span className="font-medium">{hostel.availableBeds || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price per Semester:</span>
                        <span className="font-medium">₦{(hostel.pricePerSemester || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Academic Information</span>
              </CardTitle>
              <CardDescription>
                Provide your academic details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year *
                  </label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => handleInputChange('academicYear', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Academic Year</option>
                    <option value="2024/2025">2024/2025</option>
                    <option value="2025/2026">2025/2026</option>
                    <option value="2026/2027">2026/2027</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester *
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => handleInputChange('semester', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="first">First Semester</option>
                    <option value="second">Second Semester</option>
                    <option value="both">Both Semesters</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Type *
                </label>
                <select
                  value={formData.applicationType}
                  onChange={(e) => handleInputChange('applicationType', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="new">New Application</option>
                  <option value="renewal">Renewal</option>
                  <option value="transfer">Transfer</option>
                  <option value="swap">Room Swap</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Preferences</span>
              </CardTitle>
              <CardDescription>
                Select your room preferences (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Ground Floor',
                  'Upper Floor',
                  'Corner Room',
                  'Quiet Area',
                  'Near Entrance',
                  'Near Bathroom',
                  'Single Room',
                  'Shared Room'
                ].map((preference) => (
                  <label key={preference} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.preferences.includes(preference)}
                      onChange={(e) => handlePreferenceChange(preference, e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{preference}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>
                Any additional information or special requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter any additional notes or special requests..."
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !formData.hostelId || !formData.academicYear || !formData.semester}
              className="flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create Application</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
