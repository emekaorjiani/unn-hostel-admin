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
  hostelName?: string
  roomNumber?: string
  bedNumber?: string
  createdAt: string
  updatedAt: string
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
      setStudent(response.data)
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
                {student.firstName} {student.lastName}
              </h1>
              <p className="text-gray-600 mt-1">
                Student ID: {student.matricNumber}
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
          <Badge className={`${getStatusColor(student.status)} text-sm font-medium px-3 py-1`}>
            {student.status.replace('_', ' ').toUpperCase()}
          </Badge>
          {student.isVerified && (
            <Badge className="bg-green-100 text-green-800 ml-2 text-sm font-medium px-3 py-1">
              VERIFIED
            </Badge>
          )}
          {student.isInternationalStudent && (
            <Badge className="bg-blue-100 text-blue-800 ml-2 text-sm font-medium px-3 py-1">
              INTERNATIONAL
            </Badge>
          )}
          {student.isPWD && (
            <Badge className="bg-purple-100 text-purple-800 ml-2 text-sm font-medium px-3 py-1">
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
                  <p className="text-gray-900">{student.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                  <p className="text-gray-900">{student.lastName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                  <p className="text-gray-900 capitalize">{student.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                  <p className="text-gray-900">{formatDate(student.dateOfBirth)}</p>
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
                  <p className="text-gray-900">{student.phoneNumber}</p>
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
                <p className="text-gray-900">{student.faculty}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                <p className="text-gray-900">{student.department}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Level</label>
                <p className="text-gray-900">Level {student.level}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Matric Number</label>
                <p className="text-gray-900 font-mono">{student.matricNumber}</p>
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
                <p className="text-gray-900">{student.address}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">State of Origin</label>
                  <p className="text-gray-900">{student.stateOfOrigin}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Local Government</label>
                  <p className="text-gray-900">{student.localGovernment}</p>
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
                <p className="text-gray-900">{student.emergencyContact}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contact Phone</label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{student.emergencyPhone}</p>
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
              {student.hostelName ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Hostel</label>
                    <p className="text-gray-900">{student.hostelName}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Room Number</label>
                      <p className="text-gray-900">{student.roomNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Bed Number</label>
                      <p className="text-gray-900">{student.bedNumber}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <Building className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No hostel allocation</p>
                </div>
              )}
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
                  <p className="text-gray-900">{formatDate(student.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                  <p className="text-gray-900">{formatDate(student.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
