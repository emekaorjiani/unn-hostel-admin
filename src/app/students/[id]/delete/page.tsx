'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  User, 
  AlertTriangle,
  Trash2,
  CheckCircle,
  XCircle,
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
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
  hostelName?: string
  roomNumber?: string
  createdAt: string
}

export default function DeleteStudentPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string
  
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

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
      setFetching(false)
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

  const handleDelete = async () => {
    if (!confirmDelete) {
      setError('Please confirm deletion by checking the confirmation box')
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
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete student'
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
            <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading student information...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error && !student) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-600 mr-3" />
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delete Student</h1>
            <p className="text-gray-600 mt-1">
              Permanently remove student from the system
            </p>
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
              <XCircle className="h-5 w-5 text-red-600 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Warning Card */}
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Warning: Irreversible Action</span>
            </CardTitle>
            <CardDescription className="text-red-700">
              This action will permanently delete the student and all associated data. 
              This cannot be undone.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Student Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Student Information</span>
            </CardTitle>
            <CardDescription>
              Review the student details before deletion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                <p className="text-gray-900 font-medium">
                  {student.firstName} {student.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Matric Number</label>
                <p className="text-gray-900 font-mono">{student.matricNumber}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900">{student.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <Badge className={`${getStatusColor(student.status)} text-sm font-medium px-3 py-1`}>
                  {student.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Registered</label>
                <p className="text-gray-900">{formatDate(student.createdAt)}</p>
              </div>
            </div>

            {student.hostelName && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Hostel Allocation</label>
                <p className="text-gray-900">
                  {student.hostelName} - Room {student.roomNumber}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Confirmation</CardTitle>
            <CardDescription>
              Confirm that you want to delete this student
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="confirm-delete"
                checked={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.checked)}
                className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="confirm-delete" className="text-sm text-gray-700">
                I understand that this action will permanently delete the student "{student.firstName} {student.lastName}" 
                and all associated data. This action cannot be undone.
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading || !confirmDelete}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>{loading ? 'Deleting...' : 'Delete Student'}</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
