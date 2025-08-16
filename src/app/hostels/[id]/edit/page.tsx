'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Building, 
  Save, 
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Users,
  Bed,
  RefreshCw,
  Trash2
} from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { apiClient } from '@/lib/api';

interface HostelForm {
  name: string;
  description: string;
  type: 'male' | 'female' | 'mixed';
  address: string;
  phone_number: string;
  email: string;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
}

export default function EditHostelPage() {
  const router = useRouter();
  const params = useParams();
  const hostelId = params.id as string;
  
  const [formData, setFormData] = useState<HostelForm>({
    name: '',
    description: '',
    type: 'mixed',
    address: '',
    phone_number: '',
    email: '',
    capacity: 0,
    status: 'active'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch hostel data
  const fetchHostel = async () => {
    try {
      setError(null);
      setLoading(true);

      // Get detailed hostel info from API
      const hostelRes = await apiClient.get(`/hostels/${hostelId}`);
      let hostelData = hostelRes.data.data?.hostel || hostelRes.data.data || hostelRes.data;

      if (!hostelData) {
        throw new Error('Hostel not found');
      }
      }

      if (!hostelData) {
        throw new Error('Hostel not found');
      }

      // Populate form with hostel data
      setFormData({
        name: hostelData.name || '',
        description: hostelData.description || '',
        address: hostelData.address || '',
        phoneNumber: hostelData.phoneNumber || '',
        email: hostelData.email || '',
        capacity: hostelData.capacity || 0,
        status: hostelData.status || 'active'
      });

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

  // Handle input changes
  const handleInputChange = (field: keyof HostelForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Hostel name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Hostel description is required');
      }
      if (formData.capacity <= 0) {
        throw new Error('Capacity must be greater than 0');
      }

      // Update hostel
      await apiClient.put(`/hostels/${hostelId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Hostel updated successfully!');
      
      // Redirect to the hostel's detail page after a short delay
      setTimeout(() => {
        router.push(`/hostels/${hostelId}`);
      }, 1500);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update hostel';
      setError(errorMessage);
      console.error('Update hostel error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this hostel? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
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
      }, 1500);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete hostel';
      setError(errorMessage);
      console.error('Delete hostel error:', err);
    } finally {
      setSaving(false);
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

  if (error && !formData.name) {
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Hostel</h1>
            <p className="text-gray-600 mt-1">Update hostel information and settings</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
                <CardDescription>
                  Essential details about the hostel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hostel Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter hostel name"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the hostel facilities and features"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity *
                  </label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                    placeholder="Number of beds"
                    min="1"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Total number of beds available in this hostel
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
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
                <CardDescription>
                  Contact details for the hostel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter hostel address"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Enter phone number"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Preview</span>
              </CardTitle>
              <CardDescription>
                Preview of how the hostel will appear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {formData.name || 'Hostel Name'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.description || 'Hostel description will appear here'}
                    </p>
                  </div>
                  <Badge className={formData.status === 'active' ? 'bg-green-100 text-green-800' : 
                                   formData.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                                   'bg-red-100 text-red-800'}>
                    {formData.status}
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Bed className="h-4 w-4 text-gray-400" />
                    <span>Capacity: {formData.capacity || 0} beds</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>Available: {formData.capacity || 0} beds</span>
                  </div>
                </div>
                {formData.address && (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{formData.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
            >
              Cancel
            </Button>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                onClick={handleDelete}
                variant="outline"
                className="text-red-600 hover:text-red-700"
                disabled={saving}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Hostel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}



