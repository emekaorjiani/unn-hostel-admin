#!/bin/bash

# Environment Setup Script for UNN Hostel Admin
# This script helps you set up your environment variables

echo "🚀 Setting up environment for UNN Hostel Admin..."

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Do you want to overwrite it? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "📝 Overwriting .env.local..."
    else
        echo "❌ Setup cancelled. .env.local was not modified."
        exit 0
    fi
fi

# Create .env.local file
cat > .env.local << EOF
# Backend API Configuration
NEXT_PUBLIC_BACKEND_API_URL=https://api.unnaccomodation.com/api/v1
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

echo "✅ Environment file created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local with your specific values"
echo "2. Make sure your backend API is running on the configured URL"
echo "3. Start the development server with: npm run dev"
echo ""
echo "🔧 Important: Update JWT_SECRET with a secure random string for production"
echo ""
echo "📖 For more information, see ENVIRONMENT_CONFIGURATION.md"
