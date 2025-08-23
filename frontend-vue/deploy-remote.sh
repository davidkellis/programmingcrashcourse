#!/bin/bash

# Remote deployment script for Vue.js application
# This script builds a production container image, transfers it to a remote host,
# loads it on the remote host, and runs it there.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Default values
IMAGE_NAME="crashcourse"
IMAGE_TAG="latest"
REMOTE_HOST="web1.conquerthelawn.com"
REMOTE_USER="root"
REMOTE_PORT="22"
REMOTE_PATH="/opt/crashcourse"
SAVE_PATH="/tmp/${IMAGE_NAME}-${IMAGE_TAG}.tar"
CONTAINER_NAME="crashcourse"
HTTP_PORT="80"
HTTPS_PORT="443"

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --host HOST          Remote host IP or hostname (required)"
    echo "  -u, --user USER          Remote user (required)"
    echo "  -p, --port PORT          SSH port (default: 22)"
    echo "  -i, --image IMAGE        Image name (default: crashcourse)"
    echo "  -t, --tag TAG            Image tag (default: latest)"
    echo "  -P, --path PATH          Remote deployment path (default: /opt/crashcourse)"
    echo "  --http-port PORT         HTTP port (default: 80)"
    echo "  --https-port PORT        HTTPS port (default: 443)"
    echo "  --help                   Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 -h 192.168.1.100 -u ubuntu -p 2222"
    echo "  $0 --host myserver.com --user deploy --path /var/www/crashcourse"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)
            REMOTE_HOST="$2"
            shift 2
            ;;
        -u|--user)
            REMOTE_USER="$2"
            shift 2
            ;;
        -p|--port)
            REMOTE_PORT="$2"
            shift 2
            ;;
        -i|--image)
            IMAGE_NAME="$2"
            shift 2
            ;;
        -t|--tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        -P|--path)
            REMOTE_PATH="$2"
            shift 2
            ;;
        --http-port)
            HTTP_PORT="$2"
            shift 2
            ;;
        --https-port)
            HTTPS_PORT="$2"
            shift 2
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate required parameters
if [[ -z "$REMOTE_HOST" || -z "$REMOTE_USER" ]]; then
    print_error "Remote host (-h) and user (-u) are required"
    show_usage
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Detect container runtime (Docker or Podman)
if command -v docker &> /dev/null; then
    CONTAINER_RUNTIME="docker"
elif command -v podman &> /dev/null; then
    CONTAINER_RUNTIME="podman"
else
    print_error "Neither Docker nor Podman is installed or available in PATH"
    exit 1
fi

print_status "Using container runtime: $CONTAINER_RUNTIME"

# Check if ssh is available
if ! command -v ssh &> /dev/null; then
    print_error "SSH is not installed or not available in PATH"
    exit 1
fi

# Check if scp is available
if ! command -v scp &> /dev/null; then
    print_error "SCP is not installed or not available in PATH"
    exit 1
fi

print_step "Starting remote deployment process..."

# Step 1: Install dependencies and build application
print_step "1. Installing dependencies and building application..."
print_status "Installing npm dependencies..."
npm ci

print_status "Running type checks..."
npm run type-check

print_status "Running linting..."
npm run lint

print_status "Building application for production..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

print_status "Application built successfully!"

# Step 2: Build container image
print_step "2. Building container image..."
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"
print_status "Building image: $FULL_IMAGE_NAME"

$CONTAINER_RUNTIME build -t "$FULL_IMAGE_NAME" .

if [ $? -ne 0 ]; then
    print_error "Container build failed"
    exit 1
fi

print_status "Container image built successfully!"

# Step 3: Save container image to tar file
print_step "3. Saving container image to tar file..."
print_status "Saving image to: $SAVE_PATH"

$CONTAINER_RUNTIME save "$FULL_IMAGE_NAME" -o "$SAVE_PATH"

if [ $? -ne 0 ]; then
    print_error "Failed to save container image"
    exit 1
fi

# Get file size for progress indication
FILE_SIZE=$(du -h "$SAVE_PATH" | cut -f1)
print_status "Image saved: $SAVE_PATH ($FILE_SIZE)"

# Step 4: Create remote directory structure
print_step "4. Setting up remote directory structure..."
print_status "Creating remote directory: $REMOTE_PATH"

ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "sudo mkdir -p $REMOTE_PATH && sudo chown $REMOTE_USER:$REMOTE_USER $REMOTE_PATH"

if [ $? -ne 0 ]; then
    print_error "Failed to create remote directory"
    exit 1
fi

# Step 5: Transfer container image to remote host
print_step "5. Transferring container image to remote host..."
print_status "Transferring image to $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

scp -P "$REMOTE_PORT" "$SAVE_PATH" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

if [ $? -ne 0 ]; then
    print_error "Failed to transfer container image"
    exit 1
fi

print_status "Image transferred successfully!"

# Step 6: Load container image on remote host
print_step "6. Loading container image on remote host..."
REMOTE_IMAGE_PATH="$REMOTE_PATH/$(basename $SAVE_PATH)"

# Detect remote container runtime
REMOTE_RUNTIME=$(ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "if command -v docker &> /dev/null; then echo 'docker'; elif command -v podman &> /dev/null; then echo 'podman'; else echo 'none'; fi")

if [ "$REMOTE_RUNTIME" = "none" ]; then
    print_error "Neither Docker nor Podman is available on the remote host"
    exit 1
fi

print_status "Remote host using container runtime: $REMOTE_RUNTIME"

ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "cd $REMOTE_PATH && $REMOTE_RUNTIME load -i $(basename $SAVE_PATH)"

if [ $? -ne 0 ]; then
    print_error "Failed to load container image on remote host"
    exit 1
fi

print_status "Container image loaded successfully on remote host!"

# Step 6.5: Handle image name differences between Podman and Docker
print_step "6.5. Handling image name compatibility..."
# Check what image name was actually loaded
LOADED_IMAGE_NAME=$(ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "$REMOTE_RUNTIME images --format '{{.Repository}}:{{.Tag}}' | grep crashcourse | head -1")

if [ -z "$LOADED_IMAGE_NAME" ]; then
    print_error "Failed to find loaded image on remote host"
    exit 1
fi

print_status "Loaded image name: $LOADED_IMAGE_NAME"

# Update the image name to use the actual loaded name
FULL_IMAGE_NAME="$LOADED_IMAGE_NAME"

# Step 7: Stop and remove existing container if it exists
print_step "7. Stopping existing container if running..."
ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "$REMOTE_RUNTIME stop $CONTAINER_NAME 2>/dev/null || true"
ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "$REMOTE_RUNTIME rm $CONTAINER_NAME 2>/dev/null || true"

# Step 8: Run the new container
print_step "8. Starting new container..."
print_status "Starting container: $CONTAINER_NAME"

# First, let's test the container to make sure the start script exists
print_status "Testing container start script..."
ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "$REMOTE_RUNTIME run --rm $FULL_IMAGE_NAME ls -la /usr/local/bin/start-caddy.sh"

if [ $? -ne 0 ]; then
    print_error "Start script not found in container. Checking container contents..."
    ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "$REMOTE_RUNTIME run --rm $FULL_IMAGE_NAME ls -la /usr/local/bin/"
    ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "$REMOTE_RUNTIME run --rm $FULL_IMAGE_NAME find /usr/local -name 'start-caddy.sh' 2>/dev/null || true"
    exit 1
fi

print_status "Start script found. Starting container..."

ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "$REMOTE_RUNTIME run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p $HTTP_PORT:80 \
    -p $HTTPS_PORT:443 \
    -e NODE_ENV=production \
    -v $REMOTE_PATH/logs:/var/log/caddy \
    -v $REMOTE_PATH/caddy_data:/data \
    -v $REMOTE_PATH/caddy_config:/config \
    $FULL_IMAGE_NAME"

if [ $? -ne 0 ]; then
    print_error "Failed to start container on remote host"
    exit 1
fi

print_status "Container started successfully!"

# Step 9: Verify container is running
print_step "9. Verifying container status..."
sleep 5

CONTAINER_STATUS=$(ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "$REMOTE_RUNTIME ps --filter name=$CONTAINER_NAME --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'")

if echo "$CONTAINER_STATUS" | grep -q "$CONTAINER_NAME"; then
    print_status "Container is running:"
    echo "$CONTAINER_STATUS"
else
    print_warning "Container may not be running. Checking logs..."
    ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "$REMOTE_RUNTIME logs $CONTAINER_NAME --tail 20"
fi

# Step 10: Cleanup local tar file
print_step "10. Cleaning up local files..."
rm -f "$SAVE_PATH"
print_status "Local tar file removed"

# Step 11: Provide deployment information
print_step "11. Deployment completed!"
echo ""
print_status "Deployment Summary:"
echo "  - Image: $FULL_IMAGE_NAME"
echo "  - Remote Host: $REMOTE_HOST"
echo "  - Container Name: $CONTAINER_NAME"
echo "  - HTTP Port: $HTTP_PORT"
echo "  - HTTPS Port: $HTTPS_PORT"
echo "  - Remote Path: $REMOTE_PATH"
echo ""
print_status "Useful commands:"
echo "  - View logs: ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST '$REMOTE_RUNTIME logs -f $CONTAINER_NAME'"
echo "  - Stop container: ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST '$REMOTE_RUNTIME stop $CONTAINER_NAME'"
echo "  - Restart container: ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST '$REMOTE_RUNTIME restart $CONTAINER_NAME'"
echo "  - Access container shell: ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST '$REMOTE_RUNTIME exec -it $CONTAINER_NAME sh'"
echo ""
print_status "Your application should now be accessible at:"
echo "  - HTTP: http://$REMOTE_HOST:$HTTP_PORT"
echo "  - HTTPS: https://$REMOTE_HOST:$HTTPS_PORT"
