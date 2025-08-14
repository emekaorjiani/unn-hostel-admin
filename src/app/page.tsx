'use client'

import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { 
  Wifi, 
  Shield, 
  BookOpen, 
  Utensils, 
  Trophy, 
  Shirt,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

// Hero carousel data
const heroSlides = [
  {
    id: 1,
    image: "/images/hero-1.jpg",
    title: "Welcome to UNN Hostels",
    subtitle: "Your Home Away From Home",
    description: "Experience comfortable and secure accommodation in our prestigious halls of residence"
  },
  {
    id: 2,
    image: "/images/hero-2.jpg",
    title: "Modern Facilities",
    subtitle: "State-of-the-Art Amenities",
    description: "Enjoy modern conveniences designed to enhance your university experience"
  },
  {
    id: 3,
    image: "/images/hero-3.jpg",
    title: "Vibrant Community",
    subtitle: "Connect with Fellow Students",
    description: "Build lasting friendships in our diverse and inclusive hostel communities"
  }
]

// Simplified hostel data with amenities
const hostelSections = [
  {
    name: "Zik Hall",
    type: "Male Hostel",
    image: "/images/zik-hall.jpg",
    description: "Named after Dr. Nnamdi Azikiwe, the first President of Nigeria. A prestigious male hostel with modern amenities.",
    amenities: [
      { name: "WiFi", icon: Wifi },
      { name: "Security", icon: Shield },
      { name: "Study Rooms", icon: BookOpen },
      { name: "Cafeteria", icon: Utensils },
      { name: "Sports", icon: Trophy },
      { name: "Laundry", icon: Shirt }
    ]
  },
  {
    name: "Mariere Hall",
    type: "Male Hostel", 
    image: "/images/mariere-hall.jpg",
    description: "A modern male hostel with excellent facilities and a vibrant community atmosphere.",
    amenities: [
      { name: "WiFi", icon: Wifi },
      { name: "Security", icon: Shield },
      { name: "Study Rooms", icon: BookOpen },
      { name: "Cafeteria", icon: Utensils },
      { name: "Sports", icon: Trophy },
      { name: "Laundry", icon: Shirt }
    ]
  },
  {
    name: "Alvan Ikoku Hall",
    type: "Female Hostel",
    image: "/images/alvan-ikoku.jpg", 
    description: "Dedicated to female students with enhanced security and comfortable living spaces.",
    amenities: [
      { name: "WiFi", icon: Wifi },
      { name: "Security", icon: Shield },
      { name: "Study Rooms", icon: BookOpen },
      { name: "Cafeteria", icon: Utensils },
      { name: "Sports", icon: Trophy },
      { name: "Laundry", icon: Shirt }
    ]
  },
  {
    name: "Eni Njoku Hall",
    type: "Male Hostel",
    image: "/images/eni-njoku.jpg",
    description: "A well-maintained male hostel with excellent academic support facilities.",
    amenities: [
      { name: "WiFi", icon: Wifi },
      { name: "Security", icon: Shield },
      { name: "Study Rooms", icon: BookOpen },
      { name: "Cafeteria", icon: Utensils },
      { name: "Sports", icon: Trophy },
      { name: "Laundry", icon: Shirt }
    ]
  },
  {
    name: "Mellanby Hall",
    type: "Female Hostel",
    image: "/images/mellanby.jpg",
    description: "A comfortable female hostel with modern amenities and a supportive environment.",
    amenities: [
      { name: "WiFi", icon: Wifi },
      { name: "Security", icon: Shield },
      { name: "Study Rooms", icon: BookOpen },
      { name: "Cafeteria", icon: Utensils },
      { name: "Sports", icon: Trophy },
      { name: "Laundry", icon: Shirt }
    ]
  },
  {
    name: "Kuti Hall",
    type: "Male Hostel",
    image: "/images/kuti-hall.jpg",
    description: "A modern male hostel with excellent facilities and a vibrant community atmosphere.",
    amenities: [
      { name: "WiFi", icon: Wifi },
      { name: "Security", icon: Shield },
      { name: "Study Rooms", icon: BookOpen },
      { name: "Cafeteria", icon: Utensils },
      { name: "Sports", icon: Trophy },
      { name: "Laundry", icon: Shirt }
    ]
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-green-700 text-white shadow-lg relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">UNN Hostel Portal</h1>
                <p className="text-green-100">University of Nigeria, Nsukka</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="default" 
                className="btn-outline"
                onClick={() => window.location.href = '/student/auth/login'}
              >
                Student Login
              </Button>
              <Button 
                variant="default" 
                className="bg-green-700 text-white"
                onClick={() => window.location.href = '/auth/login'}
              >
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel Section */}
      <section className="relative h-[50vh]">
        {/* Carousel Images */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-4">
                <h2 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
                  {slide.title}
                </h2>
                <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-green-200">
                  {slide.subtitle}
                </h3>
                <p className="text-lg md:text-xl mb-8 text-gray-200">
                  {slide.description}
                </p>
                <Button className="btn-primary text-lg px-8 py-3">
                  Explore Hostels
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-green-200">6</div>
              <div className="text-green-100">Hostel Blocks</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-green-200">4,700+</div>
              <div className="text-green-100">Total Capacity</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-green-200">189</div>
              <div className="text-green-100">Available Beds</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hostel Sections */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Available Hostels
          </h2>
          
          <div className="space-y-8">
            {hostelSections.map((hostel, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hostel-card">
                <div className="flex flex-col md:flex-row">
                  {/* Hostel Image */}
                  <div className="md:w-1/2">
                    <img 
                      src={hostel.image} 
                      alt={hostel.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  
                  {/* Hostel Information */}
                  <div className="md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{hostel.name}</h3>
                        <p className="text-green-600 font-medium">{hostel.type}</p>
                        <p className="text-gray-600 text-sm mt-2">{hostel.description}</p>
                      </div>
                      
                      {/* Amenities */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Available Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {hostel.amenities.map((amenity, amenityIndex) => {
                            const IconComponent = amenity.icon;
                            return (
                              <div key={amenityIndex} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600 amenity-item">
                                <IconComponent size={12} />
                                <span>{amenity.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Apply Button */}
                    <button 
                      className="btn-primary px-6 py-2 rounded-lg font-medium text-white w-full md:w-auto"
                      onClick={() => window.location.href = '/student/auth/login'}
                    >
                      Apply for {hostel.name}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">How to Apply</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Create Account</h4>
              <p className="text-gray-600">Sign up with your student credentials</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Choose Hostel</h4>
              <p className="text-gray-600">Select your preferred accommodation</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Complete Application</h4>
              <p className="text-gray-600">Submit and wait for approval</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">UNN Hostel Portal</h4>
              <p className="text-green-100">
                Providing quality accommodation for students at the University of Nigeria, Nsukka.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-green-100">
                <li><a href="/student/auth/login" className="hover:text-white">Student Login</a></li>
                <li><a href="/auth/login" className="hover:text-white">Admin Login</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact Info</h5>
              <ul className="space-y-2 text-green-100">
                <li>Email: hostel@unn.edu.ng</li>
                <li>Phone: +234 803 123 4567</li>
                <li>Address: UNN Campus, Nsukka</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Office Hours</h5>
              <ul className="space-y-2 text-green-100">
                <li>Monday - Friday: 8:00 AM - 5:00 PM</li>
                <li>Saturday: 9:00 AM - 2:00 PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-100">
            <p>&copy; 2024 University of Nigeria, Nsukka. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
