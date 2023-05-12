const mongoose = require("mongoose");

const regionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lütfen bölge ekleyin"],
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

const Region = mongoose.model("Region", regionSchema);
module.exports = Region;
