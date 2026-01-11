# Production Dockerfile for NeuroCore RAG Backend
#
# This Dockerfile builds a production-ready image for the FastAPI backend.
# 
# Build: docker build -t neurocore-backend .
# Run:   docker run -p 8000:8000 neurocore-backend
#
# For local development with volumes, use docker-compose.yml instead

# Use Python 3.11 slim image for smaller size
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
# - PYTHONUNBUFFERED: Ensures Python output is sent directly to terminal
# - TF_CPP_MIN_LOG_LEVEL: Suppresses TensorFlow logging
ENV PYTHONUNBUFFERED=1 \
    TF_CPP_MIN_LOG_LEVEL=3 \
    PYTHONPATH=/app

# Install system dependencies
# - build-essential: Required for compiling some Python packages
# - curl: For health checks (optional)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY backend/requirements.txt /app/backend/requirements.txt

# Install Python dependencies
# --no-cache-dir: Reduces image size
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ /app/backend/

# Create necessary directories (data will be mounted as volume in production)
RUN mkdir -p /app/data/documents /app/data/vector_index

# Copy data directory structure (optional - usually mounted as volume)
# COPY data/ /app/data/

# Expose port 8000 (FastAPI default)
EXPOSE 8000

# Health check to verify the service is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/api/status || exit 1

# Run the FastAPI server using uvicorn
# --host 0.0.0.0: Listen on all interfaces (required for Docker)
# --port 8000: Port to listen on
# --workers 1: Single worker (adjust for production if needed)
CMD ["python", "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
