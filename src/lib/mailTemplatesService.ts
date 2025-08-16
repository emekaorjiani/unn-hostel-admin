import { apiClient } from './api'

// Mail Template Interface
export interface MailTemplate {
  id: string
  name: string
  subject: string
  content: string
  variables: string[]
  type: 'email' | 'sms' | 'notification'
  category: 'general' | 'application' | 'payment' | 'maintenance' | 'security'
  is_active: boolean
  description?: string
  version: number
  created_by?: any
  updated_by?: any
  created_at: string
  updated_at: string
}

// Template Statistics Interface
export interface TemplateStats {
  total_templates: number
  active_templates: number
  email_templates: number
  sms_templates: number
  application_templates: number
  payment_templates: number
  maintenance_templates: number
  security_templates: number
}

// Template Options Interface
export interface TemplateOptions {
  categories: Array<{ value: string; label: string }>
  types: Array<{ value: string; label: string }>
}

// Pagination Interface
export interface Pagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
}

// API Response Interfaces
export interface MailTemplatesResponse {
  success: boolean
  message: string
  data: {
    templates: MailTemplate[]
    statistics: TemplateStats
    pagination: Pagination
  }
}

export interface MailTemplateResponse {
  success: boolean
  message: string
  data: MailTemplate
}

export interface TemplateOptionsResponse {
  success: boolean
  message: string
  data: TemplateOptions
}

export interface TemplatePreviewResponse {
  success: boolean
  message: string
  data: {
    subject: string
    content: string
    variables: string[]
  }
}

// Create Template Request Interface
export interface CreateTemplateRequest {
  name: string
  subject: string
  content: string
  variables: string[]
  type: 'email' | 'sms' | 'notification'
  category: 'general' | 'application' | 'payment' | 'maintenance' | 'security'
  description?: string
  is_active?: boolean
}

// Update Template Request Interface
export interface UpdateTemplateRequest {
  name?: string
  subject?: string
  content?: string
  variables?: string[]
  type?: 'email' | 'sms' | 'notification'
  category?: 'general' | 'application' | 'payment' | 'maintenance' | 'security'
  description?: string
  is_active?: boolean
}

// Preview Template Request Interface
export interface PreviewTemplateRequest {
  sample_data: Record<string, any>
}

// Mail Templates Service
export const mailTemplatesService = {
  // List templates with pagination and filters
  async getTemplates(params?: {
    page?: number
    limit?: number
    type?: string
    category?: string
    is_active?: boolean
    search?: string
  }): Promise<{ templates: MailTemplate[], statistics: TemplateStats, pagination: Pagination }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.type) queryParams.append('type', params.type)
      if (params?.category) queryParams.append('category', params.category)
      if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString())
      if (params?.search) queryParams.append('search', params.search)

      const response = await apiClient.get<MailTemplatesResponse>(`/admin/mail-templates?${queryParams.toString()}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching mail templates:', error)
      throw error
    }
  },

  // Get a single template by ID
  async getTemplate(id: string): Promise<MailTemplate> {
    try {
      const response = await apiClient.get<MailTemplateResponse>(`/admin/mail-templates/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching mail template:', error)
      throw error
    }
  },

  // Create a new template
  async createTemplate(data: CreateTemplateRequest): Promise<MailTemplate> {
    try {
      const response = await apiClient.post<MailTemplateResponse>('/admin/mail-templates', data)
      return response.data.data
    } catch (error) {
      console.error('Error creating mail template:', error)
      throw error
    }
  },

  // Update an existing template
  async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<MailTemplate> {
    try {
      const response = await apiClient.put<MailTemplateResponse>(`/admin/mail-templates/${id}`, data)
      return response.data.data
    } catch (error) {
      console.error('Error updating mail template:', error)
      throw error
    }
  },

  // Delete a template
  async deleteTemplate(id: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/mail-templates/${id}`)
    } catch (error) {
      console.error('Error deleting mail template:', error)
      throw error
    }
  },

  // Duplicate a template
  async duplicateTemplate(id: string): Promise<MailTemplate> {
    try {
      const response = await apiClient.post<MailTemplateResponse>(`/admin/mail-templates/${id}/duplicate`)
      return response.data.data
    } catch (error) {
      console.error('Error duplicating mail template:', error)
      throw error
    }
  },

  // Toggle template status
  async toggleTemplateStatus(id: string): Promise<{ id: string; is_active: boolean }> {
    try {
      const response = await apiClient.patch(`/admin/mail-templates/${id}/toggle-status`)
      return response.data.data
    } catch (error) {
      console.error('Error toggling template status:', error)
      throw error
    }
  },

  // Preview template with sample data
  async previewTemplate(id: string, sampleData: Record<string, any>): Promise<{
    subject: string
    content: string
    variables: string[]
  }> {
    try {
      const response = await apiClient.post<TemplatePreviewResponse>(
        `/admin/mail-templates/${id}/preview`,
        { sample_data: sampleData }
      )
      return response.data.data
    } catch (error) {
      console.error('Error previewing template:', error)
      throw error
    }
  },

  // Get template options (categories and types)
  async getTemplateOptions(): Promise<TemplateOptions> {
    try {
      const response = await apiClient.get<TemplateOptionsResponse>('/admin/mail-templates/options')
      return response.data.data
    } catch (error) {
      console.error('Error fetching template options:', error)
      throw error
    }
  },

  // Get templates by category
  async getTemplatesByCategory(category: string): Promise<MailTemplate[]> {
    try {
      const response = await this.getTemplates({ category })
      return response.templates
    } catch (error) {
      console.error('Error fetching templates by category:', error)
      throw error
    }
  },

  // Get active templates
  async getActiveTemplates(): Promise<MailTemplate[]> {
    try {
      const response = await this.getTemplates({ is_active: true })
      return response.templates
    } catch (error) {
      console.error('Error fetching active templates:', error)
      throw error
    }
  },

  // Search templates
  async searchTemplates(searchTerm: string): Promise<MailTemplate[]> {
    try {
      const response = await this.getTemplates({ search: searchTerm })
      return response.templates
    } catch (error) {
      console.error('Error searching templates:', error)
      throw error
    }
  },

  // Get template statistics
  async getTemplateStats(): Promise<TemplateStats> {
    try {
      const response = await this.getTemplates({ limit: 1 })
      return response.statistics
    } catch (error) {
      console.error('Error fetching template statistics:', error)
      throw error
    }
  }
}
