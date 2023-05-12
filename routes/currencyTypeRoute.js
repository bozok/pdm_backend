const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addCurrencyType,
  getCurrencyType,
  getCurrencyTypes,
  updateCurrencyType,
  changeCurrencyTypeStatus,
} = require("../controllers/currencyTypeController");

router.post("/new", protect, addCurrencyType);
router.get("/list", protect, getCurrencyTypes);
router.get("/:id", protect, getCurrencyType);
router.patch("/:id", protect, updateCurrencyType);
router.put("/:id", protect, changeCurrencyTypeStatus);

module.exports = router;
