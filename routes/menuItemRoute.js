const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addMenuItem,
  getMenuItem,
  getMenuItems,
  updateMenuItem,
} = require("../controllers/menuItemController");

router.post("/new", protect, addMenuItem);
router.get("/list", protect, getMenuItems);
router.get("/:id", protect, getMenuItem);
router.patch("/:id", protect, updateMenuItem);

module.exports = router;
