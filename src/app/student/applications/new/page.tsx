'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Badge } from '../../../../components/ui/badge'
import { 
  Building2, 
  User, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'

interface Hostel {
  id: string
  name: string
  type: 'male' | 'female'
  capacity: number
  available: number
  price: number
  amenities: string[]
  description: string
  image: string
}

interface ApplicationForm {
  hostelId: string
  hostelName: string
  preferredRoomType: 'single' | 'shared' | 'any'
  specialRequirements: string
  emergencyContact: string
  emergencyPhone: string
  parentName: string
  parentPhone: string
  parentEmail: string
  agreement: boolean
}

export default function NewApplicationPage() {
  const router = useRouter()
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null)
  const [formData, setFormData] = useState<ApplicationForm>({
    hostelId: '',
    hostelName: '',
    preferredRoomType: 'any',
    specialRequirements: '',
    emergencyContact: '',
    emergencyPhone: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    agreement: false
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate dummy hostels data
  useEffect(() => {
    const generateDummyHostels = (): Hostel[] => [
      {
        id: '1',
        name: 'Zik Hall',
        type: 'male',
        capacity: 800,
        available: 45,
        price: 25000,
        amenities: ['WiFi', 'Security', 'Study Rooms', 'Cafeteria', 'Sports', 'Laundry'],
        description: 'Named after Dr. Nnamdi Azikiwe, the first President of Nigeria. A prestigious male hostel with modern amenities.',
        image: '/images/zik-hall.jpg'
      },
      {
        id: '2',
        name: 'Mariere Hall',
        type: 'male',
        capacity: 750,
        available: 32,
        price: 23000,
        amenities: ['WiFi', 'Security', 'Study Rooms', 'Cafeteria', 'Sports'],
        description: 'A modern male hostel with excellent facilities and a vibrant community atmosphere.',
        image: '/images/mariere-hall.jpg'
      },
      {
        id: '3',
        name: 'Alvan Ikoku Hall',
        type: 'female',
        capacity: 600,
        available: 28,
        price: 25000,
        amenities: ['WiFi', 'Security', 'Study Rooms', 'Cafeteria', 'Sports', 'Laundry'],
        description: 'Dedicated to female students with enhanced security and comfortable living spaces.',
        image: '/images/alvan-ikoku.jpg'
      },
      {
        id: '4',
        name: 'Eni Njoku Hall',
        type: 'male',
        capacity: 700,
        available: 38,
        price: 22000,
        amenities: ['WiFi', 'Security', 'Study Rooms', 'Cafeteria'],
        description: 'A well-maintained male hostel with excellent academic support facilities.',
        image: '/images/eni-njoku.jpg'
      },
      {
        id: '5',
        name: 'Mellanby Hall',
        type: 'female',
        capacity: 550,
        available: 25,
        price: 24000,
        amenities: ['WiFi', 'Security', 'Study Rooms', 'Cafeteria', 'Sports'],
        description: 'A comfortable female hostel with modern amenities and a supportive environment.',
        image: '/images/mellanby.jpg'
      },
      {
        id: '6',
        name: 'Kuti Hall',
        type: 'male',
        capacity: 650,
        available: 35,
        price: 21000,
        amenities: ['WiFi', 'Security', 'Study Rooms', 'Cafeteria'],
        description: 'A modern male hostel with excellent facilities and a vibrant community atmosphere.',
        image: '/images/kuti-hall.jpg'
      }
    ]

    // Simulate API delay
    setTimeout(() => {
      setHostels(generateDummyHostels())
      setLoading(false)
    }, 800)
  }, [])

  const handleHostelSelect = (hostel: Hostel) => {
    setSelectedHostel(hostel)
    setFormData(prev => ({
      ...prev,
      hostelId: hostel.id,
      hostelName: hostel.name
    }))
  }

  const handleInputChange = (field: keyof ApplicationForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreement) {
      setError('Please agree to the terms and conditions')
      return
    }

    if (!formData.hostelId) {
      setError('Please select a hostel')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Success - redirect to dashboard or show success message
      router.push('/student/dashboard?application=success')
    } catch (err) {
      setError('Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getAvailabilityColor = (available: number) => {
    if (available > 20) return 'text-green-600'
    if (available > 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hostels...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Hostel Application</h1>
              <p className="text-gray-600">Apply for hostel accommodation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hostel Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Select Hostel
                </CardTitle>
                <CardDescription>
                  Choose your preferred hostel from the available options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hostels.map((hostel) => (
                    <div
                      key={hostel.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedHostel?.id === hostel.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleHostelSelect(hostel)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{hostel.name}</h3>
                          <Badge variant={hostel.type === 'male' ? 'default' : 'secondary'} className="mt-1">
                            {hostel.type === 'male' ? 'Male' : 'Female'}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">₦{hostel.price.toLocaleString()}</div>
                          <div className={`text-sm font-medium ${getAvailabilityColor(hostel.available)}`}>
                            {hostel.available} available
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{hostel.description}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {hostel.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {hostel.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{hostel.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            {selectedHostel && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                  <CardDescription>
                    Complete your application for {selectedHostel.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Room Type
                        </label>
                        <select
                          value={formData.preferredRoomType}
                          onChange={(e) => handleInputChange('preferredRoomType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="any">Any Available</option>
                          <option value="single">Single Room</option>
                          <option value="shared">Shared Room</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Requirements
                        </label>
                        <Input
                          placeholder="Any special needs or requests..."
                          value={formData.specialRequirements}
                          onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Emergency Contact Name
                          </label>
                          <Input
                            placeholder="Full name"
                            value={formData.emergencyContact}
                            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Emergency Contact Phone
                          </label>
                          <Input
                            placeholder="Phone number"
                            value={formData.emergencyPhone}
                            onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Parent/Guardian Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parent Name
                          </label>
                          <Input
                            placeholder="Full name"
                            value={formData.parentName}
                            onChange={(e) => handleInputChange('parentName', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parent Phone
                          </label>
                          <Input
                            placeholder="Phone number"
                            value={formData.parentPhone}
                            onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parent Email
                          </label>
                          <Input
                            type="email"
                            placeholder="Email address"
                            value={formData.parentEmail}
                            onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="agreement"
                        checked={formData.agreement}
                        onChange={(e) => handleInputChange('agreement', e.target.checked)}
                        className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="agreement" className="text-sm text-gray-700">
                        I agree to the hostel rules and regulations, and confirm that all information provided is accurate.
                        I understand that false information may result in application rejection.
                      </label>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                          <p className="text-sm text-red-800">{error}</p>
                        </div>
                      </div>
                    )}

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
                        disabled={submitting || !formData.agreement}
                        className="min-w-[120px]"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Application Summary</CardTitle>
                <CardDescription>
                  Review your application details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedHostel ? (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Selected Hostel</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{selectedHostel.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <Badge variant={selectedHostel.type === 'male' ? 'default' : 'secondary'}>
                            {selectedHostel.type === 'male' ? 'Male' : 'Female'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium text-green-600">₦{selectedHostel.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Available:</span>
                          <span className={`font-medium ${getAvailabilityColor(selectedHostel.available)}`}>
                            {selectedHostel.available} beds
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Important Notes</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Application review takes 3-5 business days</li>
                        <li>• Payment is required within 48 hours of approval</li>
                        <li>• Room allocation is based on availability</li>
                        <li>• Hostel rules must be followed</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Select a hostel to see application summary</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
