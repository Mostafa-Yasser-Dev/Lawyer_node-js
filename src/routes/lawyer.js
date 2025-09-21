const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Lawyers
 *   description: Lawyer management endpoints
 */

/**
 * @swagger
 * /api/lawyers/dashboard:
 *   get:
 *     summary: Get lawyer dashboard data
 *     tags: [Lawyers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalServices:
 *                       type: integer
 *                     activeServices:
 *                       type: integer
 *                     totalRequests:
 *                       type: integer
 *                     pendingRequests:
 *                       type: integer
 *                     unreadMessages:
 *                       type: integer
 *       403:
 *         description: Access denied - Lawyer role required
 */
router.get('/dashboard', auth, authorize('lawyer'), async (req, res) => {
  try {
    const Service = require('../models/Service');
    const ServiceRequest = require('../models/ServiceRequest');
    const Message = require('../models/Message');

    const [
      totalServices,
      activeServices,
      totalRequests,
      pendingRequests,
      unreadMessages
    ] = await Promise.all([
      Service.countDocuments({ lawyer: req.user.id }),
      Service.countDocuments({ lawyer: req.user.id, isActive: true }),
      ServiceRequest.countDocuments({ lawyer: req.user.id }),
      ServiceRequest.countDocuments({ lawyer: req.user.id, status: 'pending' }),
      Message.countDocuments({ receiver: req.user.id, isRead: false })
    ]);

    res.json({
      success: true,
      data: {
        totalServices,
        activeServices,
        totalRequests,
        pendingRequests,
        unreadMessages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard data',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/lawyers/service-requests:
 *   get:
 *     summary: Get lawyer's service requests
 *     tags: [Lawyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected, in_progress, completed, cancelled]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Service requests retrieved successfully
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
 *       403:
 *         description: Access denied - Lawyer role required
 */
router.get('/service-requests', auth, authorize('lawyer'), async (req, res) => {
  try {
    const ServiceRequest = require('../models/ServiceRequest');
    const { status } = req.query;
    
    let query = { lawyer: req.user.id };
    if (status) {
      query.status = status;
    }

    const serviceRequests = await ServiceRequest.find(query)
      .populate('user', 'name email avatar')
      .populate('service', 'title description category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: serviceRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving service requests',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/lawyers/service-requests/{requestId}/status:
 *   put:
 *     summary: Update service request status
 *     tags: [Lawyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: Service request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected, in_progress, completed, cancelled]
 *               notes:
 *                 type: string
 *               estimatedCost:
 *                 type: number
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Service request status updated successfully
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
 *       404:
 *         description: Service request not found
 *       403:
 *         description: Access denied - Not the service owner
 */
router.put('/service-requests/:requestId/status', auth, authorize('lawyer'), async (req, res) => {
  try {
    const ServiceRequest = require('../models/ServiceRequest');
    const { requestId } = req.params;
    const { status, notes, estimatedCost, scheduledDate } = req.body;

    const serviceRequest = await ServiceRequest.findById(requestId);

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    if (serviceRequest.lawyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Not the service owner'
      });
    }

    const updateData = { status };
    if (notes) updateData.notes = notes;
    if (estimatedCost) updateData.estimatedCost = estimatedCost;
    if (scheduledDate) updateData.scheduledDate = scheduledDate;

    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      requestId,
      updateData,
      { new: true }
    ).populate('user', 'name email avatar')
     .populate('service', 'title description category');

    res.json({
      success: true,
      message: 'Service request status updated successfully',
      data: updatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service request status',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/lawyers/clients:
 *   get:
 *     summary: Get lawyer's clients
 *     tags: [Lawyers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clients retrieved successfully
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
 *       403:
 *         description: Access denied - Lawyer role required
 */
router.get('/clients', auth, authorize('lawyer'), async (req, res) => {
  try {
    const ServiceRequest = require('../models/ServiceRequest');
    const User = require('../models/User');

    // Get unique clients who have made service requests
    const clients = await ServiceRequest.aggregate([
      { $match: { lawyer: req.user._id } },
      {
        $group: {
          _id: '$user',
          totalRequests: { $sum: 1 },
          lastRequest: { $max: '$createdAt' }
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
      { $unwind: '$user' },
      {
        $project: {
          _id: '$user._id',
          name: '$user.name',
          email: '$user.email',
          avatar: '$user.avatar',
          totalRequests: 1,
          lastRequest: 1
        }
      },
      { $sort: { lastRequest: -1 } }
    ]);

    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving clients',
      error: error.message
    });
  }
});

module.exports = router;
