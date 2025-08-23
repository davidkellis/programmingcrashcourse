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

# Ensure Caddy uses container-friendly data/config locations
ENV XDG_CONFIG_HOME=/config \
    XDG_DATA_HOME=/data

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/caddy

# Copy both Caddy configurations
COPY Caddyfile.production /etc/caddy/Caddyfile.production
COPY Caddyfile.development /etc/caddy/Caddyfile.development

# Create a script to choose the right Caddyfile
USER root
RUN printf '#!/bin/sh\nset -e\n\nif [ "$NODE_ENV" = "development" ]; then\n    CONFIG_PATH=/etc/caddy/Caddyfile.development\nelse\n    CONFIG_PATH=/etc/caddy/Caddyfile.production\nfi\n\nexec caddy run --config "$CONFIG_PATH" --adapter caddyfile\n' > /usr/local/bin/start-caddy.sh && \
    chmod +x /usr/local/bin/start-caddy.sh

# Ensure Caddy user exists (Alpine) and prepare data/config/log directories
RUN addgroup -S caddy || true && \
    adduser -S -G caddy caddy || true && \
    mkdir -p /data /config /var/log/caddy && \
    chown -R caddy:caddy /data /config /var/log/caddy

# Declare volumes so these paths can persist certificates and config on the host
VOLUME ["/data", "/config", "/var/log/caddy"]

# Expose ports for both HTTP and HTTPS
USER caddy
EXPOSE 80 443

# Start Caddy with the appropriate configuration
CMD ["/usr/local/bin/start-caddy.sh"]
