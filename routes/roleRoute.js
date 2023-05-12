const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addRole,
  getRole,
  getRoles,
  updateRole,
} = require("../controllers/roleController");

router.post("/new", protect, addRole);
router.get("/list", protect, getRoles);
router.get("/:id", protect, getRole);
router.patch("/:id", protect, updateRole);

module.exports = router;
