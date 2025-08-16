'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  MapPin,
  Calendar,
  User,
  Building,
  Phone,
  Mail
} from 'lucide-react'
import DashboardLayout from '../../components/layout/dashboard-layout'
import { apiClient } from '../../lib/api'
import { safeLocalStorage } from '../../lib/utils'

// TypeScript interfaces for maintenance data
interface MaintenanceRequest {
  id: string
  title: string
  description: string
  category: 'electrical' | 'plumbing' | 'structural' | 'appliance' | 'cleaning' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  location: {
    hostelId: string
    hostelName: string
    roomNumber?: string
    floor?: string
  }
  reportedBy: {
    id: string
    name: string
    email: string
    phone: string
    type: 'student' | 'staff' | 'admin'
  }
  assignedTo?: {
    id: string
    name: string
    email: string
    phone: string
  }
  estimatedCost?: number
  actualCost?: number
  reportedAt: string
  assignedAt?: string
  startedAt?: string
  completedAt?: string
  notes?: string
  attachments?: string[]
}

interface MaintenanceStats {
  totalRequests: number
  pendingRequests: number
  inProgressRequests: number
  completedRequests: number
  urgentRequests: number
  requestsByCategory: Array<{
    category: string
    count: number
  }>
  requestsByPriority: Array<{
    priority: string
    count: number
  }>
  requestsByStatus: Array<{
    status: string
    count: number
  }>
  averageResolutionTime: number // in hours
}

export default function MaintenancePage() {
  // State management for maintenance data
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([])
  const [stats, setStats] = useState<MaintenanceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [hostelFilter, setHostelFilter] = useState<string>('all')

  // Fetch maintenance data from backend
  const fetchMaintenanceData = async () => {
    try {
      setError(null)
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Try to fetch maintenance requests from backend
      let requestsData: MaintenanceRequest[] = []
      try {
        const requestsRes = await apiClient.get('/maintenance/requests', {
          headers: { Authorization: `Bearer ${token}` }
        })
        requestsData = Array.isArray(requestsRes.data) 
          ? requestsRes.data 
          : requestsRes.data?.requests || requestsRes.data?.data || []
      } catch (requestsError) {
        console.warn('Maintenance requests endpoint not available, using fallback data')
        // Provide fallback maintenance requests data
        requestsData = [
          {
            id: 'maintenance-1',
            title: 'Broken Light Switch',
            description: 'The light switch in room 101 is not working properly. It flickers when turned on.',
            category: 'electrical' as const,
            priority: 'medium' as const,
            status: 'in_progress' as const,
            location: {
              hostelId: 'hostel-1',
              hostelName: 'Zik Hall',
              roomNumber: '101',
              floor: '1'
            },
            reportedBy: {
              id: 'student-1',
              name: 'John Doe',
              email: 'john.doe@unn.edu.ng',
              phone: '+2348012345678',
              type: 'student' as const
            },
            assignedTo: {
              id: 'staff-1',
              name: 'Mike Johnson',
              email: 'mike.johnson@unn.edu.ng',
              phone: '+2348098765432'
            },
            estimatedCost: 5000,
            actualCost: 4500,
            reportedAt: '2024-08-15T10:00:00Z',
            assignedAt: '2024-08-15T11:00:00Z',
            startedAt: '2024-08-15T14:00:00Z',
            notes: 'Electrician has been assigned and is working on the issue.'
          },
          {
            id: 'maintenance-2',
            title: 'Leaking Faucet',
            description: 'The bathroom faucet in room 205 is leaking water continuously.',
            category: 'plumbing' as const,
            priority: 'high' as const,
            status: 'assigned' as const,
            location: {
              hostelId: 'hostel-1',
              hostelName: 'Zik Hall',
              roomNumber: '205',
              floor: '2'
            },
            reportedBy: {
              id: 'student-2',
              name: 'Jane Smith',
              email: 'jane.smith@unn.edu.ng',
              phone: '+2348012345679',
              type: 'student' as const
            },
            assignedTo: {
              id: 'staff-2',
              name: 'David Wilson',
              email: 'david.wilson@unn.edu.ng',
              phone: '+2348098765433'
            },
            estimatedCost: 8000,
            reportedAt: '2024-08-16T09:00:00Z',
            assignedAt: '2024-08-16T10:00:00Z',
            notes: 'Plumber assigned, will visit tomorrow morning.'
          },
          {
            id: 'maintenance-3',
            title: 'Air Conditioner Not Working',
            description: 'The air conditioner in the common room is not cooling properly.',
            category: 'appliance' as const,
            priority: 'urgent' as const,
            status: 'pending' as const,
            location: {
              hostelId: 'hostel-2',
              hostelName: 'Mariere Hall',
              floor: '1'
            },
            reportedBy: {
              id: 'staff-3',
              name: 'Sarah Brown',
              email: 'sarah.brown@unn.edu.ng',
              phone: '+2348012345680',
              type: 'staff' as const
            },
            estimatedCost: 25000,
            reportedAt: '2024-08-17T08:00:00Z',
            notes: 'Urgent repair needed due to hot weather.'
          },
          {
            id: 'maintenance-4',
            title: 'Window Lock Broken',
            description: 'The window lock in room 312 is broken and cannot be secured.',
            category: 'structural' as const,
            priority: 'low' as const,
            status: 'completed' as const,
            location: {
              hostelId: 'hostel-1',
              hostelName: 'Zik Hall',
              roomNumber: '312',
              floor: '3'
            },
            reportedBy: {
              id: 'student-3',
              name: 'Mike Johnson',
              email: 'mike.johnson@unn.edu.ng',
              phone: '+2348012345681',
              type: 'student' as const
            },
            assignedTo: {
              id: 'staff-1',
              name: 'Mike Johnson',
              email: 'mike.johnson@unn.edu.ng',
              phone: '+2348098765432'
            },
            estimatedCost: 3000,
            actualCost: 2800,
            reportedAt: '2024-08-10T15:00:00Z',
            assignedAt: '2024-08-11T09:00:00Z',
            startedAt: '2024-08-11T14:00:00Z',
            completedAt: '2024-08-11T16:00:00Z',
            notes: 'Window lock has been replaced successfully.'
          }
        ]
      }

      // Try to fetch maintenance statistics from backend
      let statsData: MaintenanceStats | null = null
      try {
        const statsRes = await apiClient.get('/maintenance/stats/overview', {
          headers: { Authorization: `Bearer ${token}` }
        })
        statsData = statsRes.data || null
      } catch (statsError) {
        console.warn('Maintenance stats endpoint not available, using fallback data')
        // Calculate stats from fallback data
        const totalRequests = requestsData.length
        const pendingRequests = requestsData.filter(r => r.status === 'pending').length
        const inProgressRequests = requestsData.filter(r => r.status === 'in_progress').length
        const completedRequests = requestsData.filter(r => r.status === 'completed').length
        const urgentRequests = requestsData.filter(r => r.priority === 'urgent').length

        const requestsByCategory = requestsData.reduce((acc: Record<string, number>, request) => {
          acc[request.category] = (acc[request.category] || 0) + 1
          return acc
        }, {})

        const requestsByPriority = requestsData.reduce((acc: Record<string, number>, request) => {
          acc[request.priority] = (acc[request.priority] || 0) + 1
          return acc
        }, {})

        const requestsByStatus = requestsData.reduce((acc: Record<string, number>, request) => {
          acc[request.status] = (acc[request.status] || 0) + 1
          return acc
        }, {})

        statsData = {
          totalRequests,
          pendingRequests,
          inProgressRequests,
          completedRequests,
          urgentRequests,
          requestsByCategory: Object.entries(requestsByCategory).map(([category, count]) => ({ category, count })),
          requestsByPriority: Object.entries(requestsByPriority).map(([priority, count]) => ({ priority, count })),
          requestsByStatus: Object.entries(requestsByStatus).map(([status, count]) => ({ status, count })),
          averageResolutionTime: 24 // Average 24 hours
        }
      }
      
      setMaintenanceRequests(requestsData)
      setStats(statsData)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch maintenance data'
      setError(errorMessage)
      console.error('Maintenance fetch error:', err)
      
      // Set fallback data even on error
      setMaintenanceRequests([])
      setStats({
        totalRequests: 0,
        pendingRequests: 0,
        inProgressRequests: 0,
        completedRequests: 0,
        urgentRequests: 0,
        requestsByCategory: [],
        requestsByPriority: [],
        requestsByStatus: [],
        averageResolutionTime: 0
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchMaintenanceData()
  }, [])

  // Filter maintenance requests based on search and filters
  const filteredRequests = (Array.isArray(maintenanceRequests) ? maintenanceRequests : []).filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.reportedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.location.hostelName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter
    const matchesHostel = hostelFilter === 'all' || request.location.hostelId === hostelFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesHostel
  })

  // Get status color for badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'assigned': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get priority color for badges
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electrical': return '⚡'
      case 'plumbing': return '🚰'
      case 'structural': return '🏗️'
      case 'appliance': return '🔧'
      case 'cleaning': return '🧹'
      default: return '🔧'
    }
  }

  // Get unique values for filters
  const uniqueHostels = [...new Set(maintenanceRequests.map(r => r.location.hostelName))]

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading maintenance data...</p>
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
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Maintenance Data</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <Button 
                onClick={fetchMaintenanceData} 
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

  return (
    <DashboardLayout>
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance</h1>
            <p className="text-gray-600 mt-1">
              Manage maintenance requests and track repair progress
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={fetchMaintenanceData}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Wrench className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRequests || 0}</div>
                <p className="text-xs text-gray-600">
                  All maintenance requests
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingRequests || 0}</div>
                <p className="text-xs text-gray-600">
                  Awaiting assignment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Wrench className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgressRequests || 0}</div>
                <p className="text-xs text-gray-600">
                  Currently being worked on
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedRequests || 0}</div>
                <p className="text-xs text-gray-600">
                  Successfully resolved
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="structural">Structural</option>
                  <option value="appliance">Appliance</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hostel
                </label>
                <select
                  value={hostelFilter}
                  onChange={(e) => setHostelFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Hostels</option>
                  {uniqueHostels.map(hostel => (
                    <option key={hostel} value={hostel}>{hostel}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Requests ({filteredRequests.length})</CardTitle>
            <CardDescription>
              View and manage maintenance requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Request</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Reporter</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Priority</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{request.title}</div>
                            <div className="text-sm text-gray-600 line-clamp-2">{request.description}</div>
                            <div className="flex items-center mt-1">
                              <span className="text-lg mr-2">{getCategoryIcon(request.category)}</span>
                              <span className="text-xs text-gray-500 capitalize">{request.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.location.hostelName}</div>
                            {request.location.roomNumber && (
                              <div className="text-sm text-gray-600">Room {request.location.roomNumber}</div>
                            )}
                            {request.location.floor && (
                              <div className="text-xs text-gray-500">Floor {request.location.floor}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.reportedBy.name}</div>
                            <div className="text-xs text-gray-600 capitalize">{request.reportedBy.type}</div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(request.reportedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
