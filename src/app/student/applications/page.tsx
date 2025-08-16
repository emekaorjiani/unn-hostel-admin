'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Filter, Search, Eye, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { studentService, StudentApplication } from '@/lib/studentService'
import StudentHeader from '@/components/layout/student-header'
import { QuickActions } from '@/components/ui/quick-actions'

export default function StudentApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<StudentApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const data = await studentService.getApplications()
        setApplications(data)
      } catch (error) {
        console.error('Error fetching applications:', error)
        // Fallback to empty array if API fails
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  // Filter applications based on status
  const filteredApplications = applications.filter(app => 
    filterStatus === 'all' || app.status === filterStatus
  )

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'waitlisted':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      case 'waitlisted':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <StudentHeader
        title="My Applications"
        subtitle="Hostel accommodation applications"
        showBackButton={true}
        onBackClick={() => router.back()}
      />

      {/* Quick Actions */}
      <QuickActions />

      <div className="pt-16 max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions - Fixed at top */}
        <div className="mb-6">
          <QuickActions showAllActions={false} />
        </div>
        
        <div className="space-y-6">
          {/* Filter Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'approved', 'rejected', 'waitlisted'].map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Application Button */}
          <div className="flex justify-end">
            <Button 
              onClick={() => router.push('/student/applications/new')}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>

          {/* Applications List */}
          {filteredApplications.length > 0 ? (
            <div className="grid gap-6">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Building2 className="h-5 w-5 text-gray-500" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.hostel_name}
                          </h3>
                          <Badge className={getStatusColor(application.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(application.status)}
                              <span className="capitalize">{application.status}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Applied: {new Date(application.application_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>Room Type: {application.room_type}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Amount: ₦{application.amount.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Payment Status */}
                        <div className="mt-3">
                          <Badge 
                            variant={application.payment_status === 'paid' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            Payment: {application.payment_status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/student/applications/${application.id}`)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600 mb-6">
                  {filterStatus === 'all' 
                    ? "You haven't submitted any hostel applications yet."
                    : `No applications with ${filterStatus} status found.`
                  }
                </p>
                <Button 
                  onClick={() => router.push('/student/applications/new')}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Your First Application
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
                  <div className="text-sm text-blue-600">Total Applications</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {applications.filter(app => app.status === 'pending').length}
                  </div>
                  <div className="text-sm text-yellow-600">Pending</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {applications.filter(app => app.status === 'approved').length}
                  </div>
                  <div className="text-sm text-green-600">Approved</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {applications.filter(app => app.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-red-600">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
