# Multi-stage build for Vue.js application
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with Caddy
FROM caddy:2-alpine

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/caddy

# Copy both Caddy configurations
COPY Caddyfile.production /etc/caddy/Caddyfile.production
COPY Caddyfile.development /etc/caddy/Caddyfile.development

# Create a script to choose the right Caddyfile
RUN printf '#!/bin/sh\nset -e\n\nif [ "$NODE_ENV" = "development" ]; then\n    cp /etc/caddy/Caddyfile.development /etc/caddy/Caddyfile\nelse\n    cp /etc/caddy/Caddyfile.production /etc/caddy/Caddyfile\nfi\n\nexec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile\n' > /usr/local/bin/start-caddy.sh && \
    chmod +x /usr/local/bin/start-caddy.sh

# Expose ports for both HTTP and HTTPS
EXPOSE 80 443

# Start Caddy with the appropriate configuration
CMD ["/usr/local/bin/start-caddy.sh"]
