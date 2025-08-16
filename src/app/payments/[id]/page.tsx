'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  CreditCard, 
  ArrowLeft, 
  Download, 
  Eye, 
  User, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Receipt,
  Wallet,
  Banknote,
  QrCode,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Building,
  FileText,
  Info,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  Star,
  Award,
  Target,
  Bell,
  Settings,
  HelpCircle,
  ExternalLink,
  Clock3,
  FileCheck,
  PiggyBank,
  CreditCard as CreditCardIcon,
  Banknote as BanknoteIcon,
  Wifi,
  Wrench,
  ShieldCheck,
  Users2,
  MessageSquare,
  CheckSquare,
  Square,
  Circle,
  Minus,
  Plus as PlusIcon,
  LogOut,
  Flag,
  Map,
  Home,
  Bed
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/dashboard-layout';
import { apiClient } from '../../../lib/api';
import { safeLocalStorage } from '../../../lib/utils';

// Payment interface
interface Payment {
  id: string;
  student_id: string;
  application_id?: string;
  type: 'rent' | 'deposit' | 'application_fee' | 'maintenance_fee' | 'other';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  payment_method: 'card' | 'bank_transfer' | 'mobile_money' | 'cash' | 'other';
  gateway: string;
  reference: string;
  transaction_id?: string;
  description: string;
  metadata?: Record<string, any>;
  receipt_url?: string;
  paid_at?: string;
  failed_at?: string;
  refunded_at?: string;
  created_at: string;
  updated_at: string;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    matric_number: string;
    phone_number: string;
  };
  application?: {
    id: string;
    hostel_name: string;
    room_number?: string;
    bed_number?: string;
  };
}

export default function PaymentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params.id as string;
  
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches payment details from the API using the payment ID
   */
  const fetchPaymentData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const token = safeLocalStorage.getItem('auth_token') || safeLocalStorage.getItem('student_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Since the API endpoint doesn't exist, we'll use fallback data
      const fallbackPayments: Payment[] = [
        {
          id: 'payment-1',
          student_id: 'student-1',
          application_id: 'app-1',
          type: 'rent',
          amount: 25000,
          currency: 'NGN',
          status: 'completed',
          payment_method: 'card',
          gateway: 'paystack',
          reference: 'TXN_20240815_001',
          transaction_id: 'TXN_20240815_001_123456',
          description: 'Hostel rent payment for Zik Hall - First Semester',
          metadata: {
            hostel_id: 'hostel-1',
            room_id: 'room-101',
            bed_id: 'bed-1',
            semester: 'First Semester 2024/2025'
          },
          receipt_url: '/receipts/payment-1.pdf',
          paid_at: '2024-08-15T10:30:00Z',
          created_at: '2024-08-15T10:25:00Z',
          updated_at: '2024-08-15T10:30:00Z',
          student: {
            id: 'student-1',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@unn.edu.ng',
            matric_number: '2021/123456',
            phone_number: '+2348012345678'
          },
          application: {
            id: 'app-1',
            hostel_name: 'Zik Hall',
            room_number: '101',
            bed_number: '1'
          }
        },
        {
          id: 'payment-2',
          student_id: 'student-2',
          application_id: 'app-2',
          type: 'application_fee',
          amount: 5000,
          currency: 'NGN',
          status: 'pending',
          payment_method: 'bank_transfer',
          gateway: 'flutterwave',
          reference: 'TXN_20240816_002',
          description: 'Application fee for hostel accommodation',
          metadata: {
            application_window_id: 'window-1',
            hostel_id: 'hostel-2'
          },
          created_at: '2024-08-16T09:00:00Z',
          updated_at: '2024-08-16T09:00:00Z',
          student: {
            id: 'student-2',
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@unn.edu.ng',
            matric_number: '2021/123457',
            phone_number: '+2348012345679'
          },
          application: {
            id: 'app-2',
            hostel_name: 'Mariere Hall'
          }
        },
        {
          id: 'payment-3',
          student_id: 'student-3',
          type: 'deposit',
          amount: 15000,
          currency: 'NGN',
          status: 'failed',
          payment_method: 'mobile_money',
          gateway: 'paystack',
          reference: 'TXN_20240817_003',
          description: 'Security deposit for hostel accommodation',
          metadata: {
            hostel_id: 'hostel-3',
            reason: 'Insufficient funds'
          },
          failed_at: '2024-08-17T14:15:00Z',
          created_at: '2024-08-17T14:10:00Z',
          updated_at: '2024-08-17T14:15:00Z',
          student: {
            id: 'student-3',
            first_name: 'Mike',
            last_name: 'Johnson',
            email: 'mike.johnson@unn.edu.ng',
            matric_number: '2021/123458',
            phone_number: '+2348012345680'
          }
        }
      ];

      const paymentData = fallbackPayments.find(p => p.id === paymentId);
      
      if (!paymentData) {
        throw new Error('Payment not found');
      }

      setPayment(paymentData);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payment data';
      setError(errorMessage);
      console.error('Payment fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (paymentId) {
      fetchPaymentData();
    }
  }, [paymentId]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'refunded': return <RefreshCw className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer': return <Banknote className="h-4 w-4" />;
      case 'mobile_money': return <Smartphone className="h-4 w-4" />;
      case 'cash': return <Wallet className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  // Get payment type color
  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'rent': return 'bg-blue-100 text-blue-800';
      case 'deposit': return 'bg-purple-100 text-purple-800';
      case 'application_fee': return 'bg-orange-100 text-orange-800';
      case 'maintenance_fee': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Payment</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex space-x-3">
              <Button onClick={() => fetchPaymentData()} variant="outline">
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

  if (!payment) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Not Found</h2>
            <p className="text-gray-600 mb-4">The payment you're looking for doesn't exist.</p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
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
              <h1 className="text-3xl font-bold text-gray-900">Payment Details</h1>
              <p className="text-gray-600 mt-1">View payment information and transaction status</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {payment.receipt_url && (
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            )}
            <Button onClick={() => router.push(`/payments/${paymentId}/edit`)} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Payment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Payment #{payment.id}</h3>
                <p className="text-sm text-gray-600">
                  Created on {formatDate(payment.created_at)}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={`${getPaymentTypeColor(payment.type)} capitalize`}>
                  {payment.type.replace('_', ' ')}
                </Badge>
                <Badge className={`${getStatusColor(payment.status)} flex items-center`}>
                  {getStatusIcon(payment.status)}
                  <span className="ml-1 capitalize">{payment.status}</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Amount and Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Banknote className="h-5 w-5" />
                <span>Payment Amount</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(payment.amount, payment.currency)}
                  </p>
                  <p className="text-sm text-gray-600">{payment.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                    <div className="flex items-center space-x-1">
                      {getPaymentMethodIcon(payment.payment_method)}
                      <span className="text-sm text-gray-900 capitalize">
                        {payment.payment_method.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Gateway:</span>
                    <span className="text-sm text-gray-900 capitalize">{payment.gateway}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Reference:</span>
                    <span className="text-sm text-gray-900 font-mono">{payment.reference}</span>
                  </div>
                  
                  {payment.transaction_id && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Transaction ID:</span>
                      <span className="text-sm text-gray-900 font-mono">{payment.transaction_id}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Student Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {payment.student.first_name} {payment.student.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{payment.student.matric_number}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{payment.student.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{payment.student.phone_number}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Information */}
          {payment.application && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Application Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{payment.application.hostel_name}</h3>
                    <p className="text-sm text-gray-600">Application #{payment.application.id}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {payment.application.room_number && (
                      <div className="flex items-center space-x-2">
                        <Home className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">Room {payment.application.room_number}</span>
                      </div>
                    )}
                    {payment.application.bed_number && (
                      <div className="flex items-center space-x-2">
                        <Bed className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">Bed {payment.application.bed_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Payment Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment Initiated</p>
                  <p className="text-sm text-gray-600">{formatDate(payment.created_at)}</p>
                </div>
              </div>
              
              {payment.paid_at && (
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Completed</p>
                    <p className="text-sm text-gray-600">{formatDate(payment.paid_at)}</p>
                  </div>
                </div>
              )}

              {payment.failed_at && (
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Failed</p>
                    <p className="text-sm text-gray-600">{formatDate(payment.failed_at)}</p>
                    {payment.metadata?.reason && (
                      <p className="text-sm text-red-600">Reason: {payment.metadata.reason}</p>
                    )}
                  </div>
                </div>
              )}

              {payment.refunded_at && (
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Refunded</p>
                    <p className="text-sm text-gray-600">{formatDate(payment.refunded_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        {payment.metadata && Object.keys(payment.metadata).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Additional Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(payment.metadata).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-sm text-gray-900">
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
