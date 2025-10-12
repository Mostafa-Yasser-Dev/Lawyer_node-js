const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const lawyerRoutes = require('./routes/lawyer');
const serviceRoutes = require('./routes/service');
const messageRoutes = require('./routes/message');
const wellknownRoutes = require('./routes/wellknown');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend-domain.com'] 
      : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});
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
(async () => {
  try {
    await connectDB();
    console.log('📦 MongoDB Connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
})();

// Trust proxy for Vercel deployment
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  trustProxy: true // Trust proxy for Vercel
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
app.use('/.well-known', wellknownRoutes);

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
      mongoURI: process.env.MONGO_DB_URI ? 'Set' : 'Not set',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
});

// Simple test endpoint for debugging
app.get('/test-register', async (req, res) => {
  try {
    const User = require('./models/User');
    console.log('Testing User model...');
    
    // Test if we can create a user (without saving)
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword'
    });
    
    res.json({
      success: true,
      message: 'User model test successful',
      userFields: Object.keys(testUser.toObject())
    });
  } catch (error) {
    console.error('User model test error:', error);
    res.status(500).json({
      success: false,
      message: 'User model test failed',
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

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log(`🔌 User ${socket.userId} connected with role: ${socket.userRole}`);
  
  // Join user to their personal room
  socket.join(`user_${socket.userId}`);
  
  // Join lawyer to lawyer room if they are a lawyer
  if (socket.userRole === 'lawyer') {
    socket.join('lawyers');
  }

  // Handle joining a conversation room
  socket.on('join_conversation', (data) => {
    const { otherUserId } = data;
    const roomName = [socket.userId, otherUserId].sort().join('_');
    socket.join(roomName);
    console.log(`💬 User ${socket.userId} joined conversation room: ${roomName}`);
  });

  // Handle leaving a conversation room
  socket.on('leave_conversation', (data) => {
    const { otherUserId } = data;
    const roomName = [socket.userId, otherUserId].sort().join('_');
    socket.leave(roomName);
    console.log(`💬 User ${socket.userId} left conversation room: ${roomName}`);
  });

  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { recipientId, content, messageId } = data;
      
      // Create room name for the conversation
      const roomName = [socket.userId, recipientId].sort().join('_');
      
      // Emit message to the conversation room
      io.to(roomName).emit('new_message', {
        id: messageId,
        senderId: socket.userId,
        recipientId: recipientId,
        content: content,
        timestamp: new Date().toISOString(),
        isRead: false
      });

      // Emit notification to recipient if they're not in the room
      socket.to(`user_${recipientId}`).emit('message_notification', {
        senderId: socket.userId,
        content: content,
        timestamp: new Date().toISOString()
      });

      console.log(`📨 Message sent from ${socket.userId} to ${recipientId}`);
    } catch (error) {
      console.error('Error handling send_message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle message read status
  socket.on('mark_message_read', (data) => {
    const { messageId, senderId } = data;
    
    // Notify sender that message was read
    socket.to(`user_${senderId}`).emit('message_read', {
      messageId: messageId,
      readBy: socket.userId,
      timestamp: new Date().toISOString()
    });

    console.log(`✅ Message ${messageId} marked as read by ${socket.userId}`);
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { recipientId } = data;
    const roomName = [socket.userId, recipientId].sort().join('_');
    socket.to(roomName).emit('user_typing', {
      userId: socket.userId,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data) => {
    const { recipientId } = data;
    const roomName = [socket.userId, recipientId].sort().join('_');
    socket.to(roomName).emit('user_typing', {
      userId: socket.userId,
      isTyping: false
    });
  });

  // Handle user online status
  socket.on('user_online', () => {
    socket.broadcast.emit('user_status', {
      userId: socket.userId,
      status: 'online',
      timestamp: new Date().toISOString()
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 User ${socket.userId} disconnected`);
    
    // Notify others that user went offline
    socket.broadcast.emit('user_status', {
      userId: socket.userId,
      status: 'offline',
      timestamp: new Date().toISOString()
    });
  });
});

// Make io available to routes
app.set('io', io);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🔌 Socket.IO server ready for real-time messaging`);
});

module.exports = { app, server, io };
