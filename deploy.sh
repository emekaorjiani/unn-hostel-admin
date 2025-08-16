#!/bin/bash

# Deployment Script for UNN Hostel Admin - HestiaCP Edition
# This script builds and deploys the Next.js application to HestiaCP server

set -e  # Exit on any error

echo "🚀 Starting deployment of UNN Hostel Admin to HestiaCP..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Creating production environment file..."
    cat > .env.local << EOF
# Backend API Configuration
NEXT_PUBLIC_BACKEND_API_URL=https://api.unnaccomodation.com/api
BACKEND_API_URL=https://api.unnaccomodation.com/api

# Frontend Configuration
NEXT_PUBLIC_APP_NAME="UNN Hostel Admin"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# API Configuration
API_TIMEOUT=30000
API_RETRY_ATTEMPTS=3

# Authentication Configuration
JWT_SECRET=your-production-jwt-secret-key-here
JWT_EXPIRES_IN=24h

# Production Configuration
NODE_ENV=production
NEXT_PUBLIC_DEBUG_MODE=false

# Dashboard Configuration
DASHBOARD_REFRESH_INTERVAL=30000
DASHBOARD_MAX_RETRIES=3
EOF
    print_success "Created .env.local with production settings"
fi

# Clean previous build
print_status "Cleaning previous build..."
rm -rf .next
rm -rf out

# Install dependencies
print_status "Installing dependencies with Yarn..."
yarn install --frozen-lockfile

# Run linting
print_status "Running linting..."
yarn lint

# Build the application
print_status "Building the application..."
yarn build

# Create production start script
print_status "Creating production start script..."
cat > start-production.sh << 'EOF'
#!/bin/bash

# Production start script for UNN Hostel Admin
export NODE_ENV=production
export PORT=${PORT:-3000}

echo "🚀 Starting UNN Hostel Admin on port $PORT..."

# Start the application
yarn start
EOF

chmod +x start-production.sh

# Create PM2 ecosystem file for process management
print_status "Creating PM2 ecosystem file..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'unn-hostel-admin',
    script: 'yarn',
    args: 'start',
    cwd: './',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Create HestiaCP Nginx configuration
print_status "Creating HestiaCP Nginx configuration..."
cat > hestiacp-nginx.conf << 'EOF'
# HestiaCP Nginx Configuration for UNN Hostel Admin
# Place this in your HestiaCP web domain configuration

# Handle Next.js static files
location /_next/static {
    alias /home/admin/web/your-domain.com/public_html/.next/static;
    expires 365d;
    access_log off;
    add_header Cache-Control "public, immutable";
}

# Handle public files
location /public {
    alias /home/admin/web/your-domain.com/public_html/public;
    expires 30d;
    access_log off;
}

# Handle API routes
location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

# Handle all other routes (Next.js will handle routing)
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
EOF

# Create systemd service file for HestiaCP
print_status "Creating systemd service file..."
cat > unn-hostel-admin.service << 'EOF'
[Unit]
Description=UNN Hostel Admin Next.js Application
After=network.target

[Service]
Type=simple
User=admin
WorkingDirectory=/home/admin/web/unnaccomodation.com/public_html
ExecStart=/usr/bin/yarn start
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Create HestiaCP deployment helper script
print_status "Creating HestiaCP deployment helper..."
cat > hestiacp-deploy.sh << 'EOF'
#!/bin/bash

# HestiaCP Deployment Helper Script
# This script helps deploy the app to HestiaCP environment

echo "🔧 HestiaCP Deployment Helper"
echo "=============================="

# Get domain name
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN_NAME

# Get HestiaCP user (usually 'admin')
read -p "Enter your HestiaCP username (default: admin): " HESTIA_USER
HESTIA_USER=${HESTIA_USER:-admin}

# Create web directory if it doesn't exist
WEB_DIR="/home/$HESTIA_USER/web/$DOMAIN_NAME/public_html"
echo "📁 Setting up web directory: $WEB_DIR"

# Create directory structure
sudo mkdir -p "$WEB_DIR"
sudo chown -R $HESTIA_USER:$HESTIA_USER "$WEB_DIR"

# Copy application files
echo "📦 Copying application files..."
cp -r . "$WEB_DIR/"
cd "$WEB_DIR"

# Set proper permissions
sudo chown -R $HESTIA_USER:$HESTIA_USER "$WEB_DIR"
sudo chmod -R 755 "$WEB_DIR"
sudo chmod 600 "$WEB_DIR/.env.local"

# Install dependencies and build
echo "🔨 Installing dependencies and building..."
yarn install --frozen-lockfile
yarn build

# Update Nginx configuration
echo "🌐 Updating Nginx configuration..."
sudo cp hestiacp-nginx.conf /home/$HESTIA_USER/conf/web/$DOMAIN_NAME.nginx.ssl.conf

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Start the application: pm2 start ecosystem.config.js"
echo "2. Save PM2 configuration: pm2 save"
echo "3. Setup PM2 startup: pm2 startup"
echo "4. Check your domain: https://$DOMAIN_NAME"
EOF

chmod +x hestiacp-deploy.sh

print_success "HestiaCP deployment preparation completed!"
echo ""
echo "📋 Next steps for HestiaCP deployment:"
echo ""
echo "1. 🚀 Run the HestiaCP deployment helper:"
echo "   ./hestiacp-deploy.sh"
echo ""
echo "2. 🔧 Or manually deploy:"
echo "   - Copy files to: /home/admin/web/your-domain.com/public_html/"
echo "   - Update Nginx config in HestiaCP panel"
echo "   - Start with PM2: pm2 start ecosystem.config.js"
echo ""
echo "3. 🌐 In HestiaCP Control Panel:"
echo "   - Go to Web > your-domain.com > Edit"
echo "   - Add the Nginx configuration from hestiacp-nginx.conf"
echo "   - Enable SSL if needed"
echo ""
echo "4. 🚀 Start the application:"
echo "   cd /home/admin/web/unnaccomodation.com/public_html"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "📖 For detailed HestiaCP instructions, see HESTIACP_DEPLOYMENT.md"
