# Railway Deployment Guide - Team Task Manager

This guide provides step-by-step instructions for deploying the Team Task Manager application to Railway.

## 📋 Pre-Deployment Checklist

- [ ] Railway account created and verified
- [ ] MongoDB Atlas database created and connection string ready
- [ ] GitHub repository connected to Railway (recommended) or Railway CLI installed
- [ ] Environment variables prepared (see below)

---

## 🔐 Required Environment Variables

### Backend Service Environment Variables

Configure these in Railway for your **backend service**:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for JWT token generation | `your-super-secure-random-string-here` |
| `FRONTEND_URL` | URL of your deployed frontend | `https://your-frontend.railway.app` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Port for backend server (auto-set by Railway) | `5000` (Railway will override) |

**Important Notes:**
- Generate a strong `JWT_SECRET` using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- The `FRONTEND_URL` will be available after deploying the frontend first
- Railway automatically sets `PORT`, but the app has a fallback to 5000

### Frontend Service Environment Variables

Configure these in Railway for your **frontend service**:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | URL of your deployed backend API | `https://your-backend.railway.app/api` |

**Important Notes:**
- Must include `/api` at the end of the backend URL
- Vite requires the `VITE_` prefix for environment variables to be exposed to the client

---

## 🚀 Deployment Steps

### Option 1: Deploy via GitHub (Recommended)

#### Step 1: Push Code to GitHub
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - ready for Railway deployment"

# Add remote and push
git remote add origin https://github.com/yourusername/team-task-manager.git
git branch -M main
git push -u origin main
```

#### Step 2: Create Railway Project
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `team-task-manager` repository
5. Railway will detect the monorepo structure

#### Step 3: Deploy Backend Service
1. Railway will create a service automatically
2. Click on the service and go to **Settings**
3. Set **Root Directory** to `backend`
4. Go to **Variables** tab
5. Add all backend environment variables listed above
6. Go to **Settings** → **Networking** → **Generate Domain**
7. Copy the generated domain (e.g., `https://your-backend.railway.app`)

#### Step 4: Deploy Frontend Service
1. In your Railway project, click **"+ New"** → **"Service"**
2. Select **"GitHub Repo"** and choose the same repository
3. Click on the new service and go to **Settings**
4. Set **Root Directory** to `frontend`
5. Set **Build Command** to `npm run build`
6. Set **Start Command** to `npx serve -s dist -l $PORT`
7. Go to **Variables** tab
8. Add `VITE_API_URL` with your backend URL + `/api`
9. Go to **Settings** → **Networking** → **Generate Domain**
10. Copy the frontend domain

#### Step 5: Update Backend CORS Configuration
1. Go back to your **backend service** in Railway
2. Update the `FRONTEND_URL` environment variable with your frontend domain
3. The backend will automatically redeploy with the new configuration

---

### Option 2: Deploy via Railway CLI

#### Step 1: Install Railway CLI
```bash
# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# macOS/Linux
curl -fsSL https://railway.app/install.sh | sh
```

#### Step 2: Login to Railway
```bash
railway login
```

#### Step 3: Initialize Project
```bash
# From project root
railway init
```

#### Step 4: Deploy Backend
```bash
cd backend
railway up
railway variables set MONGO_URI="your-mongodb-uri"
railway variables set JWT_SECRET="your-jwt-secret"
railway variables set NODE_ENV="production"
railway domain
# Note the generated domain
```

#### Step 5: Deploy Frontend
```bash
cd ../frontend
railway up
railway variables set VITE_API_URL="https://your-backend-domain.railway.app/api"
railway domain
# Note the generated domain
```

#### Step 6: Update Backend CORS
```bash
cd ../backend
railway variables set FRONTEND_URL="https://your-frontend-domain.railway.app"
```

---

## ✅ Post-Deployment Verification

### 1. Test Backend API
Visit your backend URL in a browser:
```
https://your-backend.railway.app
```

You should see:
```json
{
  "message": "Team Task Manager API Running"
}
```

### 2. Test Backend Health Endpoints
```bash
# Test auth endpoint
curl https://your-backend.railway.app/api/auth/health

# Check MongoDB connection
# Try to signup a test user
curl -X POST https://your-backend.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'
```

### 3. Test Frontend Application
1. Visit your frontend URL: `https://your-frontend.railway.app`
2. Try to sign up with a new account
3. Login with the created account
4. Create a test project
5. Create a test task
6. Verify all CRUD operations work

### 4. Check Logs
Monitor both services for any errors:
- Railway Dashboard → Select Service → **Logs** tab
- Look for connection errors, CORS issues, or API failures

---

## 🔧 Troubleshooting

### CORS Errors
**Problem:** Frontend can't connect to backend, CORS errors in browser console

**Solution:**
1. Verify `FRONTEND_URL` is set correctly in backend environment variables
2. Ensure it matches your frontend domain exactly (no trailing slash)
3. Check [`backend/server.js`](backend/server.js:26) CORS configuration
4. Redeploy backend after updating environment variables

### MongoDB Connection Failed
**Problem:** Backend logs show "MongoDB connection failed"

**Solution:**
1. Verify `MONGO_URI` is correct in backend environment variables
2. Check MongoDB Atlas network access settings (allow Railway IPs or 0.0.0.0/0)
3. Ensure database user has correct permissions
4. Test connection string locally first

### Frontend Can't Reach Backend
**Problem:** API calls fail, network errors in browser

**Solution:**
1. Verify `VITE_API_URL` is set correctly in frontend environment variables
2. Ensure it includes `/api` at the end
3. Check backend is running and accessible
4. Verify backend domain is correct

### Build Failures
**Problem:** Deployment fails during build

**Solution:**
1. Check Railway build logs for specific errors
2. Verify all dependencies are in `package.json` (not just devDependencies)
3. Ensure Node.js version compatibility
4. Try building locally first: `npm install && npm run build`

### Environment Variables Not Working
**Problem:** App can't read environment variables

**Solution:**
1. Redeploy after adding/changing variables
2. For frontend: ensure variables start with `VITE_`
3. Check for typos in variable names
4. Verify variables are set in the correct service

---

## 🔄 Updating Your Deployment

### Automatic Deployments (GitHub)
Railway automatically redeploys when you push to your main branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Manual Deployments (CLI)
```bash
# Deploy backend
cd backend
railway up

# Deploy frontend
cd ../frontend
railway up
```

---

## 📊 Monitoring

### View Logs
- Railway Dashboard → Service → **Logs** tab
- Or via CLI: `railway logs`

### Monitor Metrics
- Railway Dashboard → Service → **Metrics** tab
- View CPU, Memory, and Network usage

### Set Up Alerts
- Railway Dashboard → Project Settings → **Integrations**
- Connect Slack, Discord, or email for deployment notifications

---

## 💰 Cost Considerations

- Railway offers a free tier with $5 credit per month
- Each service consumes resources based on usage
- Monitor usage in Railway Dashboard → **Usage** tab
- Consider upgrading to Hobby plan ($5/month) for production apps

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Already excluded in `.gitignore`
2. **Use strong JWT secrets** - Generate with crypto.randomBytes
3. **Restrict MongoDB network access** - Use IP whitelisting when possible
4. **Enable MongoDB authentication** - Always use username/password
5. **Use HTTPS only** - Railway provides this by default
6. **Regularly update dependencies** - Run `npm audit` and fix vulnerabilities
7. **Set NODE_ENV to production** - Enables production optimizations

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord Community](https://discord.gg/railway)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## 🆘 Getting Help

If you encounter issues:
1. Check Railway logs for error messages
2. Review this troubleshooting guide
3. Search Railway Discord community
4. Contact Railway support via dashboard

---

**Last Updated:** May 2026
**Project:** Team Task Manager
**Version:** 1.0.0
