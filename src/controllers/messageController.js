const Message = require('../models/Message');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - sender
 *         - receiver
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the message
 *         sender:
 *           type: string
 *           description: The sender's user ID
 *         receiver:
 *           type: string
 *           description: The receiver's user ID
 *         content:
 *           type: string
 *           description: The message content
 *         messageType:
 *           type: string
 *           enum: [text, service_request, consultation_request]
 *           description: The type of message
 *         isRead:
 *           type: boolean
 *           description: Whether the message has been read
 *         readAt:
 *           type: string
 *           format: date-time
 *           description: When the message was read
 *         serviceRequest:
 *           type: object
 *           description: Service request details (if applicable)
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get user's conversations
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of messages per page
 *     responses:
 *       200:
 *         description: Conversations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user:
 *                         $ref: '#/components/schemas/User'
 *                       lastMessage:
 *                         $ref: '#/components/schemas/Message'
 *                       unreadCount:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 */
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all unique users who have sent or received messages from this user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        }
      },
      {
        $addFields: {
          otherUser: {
            $cond: {
              if: { $eq: ['$sender', userId] },
              then: '$receiver',
              else: '$sender'
            }
          }
        }
      },
      {
        $group: {
          _id: '$otherUser',
          lastMessage: { $last: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$isRead', false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving conversations',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/messages/{userId}:
 *   get:
 *     summary: Get messages with a specific user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The other user's ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of messages per page
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 */
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        receiver: currentUserId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
      success: true,
      data: messages.reverse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving messages',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - content
 *             properties:
 *               receiverId:
 *                 type: string
 *                 example: 64a1b2c3d4e5f6789abcdef0
 *               content:
 *                 type: string
 *                 example: Hello, I need legal advice
 *               messageType:
 *                 type: string
 *                 enum: [text, service_request, consultation_request]
 *                 default: text
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, messageType = 'text' } = req.body;
    const senderId = req.user.id;

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      messageType
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/messages/service-request:
 *   post:
 *     summary: Send a service request message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceId
 *               - caseDetails
 *             properties:
 *               serviceId:
 *                 type: string
 *                 example: 64a1b2c3d4e5f6789abcdef0
 *               caseDetails:
 *                 type: string
 *                 example: I need help with my divorce case
 *     responses:
 *       201:
 *         description: Service request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       $ref: '#/components/schemas/Message'
 *                     serviceRequest:
 *                       type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
const sendServiceRequest = async (req, res) => {
  try {
    const { serviceId, caseDetails } = req.body;
    const userId = req.user.id;

    // Get service to find the lawyer
    const Service = require('../models/Service');
    const service = await Service.findById(serviceId).populate('lawyer');
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const lawyerId = service.lawyer._id;

    // Create service request
    const serviceRequest = await ServiceRequest.create({
      user: userId,
      lawyer: lawyerId,
      service: serviceId,
      caseDetails,
      status: 'pending'
    });

    // Create message with service request
    const message = await Message.create({
      sender: userId,
      receiver: lawyerId,
      content: `Service Request: ${service.title}\n\nCase Details: ${caseDetails}`,
      messageType: 'service_request',
      serviceRequest: {
        serviceId,
        caseDetails,
        status: 'pending'
      }
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Service request sent successfully',
      data: {
        message: populatedMessage,
        serviceRequest
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending service request',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/messages/mark-read/{messageId}:
 *   put:
 *     summary: Mark a message as read
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Message not found
 *       401:
 *         description: Unauthorized
 */
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      _id: messageId,
      receiver: userId
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking message as read',
      error: error.message
    });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  sendServiceRequest,
  markAsRead
};
