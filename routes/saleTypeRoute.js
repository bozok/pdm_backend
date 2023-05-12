const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addSaleType,
  getSaleType,
  getSaleTypes,
  updateSaleType,
  changeSaleTypeStatus,
} = require("../controllers/saleTypeController");

router.post("/new", protect, addSaleType);
router.get("/list", protect, getSaleTypes);
router.get("/:id", protect, getSaleType);
router.patch("/:id", protect, updateSaleType);
router.put("/:id", protect, changeSaleTypeStatus);

module.exports = router;
