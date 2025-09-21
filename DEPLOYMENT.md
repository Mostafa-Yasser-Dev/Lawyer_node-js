# Deployment Guide - Lawyer Services Backend

This guide will help you deploy the Lawyer Services Backend API to Vercel and set up the necessary environment variables.

## Prerequisites

1. **GitHub Account**: You'll need a GitHub account to host your code
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Database**: You'll need a MongoDB database (MongoDB Atlas recommended)

## Step 1: Prepare Your Code

1. **Initialize Git Repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Lawyer Services Backend"
   ```

2. **Push to GitHub**:
   - Create a new repository on GitHub
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/lawyer-services-backend.git
   git push -u origin main
   ```

## Step 2: Set Up MongoDB Database

### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get your connection string
6. Whitelist all IP addresses (0.0.0.0/0) for Vercel deployment

### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/lawyer-services`

## Step 3: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add JWT_EXPIRE
   vercel env add BCRYPT_ROUNDS
   vercel env add NODE_ENV
   ```

### Method 2: Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Set Environment Variables** in Vercel Dashboard:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string (use a password generator)
   - `JWT_EXPIRE`: `7d`
   - `BCRYPT_ROUNDS`: `12`

## Step 4: Environment Variables

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/lawyer-services` |
| `JWT_SECRET` | Secret for JWT tokens | `your-super-secret-jwt-key-here` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `BCRYPT_ROUNDS` | Bcrypt salt rounds | `12` |

### Generating a Secure JWT Secret

Use one of these methods to generate a secure JWT secret:

```bash
# Method 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Method 2: Using OpenSSL
openssl rand -hex 64

# Method 3: Online generator
# Visit: https://generate-secret.vercel.app/64
```

## Step 5: Test Your Deployment

1. **Check Health Endpoint**:
   ```bash
   curl https://your-app-name.vercel.app/health
   ```

2. **Check API Documentation**:
   Visit: `https://your-app-name.vercel.app/api-docs`

3. **Test Authentication**:
   ```bash
   # Register a new user
   curl -X POST https://your-app-name.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

## Step 6: Configure CORS for Flutter App

Update the CORS configuration in `src/app.js` for your Flutter app:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',  // Development
    'https://your-flutter-app-domain.com'  // Production
  ],
  credentials: true
}));
```

## Step 7: Database Setup

### Create Initial Data (Optional)

You can create some initial data for testing:

```javascript
// Create a sample lawyer
const lawyer = {
  name: "John Doe",
  email: "lawyer@example.com",
  password: "password123",
  role: "lawyer"
};

// Create sample services
const services = [
  {
    title: "Family Law Consultation",
    description: "Expert consultation for family law matters",
    category: "Family Law",
    lawyer: lawyerId
  }
];
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check MongoDB URI format
   - Ensure IP whitelist includes Vercel IPs
   - Verify database user permissions

2. **CORS Issues**:
   - Update CORS configuration
   - Check Flutter app domain

3. **Environment Variables**:
   - Verify all required variables are set
   - Check variable names (case-sensitive)

4. **Build Errors**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Logs and Debugging

1. **Vercel Logs**:
   ```bash
   vercel logs
   ```

2. **Local Testing**:
   ```bash
   npm run dev
   ```

## Production Checklist

- [ ] Environment variables configured
- [ ] MongoDB database connected
- [ ] CORS configured for Flutter app
- [ ] JWT secret is secure and unique
- [ ] Rate limiting configured
- [ ] Error handling implemented
- [ ] API documentation accessible
- [ ] Health endpoint working
- [ ] Authentication endpoints tested

## Security Considerations

1. **JWT Secret**: Use a strong, unique secret
2. **Database Security**: Use strong passwords and IP whitelisting
3. **Rate Limiting**: Configure appropriate limits
4. **CORS**: Only allow necessary origins
5. **Environment Variables**: Never commit secrets to Git

## Monitoring and Maintenance

1. **Vercel Analytics**: Monitor API usage
2. **MongoDB Atlas**: Monitor database performance
3. **Error Tracking**: Consider adding error tracking (Sentry)
4. **Logs**: Regular log review
5. **Updates**: Keep dependencies updated

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test endpoints individually
4. Check MongoDB connection
5. Review CORS configuration

## Next Steps

After successful deployment:

1. **Flutter Integration**: Use the API endpoints in your Flutter app
2. **Testing**: Implement comprehensive testing
3. **Monitoring**: Set up monitoring and alerts
4. **Scaling**: Consider scaling options as your app grows

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Services
- `GET /api/services` - Get all services
- `GET /api/services/categories` - Get categories
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (Lawyer)
- `PUT /api/services/:id` - Update service (Lawyer)
- `DELETE /api/services/:id` - Delete service (Lawyer)

### Messages
- `GET /api/messages` - Get conversations
- `GET /api/messages/:userId` - Get messages with user
- `POST /api/messages` - Send message
- `POST /api/messages/service-request` - Send service request

### Users & Lawyers
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/lawyers/dashboard` - Lawyer dashboard
- `GET /api/lawyers/service-requests` - Get service requests

Your Lawyer Services Backend is now ready for production use! 🚀
