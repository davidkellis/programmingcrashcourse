# Deployment Guide

This guide explains how to build and deploy your Vue.js application to a VM using Caddy.

## Prerequisites

- Node.js 24+ installed on your VM
- Git (to clone the repository)
- Optional: Docker and Docker Compose for containerized deployment

## Quick Start

### Option 1: Automated Deployment Script

1. Clone your repository to the VM
2. Navigate to the frontend-vue directory
3. Run the deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

This script will:
- Install dependencies
- Run type checking and linting
- Build the application
- Create a Docker image (if Docker is available)
- Provide deployment instructions

### Option 2: Manual Build and Deploy

1. Install dependencies:
```bash
npm ci
```

2. Build the application:
```bash
npm run build
```

3. The built files will be in the `dist/` directory

## Deployment Methods

### Method 1: Using Vite Preview (Development/Testing)

```bash
npm run preview
```

This serves the built application on port 4173. Good for testing the production build locally.

### Method 2: Using Caddy (Recommended for Production)

1. Install Caddy on your VM:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Or using snap
sudo snap install caddy
```

2. Copy the built files to Caddy web root:
```bash
sudo cp -r dist/* /usr/share/caddy/
```

3. Configure Caddy (use the provided Caddyfile):
```bash
sudo cp Caddyfile /etc/caddy/Caddyfile
sudo systemctl restart caddy
```

4. Configure firewall to allow HTTP/HTTPS traffic:
```bash
sudo ufw allow 80
sudo ufw allow 443
```

### Method 3: Using Docker (Recommended for Containerized Deployment)

1. Build the Docker image:
```bash
docker build -t programming-crash-course:latest .
```

2. Run the container:
```bash
docker run -d -p 80:80 -p 443:443 --name programming-crash-course programming-crash-course:latest
```

3. Or use Docker Compose:
```bash
docker-compose up -d
```

### Method 4: Using Node.js HTTP Server

1. Install a simple HTTP server:
```bash
npm install -g serve
```

2. Serve the built files:
```bash
serve -s dist -l 80
```

## Environment Configuration

### Production Environment Variables

Create a `.env.production` file in the frontend-vue directory:

```env
NODE_ENV=production
VITE_APP_TITLE=Programming Crash Course
VITE_API_URL=https://your-api-domain.com
```

### Base URL Configuration

If your application will be served from a subdirectory (e.g., `https://yourdomain.com/app/`), update the Vite config:

```typescript
export default defineConfig({
  base: '/app/', // Add this line
  // ... rest of config
})
```

## SSL/HTTPS Setup

### Automatic SSL with Caddy

Caddy automatically handles SSL certificates with Let's Encrypt. To enable it:

1. Update the Caddyfile to use your domain:
```caddy
yourdomain.com {
    root * /usr/share/caddy
    try_files {path} /index.html
    file_server
    encode gzip
    # ... rest of configuration
}
```

2. Restart Caddy:
```bash
sudo systemctl restart caddy
```

Caddy will automatically:
- Obtain SSL certificates from Let's Encrypt
- Configure HTTPS
- Handle certificate renewals

### Manual SSL Configuration

If you prefer manual SSL setup, you can configure Caddy with your own certificates.

## Monitoring and Logs

### Caddy Logs
- Access logs: `sudo journalctl -u caddy`
- Real-time logs: `sudo journalctl -u caddy -f`

### Docker Logs
```bash
docker logs programming-crash-course
```

### Health Check
The application includes a health check endpoint at `/health`

## Troubleshooting

### Common Issues

1. **Port 80/443 already in use**
   ```bash
   sudo netstat -tulpn | grep :80
   sudo systemctl stop apache2  # if Apache is running
   ```

2. **Permission denied errors**
   ```bash
   sudo chown -R caddy:caddy /usr/share/caddy/
   ```

3. **Vue Router not working (404 errors)**
   - Ensure Caddy is configured to handle SPA routing
   - Check that the Caddyfile includes the try_files directive

4. **Build fails**
   ```bash
   npm run type-check  # Check for TypeScript errors
   npm run lint        # Check for linting errors
   ```

5. **SSL certificate issues**
   ```bash
   sudo caddy validate --config /etc/caddy/Caddyfile
   sudo systemctl status caddy
   ```

### Performance Optimization

1. **Enable gzip compression** (already configured in Caddyfile)
2. **Set up caching headers** (already configured)
3. **Use a CDN** for static assets
4. **Enable HTTP/2** (automatic with Caddy)

## Security Considerations

1. **Keep dependencies updated**:
   ```bash
   npm audit
   npm update
   ```

2. **Use security headers** (already configured in Caddyfile)
3. **Regular security updates** for the VM
4. **Firewall configuration**:
   ```bash
   sudo ufw enable
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   ```

5. **Caddy security**:
   ```bash
   # Check Caddy configuration
   sudo caddy validate --config /etc/caddy/Caddyfile

   # Update Caddy
   sudo apt update && sudo apt upgrade caddy
   ```

## Backup and Recovery

1. **Backup the built application**:
   ```bash
   tar -czf app-backup-$(date +%Y%m%d).tar.gz dist/
   ```

2. **Backup Caddy configuration**:
   ```bash
   sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup
   ```

3. **Backup SSL certificates** (if using Caddy's automatic SSL):
   ```bash
   sudo cp -r /var/lib/caddy/ /backup/caddy/
   ```

## Caddy Configuration Examples

### Basic Configuration
```caddy
yourdomain.com {
    root * /usr/share/caddy
    try_files {path} /index.html
    file_server
    encode gzip
}
```

### With Custom Headers
```caddy
yourdomain.com {
    root * /usr/share/caddy
    try_files {path} /index.html
    file_server
    encode gzip

    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
}
```

### With API Proxy
```caddy
yourdomain.com {
    root * /usr/share/caddy
    try_files {path} /index.html
    file_server
    encode gzip

    # Proxy API requests to backend
    handle /api/* {
        reverse_proxy localhost:3000
    }
}
```
