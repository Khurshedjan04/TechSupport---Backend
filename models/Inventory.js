const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'low-stock', 'out-of-stock', 'in-use'],
    default: 'available'
  },
  minimumStock: {
    type: Number,
    min: 0,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
});

// Update status based on quantity
inventorySchema.pre('save', function(next) {
  if (this.quantity === 0) {
    this.status = 'out-of-stock';
  } else if (this.quantity <= this.minimumStock) {
    this.status = 'low-stock';
  } else if (this.status === 'out-of-stock' || this.status === 'low-stock') {
    this.status = 'available';
  }
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);