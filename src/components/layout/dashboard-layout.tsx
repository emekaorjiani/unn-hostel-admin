'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '../../lib/auth'
import Sidebar from './sidebar'
import Header from './header'
import ClientProvider from '../providers/client-provider'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for both admin and student authentication
        const isAdminAuthenticated = authService.isAuthenticated()
        const isStudentAuthenticated = authService.isStudentAuthenticated()
        
        if (!isAdminAuthenticated && !isStudentAuthenticated) {
          router.push('/auth/login')
          return
        }

        // Verify token is still valid by getting profile
        if (isAdminAuthenticated) {
          await authService.getProfile()
        } else if (isStudentAuthenticated) {
          await authService.getStudentProfile()
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/auth/login')
      }
    }

    checkAuth()
  }, [router])

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ClientProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Main content area */}
        <div className="lg:ml-64">
          {/* Header */}
          <Header onMenuToggle={toggleSidebar} />

          {/* Page content */}
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ClientProvider>
  )
}
