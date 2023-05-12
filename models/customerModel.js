const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const customerSchema = mongoose.Schema(
  {
    identityNo: {
      type: String,
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
    mobileNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Lütfen geçerli bir e-psota adresi ekleyin",
      ],
    },
    password: {
      type: String,
      required: [true, "Lütfen şifre ekleyin"],
      minLength: [8, "Şifreniz en az 8 karakterden oluşmalı"],
    },
    taxIdNo: {
      type: String,
      trim: true,
      unique: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    financialAdvisor: {
      type: String,
      trim: true,
    },
    supplierMachinist: {
      type: String,
      trim: true,
    },
    registrantName: {
      type: String,
      trim: true,
      required: [true, "Please select registrant"],
    },
    registrantRegion: {
      type: String,
      trim: true,
      required: [true, "Please select region"],
    },
    registrantOffice: {
      type: String,
      trim: true,
      required: [true, "Please select office"],
    },
    comment: {
      type: String,
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
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

// Encrypt password before saving to MongoDB
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
