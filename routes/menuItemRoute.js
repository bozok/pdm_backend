const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addMenuItem,
  getMenuItem,
  getMenuItemsByRole,
  getMenuItems,
  updateMenuItem,
} = require("../controllers/menuItemController");

router.post("/new", addMenuItem);
router.get("/list", protect, getMenuItems);
router.get("/listbyrole", protect, getMenuItemsByRole);
router.get("/:id", protect, getMenuItem);
router.patch("/:id", protect, updateMenuItem);

module.exports = router;
