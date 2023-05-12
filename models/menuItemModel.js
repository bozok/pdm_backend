const mongoose = require("mongoose");

const menuItemSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lütfen başlık ekleyin"],
      trim: true,
    },
    path: {
      type: String,
      required: [true, "Lütfen yol ekleyin"],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, "Lütfen icon ekleyin"],
    },
    menuOrder: {
      type: Number,
      required: [true, "Lütfen sıra no ekleyin"],
    },
    children: [
      {
        title: {
          type: String,
        },
        path: {
          type: String,
        },
      },
    ],
    canView: [
      {
        type: String,
      },
    ],
    canRead: [
      {
        type: String,
      },
    ],
    canWrite: [
      {
        type: String,
      },
    ],
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
module.exports = MenuItem;
