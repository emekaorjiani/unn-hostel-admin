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
import { studentService } from '@/lib/studentService'

interface Document {
  id: string
  name: string
  type: string
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

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        const data = await studentService.getDocuments()
        
        // Transform API data to match our interface
        const transformedDocuments: Document[] = data.map((doc: any) => ({
          id: doc.id,
          name: doc.name || doc.title || 'Document',
          type: doc.type || doc.category || 'other',
          status: doc.status || 'pending',
          uploadedDate: doc.uploaded_at || doc.created_at || new Date().toISOString(),
          expiryDate: doc.expiry_date || doc.expires_at,
          size: doc.size || 'Unknown',
          fileType: doc.file_type || doc.extension || 'Unknown',
          description: doc.description || doc.notes || 'No description provided',
          notes: doc.notes,
          reviewer: doc.reviewer,
          reviewDate: doc.review_date || doc.reviewed_at
        }))
        
        setDocuments(transformedDocuments)
      } catch (error) {
        console.error('Error fetching documents:', error)
        // Fallback to empty array if API fails
        setDocuments([])
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  // Filter documents based on type, status, and search query
  const filteredDocuments = documents.filter(document => {
    const matchesType = filterType === 'all' || document.type === filterType
    const matchesStatus = filterStatus === 'all' || document.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      document.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />
      case 'expired':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'id_card':
        return 'bg-blue-100 text-blue-800'
      case 'academic_record':
        return 'bg-purple-100 text-purple-800'
      case 'medical_certificate':
        return 'bg-green-100 text-green-800'
      case 'parent_consent':
        return 'bg-orange-100 text-orange-800'
      case 'payment_receipt':
        return 'bg-indigo-100 text-indigo-800'
      case 'hostel_agreement':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('type', 'document')
      formData.append('description', 'Uploaded document')

      await studentService.uploadDocument(formData)
      
      // Refresh documents list
      const updatedDocuments = await studentService.getDocuments()
      setDocuments(updatedDocuments)
      
      // Reset form
      setSelectedFile(null)
      setShowUploadModal(false)
    } catch (error) {
      console.error('Error uploading document:', error)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
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
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                  My Documents
                </h1>
                <p className="text-xs text-gray-600">Document management and verification</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'id_card', 'academic_record', 'medical_certificate', 'parent_consent', 'payment_receipt', 'hostel_agreement', 'other'].map((type) => (
                    <Button
                      key={type}
                      variant={filterType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType(type)}
                      className="capitalize"
                    >
                      {type.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {['all', 'pending', 'approved', 'rejected', 'expired'].map((status) => (
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

          {/* Documents List */}
          {filteredDocuments.length > 0 ? (
            <div className="grid gap-6">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {document.name}
                          </h3>
                          <Badge className={getTypeColor(document.type)}>
                            <span className="capitalize">{document.type.replace('_', ' ')}</span>
                          </Badge>
                          <Badge className={getStatusColor(document.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(document.status)}
                              <span className="capitalize">{document.status}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{document.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Uploaded: {new Date(document.uploadedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FolderOpen className="h-4 w-4" />
                            <span>Size: {document.size}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>Type: {document.fileType}</span>
                          </div>
                          {document.expiryDate && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>Expires: {new Date(document.expiryDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        {/* Review Information */}
                        {document.reviewer && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Reviewed by:</span> {document.reviewer}
                              {document.reviewDate && (
                                <span className="ml-2">
                                  on {new Date(document.reviewDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {document.notes && (
                              <p className="text-sm text-gray-600 mt-1">{document.notes}</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/student/documents/${document.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {document.status === 'approved' && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
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
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                    ? `No documents match your search criteria.`
                    : "You haven't uploaded any documents yet."
                  }
                </p>
                <Button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Your First Document
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Document Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Document Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
                  <div className="text-sm text-blue-600">Total Documents</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {documents.filter(doc => doc.status === 'pending').length}
                  </div>
                  <div className="text-sm text-yellow-600">Pending Review</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {documents.filter(doc => doc.status === 'approved').length}
                  </div>
                  <div className="text-sm text-green-600">Approved</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {documents.filter(doc => doc.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-red-600">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
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
                onClick={handleFileUpload}
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
