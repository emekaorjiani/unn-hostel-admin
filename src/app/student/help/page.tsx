'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, Search, MessageSquare, Phone, Mail, BookOpen, Video, FileText, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import StudentHeader from '@/components/layout/student-header'
import QuickActions from '@/components/ui/quick-actions'

export default function StudentHelpPage() {
  const [activeSection, setActiveSection] = useState('general')

  const helpSections = [
    {
      id: 'general',
      title: 'General Information',
      icon: HelpCircle,
      content: [
        {
          question: 'How do I apply for hostel accommodation?',
          answer: 'Navigate to Applications > New Application to start your hostel application process.'
        },
        {
          question: 'What documents do I need?',
          answer: 'You will need your student ID, proof of enrollment, and any required medical certificates.'
        }
      ]
    },
    {
      id: 'applications',
      title: 'Applications',
      icon: FileText,
      content: [
        {
          question: 'How long does the application process take?',
          answer: 'Applications are typically processed within 5-7 business days.'
        },
        {
          question: 'Can I change my hostel preference?',
          answer: 'Yes, you can update your preferences before the application deadline.'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments',
      icon: BookOpen,
      content: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept bank transfers, online payments, and mobile money transfers.'
        },
        {
          question: 'When are payments due?',
          answer: 'Payment deadlines are clearly stated in your application confirmation.'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StudentHeader
        title="Help & Support"
        subtitle="Find answers to common questions"
        showBackButton={true}
      />

      <QuickActions />

      <div className="pt-16 max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Help Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {helpSections.map((section) => (
              <Card key={section.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <section.icon className="h-5 w-5 mr-2" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.content.map((item, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                      <p className="text-sm text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Need additional help? Contact our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Phone Support</h4>
                  <p className="text-sm text-gray-600">+234 801 234 5678</p>
                  <p className="text-xs text-gray-500">Mon-Fri, 8AM-6PM</p>
                </div>
                <div className="text-center">
                  <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Email Support</h4>
                  <p className="text-sm text-gray-600">support@unn.edu.ng</p>
                  <p className="text-xs text-gray-500">24/7 response</p>
                </div>
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Documentation</h4>
                  <p className="text-sm text-gray-600">Complete guides</p>
                  <p className="text-xs text-gray-500">Step-by-step tutorials</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 