const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getPermissions,
  addPermission,
  removePermission,
} = require("../controllers/permissionController");
const { getOfficesAdmin } = require("../controllers/officeController");

router.post("/permission/add", protect, addPermission);
router.post("/permission/remove", protect, removePermission);
router.get("/permission/list", protect, getPermissions);

router.get("/office/list", protect, getOfficesAdmin);

module.exports = router;
