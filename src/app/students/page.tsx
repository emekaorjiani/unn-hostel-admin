'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { 
  Users, 
  GraduationCap, 
  Building, 
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react'
import DashboardLayout from '../../components/layout/dashboard-layout'

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  matricNumber: string
  phoneNumber: string
  dateOfBirth: string
  gender: 'male' | 'female'
  faculty: string
  department: string
  level: string
  address: string
  stateOfOrigin: string
  localGovernment: string
  emergencyContact: string
  emergencyPhone: string
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
  isVerified: boolean
  isInternationalStudent: boolean
  isPWD: boolean
  hostelId?: string
  hostelName?: string
  roomNumber?: string
  bedNumber?: string
  createdAt: string
  updatedAt: string
}

interface StudentStats {
  totalStudents: number
  activeStudents: number
  pendingVerification: number
  verifiedStudents: number
  internationalStudents: number
  pwdStudents: number
  studentsByFaculty: Array<{
    faculty: string
    count: number
  }>
  studentsByLevel: Array<{
    level: string
    count: number
  }>
  studentsByStatus: Array<{
    status: string
    count: number
  }>
}

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [facultyFilter, setFacultyFilter] = useState<string>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')

  // Generate dummy students data
  const generateDummyStudents = (): Student[] => {
    const faculties = [
      'Faculty of Engineering',
      'Faculty of Sciences',
      'Faculty of Arts',
      'Faculty of Social Sciences',
      'Faculty of Education',
      'Faculty of Agriculture',
      'Faculty of Law',
      'Faculty of Medicine',
      'Faculty of Business Administration',
      'Faculty of Environmental Studies'
    ]

    const departments = [
      'Computer Engineering', 'Mechanical Engineering', 'Electrical Engineering',
      'Physics', 'Chemistry', 'Mathematics', 'Biology',
      'English', 'History', 'Philosophy',
      'Economics', 'Political Science', 'Sociology',
      'Educational Psychology', 'Curriculum Studies',
      'Crop Science', 'Animal Science', 'Soil Science',
      'Civil Law', 'Commercial Law', 'Criminal Law',
      'Anatomy', 'Physiology', 'Biochemistry',
      'Accounting', 'Marketing', 'Management',
      'Architecture', 'Urban Planning', 'Landscape Architecture'
    ]

    const levels = ['100', '200', '300', '400', '500']
    const statuses: Array<'active' | 'inactive' | 'suspended' | 'pending_verification'> = ['active', 'active', 'active', 'active', 'inactive', 'suspended', 'pending_verification']
    const genders: Array<'male' | 'female'> = ['male', 'female']
    const states = ['Lagos', 'Kano', 'Kaduna', 'Katsina', 'Oyo', 'Rivers', 'Bauchi', 'Jigawa', 'Enugu', 'Zamfara']

    const dummyStudents: Student[] = []

    for (let i = 1; i <= 2847; i++) {
      const faculty = faculties[Math.floor(Math.random() * faculties.length)]
      const department = departments[Math.floor(Math.random() * departments.length)]
      const level = levels[Math.floor(Math.random() * levels.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const gender = genders[Math.floor(Math.random() * genders.length)]
      const state = states[Math.floor(Math.random() * states.length)]
      
      const hasHostel = Math.random() > 0.3 // 70% have hostel allocation
      const hostelNames = ['Zik Hall', 'Mariere Hall', 'Alvan Ikoku Hall', 'Eni Njoku Hall', 'Mellanby Hall', 'Kuti Hall']
      
      dummyStudents.push({
        id: `STU${String(i).padStart(6, '0')}`,
        firstName: `Student${i}`,
        lastName: `Name${i}`,
        email: `student${i}@unn.edu.ng`,
        matricNumber: `2021/${String(i).padStart(6, '0')}`,
        phoneNumber: `+234${Math.floor(Math.random() * 900000000) + 100000000}`,
        dateOfBirth: new Date(2000 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        gender,
        faculty,
        department,
        level,
        address: `${Math.floor(Math.random() * 999) + 1} Street, ${state}`,
        stateOfOrigin: state,
        localGovernment: `LG${Math.floor(Math.random() * 20) + 1}`,
        emergencyContact: `Emergency${i}`,
        emergencyPhone: `+234${Math.floor(Math.random() * 900000000) + 100000000}`,
        status,
        isVerified: Math.random() > 0.1, // 90% verified
        isInternationalStudent: Math.random() > 0.95, // 5% international
        isPWD: Math.random() > 0.98, // 2% PWD
        hostelId: hasHostel ? `HOSTEL${Math.floor(Math.random() * 6) + 1}` : undefined,
        hostelName: hasHostel ? hostelNames[Math.floor(Math.random() * hostelNames.length)] : undefined,
        roomNumber: hasHostel ? `R${Math.floor(Math.random() * 200) + 1}` : undefined,
        bedNumber: hasHostel ? `B${Math.floor(Math.random() * 4) + 1}` : undefined,
        createdAt: new Date(2021, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        updatedAt: new Date().toISOString()
      })
    }

    return dummyStudents
  }

  // Generate dummy statistics
  const generateDummyStats = (studentsData: Student[]): StudentStats => {
    const activeStudents = studentsData.filter(s => s.status === 'active').length
    const pendingVerification = studentsData.filter(s => s.status === 'pending_verification').length
    const verifiedStudents = studentsData.filter(s => s.isVerified).length
    const internationalStudents = studentsData.filter(s => s.isInternationalStudent).length
    const pwdStudents = studentsData.filter(s => s.isPWD).length

    // Group by faculty
    const facultyCounts = studentsData.reduce((acc, student) => {
      acc[student.faculty] = (acc[student.faculty] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const studentsByFaculty = Object.entries(facultyCounts).map(([faculty, count]) => ({
      faculty,
      count
    })).sort((a, b) => b.count - a.count)

    // Group by level
    const levelCounts = studentsData.reduce((acc, student) => {
      acc[student.level] = (acc[student.level] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const studentsByLevel = Object.entries(levelCounts).map(([level, count]) => ({
      level,
      count
    })).sort((a, b) => a.level.localeCompare(b.level))

    // Group by status
    const statusCounts = studentsData.reduce((acc, student) => {
      acc[student.status] = (acc[student.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const studentsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }))

    return {
      totalStudents: studentsData.length,
      activeStudents,
      pendingVerification,
      verifiedStudents,
      internationalStudents,
      pwdStudents,
      studentsByFaculty,
      studentsByLevel,
      studentsByStatus
    }
  }

  // Fetch students data (now using dummy data)
  const fetchStudents = async () => {
    try {
      setError(null)
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Generate dummy data
      const studentsData = generateDummyStudents()
      const statsData = generateDummyStats(studentsData)
      
      setStudents(studentsData)
      setStats(statsData)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch students'
      setError(errorMessage)
      console.error('Students fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchStudents()
  }, [])

  // Filter students
  const filteredStudents = (Array.isArray(students) ? students : []).filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.matricNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter
    const matchesFaculty = facultyFilter === 'all' || student.faculty === facultyFilter
    const matchesLevel = levelFilter === 'all' || student.level === levelFilter

    return matchesSearch && matchesStatus && matchesFaculty && matchesLevel
  })

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'suspended': return 'bg-yellow-100 text-yellow-800'
      case 'pending_verification': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get unique faculties and levels for filters
  const uniqueFaculties = [...new Set(students.map(s => s.faculty))]
  const uniqueLevels = [...new Set(students.map(s => s.level))]

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading students...</p>
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
              <h3 className="text-lg font-semibold text-red-800">Error Loading Students</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <Button 
                onClick={fetchStudents} 
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-1">
              Manage student information and hostel allocations
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={fetchStudents}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              size="sm"
              onClick={() => router.push('/students/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents || 0}</div>
                <p className="text-xs text-gray-600">
                  All registered students
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeStudents || 0}</div>
                <p className="text-xs text-gray-600">
                  Currently active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                <GraduationCap className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingVerification || 0}</div>
                <p className="text-xs text-gray-600">
                  Awaiting verification
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hostel Allocated</CardTitle>
                <Building className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {students.filter(s => s.hostelId).length}
                </div>
                <p className="text-xs text-gray-600">
                  With hostel allocation
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, matric number, or email..."
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
                  <option value="suspended">Suspended</option>
                  <option value="pending_verification">Pending Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faculty
                </label>
                <select
                  value={facultyFilter}
                  onChange={(e) => setFacultyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Faculties</option>
                  {uniqueFaculties.map(faculty => (
                    <option key={faculty} value={faculty}>{faculty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Levels</option>
                  {uniqueLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
            <CardDescription>
              View and manage student information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Academic Info</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Hostel</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.slice(0, 50).map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-600">{student.matricNumber}</div>
                            <div className="text-xs text-gray-500 capitalize">{student.gender}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.faculty}</div>
                            <div className="text-sm text-gray-600">{student.department}</div>
                            <div className="text-xs text-gray-500">Level {student.level}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-3 w-3 mr-1" />
                              {student.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-3 w-3 mr-1" />
                              {student.phoneNumber}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {student.hostelName ? (
                            <div>
                              <div className="text-sm font-medium text-gray-900">{student.hostelName}</div>
                              <div className="text-xs text-gray-600">
                                Room {student.roomNumber}, Bed {student.bedNumber}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">Not allocated</div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(student.status)}>
                            {student.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/students/${student.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/students/${student.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => router.push(`/students/${student.id}/delete`)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredStudents.length > 50 && (
                  <div className="text-center py-4 text-gray-600">
                    Showing first 50 students. Use filters to narrow down results.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
