const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  loginUser,
  logoutUser,
  loginStatus,
  changePassword,
} = require("../controllers/userController");

router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/checklogin", protect, loginStatus);
router.post("/changepassword", protect, changePassword);

module.exports = router;
