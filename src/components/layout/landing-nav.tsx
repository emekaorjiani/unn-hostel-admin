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
          
          {/* Desktop Navigation */}
          {showButtons && (
            <div className="hidden md:flex space-x-4">
              <Button 
                variant="default" 
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2"
                onClick={() => window.location.href = '/student/auth/login'}
              >
                Student Login
              </Button>
              <Button 
                variant="outline" 
                className="border-white bg-green-500 text-white hover:bg-white hover:text-green-700 font-semibold px-6 py-2"
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
              className="md:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
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
            className="md:hidden mt-4 pb-4 border-t border-white/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex flex-col space-y-3 pt-4">
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
                className="border-white bg-green-500 text-white hover:bg-white hover:text-green-700 font-semibold w-full py-3"
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