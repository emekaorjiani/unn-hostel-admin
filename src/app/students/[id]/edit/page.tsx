'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap,
  Building,
  AlertCircle,
  CheckCircle,
  Trash2
} from 'lucide-react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { apiClient } from '@/lib/api'
import { safeLocalStorage } from '@/lib/utils'

interface StudentForm {
  firstName: string
  lastName: string
  email: string
  matricNumber: string
  phoneNumber: string
  dateOfBirth: string
  gender: 'male' | 'female'
  faculty: string
  department: string
  level: string
  address: string
  stateOfOrigin: string
  localGovernment: string
  emergencyContact: string
  emergencyPhone: string
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
  isVerified: boolean
  isInternationalStudent: boolean
  isPWD: boolean
  hostelId?: string
  roomNumber?: string
  bedNumber?: string
}

interface Hostel {
  id: string
  name: string
  type: 'male' | 'female' | 'mixed'
  capacity: number
  availableBeds: number
}

export default function EditStudentPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [hostels, setHostels] = useState<Hostel[]>([])
  
  const [formData, setFormData] = useState<StudentForm>({
    firstName: '',
    lastName: '',
    email: '',
    matricNumber: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'male',
    faculty: '',
    department: '',
    level: '',
    address: '',
    stateOfOrigin: '',
    localGovernment: '',
    emergencyContact: '',
    emergencyPhone: '',
    status: 'pending_verification',
    isVerified: false,
    isInternationalStudent: false,
    isPWD: false,
    hostelId: '',
    roomNumber: '',
    bedNumber: ''
  })

  // Fetch student data and hostels
  const fetchData = async () => {
    try {
      setError(null)
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Fetch student data
      const studentResponse = await apiClient.get(`/students/${studentId}`)
      const student = studentResponse.data

      // Pre-populate form with student data
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        matricNumber: student.matricNumber || '',
        phoneNumber: student.phoneNumber || '',
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
        gender: student.gender || 'male',
        faculty: student.faculty || '',
        department: student.department || '',
        level: student.level || '',
        address: student.address || '',
        stateOfOrigin: student.stateOfOrigin || '',
        localGovernment: student.localGovernment || '',
        emergencyContact: student.emergencyContact || '',
        emergencyPhone: student.emergencyPhone || '',
        status: student.status || 'pending_verification',
        isVerified: student.isVerified || false,
        isInternationalStudent: student.isInternationalStudent || false,
        isPWD: student.isPWD || false,
        hostelId: student.hostelId || '',
        roomNumber: student.roomNumber || '',
        bedNumber: student.bedNumber || ''
      })

      // Fetch available hostels
      const hostelsResponse = await apiClient.get('/hostels')
      setHostels(hostelsResponse.data || [])
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch student data'
      setError(errorMessage)
      console.error('Data fetch error:', err)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    if (studentId) {
      fetchData()
    }
  }, [studentId])

  const handleInputChange = (field: keyof StudentForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Filter out properties that the API doesn't expect
      const { matricNumber, isVerified, hostelId, roomNumber, bedNumber, ...apiFormData } = formData
      
      const response = await apiClient.put(`/students/${studentId}`, apiFormData)
      
      setSuccess('Student updated successfully!')
      setTimeout(() => {
        router.push(`/students/${studentId}`)
      }, 2000)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update student'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      await apiClient.delete(`/students/${studentId}`)
      
      setSuccess('Student deleted successfully!')
      setTimeout(() => {
        router.push('/students')
      }, 2000)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete student'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (fetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading student data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Student</h1>
              <p className="text-gray-600 mt-1">
                Update student information and profile
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Basic personal details of the student
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matric Number *
                  </label>
                  <Input
                    type="text"
                    value={formData.matricNumber}
                    onChange={(e) => handleInputChange('matricNumber', e.target.value)}
                    required
                    placeholder="Enter matric number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    required
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isInternationalStudent}
                      onChange={(e) => handleInputChange('isInternationalStudent', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">International Student</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPWD}
                      onChange={(e) => handleInputChange('isPWD', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Person with Disability</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Academic Information</span>
              </CardTitle>
              <CardDescription>
                Student's academic details and program information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faculty *
                  </label>
                  <Input
                    type="text"
                    value={formData.faculty}
                    onChange={(e) => handleInputChange('faculty', e.target.value)}
                    required
                    placeholder="Enter faculty"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <Input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    required
                    placeholder="Enter department"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Level</option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level</option>
                  <option value="600">600 Level</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Address Information</span>
              </CardTitle>
              <CardDescription>
                Student's residential and origin details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                  placeholder="Enter full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State of Origin *
                  </label>
                  <Input
                    type="text"
                    value={formData.stateOfOrigin}
                    onChange={(e) => handleInputChange('stateOfOrigin', e.target.value)}
                    required
                    placeholder="Enter state of origin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Local Government *
                  </label>
                  <Input
                    type="text"
                    value={formData.localGovernment}
                    onChange={(e) => handleInputChange('localGovernment', e.target.value)}
                    required
                    placeholder="Enter local government"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Emergency Contact</span>
              </CardTitle>
              <CardDescription>
                Emergency contact person details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    required
                    placeholder="Enter emergency contact name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone *
                  </label>
                  <Input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    required
                    placeholder="Enter emergency contact phone"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status and Verification */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Status and Verification</span>
              </CardTitle>
              <CardDescription>
                Student account status and verification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending_verification">Pending Verification</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isVerified}
                      onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Verified Account</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hostel Allocation (Optional) */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Hostel Allocation (Optional)</span>
              </CardTitle>
              <CardDescription>
                Assign student to a hostel room if available
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hostel
                  </label>
                  <select
                    value={formData.hostelId}
                    onChange={(e) => handleInputChange('hostelId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Hostel</option>
                    {hostels.map(hostel => (
                      <option key={hostel.id} value={hostel.id}>
                        {hostel.name} ({hostel.availableBeds} beds available)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number
                  </label>
                  <Input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                    placeholder="Enter room number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bed Number
                  </label>
                  <Input
                    type="text"
                    value={formData.bedNumber}
                    onChange={(e) => handleInputChange('bedNumber', e.target.value)}
                    placeholder="Enter bed number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Student</span>
            </Button>
            
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Updating...' : 'Update Student'}</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
