FROM node:18-slim

# Install TypeScript execution tools
RUN npm install -g tsx typescript

# Create non-root user (check if user already exists)
RUN id -u coderunner >/dev/null 2>&1 || useradd -m -u 1000 coderunner

# Set up workspace
WORKDIR /workspace
RUN chown -R coderunner:coderunner /workspace 2>/dev/null || true

# Switch to non-root user
USER coderunner

# Keep container running
CMD ["tail", "-f", "/dev/null"]
