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
} = require("../controllers/saleController");

router.post("/new", protect, addSale);
router.get("/list", protect, getSales);
router.get("/:id", protect, getSale);
router.patch("/:id", protect, updateSale);

router.get("/IG/:id", protect, getSaleIG);
router.put("/IG/note/:id", protect, newNoteSaleIG);

module.exports = router;
