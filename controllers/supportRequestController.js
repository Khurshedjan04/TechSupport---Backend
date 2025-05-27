const SupportRequest = require('../models/SupportRequest');

// Create support request
const createSupportRequest = async (req, res) => {
  try {
    const { issue, device, urgency, serviceLocation } = req.body;

    const supportRequest = new SupportRequest({
      userId: req.user._id,
      issue,
      device,
      urgency,
      serviceLocation,
      status:`pending`,
    });

    await supportRequest.save();
    await supportRequest.populate('userId', 'name email');

    res.status(201).json({
      message: 'Support request created successfully',
      supportRequest
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Server error while creating support request' });
  }
};

// Get support requests
const getSupportRequests = async (req, res) => {
  try {
    let query = {};
    
    // If user is not admin, only show their own requests
    if (req.user.role !== 'admin' || req.user.role !== 'super admin' || req.user.role !== 'technician') {
      query.userId = req.user._id;
    }

    const requests = await SupportRequest.find(query)
      .populate('userId', 'name email accType')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching support requests' });
  }
};

// Update support request (admin only)
const updateSupportRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const supportRequest = await SupportRequest.findById(id);
    if (!supportRequest) {
      return res.status(404).json({ message: 'Support request not found' });
    }

    // Update fields
    if (status) supportRequest.status = status;
     supportRequest.updatedAt = new Date();

    await supportRequest.save();
    await supportRequest.populate('userId', 'name email');

    res.json({
      message: 'Support request updated successfully',
      supportRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating support request', errorr });
  }
};

// Delete support request (admin only)
const deleteSupportRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const supportRequest = await SupportRequest.findById(id);
    if (!supportRequest) {
      return res.status(404).json({ message: 'Support request not found' });
    }

    await SupportRequest.findByIdAndDelete(id);

    res.json({ message: 'Support request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting support request' });
  }
};

module.exports = {
  createSupportRequest,
  getSupportRequests,
  updateSupportRequest,
  deleteSupportRequest
};