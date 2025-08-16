'use client'

import { useState, useEffect } from 'react'
import { authService } from '../../lib/auth'

export default function TestAuthPage() {
  const [authStatus, setAuthStatus] = useState<string>('Checking...')
  const [token, setToken] = useState<string>('')
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    const adminToken = localStorage.getItem('auth_token')
    const studentToken = localStorage.getItem('student_token')
    const adminProfile = localStorage.getItem('admin_profile')
    const studentProfile = localStorage.getItem('student_profile')

    if (adminToken) {
      setAuthStatus('Admin authenticated')
      setToken(adminToken)
      setProfile(adminProfile ? JSON.parse(adminProfile) : null)
    } else if (studentToken) {
      setAuthStatus('Student authenticated')
      setToken(studentToken)
      setProfile(studentProfile ? JSON.parse(studentProfile) : null)
    } else {
      setAuthStatus('Not authenticated')
      setToken('')
      setProfile(null)
    }
  }

  const testLogin = async () => {
    try {
      setAuthStatus('Logging in...')
      const result = await authService.login({
        email: 'admin@unn.edu.ng',
        password: 'password123'
      })
      setAuthStatus('Login successful!')
      setToken(result.accessToken)
      setProfile(result.admin)
    } catch (error) {
      setAuthStatus(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const testDashboardCall = async () => {
    if (!token) {
      setAuthStatus('No token available for dashboard test')
      return
    }

    try {
      setAuthStatus('Testing dashboard call...')
      const response = await fetch('https://api.unnaccomodation.com/api/admin/dashboard/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAuthStatus('Dashboard call successful!')
        console.log('Dashboard data:', data)
      } else {
        const errorData = await response.json()
        setAuthStatus(`Dashboard call failed: ${response.status} - ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      setAuthStatus(`Dashboard call error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const testDirectFetch = async () => {
    try {
      setAuthStatus('Testing direct fetch...')
      const response = await fetch('https://api.unnaccomodation.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          login_type: 'admin',
          email: 'admin@unn.edu.ng',
          password: 'password123'
        })
      })

      console.log('Direct fetch response status:', response.status)
      console.log('Direct fetch response headers:', response.headers)

      if (response.ok) {
        const data = await response.json()
        setAuthStatus('Direct fetch successful!')
        console.log('Direct fetch data:', data)
      } else {
        const errorData = await response.text()
        setAuthStatus(`Direct fetch failed: ${response.status} - ${errorData}`)
        console.log('Direct fetch error data:', errorData)
      }
    } catch (error) {
      setAuthStatus(`Direct fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const testMinimalFetch = async () => {
    try {
      setAuthStatus('Testing minimal fetch...')
      
      // Create request exactly like curl
      const requestBody = JSON.stringify({
        login_type: 'admin',
        email: 'admin@unn.edu.ng',
        password: 'password123'
      })
      
      const response = await fetch('https://api.unnaccomodation.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: requestBody
      })

      console.log('Minimal fetch response status:', response.status)
      console.log('Minimal fetch response headers:', [...response.headers.entries()])

      if (response.ok) {
        const data = await response.json()
        setAuthStatus('Minimal fetch successful!')
        console.log('Minimal fetch data:', data)
        
        // Store the token if successful
        if (data.success && data.data.token) {
          localStorage.setItem('auth_token', data.data.token)
          console.log('Token stored:', data.data.token)
        }
      } else {
        const errorData = await response.text()
        setAuthStatus(`Minimal fetch failed: ${response.status} - ${errorData}`)
        console.log('Minimal fetch error data:', errorData)
      }
    } catch (error) {
      setAuthStatus(`Minimal fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const clearAuth = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('student_token')
    localStorage.removeItem('admin_profile')
    localStorage.removeItem('student_profile')
    checkAuthStatus()
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <p className="mb-2"><strong>Status:</strong> {authStatus}</p>
          <p className="mb-2"><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}</p>
          {profile && (
            <div className="mt-4">
              <p><strong>Profile:</strong></p>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={testLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Login
            </button>
            
            <button
              onClick={testDashboardCall}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
            >
              Test Dashboard Call
            </button>
            
            <button
              onClick={testDirectFetch}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ml-2"
            >
              Test Direct Fetch
            </button>
            
            <button
              onClick={testMinimalFetch}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 ml-2"
            >
              Test Minimal Fetch
            </button>
            
            <button
              onClick={clearAuth}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
            >
              Clear Auth
            </button>
            
            <button
              onClick={checkAuthStatus}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
            >
              Refresh Status
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Test Login" to authenticate with the backend</li>
            <li>Check the status to see if authentication was successful</li>
            <li>Click "Test Dashboard Call" to verify the dashboard endpoint works</li>
            <li>If successful, go to the main dashboard page</li>
            <li>Use "Clear Auth" to reset and test again</li>
          </ol>
        </div>
      </div>
    </div>
  )
}




