'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  RefreshCw,
  Calendar,
  User,
  Building
} from 'lucide-react'
import DashboardLayout from '../../components/layout/dashboard-layout'
import { dashboardService } from '../../lib/dashboardService'
import { safeLocalStorage } from '../../lib/utils'

interface Payment {
  id: string
  reference: string
  studentId: string
  studentName: string
  matricNumber: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'successful' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded'
  gateway: 'paystack' | 'flutterwave' | 'remita' | 'internal'
  paymentMethod: string
  description: string
  metadata: {
    applicationId?: string
    hostelName?: string
    academicYear?: string
    semester?: string
  }
  gatewayReference?: string
  gatewayResponse?: any
  redirectUrl?: string
  createdAt: string
  updatedAt: string
  paidAt?: string
}

interface PaymentStats {
  totalPayments: number
  successfulPayments: number
  failedPayments: number
  pendingPayments: number
  totalRevenue: number
  successRate: number
  revenueByGateway: Array<{
    gateway: string
    revenue: number
    count: number
  }>
  revenueByMonth: Array<{
    month: string
    revenue: number
    count: number
  }>
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [gatewayFilter, setGatewayFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')

  // Fetch payments data from dashboard service
  const fetchPayments = async () => {
    try {
      setError(null)
      setLoading(true)

      // Fetch payments using dashboard service
      const response = await dashboardService.getPayments({
        page: 1,
        limit: 50
      })

      // Transform API data to match frontend interface
      const transformedPayments: Payment[] = response.payments.map(payment => ({
        id: payment.id,
        reference: payment.reference,
        studentId: payment.student_id,
        studentName: `${payment.student.first_name} ${payment.student.last_name}`,
        matricNumber: payment.student.matric_number,
        amount: parseFloat(payment.amount),
        currency: payment.currency,
        status: payment.status as 'pending' | 'processing' | 'successful' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded',
        gateway: payment.payment_gateway as 'paystack' | 'flutterwave' | 'remita' | 'internal',
        paymentMethod: payment.payment_method,
        description: payment.description,
        metadata: {
          applicationId: payment.application_id || undefined,
          hostelName: undefined, // Not available in API response
          academicYear: undefined, // Not available in API response
          semester: undefined // Not available in API response
        },
        gatewayReference: payment.transaction_id,
        gatewayResponse: payment.gateway_response,
        redirectUrl: undefined, // Not available in API response
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
        paidAt: payment.payment_date
      }))

      setPayments(transformedPayments)

      // Transform statistics
      const transformedStats: PaymentStats = {
        totalPayments: response.statistics.total_payments,
        successfulPayments: response.statistics.successful_payments,
        failedPayments: response.statistics.failed_payments,
        pendingPayments: response.statistics.pending_payments,
        totalRevenue: parseFloat(response.statistics.total_revenue),
        successRate: response.statistics.successful_payments > 0 
          ? (response.statistics.successful_payments / response.statistics.total_payments) * 100 
          : 0,
        revenueByGateway: [], // Not available in API response
        revenueByMonth: [] // Not available in API response
      }

      setStats(transformedStats)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payments'
      setError(errorMessage)
      console.error('Payments fetch error:', err)
      
      // Set fallback data even on error
      setPayments([])
      setStats({
        totalPayments: 0,
        successfulPayments: 0,
        failedPayments: 0,
        pendingPayments: 0,
        totalRevenue: 0,
        successRate: 0,
        revenueByGateway: [],
        revenueByMonth: []
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchPayments()
  }, [])

  // Filter payments
  const filteredPayments = (Array.isArray(payments) ? payments : []).filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.matricNumber.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesGateway = gatewayFilter === 'all' || payment.gateway === gatewayFilter

    return matchesSearch && matchesStatus && matchesGateway
  })

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      case 'refunded': return 'bg-purple-100 text-purple-800'
      case 'partially_refunded': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading payments...</p>
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
            <RefreshCw className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Payments</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <Button 
                onClick={fetchPayments} 
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
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">
              Track and manage payment transactions
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={fetchPayments}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Payment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                <p className="text-xs text-gray-600">
                  All time revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.successfulPayments}</div>
                <p className="text-xs text-gray-600">
                  {stats.successRate.toFixed(1)}% success rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <TrendingDown className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingPayments}</div>
                <p className="text-xs text-gray-600">
                  Awaiting confirmation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.failedPayments}</div>
                <p className="text-xs text-gray-600">
                  Failed transactions
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by student name, reference, or matric number..."
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
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="successful">Successful</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="partially_refunded">Partially Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Gateway
                </label>
                <select
                  value={gatewayFilter}
                  onChange={(e) => setGatewayFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Gateways</option>
                  <option value="paystack">Paystack</option>
                  <option value="flutterwave">Flutterwave</option>
                  <option value="remita">Remita</option>
                  <option value="internal">Internal</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Transactions ({filteredPayments.length})</CardTitle>
            <CardDescription>
              View and manage payment transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPayments.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Payment Details</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Gateway</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{payment.studentName}</div>
                            <div className="text-sm text-gray-600">{payment.matricNumber}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.reference}</div>
                            <div className="text-sm text-gray-600">{payment.description}</div>
                            {payment.metadata.hostelName && (
                              <div className="text-xs text-gray-500">
                                <Building className="h-3 w-3 inline mr-1" />
                                {payment.metadata.hostelName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">
                            {formatCurrency(payment.amount, payment.currency)}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {payment.paymentMethod}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="capitalize">
                            {payment.gateway}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(payment.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {payment.status === 'pending' && (
                              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                                Verify
                              </Button>
                            )}
                            {payment.status === 'successful' && (
                              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                                Refund
                              </Button>
                            )}
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
      </div>
    </DashboardLayout>
  )
}
