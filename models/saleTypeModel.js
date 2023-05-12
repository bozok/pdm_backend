const mongoose = require("mongoose");

const saleTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lütfen satış türü adı ekleyin"],
      trim: true,
    },
    prefix: {
      type: String,
      required: [true, "Lütfen satış türü öneki ekleyin"],
      trim: true,
    },
    counter: {
      type: Number,
      required: [true, "Lütfen satış türü sayacı ekleyin"],
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const SaleType = mongoose.model("SaleType", saleTypeSchema);
module.exports = SaleType;
