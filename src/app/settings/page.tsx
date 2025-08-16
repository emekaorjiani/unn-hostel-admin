'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  CreditCard, 
  Mail, 
  MessageSquare, 
  Shield, 
  Users, 
  Globe, 
  Database,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  FileText,
  Bell,
  Lock,
  Server,
  Edit
} from 'lucide-react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { apiClient } from '@/lib/api'
import { safeLocalStorage } from '@/lib/utils'

interface PaymentGateway {
  id: string
  name: string
  isEnabled: boolean
  apiKey?: string
  secretKey?: string
  webhookUrl?: string
  testMode: boolean
  supportedCurrencies: string[]
  transactionFee: number
  minAmount: number
  maxAmount: number
}

interface SMTPConfig {
  host: string
  port: number
  username: string
  password: string
  encryption: 'tls' | 'ssl' | 'none'
  fromName: string
  fromEmail: string
  isEnabled: boolean
}

interface SMSGateway {
  id: string
  name: string
  isEnabled: boolean
  apiKey?: string
  senderId?: string
  webhookUrl?: string
  balance?: number
  testMode: boolean
}

interface SystemSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  maintenanceMode: boolean
  maintenanceMessage: string
  timezone: string
  dateFormat: string
  timeFormat: string
  maxFileUploadSize: number
  allowedFileTypes: string[]
  sessionTimeout: number
  maxLoginAttempts: number
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
  }
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isActive: boolean
  userCount: number
}

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Payment Gateways
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([
    {
      id: 'paystack',
      name: 'Paystack',
      isEnabled: true,
      apiKey: 'pk_test_...',
      secretKey: 'sk_test_...',
      webhookUrl: 'https://api.unnaccomodation.com/webhooks/paystack',
      testMode: true,
      supportedCurrencies: ['NGN', 'USD', 'GBP'],
      transactionFee: 1.5,
      minAmount: 100,
      maxAmount: 1000000
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      isEnabled: true,
      apiKey: 'FLWPUBK_TEST_...',
      secretKey: 'FLWSECK_TEST_...',
      webhookUrl: 'https://api.unnaccomodation.com/webhooks/flutterwave',
      testMode: true,
      supportedCurrencies: ['NGN', 'USD', 'EUR', 'GBP'],
      transactionFee: 2.0,
      minAmount: 100,
      maxAmount: 5000000
    },
    {
      id: 'remita',
      name: 'Remita',
      isEnabled: false,
      apiKey: 'REMIT_PUBLIC_KEY_...',
      secretKey: 'REMIT_SECRET_KEY_...',
      webhookUrl: 'https://api.unnaccomodation.com/webhooks/remita',
      testMode: true,
      supportedCurrencies: ['NGN'],
      transactionFee: 1.0,
      minAmount: 100,
      maxAmount: 2000000
    }
  ])

  // SMTP Settings
  const [smtpConfig, setSmtpConfig] = useState<SMTPConfig>({
    host: 'smtp.gmail.com',
    port: 587,
    username: 'noreply@unnaccomodation.com',
    password: '',
    encryption: 'tls',
    fromName: 'UNN Hostel Management',
    fromEmail: 'noreply@unnaccomodation.com',
    isEnabled: true
  })

  // SMS Gateway
  const [smsGateway, setSmsGateway] = useState<SMSGateway>({
    id: 'twilio',
    name: 'Twilio',
    isEnabled: false,
    apiKey: '',
    senderId: 'UNN-HOSTEL',
    webhookUrl: 'https://api.unnaccomodation.com/webhooks/sms',
    balance: 0,
    testMode: true
  })

  // System Settings
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'UNN Hostel Management System',
    siteDescription: 'Comprehensive hostel management system for University of Nigeria, Nsukka',
    siteUrl: 'https://unnaccomodation.com',
    maintenanceMode: false,
    maintenanceMessage: 'The system is currently under maintenance. Please check back later.',
    timezone: 'Africa/Lagos',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    maxFileUploadSize: 5,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  })

  // Roles
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'super_admin',
      name: 'Super Administrator',
      description: 'Full system access with all permissions',
      permissions: ['*'],
      isActive: true,
      userCount: 2
    },
    {
      id: 'hall_admin',
      name: 'Hall Administrator',
      description: 'Manage specific hostel facilities and students',
      permissions: ['hostels.view', 'hostels.edit', 'students.view', 'students.edit', 'applications.view', 'applications.edit'],
      isActive: true,
      userCount: 8
    },
    {
      id: 'bursary',
      name: 'Bursary Staff',
      description: 'Handle financial transactions and payments',
      permissions: ['payments.view', 'payments.edit', 'students.view', 'reports.view'],
      isActive: true,
      userCount: 3
    },
    {
      id: 'maintenance',
      name: 'Maintenance Staff',
      description: 'Handle maintenance requests and repairs',
      permissions: ['maintenance.view', 'maintenance.edit', 'hostels.view'],
      isActive: true,
      userCount: 5
    },
    {
      id: 'security',
      name: 'Security Staff',
      description: 'Monitor security and access control',
      permissions: ['security.view', 'security.edit', 'students.view'],
      isActive: true,
      userCount: 12
    }
  ])

  const handleSaveSettings = async () => {
    setSaving(true)
    setMessage(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const togglePaymentGateway = (gatewayId: string) => {
    setPaymentGateways(prev => 
      prev.map(gateway => 
        gateway.id === gatewayId 
          ? { ...gateway, isEnabled: !gateway.isEnabled }
          : gateway
      )
    )
  }

  const toggleMaintenanceMode = () => {
    setSystemSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))
  }

  const toggleSMTP = () => {
    setSmtpConfig(prev => ({ ...prev, isEnabled: !prev.isEnabled }))
  }

  const toggleSMSGateway = () => {
    setSmsGateway(prev => ({ ...prev, isEnabled: !prev.isEnabled }))
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'payments', name: 'Payment Gateways', icon: CreditCard },
    { id: 'email', name: 'Email Settings', icon: Mail },
    { id: 'sms', name: 'SMS Gateway', icon: MessageSquare },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'roles', name: 'Roles & Permissions', icon: Users }
  ]

  return (
    <DashboardLayout>
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-1">
              Configure system preferences, payment gateways, and security settings
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={() => router.push('/settings/mail-templates')}
              variant="outline"
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Mail Templates
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              size="sm"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save All Settings
            </Button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Site Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <Input
                        value={systemSettings.siteName}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                        placeholder="Enter site name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site URL
                      </label>
                      <Input
                        value={systemSettings.siteUrl}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <Input
                      value={systemSettings.siteDescription}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                      placeholder="Enter site description"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    Maintenance Mode
                  </CardTitle>
                  <CardDescription>
                    Enable maintenance mode to temporarily disable the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Maintenance Mode</h4>
                      <p className="text-sm text-gray-600">
                        When enabled, only administrators can access the system
                      </p>
                    </div>
                    <Button
                      variant={systemSettings.maintenanceMode ? "default" : "outline"}
                      onClick={toggleMaintenanceMode}
                      className="flex items-center"
                    >
                      {systemSettings.maintenanceMode ? (
                        <>
                          <ToggleRight className="h-4 w-4 mr-2" />
                          Enabled
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4 mr-2" />
                          Disabled
                        </>
                      )}
                    </Button>
                  </div>
                  {systemSettings.maintenanceMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maintenance Message
                      </label>
                      <Input
                        value={systemSettings.maintenanceMessage}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenanceMessage: e.target.value }))}
                        placeholder="Enter maintenance message"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    System Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={systemSettings.timezone}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, timezone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                        <option value="UTC">UTC (GMT+0)</option>
                        <option value="America/New_York">America/New_York (GMT-5)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Format
                      </label>
                      <select
                        value={systemSettings.dateFormat}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Format
                      </label>
                      <select
                        value={systemSettings.timeFormat}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, timeFormat: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="12">12-hour</option>
                        <option value="24">24-hour</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payment Gateways */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Gateway Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure and manage payment gateways for processing transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {paymentGateways.map((gateway) => (
                      <div key={gateway.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium">{gateway.name}</h3>
                            <Badge 
                              className={`ml-2 ${
                                gateway.isEnabled 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {gateway.isEnabled ? 'Active' : 'Inactive'}
                            </Badge>
                            {gateway.testMode && (
                              <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                                Test Mode
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant={gateway.isEnabled ? "default" : "outline"}
                            onClick={() => togglePaymentGateway(gateway.id)}
                            size="sm"
                          >
                            {gateway.isEnabled ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                        
                        {gateway.isEnabled && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Public Key
                              </label>
                              <Input
                                value={gateway.apiKey || ''}
                                onChange={(e) => setPaymentGateways(prev => 
                                  prev.map(g => g.id === gateway.id ? { ...g, apiKey: e.target.value } : g)
                                )}
                                placeholder="Enter public key"
                                type="password"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Secret Key
                              </label>
                              <Input
                                value={gateway.secretKey || ''}
                                onChange={(e) => setPaymentGateways(prev => 
                                  prev.map(g => g.id === gateway.id ? { ...g, secretKey: e.target.value } : g)
                                )}
                                placeholder="Enter secret key"
                                type="password"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Transaction Fee (%)
                              </label>
                              <Input
                                value={gateway.transactionFee}
                                onChange={(e) => setPaymentGateways(prev => 
                                  prev.map(g => g.id === gateway.id ? { ...g, transactionFee: parseFloat(e.target.value) || 0 } : g)
                                )}
                                type="number"
                                step="0.1"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Supported Currencies
                              </label>
                              <Input
                                value={gateway.supportedCurrencies.join(', ')}
                                onChange={(e) => setPaymentGateways(prev => 
                                  prev.map(g => g.id === gateway.id ? { ...g, supportedCurrencies: e.target.value.split(',').map(c => c.trim()) } : g)
                                )}
                                placeholder="NGN, USD, EUR"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    SMTP Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure email server settings for sending notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable SMTP</h4>
                      <p className="text-sm text-gray-600">
                        Enable email notifications via SMTP
                      </p>
                    </div>
                    <Button
                      variant={smtpConfig.isEnabled ? "default" : "outline"}
                      onClick={toggleSMTP}
                    >
                      {smtpConfig.isEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  
                  {smtpConfig.isEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Host
                        </label>
                        <Input
                          value={smtpConfig.host}
                          onChange={(e) => setSmtpConfig(prev => ({ ...prev, host: e.target.value }))}
                          placeholder="smtp.gmail.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Port
                        </label>
                        <Input
                          value={smtpConfig.port}
                          onChange={(e) => setSmtpConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 587 }))}
                          type="number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <Input
                          value={smtpConfig.username}
                          onChange={(e) => setSmtpConfig(prev => ({ ...prev, username: e.target.value }))}
                          placeholder="noreply@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <Input
                          value={smtpConfig.password}
                          onChange={(e) => setSmtpConfig(prev => ({ ...prev, password: e.target.value }))}
                          type="password"
                          placeholder="Enter password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Encryption
                        </label>
                        <select
                          value={smtpConfig.encryption}
                          onChange={(e) => setSmtpConfig(prev => ({ ...prev, encryption: e.target.value as 'tls' | 'ssl' | 'none' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="tls">TLS</option>
                          <option value="ssl">SSL</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Name
                        </label>
                        <Input
                          value={smtpConfig.fromName}
                          onChange={(e) => setSmtpConfig(prev => ({ ...prev, fromName: e.target.value }))}
                          placeholder="UNN Hostel Management"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* SMS Gateway */}
          {activeTab === 'sms' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    SMS Gateway Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure SMS gateway for sending text message notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable SMS Gateway</h4>
                      <p className="text-sm text-gray-600">
                        Enable SMS notifications
                      </p>
                    </div>
                    <Button
                      variant={smsGateway.isEnabled ? "default" : "outline"}
                      onClick={toggleSMSGateway}
                    >
                      {smsGateway.isEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  
                  {smsGateway.isEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Key
                        </label>
                        <Input
                          value={smsGateway.apiKey || ''}
                          onChange={(e) => setSmsGateway(prev => ({ ...prev, apiKey: e.target.value }))}
                          placeholder="Enter API key"
                          type="password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sender ID
                        </label>
                        <Input
                          value={smsGateway.senderId || ''}
                          onChange={(e) => setSmsGateway(prev => ({ ...prev, senderId: e.target.value }))}
                          placeholder="UNN-HOSTEL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Balance
                        </label>
                        <Input
                          value={smsGateway.balance || 0}
                          onChange={(e) => setSmsGateway(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
                          type="number"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Test Mode
                        </label>
                        <select
                          value={smsGateway.testMode ? 'true' : 'false'}
                          onChange={(e) => setSmsGateway(prev => ({ ...prev, testMode: e.target.value === 'true' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="true">Enabled</option>
                          <option value="false">Disabled</option>
                        </select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Password Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Length
                      </label>
                      <Input
                        value={systemSettings.passwordPolicy.minLength}
                        onChange={(e) => setSystemSettings(prev => ({ 
                          ...prev, 
                          passwordPolicy: { ...prev.passwordPolicy, minLength: parseInt(e.target.value) || 8 }
                        }))}
                        type="number"
                        min="6"
                        max="20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <Input
                        value={systemSettings.sessionTimeout}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 30 }))}
                        type="number"
                        min="5"
                        max="480"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={systemSettings.passwordPolicy.requireUppercase}
                        onChange={(e) => setSystemSettings(prev => ({ 
                          ...prev, 
                          passwordPolicy: { ...prev.passwordPolicy, requireUppercase: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <label className="text-sm">Require uppercase letters</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={systemSettings.passwordPolicy.requireLowercase}
                        onChange={(e) => setSystemSettings(prev => ({ 
                          ...prev, 
                          passwordPolicy: { ...prev.passwordPolicy, requireLowercase: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <label className="text-sm">Require lowercase letters</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={systemSettings.passwordPolicy.requireNumbers}
                        onChange={(e) => setSystemSettings(prev => ({ 
                          ...prev, 
                          passwordPolicy: { ...prev.passwordPolicy, requireNumbers: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <label className="text-sm">Require numbers</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={systemSettings.passwordPolicy.requireSpecialChars}
                        onChange={(e) => setSystemSettings(prev => ({ 
                          ...prev, 
                          passwordPolicy: { ...prev.passwordPolicy, requireSpecialChars: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <label className="text-sm">Require special characters</label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <Input
                        value={systemSettings.maxLoginAttempts}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) || 5 }))}
                        type="number"
                        min="3"
                        max="10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max File Upload Size (MB)
                      </label>
                      <Input
                        value={systemSettings.maxFileUploadSize}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileUploadSize: parseInt(e.target.value) || 5 }))}
                        type="number"
                        min="1"
                        max="50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Roles & Permissions */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Roles & Permissions
                  </CardTitle>
                  <CardDescription>
                    Manage user roles and their associated permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roles.map((role) => (
                      <div key={role.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium">{role.name}</h3>
                            <Badge 
                              className={`ml-2 ${
                                role.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {role.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge className="ml-2 bg-blue-100 text-blue-800">
                              {role.userCount} users
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                        <p className="text-gray-600 mb-3">{role.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 5).map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                          {role.permissions.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}




