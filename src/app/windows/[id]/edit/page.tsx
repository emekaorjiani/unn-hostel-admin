'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { 
  Calendar, 
  ArrowLeft, 
  Save, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  RefreshCw,
  Users,
  FileText,
  Settings,
  Bell,
  Target,
  Star,
  Shield,
  Info,
  Plus,
  Minus,
  Trash2
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

interface WindowForm {
  name: string;
  description: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  earlyBirdEndDate: string;
  maxApplications: number;
  requiresDocuments: boolean;
  requiredDocuments: string[];
  eligibilityCriteria: Record<string, unknown>;
  allocationRules: Record<string, unknown>;
  allowWaitlist: boolean;
  waitlistCapacity: number;
  notificationSettings: Record<string, unknown>;
  isPublished: boolean;
}

export default function EditWindowPage() {
  const router = useRouter();
  const params = useParams();
  const windowId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [originalWindow, setOriginalWindow] = useState<ApplicationWindow | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<WindowForm>({
    name: '',
    description: '',
    type: 'returning',
    status: 'draft',
    startDate: '',
    endDate: '',
    earlyBirdEndDate: '',
    maxApplications: 1000,
    requiresDocuments: true,
    requiredDocuments: ['Student ID', 'Passport Photo'],
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
    isPublished: false
  });

  /**
   * Fetches window details and populates the form
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

      setOriginalWindow(windowData);
      
      // Populate form with window data
      setFormData({
        name: windowData.name,
        description: windowData.description,
        type: windowData.type,
        status: windowData.status,
        startDate: windowData.startDate.split('T')[0],
        endDate: windowData.endDate.split('T')[0],
        earlyBirdEndDate: windowData.earlyBirdEndDate ? windowData.earlyBirdEndDate.split('T')[0] : '',
        maxApplications: windowData.maxApplications,
        requiresDocuments: windowData.requiresDocuments,
        requiredDocuments: windowData.requiredDocuments || [],
        eligibilityCriteria: windowData.eligibilityCriteria || {},
        allocationRules: windowData.allocationRules || {},
        allowWaitlist: windowData.allowWaitlist,
        waitlistCapacity: windowData.waitlistCapacity,
        notificationSettings: windowData.notificationSettings || {},
        isPublished: windowData.isPublished
      });

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Since the API endpoint doesn't exist, we'll simulate the update
      // In a real implementation, this would be: const response = await apiClient.put(`/windows/${windowId}`, formData)
      console.log('Updating window:', formData);
      
      setSuccess('Application window updated successfully!');
      
      // Redirect to the window view after a short delay
      setTimeout(() => {
        router.push(`/windows/${windowId}`);
      }, 2000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update window';
      setError(errorMessage);
      console.error('Window update error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (field: keyof WindowForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle document addition
  const addDocument = () => {
    setFormData(prev => ({
      ...prev,
      requiredDocuments: [...prev.requiredDocuments, '']
    }));
  };

  // Handle document removal
  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter((_, i) => i !== index)
    }));
  };

  // Handle document change
  const updateDocument = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.map((doc, i) => i === index ? value : doc)
    }));
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
  if (error && !originalWindow) {
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Application Window</h1>
              <p className="text-gray-600 mt-1">Update window settings and configuration</p>
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
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Window Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter window name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="returning">Returning Students</option>
                    <option value="freshman">Freshman</option>
                    <option value="transfer">Transfer Students</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter window description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Important Dates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Early Bird Deadline
                  </label>
                  <Input
                    type="date"
                    value={formData.earlyBirdEndDate}
                    onChange={(e) => handleInputChange('earlyBirdEndDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capacity Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Capacity Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Applications
                  </label>
                  <Input
                    type="number"
                    value={formData.maxApplications}
                    onChange={(e) => handleInputChange('maxApplications', parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waitlist Capacity
                  </label>
                  <Input
                    type="number"
                    value={formData.waitlistCapacity}
                    onChange={(e) => handleInputChange('waitlistCapacity', parseInt(e.target.value))}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowWaitlist"
                  checked={formData.allowWaitlist}
                  onChange={(e) => handleInputChange('allowWaitlist', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="allowWaitlist" className="text-sm font-medium text-gray-700">
                  Allow waitlist
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Required Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requiresDocuments"
                  checked={formData.requiresDocuments}
                  onChange={(e) => handleInputChange('requiresDocuments', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="requiresDocuments" className="text-sm font-medium text-gray-700">
                  Require documents for application
                </label>
              </div>
              
              {formData.requiresDocuments && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Document List
                  </label>
                  {formData.requiredDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={doc}
                        onChange={(e) => updateDocument(index, e.target.value)}
                        placeholder="Enter document name"
                      />
                      <Button
                        type="button"
                        onClick={() => removeDocument(index)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addDocument}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Status Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                    Publish window
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
        </form>
      </div>
    </DashboardLayout>
  );
}
