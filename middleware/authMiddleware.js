const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Yetkisiz işlem!" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Yetkisiz işlem!" });
  }
};

module.exports = protect;
