const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
      required: true,
    },
    borrow_date: {
      type: Date,
      required: true,
    },
    return_date: {
      type: Date,
    },
    return_status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Borrow = mongoose.model("borrow", borrowSchema);
