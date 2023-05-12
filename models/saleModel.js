const mongoose = require("mongoose");

const saleSchema = mongoose.Schema(
  {
    saleTypeName: {
      type: String,
      required: [true, "Lütfen satış türü adı ekleyin"],
      trim: true,
    },
    saleTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SaleType",
    },
    projectCode: {
      type: String,
      required: true,
      trim: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
    },
    notes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        userName: String,
        note: String,
        createdAt: Date,
      },
    ],
    assignedId: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "User",
    },
    registrantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", saleSchema);
module.exports = Sale;
