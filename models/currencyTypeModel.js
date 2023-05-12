const mongoose = require("mongoose");

const currencyTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lütfen para birimi adı ekleyin"],
      trim: true,
    },
    shortCode: {
      type: String,
      required: [true, "Lütfen para birimi kısa kodu ekleyin"],
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, "Lütfen para birimi sembolü ekleyin"],
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const CurrencyType = mongoose.model("CurrencyType", currencyTypeSchema);
module.exports = CurrencyType;
