'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { apiClient } from '@/lib/api';
import { safeLocalStorage } from '@/lib/utils';

interface ApplicationWindow {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  earlyBirdEndDate: string | null;
  maxApplications: number;
  currentApplications: number;
  requiresDocuments: boolean;
  requiredDocuments: string[] | null;
  eligibilityCriteria: Record<string, unknown> | null;
  allocationRules: Record<string, unknown> | null;
  allowWaitlist: boolean;
  waitlistCapacity: number;
  notificationSettings: Record<string, unknown> | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface WindowsResponse {
  data: ApplicationWindow[];
  total: number;
  page: number;
  limit: number;
}

export default function WindowsPage() {
  const router = useRouter();
  const [windows, setWindows] = useState<ApplicationWindow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch application windows
  const fetchWindows = async (refresh = false) => {
    try {
      if (refresh) setIsRefreshing(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const response = await apiClient.get<WindowsResponse>(`/windows?${params.toString()}`);
      const windowsData = response.data.data || response.data;
      
      setWindows(Array.isArray(windowsData) ? windowsData : []);
      setTotalPages(Math.ceil((response.data.total || 0) / 10));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch application windows';
      setError(errorMessage);
      console.error('Windows fetch error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchWindows();
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  // Handle window actions
  const handlePublish = async (windowId: string) => {
    try {
      await apiClient.post(`/windows/${windowId}/publish`);
      fetchWindows(true);
    } catch (err) {
      console.error('Publish error:', err);
    }
  };

  const handleUnpublish = async (windowId: string) => {
    try {
      await apiClient.post(`/windows/${windowId}/unpublish`);
      fetchWindows(true);
    } catch (err) {
      console.error('Unpublish error:', err);
    }
  };

  const handleDelete = async (windowId: string) => {
    if (confirm('Are you sure you want to delete this application window?')) {
      try {
        await apiClient.delete(`/windows/${windowId}`);
        fetchWindows(true);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'freshman':
        return 'bg-blue-100 text-blue-800';
      case 'returning':
        return 'bg-purple-100 text-purple-800';
      case 'transfer':
        return 'bg-orange-100 text-orange-800';
      case 'international':
        return 'bg-indigo-100 text-indigo-800';
      case 'graduate':
        return 'bg-teal-100 text-teal-800';
      case 'staff':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if window is active
  const isWindowActive = (window: ApplicationWindow) => {
    const now = new Date();
    const startDate = new Date(window.startDate);
    const endDate = new Date(window.endDate);
    return now >= startDate && now <= endDate && window.isPublished;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Loading application windows...</p>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Windows</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => fetchWindows(true)} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const filteredWindows = windows.filter(window => {
    const matchesSearch = window.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         window.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || window.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || window.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Windows</h1>
            <p className="text-gray-600 mt-1">Manage hostel application periods and deadlines</p>
          </div>
          <Button onClick={() => router.push('/windows/new')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Application Window
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Windows</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{windows.length}</div>
              <p className="text-xs text-muted-foreground">
                {windows.filter(w => w.isPublished).length} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Windows</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{windows.filter(isWindowActive).length}</div>
              <p className="text-xs text-muted-foreground">
                Currently accepting applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {windows.reduce((sum, window) => sum + (window.currentApplications || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all windows
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Windows</CardTitle>
              <XCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {windows.filter(w => !w.isPublished).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Not yet published
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search windows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="expired">Expired</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Types</option>
                <option value="freshman">Freshman</option>
                <option value="returning">Returning</option>
                <option value="transfer">Transfer</option>
                <option value="international">International</option>
                <option value="graduate">Graduate</option>
                <option value="staff">Staff</option>
              </select>

              <Button 
                onClick={() => fetchWindows(true)} 
                variant="outline" 
                disabled={isRefreshing}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Windows Table */}
        <Card>
          <CardHeader>
            <CardTitle>Application Windows</CardTitle>
            <CardDescription>
              Manage application periods for different student types
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredWindows.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No application windows found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                    ? 'Try adjusting your filters or search terms.'
                    : 'Get started by creating your first application window.'}
                </p>
                {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                  <Button onClick={() => router.push('/windows/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Window
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Period</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Applications</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWindows.map((window) => (
                      <tr key={window.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{window.name}</div>
                            <div className="text-sm text-gray-600">{window.description}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getTypeColor(window.type)}>
                            {window.type}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(window.status)}>
                              {window.status}
                            </Badge>
                            {isWindowActive(window) && (
                              <Badge className="bg-green-100 text-green-800">
                                Live
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div>Start: {formatDate(window.startDate)}</div>
                            <div>End: {formatDate(window.endDate)}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div>{window.currentApplications} / {window.maxApplications}</div>
                            <div className="text-gray-600">
                              {window.allowWaitlist && `+${window.waitlistCapacity} waitlist`}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/windows/${window.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/windows/${window.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {window.isPublished ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnpublish(window.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePublish(window.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(window.id)}
                              className="text-red-600 hover:text-red-700"
                            >
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}






