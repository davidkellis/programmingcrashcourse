#!/bin/bash

# Deployment script for Vue.js application
set -e

echo "🚀 Starting deployment process..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run type checking
print_status "Running type checks..."
npm run type-check

# Run linting
print_status "Running linting..."
npm run lint

# Build the application
print_status "Building application for production..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

print_status "Build completed successfully!"

# Check if Docker is available
if command -v docker &> /dev/null; then
    print_status "Docker detected. Building Docker image with Caddy..."

    # Build Docker image
    docker build -t programming-crash-course:latest .

    print_status "Docker image built successfully!"
    print_status "To run with Docker: docker run -p 80:80 -p 443:443 programming-crash-course:latest"
    print_status "To run with Docker Compose: docker-compose up -d"
else
    print_warning "Docker not found. You can serve the built files manually:"
    print_status "npm run preview"
    print_status "Or install Caddy and copy dist/ to /usr/share/caddy/"
fi

# Create deployment info
cat > deploy-info.txt << EOF
Deployment completed at: $(date)
Build directory: $(pwd)/dist
To serve locally: npm run preview
To serve with Caddy: copy dist/ contents to Caddy web root
EOF

print_status "Deployment completed! Check deploy-info.txt for details."
