'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { authService, MatricLoginCredentials } from '../../../../lib/auth'

// Student login form validation schema
const studentLoginSchema = z.object({
  matricNumber: z.string().regex(/^\d{4}\/\d{6}$/, 'Please enter a valid matric number (e.g., 2021/123456)'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type StudentLoginFormData = z.infer<typeof studentLoginSchema>

export default function StudentLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Form setup with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentLoginFormData>({
    resolver: zodResolver(studentLoginSchema),
  })

  // Handle form submission
  const onSubmit = async (data: StudentLoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      // Use the proper authentication service
      await authService.loginWithMatric(data as MatricLoginCredentials)
      router.push('/student/dashboard')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">UNN Student Portal</h1>
          <p className="mt-2 text-sm text-gray-600">
            Access your hostel application and student services
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Student Sign In</CardTitle>
            <CardDescription>
              Enter your matric number and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Matric Number Field */}
              <div>
                <label htmlFor="matricNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Matric Number
                </label>
                <Input
                  id="matricNumber"
                  type="text"
                  {...register('matricNumber')}
                  placeholder="2021/123456"
                  disabled={isLoading}
                />
                {errors.matricNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.matricNumber.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h4 className="text-sm font-medium text-green-900 mb-2">Demo Credentials</h4>
              <p className="text-xs text-green-700">
                Matric Number: 2020/123456<br />
                Password: student123
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 University of Nigeria, Nsukka. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
