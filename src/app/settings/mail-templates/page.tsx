'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Mail, 
  Save, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Eye,
  Edit,
  Copy,
  Send,
  Users,
  CreditCard,
  Bell,
  Shield,
  Building,
  GraduationCap,
  Wrench
} from 'lucide-react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { mailTemplatesService, MailTemplate, TemplateOptions } from '@/lib/mailTemplatesService'

// Remove this interface since we're importing it from the service

export default function MailTemplatesPage() {
  const router = useRouter()
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  const [templates, setTemplates] = useState<MailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [templateOptions, setTemplateOptions] = useState<TemplateOptions | null>(null)

  const [selectedCategory, setSelectedCategory] = useState('all')

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates()
    fetchTemplateOptions()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await mailTemplatesService.getTemplates()
      setTemplates(response.templates)
    } catch (error) {
      console.error('Error fetching templates:', error)
      setMessage({ type: 'error', text: 'Failed to fetch templates' })
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplateOptions = async () => {
    try {
      const options = await mailTemplatesService.getTemplateOptions()
      setTemplateOptions(options)
    } catch (error) {
      console.error('Error fetching template options:', error)
    }
  }

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  const currentTemplate = activeTemplate 
    ? templates.find(t => t.id === activeTemplate) 
    : null

  const handleSaveTemplate = async () => {
    if (!currentTemplate) return

    setSaving(true)
    setMessage(null)

    try {
      await mailTemplatesService.updateTemplate(currentTemplate.id, {
        name: currentTemplate.name,
        subject: currentTemplate.subject,
        content: currentTemplate.content,
        variables: currentTemplate.variables,
        type: currentTemplate.type,
        category: currentTemplate.category,
        description: currentTemplate.description,
        is_active: currentTemplate.is_active
      })

      // Refresh templates to get updated data
      await fetchTemplates()

      setMessage({ type: 'success', text: 'Template saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save template. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleCopyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      const templateText = `Subject: ${template.subject}\n\nBody:\n${template.content}`
      navigator.clipboard.writeText(templateText)
      setMessage({ type: 'success', text: 'Template copied to clipboard!' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleTestEmail = async (templateId: string) => {
    try {
      // Use the preview functionality to test the template
      const sampleData = {
        student_name: 'John Doe',
        matric_number: '2021/123456',
        email: 'john.doe@example.com',
        faculty: 'Engineering',
        department: 'Computer Engineering'
      }
      
      await mailTemplatesService.previewTemplate(templateId, sampleData)
      setMessage({ type: 'success', text: 'Template preview generated successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to generate template preview.' })
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    const iconMap: Record<string, any> = {
      'general': FileText,
      'application': Building,
      'payment': CreditCard,
      'maintenance': Wrench,
      'security': Shield,
      'all': FileText
    }
    return iconMap[categoryId] || FileText
  }

  return (
    <DashboardLayout>
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center">
            <Button
              onClick={() => router.push('/settings')}
              variant="ghost"
              size="sm"
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mail Templates</h1>
              <p className="text-gray-600 mt-1">
                Manage and customize email templates for system notifications
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={() => setPreviewMode(!previewMode)}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Hide Preview' : 'Show Preview'}
            </Button>
            {currentTemplate && (
              <Button
                onClick={handleSaveTemplate}
                disabled={saving}
                size="sm"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Template
              </Button>
            )}
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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading templates...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Template List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                                 {/* Category Filter */}
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Filter by Category
                   </label>
                   <select
                     value={selectedCategory}
                     onChange={(e) => setSelectedCategory(e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                   >
                     <option value="all">All Templates</option>
                     {templateOptions?.categories.map((category) => (
                       <option key={category.value} value={category.value}>
                         {category.label}
                       </option>
                     ))}
                   </select>
                 </div>

                {/* Template List */}
                <div className="space-y-2">
                  {filteredTemplates.map((template) => {
                    const Icon = getCategoryIcon(template.category)
                    return (
                      <div
                        key={template.id}
                        onClick={() => setActiveTemplate(template.id)}
                        className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                          activeTemplate === template.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                                                   <div className="flex items-center">
                           <Icon className="h-4 w-4 mr-2 text-gray-600" />
                           <div>
                             <h4 className="text-sm font-medium text-gray-900">
                               {template.name}
                             </h4>
                             <p className="text-xs text-gray-600">
                               {template.description || 'No description'}
                             </p>
                           </div>
                         </div>
                         <Badge 
                           className={`text-xs ${
                             template.is_active 
                               ? 'bg-green-100 text-green-800' 
                               : 'bg-gray-100 text-gray-800'
                           }`}
                         >
                           {template.is_active ? 'Active' : 'Inactive'}
                         </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Template Editor */}
          <div className="lg:col-span-3">
            {currentTemplate ? (
              <div className="space-y-6">
                {/* Template Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Edit className="h-5 w-5 mr-2" />
                          {currentTemplate.name}
                        </CardTitle>
                                                 <CardDescription>
                           {currentTemplate.description || 'No description'}
                         </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleCopyTemplate(currentTemplate.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => handleTestEmail(currentTemplate.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Test Email
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Category:</span> {currentTemplate.category}
                      </div>
                      <div>
                        <span className="font-medium">Version:</span> {currentTemplate.version}
                      </div>
                                             <div>
                         <span className="font-medium">Last Modified:</span> {new Date(currentTemplate.updated_at).toLocaleDateString()}
                       </div>
                       <div>
                         <span className="font-medium">Status:</span> 
                         <Badge className={`ml-2 ${
                           currentTemplate.is_active 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-gray-100 text-gray-800'
                         }`}>
                           {currentTemplate.is_active ? 'Active' : 'Inactive'}
                         </Badge>
                       </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Template Editor */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Editor */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Email Subject</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Input
                          value={currentTemplate.subject}
                          onChange={(e) => setTemplates(prev => 
                            prev.map(t => t.id === currentTemplate.id 
                              ? { ...t, subject: e.target.value }
                              : t
                            )
                          )}
                          placeholder="Enter email subject"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Email Body</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <textarea
                          value={currentTemplate.content}
                          onChange={(e) => setTemplates(prev => 
                            prev.map(t => t.id === currentTemplate.id 
                              ? { ...t, content: e.target.value }
                              : t
                            )
                          )}
                          rows={20}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                          placeholder="Enter email body content"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Preview */}
                  {previewMode && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="border rounded-lg p-4 bg-white">
                                                         <div className="mb-4">
                               <strong>Subject:</strong> {currentTemplate.subject}
                             </div>
                             <div className="whitespace-pre-wrap text-sm">
                               {currentTemplate.content}
                             </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Available Variables</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {currentTemplate.variables.map((variable) => (
                              <div key={variable} className="flex items-center justify-between">
                                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                  {`{{${variable}}}`}
                                </code>
                                <Badge variant="outline" className="text-xs">
                                  Variable
                                </Badge>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Tip:</strong> Use these variables in your template. They will be replaced with actual values when the email is sent.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Template</h3>
                    <p className="text-gray-600">Choose a template from the sidebar to edit its content.</p>
                  </div>
                </CardContent>
              </Card>
                         )}
           </div>
         </div>
       )}
     </div>
   </DashboardLayout>
 )
}
