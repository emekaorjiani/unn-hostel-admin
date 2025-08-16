'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import { 
  Wrench, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  ArrowLeft,
  FileText,
  Phone,
  MessageSquare,
  Calendar,
  MapPin,
  Settings
} from 'lucide-react'
import { studentService, MaintenanceTicket } from '@/lib/studentService'

export default function StudentMaintenancePage() {
  const router = useRouter()
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch maintenance tickets from API
  useEffect(() => {
    const fetchMaintenanceTickets = async () => {
      try {
        setLoading(true)
        const data = await studentService.getMaintenanceTickets()
        setMaintenanceRequests(data)
      } catch (error) {
        console.error('Error fetching maintenance tickets:', error)
        // Fallback to empty array if API fails
        setMaintenanceRequests([])
      } finally {
      setLoading(false)
      }
    }

    fetchMaintenanceTickets()
  }, [])

  // Filter maintenance requests based on status, category, and search query
  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    const matchesCategory = filterCategory === 'all' || request.category === filterCategory
    const matchesSearch = searchQuery === '' || 
      request.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.description && request.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesStatus && matchesCategory && matchesSearch
  })

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'closed':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading maintenance requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                  Maintenance Requests
                </h1>
                <p className="text-xs text-gray-600">Report and track hostel maintenance issues</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowNewRequestModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                <Input
                    placeholder="Search maintenance requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                />
              </div>
                <div className="flex gap-2">
                  {['all', 'pending', 'in_progress', 'resolved', 'closed'].map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                      className="capitalize"
                    >
                      {status.replace('_', ' ')}
                    </Button>
                  ))}
              </div>
                <div className="flex gap-2">
                  {['all', 'electrical', 'plumbing', 'structural', 'furniture', 'appliance', 'security', 'other'].map((category) => (
                    <Button
                      key={category}
                      variant={filterCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Requests List */}
          {filteredRequests.length > 0 ? (
            <div className="grid gap-6">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Wrench className="h-5 w-5 text-gray-500" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.issue}
                          </h3>
                          <Badge className={getStatusColor(request.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(request.status)}
                              <span className="capitalize">{request.status.replace('_', ' ')}</span>
                            </div>
                          </Badge>
                          <Badge className={getPriorityColor(request.priority)}>
                            <span className="capitalize">{request.priority}</span>
                          </Badge>
                      </div>

                        {request.description && (
                          <p className="text-gray-600 mb-3">{request.description}</p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Reported: {new Date(request.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>Category: {request.category}</span>
                          </div>
                          {request.resolved_at && (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4" />
                              <span>Resolved: {new Date(request.resolved_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/student/maintenance/${request.id}`)}
                        >
                        <Eye className="h-4 w-4 mr-2" />
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
                <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
                    ? `No maintenance requests match your search criteria.`
                    : "You haven't submitted any maintenance requests yet."
                  }
                </p>
                <Button 
                  onClick={() => setShowNewRequestModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Your First Request
                </Button>
                </CardContent>
              </Card>
          )}

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{maintenanceRequests.length}</div>
                  <div className="text-sm text-blue-600">Total Requests</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {maintenanceRequests.filter(req => req.status === 'pending').length}
                  </div>
                  <div className="text-sm text-yellow-600">Pending</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {maintenanceRequests.filter(req => req.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-blue-600">In Progress</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {maintenanceRequests.filter(req => req.status === 'resolved').length}
                  </div>
                  <div className="text-sm text-green-600">Resolved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {maintenanceRequests.filter(req => req.priority === 'urgent').length}
      </div>
                  <div className="text-sm text-red-600">Urgent</div>
              </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {maintenanceRequests.filter(req => req.priority === 'high').length}
              </div>
                  <div className="text-sm text-orange-600">High</div>
              </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {maintenanceRequests.filter(req => req.priority === 'medium').length}
              </div>
                  <div className="text-sm text-yellow-600">Medium</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {maintenanceRequests.filter(req => req.priority === 'low').length}
                  </div>
                  <div className="text-sm text-green-600">Low</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
