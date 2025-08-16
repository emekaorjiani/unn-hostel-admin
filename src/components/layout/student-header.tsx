'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { GraduationCap, Settings, HelpCircle, LogOut, User, Bell } from 'lucide-react'
import { ConfirmationModal } from '../ui/confirmation-modal'
import { authService } from '@/lib/auth'

interface StudentHeaderProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  onBackClick?: () => void
  className?: string
}

export default function StudentHeader({ 
  title = "Student Portal",
  subtitle = "UNN Hostel Management System",
  showBackButton = false,
  onBackClick,
  className = ""
}: StudentHeaderProps) {
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await authService.logoutStudent()
      // Clear any additional localStorage items
      localStorage.clear()
      window.location.href = '/student/auth/login'
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout API fails, clear local storage and redirect
      localStorage.clear()
      window.location.href = '/student/auth/login'
    }
  }

  const openLogoutModal = () => {
    setShowLogoutModal(true)
    setIsProfileOpen(false) // Close profile dropdown
  }

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      router.back()
    }
  }

  const studentProfile = authService.getStoredStudentProfile()

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackClick}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </Button>
              )}
              
              <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-xs text-gray-600">{subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4 mr-2" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Settings */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/student/settings')}
                className='cursor-pointer'
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>

              {/* Help */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/student/help')}
                className='cursor-pointer'
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>

              {/* Profile dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2"
                >
                  <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {(studentProfile as any)?.user?.first_name?.charAt(0) || (studentProfile as any)?.first_name?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <span className="hidden md:inline">Profile</span>
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>

                {/* Profile dropdown menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {(studentProfile as any)?.user?.first_name || (studentProfile as any)?.first_name || 'Student'} {(studentProfile as any)?.user?.last_name || (studentProfile as any)?.last_name || 'User'}
                      </p>
                                              <p className="text-xs text-gray-500">{(studentProfile as any)?.user?.email || (studentProfile as any)?.email || 'student@unn.edu.ng'}</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => router.push('/student/profile')}
                      className="w-full justify-start text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => router.push('/student/settings')}
                      className="w-full justify-start text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <div className="border-t border-gray-100">
                      <Button
                        variant="ghost"
                        onClick={openLogoutModal}
                        className="w-full justify-start text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={openLogoutModal}
                className="hidden md:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {isProfileOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsProfileOpen(false)}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        description="Are you sure you want to sign out? You will be redirected to the login page."
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  )
} 