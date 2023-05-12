const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addRegion,
  getRegion,
  getRegions,
  updateRegion,
} = require("../controllers/regionController");

router.post("/new", protect, addRegion);
router.get("/list", protect, getRegions);
router.get("/:id", protect, getRegion);
router.patch("/:id", protect, updateRegion);

module.exports = router;
