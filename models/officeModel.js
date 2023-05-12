const mongoose = require("mongoose");

const officeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lütfen ofis ekleyin"],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    regionName: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Office = mongoose.model("Office", officeSchema);
module.exports = Office;
