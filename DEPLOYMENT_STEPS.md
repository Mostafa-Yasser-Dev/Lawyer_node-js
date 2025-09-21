# Complete Deployment Guide - Step by Step

## 🎯 Overview
This guide will help you deploy your Lawyer Services Backend to Vercel with MongoDB Atlas.

## 📋 Prerequisites
- ✅ GitHub repository (already done)
- ✅ Vercel account
- ✅ MongoDB Atlas account

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Start Free"
3. Sign up with your email or Google account

### 1.2 Create a New Cluster
1. **Choose Cloud Provider**: AWS, Google Cloud, or Azure
2. **Select Region**: Choose closest to your users
3. **Cluster Tier**: Select "M0 Sandbox" (Free tier)
4. **Cluster Name**: `lawyer-services-cluster`
5. Click "Create Cluster"

### 1.3 Set Up Database Access
1. **Go to "Database Access"** in the left sidebar
2. **Click "Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `lawyer-services-user`
5. **Password**: Generate a secure password (save it!)
6. **Database User Privileges**: "Read and write to any database"
7. **Click "Add User"**

### 1.4 Set Up Network Access
1. **Go to "Network Access"** in the left sidebar
2. **Click "Add IP Address"**
3. **Choose "Allow Access from Anywhere"** (0.0.0.0/0)
4. **Click "Confirm"**

### 1.5 Get Connection String
1. **Go to "Clusters"** in the left sidebar
2. **Click "Connect"** on your cluster
3. **Choose "Connect your application"**
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. **Copy the connection string**

**Example connection string:**
```
mongodb+srv://lawyer-services-user:<password>@cluster0.xxxxx.mongodb.net/lawyer-services?retryWrites=true&w=majority
```

## 🚀 Step 2: Deploy to Vercel

### 2.1 Connect GitHub to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. **Import Git Repository**: Select your GitHub repo
4. **Framework Preset**: Other
5. **Root Directory**: `./`
6. **Build Command**: `npm install`
7. **Output Directory**: Leave empty
8. **Install Command**: `npm install`

### 2.2 Set Environment Variables
In Vercel dashboard, go to your project → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment |
| `MONGODB_URI` | `mongodb+srv://...` | Your Atlas connection string |
| `JWT_SECRET` | `your-super-secret-jwt-key` | Secure random string |
| `JWT_EXPIRE` | `7d` | Token expiration |
| `BCRYPT_ROUNDS` | `12` | Password hashing rounds |

### 2.3 Deploy
1. **Click "Deploy"**
2. **Wait for deployment** (2-3 minutes)
3. **Get your production URL**: `https://your-app-name.vercel.app`

## 🔧 Step 3: Test Your Deployment

### 3.1 Test Health Endpoint
```bash
curl https://your-app-name.vercel.app/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456
}
```

### 3.2 Test API Documentation
Visit: `https://your-app-name.vercel.app/api-docs`

### 3.3 Test Authentication
```bash
# Register a new user
curl -X POST https://your-app-name.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🗄️ Step 4: Set Up MongoDB Compass (Optional)

### 4.1 Install MongoDB Compass
1. Download from [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Install the desktop application

### 4.2 Connect to Your Atlas Database
1. **Open MongoDB Compass**
2. **Connection String**: Use your Atlas connection string
3. **Click "Connect"**
4. **Browse your database**: `lawyer-services`

### 4.3 Verify Data
- Check if collections are created: `users`, `services`, `messages`, `servicerequests`
- Test inserting data through the API
- Verify data appears in Compass

## 🔍 Step 5: Monitor Your Deployment

### 5.1 Vercel Dashboard
- **Functions**: Monitor API calls
- **Analytics**: Track usage
- **Logs**: Debug issues

### 5.2 MongoDB Atlas Dashboard
- **Metrics**: Database performance
- **Logs**: Database queries
- **Alerts**: Set up monitoring

## 🛠️ Troubleshooting

### Common Issues

#### 1. Database Connection Error
**Error**: `MongoServerError: Authentication failed`
**Solution**: 
- Check username/password in connection string
- Verify database user has correct permissions
- Ensure IP is whitelisted

#### 2. Environment Variables Not Set
**Error**: `MONGODB_URI is undefined`
**Solution**:
- Verify environment variables in Vercel dashboard
- Redeploy after adding variables

#### 3. CORS Issues
**Error**: `CORS policy: No 'Access-Control-Allow-Origin'`
**Solution**:
- Update CORS configuration in `src/app.js`
- Add your Flutter app domain

### Debug Commands

```bash
# Check deployment logs
vercel logs

# Check environment variables
vercel env ls

# Redeploy with new variables
vercel --prod
```

## 📱 Step 6: Update Flutter App

### 6.1 Update API Base URL
```dart
class ApiService {
  static const String baseUrl = 'https://your-app-name.vercel.app/api';
  // ... rest of your code
}
```

### 6.2 Test Flutter Integration
1. **Update your Flutter app** with the new API URL
2. **Test authentication** flow
3. **Test API calls** to your deployed backend

## 🎉 Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Network access allowed
- [ ] Vercel deployment successful
- [ ] Environment variables set
- [ ] Health endpoint working
- [ ] API documentation accessible
- [ ] Authentication endpoints working
- [ ] Flutter app connected
- [ ] Database data visible in Compass

## 🚀 Next Steps

1. **Monitor your deployment** for any issues
2. **Set up monitoring** and alerts
3. **Test all endpoints** thoroughly
4. **Deploy your Flutter app** to app stores
5. **Scale your database** as needed

Your Lawyer Services Backend is now **production-ready**! 🎯
