import React from 'react';
import { Button } from '../ui/button';

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
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">UNN Hostel Portal</h1>
              <p className={variant === 'transparent' ? 'text-green-100' : 'text-green-100'}>
                University of Nigeria, Nsukka
              </p>
            </div>
          </div>
          
          {showButtons && (
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
          )}
        </div>
      </div>
    </header>
  );
};

export default LandingNav; 