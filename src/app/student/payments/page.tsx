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

interface Payment {
  id: string
  amount: number
  type: 'hostel_fee' | 'maintenance_fee' | 'security_deposit' | 'late_fee' | 'other'
  status: 'paid' | 'pending' | 'overdue' | 'failed'
  dueDate: string
  paidDate?: string
  description: string
  reference: string
  method?: 'card' | 'bank_transfer' | 'cash' | 'mobile_money'
  receiptUrl?: string
}

interface PaymentSummary {
  totalPaid: number
  totalOutstanding: number
  totalOverdue: number
  nextPaymentDue: number
  nextDueDate: string
  paymentHistory: Payment[]
}

export default function StudentPaymentsPage() {
  const router = useRouter()
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Generate dummy payment data
  const generateDummyPayments = (): PaymentSummary => {
    const paymentTypes: Array<'hostel_fee' | 'maintenance_fee' | 'security_deposit' | 'late_fee' | 'other'> = [
      'hostel_fee', 'maintenance_fee', 'security_deposit', 'late_fee', 'other'
    ]
    
    const statuses: Array<'paid' | 'pending' | 'overdue' | 'failed'> = [
      'paid', 'paid', 'paid', 'paid', 'paid', 'pending', 'overdue', 'failed'
    ]
    
    const methods: Array<'card' | 'bank_transfer' | 'cash' | 'mobile_money'> = [
      'card', 'bank_transfer', 'cash', 'mobile_money'
    ]

    const payments: Payment[] = []
    
    // Generate past payments (paid)
    for (let i = 1; i <= 8; i++) {
      const type = paymentTypes[Math.floor(Math.random() * paymentTypes.length)]
      const amount = type === 'hostel_fee' ? 25000 : 
                    type === 'maintenance_fee' ? 5000 :
                    type === 'security_deposit' ? 15000 :
                    type === 'late_fee' ? 2000 : 3000
      
      const dueDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      const paidDate = new Date(dueDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      
      payments.push({
        id: `PAY${String(i).padStart(6, '0')}`,
        amount,
        type,
        status: 'paid',
        dueDate: dueDate.toISOString().split('T')[0],
        paidDate: paidDate.toISOString().split('T')[0],
        description: `${type.replace('_', ' ').toUpperCase()} - ${i === 1 ? 'Zik Hall' : 'Hostel Accommodation'}`,
        reference: `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        method: methods[Math.floor(Math.random() * methods.length)],
        receiptUrl: `/receipts/receipt-${i}.pdf`
      })
    }

    // Generate current payments (pending/overdue)
    const currentPayments: Payment[] = [
      {
        id: 'PAY000009',
        amount: 25000,
        type: 'hostel_fee',
        status: 'pending',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'HOSTEL FEE - Zik Hall (January 2025)',
        reference: 'HOSTEL-JAN-2025'
      },
      {
        id: 'PAY000010',
        amount: 5000,
        type: 'maintenance_fee',
        status: 'overdue',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'MAINTENANCE FEE - Room Repairs',
        reference: 'MAINT-ROOM-001'
      },
      {
        id: 'PAY000011',
        amount: 2000,
        type: 'late_fee',
        status: 'overdue',
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'LATE FEE - Previous Payment Delay',
        reference: 'LATE-001'
      }
    ]

    const allPayments = [...payments, ...currentPayments]
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
    const totalOutstanding = currentPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
    const totalOverdue = currentPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)
    const nextPaymentDue = currentPayments.find(p => p.status === 'pending')?.amount || 0
    const nextDueDate = currentPayments.find(p => p.status === 'pending')?.dueDate || ''

    return {
      totalPaid,
      totalOutstanding,
      totalOverdue,
      nextPaymentDue,
      nextDueDate,
      paymentHistory: allPayments
    }
  }

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setPaymentSummary(generateDummyPayments())
      setLoading(false)
    }, 800)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'failed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hostel_fee': return 'bg-blue-100 text-blue-800'
      case 'maintenance_fee': return 'bg-purple-100 text-purple-800'
      case 'security_deposit': return 'bg-indigo-100 text-indigo-800'
      case 'late_fee': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    return type.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const filteredPayments = paymentSummary?.paymentHistory.filter(payment => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    const matchesSearch = payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  }) || []

  const handleMakePayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowPaymentModal(true)
  }

  const handlePaymentSubmit = async () => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setShowPaymentModal(false)
    setSelectedPayment(null)
    // Refresh payments
    setPaymentSummary(generateDummyPayments())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
              <p className="text-gray-600">Manage your hostel payments and view payment history</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₦{paymentSummary?.totalPaid.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Successfully processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">₦{paymentSummary?.totalOutstanding.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Pending payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₦{paymentSummary?.totalOverdue.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Past due date</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₦{paymentSummary?.nextPaymentDue.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Due {paymentSummary?.nextDueDate}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => router.push('/student/applications/new')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Apply for Hostel
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Statement
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Receipts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>View and manage all your payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <Input
                  placeholder="Search by description or reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardContent className="p-0">
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
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Payment Details</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Due Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{payment.description}</div>
                            <div className="text-sm text-gray-600">Ref: {payment.reference}</div>
                            <Badge className={getTypeColor(payment.type)}>
                              {getTypeLabel(payment.type)}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-lg font-semibold text-gray-900">₦{payment.amount.toLocaleString()}</div>
                          {payment.method && (
                            <div className="text-xs text-gray-500 capitalize">{payment.method.replace('_', ' ')}</div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">{new Date(payment.dueDate).toLocaleDateString()}</div>
                          {payment.paidDate && (
                            <div className="text-xs text-gray-500">Paid: {new Date(payment.paidDate).toLocaleDateString()}</div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            {payment.status === 'paid' && payment.receiptUrl && (
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            {payment.status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleMakePayment(payment)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}
                            {payment.status === 'overdue' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleMakePayment(payment)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
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
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Make Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="text-2xl font-bold text-gray-900">₦{selectedPayment.amount.toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="text-sm text-gray-600">{selectedPayment.description}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </Button>
              <Button onClick={handlePaymentSubmit} className="bg-green-600 hover:bg-green-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Process Payment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
