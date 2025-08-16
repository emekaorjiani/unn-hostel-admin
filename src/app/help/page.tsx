'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Users, 
  FileText, 
  CreditCard, 
  Wrench, 
  Bell, 
  Settings, 
  Home,
  GraduationCap,
  Shield,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Help Center</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to the UNN Hostel Management Portal. This guide will help you navigate and use all the features available to you.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" onClick={() => document.getElementById('student-guide')?.scrollIntoView({ behavior: 'smooth' })}>
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span>Student Guide</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" onClick={() => document.getElementById('admin-guide')?.scrollIntoView({ behavior: 'smooth' })}>
            <Shield className="h-6 w-6 text-green-600" />
            <span>Admin Guide</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>
            <HelpCircle className="h-6 w-6 text-purple-600" />
            <span>FAQ</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            <Bell className="h-6 w-6 text-orange-600" />
            <span>Contact Support</span>
          </Button>
        </div>

        {/* Student Guide */}
        <div id="student-guide" className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl">Student Guide</CardTitle>
                  <CardDescription>Complete guide for students using the hostel management portal</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Getting Started */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  Getting Started
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li><strong>Login:</strong> Use your matric number and password to access your student dashboard</li>
                    <li><strong>Profile Setup:</strong> Complete your profile information including contact details</li>
                    <li><strong>Document Upload:</strong> Upload required documents (ID card, passport photo, etc.)</li>
                    <li><strong>Application:</strong> Submit your hostel application for the current academic session</li>
                  </ol>
                </div>
              </div>

              {/* Dashboard Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Home className="h-5 w-5 text-blue-600 mr-2" />
                  Dashboard Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold">Applications</h4>
                      </div>
                      <p className="text-sm text-gray-600">Track your hostel applications, view status updates, and submit new applications</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <CreditCard className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold">Payments</h4>
                      </div>
                      <p className="text-sm text-gray-600">View payment history, make new payments, and track payment status</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Wrench className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold">Maintenance</h4>
                      </div>
                      <p className="text-sm text-gray-600">Report maintenance issues, track repair progress, and view maintenance history</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Bell className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold">Notifications</h4>
                      </div>
                      <p className="text-sm text-gray-600">Receive important updates about applications, payments, and maintenance</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Step-by-Step Process */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <ArrowRight className="h-5 w-5 text-blue-600 mr-2" />
                  Application Process
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Badge className="bg-blue-600 text-white">1</Badge>
                    <div>
                      <h4 className="font-semibold">Submit Application</h4>
                      <p className="text-sm text-gray-600">Fill out the hostel application form with your preferences and personal details</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Badge className="bg-yellow-600 text-white">2</Badge>
                    <div>
                      <h4 className="font-semibold">Application Review</h4>
                      <p className="text-sm text-gray-600">Your application will be reviewed by the hostel administration team</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Badge className="bg-green-600 text-white">3</Badge>
                    <div>
                      <h4 className="font-semibold">Approval & Payment</h4>
                      <p className="text-sm text-gray-600">Once approved, make the required payment to secure your accommodation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Badge className="bg-purple-600 text-white">4</Badge>
                    <div>
                      <h4 className="font-semibold">Room Assignment</h4>
                      <p className="text-sm text-gray-600">Receive your room assignment and move-in instructions</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Guide */}
        <div id="admin-guide" className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <CardTitle className="text-2xl">Administrator Guide</CardTitle>
                  <CardDescription>Complete guide for administrators managing the hostel system</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Admin Roles */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="h-5 w-5 text-green-600 mr-2" />
                  Administrator Roles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-red-600 mb-2">Super Admin</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Full system access</li>
                        <li>• User management</li>
                        <li>• System configuration</li>
                        <li>• Reports and analytics</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-600 mb-2">Hall Admin</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Application processing</li>
                        <li>• Room assignments</li>
                        <li>• Student management</li>
                        <li>• Maintenance coordination</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Admin Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Settings className="h-5 w-5 text-green-600 mr-2" />
                  Management Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold">Student Management</h4>
                      </div>
                      <p className="text-sm text-gray-600">Manage student profiles, applications, and room assignments</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Home className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold">Hostel Management</h4>
                      </div>
                      <p className="text-sm text-gray-600">Manage hostel facilities, rooms, and maintenance requests</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold">Payment Management</h4>
                      </div>
                      <p className="text-sm text-gray-600">Track payments, generate invoices, and manage financial records</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <HelpCircle className="h-8 w-8 text-purple-600" />
                <div>
                  <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                  <CardDescription>Common questions and answers about the hostel management system</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">How do I apply for hostel accommodation?</h3>
                <p className="text-gray-600">Login to your student dashboard, navigate to Applications, and click "New Application" to submit your hostel application.</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">What documents do I need to upload?</h3>
                <p className="text-gray-600">You'll need to upload your student ID card, passport photograph, and any other documents specified in the application form.</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">How long does application processing take?</h3>
                <p className="text-gray-600">Application processing typically takes 3-5 business days. You'll receive notifications about your application status.</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">How do I make payments?</h3>
                <p className="text-gray-600">Once your application is approved, you can make payments through the Payments section using the available payment methods.</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">What if I have maintenance issues?</h3>
                <p className="text-gray-600">Report maintenance issues through the Maintenance section. Your request will be processed and you'll receive updates on the progress.</p>
              </div>
              <div className="pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">How do I contact support?</h3>
                <p className="text-gray-600">You can contact support through the contact information provided below or through the notifications system.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <div id="contact" className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Bell className="h-8 w-8 text-orange-600" />
                <div>
                  <CardTitle className="text-2xl">Contact Support</CardTitle>
                  <CardDescription>Get help when you need it</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Technical Support</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Email:</strong> support@unnaccomodation.com</p>
                    <p><strong>Phone:</strong> +234 123 456 7890</p>
                    <p><strong>Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Hostel Administration</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Email:</strong> hostel.admin@unn.edu.ng</p>
                    <p><strong>Phone:</strong> +234 123 456 7891</p>
                    <p><strong>Location:</strong> Hostel Administration Building</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Need Immediate Help?</h4>
                    <p className="text-blue-800 text-sm">
                      For urgent issues or emergencies, please contact the hostel security office directly or visit the hostel administration building during office hours.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Button 
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
