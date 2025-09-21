const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  lawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Lawyer is required']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required']
  },
  caseDetails: {
    type: String,
    required: [true, 'Case details are required'],
    trim: true,
    maxlength: [1000, 'Case details cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  estimatedCost: {
    type: Number,
    min: [0, 'Estimated cost cannot be negative']
  },
  actualCost: {
    type: Number,
    min: [0, 'Actual cost cannot be negative']
  },
  scheduledDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
serviceRequestSchema.index({ user: 1, status: 1 });
serviceRequestSchema.index({ lawyer: 1, status: 1 });
serviceRequestSchema.index({ service: 1 });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
