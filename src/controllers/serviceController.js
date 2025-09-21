const Service = require('../models/Service');
const ServiceRequest = require('../models/ServiceRequest');

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *         - lawyer
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the service
 *         title:
 *           type: string
 *           description: The service title
 *         description:
 *           type: string
 *           description: The service description
 *         category:
 *           type: string
 *           enum: [Family Law, Business Law, Property Law, Criminal Law, Personal Injury, Other]
 *           description: The service category
 *         lawyer:
 *           type: string
 *           description: The lawyer's ID
 *         image:
 *           type: string
 *           description: The service image URL
 *         isActive:
 *           type: boolean
 *           description: Whether the service is active
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Service tags
 *         price:
 *           type: number
 *           description: Service price
 *         consultationFee:
 *           type: number
 *           description: Consultation fee
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all active services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Family Law, Business Law, Property Law, Criminal Law, Personal Injury, Other]
 *         description: Filter by category
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
 *           default: 10
 *         description: Number of services per page
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 */
const getServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let query = { isActive: true };
    
    if (req.query.category) {
      query.category = req.query.category;
    }

    const services = await Service.find(query)
      .populate('lawyer', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      count: services.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving services',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 */
const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('lawyer', 'name email avatar phone');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving service',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service (Lawyer only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Family Law Consultation
 *               description:
 *                 type: string
 *                 example: Expert consultation for family law matters
 *               category:
 *                 type: string
 *                 enum: [Family Law, Business Law, Property Law, Criminal Law, Personal Injury, Other]
 *                 example: Family Law
 *               image:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [divorce, custody, alimony]
 *               price:
 *                 type: number
 *                 example: 150
 *               consultationFee:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Service created successfully
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
 *                   $ref: '#/components/schemas/Service'
 *       403:
 *         description: Access denied - Lawyer role required
 *       400:
 *         description: Validation error
 */
const createService = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      lawyer: req.user.id
    };

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update service (Lawyer only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Family Law, Business Law, Property Law, Criminal Law, Personal Injury, Other]
 *               image:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *               consultationFee:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Service updated successfully
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
 *                   $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 *       403:
 *         description: Access denied - Not the service owner
 */
const updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user is the service owner
    if (service.lawyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Not the service owner'
      });
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete service (Lawyer only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
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
 *         description: Service not found
 *       403:
 *         description: Access denied - Not the service owner
 */
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user is the service owner
    if (service.lawyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Not the service owner'
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/services/categories:
 *   get:
 *     summary: Get all service categories
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
 *                     type: string
 */
const getCategories = async (req, res) => {
  try {
    const categories = [
      'Family Law',
      'Business Law', 
      'Property Law',
      'Criminal Law',
      'Personal Injury',
      'Other'
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving categories',
      error: error.message
    });
  }
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getCategories
};
