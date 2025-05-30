const Inventory = require("../models/Inventory");

// Create inventory item (Admin only)
const createInventoryItem = async (req, res) => {
  try {
    const { name, category, quantity, minimumStock, price } = req.body;

    const inventoryItem = new Inventory({
      name,
      category,
      quantity,
      minimumStock,
      price,
    });

    await inventoryItem.save();

    res.status(201).json({
      message: "Inventory item created successfully",
      inventoryItem,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all inventory items (Admin & Technician)
const getInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find().sort({ name: 1 });
    res.json(inventoryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error fetching inventory items:", error);
    
  }
};

// Update inventory item (Admin only)
const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, minimumStock, price } = req.body;

    const inventoryItem = await Inventory.findByIdAndUpdate(
      id,
      { quantity, minimumStock, price },
      { new: true, runValidators: true }
    );

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({
      message: "Inventory item updated successfully",
      inventoryItem,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete inventory item (Admin only)
const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const inventoryItem = await Inventory.findByIdAndDelete(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Technician can update inventory item quantity
// Decrement inventory item quantity by 1 (Admin & Technician)
const decrementInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const inventoryItem = await Inventory.findById(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    if (inventoryItem.quantity <= 0) {
      return res.status(400).json({ message: "Item is out of stock" });
    }

    inventoryItem.quantity -= 1;
    await inventoryItem.save();

    res.json({
      message: "Inventory item quantity decremented by 1",
      inventoryItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get low stock items (Admin & Technician)
const getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $or: [
        { status: "low-stock" },
        { status: "out-of-stock" },
        { $expr: { $lte: ["$quantity", "$minimumStock"] } },
      ],
    }).sort({ quantity: 1 });

    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInventoryItem,
  getInventoryItems,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
  decrementInventoryItem
};
