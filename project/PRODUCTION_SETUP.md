# Production Setup Summary

This document summarizes the production-ready changes made to the NeuroCore RAG Platform.

## Changes Made

### Frontend (Next.js)

1. **Static Export Configuration**
   - Updated `next.config.js` to use `output: 'export'`
   - Enables static HTML generation for GitHub Pages
   - Disabled image optimization (not needed for static sites)

2. **API Client (`lib/api-client.ts`)**
   - Created centralized API client for backend communication
   - Uses environment variable `NEXT_PUBLIC_BACKEND_URL`
   - Replaces Next.js API routes for static compatibility

3. **Frontend Pages Updated**
   - `app/chat/page.tsx`: Now uses `queryRAG()` from API client
   - `app/upload/page.tsx`: Now uses `uploadDocument()` from API client
   - Both pages work with static export (no server-side code)

4. **GitHub Actions Workflow (`.github/workflows/deploy-frontend.yml`)**
   - Automatically builds and deploys on push to `main`
   - Uses GitHub Pages deployment action
   - Configurable backend URL via GitHub Secrets

### Backend (FastAPI)

1. **Upload Endpoint Added**
   - Added `POST /api/upload` endpoint to `backend/app/main.py`
   - Handles file uploads and index rebuilding
   - Replaces Next.js API route functionality

2. **Dockerfile**
   - Production-ready Docker image
   - Uses Python 3.11 slim base image
   - Includes health checks
   - Properly configured for containerization

3. **Docker Compose (`docker-compose.yml`)**
   - Local development with volume mounts
   - Persistent data storage
   - Easy service management

4. **Docker Ignore (`.dockerignore`)**
   - Excludes unnecessary files from build context
   - Reduces image size and build time

### Documentation

1. **DEPLOYMENT.md**
   - Comprehensive deployment guide
   - Frontend and backend instructions
   - Troubleshooting section
   - Production checklist

2. **README.md Updates**
   - Added quick start section
   - Updated deployment section with links
   - Production deployment notes

## File Structure Changes

```
project/
├── .github/
│   └── workflows/
│       └── deploy-frontend.yml          # NEW: GitHub Actions CI/CD
├── lib/
│   └── api-client.ts                    # NEW: API client for backend
├── Dockerfile                           # NEW: Backend Docker image
├── docker-compose.yml                   # NEW: Local dev with Docker
├── .dockerignore                        # NEW: Docker build exclusions
├── DEPLOYMENT.md                        # NEW: Deployment guide
├── PRODUCTION_SETUP.md                  # NEW: This file
├── next.config.js                       # MODIFIED: Static export config
├── package.json                         # MODIFIED: Export script
├── backend/app/main.py                  # MODIFIED: Added upload endpoint
├── app/chat/page.tsx                    # MODIFIED: Uses API client
└── app/upload/page.tsx                  # MODIFIED: Uses API client
```

## Deployment Options

### Frontend
- **GitHub Pages**: Automatic via GitHub Actions (recommended)
- **Any static host**: Upload `/out` directory contents

### Backend
- **Docker**: `docker run -p 8000:8000 neurocore-backend`
- **Docker Compose**: `docker-compose up`
- **Any container platform**: AWS ECS, Google Cloud Run, Azure, etc.

## Environment Variables

### Frontend
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL (default: `http://localhost:8000`)

### Backend
- No required environment variables (uses defaults)
- Optional: `PYTHONUNBUFFERED`, `TF_CPP_MIN_LOG_LEVEL`

## Testing Production Setup

### Test Static Export
```bash
npm run build
# Check that /out directory is created
# Serve locally: npx serve out
```

### Test Docker Build
```bash
docker build -t neurocore-backend .
docker run -p 8000:8000 neurocore-backend
# Test: curl http://localhost:8000/api/status
```

### Test Docker Compose
```bash
docker-compose up
# Test: curl http://localhost:8000/api/status
```

## Next Steps for Production

1. **Set Backend URL**: Configure `NEXT_PUBLIC_BACKEND_URL` in GitHub Secrets
2. **Enable GitHub Pages**: Repository Settings > Pages
3. **Deploy Backend**: Choose container platform and deploy
4. **Configure CORS**: If frontend and backend on different domains
5. **Enable HTTPS**: Required for production
6. **Set up Monitoring**: Logs, metrics, alerts
7. **Configure Backups**: For document storage and vector index

## Notes

- Local development still works exactly as before
- No breaking changes to existing functionality
- API routes in `/app/api/` are no longer used (but kept for reference)
- Backend must be accessible from frontend domain for CORS
- Static export means no server-side rendering or API routes
