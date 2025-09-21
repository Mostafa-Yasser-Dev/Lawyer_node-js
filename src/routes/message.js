const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validateMessage, validateServiceRequest } = require('../middleware/validation');
const {
  getConversations,
  getMessages,
  sendMessage,
  sendServiceRequest,
  markAsRead
} = require('../controllers/messageController');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messaging system endpoints
 */

// @route   GET /api/messages
// @desc    Get user's conversations
// @access  Private
router.get('/', auth, getConversations);

// @route   GET /api/messages/:userId
// @desc    Get messages with specific user
// @access  Private
router.get('/:userId', auth, getMessages);

// @route   POST /api/messages
// @desc    Send message
// @access  Private
router.post('/', auth, validateMessage, sendMessage);

// @route   POST /api/messages/service-request
// @desc    Send service request message
// @access  Private
router.post('/service-request', auth, validateServiceRequest, sendServiceRequest);

// @route   PUT /api/messages/mark-read/:messageId
// @desc    Mark message as read
// @access  Private
router.put('/mark-read/:messageId', auth, markAsRead);

module.exports = router;
