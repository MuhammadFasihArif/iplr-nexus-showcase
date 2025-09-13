# 🚂 Railway Deployment Guide for IPLR Website

## Why Railway?
- ✅ **Free tier:** $5 credit monthly (usually enough)
- ✅ **Full-stack support:** React + Python in same project
- ✅ **Easy deployment:** Connect GitHub, auto-deploy
- ✅ **Built-in database:** PostgreSQL included
- ✅ **File storage:** Built-in storage
- ✅ **No sleep:** Unlike Render's free tier

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Make sure your code is pushed to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push origin main
   ```

### Step 2: Deploy to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Railway will auto-detect your project**

### Step 3: Configure Services

Railway will create two services:
1. **Frontend Service** (React/Vite)
2. **Backend Service** (Python API)

#### Frontend Service Configuration:
- **Build Command:** `npm run build`
- **Start Command:** `npm run start:prod`
- **Port:** Auto-detected

#### Backend Service Configuration:
- **Start Command:** `python pdf_api_server.py`
- **Port:** Auto-detected

### Step 4: Environment Variables

Add these environment variables in Railway dashboard:

#### For Frontend Service:
```
VITE_SUPABASE_URL=https://nnslaimpizqbgvombfbx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uc2xhaW1waXpxYmd2b21iZmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDMwNzUsImV4cCI6MjA3Mjk3OTA3NX0.D9fw8Oqy4CRjR-9Bng5KMe7SVSfqsZ9jw59Gicb9To0
```

#### For Backend Service:
```
FLASK_ENV=production
PORT=5000
```

### Step 5: Add Database (Optional)

If you want to use Railway's PostgreSQL instead of Supabase:

1. **Click "New" → "Database" → "PostgreSQL"**
2. **Connect to your services**
3. **Update your database connection**

### Step 6: Deploy

1. **Click "Deploy"**
2. **Wait for build to complete**
3. **Your services will be available at:**
   - Frontend: `https://your-project-name-production.up.railway.app`
   - Backend: `https://your-project-name-api-production.up.railway.app`

## 🔧 Alternative: Single Service Deployment

If you want everything in one service, you can use a process manager:

### Option A: Use PM2 (Recommended)

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Create ecosystem file:**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [
       {
         name: 'frontend',
         script: 'npm',
         args: 'run start:prod',
         env: {
           PORT: 3000
         }
       },
       {
         name: 'api',
         script: 'python',
         args: 'pdf_api_server.py',
         env: {
           PORT: 5000
         }
       }
     ]
   }
   ```

3. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js
   ```

### Option B: Use Concurrently

1. **Install concurrently:**
   ```bash
   npm install concurrently
   ```

2. **Update package.json:**
   ```json
   {
     "scripts": {
       "start:all": "concurrently \"npm run start:prod\" \"python pdf_api_server.py\""
     }
   }
   ```

## 📊 Railway vs Other Platforms

| Platform | Free Tier | Python Support | React Support | Database | Sleep |
|----------|-----------|----------------|---------------|----------|-------|
| **Railway** | $5 credit/month | ✅ | ✅ | ✅ | ❌ |
| **Render** | 750 hours/month | ✅ | ✅ | ✅ | ✅ (15min) |
| **Fly.io** | 3 small VMs | ✅ | ✅ | ✅ | ❌ |
| **Heroku** | ❌ (paid only) | ✅ | ✅ | ✅ | ❌ |

## 🎯 Recommended Setup

1. **Use Railway** for full-stack deployment
2. **Keep Supabase** for database (already working)
3. **Use Railway's built-in storage** or keep Supabase Storage

## 🔄 After Deployment

1. **Test all functionality:**
   - Frontend loads correctly
   - Python API responds
   - File uploads work
   - Admin panel functions

2. **Set up custom domain** (optional):
   - In Railway dashboard
   - Add your domain
   - Update DNS settings

## 🆘 Troubleshooting

### Build Errors:
- Check Railway build logs
- Ensure all dependencies are in package.json/requirements.txt
- Verify environment variables are set

### Runtime Errors:
- Check service logs in Railway dashboard
- Verify port configurations
- Test API endpoints

### Database Connection:
- Verify Supabase credentials
- Check network connectivity
- Test database queries

## 💰 Cost Estimation

- **Railway Free Tier:** $5 credit/month
- **Typical usage:** $2-4/month for small projects
- **If you exceed:** Pay only for what you use

## 🎉 Success!

Once deployed, your IPLR website will be live with:
- ✅ React frontend
- ✅ Python API
- ✅ Supabase database
- ✅ File uploads
- ✅ Admin panel
- ✅ All functionality working

**Your website will be available at your Railway domain!** 🌐
