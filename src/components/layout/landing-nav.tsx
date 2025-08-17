'use client'
import React, { useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingNavProps {
  variant?: 'default' | 'transparent';
  showButtons?: boolean;
}

const LandingNav: React.FC<LandingNavProps> = ({ 
  variant = 'default', 
  showButtons = true 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navClasses = variant === 'transparent' 
    ? 'bg-transparent text-white' 
    : 'bg-green-700 text-white shadow-lg';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'features', label: 'Features' },
    { id: 'news', label: 'News' }
  ];

  return (
    <header className={`${navClasses} sticky top-0 relative z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href='/'>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center bg-white/10">
                <img 
                  src={'./unn.png'} 
                  alt="UNN Logo"
                  className="h-8 w-8 md:h-10 md:w-10 object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-2xl font-bold">UNN Hostel Portal</h1>
                <p className={`text-xs md:text-sm ${variant === 'transparent' ? 'text-green-100' : 'text-green-100'}`}>
                  University of Nigeria, Nsukka
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold">UNN</h1>
                <p className={`text-xs ${variant === 'transparent' ? 'text-green-100' : 'text-green-100'}`}>
                  Hostel Portal
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm uppercase tracking-wide"
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Desktop Navigation Buttons */}
          {showButtons && (
            <div className="hidden md:flex space-x-4">
              <Button 
                variant="default" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2"
                onClick={() => window.location.href = '/student/auth/login'}
              >
                Student Login
              </Button>
              <Button 
                variant="outline" 
                className="bg-green-700 hover:bg-green-800 text-white border-white hover:border-white font-semibold px-6 py-2"
                onClick={() => window.location.href = '/auth/login'}
              >
                Admin Login
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {showButtons && (
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && showButtons && (
          <motion.div 
            className="lg:hidden mt-4 pb-4 border-t border-white/20 h-screen"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-3 pt-4 mb-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-white hover:text-yellow-300 transition-colors duration-200 font-medium py-2 px-4 rounded-md hover:bg-white/10"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Login Buttons */}
            <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
              <Button 
                variant="default" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full py-3"
                onClick={() => {
                  window.location.href = '/student/auth/login';
                  setIsMobileMenuOpen(false);
                }}
              >
                Student Login
              </Button>
              <Button 
                variant="outline" 
                className="bg-green-700 hover:bg-green-800 text-white border-white hover:border-white font-semibold w-full py-3"
                onClick={() => {
                  window.location.href = '/auth/login';
                  setIsMobileMenuOpen(false);
                }}
              >
                Admin Login
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default LandingNav; 