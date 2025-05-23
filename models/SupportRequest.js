const mongoose = require('mongoose');

const supportRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  userType: {
    type: String,
    enum: ['Business', 'Individual'],
    required: [true, 'User type is required']
  },
  issue: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true
  },
  device: {
    type: String,
    required: [true, 'Device information is required'],
    trim: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    required: [true, 'Urgency level is required']
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'resolved'],
    default: 'pending'
  },
  scheduledDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
supportRequestSchema.index({ userId: 1, createdAt: -1 });
supportRequestSchema.index({ status: 1 });

module.exports = mongoose.model('SupportRequest', supportRequestSchema);