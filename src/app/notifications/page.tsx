'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { 
  Bell, Mail, MessageSquare, Smartphone, Search, Filter, Plus, Eye, Trash2, RefreshCw, 
  CheckCircle, Clock, AlertTriangle, Users, Settings
} from 'lucide-react'
import DashboardLayout from '../../components/layout/dashboard-layout'
import { apiClient } from '../../lib/api'
import { safeLocalStorage } from '../../lib/utils'

interface Notification {
  id: string
  title: string
  message: string
  type: 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp'
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'cancelled'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  category: string
  recipientId: string
  recipientName: string
  recipientEmail: string
  scheduledAt?: string
  sentAt?: string
  deliveredAt?: string
  readAt?: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

interface NotificationStats {
  total: number
  unread: number
  sent: number
  failed: number
  byStatus: Record<string, number>
  byType: Record<string, number>
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const fetchNotificationsData = async () => {
    try {
      setError(null)
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Try to fetch notifications from real backend
      let notificationsData: Notification[] = []
      try {
        const notificationsRes = await apiClient.get('/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        })
        // Ensure notificationsData is always an array
        const responseData = notificationsRes.data
        if (Array.isArray(responseData)) {
          notificationsData = responseData
        } else if (responseData?.notifications && Array.isArray(responseData.notifications)) {
          notificationsData = responseData.notifications
        } else if (responseData?.data && Array.isArray(responseData.data)) {
          notificationsData = responseData.data
        } else {
          notificationsData = []
        }
      } catch (notificationsError) {
        console.warn('Notifications endpoint not available, using fallback data')
        // Provide fallback notifications data
        notificationsData = [
          {
            id: 'notification-1',
            title: 'Application Approved',
            message: 'Your hostel application for Zik Hall has been approved. Please complete your payment within 48 hours.',
            type: 'email' as const,
            status: 'delivered' as const,
            priority: 'high' as const,
            category: 'application',
            recipientId: 'student-1',
            recipientName: 'John Doe',
            recipientEmail: 'john.doe@unn.edu.ng',
            sentAt: '2024-08-15T10:00:00Z',
            deliveredAt: '2024-08-15T10:01:00Z',
            isRead: true,
            createdAt: '2024-08-15T09:55:00Z',
            updatedAt: '2024-08-15T10:01:00Z'
          },
          {
            id: 'notification-2',
            title: 'Payment Reminder',
            message: 'This is a reminder that your hostel payment is due in 24 hours. Please complete your payment to avoid any delays.',
            type: 'sms' as const,
            status: 'sent' as const,
            priority: 'normal' as const,
            category: 'payment',
            recipientId: 'student-2',
            recipientName: 'Jane Smith',
            recipientEmail: 'jane.smith@unn.edu.ng',
            sentAt: '2024-08-16T09:00:00Z',
            isRead: false,
            createdAt: '2024-08-16T08:55:00Z',
            updatedAt: '2024-08-16T09:00:00Z'
          },
          {
            id: 'notification-3',
            title: 'Maintenance Update',
            message: 'The maintenance request for your room has been assigned to a technician. They will visit tomorrow between 9 AM and 12 PM.',
            type: 'push' as const,
            status: 'pending' as const,
            priority: 'low' as const,
            category: 'maintenance',
            recipientId: 'student-3',
            recipientName: 'Mike Johnson',
            recipientEmail: 'mike.johnson@unn.edu.ng',
            scheduledAt: '2024-08-17T08:00:00Z',
            isRead: false,
            createdAt: '2024-08-16T15:00:00Z',
            updatedAt: '2024-08-16T15:00:00Z'
          },
          {
            id: 'notification-4',
            title: 'Room Selection Reminder',
            message: 'Room selection for the 2024/2025 academic year will begin tomorrow at 9 AM. Please ensure you have completed your application.',
            type: 'in_app' as const,
            status: 'read' as const,
            priority: 'high' as const,
            category: 'room_selection',
            recipientId: 'student-4',
            recipientName: 'Sarah Brown',
            recipientEmail: 'sarah.brown@unn.edu.ng',
            sentAt: '2024-08-14T14:00:00Z',
            deliveredAt: '2024-08-14T14:01:00Z',
            readAt: '2024-08-14T14:05:00Z',
            isRead: true,
            createdAt: '2024-08-14T13:55:00Z',
            updatedAt: '2024-08-14T14:05:00Z'
          },
          {
            id: 'notification-5',
            title: 'System Maintenance',
            message: 'The hostel management system will be under maintenance from 2 AM to 4 AM tonight. Some features may be temporarily unavailable.',
            type: 'email' as const,
            status: 'failed' as const,
            priority: 'normal' as const,
            category: 'system',
            recipientId: 'student-5',
            recipientName: 'David Wilson',
            recipientEmail: 'david.wilson@unn.edu.ng',
            isRead: false,
            createdAt: '2024-08-15T20:00:00Z',
            updatedAt: '2024-08-15T20:05:00Z'
          }
        ]
      }

      // Try to fetch notification statistics from real backend
      let statsData: NotificationStats | null = null
      try {
        const statsRes = await apiClient.get('/notifications/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
        statsData = statsRes.data || null
      } catch (statsError) {
        console.warn('Notification stats endpoint not available, using fallback data')
        // Calculate stats from fallback data
        const total = notificationsData.length
        const unread = Array.isArray(notificationsData) ? notificationsData.filter(n => !n.isRead).length : 0
        const sent = Array.isArray(notificationsData) ? notificationsData.filter(n => n.status === 'sent' || n.status === 'delivered' || n.status === 'read').length : 0
        const failed = Array.isArray(notificationsData) ? notificationsData.filter(n => n.status === 'failed').length : 0

        const byStatus = Array.isArray(notificationsData) ? notificationsData.reduce((acc: Record<string, number>, notification) => {
          acc[notification.status] = (acc[notification.status] || 0) + 1
          return acc
        }, {}) : {}

        const byType = Array.isArray(notificationsData) ? notificationsData.reduce((acc: Record<string, number>, notification) => {
          acc[notification.type] = (acc[notification.type] || 0) + 1
          return acc
        }, {}) : {}

        statsData = {
          total,
          unread,
          sent,
          failed,
          byStatus,
          byType
        }
      }
      
      setNotifications(notificationsData)
      setStats(statsData)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications data'
      setError(errorMessage)
      console.error('Notifications fetch error:', err)
      
      // Set fallback data even on error
      setNotifications([])
      setStats({
        total: 0,
        unread: 0,
        sent: 0,
        failed: 0,
        byStatus: {},
        byType: {}
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotificationsData()
  }, [])

  const filteredNotifications = (Array.isArray(notifications) ? notifications : []).filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter
    const matchesType = typeFilter === 'all' || notification.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-blue-100 text-blue-800'
      case 'read': return 'bg-purple-100 text-purple-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />
      case 'sms': return <MessageSquare className="h-4 w-4" />
      case 'push': return <Bell className="h-4 w-4" />
      case 'whatsapp': return <Smartphone className="h-4 w-4" />
      case 'in_app': return <Bell className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading notifications data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchNotificationsData} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Manage and track notification delivery</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Send Notification
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats.unread || 0} unread
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sent</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sent || 0}</div>
              <p className="text-xs text-muted-foreground">
                Successfully delivered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.failed || 0}</div>
              <p className="text-xs text-muted-foreground">
                Delivery failed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total > 0 ? Math.round(((stats.sent || 0) / stats.total) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Delivery success rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="read">Read</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="push">Push</option>
            <option value="in_app">In-App</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
      </div>

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            View and manage notification history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">No notifications match your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Notification</th>
                    <th className="text-left py-3 px-4 font-medium">Recipient</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Priority</th>
                    <th className="text-left py-3 px-4 font-medium">Sent</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map(notification => (
                    <tr key={notification.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-gray-500">{notification.message.substring(0, 50)}...</div>
                          <div className="text-xs text-gray-400">{notification.category}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{notification.recipientName}</div>
                          <div className="text-sm text-gray-500">{notification.recipientEmail}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          {getTypeIcon(notification.type)}
                          <span className="capitalize">{notification.type.replace('_', ' ')}</span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(notification.status)}>
                          <span className="capitalize">{notification.status}</span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getPriorityColor(notification.priority)}>
                          <span className="capitalize">{notification.priority}</span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {notification.sentAt ? (
                            <div>
                              <div>{new Date(notification.sentAt).toLocaleDateString()}</div>
                              <div className="text-gray-500">
                                {new Date(notification.sentAt).toLocaleTimeString()}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">Not sent</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
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
    </DashboardLayout>
  )
}


