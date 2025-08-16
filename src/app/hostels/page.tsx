'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Building, 
  Users, 
  Bed, 
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { dashboardService } from '@/lib/dashboardService'

interface Hostel {
  id: string
  name: string
  description: string
  type: 'male' | 'female' | 'mixed'
  address: string
  phone_number: string
  email: string
  capacity: number
  occupied_beds: number
  available_beds: number
  occupancy_rate: number
  status: 'active' | 'inactive' | 'maintenance'
  blocks: Block[]
  created_at: string
  updated_at: string
}

interface Block {
  id: string
  name: string
  description: string
  floors: number
  rooms: Room[]
  created_at: string
  updated_at: string
}

interface Room {
  id: string
  number: string
  type: 'single' | 'double' | 'triple' | 'quad'
  capacity: number
  occupied_beds: number
  available_beds: number
  status: 'available' | 'occupied' | 'maintenance'
  beds: Bed[]
  created_at: string
  updated_at: string
}

interface Bed {
  id: string
  number: string
  status: 'available' | 'occupied' | 'maintenance' | 'reserved'
  studentId?: string
  studentName?: string
  createdAt: string
  updatedAt: string
}

interface HostelStats {
  total_hostels: number
  active_hostels: number
  male_hostels: number
  female_hostels: number
  mixed_hostels: number
}

export default function HostelsPage() {
  const router = useRouter()
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [stats, setStats] = useState<HostelStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Fetch hostels data from API
  const fetchHostels = async () => {
    try {
      setError(null)
      setLoading(true)
      
      // Build query parameters
      const params: any = {}
      if (statusFilter !== 'all') params.type = statusFilter
      if (searchQuery) params.search = searchQuery
      
      // Fetch data from API
      const response = await dashboardService.getHostels(params)
      
      // Debug: Log the API response to see the structure
      console.log('Hostels API Response:', response)
      
      // Transform the hostels data to ensure all required fields are present
      const transformedHostels = response.hostels.map((hostel: any) => {
        // Calculate capacity and occupancy from blocks if not provided directly
        let totalCapacity = hostel.capacity || 0
        let totalOccupied = hostel.occupied_beds || 0
        let totalAvailable = hostel.available_beds || 0
        
        // If we have blocks data, calculate from there
        if (hostel.blocks && Array.isArray(hostel.blocks)) {
          totalCapacity = hostel.blocks.reduce((sum: number, block: any) => {
            return sum + (block.total_beds || block.capacity || 0)
          }, 0)
          
          totalOccupied = hostel.blocks.reduce((sum: number, block: any) => {
            return sum + (block.occupied_beds || 0)
          }, 0)
          
          totalAvailable = totalCapacity - totalOccupied
        }
        
        // Calculate occupancy rate
        const occupancyRate = totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0
        
        return {
          id: hostel.id,
          name: hostel.name,
          description: hostel.description || `${hostel.name} - University of Nigeria, Nsukka`,
          type: hostel.type || 'mixed',
          address: hostel.address || `${hostel.name}, University of Nigeria, Nsukka`,
          phone_number: hostel.phone_number || hostel.manager_phone || 'Not available',
          email: hostel.email || hostel.manager_email || `${hostel.name.toLowerCase().replace(/\s+/g, '.')}@unn.edu.ng`,
          capacity: totalCapacity,
          occupied_beds: totalOccupied,
          available_beds: totalAvailable,
          occupancy_rate: occupancyRate,
          status: hostel.status || 'active',
          blocks: hostel.blocks || [],
          created_at: hostel.created_at || new Date().toISOString(),
          updated_at: hostel.updated_at || new Date().toISOString()
        }
      })
      
      setHostels(transformedHostels)
      setStats(response.statistics)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hostels'
      setError(errorMessage)
      console.error('Hostels fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchHostels()
  }, [])

  // Filter hostels
  const filteredHostels = (Array.isArray(hostels) ? hostels : []).filter(hostel => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hostel.address.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || hostel.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get occupancy color
  const getOccupancyColor = (rate: number | undefined) => {
    const safeRate = rate || 0
    if (safeRate >= 90) return 'text-red-600'
    if (safeRate >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading hostels...</p>
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
            <Trash2 className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Hostels</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <Button 
                onClick={fetchHostels} 
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
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hostels</h1>
            <p className="text-gray-600 mt-1">
              Manage hostel facilities and room allocations
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={fetchHostels}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" onClick={() => router.push('/hostels/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Hostel
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
                <Building className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_hostels || 0}</div>
                <p className="text-xs text-gray-600">
                  All hostel facilities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Hostels</CardTitle>
                <Building className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active_hostels || 0}</div>
                <p className="text-xs text-gray-600">
                  Currently operational
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Male Hostels</CardTitle>
                <Bed className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.male_hostels || 0}</div>
                <p className="text-xs text-gray-600">
                  Male hostel facilities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Female Hostels</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.female_hostels || 0}</div>
                <p className="text-xs text-gray-600">
                  Female hostel facilities
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by hostel name or address..."
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hostels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHostels.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hostels found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            filteredHostels.map((hostel) => (
              <Card key={hostel.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{hostel.name}</CardTitle>
                      <CardDescription className="mt-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {hostel.address}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(hostel.status)}>
                      {hostel.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {hostel.phone_number}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {hostel.email}
                      </div>
                    </div>

                    {/* Capacity Info */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {hostel.occupied_beds}/{hostel.capacity}
                        </div>
                        <div className="text-xs text-gray-600">Beds Occupied</div>
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${getOccupancyColor(hostel.occupancy_rate || 0)}`}>
                          {(hostel.occupancy_rate || 0).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600">Occupancy Rate</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (hostel.occupancy_rate || 0) >= 90 ? 'bg-red-500' :
                          (hostel.occupancy_rate || 0) >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(hostel.occupancy_rate || 0, 100)}%` }}
                      ></div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/hostels/${hostel.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/hostels/${hostel.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => router.push(`/hostels/${hostel.id}/delete`)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => router.push(`/hostels/${hostel.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
