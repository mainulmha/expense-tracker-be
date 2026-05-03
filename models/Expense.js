// models/Expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      // required: [true, "Description is required"],
      required: false,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["income", "expense", "investment"],
      lowercase: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    // ✅ ইউজার আইডি যোগ করুন
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // এখন required true দিন
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
expenseSchema.index({ date: -1 });
expenseSchema.index({ type: 1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ userId: 1 }); // 👈 userId এর জন্য index

module.exports = mongoose.model("Expense", expenseSchema);
