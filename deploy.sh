#!/bin/bash

# UNN Hostel Admin - Docker Deployment Script
# This script builds and deploys the Next.js application using Docker

set -e  # Exit on any error

echo "🚀 Starting UNN Hostel Admin deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running ✓"

# Stop and remove existing containers if they exist
if docker ps -a --format "table {{.Names}}" | grep -q "unn-hostel-admin"; then
    print_status "Stopping existing containers..."
    docker-compose down
fi

# Remove existing images to ensure fresh build
print_status "Removing existing images..."
docker rmi unn-hostel-admin_unn-hostel-admin 2>/dev/null || true

# Build the application locally first
print_status "Building the application locally..."
npm run build

# Build the Docker image
print_status "Building Docker image..."
docker-compose build --no-cache

# Start the application
print_status "Starting the application..."
docker-compose up -d

# Wait a moment for the application to start
sleep 5

# Check if the container is running
if docker ps --format "table {{.Names}}" | grep -q "unn-hostel-admin"; then
    print_status "Application is running successfully! ✓"
    print_status "You can access the application at: http://localhost:3000"
    
    # Show container status
    echo ""
    print_status "Container status:"
    docker ps --filter "name=unn-hostel-admin" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # Show logs
    echo ""
    print_status "Recent logs:"
    docker-compose logs --tail=10
else
    print_error "Failed to start the application. Check the logs:"
    docker-compose logs
    exit 1
fi

echo ""
print_status "Deployment completed successfully! 🎉"
print_status "Use 'docker-compose logs -f' to follow the logs"
print_status "Use 'docker-compose down' to stop the application"
