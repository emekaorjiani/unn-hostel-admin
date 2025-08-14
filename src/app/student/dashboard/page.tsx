'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStatusColor, formatCurrency, formatDate, getInitials } from '@/lib/utils'
import DashboardLayout from '@/components/layout/dashboard-layout'
import {
  User,
  Building2,
  FileText,
  CreditCard,
  Calendar,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Home,
  GraduationCap,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Download,
  RefreshCw,
  Eye,
  Plus,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ChevronRight,
  Star,
  Award,
  Target,
  TrendingUp,
  TrendingDown,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Zap,
  Heart,
  Bookmark,
  Share2,
  ExternalLink,
  Clock3,
  CalendarDays,
  FileCheck,
  Receipt,
  Wallet,
  PiggyBank,
  CreditCard as CreditCardIcon,
  Banknote,
  QrCode,
  Smartphone,
  Wifi,
  Wrench,
  ShieldCheck,
  Users2,
  MessageSquare,
  HelpCircle,
  Info,
  CheckSquare,
  Square,
  Circle,
  Minus,
  Plus as PlusIcon,
  LogOut,
} from 'lucide-react'

export default function StudentDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [studentData, setStudentData] = useState<any>(null)

  // Mock student data
  const mockStudentData = {
    id: 'student-001',
    matricNumber: '2021/123456',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@unn.edu.ng',
    phone: '+234 801 234 5678',
    department: 'Computer Science',
    level: '300',
    gender: 'male',
    dateOfBirth: '2000-01-15',
    address: 'Room A101, Zik Hall, UNN Campus',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Mother',
      phone: '+234 802 345 6789',
      email: 'jane.doe@email.com'
    },
    academicInfo: {
      cgpa: 4.2,
      totalCredits: 72,
      currentSemester: 'Second Semester 2023/2024',
      expectedGraduation: '2025'
    },
    hostelInfo: {
      hostelName: 'Zik Hall',
      roomNumber: 'A101',
      bedNumber: '1',
      roomType: 'single',
      checkInDate: '2023-09-15',
      checkOutDate: '2024-06-30',
      monthlyRent: 50000,
      deposit: 25000
    },
    applications: [
      {
        id: 'app-001',
        hostelName: 'Zik Hall',
        roomType: 'single',
        status: 'approved',
        applicationDate: '2024-01-15',
        amount: 50000,
        paymentStatus: 'paid'
      }
    ],
    payments: [
      {
        id: 'pay-001',
        type: 'rent',
        amount: 50000,
        status: 'completed',
        date: '2024-01-15',
        method: 'card',
        reference: 'TXN123456789'
      },
      {
        id: 'pay-002',
        type: 'deposit',
        amount: 25000,
        status: 'completed',
        date: '2023-09-15',
        method: 'bank_transfer',
        reference: 'TXN987654321'
      }
    ],
    maintenanceTickets: [
      {
        id: 'ticket-001',
        issue: 'Electrical problem in room',
        status: 'resolved',
        priority: 'medium',
        createdAt: '2024-01-10',
        resolvedAt: '2024-01-12'
      }
    ],
    notifications: [
      {
        id: 'notif-001',
        title: 'Payment Due',
        message: 'Your hostel rent payment is due in 5 days',
        type: 'warning',
        read: false,
        createdAt: '2024-01-20'
      },
      {
        id: 'notif-002',
        title: 'Maintenance Update',
        message: 'Your maintenance request has been resolved',
        type: 'success',
        read: true,
        createdAt: '2024-01-12'
      }
    ]
  }

  const student = studentData || mockStudentData

  // Quick stats
  const quickStats = [
    {
      title: 'Current GPA',
      value: student.academicInfo.cgpa.toFixed(1),
      change: '+0.2',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Hostel Balance',
      value: formatCurrency(0),
      change: '₦0',
      changeType: 'neutral' as const,
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Tickets',
      value: student.maintenanceTickets.filter((t: any) => t.status === 'pending').length.toString(),
      change: '-1',
      changeType: 'positive' as const,
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Unread Notifications',
      value: student.notifications.filter((n: any) => !n.read).length.toString(),
      change: '+2',
      changeType: 'negative' as const,
      icon: Bell,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  // Quick actions
  const quickActions = [
    {
      title: 'Apply for Hostel',
      description: 'Submit a new hostel application',
      icon: Plus,
      color: 'bg-blue-500',
      href: '/student/applications/new',
      available: true,
    },
    {
      title: 'Make Payment',
      description: 'Pay hostel fees and deposits',
      icon: CreditCard,
      color: 'bg-green-500',
      href: '/student/payments',
      available: true,
    },
    {
      title: 'Report Issue',
      description: 'Submit maintenance request',
      icon: Wrench,
      color: 'bg-orange-500',
      href: '/student/maintenance',
      available: true,
    },
    {
      title: 'View Documents',
      description: 'Access your hostel documents',
      icon: FileText,
      color: 'bg-purple-500',
      href: '/student/documents',
      available: true,
    },
  ]

  // Recent activities
  const recentActivities = [
    {
      id: '1',
      action: 'Payment completed',
      description: 'Hostel rent payment for January 2024',
      amount: 50000,
      date: '2024-01-15',
      type: 'payment',
      status: 'completed'
    },
    {
      id: '2',
      action: 'Application approved',
      description: 'Hostel application for Zik Hall approved',
      date: '2024-01-14',
      type: 'application',
      status: 'approved'
    },
    {
      id: '3',
      action: 'Maintenance resolved',
      description: 'Electrical issue in room resolved',
      date: '2024-01-12',
      type: 'maintenance',
      status: 'resolved'
    },
    {
      id: '4',
      action: 'Document uploaded',
      description: 'Medical certificate uploaded',
      date: '2024-01-10',
      type: 'document',
      status: 'completed'
    }
  ]

  // Upcoming events
  const upcomingEvents = [
    {
      id: '1',
      title: 'Payment Due',
      description: 'Hostel rent payment deadline',
      date: '2024-02-15',
      type: 'payment',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Room Inspection',
      description: 'Scheduled room inspection by hostel management',
      date: '2024-01-25',
      type: 'inspection',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Hostel Meeting',
      description: 'Monthly hostel residents meeting',
      date: '2024-01-30',
      type: 'meeting',
      priority: 'low'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                  Student Portal
                </h1>
                <p className="text-xs text-gray-600">UNN Hostel Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/student/settings')}
                className='cursor-pointer'
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, {student.firstName}
                </h2>
                <p className="text-green-100 text-lg mb-4">
                  Here's what's happening with your hostel accommodation
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>{student.hostelInfo.hostelName} - Room {student.hostelInfo.roomNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>{student.department} - Level {student.level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Matric: {student.matricNumber}</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {getInitials(student.firstName, student.lastName)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-10 w-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="flex items-center">
                      {stat.changeType === 'positive' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : stat.changeType === 'negative' ? (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Quick Actions
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-4 rounded-lg transition-colors cursor-pointer ${
                        action.available 
                          ? 'bg-gray-50 hover:bg-gray-100' 
                          : 'bg-gray-100 opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => action.available && (window.location.href = action.href)}
                    >
                      <div className={`h-10 w-10 ${action.color} rounded-lg flex items-center justify-center mr-4`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{action.title}</h4>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Activity
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            {activity.type === 'payment' && <CreditCard className="h-4 w-4 text-blue-600" />}
                            {activity.type === 'application' && <FileText className="h-4 w-4 text-green-600" />}
                            {activity.type === 'maintenance' && <Wrench className="h-4 w-4 text-orange-600" />}
                            {activity.type === 'document' && <FileCheck className="h-4 w-4 text-purple-600" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                            {activity.amount && ` - ${formatCurrency(activity.amount)}`}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(activity.date)}
                          </p>
                        </div>
                        <Badge variant={activity.status === 'completed' || activity.status === 'approved' || activity.status === 'resolved' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        event.priority === 'high' ? 'bg-red-500' :
                        event.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(event.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </div>
                  <Badge variant="secondary">
                    {student.notifications.filter((n: any) => !n.read).length} new
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.notifications.slice(0, 3).map((notification: any, index: number) => (
                    <div key={notification.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(notification.createdAt)}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hostel Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Hostel Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-900">{student.hostelInfo.hostelName}</p>
                  <p className="text-sm text-gray-600">Current Hostel</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Home className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-900">Room {student.hostelInfo.roomNumber}</p>
                  <p className="text-sm text-gray-600">{student.hostelInfo.roomType} Room</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-900">{formatDate(student.hostelInfo.checkInDate)}</p>
                  <p className="text-sm text-gray-600">Check-in Date</p>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <CreditCard className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(student.hostelInfo.monthlyRent)}</p>
                  <p className="text-sm text-gray-600">Monthly Rent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
