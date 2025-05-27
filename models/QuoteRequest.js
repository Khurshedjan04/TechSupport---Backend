const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    trim: true
  },
  budget: {
    type: String,
    required: [true, 'Budget range is required']
  },
  timeline: {
    type: String,
    enum: ["Standard", "Express", "Urgent"],
    required: [true, 'Timeline is required']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'quoted', 'accepted', 'declined'],
    default: 'pending'
  },
  quotedAmount: {
    type: Number
  },
  adminNotes: {
    type: String,
    trim: true
  },
  assignedTechnic: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true
});

// Index for better query performance
quoteRequestSchema.index({ userId: 1, createdAt: -1 });
quoteRequestSchema.index({ status: 1 });

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);