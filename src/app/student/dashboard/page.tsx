'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStatusColor, formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { studentService, StudentDashboardData } from '@/lib/studentService'
import QuickActions  from '@/components/ui/quick-actions'
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
  Flag,
  Map,
} from 'lucide-react'
import StudentHeader from '@/components/layout/student-header'

export default function StudentDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Mock student data
  const mockStudentData = {
    id: 'student-001',
    matric_number: '2021/123456',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@unn.edu.ng',
    phone_number: '+234 801 234 5678',
    faculty: 'Engineering',
    department: 'Computer Engineering',
    level: '300',
    gender: 'Male',
    date_of_birth: '2000-01-15',
    address: '123 Main Street, Nsukka, Enugu State',
    state_of_origin: 'Enugu',
    nationality: 'Nigerian',
    status: 'active' as const,
    is_email_verified: true,
    is_phone_verified: true,
    created_at: '2021-09-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await studentService.getDashboardData()
        setDashboardData(data)
        console.log("student: ", data)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
        // Fallback to mock data for development
        setDashboardData({
          profile: mockStudentData,
          applications: [],
          payments: [],
          maintenanceTickets: [],
          notifications: [],
          quickStats: {
            totalApplications: 0,
            approvedApplications: 0,
            pendingPayments: 0,
            activeTickets: 0,
            unreadNotifications: 0,
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const student = dashboardData?.profile || mockStudentData

  console.log("student Data: ", student)

  // Quick stats
  const quickStats = [
    {
      title: 'Total Applications',
      value: dashboardData?.quickStats?.totalApplications.toString() || '0',
      change: '0',
      changeType: 'neutral' as const,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Approved Applications',
      value: dashboardData?.quickStats?.approvedApplications.toString() || '0',
      change: '0',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Payments',
      value: dashboardData?.quickStats?.pendingPayments.toString() || '0',
      change: '0',
      changeType: 'warning' as const,
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Active Tickets',
      value: dashboardData?.quickStats?.activeTickets.toString() || '0',
      change: '0',
      changeType: 'negative' as const,
      icon: Wrench,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  // Recent activities from real data
  const recentActivities = [
    ...(dashboardData?.payments?.slice(0, 2).map(payment => ({
      id: payment.id,
      action: `${payment.type} payment ${payment.status}`,
      description: `${payment.type} payment via ${payment.gateway}`,
      amount: payment.amount,
      date: payment.date,
      type: 'payment' as const,
      status: payment.status
    })) || []),
    ...(dashboardData?.applications.slice(0, 2).map(app => ({
      id: app.id,
      action: `Application ${app.status}`,
      description: `Hostel application for ${app.hostel_name}`,
      date: app.application_date,
      type: 'application' as const,
      status: app.status
    })) || []),
    ...(dashboardData?.maintenanceTickets.slice(0, 2).map(ticket => ({
      id: ticket.id,
      action: `Maintenance ${ticket.status}`,
      description: ticket.issue,
      date: ticket.created_at,
      type: 'maintenance' as const,
      status: ticket.status
    })) || [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4)

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

  // Show loading state while data is being fetched
  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state if there's an error and no data
  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <AlertTriangle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StudentHeader 
        title="Student Portal"
        subtitle="UNN Hostel Management System"
      />

      <QuickActions />

      <div className="pt-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, {student?.first_name}
                </h2>
                <p className="text-green-100 text-lg mb-4">
                  Here's what's happening with your hostel accommodation
                </p>
                                                    <div className="flex items-center space-x-6 text-sm">
                     <div className="flex items-center space-x-2">
                       <Building2 className="h-4 w-4" />
                       <span>{student?.faculty || 'Not Assigned'} - {student?.department || 'Not Assigned'}</span>
                     </div>
                     <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Level {student?.level || 'Not Assigned'}</span>
                    </div>
                     <div className="flex items-center space-x-2">
                       <User className="h-4 w-4" />
                       <span>Matric: {student?.matric_number}</span>
                     </div>
                   </div>
              </div>
              <div className="hidden lg:block">
                <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {getInitials(student?.first_name, student?.last_name)}
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
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-1">
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
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                            {'amount' in activity && activity.amount && ` - ${formatCurrency(activity.amount)}`}
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
                    {dashboardData?.quickStats.unreadNotifications || 0} new
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.notifications.slice(0, 3).map((notification, index) => (
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
                        <p className="text-xs text-gray-400 mt-1">{formatDate(notification.created_at)}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  )) || (
                    <div className="text-center py-4 text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Applications */}
          {dashboardData?.applications && dashboardData.applications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Current Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.applications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{application.hostel_name}</h4>
                        <p className="text-sm text-gray-600">
                          {application.room_type} Room • {formatCurrency(application.amount)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Applied on {formatDate(application.application_date)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            application.status === 'approved' ? 'default' :
                            application.status === 'pending' ? 'secondary' :
                            application.status === 'rejected' ? 'destructive' : 'outline'
                          }
                        >
                          {application.status}
                        </Badge>
                        {application.payment_status === 'pending' && (
                          <Badge variant="outline" className="text-orange-600">
                            Payment Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Student Information */}
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center">
                 <User className="h-5 w-5 mr-2" />
                 Student Information
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="text-center p-4 bg-orange-50 rounded-lg">
                   <GraduationCap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                   <p className="text-lg font-semibold text-gray-900">{student?.faculty || 'Not Assigned'}</p>
                   <p className="text-sm text-gray-600">Faculty</p>
                 </div>
                 
                 <div className="text-center p-4 bg-yellow-50 rounded-lg">
                   <BookOpen className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                   <p className="text-lg font-semibold text-gray-900">{student?.department || 'Not Assigned'}</p>
                   <p className="text-sm text-gray-600">Department</p>
                 </div>
                 
                 <div className="text-center p-4 bg-blue-50 rounded-lg">
                   <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                   <p className="text-lg font-semibold text-gray-900">{student?.state_of_origin || 'Not Assigned'}</p>
                   <p className="text-sm text-gray-600">State of Origin</p>
                 </div>
                 
                 <div className="text-center p-4 bg-purple-50 rounded-lg">
                   <Map className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                   <p className="text-lg font-semibold text-gray-900">{student?.nationality || 'Nigerian'}</p>
                   <p className="text-sm text-gray-600">Nationality</p>
                 </div>
               </div>
             </CardContent>
           </Card>


        </div>
      </div>
    </div>
  )
}
