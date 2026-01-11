# Deployment Guide - NeuroCore RAG Platform

This guide covers deployment for both frontend (GitHub Pages) and backend (Docker).

## Table of Contents

1. [Frontend Deployment (GitHub Pages)](#frontend-deployment-github-pages)
2. [Backend Deployment (Docker)](#backend-deployment-docker)
3. [Local Development](#local-development)
4. [Environment Variables](#environment-variables)

---

## Frontend Deployment (GitHub Pages)

The frontend is configured for static export and automatic deployment to GitHub Pages.

### Prerequisites

- GitHub repository
- GitHub Actions enabled (enabled by default)

### Steps

1. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `(root)`
   - Click Save

2. **Set Backend URL** (optional):
   - Go to repository Settings > Secrets and variables > Actions
   - Add secret: `NEXT_PUBLIC_BACKEND_URL`
   - Value: Your backend URL (e.g., `https://your-backend.example.com`)
   - If not set, defaults to `http://localhost:8000`

3. **Deploy**:
   - Push to `main` branch
   - GitHub Actions will automatically build and deploy
   - Check Actions tab for deployment status
   - Site will be available at: `https://<username>.github.io/<repository-name>/`

### Manual Deployment

If you need to deploy manually:

```bash
# Build static export
npm run build

# The output will be in the /out directory
# Upload the contents of /out to your static host
```

---

## Backend Deployment (Docker)

The backend is containerized for easy deployment to any Docker-compatible platform.

### Quick Start

```bash
# Build the image
docker build -t neurocore-backend .

# Run the container
docker run -p 8000:8000 neurocore-backend
```

### Production Deployment

#### Option 1: Docker Run

```bash
# Build
docker build -t neurocore-backend .

# Run with persistent volumes
docker run -d \
  --name neurocore-backend \
  -p 8000:8000 \
  -v $(pwd)/data/documents:/app/data/documents \
  -v $(pwd)/data/vector_index:/app/data/vector_index \
  --restart unless-stopped \
  neurocore-backend
```

#### Option 2: Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Cloud Deployment

The backend can be deployed to any platform that supports Docker:

- **AWS ECS/Fargate**: Use the Dockerfile directly
- **Google Cloud Run**: Use the Dockerfile directly
- **Azure Container Instances**: Use the Dockerfile directly
- **DigitalOcean App Platform**: Use the Dockerfile directly
- **Railway**: Use the Dockerfile directly
- **Fly.io**: Use the Dockerfile directly

### Health Check

The backend includes a health check endpoint:

```bash
curl http://localhost:8000/api/status
```

Expected response:
```json
{
  "status": "ready",
  "documents": 5,
  "embedding_model": "all-MiniLM-L6-v2",
  "llm_model": "google/flan-t5-base"
}
```

---

## Local Development

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will be available at http://localhost:3000
```

The frontend will automatically connect to the backend at `http://localhost:8000` (or the URL specified in `NEXT_PUBLIC_BACKEND_URL`).

### Backend Development

#### Option 1: Python Directly

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run the server
python -m backend.app.main
```

#### Option 2: Docker Compose (Recommended)

```bash
# Start backend in Docker with volume mounts
docker-compose up

# Backend will be available at http://localhost:8000
```

### Full Stack Development

```bash
# Terminal 1: Start backend
python -m backend.app.main
# or
docker-compose up

# Terminal 2: Start frontend
npm run dev
```

---

## Environment Variables

### Frontend

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `http://localhost:8000` | No |

**Usage**: Set in `.env.local` for local development or GitHub Secrets for production.

```bash
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Backend

The backend uses sensible defaults. No environment variables are required for basic operation.

Optional environment variables:
- `PYTHONUNBUFFERED=1` - Disable Python output buffering (already set in Dockerfile)
- `TF_CPP_MIN_LOG_LEVEL=3` - Suppress TensorFlow logs (already set in Dockerfile)

---

## Troubleshooting

### Frontend Issues

**Issue**: Frontend can't connect to backend
- **Solution**: Check that `NEXT_PUBLIC_BACKEND_URL` is set correctly
- **Solution**: Ensure backend is running and accessible
- **Solution**: Check CORS settings (backend allows all origins by default)

**Issue**: Build fails with static export errors
- **Solution**: Ensure you're not using server-side features (API routes, getServerSideProps)
- **Solution**: Check that all components are client components (`'use client'`)

### Backend Issues

**Issue**: Backend fails to start
- **Solution**: Check that all dependencies are installed
- **Solution**: Ensure Python 3.11+ is installed
- **Solution**: Check logs for specific error messages

**Issue**: Documents not loading
- **Solution**: Ensure `data/documents/` directory exists and has files
- **Solution**: Check file permissions
- **Solution**: Rebuild index: `python -m backend.app.services.build_index_runner`

**Issue**: Docker build fails
- **Solution**: Check that Docker has enough resources (memory, disk)
- **Solution**: Try building with `--no-cache` flag
- **Solution**: Check Docker logs: `docker logs neurocore-backend`

---

## Production Checklist

### Before Deployment

- [ ] Backend URL is configured in GitHub Secrets (for frontend)
- [ ] Backend has sufficient resources (CPU, memory, disk)
- [ ] Documents are uploaded and indexed
- [ ] Health checks are working
- [ ] CORS is properly configured (if frontend and backend are on different domains)
- [ ] HTTPS is enabled (recommended for production)

### After Deployment

- [ ] Frontend loads correctly
- [ ] Backend health check passes
- [ ] Can upload documents
- [ ] Can query the RAG system
- [ ] Logs are being collected
- [ ] Monitoring is set up (optional but recommended)

---

## Architecture Notes

### Static Export (Frontend)

- Next.js is configured for static export (`output: 'export'`)
- This generates static HTML/CSS/JS files
- No server-side rendering or API routes
- Perfect for GitHub Pages and other static hosts
- Frontend communicates with backend via HTTP requests

### Docker (Backend)

- Uses Python 3.11 slim image for smaller size
- Multi-stage build could be added for optimization
- Health checks included for container orchestration
- Volumes mounted for persistent data storage
- Single worker by default (adjust for production load)

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review logs for error messages
3. Open an issue on GitHub
