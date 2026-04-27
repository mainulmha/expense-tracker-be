const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["expense", "income", "investment"],
      required: true,
    },
    icon: {
      type: String,
      default: "other",
    },
    color: {
      type: String,
      default: "#6B7280",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Category", categorySchema);
