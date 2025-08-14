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

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  category: 'electrical' | 'plumbing' | 'structural' | 'furniture' | 'appliance' | 'security' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  location: string
  roomNumber: string
  reportedDate: string
  assignedDate?: string
  completedDate?: string
  estimatedCost?: number
  actualCost?: number
  technician?: string
  technicianPhone?: string
  notes?: string
  images?: string[]
}

export default function StudentMaintenancePage() {
  const router = useRouter()
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Generate dummy maintenance data
  const generateDummyMaintenance = (): MaintenanceRequest[] => [
    {
      id: 'MAINT001',
      title: 'Broken Light Switch',
      description: 'The light switch in my room is not working properly. Sometimes it works, sometimes it doesn\'t. This makes it difficult to turn on/off the lights.',
      category: 'electrical',
      priority: 'medium',
      status: 'completed',
      location: 'Zik Hall',
      roomNumber: 'R45',
      reportedDate: '2024-12-01',
      assignedDate: '2024-12-02',
      completedDate: '2024-12-03',
      estimatedCost: 5000,
      actualCost: 4500,
      technician: 'John Electrician',
      technicianPhone: '+2348012345678',
      notes: 'Switch replaced with new one. All electrical connections checked and secured.'
    },
    {
      id: 'MAINT002',
      title: 'Leaking Faucet',
      description: 'The bathroom faucet is leaking continuously. Water is dripping even when fully closed, causing water wastage and potential damage.',
      category: 'plumbing',
      priority: 'high',
      status: 'in_progress',
      location: 'Zik Hall',
      roomNumber: 'R45',
      reportedDate: '2024-12-05',
      assignedDate: '2024-12-06',
      estimatedCost: 8000,
      technician: 'Mike Plumber',
      technicianPhone: '+2348098765432',
      notes: 'Parts ordered. Will complete repair once parts arrive.'
    },
    {
      id: 'MAINT003',
      title: 'Broken Chair',
      description: 'One of the wooden chairs in my room has a broken leg. It\'s unstable and unsafe to sit on.',
      category: 'furniture',
      priority: 'low',
      status: 'assigned',
      location: 'Zik Hall',
      roomNumber: 'R45',
      reportedDate: '2024-12-08',
      assignedDate: '2024-12-09',
      estimatedCost: 3000,
      technician: 'David Carpenter',
      technicianPhone: '+2348055555555'
    },
    {
      id: 'MAINT004',
      title: 'Window Lock Broken',
      description: 'The window lock mechanism is broken. The window cannot be properly secured, which is a security concern.',
      category: 'security',
      priority: 'high',
      status: 'pending',
      location: 'Zik Hall',
      roomNumber: 'R45',
      reportedDate: '2024-12-10',
      estimatedCost: 12000
    },
    {
      id: 'MAINT005',
      title: 'Air Conditioner Not Cooling',
      description: 'The air conditioner is running but not producing cold air. The room is very hot and uncomfortable.',
      category: 'appliance',
      priority: 'urgent',
      status: 'completed',
      location: 'Zik Hall',
      roomNumber: 'R45',
      reportedDate: '2024-11-25',
      assignedDate: '2024-11-26',
      completedDate: '2024-11-27',
      estimatedCost: 15000,
      actualCost: 18000,
      technician: 'AC Specialist',
      technicianPhone: '+2348077777777',
      notes: 'Refrigerant leak fixed. AC now working properly. Regular maintenance recommended.'
    },
    {
      id: 'MAINT006',
      title: 'Cracked Wall',
      description: 'There\'s a small crack in the wall near the window. It seems to be getting bigger over time.',
      category: 'structural',
      priority: 'medium',
      status: 'cancelled',
      location: 'Zik Hall',
      roomNumber: 'R45',
      reportedDate: '2024-11-20',
      notes: 'Crack assessed as cosmetic. No structural damage. Request cancelled as per policy.'
    }
  ]

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setMaintenanceRequests(generateDummyMaintenance())
      setLoading(false)
    }, 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'assigned': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electrical': return 'bg-blue-100 text-blue-800'
      case 'plumbing': return 'bg-cyan-100 text-cyan-800'
      case 'structural': return 'bg-purple-100 text-purple-800'
      case 'furniture': return 'bg-amber-100 text-amber-800'
      case 'appliance': return 'bg-indigo-100 text-indigo-800'
      case 'security': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'assigned': return <Wrench className="h-4 w-4" />
      case 'in_progress': return <Settings className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    const matchesCategory = filterCategory === 'all' || request.category === filterCategory
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesCategory && matchesSearch
  })

  const getStatusCount = (status: string) => {
    return maintenanceRequests.filter(req => req.status === status).length
  }

  const getCategoryCount = (category: string) => {
    return maintenanceRequests.filter(req => req.category === category).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading maintenance information...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
              <p className="text-gray-600">Report and track maintenance issues</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => setShowNewRequestModal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Report New Issue
              </Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Emergency Contact
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Download History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{maintenanceRequests.length}</div>
              <p className="text-xs text-gray-600">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</div>
              <p className="text-xs text-gray-600">Awaiting assignment</p>
            </CardContent>
          </Card>

          <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">In Progress</CardTitle>
               <Settings className="h-4 w-4 text-orange-600" />
             </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {getStatusCount('assigned') + getStatusCount('in_progress')}
              </div>
              <p className="text-xs text-gray-600">Being worked on</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getStatusCount('completed')}</div>
              <p className="text-xs text-gray-600">Successfully resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Maintenance Requests</CardTitle>
            <CardDescription>View and track all your maintenance requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <Input
                  placeholder="Search by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="structural">Structural</option>
                  <option value="furniture">Furniture</option>
                  <option value="appliance">Appliance</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
                <Button 
                  onClick={() => setShowNewRequestModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Report New Issue
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getCategoryColor(request.category)}>
                              {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
                            </Badge>
                            <Badge className={getPriorityColor(request.priority)}>
                              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.replace('_', ' ').split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{request.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Location Details</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{request.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>Reported: {new Date(request.reportedDate).toLocaleDateString()}</span>
                            </div>
                            {request.assignedDate && (
                              <div className="flex items-center">
                                <Wrench className="h-4 w-4 mr-2" />
                                <span>Assigned: {new Date(request.assignedDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {request.completedDate && (
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                <span>Completed: {new Date(request.completedDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Cost Information</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {request.estimatedCost && (
                              <div><span className="font-medium">Estimated:</span> ₦{request.estimatedCost.toLocaleString()}</div>
                            )}
                            {request.actualCost && (
                              <div><span className="font-medium">Actual:</span> ₦{request.actualCost.toLocaleString()}</div>
                            )}
                            {request.technician && (
                              <div className="flex items-center">
                                <span className="font-medium">Technician:</span>
                                <span className="ml-1">{request.technician}</span>
                              </div>
                            )}
                            {request.technicianPhone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                <span>{request.technicianPhone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {request.notes && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                          <p className="text-sm text-gray-600">{request.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {request.status === 'pending' && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Cancel
                        </Button>
                      )}
                      {request.technicianPhone && (
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Tech
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Category Statistics */}
        {maintenanceRequests.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Request Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{getCategoryCount('electrical')}</div>
                  <div className="text-sm text-gray-600">Electrical</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-600">{getCategoryCount('plumbing')}</div>
                  <div className="text-sm text-gray-600">Plumbing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{getCategoryCount('structural')}</div>
                  <div className="text-sm text-gray-600">Structural</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{getCategoryCount('furniture')}</div>
                  <div className="text-sm text-gray-600">Furniture</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Report New Maintenance Issue</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title</label>
                <Input placeholder="Brief description of the issue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select category</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="structural">Structural</option>
                  <option value="furniture">Furniture</option>
                  <option value="appliance">Appliance</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Detailed description of the issue..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input placeholder="e.g., Zik Hall" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                  <Input placeholder="e.g., R45" />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowNewRequestModal(false)}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
