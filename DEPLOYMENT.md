# Deployment Guide for IPLR Website

## 🚀 Deploying to Vercel

### Prerequisites
- Vercel account (free tier available)
- GitHub repository with your code
- Supabase project (already set up)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com) and sign in**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 3: Environment Variables

In Vercel dashboard, go to your project settings and add these environment variables:

```
VITE_SUPABASE_URL=https://nnslaimpizqbgvombfbx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uc2xhaW1waXpxYmd2b21iZmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDMwNzUsImV4cCI6MjA3Mjk3OTA3NX0.D9fw8Oqy4CRjR-9Bng5KMe7SVSfqsZ9jw59Gicb9To0
```

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait for the build to complete**
3. **Your site will be available at:** `https://your-project-name.vercel.app`

## 🔧 Alternative: Deploy Python API

### Option A: Railway
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the `pdf_api_server.py` file
4. Railway will automatically detect it's a Python app
5. Add environment variables if needed

### Option B: Render
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python pdf_api_server.py`
   - **Environment:** Python 3

### Option C: Heroku
1. Go to [heroku.com](https://heroku.com)
2. Create a new app
3. Connect your GitHub repository
4. Add a `Procfile`:
   ```
   web: python pdf_api_server.py
   ```

## 📝 Important Notes

### What Works on Vercel:
- ✅ React frontend
- ✅ Supabase database
- ✅ File uploads to Supabase Storage
- ✅ Admin panel functionality
- ✅ All UI components

### What Needs Alternative Hosting:
- ⚠️ Python PDF extraction API (needs separate hosting)
- ⚠️ Or replace with Supabase Edge Functions

### Current Status:
- **Frontend:** Ready for Vercel deployment
- **Backend:** Supabase (already hosted)
- **PDF API:** Needs separate hosting or Edge Function implementation

## 🎯 Recommended Setup

1. **Deploy frontend to Vercel** (this guide)
2. **Keep Supabase as backend** (already working)
3. **Host Python API on Railway/Render** (simple and cheap)
4. **Update API URL** in your frontend code

## 🔄 After Deployment

1. **Test all functionality:**
   - Article uploads
   - Media uploads
   - Admin panel
   - Hero carousel management

2. **Update any hardcoded URLs** if needed

3. **Set up custom domain** (optional):
   - In Vercel dashboard
   - Add your domain
   - Update DNS settings

## 🆘 Troubleshooting

### Build Errors:
- Check that all dependencies are in `package.json`
- Ensure environment variables are set correctly
- Check Vercel build logs for specific errors

### Runtime Errors:
- Check browser console for errors
- Verify Supabase connection
- Test API endpoints

### PDF Extraction Not Working:
- The current setup uses a placeholder Edge Function
- For production, implement proper PDF extraction
- Or use the Python API on a separate service
