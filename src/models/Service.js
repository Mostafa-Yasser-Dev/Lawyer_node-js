const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Family Law', 'Business Law', 'Property Law', 'Criminal Law', 'Personal Injury', 'Other']
  },
  lawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Lawyer is required']
  },
  image: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  consultationFee: {
    type: Number,
    min: [0, 'Consultation fee cannot be negative']
  }
}, {
  timestamps: true
});

// Index for better query performance
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ lawyer: 1, isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);
