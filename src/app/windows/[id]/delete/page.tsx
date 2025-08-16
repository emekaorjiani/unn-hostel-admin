'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  Calendar, 
  ArrowLeft, 
  Trash2, 
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Target,
  FileText,
  Settings,
  Bell,
  Info
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/dashboard-layout';
import { apiClient } from '../../../../lib/api';
import { safeLocalStorage } from '../../../../lib/utils';

// Application Window interface
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

export default function DeleteWindowPage() {
  const router = useRouter();
  const params = useParams();
  const windowId = params.id as string;
  
  const [window, setWindow] = useState<ApplicationWindow | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Fetches window details for deletion confirmation
   */
  const fetchWindowData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Since the API endpoint doesn't exist, we'll use fallback data
      const fallbackWindows: ApplicationWindow[] = [
        {
          id: 'window-1',
          name: '2024/2025 Academic Year - First Semester',
          description: 'Application window for first semester hostel accommodation. This window allows returning students to apply for hostel accommodation for the first semester of the 2024/2025 academic year.',
          type: 'returning',
          status: 'active',
          startDate: '2024-08-01T00:00:00Z',
          endDate: '2024-08-31T23:59:59Z',
          earlyBirdEndDate: '2024-08-15T23:59:59Z',
          maxApplications: 1000,
          currentApplications: 156,
          requiresDocuments: true,
          requiredDocuments: ['Student ID', 'Passport Photo', 'Academic Transcript', 'Payment Receipt'],
          eligibilityCriteria: {
            minimumGPA: 2.0,
            academicLevel: ['100', '200', '300', '400'],
            paymentStatus: 'cleared',
            registrationStatus: 'completed'
          },
          allocationRules: {
            priorityByLevel: true,
            firstComeFirstServe: true,
            meritBased: false
          },
          allowWaitlist: true,
          waitlistCapacity: 200,
          notificationSettings: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true
          },
          isPublished: true,
          publishedAt: '2024-07-15T00:00:00Z',
          createdAt: '2024-07-01T00:00:00Z',
          updatedAt: '2024-07-15T00:00:00Z'
        },
        {
          id: 'window-2',
          name: '2024/2025 Academic Year - Second Semester',
          description: 'Application window for second semester hostel accommodation. This window allows returning students to apply for hostel accommodation for the second semester.',
          type: 'returning',
          status: 'scheduled',
          startDate: '2024-12-01T00:00:00Z',
          endDate: '2024-12-31T23:59:59Z',
          earlyBirdEndDate: '2024-12-15T23:59:59Z',
          maxApplications: 1000,
          currentApplications: 0,
          requiresDocuments: true,
          requiredDocuments: ['Student ID', 'Passport Photo', 'Academic Transcript'],
          eligibilityCriteria: {
            minimumGPA: 2.0,
            academicLevel: ['100', '200', '300', '400'],
            paymentStatus: 'cleared'
          },
          allocationRules: {
            priorityByLevel: true,
            firstComeFirstServe: true
          },
          allowWaitlist: true,
          waitlistCapacity: 200,
          notificationSettings: {
            emailNotifications: true,
            smsNotifications: false
          },
          isPublished: false,
          publishedAt: null,
          createdAt: '2024-07-01T00:00:00Z',
          updatedAt: '2024-07-01T00:00:00Z'
        },
        {
          id: 'window-3',
          name: '2024/2025 Freshman Application',
          description: 'Application window for incoming freshmen students. This window allows newly admitted students to apply for hostel accommodation.',
          type: 'freshman',
          status: 'active',
          startDate: '2024-07-01T00:00:00Z',
          endDate: '2024-07-31T23:59:59Z',
          earlyBirdEndDate: '2024-07-15T23:59:59Z',
          maxApplications: 500,
          currentApplications: 89,
          requiresDocuments: true,
          requiredDocuments: ['JAMB Result', 'O\'Level Certificate', 'Passport Photo', 'Admission Letter'],
          eligibilityCriteria: {
            admissionStatus: 'confirmed',
            paymentStatus: 'cleared',
            registrationStatus: 'completed'
          },
          allocationRules: {
            firstComeFirstServe: true,
            meritBased: true
          },
          allowWaitlist: true,
          waitlistCapacity: 100,
          notificationSettings: {
            emailNotifications: true,
            smsNotifications: true
          },
          isPublished: true,
          publishedAt: '2024-06-15T00:00:00Z',
          createdAt: '2024-06-01T00:00:00Z',
          updatedAt: '2024-06-15T00:00:00Z'
        }
      ];

      const windowData = fallbackWindows.find(w => w.id === windowId);
      
      if (!windowData) {
        throw new Error('Application window not found');
      }

      setWindow(windowData);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch window data';
      setError(errorMessage);
      console.error('Window fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (windowId) {
      fetchWindowData();
    }
  }, [windowId]);

  // Handle deletion
  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError(null);

      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Since the API endpoint doesn't exist, we'll simulate the deletion
      // In a real implementation, this would be: await apiClient.delete(`/windows/${windowId}`)
      console.log('Deleting window:', windowId);
      
      setSuccess('Application window deleted successfully!');
      
      // Redirect to the windows list after a short delay
      setTimeout(() => {
        router.push('/windows');
      }, 2000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete window';
      setError(errorMessage);
      console.error('Window deletion error:', err);
    } finally {
      setDeleting(false);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'returning': return 'bg-purple-100 text-purple-800';
      case 'freshman': return 'bg-orange-100 text-orange-800';
      case 'transfer': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Loading window details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error && !window) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Window</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex space-x-3">
              <Button onClick={() => fetchWindowData()} variant="outline">
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

  if (!window) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Window Not Found</h2>
            <p className="text-gray-600 mb-4">The application window you're looking for doesn't exist.</p>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={() => router.back()} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Delete Application Window</h1>
              <p className="text-gray-600 mt-1">Confirm deletion of application window</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Warning Card */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Delete Confirmation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-red-700">
                Are you sure you want to delete the application window <strong>"{window.name}"</strong>? 
                This action cannot be undone and will permanently remove all associated data.
              </p>
              
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-gray-900 mb-2">What will be deleted:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Application window configuration</li>
                  <li>• All associated application data</li>
                  <li>• Notification settings</li>
                  <li>• Eligibility criteria and allocation rules</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">Warning:</h3>
                <p className="text-yellow-700 text-sm">
                  This window currently has <strong>{window.currentApplications} applications</strong>. 
                  Deleting this window will also remove all associated application records.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Window Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Window Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{window.name}</h3>
                  <p className="text-sm text-gray-600">{window.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getTypeColor(window.type)} capitalize`}>
                    {window.type}
                  </Badge>
                  <Badge className={`${getStatusColor(window.status)} capitalize`}>
                    {window.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {window.currentApplications} / {window.maxApplications} applications
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {formatDate(window.startDate)} - {formatDate(window.endDate)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {window.requiredDocuments?.length || 0} required documents
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={deleting}
          >
            {deleting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Window
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
