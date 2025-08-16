'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import { 
  CreditCard, 
  DollarSign, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Plus,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Wallet
} from 'lucide-react'
import { studentService, StudentPayment } from '@/lib/studentService'

interface PaymentSummary {
  totalPaid: number
  totalOutstanding: number
  totalOverdue: number
  nextPaymentDue: number
  nextDueDate: string
  paymentHistory: StudentPayment[]
}

export default function StudentPaymentsPage() {
  const router = useRouter()
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<StudentPayment | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true)
        const payments = await studentService.getPayments()
        
        // Calculate payment summary
        const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
        const totalOutstanding = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
        const totalOverdue = payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0)
        
        // Find next payment due (first pending payment)
        const nextPayment = payments.find(p => p.status === 'pending')
        const nextPaymentDue = nextPayment?.amount || 0
        const nextDueDate = nextPayment?.date || ''

        setPaymentSummary({
          totalPaid,
          totalOutstanding,
          totalOverdue,
          nextPaymentDue,
          nextDueDate,
          paymentHistory: payments
        })
      } catch (error) {
        console.error('Error fetching payments:', error)
        // Fallback to empty summary if API fails
        setPaymentSummary({
          totalPaid: 0,
          totalOutstanding: 0,
          totalOverdue: 0,
          nextPaymentDue: 0,
          nextDueDate: '',
          paymentHistory: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  // Filter payments based on status and search query
  const filteredPayments = paymentSummary?.paymentHistory.filter(payment => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.type.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  }) || []

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'failed':
        return <AlertCircle className="h-4 w-4" />
      case 'refunded':
        return <Download className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                  My Payments
                </h1>
                <p className="text-xs text-gray-600">Payment history and management</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowPaymentModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Make Payment
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Payment Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Paid</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(paymentSummary?.totalPaid || 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Outstanding</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {formatCurrency(paymentSummary?.totalOutstanding || 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-900">
                      {formatCurrency(paymentSummary?.totalOverdue || 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Next Due</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatCurrency(paymentSummary?.nextPaymentDue || 0)}
                    </p>
                    {paymentSummary?.nextDueDate && (
                      <p className="text-xs text-blue-600">
                        Due: {new Date(paymentSummary.nextDueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search payments by reference or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'pending', 'completed', 'failed', 'refunded'].map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments List */}
          {filteredPayments.length > 0 ? (
            <div className="grid gap-6">
              {filteredPayments.map((payment) => (
                <Card key={payment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <CreditCard className="h-5 w-5 text-gray-500" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {payment.type.replace('_', ' ').toUpperCase()} Payment
                          </h3>
                          <Badge className={getStatusColor(payment.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(payment.status)}
                              <span className="capitalize">{payment.status}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Date: {new Date(payment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Amount: {formatCurrency(payment.amount)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Gateway: {payment.gateway}</span>
                          </div>
                        </div>

                        {/* Reference */}
                        <div className="mt-3">
                          <Badge variant="outline" className="text-xs">
                            Ref: {payment.reference}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {payment.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterStatus !== 'all'
                    ? `No payments match your search criteria.`
                    : "You haven't made any payments yet."
                  }
                </p>
                <Button 
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Make Your First Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payment Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {paymentSummary?.paymentHistory.filter(p => p.status === 'completed').length || 0}
                  </div>
                  <div className="text-sm text-green-600">Successful Payments</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {paymentSummary?.paymentHistory.filter(p => p.status === 'pending').length || 0}
                  </div>
                  <div className="text-sm text-yellow-600">Pending Payments</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {paymentSummary?.paymentHistory.filter(p => p.status === 'failed').length || 0}
                  </div>
                  <div className="text-sm text-red-600">Failed Payments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
