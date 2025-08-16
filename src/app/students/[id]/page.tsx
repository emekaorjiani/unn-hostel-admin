'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap,
  Building,
  Calendar,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { apiClient } from '@/lib/api'
import { safeLocalStorage } from '@/lib/utils'

interface Student {
  id: string
  first_name: string
  last_name: string
  email: string
  matric_number: string
  phone_number?: string
  faculty?: string
  department?: string
  level?: string
  gender?: string
  date_of_birth?: string
  address?: string
  state_of_origin?: string
  nationality?: string
  emergency_contact?: string
  emergency_phone?: string
  local_government?: string
  is_email_verified: boolean
  is_phone_verified: boolean
  is_international_student: boolean
  is_pwd: boolean
  two_factor_enabled: boolean
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
  role: string
  created_at: string
  updated_at: string
}

export default function ViewStudentPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string
  
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch student data
  const fetchStudent = async () => {
    try {
      setError(null)
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await apiClient.get(`/students/${studentId}`)
      
      // The API returns data.student, not just data
      const studentData = response.data.data?.student || response.data.data || response.data
      
      setStudent(studentData)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch student'
      setError(errorMessage)
      console.error('Student fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (studentId) {
      fetchStudent()
    }
  }, [studentId])

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'suspended': return 'bg-yellow-100 text-yellow-800'
      case 'pending_verification': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not specified'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid date'
    }
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading student information...</p>
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
              <h3 className="text-lg font-semibold text-red-800">Error Loading Student</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <Button 
                onClick={fetchStudent} 
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

  if (!student) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Student not found</h3>
          <p className="text-gray-600">The student you're looking for doesn't exist.</p>
        </div>
      </DashboardLayout>
    )
  }

  // Safety check for required fields
  if (!student.first_name || !student.last_name || !student.email) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Student Data</h3>
          <p className="text-gray-600">The student data is incomplete or invalid.</p>
          <Button 
            onClick={fetchStudent} 
            className="mt-3"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-3xl font-bold text-gray-900">
                {student.first_name} {student.last_name}
              </h1>
              <p className="text-gray-600 mt-1">
                Matric Number: {student.matric_number} | ID: {student.id}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/students/${student.id}/edit`)}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/students/${student.id}/delete`)}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <Badge className={`${getStatusColor(student.status || 'active')} text-sm font-medium px-3 py-1`}>
            {(student.status || 'active').replace('_', ' ').toUpperCase()}
          </Badge>
          {student.is_email_verified && (
            <Badge className="bg-green-100 text-green-800 ml-2 text-sm font-medium px-3 py-1">
              EMAIL VERIFIED
            </Badge>
          )}
          {student.is_phone_verified && (
            <Badge className="bg-blue-100 text-blue-800 ml-2 text-sm font-medium px-3 py-1">
              PHONE VERIFIED
            </Badge>
          )}
          {student.is_international_student && (
            <Badge className="bg-purple-100 text-purple-800 ml-2 text-sm font-medium px-3 py-1">
              INTERNATIONAL STUDENT
            </Badge>
          )}
          {student.is_pwd && (
            <Badge className="bg-orange-100 text-orange-800 ml-2 text-sm font-medium px-3 py-1">
              PWD
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                  <p className="text-gray-900">{student.first_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                  <p className="text-gray-900">{student.last_name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                  <p className="text-gray-900 capitalize">{student.gender || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                  <p className="text-gray-900">{formatDate(student.date_of_birth)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{student.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{student.phone_number || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Academic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Faculty</label>
                <p className="text-gray-900">{student.faculty || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                <p className="text-gray-900">{student.department || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Level</label>
                <p className="text-gray-900">Level {student.level || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Matric Number</label>
                <p className="text-gray-900 font-mono">{student.matric_number}</p>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Address Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                <p className="text-gray-900">{student.address || 'Not specified'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">State of Origin</label>
                  <p className="text-gray-900">{student.state_of_origin || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nationality</label>
                  <p className="text-gray-900">{student.nationality || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Student Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                  <p className="text-gray-900 capitalize">{student.role}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">International Student</label>
                  <p className="text-gray-900">{student.is_international_student ? 'Yes' : 'No'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">PWD</label>
                  <p className="text-gray-900">{student.is_pwd ? 'Yes' : 'No'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Two Factor Enabled</label>
                  <p className="text-gray-900">{student.two_factor_enabled ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Emergency Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contact Name</label>
                <p className="text-gray-900">{student.emergency_contact || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contact Phone</label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{student.emergency_phone || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hostel Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Hostel Allocation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <Building className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Hostel allocation information not available</p>
                <p className="text-sm text-gray-400">Check hostel management for allocation details</p>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
                  <p className="text-gray-900">{formatDate(student.created_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                  <p className="text-gray-900">{formatDate(student.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
