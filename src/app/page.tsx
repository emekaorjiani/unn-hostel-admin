'use client'

import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import LandingNav from '../components/layout/landing-nav'
import { 
  Wifi, 
  Shield, 
  Utensils, 
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  GraduationCap,
  Users,
  Calendar,
  ArrowRight
} from 'lucide-react'

const libraryImages = [
  '/library-1.jpg',
  '/library2.jpg',
  
]

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % libraryImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <LandingNav />
      
      {/* Hero Section with Background Slider */}
      <section className="relative h-[87svh] flex items-center overflow-hidden">
        {/* Background Images */}
        {libraryImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Library ${index + 1}`}
              className="w-full h-[87svh] object-cover"
            />
            {/* Darker Overlay */}
            <div className="absolute inset-0 bg-black/70"></div>
          </div>
        ))}

        {/* Hero Content - Two Column Grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
            {/* Left Column - Text and CTA */}
            <div className="text-white">
              <div className="mb-6">
                {/* <GraduationCap className="h-20 w-20 text-yellow-400 mb-4" /> */}
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                  University of Nigeria, Nsukka
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
                  Nigeria's first autonomous university, founded in 1955 by Dr. Nnamdi Azikiwe. Experience world-class education across 17 faculties with over 300 academic programs.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-green-800 hover:bg-green-900 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.location.href = '/student/auth/login'}
                >
                  Student Portal
                </Button>
              </div>
            </div>

            {/* Right Column - Placeholder Image */}
            {/* <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                <img
                  src="/placeholder.png"
                  alt="UNN Hostel"
                  className="w-[100%] h-[200px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
          {libraryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-yellow-400 scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* About UNN Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <div>
              <div className="mb-6">
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
                  Restoring the dignity of man through
                  <span className="block relative">
                    excellence
                    <div className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-400 transform -skew-x-12"></div>
                  </span>
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
                  The University of Nigeria, Nsukka is committed to creating a functional, globally competitive, and research-focused university that responds to society's needs while delivering world-class education and knowledge. Our mission is to place UNN at the forefront of research, development, innovative knowledge transfer, and human resources development in the global academic terrain.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-green-800 hover:bg-green-900 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.location.href = '/student/auth/login'}
                >
                  Access Student Portal
                </Button>
              </div>
            </div>

            {/* Right Column - Image with Custom Clip-path */}
            <div className="relative">
              <div className="relative">
                {/* Main Image Container with Custom Clip-path */}
                <div className="relative overflow-hidden">
                  <img
                    src="/images/mellanby.jpg"
                    alt="UNN Campus"
                    className="w-full h-96 object-cover"
                    style={{
                      clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)'
                    }}
                  />
                  
                  {/* Dark Green Overlay with Custom Shape */}
                  <div 
                    className="absolute inset-0 bg-green-800 opacity-20"
                    style={{
                      clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)'
                    }}
                  ></div>
                </div>

                {/* Abstract Decorative Elements */}
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-green-800 rounded-full opacity-80"></div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-90"></div>
                
                {/* Dotted Pattern Overlays */}
                <div className="absolute bottom-0 left-0 w-24 h-24 opacity-30">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }}></div>
                </div>
                
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-30">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }}></div>
                </div>

                {/* Diagonal Lines */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-40">
                  <div className="w-full h-full flex flex-col justify-center items-center space-y-1">
                    <div className="w-16 h-0.5 bg-black transform rotate-45"></div>
                    <div className="w-12 h-0.5 bg-black transform rotate-45"></div>
                    <div className="w-8 h-0.5 bg-black transform rotate-45"></div>
                  </div>
                </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Banner Section */}
      <section className="py-20 bg-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Image with Clip-path */}
            <div className="relative flex justify-center items-center">
              <div className="relative">
                {/* Main Image with Custom Clip-path */}
                <div className="relative overflow-hidden">
                  <img
                    src="/images/zik-hall.jpg"
                    alt="UNN Campus Excellence"
                    className="w-full h-96 object-cover"
                    style={{
                      clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)'
                    }}
                  />
                  
                  {/* Dark Green Overlay with Custom Shape */}
                  <div 
                    className="absolute inset-0 bg-green-900 opacity-30"
                    style={{
                      clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)'
                    }}
                  ></div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-yellow-400 rounded-full opacity-80"></div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full opacity-90"></div>
                
                {/* Dotted Pattern Overlays */}
                <div className="absolute bottom-0 left-0 w-24 h-24 opacity-30">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }}></div>
                </div>
                
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-30">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }}></div>
                </div>

                {/* Diagonal Lines */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-40">
                  <div className="w-full h-full flex flex-col justify-center items-center space-y-1">
                    <div className="w-16 h-0.5 bg-white transform rotate-45"></div>
                    <div className="w-12 h-0.5 bg-white transform rotate-45"></div>
                    <div className="w-8 h-0.5 bg-white transform rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Positive UNN Statistics */}
            <div className="text-white">
              <div className="space-y-8">
                {/* First Positive Statistics Block */}
                <div className="border-l-4 border-yellow-400 pl-6">
                  <p className="text-xl leading-relaxed mb-2">
                    Founded in 1955 by Dr. Nnamdi Azikiwe, UNN became Nigeria's first autonomous university in 1960, establishing the foundation for indigenous higher education excellence in the country.
                  </p>
                  <p className="text-yellow-200 text-sm font-medium">
                    - Source: UNN Historical Records, 1960 Foundation
                  </p>
                </div>

                {/* Second Positive Statistics Block */}
                <div className="border-l-4 border-yellow-400 pl-6">
                  <p className="text-xl leading-relaxed mb-2">
                    With 17 faculties, 102 academic departments, and over 300 academic programs, UNN offers the most comprehensive educational portfolio among Nigerian universities.
                  </p>
                  <p className="text-yellow-200 text-sm font-medium">
                    - Source: UNN Academic Affairs, Current Programs
                  </p>
                </div>

                {/* Third Positive Statistics Block */}
                <div className="border-l-4 border-yellow-400 pl-6">
                  <p className="text-xl leading-relaxed mb-2">
                    UNN's mission to restore the dignity of man through research, innovation, and knowledge transfer has positioned it as a global leader in academic excellence and human development.
                  </p>
                  <p className="text-yellow-200 text-sm font-medium">
                    - Source: UNN Mission Statement, Core Values
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Academic Excellence & Services
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover the comprehensive range of academic programs, research opportunities, and student services at Nigeria's premier autonomous university
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Academic Excellence Card */}
            <div className="bg-green-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13.426m0-13.426a4.5 4.5 0 100 5.292m0-5.292a4.5 4.5 0 110 5.292m0 5.292V21m0-5.292a4.5 4.5 0 100 5.292m0-5.292a4.5 4.5 0 110 5.292" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Academic Excellence</h3>
              <p className="text-gray-600 text-sm">108 undergraduate and 211 postgraduate programs across 17 faculties</p>
            </div>

            {/* Research & Innovation Card */}
            <div className="bg-yellow-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Research & Innovation</h3>
              <p className="text-gray-600 text-sm">Cutting-edge research across diverse disciplines addressing global challenges</p>
            </div>

            {/* Global Competitiveness Card - Spans 2 rows */}
            <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer md:row-span-2">
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-4">UNN's Mission: Restore the Dignity of Man</h3>
                <p className="text-green-100 mb-6">Join Nigeria's first autonomous university in its mission to create a globally competitive, research-focused institution that responds to society's needs</p>
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <svg className="h-16 w-16 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13.426m0-13.426a4.5 4.5 0 100 5.292m0-5.292a4.5 4.5 0 110 5.292m0 5.292V21m0-5.292a4.5 4.5 0 100 5.292m0-5.292a4.5 4.5 0 110 5.292" />
                  </svg>
                </div>
                <button className="bg-white text-green-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors w-full">
                  Learn More
                </button>
              </div>
            </div>

            {/* Modern Infrastructure Card */}
            <div className="bg-green-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0a1 1 0 011-1h2a1 1 0 011 1v5m-4 0a1 1 0 011-1h2a1 1 0 011 1v5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Modern Infrastructure</h3>
              <p className="text-gray-600 text-sm">State-of-the-art facilities across three campuses in Nsukka, Enugu, and Ituku-Ozalla</p>
            </div>

            {/* Human Resource Development Card - Spans 2 columns */}
            <div className="bg-gradient-to-r from-green-800 to-green-900 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer md:col-span-2">
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-4">Comprehensive Academic Portfolio</h3>
                <p className="text-xl font-semibold mb-4">17 Faculties / 102 Departments / 300+ Academic Programs</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13.426m0-13.426a4.5 4.5 0 100 5.292m0-5.292a4.5 4.5 0 110 5.292m0 5.292V21m0-5.292a4.5 4.5 0 100 5.292m0-5.292a4.5 4.5 0 110 5.292" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0a1 1 0 011-1h2a1 1 0 011 1v5m-4 0a1 1 0 011-1h2a1 1 0 011 1v5" />
                      </svg>
                    </div>
                  </div>
                  <button className="bg-white text-green-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                    Explore Programs
                  </button>
                </div>
              </div>
            </div>

            {/* Digital Transformation Card */}
            <div className="bg-yellow-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Digital Transformation</h3>
              <p className="text-gray-600 text-sm">Modern digital platforms and technologies enhancing the educational experience</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">5000+</div>
              <div className="text-green-100">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-green-100">Hostel Buildings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-green-100">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-green-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Campus Gallery</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the beautiful facilities and vibrant campus life at the University of Nigeria, Nsukka
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Library Images */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/images/mellanby.jpg"
                  alt="Mellanby Hall"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Mellanby Hall</h3>
                  <p className="text-gray-200 text-sm">Historic academic building</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/images/zik-hall.jpg"
                  alt="Zik Hall"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Zik Hall</h3>
                  <p className="text-gray-200 text-sm">Student accommodation facility</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/images/kuti-hall.jpg"
                  alt="Kuti Hall"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Kuti Hall</h3>
                  <p className="text-gray-200 text-sm">Modern hostel complex</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/images/mariere-hall.jpg"
                  alt="Mariere Hall"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Mariere Hall</h3>
                  <p className="text-gray-200 text-sm">Student residential hall</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/images/alvan-ikoku.jpg"
                  alt="Alvan Ikoku Hall"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Alvan Ikoku Hall</h3>
                  <p className="text-gray-200 text-sm">Academic excellence center</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/images/eni-njoku.jpg"
                  alt="Eni Njoku Hall"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Eni Njoku Hall</h3>
                  <p className="text-gray-200 text-sm">Student living quarters</p>
                </div>
              </div>
            </div>

            {/* Additional Images from Public Folder */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/library-1.jpg"
                  alt="Library Building"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Main Library</h3>
                  <p className="text-gray-200 text-sm">Knowledge and learning hub</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/library2.jpg"
                  alt="Library Interior"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Library Interior</h3>
                  <p className="text-gray-200 text-sm">Study and research space</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/images/hero-1.jpg"
                  alt="Campus View"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Campus View</h3>
                  <p className="text-gray-200 text-sm">Beautiful campus landscape</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/images/hero-2.jpg"
                  alt="Academic Building"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Academic Building</h3>
                  <p className="text-gray-200 text-sm">Modern learning facilities</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/images/hero-3.jpg"
                  alt="Student Life"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Student Life</h3>
                  <p className="text-gray-200 text-sm">Vibrant campus atmosphere</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/placeholder.png"
                  alt="Campus Facilities"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Campus Facilities</h3>
                  <p className="text-gray-200 text-sm">State-of-the-art amenities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Security</h3>
              <p className="text-gray-200">Round-the-clock security personnel and CCTV monitoring</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-green-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">High-Speed WiFi</h3>
              <p className="text-gray-200">Reliable internet connectivity for your studies</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-green-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Modern Facilities</h3>
              <p className="text-gray-200">Well-equipped common areas and study spaces</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Living</h3>
              <p className="text-gray-200">Build lasting friendships in a supportive environment</p>
            </div>
          </div>
        </div>
      </section>

      {/* News and Blog Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              UNN News & Announcements
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Stay informed about the latest academic developments, research breakthroughs, and official announcements from the University of Nigeria, Nsukka
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Blog Post 1 */}
            <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src="/images/mellanby.jpg"
                  alt="UNN Academic Excellence"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Academic
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>December 15, 2024</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-green-800 transition-colors">
                  UNN Celebrates 64 Years of Academic Excellence
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  The University of Nigeria, Nsukka marks another milestone in its journey as Nigeria's first autonomous university, continuing its legacy of innovation and academic leadership.
                </p>
                <a href="#" className="inline-flex items-center text-green-800 font-semibold hover:text-green-900 transition-colors">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </div>
            </article>

            {/* Blog Post 2 */}
            <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src="/images/zik-hall.jpg"
                  alt="UNN Research Innovation"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
                    Research
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>December 12, 2024</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-green-800 transition-colors">
                  Groundbreaking Research Initiatives at UNN
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  UNN researchers are leading innovative projects across 17 faculties, addressing global challenges and advancing knowledge in diverse academic disciplines.
                </p>
                <a href="#" className="inline-flex items-center text-green-800 font-semibold hover:text-green-900 transition-colors">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </div>
            </article>

            {/* Blog Post 3 */}
            <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src="/images/kuti-hall.jpg"
                  alt="UNN Student Success"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Students
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>December 10, 2024</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-green-800 transition-colors">
                  Student Success Stories: UNN Alumni Achievements
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  Discover how UNN graduates are making significant contributions across various sectors, embodying the university's mission to restore the dignity of man.
                </p>
                <a href="#" className="inline-flex items-center text-green-800 font-semibold hover:text-green-900 transition-colors">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </div>
            </article>

            {/* Blog Post 4 */}
            <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src="/images/mariere-hall.jpg"
                  alt="UNN Global Recognition"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
                    Global
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>December 8, 2024</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-green-800 transition-colors">
                  UNN's Global Academic Partnerships
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  The university continues to strengthen international collaborations, positioning itself as a globally competitive institution in research and education.
                </p>
                <a href="#" className="inline-flex items-center text-green-800 font-semibold hover:text-green-900 transition-colors">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </div>
            </article>
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-green-800 hover:bg-green-900 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = '/news'}
            >
              View All News
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">UNN Hostel Portal</h3>
              <p className="text-gray-200">
                Providing quality accommodation for students at the University of Nigeria, Nsukka - Nigeria's first autonomous university since 1960.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-200">
                <li><a href="/student/auth/login" className="hover:text-white transition-colors">Student Login</a></li>
                <li><a href="/auth/login" className="hover:text-white transition-colors">Admin Login</a></li>
                <li><a href="/help" className="hover:text-white transition-colors">Help & Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-200">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Nsukka, Enugu State, Nigeria</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+234 123 456 7890</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>hostels@unn.edu.ng</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-200 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-200 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-200 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-200 hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-200">
            <p>&copy; 2024 UNN Hostel Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
