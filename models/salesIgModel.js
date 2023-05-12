const mongoose = require("mongoose");

const saleIgSchema = mongoose.Schema(
  {
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Sale",
    },
    isEducationTaken: {
      type: Boolean,
      required: true,
      default: false,
    },
    educationTakenDate: {
      type: Date,
      default: null,
    },
    isWorkplaceOpen: {
      type: Boolean,
      required: true,
      default: false,
    },
    workplaceOpenDate: {
      type: Date,
      default: null,
    },
    isPartnered: {
      type: Boolean,
      required: true,
      default: false,
    },
    hasTraderRecord: {
      type: Boolean,
      required: true,
      default: false,
    },
    hasPttRecord: {
      type: Boolean,
      required: true,
      default: false,
    },
    declarationSent: {
      type: Boolean,
      required: true,
      default: false,
    },
    declarationApproved: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const SalesIG = mongoose.model("SalesIG", saleIgSchema);
module.exports = SalesIG;
