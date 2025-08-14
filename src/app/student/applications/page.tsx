'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { 
  Building2, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  ArrowLeft,
  FileText
} from 'lucide-react'

interface Application {
  id: string
  hostelName: string
  hostelType: 'male' | 'female'
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted' | 'cancelled'
  appliedDate: string
  reviewedDate?: string
  roomType: 'single' | 'shared' | 'any'
  specialRequirements: string
  emergencyContact: string
  emergencyPhone: string
  parentName: string
  parentPhone: string
  parentEmail: string
  notes?: string
}

export default function StudentApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Generate dummy applications data
  const generateDummyApplications = (): Application[] => [
    {
      id: 'APP001',
      hostelName: 'Zik Hall',
      hostelType: 'male',
      status: 'approved',
      appliedDate: '2024-12-01',
      reviewedDate: '2024-12-05',
      roomType: 'shared',
      specialRequirements: 'None',
      emergencyContact: 'John Doe',
      emergencyPhone: '+2348012345678',
      parentName: 'Michael Doe',
      parentPhone: '+2348098765432',
      parentEmail: 'michael.doe@email.com',
      notes: 'Application approved. Room allocation: R45, Bed 2'
    },
    {
      id: 'APP002',
      hostelName: 'Mariere Hall',
      hostelType: 'male',
      status: 'pending',
      appliedDate: '2024-12-10',
      roomType: 'single',
      specialRequirements: 'Quiet study environment preferred',
      emergencyContact: 'John Doe',
      emergencyPhone: '+2348012345678',
      parentName: 'Michael Doe',
      parentPhone: '+2348098765432',
      parentEmail: 'michael.doe@email.com'
    },
    {
      id: 'APP003',
      hostelName: 'Alvan Ikoku Hall',
      hostelType: 'female',
      status: 'rejected',
      appliedDate: '2024-11-15',
      reviewedDate: '2024-11-20',
      roomType: 'any',
      specialRequirements: 'None',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+2348012345679',
      parentName: 'Sarah Doe',
      parentPhone: '+2348098765433',
      parentEmail: 'sarah.doe@email.com',
      notes: 'Rejected: Female hostel application by male student'
    },
    {
      id: 'APP004',
      hostelName: 'Eni Njoku Hall',
      hostelType: 'male',
      status: 'waitlisted',
      appliedDate: '2024-12-05',
      reviewedDate: '2024-12-08',
      roomType: 'shared',
      specialRequirements: 'None',
      emergencyContact: 'John Doe',
      emergencyPhone: '+2348012345678',
      parentName: 'Michael Doe',
      parentPhone: '+2348098765432',
      parentEmail: 'michael.doe@email.com',
      notes: 'Waitlisted: No available rooms. Will be notified when space opens.'
    },
    {
      id: 'APP005',
      hostelName: 'Mellanby Hall',
      hostelType: 'female',
      status: 'cancelled',
      appliedDate: '2024-11-20',
      reviewedDate: '2024-11-25',
      roomType: 'single',
      specialRequirements: 'None',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+2348012345679',
      parentName: 'Sarah Doe',
      parentPhone: '+2348098765433',
      parentEmail: 'sarah.doe@email.com',
      notes: 'Cancelled by student: Found alternative accommodation'
    }
  ]

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setApplications(generateDummyApplications())
      setLoading(false)
    }, 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'waitlisted': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'waitlisted': return <AlertCircle className="h-4 w-4" />
      case 'cancelled': return <FileText className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredApplications = applications.filter(app => 
    filterStatus === 'all' || app.status === filterStatus
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600">View and track your hostel applications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => router.push('/student/applications/new')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Download History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Application History</CardTitle>
            <CardDescription>Track the status of your hostel applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600 mb-4">You haven't submitted any hostel applications yet.</p>
                <Button 
                  onClick={() => router.push('/student/applications/new')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Apply for Hostel
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{application.hostelName}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={application.hostelType === 'male' ? 'default' : 'secondary'}>
                              {application.hostelType === 'male' ? 'Male' : 'Female'}
                            </Badge>
                            <Badge variant="outline">
                              {application.roomType.charAt(0).toUpperCase() + application.roomType.slice(1)} Room
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(application.status)}
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Application Details</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div><span className="font-medium">Applied:</span> {new Date(application.appliedDate).toLocaleDateString()}</div>
                            {application.reviewedDate && (
                              <div><span className="font-medium">Reviewed:</span> {new Date(application.reviewedDate).toLocaleDateString()}</div>
                            )}
                            <div><span className="font-medium">Special Requirements:</span> {application.specialRequirements}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div><span className="font-medium">Emergency:</span> {application.emergencyContact}</div>
                            <div><span className="font-medium">Parent:</span> {application.parentName}</div>
                            <div><span className="font-medium">Parent Phone:</span> {application.parentPhone}</div>
                          </div>
                        </div>
                      </div>

                      {application.notes && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                          <p className="text-sm text-gray-600">{application.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {application.status === 'pending' && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Cancel
                        </Button>
                      )}
                      {application.status === 'approved' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Application Statistics */}
        {applications.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {applications.filter(a => a.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {applications.filter(a => a.status === 'approved').length}
                  </div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {applications.filter(a => a.status === 'waitlisted').length}
                  </div>
                  <div className="text-sm text-gray-600">Waitlisted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {applications.filter(a => a.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
