'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Building, 
  AlertTriangle,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Users,
  Bed
} from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { apiClient } from '@/lib/api';
import { safeLocalStorage } from '@/lib/utils';

interface Hostel {
  id: string;
  name: string;
  description: string;
  type: 'male' | 'female' | 'mixed';
  address: string;
  phone_number: string;
  email: string;
  capacity: number;
  occupied_beds: number;
  available_beds: number;
  occupancy_rate: number;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export default function DeleteHostelPage() {
  const router = useRouter();
  const params = useParams();
  const hostelId = params.id as string;
  
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch hostel details
  const fetchHostel = async () => {
    try {
      setError(null);
      setLoading(true);

      // Get detailed hostel info from API
      const hostelRes = await apiClient.get(`/hostels/${hostelId}`);
      const hostelData = hostelRes.data.data?.hostel || hostelRes.data.data || hostelRes.data;

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

  // Handle delete confirmation
  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      await apiClient.delete(`/hostels/${hostelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Hostel deleted successfully!');
      
      // Redirect to hostels list after a short delay
      setTimeout(() => {
        router.push('/hostels');
      }, 2000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete hostel';
      setError(errorMessage);
      console.error('Delete hostel error:', err);
    } finally {
      setDeleting(false);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  if (error && !hostel) {
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
        <div className="flex items-center space-x-4">
          <Button onClick={() => router.back()} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delete Hostel</h1>
            <p className="text-gray-600 mt-1">Confirm deletion of hostel facility</p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800">{success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Warning Card */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-6 w-6" />
              <span>⚠️ Warning: This action cannot be undone</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-red-700">
                You are about to delete the hostel <strong>"{hostel.name}"</strong>. This action will:
              </p>
              <ul className="list-disc list-inside space-y-2 text-red-700">
                <li>Permanently remove the hostel from the system</li>
                <li>Delete all associated data and records</li>
                <li>Affect any students currently assigned to this hostel</li>
                <li>Remove all room and bed allocations</li>
              </ul>
              <p className="text-red-700 font-medium">
                This action cannot be undone. Please make sure you have backed up any important data.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Hostel Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Hostel Information</span>
            </CardTitle>
            <CardDescription>
              Details of the hostel you are about to delete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{hostel.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{hostel.description}</p>
                </div>
                <Badge className={getStatusColor(hostel.status)}>
                  {hostel.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{hostel.capacity}</div>
                  <div className="text-sm text-gray-600">Total Capacity</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{hostel.occupied_beds}</div>
                  <div className="text-sm text-gray-600">Occupied Beds</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{hostel.available_beds}</div>
                  <div className="text-sm text-gray-600">Available Beds</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Bed className="h-4 w-4" />
                <span>Occupancy Rate: {hostel.occupancy_rate.toFixed(1)}%</span>
              </div>

              {hostel.occupied_beds > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-yellow-800 font-medium">⚠️ Students Currently Assigned</p>
                      <p className="text-yellow-700 text-sm">
                        This hostel has {hostel.occupied_beds} occupied beds. Deleting this hostel will affect these students.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Confirmation */}
        <Card>
          <CardHeader>
            <CardTitle>Final Confirmation</CardTitle>
            <CardDescription>
              Please confirm that you want to delete this hostel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confirm-delete"
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="confirm-delete" className="text-sm text-gray-700">
                  I understand that this action cannot be undone and I have backed up any important data
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confirm-students"
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="confirm-students" className="text-sm text-gray-700">
                  I understand that deleting this hostel will affect {hostel.occupied_beds} currently assigned students
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confirm-final"
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="confirm-final" className="text-sm text-gray-700">
                  I want to permanently delete the hostel "{hostel.name}"
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.back()}
            variant="outline"
            disabled={deleting}
          >
            Cancel
          </Button>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => router.push(`/hostels/${hostelId}/edit`)}
              variant="outline"
              disabled={deleting}
            >
              Edit Instead
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting || 
                       !(document.getElementById('confirm-delete') as HTMLInputElement)?.checked || 
                       !(document.getElementById('confirm-students') as HTMLInputElement)?.checked || 
                       !(document.getElementById('confirm-final') as HTMLInputElement)?.checked}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Hostel
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}



