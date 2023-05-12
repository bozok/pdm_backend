const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getLogs } = require("../controllers/logController");

router.get("/list", protect, getLogs);

module.exports = router;
