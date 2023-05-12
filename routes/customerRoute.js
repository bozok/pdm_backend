const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addCustomer,
  updateCustomer,
  getCustomer,
  getCustomers,
} = require("../controllers/customerController");

router.post("/new", protect, addCustomer);
router.get("/list", protect, getCustomers);
router.get("/:id", protect, getCustomer);
router.patch("/:id", protect, updateCustomer);

module.exports = router;
