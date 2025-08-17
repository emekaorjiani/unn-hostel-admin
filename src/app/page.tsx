'use client'

import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import LandingNav from '../components/layout/landing-nav'
import { motion } from 'motion/react'
import { 
  Wifi, 
  Shield, 
  Utensils, 
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Users,
  Calendar,
  ArrowRight
} from 'lucide-react'

// Typewriter effect component
const TypewriterText = ({ text, delay = 0, speed = 50 }: { text: string; delay?: number; speed?: number }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    // Reset state when component mounts or text changes
    setDisplayText('')
    setCurrentIndex(0)
    setIsTyping(false)

    // Start typing after delay
    const delayTimer = setTimeout(() => {
      setIsTyping(true)
    }, delay * 1000)

    return () => clearTimeout(delayTimer)
  }, [text, delay])

  useEffect(() => {
    if (!isTyping || currentIndex >= text.length) return

    const timer = setTimeout(() => {
      setDisplayText(prev => prev + text[currentIndex])
      setCurrentIndex(prev => prev + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, speed, isTyping])

  return (
    <span>
      {displayText}
      <motion.span
        className="inline-block w-0.5 h-6 bg-yellow-400 ml-1"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </span>
  )
}

const libraryImages = [
  '/library-1.jpg',
  '/unn10.webp',
  '/library2.jpg',
]

// Gallery data for dynamic rendering
const galleryData = [
  {
    id: 1,
    src: '/unn1.jpeg',
    alt: 'UNN Campus View 1',
    title: 'UNN Campus View',
    description: 'Beautiful campus landscape',
    height: 'h-80',
    delay: 0
  },
  {
    id: 2,
    src: '/unn2.jpg',
    alt: 'UNN Campus View 2',
    title: 'UNN Campus View',
    description: 'Academic excellence center',
    height: 'h-64',
    delay: 0.1
  },
  {
    id: 3,
    src: '/unn3.jpg',
    alt: 'UNN Campus View 3',
    title: 'UNN Campus View',
    description: 'Modern learning facilities',
    height: 'h-56',
    delay: 0.2
  },
  {
    id: 4,
    src: '/unn4.jpeg',
    alt: 'UNN Campus View 4',
    title: 'UNN Campus View',
    description: 'Student residential area',
    height: 'h-48',
    delay: 0.3
  },
  {
    id: 5,
    src: '/unn5.jpg',
    alt: 'UNN Campus View 5',
    title: 'UNN Campus View',
    description: 'Historic academic building',
    height: 'h-96',
    delay: 0.4
  },
  {
    id: 6,
    src: '/unn6.jpeg',
    alt: 'UNN Campus View 6',
    title: 'UNN Campus View',
    description: 'Student living quarters',
    height: 'h-72',
    delay: 0.5
  },
  {
    id: 7,
    src: '/unn7.jpg',
    alt: 'UNN Campus View 7',
    title: 'UNN Campus View',
    description: 'Knowledge and learning hub',
    height: 'h-60',
    delay: 0.6
  },
  {
    id: 8,
    src: '/unn8.jpeg',
    alt: 'UNN Campus View 8',
    title: 'UNN Campus View',
    description: 'Study and research space',
    height: 'h-52',
    delay: 0.7
  },
  {
    id: 9,
    src: '/unn9.jpeg',
    alt: 'UNN Campus View 9',
    title: 'UNN Campus View',
    description: 'Vibrant campus atmosphere',
    height: 'h-68',
    delay: 0.8
  },
  {
    id: 10,
    src: '/unn10.webp',
    alt: 'UNN Campus View 10',
    title: 'UNN Campus View',
    description: 'State-of-the-art amenities',
    height: 'h-56',
    delay: 0.9
  },
  {
    id: 11,
    src: '/library2.jpg',
    alt: 'UNN Campus View 11',
    title: 'UNN Campus View1',
    description: 'State-of-the-art amenities',
    height: 'h-56',
    delay: 0.9
  }
]

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % libraryImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Handle hash-based navigation for smooth scrolling from other routes
  useEffect(() => {
    // Check if there's a hash in the URL
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1) // Remove the # symbol
      const element = document.getElementById(hash)
      
      if (element) {
        // Small delay to ensure the page is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }, 100)
      }
    }
  }, []) // Run only once on component mount

  return (
    <div className="min-h-screen bg-black">
      <LandingNav />
      
      {/* Hero Section with Background Slider */}
      <section id="home" className="relative h-[90svh] flex items-center overflow-hidden">
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
              className="w-full h-[90svh] object-cover"
            />
            {/* Darker Overlay */}
            <div className="absolute inset-0 bg-black/70"></div>
          </div>
        ))}

        {/* Hero Content - Two Column Grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
            {/* Left Column - Text and CTA */}
            <motion.div 
              className="text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <motion.h1 
                  className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                >
                  University of Nigeria, Nsukka
                </motion.h1>
                <motion.p 
                  className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                >
                  <TypewriterText 
                    text="Nigeria's first autonomous university, founded in 1955 by Dr. Nnamdi Azikiwe. Experience world-class education across 17 faculties with over 300 academic programs."
                    delay={0.8}
                    speed={50}
                  />
                </motion.p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-green-800 hover:bg-green-900 text-white hover:text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => window.location.href = '/student/auth/login'}
                  >
                    Student Portal
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column - Placeholder Image */}
            <motion.div 
              className="hidden lg:flex justify-center items-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              <motion.div 
                className="relative overflow-hidden rounded-lg perspective-1000"
                style={{ perspective: '1000px' }}
              >
                <motion.img
                  src="/unn.png"
                  alt="UNN Hostel"
                  className="w-[200%] h-full object-cover transition-transform duration-300 ease-out"
                  style={{
                    transformStyle: 'preserve-3d',
                    filter: 'brightness(0.9) contrast(1.1) saturate(0.8)',
                    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;
                    
                    const rotateX = (mouseY - centerY) / (rect.height / 2) * -20;
                    const rotateY = (mouseX - centerX) / (rect.width / 2) * 20;
                    
                    e.currentTarget.style.transform = `
                      perspective(1000px) 
                      rotateX(${rotateX}deg) 
                      rotateY(${rotateY}deg) 
                      translateZ(30px)
                    `;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `
                      perspective(1000px) 
                      rotateX(0deg) 
                      rotateY(0deg) 
                      translateZ(0px)
                    `;
                  }}
                />
                {/* Enhanced shadow for 3D depth */}
                <motion.div 
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.1) 100%)',
                    transform: 'translateZ(-2px)',
                    filter: 'blur(1px)'
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Image Indicators */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        >
          {libraryImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-yellow-400 scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
            />
          ))}
        </motion.div>
      </section>

      {/* About UNN Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                  Restoring the dignity of man through
                  <span className="block relative">
                    excellence
                    <motion.div 
                      className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-400 transform -skew-x-12"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    ></motion.div>
                  </span>
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-700 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                >
                  The University of Nigeria, Nsukka is committed to creating a functional, globally competitive, and research-focused university that responds to society's needs while delivering world-class education and knowledge. Our mission is to place UNN at the forefront of research, development, innovative knowledge transfer, and human resources development in the global academic terrain.
                </motion.p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-green-800 hover:bg-green-900 text-white hover:text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => window.location.href = '/student/auth/login'}
                  >
                    Access Student Portal
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column - Image with Custom Clip-path */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative">
                {/* Main Image Container with Custom Clip-path */}
                <motion.div 
                  className="relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                  <img
                    src="/unn1.jpeg"
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
                </motion.div>

                {/* Abstract Decorative Elements */}
                <motion.div 
                  className="absolute -bottom-8 -left-8 w-32 h-32 bg-green-800 rounded-full opacity-80"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 0.8, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                ></motion.div>
                <motion.div 
                  className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-90"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 0.9, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                ></motion.div>
                
                {/* Dotted Pattern Overlays */}
                <motion.div 
                  className="absolute bottom-0 left-0 w-24 h-24 opacity-30"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                >
                  <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }}></div>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-0 right-0 w-32 h-32 opacity-30"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                >
                  <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }}></div>
                </motion.div>

                {/* Diagonal Lines */}
                <motion.div 
                  className="absolute top-0 right-0 w-20 h-20 opacity-40"
                  initial={{ opacity: 0, rotate: -45 }}
                  whileInView={{ opacity: 0.4, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                >
                  <div className="w-full h-full flex flex-col justify-center items-center space-y-1">
                    <div className="w-16 h-0.5 bg-black transform rotate-45"></div>
                    <div className="w-12 h-0.5 bg-black transform rotate-45"></div>
                    <div className="w-8 h-0.5 bg-black transform rotate-45"></div>
                  </div>
                </motion.div>
            </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Banner Section */}
      <section id="statistics" className="py-20 bg-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Image with Clip-path */}
            <motion.div 
              className="relative flex justify-center items-center order-last md:order-first"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative">
                {/* Main Image with Custom Clip-path */}
                <motion.div 
                  className="relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                  <img
                    src="/unn2.jpg"
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
                </motion.div>

                {/* Decorative Elements */}
                <motion.div 
                  className="absolute -bottom-8 -left-8 w-32 h-32 bg-yellow-400 rounded-full opacity-80"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 0.8, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                ></motion.div>
                <motion.div 
                  className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full opacity-90"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 0.9, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                ></motion.div>
                
                {/* Dotted Pattern Overlays */}
                <motion.div 
                  className="absolute bottom-0 left-0 w-24 h-24 opacity-30"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                >
                  <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }}></div>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-0 right-0 w-32 h-32 opacity-30"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                >
                  <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }}></div>
                </motion.div>

                {/* Diagonal Lines */}
                <motion.div 
                  className="absolute top-0 right-0 w-20 h-20 opacity-40"
                  initial={{ opacity: 0, rotate: -45 }}
                  whileInView={{ opacity: 0.4, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                >
                  <div className="w-full h-full flex flex-col justify-center items-center space-y-1">
                    <div className="w-16 h-0.5 bg-white transform rotate-45"></div>
                    <div className="w-12 h-0.5 bg-white transform rotate-45"></div>
                    <div className="w-8 h-0.5 bg-white transform rotate-45"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Positive UNN Statistics */}
            <motion.div 
              className="text-white order-first md:order-last"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="space-y-8">
                {/* First Positive Statistics Block */}
                <motion.div 
                  className="border-l-4 border-yellow-400 pl-6"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  <p className="text-xl leading-relaxed mb-2">
                    Founded in 1955 by Dr. Nnamdi Azikiwe, UNN became Nigeria's first autonomous university in 1960, establishing the foundation for indigenous higher education excellence in the country.
                  </p>
                  <p className="text-yellow-200 text-sm font-medium">
                    - Source: UNN Historical Records, 1960 Foundation
                  </p>
                </motion.div>

                {/* Second Positive Statistics Block */}
                <motion.div 
                  className="border-l-4 border-yellow-400 pl-6"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                >
                  <p className="text-xl leading-relaxed mb-2">
                    With 17 faculties, 102 academic departments, and over 300 academic programs, UNN offers the most comprehensive educational portfolio among Nigerian universities.
                  </p>
                  <p className="text-yellow-200 text-sm font-medium">
                    - Source: UNN Academic Affairs, Current Programs
                  </p>
                </motion.div>

                {/* Third Positive Statistics Block */}
                <motion.div 
                  className="border-l-4 border-yellow-400 pl-6"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                >
                  <p className="text-xl leading-relaxed mb-2">
                    UNN's mission to restore the dignity of man through research, innovation, and knowledge transfer has positioned it as a global leader in academic excellence and human development.
                  </p>
                  <p className="text-yellow-200 text-sm font-medium">
                    - Source: UNN Mission Statement, Core Values
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-black mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Academic Excellence & Services
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Discover the comprehensive range of academic programs, research opportunities, and student services at Nigeria's premier autonomous university
            </motion.p>
          </motion.div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Academic Excellence Card */}
            <motion.div 
              className="bg-green-50 rounded-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold text-black mb-2">Academic Excellence</h3>
              <p className="text-gray-600 text-sm">108 undergraduate and 211 postgraduate programs across 17 faculties</p>
            </motion.div>

            {/* Research & Innovation Card */}
            <motion.div 
              className="bg-yellow-50 rounded-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold text-black mb-2">Research & Innovation</h3>
              <p className="text-gray-600 text-sm">Cutting-edge research across diverse disciplines addressing global challenges</p>
            </motion.div>

            {/* Global Competitiveness Card - Spans 2 rows */}
            <motion.div 
              className="bg-gradient-to-br from-green-800 to-green-900 rounded-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer md:row-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-4">UNN's Mission: Restore the Dignity of Man</h3>
                <p className="text-green-100 mb-6">Join Nigeria's first autonomous university in its mission to create a globally competitive, research-focused institution that responds to society's needs</p>
                <motion.button 
                  className="bg-white text-green-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              className="bg-yellow-50 rounded-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold text-black mb-2">Student Life & Culture</h3>
              <p className="text-gray-600 text-sm">Vibrant campus community with over 100 student organizations and cultural activities</p>
            </motion.div>

            {/* Modern Infrastructure Card */}
            <div className="bg-green-50 rounded-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <h3 className="text-xl font-semibold text-black mb-2">Modern Infrastructure</h3>
              <p className="text-gray-600 text-sm">State-of-the-art facilities across three campuses in Nsukka, Enugu, and Ituku-Ozalla</p>
            </div>

            {/* Human Resource Development Card - Spans 2 columns */}
            <div className="bg-gradient-to-r from-green-800 to-green-900 rounded-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer md:col-span-2">
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
            <div className="bg-yellow-50 rounded-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <h3 className="text-xl font-semibold text-black mb-2">Digital Transformation</h3>
              <p className="text-gray-600 text-sm">Modern digital platforms and technologies enhancing the educational experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Numbers Section */}
      <section id="numbers" className="py-20 bg-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-4xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
              >
                5000+
              </motion.div>
              <div className="text-green-100">Happy Students</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-4xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: "backOut" }}
              >
                15+
              </motion.div>
              <div className="text-green-100">Hostel Buildings</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-4xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4, ease: "backOut" }}
              >
                98%
              </motion.div>
              <div className="text-green-100">Satisfaction Rate</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-4xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5, ease: "backOut" }}
              >
                24/7
              </motion.div>
              <div className="text-green-100">Support Available</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2 
              className="text-4xl font-bold text-black mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Campus Gallery
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Explore the beautiful facilities and vibrant campus life at the University of Nigeria, Nsukka
            </motion.p>
          </motion.div>

          {/* Dynamic Gallery Grid with Varying Sizes */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryData.map((item) => (
              <motion.div 
                key={item.id}
                className="group cursor-pointer break-inside-avoid mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: item.delay, ease: "easeOut" }}
                whileHover={{ y: -5 }}
              >
                <div className="relative overflow-hidden rounded shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <motion.img
                    src={item.src}
                    alt={item.alt}
                    className={`w-full ${item.height} object-cover group-hover:scale-105 transition-transform duration-300`}
                    whileHover={{ scale: 1.05 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-200 text-sm">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Shield className="h-8 w-8 text-green-800" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">24/7 Security</h3>
              <p className="text-gray-200">Round-the-clock security personnel and CCTV monitoring</p>
            </motion.div>

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
      <section id="news" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-black mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              UNN News & Announcements
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Stay informed about the latest academic developments, research breakthroughs, and official announcements from the University of Nigeria, Nsukka
            </motion.p>
          </motion.div>

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
