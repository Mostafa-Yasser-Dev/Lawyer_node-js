const mongoose = require('mongoose');

const ensureDBConnection = async (req, res, next) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, attempting to connect...');
      const connectDB = require('../config/database');
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
};

module.exports = { ensureDBConnection };
