const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { validateServicePost } = require('../middleware/validation');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getCategories
} = require('../controllers/serviceController');

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management endpoints
 */

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', getServices);

// @route   GET /api/services/categories
// @desc    Get all service categories
// @access  Public
router.get('/categories', getCategories);

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', getService);

// @route   POST /api/services
// @desc    Create service
// @access  Private (Lawyer only)
router.post('/', auth, authorize('lawyer'), validateServicePost, createService);

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private (Lawyer only)
router.put('/:id', auth, authorize('lawyer'), updateService);

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Private (Lawyer only)
router.delete('/:id', auth, authorize('lawyer'), deleteService);

module.exports = router;
