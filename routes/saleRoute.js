const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addSale,
  getSale,
  getSaleIG,
  getSales,
  updateSale,
  newNoteSaleIG,
  updateSaleIG,
} = require("../controllers/saleController");

router.post("/new", protect, addSale);
router.get("/list", protect, getSales);
router.get("/:id", protect, getSale);
router.patch("/:id", protect, updateSale);

router.get("/IG/:id", protect, getSaleIG);
router.put("/IG/note/:id", protect, newNoteSaleIG);
router.patch("/IG/:id", protect, updateSaleIG);

module.exports = router;
