const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const path = require("path");
const multer = require("multer");
const multers3 = require("multer-s3");
const s3 = require("../utils/s3");

const {
  addSale,
  getSale,
  getSaleIG,
  getSales,
  updateSale,
  newNoteSaleIG,
  updateSaleIG,
  uploadFileSaleIG,
  deleteFileSaleIG,
  getFileSaleIG,
  changeAssigneeSale,
} = require("../controllers/saleController");

router.post("/new", protect, addSale);
router.get("/list", protect, getSales);
router.get("/:id", protect, getSale);
router.patch("/:id", protect, updateSale);

router.get("/IG/:id", protect, getSaleIG);
router.put("/IG/note/:id", protect, newNoteSaleIG);
router.patch("/IG/:id", protect, updateSaleIG);

const upload = multer({
  storage: multers3({
    s3: s3,
    bucket: process.env.AWS_BUCKET,
    ACL: "public-read",
    contentType: multers3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
      cb(null, `${fileName}${path.extname(file.originalname)}`);
      //cb(null, file.originalname);
    },
  }),
});

router.post("/IG/:id", protect, upload.array("document", 5), uploadFileSaleIG);
// router.post("/IG/:id", upload.array("document", 5), (req, res) => {
//   console.log(req.files);
//   return res.status(200).json({
//     message: "File uploaded",
//   });
// });
router.post("/IG/documentDelete/:id", protect, deleteFileSaleIG);
router.post("/IG/documentGet/:id", protect, getFileSaleIG);
router.post("/IG/assigneeChange/:id", protect, changeAssigneeSale);

module.exports = router;
