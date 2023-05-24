const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  loginUser,
  logoutUser,
  loginStatus,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/checklogin", protect, loginStatus);
router.post("/changepassword", protect, changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router;
