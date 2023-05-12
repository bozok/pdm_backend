const mongoose = require("mongoose");

const logSchema = mongoose.Schema(
  {
    actionType: {
      type: String,
      required: [true, "Lütfen log tipi ekleyin"],
      trim: true,
    },
    actionResult: {
      type: String,
      required: [true, "Lütfen log sonucu ekleyin"],
      trim: true,
    },
    actionText: {
      type: String,
      required: [true, "Lütfen log metni ekleyin"],
      trim: true,
    },
    doneBy: {
      type: String,
      required: [true, "Lütfen eylemi yapanı girin"],
      trim: true,
    },
    doneByRegion: {
      type: String,
      required: [true, "Lütfen eylemi yapan bölgeyi girin"],
      trim: true,
    },
    doneByOffice: {
      type: String,
      required: [true, "Lütfen eylemi yapan ofisi girin"],
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

const Log = mongoose.model("Log", logSchema);
module.exports = Log;
