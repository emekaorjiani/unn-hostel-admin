'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { authService } from '@/lib/auth'
import { studentService } from '@/lib/studentService'
import StudentHeader from '@/components/layout/student-header'
import { Edit3, Save, X, User, Phone, GraduationCap, Building2, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import QuickActions from '@/components/ui/quick-actions'

interface StudentProfileData {
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    matric_number: string
    phone_number?: string
    faculty?: string
    department?: string
    level?: string
    gender?: string
    date_of_birth?: string
    address?: string
    state_of_origin?: string
    nationality?: string
    local_government?: string
    tribe?: string
    religion?: string
    emergency_contact?: string
    emergency_phone?: string
    is_pwd?: boolean
    pwd_details?: string
    is_international_student?: boolean
    passport_number?: string
    nin_number?: string
    status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
    is_email_verified: boolean
    is_phone_verified: boolean
    created_at: string
    updated_at: string
  }
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editedProfile, setEditedProfile] = useState<StudentProfileData | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Try to get profile from auth service first
        const storedProfile = authService.getStoredStudentProfile()
        if (storedProfile) {
          // Transform the stored profile to match the expected format
          const transformedProfile: StudentProfileData = {
            user: {
              id: storedProfile.id,
              first_name: storedProfile.firstName,
              last_name: storedProfile.lastName,
              email: storedProfile.email,
              matric_number: storedProfile.matricNumber,
              faculty: storedProfile.department,
              level: storedProfile.level?.toString(),
              status: storedProfile.isActive ? 'active' : 'inactive',
              is_email_verified: true,
              is_phone_verified: false,
              created_at: storedProfile.createdAt,
              updated_at: storedProfile.updatedAt
            }
          }
          setProfile(transformedProfile)
          setEditedProfile(transformedProfile)
        } else {
          // Fallback to mock data
          const mockProfile: StudentProfileData = {
            user: {
              id: 'student-001',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john.doe@unn.edu.ng',
              matric_number: '2021/123456',
              phone_number: '+234 801 234 5678',
              faculty: 'Engineering',
              department: 'Computer Engineering',
              level: '300',
              gender: 'Male',
              date_of_birth: '2000-01-15',
              address: '123 Main Street, Nsukka, Enugu State',
              state_of_origin: 'Enugu',
              nationality: 'Nigerian',
              local_government: 'Nsukka',
              tribe: 'Igbo',
              religion: 'Christianity',
              emergency_contact: 'Jane Doe',
              emergency_phone: '+234 801 234 5679',
              is_pwd: false,
              is_international_student: false,
              status: 'active',
              is_email_verified: true,
              is_phone_verified: true,
              created_at: '2021-09-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z'
            }
          }
          setProfile(mockProfile)
          setEditedProfile(mockProfile)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    setEditedProfile(profile)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProfile(profile)
  }

  const handleSave = async () => {
    if (!editedProfile) return

    try {
      // Here you would typically call an API to update the profile
      // For now, we'll just update the local state
      setProfile(editedProfile)
      setIsEditing(false)
      // You could add a success notification here
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (!editedProfile) return

    setEditedProfile({
      ...editedProfile,
      user: {
        ...editedProfile.user,
        [field]: value
      }
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentHeader title="Profile" subtitle="Manage your student profile" />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentHeader title="Profile" subtitle="Manage your student profile" />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Profile</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentHeader title="Profile" subtitle="Manage your student profile" />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
              <p className="text-gray-600">Unable to load your profile information.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentProfile = isEditing ? editedProfile : profile

  console.log("currentProfile: ", currentProfile)

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader title="Profile" subtitle="Manage your student profile" />
      <QuickActions />
      
      <div className="pt-40 px-4 sm:px-6 lg:px-8 pb-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
              <p className="text-gray-600">View and manage your personal information</p>
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={handleEdit} variant="outline">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Profile Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={currentProfile?.user.first_name || ''}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        placeholder="First Name"
                      />
                      <Input
                        value={currentProfile?.user.last_name || ''}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900">{profile.user.first_name} {profile.user.last_name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matric Number</label>
                  <p className="text-gray-900 font-mono">{profile.user.matric_number}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900">{profile.user.email}</p>
                    {profile.user.is_email_verified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  {isEditing ? (
                    <Input
                      value={currentProfile?.user.phone_number || ''}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      placeholder="Phone Number"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900">{profile.user.phone_number || 'Not specified'}</p>
                      {profile.user.is_phone_verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Badge className={getStatusColor(profile.user.status)}>
                    {profile.user.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={currentProfile?.user.date_of_birth || ''}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900">{formatDate(profile.user.date_of_birth || '')}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                  {isEditing ? (
                    <Input
                      value={currentProfile?.user.faculty || ''}
                      onChange={(e) => handleInputChange('faculty', e.target.value)}
                      placeholder="Faculty"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.user.faculty || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  {isEditing ? (
                    <Input
                      value={currentProfile?.user.department || ''}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="Department"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.user.department || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  {isEditing ? (
                    <Input
                      value={currentProfile?.user.level || ''}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      placeholder="Level"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.user.level || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  {isEditing ? (
                    <select
                      value={currentProfile?.user.gender || ''}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profile.user.gender || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  {isEditing ? (
                    <Input
                      value={currentProfile?.user.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Address"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.user.address || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State of Origin</label>
                  {isEditing ? (
                    <Input
                      value={currentProfile?.user.state_of_origin || ''}
                      onChange={(e) => handleInputChange('state_of_origin', e.target.value)}
                      placeholder="State of Origin"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.user.state_of_origin || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Local Government</label>
                  {isEditing ? (
                    <Input
                      value={currentProfile?.user.local_government || ''}
                      onChange={(e) => handleInputChange('local_government', e.target.value)}
                      placeholder="Local Government"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.user.local_government || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  {isEditing ? (
                    <Input
                      value={currentProfile?.user.nationality || ''}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      placeholder="Nationality"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.user.nationality || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tribe</label>
                  {isEditing ? (
                    <Input
                      value={currentProfile?.user.tribe || ''}
                      onChange={(e) => handleInputChange('tribe', e.target.value)}
                      placeholder="Tribe"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.user.tribe || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  {isEditing ? (
                    <Input
                      value={currentProfile?.user.religion || ''}
                      onChange={(e) => handleInputChange('religion', e.target.value)}
                      placeholder="Religion"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.user.religion || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  {isEditing ? (
                    <Input
                      value={currentProfile?.user.emergency_contact || ''}
                      onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                      placeholder="Emergency Contact Name"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.user.emergency_contact || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                  {isEditing ? (
                    <Input
                      value={currentProfile?.user.emergency_phone || ''}
                      onChange={(e) => handleInputChange('emergency_phone', e.target.value)}
                      placeholder="Emergency Contact Phone"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.user.emergency_phone || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Person with Disability</label>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <select
                        value={currentProfile?.user.is_pwd ? 'true' : 'false'}
                        onChange={(e) => handleInputChange('is_pwd', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    ) : (
                      <Badge variant={profile.user.is_pwd ? 'default' : 'secondary'}>
                        {profile.user.is_pwd ? 'Yes' : 'No'}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">International Student</label>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <select
                        value={currentProfile?.user.is_international_student ? 'true' : 'false'}
                        onChange={(e) => handleInputChange('is_international_student', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    ) : (
                      <Badge variant={profile.user.is_international_student ? 'default' : 'secondary'}>
                        {profile.user.is_international_student ? 'Yes' : 'No'}
                      </Badge>
                    )}
                  </div>
                </div>

                {profile.user.is_international_student && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                    {isEditing ? (
                      <Input
                        value={currentProfile?.user.passport_number || ''}
                        onChange={(e) => handleInputChange('passport_number', e.target.value)}
                        placeholder="Passport Number"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.user.passport_number || 'Not specified'}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIN Number</label>
                  {isEditing ? (
                    <Input
                      value={currentProfile?.user.nin_number || ''}
                      onChange={(e) => handleInputChange('nin_number', e.target.value)}
                      placeholder="NIN Number"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.user.nin_number || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                  <p className="text-gray-900">{formatDate(profile.user.created_at)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <p className="text-gray-900">{formatDate(profile.user.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
