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
import { studentService } from '@/lib/studentService'
import { safeLocalStorage } from '@/lib/utils'

interface ApplicationForm {
  hostel_id: string
  room_type: string
  preferred_room_number?: string
  special_requirements?: string
  academic_year?: string
  semester?: string
  application_type?: 'new' | 'renewal' | 'transfer' | 'swap'
  preferences?: string[]
  additional_notes?: string
}

interface Hostel {
  id: string
  name: string
  description?: string
  gender: 'male' | 'female' | 'mixed'
  capacity?: number
  available_rooms?: number
  price_per_semester?: number
  room_types?: string[]
}

export default function NewApplicationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form data
  const [formData, setFormData] = useState<ApplicationForm>({
    hostel_id: '',
    room_type: '',
    preferred_room_number: '',
    special_requirements: '',
    academic_year: '',
    semester: '',
    application_type: 'new',
    preferences: [],
    additional_notes: ''
  })

  // Available data
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null)

  // Fetch available data
  const fetchAvailableData = async () => {
    try {
      setLoading(true)
      
      // Fetch available hostels using studentService
      const hostelsData = await studentService.getAvailableHostels()
      setHostels(hostelsData)
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

  // Handle form input changes
  const handleInputChange = (field: keyof ApplicationForm, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle hostel selection
  const handleHostelChange = (hostelId: string) => {
    const selected = hostels.find(h => h.id === hostelId)
    setSelectedHostel(selected || null)
    setFormData(prev => ({
      ...prev,
      hostel_id: hostelId,
      room_type: '' // Reset room type when hostel changes
    }))
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

      // Validate required fields
      if (!formData.hostel_id || !formData.room_type) {
        throw new Error('Please select a hostel and room type')
      }

      // Prepare data for API
      const applicationData = {
        hostel_id: formData.hostel_id,
        room_type: formData.room_type,
        preferred_room_number: formData.preferred_room_number || undefined,
        special_requirements: formData.special_requirements || undefined
      }

      // Create application using studentService
      const response = await studentService.createApplication(applicationData)

      setSuccess('Application submitted successfully! You will be notified of the status.')
      
      // Redirect immediately to applications list
      router.push('/student/applications')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application'
      setError(errorMessage)
      console.error('Application submission error:', err)
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
              <h1 className="text-2xl font-bold text-gray-900">New Hostel Application</h1>
              <p className="text-gray-600">Submit your application for hostel accommodation</p>
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
          {/* Hostel Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Hostel Selection</span>
              </CardTitle>
              <CardDescription>
                Choose your preferred hostel and room type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hostels.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No hostels available at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Hostel Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Hostel *
                    </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hostels.map((hostel) => (
                  <div
                    key={hostel.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            formData.hostel_id === hostel.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleHostelChange(hostel.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{hostel.name}</h3>
                              <p className="text-sm text-gray-600">{hostel.description || 'No description available'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {hostel.gender}
                        </Badge>
                              {formData.hostel_id === hostel.id ? (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                            {hostel.available_rooms !== undefined && (
                      <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Available Rooms:</span>
                                <span className="font-medium">{hostel.available_rooms}</span>
                      </div>
                            )}
                            {hostel.price_per_semester !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price per Semester:</span>
                                <span className="font-medium">₦{(hostel.price_per_semester).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Room Type Selection */}
                  {selectedHostel && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Type *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Single Room', 'Shared Room', 'Suite', 'Apartment'].map((roomType) => (
                          <div
                            key={roomType}
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              formData.room_type === roomType
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleInputChange('room_type', roomType)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{roomType}</span>
                              {formData.room_type === roomType ? (
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="h-2 w-2 text-white" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preferred Room Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Room Number (Optional)
                    </label>
                    <Input
                      type="text"
                      value={formData.preferred_room_number}
                      onChange={(e) => handleInputChange('preferred_room_number', e.target.value)}
                      placeholder="e.g., Room 101, Block A"
                      className="w-full"
                    />
                  </div>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Special Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Special Requirements</span>
              </CardTitle>
              <CardDescription>
                Any special requirements or accommodations needed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={formData.special_requirements}
                onChange={(e) => handleInputChange('special_requirements', e.target.value)}
                rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter any special requirements, medical needs, accessibility requirements, etc..."
              />
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Room Preferences</span>
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
                  'Balcony',
                  'Garden View'
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
                value={formData.additional_notes}
                onChange={(e) => handleInputChange('additional_notes', e.target.value)}
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
              disabled={submitting || !formData.hostel_id || !formData.room_type}
              className="flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Submit Application</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
