'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Building, 
  Users, 
  Bed, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { apiClient } from '@/lib/api';
import { safeLocalStorage } from '@/lib/utils';

interface Hostel {
  id: string;
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  email: string;
  capacity: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyRate: number;
  status: 'active' | 'inactive' | 'maintenance';
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
}

interface Block {
  id: string;
  name: string;
  description: string;
  floors: number;
  rooms: Room[];
  createdAt: string;
  updatedAt: string;
}

interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'triple' | 'quad';
  capacity: number;
  occupiedBeds: number;
  availableBeds: number;
  status: 'available' | 'occupied' | 'maintenance';
  beds: Bed[];
  createdAt: string;
  updatedAt: string;
}

interface Bed {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  studentId?: string;
  studentName?: string;
  createdAt: string;
  updatedAt: string;
}

export default function HostelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const hostelId = params.id as string;
  
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hostel details
  const fetchHostel = async () => {
    try {
      setError(null);
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Try to get detailed hostel info first
      const hostelRes = await apiClient.get(`/hostels/${hostelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let hostelData = hostelRes.data;

      // If detailed info is not available, get from stats
      if (!hostelData || Object.keys(hostelData).length === 0) {
        const statsRes = await apiClient.get('/hostels/stats/overview', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const hostelsData = Array.isArray(statsRes.data) ? statsRes.data : [];
        const hostelStats = hostelsData.find((h: {hostelId: string}) => h.hostelId === hostelId);

        if (hostelStats) {
          hostelData = {
            id: hostelStats.hostelId,
            name: hostelStats.hostelName,
            description: hostelStats.hostelName,
            address: 'Address not available',
            phoneNumber: 'Phone not available',
            email: 'Email not available',
            capacity: hostelStats.capacity || 0,
            occupiedBeds: hostelStats.occupiedBeds || 0,
            availableBeds: hostelStats.availableBeds || 0,
            occupancyRate: hostelStats.occupancyRate || 0,
            status: 'active' as const,
            blocks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
      }

      if (!hostelData) {
        throw new Error('Hostel not found');
      }

      setHostel(hostelData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hostel details';
      setError(errorMessage);
      console.error('Hostel fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (hostelId) {
      fetchHostel();
    }
  }, [hostelId]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get occupancy color
  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Loading hostel details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Hostel</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex space-x-3">
              <Button onClick={() => fetchHostel()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!hostel) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Hostel Not Found</h2>
            <p className="text-gray-600 mb-4">The hostel you're looking for doesn't exist.</p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button onClick={() => router.back()} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{hostel.name}</h1>
              <p className="text-gray-600 mt-1">Hostel Details & Statistics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => router.push(`/hostels/${hostelId}/edit`)} 
              variant="outline"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Hostel
            </Button>
            <Button 
              onClick={() => router.push(`/hostels/${hostelId}/delete`)} 
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Building className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(hostel.capacity || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total beds available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupied Beds</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(hostel.occupiedBeds || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Currently occupied
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
              <Bed className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(hostel.availableBeds || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Ready for allocation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getOccupancyColor(hostel.occupancyRate || 0)}`}>
                {(hostel.occupancyRate || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Current utilization
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hostel Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900 mt-1">{hostel.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <Badge className={`mt-1 ${getStatusColor(hostel.status)}`}>
                      {hostel.status}
                    </Badge>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900 mt-1">{hostel.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{hostel.address}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{hostel.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{hostel.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Occupancy Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Occupancy Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Occupancy Rate</span>
                    <span className="font-medium">{(hostel.occupancyRate || 0).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        (hostel.occupancyRate || 0) >= 90 ? 'bg-red-500' :
                        (hostel.occupancyRate || 0) >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(hostel.occupancyRate || 0, 100)}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-blue-600">{hostel.capacity}</div>
                      <div className="text-xs text-gray-600">Total Beds</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-green-600">{hostel.occupiedBeds}</div>
                      <div className="text-xs text-gray-600">Occupied</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-purple-600">{hostel.availableBeds}</div>
                      <div className="text-xs text-gray-600">Available</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => router.push(`/hostels/${hostelId}/edit`)} 
                  className="w-full"
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Hostel
                </Button>
                <Button 
                  onClick={() => router.push(`/hostels/${hostelId}/delete`)} 
                  className="w-full text-red-600 hover:text-red-700"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Hostel
                </Button>
                <Button 
                  onClick={() => router.push('/hostels')} 
                  className="w-full"
                  variant="outline"
                >
                  <Building className="h-4 w-4 mr-2" />
                  View All Hostels
                </Button>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">{formatDate(hostel.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">{formatDate(hostel.updatedAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hostel ID</span>
                  <span className="font-mono text-xs">{hostel.id}</span>
                </div>
              </CardContent>
            </Card>

            {/* Status Indicator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {hostel.status === 'active' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : hostel.status === 'maintenance' ? (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <Badge className={getStatusColor(hostel.status)}>
                    {hostel.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {hostel.status === 'active' && 'This hostel is currently operational and accepting students.'}
                  {hostel.status === 'maintenance' && 'This hostel is under maintenance and may have limited availability.'}
                  {hostel.status === 'inactive' && 'This hostel is currently inactive and not accepting new students.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
