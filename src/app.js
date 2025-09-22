const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const lawyerRoutes = require('./routes/lawyer');
const serviceRoutes = require('./routes/service');
const messageRoutes = require('./routes/message');

const app = express();
const PORT = process.env.PORT || 3000;

// Set default environment variables if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';
  console.log('⚠️  Using default JWT_SECRET. Please set a secure secret in production!');
}

if (!process.env.JWT_EXPIRE) {
  process.env.JWT_EXPIRE = '7d';
}

if (!process.env.BCRYPT_ROUNDS) {
  process.env.BCRYPT_ROUNDS = '12';
}

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lawyer Services API',
      version: '1.0.0',
      description: 'Backend API for Lawyer Services Mobile App',
      contact: {
        name: 'API Support',
        email: 'support@lawyerservices.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://lawyer-node-js.vercel.app' 
          : `http://localhost:${PORT}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lawyers', lawyerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/messages', messageRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Database connection test endpoint
app.get('/test-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const connectionState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      success: true,
      message: 'Database connection test',
      connectionState: states[connectionState],
      mongoURI: process.env.MONGODB_URI ? 'Set' : 'Not set',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Lawyer Services API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
