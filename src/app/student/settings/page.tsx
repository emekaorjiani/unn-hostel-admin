'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Building2,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  BookOpen,
  Flag,
  Heart,
  CreditCard
} from 'lucide-react'
import { studentService, StudentProfile } from '@/lib/studentService'
import StudentHeader from '@/components/layout/student-header'
import QuickActions from '@/components/ui/quick-actions'

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  paymentReminders: boolean
  maintenanceUpdates: boolean
  academicUpdates: boolean
  hostelAnnouncements: boolean
}

interface SecuritySettings {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  twoFactorEnabled: boolean
  sessionTimeout: number
}

export default function StudentSettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Mock student data based on API schema
  const [student, setStudent] = useState<StudentProfile>({
    user: {
      id: 'student-001',
      matric_number: '2021/123456',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@unn.edu.ng',
      phone_number: '+234 801 234 5678',
      faculty: 'Engineering',
      department: 'Computer Engineering',
      level: '300',
      gender: 'male',
      date_of_birth: '2000-01-15',
      address: '123 Main Street, Nsukka, Enugu State',
      state_of_origin: 'Enugu',
      local_government: 'Nsukka',
      tribe: 'Igbo',
      religion: 'Christianity',
      nationality: 'Nigerian',
      emergency_contact: 'Jane Doe',
      emergency_phone: '+234 802 345 6789',
      is_pwd: false,
      pwd_details: '',
      is_international_student: false,
      passport_number: '',
      nin_number: '12345678901',
      status: 'active',
      is_email_verified: true,
      is_phone_verified: false,
      created_at: '2023-09-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    }
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    paymentReminders: true,
    maintenanceUpdates: true,
    academicUpdates: false,
    hostelAnnouncements: true
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: 30
  })

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setLoading(false)
    }, 600)
  }, [])

  const handleProfileUpdate = async () => {
    setSaving(true)
    try {
      // Update profile using real API
      await studentService.updateSettings({
        profile: student?.user
      })
    setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleNotificationUpdate = async () => {
    setSaving(true)
    try {
      // Update notification preferences using real API
      await studentService.updateSettings({
        notifications: notifications
      })
    setMessage({ type: 'success', text: 'Notification preferences updated!' })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update notification preferences'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleSecurityUpdate = async () => {
    if (security.newPassword !== security.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    setSaving(true)
    try {
      // Update security settings using real API
      await studentService.updateSettings({
        security: {
          currentPassword: security.currentPassword,
          newPassword: security.newPassword
        }
      })
    setMessage({ type: 'success', text: 'Security settings updated successfully!' })
    setSecurity(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update security settings'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <StudentHeader
        title="Settings"
        subtitle="Manage your account preferences and settings"
        showBackButton={true}
        onBackClick={() => router.back()}
      />

      <div className="pt-16 max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions - Fixed at top */}
        <div className="mb-6">
          <QuickActions />
        </div>
        
        <div className="mt-20 space-y-8">
        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <Input
                      value={student.user.first_name}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, first_name: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <Input
                      value={student.user.last_name}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, last_name: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={student.user.email}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, email: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input
                      value={student.user.phone_number}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, phone_number: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <Input
                      type="date"
                      value={student.user.date_of_birth}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, date_of_birth: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={student.user.gender}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, gender: e.target.value as 'male' | 'female' } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <Input
                    value={student.user.address}
                    onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, address: e.target.value } }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State of Origin</label>
                    <Input
                      value={student.user.state_of_origin}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, state_of_origin: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Local Government</label>
                    <Input
                      value={student.user.local_government}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, local_government: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tribe</label>
                    <Input
                      value={student.user.tribe}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, tribe: e.target.value } }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                  <Input
                    value={student.user.religion}
                    onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, religion: e.target.value } }))}
                  />
                </div>

                <Button 
                  onClick={handleProfileUpdate}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700"
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
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Academic Information
                </CardTitle>
                <CardDescription>
                  Your academic details and enrollment information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Matric Number</label>
                    <Input
                      value={student.user.matric_number}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Faculty</label>
                    <Input
                      value={student.user.faculty}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, faculty: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <Input
                      value={student.user.department}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, department: e.target.value } }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <Input
                    value={student.user.level}
                    onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, level: e.target.value } }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Emergency Contact
                </CardTitle>
                <CardDescription>
                  Update your emergency contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                    <Input
                      value={student.user.emergency_contact}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, emergency_contact: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <Input
                      value={student.user.emergency_phone}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, emergency_phone: e.target.value } }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Additional Information
                </CardTitle>
                <CardDescription>
                  Special requirements and additional details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Person with Disability (PWD)</h4>
                      <p className="text-sm text-gray-600">Do you have any special requirements?</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={student.user.is_pwd}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, is_pwd: e.target.checked } }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">International Student</h4>
                      <p className="text-sm text-gray-600">Are you an international student?</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={student.user.is_international_student}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, is_international_student: e.target.checked } }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                {student.user.is_pwd && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PWD Details</label>
                    <textarea
                      value={student.user.pwd_details || ''}
                      onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, pwd_details: e.target.value } }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Please describe any special requirements or accommodations needed..."
                    />
                  </div>
                )}

                {student.user.is_international_student && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                      <Input
                        value={student.user.nationality}
                        onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, nationality: e.target.value } }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                      <Input
                        value={student.user.passport_number || ''}
                        onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, passport_number: e.target.value } }))}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NIN Number</label>
                  <Input
                    value={student.user.nin_number || ''}
                    onChange={(e) => setStudent(prev => ({ ...prev, user: { ...prev.user, nin_number: e.target.value } }))}
                    placeholder="National Identification Number"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how and when you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={(e) => setNotifications(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.smsNotifications}
                    onChange={(e) => setNotifications(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Receive push notifications in the app</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.pushNotifications}
                    onChange={(e) => setNotifications(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Specific Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">Payment Reminders</h5>
                      <p className="text-sm text-gray-600">Get notified about upcoming payments</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.paymentReminders}
                      onChange={(e) => setNotifications(prev => ({ ...prev, paymentReminders: e.target.checked }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">Maintenance Updates</h5>
                      <p className="text-sm text-gray-600">Get notified about maintenance requests</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.maintenanceUpdates}
                      onChange={(e) => setNotifications(prev => ({ ...prev, maintenanceUpdates: e.target.checked }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">Academic Updates</h5>
                      <p className="text-sm text-gray-600">Get notified about academic deadlines</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.academicUpdates}
                      onChange={(e) => setNotifications(prev => ({ ...prev, academicUpdates: e.target.checked }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">Hostel Announcements</h5>
                      <p className="text-sm text-gray-600">Get notified about hostel announcements</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.hostelAnnouncements}
                      onChange={(e) => setNotifications(prev => ({ ...prev, hostelAnnouncements: e.target.checked }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleNotificationUpdate}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={security.currentPassword}
                      onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={security.newPassword}
                    onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter your new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={security.twoFactorEnabled}
                    onChange={(e) => setSecurity(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <select
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={0}>Never (until logout)</option>
                  </select>
                </div>
              </div>

              <Button 
                onClick={handleSecurityUpdate}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Security Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Preferences */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Display Preferences
                </CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Dark Mode</h4>
                    <p className="text-sm text-gray-600">Switch between light and dark themes</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="WAT">West Africa Time (WAT)</option>
                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                    <option value="EST">Eastern Standard Time (EST)</option>
                    <option value="PST">Pacific Standard Time (PST)</option>
                  </select>
                </div>

                <Button className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  View your account details and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Matric Number:</span>
                      <span className="font-medium">{student.user.matric_number}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Faculty:</span>
                      <span className="font-medium">{student.user.faculty}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Department:</span>
                      <span className="font-medium">{student.user.department}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Level:</span>
                      <span className="font-medium">{student.user.level}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Flag className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Nationality:</span>
                      <span className="font-medium">{student.user.nationality}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">State:</span>
                      <span className="font-medium">{student.user.state_of_origin}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge className="bg-green-100 text-green-800 capitalize">{student.user.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Email Verified:</span>
                      <Badge className={student.user.is_email_verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {student.user.is_email_verified ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  </div>
  )
}
