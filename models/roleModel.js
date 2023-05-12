const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lütfen rol ekleyin"],
      trim: true,
    },
    // permissions: {
    //   theme: {
    //     type: String,
    //     default: "light",
    //   },
    //   language: {
    //     type: String,
    //     default: "tr",
    //   },
    // },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
