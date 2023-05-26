const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    identityNo: {
      type: String,
      required: [true, "Lütfen kimlik numarası ekleyin"],
      trim: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "Lütfen isim ekleyin"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Lütfen soyisim ekleyin"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Lütfen e-posta adresi ekleyin"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Lütfen geçerli bir e-posta adresi ekleyin",
      ],
    },
    password: {
      type: String,
      required: [true, "Lütfen şifre ekleyin"],
      minLength: [8, "Şifreniz en az 8 karakterden oluşmalı"],
    },
    photo: {
      type: String,
      required: [false, "Please add a photo"],
      default:
        "https://res.cloudinary.com/fatihindesign/image/upload/v1684851137/pdm/profile/defaulProfileImage_hf63zq.png",
    },
    office: {
      type: String,
      trim: true,
      required: [true, "Please select office"],
    },
    region: {
      type: String,
      trim: true,
      required: [true, "Please select region"],
    },
    role: {
      type: String,
      required: [true, "Please select role"], // sysgod - admin - şube yetkilisi - personel - muhasebeci - makineci - aracı firma
      default: "Personel",
    },
    mobileNumber: {
      type: String,
      required: [true, "Lütfen mobil numarası ekleyin"],
      trim: true,
    },
    settings: {
      theme: {
        type: String,
        default: "light",
      },
      language: {
        type: String,
        default: "tr",
      },
    },
    lastLogin: {
      type: Date,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

// Encrypt password before saving to MongoDB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
