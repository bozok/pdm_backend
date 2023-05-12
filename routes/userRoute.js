const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  newUser,
  updateUser,
  changeUserStatus,
  getUser,
  getUsers,
  getUsersByRole,
  getUsersByOffice,
} = require("../controllers/userController");

router.post("/new", protect, newUser);
router.get("/list/office/:id", protect, getUsersByOffice);
router.get("/list/role/:id", protect, getUsersByRole);
router.get("/list", protect, getUsers);
router.get("/:id", protect, getUser);
router.patch("/:id", protect, updateUser);
router.put("/:id", protect, changeUserStatus);

module.exports = router;
