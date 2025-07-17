FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user (check if user already exists)
RUN id -u coderunner >/dev/null 2>&1 || useradd -m -u 1000 coderunner

# Set up workspace
WORKDIR /workspace
RUN chown -R coderunner:coderunner /workspace 2>/dev/null || true

# Switch to non-root user
USER coderunner

# Keep container running
CMD ["tail", "-f", "/dev/null"]
