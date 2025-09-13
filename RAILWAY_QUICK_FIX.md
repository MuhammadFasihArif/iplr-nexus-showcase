# 🚂 Railway Quick Fix Guide

## The Problem
Railway is only deploying the frontend service, but your app needs both frontend AND Python API.

## The Solution
You need to create **TWO SEPARATE SERVICES** on Railway:

### Step 1: Create Frontend Service
1. Go to your Railway project
2. Click "New Service" → "GitHub Repo"
3. Select your repository
4. Railway will auto-detect it as a Node.js app
5. **Service Name:** `frontend`
6. **Environment Variables:**
   ```
   VITE_SUPABASE_URL=https://nnslaimpizqbgvombfbx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uc2xhaW1waXpxYmd2b21iZmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDMwNzUsImV4cCI6MjA3Mjk3OTA3NX0.D9fw8Oqy4CRjR-9Bng5KMe7SVSfqsZ9jw59Gicb9To0
   VITE_API_URL=https://your-api-service-url.up.railway.app
   ```

### Step 2: Create API Service
1. Click "New Service" → "GitHub Repo"
2. Select the SAME repository
3. Railway will auto-detect it as a Python app
4. **Service Name:** `api`
5. **Environment Variables:**
   ```
   FLASK_ENV=production
   PORT=5000
   ```

### Step 3: Update Frontend Service
1. Go back to your frontend service
2. Update the `VITE_API_URL` environment variable with your actual API service URL
3. Redeploy the frontend service

## Alternative: Single Service Approach
If you want to keep it simple, you can deploy just the frontend and disable PDF text extraction:

1. Deploy only the frontend service
2. Don't set `VITE_API_URL` environment variable
3. The app will work without PDF text extraction

## Expected Results
- Frontend: `https://your-frontend.up.railway.app`
- API: `https://your-api.up.railway.app`
- Full functionality with PDF text extraction
