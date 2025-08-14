'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import { 
  FileText, 
  Upload,
  Download,
  Eye,
  Trash2,
  Plus,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FolderOpen,
  Search,
  Filter
} from 'lucide-react'

interface Document {
  id: string
  name: string
  type: 'id_card' | 'academic_record' | 'medical_certificate' | 'parent_consent' | 'payment_receipt' | 'hostel_agreement' | 'other'
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  uploadedDate: string
  expiryDate?: string
  size: string
  fileType: string
  description: string
  notes?: string
  reviewer?: string
  reviewDate?: string
}

interface DocumentCategory {
  type: string
  count: number
  required: boolean
  status: 'complete' | 'incomplete' | 'pending'
}

export default function StudentDocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  // Generate dummy documents data
  const generateDummyDocuments = (): Document[] => [
    {
      id: 'DOC001',
      name: 'Student ID Card',
      type: 'id_card',
      status: 'approved',
      uploadedDate: '2024-09-01',
      expiryDate: '2025-09-01',
      size: '2.1 MB',
      fileType: 'PDF',
      description: 'Official University of Nigeria student identification card',
      reviewer: 'Admin Office',
      reviewDate: '2024-09-02'
    },
    {
      id: 'DOC002',
      name: 'Academic Record Transcript',
      type: 'academic_record',
      status: 'approved',
      uploadedDate: '2024-09-05',
      size: '1.8 MB',
      fileType: 'PDF',
      description: 'Complete academic transcript showing current semester grades',
      reviewer: 'Academic Affairs',
      reviewDate: '2024-09-06'
    },
    {
      id: 'DOC003',
      name: 'Medical Fitness Certificate',
      type: 'medical_certificate',
      status: 'pending',
      uploadedDate: '2024-12-10',
      size: '3.2 MB',
      fileType: 'PDF',
      description: 'Medical certificate from university health center confirming fitness for hostel accommodation'
    },
    {
      id: 'DOC004',
      name: 'Parent Consent Form',
      type: 'parent_consent',
      status: 'approved',
      uploadedDate: '2024-09-03',
      size: '1.5 MB',
      fileType: 'PDF',
      description: 'Signed consent form from parent/guardian for hostel accommodation',
      reviewer: 'Student Affairs',
      reviewDate: '2024-09-04'
    },
    {
      id: 'DOC005',
      name: 'Hostel Payment Receipt',
      type: 'payment_receipt',
      status: 'approved',
      uploadedDate: '2024-09-15',
      size: '0.8 MB',
      fileType: 'PDF',
      description: 'Payment confirmation receipt for hostel accommodation fees',
      reviewer: 'Finance Office',
      reviewDate: '2024-09-16'
    },
    {
      id: 'DOC006',
      name: 'Hostel Agreement Form',
      type: 'hostel_agreement',
      status: 'approved',
      uploadedDate: '2024-09-02',
      size: '2.5 MB',
      fileType: 'PDF',
      description: 'Signed hostel rules and regulations agreement form',
      reviewer: 'Hostel Management',
      reviewDate: '2024-09-03'
    },
    {
      id: 'DOC007',
      name: 'Emergency Contact Form',
      type: 'other',
      status: 'rejected',
      uploadedDate: '2024-12-08',
      size: '1.2 MB',
      fileType: 'PDF',
      description: 'Emergency contact information form for hostel accommodation',
      notes: 'Form incomplete - missing emergency contact phone number',
      reviewer: 'Student Affairs',
      reviewDate: '2024-12-09'
    },
    {
      id: 'DOC008',
      name: 'Previous Hostel Reference',
      type: 'other',
      status: 'expired',
      uploadedDate: '2023-09-01',
      expiryDate: '2024-09-01',
      size: '1.7 MB',
      fileType: 'PDF',
      description: 'Reference letter from previous hostel accommodation (expired)'
    }
  ]

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setDocuments(generateDummyDocuments())
      setLoading(false)
    }, 600)
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'id_card': return 'bg-blue-100 text-blue-800'
      case 'academic_record': return 'bg-green-100 text-green-800'
      case 'medical_certificate': return 'bg-purple-100 text-purple-800'
      case 'parent_consent': return 'bg-orange-100 text-orange-800'
      case 'payment_receipt': return 'bg-indigo-100 text-indigo-800'
      case 'hostel_agreement': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'rejected': return <AlertCircle className="h-4 w-4" />
      case 'expired': return <Calendar className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    return type.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const filteredDocuments = documents.filter(document => {
    const matchesType = filterType === 'all' || document.type === filterType
    const matchesStatus = filterStatus === 'all' || document.status === filterStatus
    const matchesSearch = document.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         document.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  const getDocumentCategories = (): DocumentCategory[] => {
    const categories = [
      { type: 'id_card', required: true },
      { type: 'academic_record', required: true },
      { type: 'medical_certificate', required: true },
      { type: 'parent_consent', required: true },
      { type: 'payment_receipt', required: true },
      { type: 'hostel_agreement', required: true }
    ]

    return categories.map(cat => {
      const docs = documents.filter(d => d.type === cat.type)
      const approvedDocs = docs.filter(d => d.status === 'approved')
      const pendingDocs = docs.filter(d => d.status === 'pending')
      
      let status: 'complete' | 'incomplete' | 'pending' = 'incomplete'
      if (approvedDocs.length > 0) status = 'complete'
      else if (pendingDocs.length > 0) status = 'pending'

      return {
        type: cat.type,
        count: docs.length,
        required: cat.required,
        status
      }
    })
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Add new document to list
    const newDoc: Document = {
      id: `DOC${String(documents.length + 1).padStart(3, '0')}`,
      name: selectedFile.name,
      type: 'other',
      status: 'pending',
      uploadedDate: new Date().toISOString().split('T')[0],
      size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: selectedFile.name.split('.').pop()?.toUpperCase() || 'Unknown',
      description: 'Newly uploaded document'
    }

    setDocuments(prev => [newDoc, ...prev])
    setSelectedFile(null)
    setShowUploadModal(false)
    setUploading(false)
  }

  const handleDelete = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
              <p className="text-gray-600">Manage your hostel-related documents</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Document Categories Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {getDocumentCategories().map((category) => (
            <Card key={category.type} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium capitalize">
                    {getTypeLabel(category.type)}
                  </CardTitle>
                  <Badge variant={category.required ? "default" : "secondary"}>
                    {category.required ? 'Required' : 'Optional'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">{category.count}</div>
                  <div className="flex items-center space-x-2">
                    {category.status === 'complete' && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {category.status === 'pending' && (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                    {category.status === 'incomplete' && (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`text-sm ${
                      category.status === 'complete' ? 'text-green-600' :
                      category.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FolderOpen className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Requirements
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Document Library</CardTitle>
            <CardDescription>View and manage all your uploaded documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Types</option>
                  <option value="id_card">ID Card</option>
                  <option value="academic_record">Academic Record</option>
                  <option value="medical_certificate">Medical Certificate</option>
                  <option value="parent_consent">Parent Consent</option>
                  <option value="payment_receipt">Payment Receipt</option>
                  <option value="hostel_agreement">Hostel Agreement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
                <Button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{document.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getTypeColor(document.type)}>
                              {getTypeLabel(document.type)}
                            </Badge>
                            <Badge className={getStatusColor(document.status)}>
                              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(document.status)}
                          <div className="text-right">
                            <div className="text-sm text-gray-600">{document.size}</div>
                            <div className="text-xs text-gray-500">{document.fileType}</div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{document.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Document Details</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div><span className="font-medium">Uploaded:</span> {new Date(document.uploadedDate).toLocaleDateString()}</div>
                            {document.expiryDate && (
                              <div><span className="font-medium">Expires:</span> {new Date(document.expiryDate).toLocaleDateString()}</div>
                            )}
                            {document.reviewer && (
                              <div><span className="font-medium">Reviewed by:</span> {document.reviewer}</div>
                            )}
                            {document.reviewDate && (
                              <div><span className="font-medium">Review date:</span> {new Date(document.reviewDate).toLocaleDateString()}</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">File Information</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div><span className="font-medium">Size:</span> {document.size}</div>
                            <div><span className="font-medium">Type:</span> {document.fileType}</div>
                            <div><span className="font-medium">ID:</span> {document.id}</div>
                          </div>
                        </div>
                      </div>

                      {document.notes && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Review Notes</h4>
                          <p className="text-sm text-gray-600">{document.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {document.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(document.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select document type</option>
                  <option value="id_card">ID Card</option>
                  <option value="academic_record">Academic Record</option>
                  <option value="medical_certificate">Medical Certificate</option>
                  <option value="parent_consent">Parent Consent</option>
                  <option value="payment_receipt">Payment Receipt</option>
                  <option value="hostel_agreement">Hostel Agreement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Brief description of the document..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || uploading}
                className="bg-green-600 hover:bg-green-700"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
