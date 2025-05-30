const QuoteRequest = require("../models/QuoteRequest");

// Create quote request
const createQuoteRequest = async (req, res) => {
  try {
    const { serviceType, budget, timeline } = req.body;

    const quoteRequest = new QuoteRequest({
      userId: req.user._id,
      serviceType,
      budget,
      timeline,
      status: "pending",
      assignedTechnic: "",
      usedItem: "",
    });

    await quoteRequest.save();
    await quoteRequest.populate("userId", "name email");

    res.status(201).json({
      message: "Quote request created successfully",
      quoteRequest,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res
      .status(500)
      .json({ message: "Server error while creating quote request" });
  }
};

// Get quote requests
const getQuoteRequests = async (req, res) => {
  try {
    let query = {};

    // If user is not admin, only show their own requests
    if (
      req.user.role !== "admin" &&
      req.user.role !== "super admin" &&
      req.user.role !== "technician"
    ) {
      query.userId = req.user._id;
    }

    const requests = await QuoteRequest.find(query)
      .populate("userId", "name email accType number")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while fetching quote requests" });
  }
};

// Update quote request (admin only)
const updateQuoteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTechnic } = req.body;

    const quoteRequest = await QuoteRequest.findById(id);
    if (!quoteRequest) {
      return res.status(404).json({ message: "Quote request not found" });
    }

    // Update fields
    if (status) quoteRequest.status = status;
    if (assignedTechnic) quoteRequest.assignedTechnic = assignedTechnic;

    await quoteRequest.save();
    await quoteRequest.populate("userId", "name email accType number");

    res.json({
      message: "Quote request updated successfully",
      quoteRequest,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Server error while updating quote request" });
  }
};

// Update quote request (technician only)
const updateQuoteRequestByTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { usedItem, status } = req.body;

    const quoteRequest = await QuoteRequest.findById(id);
    if (!quoteRequest) {
      return res.status(404).json({ message: "Quote request not found" });
    }
    
    // Update only allowed fields
    if (usedItem) quoteRequest.usedItem = usedItem;
    if (status) quoteRequest.status = status;

    await quoteRequest.save();
    await quoteRequest.populate("userId", "name email accType number");

    res.json({
      message: "Quote request updated by technician",
      quoteRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error while updating quote request" });
  }
};


// Delete quote request (admin only)
const deleteQuoteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const quoteRequest = await QuoteRequest.findById(id);
    if (!quoteRequest) {
      return res.status(404).json({ message: "Quote request not found" });
    }

    await QuoteRequest.findByIdAndDelete(id);

    res.json({ message: "Quote request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while deleting quote request" });
  }
};

module.exports = {
  createQuoteRequest,
  getQuoteRequests,
  updateQuoteRequest,
  updateQuoteRequestByTechnician,
  deleteQuoteRequest,
};
