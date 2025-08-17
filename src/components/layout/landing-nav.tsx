'use client'
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

interface LandingNavProps {
  variant?: 'default' | 'transparent';
  showButtons?: boolean;
}

const LandingNav: React.FC<LandingNavProps> = ({ 
  variant = 'default', 
  showButtons = true 
}) => {
  const navClasses = variant === 'transparent' 
    ? 'bg-transparent text-white' 
    : 'bg-green-700 text-white shadow-lg';

  return (
    <header className={`${navClasses} relative z-10`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href='/'>
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center">
             <img src={'./unn.png'}  />
            </div>
            <div>
              <h1 className="text-2xl font-bold">UNN Hostel Portal</h1>
              <p className={variant === 'transparent' ? 'text-green-100' : 'text-green-100'}>
                University of Nigeria, Nsukka
              </p>
            </div>
          </div>
          </Link>
          
          {showButtons && (
            <div className="flex space-x-4">
              <Button 
                variant="default" 
                className="bg-yellow-500"
                onClick={() => window.location.href = '/student/auth/login'}
              >
                Student Login
              </Button>
              <Button 
                variant="default" 
                className="btn-outline bg-green-700 text-white"
                onClick={() => window.location.href = '/auth/login'}
              >
                Admin Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default LandingNav; 