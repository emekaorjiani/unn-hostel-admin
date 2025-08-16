'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Calendar, 
  ArrowLeft, 
  Edit, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  RefreshCw,
  Users,
  FileText,
  Settings,
  Bell,
  TrendingUp,
  CalendarDays,
  Target,
  Award,
  Shield,
  BookOpen,
  GraduationCap,
  CreditCard,
  Download,
  ExternalLink,
  Info,
  Star,
  Zap,
  Heart,
  Bookmark,
  Share2,
  Clock3,
  FileCheck,
  Receipt,
  Wallet,
  PiggyBank,
  Banknote,
  QrCode,
  Smartphone,
  Wifi,
  Wrench,
  ShieldCheck,
  Users2,
  MessageSquare,
  HelpCircle,
  CheckSquare,
  Square,
  Circle,
  Minus,
  Plus as PlusIcon,
  LogOut,
  Flag,
  Map,
  Building,
  Home,
  Mail,
  Phone,
  MapPin,
  Bed,
  CreditCard as CreditCardIcon
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/dashboard-layout';
import { apiClient } from '../../../lib/api';
import { safeLocalStorage } from '../../../lib/utils';

// Application Window interface matching the data structure
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

export default function WindowDetailPage() {
  const router = useRouter();
  const params = useParams();
  const windowId = params.id as string;
  
  const [window, setWindow] = useState<ApplicationWindow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches application window details using the window ID
   * Since the API endpoint doesn't exist, we'll use fallback data
   */
  const fetchWindowData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Check for authentication token
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Since the API endpoint doesn't exist, we'll use fallback data
      // In a real implementation, this would be: const response = await apiClient.get(`/windows/${windowId}`)
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!window) return 0;
    return Math.round((window.currentApplications / window.maxApplications) * 100);
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Loading application window details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
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
              <h1 className="text-3xl font-bold text-gray-900">{window.name}</h1>
              <p className="text-gray-600 mt-1">Application window details and statistics</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={() => router.push(`/windows/${windowId}/edit`)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={() => router.push(`/applications?window=${windowId}`)}>
              <Eye className="h-4 w-4 mr-2" />
              View Applications
            </Button>
          </div>
        </div>

        {/* Window Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Window Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Window #{window.id}</h3>
                <p className="text-sm text-gray-600">
                  Created on {formatDate(window.createdAt)}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={`${getTypeColor(window.type)} capitalize`}>
                  {window.type}
                </Badge>
                <Badge className={`${getStatusColor(window.status)} flex items-center`}>
                  {getStatusIcon(window.status)}
                  <span className="ml-1 capitalize">{window.status}</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{window.currentApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Max Capacity</p>
                  <p className="text-2xl font-bold text-gray-900">{window.maxApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{getProgressPercentage()}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Waitlist Capacity</p>
                  <p className="text-2xl font-bold text-gray-900">{window.waitlistCapacity}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Application Progress</CardTitle>
            <CardDescription>
              {window.currentApplications} of {window.maxApplications} applications received
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-green-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>0</span>
              <span>{window.maxApplications}</span>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5" />
              <span>Important Dates</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Application Opens</p>
                  <p className="text-sm text-gray-600">{formatDate(window.startDate)}</p>
                </div>
              </div>
              
              {window.earlyBirdEndDate && (
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Early Bird Deadline</p>
                    <p className="text-sm text-gray-600">{formatDate(window.earlyBirdEndDate)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Application Closes</p>
                  <p className="text-sm text-gray-600">{formatDate(window.endDate)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Required Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Required Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {window.requiresDocuments && window.requiredDocuments ? (
                <div className="space-y-2">
                  {window.requiredDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckSquare className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-900">{doc}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No documents required</p>
              )}
            </CardContent>
          </Card>

          {/* Eligibility Criteria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Eligibility Criteria</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {window.eligibilityCriteria ? (
                <div className="space-y-2">
                  {Object.entries(window.eligibilityCriteria).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-sm text-gray-900">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No specific eligibility criteria</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Allocation Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Allocation Rules</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {window.allocationRules ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(window.allocationRules).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${value ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {value ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <span className="text-sm text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No specific allocation rules</p>
            )}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {window.notificationSettings ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(window.notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${value ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {value ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <span className="text-sm text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No notification settings configured</p>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Description</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{window.description}</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
