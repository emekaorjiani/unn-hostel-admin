#!/bin/bash

# Update API URL Script for UNN Hostel Admin
# This script updates the API URL to use the production endpoint

echo "🔄 Updating API URL to production endpoint..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found. Creating it with production settings..."
    cat > .env.local << EOF
# Backend API Configuration
BACKEND_API_URL=https://api.unnaccomodation.com/api/v1

# Frontend Configuration
NEXT_PUBLIC_APP_NAME="UNN Hostel Admin"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# API Configuration
API_TIMEOUT=30000
API_RETRY_ATTEMPTS=3

# Authentication Configuration
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRES_IN=24h

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true

# Dashboard Configuration
DASHBOARD_REFRESH_INTERVAL=30000
DASHBOARD_MAX_RETRIES=3
EOF
    echo "✅ Created .env.local with production API URL"
else
    echo "📝 Updating existing .env.local file..."
    
    # Update the BACKEND_API_URL line
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' 's|BACKEND_API_URL=.*|BACKEND_API_URL=https://api.unnaccomodation.com/api/v1|' .env.local
    else
        # Linux
        sed -i 's|BACKEND_API_URL=.*|BACKEND_API_URL=https://api.unnaccomodation.com/api/v1|' .env.local
    fi
    
    echo "✅ Updated .env.local with production API URL"
fi

echo ""
echo "🎯 API URL has been updated to: https://api.unnaccomodation.com/api/v1"
echo ""
echo "📋 Next steps:"
echo "1. Restart your development server: npm run dev"
echo "2. Test the application to ensure it connects to the production API"
echo "3. Check the browser console for any connection errors"
echo ""
echo "🔧 If you need to switch back to localhost for development:"
echo "   Edit .env.local and change BACKEND_API_URL to: http://localhost:3033/api/v1"
