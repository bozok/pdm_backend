const mongoose = require("mongoose");

const authorizationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    userName: {
      type: String,
      required: [true, "Lütfen kullanıcı adı ekleyin"],
      trim: true,
    },
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "MenuItem",
    },
    title: {
      type: String,
      required: [true, "Lütfen başlık ekleyin"],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, "Lütfen sıra ekleyin"],
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
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
    },
    canView: {
      type: Boolean,
      required: true,
      default: false,
    },
    canEdit: {
      type: Boolean,
      required: true,
      default: false,
    },
    canUploadFile: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Authorization = mongoose.model("Authorization", authorizationSchema);
module.exports = Authorization;
