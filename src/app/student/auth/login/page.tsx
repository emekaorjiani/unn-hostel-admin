'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import LandingNav from '../../../../components/layout/landing-nav'
import { authService, MatricLoginCredentials } from '../../../../lib/auth'
import { Loader2 } from 'lucide-react'

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
      console.log("Student login form submitted with data:", { matricNumber: data.matricNumber, password: "***" });
      
      // Use the proper authentication service
      await authService.loginWithMatric(data as MatricLoginCredentials)
      router.push('/student/dashboard')
    } catch (err: unknown) {
      console.error("Student login error:", err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <LandingNav showButtons={true} />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Main Login Card - Everything Inside */}
          <Card className="shadow-2xl border-0 bg-white overflow-hidden">
            <CardContent className="p-8">
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-unn-700 rounded-full flex items-center justify-center shadow-lg">
                  <img 
                    src="/unn.png" 
                    alt="UNN Logo" 
                    className="h-10 w-10 object-contain"
                  />
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Student Sign In
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ready to access your hostel application and student services? 
                  <br />
                  <span className="text-green-600 font-medium">Let's get you signed in.</span>
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Matric Number Field */}
                <div className="space-y-2">
                  <label htmlFor="matricNumber" className="block text-sm font-medium text-gray-700">
                    Matric Number
                  </label>
                  <Input
                    id="matricNumber"
                    type="text"
                    {...register('matricNumber')}
                    placeholder="e.g., 2021/123456"
                    disabled={isLoading}
                    className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                  />
                  {errors.matricNumber && (
                    <p className="text-sm text-red-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {errors.matricNumber.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  style={{ backgroundColor: '#275b1c' }}
                  className="w-full h-12 bg-primary hover:bg-unn-800 text-white text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="text-white animation-spin" />
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Helpful Note */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">
                    Need help? Our support team is here for you
                  </p>
                  <button className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                    Get Support
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
