# 🚂 Complete Railway Setup Guide

## The Problem
Railway is failing to deploy both services because:
1. API service health check is failing
2. Frontend service needs API URL
3. Both services need proper configuration

## The Solution

### Step 1: Delete Current Failed Services
1. Go to your Railway project dashboard
2. Delete the failed "web" service
3. Delete the failed "api" service

### Step 2: Create Frontend Service
1. Click **"New Service"** → **"GitHub Repo"**
2. Select your repository: `iplr-nexus-showcase`
3. **Service Name:** `frontend`
4. **Environment Variables:**
   ```
   VITE_SUPABASE_URL=https://nnslaimpizqbgvombfbx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uc2xhaW1waXpxYmd2b21iZmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDMwNzUsImV4cCI6MjA3Mjk3OTA3NX0.D9fw8Oqy4CRjR-9Bng5KMe7SVSfqsZ9jw59Gicb9To0
   ```

### Step 3: Create API Service
1. Click **"New Service"** → **"GitHub Repo"**
2. Select the SAME repository: `iplr-nexus-showcase`
3. **Service Name:** `api`
4. **Environment Variables:**
   ```
   FLASK_ENV=production
   PORT=5000
   ```

### Step 4: Wait for API Service to Deploy
1. Wait for the API service to successfully deploy
2. Copy the API service URL (e.g., `https://api-production-xxxxx.up.railway.app`)

### Step 5: Update Frontend Service
1. Go back to your frontend service
2. Add environment variable:
   ```
   VITE_API_URL=https://your-api-service-url.up.railway.app
   ```
3. Redeploy the frontend service

## Alternative: Single Service Approach

If you want to keep it simple and just get the frontend working:

### Step 1: Create Only Frontend Service
1. Click **"New Service"** → **"GitHub Repo"**
2. Select your repository: `iplr-nexus-showcase`
3. **Service Name:** `frontend`
4. **Environment Variables:**
   ```
   VITE_SUPABASE_URL=https://nnslaimpizqbgvombfbx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uc2xhaW1waXpxYmd2b21iZmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDMwNzUsImV4cCI6MjA3Mjk3OTA3NX0.D9fw8Oqy4CRjR-9Bng5KMe7SVSfqsZ9jw59Gicb9To0
   VITE_API_URL=http://localhost:5000
   ```

### Result
- ✅ Frontend will work
- ❌ PDF text extraction will be disabled
- ✅ All other features will work

## Expected Results

### With Both Services:
- **Frontend:** `https://frontend-production-xxxxx.up.railway.app`
- **API:** `https://api-production-xxxxx.up.railway.app`
- **Full functionality** including PDF text extraction

### With Frontend Only:
- **Frontend:** `https://frontend-production-xxxxx.up.railway.app`
- **Limited functionality** (no PDF text extraction)

## Troubleshooting

### If API Service Still Fails:
1. Check the build logs for Python dependency issues
2. Make sure `requirements.txt` is in the root directory
3. Try the single service approach first

### If Frontend Service Fails:
1. Check that all environment variables are set
2. Make sure the build completes successfully
3. Check the deploy logs for any errors

## Quick Start Commands

```bash
# Commit and push latest changes
git add .
git commit -m "Fix Railway deployment issues"
git push origin main

# Then follow the setup steps above
```
