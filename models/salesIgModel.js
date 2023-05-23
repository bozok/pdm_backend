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
    kosgebFormFiled: {
      type: Boolean,
      required: true,
      default: false,
    },
    machineInfoFilled: {
      type: Boolean,
      required: true,
      default: false,
    },
    projectFileReady: {
      type: Boolean,
      required: true,
      default: false,
    },
    isProjectUploaded: {
      type: Boolean,
      required: true,
      default: false,
    },
    kosgebStatus: {
      type: String,
      default: null,
    },
    submittedDate: {
      type: Date,
      default: null,
    },
    submittedDocumentLink: {
      type: Date,
      default: null,
    },
    revisionDate: {
      type: Date,
      default: null,
    },
    revisionReason: {
      type: String,
      default: "",
    },
    denyCounter: {
      type: Number,
      default: 0,
    },
    denyDate: {
      type: Date,
      default: null,
    },
    denyReason: {
      type: String,
      default: "",
    },
    documents: [
      {
        bucket: String,
        key: String,
        url: String,
        createdAt: Date,
      },
    ],
  },
  { timestamps: true }
);

const SalesIG = mongoose.model("SalesIG", saleIgSchema);
module.exports = SalesIG;
