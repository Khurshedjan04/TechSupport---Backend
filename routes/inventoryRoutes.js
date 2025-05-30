const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  authorizeAdmin,
  authorizeAdminOrTechnician,
} = require("../middleware/auth");
const {
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  decrementInventoryItem,
  getLowStockItems,
  getInventoryItems,
} = require("../controllers/Inventory");

// Admin & Technician routes (read access)
router.get(
  "/",
  authenticateToken,
  authorizeAdminOrTechnician,
  getInventoryItems
);
router.get(
  "/low-stock",
  authenticateToken,
  authorizeAdminOrTechnician,
  getLowStockItems
);
router.patch(
  "/:id/decrement",
  authenticateToken,
  authorizeAdminOrTechnician,
  decrementInventoryItem
);

// Admin only routes
router.post("/", authenticateToken, authorizeAdmin, createInventoryItem);
router.put("/:id", authenticateToken, authorizeAdmin, updateInventoryItem);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteInventoryItem);
module.exports = router;
