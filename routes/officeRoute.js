const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  newOffice,
  getOffice,
  getOffices,
  getOfficesByRegion,
  updateOffice,
  changeOfficeStatus,
} = require("../controllers/officeController");

router.post("/new", protect, newOffice);
router.get("/list", protect, getOffices);
router.get("/:id", protect, getOffice);
router.get("/list/:id", protect, getOfficesByRegion);
router.patch("/:id", protect, updateOffice);
router.put("/:id", protect, changeOfficeStatus);

module.exports = router;
