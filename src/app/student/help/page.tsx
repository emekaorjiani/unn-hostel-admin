'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, Search, MessageSquare, Phone, Mail, BookOpen, Video, FileText, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import StudentHeader from '@/components/layout/student-header'
import QuickActions from '@/components/ui/quick-actions'

export default function StudentHelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const faqData = [
    {
      id: 'applications',
      title: 'Hostel Applications',
      icon: <FileText className="h-5 w-5" />,
      items: [
        {
          question: 'How do I apply for hostel accommodation?',
          answer: 'Navigate to the Applications section and click "New Application". Fill in the required details and submit your application.'
        },
        {
          question: 'What documents do I need for my application?',
          answer: 'You will need your student ID, academic transcript, and any other documents specified in the application form.'
        },
        {
          question: 'How long does the application process take?',
          answer: 'Applications are typically reviewed within 5-7 business days. You will receive notifications about the status of your application.'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Fees',
      icon: <BookOpen className="h-5 w-5" />,
      items: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept bank transfers, credit/debit cards, and mobile money payments through our secure payment gateway.'
        },
        {
          question: 'When are hostel fees due?',
          answer: 'Hostel fees are typically due at the beginning of each semester. Check your payment schedule for specific dates.'
        },
        {
          question: 'Can I pay in installments?',
          answer: 'Yes, installment payment plans are available. Contact the hostel administration for more details.'
        }
      ]
    },
    {
      id: 'maintenance',
      title: 'Maintenance & Repairs',
      icon: <Video className="h-5 w-5" />,
      items: [
        {
          question: 'How do I report a maintenance issue?',
          answer: 'Go to the Maintenance section and submit a new request. Include details about the issue and upload photos if possible.'
        },
        {
          question: 'How quickly are maintenance issues resolved?',
          answer: 'Urgent issues are addressed within 24 hours. Non-urgent issues are typically resolved within 3-5 business days.'
        },
        {
          question: 'What if I need emergency repairs?',
          answer: 'For emergency repairs, contact the hostel office immediately or use the emergency contact number provided.'
        }
      ]
    }
  ]

  const contactInfo = [
    {
      title: 'Hostel Office',
      icon: <Phone className="h-5 w-5" />,
      details: '+234 123 456 7890',
      description: 'Available 24/7 for emergencies'
    },
    {
      title: 'Email Support',
      icon: <Mail className="h-5 w-5" />,
      details: 'hostel@unn.edu.ng',
      description: 'Response within 24 hours'
    },
    {
      title: 'Live Chat',
      icon: <MessageSquare className="h-5 w-5" />,
      details: 'Available 8AM - 6PM',
      description: 'Real-time support'
    }
  ]

  const filteredFAQ = faqData.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <StudentHeader
        title="Help & Support"
        subtitle="Find answers to common questions"
        showBackButton={true}
      />

      {/* Quick Actions */}
      <QuickActions />

      <div className="pt-16 max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((contact, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      {contact.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{contact.title}</h3>
                  </div>
                  <p className="text-xl font-bold text-blue-600 mb-2">{contact.details}</p>
                  <p className="text-sm text-gray-600">{contact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          {filteredFAQ.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      {section.icon}
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </div>
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
              
              {expandedSections.includes(section.id) && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {section.items.map((item, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{item.question}</h4>
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Student Handbook</h3>
                </div>
                <p className="text-gray-600 mb-4">Complete guide to hostel policies, rules, and procedures.</p>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg mr-3">
                    <Video className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Video Tutorials</h3>
                </div>
                <p className="text-gray-600 mb-4">Step-by-step video guides for common tasks.</p>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch Videos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
